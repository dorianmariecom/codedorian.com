# frozen_string_literal: true

require "test_helper"

class SlackRecipientTest < ActiveSupport::TestCase
  setup do
    @connection = DeliveryConnection.new(id: 123, access_token: "test-token")
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
  end

  teardown { Rails.cache = @previous_cache }

  test "destinations accept prefixed names and legacy IDs" do
    Current.with(user: users(:admin)) do
      channel =
        DeliveryChannel.create!(
          key: "slack",
          private_pattern: '(?:[@#][^\\s@#<>]+|[CGDUW][A-Z0-9]+)',
          enabled: true,
          amount_cents: 0
        )
      connection =
        DeliveryConnection.create!(
          provider: "slack",
          username: "Slack",
          access_token: "test"
        )
      destination =
        DeliveryDestination.new(
          delivery_channel: channel,
          delivery_connection: connection
        )
      %w[dorian C123/invalid @ #].each do |recipient|
        destination.recipient = recipient
        assert_not destination.valid?
        assert destination.errors.of_kind?(:recipient, :invalid)
      end
      %w[@dorian #dorian C123 G123 D123 U123 W123].each do |recipient|
        destination.recipient = recipient
        assert destination.valid?, destination.errors.full_messages.join(", ")
      end
    end
  end

  test "legacy IDs resolve without a lookup" do
    %w[C123 G123 D123 U123 W123].each do |recipient|
      assert_equal recipient, SlackRecipient.resolve(@connection, recipient)
    end
    assert_not_requested :get, %r{https://slack.com/api/}
    assert_not_requested :post, %r{https://slack.com/api/}
  end

  test "channel names resolve through paginated channel listings and are cached" do
    first =
      stub_request(:get, "https://slack.com/api/conversations.list").with(
        query: {
          limit: 200,
          types: "public_channel,private_channel",
          exclude_archived: true
        }
      ).to_return(
        body: {
          ok: true,
          channels: [],
          response_metadata: {
            next_cursor: "next"
          }
        }.to_json
      )
    stub_request(:get, "https://slack.com/api/conversations.list").with(
      query: {
        limit: 200,
        types: "public_channel,private_channel",
        exclude_archived: true,
        cursor: "next"
      }
    ).to_return(
      body: { ok: true, channels: [{ id: "C123", name: "dorian" }] }.to_json
    )
    2.times do
      assert_equal "C123", SlackRecipient.resolve(@connection, "#dorian")
    end
    assert_requested first, times: 1
  end

  test "user handles open a direct conversation before posting" do
    stub_request(:get, "https://slack.com/api/users.list").with(
      query: {
        limit: 200
      }
    ).to_return(
      body: { ok: true, members: [{ id: "U123", name: "dorian" }] }.to_json
    )
    opened =
      stub_request(:post, "https://slack.com/api/conversations.open").with(
        body: {
          users: "U123"
        },
        headers: {
          "Authorization" => "Bearer test-token"
        }
      ).to_return(body: { ok: true, channel: { id: "D123" } }.to_json)
    assert_equal "D123", SlackRecipient.resolve(@connection, "@dorian")
    assert_requested opened
  end

  test "ambiguous display names are rejected without opening a conversation" do
    stub_request(:get, "https://slack.com/api/users.list").with(
      query: {
        limit: 200
      }
    ).to_return(
      body: {
        ok: true,
        members: [
          { id: "U1", name: "one", profile: { display_name: "dorian" } },
          { id: "U2", name: "two", profile: { display_name: "dorian" } }
        ]
      }.to_json
    )
    error =
      assert_raises(DeliveryAdapters::Rejected) do
        SlackRecipient.resolve(@connection, "@dorian")
      end
    assert_equal "ambiguous_slack_user", error.code
    assert_not_requested :post, "https://slack.com/api/conversations.open"
  end

  test "bare strings and missing names are rejected before network access" do
    ["dorian", "C123/invalid", "@", "#", "@two people"].each do |recipient|
      error =
        assert_raises(DeliveryAdapters::Rejected) do
          SlackRecipient.resolve(@connection, recipient)
        end
      assert_equal "invalid_slack_recipient", error.code
    end
  end

  test "missing scopes and rate limits remain actionable provider errors" do
    stub_request(:get, "https://slack.com/api/users.list").with(
      query: {
        limit: 200
      }
    ).to_return(body: { ok: false, error: "missing_scope" }.to_json)
    error =
      assert_raises(DeliveryAdapters::Rejected) do
        SlackRecipient.resolve(@connection, "@dorian")
      end
    assert_equal "missing_scope", error.code
    stub_request(:get, "https://slack.com/api/users.list").with(
      query: {
        limit: 200
      }
    ).to_return(status: 429)
    error =
      assert_raises(DeliveryAdapters::Rejected) do
        SlackRecipient.resolve(@connection, "@dorian")
      end
    assert error.retryable
  end
end
