# frozen_string_literal: true

class PlanField < ApplicationRecord
  KINDS = %w[text email_address phone_number number boolean date].freeze
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
            numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate { can!(:update, plan) }

  scope :where_user,
        ->(user) { joins(plan: :service).where(services: { user_id: user }) }

  def self.search_fields
    {
      key: { node: -> { arel_table[:key] }, type: :string },
      kind: { node: -> { arel_table[:kind] }, type: :string },
      required: { node: -> { arel_table[:required] }, type: :boolean },
      position: { node: -> { arel_table[:position] }, type: :integer },
      **base_search_fields
    }
  end

  def to_code
    Code::Object::PlanField.new(
      id: id,
      created_at: created_at,
      key: key,
      kind: kind,
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
  def number? = kind == "number"
  def phone_number? = kind == "phone_number"
  def text? = kind == "text"
  def to_s = Truncate.strip(name&.to_plain_text).presence || key
end
