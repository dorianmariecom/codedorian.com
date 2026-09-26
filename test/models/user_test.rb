# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "interface defaults to simple" do
    user = User.new

    assert_equal(:simple, user.interface)
    assert_predicate(user, :simple?)
    assert_not_predicate(user, :advanced?)
  end

  test "interface can be advanced" do
    user = users(:other_user)

    user.interface = :advanced

    assert_equal(:advanced, user.interface)
    assert_predicate(user, :advanced?)
    assert_not_predicate(user, :simple?)
  end
  test "name returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = Name.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.names.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.name)

    second.update_columns(primary: true)
    assert_equal(second, user.name)

    first.update_columns(verified: true)
    assert_equal(first, user.name)

    second.update_columns(verified: true)
    assert_equal(second, user.name)

    first.update_columns(primary: true)
    assert_equal(first, user.name)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.name)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.name)

    user.names.delete_all
    assert_nil(user.name)
  end

  test "address returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = Address.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.addresses.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.address)

    second.update_columns(primary: true)
    assert_equal(second, user.address)

    first.update_columns(verified: true)
    assert_equal(first, user.address)

    second.update_columns(verified: true)
    assert_equal(second, user.address)

    first.update_columns(primary: true)
    assert_equal(first, user.address)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.address)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.address)

    user.addresses.delete_all
    assert_nil(user.address)
  end

  test "handle returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = Handle.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.handles.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.handle)

    second.update_columns(primary: true)
    assert_equal(second, user.handle)

    first.update_columns(verified: true)
    assert_equal(first, user.handle)

    second.update_columns(verified: true)
    assert_equal(second, user.handle)

    first.update_columns(primary: true)
    assert_equal(first, user.handle)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.handle)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.handle)

    user.handles.delete_all
    assert_nil(user.handle)
  end

  test "password returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = Password.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.passwords.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.password)

    second.update_columns(primary: true)
    assert_equal(second, user.password)

    first.update_columns(verified: true)
    assert_equal(first, user.password)

    second.update_columns(verified: true)
    assert_equal(second, user.password)

    first.update_columns(primary: true)
    assert_equal(first, user.password)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.password)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.password)

    user.passwords.delete_all
    assert_nil(user.password)
  end

  test "email_address returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = EmailAddress.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.email_addresses.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.email_address)

    second.update_columns(primary: true)
    assert_equal(second, user.email_address)

    first.update_columns(verified: true)
    assert_equal(first, user.email_address)

    second.update_columns(verified: true)
    assert_equal(second, user.email_address)

    first.update_columns(primary: true)
    assert_equal(first, user.email_address)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.email_address)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.email_address)

    user.email_addresses.delete_all
    assert_nil(user.email_address)
  end

  test "phone_number returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = PhoneNumber.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.phone_numbers.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.phone_number)

    second.update_columns(primary: true)
    assert_equal(second, user.phone_number)

    first.update_columns(verified: true)
    assert_equal(first, user.phone_number)

    second.update_columns(verified: true)
    assert_equal(second, user.phone_number)

    first.update_columns(primary: true)
    assert_equal(first, user.phone_number)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.phone_number)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.phone_number)

    user.phone_numbers.delete_all
    assert_nil(user.phone_number)
  end

  test "time_zone returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = TimeZone.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.time_zones.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.time_zone)

    second.update_columns(primary: true)
    assert_equal(second, user.time_zone)

    first.update_columns(verified: true)
    assert_equal(first, user.time_zone)

    second.update_columns(verified: true)
    assert_equal(second, user.time_zone)

    first.update_columns(primary: true)
    assert_equal(first, user.time_zone)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.time_zone)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.time_zone)

    user.time_zones.delete_all
    assert_nil(user.time_zone)
  end

  test "country returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = Country.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.countries.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.country)

    second.update_columns(primary: true)
    assert_equal(second, user.country)

    first.update_columns(verified: true)
    assert_equal(first, user.country)

    second.update_columns(verified: true)
    assert_equal(second, user.country)

    first.update_columns(primary: true)
    assert_equal(first, user.country)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.country)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.country)

    user.countries.delete_all
    assert_nil(user.country)
  end

  test "device returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = Device.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.devices.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.device)

    second.update_columns(primary: true)
    assert_equal(second, user.device)

    first.update_columns(verified: true)
    assert_equal(first, user.device)

    second.update_columns(verified: true)
    assert_equal(second, user.device)

    first.update_columns(primary: true)
    assert_equal(first, user.device)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.device)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.device)

    user.devices.delete_all
    assert_nil(user.device)
  end

  test "token returns the preferred record with stable id ordering" do
    user = users(:admin)
    records = Token.order(:id).first(2)
    first, second = records
    records.each do |record|
      record.update_columns(user_id: user.id, verified: false, primary: false)
    end
    user.tokens.where.not(id: records.map(&:id)).delete_all

    assert_equal(first, user.token)

    second.update_columns(primary: true)
    assert_equal(second, user.token)

    first.update_columns(verified: true)
    assert_equal(first, user.token)

    second.update_columns(verified: true)
    assert_equal(second, user.token)

    first.update_columns(primary: true)
    assert_equal(first, user.token)

    records.each { |record| record.update_columns(primary: false) }
    assert_equal(first, user.token)

    records.each do |record|
      record.update_columns(verified: false, primary: true)
    end
    assert_equal(first, user.token)

    user.tokens.delete_all
    assert_nil(user.token)
  end

  test "description uses scalar values in fallback order" do
    user = users(:admin)

    assert_equal(user.handle.handle, user.calculated_description)
    user.handles.delete_all
    assert_equal(user.name.full_name, user.calculated_description)
    user.names.delete_all
    assert_equal(user.email_address.email_address, user.calculated_description)
    user.email_addresses.delete_all
    assert_equal(user.phone_number.formatted, user.calculated_description)
    user.phone_numbers.delete_all
    user.address.update_columns(autocomplete: { "formattedAddress" => "Paris" })
    assert_equal("Paris", user.calculated_description)
    user.address.update_columns(autocomplete: nil, address: "Raw address")
    assert_equal("Raw address", user.calculated_description)
    user.addresses.delete_all
    assert_equal(user.device.platform, user.calculated_description)
    user.devices.delete_all
    assert_equal(user.token.token, user.calculated_description)
    user.tokens.delete_all
    assert_nil(user.calculated_description)
  end

  test "current extracts the selected time zone value" do
    user = users(:admin)
    user.time_zones.update_all(verified: false)

    Current.with(user: user) do
      assert_equal(user.time_zone.time_zone, Time.zone.tzinfo.name)
    end
  end
end
