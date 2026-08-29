# frozen_string_literal: true

class SubscriptionValue < ApplicationRecord
  belongs_to :subscription, touch: true
  has_one :plan, through: :subscription
  has_one :service, through: :subscription
  has_one :user, through: :subscription

  normalizes :key, with: ->(key) { key.to_s.strip }
  before_validation :normalize_value, if: :will_save_change_to_value?

  validates :key, presence: true
  validates :key, uniqueness: { scope: :subscription_id }
  validate :valid_value_for_field, if: :will_save_change_to_value?
  validate { can!(:update, subscription) }

  scope :where_user, ->(user) { where(subscription: user.subscriptions) }

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

  def to_s
    Utils.join(subscription, "#{key}: #{value}").presence || t("to_s", id:)
  end

  def typed_value
    case field&.kind
    when "number"
      BigDecimal(value).to_f
    when "boolean"
      ActiveModel::Type::Boolean.new.cast(value)
    else
      value
    end
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

    case field&.kind
    when "email_address"
      self.value = value.downcase
    when "phone_number"
      parsed = Phonelib.parse(value)
      self.value = parsed.e164 if parsed.valid?
    when "number"
      self.value = BigDecimal(value).to_s("F")
    when "boolean"
      self.value = "true" if value.in?(%w[true 1])
      self.value = "false" if value.in?(%w[false 0])
    when "date"
      self.value = Date.iso8601(value).iso8601
    end
  rescue ArgumentError
    # Validation below reports the malformed value.
  end

  def valid_value_for_field
    return if value.blank? || field.nil?

    valid =
      case field.kind
      when "email_address"
        value.match?(EmailAddress::EMAIL_ADDRESS_REGEXP)
      when "phone_number"
        Phonelib.parse(value).valid?
      when "number"
        BigDecimal(value)
        true
      when "boolean"
        value.in?(%w[true false])
      when "date"
        Date.iso8601(value).iso8601 == value
      else
        true
      end

    errors.add(:value, :invalid) unless valid
  rescue ArgumentError
    errors.add(:value, :invalid)
  end
end
