# frozen_string_literal: true

require "test_helper"

class CountPartialTest < ActiveSupport::TestCase
  teardown { Current.reset }

  test "unauthorized counts are not queried or rendered" do
    Current.user = users(:other_user)
    queries = []
    subscriber = ->(event) { queries << event.payload[:sql] }
    html = nil

    ActiveSupport::Notifications.subscribed(subscriber, "sql.active_record") do
      html =
        ApplicationController.render(
          partial: "shared/count",
          locals: {
            records: JobContext.all,
            translation: "job_contexts",
            url: "/job_contexts"
          }
        )
    end

    assert_empty(Nokogiri::HTML.fragment(html).css("div, a"))
    assert_empty(queries.grep(/COUNT\(/i))
  end

  test "count labels have zero one and other forms in both locales" do
    Current.user = users(:admin)
    translations = I18n.t("shared.count")

    translations.each_value do |forms|
      assert_equal(%i[one other zero], forms.keys.sort)
    end

    [0, 1, 2].each do |count|
      html =
        ApplicationController.render(
          partial: "shared/count",
          locals: {
            records: Program.limit(count),
            translation: "programs",
            url: "/programs"
          }
        )
      label = I18n.t("shared.count.programs", count: count)

      assert_includes(html, label)
      assert_includes(html, 'href="/programs"')
    end
  end
end
