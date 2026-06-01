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
        scope_with_handles
          .includes(programs: :program_schedules)
          .where(handles: { handle: code_value.to_s })
          .or(
            scope_with_handles.includes(programs: :program_schedules).where(
              id: code_value.to_s
            )
          )
          .first
          .to_code
      end

      def self.code_find!(value)
        code_value = value.to_code
        scope_with_handles
          .includes(programs: :program_schedules)
          .where(handles: { handle: code_value.to_s })
          .or(
            scope_with_handles.includes(programs: :program_schedules).where(
              id: code_value.to_s
            )
          )
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
