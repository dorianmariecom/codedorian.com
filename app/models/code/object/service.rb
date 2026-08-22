# frozen_string_literal: true

class Code
  class Object
    class Service < Dictionary
      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "user"
          sig(args)
          code_user
        when "steps"
          sig(args)
          code_steps
        when "plans"
          sig(args)
          code_plans
        when "fields"
          sig(args)
          code_fields
        when "service_fields"
          sig(args)
          code_service_fields
        when "subscriptions"
          sig(args)
          code_subscriptions
        when "subscription_executions"
          sig(args)
          code_subscription_executions
        when "step_executions"
          sig(args)
          code_step_executions
        else
          super
        end
      end

      def id = code_get("id").to_s.to_i
      def service! = policy_scope(::Service).find(id)
      def code_user = policy_scope(::User).find(service!.user.id).to_code
      def code_steps = policy_scope(service!.steps).to_code
      def code_plans = policy_scope(service!.plans).to_code
      def code_fields = service!.fields.index_by(&:key).to_code
      def code_service_fields = policy_scope(service!.service_fields).to_code
      def code_subscriptions = policy_scope(service!.subscriptions).to_code

      def code_subscription_executions
        policy_scope(service!.subscription_executions).to_code
      end

      def code_step_executions = policy_scope(service!.step_executions).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
