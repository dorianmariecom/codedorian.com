# frozen_string_literal: true

class Code
  class Object
    class State < Dictionary
      FUNCTIONS = {
        "update!" => {
          name: "update!",
          description:
            "atomically transforms persistent state while locking its parent.",
          examples: [
            "Current.subscription.state.update!((state) => { state.set(:count, (state[:count] or 0) + 1) })"
          ]
        },
        "set!" => {
          name: "set!",
          description: "atomically stores one state key.",
          examples: ["Current.subscription.state.set!(:page, 2)"]
        },
        "reload" => {
          name: "reload",
          description: "reloads the current persistent state.",
          examples: ["Current.subscription.state.reload"]
        }
      }.freeze

      def self.function_documentation(scope)
        scope == :instance ? FUNCTIONS : {}
      end

      def initialize(record, namespace: ::CodeState::DEFAULT_NAMESPACE)
        @store = ::CodeState.new(record, namespace: namespace)
        super(@store.read)
      end

      def call(**args)
        value = args.fetch(:arguments, []).to_code.code_first
        case args.fetch(:operator, nil).to_s
        when "update!"
          sig(args) { Function }
          code_update!(value, **args)
        when "set!"
          sig(args) { [String, Object] }
          arguments = args.fetch(:arguments, []).to_code
          code_set!(value, arguments.code_second)
        when "reload"
          sig(args)
          code_reload
        else
          super
        end
      end

      def code_update!(value, **args)
        result =
          @store.update do |stored|
            updated =
              value.call(**args, operator: nil, arguments: [stored.to_code])
            unless updated.is_a?(Dictionary)
              raise ::Code::Error, "state must be a dictionary"
            end

            updated.as_json
          end
        self.raw = result.to_code.raw
        self
      end

      def code_set!(value, new_value)
        result =
          @store.update do |stored|
            stored.merge(value.to_s => new_value.to_code.as_json)
          end
        self.raw = result.to_code.raw
        self
      end

      def code_reload
        self.raw = @store.read.to_code.raw
        self
      end
    end
  end
end
