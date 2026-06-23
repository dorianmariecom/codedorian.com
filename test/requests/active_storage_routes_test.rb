# frozen_string_literal: true

require "test_helper"

class ActiveStorageRoutesTest < ActionDispatch::IntegrationTest
  test "routes direct uploads before public pages catch all" do
    assert_recognizes_active_storage(
      "/rails/active_storage/direct_uploads",
      method: :post,
      controller: "active_storage/direct_uploads",
      action: "create"
    )
  end

  test "routes disk uploads before public pages catch all" do
    assert_recognizes_active_storage(
      "/rails/active_storage/disk/token",
      method: :put,
      controller: "active_storage/disk",
      action: "update"
    )
  end

  private

  def assert_recognizes_active_storage(path, method:, controller:, action:)
    route = Rails.application.routes.recognize_path(path, method: method)

    assert_equal(controller, route.fetch(:controller))
    assert_equal(action, route.fetch(:action))
  end
end
