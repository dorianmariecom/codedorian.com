# frozen_string_literal: true

require "test_helper"

class LinkTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
  end

  teardown do
    Current.user = nil
  end

  test "requires a supported kind" do
    link = Link.new(kind: "footer", path_input: "/")

    assert_not(link.valid?)
    assert_predicate(link.errors[:kind], :any?)
  end

  test "requires path input" do
    link = Link.new(
      kind: "navigation",
      visibility_input: "Current.user.present?"
    )

    assert_not(link.valid?)
    assert_predicate(link.errors[:path_input], :any?)
  end

  test "orders links by position and id" do
    first = Link.create!(kind: "menu", path_input: "/first", position: 1)
    second = Link.create!(kind: "menu", path_input: "/second", position: 2)

    assert_equal([first, second], Link.menu.ordered.where(id: [first, second]))
  end

  test "selects the localized title with a fallback" do
    link = Link.new(
      title_en: "English",
      title_fr: nil,
      kind: "navigation",
      path_input: "/"
    )

    I18n.with_locale(:fr) { assert_equal("English", link.title) }
  end
end
