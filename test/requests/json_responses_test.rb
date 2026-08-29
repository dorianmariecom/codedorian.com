# frozen_string_literal: true

require "test_helper"

class JsonResponsesTest < ActionDispatch::IntegrationTest
  test "index responses use the explicit envelope" do
    get("/#{I18n.locale}/smoke-page", as: :json)

    assert_response(:success)
    assert_equal(%w[data messages status], response.parsed_body.keys.sort)
    assert_equal("ok", response.parsed_body["status"])
    assert_equal([], response.parsed_body["messages"])
    assert_kind_of(Hash, response.parsed_body["data"])
  end

  test "explicit json responses are wrapped" do
    post(check_passwords_path, params: { password: "password" }, as: :json)

    assert_response(:success)
    assert_equal("ok", response.parsed_body["status"])
    assert_kind_of(Array, response.parsed_body["messages"])
    assert_includes([true, false], response.parsed_body.dig("data", "success"))
  end

  test "json errors keep messages separate from data" do
    get(program_path(id: "missing"), as: :json)

    assert_response(:bad_request)
    assert_equal("bad_request", response.parsed_body["status"])
    assert_predicate(response.parsed_body["messages"], :present?)
    assert_nil(response.parsed_body["data"])
  end
end
