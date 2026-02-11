# frozen_string_literal: true

module ControllerSmokeHelper
  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods
    def smoke_actions_for(controller)
      ControllerSmokeHelper
        .actions_for(controller)
        .each do |action|
          test(action.to_s) { smoke_request(controller, action) }
        end
    end
  end

  def smoke_request(controller, action)
    route = ControllerSmokeHelper.route_for(controller, action)
    params = ControllerSmokeHelper.params_for(route, self)
    path =
      url_for(controller: controller, action: action, **params, only_path: true)
    method = ControllerSmokeHelper.http_method(route)
    request_params =
      ControllerSmokeHelper.request_params_for(controller, action, params, self)

    case method
    when :get
      get(path, params: request_params)
    when :post
      post(path, params: request_params)
    when :patch
      patch(path, params: request_params)
    when :put
      put(path, params: request_params)
    when :delete
      delete(path, params: request_params)
    when :head
      head(path, params: request_params)
    else
      raise("Unsupported HTTP method #{method}")
    end

    ControllerSmokeHelper.assert_response_ok(self, controller, action)
  end

  def self.actions_for(controller)
    seen = {}
    routes_for_controller(controller).filter_map do |route|
      action = route.defaults[:action]
      next if action.blank?
      next if seen[action]

      seen[action] = true
      action
    end
  end

  def self.routes_for_controller(controller)
    Rails.application.routes.routes.select do |route|
      route.defaults[:controller] == controller && allowed_route?(route)
    end
  end

  def self.allowed_route?(route)
    controller = route.defaults[:controller]
    return false if controller.blank?
    return false if controller.start_with?("rails/")
    return false if controller.start_with?("active_storage/")
    return false if controller.start_with?("action_text/")

    true
  end

  def self.route_for(controller, action)
    routes_for_controller(controller).find do |route|
      route.defaults[:action] == action
    end
  end

  def self.http_method(route)
    verb_source =
      route.verb.respond_to?(:source) ? route.verb.source : route.verb.to_s
    verb = verb_source.delete("^$")
    verb = verb.split("|").first
    verb.present? ? verb.downcase.to_sym : :get
  end

  def self.params_for(route, test_case)
    params = {}

    route.required_parts.each do |part|
      params[part] = required_value(part, route, test_case)
    end

    params[:locale] ||= I18n.locale.to_s if route.path.spec.to_s.include?(
      ":locale"
    )

    params
  end

  def self.required_value(part, route, test_case)
    controller = route.defaults[:controller]

    case part
    when :locale
      I18n.locale.to_s
    when :id
      id_for_controller(controller, test_case)
    when :user_id
      test_case.users(:admin).id
    when :guest_id
      test_case.guests(:guest).id
    when :address_id
      test_case.addresses(:address).id
    when :configuration_id
      test_case.configurations(:configuration).name
    when :country_code_ip_address_id
      test_case.country_code_ip_addresses(:country_code_ip_address).id
    when :datum_id
      test_case.data(:datum).id
    when :device_id
      test_case.devices(:device).id
    when :email_address_id
      test_case.email_addresses(:admin_email).id
    when :error_id
      test_case.errors(:error).id
    when :error_occurrence_id
      test_case.error_occurrences(:error_occurrence).id
    when :example_id
      test_case.examples(:example).id
    when :example_schedule_id
      test_case.example_schedules(:example_schedule).id
    when :form_program_id
      test_case.form_programs(:form_program).id
    when :form_schedule_id
      test_case.form_schedules(:form_schedule).id
    when :form_delivery_id
      test_case.form_deliveries(:form_delivery).id
    when :submission_id
      test_case.submissions(:submission).id
    when :submission_section_id
      test_case.submission_sections(:submission_section).id
    when :submission_program_id
      test_case.submission_programs(:submission_program).id
    when :submission_schedule_id
      test_case.submission_schedules(:submission_schedule).id
    when :submission_delivery_id
      test_case.submission_deliveries(:submission_delivery).id
    when :handle_id
      test_case.handles(:handle).id
    when :job_id
      test_case.jobs(:job).id
    when :job_context_id
      test_case.job_contexts(:job_context).id
    when :job_blocked_execution_id
      test_case.job_blocked_executions(:job_blocked_execution).id
    when :job_claimed_execution_id
      test_case.job_claimed_executions(:job_claimed_execution).id
    when :job_failed_execution_id
      test_case.job_failed_executions(:job_failed_execution).id
    when :job_ready_execution_id
      test_case.job_ready_executions(:job_ready_execution).id
    when :job_recurring_execution_id
      test_case.job_recurring_executions(:job_recurring_execution).id
    when :job_scheduled_execution_id
      test_case.job_scheduled_executions(:job_scheduled_execution).id
    when :job_process_id
      test_case.job_processes(:job_process).id
    when :job_recurring_task_id
      test_case.job_recurring_tasks(:job_recurring_task).id
    when :job_pause_id
      test_case.job_pauses(:job_pause).id
    when :job_semaphore_id
      test_case.job_semaphores(:job_semaphore).id
    when :log_id
      test_case.logs(:log).id
    when :message_id
      test_case.messages(:message).id
    when :name_id
      test_case.names(:name).id
    when :password_id
      test_case.passwords(:password).id
    when :phone_number_id
      test_case.phone_numbers(:phone_number).id
    when :program_id
      test_case.programs(:program).id
    when :program_schedule_id
      test_case.program_schedules(:program_schedule).id
    when :program_execution_id
      test_case.program_executions(:program_execution).id
    when :time_zone_id
      test_case.time_zones(:time_zone).id
    when :token_id
      test_case.tokens(:token).id
    when :session_id
      test_case.sessions(:session).session_id
    when :version_id
      test_case.versions(:version).id
    when :path
      "missing"
    else
      raise("No mapping for required param #{part}")
    end
  end

  def self.id_for_controller(controller, test_case)
    case controller
    when "addresses"
      test_case.addresses(:address).id
    when "configurations"
      test_case.configurations(:configuration).name
    when "country_code_ip_addresses"
      test_case.country_code_ip_addresses(:country_code_ip_address).id
    when "data"
      test_case.data(:datum).id
    when "devices"
      test_case.devices(:device).id
    when "email_addresses"
      test_case.email_addresses(:admin_email).id
    when "errors"
      test_case.errors(:error).id
    when "error_occurrences"
      test_case.error_occurrences(:error_occurrence).id
    when "examples"
      test_case.examples(:example).id
    when "example_schedules"
      test_case.example_schedules(:example_schedule).id
    when "form_deliveries"
      test_case.form_deliveries(:form_delivery).id
    when "form_programs"
      test_case.form_programs(:form_program).id
    when "form_schedules"
      test_case.form_schedules(:form_schedule).id
    when "submission_deliveries"
      test_case.submission_deliveries(:submission_delivery).id
    when "submission_programs"
      test_case.submission_programs(:submission_program).id
    when "submission_schedules"
      test_case.submission_schedules(:submission_schedule).id
    when "submission_sections"
      test_case.submission_sections(:submission_section).id
    when "submissions"
      test_case.submissions(:submission).id
    when "guests"
      test_case.guests(:guest).id
    when "handles"
      test_case.handles(:handle).id
    when "job_blocked_executions"
      test_case.job_blocked_executions(:job_blocked_execution).id
    when "job_claimed_executions"
      test_case.job_claimed_executions(:job_claimed_execution).id
    when "job_failed_executions"
      test_case.job_failed_executions(:job_failed_execution).id
    when "job_ready_executions"
      test_case.job_ready_executions(:job_ready_execution).id
    when "job_recurring_executions"
      test_case.job_recurring_executions(:job_recurring_execution).id
    when "job_scheduled_executions"
      test_case.job_scheduled_executions(:job_scheduled_execution).id
    when "job_contexts"
      test_case.job_contexts(:job_context).id
    when "job_recurring_tasks"
      test_case.job_recurring_tasks(:job_recurring_task).id
    when "job_processes"
      test_case.job_processes(:job_process).id
    when "job_pauses"
      test_case.job_pauses(:job_pause).id
    when "job_semaphores"
      test_case.job_semaphores(:job_semaphore).id
    when "jobs"
      test_case.jobs(:job).id
    when "logs"
      test_case.logs(:log).id
    when "messages"
      test_case.messages(:message).id
    when "names"
      test_case.names(:name).id
    when "passwords"
      test_case.passwords(:password).id
    when "phone_numbers"
      test_case.phone_numbers(:phone_number).id
    when "programs"
      test_case.programs(:program).id
    when "program_executions"
      test_case.program_executions(:program_execution).id
    when "program_schedules"
      test_case.program_schedules(:program_schedule).id
    when "sessions"
      test_case.sessions(:session).id
    when "tokens"
      test_case.tokens(:token).id
    when "users"
      test_case.users(:admin).id
    when "time_zones"
      test_case.time_zones(:time_zone).id
    when "versions"
      test_case.versions(:version).id
    else
      raise("No mapping for controller #{controller}")
    end
  end

  def self.request_params_for(controller, action, params, test_case)
    case "#{controller}##{action}"
    when "session#create"
      {
        session: {
          email_address: test_case.email_addresses(:admin_email).email_address,
          password: test_case.passwords(:password).hint
        }
      }
    when "sessions#create"
      {
        session: {
          session_id: "session-smoke-#{SecureRandom.hex(4)}",
          data: { user_id: test_case.users(:admin).id }.to_json
        }
      }
    when "passwords#check"
      { password: test_case.passwords(:password).hint }
    else
      params
    end
  end

  def self.assert_response_ok(test_case, controller, action)
    allowed = [200, 302, 303, 304, 404, 422]

    if controller == "errors"
      case action.to_s
      when "not_found"
        allowed << 404
      when "unprocessable_entity"
        allowed << 422
      when "internal_server_error"
        allowed << 500
      end
    end

    test_case.assert_includes(allowed, test_case.response.status)
  end
end
