# frozen_string_literal: true

require "test_helper"

class HashcashesControllerTest < ActionDispatch::IntegrationTest
  CAPTCHA_URL = %r{\Ahttps://recaptchaenterprise\.googleapis\.com/}

  setup do
    @skip_verify_env = Recaptcha.configuration.skip_verify_env
    Recaptcha.configuration.skip_verify_env = []
    @locale = I18n.locale
    @write_path = locale_path(locale: @locale, selected_locale: :fr)
    @bits = Rails.configuration.x.hashcash.bits
    Rails.configuration.x.hashcash.bits = 4
    @token = { "Token" => tokens(:other_token).token }
    @admin = { "Token" => tokens(:token).token }
  end

  teardown do
    Rails.configuration.x.hashcash.bits = @bits
    Recaptcha.configuration.skip_verify_env = @skip_verify_env
  end

  test "public challenge is scoped authorized and does not persist" do
    assert_no_difference("Hashcash.count") { issue }
    assert_response :success
    assert_equal "no-store", response.headers["Cache-Control"]
    assert_equal "sha256", response.parsed_body.dig("data", "algorithm")
  end

  test "invalid challenge inputs return localized bad request" do
    get challenge_hashcashes_path(locale: I18n.locale),
        params: {
          method: "GET"
        },
        as: :json
    assert_response :bad_request
    assert_equal I18n.t("hashcashes.challenge.invalid"),
                 response.parsed_body.fetch("messages").first
  end

  test "anonymous JSON and token authenticated writes skip captcha with valid proof" do
    [{}, @token].each do |headers|
      proof = issue(headers: headers)
      WebMock.reset_executed_requests!
      assert_difference("Hashcash.count", 1) do
        post @write_path, params: {}, headers: headers.merge(proof), as: :json
      end
      assert_response :success
      assert_not_requested :post, CAPTCHA_URL
    end
  end

  test "token authenticated HTML writes can use proof" do
    proof =
      issue(
        headers: @token,
        body: "",
        content_type: "application/x-www-form-urlencoded"
      )
    WebMock.reset_executed_requests!
    post @write_path,
         params: "",
         headers:
           @token.merge(proof).merge(
             "CONTENT_TYPE" => "application/x-www-form-urlencoded",
             "Accept" => "text/html"
           )
    assert_response :redirect
    assert_not_requested :post, CAPTCHA_URL
  end

  test "invalid proof falls back to captcha" do
    WebMock.reset_executed_requests!
    post @write_path,
         params: {
           "g-recaptcha-response" => "a" * 100
         },
         headers:
           @token.merge(
             "X-Hashcash-Challenge" => "invalid",
             "X-Hashcash-Nonce" => "0"
           ),
         as: :json
    assert_response :success
    assert_requested :post, CAPTCHA_URL
  end

  test "replay and missing proof cannot bypass failed captcha" do
    proof = issue(headers: @token)
    post @write_path, params: {}, headers: @token.merge(proof), as: :json
    assert_response :success
    reject_captcha
    [proof, {}].each do |headers|
      assert_no_difference("Hashcash.count") do
        post @write_path, params: {}, headers: @token.merge(headers), as: :json
      end
      assert_response :bad_request
      assert_equal "Recaptcha::VerifyError",
                   response.parsed_body.fetch("messages").first
    end
  end

  test "admin bypass and safe methods need no proof" do
    reject_captcha
    WebMock.reset_executed_requests!
    post @write_path, params: {}, headers: @admin, as: :json
    assert_response :success
    get hashcashes_path, headers: @admin, as: :json
    assert_response :success
    head hashcashes_path, headers: @admin, as: :json
    assert_response :success
    assert_not_requested :post, CAPTCHA_URL
  end

  test "proof grants no admin access" do
    path = hashcashes_path
    proof = issue(headers: @token, path: path)
    assert_difference("Hashcash.count", 1) do
      post path, params: {}, headers: @token.merge(proof), as: :json
    end
    assert_response :bad_request
    assert_equal "Pundit::NotAuthorizedError",
                 response.parsed_body.fetch("messages").first
  end

  test "non admins cannot access hashcash records or audits" do
    record =
      Hashcash.create!(
        challenge_id: SecureRandom.hex(16),
        expires_at: 5.minutes.from_now
      )
    [
      hashcashes_path,
      hashcash_path(id: record.id),
      new_hashcash_path,
      edit_hashcash_path(id: record.id),
      logs_path(hashcash_id: record.id),
      versions_path(hashcash_id: record.id),
      errors_path(hashcash_id: record.id)
    ].each do |path|
      get path, headers: @token, as: :json
      assert_response :bad_request
    end
  end

  test "admin CRUD supports HTML JSON search and audit links" do
    post hashcashes_path,
         params: {
           hashcash: {
             challenge_id: "a" * 32,
             expires_at: 5.minutes.from_now
           }
         },
         headers: @admin,
         as: :json
    assert_response :success
    record = Hashcash.find_by!(challenge_id: "a" * 32)
    [
      hashcashes_path,
      hashcash_path(id: record.id),
      new_hashcash_path,
      edit_hashcash_path(id: record.id)
    ].each do |path|
      get path, headers: @admin
      assert_response :success
      assert_no_match(/translation missing/i, response.body)
    end
    get hashcashes_path, params: { q: "a" * 32 }, headers: @admin, as: :json
    assert_response :success
    assert_includes response.parsed_body.fetch("data").pluck("id"), record.id
    [
      logs_path(hashcash_id: record.id),
      versions_path(hashcash_id: record.id),
      errors_path(hashcash_id: record.id)
    ].each do |path|
      get path, headers: @admin, as: :json
      assert_response :success
    end
    patch hashcash_path(id: record.id),
          params: {
            hashcash: {
              challenge_id: "b" * 32
            }
          },
          headers: @admin,
          as: :json
    assert_response :success
    assert_equal "b" * 32, record.reload.challenge_id
    assert_equal 2, record.versions.count
    delete hashcash_path(id: record.id), headers: @admin, as: :json
    assert_response :success
    assert_not Hashcash.exists?(record.id)
  end

  test "admin bulk destroy and delete work" do
    Hashcash.create!(
      challenge_id: SecureRandom.hex(16),
      expires_at: 5.minutes.from_now
    )
    delete destroy_all_hashcashes_path, headers: @admin, as: :json
    assert_response :success
    assert_equal 0, Hashcash.count
    Hashcash.create!(
      challenge_id: SecureRandom.hex(16),
      expires_at: 5.minutes.from_now
    )
    delete delete_all_hashcashes_path, headers: @admin, as: :json
    assert_response :success
    assert_equal 0, Hashcash.count
  end

  test "PATCH PUT and DELETE writes accept request bound proofs" do
    users(:other_user).update_column(:interface, "advanced")
    path = name_path(id: names(:other_name).id, locale: I18n.locale)
    body = { name: { given_name: "Updated" } }
    proof =
      issue(headers: @token, path: path, method: "PATCH", body: body.to_json)
    patch path, params: body, headers: @token.merge(proof), as: :json
    assert_response :success
    assert_equal "Updated", names(:other_name).reload.given_name

    proof =
      issue(headers: @token, path: path, method: "PUT", body: body.to_json)
    put path, params: body, headers: @token.merge(proof), as: :json
    assert_response :success

    proof = issue(headers: @token, path: path, method: "DELETE")
    WebMock.reset_executed_requests!
    delete path, params: {}, headers: @token.merge(proof), as: :json
    assert_response :success
    assert_not Name.exists?(names(:other_name).id)
    assert_not_requested :post, CAPTCHA_URL
  end

  test "browser forms keep captcha even when they include a valid proof" do
    proof = issue(body: "", content_type: "application/x-www-form-urlencoded")
    assert_no_difference("Hashcash.count") do
      post @write_path,
           params: "",
           headers:
             proof.merge(
               "CONTENT_TYPE" => "application/x-www-form-urlencoded",
               "Accept" => "text/html"
             )
    end
    assert_redirected_to root_path
    assert_match(/Recaptcha::VerifyError/, flash[:alert])
  end

  test "proof does not bypass CSRF for a cookie authenticated request" do
    proof = issue(headers: @token)
    original = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true
    assert_no_difference("Hashcash.count") do
      post @write_path, params: {}, headers: proof, as: :json
    end
    assert_response :unprocessable_content
  ensure
    ActionController::Base.allow_forgery_protection = original
  end

  test "existing password time zone and device exemptions remain" do
    users(:other_user).time_zones.delete_all
    users(:other_user).update_column(:interface, "advanced")
    WebMock.reset_executed_requests!
    post check_passwords_path,
         params: {
           password: "example-password"
         },
         headers: @token,
         as: :json
    assert_response :success
    patch "/#{I18n.locale}/time_zone",
          params: {
            time_zone: "Europe/Paris"
          },
          headers: @token,
          as: :json
    assert_response :success
    post devices_path,
         params: {
           device: {
             token: "hashcash-test-device",
             platform: "ios"
           }
         },
         headers: @token,
         as: :json
    assert_response :success
    assert_not_requested :post, CAPTCHA_URL
    assert_equal 0, Hashcash.count
  end

  private

  def issue(
    headers: {},
    path: @write_path,
    body: "{}",
    content_type: "application/json",
    method: "POST"
  )
    get challenge_hashcashes_path(locale: @locale),
        params: {
          method: method,
          path: path,
          body_sha256: Digest::SHA256.hexdigest(body),
          content_type: content_type
        },
        headers: headers.dup,
        as: :json
    assert_response :success
    challenge = response.parsed_body.dig("data", "challenge")
    nonce = 0
    nonce += 1 until Hashcash.valid_work?(challenge, nonce.to_s, 4)
    { "X-Hashcash-Challenge" => challenge, "X-Hashcash-Nonce" => nonce.to_s }
  end

  def reject_captcha
    stub_request(:post, CAPTCHA_URL).to_return(
      status: 200,
      body: {
        tokenProperties: {
          valid: false
        },
        riskAnalysis: {
          score: 0.0
        }
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )
  end
end
