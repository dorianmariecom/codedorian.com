# frozen_string_literal: true

class UsersController < ApplicationController
  before_action(:load_user, only: %i[show edit update destroy impersonate])
  skip_after_action(
    :verify_policy_scoped,
    only: %i[new create update_time_zone]
  )
  skip_after_action(:verify_authorized, only: :update_time_zone)
  skip_before_action(:verify_captcha, only: :update_time_zone)

  def index
    authorize(User)

    @users = scope.page(params[:page]).order(created_at: :asc)
  end

  def impersonate
    session[:user_id] = @user.id

    redirect_to(show_url)
  end

  def update_time_zone
    return head(:bad_request) if params[:time_zone].blank?
    unless params[:time_zone].in?(TimeZone::TIME_ZONES)
      return head(:bad_request)
    end
    return head(:bad_request) if Current.time_zone
    return head(:bad_request) if Current.unverified_time_zone

    if Current.user
      Current.unverified_time_zones.create!(time_zone: params[:time_zone])
    else
      session[:time_zone] = params[:time_zone]
    end

    head(:ok)
  end

  def show
  end

  def new
    @user = authorize(policy_scope(User).new)
  end

  def edit
  end

  def create
    @user = authorize(policy_scope(User).new(user_params))

    Current.with(user: @user) do
      if @user.save
        log_in(@user)
        redirect_to(show_url, notice: t(".notice"))
      else
        flash.now.alert = @user.alert
        render(:new, status: :unprocessable_entity)
      end
    end
  end

  def update
    if @user.update(user_params)
      log_in(@user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @user.alert
      render(:edit, status: :unprocessable_entity)
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
              %i[
                id
                _destroy
                address
                address_components
                formatted_address
                geometry
                place_id
                types
                primary
                verified
              ]
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
              %i[
                id
                _destroy
                address
                address_components
                formatted_address
                geometry
                place_id
                types
                primary
              ]
            ],
            passwords_attributes: [%i[id _destroy hint password primary]],
            time_zones_attributes: [%i[id _destroy time_zone primary]]
          }
        ]
      )
    end
  end
end
