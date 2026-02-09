# frozen_string_literal: true

class SubmissionProgram < ApplicationRecord
  belongs_to(:submission, touch: true)
  belongs_to(:form_schedule, optional: true)
  belongs_to(:form_program, optional: true)
  belongs_to(:form_delivery, optional: true)

  scope(:where_submission, ->(submission) { where(submission: submission) })

  validate { can!(:update, submission) }

  def self.search_fields
    {
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      description: {
        node: -> { arel_table[:description] },
        type: :string
      },
      position: {
        node: -> { arel_table[:position] },
        type: :integer
      },
      form_program_name: {
        node: -> { arel_table[:form_program_name] },
        type: :string
      },
      form_program_description: {
        node: -> { arel_table[:form_program_description] },
        type: :string
      },
      form_schedule_starts_at: {
        node: -> { arel_table[:form_schedule_starts_at] },
        type: :datetime
      },
      form_schedule_interval: {
        node: -> { arel_table[:form_schedule_interval] },
        type: :string
      },
      form_schedule_name: {
        node: -> { arel_table[:form_schedule_name] },
        type: :string
      },
      form_schedule_description: {
        node: -> { arel_table[:form_schedule_description] },
        type: :string
      },
      form_delivery_name: {
        node: -> { arel_table[:form_delivery_name] },
        type: :string
      },
      form_delivery_description: {
        node: -> { arel_table[:form_delivery_description] },
        type: :string
      },
      **base_search_fields
    }
  end

  def name_sample
    Truncate.strip(name)
  end

  def description_sample
    Truncate.strip(description)
  end

  def form_program_name_sample
    Truncate.strip(form_program_name)
  end

  def form_schedule_name_sample
    Truncate.strip(form_schedule_name)
  end

  def form_delivery_name_sample
    Truncate.strip(form_delivery_name)
  end

  def to_s
    name_sample.presence || form_program_name_sample.presence ||
      form_schedule_name_sample.presence ||
      form_delivery_name_sample.presence || description_sample.presence ||
      t("to_s", id: id)
  end
end
