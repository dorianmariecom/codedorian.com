# frozen_string_literal: true

unless Rails.env.test?
  ActionMailer::Base.delivery_method = :smtp

  unless ENV["DUMMY"]
    ActionMailer::Base.smtp_settings =
      Config.smtp_settings.from_deep_struct.deep_symbolize_keys
  end
end
