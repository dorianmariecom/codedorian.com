# frozen_string_literal: true

class Code
  class Object
    class Device < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::Device).find(code_get("id").to_s)
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
        Pundit.policy_scope!(::Current.user, ::Device).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::Device.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit.policy_scope!(::Current.user, ::Device).where(attributes).to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Device).find_by(id: id).to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Device).find(id).to_code
      end

      def call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "versions"
          sig(args)
          code_versions
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
      def device! = policy_scope(::Device).find(id)
      def code_user = policy_scope(::User).find(device!.user_id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
