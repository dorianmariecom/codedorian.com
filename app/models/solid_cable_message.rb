# frozen_string_literal: true

class SolidCableMessage < SolidCable::Message
  include(RecordConcern)

  validate { can!(:update, self) }

  def self.search_fields
    {
      id: {
        node: -> { arel_table[:id] },
        type: :integer
      },
      channel_hash: {
        node: -> { arel_table[:channel_hash] },
        type: :integer
      },
      created_at: {
        node: -> { arel_table[:created_at] },
        type: :datetime
      }
    }
  end

  def channel_sample
    Truncate.strip(channel)
  end

  def payload_sample
    Truncate.strip(payload)
  end

  def to_s
    channel_sample.presence || payload_sample.presence || t("to_s", id: id)
  end
end
