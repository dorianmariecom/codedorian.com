# frozen_string_literal: true

require "test_helper"

class GithubApiTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @subscription = subscriptions(:subscription)
    @connection = DeliveryConnection.create!(user: @subscription.user, provider: "github", name: "GitHub", access_token: "secret")
  end

  teardown { Current.reset }

  test "subscription code reads GitHub using its owner's encrypted connection" do
    stub_request(:get, "https://api.github.com/notifications?per_page=100")
      .with(headers: { "Authorization" => "Bearer secret" })
      .to_return(body: [{ id: "notification" }].to_json)
    Current.subscription = @subscription
    result = Code.evaluate(<<~CODE)
      connection = Current.subscription.delivery_connection(provider: "github")
      Http.get("https://api.github.com/notifications", query: { per_page: 100 }, headers: { Authorization: "Bearer {connection.access_token}" }).body
    CODE
    assert_equal [{ "id" => "notification" }], JSON.parse(result.to_s)
  end

  test "disabled and other users connections cannot supply credentials" do
    @connection.update!(enabled: false)
    DeliveryConnection.create!(user: users(:other_user), provider: "github", name: "Other", access_token: "other-secret")
    Current.subscription = @subscription
    error = assert_raises(Code::Error) { Code.evaluate('Current.subscription.delivery_connection(provider: "github")') }
    assert_includes error.message, "delivery_connection_required"
    assert_not_requested :get, "https://api.github.com/user"
  end

  test "ambiguous accounts are rejected instead of reading the wrong account" do
    DeliveryConnection.create!(user: @subscription.user, provider: "github", name: "Second", access_token: "other-secret")
    Current.subscription = @subscription
    assert_raises(Code::Error) { Code.evaluate('Current.subscription.delivery_connection(provider: "github")') }
    assert_not_requested :get, "https://api.github.com/user"
  end

  test "inputs select an owned account explicitly and cannot select another user's account" do
    second = DeliveryConnection.create!(user: @subscription.user, provider: "github", name: "Second", access_token: "second-secret", scope: "repo notifications")
    foreign = DeliveryConnection.create!(user: users(:other_user), provider: "github", name: "Other", access_token: "other-secret")
    Current.subscription = @subscription
    result = Code.evaluate(%(Current.subscription.delivery_connection(provider: "github", id: "#{second.id}")))
    assert_equal "second-secret", result.as_json.fetch("access_token")
    assert_equal "repo notifications", result.as_json.fetch("scope")
    assert_not result.as_json.key?("calendar_access")
    assert_raises(Code::Error) do
      Code.evaluate(%(Current.subscription.delivery_connection(provider: "github", id: "#{foreign.id}")))
    end
    Current.user = users(:other_user)
    assert_raises(ActiveRecord::RecordNotFound) do
      Code.evaluate(%(Current.subscription.delivery_connection(provider: "github", id: "#{second.id}")))
    end
  end

  test "API reads never forward credentials to another host or follow redirects" do
    %w[http://api.github.com/user https://api.github.com.evil.example/user https://evil.example/user https://user@api.github.com/user https://api.github.com:444/user].each do |url|
      assert_raises(GithubOauth::Error) { GithubApi.get(url, token: "secret") }
    end
    stub_request(:get, "https://api.github.com/user").to_return(status: 302, headers: { "Location" => "https://evil.example/user" })
    assert_raises(GithubOauth::Error) { GithubApi.get("https://api.github.com/user", token: "secret") }
    assert_not_requested :get, "https://evil.example/user"
  end

  test "expired tokens rotate before reading" do
    previous_credentials = Config.github
    Config.github = { client_id: "client", client_secret: "client-secret" }.to_deep_struct
    @connection.update!(refresh_token: "refresh", token_expires_at: 1.minute.ago)
    stub_request(:post, "https://github.com/login/oauth/access_token")
      .with(body: hash_including("grant_type" => "refresh_token", "refresh_token" => "refresh"))
      .to_return(body: { access_token: "rotated", refresh_token: "rotated-refresh", token_type: "bearer", expires_in: 28_800, scope: "repo,notifications" }.to_json)
    Current.subscription = @subscription
    result = Code.evaluate('Current.subscription.delivery_connection(provider: "github").access_token')
    assert_equal "rotated", result.to_s
    assert_equal "rotated-refresh", @connection.reload.refresh_token
    assert @connection.token_expires_at.future?
  ensure
    Config.github = previous_credentials
  end
end
