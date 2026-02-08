# frozen_string_literal: true

class Version < PaperTrail::Version
  include(RecordConcern)

  %i[
    address
    configuration
    country_code_ip_address
    datum
    device
    email_address
    example
    example_schedule
    form_delivery
    form_program
    form_schedule
    guest
    handle
    job_context
    log
    message
    name
    password
    phone_number
    program
    program_execution
    program_schedule
    time_zone
    token
    user
  ].each do |model|
    scope(:"where_#{model}", ->(record) { where(item: record) })
  end

  validates(:event, :item_id, :item_type, presence: true, on: :controller)

  validate(:parse_and_validate_object, on: :controller)
  validate(:parse_and_validate_object_changes, on: :controller)

  def self.search_fields
    {
      event: {
        node: -> { arel_table[:event] },
        type: :string
      },
      item_type: {
        node: -> { arel_table[:item_type] },
        type: :string
      },
      item_id: {
        node: -> { arel_table[:item_id] },
        type: :integer
      },
      whodunnit: {
        node: -> { arel_table[:whodunnit] },
        type: :integer
      },
      object: {
        node: -> { arel_table[:object] },
        type: :string
      },
      object_changes: {
        node: -> { arel_table[:object_changes] },
        type: :string
      },
      **base_search_fields
    }
  end

  def parse_and_validate_object
    self.object = JSON.parse(object.to_s)
  rescue JSON::ParserError
    errors.add(:object, t("invalid_json"))
  end

  def parse_and_validate_object_changes
    self.object_changes = JSON.parse(object_changes.to_s)
  rescue JSON::ParserError
    errors.add(:object_changes, t("invalid_json"))
  end

  def object_json
    JSON.pretty_generate(object)
  end

  def object_changes_json
    JSON.pretty_generate(object_changes)
  end

  def sample_object_changes
    Truncate.strip(object_changes.to_json)
  end

  def sample_object
    Truncate.strip(object.to_json)
  end

  def to_s
    sample_object_changes || sample_object || t("to_s", id: id)
  end
end
