# frozen_string_literal: true

require "uri"

base_url = ENV.fetch("BASE_URL", nil).presence
host = ENV.fetch("HOST", nil).presence

protocol = nil
port = nil

if base_url
  uri = URI.parse(base_url)
  host ||= uri.host
  protocol = uri.scheme
  port = uri.port if uri.port && uri.port != uri.default_port
end

default_url_options = {}
default_url_options[:host] = host if host
default_url_options[:protocol] = protocol if protocol
default_url_options[:port] = port if port

Rails.application.routes.default_url_options = default_url_options
Rails.application.config.action_mailer.default_url_options = default_url_options
