# frozen_string_literal: true

class CountryCodeIpAddress < ApplicationRecord
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
    uri = URI.parse("http://ipinfo.io/#{ip_address}?token=#{token}")
    response = Net::HTTP.get_response(uri)
    json = JSON.parse(response.body)
    country_code = json["country"].presence || PhoneNumber::DEFAULT_COUNTRY_CODE
    update!(country_code: country_code)
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
    ip_address_sample.presence || country_code_sample.presence ||
      t("to_s", id: id)
  end
end
