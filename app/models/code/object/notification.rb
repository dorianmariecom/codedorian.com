# frozen_string_literal: true

class Code
  class Object
    class Notification < Dictionary
      def self.call(**args)
        code_operator = args.fetch(:operator, nil).to_code
        code_arguments = args.fetch(:arguments, []).to_code
        code_value = code_arguments.code_first

        case code_operator.to_s
        when "create!"
          sig(args) do
            {
              from: User.maybe,
              to: User.maybe,
              subject: String.maybe,
              body: String.maybe,
              path: String.maybe,
              sound: String.maybe
            }
          end

          if code_arguments.any?
            code_create!(
              from: code_value.code_get("from"),
              to: code_value.code_get("to"),
              subject: code_value.code_get("subject"),
              body: code_value.code_get("body"),
              path: code_value.code_get("path"),
              sound: code_value.code_get("sound")
            )
          else
            code_create!
          end
        end
      end

      def self.code_create!(
        from: nil,
        to: nil,
        subject: nil,
        body: nil,
        path: nil,
        sound: nil
      )
        code_from = from.to_code
        code_to = to.to_code
        code_subject = subject.to_s.to_code
        code_body = body.to_s.to_code
        code_path = path.to_s.to_code
        code_sound = sound.to_s.to_code
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
                    path: code_path.to_s
                  },
                  sound: code_sound.to_s
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
                    path: code_path.to_s
                  },
                  sound: code_sound.to_s
                )
              end
            end
          end
        end

        Notification.new
      rescue ::ActiveRecord::RecordInvalid, ::ActiveRecord::RecordNotSaved => e
        if ::Current.admin?
          raise ::Code::Error,
                "notification not saved (#{e.class}: #{e.message})"
        end

        raise ::Code::Error, "notification not saved"
      end

      def self.ios_apps
        ::Current.ios_environments.filter_map do |environment|
          ::Rpush::Apnsp8::App.find_by(
            name: ::Current.ios_app_name,
            environment: environment
          )
        end
      end

      def self.android_app
        ::Current.android_environments.filter_map do |environment|
          ::Rpush::Fcm::App.find_by(
            name: ::Current.android_app_name,
            environment: environment
          )
        end
      end

      include ::Pundit::Authorization
      extend ::Pundit::Authorization

      def self.current_user
        ::Current.user
      end

      def current_user
        ::Current.user
      end
    end
  end
end
