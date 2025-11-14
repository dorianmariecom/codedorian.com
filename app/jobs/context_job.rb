# frozen_string_literal: true

class ContextJob < ApplicationJob
  def perform(current: nil, context: nil, **args)
    Current.with(**current) do
      set_error_context(**context)
      perform_with_context(**args)
    end
  end
end
