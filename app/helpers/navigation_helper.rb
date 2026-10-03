# frozen_string_literal: true

module NavigationHelper
  def navigation_links
    context = link_context

    navigation_records("navigation").filter_map do |link|
      next unless link.visible?(context: context)

      path = link.path(context: context)
      next if path.blank?

      [link.title, path, link.verb]
    end
  end

  def navigation_records(kind)
    @navigation_records ||= Link.cached_ordered.group_by(&:kind)
    @navigation_records.fetch(kind, [])
  end
end
