class Code
  class Object
    class User < Dictionary
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
        scope.where(handles: { handle: code_value.to_s }).first.to_code
      end

      def self.code_find!(value)
        code_value = value.to_code
        scope.where(handles: { handle: code_value.to_s }).first!.to_code
      rescue ActiveRecord::RecordNotFound
        raise Code::Error, "user not found"
      end

      def self.scope
        policy_scope(::User).joins(:handles).where(handles: { verified: true })
      end
    end
  end
end
