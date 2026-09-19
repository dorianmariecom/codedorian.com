# frozen_string_literal: true

class Code
  class Object
    class ServiceField < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::ServiceField).find(
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
        Pundit.policy_scope!(::Current.user, ::ServiceField).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::ServiceField.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::ServiceField)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::ServiceField)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::ServiceField).find(id).to_code
      end

      def call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "versions"
          sig(args)
          code_versions
        when "rich_text_name_en"
          sig(args)
          code_rich_text_name_en
        when "rich_text_name_fr"
          sig(args)
          code_rich_text_name_fr
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

      def code_rich_text_name_en
        rich_text = record!.rich_text_name_en
        if rich_text
          rich_text.attributes.merge("body" => rich_text.body.to_html).to_code
        else
          nil.to_code
        end
      end

      def code_rich_text_name_fr
        rich_text = record!.rich_text_name_fr
        if rich_text
          rich_text.attributes.merge("body" => rich_text.body.to_html).to_code
        else
          nil.to_code
        end
      end

      def id = code_get("id").to_s.to_i
      def service_field! = policy_scope(::ServiceField).find(id)

      def code_service
        policy_scope(::Service).find(service_field!.service_id).to_code
      end

      def code_user = policy_scope(::User).find(service_field!.user.id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
