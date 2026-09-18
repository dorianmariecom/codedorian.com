# frozen_string_literal: true

class AddDeliveryProviderSettings < ActiveRecord::Migration[8.1]
  def change
    add_column :delivery_connections, :aws_access_key_id, :string
    add_column :delivery_connections, :aws_secret_access_key, :text
    add_column :delivery_connections, :aws_session_token, :text
    add_column :delivery_connections, :aws_region, :string
    add_column :delivery_connections, :mailgun_domain, :string
    add_column :delivery_connections, :mailgun_region, :string
  end
end
