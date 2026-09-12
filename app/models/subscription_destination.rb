# frozen_string_literal: true

class SubscriptionDestination < ApplicationRecord
  belongs_to :subscription
  belongs_to :delivery_destination
  validates :delivery_destination_id, uniqueness: { scope: :subscription_id }
  validates :amount_cents,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            }
  validates :amount_currency, format: { with: /\A[a-z]{3}\z/ }
  validate do
    unless delivery_destination&.user_id == subscription&.user_id
      errors.add(:delivery_destination, :invalid)
    end
  end

  def user = subscription.user
  def self.search_fields = base_search_fields
  def to_s = delivery_destination.to_s
end
