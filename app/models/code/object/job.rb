# frozen_string_literal: true

class Code
  class Object
    class Job < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::Job).find(code_get("id").to_s)
      end

      def initialize(*, **)
        super
        return if code_get("id").to_s.blank?

        super(record!.attributes, *, **)
      end

      def call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "batch"
          sig(args)
          code_batch
        when "batch_execution"
          sig(args)
          code_batch_execution
        when "job_batch_executions"
          sig(args)
          code_job_batch_executions
        when "recurring_execution"
          sig(args)
          code_recurring_execution
        when "failed_execution"
          sig(args)
          code_failed_execution
        when "scheduled_execution"
          sig(args)
          code_scheduled_execution
        when "blocked_execution"
          sig(args)
          code_blocked_execution
        when "ready_execution"
          sig(args)
          code_ready_execution
        when "claimed_execution"
          sig(args)
          code_claimed_execution
        when "job_contexts"
          sig(args)
          code_job_contexts
        when "job_blocked_executions"
          sig(args)
          code_job_blocked_executions
        when "job_claimed_executions"
          sig(args)
          code_job_claimed_executions
        when "job_failed_executions"
          sig(args)
          code_job_failed_executions
        when "job_ready_executions"
          sig(args)
          code_job_ready_executions
        when "job_recurring_executions"
          sig(args)
          code_job_recurring_executions
        when "job_scheduled_executions"
          sig(args)
          code_job_scheduled_executions
        else
          super
        end
      end

      def code_batch
        Pundit
          .policy_scope!(::Current.user, ::JobBatch)
          .find_by(id: record!.batch_id)
          .to_code
      end

      def code_batch_execution
        Pundit
          .policy_scope!(::Current.user, ::JobBatchExecution)
          .find_by(job_id: record!.id)
          .to_code
      end

      def code_job_batch_executions
        Pundit
          .policy_scope!(::Current.user, ::JobBatchExecution)
          .where(id: record!.job_batch_executions.select(:id))
          .to_code
      end

      def code_recurring_execution
        Pundit
          .policy_scope!(::Current.user, ::JobRecurringExecution)
          .find_by(id: record!.recurring_execution&.id)
          .to_code
      end

      def code_failed_execution
        Pundit
          .policy_scope!(::Current.user, ::JobFailedExecution)
          .find_by(id: record!.failed_execution&.id)
          .to_code
      end

      def code_scheduled_execution
        Pundit
          .policy_scope!(::Current.user, ::JobScheduledExecution)
          .find_by(id: record!.scheduled_execution&.id)
          .to_code
      end

      def code_blocked_execution
        Pundit
          .policy_scope!(::Current.user, ::JobBlockedExecution)
          .find_by(id: record!.blocked_execution&.id)
          .to_code
      end

      def code_ready_execution
        Pundit
          .policy_scope!(::Current.user, ::JobReadyExecution)
          .find_by(id: record!.ready_execution&.id)
          .to_code
      end

      def code_claimed_execution
        Pundit
          .policy_scope!(::Current.user, ::JobClaimedExecution)
          .find_by(id: record!.claimed_execution&.id)
          .to_code
      end

      def code_job_contexts
        Pundit
          .policy_scope!(::Current.user, ::JobContext)
          .where(id: record!.job_contexts.select(:id))
          .to_code
      end

      def code_job_blocked_executions
        Pundit
          .policy_scope!(::Current.user, ::JobBlockedExecution)
          .where(id: record!.job_blocked_executions.select(:id))
          .to_code
      end

      def code_job_claimed_executions
        Pundit
          .policy_scope!(::Current.user, ::JobClaimedExecution)
          .where(id: record!.job_claimed_executions.select(:id))
          .to_code
      end

      def code_job_failed_executions
        Pundit
          .policy_scope!(::Current.user, ::JobFailedExecution)
          .where(id: record!.job_failed_executions.select(:id))
          .to_code
      end

      def code_job_ready_executions
        Pundit
          .policy_scope!(::Current.user, ::JobReadyExecution)
          .where(id: record!.job_ready_executions.select(:id))
          .to_code
      end

      def code_job_recurring_executions
        Pundit
          .policy_scope!(::Current.user, ::JobRecurringExecution)
          .where(id: record!.job_recurring_executions.select(:id))
          .to_code
      end

      def code_job_scheduled_executions
        Pundit
          .policy_scope!(::Current.user, ::JobScheduledExecution)
          .where(id: record!.job_scheduled_executions.select(:id))
          .to_code
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
        Pundit.policy_scope!(::Current.user, ::Job).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::Job.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit.policy_scope!(::Current.user, ::Job).where(attributes).to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Job).find_by(id: id).to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Job).find(id).to_code
      end
    end
  end
end
