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
      message = e&.class&.name.to_s
      message_truncated =
        message.truncate(ERROR_MESSAGE_LIMIT, omission: OMISSION)

      [400, {}, [message_truncated]]
    end
  end
end
