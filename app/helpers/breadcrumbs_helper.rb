# frozen_string_literal: true

module BreadcrumbsHelper
  def render_breadcrumbs
    content_tag(:div, class: "p") do
      safe_join(
        @breadcrumbs.map do |breadcrumb|
          link_to(breadcrumb[:text], breadcrumb[:path], class: "link")
        end,
        safe_join([" ", heroicon("chevron-right", options: { class: "inline-block" })])
      )
    end
  end
end
