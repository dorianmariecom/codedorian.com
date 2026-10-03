# frozen_string_literal: true

require "test_helper"

class CachingTest < ActionDispatch::IntegrationTest
  setup do
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
  end

  teardown do
    Rails.cache = @previous_cache
    Current.reset
  end

  test "counts reuse queries and separate owner filters" do
    programs(:other_program).update_columns(user_id: users(:admin).id)
    helper = ApplicationController.helpers
    records = Program.where_user(users(:admin))
    other_records = Program.where_user(users(:other_user))
    expected = records.count
    other_expected = other_records.count
    assert_not_equal(expected, other_expected)

    assert_equal(expected, helper.cached_count(records))
    assert_equal(other_expected, helper.cached_count(other_records))

    queries = []
    subscriber = ->(event) { queries << event.payload[:sql] }
    ActiveSupport::Notifications.subscribed(subscriber, "sql.active_record") do
      assert_equal(
        expected,
        helper.cached_count(Program.where_user(users(:admin)))
      )
      assert_equal(other_expected, helper.cached_count(other_records))
    end
    assert_empty(queries.grep(/COUNT\(/i))
  end

  test "counts refresh after thirty seconds" do
    helper = ApplicationController.helpers
    records = Program.where(id: programs(:program).id, name: "cached count")
    assert_equal(0, helper.cached_count(records))

    programs(:program).update_columns(name: "cached count")
    assert_equal(0, helper.cached_count(records))

    travel(31.seconds) { assert_equal(1, helper.cached_count(records)) }
  end

  test "cached counts do not bypass authorization" do
    ApplicationController.helpers.cached_count(JobContext.all)
    Current.user = users(:other_user)

    html =
      ApplicationController.render(
        partial: "shared/count",
        locals: {
          records: JobContext.all,
          translation: "job_contexts",
          url: "/job_contexts"
        }
      )

    assert_empty(Nokogiri::HTML.fragment(html).css("div, a"))
  end

  test "highlighting reuses output while separating language and input" do
    helper = ApplicationController.helpers
    generated = []
    subscriber = ->(event) { generated << event.payload[:key] }
    ActiveSupport::Notifications.subscribed(
      subscriber,
      "cache_generate.active_support"
    ) do
      code = helper.syntax_highlight("if true", language: :code)
      assert_equal(code, helper.syntax_highlight("if true", language: "code"))
      assert_not_equal(
        code,
        helper.syntax_highlight("if true", language: :json)
      )
      assert_not_equal(
        code,
        helper.syntax_highlight("if false", language: :code)
      )
    end
    assert_equal(3, generated.size)

    2.times do
      html =
        helper.syntax_highlight('"<script>alert(1)</script>"', language: :json)
      assert_not_includes(html, "<script>")
      assert_includes(html, "&lt;script&gt;")
    end
  end

  test "sitemap cache refreshes when public visibility changes" do
    get("/sitemap.xml")
    assert_response(:success)
    assert_includes(response.body, "/other-page")
    original = response.body

    generated = []
    subscriber = ->(event) { generated << event.payload[:key] }
    ActiveSupport::Notifications.subscribed(
      subscriber,
      "cache_generate.active_support"
    ) do
      get("/sitemap.xml")
      assert_equal(original, response.body)
    end
    assert_empty(generated)

    pages(:other_page).update_columns(authorization_input: "false")
    get("/sitemap.xml")
    assert_response(:success)
    assert_not_includes(response.body, "/other-page")
  end

  test "sitemap cache refreshes when a page path changes" do
    get("/sitemap.xml")
    assert_response(:success)

    travel(1.minute) do
      pages(:other_page).update_columns(
        path: "/renamed-page",
        updated_at: Time.current
      )
      get("/sitemap.xml")
      assert_response(:success)
      assert_includes(response.body, "/renamed-page")
      assert_not_includes(response.body, "/other-page")
    end
  end
end
