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
        when "programs"
          sig(args)
          code_programs
        when "program"
          sig(args)
          code_program!
        when "program!"
          sig(args)
          code_program
        when "schedules"
          sig(args)
          code_schedules
        when "schedule"
          sig(args)
          code_schedule
        when "schedule!"
          sig(args)
          code_schedule!
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
        ::Current.programs.to_code
      end

      def self.code_program
        ::Current.program.to_code
      end

      def self.code_program!
        ::Current.program!.to_code
      end

      def self.code_schedules
        ::Current.schedules.to_code
      end

      def self.code_schedule
        ::Current.schedule.to_code
      end

      def self.code_schedule!
        ::Current.schedule!.to_code
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
