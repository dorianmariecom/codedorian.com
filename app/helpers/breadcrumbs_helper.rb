module BreadcrumbsHelper
  def render_breadcrumbs
    return if current_page?(root_path)

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
