# frozen_string_literal: true

class AllowBlankMessageOnFeedbacks < ActiveRecord::Migration[8.1]
  def change
    change_column_null(:feedbacks, :message, true)
  end
end
