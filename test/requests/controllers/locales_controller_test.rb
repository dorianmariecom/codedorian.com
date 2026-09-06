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

  test "switching language preserves the subscription destination across authentication pages" do
    Current.with(user: @admin) do
      Link.create!(
        kind: "navigation",
        verb: "post",
        title_en: "switch language",
        title_fr: "changer de langue",
        path_input: "switch_locale_url"
      )
    end

    %i[new_user_path new_login_path new_magic_link_login_path]
      .product(%i[en fr])
      .each do |page, original_locale|
        selected_locale = original_locale == :en ? :fr : :en
        destination =
          new_service_subscription_path(
            services(:service),
            locale: original_locale,
            subscription: {
              plan_id: plans(:plan).id
            }
          )
        logged_out_session = canonical_session
        page_params = {
          plan_id: plans(:plan).id,
          redirect_to: destination,
          page: "2",
          search: {
            query: "birthday & email",
            channels: %w[email push]
          }
        }
        logged_out_session.get(
          public_send(page, **page_params, locale: original_locale)
        )
        logged_out_session.assert_response(:success)

        switch_form =
          logged_out_session
            .response
            .parsed_body
            .css("form")
            .find do |form|
              URI.parse(form["action"]).path ==
                locale_path(
                  locale: original_locale,
                  selected_locale: selected_locale
                )
            end
        assert(switch_form, "expected a language switch form")
        logged_out_session.post(switch_form["action"])
        logged_out_session.assert_redirected_to(
          public_send(page, **page_params, locale: selected_locale)
        )
        logged_out_session.follow_redirect!
        logged_out_session.assert_select("html[lang=?]", selected_locale.to_s)
        logged_out_session.assert_select(
          "input[name=redirect_to][value=?]",
          destination
        )
        logged_out_session.assert_select(
          "a[href=?]",
          public_send(
            page == :new_login_path ? :new_user_path : :new_login_path,
            locale: selected_locale,
            plan_id: plans(:plan).id,
            redirect_to: destination
          )
        )
      end
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
