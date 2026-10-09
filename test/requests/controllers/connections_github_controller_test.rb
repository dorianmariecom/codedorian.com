# frozen_string_literal: true

require "test_helper"

class ConnectionsGithubControllerTest < ActionDispatch::IntegrationTest
  setup do
    @previous_github_credentials = Config.github
    Config.github = {
      client_id: "client",
      client_secret: "secret"
    }.to_deep_struct
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
  end

  teardown { Config.github = @previous_github_credentials }

  test "PKCE connection reconnect encryption and disconnect" do
    2.times do |index|
      query = start_connection
      stub_request(:post, "https://github.com/login/oauth/access_token")
        .with do |request|
          body = URI.decode_www_form(request.body).to_h
          challenge =
            Base64.urlsafe_encode64(
              Digest::SHA256.digest(body.fetch("code_verifier")),
              padding: false
            )
          assert_equal query["code_challenge"], challenge
          assert_equal "#{Current.base_url}/connections/callback/github",
                       body["redirect_uri"]
          assert_equal "secret", body["client_secret"]
          true
        end
        .to_return(
          body: {
            access_token: "access-secret",
            token_type: "bearer",
            scope: "repo,notifications"
          }.to_json
        )
      stub_request(:get, "https://api.github.com/user").with(
        headers: {
          "Authorization" => "Bearer access-secret",
          "X-GitHub-Api-Version" => "2026-03-10"
        }
      ).to_return(
        body: {
          id: 123,
          login: "octocat",
          name: "Octo Cat",
          email: index.zero? ? "octo@example.com" : nil
        }.to_json
      )
      assert_difference "Connection.count", index.zero? ? 1 : 0 do
        get callback_connections_path(provider: "github", locale: nil),
            params: {
              state: query["state"],
              code: "code"
            }
        assert_redirected_to connections_path
      end
    end
    connection =
      Connection.where_user(users(:other_user)).where_provider("github").sole
    assert_equal "octocat", connection.username
    assert_equal "octo@example.com", connection.email
    assert_equal "123", connection.external_id
    assert_equal "123", connection.sender
    assert_equal "repo notifications", connection.scope
    assert connection.ready?
    assert_not_includes connection.access_token_before_type_cast,
                        "access-secret"
    assert_not_includes connection.versions.to_json, "access-secret"
    get connections_path
    assert_response :success
    assert_select "input[type=submit][value=?]",
                  I18n.t("connections.index.connect", provider: "github")
    delete connection_path(connection)
    assert_not Connection.exists?(connection.id)
  end

  test "invalid expired and replayed states cannot exchange tokens" do
    query = start_connection
    get callback_connections_path(provider: "github", locale: nil),
        params: {
          state: "wrong",
          code: "code"
        }
    get callback_connections_path(provider: "github", locale: nil),
        params: {
          state: query["state"],
          code: "code"
        }
    query = start_connection
    travel 11.minutes do
      get callback_connections_path(provider: "github", locale: nil),
          params: {
            state: query["state"],
            code: "code"
          }
    end
    assert_not_requested :post, "https://github.com/login/oauth/access_token"
  end

  test "denied authorization and insufficient scopes do not create connections" do
    assert_no_difference "Connection.count" do
      query = start_connection
      get callback_connections_path(provider: "github", locale: nil),
          params: {
            state: query["state"],
            error: "access_denied"
          }
      assert_redirected_to connections_path
      query = start_connection
      stub_request(
        :post,
        "https://github.com/login/oauth/access_token"
      ).to_return(
        body: {
          access_token: "secret",
          token_type: "bearer",
          scope: "read:user"
        }.to_json
      )
      get callback_connections_path(provider: "github", locale: nil),
          params: {
            state: query["state"],
            code: "code"
          }
      assert_redirected_to connections_path
    end
    assert_not_requested :get, "https://api.github.com/user"
  end

  test "another user's connection cannot be disconnected" do
    connection =
      Current.with(user: users(:admin)) do
        Connection.create!(
          provider: "github",
          username: "GitHub",
          access_token: "secret"
        )
      end
    delete connection_path(connection), as: :json
    assert_response :bad_request
    assert Connection.exists?(connection.id)
  end

  test "json oauth returns an authorization URL and completes with the same session" do
    post connect_connections_path(provider: "github", format: :json), as: :json
    assert_response :success
    url = response.parsed_body.dig("data", "authorization_url")
    query = URI.decode_www_form(URI(url).query).to_h
    assert_equal "#{Current.base_url}/connections/callback/github",
                 query["redirect_uri"]
    assert_equal "ok", response.parsed_body["status"]

    stub_request(
      :post,
      "https://github.com/login/oauth/access_token"
    ).to_return(
      body: {
        access_token: "json-access-secret",
        token_type: "bearer",
        scope: "repo,notifications"
      }.to_json
    )
    stub_request(:get, "https://api.github.com/user").to_return(
      body: { id: 123, login: "octocat", email: "octo@example.com" }.to_json
    )
    params = { state: query["state"], code: "code" }
    assert_difference "Connection.count", 1 do
      get callback_connections_path(provider: "github", format: :json),
          params: params,
          as: :json
      assert_response :success
      assert_equal "ok", response.parsed_body["status"]
      assert_nil response.parsed_body["data"]
      assert_not_includes response.body, "json-access-secret"
    end
    get callback_connections_path(provider: "github"), params: params, as: :json
    assert_response :bad_request
    assert_equal [I18n.t("connections.callback.invalid_state")],
                 response.parsed_body["messages"]
  end

  test "json oauth denial and token exchange failures return errors" do
    [true, false].each do |denied|
      post connect_connections_path(provider: "github"), as: :json
      url = response.parsed_body.dig("data", "authorization_url")
      state = URI.decode_www_form(URI(url).query).to_h.fetch("state")
      stub_request(
        :post,
        "https://github.com/login/oauth/access_token"
      ).to_return(status: 400)
      params =
        (
          if denied
            { state: state, error: "access_denied" }
          else
            { state: state, code: "code" }
          end
        )
      get callback_connections_path(provider: "github"),
          params: params,
          as: :json
      assert_response :bad_request
      assert_equal "bad_request", response.parsed_body["status"]
      assert_nil response.parsed_body["data"]
    end
  end

  test "json oauth initialization failures return an error envelope" do
    Config.github = { client_id: nil, client_secret: nil }.to_deep_struct
    post connect_connections_path(provider: "github"), as: :json
    assert_response :bad_request
    assert_equal "bad_request", response.parsed_body["status"]
    assert_equal [I18n.t("connections.connect.failed")],
                 response.parsed_body["messages"]
    assert_nil response.parsed_body["data"]
  end

  private

  def start_connection
    post connect_connections_path(provider: "github")
    assert_response :redirect
    uri = URI(response.location)
    assert_equal "github.com", uri.host
    query = URI.decode_www_form(uri.query).to_h
    assert_equal "S256", query["code_challenge_method"]
    assert_equal "repo notifications", query["scope"]
    query
  end
end
