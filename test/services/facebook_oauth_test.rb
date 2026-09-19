# frozen_string_literal: true

require "test_helper"

class FacebookOauthTest < ActiveSupport::TestCase
  setup do
    @previous_facebook_credentials = Config.facebook
    @previous_meta_credentials = Config.meta_delivery
    Config.facebook = { client_id: "client", client_secret: "secret", config_id: "config" }.to_deep_struct
    Config.meta_delivery = { api_version: "v25.0" }.to_deep_struct
    stub_request(:get, %r{/debug_token}).to_return(body: { data: { is_valid: true, type: "USER", app_id: "client", granular_scopes: [] } }.to_json)
    stub_request(:get, %r{/oauth/access_token}).to_return(body: { access_token: "user-token" }.to_json)
    stub_request(:get, %r{/me/permissions}).to_return(body: { data: FacebookOauth::SCOPES.map { |permission| { permission: permission, status: "granted" } } }.to_json)
  end

  teardown do
    Config.facebook = @previous_facebook_credentials
    Config.meta_delivery = @previous_meta_credentials
  end

  test "explicit publishing grants recover pages omitted by the accounts endpoint" do
    stub_request(:get, %r{/me/accounts}).to_return(body: { data: [] }.to_json)
    proof = OpenSSL::HMAC.hexdigest("SHA256", "secret", "client|secret")
    stub_request(:get, "https://graph.facebook.com/v25.0/debug_token")
      .with(query: { input_token: "user-token", appsecret_proof: proof }, headers: { "Authorization" => "Bearer client|secret" })
      .to_return(body: { data: { is_valid: true, type: "USER", app_id: "client", granular_scopes: [
        { scope: "pages_manage_posts", target_ids: ["1"] }, { scope: "pages_messaging", target_ids: ["2"] }
      ] } }.to_json)
    stub_request(:get, "https://graph.facebook.com/v25.0/1")
      .with(query: hash_including("fields" => "id,name,access_token"), headers: { "Authorization" => "Bearer user-token" })
      .to_return(body: page.except(:tasks).to_json)
    assert_equal ["1"], exchange.pluck(:sender)
    assert_not_requested :get, %r{/v25.0/2}
  end

  test "invalid or cross app tokens cannot discover selected pages" do
    stub_request(:get, %r{/me/accounts}).to_return(body: { data: [] }.to_json)
    [{ is_valid: false, type: "USER", app_id: "client" }, { is_valid: true, type: "USER", app_id: "other" }].each do |metadata|
      stub_request(:get, %r{/debug_token}).to_return(body: { data: metadata }.to_json)
      assert_raises(FacebookOauth::Error) { exchange }
    end
  end

  test "pagination stays on graph host and skips pages without publishing access" do
    first = { data: [page, page.merge(id: "2", tasks: ["ANALYZE"])], paging: { next: "https://untrusted.example/steal-token", cursors: { after: "cursor" } } }
    stub_request(:get, %r{/me/accounts}).to_return(body: first.to_json)
    stub_request(:get, %r{/me/accounts}).with(query: hash_including("after" => "cursor"))
      .to_return(body: { data: [page.merge(id: "3")] }.to_json)
    assert_equal %w[1 3], exchange.pluck(:sender)
    assert_not_requested :get, /untrusted.example/
  end

  test "new page experience publishing tasks are accepted but analytics alone is not" do
    %w[PROFILE_PLUS_CREATE_CONTENT PROFILE_PLUS_FULL_CONTROL PROFILE_PLUS_MANAGE].each do |task|
      stub_request(:get, %r{/me/accounts}).to_return(body: { data: [page.merge(tasks: [task])] }.to_json)
      assert_equal ["1"], exchange.pluck(:sender)
    end
    stub_request(:get, %r{/me/accounts}).to_return(body: { data: [page.merge(tasks: ["PROFILE_PLUS_ANALYZE"])] }.to_json)
    assert_equal "no_pages", assert_raises(FacebookOauth::Error) { exchange }.reason
  end

  test "missing permissions malformed and empty page results are rejected" do
    ["null", "[]", "not json", { data: [] }.to_json, { data: [page.merge(access_token: nil)] }.to_json,
     { data: [page.merge(tasks: ["ANALYZE"])] }.to_json, { data: [page], paging: "invalid" }.to_json].each do |body|
      stub_request(:get, %r{/me/accounts}).to_return(body: body)
      assert_raises(FacebookOauth::Error) { exchange }
    end
    stub_request(:get, %r{/me/permissions}).to_return(body: { data: [{ permission: "pages_manage_posts", status: "declined" }] }.to_json)
    assert_raises(FacebookOauth::Error) { exchange }
  end

  test "repeating cursors cannot loop indefinitely" do
    stub_request(:get, %r{/me/accounts}).to_return(body: { data: [page], paging: { next: "next", cursors: { after: "same" } } }.to_json)
    assert_raises(FacebookOauth::Error) { exchange }
    assert_requested :get, %r{/me/accounts}, times: 2
  end

  test "provider diagnostics retain only stage and numeric error codes" do
    stub_request(:get, %r{/oauth/access_token}).to_return(status: 400, body: {
      error: { code: 190, error_subcode: 36_008, message: "private-token", error_user_msg: "private-user" }
    }.to_json)
    error = assert_raises(FacebookOauth::Error) { exchange }
    assert_equal "provider_error", error.reason
    assert_equal "code_exchange", error.stage
    assert_equal 190, error.provider_code
    assert_equal 36_008, error.provider_subcode
    assert_not_includes error.message, "private"
  end

  test "missing permissions and unavailable pages have actionable reasons" do
    stub_request(:get, %r{/me/accounts}).to_return(body: { data: [] }.to_json)
    assert_equal "no_pages", assert_raises(FacebookOauth::Error) { exchange }.reason
    stub_request(:get, %r{/me/permissions}).to_return(body: { data: [] }.to_json)
    assert_equal "missing_permissions", assert_raises(FacebookOauth::Error) { exchange }.reason
  end

  test "http errors and timeouts do not expose provider details" do
    stub_request(:get, %r{/oauth/access_token}).to_return(status: 400, body: "sensitive")
    error = assert_raises(FacebookOauth::Error) { exchange }
    assert_not_includes error.message, "sensitive"
    stub_request(:get, %r{/oauth/access_token}).to_timeout
    assert_raises(FacebookOauth::Error) { exchange }
  end

  private

  def page
    { id: "1", name: "Page", access_token: "page-token", tasks: ["CREATE_CONTENT"] }
  end

  def exchange
    FacebookOauth.exchange(code: "code", redirect_uri: "https://codedorian.com/facebook_connections/callback")
  end
end
