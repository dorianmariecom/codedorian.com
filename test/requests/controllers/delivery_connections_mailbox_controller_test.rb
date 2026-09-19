# frozen_string_literal: true

require "test_helper"

class DeliveryConnectionsMailboxControllerTest < ActionDispatch::IntegrationTest
  setup do
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
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  teardown do
    Config.google_delivery = @previous_google_credentials
    Config.microsoft_delivery = @previous_microsoft_credentials
  end

  test "admins connect reconnect and disconnect every mailbox provider with PKCE" do
    %w[gmail google_workspace outlook].each do |provider|
      microsoft = provider == "outlook"
      endpoint =
        (
          if microsoft
            "https://login.microsoftonline.com/common/oauth2/v2.0/token"
          else
            "https://oauth2.googleapis.com/token"
          end
        )
      2.times do |index|
        query = start_connection(provider)
        stub_request(:post, endpoint)
          .with do |request|
            data = URI.decode_www_form(request.body).to_h
            assert_equal "authorization_code", data["grant_type"]
            assert_equal "#{Current.base_url}/delivery_connections/callback/#{provider}",
                         data["redirect_uri"]
            assert_equal query["code_challenge"],
                         Base64.urlsafe_encode64(
                           Digest::SHA256.digest(data.fetch("code_verifier")),
                           padding: false
                         )
            true
          end
          .to_return(
            body: {
              access_token: "mailbox-access",
              refresh_token: "mailbox-refresh",
              token_type: "Bearer",
              expires_in: 3600
            }.to_json
          )
        if microsoft
          stub_request(
            :get,
            "https://graph.microsoft.com/v1.0/me?$select=id,mail,userPrincipalName"
          ).to_return(
            body: { id: "account", mail: "admin@example.com" }.to_json
          )
        else
          stub_request(
            :get,
            "https://openidconnect.googleapis.com/v1/userinfo"
          ).to_return(
            body: {
              sub: "account",
              email: "admin@example.com",
              email_verified: true
            }.to_json
          )
        end
        assert_difference "DeliveryConnection.count", index.zero? ? 1 : 0 do
          get callback_delivery_connections_path(
                provider: provider,
                locale: nil
              ),
              params: {
                state: query["state"],
                code: "auth-code"
              }
          assert_redirected_to delivery_connections_path
        end
      end
      connection =
        DeliveryConnection.where_user(users(:admin)).find_by!(
          provider: provider
        )
      assert_equal "admin@example.com", connection.smtp_from
      assert_not_includes connection.refresh_token_before_type_cast,
                          "mailbox-refresh"
      assert_not_includes connection.versions.to_json, "mailbox-refresh"
      get delivery_connections_path
      assert_response :success
      get delivery_connections_path, as: :json
      assert_includes response.body, "mailbox-access"
      assert_includes response.body, "mailbox-refresh"
      delete delivery_connection_path(connection), as: :json
      assert_response :success
      assert_not DeliveryConnection.exists?(connection.id)
    end
  end

  test "invalid expired replayed denied and unsupported authorizations cannot connect" do
    query = start_connection("gmail")
    get callback_delivery_connections_path(provider: "gmail", locale: nil),
        params: {
          state: "wrong",
          code: "code"
        }
    get callback_delivery_connections_path(provider: "gmail", locale: nil),
        params: {
          state: query["state"],
          code: "code"
        }
    query = start_connection("gmail")
    travel 11.minutes do
      get callback_delivery_connections_path(provider: "gmail", locale: nil),
          params: {
            state: query["state"],
            code: "code"
          }
    end
    query = start_connection("gmail")
    get callback_delivery_connections_path(provider: "gmail", locale: nil),
        params: {
          state: query["state"],
          error: "access_denied"
        }
    post connect_delivery_connections_path(provider: "smtp"), as: :json
    assert_response :bad_request
    assert_not_requested :post, "https://oauth2.googleapis.com/token"
  end

  test "regular users and guests cannot manage mailbox connections" do
    delete login_path
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    get delivery_connections_path, as: :json
    assert_response :success
    post connect_delivery_connections_path(provider: "gmail"),
         params: {
           provider: "gmail"
         },
         as: :json
    assert_response :bad_request
    delete login_path
    post connect_delivery_connections_path(provider: "gmail"),
         params: {
           provider: "outlook"
         },
         as: :json
    assert_response :bad_request
  end

  private

  def start_connection(provider)
    post connect_delivery_connections_path(provider: provider),
         params: {
           provider: provider
         }
    assert_response :redirect
    uri = URI(response.location)
    assert_equal(
      (
        if provider == "outlook"
          "login.microsoftonline.com"
        else
          "accounts.google.com"
        end
      ),
      uri.host
    )
    query = URI.decode_www_form(uri.query).to_h
    assert_equal "S256", query["code_challenge_method"]
    query
  end
end
