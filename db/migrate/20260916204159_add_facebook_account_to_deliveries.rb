# frozen_string_literal: true

class AddFacebookAccountToDeliveries < ActiveRecord::Migration[8.1]
  def change
    add_reference :deliveries, :facebook_account, foreign_key: true
  end
end
