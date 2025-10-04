# frozen_string_literal: true

class Code
  class Object
    class Notification < Dictionary
      def self.call(**args)
        code_operator = args.fetch(:operator, nil).to_code
        code_arguments = args.fetch(:arguments, []).to_code
        code_value = code_arguments.code_first

        case code_operator.to_s
        when "create"
          sig(args) do
            {
              from: User.maybe,
              to: User.maybe,
              subject: String.maybe,
              body: String.maybe,
              path: String.maybe,
              sound: String.maybe,
              category: String.maybe,
              thread_id: String.maybe,
              collapse_key: String.maybe,
              data: Dictionary.maybe
            }
          end

          if code_arguments.any?
            code_create(
              from: code_value.code_get("from"),
              to: code_value.code_get("to"),
              subject: code_value.code_get("subject"),
              body: code_value.code_get("body"),
              path: code_value.code_get("path"),
              sound: code_value.code_get("sound"),
              category: code_value.code_get("category"),
              thread_id: code_value.code_get("thread_id"),
              collapse_key: code_value.code_get("collapse_key"),
              data: code_value.code_get("data")
            )
          else
            code_create
          end
        when "create!"
          sig(args) do
            {
              from: User.maybe,
              to: User.maybe,
              subject: String.maybe,
              body: String.maybe,
              path: String.maybe,
              sound: String.maybe,
              category: String.maybe,
              thread_id: String.maybe,
              collapse_key: String.maybe,
              data: Dictionary.maybe
            }
          end

          if code_arguments.any?
            code_create!(
              from: code_value.code_get("from"),
              to: code_value.code_get("to"),
              subject: code_value.code_get("subject"),
              body: code_value.code_get("body"),
              path: code_value.code_get("path"),
              sound: code_value.code_get("sound"),
              category: code_value.code_get("category"),
              thread_id: code_value.code_get("thread_id"),
              collapse_key: code_value.code_get("collapse_key"),
              data: code_value.code_get("data")
            )
          else
            code_create!
          end
        else
          super
        end
      end

      def self.code_create(
        from: nil,
        to: nil,
        subject: nil,
        body: nil,
        path: nil,
        sound: nil,
        category: nil,
        thread_id: nil,
        collapse_key: nil,
        data: nil
      )
        code_from = from.to_code
        code_to = to.to_code
        code_subject = subject.to_s.to_code
        code_body = body.to_s.to_code
        code_path = path.to_s.to_code
        code_sound = sound.to_s.to_code
        code_category = category.to_s.to_code
        code_thread_id = thread_id.to_s.to_code
        code_collapse_key = collapse_key.to_s.to_code
        code_data = data.to_code
        code_from = Current.code_user if code_from.nothing?
        code_to = Current.code_user if code_to.nothing?

        ::ApplicationRecord.transaction do
          code_to.user.devices.each do |device|
            if device.ios?
              ios_apps.each do |app|
                ::Rpush::Apnsp8::Notification.create!(
                  app: app,
                  device_token: device.token,
                  alert: {
                    title: code_subject.to_s,
                    body: code_body.to_s
                  },
                  data: {
                    path: code_path.to_s,
                    **data.as_json
                  },
                  thread_id: code_thread_id.to_s,
                  sound: code_sound.to_s,
                  category: code_category.to_s
                )
              end
            elsif device.android?
              android_apps.each do |app|
                ::Rpush::Fcm::Notification.create!(
                  app: app,
                  device_token: device.token,
                  notification: {
                    title: code_subject.to_s,
                    body: code_body.to_s
                  },
                  data: {
                    path: code_path.to_s,
                    **data.as_json
                  },
                  collapse_key: code_collapse_key.to_s,
                  sound: code_sound.to_s,
                  category: code_category.to_s
                )
              end
            end
          end
        end

        Boolean.new(true)
      rescue ::ActiveRecord::RecordInvalid, ::ActiveRecord::RecordNotSaved => e
        Boolean.new(false)
      end

      def self.code_create!(
        from: nil,
        to: nil,
        subject: nil,
        body: nil,
        path: nil,
        sound: nil,
        category: nil,
        thread_id: nil,
        collapse_key: nil,
        data: nil
      )
        code_from = from.to_code
        code_to = to.to_code
        code_subject = subject.to_s.to_code
        code_body = body.to_s.to_code
        code_path = path.to_s.to_code
        code_sound = sound.to_s.to_code
        code_category = category.to_s.to_code
        code_thread_id = thread_id.to_s.to_code
        code_collapse_key = collapse_key.to_s.to_code
        code_data = data.to_code
        code_from = Current.code_user if code_from.nothing?
        code_to = Current.code_user if code_to.nothing?

        ::ApplicationRecord.transaction do
          code_to.user.devices.each do |device|
            if device.ios?
              ios_apps.each do |app|
                ::Rpush::Apnsp8::Notification.create!(
                  app: app,
                  device_token: device.token,
                  alert: {
                    title: code_subject.to_s,
                    body: code_body.to_s
                  },
                  data: {
                    path: code_path.to_s,
                    **data.as_json
                  },
                  thread_id: code_thread_id.to_s,
                  sound: code_sound.to_s,
                  category: code_category.to_s
                )
              end
            elsif device.android?
              android_apps.each do |app|
                ::Rpush::Fcm::Notification.create!(
                  app: app,
                  device_token: device.token,
                  notification: {
                    title: code_subject.to_s,
                    body: code_body.to_s
                  },
                  data: {
                    path: code_path.to_s,
                    **data.as_json
                  },
                  collapse_key: code_collapse_key.to_s,
                  sound: code_sound.to_s,
                  category: code_category.to_s
                )
              end
            end
          end
        end

        Notification.new
      rescue ::ActiveRecord::RecordInvalid, ::ActiveRecord::RecordNotSaved => e
        if ::Current.admin?
          raise(
            ::Code::Error,
            "notification not saved (#{e.class}: #{e.message})"
          )
        end

        raise(::Code::Error, "notification not saved")
      end

      def self.ios_apps
        ::Current.ios_environments.filter_map do |environment|
          ::Rpush::Apnsp8::App.find_by(
            name: ::Current.ios_app_name,
            environment: environment
          )
        end
      end

      def self.android_apps
        ::Current.android_environments.filter_map do |environment|
          ::Rpush::Fcm::App.find_by(
            name: ::Current.android_app_name,
            environment: environment
          )
        end
      end

      include(::Pundit::Authorization)
      extend(::Pundit::Authorization)

      def self.current_user
        ::Current.user
      end

      def current_user
        ::Current.user
      end
    end
  end
end
