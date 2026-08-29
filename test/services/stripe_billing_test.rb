# frozen_string_literal: true

require "test_helper"

class StripeBillingTest < ActiveSupport::TestCase
  test "customer creation idempotency ignores email changes" do
    user = users(:admin)
    original_email_address = user.email_address
    idempotency_keys = []
    create_request =
      stub_request(:post, "https://api.stripe.com/v1/customers").with do |request|
        idempotency_keys << request.headers.fetch("Idempotency-Key")
        URI.decode_www_form(request.body).to_h.exclude?("email")
      end.to_return(
        {
          status: 200,
          body: { id: "cus_test", object: "customer" }.to_json,
          headers: { "Content-Type" => "application/json" }
        }
      )
    updated_email_addresses = []
    update_request =
      stub_request(
        :post,
        "https://api.stripe.com/v1/customers/cus_test"
      ).with do |request|
        updated_email_addresses <<
          URI.decode_www_form(request.body).to_h.fetch("email")
        true
      end.to_return(
        status: 200,
        body: { id: "cus_test", object: "customer" }.to_json,
        headers: { "Content-Type" => "application/json" }
      )

    Current.with(user: user) do
      assert_equal("cus_test", StripeBilling.ensure_customer!(user))

      user.update!(stripe_customer_id: nil)
      user.email_addresses.find_by!(primary: true).update!(
        email_address: "changed@example.com"
      )

      assert_equal("cus_test", StripeBilling.ensure_customer!(user))
    end

    assert_requested(create_request, times: 2)
    assert_requested(update_request, times: 2)
    assert_equal(1, idempotency_keys.uniq.size)
    assert_equal(
      [original_email_address, "changed@example.com"],
      updated_email_addresses.uniq
    )
    assert(
      idempotency_keys.all? do |key|
        key.start_with?(
          "user-#{user.id}-stripe-customer-v2-"
        )
      end
    )
  end
end
