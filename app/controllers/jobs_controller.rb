# frozen_string_literal: true

class JobsController < ApplicationController
  before_action(:load_user)
  before_action(:load_job, only: %i[show destroy delete discard retry])
  helper_method(:url)
  helper_method(:discard_all_url)
  helper_method(:retry_all_url)
  helper_method(:delete_all_url)
  helper_method(:destroy_all_url)

  def index
    authorize(Job)

    @jobs = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def retry
    @job.retry!

    redirect_to(url, notice: t(".notice"))
  end

  def discard
    @job.discard!

    redirect_to(url, notice: t(".notice"))
  end

  def delete
    @job.delete!

    redirect_to(url, notice: t(".notice"))
  end

  def destroy
    @job.destroy!

    redirect_to(url, notice: t(".notice"))
  end

  def retry_all
    authorize(Job)

    scope.retry_all

    redirect_back_or_to(url, notice: t(".notice"))
  end

  def discard_all
    authorize(Job)

    scope.discard_all

    redirect_back_or_to(url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Job)

    scope.destroy_all

    redirect_back_or_to(url, notice: t(".notice"))
  end

  def delete_all
    authorize(Job)

    scope.delete_all

    redirect_back_or_to(url, notice: t(".notice"))
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
    @job = authorize(scope.find(params[:job_id].presence || params[:id]))
  end

  def scope
    searched_policy_scope(Job)
  end

  def delete_all_url
    [:delete_all, @user, :jobs, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, :jobs, { search: { q: q } }].compact
  end

  def url
    [@user, :jobs].compact
  end

  def retry_all_url
    [:retry_all, @user, :jobs].compact
  end

  def discard_all_url
    [:discard_all, @user, :jobs].compact
  end
end
