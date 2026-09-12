# frozen_string_literal: true

class DeliveryProviderAddress
  BLOCKED =
    %w[
      0.0.0.0/8
      10.0.0.0/8
      100.64.0.0/10
      127.0.0.0/8
      169.254.0.0/16
      172.16.0.0/12
      192.0.0.0/24
      192.168.0.0/16
      198.18.0.0/15
      224.0.0.0/4
      240.0.0.0/4
    ].map { |range| IPAddr.new(range) }.freeze

  def self.resolve!(host)
    addresses = Resolv.getaddresses(host)
    if addresses.empty?
      raise DeliveryAdapters::Rejected, "invalid_provider_host"
    end

    addresses.each do |address|
      ip = IPAddr.new(address)
      allowed =
        (
          if ip.ipv4?
            BLOCKED.none? { |range| range.include?(ip) }
          else
            IPAddr.new("2000::/3").include?(ip)
          end
        )
      raise DeliveryAdapters::Rejected, "invalid_provider_host" unless allowed
    end
    addresses.first
  end
end
