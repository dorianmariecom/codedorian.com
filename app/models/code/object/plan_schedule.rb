# frozen_string_literal: true

class Code
  class Object
    class PlanSchedule < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::PlanSchedule).find(
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
        Pundit.policy_scope!(::Current.user, ::PlanSchedule).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::PlanSchedule.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::PlanSchedule)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::PlanSchedule)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::PlanSchedule).find(id).to_code
      end

      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "versions"
          sig(args)
          code_versions
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

      def code_versions
        Pundit
          .policy_scope!(::Current.user, ::Version)
          .where(id: record!.versions.select(:id))
          .to_code
      end

      def id = code_get("id").to_s.to_i
      def plan_schedule! = policy_scope(::PlanSchedule).find(id)
      def code_plan = policy_scope(::Plan).find(plan_schedule!.plan.id).to_code

      def code_service
        policy_scope(::Service).find(plan_schedule!.service.id).to_code
      end

      def code_user = policy_scope(::User).find(plan_schedule!.user.id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
