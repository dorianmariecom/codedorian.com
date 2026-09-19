# frozen_string_literal: true

class Code
  class Object
    class StepExecution < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::StepExecution).find(
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
        Pundit.policy_scope!(::Current.user, ::StepExecution).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::StepExecution.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::StepExecution)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::StepExecution)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::StepExecution).find(id).to_code
      end

      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "versions"
          sig(args)
          code_versions
        when "deliveries"
          sig(args)
          code_deliveries
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

      def code_versions
        Pundit
          .policy_scope!(::Current.user, ::Version)
          .where(id: record!.versions.select(:id))
          .to_code
      end

      def code_deliveries
        Pundit
          .policy_scope!(::Current.user, ::Delivery)
          .where(id: record!.deliveries.select(:id))
          .to_code
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
