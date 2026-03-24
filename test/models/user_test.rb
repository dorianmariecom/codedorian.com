# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "interface defaults to simple" do
    user = User.new

    assert_equal(:simple, user.interface)
    assert_predicate(user, :simple?)
    assert_not_predicate(user, :advanced?)
  end

  test "interface can be advanced" do
    user = users(:other_user)

    user.interface = :advanced

    assert_equal(:advanced, user.interface)
    assert_predicate(user, :advanced?)
    assert_not_predicate(user, :simple?)
  end
end
