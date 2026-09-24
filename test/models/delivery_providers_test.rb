# frozen_string_literal: true

require "test_helper"

class DeliveryProvidersTest < ActiveSupport::TestCase
  setup { Current.user = users(:admin) }
  teardown { Current.reset }

  test "email supports all email providers but rejects messaging connections" do
    channel =
      DeliveryChannel.new(key: "email", enabled: true, amount_cents: 120)
    %w[
      smtp
      gmail
      google_workspace
      outlook
      aws_ses
      sendgrid
      resend
      mailgun
      mailchimp
    ].each do |provider|
      connection =
        DeliveryConnection.create!(provider: provider, username: provider)
      channel.delivery_connection = connection
      assert channel.valid?, channel.errors.full_messages.join(", ")
      assert_not channel.available?
    end
    channel.delivery_connection =
      DeliveryConnection.create!(
        provider: "telegram",
        username: "Bot",
        access_token: "123:token"
      )
    assert_not channel.valid?
  end

  test "new provider accounts must belong to admins and secrets remain encrypted" do
    connection =
      DeliveryConnection.new(
        provider: "aws_ses",
        username: "SES",
        user: users(:other_user),
        aws_secret_access_key: "secret-value",
        aws_session_token: "session-value"
      )
    assert_not connection.valid?
    connection.user = users(:admin)
    connection.save!
    assert_not_includes connection.aws_secret_access_key_before_type_cast,
                        "secret-value"
    assert_not_includes connection.aws_session_token_before_type_cast,
                        "session-value"
    assert_not_includes connection.versions.to_json, "secret-value"
    connection.update!(aws_secret_access_key: "new-secret")
    assert_not_includes connection.versions.to_json, "new-secret"
  end

  test "changing email provider preserves destinations prices and queued connection snapshots" do
    smtp =
      DeliveryConnection.create!(
        provider: "smtp",
        username: "SMTP",
        smtp_from: "sender@example.com",
        smtp_address: "smtp.example.com"
      )
    resend =
      DeliveryConnection.create!(
        provider: "resend",
        username: "Resend",
        smtp_from: "sender@example.com",
        api_key: "key"
      )
    channel =
      DeliveryChannel.create!(
        key: "email",
        enabled: true,
        amount_cents: 120,
        delivery_connection: smtp
      )
    subscription = subscriptions(:subscription)
    destination =
      DeliveryDestination.create!(
        user: subscription.user,
        delivery_channel: channel,
        recipient: "recipient@example.com"
      )
    SharedEmailVerification.confirm(destination, destination.verification_token)
    delivery =
      Delivery.create!(
        subscription: subscription,
        delivery_destination: destination,
        event_key: "queued"
      )
    channel.update!(delivery_connection: resend)
    assert_equal smtp, delivery.reload.connection
    assert_equal resend, destination.reload.connection
    assert destination.recipient_verified?
    assert_equal 120, channel.amount_cents
    assert_equal "email", delivery.channel
  end

  test "new messaging destinations validate account scoped recipients and disallow personal connections" do
    %w[messenger instagram telegram viber].each do |provider|
      connection =
        DeliveryConnection.create!(
          provider: provider,
          username: provider,
          access_token: "123:token",
          sender: "sender"
        )
      channel =
        DeliveryChannel.create!(
          key: provider,
          visibility_restriction: "private",
          enabled: true,
          amount_cents: 0,
          delivery_connection: connection,
          show_recipient: true
        )
      destination =
        DeliveryDestination.new(
          user: users(:other_user),
          delivery_channel: channel,
          recipient: "123456",
          visibility: "private"
        )
      assert destination.valid?, destination.errors.full_messages.join(", ")
      destination.visibility = "public"
      assert destination.valid?
      assert_equal "private", destination.visibility
      destination.visibility = "private"
      destination.recipient = ""
      assert_not destination.valid?
      destination.recipient = "123456"
      destination.delivery_connection = connection
      assert_not destination.valid?
    end
  end

  test "provider-specific required fields and invalid regions prevent readiness" do
    ses =
      DeliveryConnection.new(
        user: users(:admin),
        provider: "aws_ses",
        username: "SES",
        smtp_from: "sender@example.com",
        aws_access_key_id: "key",
        aws_region: "eu-west-1"
      )
    assert_not ses.ready?
    ses.aws_secret_access_key = "secret"
    assert ses.ready?
    ses.aws_region = "https://other.example"
    assert_not ses.valid?
    mailgun =
      DeliveryConnection.new(
        user: users(:admin),
        provider: "mailgun",
        username: "Mailgun",
        smtp_from: "sender@example.com",
        api_key: "key",
        mailgun_domain: "mail.example.com"
      )
    assert_not mailgun.ready?
    mailgun.mailgun_region = "eu"
    assert mailgun.ready?
    mailgun.mailgun_domain = "../messages"
    assert_not mailgun.valid?
  end
end
