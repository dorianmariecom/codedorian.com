# frozen_string_literal: true

class Code
  class Object
    class Program < Dictionary
      def self.call(**args)
        code_operator = args.fetch(:operator, nil).to_code
        code_arguments = args.fetch(:arguments, []).to_code
        code_value = code_arguments.code_first

        case code_operator.to_s
        when "find"
          sig(args) { String }
          code_find(code_value)
        when "find!"
          sig(args) { String }
          code_find!(code_value)
        else
          super
        end
      end

      def self.code_find(value)
        code_value = value.to_code
        scope
          .where(name: code_value.to_s)
          .or(scope.where(id: code_value.to_s))
          .first
          .to_code
      end

      def self.code_find!(value)
        code_value = value.to_code
        scope
          .where(name: code_value.to_s)
          .or(scope.where(id: code_value.to_s))
          .first!
          .to_code
      rescue ActiveRecord::RecordNotFound => e
        if ::Current.admin?
          raise ::Code::Error, "program not found (#{e.class}: #{e.message})"
        end

        raise ::Code::Error, "program not found"
      end

      def self.scope
        policy_scope(::Program)
      end

      def id
        code_get("id").to_s.to_i
      end

      def program
        scope.find_by(id: id)
      end

      def program!
        scope.find(id)
      end

      def scope
        policy_scope(::Program)
      end

      include ::Pundit::Authorization
      extend ::Pundit::Authorization

      def self.current_user
        ::Current.user
      end

      def current_user
        ::Current.user
      end
    end
  end
end
