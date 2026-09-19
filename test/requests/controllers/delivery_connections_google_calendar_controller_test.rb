# frozen_string_literal: true

require "test_helper"

class DeliveryConnectionsGoogleCalendarControllerTest < ActionDispatch::IntegrationTest
  setup do
    @previous_credentials = Config.google_delivery
    Config.google_delivery = { client_id: "test-client", client_secret: "test-secret" }.to_deep_struct
    sign_in(email_addresses(:other_email).email_address, passwords(:other_password).hint)
    stub_request(:get, "https://openidconnect.googleapis.com/v1/userinfo")
      .to_return(body: { sub: "google-account", email: "person@example.com", email_verified: true }.to_json)
  end

  teardown do
    Config.google_delivery = @previous_credentials
  end

  test "regular users choose calendar access with an unchecked bilingual checkbox" do
    get delivery_connections_path
    assert_response :success
    assert_select 'input#google_calendar_access[type=checkbox][name=scope]'
    assert_select 'input#google_calendar_access[checked]', count: 0
    assert_select 'label[for=google_calendar_access]', text: I18n.t("delivery_connections.index.calendar_access")
    assert_select 'input#gmail_calendar_access', count: 0

    query = start_connection(scope: MailboxOauth::GOOGLE_CALENDAR_SCOPES.join(" "))
    assert_equal %w[openid email] + MailboxOauth::GOOGLE_CALENDAR_SCOPES, query.fetch("scope").split
    assert_not_includes query.fetch("scope"), "gmail.send"
    stub_token(scope: query.fetch("scope"), challenge: query.fetch("code_challenge"))
    assert_difference "DeliveryConnection.count", 1 do
      get callback_delivery_connections_path(provider: "google", locale: nil), params: { state: query.fetch("state"), code: "code" }
      assert_redirected_to delivery_connections_path
    end
    connection = DeliveryConnection.where_user(users(:other_user)).where_provider("google").sole
    assert_equal query.fetch("scope"), connection.scope
    assert connection.calendar_access?
    assert connection.ready?
    assert_not_includes connection.refresh_token_before_type_cast, "calendar-refresh"
    get delivery_connections_path
    assert_response :success
    assert_includes response.body, I18n.t("delivery_connections.delivery_connection.calendar_allowed")
  end

  test "unchecked choice requests no calendar scopes and ignores callback permission tampering" do
    query = start_connection(scope: "")
    assert_equal "openid email", query.fetch("scope")
    stub_token(scope: (%w[openid email] + MailboxOauth::GOOGLE_CALENDAR_SCOPES).join(" "))
    get callback_delivery_connections_path(provider: "google", locale: nil), params: { state: query.fetch("state"), code: "code", scope: MailboxOauth::GOOGLE_CALENDAR_SCOPES.join(" ") }
    connection = DeliveryConnection.where_user(users(:other_user)).where_provider("google").sole
    assert_equal "openid email", connection.scope
    assert_not connection.calendar_access?
    assert_not connection.ready?
  end

  test "partial and omitted grants never claim calendar access" do
    ["openid email", "openid email #{MailboxOauth::GOOGLE_CALENDAR_SCOPES.first}", nil].each do |scope|
      query = start_connection(scope: MailboxOauth::GOOGLE_CALENDAR_SCOPES.join(" "))
      stub_token(scope: scope)
      get callback_delivery_connections_path(provider: "google", locale: nil), params: { state: query.fetch("state"), code: "code" }
      assert_redirected_to delivery_connections_path
      assert_not DeliveryConnection.where_user(users(:other_user)).where_provider("google").sole.calendar_access?
    end
  end

  test "reconnection updates calendar access and does not create another connection" do
    query = start_connection(scope: MailboxOauth::GOOGLE_CALENDAR_SCOPES.join(" "))
    stub_token(scope: query.fetch("scope"))
    get callback_delivery_connections_path(provider: "google", locale: nil), params: { state: query.fetch("state"), code: "code" }
    assert DeliveryConnection.where_user(users(:other_user)).where_provider("google").sole.calendar_access?
    query = start_connection(scope: "")
    stub_token(scope: query.fetch("scope"))
    assert_no_difference "DeliveryConnection.count" do
      get callback_delivery_connections_path(provider: "google", locale: nil), params: { state: query.fetch("state"), code: "code" }
    end
    assert_not DeliveryConnection.where_user(users(:other_user)).where_provider("google").sole.calendar_access?
  end

  test "invalid state and denied consent cannot create a calendar connection" do
    query = start_connection(scope: MailboxOauth::GOOGLE_CALENDAR_SCOPES.join(" "))
    assert_no_difference "DeliveryConnection.count" do
      get callback_delivery_connections_path(provider: "google", locale: nil), params: { state: "wrong", code: "code" }
      query = start_connection(scope: MailboxOauth::GOOGLE_CALENDAR_SCOPES.join(" "))
      get callback_delivery_connections_path(provider: "google", locale: nil), params: { state: query.fetch("state"), error: "access_denied" }
    end
    assert_not_requested :post, "https://oauth2.googleapis.com/token"
  end

  test "admins can optionally add calendar scopes to Gmail and Google Workspace" do
    delete login_path
    sign_in(email_addresses(:admin_email).email_address, passwords(:password).hint)
    %w[gmail google_workspace].each do |provider|
      query = start_connection(scope: "", provider: provider)
      assert_equal MailboxOauth::GOOGLE_SCOPES, query.fetch("scope").split
      query = start_connection(scope: MailboxOauth::GOOGLE_CALENDAR_SCOPES.join(" "), provider: provider)
      assert_equal MailboxOauth::GOOGLE_SCOPES + MailboxOauth::GOOGLE_CALENDAR_SCOPES, query.fetch("scope").split
      stub_token(scope: query.fetch("scope"))
      get callback_delivery_connections_path(provider: provider, locale: nil), params: { state: query.fetch("state"), code: "code" }
      assert DeliveryConnection.where_user(users(:admin)).where_provider(provider).sole.calendar_access?
    end
  end

  private

  def start_connection(scope:, provider: "google")
    post connect_delivery_connections_path(provider: provider), params: { scope: scope }
    assert_response :redirect
    uri = URI(response.location)
    assert_equal "accounts.google.com", uri.host
    query = URI.decode_www_form(uri.query).to_h
    assert_equal "S256", query.fetch("code_challenge_method")
    assert_equal "#{Current.base_url}/delivery_connections/callback/#{provider}", query.fetch("redirect_uri")
    query
  end

  def stub_token(scope:, challenge: nil)
    stub_request(:post, "https://oauth2.googleapis.com/token").with do |request|
      body = URI.decode_www_form(request.body).to_h
      if challenge
        assert_equal challenge, Base64.urlsafe_encode64(Digest::SHA256.digest(body.fetch("code_verifier")), padding: false)
      end
      true
    end.to_return(body: { access_token: "calendar-access", refresh_token: "calendar-refresh", token_type: "Bearer", expires_in: 3600, scope: scope }.compact.to_json)
  end
end
