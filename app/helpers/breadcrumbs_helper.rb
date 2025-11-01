# frozen_string_literal: true

module BreadcrumbsHelper
  def render_breadcrumbs
    content_tag(:div, class: "p") do
      safe_join(
        @breadcrumbs.map do |breadcrumb|
          link_to(breadcrumb[:text], breadcrumb[:path], class: "link")
        end,
        " / "
      )
    end
  end
end
