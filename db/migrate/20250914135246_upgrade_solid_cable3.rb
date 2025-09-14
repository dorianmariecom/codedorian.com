# frozen_string_literal: true

class UpgradeSolidCable3 < ActiveRecord::Migration[8.0]
  def up
    change_table(:solid_cable_messages, bulk: true) do |t|
      t.change(
        :channel,
        :binary,
        limit: 1024,
        null: false,
        using: "convert_to(channel, 'UTF8')"
      )
      t.change(
        :payload,
        :binary,
        limit: 536_870_912,
        null: false,
        using: "convert_to(payload, 'UTF8')"
      )
    end

    unless column_exists?(:solid_cable_messages, :channel_hash)
      add_column(:solid_cable_messages, :channel_hash, :integer, limit: 8)
    end
    unless index_exists?(:solid_cable_messages, :channel_hash)
      add_index(:solid_cable_messages, :channel_hash)
    end

    SolidCable::Message.find_each do |msg|
      msg.update(
        channel_hash: SolidCable::Message.channel_hash_for(msg.channel)
      )
    end
  end

  def down
    change_table(:solid_cable_messages, bulk: true) do |t|
      t.change(:channel, :text, using: "convert_from(channel, 'UTF8')")
      t.change(:payload, :text, using: "convert_from(payload, 'UTF8')")
    end

    return unless column_exists?(:solid_cable_messages, :channel_hash)

    remove_column(:solid_cable_messages, :channel_hash)
  end
end
