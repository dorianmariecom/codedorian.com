# frozen_string_literal: true

require "test_helper"

class FacebookOauthTest < ActiveSupport::TestCase
  setup do
    @previous_facebook_credentials = Config.facebook
    Config.facebook = {
      client_id: "client",
      client_secret: "secret"
    }.to_deep_struct
    stub_request(:get, %r{/oauth/access_token}).to_return(
      body: { access_token: "user-token" }.to_json
    )
  end

  teardown { Config.facebook = @previous_facebook_credentials }

  test "profile connects without a configuration or page permissions" do
    proof = OpenSSL::HMAC.hexdigest("SHA256", "secret", "user-token")
    stub_request(:get, "https://graph.facebook.com/v26.0/me").with(
      query: {
        fields: "id,name",
        appsecret_proof: proof
      },
      headers: {
        "Authorization" => "Bearer user-token"
      }
    ).to_return(body: { id: "123456", name: "Profile" }.to_json)
    assert_equal [
      {
        sender: "123456",
        external_id: "123456",
        access_token: "user-token",
        scope: "public_profile",
        enabled: true
      }
    ],
                 exchange
    assert_not_requested :get, %r{/me/accounts|/me/permissions|/debug_token}
    assert_requested :get, %r{/oauth/access_token}, times: 1
  end

  test "missing names fall back to the facebook id" do
    stub_request(:get, %r{/v26.0/me\?}).to_return(
      body: { id: "123456" }.to_json
    )
    assert_equal "123456", exchange.sole[:external_id]
  end

  test "invalid profile responses are rejected" do
    [
      "null",
      "[]",
      "not json",
      {},
      { id: nil },
      { id: 123 },
      { id: "invalid" },
      { id: "" }
    ].each do |profile|
      body = profile.is_a?(String) ? profile : profile.to_json
      stub_request(:get, %r{/v26.0/me\?}).to_return(body: body)
      assert_raises(FacebookOauth::Error) { exchange }
    end
  end

  test "invalid access tokens cannot fetch profiles" do
    [nil, "", 123].each do |token|
      stub_request(:get, %r{/oauth/access_token}).to_return(
        body: { access_token: token }.to_json
      )
      assert_raises(FacebookOauth::Error) { exchange }
    end
    assert_not_requested :get, %r{/v26.0/me\?}
  end

  test "provider diagnostics retain only stage and numeric error codes" do
    stub_request(:get, %r{/oauth/access_token}).to_return(
      status: 400,
      body: {
        error: {
          code: 190,
          error_subcode: 36_008,
          message: "private-token",
          error_user_msg: "private-user"
        }
      }.to_json
    )
    error = assert_raises(FacebookOauth::Error) { exchange }
    assert_equal "provider_error", error.reason
    assert_equal "code_exchange", error.stage
    assert_equal 190, error.provider_code
    assert_equal 36_008, error.provider_subcode
    assert_not_includes error.message, "private"
  end

  test "http errors and timeouts do not expose provider details" do
    stub_request(:get, %r{/oauth/access_token}).to_return(
      status: 400,
      body: "sensitive"
    )
    error = assert_raises(FacebookOauth::Error) { exchange }
    assert_not_includes error.message, "sensitive"
    stub_request(:get, %r{/oauth/access_token}).to_timeout
    assert_raises(FacebookOauth::Error) { exchange }
  end

  private

  def exchange
    FacebookOauth.exchange(
      code: "code",
      redirect_uri:
        "https://codedorian.com/delivery_connections/callback/facebook"
    )
  end
end
