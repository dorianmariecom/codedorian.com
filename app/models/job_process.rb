# frozen_string_literal: true

class JobProcess < SolidQueue::Process
  include(RecordConcern)

  validate { can!(:update, :job_process) }

  def self.search_fields
    {
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      hostname: {
        node: -> { arel_table[:hostname] },
        type: :string
      },
      kind: {
        node: -> { arel_table[:kind] },
        type: :string
      },
      pid: {
        node: -> { arel_table[:pid] },
        type: :integer
      },
      supervisor_id: {
        node: -> { arel_table[:supervisor_id] },
        type: :integer
      },
      last_heartbeat_at: {
        node: -> { arel_table[:last_heartbeat_at] },
        type: :datetime
      },
      metadata: {
        node: -> { arel_table[:metadata] },
        type: :string
      },
      **base_search_fields
    }
  end

  def metadata=(metadata)
    if metadata.is_a?(String)
      self.metadata = JSON.parse(metadata)
    else
      super
    end
  rescue JSON::ParserError
    errors.add(:metadata, t("invalid_json"))
  end

  def name_sample
    Truncate.strip(name)
  end

  def kind_sample
    Truncate.strip(kind)
  end

  def hostname_sample
    Truncate.strip(hostname)
  end

  def pid_sample
    Truncate.strip(pid)
  end

  def metadata_sample
    Truncate.strip(metadata.to_json)
  end

  def metadata_json
    JSON.pretty_generate(metadata)
  end

  def to_s
    name_sample.presence || kind_sample.presence || hostname_sample.presence ||
      pid_sample.presence || metadata_sample.presence || t("to_s", id: id)
  end
end
