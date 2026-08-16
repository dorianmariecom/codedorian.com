# frozen_string_literal: true

class Code
  class Object
    class Step < Dictionary
      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "service"
          sig(args)
          code_service
        when "user"
          sig(args)
          code_user
        when "executions", "step_executions"
          sig(args)
          code_step_executions
        else
          super
        end
      end

      def id = code_get("id").to_s.to_i
      def step! = policy_scope(::Step).find(id)
      def code_service = policy_scope(::Service).find(step!.service.id).to_code
      def code_user = policy_scope(::User).find(step!.user.id).to_code
      def code_step_executions = policy_scope(step!.step_executions).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
