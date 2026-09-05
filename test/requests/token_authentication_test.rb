# frozen_string_literal: true

require "test_helper"

class TokenAuthenticationTest < ActionDispatch::IntegrationTest
  setup { @token = tokens(:token) }

  test "verified tokens authenticate requests" do
    get(configurations_path(format: :json), headers: token_headers)

    assert_response(:success)
  end

  test "unverified tokens do not authenticate requests" do
    @token.update_column(:verified, false)

    get(configurations_path(format: :json), headers: token_headers)

    assert_response(:bad_request)
  end

  test "verified tokens bypass forgery protection" do
    with_forgery_protection do
      patch(
        configuration_path(
          id: configurations(:configuration).name,
          format: :json
        ),
        params: {
          configuration: { content: { maintenance: true }.to_json }
        },
        headers: token_headers
      )
    end

    assert_response(:success)
  end

  test "unverified tokens do not bypass forgery protection" do
    @token.update_column(:verified, false)

    with_forgery_protection do
      patch(
        configuration_path(
          id: configurations(:configuration).name,
          format: :json
        ),
        params: {
          configuration: { content: { maintenance: true }.to_json }
        },
        headers: token_headers
      )
    end

    assert_response(:unprocessable_content)
  end

  private

  def token_headers
    { "Token" => @token.token }
  end

  def with_forgery_protection
    original = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true
    yield
  ensure
    ActionController::Base.allow_forgery_protection = original
  end
end
