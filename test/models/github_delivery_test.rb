# frozen_string_literal: true

require "test_helper"

class GithubDeliveryTest < ActiveSupport::TestCase
  setup { Current.user = users(:admin) }
  teardown { Current.reset }

  test "GitHub destination requires an owned connection and owner repository recipient" do
    owner = subscriptions(:subscription).user
    channel = DeliveryChannel.create!(key: "github", enabled: true, amount_cents: 0, show_connection: true, show_recipient: true, show_visibility: true)
    connection = DeliveryConnection.create!(user: owner, provider: "github", name: "GitHub", access_token: "secret")
    destination = DeliveryDestination.new(user: owner, delivery_channel: channel, delivery_connection: connection, recipient: "octocat/repo", visibility: "private")
    assert destination.valid?
    assert destination.available?
    %w[https://github.com/octocat/repo octocat/../repo octocat/.. octocat/. /repo octocat/repo/issues].each do |recipient|
      destination.recipient = recipient
      assert_not destination.valid?, recipient
    end
    destination.recipient = "octocat/repo"
    destination.delivery_connection = DeliveryConnection.create!(user: users(:other_user), provider: "github", name: "Other", access_token: "other")
    assert_not destination.valid?
    destination.delivery_connection = connection
    destination.save!
    connection.destroy!
    assert_not destination.reload.available?
  end
end
