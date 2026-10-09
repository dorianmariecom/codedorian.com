# frozen_string_literal: true

require "test_helper"

class HashcashTest < ActiveSupport::TestCase
  setup do
    @bits = Rails.configuration.x.hashcash.bits
    Rails.configuration.x.hashcash.bits = 4
    @request =
      ActionDispatch::Request.new(
        Rack::MockRequest.env_for(
          "https://example.com/en/locale/fr?source=api",
          :method => "POST",
          :input => "{}",
          "CONTENT_TYPE" => "application/json"
        )
      )
  end

  teardown { Rails.configuration.x.hashcash.bits = @bits }

  test "proof is consumed once and creates a version" do
    issue
    assert_difference(
      ["Hashcash.count", "Version.where(item_type: 'Hashcash').count"],
      1
    ) { assert Hashcash.redeem(request: @request, user_id: nil) }
    assert_not Hashcash.redeem(request: @request, user_id: nil)
    @request.headers["X-Hashcash-Nonce"] = solve(@challenge, @nonce.to_i + 1)
    assert_not Hashcash.redeem(request: @request, user_id: nil)
  end

  test "expiry boundary rejects the proof" do
    issue
    travel_to(Time.iso8601(@data.fetch(:expires_at))) do
      assert_not Hashcash.redeem(request: @request, user_id: nil)
    end
  end

  test "proof just before expiry is accepted" do
    issue
    travel_to(Time.iso8601(@data.fetch(:expires_at)) - 1.second) do
      assert Hashcash.redeem(request: @request, user_id: nil)
    end
  end

  test "signature identity origin method path content type and body are bound" do
    issue
    assert_not Hashcash.redeem(
                 request: @request,
                 user_id: users(:other_user).id
               )
    @request.headers["X-Hashcash-Challenge"] = "#{@challenge}x"
    assert_not Hashcash.redeem(request: @request, user_id: nil)
    @request.headers["X-Hashcash-Challenge"] = @challenge

    [
      %w[
        https://other.example/en/locale/fr?source=api
        POST
        {}
        application/json
      ],
      %w[
        https://example.com/en/locale/fr?source=api
        DELETE
        {}
        application/json
      ],
      %w[
        https://example.com/en/locale/fr?source=other
        POST
        {}
        application/json
      ],
      [
        "https://example.com/en/locale/fr?source=api",
        "POST",
        "{ }",
        "application/json"
      ],
      %w[https://example.com/en/locale/fr?source=api POST {} text/plain]
    ].each do |url, method, body, content_type|
      request =
        ActionDispatch::Request.new(
          Rack::MockRequest.env_for(
            url,
            :method => method,
            :input => body,
            "CONTENT_TYPE" => content_type
          )
        )
      request.headers["X-Hashcash-Challenge"] = @challenge
      request.headers["X-Hashcash-Nonce"] = @nonce
      assert_not Hashcash.redeem(request: request, user_id: nil)
    end
    assert Hashcash.redeem(request: @request, user_id: nil)
  end

  test "malformed and insufficient proofs do not create records" do
    issue
    assert_no_difference("Hashcash.count") do
      [nil, "", "-1", "1.0", "1" * 21, "abc"].each do |nonce|
        @request.headers["X-Hashcash-Nonce"] = nonce
        assert_not Hashcash.redeem(request: @request, user_id: nil)
      end
      nonce = 0
      nonce += 1 while Hashcash.valid_work?(@challenge, nonce.to_s, 4)
      @request.headers["X-Hashcash-Nonce"] = nonce.to_s
      assert_not Hashcash.redeem(request: @request, user_id: nil)
      @request.headers["X-Hashcash-Challenge"] = "x" * 8193
      assert_not Hashcash.redeem(request: @request, user_id: nil)
    end
  end

  test "invalid challenge inputs are rejected" do
    attributes = {
      method: "POST",
      path: "/en/locale/fr",
      body_sha256: Digest::SHA256.hexdigest(""),
      content_type: "",
      origin: "https://example.com",
      user_id: nil
    }
    [
      { method: "GET" },
      { method: "HEAD" },
      { path: "//evil.example" },
      { path: "/foo#fragment" },
      { path: "/foo\\bar" },
      { path: ["/"] },
      { body_sha256: "bad" },
      { content_type: "a\nb" }
    ].each do |invalid|
      assert_raises(Hashcash::InvalidChallenge) do
        Hashcash.new.issue_challenge(**attributes, **invalid)
      end
    end
  end

  test "unsupported signed versions are rejected" do
    issue
    payload = Hashcash.verifier.verified(@challenge, purpose: Hashcash::PURPOSE)
    payload["version"] = 2
    @challenge = Hashcash.verifier.generate(payload, purpose: Hashcash::PURPOSE)
    @request.headers["X-Hashcash-Challenge"] = @challenge
    @request.headers["X-Hashcash-Nonce"] = solve(@challenge)
    assert_not Hashcash.redeem(request: @request, user_id: nil)
  end

  test "cleaning removes only expired hashcashes" do
    expired =
      Hashcash.create!(
        challenge_id: SecureRandom.hex(16),
        expires_at: 1.second.ago
      )
    current =
      Hashcash.create!(
        challenge_id: SecureRandom.hex(16),
        expires_at: 1.minute.from_now
      )
    CleaningJob.perform_now
    assert_not Hashcash.exists?(expired.id)
    assert Hashcash.exists?(current.id)
  end

  test "fixed twenty bit SHA256 vector" do
    assert Hashcash.valid_work?("hashcash-vector", "161212", 20)
    assert_equal "000005859eb06984a1ba565dd833f9f94293458d9de11681879a3b7c8f13843f",
                 Digest::SHA256.hexdigest("hashcash-vector:161212")
    assert_not Hashcash.valid_work?("hashcash-vector", "161212", 24)
  end

  private

  def issue
    @data =
      Hashcash.new.issue_challenge(
        method: "POST",
        path: "/en/locale/fr?source=api",
        body_sha256: Digest::SHA256.hexdigest("{}"),
        content_type: "application/json",
        origin: "https://example.com",
        user_id: nil
      )
    @challenge = @data.fetch(:challenge)
    @nonce = solve(@challenge)
    @request.headers["X-Hashcash-Challenge"] = @challenge
    @request.headers["X-Hashcash-Nonce"] = @nonce
  end

  def solve(challenge, nonce = 0)
    nonce += 1 until Hashcash.valid_work?(challenge, nonce.to_s, 4)
    nonce.to_s
  end
end
