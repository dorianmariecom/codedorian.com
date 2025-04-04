# frozen_string_literal: true

class ReplProgram < ApplicationRecord
  INPUT_SAMPLE_SIZE = Program::INPUT_SAMPLE_SIZE
  TIMEOUT = Program::TIMEOUT

  belongs_to :repl_session, touch: true

  has_one :user, through: :repl_session
  has_many :repl_programs, through: :repl_session

  has_many :repl_executions, dependent: :destroy

  validate { can!(:update, repl_session) }

  def previous_repl_program
    repl_programs.sort_by(&:id).reverse.detect { |repl_program| repl_program.id < id }
  end

  def previous_context!
    previous_repl_program&.context! || ::Code::Object::Context.new
  end

  def previous_repl_execution!
    previous_repl_program&.repl_execution!
  end

  def evaluate!
    return if previous_repl_execution!&.error.present?

    Current.with(user:) do
      context = previous_context!
      output = StringIO.new
      error = StringIO.new
      result = Code.evaluate(input, context:, output:, error:, timeout: TIMEOUT)
      repl_executions.create!(
        input:,
        result: result.to_s,
        output: output.string,
        error: error.string,
        context:
      )
    rescue Code::Error, Timeout::Error => e
      repl_executions.create!(
        input:,
        result: nil,
        output: nil,
        error: "#{e.class}: #{e.message}"
      )
    end
  end

  def repl_execution
    repl_executions.max_by(&:id)
  end

  def repl_execution!
    repl_execution || (evaluate! && repl_execution)
  end

  def context
    repl_execution&.context || ::Code::Object::Context.new
  end

  def context!
    repl_execution!&.context || ::Code::Object::Context.new
  end

  def input_sample
    input.to_s.truncate(INPUT_SAMPLE_SIZE, omission: "…").presence
  end

  def to_s
    input_sample.presence || t("to_s", id:)
  end
end
