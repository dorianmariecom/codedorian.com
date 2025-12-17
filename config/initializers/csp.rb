# frozen_string_literal: true

Rails.application.config.content_security_policy do |policy|
  policy.default_src(
    :self,
    "blob:",
    "'unsafe-inline'",
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://maps.googleapis.com",
    "https://fonts.googleapis.com",
    "https://maps.gstatic.com",
    "https://fonts.gstatic.com",
    "https://places.googleapis.com",
    "https://proxy.dorianmarie.com",
    "https://js-de.sentry-cdn.com",
    "https://browser.sentry-cdn.com",
    "https://*.ingest.de.sentry.io"
  )
end

Rails.application.config.content_security_policy_report_only = false
