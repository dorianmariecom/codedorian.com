# frozen_string_literal: true

class MessagesController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "messages.index", path: index_url) }
  before_action(
    :load_message,
    only: %i[show subject body content edit update destroy]
  )

  def index
      authorize(Message)

      @messages = scope.page(params[:page]).order(created_at: :desc)

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @messages
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
              data: @message
            }
          )
        end
      end
  end

  def subject
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @message.subject })
      end
    end
  end

  def body
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @message.body })
      end
    end
  end

  def content
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @message.content })
      end
    end
  end

  def new
      @message = authorize(scope.new(from_user: @user, to_user: @user))
      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @message
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
              data: @message
            }
          )
        end
      end
  end

  def create
      @message = authorize(scope.new(message_params))

      if @message.save(context: :controller)
        log_in(@message.from_user)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @message
              }
            )
          end
        end
      else
        flash.now.alert = @message.alert
        respond_to do |format|
          format.html { render(:new, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@message.alert],
                data: @message
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def update
      @message.assign_attributes(message_params)

      if @message.save(context: :controller)
        log_in(@message.from_user)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @message
              }
            )
          end
        end
      else
        flash.now.alert = @message.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@message.alert],
                data: @message
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @message.destroy!

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @message

            }
          )
        end
      end
  end

  def delete
      @message.delete

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @message

            }
          )
        end
      end
  end

  def destroy_all
      authorize(Message)

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
      authorize(Message)

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
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params.expect(:guest_id))
      end

    set_context(guest: @guest)
    add_breadcrumb(key: "guests.index", path: :guests)
    add_breadcrumb(text: @guest, path: @guest)
  end

  def load_user
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params.expect(:user_id))
      end

    set_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def scope
    scope = searched_policy_scope(Message)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_message(@message) if @message
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_message(@message) if @message
    scope
  end

  def model_class
    Message
  end

  def model_instance
    @message
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:message_id].presence || params[:id]
  end

  def load_message
    @message = authorize(scope.find(id))
    set_context(message: @message)
    add_breadcrumb(text: @message, path: show_url)
  end

  def message_params
    if admin?
      params.expect(message: %i[from_user_id to_user_id subject body])
    else
      params.expect(message: %i[subject body])
    end
  end
end
