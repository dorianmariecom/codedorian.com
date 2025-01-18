# frozen_string_literal: true

class SmtpAccountsController < ApplicationController
  before_action :load_user
  before_action :load_smtp_account, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize SmtpAccount

    @smtp_accounts = scope.page(params[:page])
  end

  def show
  end

  def new
    @smtp_account =
      authorize scope.new(primary: current_user.smtp_accounts.none?)
  end

  def edit
  end

  def create
    @smtp_account = authorize scope.new(smtp_account_params)

    if @smtp_account.save
      log_in(@smtp_account.user)
      redirect_to @smtp_account, notice: t(".notice")
    else
      flash.now.alert = @smtp_account.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @smtp_account.update(smtp_account_params)
      log_in(@smtp_account.user)
      redirect_to @smtp_account, notice: t(".notice")
    else
      flash.now.alert = @smtp_account.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @smtp_account.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize SmtpAccount

    scope.destroy_all

    redirect_back_or_to(url)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = current_user
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def scope
    if @user
      policy_scope(SmtpAccount).where(user: @user)
    else
      policy_scope(SmtpAccount)
    end
  end

  def url
    @user ? [@user, :smtp_accounts] : smtp_accounts_path
  end

  def new_url
    @user ? [:new, @user, :smtp_account] : new_smtp_account_path
  end

  def id
    params[:smtp_account_id].presence || params[:id]
  end

  def load_smtp_account
    @smtp_account = authorize scope.find(id)
  end

  def smtp_account_params
    if admin?
      params.expect(
        smtp_account: %i[
          user_id
          primary
          verified
          display_name
          address
          port
          user_name
          password
          authentication
          enable_starttls_auto
        ]
      )
    else
      params.expect(
        smtp_account: %i[
          user_id
          primary
          display_name
          address
          port
          user_name
          password
          authentication
          enable_starttls_auto
        ]
      )
    end
  end
end
