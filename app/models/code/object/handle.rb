# frozen_string_literal: true

class Code
  class Object
    class Handle < Dictionary
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
      def handle! = policy_scope(::Handle).find(id)
      def code_user = policy_scope(::User).find(handle!.user_id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
