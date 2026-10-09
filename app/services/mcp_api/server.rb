# frozen_string_literal: true

module McpApi
  class Server
    def self.definitions
      @definitions ||=
        JSON.parse(Rails.root.join("config/mcp_endpoints.json").read)
    end

    def self.tools
      @tools ||= definitions.map { |definition| Endpoint.new(definition).tool }
    end

    def self.call(env)
      request = Rack::Request.new(env)
      origin = Current.base_url
      if request.base_url != origin ||
           (
             request.get_header("HTTP_ORIGIN").present? &&
               request.get_header("HTTP_ORIGIN") != origin
           )
        return [
          403,
          { "content-type" => "application/json" },
          [JSON.generate(error: "Invalid origin")]
        ]
      end

      token = request.get_header("HTTP_TOKEN")
      user = Token.verified.find_by(token: token)&.user if token.present?
      unless user
        return [
          401,
          {
            "content-type" => "application/json",
            "cache-control" => "no-store"
          },
          [JSON.generate(error: "A verified Token header is required")]
        ]
      end

      server =
        MCP::Server.new(
          name: "codedorian",
          version: "1.0.0",
          tools: tools,
          page_size: 100,
          configuration:
            MCP::Configuration.new(
              exception_reporter: ->(error, _context) do
                Rails.error.report(error, handled: true, context: { mcp: true })
              end
            ),
          instructions:
            "Every tool maps to a JSON API endpoint. Supply path parameters, an encoded query, and exact JSON body bytes. Non-admin writes return a Hashcash challenge when proof is absent; compute the proof on the client and resubmit. All existing API permissions apply. Cookies are neither accepted nor retained.",
          server_context: {
            origin: origin,
            token: token,
            admin: user.admin?,
            ip: request.ip
          }
        )
      transport =
        MCP::Server::Transports::StreamableHTTPTransport.new(
          server,
          stateless: true,
          enable_json_response: true,
          allowed_hosts: [URI(origin).host],
          max_request_bytes: 2.megabytes,
          serve_subscriptions_listen: false
        )
      status, headers, body = transport.call(env)
      [status, headers.merge("cache-control" => "no-store"), body]
    end
  end
end
