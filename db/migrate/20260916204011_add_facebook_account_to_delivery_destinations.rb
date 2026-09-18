# frozen_string_literal: true

class AddFacebookAccountToDeliveryDestinations < ActiveRecord::Migration[8.1]
  def change
    add_reference :delivery_destinations, :facebook_account, foreign_key: true
  end
end
