# frozen_string_literal: true

require "test_helper"

class DatumDeletionTest < ActiveSupport::TestCase
  setup { Current.user = users(:other_user) }
  teardown { Current.reset }

  test "destroy returns the deleted datum and evaluation continues" do
    %w[destroy destroy!].each do |operation|
      datum =
        Datum.create!(key: "deleted_#{operation}", value: { "ok" => true })
      result = Code.evaluate(%(Datum.find!("#{datum.key}").#{operation}))
      assert_kind_of Code::Object::Datum, result
      assert_equal datum.attributes.as_json, result.as_json
      assert_not Datum.exists?(datum.id)
      assert_equal({ "ok" => true }, result.code_value.as_json)
    end
  end

  test "another user cannot destroy a datum" do
    datum = Datum.create!(key: "private", value: "secret")
    Current.user = nil
    assert Code.evaluate('Datum.find("private")').nothing?
    assert_raises(ActiveRecord::RecordNotFound) do
      Code::Object::Datum.new(id: datum.id)
    end
    assert Datum.exists?(datum.id)
  end
end
