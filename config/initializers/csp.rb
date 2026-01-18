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
    "https://*.hs-scripts.com",
    "https://*.hubspot.com",
    "https://*.hubapi.com",
    "https://js-eu1.hs-banner.com",
    "https://js-eu1.hs-analytics.net",
    "https://js-eu1.hscollectedforms.net"
  )
end

Rails.application.config.content_security_policy_report_only = false
