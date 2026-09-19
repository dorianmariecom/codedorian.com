# frozen_string_literal: true

require "test_helper"

class MailboxOauthTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @previous_google_credentials = Config.google_delivery
    @previous_microsoft_credentials = Config.microsoft_delivery
    Config.google_delivery = {
      client_id: "test-client",
      client_secret: "test-client"
    }.to_deep_struct
    Config.microsoft_delivery = {
      client_id: "test-client",
      client_secret: "test-client"
    }.to_deep_struct
  end

  teardown do
    Config.google_delivery = @previous_google_credentials
    Config.microsoft_delivery = @previous_microsoft_credentials
    Current.reset
  end

  test "refresh preserves an omitted refresh token and accepts rotation" do
    refresh_tokens = [nil, "rotated"]
    %w[gmail google_workspace outlook].each do |provider|
      connection =
        DeliveryConnection.create!(
          provider: provider,
          name: "Mailbox",
          smtp_from: "sender@example.com",
          access_token: "old",
          refresh_token: "original",
          token_expires_at: 1.minute.ago
        )
      endpoint =
        (
          if provider == "outlook"
            "https://login.microsoftonline.com/common/oauth2/v2.0/token"
          else
            "https://oauth2.googleapis.com/token"
          end
        )
      refresh_tokens.each do |refresh|
        connection.update!(token_expires_at: 1.minute.ago)
        stub_request(:post, endpoint)
          .with do |request|
            data = URI.decode_www_form(request.body).to_h
            assert_equal "refresh_token", data["grant_type"]
            assert_equal "original", data["refresh_token"]
            true
          end
          .to_return(
            body: {
              access_token: "new",
              refresh_token: refresh,
              token_type: "bearer",
              expires_in: 3600
            }.compact.to_json
          )
        assert_equal "new",
                     MailboxOauth.new(provider).access_token_for(connection)
        assert_equal refresh || "original", connection.reload.refresh_token
        assert connection.token_expires_at.future?
      end
    end
  end

  test "revoked tokens require reconnection without clearing existing credentials" do
    connection =
      DeliveryConnection.create!(
        provider: "gmail",
        name: "Mailbox",
        smtp_from: "sender@example.com",
        access_token: "old",
        refresh_token: "refresh",
        token_expires_at: 1.minute.ago
      )
    stub_request(:post, "https://oauth2.googleapis.com/token").to_return(
      status: 400,
      body: { error: "invalid_grant" }.to_json
    )
    error =
      assert_raises(MailboxOauth::Error) do
        MailboxOauth.new("gmail").access_token_for(connection)
      end
    assert_equal "mailbox_reconnect_required", error.code
    assert_not error.retryable
    assert_equal "old", connection.reload.access_token
  end

  test "temporary token failures are retryable and disabled connections never refresh" do
    connection =
      DeliveryConnection.create!(
        provider: "gmail",
        name: "Mailbox",
        smtp_from: "sender@example.com",
        access_token: "old",
        refresh_token: "refresh",
        token_expires_at: 1.minute.ago
      )
    stub_request(:post, "https://oauth2.googleapis.com/token").to_return(
      status: 503
    )
    error =
      assert_raises(MailboxOauth::Error) do
        MailboxOauth.new("gmail").access_token_for(connection)
      end
    assert error.retryable
    connection.update!(enabled: false)
    assert_raises(MailboxOauth::Error) do
      MailboxOauth.new("gmail").access_token_for(connection)
    end
    assert_requested :post, "https://oauth2.googleapis.com/token", times: 1
  end

  test "tokens missing send permission are not persisted" do
    connection =
      DeliveryConnection.create!(
        provider: "outlook",
        name: "Mailbox",
        smtp_from: "sender@example.com",
        access_token: "old",
        refresh_token: "refresh",
        token_expires_at: 1.minute.ago
      )
    stub_request(
      :post,
      "https://login.microsoftonline.com/common/oauth2/v2.0/token"
    ).to_return(
      body: {
        access_token: "new",
        expires_in: 3600,
        token_type: "Bearer",
        scope: "User.Read"
      }.to_json
    )
    error =
      assert_raises(MailboxOauth::Error) do
        MailboxOauth.new("outlook").access_token_for(connection)
      end
    assert_equal "mailbox_send_permission_missing", error.code
    assert_equal "old", connection.reload.access_token
  end
end
