# frozen_string_literal: true

class Code
  class Object
    class Plan < Dictionary
      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "service"
          sig(args)
          code_service
        when "user"
          sig(args)
          code_user
        when "steps"
          sig(args)
          code_steps
        when "schedules", "plan_schedules"
          sig(args)
          code_plan_schedules
        when "subscriptions"
          sig(args)
          code_subscriptions
        else
          super
        end
      end

      def id = code_get("id").to_s.to_i
      def plan! = policy_scope(::Plan).find(id)
      def code_service = policy_scope(::Service).find(plan!.service.id).to_code
      def code_user = policy_scope(::User).find(plan!.user.id).to_code
      def code_steps = policy_scope(plan!.steps).to_code
      def code_plan_schedules = policy_scope(plan!.plan_schedules).to_code
      def code_subscriptions = policy_scope(plan!.subscriptions).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
