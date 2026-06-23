# frozen_string_literal: true

class AddRequiredPages < ActiveRecord::Migration[8.1]
  def up
    ::Current.with(user: User.admin.first) do
      Page.create!(path: "/")
      Page.create!(path: "/up")
    end
  end

  def down
    Page.destroy_all
  end
end
