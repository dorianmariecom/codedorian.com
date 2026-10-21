# frozen_string_literal: true

class PlanField < ApplicationRecord
  KINDS = %w[
    text
    email_address
    phone_number
    number
    boolean
    date
    integer
    string_list
    integer_list
    birthdays
    time_zone
    http_method
    url
  ].freeze
  validates :minimum, :maximum, numericality: true, allow_nil: true
  validate :valid_setting_options

  def valid_setting_options
    errors.add(:maximum, :invalid) if minimum && maximum && minimum > maximum
    return if default_value.blank?

    begin
      SubscriptionSetting.parse(self, default_value)
    rescue ArgumentError
      errors.add(:default_value, :invalid)
    end
  end

  NUMBER_KINDS = %w[number integer].freeze
  KEY_FORMAT = /\A[a-z][a-z0-9_]*\z/

  belongs_to :plan, touch: true
  has_one :service, through: :plan
  has_one :user, through: :plan

  has_rich_text :name_en
  has_rich_text :name_fr

  normalizes :key, with: ->(key) { key.to_s.strip }

  validates :key, :name_en, :name_fr, :kind, :position, presence: true
  validates :key, format: { with: KEY_FORMAT }
  validates :key, uniqueness: { scope: :plan_id }
  validates :kind, inclusion: { in: KINDS }
  validates :position,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            }
  validate { can!(:update, plan) }

  scope :where_user,
        ->(user) { joins(plan: :service).where(services: { user_id: user }) }
  scope :where_plan, ->(plan) { where(plan: plan) }
  scope :where_service,
        ->(service) { joins(:plan).where(plans: { service_id: service }) }

  def self.search_fields
    {
      key: {
        node: -> { arel_table[:key] },
        type: :string
      },
      kind: {
        node: -> { arel_table[:kind] },
        type: :string
      },
      required: {
        node: -> { arel_table[:required] },
        type: :boolean
      },
      position: {
        node: -> { arel_table[:position] },
        type: :integer
      },
      **base_search_fields
    }
  end

  def to_code
    Code::Object::PlanField.new(
      id: id,
      created_at: created_at,
      key: key,
      kind: kind,
      default_value: default_value,
      minimum: minimum,
      maximum: maximum,
      name_en: name_en&.to_plain_text,
      name_fr: name_fr&.to_plain_text,
      plan_id: plan_id,
      position: position,
      required: required,
      updated_at: updated_at
    )
  end

  def autocomplete
    if email_address?
      "email"
    elsif phone_number?
      "tel"
    else
      "off"
    end
  end

  def boolean? = kind == "boolean"
  def date? = kind == "date"
  def email_address? = kind == "email_address"
  def name = fr? ? name_fr : name_en
  def number? = kind.in?(NUMBER_KINDS)
  def integer? = kind == "integer"
  def phone_number? = kind == "phone_number"
  def text? = kind == "text"

  def name_sample
    Truncate.strip(name&.to_plain_text)
  end

  def key_sample
    Truncate.strip(key)
  end

  def plan_sample
    Truncate.strip(plan)
  end

  def to_s
    Utils.join(
      name_sample.presence || key_sample,
      plan_sample,
      id_sample
    ).presence || t("to_s", id:)
  end
end
