# frozen_string_literal: true

class SlackAccountsController < ApplicationController
  before_action :load_user
  before_action :load_slack_account, only: %i[show destroy]

  def index
    authorize SlackAccount

    @slack_accounts = scope
  end

  def callback
    authorize SlackAccount
    redirect_to policy_scope(SlackAccount).verify!(code: params[:code])
  end

  def show
  end

  def destroy
    @slack_account.destroy!

    redirect_to @slack_account.user, notice: t(".notice")
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
      policy_scope(SlackAccount).where(user: @user)
    else
      policy_scope(SlackAccount)
    end
  end

  def id
    params[:slack_account_id].presence || params[:id]
  end

  def load_slack_account
    @slack_account = authorize scope.find(id)
  end

  def slack_account_params
    if admin?
      params.require(:slack_account).permit(
        :user_id,
        :verified,
        :primary,
        :auth
      )
    else
      params.require(:slack_account).permit(:primary)
    end
  end
end
