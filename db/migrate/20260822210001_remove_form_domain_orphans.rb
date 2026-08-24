# frozen_string_literal: true

class RemoveFormDomainOrphans < ActiveRecord::Migration[8.1]
  RECORD_TYPES = %w[
    Feedback
    FormDelivery
    FormProgram
    FormSchedule
    Submission
    SubmissionDelivery
    SubmissionProgram
    SubmissionSchedule
    SubmissionSection
  ].freeze

  def up
    quoted_types = RECORD_TYPES.map { |type| connection.quote(type) }.join(", ")

    execute(
      "DELETE FROM action_text_rich_texts WHERE record_type IN (#{quoted_types})"
    )
    execute("DELETE FROM versions WHERE item_type IN (#{quoted_types})")
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
