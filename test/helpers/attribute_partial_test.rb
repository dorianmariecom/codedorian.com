# frozen_string_literal: true

require "test_helper"

class AttributePartialTest < ActionView::TestCase
  include ApplicationHelper

  setup do
    controller.default_url_options[:locale] = I18n.locale
    view.extend(Pundit::Authorization)
    view.extend(CanConcern)
    def view.pundit_user
      Current.user
    end
  end

  test "links different model types when authorized" do
    Current.with(user: users(:admin)) do
      [
        users(:admin),
        programs(:program),
        jobs(:job),
        plans(:plan),
        services(:service)
      ].each do |value|
        html =
          render(
            "shared/attribute",
            label: "record",
            value: value,
            type: :record
          )
        link = Nokogiri::HTML.fragment(html).at_css("a.link")

        assert_equal polymorphic_path(value), link["href"]
        assert_equal value.to_s, link.text
      end
    end
  end

  test "preserves nested routes" do
    Current.with(user: users(:admin)) do
      value = programs(:program)
      url = [value.user, value]
      html =
        render(
          "shared/attribute",
          label: "program",
          value: value,
          type: :record,
          url: url
        )

      assert_equal polymorphic_path(url),
                   Nokogiri::HTML.fragment(html).at_css("a")["href"]
    end
  end

  test "renders unauthorized models as text" do
    Current.with(user: users(:other_user)) do
      [users(:admin), programs(:program), jobs(:job)].each do |value|
        html =
          render(
            "shared/attribute",
            label: "record",
            value: value,
            type: :record
          )
        fragment = Nokogiri::HTML.fragment(html)

        assert_empty fragment.css("a")
        assert_equal value.to_s, fragment.at_css(".font-bold").text.strip
      end
    end
  end

  test "renders missing and unsaved models without links" do
    [nil, Program.new(name: "draft")].each do |value|
      html =
        render("shared/attribute", label: "record", value: value, type: :record)

      assert_empty Nokogiri::HTML.fragment(html).css("a")
    end
  end

  test "escapes text and renders zero" do
    ["<script>alert(1)</script>", 0].each do |value|
      html = render("shared/attribute", label: "<b>label</b>", value: value)
      fragment = Nokogiri::HTML.fragment(html)

      assert_empty fragment.css("script, b")
      assert_equal "<b>label</b>", fragment.at_css(".text-gray-600").text
      assert_equal value.to_s, fragment.at_css(".font-bold").text
    end
  end

  test "hides blank labels and values" do
    [nil, "", " ", false].each do |value|
      assert_empty Nokogiri::HTML.fragment(
                     render("shared/attribute", label: "value", value: value)
                   ).css("div")
      assert_empty Nokogiri::HTML.fragment(
                     render("shared/attribute", label: value, value: "value")
                   ).css("div")
    end
  end

  test "escapes unwrapped content" do
    %i[content json code].each do |type|
      html =
        render(
          "shared/attribute",
          label: "value",
          value: "<script>alert(1)</script>",
          type: type
        )
      assert_empty Nokogiri::HTML.fragment(html).css("script")
    end
  end

  test "links editable code to the supplied url" do
    html =
      render(
        "shared/attribute",
        label: "code",
        value: "1 + 2",
        type: :code,
        url: "/programs/1/edit"
      )
    link = Nokogiri::HTML.fragment(html).at_css("a.block")

    assert_equal "/programs/1/edit", link["href"]
    assert_equal "1 + 2", link.at_css(".code").text
  end

  test "renders timestamps for local time" do
    value = Time.utc(2026, 9, 21, 12)
    html = render("shared/attribute", label: "time", value: value, type: :time)
    time = Nokogiri::HTML.fragment(html).at_css("time")

    assert_equal value.iso8601, time["datetime"]
    assert_equal "time", time["data-local"]
  end

  test "localizes dates" do
    value = Date.new(2026, 9, 21)
    html = render("shared/attribute", label: "date", value: value, type: :date)

    assert_equal I18n.l(value),
                 Nokogiri::HTML.fragment(html).at_css(".font-bold").text
  end

  test "masks passwords" do
    html =
      render(
        "shared/attribute",
        label: "password",
        value: "secret-digest",
        type: :password
      )

    assert_equal "***", Nokogiri::HTML.fragment(html).at_css(".font-bold").text
    assert_not_includes html, "secret-digest"
  end

  test "renders links" do
    html =
      render(
        "shared/attribute",
        label: "url",
        value: "https://example.com",
        type: :link
      )

    assert_equal "https://example.com",
                 Nokogiri::HTML.fragment(html).at_css("a.link")["href"]
  end

  test "highlights json and code without rendering embedded html" do
    {
      json: '{"html":"<script>alert(1)</script>"}',
      code: 'puts "<script>alert(1)</script>"'
    }.each do |type, value|
      html =
        render("shared/attribute", label: "content", value: value, type: type)
      fragment = Nokogiri::HTML.fragment(html)

      assert_empty fragment.css("script")
      assert_equal value, fragment.at_css(".code").text
    end
  end
end
