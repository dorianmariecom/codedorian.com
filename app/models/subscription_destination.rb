# frozen_string_literal: true

class SubscriptionDestination < ApplicationRecord
  scope :where_subscription,
        ->(subscription) { where(subscription: subscription) }
  scope :selected, -> { where(selected: true) }
  scope :active, -> { where(active: true) }

  def active! = update!(active: true)

  belongs_to :subscription
  belongs_to :delivery_destination
  before_validation do
    self.amount_cents ||= delivery_destination&.delivery_channel&.amount_cents
    self.amount_currency ||=
      delivery_destination&.delivery_channel&.amount_currency
    self.name ||= delivery_destination&.name
  end

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

  def self.search_fields
    {
      subscription_id: {
        node: -> { arel_table[:subscription_id] },
        type: :integer
      },
      delivery_destination_id: {
        node: -> { arel_table[:delivery_destination_id] },
        type: :integer
      },
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      selected: {
        node: -> { arel_table[:selected] },
        type: :boolean
      },
      active: {
        node: -> { arel_table[:active] },
        type: :boolean
      },
      amount_cents: {
        node: -> { arel_table[:amount_cents] },
        type: :integer
      },
      amount_currency: {
        node: -> { arel_table[:amount_currency] },
        type: :string
      },
      **base_search_fields
    }
  end

  def to_s = Utils.join(delivery_destination, id_sample)

  def to_code
    {
      id: id,
      subscription_id: subscription_id,
      delivery_destination_id: delivery_destination_id,
      name: name,
      selected: selected,
      active: active,
      amount_cents: amount_cents,
      amount_currency: amount_currency,
      created_at: created_at,
      updated_at: updated_at
    }.to_code
  end
end
