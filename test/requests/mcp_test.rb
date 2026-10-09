# frozen_string_literal: true

require "test_helper"

class McpTest < ActionDispatch::IntegrationTest
  setup do
    @token = tokens(:token)
    @skip_verify_env = Recaptcha.configuration.skip_verify_env
    Recaptcha.configuration.skip_verify_env = []
    @bits = Rails.configuration.x.hashcash.bits
    Rails.configuration.x.hashcash.bits = 4
  end

  teardown do
    Rails.configuration.x.hashcash.bits = @bits
    Recaptcha.configuration.skip_verify_env = @skip_verify_env
  end

  test "initializes and paginates all endpoints" do
    rpc(
      "initialize",
      {
        protocolVersion: "2025-11-25",
        capabilities: {
        },
        clientInfo: {
          name: "test",
          version: "1"
        }
      }
    )
    assert_response :success
    assert_equal "codedorian",
                 response.parsed_body.dig("result", "serverInfo", "name")
    names = []
    cursor = nil
    loop do
      rpc("tools/list", cursor ? { cursor: cursor } : {})
      assert_response :success
      result = response.parsed_body.fetch("result")
      names.concat(result.fetch("tools").pluck("name"))
      cursor = result["nextCursor"]
      break unless cursor
    end
    assert_equal McpApi::Server.definitions.pluck("name"), names
    assert_includes names, "patch_programs_id"
    assert_includes names, "get_hashcashes_challenge"
    assert_includes names, "delete_users_user_id_programs_destroy_all"
  end

  test "requires verified tokens and ignores browser sessions" do
    get configurations_path(format: :json), headers: { "Token" => @token.token }
    assert_response :success
    post "/mcp",
         params: {
           jsonrpc: "2.0",
           id: 1,
           method: "tools/list"
         },
         as: :json
    assert_response :unauthorized
    @token.update_column(:verified, false)
    rpc("tools/list")
    assert_response :unauthorized
  end

  test "forwards reads with token identity and scopes" do
    call_tool("get_configurations")
    assert_equal false, result.fetch("isError"), response.body
    @token = tokens(:other_token)
    call_tool("get_configurations")
    assert_equal true, result.fetch("isError")
    @token = tokens(:token)
    call_tool("get_configurations")
    assert_equal false, result.fetch("isError"), response.body
  end

  test "admin writes use existing controller behavior" do
    call_tool("post_locale_selected_locale", path: { selected_locale: "fr" })
    assert_equal false, result.fetch("isError"), response.body
    assert_equal "fr", users(:admin).reload.locale
  end

  test "write challenges bind exact bytes and reject replay" do
    @token = tokens(:other_token)
    arguments = { path: { selected_locale: "en" }, body: '{ "unused": true }' }
    assert_no_difference("Hashcash.count") do
      call_tool("post_locale_selected_locale", **arguments)
    end
    challenge = result.fetch("structuredContent")
    assert challenge.key?("error"), response.body
    assert_equal "hashcash_required", challenge.fetch("error")
    assert_equal "fr", users(:other_user).reload.locale
    assert_equal Digest::SHA256.hexdigest(arguments[:body]),
                 challenge.dig("request", "body_sha256")
    proof = solve(challenge.fetch("hashcash"))
    assert_difference("Hashcash.count", 1) do
      call_tool("post_locale_selected_locale", **arguments, hashcash: proof)
    end
    assert_equal false, result.fetch("isError"), response.body
    assert_equal "en", users(:other_user).reload.locale
    assert_no_difference("Hashcash.count") do
      call_tool("post_locale_selected_locale", **arguments, hashcash: proof)
    end
    assert_equal true, result.fetch("isError")
  end

  test "rejects another users records" do
    @token = tokens(:other_token)
    users(:other_user).update_column(:interface, "advanced")
    call_tool("get_programs_id", path: { id: programs(:program).id.to_s })
    assert_equal true, result.fetch("isError")
    call_tool("get_programs_id", path: { id: programs(:other_program).id.to_s })
    assert_equal false, result.fetch("isError"), response.body
  end

  test "rejects unknown tools invalid arguments and route escapes" do
    rpc("tools/call", name: "no_such_tool", arguments: {})
    assert response.parsed_body["error"] || result["isError"]
    call_tool("get_programs_id", path: { id: "../configurations" })
    assert_equal true, result.fetch("isError")
    call_tool(
      "get_programs_id",
      path: {
        id: "1"
      },
      headers: {
        Token: "override"
      }
    )
    assert_equal true, result.fetch("isError")
    call_tool("get_path", path: { path: "mcp" })
    assert_equal true, result.fetch("isError")
  end

  test "rejects cross origin requests" do
    post "/mcp",
         params: {
           jsonrpc: "2.0",
           id: 1,
           method: "tools/list"
         },
         headers: headers.merge("Origin" => "https://example.org"),
         as: :json
    assert_response :forbidden
  end

  test "handles malformed JSON and notifications" do
    post "/mcp",
         params: "{",
         headers: headers.merge("Content-Type" => "application/json")
    assert_response :bad_request
    assert_equal(-32_700, response.parsed_body.dig("error", "code"))
    post "/mcp",
         params: {
           jsonrpc: "2.0",
           method: "notifications/initialized"
         },
         headers: headers,
         as: :json
    assert_response :accepted
  end

  test "proof cannot be reused with a different body or query" do
    @token = tokens(:other_token)
    arguments = {
      path: {
        selected_locale: "en"
      },
      body: '{"unused":true}',
      query: "q=one"
    }
    call_tool("post_locale_selected_locale", **arguments)
    proof = solve(result.fetch("structuredContent").fetch("hashcash"))
    assert_no_difference("Hashcash.count") do
      call_tool(
        "post_locale_selected_locale",
        **arguments,
        body: '{ "unused": true }',
        hashcash: proof
      )
      assert_equal true, result.fetch("isError")
      call_tool(
        "post_locale_selected_locale",
        **arguments,
        query: "q=two",
        hashcash: proof
      )
      assert_equal true, result.fetch("isError")
    end
    assert_equal "fr", users(:other_user).reload.locale
    call_tool("post_locale_selected_locale", **arguments, hashcash: proof)
    assert_equal false, result.fetch("isError"), response.body
  end

  test "expired proof cannot execute a write" do
    @token = tokens(:other_token)
    arguments = { path: { selected_locale: "en" } }
    call_tool("post_locale_selected_locale", **arguments)
    proof = solve(result.fetch("structuredContent").fetch("hashcash"))
    travel 6.minutes do
      assert_no_difference("Hashcash.count") do
        call_tool("post_locale_selected_locale", **arguments, hashcash: proof)
      end
      assert_equal true, result.fetch("isError")
      assert_equal "fr", users(:other_user).reload.locale
    end
  end

  test "preserves validation errors" do
    call_tool(
      "post_hashcashes",
      body: {
        hashcash: {
          challenge_id: "invalid",
          expires_at: 5.minutes.from_now.iso8601
        }
      }.to_json
    )
    assert_equal true, result.fetch("isError")
    assert_equal 422, result.dig("structuredContent", "status")
    assert_not Hashcash.exists?(challenge_id: "invalid")
  end

  test "program evaluation keeps the existing asynchronous job context" do
    assert_difference("ProgramExecution.count", 1) do
      assert_enqueued_with(job: ProgramEvaluateJob) do
        call_tool(
          "post_programs_id_evaluate",
          path: {
            id: programs(:program).id.to_s
          }
        )
      end
    end
    assert_equal false, result.fetch("isError"), response.body
    execution = ProgramExecution.order(:created_at).last
    assert_equal programs(:program), execution.program
    assert_equal "in_progress", execution.status
    job = enqueued_jobs.find { |entry| entry[:job] == ProgramEvaluateJob }
    arguments = ActiveJob::Arguments.deserialize(job.fetch(:args)).first
    assert_equal users(:admin), arguments.fetch(:current).fetch(:user)
    assert_equal I18n.locale, arguments.fetch(:current).fetch(:locale)
  end

  private

  def headers
    {
      "Token" => @token.token,
      "Accept" => "application/json, text/event-stream",
      "MCP-Protocol-Version" => "2025-11-25"
    }
  end

  def rpc(method, params = {})
    post "/mcp",
         params: {
           jsonrpc: "2.0",
           id: 1,
           method: method,
           params: params
         },
         headers: headers,
         as: :json
  end

  def call_tool(name, **arguments)
    rpc(
      "tools/call",
      name: name,
      arguments: {
        locale: I18n.locale.to_s,
        **arguments
      }
    )
  end

  def result
    assert response.parsed_body.key?("result"), response.body
    response.parsed_body.fetch("result")
  end

  def solve(hashcash)
    challenge = hashcash.fetch("challenge")
    nonce = 0
    nonce += 1 until Hashcash.valid_work?(
      challenge,
      nonce.to_s,
      hashcash.fetch("bits")
    )
    { challenge: challenge, nonce: nonce.to_s }
  end
end
