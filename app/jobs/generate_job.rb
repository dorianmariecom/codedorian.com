# frozen_string_literal: true

class GenerateJob < ApplicationJob
  queue_as :default

  def perform(prompt:)
    prompt.generate!
  end
end
