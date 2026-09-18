# frozen_string_literal: true

class MailboxConnectionsController < ApplicationController
  before_action :require_admin

  def index
    authorize(DeliveryConnection, policy_class: MailboxConnectionPolicy)
    @connections = scope.order(:id).page(params[:page])
    add_breadcrumb(text: t(".title"), path: mailbox_connections_path)
    respond_to do |format|
      format.html
      format.json { render json: { data: @connections.as_json(only: %i[id name enabled]) } }
    end
  end

  def create
    authorize(DeliveryConnection, policy_class: MailboxConnectionPolicy)
    scope
    provider = params[:provider].to_s
    oauth = MailboxOauth.new(provider)
    unless oauth.configured?
      redirect_to mailbox_connections_path, alert: t("mailbox_connections.index.unavailable", provider: t("delivery_connections.model.providers.#{provider}"))
      return
    end

    state = SecureRandom.hex(32)
    verifier = SecureRandom.urlsafe_base64(64)
    session[:mailbox_oauth] = { state: state, verifier: verifier, user_id: current_user.id, expires_at: 10.minutes.from_now.to_i, provider: provider }
    redirect_to oauth.authorization_url(state: state, verifier: verifier, redirect_uri: callback_url), allow_other_host: true
  rescue MailboxOauth::Error
    redirect_to mailbox_connections_path, alert: t("mailbox_connections.callback.failed")
  end

  def callback
    authorize(DeliveryConnection, policy_class: MailboxConnectionPolicy)
    connections = scope
    pending = session.delete(:mailbox_oauth)
    unless pending && pending["user_id"] == current_user.id &&
             pending["expires_at"].to_i > Time.current.to_i &&
             params[:state].is_a?(String) &&
             ActiveSupport::SecurityUtils.secure_compare(pending["state"], params[:state])
      redirect_to mailbox_connections_path, alert: t(".invalid_state")
      return
    end
    if params[:error].present? || !params[:code].is_a?(String) || params[:code].blank?
      redirect_to mailbox_connections_path, alert: t(".failed")
      return
    end

    provider = pending["provider"]
    attributes = MailboxOauth.new(provider).exchange(code: params[:code], verifier: pending["verifier"], redirect_uri: callback_url)
    current_user.with_lock do
      connection = connections.find_or_initialize_by(provider: provider, sender: attributes[:sender])
      connection.assign_attributes(attributes)
      connection.save!
    end
    redirect_to mailbox_connections_path, notice: t(".connected")
  rescue MailboxOauth::Error
    redirect_to mailbox_connections_path, alert: t(".failed")
  end

  def destroy
    connection = authorize(scope.find(params.expect(:id)), policy_class: MailboxConnectionPolicy)
    connection.update!(enabled: false, access_token: nil, refresh_token: nil, token_expires_at: nil)
    respond_to do |format|
      format.html { redirect_to mailbox_connections_path, notice: t(".notice") }
      format.json { render json: { status: :ok, data: nil } }
    end
  end

  private

  def require_admin
    raise Pundit::NotAuthorizedError unless admin?
  end

  def scope
    policy_scope(DeliveryConnection, policy_scope_class: MailboxConnectionPolicy::Scope)
  end

  def callback_url
    "#{Current.base_url.to_s.delete_suffix('/')}#{callback_mailbox_connections_path(locale: nil)}"
  end
end
