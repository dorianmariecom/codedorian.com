# frozen_string_literal: true

Rails.application.configure do
  config.active_job.queue_adapter = :test
  config.action_controller.allow_forgery_protection = false
  config.action_controller.perform_caching = false
  config.action_controller.raise_on_missing_callback_actions = true
  config.action_dispatch.show_exceptions = :rescuable
  config.action_mailer.delivery_method = :test
  config.action_mailer.perform_caching = false
  config.action_view.annotate_rendered_view_with_filenames = true
  config.active_record.encryption.encrypt_fixtures = true
  config.active_storage.service = :test
  config.active_support.deprecation = :stderr
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []
  config.cache_classes = false
  config.cache_store = :null_store
  config.consider_all_requests_local = true
  config.eager_load = ENV["CI"].present?
  config.enable_reloading = false
  config.i18n.raise_on_missing_translations = true
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    "Cache-Control" => "public, max-age=#{1.hour.to_i}"
  }
end
