# frozen_string_literal: true

class Code
  class Object
    class Current < Dictionary
      INSTANCE_FUNCTIONS = {
        "user" => {
          name: "user",
          description:
            "returns the current signed-in user as a Code user object, or nothing.",
          examples: %w[
            Current.user
            Current.user.id
            Current.user.programs.first.id
          ]
        },
        "user!" => {
          name: "user!",
          description:
            "returns the current user and raises when not signed in.",
          examples: %w[Current.user! Current.user!.id]
        },
        "programs" => {
          name: "programs",
          description: "returns programs for the current user.",
          examples: %w[Current.programs Current.programs.size]
        },
        "program" => {
          name: "program",
          description: "returns the program currently being evaluated.",
          examples: %w[Current.program Current.program.user]
        },
        "program_execution" => {
          name: "program_execution",
          description: "returns the program execution currently running.",
          examples: %w[
            Current.program_execution
            Current.program_execution.program
          ]
        },
        "program_schedule" => {
          name: "program_schedule",
          description: "returns the current program schedule.",
          examples: %w[
            Current.program_schedule
            Current.program_schedule.program
          ]
        },
        "subscription" => {
          name: "subscription",
          description: "returns the subscription currently being evaluated.",
          examples: %w[Current.subscription Current.subscription.user]
        },
        "subscription_execution" => {
          name: "subscription_execution",
          description: "returns the current subscription execution.",
          examples: %w[
            Current.subscription_execution
            Current.subscription_execution.steps
          ]
        },
        "service" => {
          name: "service",
          description: "returns the service currently being evaluated.",
          examples: %w[
            Current.service
            Current.service.steps
            Current.service.plans
          ]
        },
        "step" => {
          name: "step",
          description: "returns the step currently being evaluated.",
          examples: %w[Current.step Current.step.service Current.step.user]
        },
        "step_execution" => {
          name: "step_execution",
          description: "returns the step execution currently running.",
          examples: %w[Current.step_execution Current.step_execution.step]
        },
        "plan" => {
          name: "plan",
          description: "returns the plan for the current subscription.",
          examples: %w[Current.plan Current.plan.steps]
        },
        "plan_schedule" => {
          name: "plan_schedule",
          description: "returns the current plan schedule.",
          examples: %w[Current.plan_schedule Current.plan_schedule.plan]
        },
        "locale" => {
          name: "locale",
          description: "returns the current locale.",
          examples: ["Current.locale", "Current.locale == :fr"]
        },
        "locale=" => {
          name: "locale=",
          description: "sets the current locale for the current context.",
          examples: ['Current.locale = "fr"', "Current.locale = :en"]
        },
        "time_zone" => {
          name: "time_zone",
          description: "returns the current time zone.",
          examples: %w[Current.time_zone Current.time_zone.offset]
        },
        "time_zone=" => {
          name: "time_zone=",
          description: "sets the current time zone for the current context.",
          examples: [
            'Current.time_zone = "UTC"',
            'Current.time_zone = "Europe/Paris"'
          ]
        }
      }.freeze

      CLASS_DOCUMENTATION = {
        name: "Current",
        description: "reads and updates execution context values in code.",
        examples: ["Current.user", 'Current.locale = "fr"', "Current.time_zone"]
      }.freeze

      def self.function_documentation(scope)
        return INSTANCE_FUNCTIONS if scope == :instance
        return {} if scope == :class

        {}
      end

      def self.call(**args)
        code_operator = args.fetch(:operator, nil).to_code
        code_arguments = args.fetch(:arguments, []).to_code
        code_value = code_arguments.code_first

        case code_operator.to_s
        when "user"
          sig(args)
          code_user
        when "user!"
          sig(args)
          code_user!
        when "programs"
          sig(args)
          code_programs
        when "program"
          sig(args)
          code_program
        when "program_execution"
          sig(args)
          code_program_execution
        when "program_schedule"
          sig(args)
          code_program_schedule
        when "subscription"
          sig(args)
          code_subscription
        when "subscription_execution"
          sig(args)
          code_subscription_execution
        when "service"
          sig(args)
          code_service
        when "step"
          sig(args)
          code_step
        when "step_execution"
          sig(args)
          code_step_execution
        when "plan"
          sig(args)
          code_plan
        when "plan_schedule"
          sig(args)
          code_plan_schedule
        when "locale"
          sig(args)
          code_locale
        when "locale="
          sig(args) { String }
          code_set_locale(code_value)
        when "time_zone"
          sig(args)
          code_time_zone
        when "time_zone="
          sig(args) { String }
          code_set_time_zone(code_value)
        else
          super
        end
      end

      def self.code_user
        return Nothing.new if ::Current.user.nil?

        policy_scope(::User).find(::Current.user.id).to_code
      end

      def self.code_user!
        policy_scope(::User).find(::Current.user!.id).to_code
      end

      def self.code_programs
        policy_scope(::Program).where(user: ::Current.user).to_code
      end

      def self.code_locale
        ::Current.locale.to_code
      end

      def self.code_program
        return Nothing.new if ::Current.program.nil?

        policy_scope(::Program).find(::Current.program.id).to_code
      end

      def self.code_program_execution
        return Nothing.new if ::Current.program_execution.nil?

        policy_scope(::ProgramExecution)
          .find(::Current.program_execution.id)
          .to_code
      end

      def self.code_program_schedule
        return Nothing.new if ::Current.program_schedule.nil?

        policy_scope(::ProgramSchedule).find(::Current.program_schedule.id).to_code
      end

      def self.code_subscription
        return Nothing.new if ::Current.subscription.nil?

        policy_scope(::Subscription).find(::Current.subscription.id).to_code
      end

      def self.code_subscription_execution
        return Nothing.new if ::Current.subscription_execution.nil?

        policy_scope(::SubscriptionExecution)
          .find(::Current.subscription_execution.id)
          .to_code
      end

      def self.code_service
        return Nothing.new if ::Current.service.nil?

        policy_scope(::Service).find(::Current.service.id).to_code
      end

      def self.code_step
        return Nothing.new if ::Current.step.nil?

        policy_scope(::Step).find(::Current.step.id).to_code
      end

      def self.code_step_execution
        return Nothing.new if ::Current.step_execution.nil?

        policy_scope(::StepExecution).find(::Current.step_execution.id).to_code
      end

      def self.code_plan
        return Nothing.new if ::Current.plan.nil?

        policy_scope(::Plan).find(::Current.plan.id).to_code
      end

      def self.code_plan_schedule
        return Nothing.new if ::Current.plan_schedule.nil?

        policy_scope(::PlanSchedule).find(::Current.plan_schedule.id).to_code
      end

      def self.code_set_locale(value)
        code_value = value.to_code

        ::Current.locale = code_value.raw
        code_value
      end

      def self.code_time_zone
        ::Current.time_zone.to_code
      end

      def self.code_set_time_zone(value)
        code_value = value.to_code

        ::Current.time_zone = code_value.raw
        code_value
      end

      include(::Pundit::Authorization)
      extend(::Pundit::Authorization)

      def self.current_user
        ::Current.user
      end

      def current_user
        ::Current.user
      end
    end
  end
end
