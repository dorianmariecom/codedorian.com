# frozen_string_literal: true

require "test_helper"

class ErrorsControllerTest < ActionDispatch::IntegrationTest
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

  smoke_actions_for "errors"

  test "not acceptable renders the error page for html and unsupported formats" do
    %w[text/html application/xml].each do |accept|
      assert_difference("Log.where(message: :not_acceptable).count", 1) do
        get("/#{I18n.locale}/406", headers: { "Accept" => accept })
      end

      assert_response(:not_acceptable)
      assert_equal("text/html", response.media_type)
      assert_select("title", text: /#{I18n.t("errors.not_acceptable.title")}/)
    end
  end

  test "unsupported formats use the not acceptable error page" do
    detailed_exceptions =
      Rails.application.env_config["action_dispatch.show_detailed_exceptions"]
    Rails.application.env_config[
      "action_dispatch.show_detailed_exceptions"
    ] = false

    assert_difference("Log.where(message: :not_acceptable).count", 1) do
      get(pages_url, headers: { "Accept" => "application/xml" })
    end

    assert_response(:not_acceptable)
    assert_equal("text/html", response.media_type)
  ensure
    Rails.application.env_config[
      "action_dispatch.show_detailed_exceptions"
    ] = detailed_exceptions
  end

  test "not acceptable returns a json error response" do
    get("/#{I18n.locale}/406", headers: { "Accept" => "application/json" })

    assert_response(:not_acceptable)
    assert_equal("not_acceptable", response.parsed_body.fetch("status"))
  end

  test "internal server error ignores flat search params" do
    get("/500", params: { search: "secret" })

    assert_response(:internal_server_error)
  end
end
