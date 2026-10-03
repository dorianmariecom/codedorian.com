# frozen_string_literal: true

require "test_helper"

class NavigationCacheTest < ActiveSupport::TestCase
  class View
    include NavigationHelper
    include MenuHelper
    include TabsHelper

    attr_accessor :link_context

    def initialize
      @link_context = { "locale_prefix" => "/#{I18n.locale}" }
    end
  end

  setup do
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
  end

  teardown do
    Rails.cache = @previous_cache
    Current.reset
  end

  test "cached definitions avoid fetching link rows on subsequent requests" do
    expected = Link.ordered.map(&:attributes)
    assert_equal(expected, Link.cached_ordered.map(&:attributes))

    queries = []
    subscriber = ->(event) { queries << event.payload[:sql] }
    ActiveSupport::Notifications.subscribed(subscriber, "sql.active_record") do
      assert_equal(expected, Link.cached_ordered.map(&:attributes))
    end

    assert_empty(queries.grep(/SELECT "links"\.\*/))
  end

  test "web menus and tabs share one set of definitions per render" do
    view = View.new
    view.navigation_links

    queries = []
    subscriber = ->(event) { queries << event.payload[:sql] }
    ActiveSupport::Notifications.subscribed(subscriber, "sql.active_record") do
      view.ios_menu
      view.android_menu
      view.ios_tabs
      view.android_tabs
    end

    assert_empty(queries.grep(/FROM "links"/))
  end

  test "cached definitions preserve live identity visibility locale and native images" do
    Link.cached_ordered
    Current.user = users(:other_user)
    Current.user.update!(interface: "advanced")
    view = View.new

    %i[en fr].each do |locale|
      I18n.with_locale(locale) do
        view.link_context = { "locale_prefix" => "/#{locale}" }
        title = locale == :fr ? "données" : "data"
        path = "/#{locale}/users/#{Current.user.id}/data"
        assert_includes(view.navigation_links, [title, path, "get"])
        assert_equal("externaldrive.fill", view.ios_menu.first[:image])
        assert_equal("storage", view.android_menu.first[:image])
        assert_equal(path, view.ios_tabs.first[:path])
        assert_equal(path, view.android_tabs.first[:path])
        assert(view.ios_tabs.first[:default])
      end
    end

    Current.user.update!(interface: "simple")
    assert_empty(view.ios_menu)
    assert_empty(view.android_tabs)
    assert_not(
      view.navigation_links.any? { |_, path, _| path.include?("/data") }
    )

    Current.user = users(:admin)
    Current.user.update!(interface: "advanced")
    assert_includes(
      view.ios_menu.first[:path],
      "/users/#{Current.user.id}/data"
    )

    Current.user = nil
    assert_empty(view.ios_menu)
    assert_empty(view.ios_tabs)
  end

  test "edits insertions and direct deletions invalidate cached definitions" do
    Link.cached_ordered
    Current.user = users(:admin)
    link = links(:link)

    travel(1.minute) do
      link.update!(title_en: "updated", position: -10, kind: "menu")
      assert_equal("updated", Link.cached_ordered.first.title_en)
      assert_equal("menu", Link.cached_ordered.first.kind)
    end

    added = Link.create!(kind: "tabs", path_input: '"/new"', verb: "get")
    assert_includes(Link.cached_ordered.map(&:id), added.id)

    added.delete
    assert_not_includes(Link.cached_ordered.map(&:id), added.id)

    Link.where(id: link.id).delete_all
    assert_not_includes(Link.cached_ordered.map(&:id), link.id)
  end
end
