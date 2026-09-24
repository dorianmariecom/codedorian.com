# frozen_string_literal: true

class AddDescriptionToDeliveryConnections < ActiveRecord::Migration[8.1]
  def up
    add_column :delivery_connections, :description, :text

    select_all(
      "SELECT id, provider, name, sender, smtp_from FROM delivery_connections"
    ).each do |record|
      attributes = self.class.generated_identity(record)
      next unless attributes

      execute <<~SQL.squish
        UPDATE delivery_connections
        SET name = #{connection.quote(attributes[:name])},
            description = #{connection.quote(attributes[:description])}
        WHERE id = #{connection.quote(record["id"])}
      SQL
    end
  end

  def down
    remove_column :delivery_connections, :description
  end

  def self.generated_identity(record)
    prefix =
      {
        "github" => "GitHub",
        "x" => "X",
        "mastodon" => "Mastodon",
        "facebook" => "Facebook",
        "google" => "google",
        "gmail" => "gmail",
        "google_workspace" => "google workspace",
        "outlook" => "outlook",
        "slack" => "Slack"
      }[
        record["provider"]
      ]
    return unless prefix && record["name"].start_with?("#{prefix} · ")

    identity = record["name"].delete_prefix("#{prefix} · ")
    return if identity.blank?

    case record["provider"]
    when "slack"
      match = identity.match(/\A(.+) · (bot|user|utilisateur)(?: · ([^·]+))?\z/)
      return unless match
      return if match[2] == "bot" && match[3]
      return if match[2] != "bot" && match[3] != record["sender"]

      { name: match[1], description: [match[2], match[3]].compact.join(" - ") }
    when "google", "gmail", "google_workspace", "outlook"
      return unless identity == record["smtp_from"]

      { name: identity, description: nil }
    when "github"
      return unless identity.match?(/\A[a-zA-Z0-9-]+\z/)

      { name: identity, description: nil }
    when "x"
      return unless identity.match?(/\A@[a-zA-Z0-9_]+\z/)

      { name: identity, description: nil }
    when "mastodon"
      return unless identity.match?(/\A@[^\s@]+@[^\s@]+\z/)

      { name: identity, description: nil }
    when "facebook"
      {
        name: identity,
        description: identity == record["sender"] ? nil : record["sender"]
      }
    end
  end
end
