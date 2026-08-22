# frozen_string_literal: true

class Code
  class Object
    class ServiceField < Dictionary
      def call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "service"
          sig(args)
          code_service
        when "user"
          sig(args)
          code_user
        else
          super
        end
      end

      def id = code_get("id").to_s.to_i
      def service_field! = policy_scope(::ServiceField).find(id)
      def code_service =
        policy_scope(::Service).find(service_field!.service_id).to_code
      def code_user = policy_scope(::User).find(service_field!.user.id).to_code

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
