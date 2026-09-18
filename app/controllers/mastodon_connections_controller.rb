# frozen_string_literal: true

class MastodonConnectionsController < ApplicationController
  def index
    authorize(DeliveryConnection, policy_class: MastodonConnectionPolicy)
    @connections = scope.order(:id).page(params[:page])
    add_breadcrumb(text: t(".title"), path: mastodon_connections_path)
    respond_to do |format|
      format.html
      format.json { render json: { data: @connections.as_json(only: %i[id name enabled]) } }
    end
  end

  def create
    authorize(DeliveryConnection, policy_class: MastodonConnectionPolicy)
    scope
    state = SecureRandom.hex(32)
    registration = MastodonOauth.register(server: params[:server], redirect_uri: callback_url)
    session[:mastodon_oauth] = registration.merge(state: state, user_id: current_user.id, expires_at: 10.minutes.from_now.to_i)
    redirect_to MastodonOauth.authorization_url(registration: registration, state: state, redirect_uri: callback_url), allow_other_host: true
  rescue MastodonOauth::Error
    redirect_to mastodon_connections_path, alert: t(".failed")
  end

  def callback
    authorize(DeliveryConnection, policy_class: MastodonConnectionPolicy)
    connections = scope
    pending = session.delete(:mastodon_oauth)
    unless pending && pending["user_id"] == current_user.id &&
             pending["expires_at"].to_i > Time.current.to_i &&
             params[:state].is_a?(String) &&
             ActiveSupport::SecurityUtils.secure_compare(pending["state"], params[:state])
      redirect_to mastodon_connections_path, alert: t(".invalid_state")
      return
    end
    if params[:error].present? || !params[:code].is_a?(String) || params[:code].blank?
      redirect_to mastodon_connections_path, alert: t(".failed")
      return
    end

    attributes = MastodonOauth.exchange(registration: pending, code: params[:code], redirect_uri: callback_url)
    current_user.with_lock do
      connection = connections.find_or_initialize_by(base_url: attributes[:base_url], sender: attributes[:sender])
      connection.assign_attributes(attributes)
      connection.save!
    end
    redirect_to mastodon_connections_path, notice: t(".connected")
  rescue MastodonOauth::Error
    redirect_to mastodon_connections_path, alert: t(".failed")
  end

  def destroy
    connection = authorize(scope.find(params.expect(:id)), policy_class: MastodonConnectionPolicy)
    connection.update!(enabled: false, access_token: nil, refresh_token: nil, token_expires_at: nil)
    respond_to do |format|
      format.html { redirect_to mastodon_connections_path, notice: t(".notice") }
      format.json { render json: { status: :ok, data: nil } }
    end
  end

  private

  def scope
    policy_scope(DeliveryConnection, policy_scope_class: MastodonConnectionPolicy::Scope)
  end

  def callback_url
    "#{Current.base_url.to_s.delete_suffix('/')}#{callback_mastodon_connections_path(locale: nil)}"
  end
end
