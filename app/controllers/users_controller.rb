class UsersController < ApplicationController
  before_action :load_user, only: %i[show edit update destroy]

  def index
    authorize User
    @users = policy_scope(User).order(:id)
  end

  def show
    @email_addresses = policy_scope(EmailAddress).where(user: @user)
    @phone_numbers = policy_scope(PhoneNumber).where(user: @user)
    @passwords = policy_scope(Password).where(user: @user)
    @programs = policy_scope(Program).where(user: @user)
  end

  def new
    @user = authorize policy_scope(User).new
  end

  def create
    @user = authorize policy_scope(User).new(user_params)

    if @user.save
      session[:user_id] = @user.id unless admin?
      redirect_to @user, notice: t(".notice")
    else
      flash.now.alert = @user.alert
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @user.update(user_params)
      redirect_to @user, notice: t(".notice")
    else
      flash.now.alert = @user.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy!
    reset_session

    redirect_to root_path, notice: t(".notice")
  end

  private

  def load_user
    if params[:id] == "me"
      @user = authorize current_user
    else
      @user = authorize policy_scope(User).find(params[:id])
    end
  end

  def user_params
    if admin?
      params.require(:user).permit(
        :admin,
        :name,
        :time_zone,
        email_addresses_attributes: %i[
          user_id
          id
          _destroy
          primary
          email_address
          display_name
          smtp_address
          smtp_port
          smtp_user_name
          smtp_password
          smtp_authentication
          smtp_enable_starttls_auto
        ],
        phone_numbers_attributes: %i[user_id id _destroy primary phone_number],
        passwords_attributes: %i[user_id id _destroy password hint]
      )
    else
      params.require(:user).permit(
        :name,
        :time_zone,
        email_addresses_attributes: %i[
          id
          _destroy
          primary
          email_address
          display_name
          smtp_address
          smtp_port
          smtp_user_name
          smtp_password
          smtp_authentication
          smtp_enable_starttls_auto
        ],
        phone_numbers_attributes: %i[id _destroy primary phone_number],
        passwords_attributes: %i[id _destroy password hint]
      )
    end
  end
end