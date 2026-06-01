# frozen_string_literal: true

class Code
  class Object
    class Program < Dictionary
      CLASS_DOCUMENTATION = {
        name: "Program",
        description: "finds and inspects programs in code.",
        examples: %w[
          Program.find("welcome")
          Program.find(123)
          Program.find!("welcome").id
        ]
      }.freeze
      CLASS_FUNCTIONS = {
        "find" => {
          name: "find",
          description: "returns the first matching program by name or id.",
          examples: %w[
            Program.find("welcome")
            Program.find(123)
            Program.find("missing")
          ]
        },
        "find!" => {
          name: "find!",
          description: "returns the matching program or raises when not found.",
          examples: %w[
            Program.find!("welcome")
            Program.find!(123)
            Program.find!("missing")
          ]
        }
      }.freeze
      INSTANCE_FUNCTIONS = {
        "id" => {
          name: "id",
          description: "returns the program id as an integer.",
          examples: %w[
            Program.find!("welcome").id
            Current.user.programs.first.id
          ]
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

      def self.code_find(value)
        code_value = value.to_code
        scope
          .where(name: code_value.to_s)
          .or(scope.where(id: code_value.to_s))
          .first
          .to_code
      end

      def self.code_find!(value)
        code_value = value.to_code
        scope
          .where(name: code_value.to_s)
          .or(scope.where(id: code_value.to_s))
          .first!
          .to_code
      rescue ActiveRecord::RecordNotFound => e
        if ::Current.admin?
          raise(::Code::Error, "program not found (#{e.class}: #{e.message})")
        end

        raise(::Code::Error, "program not found")
      end

      def self.scope
        policy_scope(::Program).where(user: ::Current.user)
      end

      def id
        code_get("id").to_s.to_i
      end

      def program
        scope.find_by(id: id)
      end

      def program!
        scope.find(id)
      end

      def scope
        policy_scope(::Program).where(user: ::Current.user)
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
