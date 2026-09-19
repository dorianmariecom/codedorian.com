# frozen_string_literal: true

class Code
  class Object
    class DeliveryConnection < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::DeliveryConnection).find(
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
        when "user"
          sig(args)
          code_user
        when "delivery_destinations"
          sig(args)
          code_delivery_destinations
        when "delivery_channels"
          sig(args)
          code_delivery_channels
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

      def code_user
        Pundit
          .policy_scope!(::Current.user, ::User)
          .find_by(id: record!.user&.id)
          .to_code
      end

      def code_delivery_destinations
        Pundit
          .policy_scope!(::Current.user, ::DeliveryDestination)
          .where(id: record!.delivery_destinations.select(:id))
          .to_code
      end

      def code_delivery_channels
        Pundit
          .policy_scope!(::Current.user, ::DeliveryChannel)
          .where(id: record!.delivery_channels.select(:id))
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
        Pundit.policy_scope!(::Current.user, ::DeliveryConnection).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::DeliveryConnection.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::DeliveryConnection)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::DeliveryConnection)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::DeliveryConnection)
          .find(id)
          .to_code
      end
    end
  end
end
