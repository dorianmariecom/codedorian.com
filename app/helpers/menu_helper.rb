# frozen_string_literal: true

module MenuHelper
  def ios_menu
    menu(platform: :ios)
  end

  def android_menu
    menu(platform: :android)
  end

  def menu(platform:)
    context = link_context

    Link.menu.ordered.filter_map do |link|
      next unless link.visible?(context: context)

      path = link.path(context: context)
      next if path.blank?

      {
        title: link.title,
        image: link.image(platform),
        path: path,
        verb: link.verb
      }
    end
  end

end
