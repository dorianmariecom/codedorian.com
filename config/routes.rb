# frozen_string_literal: true

Rails.application.routes.draw do
  mount(Blazer::Engine, at: :blazer)
  mount(ActionCable.server => "/cable")

  define_all_delete =
    lambda do |action, controller|
      delete(
        "/#{action}_all",
        to: "#{controller}##{action}_all",
        on: :collection
      )
    end

  define_all_post =
    lambda do |action, controller|
      post("/#{action}_all", to: "#{controller}##{action}_all", on: :collection)
    end

  define_all_patch =
    lambda do |action, controller|
      patch(
        "/#{action}_all",
        to: "#{controller}##{action}_all",
        on: :collection
      )
    end

  define_delete_destroy =
    lambda do
      delete(:delete)
      delete(:destroy)
    end

  define_logs_versions =
    lambda do
      resources(:logs) do
        define_delete_destroy.call
        define_all_delete.call(:destroy, :logs)
        define_all_delete.call(:delete, :logs)
      end

      resources(:versions) do
        define_delete_destroy.call
        define_all_delete.call(:destroy, :versions)
        define_all_delete.call(:delete, :versions)
      end
    end

  define_errors =
    lambda do
      resources(:errors) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :errors)
        define_all_delete.call(:delete, :errors)

        resources(:error_occurrences) do
          define_delete_destroy.call
          define_logs_versions.call
          define_all_delete.call(:destroy, :error_occurrences)
          define_all_delete.call(:delete, :error_occurrences)
        end
      end

      resources(:error_occurrences) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :error_occurrences)
        define_all_delete.call(:delete, :error_occurrences)
      end
    end

  define_job_resources =
    lambda do |resource|
      resources(resource) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, resource)
        define_all_delete.call(:delete, resource)

        define_errors.call
      end
    end

  define_job_execution_resources =
    lambda do
      %i[
        job_blocked_executions
        job_claimed_executions
        job_contexts
        job_failed_executions
        job_ready_executions
        job_recurring_executions
        job_scheduled_executions
      ].each { |resource| define_job_resources.call(resource) }
    end

  define_job_admin_resources =
    lambda do
      %i[
        job_pauses
        job_processes
        job_recurring_tasks
        job_semaphores
      ].each { |resource| define_job_resources.call(resource) }
    end

  define_jobs =
    lambda do
      resources(:jobs) do
        define_delete_destroy.call
        define_logs_versions.call
        post(:discard)
        post(:retry)

        define_all_delete.call(:destroy, :jobs)
        define_all_delete.call(:delete, :jobs)
        define_all_post.call(:discard, :jobs)
        define_all_post.call(:retry, :jobs)

        define_job_execution_resources.call
        define_errors.call
      end

      define_job_execution_resources.call
    end

  define =
    lambda do
      resources(:data) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :data)
        define_all_delete.call(:delete, :data)

        define_errors.call
      end

      resources(:programs) do
        post(:evaluate)
        post(:schedule)
        post(:unschedule)

        define_delete_destroy.call
        define_logs_versions.call
        define_all_patch.call(:schedule, :programs)
        define_all_patch.call(:unschedule, :programs)
        define_all_delete.call(:destroy, :programs)
        define_all_delete.call(:delete, :programs)

        resources(:program_executions) do
          define_delete_destroy.call
          define_logs_versions.call
          define_all_delete.call(:destroy, :program_executions)
          define_all_delete.call(:delete, :program_executions)

          define_errors.call
        end

        resources(:program_schedules) do
          define_delete_destroy.call
          define_logs_versions.call
          define_all_delete.call(:destroy, :program_schedules)
          define_all_delete.call(:delete, :program_schedules)

          define_errors.call
        end

        define_errors.call
      end

      resources(:email_addresses) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :email_addresses)
        define_all_delete.call(:delete, :email_addresses)

        define_errors.call
      end

      resources(:phone_numbers) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :phone_numbers)
        define_all_delete.call(:delete, :phone_numbers)

        define_errors.call
      end

      resources(:program_executions) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :program_executions)
        define_all_delete.call(:delete, :program_executions)

        define_errors.call
      end

      resources(:time_zones) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :time_zones)
        define_all_delete.call(:delete, :time_zones)

        define_errors.call
      end

      resources(:passwords) do
        post(:check, on: :collection)

        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :passwords)
        define_all_delete.call(:delete, :passwords)

        define_errors.call
      end

      resources(:program_schedules) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :program_schedules)
        define_all_delete.call(:delete, :program_schedules)

        define_errors.call
      end

      resources(:devices) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :devices)
        define_all_delete.call(:delete, :devices)

        define_errors.call
      end

      resources(:messages) do
        get(:content)
        get(:subject)
        get(:body)

        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :messages)
        define_all_delete.call(:delete, :messages)

        define_errors.call
      end

      resources(:handles) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :handles)
        define_all_delete.call(:delete, :handles)

        define_errors.call
      end

      resources(:addresses) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :addresses)
        define_all_delete.call(:delete, :addresses)

        define_errors.call
      end

      resources(:guests) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :guests)
        define_all_delete.call(:delete, :guests)

        define_errors.call
      end

      resources(:names) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :names)
        define_all_delete.call(:delete, :names)

        define_errors.call
      end

      resources(:tokens) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :tokens)
        define_all_delete.call(:delete, :tokens)

        define_errors.call
      end

      resources(:sessions) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :sessions)
        define_all_delete.call(:delete, :sessions)
      end

      define_job_execution_resources.call
      define_job_admin_resources.call
      define_errors.call
      define_jobs.call
      define_logs_versions.call
    end

  scope("(:locale)", locale: /en|fr|/) do
    resources(:guests) do
      define_delete_destroy.call
      define_all_delete.call(:destroy, :guests)
      define_all_delete.call(:delete, :guests)

      define.call
    end

    resources(:users) do
      post(:impersonate)

      define_delete_destroy.call
      define_all_delete.call(:destroy, :users)
      define_all_delete.call(:delete, :users)

      define.call
    end

    define.call

    resources(:configurations) do
      define_delete_destroy.call
      define_logs_versions.call
      define_all_delete.call(:destroy, :configurations)
      define_all_delete.call(:delete, :configurations)
    end

    resources(:logs) do
      define_delete_destroy.call
      define_logs_versions.call
      define_all_delete.call(:destroy, :logs)
      define_all_delete.call(:delete, :logs)
    end

    resources(:versions) do
      define_delete_destroy.call
      define_logs_versions.call
      define_all_delete.call(:destroy, :versions)
      define_all_delete.call(:delete, :versions)
    end

    resources(:examples) do
      define_delete_destroy.call
      define_logs_versions.call
      define_all_delete.call(:destroy, :examples)
      define_all_delete.call(:delete, :examples)

      resources(:example_schedules) do
        define_delete_destroy.call
        define_logs_versions.call
        define_all_delete.call(:destroy, :example_schedules)
        define_all_delete.call(:delete, :example_schedules)
      end
    end

    resources(:example_schedules) do
      define_delete_destroy.call
      define_logs_versions.call
      define_all_delete.call(:destroy, :example_schedules)
      define_all_delete.call(:delete, :example_schedules)
    end

    resources(:form_programs) do
      define_delete_destroy.call
      define_logs_versions.call
      define_all_delete.call(:destroy, :form_programs)
      define_all_delete.call(:delete, :form_programs)
    end

    resources(:form_schedules) do
      define_delete_destroy.call
      define_logs_versions.call
      define_all_delete.call(:destroy, :form_schedules)
      define_all_delete.call(:delete, :form_schedules)
    end

    resources(:form_deliveries) do
      define_delete_destroy.call
      define_logs_versions.call
      define_all_delete.call(:destroy, :form_deliveries)
      define_all_delete.call(:delete, :form_deliveries)
    end

    resources(:country_code_ip_addresses) do
      post(:lookup)

      define_delete_destroy.call
      define_logs_versions.call
      define_all_delete.call(:destroy, :country_code_ip_addresses)
      define_all_delete.call(:delete, :country_code_ip_addresses)
    end

    patch(:time_zone, to: "users#update_time_zone")

    resource(:session, controller: :session, as: :login) do
      define_delete_destroy.call
    end

    get(:up, to: "static#up")
    get(:about, to: "static#about")
    get(:terms, to: "static#terms")
    get(:privacy, to: "static#privacy")
    get(:icons, to: "static#icons")
    get(:ios, to: "static#ios")
    get(:android, to: "static#android")
    get(:download, to: "static#download")
    get(:form, to: "static#form")
    get(:admin, to: "static#admin")

    match("/404", to: "errors#not_found", via: :all)
    match("/422", to: "errors#unprocessable_entity", via: :all)
    match("/500", to: "errors#internal_server_error", via: :all)

    root(to: "static#home")

    match("*path", to: "errors#not_found", via: :all)
  end
end
