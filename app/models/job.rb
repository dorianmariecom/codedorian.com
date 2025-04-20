# frozen_string_literal: true

class Job < SolidQueue::Job
  MESSAGE_LIMIT = 140
  OMISSION = "…"

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
