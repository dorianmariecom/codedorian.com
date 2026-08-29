# frozen_string_literal: true

class Plan < ApplicationRecord
  belongs_to :service, touch: true
  has_one :user, through: :service
  has_many :steps, through: :service
  has_many :plan_schedules, dependent: :destroy
  accepts_nested_attributes_for :plan_schedules, allow_destroy: true
  has_many :plan_fields,
           -> { order(:position, :id) },
           dependent: :destroy,
           inverse_of: :plan
  accepts_nested_attributes_for :plan_fields,
                                allow_destroy: true,
                                reject_if: :all_blank
  has_many :subscriptions, dependent: :destroy
  has_rich_text :name_en
  has_rich_text :name_fr
  has_rich_text :description_en
  has_rich_text :description_fr
  has_rich_text :body_en
  has_rich_text :body_fr
  scope :where_user,
        ->(user) { joins(:service).where(services: { user_id: user }) }
  normalizes :slug, with: ->(slug) { slug.to_s.strip.downcase }
  validates :slug, presence: true
  validates :slug, format: { with: /\A[a-z][a-z0-9-]*\z/ }
  validates :slug, uniqueness: { scope: :service_id }
  validate { can!(:update, service) }

  def self.search_fields
    {
      slug: {
        node: -> { arel_table[:slug] },
        type: :string
      },
      **base_search_fields
    }
  end

  def name = fr? ? name_fr : name_en
  def description = fr? ? description_fr : description_en
  def body = fr? ? body_fr : body_en

  def fields
    overrides = plan_fields.index_by(&:key)
    inherited =
      service.fields.map { |field| overrides.delete(field.key) || field }
    (inherited + overrides.values).sort_by do |field|
      [field.position, field.key]
    end
  end

  def field_for(key) = fields.find { |field| field.key == key.to_s }

  def price_for(subscription)
    if pricing_input.blank?
      raise StripeBilling::PricingError, t("pricing_missing")
    end

    value =
      Current.with(
        user: subscription.user,
        subscription: subscription,
        plan: self,
        service: service
      ) { Code.evaluate(pricing_input).as_json.stringify_keys }
    amount_cents = Integer(value.fetch("amount_cents"), exception: false)
    amount_currency = value.fetch("amount_currency", nil).to_s.downcase
    unless amount_cents&.positive? && amount_currency.match?(/\A[a-z]{3}\z/)
      raise StripeBilling::PricingError, t("pricing_invalid")
    end

    { amount_cents: amount_cents, amount_currency: amount_currency }
  rescue KeyError, TypeError
    raise StripeBilling::PricingError, t("pricing_invalid")
  end

  def schedules = plan_schedules

  def to_s
    Utils.join(service, Truncate.strip(name&.to_plain_text)).presence ||
      t("to_s", id:)
  end

  def to_code
    Code::Object::Plan.new(
      id: id,
      created_at: created_at,
      pricing_input: pricing_input,
      service_id: service_id,
      slug: slug,
      updated_at: updated_at
    )
  end
end
