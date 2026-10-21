# frozen_string_literal: true

class AiGeneration
  ENDPOINT = "https://api.openai.com/v1/responses"
  API_KEY_DATUM_KEY = "open_ai_api_key"
  MODEL_DATUM_KEY = "model"
  DEFAULT_NAME = "result"
  DEFAULT_ATTEMPTS = 2
  ATTEMPT_RANGE = (1..3).freeze
  DEFAULT_MAX_OUTPUT_TOKENS = 8192
  OUTPUT_TOKEN_RANGE = (1..32_768).freeze
  SUCCESS_STATUSES = (200..299).freeze
  SERVER_ERROR_STATUSES = (500..599).freeze
  RETRYABLE_STATUSES = [408, 429].freeze
  RETRYABLE_ERRORS = ["http error", "http timeout"].freeze
  HTTP_OPTIONS = {
    open_timeout: 10,
    read_timeout: 180,
    write_timeout: 30,
    redirects: 0,
    max_retries: 0
  }.freeze

  def self.call(
    messages:,
    schema: nil,
    name: DEFAULT_NAME,
    model: nil,
    api_key: nil,
    attempts: DEFAULT_ATTEMPTS,
    max_output_tokens: DEFAULT_MAX_OUTPUT_TOKENS,
    reasoning_effort: nil
  )
    unless ATTEMPT_RANGE.cover?(attempts)
      raise Code::Error,
            "AI attempts must be between #{ATTEMPT_RANGE.begin} and #{ATTEMPT_RANGE.end}"
    end

    unless OUTPUT_TOKEN_RANGE.cover?(max_output_tokens)
      raise Code::Error, "invalid AI output token limit"
    end

    credentials = Datum.where_user(Current.user)
    api_key ||= credentials.find_by(key: API_KEY_DATUM_KEY)&.value
    model ||= credentials.find_by(key: MODEL_DATUM_KEY)&.value
    raise Code::Error, "OpenAI API key is missing" if api_key.blank?
    raise Code::Error, "OpenAI model is missing" if model.blank?

    if schema
      validator =
        JSONSchemer.schema(
          schema,
          ref_resolver: ->(_) do
            raise Code::Error, "external schema references are unsupported"
          end
        )
    end
    if validator && !validator.valid_schema?
      raise Code::Error, "invalid AI schema"
    end

    request = {
      model: model,
      input: messages,
      store: false,
      max_output_tokens: max_output_tokens
    }
    request[:reasoning] = { effort: reasoning_effort } if reasoning_effort
    if schema
      request[:text] = {
        format: {
          type: "json_schema",
          name: name,
          schema: schema,
          strict: true
        }
      }
    end
    attempts.times do |attempt|
      response =
        Code::Object::Http.code_fetch(
          :post,
          ENDPOINT,
          {
            headers: {
              "Authorization" => "Bearer #{api_key}"
            },
            json: request,
            **HTTP_OPTIONS
          }
        ).as_json
      status = response.fetch("code")
      unless SUCCESS_STATUSES.cover?(status)
        if (
             RETRYABLE_STATUSES.include?(status) ||
               SERVER_ERROR_STATUSES.cover?(status)
           ) && attempt + 1 < attempts
          next
        end

        raise Code::Error, "AI request failed with HTTP #{status}"
      end
      payload =
        begin
          JSON.parse(response.fetch("body"))
        rescue JSON::ParserError
          {}
        end
      next unless payload.is_a?(Hash) && payload["output"].is_a?(Array)

      content =
        payload["output"]
          .select do |item|
            item.is_a?(Hash) && item["type"] == "message" &&
              item["content"].is_a?(Array)
          end
          .flat_map { |item| item["content"] }
          .grep(Hash)
      if content.any? { |item| item["type"] == "refusal" }
        raise Code::Error, "AI refused the request"
      end
      next unless payload["status"] == "completed"

      text =
        content
          .select do |item|
            item["type"] == "output_text" && item["text"].is_a?(String)
          end
          .map { |item| item["text"] }
          .join
      next if text.blank?
      return text unless schema

      value =
        begin
          JSON.parse(text)
        rescue JSON::ParserError
          next
        end
      return value if validator.valid?(value)
    rescue Code::Error => e
      unless RETRYABLE_ERRORS.include?(e.message) && attempt + 1 < attempts
        raise
      end
    end
    raise Code::Error, "AI returned no complete, valid result"
  end
end
