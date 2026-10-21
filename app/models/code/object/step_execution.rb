# frozen_string_literal: true

class Code
  class Object
    class StepExecution < Dictionary
      FUNCTIONS = {
        "checkpoint" => {
          name: "checkpoint",
          description: "reads a checkpoint scoped to this step execution.",
          examples: ["Current.step_execution.checkpoint(:page)"]
        },
        "checkpoint!" => {
          name: "checkpoint!",
          description: "stores a resumable checkpoint for this execution.",
          examples: ["Current.step_execution.checkpoint!(:page, 2)"]
        },
        "result_value" => {
          name: "result_value",
          description: "returns this completed steps structured result.",
          examples: ["Current.step_execution.result_value"]
        },
        "previous_result" => {
          name: "previous_result",
          description:
            "requires a successful previous step in the same execution and returns its structured result.",
          examples: ["Current.step_execution.previous_result"]
        }
      }.freeze

      def self.function_documentation(scope)
        scope == :instance ? FUNCTIONS : {}
      end

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
        when "checkpoint"
          sig(args) { String }
          code_checkpoint(args.fetch(:arguments, []).to_code.code_first)
        when "checkpoint!"
          sig(args) { [String, Object] }
          code_checkpoint!(*args.fetch(:arguments, []).to_code.raw)
        when "result_value"
          sig(args)
          code_result_value
        when "previous_result"
          sig(args)
          code_previous_result
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

      def code_checkpoint(value)
        State.new(
          record!,
          namespace: ::CodeState::CHECKPOINT_NAMESPACE
        ).code_get(value)
      end

      def code_checkpoint!(key, value)
        record = record!
        ::Pundit.authorize(::Current.user, record, :update?)
        ::CodeState
          .new(record, namespace: ::CodeState::CHECKPOINT_NAMESPACE)
          .update { |stored| stored.merge(key.to_s => value.to_code.as_json) }
        value.to_code
      end

      def code_result_value
        record = record!
        if record.done?
          ::CodeState
            .new(record, namespace: ::CodeState::RESULT_NAMESPACE)
            .read
            .to_code
            .code_get("value")
        else
          Nothing.new
        end
      end

      def code_previous_result
        record = record!
        previous =
          record
            .subscription_execution
            .step_executions
            .joins(:step)
            .where(steps: { position: ...record.step.position })
            .order("steps.position DESC")
            .first
        unless previous&.done?
          raise ::Code::Error, "previous step has not completed"
        end

        result =
          ::CodeState.new(
            previous,
            namespace: ::CodeState::RESULT_NAMESPACE
          ).read
        unless result.key?("value")
          raise ::Code::Error, "previous step has no structured result"
        end

        result.fetch("value").to_code
      end
    end
  end
end
