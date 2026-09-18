# frozen_string_literal: true

require "test_helper"

class SlackOauthTest < ActiveSupport::TestCase
  setup do
    @previous_id = ENV.fetch("SLACK_CLIENT_ID", nil)
    @previous_secret = ENV.fetch("SLACK_CLIENT_SECRET", nil)
    ENV["SLACK_CLIENT_ID"] = "client"
    ENV["SLACK_CLIENT_SECRET"] = "secret"
  end

  teardown do
    ENV["SLACK_CLIENT_ID"] = @previous_id
    ENV["SLACK_CLIENT_SECRET"] = @previous_secret
  end

  test "malformed missing permission and expiring tokens are rejected" do
    invalid_responses = ["not json", "null", "[]", { ok: false }.to_json]
    invalid_responses << oauth_response.merge(scope: "users:read").to_json
    invalid_responses << oauth_response.merge(expires_in: 43_200).to_json
    invalid_responses << oauth_response.merge(token_type: "user").to_json
    invalid_responses << oauth_response.merge(authed_user: { id: "U123" }).to_json
    invalid_responses << oauth_response.merge(authed_user: oauth_response[:authed_user].merge(expires_in: 43_200)).to_json
    invalid_responses.each do |body|
      stub_request(:post, "https://slack.com/api/oauth.v2.access").to_return(status: 200, body: body)
      assert_raises(SlackOauth::Error) { exchange }
    end
  end

  test "http failures and timeouts are handled without provider details" do
    stub_request(:post, "https://slack.com/api/oauth.v2.access").to_return(status: 500, body: "sensitive")
    error = assert_raises(SlackOauth::Error) { exchange }
    assert_not_includes error.message, "sensitive"
    stub_request(:post, "https://slack.com/api/oauth.v2.access").to_timeout
    assert_raises(SlackOauth::Error) { exchange }
  end

  private

  def oauth_response
    {
      ok: true, token_type: "bot", access_token: "bot-token", bot_user_id: "B123",
      scope: "chat:write", team: { id: "T123" },
      authed_user: { id: "U123", access_token: "user-token", scope: "chat:write" }
    }
  end

  def exchange
    SlackOauth.exchange(code: "code", redirect_uri: "https://codedorian.com/slack_connections/callback")
  end
end
