# frozen_string_literal: true

class Job < SolidQueue::Job
  MESSAGE_LIMIT = 140
  OMISSION = "…"

  def self.discard_all
    find_each(&:discard!)
  end

  def self.retry_all
    find_each(&:retry!)
  end

  def retry!
    send(:retry)
  end

  def delete!
    delete
  end

  def discard!
    discard
  rescue SolidQueue::Execution::UndiscardableError
  end

  def pretty_json_arguments
    JSON.pretty_generate(arguments)
  end

  def to_s
    "#{queue_name}: #{class_name}: #{arguments["arguments"]}".truncate(
      MESSAGE_LIMIT,
      omission: OMISSION
    )
  end
end
