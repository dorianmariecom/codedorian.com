class CountryCodeIpAddress < ApplicationRecord
  validates :ip_address, uniqueness: true, presence: true

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

  def ip_address_sample
    Truncate.strip(ip_address)
  end

  def country_code_sample
    Truncate.strip(country_code)
  end

  def to_s
    ip_address_sample.presence || country_code_sample.presence || t("to_s", id: id)
  end
end
