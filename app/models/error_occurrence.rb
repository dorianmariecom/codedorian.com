# frozen_string_literal: true

class ErrorOccurrence < SolidErrors::Occurrence
  belongs_to :error

  def app_backtrace
    backtrace
      .lines
      .grep(%r{^#{Rails.root}/})
      .map { |line| line.gsub(Rails.root.join.to_s, "").strip }
      .join
      .strip
      .presence
  end

  def pretty_json_context
    JSON.pretty_generate(context)
  end
end
