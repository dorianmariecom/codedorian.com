# frozen_string_literal: true

require "test_helper"

class DownstreamFilteringTest < ActionDispatch::IntegrationTest
  setup do
    @admin = users(:admin)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    Current.with(user: @admin) do
      @channel =
        DeliveryChannel.create!(key: "messages", enabled: true, amount_cents: 0)
      @destination =
        DeliveryDestination.create!(user: @admin, delivery_channel: @channel)
      @subscription = subscriptions(:subscription)
      @delivery =
        Delivery.create!(
          subscription: @subscription,
          delivery_destination: @destination,
          event_key: "downstream"
        )
      @selection =
        SubscriptionDestination.create!(
          subscription: @subscription,
          delivery_destination: @destination
        )
    end
  end

  test "service delivery lists include deliveries without step executions and exclude other services" do
    @locale = I18n.locale
    other_service = nil
    other_delivery = nil
    Current.with(user: @admin) do
      other_service =
        Service.create!(user: @admin, name_en: "Other downstream service")
      other_plan =
        Plan.create!(service: other_service, slug: "other-downstream")
      other_subscription = Subscription.create!(user: @admin, plan: other_plan)
      other_delivery =
        Delivery.create!(
          subscription: other_subscription,
          delivery_destination: @destination,
          event_key: "other-downstream"
        )
    end

    get service_path(@subscription.service)
    assert_response :success
    assert_select "a[href=?]", delivery_path(@delivery)
    assert_select "a[href=?]", delivery_path(other_delivery), count: 0
    get deliveries_path(service_id: @subscription.service.id),
        headers: {
          "Accept" => "application/json"
        }
    assert_response :success
    assert_equal [@delivery.id], response.parsed_body.fetch("data").pluck("id")
    get deliveries_path(service_id: other_service.id),
        headers: {
          "Accept" => "application/json"
        }
    assert_equal [other_delivery.id],
                 response.parsed_body.fetch("data").pluck("id")
  end

  test "subscription destinations and invoices stay within the selected plan" do
    @locale = I18n.locale
    other_plan = nil
    Current.with(user: @admin) do
      other_plan =
        Plan.create!(
          service: @subscription.service,
          slug: "other-destination-plan"
        )
      other_subscription = Subscription.create!(user: @admin, plan: other_plan)
      other_destination =
        DeliveryDestination.create!(user: @admin, delivery_channel: @channel)
      SubscriptionDestination.create!(
        subscription: other_subscription,
        delivery_destination: other_destination
      )
      StripeInvoice.create!(
        subscription: other_subscription,
        stripe_invoice_id: "in_other_downstream",
        currency: "eur"
      )
    end
    get delivery_destinations_path(plan_id: @subscription.plan_id),
        headers: {
          "Accept" => "application/json"
        }
    assert_response :success
    assert_equal [@destination.id],
                 response.parsed_body.fetch("data").pluck("id")
    get subscription_destinations_path(plan_id: @subscription.plan_id),
        headers: {
          "Accept" => "application/json"
        }
    assert_response :success
    assert_equal [@selection.id], response.parsed_body.fetch("data").pluck("id")
    get stripe_invoices_path(plan_id: other_plan.id),
        headers: {
          "Accept" => "application/json"
        }
    assert_response :success
    assert_equal ["in_other_downstream"],
                 response.parsed_body.fetch("data").pluck("stripe_invoice_id")
  end

  test "index links and search retain service context and count all matching descendants" do
    @locale = I18n.locale
    get plans_path(
          service_id: @subscription.service.id,
          search: {
            q: "unmatched"
          },
          page: 2
        )
    assert_response :success
    links = index_links("deliveries")
    assert_equal 1, links.size
    assert_equal I18n.t("shared.count.deliveries", count: 1), links.first.text
    link = links.first["href"]
    assert_includes link, "service_id=#{@subscription.service.id}"
    assert_not_includes link, "search"
    assert_not_includes link, "page="
    get link
    assert_response :success
    assert_select "input[type=hidden][name=service_id][value=?]",
                  @subscription.service.id.to_s
    assert_select "a[href=?]", delivery_path(@delivery)
  end

  test "page children are filtered and unrelated pages are absent" do
    @locale = I18n.locale
    parent = pages(:page)
    child = nil
    unrelated = nil
    Current.with(user: @admin) do
      child =
        Page.create!(user: @admin, parent: parent, path: "/downstream-child")
      unrelated = Page.create!(user: @admin, path: "/downstream-unrelated")
    end
    get page_path(parent)
    assert_response :success
    assert_select "a[href=?]", page_path(child)
    assert_select "a[href=?]", page_path(unrelated), count: 0
    get pages_path(page_id: parent.id),
        headers: {
          "Accept" => "application/json"
        }
    assert_response :success
    assert_equal [child.id], response.parsed_body.fetch("data").pluck("id")
  end

  test "delivery channel counts include records beyond the first page and retain empty links" do
    @locale = I18n.locale
    Current.with(user: @admin) do
      DeliveryDestination.default_per_page.times do
        DeliveryDestination.create!(user: @admin, delivery_channel: @channel)
      end
    end
    get delivery_destinations_path(delivery_channel_id: @channel.id)
    assert_response :success
    assert_equal I18n.t("shared.count.deliveries", count: 1),
                 index_links("deliveries").sole.text
    assert_equal I18n.t("shared.count.subscription_destinations", count: 1),
                 index_links("subscription_destinations").sole.text
    get delivery_channel_path(@channel)
    assert_response :success
    assert_select ".pagination"

    empty_channel =
      DeliveryChannel.create!(key: "webhook", enabled: true, amount_cents: 0)
    get delivery_destinations_path(delivery_channel_id: empty_channel.id)
    assert_response :success
    assert_equal I18n.t("shared.count.deliveries", count: 0),
                 index_links("deliveries").sole.text
  end

  test "simple users do not see technical sections and cannot filter another user's records" do
    @locale = I18n.locale
    delete login_path
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    get user_path(users(:other_user))
    assert_response :success
    assert_select ".p.font-bold a",
                  text: I18n.t("users.show.services"),
                  count: 0
    get services_path
    assert_response :success
    assert_empty index_links("logs")
    assert_empty index_links("deliveries")
    get delivery_destinations_path(user_id: @admin.id),
        headers: {
          "Accept" => "application/json"
        }
    assert_response :bad_request
  end

  test "advanced users see only policy scoped downstream records" do
    @locale = I18n.locale
    other_user = users(:other_user)
    other_user.update_columns(interface: "advanced")
    own_destination =
      Current.with(user: other_user) do
        DeliveryDestination.create!(
          user: other_user,
          delivery_channel: @channel
        )
      end
    delete login_path
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    get user_path(other_user)
    assert_response :success
    assert_select "a[href=?]", delivery_destination_path(own_destination)
    assert_select "a[href=?]", delivery_destination_path(@destination), count: 0
    assert_select ".p.font-bold a", text: I18n.t("users.show.logs"), count: 0
    get delivery_destinations_path(user_id: other_user.id),
        headers: {
          "Accept" => "application/json"
        }
    assert_response :success
    assert_equal [own_destination.id],
                 response.parsed_body.fetch("data").pluck("id")
  end
  test "nested job counts use the same program context as the linked list" do
    @locale = I18n.locale
    program = programs(:program)
    job = jobs(:job)
    Current.with(user: @admin) do
      JobContext.create!(
        active_job_id: job.active_job_id,
        context: {
          program: {
            id: program.id
          }
        }
      )
    end
    get program_executions_path(
          user_id: program.user_id,
          program_id: program.id
        )
    assert_response :success
    links = index_links("jobs")
    assert_equal 1, links.size
    assert_equal I18n.t("shared.count.jobs", count: 1), links.first.text
    get links.first["href"], headers: { "Accept" => "application/json" }
    assert_response :success
    assert_equal [job.id], response.parsed_body.fetch("data").pluck("id").uniq
  end

  test "audit links prefer the selected plan over its user context" do
    @locale = I18n.locale
    plan = plans(:plan)
    version = Version.create!(item: plan, event: "update")
    get subscriptions_path(user_id: @admin.id, plan_id: plan.id)
    assert_response :success
    links = index_links("versions")
    assert_equal 1, links.size
    get links.first["href"], headers: { "Accept" => "application/json" }
    assert_response :success
    assert_includes response.parsed_body.fetch("data").pluck("id"), version.id
  end

  test "user execution lists follow the subscriber rather than the service owner" do
    @locale = I18n.locale
    subscriber = users(:other_user)
    execution = nil
    Current.with(user: @admin) do
      subscription = Subscription.create!(user: subscriber, plan: plans(:plan))
      subscription_execution =
        SubscriptionExecution.create!(subscription: subscription, status: :done)
      execution =
        StepExecution.create!(
          subscription_execution: subscription_execution,
          step: steps(:step),
          status: :done
        )
    end
    get step_executions_path(user_id: subscriber.id),
        headers: {
          "Accept" => "application/json"
        }
    assert_response :success
    assert_includes response.parsed_body.fetch("data").pluck("id"), execution.id
    get step_executions_path(user_id: @admin.id),
        headers: {
          "Accept" => "application/json"
        }
    assert_response :success
    assert_not_includes response.parsed_body.fetch("data").pluck("id"),
                        execution.id
  end

  def index_links(resource)
    css_select(".p > a.link").select do |link|
      uri = URI.parse(link["href"])
      next false if uri.host && uri.host != request.host

      route = Rails.application.routes.recognize_path(uri.path)
      route[:controller] == resource && route[:action] == "index" &&
        link.text.match?(/\d/)
    end
  end

  def default_url_options
    { locale: @locale || I18n.locale }
  end
end
