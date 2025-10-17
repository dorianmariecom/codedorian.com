# frozen_string_literal: true

class Address < ApplicationRecord
  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:primary, -> { where(primary: true) })
  scope(:not_primary, -> { where(primary: false) })
  scope(:verified, -> { where(verified: true) })
  scope(:not_verified, -> { where(verified: false) })
  scope(:where_user, ->(user) { where(user: user) })

  validates(:address, presence: true)
  validate { can!(:update, user) }
  validate(:parse_autocomplete, on: :controller)

  before_validation { self.user ||= Current.user! }

  before_update do
    not_verified! if address_changed? && (verified? || verifying?)
  end

  def self.search_fields
    {
      address: {
        node: -> { arel_table[:address] },
        type: :string
      },
      autocomplete: {
        node: -> { arel_table[:autocomplete] },
        type: :string
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def primary?
    !!primary
  end

  def not_primary?
    !primary?
  end

  def primary!
    update!(primary: true)
  end

  def not_primary!
    update!(primary: false)
  end

  def verified?
    !!verified
  end

  def not_verified?
    !verified?
  end

  def verified!
    update!(verified: true)
  end

  def not_verified!
    update!(verified: false)
  end

  def autocomplete_json
    JSON.pretty_generate(autocomplete)
  end

  def formatted_address
    return if autocomplete.blank?
    return unless autocomplete.is_a?(Hash)

    autocomplete["formattedAddress"].presence
  end

  def parse_autocomplete
    self.autocomplete = JSON.parse(autocomplete.to_s)
  rescue JSON::ParserError
    self.autocomplete = nil
  end

  def to_s
    formatted_address.presence || address.presence || t("to_s", id: id)
  end
end
