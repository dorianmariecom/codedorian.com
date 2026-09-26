# frozen_string_literal: true

class Code
  class Object
    class Notification < Dictionary
      CLASS_DOCUMENTATION = {
        name: "Notification",
        description: "sends push notifications through iOS or Android.",
        examples: [
          'Notification.create(subject: "Hello", body: "world")',
          'Notification.create!(subject: "Update", body: "sync complete")',
          'Notification.create(path: "/inbox", sound: "default")'
        ]
      }.freeze
      CLASS_FUNCTIONS = {
        "create" => {
          name: "create",
          description:
            "sends a non-raising notification and returns true/false.",
          examples: [
            'Notification.create(subject: "Hello", body: "world")',
            'Notification.create(path: "/inbox")',
            "Notification.create()"
          ]
        },
        "create!" => {
          name: "create!",
          description: "sends a notification and raises on failure.",
          examples: [
            'Notification.create!(subject: "Hello", body: "world")',
            'Notification.create!(path: "/inbox", thread_id: "app")',
            'Notification.create!(subject: "Update")'
          ]
        }
      }.freeze

      def self.function_documentation(scope)
        case scope
        when :class
          CLASS_FUNCTIONS
        else
          {}
        end
      end

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
        from.to_code
        enqueue_notifications(
          to: to,
          subject: subject,
          body: body,
          path: path,
          sound: sound,
          category: category,
          thread_id: thread_id,
          collapse_key: collapse_key,
          data: data
        )

        Boolean.new(true)
      rescue ::ActiveRecord::RecordInvalid,
             ::ActiveRecord::RecordNotSaved,
             ::ActiveJob::EnqueueError,
             ::SolidQueue::Job::EnqueueError => e
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
        from.to_code
        enqueue_notifications(
          to: to,
          subject: subject,
          body: body,
          path: path,
          sound: sound,
          category: category,
          thread_id: thread_id,
          collapse_key: collapse_key,
          data: data
        )

        Notification.new
      rescue ::ActiveRecord::RecordInvalid,
             ::ActiveRecord::RecordNotSaved,
             ::ActiveJob::EnqueueError,
             ::SolidQueue::Job::EnqueueError => e
        if ::Current.admin?
          raise(
            ::Code::Error,
            "notification not saved (#{e.class}: #{e.message})"
          )
        end

        raise(::Code::Error, "notification not saved")
      end

      def self.enqueue_notifications(
        to:,
        subject:,
        body:,
        path:,
        sound:,
        category:,
        thread_id:,
        collapse_key:,
        data:
      )
        code_to = to.to_code
        code_to = Current.code_user if code_to.nothing?
        code_data = data.to_code
        payload = { "path" => path.to_s }.merge(
          code_data.nothing? ? {} : code_data.as_json.stringify_keys
        )

        ::ApplicationRecord.transaction do
          policy_scope(code_to.user.devices).each do |device|
            ::ApplicationPushNotification
              .applications_for(device)
              .each do |application|
                notification =
                  ::ApplicationPushNotification.new(
                    application: application,
                    title: subject.to_s,
                    body: body.to_s,
                    data: payload,
                    sound: sound.to_s,
                    thread_id: device.ios? ? thread_id.to_s : nil,
                    high_priority: device.ios?,
                    apple_data: {
                      aps: {
                        category: category.to_s
                      },
                      "apns-expiration": 1.day.from_now.to_i.to_s
                    },
                    google_data: {
                      notification: {
                        title: subject.to_s,
                        body: body.to_s
                      },
                      android: {
                        collapse_key: collapse_key.to_s,
                        priority: nil,
                        ttl: "86400s",
                        notification: {
                          title: nil,
                          body: nil,
                          default_sound: sound.to_s == "default"
                        }
                      }
                    }
                  )
                notification.enqueue_to(device)
              end
          end
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
