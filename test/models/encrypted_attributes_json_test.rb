# frozen_string_literal: true

require "test_helper"

class EncryptedAttributesSerializationTest < ActiveSupport::TestCase
  test "records without encrypted attributes serialize without an admin" do
    Current.with(user: nil) do
      assert_equal(
        { "id" => users(:other_user).id },
        users(:other_user).as_json(only: :id)
      )
    end
  end

  test "unsaved encrypted attributes are masked without an admin" do
    connection = DeliveryConnection.new(access_token: "secret")

    Current.with(user: nil) do
      data = connection.as_json(only: %i[access_token refresh_token])

      assert_match(/\A\*{3,10}\z/, data.fetch("access_token"))
      assert_nil(data.fetch("refresh_token"))
      assert_equal(%w[access_token refresh_token], data.keys.sort)
      assert_equal("secret", connection.access_token)
    end
  end

  test "nested serialization respects the current user's admin status" do
    user = users(:other_user)
    connection =
      user.delivery_connections.build(provider: :github, access_token: "secret")
    options = {
      only: :id,
      include: {
        delivery_connections: {
          only: :access_token
        }
      }
    }

    Current.with(user: user) do
      data = user.as_json(options).fetch("delivery_connections").sole
      assert_match(/\A\*{3,10}\z/, data.fetch("access_token"))
    end

    Current.with(user: users(:admin)) do
      data = user.as_json(options).fetch("delivery_connections").sole
      assert_equal("secret", data.fetch("access_token"))
    end

    assert_equal("secret", connection.access_token)
  end
end
