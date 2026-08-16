# frozen_string_literal: true

class Code
  class Object
    class ProgramSchedule < Dictionary
      CLASS_DOCUMENTATION = {
        name: "ProgramSchedule",
        description: "finds and inspects program schedules in code.",
        examples: %w[
          ProgramSchedule.find(123)
          ProgramSchedule.intervals
          ProgramSchedule.find!("7f8...").id
        ]
      }.freeze
      CLASS_FUNCTIONS = {
        "find" => {
          name: "find",
          description: "returns a schedule by id.",
          examples: %w[
            ProgramSchedule.find(123)
            ProgramSchedule.find!(123)
            ProgramSchedule.find("missing")
          ]
        },
        "find!" => {
          name: "find!",
          description: "returns a schedule by id or raises when not found.",
          examples: %w[ProgramSchedule.find!(123) ProgramSchedule.find!("abc")]
        },
        "intervals" => {
          name: "intervals",
          description: "returns the available schedule intervals.",
          examples: [
            "ProgramSchedule.intervals",
            "ProgramSchedule.intervals.keys",
            "ProgramSchedule.intervals[:daily]"
          ]
        }
      }.freeze
      INSTANCE_FUNCTIONS = {
        "id" => {
          name: "id",
          description: "returns the schedule id as an integer.",
          examples: %w[
            ProgramSchedule.find!(123).id
            ProgramSchedule.find!(123).intervals
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
        when "intervals"
          sig(args)
          code_intervals
        else
          super
        end
      end

      def self.code_find(value)
        code_value = value.to_code
        scope.where(id: code_value.to_s).first.to_code
      end

      def self.code_find!(value)
        code_value = value.to_code
        scope.where(id: code_value.to_s).first!.to_code
      rescue ActiveRecord::RecordNotFound => e
        if ::Current.admin?
          raise(::Code::Error, "schedule not found (#{e.class}: #{e.message})")
        end

        raise(::Code::Error, "schedule not found")
      end

      def self.code_intervals
        ::ScheduleConcern::INTERVALS.to_code
      end

      def self.scope
        policy_scope(::ProgramSchedule)
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
        policy_scope(::ProgramSchedule)
      end

      def call(**args)
        code_operator = args.fetch(:operator, nil).to_code

        case code_operator.to_s
        when "program"
          sig(args)
          code_program
        when "user"
          sig(args)
          code_user
        else
          super
        end
      end

      def code_program = policy_scope(::Program).find(program!.program.id).to_code
      def code_user = policy_scope(::User).find(program!.user.id).to_code

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
