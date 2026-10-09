# frozen_string_literal: true

module McpApi
  class Request
    MAX_RESPONSE_BYTES = 2.megabytes

    def self.application
      @application ||=
        begin
          middleware = Rails.application.middleware.dup
          middleware.delete(ActionDispatch::Executor)
          middleware.delete(ActionDispatch::Reloader)
          middleware.delete(RequestStore::Middleware)
          middleware.build(Rails.application.routes)
        end
    end

    def initialize(context)
      @context = context
    end

    def challenge(method:, path:, body:, locale:)
      query =
        URI.encode_www_form(
          method: method,
          path: path,
          body_sha256: Digest::SHA256.hexdigest(body),
          content_type: "application/json"
        )
      response =
        dispatch(
          method: "GET",
          path: "/#{locale}/hashcashes/challenge?#{query}",
          body: ""
        )
      return result(response) unless response[:status].between?(200, 299)

      data = {
        error: "hashcash_required",
        request: {
          method: method,
          path: path,
          body_sha256: Digest::SHA256.hexdigest(body),
          content_type: "application/json"
        },
        hashcash: response.fetch(:body).fetch("data"),
        instructions:
          "Compute a decimal nonce so SHA256(challenge + ':' + nonce) has the requested number of leading zero bits. Resubmit the same tool arguments with hashcash: {challenge, nonce}. The operation has not run."
      }
      MCP::Tool::Response.new(
        [{ type: "text", text: JSON.generate(data) }],
        error: true,
        structured_content: data
      )
    end

    def call(method:, path:, body:, proof: nil, signatures: {})
      result(
        dispatch(
          method: method,
          path: path,
          body: body,
          proof: proof,
          signatures: signatures
        )
      )
    end

    private

    def dispatch(method:, path:, body:, proof: nil, signatures: {})
      previous_locale = I18n.locale
      previous_time_zone = Time.zone
      previous = Current.attributes.dup
      Current.reset
      env =
        Rack::MockRequest.env_for(
          "#{@context.fetch(:origin)}#{path}",
          :method => method,
          :input => body,
          "CONTENT_TYPE" => "application/json",
          "HTTP_ACCEPT" => "application/json",
          "HTTP_HOST" => URI(@context.fetch(:origin)).authority,
          "HTTP_TOKEN" => @context.fetch(:token),
          "REMOTE_ADDR" => @context.fetch(:ip)
        )
      env["HTTP_X_HASHCASH_CHALLENGE"] = proof.fetch("challenge") if proof
      env["HTTP_X_HASHCASH_NONCE"] = proof.fetch("nonce") if proof
      env["HTTP_STRIPE_SIGNATURE"] = signatures["stripe"] if signatures.key?(
        "stripe"
      )
      env["HTTP_X_TWILIO_SIGNATURE"] = signatures["twilio"] if signatures.key?(
        "twilio"
      )
      I18n.with_locale(I18n.locale) do
        Time.use_zone(Time.zone) do
          PaperTrail.request(whodunnit: nil) do
            status, headers, response_body =
              self.class.application.call(
                Rails.application.env_config.merge(env)
              )
            content = +""
            begin
              response_body.each do |chunk|
                content << chunk
                if content.bytesize > MAX_RESPONSE_BYTES
                  raise ArgumentError,
                        "API response exceeds 2 MiB; narrow the query or paginate"
                end
              end
            ensure
              response_body.close if response_body.is_a?(Rack::BodyProxy)
            end
            json = headers["content-type"].to_s.include?("application/json")
            payload =
              if content.empty?
                nil
              elsif json
                JSON.parse(content)
              else
                { "error" => "API returned a non-JSON response" }
              end
            { status: status, body: payload }
          end
        end
      end
    ensure
      Current.reset
      Current.attributes = previous if previous
      I18n.locale = previous_locale if previous_locale
      Time.zone = previous_time_zone
    end

    def result(response)
      error =
        !response.fetch(:status).between?(200, 299) ||
          (response[:body].is_a?(Hash) && response[:body].key?("error"))
      MCP::Tool::Response.new(
        [{ type: "text", text: JSON.generate(response) }],
        error: error,
        structured_content: response
      )
    end
  end
end
