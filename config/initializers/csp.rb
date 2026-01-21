# frozen_string_literal: true

Rails.application.config.content_security_policy do |policy|
  google_sources = %w[
    https://www.google.com
    https://www.gstatic.com
    https://www.recaptcha.net
  ]

  google_maps_sources = %w[
    https://maps.googleapis.com
    https://places.googleapis.com
    https://maps.gstatic.com
  ]

  sentry_sources = %w[
    https://js-de.sentry-cdn.com
    https://browser.sentry-cdn.com
    https://*.ingest.de.sentry.io
  ]

  hubspot_sources = %w[
    https://*.hs-analytics.net
    https://*.hs-banner.com
    https://*.hs-scripts.com
    https://*.hscollectedforms.net
    https://*.hsforms.com
    https://*.hubapi.com
    https://*.hubspot.com
  ]

  policy.default_src(
    :self,
    :blob,
    :data,
    :unsafe_inline,
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://proxy.dorianmarie.com",
    *google_maps_sources,
    *google_sources,
    *hubspot_sources,
    *sentry_sources
  )
end

Rails.application.config.content_security_policy_report_only = false
