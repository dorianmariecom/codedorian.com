# frozen_string_literal: true

class Code
  class Object
    class SubscriptionExecution < Dictionary
      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "subscription"
          sig(args)
          code_subscription
        when "user"
          sig(args)
          code_user
        when "service"
          sig(args)
          code_service
        when "plan"
          sig(args)
          code_plan
        when "steps", "step_executions"
          sig(args)
          code_step_executions
        else
          super
        end
      end

      def id = code_get("id").to_s.to_i
      def subscription_execution! =
        policy_scope(::SubscriptionExecution).find(id)
      def code_subscription
        policy_scope(::Subscription)
          .find(subscription_execution!.subscription.id)
          .to_code
      end
      def code_user = policy_scope(::User).find(subscription_execution!.user.id).to_code
      def code_service = policy_scope(::Service).find(subscription_execution!.service.id).to_code
      def code_plan = policy_scope(::Plan).find(subscription_execution!.plan.id).to_code
      def code_step_executions = policy_scope(subscription_execution!.step_executions).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
