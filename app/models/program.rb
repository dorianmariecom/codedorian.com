# frozen_string_literal: true

class Program < ApplicationRecord
  TIMEOUT = 5.second

  belongs_to :user, default: -> { Current.user || User.new }

  has_many :executions, dependent: :destroy
  has_many :schedules, dependent: :destroy

  accepts_nested_attributes_for :schedules

  validate { can!(:update, user) }

  def evaluate!
    Current.with(user:) do
      output = StringIO.new
      error = StringIO.new
      result = Code.evaluate(input, output:, error:, timeout: TIMEOUT)
      executions.create!(
        input:,
        result: result.to_s,
        output: output.string,
        error: error.string
      )
    end
  rescue Code::Error, Timeout::Error => e
    executions.create!(
      input:,
      result: nil,
      output: nil,
      error: "#{e.class}: #{e.message}"
    )
  end

  def to_s
    input.presence || "program##{id}"
  end
end
