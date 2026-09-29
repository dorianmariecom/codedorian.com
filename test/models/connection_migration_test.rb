# frozen_string_literal: true

require "test_helper"
require_relative "../../db/migrate/20260929184501_rename_delivery_connections_to_connections"

class ConnectionMigrationTest < ActiveSupport::TestCase
  setup { Current.user = users(:admin) }
  teardown do
    Current.reset
    Connection.connection.clear_cache!
  end

  test "rename round trip preserves credentials relationships and audit history" do
    connection = Connection.create!(provider: "slack", access_token: "secret")
    channel =
      DeliveryChannel.create!(key: "slack", enabled: true, amount_cents: 0)
    destination =
      DeliveryDestination.create!(
        delivery_channel: channel,
        connection: connection,
        recipient: "#hello"
      )
    context = {
      "connection" => {
        "id" => connection.id
      },
      "delivery_destination" => {
        "id" => destination.id,
        "connection_id" => connection.id
      }
    }
    log =
      Log.create!(
        message: "delivery_connection historical text",
        context: context
      )
    job_context =
      JobContext.create!(active_job_id: SecureRandom.uuid, context: context)
    version = destination.versions.last
    connection_version = connection.versions.last
    ciphertext = connection.attributes_before_type_cast.fetch("access_token")

    RenameDeliveryConnectionsToConnections.suppress_messages do
      migration = RenameDeliveryConnectionsToConnections.new
      migration.migrate(:down)
      assert_equal "DeliveryConnection", connection_version.reload.item_type
      assert_equal connection.id,
                   version
                     .reload
                     .object_changes
                     .fetch("delivery_connection_id")
                     .last
      assert_equal connection.id,
                   log.reload.context.fetch("delivery_connection").fetch("id")
      assert_equal connection.id,
                   job_context
                     .reload
                     .context
                     .fetch("delivery_destination")
                     .fetch("delivery_connection_id")
      migration.migrate(:up)
    end

    assert_equal ciphertext,
                 connection.reload.attributes_before_type_cast.fetch(
                   "access_token"
                 )
    assert_equal "secret", connection.access_token
    assert_equal connection, destination.reload.connection
    assert_equal connection, destination.effective_connection
    assert_equal connection, connection_version.reload.item
    assert_equal connection.id,
                 version.reload.object_changes.fetch("connection_id").last
    assert_equal context, log.reload.context
    assert_equal context, job_context.reload.context
    assert_equal "delivery_connection historical text", log.message
    assert_includes Log.where_connection(connection), log
    assert_not Connection.connection.table_exists?(:delivery_connections)
    assert_not DeliveryDestination.column_names.include?(
                 "delivery_connection_id"
               )
  end
end
