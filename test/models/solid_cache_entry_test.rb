# frozen_string_literal: true

require "test_helper"

class SolidCacheEntryTest < ActiveSupport::TestCase
  test "accepts empty base64 value payloads" do
    Current.user = users(:admin)

    entry = solid_cache_entries(:solid_cache_entry)
    entry.value_base64 = ""

    assert(entry.valid?(:controller))
    assert_equal("", entry.value)
  ensure
    Current.user = nil
  end
end
