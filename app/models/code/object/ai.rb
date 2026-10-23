# frozen_string_literal: true

class Code
  class Object
    class Ai < Object
      FUNCTIONS = {
        "generate" => {
          name: "generate",
          description:
            "generates text or validated structured content with the configured model.",
          examples: [
            "Ai.generate(messages: [{ role: :user, content: \"Hello\" }])"
          ]
        }
      }.freeze

      def self.function_documentation(scope)
        scope == :class ? FUNCTIONS : {}
      end

      def self.call(**args)
        case args.fetch(:operator, nil).to_s
        when "generate"
          sig(args) do
            {
              messages: List,
              schema: Dictionary.maybe,
              name: String.maybe,
              model: String.maybe,
              api_key: String.maybe,
              attempts: Integer.maybe,
              max_output_tokens: Integer.maybe,
              reasoning_effort: String.maybe
            }
          end
          code_generate(args.fetch(:arguments, []).to_code.code_first)
        else
          super
        end
      end

      def self.code_generate(value)
        options = value.to_code.as_json.symbolize_keys.compact
        ::AiGeneration.call(**options, context: ::Current.attributes).to_code
      end
    end
  end
end
