# frozen_string_literal: true

class GuestsController < ApplicationController
  before_action { add_breadcrumb(key: "guests.index", path: index_url) }
  before_action(:load_guest, only: %i[show edit update destroy delete])

  def index
      authorize(Guest)

      @guests = scope.page(params[:page]).order(created_at: :asc)

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @guests
            }
          )
        end
      end
  end

  def show
      @versions = versions_scope.order(created_at: :desc).page(params[:page])
      @logs = logs_scope.order(created_at: :desc).page(params[:page])

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @guest
            }
          )
        end
      end
  end

  def new
      @guest = authorize(scope.new)

      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @guest
            }
          )
        end
      end
  end

  def edit
      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @guest
            }
          )
        end
      end
  end

  def create
      @guest = authorize(scope.new(guest_params.merge(id: nil)))

      Current.with(guest: @guest) do
        if @guest.save(context: :controller)
          log_in_guest(@guest)
          respond_to do |format|
            format.html { redirect_to(show_url, notice: t(".notice")) }
            format.json do
              render(
                json: {
                  status: :ok,
                  messages: [t(".notice")],
                  data: @guest
                }
              )
            end
          end
        else
          flash.now.alert = @guest.alert
          respond_to do |format|
            format.html { render(:new, status: :unprocessable_content) }
            format.json do
              render(
                json: {
                  status: :unprocessable_content,
                  messages: [@guest.alert],
                  data: @guest
                },
                status: :unprocessable_content
              )
            end
          end
        end
      end
  end

  def update
      @guest.assign_attributes(guest_params)

      if @guest.save(context: :controller)
        log_in_guest(@guest)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @guest
              }
            )
          end
        end
      else
        flash.now.alert = @guest.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@guest.alert],
                data: @guest
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @guest.destroy!

      log_out(@guest)

      respond_to do |format|
        format.html { redirect_to(root_path, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @guest

            }
          )
        end
      end
  end

  def delete
      @guest.delete

      log_out(@guest)

      respond_to do |format|
        format.html { redirect_to(root_path, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @guest

            }
          )
        end
      end
  end

  def destroy_all
      authorize(Guest)

      scope.destroy_all

      respond_to do |format|
        format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: nil

            }
          )
        end
      end
  end

  def delete_all
      authorize(Guest)

      scope.delete_all

      respond_to do |format|
        format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: nil

            }
          )
        end
      end
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
