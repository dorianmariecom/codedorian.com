# frozen_string_literal: true

class Code
  class Object
    class Name < Dictionary
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
      def name! = policy_scope(::Name).find(id)
      def code_user = policy_scope(::User).find(name!.user_id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
