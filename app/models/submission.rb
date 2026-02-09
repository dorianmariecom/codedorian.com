# frozen_string_literal: true

class Submission < ApplicationRecord
  has_many(:submission_programs, dependent: :destroy)

  validate { can!(:update, :submission) }
  validates(:locale, inclusion: { in: LOCALES_STRINGS })

  def self.search_fields
    {
      email_address: {
        node: -> { arel_table[:email_address] },
        type: :string
      },
      phone_number: {
        node: -> { arel_table[:phone_number] },
        type: :string
      },
      given_name: {
        node: -> { arel_table[:given_name] },
        type: :string
      },
      family_name: {
        node: -> { arel_table[:family_name] },
        type: :string
      },
      locale: {
        node: -> { arel_table[:locale] },
        type: :string
      },
      **base_search_fields
    }
  end

  def email_sample
    Truncate.strip(email_address)
  end

  def phone_sample
    Truncate.strip(phone_number)
  end

  def full_name
    [given_name, family_name].compact_blank.join(" ")
  end

  def to_s
    full_name.presence || email_sample.presence || phone_sample.presence ||
      t("to_s", id: id)
  end
end
