# frozen_string_literal: true

require "test_helper"

class DeliveryConnectionsFacebookControllerTest < ActionDispatch::IntegrationTest
  setup do
    @previous_facebook_credentials = Config.facebook
    @previous_meta_credentials = Config.meta_delivery
    Config.facebook = { client_id: "client", client_secret: "secret", config_id: "config" }.to_deep_struct
    Config.meta_delivery = { api_version: "v25.0" }.to_deep_struct
    stub_request(:get, %r{/debug_token}).to_return(body: { data: { is_valid: true, type: "USER", app_id: "client", granular_scopes: [] } }.to_json)
    sign_in(email_addresses(:admin_email).email_address, passwords(:password).hint)
  end

  teardown do
    Config.facebook = @previous_facebook_credentials
    Config.meta_delivery = @previous_meta_credentials
  end

  test "admin connects reconnects lists and disconnects pages with full owned data" do
    2.times do |index|
      state = start_connection
      stub_exchange
      assert_difference "DeliveryConnection.count", index.zero? ? 1 : 0 do
        get callback_delivery_connections_path(provider: "facebook", locale: nil), params: { state: state, code: "code" }
        assert_redirected_to delivery_connections_path
      end
    end
    connection = DeliveryConnection.where_user(users(:admin)).where(provider: "facebook").sole
    assert_equal "123456", connection.sender
    assert_equal "page-token", connection.access_token
    assert connection.ready?
    assert_not_includes connection.access_token_before_type_cast, "page-token"
    assert_not_includes connection.versions.to_json, "page-token"
    get delivery_connections_path
    assert_response :success
    assert_not_includes response.body, "translation missing"
    get delivery_connections_path, as: :json
    assert_response :success
    assert_includes response.body, "page-token"
    delete delivery_connection_path(connection), as: :json
    assert_response :success
    assert_not DeliveryConnection.exists?(connection.id)
  end

  test "invalid replayed expired and denied requests cannot exchange tokens" do
    state = start_connection
    get callback_delivery_connections_path(provider: "facebook", locale: nil), params: { state: "invalid", code: "code" }
    get callback_delivery_connections_path(provider: "facebook", locale: nil), params: { state: state, code: "code" }
    state = start_connection
    travel 11.minutes do
      get callback_delivery_connections_path(provider: "facebook", locale: nil), params: { state: state, code: "code" }
    end
    state = start_connection
    get callback_delivery_connections_path(provider: "facebook", locale: nil), params: { state: state, error: "access_denied" }
    assert_not_requested :get, /graph.facebook.com/
  end

  test "provider failure leaves connections unchanged" do
    state = start_connection
    stub_request(:get, /graph.facebook.com/).to_return(status: 400, body: { error: { message: "private detail" } }.to_json)
    assert_no_difference "DeliveryConnection.count" do
      get callback_delivery_connections_path(provider: "facebook", locale: nil), params: { state: state, code: "code" }
      assert_redirected_to delivery_connections_path
    end
    assert_equal I18n.t("delivery_connections.callback.failed"), flash[:alert]
  end

  test "missing permissions and unavailable pages show actionable translated errors" do
    %w[missing_permissions no_pages].each do |reason|
      state = start_connection
      stub_exchange
      if reason == "missing_permissions"
        stub_request(:get, %r{/me/permissions}).to_return(body: { data: [] }.to_json)
      else
        stub_request(:get, %r{/me/accounts}).to_return(body: { data: [] }.to_json)
      end
      assert_no_difference "DeliveryConnection.count" do
        get callback_delivery_connections_path(provider: "facebook", locale: nil), params: { state: state, code: "code" }
      end
      assert_redirected_to delivery_connections_path
      assert_equal I18n.t("delivery_connections.callback.failed"), flash[:alert]
    end
  end

  test "regular users and guests cannot manage facebook connections" do
    delete login_path
    sign_in(email_addresses(:other_email).email_address, passwords(:other_password).hint)
    get delivery_connections_path, as: :json
    assert_response :success
    post connect_delivery_connections_path(provider: "facebook"), as: :json
    assert_response :bad_request
    get callback_delivery_connections_path(provider: "facebook"), params: { code: "code", state: "state" }, as: :json
    assert_response :bad_request
    delete login_path
    post connect_delivery_connections_path(provider: "facebook"), as: :json
    assert_response :bad_request
    assert_not_requested :get, /graph.facebook.com/
  end

  private

  def start_connection
    post connect_delivery_connections_path(provider: "facebook")
    assert_response :redirect
    uri = URI(response.location)
    assert_equal "www.facebook.com", uri.host
    query = URI.decode_www_form(uri.query).to_h
    assert_equal "config", query["config_id"]
    assert_equal "code", query["response_type"]
    assert_equal "rerequest", query["auth_type"]
    assert_equal "#{Current.base_url}/delivery_connections/callback/facebook", query["redirect_uri"]
    assert_nil query["client_secret"]
    query.fetch("state")
  end

  def stub_exchange
    stub_request(:get, "https://graph.facebook.com/v25.0/oauth/access_token")
      .with(query: { client_id: "client", client_secret: "secret", code: "code", redirect_uri: "#{Current.base_url}/delivery_connections/callback/facebook" })
      .to_return(body: { access_token: "short-token" }.to_json)
    stub_request(:get, "https://graph.facebook.com/v25.0/oauth/access_token")
      .with(query: { client_id: "client", client_secret: "secret", grant_type: "fb_exchange_token", fb_exchange_token: "short-token" })
      .to_return(body: { access_token: "long-token" }.to_json)
    proof = OpenSSL::HMAC.hexdigest("SHA256", "secret", "long-token")
    stub_request(:get, "https://graph.facebook.com/v25.0/me/permissions")
      .with(query: { appsecret_proof: proof }, headers: { "Authorization" => "Bearer long-token" })
      .to_return(body: { data: FacebookOauth::SCOPES.map { |permission| { permission: permission, status: "granted" } } }.to_json)
    stub_request(:get, "https://graph.facebook.com/v25.0/me/accounts")
      .with(query: { appsecret_proof: proof, fields: "id,name,access_token,tasks", limit: "100" }, headers: { "Authorization" => "Bearer long-token" })
      .to_return(body: { data: [{ id: "123456", name: "My Page", access_token: "page-token", tasks: ["CREATE_CONTENT"] }] }.to_json)
  end
end
