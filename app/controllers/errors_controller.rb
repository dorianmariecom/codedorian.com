# frozen_string_literal: true

class ErrorsController < ApplicationController
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def not_found
    @exception = request.env["action_dispatch.exception"]

    respond_to do |format|
      format.json { render(json: { message: :not_found }, status: :not_found) }
      format.html { render status: :not_found }
      format.all { redirect_to root_path, alert: t(".title") }
    end
  end

  def internal_server_error
    @exception = request.env["action_dispatch.exception"]

    respond_to do |format|
      format.json do
        render(
          json: {
            message: :internal_server_error
          },
          status: :internal_server_error
        )
      end
      format.html { render status: :internal_server_error }
      format.all { redirect_to root_path, alert: t(".title") }
    end
  end

  def unprocessable_entity
    @exception = request.env["action_dispatch.exception"]

    respond_to do |format|
      format.json do
        render(
          json: {
            message: :unprocessable_entity
          },
          status: :unprocessable_entity
        )
      end
      format.html { render status: :unprocessable_entity }
      format.all { redirect_to root_path, alert: t(".title") }
    end
  end
end
