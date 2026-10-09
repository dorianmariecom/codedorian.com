# frozen_string_literal: true

require "test_helper"

class CurrentTimeZoneTest < ActiveSupport::TestCase
  setup do
    @controller = ApplicationController.new
    @controller.request =
      ActionController::TestRequest.create(ApplicationController)
  end

  test "saved user zone takes precedence over session" do
    @controller.session[:time_zone] = "Asia/Tokyo"
    Current.with(user: users(:admin)) do
      assert_equal(
        "America/Los_Angeles",
        @controller.view_context.current_time_zone
      )
    end
  end

  test "guests use session then application default" do
    Current.with(user: nil, guest: Guest.new) do
      @controller.session[:time_zone] = "Asia/Tokyo"
      assert_equal("Asia/Tokyo", @controller.view_context.current_time_zone)
      @controller.session.delete(:time_zone)
      assert_equal(
        Rails.application.config.time_zone,
        @controller.view_context.current_time_zone
      )
    end
  end

  test "users without a saved zone use the session" do
    @controller.session[:time_zone] = "Asia/Tokyo"
    Current.with(user: User.new) do
      assert_equal("Asia/Tokyo", @controller.view_context.current_time_zone)
    end
  end
end
