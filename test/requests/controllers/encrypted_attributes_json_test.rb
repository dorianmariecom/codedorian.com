# frozen_string_literal: true

require "test_helper"

class EncryptedAttributesJsonTest < ActionDispatch::IntegrationTest
  setup do
    @connection =
      Current.with(user: users(:other_user)) do
        DeliveryConnection.create!(
          user: users(:other_user),
          provider: :github,
          **DeliveryConnection.encrypted_attributes.index_with do |name|
            "secret-#{name}"
          end
        )
      end
    @connection.reload
  end

  test "regular users receive encrypted attributes in show and index JSON" do
    headers = { "Token" => tokens(:other_token).token }

    get(
      delivery_connection_path(id: @connection.id, format: :json),
      headers: headers
    )
    assert_response(:success)
    assert_encrypted_attributes(response.parsed_body.fetch("data"))

    get(delivery_connections_path(format: :json), headers: headers)
    assert_response(:success)
    assert_encrypted_attributes(response.parsed_body.fetch("data").sole)
  end

  test "admins receive decrypted attributes in show and index JSON" do
    headers = { "Token" => tokens(:token).token }

    get(
      delivery_connection_path(id: @connection.id, format: :json),
      headers: headers
    )
    assert_response(:success)
    assert_decrypted_attributes(response.parsed_body.fetch("data"))

    get(delivery_connections_path(format: :json), headers: headers)
    assert_response(:success)
    assert_decrypted_attributes(response.parsed_body.fetch("data").sole)
  end

  private

  def assert_encrypted_attributes(data)
    DeliveryConnection.encrypted_attributes.each do |name|
      ciphertext = data.fetch(name.to_s)
      assert_equal(@connection.ciphertext_for(name), ciphertext)
      assert_equal(
        "secret-#{name}",
        ActiveRecord::Encryption.encryptor.decrypt(ciphertext)
      )
    end
    assert_equal("github", data.fetch("provider"))
  end

  def assert_decrypted_attributes(data)
    DeliveryConnection.encrypted_attributes.each do |name|
      assert_equal("secret-#{name}", data.fetch(name.to_s))
    end
    assert_equal("github", data.fetch("provider"))
  end
end
