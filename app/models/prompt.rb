# frozen_string_literal: true

class Prompt < ApplicationRecord
  SAMPLE_SIZE = 140
  OMISSION = "…"
  MODEL = "gpt-4o" # FIXME: use gpt-5-nano when async
  STATUSES = %w[initialized created in_progress done errored]

  PROMPT_1 = <<~PROMPT.freeze
    i created a programming language named "code", your goal is to
    generate a json object with the input of the program and its schedules
    from the name of the program provided by the user, the previous input
    and the previous schedules

    the schedules corresponding to when the program will be executed

    a schedule is a dictionary of a starts_at (datetime) and an interval (string)

    intervals are #{Schedule::INTERVALS}
  PROMPT

  PROMPT_2 = <<~PROMPT
    here is the name provided by the user
  PROMPT

  PROMPT_3 = <<~PROMPT
    here is the previous input provided by the user
  PROMPT

  PROMPT_4 = <<~PROMPT
    here is the previous schedules provided by the user
  PROMPT

  PROMPT_5 = <<~PROMPT
    here are some examples
  PROMPT

  PROMPT_6 = <<~PROMPT
    reply with the input in code of the program and the schedules of the program
  PROMPT

  belongs_to :user, default: -> { Current.user! }, touch: true
  belongs_to :program, polymorphic: true, optional: true

  has_many :schedules, as: :schedulable, dependent: :destroy

  accepts_nested_attributes_for :schedules, allow_destroy: true

  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  after_create_commit { created! unless created? }
  after_save_commit do
    program.schedules = program_schedules

    broadcast_replace_to(
      [program, :form],
      target: dom_id(program, :form),
      partial: "programs/form",
      locals: {
        program: program,
        prompt: self,
        submit: t(".program_form_submit")
      }
    )
  end

  def self.search_fields
    {
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
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
    in_progress!

    uri = URI("https://api.openai.com/v1/chat/completions")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request =
      Net::HTTP::Post.new(
        uri.path,
        {
          "Content-Type" => "application/json",
          "Authorization" => "Bearer #{Config.open_ai.api_key}"
        }
      )

    request.body = {
      model: MODEL,
      response_format: {
        type: :json_schema,
        json_schema: {
          name: :input,
          strict: true,
          schema: {
            type: :object,
            properties: {
              name: {
                type: :string
              },
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
            required: %i[input schedules],
            additionalProperties: false
          }
        }
      },
      messages: [
        { role: "system", content: PROMPT_1 },
        { role: "system", content: PROMPT_2 },
        { role: "user", content: name },
        { role: "system", content: PROMPT_3 },
        { role: "user", content: input },
        { role: "system", content: PROMPT_4 },
        { role: "user", content: schedules.to_json },
        { role: "system", content: PROMPT_5 },
        { role: "system", content: programs_json },
        { role: "system", content: PROMPT_6 }
      ]
    }.to_json

    response = http.request(request)
    json = JSON.parse(response.body)

    update!(output: JSON.parse(json.dig("choices", 0, "message", "content")))
    done!
  rescue StandardError => e
    errored!
    update!(error: Current.admin? ? "#{e.class}: #{e.message}" : e.class.to_s)
  end

  def output_name
    (
      output.is_a?(Hash) && output["name"].is_a?(String) && output["name"]
    ).presence
  end

  def output_input
    (
      output.is_a?(Hash) && output["input"].is_a?(String) && output["input"]
    ).presence
  end

  def output_input?
    output_input.present?
  end

  def output_schedules
    (
      output.is_a?(Hash) && output["schedules"].is_an?(Array) &&
        output["schedules"]
    ).presence
  end

  def program_schedules
    return [] if output_schedules.blank?

    output_schedules.map do |output_schedule|
      Schedule.new(
        starts_at: output_schedule["starts_at"],
        interval: output_schedule["interval"]
      )
    end
  end

  def output_schedules?
    output_schedules.present?
  end

  def name_sample
    name.to_s.truncate(SAMPLE_SIZE, omission: OMISSION).presence
  end

  def input_sample
    input.to_s.truncate(SAMPLE_SIZE, omission: OMISSION).presence
  end

  def schedules_sample
    schedules.presence&.to_json&.truncate(SAMPLE_SIZE, omission: OMISSION).presence
  end

  def output_sample
    output.presence&.to_json&.truncate(SAMPLE_SIZE, omission: OMISSION).presence
  end

  def output_name_sample
    output_name.to_s.truncate(SAMPLE_SIZE, omission: OMISSION).presence
  end

  def output_input_sample
    output_input.to_s.truncate(SAMPLE_SIZE, omission: OMISSION).presence
  end

  def output_schedules_sample
    output_schedules.presence&.to_json&.truncate(SAMPLE_SIZE, omission: OMISSION).presence
  end

  def programs_json
    Rails.root.join("config/examples.json").read
  end

  def initialized?
    status == "initialized"
  end

  def initialized!
    update!(status: "initialized")
  end

  def created?
    status == "created"
  end

  def created!
    update!(status: "created")
  end

  def in_progress?
    status == "in_progress"
  end

  def in_progress!
    update!(status: "in_progress")
  end

  def done?
    status == "done"
  end

  def done!
    update!(status: "done")
  end

  def errored?
    status == "errored"
  end

  def errored!
    update!(status: "errored")
  end

  def as_json(...)
    output.as_json(...)
  end

  def to_s
    name_sample.presence || output_name_sample.presence ||
      input_sample.presence || output_input_sample.presence ||
      schedules_sample.presence || output_schedules_sample.presence ||
      output_sample.presence || t("to_s", id: id)
  end
end
