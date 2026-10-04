# frozen_string_literal: true

require "test_helper"

class DatabaseTimestampsTest < ActiveSupport::TestCase
  test "every application table has updated_at" do
    connection = ApplicationRecord.connection
    tables = connection.tables - %w[schema_migrations ar_internal_metadata]

    tables.each do |table|
      assert connection.column_exists?(table, :updated_at), table
    end
  end

  test "Solid Cache writes populate and refresh updated_at" do
    key = "timestamps/#{SecureRandom.hex}"
    SolidCache::Entry.write(key, "first")
    entry = SolidCache::Entry.find_by!(key:)
    assert entry.updated_at

    entry.update_columns(updated_at: 1.day.ago)
    previous_timestamp = entry.updated_at
    SolidCache::Entry.write(key, "second")

    assert_operator entry.reload.updated_at, :>, previous_timestamp
  end

  test "Solid Cable broadcasts populate updated_at" do
    channel = "timestamps/#{SecureRandom.hex}"
    SolidCable::Message.broadcast(channel, "payload")

    assert SolidCable::Message.find_by!(channel:).updated_at
  end

  test "Blazer audit inserts without Rails timestamps use the database default" do
    result =
      Blazer::Audit.insert!({ statement: "SELECT 1" }, record_timestamps: false)

    assert Blazer::Audit.find(result.rows.first.first).updated_at
  end
end
