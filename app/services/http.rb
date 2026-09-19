# frozen_string_literal: true

class Http
  # Return the original response so callers can handle provider-specific errors.
  # A pinned address keeps TLS verification tied to the URI's hostname.
  def self.request(
    request,
    open_timeout: 10,
    read_timeout: 30,
    write_timeout: 30,
    max_retries: 1,
    ipaddr: nil,
    proxy: :ENV
  )
    uri = request.uri
    http = Net::HTTP.new(uri.hostname, uri.port, proxy)
    http.use_ssl = uri.scheme == "https"
    http.open_timeout = open_timeout
    http.read_timeout = read_timeout
    http.write_timeout = write_timeout
    http.max_retries = max_retries
    http.ipaddr = ipaddr if ipaddr
    http.start { |client| client.request(request) }
  end
end
