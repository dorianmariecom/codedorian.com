# frozen_string_literal: true

require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

require_relative "../lib/middleware/errors"

module CodeApp
  class Application < Rails::Application
    config.load_defaults 8.0
    config.active_job.queue_adapter = :solid_queue
    config.active_record.automatically_invert_plural_associations = true
    config.active_record.default_column_serializer = JSON
    config.active_support.to_time_preserves_timezone = :zone
    config.autoload_lib(ignore: %w[assets tasks])
    config.exceptions_app = routes
    config.mission_control.jobs.http_basic_auth_enabled = false
    config.mission_control.jobs.show_console_help = false
    config.session_store :cookie_store, expire_after: 1.year
    config.hosts += ENV.fetch("HOSTS").split(",")
    config.hosts += %w[::1 127.0.0.1 localhost]
    config.host_authorization = {
      exclude: ->(request) { request.path == "/up" }
    }
    config.i18n.default_locale = :en
    config.i18n.available_locales = %i[en fr]
    config.middleware.insert_before ActionDispatch::RemoteIp, Middleware::Errors
    config.solid_queue.preserve_finished_jobs = false
  end
end

Config = Rails.application.credentials.to_h.to_deep_struct
