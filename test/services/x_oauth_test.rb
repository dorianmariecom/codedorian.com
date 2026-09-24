# frozen_string_literal: true

require "test_helper"

class XOauthTest < ActiveSupport::TestCase
  setup do
    @previous_x_credentials = Config.x
    Config.x = { client_id: "client", client_secret: "secret" }.to_deep_struct
    Current.user = users(:admin)
  end

  teardown do
    Config.x = @previous_x_credentials
    Current.reset
  end

  test "expired tokens are refreshed once and stored encrypted" do
    connection =
      DeliveryConnection.create!(
        provider: "x",
        username: "X",
        enabled: true,
        access_token: "old",
        refresh_token: "refresh-old",
        token_expires_at: 1.minute.ago
      )
    refresh =
      stub_request(:post, "https://api.x.com/2/oauth2/token").with(
        basic_auth: %w[client secret],
        body: {
          client_id: "client",
          grant_type: "refresh_token",
          refresh_token: "refresh-old"
        }
      ).to_return(
        body: {
          access_token: "new",
          refresh_token: "refresh-new",
          token_type: "bearer",
          expires_in: 7200,
          scope: XOauth::SCOPES.join(" ")
        }.to_json
      )
    2.times { assert_equal "new", XOauth.access_token_for(connection) }
    assert_requested refresh, times: 1
    assert_equal "refresh-new", connection.reload.refresh_token
    assert_not_includes connection.refresh_token_before_type_cast, "refresh-new"
  end

  test "disabled connections never refresh and refresh rejection preserves credentials" do
    connection =
      DeliveryConnection.create!(
        provider: "x",
        username: "X",
        enabled: false,
        access_token: "old",
        refresh_token: "refresh-old",
        token_expires_at: 1.minute.ago
      )
    assert_raises(XOauth::Error) { XOauth.access_token_for(connection) }
    assert_not_requested :post, "https://api.x.com/2/oauth2/token"
    connection.update!(enabled: true)
    stub_request(:post, "https://api.x.com/2/oauth2/token").to_return(
      status: 400,
      body: "invalid_grant"
    )
    assert_raises(XOauth::Error) { XOauth.access_token_for(connection) }
    assert_equal "old", connection.reload.access_token
  end

  test "recipient syntax and username lookup" do
    assert XRecipient.valid?("@dorian", public: false)
    assert XRecipient.valid?("#ruby", public: true)
    assert XRecipient.valid?("", public: true)
    assert_not XRecipient.valid?("dorian", public: false)
    assert_not XRecipient.valid?("#ruby", public: false)
    connection = DeliveryConnection.new(id: 1, access_token: "token")
    stub_request(:get, "https://api.x.com/2/users/by/username/dorian").with(
      headers: {
        "Authorization" => "Bearer token"
      }
    ).to_return(body: { data: { id: "123" } }.to_json)
    assert_equal "123", XRecipient.resolve(connection, "@dorian")
  end
end
