# frozen_string_literal: true

require "test_helper"

class LocalesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin = users(:admin)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  test "post persists the selected locale and redirects to the localized page" do
    post(
      locale_path(selected_locale: :fr),
      params: {
        redirect_to: "/fr/about"
      }
    )

    assert_redirected_to("/fr/about")
    assert_equal("fr", @admin.reload.locale)
  end

  test "post rejects an external redirect" do
    post(
      locale_path(selected_locale: :fr),
      params: {
        redirect_to: "//example.com"
      }
    )

    assert_redirected_to(root_path(locale: :fr))
    assert_equal("fr", @admin.reload.locale)
  end

  test "post stores the selected locale in a session cookie when logged out" do
    logged_out_session = canonical_session

    logged_out_session.post(locale_path(selected_locale: :fr))

    assert_equal("fr", logged_out_session.response.cookies["locale"])
  end

  test "logged out requests use the locale cookie" do
    logged_out_session = canonical_session
    logged_out_session.post(locale_path(selected_locale: :fr))
    logged_out_session.get("/users")

    logged_out_session.assert_select("html[lang='fr']")
  end

  private

  def canonical_session
    uri = URI.parse(Current.base_url)

    open_session.tap do |logged_out_session|
      logged_out_session.https!(uri.scheme == "https")
      logged_out_session.host!(
        [uri.host, (uri.port unless uri.port == uri.default_port)].compact.join(
          ":"
        )
      )
    end
  end
end
