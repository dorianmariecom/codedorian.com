# frozen_string_literal: true

class Code
  class Object
    class Subscription < Dictionary
      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "delivery_connection"
          sig(args) { { provider: String, id: String.maybe } }
          attributes = args.fetch(:arguments, []).to_code.code_first.as_json.symbolize_keys
          connections = policy_scope(subscription!.user.delivery_connections).where_provider(attributes.fetch(:provider)).where(enabled: true)
          connections = connections.where(id: attributes[:id]) if attributes[:id].present?
          begin
            connections.sole.credentials_for_code
          rescue *DeliveryConnectionOauth::ERRORS => e
            raise ::Code::Error, e.code
          rescue ActiveRecord::RecordNotFound, ActiveRecord::SoleRecordExceeded
            raise ::Code::Error, "delivery_connection_required"
          end
        when "deliver!"
          sig(args) do
            {
              key: String,
              subject: String,
              body_text: String,
              body_html: String.maybe,
              url: String.maybe
            }
          end
          code_deliver!(args)
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
        when "values"
          sig(args)
          code_values
        when "subscription_values"
          sig(args)
          code_subscription_values
        else
          super
        end
      end

      def code_deliver!(args)
        attributes =
          args.fetch(:arguments, []).to_code.code_first.as_json.symbolize_keys
        subscription!.deliver!(**attributes).map(&:to_code).to_code
      end

      def id = code_get("id").to_s.to_i
      def subscription! = policy_scope(::Subscription).find(id)
      def code_user = policy_scope(::User).find(subscription!.user.id).to_code

      def code_service
        policy_scope(::Service).find(subscription!.service.id).to_code
      end

      def code_plan = policy_scope(::Plan).find(subscription!.plan.id).to_code

      def code_subscription_executions
        policy_scope(subscription!.subscription_executions).to_code
      end

      def code_subscription_execution
        policy_scope(subscription!.subscription_executions).first.to_code
      end

      def code_plan_schedules
        policy_scope(subscription!.plan_schedules).to_code
      end

      def code_values
        policy_scope(subscription!.subscription_values)
          .index_by(&:key)
          .transform_values(&:typed_value)
          .to_code
      end

      def code_subscription_values
        policy_scope(subscription!.subscription_values).to_code
      end

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
