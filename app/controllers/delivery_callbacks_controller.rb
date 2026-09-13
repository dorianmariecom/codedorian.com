# frozen_string_literal: true

class DeliveryCallbacksController < ActionController::API
  def twilio
    delivery = Delivery.find(params.expect(:id))
    connection = delivery.connection_for_twilio!
    unless connection.twilio? && valid_signature?(connection)
      return head :unauthorized
    end

    data = request.request_parameters
    unless data["AccountSid"] == connection.account_sid
      return head :unprocessable_content
    end

    head delivery.receive_twilio_callback!(data)
  end

  private

  def request_url_sorted
    request.original_url +
      request
        .request_parameters
        .sort
        .map { |key, content| "#{key}#{content}" }
        .join
  end

  def valid_signature?(connection)
    expected =
      Base64.strict_encode64(
        OpenSSL::HMAC.digest("sha1", connection.auth_token, request_url_sorted)
      )
    ActiveSupport::SecurityUtils.secure_compare(
      expected,
      request.headers["X-Twilio-Signature"].to_s
    )
  end
end
