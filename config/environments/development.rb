# frozen_string_literal: true

Rails.application.configure do
  config.action_controller.perform_caching = false
  config.action_controller.raise_on_missing_callback_actions = true
  config.action_mailer.perform_caching = false
  config.action_mailer.perform_deliveries = true
  config.action_mailer.preview_paths << Rails
    .root
    .join("spec/mailers/previews")
    .to_s
  config.action_mailer.raise_delivery_errors = true
  config.action_view.annotate_rendered_view_with_filenames = true
  config.active_job.verbose_enqueue_logs = true
  config.active_record.migration_error = :page_load
  config.active_record.verbose_query_logs = true
  config.active_storage.service = :local
  config.active_support.deprecation = :log
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []
  config.assets.quiet = true
  config.cache_store = :null_store
  config.consider_all_requests_local = true
  config.eager_load = false
  config.enable_reloading = true
  config.i18n.raise_on_missing_translations = true
  config.server_timing = true
  config.action_mailer.smtp_settings =
    Config.smtp_settings
end
