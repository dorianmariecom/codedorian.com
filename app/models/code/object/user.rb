# frozen_string_literal: true

class Code
  class Object
    class User < Dictionary
      CLASS_DOCUMENTATION = {
        name: "User",
        description: "accesses users by id or handle from code.",
        examples: %w[
          User.find("darian")
          User.find("123")
          User.find!("darian").id
        ]
      }.freeze
      CLASS_FUNCTIONS = {
        "find" => {
          name: "find",
          description: "returns the first matching user by handle or id.",
          examples: %w[User.find("darian") User.find("123") User.find(nothing)]
        },
        "find!" => {
          name: "find!",
          description: "returns the matching user or raises when not found.",
          examples: %w[
            User.find!("darian")
            User.find!("123")
            User.find!(nothing)
          ]
        }
      }.freeze
      INSTANCE_FUNCTIONS = {
        "id" => {
          name: "id",
          description: "returns the user id as an integer.",
          examples: %w[Current.user.id User.find!("dorian").id]
        },
        "simple?" => {
          name: "simple?",
          description: "returns whether the user uses the simple interface.",
          examples: ["Current.user.simple?"]
        },
        "advanced?" => {
          name: "advanced?",
          description: "returns whether the user uses the advanced interface.",
          examples: ["Current.user.advanced?"]
        }
      }.freeze

      def self.function_documentation(scope)
        case scope
        when :instance
          INSTANCE_FUNCTIONS
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
        when "find"
          sig(args) { String }
          code_find(code_value)
        when "find!"
          sig(args) { String }
          code_find!(code_value)
        else
          super
        end
      end

      def call(**args)
        code_operator = args.fetch(:operator, nil).to_code

        case code_operator.to_s
        when "addresses"
          sig(args)
          code_addresses
        when "data"
          sig(args)
          code_data
        when "devices"
          sig(args)
          code_devices
        when "email_addresses"
          sig(args)
          code_email_addresses
        when "handles"
          sig(args)
          code_handles
        when "names"
          sig(args)
          code_names
        when "passwords"
          sig(args)
          code_passwords
        when "phone_numbers"
          sig(args)
          code_phone_numbers
        when "programs"
          sig(args)
          code_programs
        when "services"
          sig(args)
          code_services
        when "subscriptions"
          sig(args)
          code_subscriptions
        when "subscription_executions"
          sig(args)
          code_subscription_executions
        when "program_executions"
          sig(args)
          code_program_executions
        when "time_zones"
          sig(args)
          code_time_zones
        when "tokens"
          sig(args)
          code_tokens
        when "sent_messages"
          sig(args)
          code_sent_messages
        when "received_messages"
          sig(args)
          code_received_messages
        when "simple?"
          sig(args)
          code_simple?
        when "advanced?"
          sig(args)
          code_advanced?
        else
          super
        end
      end

      def self.code_find(value)
        code_value = value.to_code
        scope_with_handles
          .where(handles: { handle: code_value.to_s })
          .or(scope_with_handles.where(id: code_value.to_s))
          .first
          .to_code
      end

      def self.code_find!(value)
        code_value = value.to_code
        scope_with_handles
          .where(handles: { handle: code_value.to_s })
          .or(scope_with_handles.where(id: code_value.to_s))
          .first!
          .to_code
      rescue ActiveRecord::RecordNotFound => e
        if ::Current.admin?
          raise(::Code::Error, "user not found (#{e.class}: #{e.message})")
        end

        raise(::Code::Error, "user not found")
      end

      def self.scope_with_handles
        scope.joins(:handles).where(handles: { verified: true })
      end

      def self.scope
        policy_scope(::User)
      end

      def id
        code_get("id").to_s.to_i
      end

      def user
        scope.find_by(id: id)
      end

      def user!
        scope.find(id)
      end

      def code_addresses = policy_scope(user!.addresses).to_code
      def code_data = policy_scope(user!.data).to_code
      def code_devices = policy_scope(user!.devices).to_code
      def code_email_addresses = policy_scope(user!.email_addresses).to_code
      def code_handles = policy_scope(user!.handles).to_code
      def code_names = policy_scope(user!.names).to_code
      def code_passwords = policy_scope(user!.passwords).to_code
      def code_phone_numbers = policy_scope(user!.phone_numbers).to_code
      def code_programs = policy_scope(user!.programs).to_code
      def code_services = policy_scope(user!.services).to_code
      def code_subscriptions = policy_scope(user!.subscriptions).to_code
      def code_subscription_executions = policy_scope(user!.subscription_executions).to_code
      def code_program_executions = policy_scope(user!.program_executions).to_code
      def code_time_zones = policy_scope(user!.time_zones).to_code
      def code_tokens = policy_scope(user!.tokens).to_code
      def code_sent_messages = policy_scope(user!.sent_messages).to_code
      def code_received_messages = policy_scope(user!.received_messages).to_code
      def code_simple? = Boolean.new(code_get("interface").to_s == "simple")
      def code_advanced? = Boolean.new(code_get("interface").to_s == "advanced")

      def scope
        policy_scope(::User)
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
