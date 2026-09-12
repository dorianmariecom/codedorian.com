# frozen_string_literal: true

require "test_helper"

class DeliveryCallbacksControllerTest < ActionDispatch::IntegrationTest
  setup do
    Current.with(user: users(:admin)) do
      connection =
        DeliveryConnection.create!(
          user: users(:admin),
          name: "Twilio",
          provider: "twilio",
          account_sid: "ACtest",
          auth_token: "test-secret"
        )
      channel =
        DeliveryChannel.create!(
          key: "sms",
          delivery_connection: connection,
          amount_cents: 100,
          enabled: true,
          messaging_service_sid: "MGtest"
        )
      destination =
        DeliveryDestination.create!(
          user: users(:admin),
          delivery_channel: channel,
          name: "Phone",
          recipient: "+33611223344"
        )
      @delivery =
        Delivery.create!(
          subscription: subscriptions(:subscription),
          delivery_destination: destination,
          event_key: "callback",
          status: "sending"
        )
    end
  end

  test "invalid signatures cannot change delivery status" do
    post "/delivery_callbacks/twilio/#{@delivery.id}",
         params: {
           MessageSid: "SMtest",
           MessageStatus: "delivered",
           AccountSid: "ACtest"
         }
    assert_response :unauthorized
    assert_equal "sending", @delivery.reload.status
  end

  test "authenticated receipts arriving before response are monotonic" do
    callback("delivered")
    assert_response :success
    assert_equal "delivered", @delivery.reload.status
    callback("sent")
    assert_equal "delivered", @delivery.reload.status
  end

  test "accepted receipts allow later delivery confirmation" do
    callback("sent")
    assert_response :success
    assert_equal "accepted", @delivery.reload.status
    callback("delivered")
    assert_response :success
    assert_equal "delivered", @delivery.reload.status
  end

  test "mismatched provider IDs leave the delivery unchanged" do
    @delivery.update!(provider_id: "SMother")
    callback("delivered")
    assert_response :unprocessable_content
    assert_equal "sending", @delivery.reload.status
    @delivery.with_lock { @delivery.update!(provider_id: "SMtest") }
    callback("delivered")
    assert_response :success
  end

  test "private delivery content never has a public link" do
    get "/x/#{@delivery.public_token}"
    assert_response :not_found
  end

  test "public content uses the application lifecycle and follows destination visibility" do
    Current.with(user: users(:admin)) do
      connection =
        DeliveryConnection.create!(
          user: users(:admin),
          name: "Mastodon",
          provider: "mastodon"
        )
      channel = DeliveryChannel.create!(key: "mastodon")
      @delivery.delivery_destination.update!(
        delivery_channel: channel,
        delivery_connection: connection,
        visibility: "public",
        recipient: ""
      )
      @delivery.update!(
        visibility: "public",
        subject: "Public update",
        body_text: "Hello"
      )
    end

    assert_difference "Guest.count", 1 do
      get "/x/#{@delivery.public_token}"
    end
    assert_response :success
    assert_includes response.body, "Public update"
    assert_nil response.headers["X-Robots-Tag"]
    assert_not_includes response.headers["Cache-Control"].to_s, "no-store"

    Current.with(user: users(:admin)) do
      @delivery.delivery_destination.update!(visibility: "private")
    end
    get "/x/#{@delivery.public_token}"
    assert_response :not_found
  end

  private

  def callback(status)
    path = "/delivery_callbacks/twilio/#{@delivery.id}"
    data = {
      "MessageSid" => "SMtest",
      "MessageStatus" => status,
      "AccountSid" => "ACtest"
    }
    value =
      "#{Current.base_url}#{path}" +
        data.sort.map { |key, content| "#{key}#{content}" }.join
    signature =
      Base64.strict_encode64(OpenSSL::HMAC.digest("sha1", "test-secret", value))
    post path, params: data, headers: { "X-Twilio-Signature" => signature }
  end
end
