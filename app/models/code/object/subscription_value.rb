# frozen_string_literal: true

class Code
  class Object
    class SubscriptionValue < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::SubscriptionValue).find(
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
        Pundit.policy_scope!(::Current.user, ::SubscriptionValue).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::SubscriptionValue.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::SubscriptionValue)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::SubscriptionValue)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::SubscriptionValue)
          .find(id)
          .to_code
      end

      def call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "versions"
          sig(args)
          code_versions
        when "subscription"
          sig(args)
          code_subscription
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
      def subscription_value! = policy_scope(::SubscriptionValue).find(id)

      def code_subscription
        policy_scope(::Subscription).find(
          subscription_value!.subscription_id
        ).to_code
      end

      def code_plan
        policy_scope(::Plan).find(subscription_value!.plan.id).to_code
      end

      def code_service
        policy_scope(::Service).find(subscription_value!.service.id).to_code
      end

      def code_user
        policy_scope(::User).find(subscription_value!.user.id).to_code
      end

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
