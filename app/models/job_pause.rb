# frozen_string_literal: true

class JobPause < SolidQueue::Pause
  include(RecordConcern)

  validate { can!(:update, :job_pause) }

  def self.search_fields
    {
      queue_name: {
        node: -> { arel_table[:queue_name] },
        type: :string
      },
      **base_search_fields
    }
  end

  def queue_name_sample
    Truncate.strip(queue_name)
  end

  def to_s
    Utils.join(queue_name_sample, id_sample).presence || t("to_s", id:)
  end
end
