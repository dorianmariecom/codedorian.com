# frozen_string_literal: true

module McpApi
  class Catalog
    def self.generate
      Rails.application.eager_load!
      controllers =
        ApplicationController.descendants +
          [StripeWebhooksController, DeliveryCallbacksController]
      actions =
        controllers.to_h do |controller|
          [controller.controller_path, controller.action_methods]
        end
      Rails
        .application
        .routes
        .routes
        .flat_map do |route|
          controller = route.defaults[:controller]
          action = route.defaults[:action]
          next [] unless actions.fetch(controller, []).include?(action)
          next [] if %w[sitemaps delivery_content].include?(controller)

          path =
            route
              .path
              .spec
              .to_s
              .delete_suffix("(.:format)")
              .sub("/(:locale)", "(/:locale)")
          verbs =
            route.verb.presence || "GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS"
          verbs
            .split("|")
            .map do |verb|
              name = [
                verb.downcase,
                path.delete_prefix("(/:locale)").tr(":*", "").split("/")
              ].flatten.compact_blank.join("_")
              name = "#{verb.downcase}_root" if name == verb.downcase
              {
                "name" => name,
                "method" => verb,
                "path" => path,
                "controller" => controller,
                "action" => action
              }
            end
        end
        .uniq
        .sort_by { |endpoint| endpoint.fetch("name") }
    end
  end
end
