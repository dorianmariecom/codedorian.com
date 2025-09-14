# frozen_string_literal: true

class ReplExecution < ApplicationRecord
  INPUT_SAMPLE_SIZE = 140
  ERROR_SAMPLE_SIZE = 140
  OUTPUT_SAMPLE_SIZE = 140
  RESULT_SAMPLE_SIZE = 140
  OMISSION = "…"

  belongs_to :repl_program, touch: true
  has_one :repl_session, through: :repl_program
  has_one :user, through: :repl_session

  serialize :context, coder: YAML, yaml: { unsafe_load: true }

  validate { can!(:update, repl_program) }

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
      result: {
        node: -> { arel_table[:result] },
        type: :string
      },
      error: {
        node: -> { arel_table[:error] },
        type: :string
      },
      context: {
        node: -> { arel_table[:context] },
        type: :string
      },
      **base_search_fields
    }
  end

  def input_sample
    input.to_s.truncate(INPUT_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def output_sample
    output.to_s.truncate(OUTPUT_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def result_sample
    result.to_s.truncate(RESULT_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def error_sample
    error.to_s.truncate(ERROR_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def to_s
    error_sample.presence || output_sample.presence || result_sample.presence ||
      input_sample.presence || t("to_s", id: id)
  end
end
