# frozen_string_literal: true

Rails.application.config.content_security_policy do |policy|
  policy.default_src(
    :self,
    :blob,
    :data,
    :unsafe_inline,

    # Google / Maps
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://maps.googleapis.com",
    "https://places.googleapis.com",
    "https://maps.gstatic.com",

    # Fonts
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",

    # Proxy
    "https://proxy.dorianmarie.com",

    # Sentry
    "https://js-de.sentry-cdn.com",
    "https://browser.sentry-cdn.com",
    "https://*.ingest.de.sentry.io",

    # HubSpot – scripts, analytics, banners, forms, APIs
    "https://*.hs-analytics.net",
    "https://*.hs-banner.com",
    "https://*.hs-scripts.com",
    "https://*.hscollectedforms.net",
    "https://*.hsforms.com",
    "https://*.hubapi.com",
    "https://*.hubspot.com"
  )
end

Rails.application.config.content_security_policy_report_only = false
