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

  test "show uses fallback metadata when the page description is blank" do
    page = pages(:page)

    get(page_url(page, locale: I18n.locale))

    assert_response(:success)
    assert_select(
      'meta[name="description"][content=?]',
      I18n.t("pages.show.description")
    )
  end
end
