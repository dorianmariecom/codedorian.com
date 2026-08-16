# frozen_string_literal: true

class Code
  class Object
    class Subscription < Dictionary
      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "user"
          sig(args)
          code_user
        when "service"
          sig(args)
          code_service
        when "plan"
          sig(args)
          code_plan
        when "executions", "subscription_executions"
          sig(args)
          code_subscription_executions
        when "execution", "subscription_execution"
          sig(args)
          code_subscription_execution
        when "schedules", "plan_schedules"
          sig(args)
          code_plan_schedules
        else
          super
        end
      end

      def id = code_get("id").to_s.to_i
      def subscription! = policy_scope(::Subscription).find(id)
      def code_user = policy_scope(::User).find(subscription!.user.id).to_code
      def code_service = policy_scope(::Service).find(subscription!.service.id).to_code
      def code_plan = policy_scope(::Plan).find(subscription!.plan.id).to_code
      def code_subscription_executions = policy_scope(subscription!.subscription_executions).to_code
      def code_subscription_execution
        policy_scope(subscription!.subscription_executions).first.to_code
      end
      def code_plan_schedules = policy_scope(subscription!.plan_schedules).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
