# frozen_string_literal: true

require "test_helper"

class FullCrudCoverageTest < ActiveSupport::TestCase
  CRUD_ACTIONS = %w[index show new create edit update destroy].freeze
  EXTENDED_DELETE_ACTIONS = %w[delete delete_all destroy_all].freeze
  REQUIRED_VIEWS = %w[index show new edit _form].freeze

  test "every concrete app model has routes, actions, views, and admin policy" do
    Rails.application.eager_load!
    admin = users(:admin)

    app_models.each do |model|
      assert_crud_routes(model)
      assert_crud_controller(model)
      assert_crud_views(model)
      assert_admin_policy(model, admin)
    end
  end

  test "controllers only expose routed actions" do
    routed_actions =
      Rails.application.routes.routes.each_with_object({}) do |route, result|
        controller_name = route.defaults[:controller]
        action_name = route.defaults[:action]
        next if controller_name.blank? || action_name.blank?

        result[controller_name] ||= Set.new
        result[controller_name] << action_name.to_s
      end

    ApplicationController.descendants.each do |controller|
      controller_name = controller.controller_path
      unexpected_actions =
        controller.action_methods.to_set - routed_actions.fetch(controller_name, Set.new)

      assert_empty(
        unexpected_actions,
        "#{controller.name} exposes non-routed actions: " \
          "#{unexpected_actions.to_a.sort.join(', ')}"
      )
    end
  end

  private

  def app_models
    models_path = Rails.root.join("app/models").to_s

    ActiveRecord::Base
      .descendants
      .reject(&:abstract_class?)
      .select do |model|
        source_path = Object.const_source_location(model.name)&.first
        source_path&.start_with?(models_path)
      end
      .sort_by(&:name)
  end

  def assert_crud_routes(model)
    controller = model.model_name.route_key
    route_actions =
      Rails.application.routes.routes.filter_map do |route|
        route.defaults[:action].to_s if route.defaults[:controller] == controller
      end

    required_actions = CRUD_ACTIONS + EXTENDED_DELETE_ACTIONS
    missing_actions = required_actions - route_actions
    assert_empty(
      missing_actions,
      "#{model.name} is missing routes for: #{missing_actions.join(', ')}"
    )
  end

  def assert_crud_controller(model)
    controller_class = "#{model.model_name.route_key}_controller".camelize.constantize
    required_actions = CRUD_ACTIONS + EXTENDED_DELETE_ACTIONS
    missing_actions = required_actions - controller_class.action_methods.to_a
    assert_empty(
      missing_actions,
      "#{controller_class.name} is missing actions: #{missing_actions.join(', ')}"
    )
  end

  def assert_crud_views(model)
    views_path = Rails.root.join("app/views", model.model_name.route_key)
    missing_views =
      REQUIRED_VIEWS.reject { |view| views_path.join("#{view}.html.erb").exist? }
    assert_empty(
      missing_views,
      "#{model.name} is missing views: #{missing_views.join(', ')}"
    )
  end

  def assert_admin_policy(model, admin)
    policy_class = Pundit::PolicyFinder.new(model).policy!
    record_policy = policy_class.new(admin, model.new)
    class_policy = policy_class.new(admin, model)

    %i[show? create? update? destroy?].each do |query|
      assert(
        record_policy.public_send(query),
        "#{policy_class.name}##{query} must allow admins"
      )
    end
    %i[index? destroy_all?].each do |query|
      assert(
        class_policy.public_send(query),
        "#{policy_class.name}##{query} must allow admins"
      )
    end
  end
end
