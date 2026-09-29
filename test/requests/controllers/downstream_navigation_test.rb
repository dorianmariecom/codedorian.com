# frozen_string_literal: true

require "test_helper"

class DownstreamNavigationTest < ActionDispatch::IntegrationTest
  setup do
    @admin = users(:admin)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    Current.with(user: @admin) do
      @connection =
        Connection.create!(
          user: @admin,
          provider: "slack",
          username: "downstream",
          enabled: true
        )
      @channel =
        DeliveryChannel.create!(key: "slack", enabled: true, amount_cents: 0)
      @destination =
        DeliveryDestination.create!(
          user: @admin,
          delivery_channel: @channel,
          connection: @connection,
          recipient: "#downstream"
        )
      @selection =
        SubscriptionDestination.create!(
          subscription: subscriptions(:subscription),
          delivery_destination: @destination
        )
      @delivery =
        Delivery.create!(
          subscription: subscriptions(:subscription),
          delivery_destination: @destination,
          connection: @connection,
          event_key: "downstream"
        )
    end
  end

  {
    users: {
      record: -> { User.first! },
      parent: :user,
      children: %w[
        addresses
        countries
        data
        devices
        email_addresses
        handles
        names
        passwords
        phone_numbers
        programs
        services
        subscriptions
        delivery_destinations
        connections
        time_zones
        tokens
        messages
        sessions
        pages
        program_schedules
        program_executions
        service_fields
        steps
        plans
        subscription_values
        subscription_destinations
        subscription_executions
        stripe_invoices
        deliveries
        delivery_channels
        step_executions
        plan_fields
        plan_schedules
        jobs
        job_contexts
        errors
        error_occurrences
        versions
        logs
      ]
    },
    programs: {
      record: -> { Program.first! },
      parent: :program,
      children: %w[
        program_schedules
        program_executions
        jobs
        job_contexts
        errors
        error_occurrences
        versions
        logs
      ]
    },
    services: {
      record: -> { Service.first! },
      parent: :service,
      children: %w[
        service_fields
        steps
        plans
        step_executions
        plan_fields
        plan_schedules
        subscriptions
        deliveries
        subscription_values
        subscription_destinations
        delivery_destinations
        subscription_executions
        stripe_invoices
        versions
        logs
      ]
    },
    plans: {
      record: -> { Plan.first! },
      parent: :plan,
      children: %w[
        steps
        plan_fields
        plan_schedules
        subscriptions
        subscription_values
        subscription_destinations
        delivery_destinations
        subscription_executions
        stripe_invoices
        deliveries
        step_executions
        versions
        logs
      ]
    },
    subscriptions: {
      record: -> { Subscription.first! },
      parent: :subscription,
      children: %w[
        subscription_values
        subscription_destinations
        delivery_destinations
        subscription_executions
        stripe_invoices
        deliveries
        step_executions
        jobs
        versions
        logs
      ]
    },
    subscription_executions: {
      record: -> { SubscriptionExecution.first! },
      parent: :subscription_execution,
      children: %w[step_executions deliveries jobs versions logs]
    },
    steps: {
      record: -> { Step.first! },
      parent: :step,
      children: %w[step_executions deliveries jobs versions logs]
    },
    step_executions: {
      record: -> { StepExecution.first! },
      parent: :step_execution,
      children: %w[deliveries jobs versions logs]
    },
    connections: {
      record: -> { Connection.first! },
      parent: :connection,
      children: %w[
        delivery_channels
        delivery_destinations
        deliveries
        subscription_destinations
        versions
        logs
      ]
    },
    delivery_channels: {
      record: -> { DeliveryChannel.first! },
      parent: :delivery_channel,
      children: %w[
        delivery_destinations
        subscription_destinations
        deliveries
        versions
        logs
      ]
    },
    delivery_destinations: {
      record: -> { DeliveryDestination.first! },
      parent: :delivery_destination,
      children: %w[subscription_destinations deliveries versions logs]
    },
    jobs: {
      record: -> { Job.first! },
      parent: :job,
      children: %w[
        job_contexts
        job_ready_executions
        job_failed_executions
        job_scheduled_executions
        job_blocked_executions
        job_claimed_executions
        job_batch_executions
        job_recurring_executions
        errors
        error_occurrences
        logs
      ]
    },
    job_batches: {
      record: -> { JobBatch.first! },
      parent: :job_batch,
      children: %w[
        jobs
        job_batch_executions
        job_contexts
        job_ready_executions
        job_failed_executions
        job_scheduled_executions
        job_blocked_executions
        job_claimed_executions
        job_recurring_executions
        logs
      ]
    },
    job_processes: {
      record: -> { JobProcess.first! },
      parent: :job_process,
      children: %w[job_processes job_claimed_executions logs job_contexts]
    },
    job_recurring_tasks: {
      record: -> { JobRecurringTask.first! },
      parent: :job_recurring_task,
      children: %w[job_recurring_executions logs job_contexts]
    },
    errors: {
      record: -> { ::Error.first! },
      parent: :error,
      children: %w[error_occurrences jobs job_contexts logs]
    },
    addresses: {
      record: -> { Address.first! },
      parent: :address,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    configurations: {
      record: -> { Configuration.first! },
      parent: :configuration,
      children: %w[versions logs]
    },
    countries: {
      record: -> { Country.first! },
      parent: :country,
      children: %w[versions logs]
    },
    country_code_ip_addresses: {
      record: -> { CountryCodeIpAddress.first! },
      parent: :country_code_ip_address,
      children: %w[versions logs]
    },
    data: {
      record: -> { Datum.first! },
      parent: :datum,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    deliveries: {
      record: -> { Delivery.first! },
      parent: :delivery,
      children: %w[versions logs]
    },
    devices: {
      record: -> { Device.first! },
      parent: :device,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    email_addresses: {
      record: -> { EmailAddress.first! },
      parent: :email_address,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    error_occurrences: {
      record: -> { ErrorOccurrence.first! },
      parent: :error_occurrence,
      children: %w[jobs job_contexts logs]
    },
    guests: {
      record: -> { Guest.first! },
      parent: :guest,
      children: %w[
        jobs
        job_contexts
        errors
        error_occurrences
        versions
        logs
        names
        handles
        email_addresses
        phone_numbers
        addresses
        passwords
        time_zones
        devices
        tokens
        data
        messages
        programs
        program_executions
        program_schedules
      ]
    },
    handles: {
      record: -> { Handle.first! },
      parent: :handle,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    job_batch_executions: {
      record: -> { JobBatchExecution.first! },
      parent: :job_batch_execution,
      children: %w[job_contexts logs]
    },
    job_blocked_executions: {
      record: -> { JobBlockedExecution.first! },
      parent: :job_blocked_execution,
      children: %w[job_contexts logs]
    },
    job_claimed_executions: {
      record: -> { JobClaimedExecution.first! },
      parent: :job_claimed_execution,
      children: %w[job_contexts logs]
    },
    job_contexts: {
      record: -> { JobContext.first! },
      parent: :job_context,
      children: %w[jobs errors error_occurrences versions logs]
    },
    job_failed_executions: {
      record: -> { JobFailedExecution.first! },
      parent: :job_failed_execution,
      children: %w[job_contexts logs]
    },
    job_pauses: {
      record: -> { JobPause.first! },
      parent: :job_pause,
      children: %w[logs]
    },
    job_ready_executions: {
      record: -> { JobReadyExecution.first! },
      parent: :job_ready_execution,
      children: %w[job_contexts logs]
    },
    job_recurring_executions: {
      record: -> { JobRecurringExecution.first! },
      parent: :job_recurring_execution,
      children: %w[job_contexts logs]
    },
    job_scheduled_executions: {
      record: -> { JobScheduledExecution.first! },
      parent: :job_scheduled_execution,
      children: %w[job_contexts logs]
    },
    job_semaphores: {
      record: -> { JobSemaphore.first! },
      parent: :job_semaphore,
      children: %w[logs]
    },
    links: {
      record: -> { Link.first! },
      parent: :link,
      children: %w[versions logs]
    },
    logs: {
      record: -> { Log.first! },
      parent: :log,
      children: %w[versions]
    },
    messages: {
      record: -> { Message.first! },
      parent: :message,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    names: {
      record: -> { Name.first! },
      parent: :name,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    pages: {
      record: -> { Page.first! },
      parent: :page,
      children: %w[pages versions logs]
    },
    passwords: {
      record: -> { Password.first! },
      parent: :password,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    phone_numbers: {
      record: -> { PhoneNumber.first! },
      parent: :phone_number,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    plan_fields: {
      record: -> { PlanField.first! },
      parent: :plan_field,
      children: %w[versions logs]
    },
    plan_schedules: {
      record: -> { PlanSchedule.first! },
      parent: :plan_schedule,
      children: %w[versions logs]
    },
    program_executions: {
      record: -> { ProgramExecution.first! },
      parent: :program_execution,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    program_schedules: {
      record: -> { ProgramSchedule.first! },
      parent: :program_schedule,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    service_fields: {
      record: -> { ServiceField.first! },
      parent: :service_field,
      children: %w[versions logs]
    },
    sessions: {
      record: -> { Session.first! },
      parent: :session,
      children: %w[logs]
    },
    stripe_events: {
      record: -> { StripeEvent.first! },
      parent: :stripe_event,
      children: %w[versions logs]
    },
    stripe_invoices: {
      record: -> { StripeInvoice.first! },
      parent: :stripe_invoice,
      children: %w[versions logs]
    },
    subscription_destinations: {
      record: -> { SubscriptionDestination.first! },
      parent: :subscription_destination,
      children: %w[versions logs]
    },
    subscription_values: {
      record: -> { SubscriptionValue.first! },
      parent: :subscription_value,
      children: %w[versions logs]
    },
    time_zones: {
      record: -> { TimeZone.first! },
      parent: :time_zone,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    tokens: {
      record: -> { Token.first! },
      parent: :token,
      children: %w[jobs job_contexts errors error_occurrences versions logs]
    },
    versions: {
      record: -> { Version.first! },
      parent: :version,
      children: %w[logs]
    }
  }.each do |resource, expectation|
    test "#{resource} expose authorized downstream lists" do
      @locale = I18n.locale
      parent = expectation.fetch(:record).call
      get url_for(controller: resource, action: :index, only_path: true)
      assert_response :success
      assert_select ".translation_missing", count: 0
      expectation
        .fetch(:children)
        .each do |child|
          assert_equal 1,
                       index_links(child).size,
                       "missing or duplicate #{child} index link"
        end

      get url_for(
            controller: resource,
            action: :show,
            id: parent.is_a?(Guest) ? parent.id : parent.to_param,
            only_path: true
          )
      assert_response :success
      assert_select ".translation_missing", count: 0
      links = []
      expectation
        .fetch(:children)
        .each do |child|
          matches =
            css_select(".p.font-bold a").select do |link|
              uri = URI.parse(link["href"])
              route = Rails.application.routes.recognize_path(uri.path)
              query = Rack::Utils.parse_nested_query(uri.query)
              key = "#{expectation.fetch(:parent)}_id"
              parent_matches =
                (route[key.to_sym] || query[key]).to_s.in?(
                  [parent.id.to_s, parent.to_param.to_s]
                )
              if parent.is_a?(Plan) && child == "steps"
                parent_matches ||= query["service_id"] == parent.service_id.to_s
              end
              route[:controller] == child && route[:action] == "index" &&
                parent_matches
            end
          assert_equal 1, matches.size, "missing or duplicate #{child} heading"
          links << matches.first["href"]
        end
      links.each do |link|
        get link, headers: { "Accept" => "application/json" }
        assert_response :success
        assert_equal "ok", response.parsed_body.fetch("status")
      end
    end
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
