# frozen_string_literal: true

require "test_helper"
require_relative "../../db/migrate/20260924192010_add_description_to_delivery_connections"
require_relative "../../db/migrate/20260924192353_remove_name_from_delivery_connections"
require_relative "../../db/migrate/20260924193745_add_identity_to_delivery_connections"

class DeliveryConnectionDescriptionTest < ActiveSupport::TestCase
  teardown { DeliveryConnection.connection.clear_cache! }

  test "identity normalizes ids and omits unavailable profile fields" do
    assert_equal(
      { email: "dorian@example.com", username: "dorian", external_id: "123" },
      DeliveryConnectionOauth.identity(
        email: "dorian@example.com",
        username: "dorian",
        external_id: 123
      )
    )
    assert_equal({}, DeliveryConnectionOauth.identity(email: "", username: nil))
    connection = DeliveryConnection.new(email: "existing@example.com")
    connection.assign_attributes(
      DeliveryConnectionOauth.identity(external_id: "123")
    )
    assert_equal "existing@example.com", connection.email
  end

  test "labels use provider and unique identity fields" do
    connection =
      DeliveryConnection.new(
        provider: "github",
        email: "dorian@example.com",
        username: "dorian",
        external_id: "123"
      )
    assert_equal Utils.join(
                   "github",
                   "dorian@example.com",
                   "dorian",
                   "123",
                   connection.id_sample
                 ),
                 connection.to_s
    connection.username = connection.email
    assert_equal Utils.join(
                   "github",
                   "dorian@example.com",
                   "123",
                   connection.id_sample
                 ),
                 connection.to_s
    assert_equal "smtp", DeliveryConnection.new(provider: "smtp").to_s
    %i[email username external_id].each do |field|
      assert_equal :string, DeliveryConnection.search_fields[field][:type]
    end
    assert_not DeliveryConnection.column_names.include?("description")
    assert_not DeliveryConnection.column_names.include?("name")
  end

  test "legacy production connection formats migrate to structured identity" do
    examples = [
      {
        provider: "google",
        name: "google · person@example.com",
        sender: "google-123",
        smtp_from: "person@example.com",
        email: "person@example.com"
      },
      {
        provider: "github",
        name: "GitHub · octocat",
        sender: "123",
        username: "octocat"
      },
      { provider: "x", name: "X · @dorian", sender: "456", username: "dorian" },
      {
        provider: "mastodon",
        name: "Mastodon · @dorian@ruby.social",
        sender: "789",
        base_url: "https://ruby.social",
        username: "dorian"
      },
      {
        provider: "slack",
        name: "Slack · Workspace · bot",
        sender: "B123",
        account_sid: "T123"
      },
      {
        provider: "slack",
        name: "Slack · Workspace · user · U123",
        sender: "U123",
        account_sid: "T123"
      },
      {
        provider: "outlook",
        name: "outlook · person@example.com",
        sender: "outlook-123",
        smtp_from: "person@example.com",
        email: "person@example.com"
      },
      {
        provider: "smtp",
        name: "SMTP",
        smtp_from: "person@example.com",
        smtp_user_name: "mailer",
        email: "person@example.com",
        username: "mailer"
      }
    ]
    Current.with(user: users(:admin)) do
      records =
        examples.map do |example|
          DeliveryConnection.create!(
            example.except(:name, :email, :username).merge(
              access_token: "secret"
            )
          )
        end
      AddDescriptionToDeliveryConnections.suppress_messages do
        AddIdentityToDeliveryConnections.new.migrate(:down)
        RemoveNameFromDeliveryConnections.new.migrate(:down)
        AddDescriptionToDeliveryConnections.new.migrate(:down)
        records
          .zip(examples)
          .each do |record, example|
            database = DeliveryConnection.connection
            database.execute(
              "UPDATE delivery_connections SET name = #{database.quote(example[:name])} WHERE id = #{record.id}"
            )
          end
        AddDescriptionToDeliveryConnections.new.migrate(:up)
        RemoveNameFromDeliveryConnections.new.migrate(:up)
        AddIdentityToDeliveryConnections.new.migrate(:up)
      end
      records
        .zip(examples)
        .each do |record, example|
          record.reload
          assert_equal example[:email], record.email if example[:email]
          assert_nil record.email unless example[:email]
          assert_equal example[:username], record.username if example[:username]
          assert_nil record.username unless example[:username]
          assert_equal example[:sender], record.external_id if example[:sender]
          assert_nil record.external_id unless example[:sender]
          assert_equal "secret", record.access_token
          assert_equal example[:provider], record.provider
          if example[:account_sid]
            assert_equal example[:account_sid], record.account_sid
          end
          assert_equal example[:base_url], record.base_url if example[:base_url]
        end
    end
  end
end
