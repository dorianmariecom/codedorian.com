# frozen_string_literal: true

require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  include ControllerSmokeHelper

  setup do
    @admin = users(:admin)
    @guest = guests(:guest)
    @other_user = users(:other_user)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  smoke_actions_for "pages"

  test "optional javascript remains importable without being preloaded" do
    get(page_path(pages(:page), locale: I18n.locale))

    assert_response(:success)
    imports =
      JSON.parse(css_select('script[type="importmap"]').sole.text).fetch(
        "imports"
      )
    preloads = css_select('link[rel="modulepreload"]').pluck("href")

    %w[
      lexxy
      lexxy-code
      codemirror
      @codemirror/view
      intl-tel-input
      intl-tel-input/utils
      @googlemaps/js-api-loader
      @hotwired/hotwire-native-bridge
      stripe
      controllers/lexxy_controller
      controllers/editor_controller
      controllers/bridge/menu_controller
    ].each { |name| assert_not_includes(preloads, imports.fetch(name), name) }

    assert_includes(preloads, imports.fetch("application"))
    assert_includes(preloads, imports.fetch("@hotwired/turbo"))
  end

  test "rich text editors declare their lazy loader" do
    get(edit_page_path(pages(:page), locale: I18n.locale))

    assert_response(:success)
    assert_select('lexxy-editor[data-controller="lexxy"]', count: 6)
  end

  test "show uses fallback metadata when the page description is blank" do
    page = pages(:page)

    get(page_url(page, locale: I18n.locale))

    assert_response(:success)
    assert_select(
      'meta[name="description"][content=?]',
      I18n.t("pages.show.description")
    )
  end

  test "an explicit locale on a get does not change the user's locale" do
    page = pages(:page)
    @admin.update!(locale: "en")

    get(page_url(page, locale: :fr))

    assert_response(:success)
    assert_equal("en", @admin.reload.locale)
  end
end
