# frozen_string_literal: true

class GuestsController < ApplicationController
  before_action { add_breadcrumb(key: "guests.index", path: index_url) }
  before_action(:load_guest, only: %i[show edit update destroy delete])

  def index
    authorize(Guest)

    @guests = scope.page(params[:page]).order(created_at: :asc)

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @guests }) }
    end
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @guest }) }
    end
  end

  def new
    @guest = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @guest }) }
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @guest }) }
    end
  end

  def create
    @guest = authorize(scope.new(guest_params.merge(id: nil)))

    Current.with(guest: @guest) do
      persist(:new, t(".notice")) do
        log_in_guest(@guest)
      end
    end
  end

  def update
    @guest.assign_attributes(guest_params)
    persist(:edit, t(".notice")) do
      log_in_guest(@guest)
    end
  end

  def destroy
    @guest.destroy!

    log_out(@guest)
    respond_after_delete(t(".notice"), redirect_url: root_path)
  end

  def delete
    @guest.delete

    log_out(@guest)
    respond_after_delete(t(".notice"), redirect_url: root_path)
  end

  def destroy_all
    authorize(Guest)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Guest)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_guest
    @guest =
      if params[:id] == "me" || params[:guest_id] == "me"
        authorize(scope.find(current_guest&.id))
      else
        authorize(
          scope.find(params.fetch(:guest_id, nil).presence || params[:id])
        )
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
