# frozen_string_literal: true

require "zxcvbn"

class PasswordValidator
  class Result
    attr_reader :success, :message

    def initialize(success, message)
      @success = success
      @message = message
    end

    def success?
      !!success
    end

    def failure?
      !success?
    end
  end

  MIN_SCORE = 4 # minimum centuries crack time

  def initialize(password, words: [])
    @password = password
    @words = words
  end

  def self.check(...)
    new(...).check
  end

  def check
    Result.new(success?, message)
  end

  private

  attr_reader :password, :words

  def result
    @result ||= Zxcvbn.test(password, words)
  end

  def success?
    result.score >= MIN_SCORE
  end

  def message
    messages.uniq.to_sentence
  end

  def messages
    result.match_sequence.map { |sequence| interpret(sequence) }
  end

  def interpret(sequence)
    I18n.t("password_validator.model.sequence.#{sequence.pattern}")
  end
end
