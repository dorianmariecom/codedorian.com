# frozen_string_literal: true

class Code
  class Object
    class PlanSchedule < Dictionary
      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "plan"
          sig(args)
          code_plan
        when "service"
          sig(args)
          code_service
        when "user"
          sig(args)
          code_user
        else
          super
        end
      end

      def id = code_get("id").to_s.to_i
      def plan_schedule! = policy_scope(::PlanSchedule).find(id)
      def code_plan = policy_scope(::Plan).find(plan_schedule!.plan.id).to_code
      def code_service = policy_scope(::Service).find(plan_schedule!.service.id).to_code
      def code_user = policy_scope(::User).find(plan_schedule!.user.id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
