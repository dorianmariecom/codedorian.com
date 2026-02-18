# frozen_string_literal: true

class AddFormRelationsToSubmissionChildren < ActiveRecord::Migration[7.1]
  def change
    add_reference(
      :submission_programs,
      :form_program,
      type: :bigint,
      foreign_key: true,
      index: true
    )

    add_reference(
      :submission_schedules,
      :form_schedule,
      type: :bigint,
      foreign_key: true,
      index: true
    )

    add_reference(
      :submission_deliveries,
      :form_delivery,
      type: :bigint,
      foreign_key: true,
      index: true
    )
  end
end
