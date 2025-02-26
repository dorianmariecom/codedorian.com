# frozen_string_literal: true

class Execution < ApplicationRecord
  INPUT_SAMPLE_SIZE = 140
  ERROR_SAMPLE_SIZE = 140
  OUTPUT_SAMPLE_SIZE = 140
  RESULT_SAMPLE_SIZE = 140

  belongs_to :program, touch: true

  has_one :user, through: :program

  validate { can!(:update, program) }

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
