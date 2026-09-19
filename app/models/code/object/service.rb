# frozen_string_literal: true

class Code
  class Object
    class Service < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::Service).find(
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
        Pundit.policy_scope!(::Current.user, ::Service).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::Service.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::Service)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Service).find_by(id: id).to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Service).find(id).to_code
      end

      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "versions"
          sig(args)
          code_versions
        when "rich_text_name_en"
          sig(args)
          code_rich_text_name_en
        when "rich_text_name_fr"
          sig(args)
          code_rich_text_name_fr
        when "rich_text_description_en"
          sig(args)
          code_rich_text_description_en
        when "rich_text_description_fr"
          sig(args)
          code_rich_text_description_fr
        when "rich_text_body_en"
          sig(args)
          code_rich_text_body_en
        when "rich_text_body_fr"
          sig(args)
          code_rich_text_body_fr
        when "user"
          sig(args)
          code_user
        when "steps"
          sig(args)
          code_steps
        when "plans"
          sig(args)
          code_plans
        when "fields"
          sig(args)
          code_fields
        when "service_fields"
          sig(args)
          code_service_fields
        when "subscriptions"
          sig(args)
          code_subscriptions
        when "subscription_executions"
          sig(args)
          code_subscription_executions
        when "step_executions"
          sig(args)
          code_step_executions
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

      def code_rich_text_description_en
        rich_text = record!.rich_text_description_en
        if rich_text
          rich_text.attributes.merge("body" => rich_text.body.to_html).to_code
        else
          nil.to_code
        end
      end

      def code_rich_text_description_fr
        rich_text = record!.rich_text_description_fr
        if rich_text
          rich_text.attributes.merge("body" => rich_text.body.to_html).to_code
        else
          nil.to_code
        end
      end

      def code_rich_text_body_en
        rich_text = record!.rich_text_body_en
        if rich_text
          rich_text.attributes.merge("body" => rich_text.body.to_html).to_code
        else
          nil.to_code
        end
      end

      def code_rich_text_body_fr
        rich_text = record!.rich_text_body_fr
        if rich_text
          rich_text.attributes.merge("body" => rich_text.body.to_html).to_code
        else
          nil.to_code
        end
      end

      def id = code_get("id").to_s.to_i
      def service! = policy_scope(::Service).find(id)
      def code_user = policy_scope(::User).find(service!.user.id).to_code
      def code_steps = policy_scope(service!.steps).to_code
      def code_plans = policy_scope(service!.plans).to_code
      def code_fields = service!.fields.index_by(&:key).to_code
      def code_service_fields = policy_scope(service!.service_fields).to_code
      def code_subscriptions = policy_scope(service!.subscriptions).to_code

      def code_subscription_executions
        policy_scope(service!.subscription_executions).to_code
      end

      def code_step_executions = policy_scope(service!.step_executions).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
