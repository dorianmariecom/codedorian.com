# frozen_string_literal: true

require "test_helper"

class SitemapTest < ActionDispatch::IntegrationTest
  test "lists public endpoints in both languages without logging" do
    pages(:page).update_columns(path: "/")
    pages(:other_page).update_columns(authorization_input: " \n")
    pages(:up).update_columns(authorization_input: "false")

    assert_no_difference("Log.count") { get("/sitemap.xml") }

    assert_response(:success)
    assert_equal("application/xml", response.media_type)
    document = Nokogiri.XML(response.body)
    assert_empty(document.errors)
    namespace = { "s" => "http://www.sitemaps.org/schemas/sitemap/0.9" }
    locations = document.xpath("//s:loc", namespace).map(&:text)
    paths = %w[/en /fr /en/other-page /fr/other-page]
    locales = %i[en fr]
    locales.each { |locale| paths.concat(public_endpoint_paths(locale)) }
    assert_equal(
      paths.map { |path| "#{Current.base_url}#{path}" }.sort,
      locations.sort
    )
    assert_equal(
      pages(:page).updated_at.iso8601,
      document.at_xpath("//s:lastmod", namespace).text
    )

    public_records.each do |record|
      locales.each do |locale|
        location = "#{Current.base_url}#{polymorphic_path(record, locale:)}"
        entry =
          document
            .xpath("//s:url", namespace)
            .find { |url| url.at_xpath("s:loc", namespace).text == location }
        assert_equal(
          record.updated_at.iso8601,
          entry.at_xpath("s:lastmod", namespace).text
        )
      end
    end
  end

  test "listed public endpoints are accessible without signing in" do
    public_endpoint_paths(I18n.locale).each do |path|
      get(path)
      assert_response(:success, path)
    end
  end

  test "restricted pages stay out of the sitemap for admins" do
    pages(:other_page).update_columns(authorization_input: "true")
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )

    get("/sitemap.xml")

    assert_response(:success)
    assert_not_includes(response.body, "/other-page")
    assert_not_includes(response.body, user_path(users(:admin)))
    assert_not_includes(response.body, program_path(programs(:program)))
    assert_not_includes(response.body, edit_service_path(services(:service)))
    assert_not_includes(
      response.body,
      configuration_path(configurations(:configuration))
    )
    assert_not_includes(
      response.body,
      country_code_ip_address_path(
        country_code_ip_addresses(:country_code_ip_address)
      )
    )
  end

  private

  def public_records
    [services(:service), plans(:plan)]
  end

  def public_endpoint_paths(locale)
    [
      services_path(locale:),
      users_path(locale:),
      new_user_path(locale:),
      guests_path(locale:),
      new_guest_path(locale:),
      new_login_path(locale:),
      new_magic_link_login_path(locale:)
    ] + public_records.map { |record| polymorphic_path(record, locale:) }
  end
end
