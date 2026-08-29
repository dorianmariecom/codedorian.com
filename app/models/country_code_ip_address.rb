# frozen_string_literal: true

class CountryCodeIpAddress < ApplicationRecord
  class LookupError < StandardError; end

  validates :ip_address, uniqueness: true, presence: true
  validate { can!(:update, self) }

  def self.search_fields
    {
      ip_address: {
        node: -> { arel_table[:ip_address] },
        type: :string
      },
      country_code: {
        node: -> { arel_table[:country_code] },
        type: :string
      },
      **base_search_fields
    }
  end

  def lookup!
    uri = URI.parse("https://ipinfo.io/#{ip_address}")
    uri.query = URI.encode_www_form(token: token)
    request = Net::HTTP::Get.new(uri)
    response =
      Net::HTTP.start(
        uri.hostname,
        uri.port,
        use_ssl: true,
        open_timeout: 5,
        read_timeout: 5
      ) { |http| http.request(request) }
    unless response.is_a?(Net::HTTPSuccess)
      raise(LookupError, "IPinfo lookup failed with HTTP #{response.code}")
    end

    json = JSON.parse(response.body)
    self.country_code =
      json.dig("geo", "country_code").presence || json["country_code"].presence ||
        json["country"].presence || PhoneNumber::DEFAULT_COUNTRY_CODE
    self.raw_payload = json
    self.looked_up_at = Time.current
    self.lookup_enqueued_at = nil
    save!(validate: false)
  end

  def ip_address_sample
    Truncate.strip(ip_address)
  end

  def country_code_sample
    Truncate.strip(country_code)
  end

  def as_json(...)
    { country_code: country_code }.as_json(...)
  end

  def token
    Config.ipinfo.token
  end

  def to_s
    Utils.join(
      ip_address_sample.presence || country_code_sample,
      id_sample
    ).presence || t("to_s", id:)
  end
end
