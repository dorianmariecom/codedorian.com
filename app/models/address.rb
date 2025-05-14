# frozen_string_literal: true

class Address < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }, touch: true

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  validates :address, presence: true
  validate { can!(:update, user) }

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
      address_components: {
        node: -> { arel_table[:address_components] },
        type: :string
      },
      formatted_address: {
        node: -> { arel_table[:formatted_address] },
        type: :string
      },
      geometry: {
        node: -> { arel_table[:geometry] },
        type: :string
      },
      place_id: {
        node: -> { arel_table[:place_id] },
        type: :string
      },
      types: {
        node: -> { arel_table[:types] },
        type: :string
      },
      primary: {
        node: -> { arel_table[:primary] },
        type: :boolean
      },
      verified: {
        node: -> { arel_table[:verified] },
        type: :boolean
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def address_components=(address_components)
    if address_components.is_a?(String) && address_components.present?
      super(JSON.parse(address_components))
    else
      super
    end
  rescue JSON::ParserError
    super
  end

  def geometry=(geometry)
    if geometry.is_a?(String) && geometry.present?
      super(JSON.parse(geometry))
    else
      super
    end
  rescue JSON::ParserError
    super
  end

  def types=(types)
    if types.is_a?(String) && types.present?
      super(JSON.parse(types))
    else
      super
    end
  rescue JSON::ParserError
    super
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

  def to_s
    address.presence || t("to_s", id: id)
  end
end
