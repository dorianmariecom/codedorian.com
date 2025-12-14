# frozen_string_literal: true

class Code
  class Object
    class Datum < Dictionary
      def self.call(**args)
        code_operator = args.fetch(:operator, nil).to_code
        code_arguments = args.fetch(:arguments, []).to_code
        code_value = code_arguments.code_first

        case code_operator.to_s
        when "find"
          sig(args) { Object }
          code_find(code_value)
        when "find!"
          sig(args) { Object }
          code_find!(code_value)
        when "value"
          sig(args) { Object }
          self.code_value(code_value)
        when "value!"
          sig(args) { Object }
          code_value!(code_value)
        when "create"
          sig(args) { { key: Object.maybe, value: Object.maybe } }

          if code_arguments.any?
            code_create(
              key: code_value.code_get("key"),
              value: code_value.code_get("value")
            )
          else
            code_create
          end
        when "create!"
          sig(args) { { key: Object.maybe, value: Object.maybe } }

          if code_arguments.any?
            code_create!(
              key: code_value.code_get("key"),
              value: code_value.code_get("value")
            )
          else
            code_create!
          end
        else
          super
        end
      end

      def self.code_create(key: nil, value: nil)
        code_key = key.to_code
        code_value = value.to_code

        scope.create(key: code_key.as_json, value: code_value.as_json).to_code
      end

      def self.code_create!(key: nil, value: nil)
        code_key = key.to_code
        code_value = value.to_code

        scope.create!(key: code_key.as_json, value: code_value.as_json).to_code
      rescue ::ActiveRecord::RecordInvalid, ::ActiveRecord::RecordNotSaved => e
        if ::Current.admin?
          raise(::Code::Error, "datum not saved (#{e.class}: #{e.message})")
        end

        raise(::Code::Error, "datum not saved")
      end

      def self.code_find(value)
        code_value = value.to_code

        scope.where(key: code_value.as_json).first.to_code
      end

      def self.code_find!(value)
        code_value = value.to_code

        scope.where(key: code_value.as_json).first!.to_code
      rescue ActiveRecord::RecordNotFound => e
        if ::Current.admin?
          raise(::Code::Error, "datum not found (#{e.class}: #{e.message})")
        end

        raise(::Code::Error, "datum not found")
      end

      def self.code_value(value)
        code_value = value.to_code
        code_datum = code_find(code_value)
        code_datum.nothing? ? Nothing.new : code_datum.code_value
      end

      def self.code_value!(value)
        code_value = value.to_code
        code_find!(code_value).code_value
      end

      def self.scope
        policy_scope(::Datum).where(user: ::Current.user)
      end

      def call(**args)
        code_operator = args.fetch(:operator, nil).to_code
        code_arguments = args.fetch(:arguments, []).to_code
        code_value = code_arguments.code_first

        case code_operator.to_s
        when "destroy"
          sig(args)
          code_destroy
        when "destroy!"
          sig(args)
          code_destroy!
        when "update"
          sig(args) { { value: Object } }
          code_update(value: code_value.code_get("value"))
        when "update!"
          sig(args) { { value: Object } }
          code_update!(value: code_value.code_get("value"))
        else
          super
        end
      end

      def code_destroy
        datum&.destroy.to_code
      end

      def code_destroy!
        datum&.destroy!.to_code
      rescue ActiveRecord::RecordNotDestroyed => e
        if ::Current.admin?
          raise(::Code::Error, "datum not destroyed (#{e.class}: #{e.message})")
        end

        raise(::Code::Error, "datum not destroyed")
      end

      def code_update(value: nil)
        code_value = value.to_code

        datum&.update(value: code_value.as_json).to_code
      end

      def code_update!(value: nil)
        code_value = value.to_code

        datum&.update!(value: code_value.as_json).to_code
      rescue ActiveRecord::RecordInvalid => e
        if ::Current.admin?
          raise(::Code::Error, "datum not updated (#{e.class}: #{e.message})")
        end

        raise(::Code::Error, "datum not updated")
      end

      def code_id
        code_get("id")
      end

      def code_key
        code_get("key")
      end

      def code_value
        code_get("value")
      end

      def id
        code_id.as_json
      end

      def key
        code_key.as_json
      end

      def value
        code_value.as_json
      end

      def datum
        return scope.find_by(id: id) if id.present?
        return scope.find_by(key: key) if key.present?

        nil
      end

      def scope
        policy_scope(::Datum).where(user: ::Current.user)
      end

      include(::Pundit::Authorization)
      extend(::Pundit::Authorization)

      def self.current_user
        ::Current.user
      end

      def current_user
        ::Current.user
      end
    end
  end
end
