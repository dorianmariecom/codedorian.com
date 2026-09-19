# frozen_string_literal: true

class Code
  class Object
    class SubscriptionDestination < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::SubscriptionDestination).find(
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
        when "versions"
          sig(args)
          code_versions
        when "subscription"
          sig(args)
          code_subscription
        when "delivery_destination"
          sig(args)
          code_delivery_destination
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

      def code_subscription
        Pundit
          .policy_scope!(::Current.user, ::Subscription)
          .find_by(id: record!.subscription&.id)
          .to_code
      end

      def code_delivery_destination
        Pundit
          .policy_scope!(::Current.user, ::DeliveryDestination)
          .find_by(id: record!.delivery_destination&.id)
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
        Pundit.policy_scope!(::Current.user, ::SubscriptionDestination).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::SubscriptionDestination.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::SubscriptionDestination)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::SubscriptionDestination)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::SubscriptionDestination)
          .find(id)
          .to_code
      end
    end
  end
end
