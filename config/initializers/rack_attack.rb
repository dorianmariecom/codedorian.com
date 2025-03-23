# frozen_string_literal: true

module Rack
  class Attack
    throttle("request/ip", limit: 300, period: 5.minutes, &:ip)

    throttle("sessions/ip", limit: 5, period: 20.seconds) do |request|
      request.ip if request.path.include?("session")
    end
  end
end
