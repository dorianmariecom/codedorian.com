# frozen_string_literal: true

class Prompt < ApplicationRecord
  INPUT_SAMPLE_SIZE = 140
  OMISSION = "…"

  PROMPT_1 = <<~PROMPT
    i created a programming language named "code", your goal is to
    generate a json object with the input of the program corresponding
    to the name of the program provided by the user and the schedules
    corresponding to when the program will be executed
  PROMPT

  PROMPT_2 = <<~PROMPT
    here are some examples
  PROMPT

  PROMPT_3 = <<~PROMPT
    here is the exaustive documentation
  PROMPT

  PROMPT_4 = <<~PROMPT
    here is the user provided name of the program
  PROMPT

  PROMPT_5 = <<~PROMPT
    reply with the input in code of the program and the schedules of the program

    the input in code of the program should be like the input fields in the documentation
    or the code samples in the examples

    you output the program input related to the program name
    and the program schedules
  PROMPT

  belongs_to :user, default: -> { Current.user! }, touch: true
  belongs_to :program, polymorphic: true, optional: true

  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  def self.search_fields
    {
      input: {
        node: -> { arel_table[:input] },
        type: :string
      },
      output: {
        node: -> { arel_table[:output] },
        type: :string
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def generate!
    uri =
      URI(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
      )

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request =
      Net::HTTP::Post.new(
        uri.path,
        {
          "Content-Type" => "application/json",
          "Authorization" => "Bearer #{Config.google.gemini.api_key}"
        }
      )

    request.body = {
      model: "gemini-2.5-pro",
      response_format: {
        type: :json_schema,
        json_schema: {
          name: :input,
          strict: true,
          schema: {
            type: :object,
            properties: {
              input: {
                type: :string
              },
              schedules: {
                type: :array,
                items: {
                  type: :object,
                  properties: {
                    starts_at: {
                      type: :string,
                      format: "date-time"
                    },
                    interval: {
                      type: :string,
                      enum: Schedule::INTERVALS
                    }
                  },
                  required: %i[starts_at interval],
                  additionalProperties: false
                }
              }
            },
            required: [:input],
            additionalProperties: false
          }
        }
      },
      messages: [
        { role: "system", content: PROMPT_1 },
        { role: "system", content: PROMPT_2 },
        { role: "system", content: Rails.root.join("config/examples.md").read },
        { role: "system", content: PROMPT_3 },
        {
          role: "system",
          content:
            YAML.safe_load_file(
              Rails.root.join("config/documentation.yml")
            ).to_json
        },
        { role: "system", content: PROMPT_4 },
        { role: "user", content: input },
        { role: "system", content: PROMPT_5 }
      ]
    }.to_json

    response = http.request(request)
    json = JSON.parse(response.body)

    update!(output: JSON.parse(json.dig("choices", 0, "message", "content")))
  end

  def input_sample
    input.to_s.truncate(INPUT_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def as_json(...)
    output.as_json(...)
  end

  def to_s
    input_sample.presence || t("to_s", id: id)
  end
end
