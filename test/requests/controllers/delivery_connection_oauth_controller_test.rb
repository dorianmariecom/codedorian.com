# frozen_string_literal: true

require "test_helper"

class DeliveryConnectionOauthControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in(email_addresses(:admin_email).email_address, passwords(:password).hint)
  end

  test "logging out during impersonation clears pending oauth before restoring the admin" do
    post connect_delivery_connections_path(provider: "slack")
    state = URI.decode_www_form(URI(response.location).query).to_h.fetch("state")
    post user_impersonate_path(users(:other_user))
    delete login_path
    get callback_delivery_connections_path(provider: "slack"), params: { state: state, code: "code" }
    assert_redirected_to delivery_connections_path
    assert_equal I18n.t("delivery_connections.callback.invalid_state"), flash[:alert]
    assert_not_requested :post, "https://slack.com/api/oauth.v2.access"
  end

  test "logging out and back in consumes pending oauth" do
    post connect_delivery_connections_path(provider: "slack")
    state = URI.decode_www_form(URI(response.location).query).to_h.fetch("state")
    delete login_path
    sign_in(email_addresses(:admin_email).email_address, passwords(:password).hint)
    get callback_delivery_connections_path(provider: "slack"), params: { state: state, code: "code" }
    assert_redirected_to delivery_connections_path
    assert_equal I18n.t("delivery_connections.callback.invalid_state"), flash[:alert]
    assert_not_requested :post, "https://slack.com/api/oauth.v2.access"
  end

  test "oauth state cannot be transferred between providers" do
    post connect_delivery_connections_path(provider: "slack")
    state = URI.decode_www_form(URI(response.location).query).to_h.fetch("state")
    get callback_delivery_connections_path(provider: "x"), params: { state: state, code: "code" }
    assert_equal I18n.t("delivery_connections.callback.invalid_state"), flash[:alert]
    assert_not_requested :post, "https://api.x.com/2/oauth2/token"
  end
end
