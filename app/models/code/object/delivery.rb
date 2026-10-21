# frozen_string_literal: true

class Code
  class Object
    class Delivery < Dictionary
      FUNCTIONS = {
        "accepted" => {
          name: "accepted",
          description: "builds an accepted delivery result.",
          examples: ["Delivery.accepted(\"provider-id\")"]
        },
        "delivered" => {
          name: "delivered",
          description: "builds a delivered result.",
          examples: ["Delivery.delivered(\"message-id\")"]
        },
        "uncertain" => {
          name: "uncertain",
          description:
            "builds an uncertain result without requesting a resend.",
          examples: ["Delivery.uncertain"]
        },
        "canceled" => {
          name: "canceled",
          description: "builds a canceled result.",
          examples: ["Delivery.canceled"]
        },
        "rejected" => {
          name: "rejected",
          description:
            "builds a provider rejection with an explicit retry decision.",
          examples: ["Delivery.rejected(:rate_limited, true)"]
        },
        "compact_text" => {
          name: "compact_text",
          description:
            "fits delivery text to a limit with a link to the complete content.",
          examples: ["Current.delivery.compact_text(400)"]
        }
      }.freeze

      def self.function_documentation(scope)
        if scope == :instance
          FUNCTIONS.slice("compact_text")
        elsif scope == :class
          FUNCTIONS.except("compact_text")
        else
          {}
        end
      end

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
        when "compact_text"
          sig(args) { Integer.maybe }
          code_compact_text(args.fetch(:arguments, []).to_code.code_first)
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
        when "accepted"
          sig(args) { String.maybe }
          code_accepted(args.fetch(:arguments, []).to_code.code_first)
        when "delivered"
          sig(args) { String.maybe }
          code_delivered(args.fetch(:arguments, []).to_code.code_first)
        when "uncertain"
          sig(args)
          code_uncertain
        when "canceled"
          sig(args)
          code_canceled
        when "rejected"
          sig(args) { [String, Boolean.maybe] }
          values = args.fetch(:arguments, []).to_code
          code_rejected(values.code_first, values.code_second)
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

      def code_compact_text(limit = nil)
        record = record!
        limit = limit.to_code
        limit = limit.nothing? ? ::DeliveryContent.limit_for(record) : limit.raw
        url =
          record.url.presence ||
            (
              if record.visibility_public?
                code_public_url.to_s
              else
                code_private_url.to_s
              end
            )
        ::DeliveryContent.compact(
          text: [record.subject, record.body_text].compact_blank.join(
            ::DeliveryContent::TEXT_SEPARATOR
          ),
          limit: limit,
          url: url
        ).to_code
      end

      def self.code_accepted(provider_id = nil)
        { status: "accepted", provider_id: provider_id.to_code.as_json }.to_code
      end

      def self.code_delivered(provider_id = nil)
        {
          status: "delivered",
          provider_id: provider_id.to_code.as_json
        }.to_code
      end

      def self.code_uncertain
        { status: "uncertain" }.to_code
      end

      def self.code_canceled
        { status: "canceled" }.to_code
      end

      def self.code_rejected(error_code, retryable = nil)
        {
          status: "rejected",
          error_code: error_code.to_s,
          retryable: retryable.to_code.truthy?
        }.to_code
      end
    end
  end
end
