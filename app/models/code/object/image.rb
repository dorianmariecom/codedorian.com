# frozen_string_literal: true

class Code
  class Object
    class Image < Object
      FUNCTIONS = {
        "proxy_url" => {
          name: "proxy_url",
          description: "builds a proxy URL for a source image.",
          examples: ["Image.proxy_url(\"https://example.com/image.png\")"]
        },
        "select" => {
          name: "select",
          description:
            "returns the first decodable unseen image and its metadata.",
          examples: ["Image.select([\"https://example.com/image.png\"])"]
        },
        "page_candidates" => {
          name: "page_candidates",
          description:
            "resolves likely page image URLs including relative references.",
          examples: [
            "Image.page_candidates(\"<img src=/image.png>\", \"https://example.com\")"
          ]
        }
      }.freeze

      def self.function_documentation(scope)
        scope == :class ? FUNCTIONS : {}
      end

      def self.call(**args)
        values = args.fetch(:arguments, []).to_code
        case args.fetch(:operator, nil).to_s
        when "proxy_url"
          sig(args) do
            [String, { disposition: String.maybe, width: Integer.maybe }]
          end
          code_proxy_url(values.code_first, values.code_second)
        when "select"
          sig(args) { [List, { excluded_hashes: List.maybe }] }
          code_select(values.code_first, values.code_second)
        when "page_candidates"
          sig(args) { [String, String] }
          code_page_candidates(values.code_first, values.code_second)
        else
          super
        end
      end

      def self.code_proxy_url(value, options = nil)
        options = options.to_code
        attributes =
          options.nothing? ? {} : options.as_json.symbolize_keys.compact
        ::CodeImage.proxy_url(value.to_s, **attributes).to_code
      end

      def self.code_select(value, options = nil)
        options = options.to_code
        attributes =
          options.nothing? ? {} : options.as_json.symbolize_keys.compact
        ::CodeImage.select(value.to_code.as_json, **attributes).to_code
      end

      def self.code_page_candidates(html, url)
        ::CodeImage.page_candidates(html.to_s, url.to_s).to_code
      end
    end
  end
end
