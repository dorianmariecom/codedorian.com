# frozen_string_literal: true

module NavigationHelper
  def navigation_links
    context = link_context

    Link.navigation.ordered.filter_map do |link|
      next unless link.visible?(context: context)

      path = link.path(context: context)
      next if path.blank?

      [link.title, path, link.verb]
    end
  end
end
