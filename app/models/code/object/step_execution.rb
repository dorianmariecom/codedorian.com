# frozen_string_literal: true

class Code
  class Object
    class StepExecution < Dictionary
      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "step"
          sig(args)
          code_step
        when "subscription_execution"
          sig(args)
          code_subscription_execution
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
        else
          super
        end
      end

      def id = code_get("id").to_s.to_i
      def step_execution! = policy_scope(::StepExecution).find(id)
      def code_step = policy_scope(::Step).find(step_execution!.step.id).to_code

      def code_subscription_execution
        policy_scope(::SubscriptionExecution).find(
          step_execution!.subscription_execution.id
        ).to_code
      end

      def code_subscription
        policy_scope(::Subscription).find(
          step_execution!.subscription.id
        ).to_code
      end

      def code_user = policy_scope(::User).find(step_execution!.user.id).to_code

      def code_service
  policy_scope(::Service).find(step_execution!.service.id).to_code
      end

      def code_plan = policy_scope(::Plan).find(step_execution!.plan.id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
