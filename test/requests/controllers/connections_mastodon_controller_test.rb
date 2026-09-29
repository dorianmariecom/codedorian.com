# frozen_string_literal: true

require "test_helper"

class ConnectionsMastodonControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    stub_request(:post, "https://mastodon.example/api/v1/apps").to_return(
      body: { client_id: "client", client_secret: "client-secret" }.to_json
    )
    stub_request(:post, "https://mastodon.example/oauth/token").with(
      body:
        hash_including(
          "client_id" => "client",
          "client_secret" => "client-secret",
          "grant_type" => "authorization_code"
        )
    ).to_return(
      body: {
        access_token: "access-secret",
        token_type: "Bearer",
        scope: MastodonOauth::SCOPES.join(" ")
      }.to_json
    )
    stub_request(
      :get,
      "https://mastodon.example/api/v1/accounts/verify_credentials"
    ).with(headers: { "Authorization" => "Bearer access-secret" }).to_return(
      body: { id: "123", username: "dorian" }.to_json
    )
  end

  test "connect reconnect list and disconnect return masked credentials" do
    with_addresses(["93.184.216.34"]) do
      2.times do |index|
        query = start_connection
        assert_difference "Connection.count", index.zero? ? 1 : 0 do
          get callback_connections_path(provider: "mastodon", locale: nil),
              params: {
                state: query["state"],
                code: "code"
              }
          assert_redirected_to connections_path
        end
      end
    end
    connection =
      Connection.where_user(users(:other_user)).where(provider: "mastodon").sole
    assert_equal "dorian", connection.username
    assert_equal "123", connection.external_id
    assert_nil connection.email
    assert_equal "https://mastodon.example", connection.base_url
    assert_equal "access-secret", connection.access_token
    assert_not_includes connection.access_token_before_type_cast,
                        "access-secret"
    assert_not_includes connection.versions.to_json, "access-secret"
    get connections_path
    assert_response :success
    get connections_path, as: :json
    assert_response :success
    assert_not_includes response.body, "access-secret"
    data = response.parsed_body.fetch("data").sole
    assert_equal "123", data.fetch("external_id")
    assert_match(/\A\*{3,10}\z/, data.fetch("access_token"))
    delete connection_path(connection)
    assert_not Connection.exists?(connection.id)
  end

  test "invalid expired and replayed states cannot exchange tokens" do
    with_addresses(["93.184.216.34"]) do
      query = start_connection
      get callback_connections_path(provider: "mastodon", locale: nil),
          params: {
            state: "wrong",
            code: "code"
          }
      get callback_connections_path(provider: "mastodon", locale: nil),
          params: {
            state: query["state"],
            code: "code"
          }
      query = start_connection
      travel 11.minutes do
        get callback_connections_path(provider: "mastodon", locale: nil),
            params: {
              state: query["state"],
              code: "code"
            }
      end
    end
    assert_not_requested :post, "https://mastodon.example/oauth/token"
  end

  test "another account cannot be disconnected and guests cannot connect" do
    connection =
      Current.with(user: users(:admin)) do
        Connection.create!(
          provider: "mastodon",
          username: "Private",
          access_token: "private",
          base_url: "https://mastodon.example",
          enabled: true
        )
      end
    delete connection_path(connection), as: :json
    assert_response :bad_request
    assert connection.reload.enabled?
    delete login_path
    post connect_connections_path(provider: "mastodon"),
         params: {
           server: "mastodon.example"
         },
         as: :json
    assert_response :bad_request
  end

  test "denied authorization and rejected tokens do not create connections" do
    with_addresses(["93.184.216.34"]) do
      assert_no_difference "Connection.count" do
        query = start_connection
        get callback_connections_path(provider: "mastodon", locale: nil),
            params: {
              state: query["state"],
              error: "access_denied"
            }
        assert_redirected_to connections_path
        assert_not_requested :post, "https://mastodon.example/oauth/token"
        query = start_connection
        stub_request(:post, "https://mastodon.example/oauth/token").to_return(
          status: 401
        )
        get callback_connections_path(provider: "mastodon", locale: nil),
            params: {
              state: query["state"],
              code: "code"
            }
        assert_redirected_to connections_path
      end
    end
  end

  test "invalid server displays an error without registering an application" do
    post connect_connections_path(provider: "mastodon"),
         params: {
           server: "http://localhost"
         }
    assert_redirected_to connections_path
    assert_not_requested :post, "https://mastodon.example/api/v1/apps"
  end

  private

  def start_connection
    post connect_connections_path(provider: "mastodon"),
         params: {
           server: "mastodon.example"
         }
    assert_response :redirect
    uri = URI(response.location)
    assert_equal "mastodon.example", uri.host
    URI.decode_www_form(uri.query).to_h
  end

  def with_addresses(addresses)
    original = Resolv.method(:getaddresses)
    Resolv.define_singleton_method(:getaddresses) { |_host| addresses }
    yield
  ensure
    Resolv.define_singleton_method(:getaddresses, original)
  end
end
