# frozen_string_literal: true

class Hashcash < ApplicationRecord
  class InvalidChallenge < StandardError
  end

  PURPOSE = "hashcash-v1"
  METHODS = %w[POST PUT PATCH DELETE OPTIONS TRACE CONNECT].freeze

  validates :challenge_id,
            presence: true,
            uniqueness: true,
            format: {
              with: /\A[0-9a-f]{32}\z/
            }
  validates :expires_at, presence: true

  def self.search_fields
    {
      challenge_id: {
        node: -> { arel_table[:challenge_id] },
        type: :string
      },
      expires_at: {
        node: -> { arel_table[:expires_at] },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def challenge_id_sample
    Truncate.strip(challenge_id)
  end

  def to_s
    Utils.join(challenge_id_sample, id_sample).presence || t("to_s", id:)
  end

  def to_code
    Code::Object::Hashcash.new(attributes)
  end

  def issue_challenge(
    method:,
    path:,
    body_sha256:,
    content_type:,
    origin:,
    user_id:
  )
    unless METHODS.include?(method) && path.is_a?(String) &&
             path.bytesize <= 4096 && path.start_with?("/") &&
             !path.start_with?("//") && !path.match?(/[[:cntrl:]\s\\#]/) &&
             body_sha256.is_a?(String) &&
             body_sha256.match?(/\A[0-9a-f]{64}\z/) &&
             content_type.is_a?(String) && content_type.bytesize <= 256 &&
             !content_type.match?(/[\r\n]/)
      raise InvalidChallenge
    end

    bits = Rails.configuration.x.hashcash.bits
    lifetime = Rails.configuration.x.hashcash.lifetime
    unless bits.is_a?(Integer) && bits.between?(1, 256) && lifetime.positive?
      raise ArgumentError, "invalid hashcash configuration"
    end

    self.challenge_id = SecureRandom.hex(16)
    self.expires_at = (Time.current + lifetime).change(usec: 0)
    payload = {
      "version" => 1,
      "challenge_id" => challenge_id,
      "expires_at" => expires_at.to_i,
      "bits" => bits,
      "method" => method,
      "path" => path,
      "body_sha256" => body_sha256,
      "content_type" => content_type,
      "origin" => origin,
      "user_id" => user_id
    }
    challenge =
      self.class.verifier.generate(
        payload,
        purpose: PURPOSE,
        expires_at: expires_at
      )
    raise InvalidChallenge if challenge.bytesize > 8192

    {
      challenge: challenge,
      algorithm: "sha256",
      bits: bits,
      expires_at: expires_at.iso8601
    }
  end

  def self.verifier
    Rails.application.message_verifier(PURPOSE)
  end

  def self.valid_work?(challenge, nonce, bits)
    Digest::SHA256.hexdigest("#{challenge}:#{nonce}").to_i(16) <
      (1 << (256 - bits))
  end

  def self.redeem(request:, user_id:)
    challenge = request.headers["X-Hashcash-Challenge"]
    nonce = request.headers["X-Hashcash-Nonce"]
    unless challenge.is_a?(String) && challenge.bytesize.between?(1, 8192)
      return false
    end
    return false unless nonce.is_a?(String) && nonce.match?(/\A[0-9]{1,20}\z/)

    payload = verifier.verified(challenge, purpose: PURPOSE)
    return false unless payload.is_a?(Hash) && payload["version"] == 1
    unless payload["expires_at"].is_a?(Integer) &&
             payload["expires_at"] > Time.current.to_f
      return false
    end
    unless payload["bits"].is_a?(Integer) && payload["bits"].between?(1, 256)
      return false
    end
    unless payload["method"] == request.request_method &&
             payload["path"] == request.original_fullpath &&
             payload["body_sha256"] ==
               Digest::SHA256.hexdigest(request.raw_post.to_s) &&
             payload["content_type"] == request.headers["Content-Type"].to_s &&
             payload["origin"] == request.base_url &&
             payload["user_id"] == user_id
      return false
    end
    return false unless valid_work?(challenge, nonce, payload["bits"])

    transaction(requires_new: true) do
      create!(
        challenge_id: payload.fetch("challenge_id"),
        expires_at: Time.at(payload.fetch("expires_at"))
      )
    end
    true
  rescue ActiveRecord::RecordNotUnique
    false
  rescue ActiveRecord::RecordInvalid => e
    raise unless e.record.errors.of_kind?(:challenge_id, :taken)

    false
  end
end
