# frozen_string_literal: true

class ReplSession < ApplicationRecord
  INPUT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE

  belongs_to :user, default: -> { Current.user! }, touch: true

  has_many :repl_programs, dependent: :destroy
  has_many :repl_executions, through: :repl_programs

  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  def inputs
    repl_programs.map(&:input)
  end

  def input
    inputs.join("\n")
  end

  def input_sample
    input.truncate(INPUT_SAMPLE_SIZE, omission: "…").presence
  end

  def to_s
    name.presence || input_sample.presence || t("to_s", id:)
  end
end
