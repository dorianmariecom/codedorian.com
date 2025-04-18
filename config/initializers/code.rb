# frozen_string_literal: true

Rails.application.config.after_initialize do
  class Code
    class Object
      class Global < Object
        alias original_call call

        def call(**args)
          code_operator = args.fetch(:operator, nil).to_code
          code_arguments = args.fetch(:arguments, []).to_code
          code_value = code_arguments.code_first

          case code_operator.to_s
          when "Message"
            sig(args) { Object.repeat }
            if code_arguments.any?
              Message.new(*code_arguments.raw)
            else
              Class.new(Message)
            end
          when "Current"
            sig(args) { Object.repeat }
            if code_arguments.any?
              Current.new(*code_arguments.raw)
            else
              Class.new(Current)
            end
          when "User"
            sig(args) { Object.repeat }
            if code_arguments.any?
              User.new(*code_arguments.raw)
            else
              Class.new(User)
            end
          when "Notification"
            sig(args) { Object.repeat }
            if code_arguments.any?
              Notification.new(*code_arguments.raw)
            else
              Class.new(Notification)
            end
          else
            original_call(**args)
          end
        end
      end
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
