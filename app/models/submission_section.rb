# frozen_string_literal: true

class SubmissionSection < ApplicationRecord
  belongs_to(:submission, touch: true)

  has_many(:submission_programs, dependent: :destroy)
  has_many(:submission_schedules, dependent: :destroy)
  has_many(:submission_deliveries, dependent: :destroy)

  scope(:where_submission, ->(submission) { where(submission: submission) })

  validate { can!(:update, submission) }
  validates(:locale, inclusion: { in: LOCALES_STRINGS })

  def self.search_fields
    {
      locale: {
        node: -> { arel_table[:locale] },
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
    name_sample.presence || description_sample.presence || t("to_s", id: id)
  end
end
