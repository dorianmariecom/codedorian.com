# frozen_string_literal: true

class ProgramPrompt < ApplicationRecord
  MODEL = "gpt-5-nano"
  STATUSES = %w[initialized created in_progress done errored].freeze

  PROMPT_1 = <<~PROMPT.freeze
    i created a programming language named "code", your goal is to
    generate a json object with the input of the program and its schedules
    from the name of the program provided by the user, the previous input
    and the previous schedules

    the schedules corresponding to when the program will be executed

    a schedule is a dictionary of a starts_at (datetime) and an interval (string)

    intervals are #{ProgramSchedule::INTERVALS.to_json}
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
    reply with the name of the program, the input in code of the program
    and the schedules of the program

    if nothing is provided, generate a random program
  PROMPT

  scope(:initialized, -> { where(status: :initialized) })
  scope(:created, -> { where(status: :created) })
  scope(:in_progress, -> { where(status: :in_progress) })
  scope(:done, -> { where(status: :done) })
  scope(:errored, -> { where(status: :errored) })
  scope(:generating, -> { where(status: %i[created in_progress]) })
  scope(:not_generating, -> { where.not(status: %i[created in_progress]) })
  scope(:where_user, -> (user) { joins(:user).where(users: { id: user }) })

  belongs_to(:user, default: -> { Current.user! }, touch: true)
  belongs_to(:program, optional: true, touch: true)
  has_many(:program_prompt_schedules, dependent: :destroy)

  accepts_nested_attributes_for(:program_prompt_schedules, allow_destroy: true)

  validate { can!(:update, user) }
  validates(:status, inclusion: { in: STATUSES })

  before_validation { log_in(self.user ||= Current.user!) }

  after_create_commit { created! unless created? }

  def self.search_fields
    {
      status: {
        node: -> { arel_table[:status] },
        type: :string
      },
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
      error_class: {
        node: -> { arel_table[:error_class] },
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
                      enum: ProgramSchedule::INTERVALS
                    }
                  },
                  required: %i[starts_at interval],
                  additionalProperties: false
                }
              }
            },
            required: %i[name input schedules],
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
        { role: "user", content: program_prompt_schedules.to_json },
        { role: "system", content: PROMPT_5 },
        { role: "system", content: programs_json },
        { role: "system", content: PROMPT_6 }
      ]
    }.to_json

    response = http.request(request)
    json = JSON.parse(response.body)
    content = json.dig("choices", 0, "message", "content")
    raise(json.to_json) if content.blank?

    update!(output: JSON.parse(content))
    copy!
    done!
  rescue StandardError => e
    errored!
    update!(error_class: e.class)
    update!(error_message: e.message)
    update!(error_backtrace: e.backtrace.join("\n"))
  end

  def output_name
    (
      output.is_a?(Hash) && output["name"].is_a?(String) && output["name"]
    ).presence
  end

  def output_name?
    output_name.present?
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

  def output_program_schedules
    return [] if output_schedules.blank?

    output_schedules.map do |output_schedule|
      ProgramSchedule.new(
        starts_at: output_schedule["starts_at"],
        interval: output_schedule["interval"]
      )
    end
  end

  def output_schedules?
    output_schedules.present?
  end

  def name_sample
    Truncate.strip(name)
  end

  def input_sample
    Truncate.strip(input)
  end

  def output_sample
    Truncate.strip(output.presence&.to_json)
  end

  def output_name_sample
    Truncate.strip(output_name)
  end

  def output_input_sample
    Truncate.strip(output_input)
  end

  def error_class_sample
    Truncate.strip(error_class)
  end

  def error_message_sample
    Truncate.strip(error_message)
  end

  def error_backtrace_sample
    Truncate.strip(error_backtrace)
  end

  def output_schedules_sample
    Truncate.strip(output_schedules.presence&.to_json)
  end

  def programs_json
    Rails.root.join("config/examples.json").read
  end

  def initialized?
    status == "initialized"
  end

  def initialized!
    update!(status: :initialized)
  end

  def created?
    status == "created"
  end

  def created!
    update!(status: :created)
  end

  def in_progress?
    status == "in_progress"
  end

  def in_progress!
    update!(status: :in_progress)
  end

  def done?
    status == "done"
  end

  def done!
    update!(status: :done)
  end

  def errored?
    status == "errored"
  end

  def errored!
    update!(status: :errored)
  end

  def generating?
    created? || in_progress?
  end

  def not_generating?
    !generating?
  end

  def error_app_backtrace
    Backtrace.app(error_backtrace)
  end

  def translated_status
    t("statuses.#{status}")
  end

  def copy!
    return unless program

    program.update!(
      name: output_name,
      input: output_input,
      program_schedules: output_program_schedules
    )
  end

  def to_s
    error_class_sample.presence || name_sample.presence ||
      output_name_sample.presence || input_sample.presence ||
      output_input_sample.presence || output_schedules_sample.presence ||
      output_sample.presence || t("to_s", id: id)
  end
end
