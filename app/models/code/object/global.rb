class Code
  class Object
    class Global < Object
      alias_method :original_call, :call

      def call(**args)
        operator = args.fetch(:operator, nil)
        arguments = args.fetch(:arguments, [])
        value = arguments.first&.value

        if operator.to_s == "Email"
          sig(args)
          Class.new(Email)
        else
          original_call(**args)
        end
      end
    end
  end
end