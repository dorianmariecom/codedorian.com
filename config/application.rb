# frozen_string_literal: true

ENV["SECRET_KEY_BASE_DUMMY"] = "1" if ENV["DUMMY"]

require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

require_relative "../lib/middleware/errors"

module CodeApp
  class Application < Rails::Application
    config.load_defaults 8.1
    config.active_job.queue_adapter = :solid_queue
    config.active_record.automatically_invert_plural_associations = true
    config.active_record.default_column_serializer = JSON
    config.autoload_lib(ignore: %w[assets tasks])
    config.exceptions_app = routes
    config.session_store :cookie_store, expire_after: 1.year
    config.hosts += ENV.fetch("HOSTS", "").split(",")
    config.hosts += %w[::1 127.0.0.1 localhost]
    config.host_authorization = {
      exclude: ->(request) { request.path == "/up" }
    }
    config.i18n.default_locale = :en
    config.i18n.available_locales = %i[en fr]
    config.middleware.insert_before ActionDispatch::RemoteIp, Middleware::Errors
    config.solid_queue.preserve_finished_jobs = false
    config.lograge.enabled = true
    config.lograge.formatter = Lograge::Formatters::Json.new
    config.lograge.logger =
      ActiveSupport::BroadcastLogger.new(
        ActiveSupport::Logger.new($stdout),
        ActiveSupport::Logger.new(Rails.root.join("log", "#{Rails.env}.log"))
      )
    config.lograge.custom_options =
      lambda do |event|
        {
          ddsource: :ruby,
          params: event.payload[:params],
          current_env: Current.env,
          current_user: Current.user.as_json,
          current_guest: Current.guest.as_json,
          current_time_zone: Current.time_zone
        }
      end
  end
end

Config = Rails.application.credentials.to_h.to_deep_struct
