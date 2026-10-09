# frozen_string_literal: true

require "test_helper"

class McpCatalogTest < ActiveSupport::TestCase
  test "every application endpoint is cataloged" do
    assert_equal McpApi::Catalog.generate,
                 McpApi::Server.definitions,
                 "Run bin/rails mcp:catalog after changing routes or controller actions"
    names = McpApi::Server.definitions.pluck("name")
    assert_equal names.uniq, names
    assert(names.all? { |name| name.match?(/\A[a-z0-9_.-]{1,128}\z/) })
  end
  test "API dispatch restores the surrounding identity locale and time zone" do
    locale = I18n.locale
    Current.with(
      user: users(:other_user),
      locale: locale,
      time_zone: "Europe/Paris"
    ) do
      response =
        McpApi::Request.new(
          origin: Current.base_url,
          token: tokens(:token).token,
          ip: "127.0.0.1"
        ).call(method: "GET", path: "/en/configurations", body: "")
      assert_not response.error?
      assert_equal users(:other_user), Current.user
      assert_equal locale.to_s, Current.locale.to_s
      assert_equal locale, I18n.locale
      assert_equal "Europe/Paris", Time.zone.name
    end
  end
end
