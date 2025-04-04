# frozen_string_literal: true

class ReplExecution < ApplicationRecord
  INPUT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE
  ERROR_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE
  OUTPUT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE
  RESULT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE

  belongs_to :repl_program, touch: true
  has_one :repl_session, through: :repl_program
  has_one :user, through: :repl_session

  serialize :context, coder: YAML, yaml: { unsafe_load: true }

  validate { can!(:update, repl_program) }

  def input_sample
    input.to_s.truncate(INPUT_SAMPLE_SIZE, omission: "…").presence
  end

  def output_sample
    output.to_s.truncate(OUTPUT_SAMPLE_SIZE, omission: "…").presence
  end

  def result_sample
    result.to_s.truncate(RESULT_SAMPLE_SIZE, omission: "…").presence
  end

  def error_sample
    error.to_s.truncate(ERROR_SAMPLE_SIZE, omission: "…").presence
  end

  def to_s
    error_sample.presence || output_sample.presence || result_sample.presence ||
      input_sample.presence || t("to_s", id:)
  end
end
