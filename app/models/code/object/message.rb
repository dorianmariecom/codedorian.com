# frozen_string_literal: true

class Code
  class Object
    class Message < Dictionary
      CLASS_DOCUMENTATION = {
        name: "Message",
        description: "creates and reads direct user messages.",
        examples: [
          'Message.create(from: Current.user, to: User.find("admin"), subject: "hello", body: "...")',
          "Message.create!",
          "Message.create(subject: \"\")"
        ]
      }.freeze
      CLASS_FUNCTIONS = {
        "create" => {
          name: "create",
          description: "creates a message and returns it.",
          examples: [
            'Message.create(from: Current.user, to: User.find("admin"))',
            'Message.create(subject: "hello", body: "world")',
            "Message.create()"
          ]
        },
        "create!" => {
          name: "create!",
          description: "creates a message and raises when validation fails.",
          examples: [
            'Message.create!(from: Current.user, to: User.find("admin"))',
            'Message.create!(subject: "hello", body: "world")',
            "Message.create!()"
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
        when "create!"
          sig(args) do
            {
              from: User.maybe,
              to: User.maybe,
              subject: String.maybe,
              body: String.maybe
            }
          end

          if code_arguments.any?
            code_create!(
              from: code_value.code_get("from"),
              to: code_value.code_get("to"),
              subject: code_value.code_get("subject"),
              body: code_value.code_get("body")
            )
          else
            code_create!
          end
        when "create"
          sig(args) do
            {
              from: User.maybe,
              to: User.maybe,
              subject: String.maybe,
              body: String.maybe
            }
          end

          if code_arguments.any?
            code_create(
              from: code_value.code_get("from"),
              to: code_value.code_get("to"),
              subject: code_value.code_get("subject"),
              body: code_value.code_get("body")
            )
          else
            code_create
          end
        else
          super
        end
      end

      def self.code_create(from: nil, to: nil, subject: nil, body: nil)
        code_from = from.to_code
        code_to = to.to_code
        code_subject = subject.to_s.to_code
        code_body = body.to_s.to_code
        code_from = Current.code_user if code_from.nothing?
        code_to = Current.code_user if code_to.nothing?

        ::Message
          .new(
            from_user_id: code_from.code_get("id").to_s,
            to_user_id: code_to.code_get("id").to_s,
            subject: code_subject.to_s,
            body: code_body.to_s
          )
          .tap(&:save)
          .to_code
      end

      def self.code_create!(from: nil, to: nil, subject: nil, body: nil)
        code_from = from.to_code
        code_to = to.to_code
        code_subject = subject.to_s.to_code
        code_body = body.to_s.to_code
        code_from = Current.code_user if code_from.nothing?
        code_to = Current.code_user if code_to.nothing?

        ::Message
          .new(
            from_user_id: code_from.code_get("id").to_s,
            to_user_id: code_to.code_get("id").to_s,
            subject: code_subject.to_s,
            body: code_body.to_s
          )
          .tap(&:save!)
          .to_code
      rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved => e
        if ::Current.admin?
          raise(::Code::Error, "message not saved (#{e.class}: #{e.message})")
        end

        raise(::Code::Error, "message not saved")
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
