# frozen_string_literal: true

Rails.application.config.content_security_policy do |policy|
  google_sources = %w[
    https://www.google.com
    http://www.google.com
    https://www.gstatic.com
    http://www.gstatic.com
    https://www.recaptcha.net
    http://www.recaptcha.net
  ]

  google_maps_sources = %w[
    https://maps.googleapis.com
    http://maps.googleapis.com
    https://places.googleapis.com
    http://places.googleapis.com
    https://maps.gstatic.com
    http://maps.gstatic.com
  ]

  sentry_sources = %w[
    https://js-de.sentry-cdn.com
    http://js-de.sentry-cdn.com
    https://browser.sentry-cdn.com
    http://browser.sentry-cdn.com
    https://*.ingest.de.sentry.io
    http://*.ingest.de.sentry.io
  ]

  hubspot_sources = %w[
    https://*.hs-analytics.net
    http://*.hs-analytics.net
    https://*.hs-banner.com
    http://*.hs-banner.com
    https://*.hs-scripts.com
    http://*.hs-scripts.com
    https://*.hscollectedforms.net
    http://*.hscollectedforms.net
    https://*.hsforms.com
    http://*.hsforms.com
    https://*.hubapi.com
    http://*.hubapi.com
    https://*.hubspot.com
    http://*.hubspot.com
  ]

  policy.default_src(
    :self,
    :blob,
    :data,
    :unsafe_inline,
    :unsafe_eval,
    "https://fonts.googleapis.com",
    "http://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "http://fonts.gstatic.com",
    "https://proxy.dorianmarie.com",
    "http://proxy.dorianmarie.com",
    *google_maps_sources,
    *google_sources,
    *hubspot_sources,
    *sentry_sources
  )
end

Rails.application.config.content_security_policy_report_only = false
