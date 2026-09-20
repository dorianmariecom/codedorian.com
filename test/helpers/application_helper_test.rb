# frozen_string_literal: true

require "test_helper"

class ApplicationHelperTest < ActionView::TestCase
  test "form_with includes recaptcha fields and controller" do
    html = form_with(url: "/confirmation") { "" }
    assert_recaptcha_form(html)
  end

  test "form_for includes recaptcha only once through form_with" do
    html = form_for(:confirmation, url: "/confirmation") { "" }
    assert_recaptcha_form(html)
  end

  test "button_to includes recaptcha only once" do
    html = button_to("confirm", "/confirmation")
    assert_recaptcha_form(html)
  end

  test "describes every supported schedule interval in both locales" do
    ScheduleConcern::INTERVALS
      .product(%i[en fr])
      .each do |interval, locale|
        I18n.with_locale(locale) do
          schedule =
            PlanSchedule.new(
              interval: interval,
              starts_at: Time.utc(2026, 8, 4, 10)
            )

          assert_predicate(
            plan_schedule_description(schedule),
            :present?,
            interval
          )
        end
      end
  end

  test "describes calendar intervals using the viewer time zone" do
    Time.use_zone("America/Los_Angeles") do
      assert_equal("every tuesday at 3:00am", description_for("1 week"))
      assert_equal(
        "every 2 weeks on tuesday at 3:00am",
        description_for("2 weeks")
      )
      assert_equal(
        "every first monday of the month at 3:00am",
        description_for("first monday")
      )
      assert_equal(
        "every month on the 4th at 3:00am",
        description_for("1 month")
      )
      assert_equal(
        "every 2 months on the 4th at 3:00am",
        description_for("2 months")
      )
      assert_equal(
        "every year on august 4th at 3:00am",
        description_for("1 year")
      )
      assert_equal(
        "every 2 years on august 4th at 3:00am",
        description_for("2 years")
      )
    end
  end

  private

  def assert_recaptcha_form(html)
    form = Nokogiri::HTML.fragment(html).at_css("form")
    assert_equal 1, form.css('[data-controller="recaptcha"]').size
    assert_equal 1, form.css('input[name="g-recaptcha-response"]').size
    actions = form.css('input[name="g-recaptcha-action"]')
    assert_equal 1, actions.size
    assert_equal "post/confirmation", actions.first["value"]
  end

  def description_for(interval)
    I18n.with_locale(:en) do
      plan_schedule_description(
        PlanSchedule.new(
          interval: interval,
          starts_at: Time.utc(2026, 8, 4, 10)
        )
      )
    end
  end
end
