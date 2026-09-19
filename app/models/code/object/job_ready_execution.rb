# frozen_string_literal: true

class Code
  class Object
    class JobReadyExecution < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::JobReadyExecution).find(
          code_get("id").to_s
        )
      end

      def initialize(*, **)
        super
        return if code_get("id").to_s.blank?

        super(record!.attributes, *, **)
      end

      def call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "job"
          sig(args)
          code_job
        when "job_contexts"
          sig(args)
          code_job_contexts
        else
          super
        end
      end

      def code_job
        Pundit
          .policy_scope!(::Current.user, ::Job)
          .find_by(id: record!.job&.id)
          .to_code
      end

      def code_job_contexts
        Pundit
          .policy_scope!(::Current.user, ::JobContext)
          .where(id: record!.job_contexts.select(:id))
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
        Pundit.policy_scope!(::Current.user, ::JobReadyExecution).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::JobReadyExecution.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::JobReadyExecution)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::JobReadyExecution)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::JobReadyExecution)
          .find(id)
          .to_code
      end
    end
  end
end
