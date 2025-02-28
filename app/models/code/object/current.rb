# frozen_string_literal: true

class Code
  class Object
    class Current < Dictionary
      def self.call(**args)
        code_operator = args.fetch(:operator, nil).to_code

        case code_operator.to_s
        when "user"
          sig(args)
          code_user
        when "user!"
          sig(args)
          code_user!
        else
          super
        end
      end

      def self.code_user
        ::Current.user.to_code
      end

      def self.code_user!
        ::Current.user!.to_code
      end
    end
  end
end
