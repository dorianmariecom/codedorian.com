# frozen_string_literal: true

module LogConcern
  def log!(message)
    Log.create!(message: message, context: Log.convert(Current.context))
  end
end
