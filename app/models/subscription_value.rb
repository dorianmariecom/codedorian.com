# frozen_string_literal: true

class SubscriptionValue < ApplicationRecord
  scope :where_service,
        ->(service) do
          where(
            subscription_id: Subscription.where_service(service).select(:id)
          )
        end
  scope :where_plan,
        ->(plan) do
          where(subscription_id: Subscription.where_plan(plan).select(:id))
        end
  belongs_to :subscription, touch: true
  has_one :plan, through: :subscription
  has_one :service, through: :subscription
  has_one :user, through: :subscription

  normalizes :key, with: ->(key) { key.to_s.strip }
  before_validation :normalize_value, if: :will_save_change_to_value?

  validates :key, presence: true
  validates :key, uniqueness: { scope: :subscription_id }
  validate :valid_value_for_field, if: :will_save_change_to_value?
  validate do
    if subscription.new_record?
      can!(:create, subscription)
    else
      can!(:update, subscription)
    end
  end

  scope :where_user, ->(user) { where(subscription: user.subscriptions) }
  scope :where_subscription,
        ->(subscription) { where(subscription: subscription) }

  def self.search_fields
    {
      key: {
        node: -> { arel_table[:key] },
        type: :string
      },
      value: {
        node: -> { arel_table[:value] },
        type: :string
      },
      **base_search_fields
    }
  end

  def field = subscription.plan.field_for(key)
  def stale? = field.nil?

  def key_sample
    Truncate.strip(key)
  end

  def value_sample
    Truncate.strip(value)
  end

  def key_value_sample
    return if key_sample.blank? && value_sample.blank?

    Truncate.strip("#{key_sample}: #{value_sample}")
  end

  def subscription_sample
    Truncate.strip(subscription)
  end

  def to_s
    Utils.join(key_value_sample, subscription_sample, id_sample).presence ||
      t("to_s", id:)
  end

  def typed_value
    return value unless field

    SubscriptionSetting.parse(field, value)
  end

  def to_code
    Code::Object::SubscriptionValue.new(
      id: id,
      created_at: created_at,
      key: key,
      subscription_id: subscription_id,
      updated_at: updated_at,
      value: value
    )
  end

  private

  def normalize_value
    self.value = value.to_s.strip
    return if field.nil? || value.blank?

    typed = SubscriptionSetting.parse(field, value)
    case field.kind
    when "email_address", "phone_number", "http_method", "url", "time_zone"
      self.value = typed
    when "number"
      self.value = BigDecimal(value).to_s("F")
    when "integer", "boolean", "date"
      self.value = typed.to_s
    end
  rescue ArgumentError
    nil
  end

  def valid_value_for_field
    return if field.nil?

    SubscriptionSetting.parse(field, value)
  rescue ArgumentError
    errors.add(:value, :invalid)
  end
end
