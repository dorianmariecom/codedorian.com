# frozen_string_literal: true

class CountryLookupJob < ContextJob
  queue_as(:default)

  retry_on(
    JSON::ParserError,
    CountryCodeIpAddress::LookupError,
    Net::OpenTimeout,
    Net::ReadTimeout,
    SocketError,
    wait: :polynomially_longer,
    attempts: 5
  )

  def perform_with_context(user:, ip_address:)
    lookup = CountryCodeIpAddress.find_or_create_by!(ip_address:)
    lookup.lookup! if lookup.raw_payload.blank?

    Country.sync_from_ipinfo!(
      user: user,
      ip_address: ip_address,
      payload: lookup.raw_payload
    )
  end
end
