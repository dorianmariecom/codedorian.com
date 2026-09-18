# frozen_string_literal: true

require "test_helper"

class XConnectionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @old_id = ENV.fetch("X_CLIENT_ID", nil)
    @old_secret = ENV.fetch("X_CLIENT_SECRET", nil)
    ENV["X_CLIENT_ID"] = "client"
    ENV["X_CLIENT_SECRET"] = "secret"
    sign_in(email_addresses(:other_email).email_address, passwords(:other_password).hint)
  end

  teardown do
    ENV["X_CLIENT_ID"] = @old_id
    ENV["X_CLIENT_SECRET"] = @old_secret
  end

  test "PKCE connect reconnect list and disconnect keep tokens private" do
    2.times do |index|
      query = start_connection
      stub_request(:post, "https://api.x.com/2/oauth2/token").with do |request|
        body = URI.decode_www_form(request.body).to_h
        challenge = Base64.urlsafe_encode64(Digest::SHA256.digest(body.fetch("code_verifier")), padding: false)
        assert_equal query["code_challenge"], challenge
        assert_equal "authorization_code", body["grant_type"]
        assert_equal "#{Current.base_url}/x_connections/callback", body["redirect_uri"]
        true
      end.to_return(body: {
        access_token: "access-secret", refresh_token: "refresh-secret", token_type: "bearer",
        expires_in: 7200, scope: XOauth::SCOPES.join(" ")
      }.to_json)
      stub_request(:get, "https://api.x.com/2/users/me")
        .with(headers: { "Authorization" => "Bearer access-secret" })
        .to_return(body: { data: { id: "123", username: "dorian" } }.to_json)
      assert_difference "DeliveryConnection.count", index.zero? ? 1 : 0 do
        get callback_x_connections_path(locale: nil), params: { state: query["state"], code: "code" }
        assert_redirected_to x_connections_path
      end
    end
    connection = DeliveryConnection.where_user(users(:other_user)).where(provider: "x").sole
    assert_equal "refresh-secret", connection.refresh_token
    assert_not_includes connection.refresh_token_before_type_cast, "refresh-secret"
    assert_not_includes connection.versions.to_json, "refresh-secret"
    get x_connections_path
    assert_response :success
    get x_connections_path, as: :json
    assert_not_includes response.body, "access-secret"
    assert_not_includes response.body, "refresh-secret"
    delete x_connection_path(connection)
    assert_nil connection.reload.access_token
    assert_nil connection.refresh_token
    assert_not connection.enabled?
  end

  test "invalid expired and replayed states cannot exchange tokens" do
    query = start_connection
    get callback_x_connections_path(locale: nil), params: { state: "wrong", code: "code" }
    get callback_x_connections_path(locale: nil), params: { state: query["state"], code: "code" }
    query = start_connection
    travel 11.minutes do
      get callback_x_connections_path(locale: nil), params: { state: query["state"], code: "code" }
    end
    assert_not_requested :post, "https://api.x.com/2/oauth2/token"
  end

  test "another account cannot be disconnected and guests cannot connect" do
    connection = Current.with(user: users(:admin)) do
      DeliveryConnection.create!(provider: "x", name: "Private", access_token: "private", enabled: true)
    end
    delete x_connection_path(connection), as: :json
    assert_response :bad_request
    assert connection.reload.enabled?
    delete login_path
    post x_connections_path, as: :json
    assert_response :bad_request
  end

  private

  def start_connection
    post x_connections_path
    assert_response :redirect
    uri = URI(response.location)
    assert_equal "x.com", uri.host
    query = URI.decode_www_form(uri.query).to_h
    assert_equal "S256", query["code_challenge_method"]
    query
  end
end
