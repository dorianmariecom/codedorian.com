# frozen_string_literal: true

require "test_helper"

class CodeModelAccessTest < ActiveSupport::TestCase
  setup { Current.user = users(:admin) }
  teardown { Current.reset }

  test "every application record has a Code class with readable attributes" do
    Rails.application.eager_load!
    models =
      ActiveRecord::Base.descendants.select do |model|
        model.name&.exclude?("::") && !model.abstract_class? &&
          model < RecordConcern
      end
    assert_operator models.size, :>=, 57
    models.each do |model|
      result = Code.evaluate("#{model.name}.all")
      assert_kind_of Code::Object::List, result, model.name
      result.as_json.each do |record|
        assert_empty model.column_names - record.keys, model.name
      end
    end
  end

  test "legacy connection code API is unavailable" do
    assert_raises(Code::Error) { Code.evaluate("DeliveryConnection.all") }
    assert_not User.reflect_on_association(:delivery_connections)
  end

  test "admins can query credentials and traverse another users connections" do
    owner = users(:other_user)
    connection =
      Connection.create!(
        user: owner,
        provider: "github",
        username: "GitHub",
        access_token: "secret"
      )
    result = Code.evaluate(%(Connection.find!(#{connection.id}).access_token))
    assert_equal "secret", result.to_s
    result =
      Code.evaluate(
        %(User.where(id: #{owner.id}).first.connections.first.access_token)
      )
    assert_equal "secret", result.to_s
    result =
      Code.evaluate(%(Connection.where(provider: "github").first.user.id))
    assert_equal owner.id, result.as_json
  end

  test "admins can traverse the associations of every application model" do
    Rails.application.eager_load!
    models =
      ActiveRecord::Base.descendants.select do |model|
        model.name&.exclude?("::") && !model.abstract_class? &&
          model < RecordConcern
      end
    models.each do |model|
      record = model.first
      next unless record

      model.reflect_on_all_associations.each do |association|
        next unless association.polymorphic? || association.klass.table_exists?

        expression =
          "#{model.name}.where(id: #{record.id}).first.#{association.name}"
        result = Code.evaluate(expression)
        if association.collection?
          assert_kind_of Code::Object::List, result, expression
        else
          assert result.nothing? || result.is_a?(Code::Object::Dictionary),
                 expression
        end
      end
    end
  end

  test "owners can read their credentials but other users and guests cannot" do
    owner = subscriptions(:subscription).user
    connection =
      Connection.create!(
        user: owner,
        provider: "github",
        username: "GitHub",
        access_token: "secret"
      )
    Current.user = owner
    assert_equal "secret",
                 Code.evaluate(
                   "Current.user.connections.first.access_token"
                 ).to_s

    Current.user = users(:other_user)
    assert_empty Code.evaluate(
                   %(Connection.where(id: #{connection.id}))
                 ).as_json
    assert Code.evaluate(%(Connection.find(#{connection.id}))).nothing?
    assert_raises(ActiveRecord::RecordNotFound) do
      Code.evaluate(%(Connection.find!(#{connection.id})))
    end
    assert_empty Code.evaluate("Current.user.connections").as_json
    assert_empty Code.evaluate("Job.all").as_json

    Current.user = nil
    assert_empty Code.evaluate("Connection.all").as_json
    assert_empty Code.evaluate("Token.all").as_json
  end

  test "queries accept only model columns and do not dispatch Ruby methods" do
    assert_raises(Code::Error) do
      Code.evaluate('Connection.where("users.id": 1)')
    end
    assert_raises(Code::Error) { Code.evaluate("Connection.delete_all") }
  end

  test "service associations expose subscription and step executions" do
    subscription = subscriptions(:subscription)
    Current.subscription = subscription
    assert_equal subscription.service.subscription_executions.pluck(:id).sort,
                 Code
                   .evaluate(
                     "Current.subscription.service.subscription_executions"
                   )
                   .as_json
                   .map { |record| record.fetch("id") }
                   .sort
    assert_equal subscription.service.step_executions.pluck(:id).sort,
                 Code
                   .evaluate("Current.subscription.service.step_executions")
                   .as_json
                   .map { |record| record.fetch("id") }
                   .sort
  end
end
