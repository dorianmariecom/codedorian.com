# frozen_string_literal: true

class AddHashcashNavigationLinks < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL.squish
      INSERT INTO links (kind, title_en, title_fr, path_input, visibility_input, verb, position, image_ios, image_android, created_at, updated_at)
      SELECT kind, 'hashcashes', 'hashcashes', '"{locale_prefix}/hashcashes"', 'Current.user&.admin?', 'get',
             COALESCE((SELECT MAX(position) FROM links), 0) + 1, 'checkmark.shield', 'verified_user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM (VALUES ('navigation'), ('menu')) AS kinds(kind)
      WHERE NOT EXISTS (
        SELECT 1 FROM links WHERE links.kind = kinds.kind AND path_input = '"{locale_prefix}/hashcashes"'
      )
    SQL
  end

  def down
    execute <<~SQL.squish
      DELETE FROM links
      WHERE kind IN ('navigation', 'menu') AND path_input = '"{locale_prefix}/hashcashes"'
        AND visibility_input = 'Current.user&.admin?'
    SQL
  end
end
