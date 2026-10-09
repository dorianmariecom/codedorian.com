# frozen_string_literal: true

require "test_helper"

class PaginationCacheTest < ActiveSupport::TestCase
  include ApplicationHelper

  setup do
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
  end

  teardown { Rails.cache = @previous_cache }

  test "reuses the total across pages and page sizes" do
    expected = User.count
    assert_equal expected,
                 cached_pagination(
                   User.order(id: :asc).page(1).per(1)
                 ).total_count
    hits = []
    subscriber = ->(event) { hits << event.payload[:hit] }

    ActiveSupport::Notifications.subscribed(
      subscriber,
      "cache_read.active_support"
    ) do
      assert_equal expected,
                   cached_pagination(
                     User.order(id: :desc).page(1).per(2)
                   ).total_count
    end

    assert_equal [true], hits
  end

  test "short pages do not query aggregate counts" do
    queries = []
    subscriber = ->(event) { queries << event.payload[:sql] }
    collection = User.order(:id).page(1).per(100)

    ActiveSupport::Notifications.subscribed(subscriber, "sql.active_record") do
      pagination = cached_pagination(collection)
      assert_equal collection.size, pagination.total_count
      assert_equal 1, pagination.total_pages
    end

    assert_equal(1, queries.count { |sql| sql.start_with?("SELECT") })
    assert_empty queries.grep(/COUNT|MAX/)
  end

  test "preserves the current page records and pagination metadata" do
    collection = User.order(:id).page(2).per(1)
    pagination = cached_pagination(collection)

    assert_equal collection.to_a, pagination.to_a
    assert_equal 2, pagination.current_page
    assert_equal collection.total_pages, pagination.total_pages
    assert_equal collection.offset_value, pagination.offset_value
    assert_empty cached_pagination(User.page(100).per(1))
    assert_empty cached_pagination(User.none.page(1))
  end

  test "separates filtered totals and invalidates after insert and delete" do
    assert_equal User.count, cached_pagination(User.page(1)).total_count
    assert_equal 1,
                 cached_pagination(
                   User.where(id: users(:admin).id).page(1)
                 ).total_count

    user = User.create!
    assert_equal User.count, cached_pagination(User.page(1)).total_count
    user.destroy!
    assert_equal User.count, cached_pagination(User.page(1)).total_count
  end

  test "supports distinct relations and Solid Cable messages" do
    scope = User.joins(:names).distinct
    assert_equal scope.count, cached_pagination(scope.page(1)).total_count
    assert_equal SolidCableMessage.count,
                 cached_pagination(SolidCableMessage.page(1)).total_count
  end

  test "preserves grouped totals and maximum page limits" do
    scope = User.group(:admin)
    assert_equal scope.count.size, cached_pagination(scope.page(1)).total_count
    previous_max_pages = User.max_pages
    User.max_pages(1)
    assert_equal 1, cached_pagination(User.page(1).per(1)).total_count
    assert_equal 2, cached_pagination(User.page(1).per(2)).total_count
  ensure
    User.max_pages(previous_max_pages)
  end
end
