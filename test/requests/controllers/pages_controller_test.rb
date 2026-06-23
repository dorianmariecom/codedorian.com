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

  test "shows public page by path" do
    get("/smoke-page")

    assert_response(:success)
  end

  test "returns not found for missing public page" do
    get("/missing-page")

    assert_response(:not_found)
  end

  test "does not route rails-prefixed paths to public pages" do
    assert_raises(ActionController::RoutingError) do
      Rails.application.routes.recognize_path("/rails/missing-page")
    end
  end

  test "does not route localized rails-prefixed paths to public pages" do
    assert_raises(ActionController::RoutingError) do
      Rails.application.routes.recognize_path("/en/rails/missing-page")
    end
  end
end
