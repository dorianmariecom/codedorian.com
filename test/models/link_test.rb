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

  test "seeded login links use the session route" do
    login_links = Link.where(title_en: "log in")

    assert_predicate(login_links, :any?)
    assert(login_links.all? { |link| link.path_input == '"/session/new"' })
  end

  test "evaluates simple and advanced user interface predicates" do
    context = {}

    Current.user = users(:other_user)
    Current.user.update!(interface: :simple)
    assert(Link.new(visibility_input: "Current.user&.simple?").visible?(context: context))
    assert_not(Link.new(visibility_input: "Current.user&.advanced?").visible?(context: context))

    Current.user.update!(interface: :advanced)
    assert(Link.new(visibility_input: "Current.user&.advanced?").visible?(context: context))
    assert_not(Link.new(visibility_input: "Current.user&.simple?").visible?(context: context))
  end

  test "safe user predicates are false without a current user" do
    Current.user = nil

    assert_not(
      Link
        .new(visibility_input: "Current.user&.advanced?")
        .visible?(context: {})
    )
    assert_not(
      Link.new(visibility_input: "Current.user&.simple?").visible?(context: {})
    )
  end

  test "code errors in link expressions are not hidden" do
    assert_raises(Code::Error) do
      Link.new(visibility_input: "Current.user.unknown?").visible?(context: {})
    end
  end
end
