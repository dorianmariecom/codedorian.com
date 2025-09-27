# frozen_string_literal: true

Rails.application.config.content_security_policy do |policy|
  policy.default_src(
    :self,
    "'unsafe-inline'",
    "https://www.google.com",
    "https://www.gstatic.com"
  )
end

Rails.application.config.content_security_policy_report_only = false
