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
              path: String.maybe
            }
          end

          if code_arguments.any?
            code_create!(
              from: code_value.code_get("from"),
              to: code_value.code_get("to"),
              subject: code_value.code_get("subject"),
              body: code_value.code_get("body"),
              path: code_value.code_get("path")
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
        path: nil
      )
        code_from = from.to_code
        code_to = to.to_code
        code_subject = subject.to_s.to_code
        code_body = body.to_s.to_code
        code_path = path.to_s.to_code
        code_from = Current.code_user if code_from.nothing?
        code_to = Current.code_user if code_to.nothing?

        code_from.user.devices.each do |device|
          next unless device.ios?

          ios_apps.each do |ios_app|
            Rpush::Apnsp8::Notification.create!(
              app: ios_app,
              device_token: device.token,
              alert: "#{code_subject}\n#{code_body}".strip,
              data: { path: code_path.to_s }.compact_blank
            )
          end
        end

        Notification.new
      rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved
        raise Code::Error, "notification not saved"
      end

      def self.ios_apps
        Rpush::Apnsp8::App.all
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
