# frozen_string_literal: true

require "base64"
require "digest"

class SolidCacheEntry < SolidCache::Entry
  include(RecordConcern)

  validate(:decode_key_base64, on: :controller)
  validate(:decode_value_base64, on: :controller)

  def self.search_fields
    {
      id: {
        node: -> { arel_table[:id] },
        type: :integer
      },
      key_hash: {
        node: -> { arel_table[:key_hash] },
        type: :integer
      },
      byte_size: {
        node: -> { arel_table[:byte_size] },
        type: :integer
      },
      created_at: {
        node: -> { arel_table[:created_at] },
        type: :datetime
      }
    }
  end

  def key_base64
    @key_base64.presence || encode64(key)
  end

  def key_base64=(value)
    @key_base64 = value.to_s.strip
  end

  def value_base64
    @value_base64.presence || encode64(value)
  end

  def value_base64=(value)
    @value_base64 = value.to_s.strip
  end

  def key_sample
    Truncate.strip(key_base64)
  end

  def value_sample
    Truncate.strip(value_base64)
  end

  def to_s
    key_sample.presence || value_sample.presence || t("to_s", id: id)
  end

  private

  def decode_key_base64
    decoded = decode64(@key_base64, :key_base64, key)
    self.key = decoded if decoded
  end

  def decode_value_base64
    decoded = decode64(@value_base64, :value_base64, value)
    self.value = decoded if decoded
    sync_cache_metadata if errors.none?
  end

  def decode64(raw_value, attribute, current_value)
    return current_value if raw_value.nil?

    Base64.strict_decode64(raw_value.to_s)
  rescue ArgumentError
    errors.add(attribute, :invalid)
    nil
  end

  def encode64(raw_value)
    return if raw_value.nil?

    Base64.strict_encode64(raw_value)
  end

  def sync_cache_metadata
    self.key_hash = Digest::SHA256.digest(key.to_s).unpack1("q>")
    self.byte_size = key.to_s.bytesize + value.to_s.bytesize + row_overhead
  end

  def row_overhead
    base = SolidCache::Entry::ESTIMATED_ROW_OVERHEAD
    return base unless SolidCache.configuration.encrypt?

    base + SolidCache::Entry::ESTIMATED_ENCRYPTION_OVERHEAD
  end
end
