# frozen_string_literal: true

require "test_helper"

class UtilsTest < ActiveSupport::TestCase
  test "join removes blank values and uses the translated separator" do
    assert_equal(
      "first#{I18n.t("utils.join")}second",
      Utils.join(nil, "", "first", "second")
    )
  end
end
