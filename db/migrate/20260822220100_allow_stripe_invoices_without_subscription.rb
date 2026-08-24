# frozen_string_literal: true

class AllowStripeInvoicesWithoutSubscription < ActiveRecord::Migration[8.1]
  def change
    change_column_null :stripe_invoices, :subscription_id, true
  end
end
