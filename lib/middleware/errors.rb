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
    rescue ActiveRecord::DatabaseConnectionError, ActiveRecord::ConnectionNotEstablished => e
      message = "Database connection error. Please try again later."

      [503, { "Content-Type" => "text/plain" }, [message]]
    end
  end
end
