# frozen_string_literal: true

require "test_helper"

class HealthCheckTest < ActionDispatch::IntegrationTest
  test "does not redirect to the canonical host" do
    host!("container")
    https!(false)

    get("/up")

    assert_response(:success)
  end
end
