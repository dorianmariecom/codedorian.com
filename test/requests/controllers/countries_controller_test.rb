# frozen_string_literal: true

require "test_helper"

class CountriesControllerTest < ActionDispatch::IntegrationTest
  include ControllerSmokeHelper

  setup do
    @admin = users(:admin)
    @guest = guests(:guest)
    @other_user = users(:other_user)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  smoke_actions_for "countries"

  test "advanced user lists only owned countries" do
    @other_user.update!(interface: :advanced)
    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(countries_path)

    assert_response(:success)
    assert_select("a[href='#{country_path(countries(:other_country))}']")
    assert_select("a[href='#{country_path(countries(:country))}']", count: 0)
  end

  test "simple user cannot list countries" do
    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(countries_path)

    assert_redirected_to(root_path)
  end

  test "an authenticated request enqueues lookup for an unseen ip" do
    CountryCodeIpAddress.where(ip_address: "127.0.0.1").delete_all

    assert_enqueued_with(job: CountryLookupJob) { get(user_path(@admin)) }

    lookup = CountryCodeIpAddress.find_by!(ip_address: "127.0.0.1")
    assert_predicate(lookup.lookup_enqueued_at, :present?)
  end

  test "an authenticated request synchronizes a cached ip immediately" do
    CountryCodeIpAddress.create!(
      ip_address: "127.0.0.1",
      country_code: "FR",
      raw_payload: { ip: "127.0.0.1", country: "FR" }
    )

    get(user_path(@admin))

    country = @admin.countries.find_by!(ip_address: "127.0.0.1")
    assert_equal("FR", country.alpha2)
    assert_predicate(country, :primary?)
  end

  test "advanced owner can edit every field and becomes unverified" do
    @other_user.update!(interface: :advanced)
    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    country = countries(:other_country)

    patch(
      user_country_path(@other_user, country),
      params: {
        country: {
          city: "Lyon",
          raw_payload: { manually: "edited" }.to_json
        }
      }
    )

    assert_redirected_to(user_country_path(@other_user, country))
    assert_equal("Lyon", country.reload.city)
    assert_equal({ "manually" => "edited" }, country.raw_payload)
    assert_not_predicate(country, :verified?)
  end

  test "advanced owner cannot edit another user's country" do
    @other_user.update!(interface: :advanced)
    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    patch(
      country_path(countries(:country)),
      params: { country: { city: "Lyon" } }
    )

    assert_redirected_to(root_path)
    assert_equal("Los Angeles", countries(:country).reload.city)
  end
end
