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
          configuration: {
            content: { maintenance: true }.to_json
          }
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
          configuration: {
            content: { maintenance: true }.to_json
          }
        },
        headers: token_headers
      )
    end

    assert_response(:unprocessable_content)
  end

  test "another users token does not bypass forgery protection for a session" do
    get(configurations_path(format: :json), headers: token_headers)
    assert_response(:success)
    configuration = configurations(:configuration)
    original_content = configuration.content

    with_forgery_protection do
      patch(
        configuration_path(id: configuration.name, format: :json),
        params: {
          configuration: {
            content: { maintenance: true }.to_json
          }
        },
        headers: {
          "Token" => tokens(:other_token).token
        }
      )
    end

    assert_response(:unprocessable_content)
    assert_equal(original_content, configuration.reload.content)
  end

  test "the sessions own token does not bypass forgery protection" do
    get(configurations_path(format: :json), headers: token_headers)
    assert_response(:success)
    configuration = configurations(:configuration)
    original_content = configuration.content

    with_forgery_protection do
      patch(
        configuration_path(id: configuration.name, format: :json),
        params: {
          configuration: {
            content: { maintenance: true }.to_json
          }
        },
        headers: token_headers
      )
    end

    assert_response(:unprocessable_content)
    assert_equal(original_content, configuration.reload.content)
  end

  test "guest sessions can authenticate with a verified token" do
    get(new_login_path)
    assert_response(:success)

    with_forgery_protection do
      patch(
        configuration_path(
          id: configurations(:configuration).name,
          format: :json
        ),
        params: {
          configuration: {
            content: { maintenance: true }.to_json
          }
        },
        headers: token_headers
      )
    end

    assert_response(:success)
  end

  test "session requests with another users token accept a valid csrf token" do
    get(configurations_path(format: :json), headers: token_headers)
    assert_response(:success)

    with_forgery_protection do
      get(new_login_path)
      assert_response(:success)
      csrf_token =
        response.parsed_body.at_css('meta[name="csrf-token"]')["content"]

      patch(
        configuration_path(
          id: configurations(:configuration).name,
          format: :json
        ),
        params: {
          configuration: {
            content: { maintenance: true }.to_json
          }
        },
        headers: {
          "Token" => tokens(:other_token).token,
          "X-CSRF-Token" => csrf_token
        }
      )
    end

    assert_response(:success)
    assert(configurations(:configuration).reload.content["maintenance"])
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
