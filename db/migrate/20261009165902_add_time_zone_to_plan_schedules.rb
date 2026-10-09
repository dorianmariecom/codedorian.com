# frozen_string_literal: true

class AddTimeZoneToPlanSchedules < ActiveRecord::Migration[8.1]
  def up
    add_column :plan_schedules, :time_zone, :string
    execute <<~SQL.squish
      UPDATE plan_schedules
      SET time_zone = COALESCE(
        (SELECT NULLIF(time_zones.time_zone, '')
         FROM time_zones
         INNER JOIN services ON services.user_id = time_zones.user_id
         INNER JOIN plans ON plans.service_id = services.id
         WHERE plans.id = plan_schedules.plan_id
         ORDER BY time_zones.verified DESC, time_zones.primary DESC, time_zones.id
         LIMIT 1),
        #{connection.quote(Rails.application.config.time_zone)}
      )
    SQL
    change_column_null :plan_schedules, :time_zone, false
  end

  def down
    remove_column :plan_schedules, :time_zone
  end
end
