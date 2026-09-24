# frozen_string_literal: true

require "test_helper"

class SubscriptionPriceHelperTest < ActionView::TestCase
  include ApplicationHelper

  test "prices use readable localized amounts and zero labels" do
    {
      en: %w[included free month .],
      fr: %w[inclus gratuit mois ,]
    }.each do |locale, (included, free, month, separator)|
      I18n.with_locale(locale) do
        assert_equal included, subscription_price(0, "eur")
        assert_equal free, subscription_price(0, "eur", total: true)
        assert_equal "5€ / #{month}", subscription_price(500, "EUR")
        assert_equal "5#{separator}50€ / #{month}",
                     subscription_price(550, "eur")
        assert_equal "0#{separator}05€ / #{month}", subscription_price(5, "eur")
        assert_equal "5#{separator}50 USD / #{month}",
                     subscription_price(550, "usd")
        assert_equal "5 GBP / #{month}", subscription_price(500, "gbp")
      end
    end
  end
end
