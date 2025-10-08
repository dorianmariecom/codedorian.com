# frozen_string_literal: true

class UpdateDescriptionForAllUsers < ActiveRecord::Migration[8.0]
  def change
    User.find_each(&:touch)
  end
end
