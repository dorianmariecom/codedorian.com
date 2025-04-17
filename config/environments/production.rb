# frozen_string_literal: true

Rails.application.configure do
  config.action_controller.perform_caching = true
  config.action_mailer.perform_caching = false
  config.action_mailer.raise_delivery_errors = true
  config.active_record.dump_schema_after_migration = false
  config.active_storage.service = :local
  config.active_support.report_deprecations = false
  config.assets.compile = false
  config.assume_ssl = true
  config.consider_all_requests_local = false
  config.eager_load = true
  config.enable_reloading = false
  config.force_ssl = true
  config.i18n.fallbacks = true
  config.log_level = :info
  config.log_tags = [:request_id]
  config.public_file_server.enabled = true
  config.require_master_key = ENV["RAILS_MASTER_KEY_DUMMY"].blank?
  config.solid_errors.email_from = "dorian@dorianmarie.com"
  config.solid_errors.email_to = "dorian@dorianmarie.com"
  config.solid_errors.send_emails = true
  config.action_mailer.smtp_settings = Config.smtp_settings.from_deep_struct
  config.logger =
    ActiveSupport::Logger
      .new($stdout)
      .tap { |logger| logger.formatter = Logger::Formatter.new }
      .then { |logger| ActiveSupport::TaggedLogging.new(logger) }
end
