# frozen_string_literal: true

require "application_system_test_case"

class StaticPagesTest < ApplicationSystemTestCase
  test "visit static pages" do
    visit root_path
    assert_selector("body")

    visit about_path
    assert_selector("body")

    visit terms_path
    assert_selector("body")

    visit privacy_path
    assert_selector("body")

    visit download_path
    assert_selector("body")
  end
end
