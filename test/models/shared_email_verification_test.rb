# frozen_string_literal: true

require "test_helper"

class SharedEmailVerificationTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @user = users(:admin)
    @channel =
      DeliveryChannel.create!(key: "email", enabled: true, amount_cents: 0)
  end

  teardown { Current.reset }

  test "account confirmation verifies duplicates and future destinations only for its owner" do
    address =
      @user.email_addresses.create!(email_address: " Shared@Example.com ")
    duplicate =
      @user.email_addresses.create!(email_address: address.email_address)
    destination = destination_for(@user, " SHARED@EXAMPLE.COM ")
    other = destination_for(users(:other_user), address.email_address)
    assert_not destination.recipient_verified?
    assert SharedEmailVerification.confirm(address, address.verification_token)
    assert duplicate.reload.verified?
    assert destination.reload.recipient_verified?
    assert_not other.reload.recipient_verified?
    assert destination_for(@user, address.email_address).recipient_verified?
  end

  test "recipient confirmation does not create an account email and future account emails inherit" do
    destination = destination_for(@user)
    duplicate = destination_for(@user)
    assert_no_difference "EmailAddress.count" do
      assert SharedEmailVerification.confirm(
               destination,
               destination.verification_token
             )
    end
    assert duplicate.reload.recipient_verified?
    address =
      @user.email_addresses.create!(email_address: " SHARED@EXAMPLE.COM ")
    assert address.verified?
  end

  test "account address and ownership changes discard verification or inherit new identity" do
    address = @user.email_addresses.create!(email_address: "shared@example.com")
    SharedEmailVerification.confirm(address, address.verification_token)
    address.reload.update!(email_address: "unknown@example.com")
    assert_not address.verified?
    address.update!(email_address: email_addresses(:admin_email).email_address)
    assert address.verified?
    address.update!(user: users(:other_user))
    assert_not address.verified?
  end

  test "destination recipient owner and channel changes discard previous verification" do
    destination =
      destination_for(@user, email_addresses(:admin_email).email_address)
    assert destination.recipient_verified?
    destination.update!(recipient: "unknown@example.com")
    assert_not destination.recipient_verified?
    SharedEmailVerification.confirm(destination, destination.verification_token)
    destination.reload.update!(user: users(:other_user))
    assert_not destination.recipient_verified?
    SharedEmailVerification.confirm(destination, destination.verification_token)
    destination.reload.update!(
      delivery_channel: DeliveryChannel.create!(key: "messages")
    )
    assert_not destination.recipient_verified?
  end

  test "confirmation tokens expire reject tampering purpose changes record edits and reuse" do
    address = @user.email_addresses.create!(email_address: "shared@example.com")
    token = address.verification_token
    assert_not SharedEmailVerification.confirm(address, "#{token}bad")
    assert_not SharedEmailVerification.confirm(
                 address,
                 address.magic_link_token
               )
    assert_nil EmailAddress.find_by_magic_link(address.id, token)
    travel 25.hours do
      assert_not SharedEmailVerification.confirm(address, token)
    end
    address.update!(primary: true)
    assert_not SharedEmailVerification.confirm(address, token)
    token = address.verification_token
    assert SharedEmailVerification.confirm(address, token)
    assert_not SharedEmailVerification.confirm(address, token)
  end

  test "existing verified account emails provide inheritance" do
    destination =
      destination_for(@user, email_addresses(:admin_email).email_address)
    assert destination.recipient_verified?
    assert_not destination_for(
                 users(:other_user),
                 destination.recipient
               ).recipient_verified?
  end

  test "legacy mixed case values share verification using normalized identity" do
    address = @user.email_addresses.create!(email_address: "legacy@example.com")
    address.update_columns(
      email_address: " LEGACY@EXAMPLE.COM ",
      verified: true
    )
    destination = destination_for(@user, "legacy@example.com")
    assert destination.recipient_verified?
    destination.update_columns(
      recipient: " LEGACY@EXAMPLE.COM ",
      recipient_verified: false
    )
    address.update_column(:verified, false)
    assert SharedEmailVerification.confirm(address, address.verification_token)
    assert destination.reload.recipient_verified?
  end

  private

  def destination_for(user, recipient = "shared@example.com")
    DeliveryDestination.create!(
      user: user,
      delivery_channel: @channel,
      recipient: recipient
    )
  end
end
