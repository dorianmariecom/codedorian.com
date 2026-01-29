# frozen_string_literal: true

Rails.application.config.content_security_policy do |policy|
  google_sources = %w[
    //www.google.com
    //www.gstatic.com
    //www.recaptcha.net
  ]

  google_maps_sources = %w[
    //maps.googleapis.com
    //places.googleapis.com
    //maps.gstatic.com
  ]

  sentry_sources = %w[
    //js-de.sentry-cdn.com
    //browser.sentry-cdn.com
    //*.ingest.de.sentry.io
  ]

  hubspot_sources = %w[
    //*.hs-analytics.net
    //*.hs-banner.com
    //*.hs-scripts.com
    //*.hscollectedforms.net
    //*.hsforms.com
    //*.hubapi.com
    //*.hubspot.com
  ]

  policy.default_src(
    :self,
    :blob,
    :data,
    :unsafe_inline,
    "//fonts.googleapis.com",
    "//fonts.gstatic.com",
    "//proxy.dorianmarie.com",
    *google_maps_sources,
    *google_sources,
    *hubspot_sources,
    *sentry_sources
  )
end

Rails.application.config.content_security_policy_report_only = false
