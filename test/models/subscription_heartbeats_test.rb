# frozen_string_literal: true

require "test_helper"

class SubscriptionHeartbeatsModelTest < ActiveSupport::TestCase
  test "heartbeats url accepts blank and arbitrary http or https websites" do
    Current.with(user: users(:admin)) do
      subscription = subscriptions(:subscription)
      [
        nil,
        "",
        " ",
        "https://heartbeats.dorianmarie.com",
        "http://example.com/check?token=abc",
        " https://example.com/status "
      ].each do |url|
        subscription.heartbeats_url = url
        assert(
          subscription.valid?,
          subscription.errors.full_messages.to_sentence
        )
        if url.blank?
          assert_nil(subscription.heartbeats_url)
        else
          assert_equal(url.strip, subscription.heartbeats_url)
        end
      end
    end
  end

  test "heartbeats url rejects malformed urls and unsafe schemes" do
    Current.with(user: users(:admin)) do
      subscription = subscriptions(:subscription)
      [
        "example.com",
        "/status",
        "https://",
        "https://exa mple.com",
        "javascript:alert(1)",
        "data:text/html,test",
        "ftp://example.com"
      ].each do |url|
        subscription.heartbeats_url = url
        assert_not(subscription.valid?)
        assert_includes(
          subscription.errors[:heartbeats_url],
          I18n.t("errors.messages.invalid")
        )
      end
    end
  end
end
