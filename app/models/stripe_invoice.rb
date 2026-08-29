# frozen_string_literal: true

class StripeInvoice < ApplicationRecord
  belongs_to :subscription, optional: true, touch: true
  has_one :user, through: :subscription

  validates :stripe_invoice_id, presence: true, uniqueness: true
  validates :currency, presence: true

  scope :where_user,
        ->(user) { joins(:subscription).where(subscriptions: { user: user }) }

  def self.search_fields
    {
      stripe_invoice_id: {
        node: -> { arel_table[:stripe_invoice_id] },
        type: :string
      },
      stripe_payment_intent_id: {
        node: -> { arel_table[:stripe_payment_intent_id] },
        type: :string
      },
      number: {
        node: -> { arel_table[:number] },
        type: :string
      },
      status: {
        node: -> { arel_table[:status] },
        type: :string
      },
      currency: {
        node: -> { arel_table[:currency] },
        type: :string
      },
      amount_due: {
        node: -> { arel_table[:amount_due] },
        type: :integer
      },
      amount_paid: {
        node: -> { arel_table[:amount_paid] },
        type: :integer
      },
      period_start: {
        node: -> { arel_table[:period_start] },
        type: :datetime
      },
      period_end: {
        node: -> { arel_table[:period_end] },
        type: :datetime
      },
      paid_at: {
        node: -> { arel_table[:paid_at] },
        type: :datetime
      },
      hosted_invoice_url: {
        node: -> { arel_table[:hosted_invoice_url] },
        type: :string
      },
      invoice_pdf: {
        node: -> { arel_table[:invoice_pdf] },
        type: :string
      },
      **base_search_fields
    }
  end

  def paid? = status == "paid"

  def number_sample
    Truncate.strip(number)
  end

  def stripe_invoice_id_sample
    Truncate.strip(stripe_invoice_id)
  end

  def to_s
    Utils.join(
      number_sample.presence || stripe_invoice_id_sample,
      id_sample
    ).presence || t("to_s", id:)
  end
end
