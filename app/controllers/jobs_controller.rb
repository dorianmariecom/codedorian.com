# frozen_string_literal: true

class JobsController < ApplicationController
  before_action :load_user
  before_action :load_job, only: %i[show destroy]
  helper_method :url

  def index
    authorize Job

    @jobs = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def destroy
    @job.destroy!

    redirect_to(url, notice: t(".notice"))
  end

  def destroy_all
    authorize Job

    scope.destroy_all

    redirect_back_or_to(url, notice: t(".notice"))
  end

  def not_found
    @exception = request.env["action_dispatch.exception"]

    respond_to do |format|
      format.json { render(json: { message: :not_found }, status: :not_found) }
      format.html { render status: :not_found }
      format.all { redirect_to root_path, alert: t(".title") }
    end
  end

  def internal_server_job
    @exception = request.env["action_dispatch.exception"]

    respond_to do |format|
      format.json do
        render(
          json: {
            message: :internal_server_job
          },
          status: :internal_server_job
        )
      end
      format.html { render status: :internal_server_job }
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

  private

  def load_user
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def load_job
    @job = authorize scope.find(params[:job_id].presence || params[:id])
  end

  def scope
    policy_scope(Job)
  end

  def url
    [@user, :jobs].compact
  end
end
