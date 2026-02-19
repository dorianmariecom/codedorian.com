# frozen_string_literal: true

class SubmissionSection < ApplicationRecord
  belongs_to(:submission, touch: true)

  has_many(:submission_programs, dependent: :destroy)
  has_many(:submission_schedules, dependent: :destroy)
  has_many(:submission_deliveries, dependent: :destroy)

  accepts_nested_attributes_for(:submission_programs, allow_destroy: true)
  accepts_nested_attributes_for(:submission_schedules, allow_destroy: true)
  accepts_nested_attributes_for(:submission_deliveries, allow_destroy: true)

  scope(:where_submission, ->(submission) { where(submission: submission) })

  validate { can!(:update, self) }
  validates(:locale, inclusion: { in: LOCALES_STRINGS })

  before_validation(:copy_from_submission)

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

  def copy_from_submission
    return unless submission

    self.locale ||= submission.locale.presence || I18n.locale
    self.name ||= submission.name
    self.description ||= submission.description
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
