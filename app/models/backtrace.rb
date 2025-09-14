# frozen_string_literal: true

class Backtrace
  APP_REGEXP = %r{\A#{Rails.root}/}

  attr_reader :backtrace

  def initialize(backtrace)
    @backtrace = backtrace
  end

  def self.app(...)
    new(...).app
  end

  def app
    backtrace
      .to_s
      .lines
      .grep(APP_REGEXP)
      .map { |line| line.gsub(APP_REGEXP, "").gsub(/\n\Z/, "") }
      .join("\n")
      .strip
      .presence
  end
end
