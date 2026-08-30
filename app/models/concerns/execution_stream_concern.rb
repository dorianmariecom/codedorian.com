# frozen_string_literal: true

module ExecutionStreamConcern
  extend ActiveSupport::Concern

  STREAM_CHANNELS = %w[output error].freeze

  def stream_io(channel)
    ExecutionStream.new(execution: self, channel: channel)
  end

  def append_to_stream!(channel, content)
    channel = channel.to_s
    raise ArgumentError, "invalid stream channel: #{channel}" unless
      channel.in?(STREAM_CHANNELS)

    content = content.to_s
    return if content.empty?

    connection = self.class.connection
    column = connection.quote_column_name(channel)
    updated_at = connection.quote_column_name(:updated_at)
    updated =
      self.class
        .where(id: id)
        .update_all(
          [
            "#{column} = COALESCE(#{column}, '') || ?, #{updated_at} = ?",
            content,
            Time.current
          ]
        )

    raise ActiveRecord::RecordNotFound, self.class.name unless updated == 1

    broadcast_refresh_to(self)
    content
  end
end
