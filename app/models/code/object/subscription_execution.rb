# frozen_string_literal: true

class Code
  class Object
    class SubscriptionExecution < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::SubscriptionExecution).find(
          code_get("id").to_s
        )
      end

      def initialize(*, **)
        super
        return if code_get("id").to_s.blank?

        super(record!.attributes, *, **)
      end

      def self.call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "all"
          sig(args)
          code_all
        when "where"
          sig(args) { Dictionary }
          code_where(args.fetch(:arguments, []).to_code.code_first)
        when "find"
          sig(args) { String | Integer }
          code_find(args.fetch(:arguments, []).to_code.code_first)
        when "find!"
          sig(args) { String | Integer }
          code_find!(args.fetch(:arguments, []).to_code.code_first)
        else
          super
        end
      end

      def self.code_all
        Pundit.policy_scope!(::Current.user, ::SubscriptionExecution).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::SubscriptionExecution.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::SubscriptionExecution)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::SubscriptionExecution)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::SubscriptionExecution)
          .find(id)
          .to_code
      end

      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "versions"
          sig(args)
          code_versions
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

      def code_versions
        Pundit
          .policy_scope!(::Current.user, ::Version)
          .where(id: record!.versions.select(:id))
          .to_code
      end

      def id = code_get("id").to_s.to_i

      def subscription_execution!
        policy_scope(::SubscriptionExecution).find(id)
      end

      def code_subscription
        policy_scope(::Subscription).find(
          subscription_execution!.subscription.id
        ).to_code
      end

      def code_user
        policy_scope(::User).find(subscription_execution!.user.id).to_code
      end

      def code_service
        policy_scope(::Service).find(subscription_execution!.service.id).to_code
      end

      def code_plan
        policy_scope(::Plan).find(subscription_execution!.plan.id).to_code
      end

      def code_step_executions
        policy_scope(subscription_execution!.step_executions).to_code
      end

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
