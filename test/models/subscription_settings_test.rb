# frozen_string_literal: true

require "test_helper"

class SubscriptionSettingsTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @subscription = subscriptions(:subscription)
  end

  teardown { Current.reset }

  def setting(kind, **)
    ServiceField.new(kind: kind, **)
  end

  test "integers lists defaults and ranges are typed and validated" do
    field =
      setting("integer_list", default_value: "10,30", minimum: 1, maximum: 120)
    assert_equal [10, 30], SubscriptionSetting.parse(field, "")
    assert_raises(ArgumentError) { SubscriptionSetting.parse(field, "0,30") }
    assert_raises(ArgumentError) { SubscriptionSetting.parse(field, "1.5,30") }
    assert_raises(ArgumentError) do
      SubscriptionSetting.parse(setting("number"), "NaN")
    end
    assert_equal %w[one two],
                 SubscriptionSetting.parse(
                   setting("string_list"),
                   " one, two, one "
                 )
  end

  test "birthdays dates time zones and methods reject malformed settings" do
    assert_equal "2000-02-29",
                 SubscriptionSetting
                   .parse(setting("birthdays"), "Someone Here 2000-02-29")
                   .first
                   .fetch("birthday")
    assert_raises(ArgumentError) do
      SubscriptionSetting.parse(setting("birthdays"), "Someone 2001-02-29")
    end
    assert_raises(ArgumentError) do
      SubscriptionSetting.parse(setting("date"), "2026-1-1")
    end
    assert_raises(ArgumentError) do
      SubscriptionSetting.parse(setting("time_zone"), "invalid")
    end
    assert_equal "Europe/Paris",
                 SubscriptionSetting.parse(setting("time_zone"), "Europe/Paris")
    assert_equal "post",
                 SubscriptionSetting.parse(setting("http_method"), "POST")
    assert_raises(ArgumentError) do
      SubscriptionSetting.parse(setting("http_method"), "trace")
    end
  end

  test "field defaults appear in code settings and invalid values have localized errors" do
    field =
      @subscription.service.service_fields.create!(
        key: "reminders",
        name_en: "reminders",
        name_fr: "rappels",
        kind: "integer_list",
        position: 10,
        default_value: "10,30",
        minimum: 1,
        maximum: 120,
        required: true
      )
    Current.subscription = @subscription
    assert_equal [10, 30],
                 Code.evaluate("Current.subscription.values.reminders").as_json
    value = @subscription.subscription_values.new(key: field.key, value: "121")
    assert_not value.valid?
    assert_includes value.errors[:value], I18n.t("errors.messages.invalid")
    value.value = "5,15"
    assert value.valid?, value.errors.full_messages.to_sentence
    assert_equal [5, 15], value.typed_value
  end
end
