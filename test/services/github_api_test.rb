# frozen_string_literal: true

require "test_helper"

class GithubApiTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @subscription = subscriptions(:subscription)
    @connection =
      DeliveryConnection.create!(
        user: @subscription.user,
        provider: "github",
        name: "GitHub",
        access_token: "secret"
      )
  end

  teardown { Current.reset }

  test "subscription code reads GitHub using its owner's encrypted connection" do
    stub_request(
      :get,
      "https://api.github.com/notifications?per_page=100"
    ).with(headers: { "Authorization" => "Bearer secret" }).to_return(
      body: [{ id: "notification" }].to_json
    )
    Current.subscription = @subscription
    result = Code.evaluate(<<~CODE)
      connection = Current.subscription.user.delivery_connections.first
      Http.get("https://api.github.com/notifications", query: { per_page: 100 }, headers: { Authorization: "Bearer {connection.access_token}" }).body
    CODE
    assert_equal [{ "id" => "notification" }], JSON.parse(result.to_s)
  end

  test "disabled connections remain readable without refreshing credentials" do
    @connection.update!(enabled: false, token_expires_at: 1.minute.ago)
    Current.subscription = @subscription
    result =
      Code.evaluate("Current.subscription.user.delivery_connections.first")
    assert_equal "secret", result.as_json.fetch("access_token")
    assert_equal false, result.as_json.fetch("enabled")
    assert_not_requested :post, "https://github.com/login/oauth/access_token"
  end

  test "connections are selected through the user association" do
    second =
      DeliveryConnection.create!(
        user: @subscription.user,
        provider: "github",
        name: "Second",
        access_token: "second-secret",
        scope: "repo notifications"
      )
    foreign =
      DeliveryConnection.create!(
        user: users(:other_user),
        provider: "github",
        name: "Other",
        access_token: "other-secret"
      )
    Current.subscription = @subscription
    result =
      Code.evaluate(
        %(Current.subscription.user.delivery_connections.select((connection) => { connection.id == #{second.id} }).first)
      )
    assert_equal "second-secret", result.as_json.fetch("access_token")
    assert_equal "repo notifications", result.as_json.fetch("scope")
    assert_not result.as_json.key?("calendar_access")
    result = Code.evaluate("Current.subscription.user.delivery_connections")
    assert_equal [@connection.id, second.id].sort,
                 result.as_json.map { |connection| connection.fetch("id") }.sort
    assert_not_includes result.as_json.map { |connection|
                          connection.fetch("id")
                        },
                        foreign.id
    Current.user = users(:other_user)
    assert_raises(ActiveRecord::RecordNotFound) do
      Code.evaluate("Current.subscription.user.delivery_connections")
    end
  end

  test "API reads never forward credentials to another host or follow redirects" do
    %w[
      http://api.github.com/user
      https://api.github.com.evil.example/user
      https://evil.example/user
      https://user@api.github.com/user
      https://api.github.com:444/user
    ].each do |url|
      assert_raises(GithubOauth::Error) { GithubApi.get(url, token: "secret") }
    end
    stub_request(:get, "https://api.github.com/user").to_return(
      status: 302,
      headers: {
        "Location" => "https://evil.example/user"
      }
    )
    assert_raises(GithubOauth::Error) do
      GithubApi.get("https://api.github.com/user", token: "secret")
    end
    assert_not_requested :get, "https://evil.example/user"
  end

  test "expired tokens rotate before reading" do
    previous_credentials = Config.github
    Config.github = {
      client_id: "client",
      client_secret: "client-secret"
    }.to_deep_struct
    @connection.update!(
      refresh_token: "refresh",
      token_expires_at: 1.minute.ago
    )
    stub_request(:post, "https://github.com/login/oauth/access_token").with(
      body:
        hash_including(
          "grant_type" => "refresh_token",
          "refresh_token" => "refresh"
        )
    ).to_return(
      body: {
        access_token: "rotated",
        refresh_token: "rotated-refresh",
        token_type: "bearer",
        expires_in: 28_800,
        scope: "repo,notifications"
      }.to_json
    )
    Current.subscription = @subscription
    result =
      Code.evaluate(
        "Current.subscription.user.delivery_connections.first.access_token"
      )
    assert_equal "rotated", result.to_s
    assert_equal "rotated-refresh", @connection.reload.refresh_token
    assert @connection.token_expires_at.future?
  ensure
    Config.github = previous_credentials
  end
end
