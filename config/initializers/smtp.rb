# frozen_string_literal: true

ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.smtp_settings = Config.smtp_settings unless ENV["DUMMY"]
