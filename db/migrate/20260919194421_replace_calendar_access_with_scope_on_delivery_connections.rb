# frozen_string_literal: true

class ReplaceCalendarAccessWithScopeOnDeliveryConnections < ActiveRecord::Migration[8.1]
  def up
    add_column :delivery_connections, :scope, :text, default: "", null: false
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET scope = 'https://www.googleapis.com/auth/calendar.calendarlist.readonly https://www.googleapis.com/auth/calendar.events.readonly'
      WHERE calendar_access = TRUE AND provider IN ('google', 'gmail', 'google_workspace')
    SQL
    remove_column :delivery_connections, :calendar_access
  end

  def down
    add_column :delivery_connections, :calendar_access, :boolean, default: false, null: false
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET calendar_access = TRUE
      WHERE provider IN ('google', 'gmail', 'google_workspace') AND (
        (string_to_array(scope, ' ') @> ARRAY['https://www.googleapis.com/auth/calendar.calendarlist.readonly', 'https://www.googleapis.com/auth/calendar.events.readonly'])
        OR string_to_array(scope, ' ') && ARRAY['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.readonly']
      )
    SQL
    remove_column :delivery_connections, :scope
  end
end
