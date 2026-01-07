# frozen_string_literal: true

class JobSemaphore < SolidQueue::Semaphore
  include(RecordConcern)

  validate { can!(:update, :job_semaphore) }

  def self.search_fields
    {
      key: {
        node: -> { arel_table[:key] },
        type: :string
      },
      value: {
        node: -> { arel_table[:value] },
        type: :integer
      },
      expires_at: {
        node: -> { arel_table[:expires_at] },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def key_sample
    Truncate.strip(key.to_json)
  end

  def value_sample
    Truncate.strip(value.to_json)
  end

  def expires_at_sample
    Truncate.strip(expires_at)
  end

  def key_json
    JSON.pretty_generate(key)
  end

  def value_json
    JSON.pretty_generate(value)
  end

  def to_s
    key_sample.presence || value_sample.presence ||
      expires_at_sample.presence || t("to_s", id: id)
  end
end
