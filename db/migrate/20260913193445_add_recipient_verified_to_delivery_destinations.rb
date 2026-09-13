# frozen_string_literal: true

class AddRecipientVerifiedToDeliveryDestinations < ActiveRecord::Migration[8.0]
  def change
    add_column :delivery_destinations,
               :recipient_verified,
               :boolean,
               default: false,
               null: false
    reversible do |direction|
      direction.up { backfill_recipient_verification }
    end
  end

  def backfill_recipient_verification
    execute <<~SQL.squish
      UPDATE delivery_destinations AS destination
      SET recipient_verified = TRUE
      FROM delivery_channels AS channel
      WHERE destination.delivery_channel_id = channel.id AND channel.key = 'email'
      AND EXISTS (
        SELECT 1 FROM email_addresses AS address
        WHERE address.user_id = destination.user_id AND address.verified = TRUE
        AND LOWER(TRIM(address.email_address)) = LOWER(TRIM(destination.recipient))
      )
    SQL
  end
end
