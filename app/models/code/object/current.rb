# frozen_string_literal: true

class Code
  class Object
    class Current < Dictionary
      def self.call(**args)
        code_operator = args.fetch(:operator, nil).to_code
        code_arguments = args.fetch(:arguments, []).to_code
        code_value = code_arguments.code_first

        case code_operator.to_s
        when "user"
          sig(args)
          code_user
        when "user!"
          sig(args)
          code_user!
        when "programs"
          sig(args)
          code_programs
        when "locale"
          sig(args)
          code_locale
        when "locale="
          sig(args) { String }
          ::Current.locale = code_value.raw
          code_value
        when "time_zone"
          sig(args)
          code_time_zone
        when "time_zone="
          sig(args) { String }
          ::Current.time_zone = code_value.raw
          code_value
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

      def self.code_programs
        policy_scope(Program).where(user: ::Current.user).to_code
      end

      def self.code_locale
        ::Current.locale.to_code
      end

      def self.code_time_zone
        ::Current.time_zone.to_code
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
