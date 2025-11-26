# frozen_string_literal: true

class ReplSessionEvaluateJob < ContextJob
  queue_as :default

  def perform_with_context(repl_session:)
    previous_term_signal = trap("TERM") do
      repl_session.repl_execution.update!(
        status: :errored,
        error_class: "SignalException",
        error_message: "SIGTERM",
        error_backtrace: Thread.current.backtrace.join("\n")
      )
    end

    repl_session.evaluate!
  ensure
    trap("TERM", previous_term_signal)
  end
end
