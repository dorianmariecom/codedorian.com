# frozen_string_literal: true

require "test_helper"

class EncryptedAttributesJsonTest < ActionDispatch::IntegrationTest
  setup do
    @connection =
      Current.with(user: users(:other_user)) do
        Connection.create!(
          user: users(:other_user),
          provider: :github,
          **Connection.encrypted_attributes.index_with do |name|
            "secret-#{name}"
          end
        )
      end
    @connection.reload
  end

  test "regular users receive masked encrypted attributes in show and index JSON" do
    headers = { "Token" => tokens(:other_token).token }

    get(connection_path(id: @connection.id, format: :json), headers: headers)
    assert_response(:success)
    assert_masked_attributes(response.parsed_body.fetch("data"))

    get(connections_path(format: :json), headers: headers)
    assert_response(:success)
    assert_masked_attributes(response.parsed_body.fetch("data").sole)
  end

  test "admins receive decrypted attributes in show and index JSON" do
    headers = { "Token" => tokens(:token).token }

    get(connection_path(id: @connection.id, format: :json), headers: headers)
    assert_response(:success)
    assert_decrypted_attributes(response.parsed_body.fetch("data"))

    get(connections_path(format: :json), headers: headers)
    assert_response(:success)
    assert_decrypted_attributes(response.parsed_body.fetch("data").sole)
  end

  private

  def assert_masked_attributes(data)
    Connection.encrypted_attributes.each do |name|
      assert_match(/\A\*{3,10}\z/, data.fetch(name.to_s))
    end
    assert_equal("github", data.fetch("provider"))
  end

  def assert_decrypted_attributes(data)
    Connection.encrypted_attributes.each do |name|
      assert_equal("secret-#{name}", data.fetch(name.to_s))
    end
    assert_equal("github", data.fetch("provider"))
  end
end
