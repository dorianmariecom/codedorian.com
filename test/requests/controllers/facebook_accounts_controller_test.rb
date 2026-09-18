# frozen_string_literal: true

require "test_helper"

class FacebookAccountsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @old_env = %w[FACEBOOK_CLIENT_ID FACEBOOK_CLIENT_SECRET FACEBOOK_CONFIG_ID META_DELIVERY_API_VERSION].index_with { |key| ENV.fetch(key, nil) }
    ENV["FACEBOOK_CLIENT_ID"] = "client"
    ENV["FACEBOOK_CLIENT_SECRET"] = "secret"
    ENV["FACEBOOK_CONFIG_ID"] = "page-config"
    ENV["META_DELIVERY_API_VERSION"] = "v25.0"
    @connection = Current.with(user: users(:admin)) do
      DeliveryConnection.create!(provider: "messenger", name: "Page", sender: "123", access_token: "page-token")
    end
    @channel = DeliveryChannel.create!(key: "messenger", delivery_connection: @connection, enabled: true, amount_cents: 0, show_recipient: true)
    sign_in(email_addresses(:other_email).email_address, passwords(:other_password).hint)
  end

  teardown { @old_env.each { |key, value| ENV[key] = value } }

  test "personal login requests only public profile and stores the person not a page" do
    2.times do |index|
      post facebook_accounts_path
      query = URI.decode_www_form(URI(response.location).query).to_h
      assert_equal "client", query["client_id"]
      assert_equal "public_profile", query["scope"]
      assert_nil query["config_id"]
      assert_equal "code", query["response_type"]
      assert_includes query["redirect_uri"], "/facebook_accounts/callback"
      stub_identity
      assert_difference "FacebookAccount.count", index.zero? ? 1 : 0 do
        assert_no_difference "DeliveryConnection.count" do
          get callback_facebook_accounts_path(locale: nil), params: { code: "code", state: query["state"] }
          assert_redirected_to facebook_accounts_path
        end
      end
    end
    account = FacebookAccount.where_user(users(:other_user)).sole
    assert_equal "Alice", account.name
    assert_equal "456", account.facebook_id
    assert_equal "789", account.messenger_recipient_id
    assert account.ready_for?(@connection)
    assert_not_requested :get, %r{/me/accounts}
    assert_not_requested :get, %r{/me/permissions}
    get facebook_accounts_path
    assert_response :success
    assert_not_includes response.body, "translation missing"
    get facebook_accounts_path, as: :json
    assert_response :success
    assert_equal "Alice", response.parsed_body["data"].sole["name"]
    assert_not_includes response.body, "token"
  end

  test "invalid denied expired and replayed callbacks cannot fetch a profile" do
    post facebook_accounts_path
    state = URI.decode_www_form(URI(response.location).query).to_h["state"]
    get callback_facebook_accounts_path, params: { state: "wrong", code: "code" }
    get callback_facebook_accounts_path, params: { state: state, code: "code" }
    post facebook_accounts_path
    state = URI.decode_www_form(URI(response.location).query).to_h["state"]
    travel 11.minutes do
      get callback_facebook_accounts_path, params: { state: state, code: "code" }
    end
    post facebook_accounts_path
    state = URI.decode_www_form(URI(response.location).query).to_h["state"]
    get callback_facebook_accounts_path, params: { state: state, error: "access_denied" }
    assert_not_requested :get, /graph.facebook.com/
  end

  test "mapping failure keeps the identity but marks messenger unavailable" do
    post facebook_accounts_path
    state = URI.decode_www_form(URI(response.location).query).to_h["state"]
    stub_identity
    stub_request(:get, %r{/456/ids_for_pages}).to_return(status: 400, body: { error: { code: 100, message: "private diagnostic" } }.to_json)
    get callback_facebook_accounts_path, params: { state: state, code: "code" }
    assert_redirected_to facebook_accounts_path
    account = FacebookAccount.where_user(users(:other_user)).sole
    assert_equal "unavailable", account.messenger_status
    assert_nil account.messenger_recipient_id
    assert_not account.ready_for?(@connection)
  end

  test "personal accounts and page connections have separate permissions and oauth state" do
    post facebook_accounts_path
    state = URI.decode_www_form(URI(response.location).query).to_h["state"]
    post facebook_connections_path, as: :json
    assert_response :bad_request
    get callback_facebook_connections_path, params: { state: state, code: "code" }, as: :json
    assert_response :bad_request
    other = FacebookAccount.create!(user: users(:admin), name: "Other", facebook_id: "999")
    post refresh_facebook_account_path(other), as: :json
    assert_response :bad_request
    delete facebook_account_path(other), as: :json
    assert_response :bad_request
    get facebook_accounts_path, as: :json
    assert_response :success
    assert_empty response.parsed_body["data"]
    assert_not_requested :get, /graph.facebook.com/
  end

  test "picker lists owned connected people and saves their mapped recipient" do
    account = FacebookAccount.create!(user: users(:other_user), name: "Alice", facebook_id: "456", messenger_page_id: "123", messenger_recipient_id: "789", messenger_status: "ready")
    other = FacebookAccount.create!(user: users(:admin), name: "Other", facebook_id: "999")
    [new_delivery_destination_path, new_service_subscription_path(services(:service), plan_id: plans(:plan).id)].each do |path|
      get path
      assert_response :success
      assert_select "select[data-delivery-destination-form-target=facebookRecipient] option[value=?]", account.id.to_s, text: "Alice"
      assert_select "select[data-delivery-destination-form-target=facebookRecipient] option[value=?]", other.id.to_s, count: 0
      assert_not_includes response.body, "translation missing"
    end
    post delivery_destinations_path, params: { delivery_destination: { delivery_channel_id: @channel.id, facebook_account_id: account.id, recipient: "injected" } }, as: :json
    assert_response :success
    destination = DeliveryDestination.order(:id).last
    assert_equal account, destination.facebook_account
    assert_equal "789", destination.recipient
    post service_subscriptions_path(services(:service)), params: { subscription: { plan_id: plans(:plan).id, delivery_destinations_attributes: [{ delivery_channel_id: @channel.id, facebook_account_id: account.id }] } }, as: :json
    assert_response :success
    assert_equal account, Subscription.order(:id).last.delivery_destinations.sole.facebook_account
    delete facebook_account_path(account), as: :json
    assert_response :success
    assert_not account.reload.enabled?
    assert_nil account.messenger_recipient_id
  end

  private

  def stub_identity
    stub_request(:get, %r{/oauth/access_token}).to_return(body: { access_token: "personal-token" }.to_json)
    stub_request(:get, "https://graph.facebook.com/v25.0/me")
      .with(query: hash_including("fields" => "id,name"), headers: { "Authorization" => "Bearer personal-token" })
      .to_return(body: { id: "456", name: "Alice" }.to_json)
    stub_request(:get, "https://graph.facebook.com/v25.0/456/ids_for_pages")
      .with(query: hash_including("page" => "123"), headers: { "Authorization" => "Bearer page-token" })
      .to_return(body: { data: [{ id: "789", page: { id: "123" } }] }.to_json)
  end
end
