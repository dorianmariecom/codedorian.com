# frozen_string_literal: true

Sentry.init do |config|
  config.breadcrumbs_logger = %i[active_support_logger http_logger]
  config.dsn = Config.sentry.dsn.ruby
  config.enable_logs = true
  config.enabled_patches = [:logger]
  config.environment = ENV.fetch("CODE_ENV", "localhost")
  config.profiles_sample_rate = 1.0
  config.release = ENV.fetch("KAMAL_VERSION") { `git rev-parse HEAD`.strip }
  config.send_default_pii = true
  config.traces_sample_rate = 1.0
end
