# frozen_string_literal: true

class SolidCableMessagesController < ApplicationController
  helper_method(:binary_text, :binary_hex)

  before_action(:load_guest)
  before_action(:load_user)
  before_action do
    add_breadcrumb(key: "solid_cable_messages.index", path: index_url)
  end
  before_action(
    :load_solid_cable_message,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(SolidCableMessage)

    @solid_cable_messages =
      scope.page(params[:page]).order(created_at: :desc, id: :desc)
  end

  def show
  end

  def new
    @solid_cable_message = authorize(scope.new)

    add_breadcrumb(key: "solid_cable_messages.new")
  end

  def edit
    add_breadcrumb(key: "solid_cable_messages.edit")
  end

  def create
    @solid_cable_message = authorize(scope.new(solid_cable_message_attributes))

    if @solid_cable_message.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @solid_cable_message.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @solid_cable_message.assign_attributes(solid_cable_message_attributes)

    if @solid_cable_message.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @solid_cable_message.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @solid_cable_message.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @solid_cable_message.delete

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(SolidCableMessage)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(SolidCableMessage)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def id
    params[:solid_cable_message_id].presence || params[:id]
  end

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params[:guest_id])
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
        policy_scope(User).find(params[:user_id])
      end

    set_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def load_solid_cable_message
    @solid_cable_message = authorize(scope.find(id))
    set_context(solid_cable_message: @solid_cable_message)
    add_breadcrumb(text: @solid_cable_message, path: show_url)
  end

  def scope
    searched_policy_scope(SolidCableMessage)
  end

  def model_class
    SolidCableMessage
  end

  def model_instance
    @solid_cable_message
  end

  def nested
    [@user || @guest].compact
  end

  def filters
    []
  end

  def solid_cable_message_params
    admin? ? params.expect(solid_cable_message: %i[channel payload]) : {}
  end

  def solid_cable_message_attributes
    attributes = solid_cable_message_params
    channel = attributes[:channel]
    channel_hash =
      if channel.present?
        SolidCableMessage.channel_hash_for(channel)
      else
        @solid_cable_message&.channel_hash
      end

    attributes.merge(channel_hash: channel_hash)
  end

  def binary_text(value)
    value.to_s.dup.force_encoding(Encoding::UTF_8).scrub
  end

  def binary_hex(value)
    value.to_s.unpack1("H*")
  end
end
