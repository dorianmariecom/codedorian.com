# frozen_string_literal: true

class Code
  class Object
    class Current < Dictionary
      INSTANCE_FUNCTIONS = {
        "user" => {
          name: "user",
          description:
            "returns the current signed-in user as a Code user object, or nothing.",
          examples: %w[
            Current.user
            Current.user.id
            Current.user.programs.first.id
          ]
        },
        "user!" => {
          name: "user!",
          description:
            "returns the current user and raises when not signed in.",
          examples: %w[Current.user! Current.user!.id]
        },
        "programs" => {
          name: "programs",
          description: "returns programs for the current user.",
          examples: %w[Current.programs Current.programs.size]
        },
        "locale" => {
          name: "locale",
          description: "returns the current locale.",
          examples: ["Current.locale", "Current.locale == :fr"]
        },
        "locale=" => {
          name: "locale=",
          description: "sets the current locale for the current context.",
          examples: ['Current.locale = "fr"', "Current.locale = :en"]
        },
        "time_zone" => {
          name: "time_zone",
          description: "returns the current time zone.",
          examples: %w[Current.time_zone Current.time_zone.offset]
        },
        "time_zone=" => {
          name: "time_zone=",
          description: "sets the current time zone for the current context.",
          examples: [
            'Current.time_zone = "UTC"',
            'Current.time_zone = "Europe/Paris"'
          ]
        }
      }.freeze

      CLASS_DOCUMENTATION = {
        name: "Current",
        description: "reads and updates execution context values in code.",
        examples: ["Current.user", 'Current.locale = "fr"', "Current.time_zone"]
      }.freeze

      def self.function_documentation(scope)
        return INSTANCE_FUNCTIONS if scope == :instance
        return {} if scope == :class

        {}
      end

      def self.call(**args)
        code_operator = args.fetch(:operator, nil).to_code
        code_arguments = args.fetch(:arguments, []).to_code
        code_value = code_arguments.code_first

        case code_operator.to_s
        when "user"
          sig(args)
          code_user
        when "user!"
          sig(args)
          code_user!
        when "programs"
          sig(args)
          code_programs
        when "locale"
          sig(args)
          code_locale
        when "locale="
          sig(args) { String }
          ::Current.locale = code_value.raw
          code_value
        when "time_zone"
          sig(args)
          code_time_zone
        when "time_zone="
          sig(args) { String }
          ::Current.time_zone = code_value.raw
          code_value
        else
          super
        end
      end

      def self.code_user
        ::Current.user.to_code
      end

      def self.code_user!
        ::Current.user!.to_code
      end

      def self.code_programs
        policy_scope(Program).where(user: ::Current.user).to_code
      end

      def self.code_locale
        ::Current.locale.to_code
      end

      def self.code_time_zone
        ::Current.time_zone.to_code
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
