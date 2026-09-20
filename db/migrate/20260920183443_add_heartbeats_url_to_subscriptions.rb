# frozen_string_literal: true

class AddHeartbeatsUrlToSubscriptions < ActiveRecord::Migration[8.1]
  def change
    add_column :subscriptions, :heartbeats_url, :string
  end
end
