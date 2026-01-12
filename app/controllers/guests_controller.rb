# frozen_string_literal: true

class GuestsController < ApplicationController
  before_action { add_breadcrumb(key: "guests.index", path: index_url) }
  before_action(:load_guest, only: %i[show edit update destroy delete])

  def index
    authorize(Guest)

    @guests = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @guest = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @guest = authorize(scope.new(guest_params.merge(id: nil)))

    Current.with(guest: @guest) do
      if @guest.save(context: :controller)
        log_in_guest(@guest)
        redirect_to(show_url, notice: t(".notice"))
      else
        flash.now.alert = @guest.alert
        render(:new, status: :unprocessable_content)
      end
    end
  end

  def update
    @guest.assign_attributes(guest_params)

    if @guest.save(context: :controller)
      log_in_guest(@guest)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @guest.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @guest.destroy!

    log_out(@guest)

    redirect_to(root_path, notice: t(".notice"))
  end

  def delete
    @guest.delete

    log_out(@guest)

    redirect_to(
      root_path,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(Guest)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Guest)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_guest
    @guest =
      if params[:id] == "me" || params[:guest_id] == "me"
        authorize(scope.find(current_guest&.id))
      else
        authorize(scope.find(params[:guest_id].presence || params[:id]))
      end

    set_context(guest: @guest)
    add_breadcrumb(text: @guest, path: show_url)
  end

  def scope
    searched_policy_scope(Guest)
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_guest(@guest) if @guest
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_guest(@guest) if @guest
    scope
  end

  def model_class
    Guest
  end

  def model_instance
    @guest
  end

  def nested
    []
  end

  def filters
    []
  end

  def guest_params
    {}
  end
end
