# frozen_string_literal: true

class UsersController < ApplicationController
  before_action { add_breadcrumb(key: "users.index", path: index_url) }
  before_action(
    :load_user,
    only: %i[show edit update destroy delete impersonate]
  )
  skip_after_action(:verify_policy_scoped, only: :update_time_zone)
  skip_before_action(:verify_captcha, only: :update_time_zone)

  def index
    authorize(User)

    @users = scope.page(params[:page]).order(created_at: :asc)

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @users }) }
    end
  end

  def impersonate
    session[:previous_user_ids] ||= []
    session[:previous_user_ids] << current_user.id
    session[:user_id] = @user.id

    respond_to do |format|
      format.html { redirect_to(show_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @user })
      end
    end
  end

  def update_time_zone
    authorize(User)

    if params[:time_zone].blank?
      return(
        respond_to do |format|
          format.html { head(:bad_request) }
          format.json do
            render(
              json: {
                status: :bad_request,
                messages: ["time_zone is required"],
                data: nil
              },
              status: :bad_request
            )
          end
        end
      )
    end
    unless params.expect(:time_zone).in?(TimeZone::TIME_ZONES)
      return(
        respond_to do |format|
          format.html { head(:bad_request) }
          format.json do
            render(
              json: {
                status: :bad_request,
                messages: ["time_zone is invalid"],
                data: nil
              },
              status: :bad_request
            )
          end
        end
      )
    end

    if current_user?
      if current_user.unverified_time_zone.present?
        return(
          respond_to do |format|
            format.html { head(:bad_request) }
            format.json do
              render(
                json: {
                  status: :bad_request,
                  messages: ["time_zone is already set"],
                  data: nil
                },
                status: :bad_request
              )
            end
          end
        )
      end

      current_user.time_zones.create!(time_zone: params[:time_zone])
    else
      if session[:time_zone].present?
        return(
          respond_to do |format|
            format.html { head(:bad_request) }
            format.json do
              render(
                json: {
                  status: :bad_request,
                  messages: ["time_zone is already set"],
                  data: nil
                },
                status: :bad_request
              )
            end
          end
        )
      end

      session[:time_zone] = params[:time_zone]
    end

    respond_to do |format|
      format.html { head(:ok) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: {
              time_zone: params[:time_zone]
            }
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
      format.json { render(json: { status: :ok, messages: [], data: @user }) }
    end
  end

  def new
    @user = authorize(scope.new)
    @user.email_addresses.build(primary: true)
    @user.phone_numbers.build(primary: true)
    @user.passwords.build(primary: true)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @user }) }
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @user }) }
    end
  end

  def create
    @user = authorize(scope.new(user_params.merge(id: nil)))

    saved = Current.with(user: @user) { @user.save(context: :controller) }

    if saved
      log_in(@user)
      respond_after_persist(
        t(".notice"),
        redirect_url: requested_redirect_path || show_url
      )
    else
      respond_after_invalid(:new)
    end
  end

  def update
    @user.assign_attributes(user_params)
    persist(:edit, t(".notice")) do
      log_in(@user)
    end
  end

  def destroy
    @user.destroy!

    log_out(@user)
    respond_after_delete(t(".notice"), redirect_url: root_path)
  end

  def delete
    @user.delete

    log_out(@user)
    respond_after_delete(t(".notice"), redirect_url: root_path)
  end

  def destroy_all
    authorize(User)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(User)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_user
    @user =
      if params[:id] == "me" || params[:user_id] == "me"
        authorize(scope.find(current_user&.id))
      else
        authorize(
          scope.find(params.fetch(:user_id, nil).presence || params[:id])
        )
      end

    set_context(user: @user)
    add_breadcrumb(text: @user, path: show_url)
  end

  def scope
    searched_policy_scope(User)
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_user(@user) if @user
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    User
  end

  def model_instance
    @user
  end

  def nested
    []
  end

  def filters
    []
  end

  def user_params
    return {} if params[:user].blank?

    if admin?
      params.expect(
        user: [
          :admin,
          :verified,
          :interface,
          :locale,
          {
            email_addresses_attributes: [
              %i[id _destroy email_address primary verified]
            ]
          },
          {
            phone_numbers_attributes: [
              %i[id _destroy phone_number primary verified]
            ]
          },
          {
            passwords_attributes: [
              %i[id _destroy password hint primary verified]
            ]
          }
        ]
      )
    else
      params.expect(
        user: [
          :interface,
          :locale,
          {
            email_addresses_attributes: [%i[id _destroy email_address primary]]
          },
          { phone_numbers_attributes: [%i[id _destroy phone_number primary]] },
          { passwords_attributes: [%i[id _destroy password hint primary]] }
        ]
      )
    end
  end

  def requested_redirect_path
    path = params[:redirect_to].to_s
    return if path.start_with?("//")
    return unless path.start_with?("/")

    path
  end
end
