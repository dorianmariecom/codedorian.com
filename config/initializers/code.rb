# frozen_string_literal: true

class Code
  class Object
    class Global < Object
      alias original_call call

      def call(**args)
        code_operator = args.fetch(:operator, nil).to_code
        code_arguments = args.fetch(:arguments, []).to_code
        code_value = code_arguments.code_first

        case code_operator.to_s
        when "Message"
          sig(args) { Object.repeat }
          code_message(*code_arguments.raw)
        when "Current"
          sig(args) { Object.repeat }
          code_current(*code_arguments.raw)
        when "User"
          sig(args) { Object.repeat }
          code_user(*code_arguments.raw)
        when "Notification"
          sig(args) { Object.repeat }
          code_notification(*code_arguments.raw)
        when "Datum"
          sig(args) { Object.repeat }
          code_datum(*code_arguments.raw)
        when "Program"
          sig(args) { Object.repeat }
          code_program(*code_arguments.raw)
        when "ProgramSchedule"
          sig(args) { Object.repeat }
          code_program_schedule(*code_arguments.raw)
        when "Address"
          sig(args)
          code_address
        when "Configuration"
          sig(args)
          code_configuration
        when "Country"
          sig(args)
          code_country
        when "CountryCodeIpAddress"
          sig(args)
          code_country_code_ip_address
        when "Delivery"
          sig(args)
          code_delivery
        when "DeliveryChannel"
          sig(args)
          code_delivery_channel
        when "DeliveryConnection"
          sig(args)
          code_delivery_connection
        when "DeliveryDestination"
          sig(args)
          code_delivery_destination
        when "Device"
          sig(args)
          code_device
        when "EmailAddress"
          sig(args)
          code_email_address
        when "Error"
          sig(args)
          code_error
        when "ErrorOccurrence"
          sig(args)
          code_error_occurrence
        when "Guest"
          sig(args)
          code_guest
        when "Handle"
          sig(args)
          code_handle
        when "Job"
          sig(args)
          code_job
        when "JobBlockedExecution"
          sig(args)
          code_job_blocked_execution
        when "JobClaimedExecution"
          sig(args)
          code_job_claimed_execution
        when "JobContext"
          sig(args)
          code_job_context
        when "JobFailedExecution"
          sig(args)
          code_job_failed_execution
        when "JobBatch"
          sig(args)
          code_job_batch
        when "JobBatchExecution"
          sig(args)
          code_job_batch_execution
        when "JobPause"
          sig(args)
          code_job_pause
        when "JobProcess"
          sig(args)
          code_job_process
        when "JobReadyExecution"
          sig(args)
          code_job_ready_execution
        when "JobRecurringExecution"
          sig(args)
          code_job_recurring_execution
        when "JobRecurringTask"
          sig(args)
          code_job_recurring_task
        when "JobScheduledExecution"
          sig(args)
          code_job_scheduled_execution
        when "JobSemaphore"
          sig(args)
          code_job_semaphore
        when "Link"
          sig(args)
          code_link
        when "Log"
          sig(args)
          code_log
        when "Name"
          sig(args)
          code_name
        when "Page"
          sig(args)
          code_page
        when "Password"
          sig(args)
          code_password
        when "PhoneNumber"
          sig(args)
          code_phone_number
        when "Plan"
          sig(args)
          code_plan
        when "PlanField"
          sig(args)
          code_plan_field
        when "PlanSchedule"
          sig(args)
          code_plan_schedule
        when "ProgramExecution"
          sig(args)
          code_program_execution
        when "Service"
          sig(args)
          code_service
        when "ServiceField"
          sig(args)
          code_service_field
        when "Session"
          sig(args)
          code_session
        when "SolidCableMessage"
          sig(args)
          code_solid_cable_message
        when "SolidCacheEntry"
          sig(args)
          code_solid_cache_entry
        when "Step"
          sig(args)
          code_step
        when "StepExecution"
          sig(args)
          code_step_execution
        when "StripeEvent"
          sig(args)
          code_stripe_event
        when "StripeInvoice"
          sig(args)
          code_stripe_invoice
        when "Subscription"
          sig(args)
          code_subscription
        when "SubscriptionDestination"
          sig(args)
          code_subscription_destination
        when "SubscriptionExecution"
          sig(args)
          code_subscription_execution
        when "SubscriptionValue"
          sig(args)
          code_subscription_value
        when "TimeZone"
          sig(args)
          code_time_zone
        when "Token"
          sig(args)
          code_token
        when "Version"
          sig(args)
          code_version
        else
          original_call(**args)
        end
      end

      def code_message(*arguments)
        code_arguments = arguments.to_code

        if code_arguments.any?
          Message.new(*code_arguments.raw)
        else
          Class.new(Message)
        end
      end

      def code_current(*arguments)
        code_arguments = arguments.to_code

        if code_arguments.any?
          Current.new(*code_arguments.raw)
        else
          Class.new(Current)
        end
      end

      def code_user(*arguments)
        code_arguments = arguments.to_code

        code_arguments.any? ? User.new(*code_arguments.raw) : Class.new(User)
      end

      def code_notification(*arguments)
        code_arguments = arguments.to_code

        if code_arguments.any?
          Notification.new(*code_arguments.raw)
        else
          Class.new(Notification)
        end
      end

      def code_datum(*arguments)
        code_arguments = arguments.to_code

        code_arguments.any? ? Datum.new(*code_arguments.raw) : Class.new(Datum)
      end

      def code_program(*arguments)
        code_arguments = arguments.to_code

        if code_arguments.any?
          Program.new(*code_arguments.raw)
        else
          Class.new(Program)
        end
      end

      def code_program_schedule(*arguments)
        code_arguments = arguments.to_code

        if code_arguments.any?
          ProgramSchedule.new(*code_arguments.raw)
        else
          Class.new(ProgramSchedule)
        end
      end

      def code_address
        Class.new(Address)
      end

      def code_configuration
        Class.new(Configuration)
      end

      def code_country
        Class.new(Country)
      end

      def code_country_code_ip_address
        Class.new(CountryCodeIpAddress)
      end

      def code_delivery
        Class.new(Delivery)
      end

      def code_delivery_channel
        Class.new(DeliveryChannel)
      end

      def code_delivery_connection
        Class.new(DeliveryConnection)
      end

      def code_delivery_destination
        Class.new(DeliveryDestination)
      end

      def code_device
        Class.new(Device)
      end

      def code_email_address
        Class.new(EmailAddress)
      end

      def code_error
        Class.new(ErrorRecord)
      end

      def code_error_occurrence
        Class.new(ErrorOccurrence)
      end

      def code_guest
        Class.new(Guest)
      end

      def code_handle
        Class.new(Handle)
      end

      def code_job
        Class.new(Job)
      end

      def code_job_blocked_execution
        Class.new(JobBlockedExecution)
      end

      def code_job_claimed_execution
        Class.new(JobClaimedExecution)
      end

      def code_job_context
        Class.new(JobContext)
      end

      def code_job_failed_execution
        Class.new(JobFailedExecution)
      end

      def code_job_batch
        Class.new(JobBatch)
      end

      def code_job_batch_execution
        Class.new(JobBatchExecution)
      end

      def code_job_pause
        Class.new(JobPause)
      end

      def code_job_process
        Class.new(JobProcess)
      end

      def code_job_ready_execution
        Class.new(JobReadyExecution)
      end

      def code_job_recurring_execution
        Class.new(JobRecurringExecution)
      end

      def code_job_recurring_task
        Class.new(JobRecurringTask)
      end

      def code_job_scheduled_execution
        Class.new(JobScheduledExecution)
      end

      def code_job_semaphore
        Class.new(JobSemaphore)
      end

      def code_link
        Class.new(Link)
      end

      def code_log
        Class.new(Log)
      end

      def code_name
        Class.new(Name)
      end

      def code_page
        Class.new(Page)
      end

      def code_password
        Class.new(Password)
      end

      def code_phone_number
        Class.new(PhoneNumber)
      end

      def code_plan
        Class.new(Plan)
      end

      def code_plan_field
        Class.new(PlanField)
      end

      def code_plan_schedule
        Class.new(PlanSchedule)
      end

      def code_program_execution
        Class.new(ProgramExecution)
      end

      def code_service
        Class.new(Service)
      end

      def code_service_field
        Class.new(ServiceField)
      end

      def code_session
        Class.new(Session)
      end

      def code_solid_cable_message
        Class.new(SolidCableMessage)
      end

      def code_solid_cache_entry
        Class.new(SolidCacheEntry)
      end

      def code_step
        Class.new(Step)
      end

      def code_step_execution
        Class.new(StepExecution)
      end

      def code_stripe_event
        Class.new(StripeEvent)
      end

      def code_stripe_invoice
        Class.new(StripeInvoice)
      end

      def code_subscription
        Class.new(Subscription)
      end

      def code_subscription_destination
        Class.new(SubscriptionDestination)
      end

      def code_subscription_execution
        Class.new(SubscriptionExecution)
      end

      def code_subscription_value
        Class.new(SubscriptionValue)
      end

      def code_time_zone
        Class.new(TimeZone)
      end

      def code_token
        Class.new(Token)
      end

      def code_version
        Class.new(Version)
      end
    end
  end

  include ::Pundit::Authorization
  extend ::Pundit::Authorization

  def self.current_user
    ::Current.user
  end

  def current_user
    ::Current.user
  end
end

module ActiveRecord
  class Relation
    def to_code
      to_a.to_code
    end
  end

  module Associations
    class CollectionProxy
      def to_code
        to_a.to_code
      end
    end
  end
end
