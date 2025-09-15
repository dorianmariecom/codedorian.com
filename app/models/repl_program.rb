# frozen_string_literal: true

class ReplProgram < ApplicationRecord
  TIMEOUT = 600

  belongs_to :repl_session, touch: true
  has_many :repl_executions, dependent: :destroy
  has_many :repl_programs, through: :repl_session
  has_one :user, through: :repl_session
  has_many :prompts, as: :program, dependent: :destroy

  validate { can!(:update, repl_session) }

  def self.search_fields
    {
      input: {
        node: -> { arel_table[:input] },
        type: :string
      },
      **base_search_fields
    }
  end

  def previous_repl_program
    repl_programs
      .sort_by(&:id)
      .reverse
      .detect { |repl_program| repl_program.id < id }
  end

  def previous_context!
    previous_repl_program&.context! || ::Code::Object::Context.new
  end

  def previous_repl_execution!
    previous_repl_program&.repl_execution!
  end

  def evaluate!
    return if previous_repl_execution!&.error.present?

    Current.with(user: user) do
      repl_execution = repl_executions.create!(status: :in_progress)
      context = previous_context!
      output = StringIO.new
      error = StringIO.new
      result =
        Code.evaluate(
          input,
          context: context,
          output: output,
          error: error,
          timeout: TIMEOUT
        )
      repl_execution.update!(
        input: input,
        result: result.inspect,
        output: output.string,
        error: error.string,
        status: :done
      )
    rescue Code::Error => e
      repl_execution.update!(
        input: input,
        status: :errored,
        error_class: e.class,
        error_message: e.message,
        error_backtrace: e.backtrace.join("\n")
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
    input.to_s.truncate(SAMPLE_SIZE, omission: OMISSION).presence
  end

  def to_s
    input_sample.presence || t("to_s", id: id)
  end
end
