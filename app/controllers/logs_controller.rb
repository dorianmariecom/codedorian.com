# frozen_string_literal: true

class LogsController < ApplicationController
  before_action { add_breadcrumb(key: "logs.index", path: index_url) }
  before_action(:load_log, only: %i[show edit update destroy delete])

  def index
    authorize(Log)

    @logs = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @log = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @log = authorize(scope.new(log_params))

    if @log.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @log.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @log.assign_attributes(log_params)

    if @log.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @log.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @log.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @log.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(Log)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Log)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_log
    @log = authorize(scope.find(id))

    set_context(log: @log)
    add_breadcrumb(text: @log, path: show_url)
  end

  def id
    params[:log_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(Log)
  end

  def model_class
    Log
  end

  def model_instance
    @log
  end

  def nested
    []
  end

  def filters
    []
  end

  def log_params
    admin? ? params.expect(log: %i[message context]) : {}
  end
end
