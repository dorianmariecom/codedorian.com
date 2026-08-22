# frozen_string_literal: true

class Code
  class Object
    class PlanField < Dictionary
      def call(**args)
        case args.fetch(:operator, nil).to_code.to_s
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
      def plan_field! = policy_scope(::PlanField).find(id)
      def code_plan = policy_scope(::Plan).find(plan_field!.plan_id).to_code
      def code_service = policy_scope(::Service).find(plan_field!.service.id).to_code
      def code_user = policy_scope(::User).find(plan_field!.user.id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
