# frozen_string_literal: true

class JobBatch < SolidQueue::Batch
  include(RecordConcern)

  has_many(
    :jobs,
    dependent: :nullify,
    foreign_key: :batch_id,
    inverse_of: :batch
  )
  has_many(
    :batch_executions,
    class_name: "JobBatchExecution",
    foreign_key: :batch_id,
    dependent: :destroy,
    inverse_of: :batch
  )

  validate { can!(:update, :job_batch) }
  validate(:parse_and_validate_metadata, on: :controller)

  def self.search_fields
    {
      active_job_batch_id: {
        node: -> { arel_table[:active_job_batch_id] },
        type: :string
      },
      description: {
        node: -> { arel_table[:description] },
        type: :string
      },
      total_jobs: {
        node: -> { arel_table[:total_jobs] },
        type: :integer
      },
      completed_jobs: {
        node: -> { arel_table[:completed_jobs] },
        type: :integer
      },
      failed_jobs: {
        node: -> { arel_table[:failed_jobs] },
        type: :integer
      },
      enqueued_at: {
        node: -> { arel_table[:enqueued_at] },
        type: :datetime
      },
      finished_at: {
        node: -> { arel_table[:finished_at] },
        type: :datetime
      },
      failed_at: {
        node: -> { arel_table[:failed_at] },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def metadata=(value)
    @metadata_input = value
    parsed = value.is_a?(String) ? JSON.parse(value) : value
    @invalid_metadata = !parsed.is_a?(Hash)
    super(parsed) unless @invalid_metadata
  rescue JSON::ParserError
    @invalid_metadata = true
  end

  def parse_and_validate_metadata
    errors.add(:metadata, t("invalid_json")) if @invalid_metadata
  end

  def metadata_json
    @invalid_metadata ? @metadata_input : JSON.pretty_generate(metadata)
  end

  def to_s
    Utils.join(
      Truncate.strip(description).presence || active_job_batch_id,
      id_sample
    ).presence || t("to_s", id:)
  end

  def to_code
    Code::Object::JobBatch.new(attributes)
  end
end
