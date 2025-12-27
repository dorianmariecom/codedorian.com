# frozen_string_literal: true

module Middleware
  class Errors
    ERROR_MESSAGE_LIMIT = 140
    OMISSION = "…"

    def initialize(app)
      @app = app
    end

    def call(env)
      @app.call(env)
    rescue ActionDispatch::RemoteIp::IpSpoofAttackError => e
      message = Truncate.strip(e&.class&.name.to_s)

      [400, {}, [message]]
    rescue ActiveRecord::DatabaseConnectionError => e
      message = Truncate.strip(e&.class&.name.to_s)

      [503, { "Retry-After" => "60" }, [message]]
    end
  end
end
