# frozen_string_literal: true

class DropAttachments < ActiveRecord::Migration[8.0]
  def up
    remove_attachment_blobs

    if foreign_key_exists?(:attachments, :users)
      remove_foreign_key(:attachments, :users)
    end
    drop_table(:attachments, if_exists: true)
  end

  def down
    create_table(:attachments) do |t|
      t.timestamps
      t.bigint(:user_id, null: false)
    end

    add_index(:attachments, :user_id)
    add_foreign_key(:attachments, :users)
  end

  private

  def remove_attachment_blobs
    return unless table_exists?(:active_storage_attachments)

    blob_ids = select_values(<<~SQL.squish)
      SELECT DISTINCT blob_id
      FROM active_storage_attachments
      WHERE record_type = 'Attachment'
    SQL

    execute(<<~SQL.squish)
      DELETE FROM active_storage_attachments
      WHERE record_type = 'Attachment'
    SQL

    return if blob_ids.empty? || !table_exists?(:active_storage_blobs)

    quoted_ids = blob_ids.map { |id| connection.quote(id) }.join(",")

    execute(<<~SQL.squish)
      DELETE FROM active_storage_blobs
      WHERE id IN (#{quoted_ids})
        AND id NOT IN (SELECT DISTINCT blob_id FROM active_storage_attachments)
    SQL
  end
end
