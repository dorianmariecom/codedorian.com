# frozen_string_literal: true

class ApplicationPushNotificationJob < ActionPushNative::NotificationJob
  self.log_arguments = false
  self.enqueue_after_transaction_commit = false
end
