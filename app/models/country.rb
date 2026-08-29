# frozen_string_literal: true

class Country < ApplicationRecord
  STRUCTURED_FIELDS = %w[asn company privacy abuse domains carrier].freeze
  JSON_FIELDS = [*STRUCTURED_FIELDS, "raw_payload"].freeze
  EDITABLE_FIELDS = %i[
    ip_address name alpha2 alpha3 numeric_code hostname city region region_code
    continent continent_code latitude longitude postal_code time_zone
    organization anycast bogon anonymous hosting mobile satellite asn company
    privacy abuse domains carrier raw_payload primary
  ].freeze
  BOOLEAN_FIELDS = {
    anycast: %w[is_anycast anycast],
    bogon: %w[bogon],
    anonymous: %w[is_anonymous anonymous],
    hosting: %w[is_hosting hosting],
    mobile: %w[is_mobile mobile],
    satellite: %w[is_satellite satellite]
  }.freeze

  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:primary, -> { where(primary: true) })
  scope(:not_primary, -> { where(primary: false) })
  scope(:verified, -> { where(verified: true) })
  scope(:not_verified, -> { where(verified: false) })
  scope(:where_user, ->(user) { where(user: user) })

  validates(:ip_address, presence: true, uniqueness: { scope: :user_id })
  validates(:alpha2, length: { is: 2, allow_blank: true })
  validates(:alpha3, length: { is: 3, allow_blank: true })
  validate { can!(:update, user) }
  validate :validate_json_fields

  before_validation { self.user ||= Current.user! }
  before_update :clear_verification_after_owner_edit

  JSON_FIELDS.each do |field|
    define_method(:"#{field}=") do |value|
      value = JSON.parse(value) if value.is_a?(String)
      super(value)
    rescue JSON::ParserError
      (@invalid_json_fields ||= []) << field
      super({})
    end
  end

  def self.search_fields
    {
      ip_address: { node: -> { arel_table[:ip_address] }, type: :string },
      name: { node: -> { arel_table[:name] }, type: :string },
      alpha2: { node: -> { arel_table[:alpha2] }, type: :string },
      alpha3: { node: -> { arel_table[:alpha3] }, type: :string },
      city: { node: -> { arel_table[:city] }, type: :string },
      region: { node: -> { arel_table[:region] }, type: :string },
      primary: { node: -> { arel_table[:primary] }, type: :boolean },
      verified: { node: -> { arel_table[:verified] }, type: :boolean },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def self.sync_from_ipinfo!(user:, ip_address:, payload:)
    attributes = attributes_from_ipinfo(ip_address:, payload:)

    transaction do
      country = find_or_initialize_by(user:, ip_address:)
      user.countries.where.not(id: country.id).update_all(primary: false)
      country.assign_attributes(**attributes, primary: true)
      country.save!
      country
    end
  end

  def self.attributes_from_ipinfo(ip_address:, payload:)
    payload = payload.to_h.deep_stringify_keys
    geo = payload["geo"].is_a?(Hash) ? payload["geo"] : {}
    alpha2 = geo["country_code"].presence || payload["country_code"].presence
    alpha2 ||= payload["country"] if payload["country"].to_s.length == 2
    iso_country = ISO3166::Country[alpha2]
    latitude, longitude = coordinates(payload:, geo:)

    {
      ip_address: payload["ip"].presence || ip_address,
      name: geo["country"].presence || iso_country&.common_name,
      alpha2: alpha2&.upcase,
      alpha3: iso_country&.alpha3,
      numeric_code: iso_country&.number,
      hostname: payload["hostname"],
      city: geo["city"].presence || payload["city"],
      region: geo["region"].presence || payload["region"],
      region_code: geo["region_code"].presence || payload["region_code"],
      continent: geo["continent"].presence || payload["continent"],
      continent_code: geo["continent_code"].presence ||
        payload["continent_code"],
      latitude: latitude,
      longitude: longitude,
      postal_code: geo["postal_code"].presence || payload["postal"].presence ||
        payload["postal_code"],
      time_zone: geo["timezone"].presence || payload["timezone"],
      organization: payload["org"].presence || payload.dig("as", "name"),
      **boolean_attributes(payload),
      **structured_attributes(payload),
      raw_payload: payload
    }
  end

  def self.coordinates(payload:, geo:)
    return [geo["latitude"], geo["longitude"]] if geo["latitude"].present?

    payload["loc"].to_s.split(",", 2)
  end

  def self.boolean_attributes(payload)
    BOOLEAN_FIELDS.to_h do |attribute, keys|
      [attribute, keys.lazy.map { |key| payload[key] }.find { |value| !value.nil? }]
    end
  end

  def self.structured_attributes(payload)
    STRUCTURED_FIELDS.to_h do |field|
      value = payload[field]
      value = payload["as"] if field == "asn" && value.blank?
      [field.to_sym, value.is_a?(Hash) || value.is_a?(Array) ? value : {}]
    end
  end

  def primary? = !!primary
  def verified? = !!verified
  def primary! = update!(primary: true)
  def not_primary! = update!(primary: false)
  def verified! = update!(verified: true)
  def not_verified! = update!(verified: false)

  def to_s
    Utils.join(name.presence || alpha2.presence || ip_address, id_sample).presence ||
      t("to_s", id:)
  end

  def to_code
    Code::Object::Country.new(as_json.symbolize_keys)
  end

  private

  def validate_json_fields
    Array(@invalid_json_fields).each { |field| errors.add(field, :invalid) }
  end

  def clear_verification_after_owner_edit
    self.verified = false if has_changes_to_save? && !Current.user&.admin?
  end
end
