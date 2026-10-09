# frozen_string_literal: true

module McpApi
  class Endpoint
    attr_reader :definition

    def initialize(definition)
      @definition = definition
    end

    def tool
      endpoint = self
      MCP::Tool.define(
        name: definition.fetch("name"),
        description:
          "#{definition.fetch("method")} #{definition.fetch("path")} — #{definition.fetch("controller")}##{definition.fetch("action")}. Uses the existing JSON API and its permissions. Writes require caller-computed Hashcash unless the account is admin. A missing proof returns a challenge without executing the operation. Use the exact body and query bytes when resubmitting. Cookies are not retained.",
        input_schema: schema,
        annotations: {
          read_only_hint:
            read_only? && definition.fetch("action") != "callback",
          destructive_hint:
            !read_only? || definition.fetch("action") == "callback",
          idempotent_hint:
            read_only? && definition.fetch("action") != "callback",
          open_world_hint: true
        }
      ) do |server_context:, **arguments|
        endpoint.call(arguments.deep_stringify_keys, server_context)
      end
    end

    def read_only?
      definition.fetch("method").in?(%w[GET HEAD])
    end

    def schema
      properties = {
        locale: {
          type: "string",
          enum: %w[en fr],
          default: "en"
        },
        path: {
          type: "object",
          properties:
            path_keys.index_with { |key| { type: "string", minLength: 1 } },
          required: path_keys,
          additionalProperties: false
        },
        query: {
          type: "string",
          description:
            "Exact URL-encoded query string, without a leading question mark.",
          maxLength: 16_384
        },
        body: {
          type: "string",
          description:
            "Exact JSON object bytes to send. Defaults to an empty body; never reserialized. Use the API's nested attribute names.",
          maxLength: 1_048_576
        },
        hashcash: {
          type: "object",
          properties: {
            challenge: {
              type: "string",
              maxLength: 8192
            },
            nonce: {
              type: "string",
              pattern: "^[0-9]{1,20}$"
            }
          },
          required: %w[challenge nonce],
          additionalProperties: false
        },
        signatures: {
          type: "object",
          properties: {
            stripe: {
              type: "string",
              maxLength: 4096
            },
            twilio: {
              type: "string",
              maxLength: 4096
            }
          },
          additionalProperties: false
        }
      }
      {
        type: "object",
        properties: properties,
        required: path_keys.empty? ? [] : ["path"],
        additionalProperties: false
      }
    end

    def path_keys
      definition.fetch("path").scan(/[:*]([a-z_]+)/).flatten - ["locale"]
    end

    def request_path(arguments)
      path =
        definition.fetch("path").sub(
          "(/:locale)",
          "/#{arguments.fetch("locale", "en")}"
        )
      path =
        path.gsub(/([:*])([a-z_]+)/) do
          wildcard, key = Regexp.last_match.captures
          value = arguments.fetch("path", {}).fetch(key)
          parts = wildcard == "*" ? value.split("/", -1) : [value]
          invalid =
            parts.any? do |part|
              part.blank? || part.in?(%w[. ..]) ||
                part.match?(%r{[/\\\x00-\x1f]})
            end
          raise ArgumentError, "Invalid path parameter" if invalid

          parts.map { |part| ERB::Util.url_encode(part) }.join("/")
        end
      query = arguments.fetch("query", "")
      if query.match?(/[\x00-\x20#]/) || query.start_with?("?")
        raise ArgumentError, "Invalid query string"
      end

      route =
        Rails.application.routes.recognize_path(
          path,
          method: definition.fetch("method").downcase.to_sym
        )
      unless route[:controller] == definition.fetch("controller") &&
               route[:action] == definition.fetch("action")
        raise ArgumentError, "Path does not match this tool's endpoint"
      end

      query.empty? ? path : "#{path}?#{query}"
    end

    def call(arguments, context)
      path = request_path(arguments)
      body = arguments.fetch("body", "")
      if body.present? && !JSON.parse(body).is_a?(Hash)
        raise ArgumentError, "Body must be a JSON object"
      end
      if read_only? && body.present?
        raise ArgumentError, "Read requests cannot have a body"
      end

      caller = Request.new(context)
      if !read_only? && !context.fetch(:admin) && !arguments.key?("hashcash") &&
           definition.fetch("controller") != "stripe_webhooks" &&
           definition.fetch("controller") != "delivery_callbacks"
        return(
          caller.challenge(
            method: definition.fetch("method"),
            path: path,
            body: body,
            locale: arguments.fetch("locale", "en")
          )
        )
      end

      caller.call(
        method: definition.fetch("method"),
        path: path,
        body: body,
        proof: arguments["hashcash"],
        signatures: arguments.fetch("signatures", {})
      )
    rescue ArgumentError,
           KeyError,
           JSON::ParserError,
           ActionController::RoutingError => e
      MCP::Tool::Response.new([{ type: "text", text: e.message }], error: true)
    end
  end
end
