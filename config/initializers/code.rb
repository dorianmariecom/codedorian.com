Rails.application.config.to_prepare do
  class Code
    class Object
      Global.class_eval do
        alias_method :original_call, :call

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
          else
            original_call(**args)
          end
        end
      end
    end

    Object.class_eval do
      include Pundit::Authorization
      extend Pundit::Authorization

      def self.current_user
        Current.user
      end

      def current_user
        Current.user
      end
    end
  end
end
