# frozen_string_literal: true

class Code
  class Object
    class ProgramExecution < Dictionary
      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
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

      def id = code_get("id").to_s.to_i
      def program_execution! = policy_scope(::ProgramExecution).find(id)
      def code_program = policy_scope(::Program).find(program_execution!.program.id).to_code
      def code_user = policy_scope(::User).find(program_execution!.user.id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
