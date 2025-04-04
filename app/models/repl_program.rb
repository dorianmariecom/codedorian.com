# frozen_string_literal: true

class ReplProgram < ApplicationRecord
  INPUT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE

  belongs_to :repl_session, touch: true

  has_one :user, through: :repl_session

  has_many :repl_executions, dependent: :destroy

  validate { can!(:update, repl_session) }

  def input_sample
    input.to_s.truncate(INPUT_SAMPLE_SIZE, omission: "…").presence
  end

  def to_s
    input_sample.presence || t("to_s", id:)
  end
end
