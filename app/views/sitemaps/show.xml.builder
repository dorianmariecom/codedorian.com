# frozen_string_literal: true

xml.instruct!
xml.urlset(xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9") do
  @pages.each do |page|
    I18n.available_locales.each do |locale|
      xml.url do
        xml.loc(
          "#{Current.base_url}/#{locale}#{page.path == "/" ? "" : page.path}"
        )
        xml.lastmod(page.updated_at.iso8601)
      end
    end
  end

  I18n.available_locales.each do |locale|
    [
      services_path(locale:),
      users_path(locale:),
      new_user_path(locale:),
      guests_path(locale:),
      new_guest_path(locale:),
      new_login_path(locale:),
      new_magic_link_login_path(locale:)
    ].each { |path| xml.url { xml.loc("#{Current.base_url}#{path}") } }

    [@services, @plans].each do |records|
      records.each do |record|
        xml.url do
          xml.loc("#{Current.base_url}#{polymorphic_path(record, locale:)}")
          xml.lastmod(record.updated_at.iso8601)
        end
      end
    end
  end
end
