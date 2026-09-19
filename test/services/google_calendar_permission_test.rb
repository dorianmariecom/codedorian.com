# frozen_string_literal: true

require "test_helper"

class GoogleCalendarPermissionTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @previous_credentials = Config.google_delivery
    Config.google_delivery = { client_id: "test-client", client_secret: "test-secret" }.to_deep_struct
    @connection = DeliveryConnection.create!(user: users(:other_user), provider: "google", name: "Google", access_token: "old", refresh_token: "refresh", token_expires_at: 1.minute.ago, scope: MailboxOauth::GOOGLE_CALENDAR_SCOPES.join(" "))
  end

  teardown do
    Config.google_delivery = @previous_credentials
    Current.reset
  end

  test "personal calendar token refresh preserves omitted scope and detects removed access" do
    [nil, "openid email"].each do |scope|
      @connection.update!(token_expires_at: 1.minute.ago)
      stub_request(:post, "https://oauth2.googleapis.com/token")
        .to_return(body: { access_token: "new", token_type: "bearer", expires_in: 3600, scope: scope }.compact.to_json)
      if scope.nil?
        assert_equal "new", MailboxOauth.new("google").access_token_for(@connection)
      else
        error = assert_raises(MailboxOauth::Error) { MailboxOauth.new("google").access_token_for(@connection) }
        assert_equal "calendar_permission_missing", error.code
      end
      assert_equal scope.nil?, @connection.reload.calendar_access?
      assert_equal "refresh", @connection.refresh_token
    end
  end

  test "refresh does not enable calendar access that the user did not select" do
    @connection.update!(scope: "")
    stub_request(:post, "https://oauth2.googleapis.com/token")
      .to_return(body: { access_token: "new", token_type: "bearer", expires_in: 3600, scope: MailboxOauth::GOOGLE_CALENDAR_SCOPES.join(" ") }.to_json)
    assert_raises(MailboxOauth::Error) { MailboxOauth.new("google").access_token_for(@connection) }
    assert_not @connection.reload.calendar_access?
    assert_not_requested :post, "https://oauth2.googleapis.com/token"
  end

  test "calendar access cannot make a personal Google connection an email sender" do
    assert @connection.ready?
    assert_not DeliveryChannel.supports_provider?("email", "google")
    assert_raises(MailboxOauth::Error) { MailboxOauth.new("gmail").access_token_for(@connection) }
    assert_not_requested :post, "https://oauth2.googleapis.com/token"
  end
end
