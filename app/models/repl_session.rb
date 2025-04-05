# frozen_string_literal: true

class ReplSession < ApplicationRecord
  INPUT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE

  belongs_to :user, default: -> { Current.user! }, touch: true

  has_many :repl_programs, dependent: :destroy
  has_many :repl_executions, through: :repl_programs

  accepts_nested_attributes_for :repl_programs, allow_destroy: true

  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  def inputs
    repl_programs.sort_by(&:id).map(&:input)
  end

  def evaluate!
    repl_programs.map(&:evaluate!)
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
