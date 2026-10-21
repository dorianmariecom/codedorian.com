# frozen_string_literal: true

require "test_helper"

class AiGenerationTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    Datum.create!(user: Current.user, key: "open_ai_api_key", value: "test-key")
    Datum.create!(user: Current.user, key: "model", value: "configured-model")
    @schema = {
      type: "object",
      properties: {
        answer: {
          type: "integer"
        }
      },
      required: ["answer"],
      additionalProperties: false
    }
    @url = "https://api.openai.com/v1/responses"
  end

  teardown { Current.reset }

  def completed(text)
    {
      status: "completed",
      output: [
        { type: "message", content: [{ type: "output_text", text: text }] }
      ]
    }.to_json
  end

  test "AI helper sends schema and returns locally validated structured output" do
    request =
      stub_request(:post, @url)
        .with(headers: { "Authorization" => "Bearer test-key" }) do |req|
          payload = JSON.parse(req.body)
          payload["model"] == "configured-model" && payload["store"] == false &&
            payload.dig("text", "format", "schema") ==
              @schema.deep_stringify_keys
        end
        .to_return(body: completed('{"answer":42}'))
    assert_equal 42,
                 Code.evaluate(
                   %(Ai.generate(messages: [{ role: :user, content: "test" }], schema: #{@schema.to_json}).answer)
                 ).as_json
    assert_requested request, times: 1
  end

  test "invalid generation is retried within the requested budget" do
    request =
      stub_request(:post, @url)
        .to_return(body: completed('{"answer":"wrong"}'))
        .then
        .to_return(body: completed('{"answer":42}'))
    assert_equal(
      { "answer" => 42 },
      AiGeneration.call(messages: [], schema: @schema)
    )
    assert_requested request, times: 2
  end

  test "truncated results and refusal are not delivered as content" do
    request =
      stub_request(:post, @url).to_return(
        body: { status: "incomplete", output: [] }.to_json
      )
    assert_raises(Code::Error) do
      AiGeneration.call(messages: [], schema: @schema)
    end
    assert_requested request, times: 2
    stub_request(:post, @url).to_return(
      body: {
        status: "completed",
        output: [
          { type: "message", content: [{ type: "refusal", refusal: "no" }] }
        ]
      }.to_json
    )
    assert_raises(Code::Error) { AiGeneration.call(messages: []) }
  end

  test "AI credentials are scoped to the current user" do
    Current.user = users(:other_user)
    assert_raises(Code::Error) { AiGeneration.call(messages: []) }
    assert_not_requested :post, @url
  end

  test "malformed envelopes are retried within the generation budget" do
    request = stub_request(:post, @url).to_return(body: "[]")
    assert_raises(Code::Error) { AiGeneration.call(messages: []) }
    assert_requested request, times: 2
  end

  test "permanent provider failures are not retried" do
    request = stub_request(:post, @url).to_return(status: 401)
    assert_raises(Code::Error) { AiGeneration.call(messages: []) }
    assert_requested request, times: 1
  end

  test "invalid schemas are rejected before a request" do
    assert_raises(Code::Error) do
      AiGeneration.call(messages: [], schema: { type: "invalid" })
    end
    assert_not_requested :post, @url
  end
  test "explicit API keys override stored credentials through the code API" do
    request =
      stub_request(:post, @url).with(
        headers: {
          "Authorization" => "Bearer explicit-key"
        }
      ).to_return(body: completed("hello"))
    result = Code.evaluate('Ai.generate(messages: [], api_key: "explicit-key")')
    assert_equal "hello", result.to_s
    assert_requested request, times: 1
  end

  test "explicit credentials work without stored credentials" do
    Current.user = users(:other_user)
    request =
      stub_request(:post, @url).with(
        headers: {
          "Authorization" => "Bearer explicit-key"
        }
      ).to_return(body: completed("hello"))
    result =
      Code.evaluate(
        'Ai.generate(messages: [], api_key: "explicit-key", model: "explicit-model")'
      )
    assert_equal "hello", result.to_s
    assert_requested request, times: 1
  end

  test "blank explicit API keys are rejected before sending requests" do
    assert_raises(Code::Error) do
      Code.evaluate('Ai.generate(messages: [], api_key: "")')
    end
    assert_not_requested :post, @url
  end
end
