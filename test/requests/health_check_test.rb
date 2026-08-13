# frozen_string_literal: true

require "test_helper"

class HealthCheckTest < ActionDispatch::IntegrationTest
  test "redirects other hosts to the canonical host permanently" do
    host!("www.example.com")
    https!(false)

    get("/")

    assert_response(:moved_permanently)
    assert_redirected_to(Current.base_url)
  end

  test "does not redirect to the canonical host" do
    host!("container")
    https!(false)

    get("/up")

    assert_response(:success)
  end
end
