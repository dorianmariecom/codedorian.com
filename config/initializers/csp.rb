# frozen_string_literal: true

Rails.application.config.content_security_policy do |policy|
  policy.default_src(
    :self,
    "'unsafe-inline'",
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://maps.googleapis.com",
    "https://fonts.googleapis.com",
    "https://maps.gstatic.com",
    "https://fonts.gstatic.com",
    "https://places.googleapis.com"
  )

  policy.img_src(:self, "https:")
end

Rails.application.config.content_security_policy_report_only = false
