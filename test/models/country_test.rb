# frozen_string_literal: true

require "test_helper"

class CountryTest < ActiveSupport::TestCase
  test "normalizes flat IPinfo payload and preserves every field" do
    attributes =
      Country.attributes_from_ipinfo(
        ip_address: "203.0.113.20",
        payload: {
          ip: "203.0.113.20",
          hostname: "example.test",
          city: "Paris",
          region: "Île-de-France",
          country: "FR",
          loc: "48.8534,2.3488",
          postal: "75000",
          timezone: "Europe/Paris",
          org: "AS123 Example",
          anycast: true,
          custom: "retained"
        }
      )

    assert_equal("France", attributes[:name])
    assert_equal("FR", attributes[:alpha2])
    assert_equal("FRA", attributes[:alpha3])
    assert_equal("250", attributes[:numeric_code])
    assert_equal("48.8534", attributes[:latitude])
    assert_equal("2.3488", attributes[:longitude])
    assert_equal("retained", attributes[:raw_payload]["custom"])
    assert_equal(true, attributes[:anycast])
  end

  test "normalizes nested Core payload and structured sections" do
    attributes =
      Country.attributes_from_ipinfo(
        ip_address: "203.0.113.21",
        payload: {
          ip: "203.0.113.21",
          geo: {
            country: "France",
            country_code: "FR",
            latitude: 48.8534,
            longitude: 2.3488
          },
          as: { asn: "AS123", name: "Example" },
          privacy: { vpn: true },
          is_anonymous: true
        }
      )

    assert_equal("France", attributes[:name])
    assert_equal({ "asn" => "AS123", "name" => "Example" }, attributes[:asn])
    assert_equal({ "vpn" => true }, attributes[:privacy])
    assert_equal(true, attributes[:anonymous])
  end

  test "an owner edit clears verification" do
    country = countries(:other_country)

    Current.with(user: users(:other_user)) do
      country.update!(name: "République française")
    end

    assert_not_predicate(country, :verified?)
  end

  test "an admin edit may preserve verification" do
    country = countries(:other_country)

    Current.with(user: users(:admin)) { country.update!(name: "France edited") }

    assert_predicate(country, :verified?)
  end

  test "synchronizing a new IP switches the primary country" do
    user = users(:other_user)

    Current.with(user:) do
      country =
        Country.sync_from_ipinfo!(
          user:,
          ip_address: "203.0.113.22",
          payload: { ip: "203.0.113.22", country: "US" }
        )

      assert_predicate(country, :primary?)
      assert_not_predicate(countries(:other_country).reload, :primary?)
    end
  end
end
