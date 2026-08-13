# frozen_string_literal: true

Rails.application.routes.draw do
  mount(Blazer::Engine, at: :blazer)
  mount(ActionCable.server => "/cable")

  concern :deletable do
    delete(:delete)
    delete(:destroy)
    delete(:delete_all, on: :collection)
    delete(:destroy_all, on: :collection)
  end

  define_surface =
    lambda do
      resources(:programs, concerns: :deletable) do
        post(:evaluate, on: :member)
        post(:format, on: :member)
        post(:schedule, on: :member)
        post(:unschedule, on: :member)
        post(:format_all, on: :collection)
        patch(:schedule_all, on: :collection)
        patch(:unschedule_all, on: :collection)
      end

      resources(:jobs, concerns: :deletable) do
        post(:discard)
        post(:retry)
        post(:discard_all, on: :collection)
        post(:retry_all, on: :collection)
      end

      resources(:passwords, concerns: :deletable) do
        post(:check, on: :collection)
      end

      resources(:messages, concerns: :deletable) do
        get(:content)
        get(:subject)
        get(:body)
      end

      %i[
        addresses
        data
        devices
        email_addresses
        error_occurrences
        errors
        handles
        job_blocked_executions
        job_claimed_executions
        job_contexts
        job_failed_executions
        job_pauses
        job_processes
        job_ready_executions
        job_recurring_executions
        job_recurring_tasks
        job_scheduled_executions
        job_semaphores
        logs
        names
        pages
        phone_numbers
        plan_schedules
        plans
        program_executions
        program_schedules
        services
        sessions
        solid_cable_messages
        step_executions
        steps
        subscription_executions
        time_zones
        tokens
        versions
      ].each { |resource| resources(resource, concerns: :deletable) }

      resources(:subscriptions, concerns: :deletable) do
        post(:activate, on: :member)
        post(:deactivate, on: :member)
        post(:evaluate, on: :member)
      end
    end

  scope("(:locale)", locale: /en|fr|/) do
    resources(:users, concerns: :deletable) do
      post(:impersonate)
      define_surface.call
    end
    resources(:guests, concerns: :deletable) { define_surface.call }

    define_surface.call

    resources(:country_code_ip_addresses, concerns: :deletable) do
      post(:lookup)
    end

    %i[
      configurations
      feedbacks
      form_deliveries
      form_programs
      form_schedules
      links
      solid_cache_entries
      submission_deliveries
      submission_programs
      submission_schedules
      submission_sections
      submissions
    ].each { |resource| resources(resource, concerns: :deletable) }

    patch(:time_zone, to: "users#update_time_zone")

    resource(:session, controller: :session, as: :login) do
      delete(:delete)
      delete(:destroy)
    end

    resource(:form)
    resources(:program_runs, only: %i[create show])

    match("/404", to: "errors#not_found", via: :all)
    match("/422", to: "errors#unprocessable_entity", via: :all)
    match("/500", to: "errors#internal_server_error", via: :all)
    root(to: "pages#show")
    get("*path", to: "pages#show", constraints: { path: %r{(?!rails/).*} })
  end
end
