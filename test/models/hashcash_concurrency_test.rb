# frozen_string_literal: true

require "test_helper"

class HashcashConcurrencyTest < ActiveSupport::TestCase
  self.use_transactional_tests = false

  test "concurrent redemption accepts exactly one request" do
    original_bits = Rails.configuration.x.hashcash.bits
    Rails.configuration.x.hashcash.bits = 4
    hashcash = Hashcash.new
    data =
      hashcash.issue_challenge(
        method: "POST",
        path: "/en/locale/fr",
        body_sha256: Digest::SHA256.hexdigest(""),
        content_type: "",
        origin: "https://example.com",
        user_id: nil
      )
    challenge = data.fetch(:challenge)
    nonce = 0
    nonce += 1 until Hashcash.valid_work?(challenge, nonce.to_s, 4)
    ready = Queue.new
    start = Queue.new
    results =
      Array.new(2) do
        Thread.new do
          ActiveRecord::Base.connection_pool.with_connection do
            request =
              ActionDispatch::Request.new(
                Rack::MockRequest.env_for(
                  "https://example.com/en/locale/fr",
                  method: "POST"
                )
              )
            request.headers["X-Hashcash-Challenge"] = challenge
            request.headers["X-Hashcash-Nonce"] = nonce.to_s
            ready << true
            start.pop
            Hashcash.redeem(request: request, user_id: nil)
          end
        end
      end
    2.times { ready.pop }
    2.times { start << true }
    assert_equal [false, true], results.map(&:value).sort_by(&:to_s)
    assert_equal 1, Hashcash.where(challenge_id: hashcash.challenge_id).count
  ensure
    Rails.configuration.x.hashcash.bits = original_bits
    if hashcash&.challenge_id
      records = Hashcash.where(challenge_id: hashcash.challenge_id)
      Version.where(
        item_type: "Hashcash",
        item_id: records.select(:id)
      ).delete_all
      records.delete_all
    end
  end
end
