# frozen_string_literal: true

class Code
  class Object
    class Page < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::Page).find(code_get("id").to_s)
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
        when "parent"
          sig(args)
          code_parent
        when "children"
          sig(args)
          code_children
        when "rich_text_title_en"
          sig(args)
          code_rich_text_title_en
        when "rich_text_title_fr"
          sig(args)
          code_rich_text_title_fr
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

      def code_parent
        Pundit
          .policy_scope!(::Current.user, ::Page)
          .find_by(id: record!.parent&.id)
          .to_code
      end

      def code_children
        Pundit
          .policy_scope!(::Current.user, ::Page)
          .where(id: record!.children.select(:id))
          .to_code
      end

      def code_rich_text_title_en
        rich_text = record!.rich_text_title_en
        if rich_text
          rich_text.attributes.merge("body" => rich_text.body.to_html).to_code
        else
          nil.to_code
        end
      end

      def code_rich_text_title_fr
        rich_text = record!.rich_text_title_fr
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
        Pundit.policy_scope!(::Current.user, ::Page).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::Page.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit.policy_scope!(::Current.user, ::Page).where(attributes).to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Page).find_by(id: id).to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit.policy_scope!(::Current.user, ::Page).find(id).to_code
      end
    end
  end
end
