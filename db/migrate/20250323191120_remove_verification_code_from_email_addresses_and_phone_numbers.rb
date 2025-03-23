# frozen_string_literal: true

class RemoveVerificationCodeFromEmailAddressesAndPhoneNumbers < ActiveRecord::Migration[8.1]
  def change
    remove_column :email_addresses, :verification_code, :string
    remove_column :phone_numbers, :verification_code, :string
  end
end
