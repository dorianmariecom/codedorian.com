# frozen_string_literal: true

require "test_helper"

class CollectionCacheTest < ActionView::TestCase
  include ApplicationHelper

  setup do
    @previous_cache = controller.cache_store
    @previous_caching = controller.perform_caching
    controller.cache_store = ActiveSupport::Cache::MemoryStore.new
    controller.perform_caching = true
    controller.default_url_options[:locale] = I18n.locale
    Current.user = users(:admin)
  end

  teardown do
    controller.cache_store = @previous_cache
    controller.perform_caching = @previous_caching
    Current.reset
  end

  test "reuses the complete rendered collection" do
    reads = []
    listener = ->(event) { reads << event.payload.slice(:key, :hit) }
    first = nil
    ActiveSupport::Notifications.subscribed(listener, "cache_read.active_support") { first = render_users }
    rendered = []
    subscriber = ->(event) { rendered << event.payload[:identifier] }

    ActiveSupport::Notifications.subscribed(
      subscriber,
      "render_collection.action_view"
    ) { assert_equal first, render_users }

    ActiveSupport::Notifications.subscribed(listener, "cache_read.active_support") { render_users }
    puts reads.inspect
    assert_empty rendered
  end

  test "invalidates when a displayed record changes" do
    first = render_users
    users(:other_user).update_columns(
      description: "changed collection label",
      updated_at: 1.minute.from_now
    )

    updated = render_users
    assert_not_equal first, updated
    assert_includes updated, "changed collection label"
  end

  test "separates content options and viewers" do
    assert_includes render_users, "<a"
    assert_not_includes render_users(content: false), "<a"
    render_users
    Current.user = users(:other_user)
    rendered = []
    subscriber = ->(event) { rendered << event.payload[:identifier] }

    ActiveSupport::Notifications.subscribed(
      subscriber,
      "render_collection.action_view"
    ) { render_users }

    assert_not_empty rendered
  end

  private

  def render_users(content: true)
    render_collection(
      partial: "users/user",
      collection: User.order(:id).page(1).per(100),
      as: :user,
      content:,
      locals: {
        nested: []
      }
    )
  end
end
