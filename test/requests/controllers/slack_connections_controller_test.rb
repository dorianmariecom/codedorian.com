# frozen_string_literal: true

require "test_helper"

class SlackConnectionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @previous_id = ENV.fetch("SLACK_CLIENT_ID", nil)
    @previous_secret = ENV.fetch("SLACK_CLIENT_SECRET", nil)
    ENV["SLACK_CLIENT_ID"] = "slack-client"
    ENV["SLACK_CLIENT_SECRET"] = "slack-secret"
    sign_in(email_addresses(:other_email).email_address, passwords(:other_password).hint)
  end

  teardown do
    ENV["SLACK_CLIENT_ID"] = @previous_id
    ENV["SLACK_CLIENT_SECRET"] = @previous_secret
  end

  test "connect reconnect list and disconnect without exposing tokens" do
    2.times do |index|
      state = start_connection
      exchange = stub_exchange
      assert_difference "DeliveryConnection.count", index.zero? ? 2 : 0 do
        get callback_slack_connections_path(locale: nil), params: { state: state, code: "code" }
        assert_redirected_to slack_connections_path
      end
      assert_requested exchange, times: index + 1
    end
    connection = DeliveryConnection.where_user(users(:other_user)).where(provider: "slack", sender: "B123").sole
    assert_equal "bot-token", connection.access_token
    assert_equal "T123", connection.account_sid
    assert_equal "B123", connection.sender
    user_connection = DeliveryConnection.where_user(users(:other_user)).find_by!(sender: "U123")
    assert_equal "user-token", user_connection.access_token
    assert_not_equal connection.name, user_connection.name
    assert connection.ready?
    assert_not_includes connection.access_token_before_type_cast, "bot-token"
    assert_not_includes connection.versions.to_json, "bot-token"
    get slack_connections_path
    assert_response :success
    assert_select "button", text: I18n.t("slack_connections.index.disconnect")
    get slack_connections_path, as: :json
    assert_response :success
    assert_not_includes response.body, "bot-token"
    assert_not_includes response.body, "user-token"
    delete slack_connection_path(connection)
    assert_redirected_to slack_connections_path
    assert_not connection.reload.ready?
    assert_nil connection.access_token
    assert user_connection.reload.ready?
  end

  test "invalid state and replay do not exchange tokens" do
    state = start_connection
    get callback_slack_connections_path(locale: nil), params: { state: "invalid", code: "code" }
    get callback_slack_connections_path(locale: nil), params: { state: state, code: "code" }
    assert_not_requested :post, "https://slack.com/api/oauth.v2.access"
    assert_equal 0, DeliveryConnection.where_user(users(:other_user)).count
  end

  test "expired state does not exchange tokens" do
    state = start_connection
    travel 11.minutes do
      get callback_slack_connections_path(locale: nil), params: { state: state, code: "code" }
    end
    assert_not_requested :post, "https://slack.com/api/oauth.v2.access"
  end

  test "denial and provider failure leave no connection" do
    state = start_connection
    get callback_slack_connections_path(locale: nil), params: { state: state, error: "access_denied" }
    assert_not_requested :post, "https://slack.com/api/oauth.v2.access"
    state = start_connection
    stub_exchange({ ok: false, error: "invalid_code" })
    assert_no_difference "DeliveryConnection.count" do
      get callback_slack_connections_path(locale: nil), params: { state: state, code: "code" }
      assert_redirected_to slack_connections_path
    end
  end

  test "other accounts and non slack credentials cannot be disconnected or read" do
    connection = Current.with(user: users(:admin)) do
      DeliveryConnection.create!(user: users(:admin), provider: "slack", name: "private", access_token: "private-token", enabled: true)
    end
    get slack_connections_path, as: :json
    assert_not_includes response.body, "private"
    delete slack_connection_path(connection), as: :json
    assert_response :bad_request
    assert connection.reload.ready?
  end

  test "guests cannot start or view connections" do
    delete login_path
    post slack_connections_path, as: :json
    assert_response :bad_request
    get slack_connections_path, as: :json
    assert_response :bad_request
  end

  private

  def start_connection
    post slack_connections_path
    assert_response :redirect
    uri = URI(response.location)
    assert_equal "slack.com", uri.host
    query = URI.decode_www_form(uri.query).to_h
    assert_equal SlackOauth::SCOPES.join(","), query["scope"]
    assert_equal SlackOauth::SCOPES.join(","), query["user_scope"]
    assert_equal "#{Current.base_url}/slack_connections/callback", query["redirect_uri"]
    query.fetch("state")
  end

  def stub_exchange(body = { ok: true, token_type: "bot", scope: "chat:write", access_token: "bot-token", bot_user_id: "B123", team: { id: "T123", name: "Workspace" }, authed_user: { id: "U123", scope: "chat:write", access_token: "user-token" } })
    stub_request(:post, "https://slack.com/api/oauth.v2.access")
      .with(basic_auth: %w[slack-client slack-secret], body: { code: "code", redirect_uri: "#{Current.base_url}/slack_connections/callback" })
      .to_return(status: 200, body: body.to_json, headers: { "Content-Type" => "application/json" })
  end
end
