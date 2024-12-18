# frozen_string_literal: true

require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

class Code
  class Application < Rails::Application
    config.load_defaults 7.2
    config.autoload_lib(ignore: %w[assets tasks])
    config.active_job.queue_adapter = :solid_queue
    config.active_record.automatically_invert_plural_associations = true
    config.mission_control.jobs.show_console_help = false
    config.active_support.to_time_preserves_timezone = :zone
    config.exceptions_app = routes
    config.hosts += ENV.fetch("HOSTS").split(",")
    config.active_record.default_column_serializer = JSON
    config.session_store :cookie_store, expire_after: 1.year
    config.hosts.clear
  end
end
