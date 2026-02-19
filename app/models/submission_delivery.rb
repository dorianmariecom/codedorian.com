# frozen_string_literal: true

class SubmissionDelivery < ApplicationRecord
  belongs_to(:submission_section, touch: true)
  belongs_to(:form_delivery)
  has_one(:submission, through: :submission_section)
  before_validation(:copy_from_form_delivery)

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

  validate { can!(:update, self) }
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
      label: {
        node: -> { arel_table[:label] },
        type: :string
      },
      description: {
        node: -> { arel_table[:description] },
        type: :string
      },
      **base_search_fields
    }
  end

  def copy_from_form_delivery
    return unless form_delivery

    self.locale ||= form_delivery.locale.presence || I18n.locale
    self.name ||= form_delivery.name
    self.label ||= form_delivery.label
    self.description ||= form_delivery.description
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
