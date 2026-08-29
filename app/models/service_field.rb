# frozen_string_literal: true

class ServiceField < ApplicationRecord
  KINDS = %w[text email_address phone_number number boolean date].freeze
  KEY_FORMAT = /\A[a-z][a-z0-9_]*\z/

  belongs_to :service, touch: true
  has_one :user, through: :service

  has_rich_text :name_en
  has_rich_text :name_fr

  normalizes :key, with: ->(key) { key.to_s.strip }

  validates :key, :name_en, :name_fr, :kind, :position, presence: true
  validates :key, format: { with: KEY_FORMAT }
  validates :key, uniqueness: { scope: :service_id }
  validates :kind, inclusion: { in: KINDS }
  validates :position,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            }
  validate { can!(:update, service) }

  scope :where_user,
        ->(user) { joins(:service).where(services: { user_id: user }) }
  scope :where_service, ->(service) { where(service: service) }

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
    Code::Object::ServiceField.new(
      id: id,
      created_at: created_at,
      key: key,
      kind: kind,
      name_en: name_en&.to_plain_text,
      name_fr: name_fr&.to_plain_text,
      position: position,
      required: required,
      service_id: service_id,
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

  def name_sample
    Truncate.strip(name&.to_plain_text)
  end

  def key_sample
    Truncate.strip(key)
  end

  def service_sample
    Truncate.strip(service)
  end

  def to_s
    Utils.join(
      name_sample.presence || key_sample,
      service_sample,
      id_sample
    ).presence || t("to_s", id:)
  end
end
