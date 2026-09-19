# frozen_string_literal: true

class Code
  class Object
    class JobProcess < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::JobProcess).find(
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
        when "claimed_executions"
          sig(args)
          code_claimed_executions
        when "supervisor"
          sig(args)
          code_supervisor
        when "supervisees"
          sig(args)
          code_supervisees
        else
          super
        end
      end

      def code_claimed_executions
        Pundit
          .policy_scope!(::Current.user, ::JobClaimedExecution)
          .where(id: record!.claimed_executions.select(:id))
          .to_code
      end

      def code_supervisor
        Pundit
          .policy_scope!(::Current.user, ::JobProcess)
          .find_by(id: record!.supervisor&.id)
          .to_code
      end

      def code_supervisees
        Pundit
          .policy_scope!(::Current.user, ::JobProcess)
          .where(id: record!.supervisees.select(:id))
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
        Pundit.policy_scope!(::Current.user, ::JobProcess).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::JobProcess.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::JobProcess)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::JobProcess)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::JobProcess).find(id).to_code
      end
    end
  end
end
