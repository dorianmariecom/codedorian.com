# frozen_string_literal: true

class Truncate
  attr_reader :string

  def initialize(string)
    @string = string
  end

  def self.strip(...)
    new(...).strip
  end

  def strip
    string.to_s.truncate(SAMPLE_SIZE, omission: OMISSION).strip.presence
  end
end
