# frozen_string_literal: true

class PasswordsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "passwords.index", path: index_url) }
  before_action(:load_password, only: %i[show edit update destroy delete])
  skip_before_action(:verify_captcha, only: :check)
  skip_after_action(:verify_policy_scoped, only: :check)

  def index
      authorize(Password)

      @passwords = scope.page(params[:page]).order(created_at: :asc)

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @passwords
            }
          )
        end
      end
  end

  def check
    authorize(Password)

    result = PasswordValidator.check(params[:password])
    respond_to do |format|
      format.html { head(:not_acceptable) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [result.message],
            data: { success: result.success? }
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
              data: @password
            }
          )
        end
      end
  end

  def new
      @password =
        authorize(scope.new(user: @user, primary: user_or_guest.passwords.none?))

      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @password
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
              data: @password
            }
          )
        end
      end
  end

  def create
      @password = authorize(scope.new(password_params))

      if @password.save(context: :controller)
        log_in(@password.user)
        @user = @password.user
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @password
              }
            )
          end
        end
      else
        flash.now.alert = @password.alert
        respond_to do |format|
          format.html { render(:new, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@password.alert],
                data: @password
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def update
      @password.assign_attributes(password_params)

      if @password.save(context: :controller)
        log_in(@password.user)
        @user = @password.user
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @password
              }
            )
          end
        end
      else
        flash.now.alert = @password.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@password.alert],
                data: @password
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @password.destroy!

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @password

            }
          )
        end
      end
  end

  def delete
      @password.delete

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @password

            }
          )
        end
      end
  end

  def destroy_all
      authorize(Password)

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
      authorize(Password)

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

  def user_or_guest
    @user || Guest.new
  end

  def scope
    scope = searched_policy_scope(Password)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_password(@password) if @password
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_password(@password) if @password
    scope
  end

  def model_class
    Password
  end

  def model_instance
    @password
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:password_id].presence || params[:id]
  end

  def load_password
    @password = authorize(scope.find(id))
    set_context(password: @password)
    add_breadcrumb(text: @password, path: show_url)
  end

  def password_params
    if admin?
      params.expect(password: %i[user_id password hint primary verified])
    else
      params.expect(password: %i[password hint primary])
    end
  end
end
