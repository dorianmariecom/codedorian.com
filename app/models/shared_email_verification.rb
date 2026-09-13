# frozen_string_literal: true

class SharedEmailVerification
  def self.verified?(
    user_id:,
    email:,
    except_address: nil,
    except_destination: nil
  )
    EmailAddress
      .where(user_id: user_id, verified: true)
      .where_verification_email(email)
      .where.not(id: except_address)
      .exists? ||
      DeliveryDestination
        .joins(:delivery_channel)
        .where(user_id: user_id, recipient_verified: true)
        .where_verification_email(email)
        .where(delivery_channels: { key: "email" })
        .where.not(id: except_destination)
        .exists?
  end

  def self.confirm(record, token)
    record.user.with_lock do
      record.lock!
      return false if record.verification_complete?
      unless record.class.find_signed(
               token.to_s,
               purpose: record.verification_purpose
             ) == record
        return false
      end

      email = record.verification_email
      now = Time.current
      EmailAddress
        .where_user(record.user)
        .where_verification_email(email)
        .update_all(verified: true, updated_at: now)
      DeliveryDestination
        .joins(:delivery_channel)
        .where_user(record.user)
        .where_verification_email(email)
        .where(delivery_channels: { key: "email" })
        .update_all(recipient_verified: true, updated_at: now)
      true
    end
  end
end
