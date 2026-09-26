# frozen_string_literal: true

class ApplicationPushNotification < ActionPushNative::Notification
  queue_as :push

  def application
    context.fetch(:application)
  end

  def self.applications_for(device)
    if device.ios?
      Current.ios_environments.filter_map do |environment|
        application = "#{Current.ios_app_name}/#{environment}"
        if ActionPushNative.config.fetch(:apple).key?(application.to_sym)
          application
        end
      end
    elsif device.android?
      Current.android_environments.filter_map do |environment|
        application = "#{Current.android_app_name}/#{environment}"
        if ActionPushNative.config.fetch(:google).key?(application.to_sym)
          application
        end
      end
    else
      []
    end
  end

  def enqueue_to(device)
    job =
      ApplicationPushNotificationJob.set(queue: queue_name).perform_later(
        self.class.name,
        as_json,
        device
      )
    raise ActiveJob::EnqueueError, "notification not queued" unless job

    unless job.successfully_enqueued?
      raise ActiveJob::EnqueueError, "notification not queued"
    end

    job
  end
end
