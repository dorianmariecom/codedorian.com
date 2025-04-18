# frozen_string_literal: true

class Execution < ApplicationRecord
  INPUT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE
  ERROR_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE
  OUTPUT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE
  RESULT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE
  OMISSION = "…"

  belongs_to :program, touch: true

  has_one :user, through: :program

  validate { can!(:update, program) }

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
