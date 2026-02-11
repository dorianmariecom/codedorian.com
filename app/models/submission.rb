# frozen_string_literal: true

class Submission < ApplicationRecord
  EMAIL_ADDRESS_REGEXP = URI::MailTo::EMAIL_REGEXP

  has_many(:submission_sections, dependent: :destroy)
  normalizes(
    :email_address,
    with: ->(email_address) { email_address.to_s.downcase.strip }
  )
  normalizes(
    :phone_number,
    with: ->(phone_number) { Phonelib.parse(phone_number).e164 }
  )

  validate { can!(:update, :submission) }
  validates(:locale, inclusion: { in: LOCALES_STRINGS })
  validates(:given_name, presence: true)
  validates(:family_name, presence: true)
  validates(
    :email_address,
    format: {
      with: EMAIL_ADDRESS_REGEXP
    },
    allow_blank: true
  )
  validate do
    if phone_number.present? && phonelib.invalid?
      errors.add(:phone_number, :invalid)
    end
  end
  validate do
    if phone_number.present? && phonelib.impossible?
      errors.add(:phone_number, :impossible)
    end
  end

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

  def phonelib
    Phonelib.parse(phone_number)
  end

  def phone_number_formatted
    phonelib.international
  end

  def to_s
    full_name.presence || email_sample.presence || phone_sample.presence ||
      t("to_s", id: id)
  end
end
