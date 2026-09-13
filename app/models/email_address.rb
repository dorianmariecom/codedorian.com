# frozen_string_literal: true

class EmailAddress < ApplicationRecord
  EMAIL_ADDRESS_REGEXP = URI::MailTo::EMAIL_REGEXP
  MAGIC_LINK_EXPIRATION = 15.minutes

  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:primary, -> { where(primary: true) })
  scope(:not_primary, -> { where(primary: false) })
  scope(:verified, -> { where(verified: true) })
  scope(:not_verified, -> { where(verified: false) })
  scope(:where_user, ->(user) { where(user: user) })
  scope :where_verification_email,
        ->(email) do
          where(
            "LOWER(BTRIM(email_addresses.email_address)) = ?",
            email.to_s.strip.downcase
          )
        end

  normalizes(
    :email_address,
    with: ->(email_address) { email_address.to_s.downcase.strip }
  )

  validates(:email_address, presence: true)
  validates(:email_address, format: { with: EMAIL_ADDRESS_REGEXP })
  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  before_validation :inherit_verification

  def verification_email = email_address
  def verification_complete? = verified?

  def verification_purpose
    [
      :account_email_confirmation,
      email_address,
      user_id,
      updated_at.utc.iso8601(6)
    ]
  end

  def self.find_by_verification(id, token)
    address = find_by(id: id)
    return unless address && !address.verified?

    return unless find_signed(token.to_s, purpose: address.verification_purpose) == address

    address
  end

  def verification_token
    signed_id(purpose: verification_purpose, expires_in: 24.hours)
  end

  def inherit_verification
    unless new_record? || will_save_change_to_email_address? ||
             will_save_change_to_user_id?
      return
    end

    inherited =
      SharedEmailVerification.verified?(
        user_id: user_id,
        email: email_address,
        except_address: id
      )
    self.verified = (new_record? && verified?) || inherited
  end

  def self.find_by_magic_link(id, token)
    address = find_by(id: id)
    return unless address

    signed_address =
      find_signed(token.to_s, purpose: address.magic_link_purpose)
    address if signed_address == address
  end

  def magic_link_purpose
    [:magic_login, email_address, user_id, updated_at.utc.iso8601(6)]
  end

  def magic_link_token
    signed_id(purpose: magic_link_purpose, expires_in: MAGIC_LINK_EXPIRATION)
  end

  def self.search_fields
    {
      email_address: {
        node: -> { arel_table[:email_address] },
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

  def email_address_with_name
    ActionMailer::Base.email_address_with_name(email_address, user.name)
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

  def email_address_sample
    Truncate.strip(email_address)
  end

  def user_sample
    Truncate.strip(user)
  end

  def to_s
    Utils.join(
      email_address_sample.presence || user_sample,
      id_sample
    ).presence || t("to_s", id:)
  end

  def to_code
    Code::Object::EmailAddress.new(
      id: id,
      created_at: created_at,
      email_address: email_address,
      primary: primary,
      updated_at: updated_at,
      user_id: user_id,
      verification_code: verification_code,
      verified: verified
    )
  end
end
