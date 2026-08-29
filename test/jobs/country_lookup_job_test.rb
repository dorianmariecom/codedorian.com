# frozen_string_literal: true

require "test_helper"

class CountryLookupJobTest < ActiveJob::TestCase
  test "looks up and synchronizes an uncached IP" do
    user = users(:other_user)
    ip_address = "203.0.113.30"

    CountryLookupJob.perform_now(
      user:,
      ip_address:,
      current: { user: user },
      context: {}
    )

    lookup = CountryCodeIpAddress.find_by!(ip_address:)
    country = user.countries.find_by!(ip_address:)
    assert_equal("US", lookup.country_code)
    assert_equal("US", country.alpha2)
    assert_predicate(country, :primary?)
    assert_not_predicate(country, :verified?)
  end

  test "reuses a complete cache entry without another HTTP request" do
    user = users(:other_user)
    ip_address = "203.0.113.31"
    CountryCodeIpAddress.create!(
      ip_address:,
      country_code: "FR",
      raw_payload: { ip: ip_address, country: "FR" }
    )

    CountryLookupJob.perform_now(
      user:,
      ip_address:,
      current: { user: user },
      context: {}
    )

    assert_not_requested(:get, /ipinfo\.io/)

    assert_equal("FR", user.countries.find_by!(ip_address:).alpha2)
  end
end
