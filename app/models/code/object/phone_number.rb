# frozen_string_literal: true

class Code
  class Object
    class PhoneNumber < Dictionary
      def call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "user"
          sig(args)
          code_user
        else
          super
        end
      end

      def id = code_get("id").to_s.to_i
      def phone_number! = policy_scope(::PhoneNumber).find(id)
      def code_user = policy_scope(::User).find(phone_number!.user_id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
