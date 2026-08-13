# frozen_string_literal: true

module TabsHelper
  def ios_tabs
    tabs(device: :ios)
  end

  def android_tabs
    tabs(device: :android)
  end

  def tabs(device: :ios)
    platform = device == :ios ? :ios : :android
    context = link_context

    items =
      Link.tabs.ordered.filter_map do |link|
        next unless link.visible?(context: context)

        path = link.path(context: context)
        next if path.blank?

        {
          title: link.title,
          image: link.image(platform),
          path: path,
          default: link.default
        }
      end

    if items.none? { |item| item[:default] } && items.first
      items.first[:default] = true
    end

    items
  end
end
