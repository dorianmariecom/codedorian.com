# frozen_string_literal: true

class ReplSession < ApplicationRecord
  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:where_user, ->(user) { where(user: user) })

  has_many(:repl_programs, dependent: :destroy)
  has_many(:repl_executions, through: :repl_programs)

  accepts_nested_attributes_for(:repl_programs, allow_destroy: true)

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
    repl_programs.map(&:input)
  end

  def evaluate!
    repl_programs.map(&:evaluate!)
  end

  def input
    inputs.join("\n")
  end

  def input_sample
    Truncate.strip(input)
  end

  def to_s
    name.presence || input_sample.presence || t("to_s", id: id)
  end
end
