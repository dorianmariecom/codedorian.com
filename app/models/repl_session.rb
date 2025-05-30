# frozen_string_literal: true

class ReplSession < ApplicationRecord
  INPUT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE
  OMISSION = "…"

  belongs_to :user, default: -> { Current.user! }, touch: true

  has_many :repl_programs, dependent: :destroy
  has_many :repl_executions, through: :repl_programs

  accepts_nested_attributes_for :repl_programs, allow_destroy: true

  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  def self.search_fields
    {
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

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
    input.truncate(INPUT_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def to_s
    name.presence || input_sample.presence || t("to_s", id: id)
  end
end
