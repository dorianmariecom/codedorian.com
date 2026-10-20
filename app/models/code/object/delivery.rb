# frozen_string_literal: true

class Code
  class Object
    class Delivery < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::Delivery).find(
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
        when "user"
          sig(args)
          code_user
        when "public_url"
          sig(args)
          code_public_url
        when "private_url_path"
          sig(args)
          code_private_url_path
        when "private_url"
          sig(args)
          code_private_url
        when "recipient_verified?"
          sig(args)
          code_recipient_verified?
        when "versions"
          sig(args)
          code_versions
        when "connection"
          sig(args)
          code_connection
        when "subscription"
          sig(args)
          code_subscription
        when "service"
          sig(args)
          code_service
        when "delivery_destination"
          sig(args)
          code_delivery_destination
        when "step_execution"
          sig(args)
          code_step_execution
        else
          super
        end
      end

      def code_user
        record!.user.to_code
      end

      def code_public_url
        "#{::Current.base_url}/x/#{record!.public_token}".to_code
      end

      def code_private_url_path
        "/deliveries/#{record!.id}".to_code
      end

      def code_private_url
        "#{::Current.base_url}/deliveries/#{record!.id}".to_code
      end

      def code_recipient_verified?
        record!.recipient_verified_for_delivery?.to_code
      end

      def code_versions
        Pundit
          .policy_scope!(::Current.user, ::Version)
          .where(id: record!.versions.select(:id))
          .to_code
      end

      def code_connection
        Pundit
          .policy_scope!(::Current.user, ::Connection)
          .find_by(id: record!.connection&.id)
          .to_code
      end

      def code_subscription
        Pundit
          .policy_scope!(::Current.user, ::Subscription)
          .find_by(id: record!.subscription&.id)
          .to_code
      end

      def code_service
        Pundit
          .policy_scope!(::Current.user, ::Service)
          .find_by(id: record!.service&.id)
          .to_code
      end

      def code_delivery_destination
        Pundit
          .policy_scope!(::Current.user, ::DeliveryDestination)
          .find_by(id: record!.delivery_destination&.id)
          .to_code
      end

      def code_step_execution
        Pundit
          .policy_scope!(::Current.user, ::StepExecution)
          .find_by(id: record!.step_execution&.id)
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
        Pundit.policy_scope!(::Current.user, ::Delivery).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::Delivery.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::Delivery)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Delivery).find_by(id: id).to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Delivery).find(id).to_code
      end
    end
  end
end
