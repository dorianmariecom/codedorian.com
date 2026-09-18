# frozen_string_literal: true

class FacebookAccountsController < ApplicationController
  before_action :current_user!

  def index
    authorize(FacebookAccount)
    @facebook_accounts = scope.order(:id).page(params[:page])
    add_breadcrumb(text: t(".title"), path: facebook_accounts_path)
    respond_to do |format|
      format.html
      format.json { render json: { data: @facebook_accounts.as_json(only: %i[id name enabled messenger_status]) } }
    end
  end

  def create
    authorize(FacebookAccount)
    scope
    unless FacebookOauth.personal_configured?
      redirect_to facebook_accounts_path, alert: t(".unavailable")
      return
    end

    state = SecureRandom.hex(32)
    session[:facebook_account_oauth] = { state: state, user_id: current_user.id, expires_at: 10.minutes.from_now.to_i }
    redirect_to FacebookOauth.personal_authorization_url(state: state, redirect_uri: callback_url), allow_other_host: true
  end

  def callback
    authorize(FacebookAccount)
    accounts = scope.where_user(current_user)
    pending = session.delete(:facebook_account_oauth)
    unless pending && pending["user_id"] == current_user.id && pending["expires_at"].to_i > Time.current.to_i &&
             params[:state].is_a?(String) && ActiveSupport::SecurityUtils.secure_compare(pending["state"], params[:state])
      redirect_to facebook_accounts_path, alert: t(".invalid_state")
      return
    end
    if params[:error].present? || !params[:code].is_a?(String) || params[:code].blank?
      redirect_to facebook_accounts_path, alert: t(".failed")
      return
    end

    identity = FacebookOauth.exchange_identity(code: params[:code], redirect_uri: callback_url)
    current_user.with_lock do
      account = accounts.find_or_initialize_by(facebook_id: identity[:facebook_id])
      account.assign_attributes(identity.merge(enabled: true))
      account.save!
      account.refresh_messenger!
    end
    redirect_to facebook_accounts_path, notice: t(".connected")
  rescue FacebookOauth::Error
    redirect_to facebook_accounts_path, alert: t(".failed")
  end

  def refresh
    account = authorize(scope.find(params.expect(:id)))
    account.refresh_messenger!
    respond_to do |format|
      format.html { redirect_to facebook_accounts_path }
      format.json { render json: { data: { id: account.id, messenger_status: account.messenger_status } } }
    end
  end

  def destroy
    account = authorize(scope.find(params.expect(:id)))
    account.update!(enabled: false, messenger_recipient_id: nil, messenger_page_id: nil, messenger_status: "pending")
    respond_to do |format|
      format.html { redirect_to facebook_accounts_path, notice: t(".notice") }
      format.json { render json: { data: nil } }
    end
  end

  private

  def scope = policy_scope(FacebookAccount)

  def callback_url
    "#{Current.base_url.to_s.delete_suffix('/')}#{callback_facebook_accounts_path(locale: nil)}"
  end
end
