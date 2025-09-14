# frozen_string_literal: true

class GenerateJob < ApplicationJob
  queue_as :default

  def perform(prompt:)
    Current.user = prompt.user

    prompt.generate!
  end
end
