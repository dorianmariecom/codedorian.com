# frozen_string_literal: true

class SubmissionSchedule < ApplicationRecord
  include(ScheduleConcern)

  belongs_to(:submission_section, touch: true)
  belongs_to(:form_schedule)
  has_one(:submission, through: :submission_section)

  scope(
    :where_submission_section,
    ->(submission_section) { where(submission_section: submission_section) }
  )
  scope(
    :where_submission,
    lambda do |submission|
      joins(:submission_section).where(
        submission_sections: {
          submission_id: submission
        }
      )
    end
  )

  validate { can!(:update, submission_section) }
  validates(:locale, inclusion: { in: LOCALES_STRINGS })

  def self.search_fields
    {
      locale: {
        node: -> { arel_table[:locale] },
        type: :string
      },
      starts_at: {
        node: -> { arel_table[:starts_at] },
        type: :datetime
      },
      interval: {
        node: -> { arel_table[:interval] },
        type: :string
      },
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      description: {
        node: -> { arel_table[:description] },
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

  def to_s
    name_sample.presence || description_sample.presence ||
      translated_interval.presence || t("to_s", id: id)
  end
end
