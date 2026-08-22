# frozen_string_literal: true

class Code
  class Object
    class SubscriptionValue < Dictionary
      def call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "subscription"
          sig(args)
          code_subscription
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
      def subscription_value! = policy_scope(::SubscriptionValue).find(id)

      def code_subscription
        policy_scope(::Subscription).find(
          subscription_value!.subscription_id
        ).to_code
      end

      def code_plan
        policy_scope(::Plan).find(subscription_value!.plan.id).to_code
      end

      def code_service
        policy_scope(::Service).find(subscription_value!.service.id).to_code
      end

      def code_user
        policy_scope(::User).find(subscription_value!.user.id).to_code
      end

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
