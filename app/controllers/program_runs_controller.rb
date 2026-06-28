# frozen_string_literal: true

class ProgramRunsController < ApplicationController
  before_action(:authorize_program_run)

  def show
    render(json: program_run_json(program))
  end

  def create
    @program =
      policy_scope(Program).new(
        input: params.expect(:input),
        name: t(".name")
      )

    unless @program.save
      render(json: { message: @program.alert }, status: :unprocessable_content)
      return
    end

    log_in(@program.user)

    perform_later(
      ProgramEvaluateJob,
      arguments: {
        program: @program
      },
      context: {
        current_user: current_user,
        user: @program.user,
        program: @program
      },
      current: {
        user: @program.user,
        program: @program,
        locale: I18n.locale,
        time_zone: current_time_zone
      }
    )

    render(json: program_run_json(@program), status: :created)
  end

  private

  def authorize_program_run
    authorize(:program_run)
  end

  def program
    @program ||= policy_scope(Program).find(params.expect(:id))
  end

  def program_run_json(program)
    program_execution = program.program_execution
    status = program_execution&.status || "created"

    {
      status: status,
      status_label: I18n.t("program_executions.model.statuses.#{status}"),
      finished: program_execution&.not_generating? || false,
      output: program_execution&.output,
      result: program_execution&.result,
      error: program_execution&.error,
      error_class: program_execution&.error_class,
      error_message: program_execution&.error_message,
      status_url: program_run_url(id: program, format: :json)
    }
  end
end
