# frozen_string_literal: true

class ProgramEvaluateJob < ContextJob
  queue_as :default

  def perform_with_context(program:)
    previous_term_signal = trap("TERM") do
      program.program_execution.update!(
        status: :errored,
        error_class: "SignalException",
        error_message: "SIGTERM",
        error_backtrace: Thread.current.backtrace.join("\n")
      )
    end

    program.evaluate!
  ensure
    trap("TERM", previous_term_signal)
  end
end
