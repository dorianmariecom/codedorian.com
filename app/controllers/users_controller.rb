# frozen_string_literal: true

class UsersController < ApplicationController
  before_action { add_breadcrumb(key: "users.index", path: index_url) }
  before_action(:load_user, only: %i[show edit update destroy impersonate])
  skip_after_action(:verify_policy_scoped, only: :update_time_zone)
  skip_before_action(:verify_captcha, only: :update_time_zone)

  def index
    authorize(User)

    @users = scope.page(params[:page]).order(created_at: :asc).to_a
  end

  def impersonate
    session[:previous_user_ids] ||= []
    session[:previous_user_ids] << current_user.id
    session[:user_id] = @user.id

    redirect_to(show_url)
  end

  def update_time_zone
    authorize(User)

    return head(:bad_request) if params[:time_zone].blank?
    unless params[:time_zone].in?(TimeZone::TIME_ZONES)
      return head(:bad_request)
    end

    if current_user?
      return head(:bad_request) if current_user.unverified_time_zone.present?

      current_user.time_zones.create!(time_zone: params[:time_zone])
    else
      return head(:bad_request) if session[:time_zone].present?

      session[:time_zone] = params[:time_zone]
    end

    head(:ok)
  end

  def show
  end

  def new
    @user = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @user = authorize(scope.new(user_params))

    Current.with(user: @user) do
      if @user.save(context: :controller)
        log_in(@user)
        redirect_to(show_url, notice: t(".notice"))
      else
        flash.now.alert = @user.alert
        render(:new, status: :unprocessable_content)
      end
    end
  end

  def update
    @user.assign_attributes(user_params)

    if @user.save(context: :controller)
      log_in(@user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @user.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @user.destroy!

    log_out(@user)

    redirect_to(root_path, notice: t(".notice"))
  end

  def destroy_all
    authorize(User)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(User)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_user
    @user =
      if params[:id] == "me" || params[:user_id] == "me"
        authorize(scope.find(current_user&.id))
      else
        authorize(scope.find(params[:user_id].presence || params[:id]))
      end

    set_context(user: @user)
    add_breadcrumb(text: @user, path: show_url)
  end

  def scope
    searched_policy_scope(User)
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
          :locale,
          {
            names_attributes: [
              %i[id _destroy given_name family_name primary verified]
            ],
            handles_attributes: [%i[id _destroy handle primary verified]],
            email_addresses_attributes: [
              %i[id _destroy email_address primary verified]
            ],
            phone_numbers_attributes: [
              %i[id _destroy phone_number primary verified]
            ],
            addresses_attributes: [
              %i[id _destroy verified primary address autocomplete]
            ],
            passwords_attributes: [
              %i[id _destroy hint password primary verified]
            ],
            time_zones_attributes: [%i[id _destroy time_zone primary verified]]
          }
        ]
      )
    else
      params.expect(
        user: [
          :locale,
          {
            names_attributes: [%i[id _destroy given_name family_name primary]],
            handles_attributes: [%i[id _destroy handle primary]],
            email_addresses_attributes: [%i[id _destroy email_address primary]],
            phone_numbers_attributes: [%i[id _destroy phone_number primary]],
            addresses_attributes: [
              %i[id _destroy primary address autocomplete]
            ],
            passwords_attributes: [%i[id _destroy hint password primary]],
            time_zones_attributes: [%i[id _destroy time_zone primary]]
          }
        ]
      )
    end
  end
end
