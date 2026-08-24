# frozen_string_literal: true

class StripeInvoice < ApplicationRecord
  belongs_to :subscription, optional: true, touch: true
  has_one :user, through: :subscription

  validates :stripe_invoice_id, presence: true, uniqueness: true
  validates :currency, presence: true

  scope :where_user,
        ->(user) { joins(:subscription).where(subscriptions: { user: user }) }

  def paid? = status == "paid"
end
