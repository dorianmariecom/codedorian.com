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

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @solid_cable_messages
            }
          )
        end
      end
  end

  def show
      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @solid_cable_message
            }
          )
        end
      end
  end

  def new
      @solid_cable_message = authorize(scope.new)

      add_breadcrumb(key: "solid_cable_messages.new")

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @solid_cable_message
            }
          )
        end
      end
  end

  def edit
      add_breadcrumb(key: "solid_cable_messages.edit")

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @solid_cable_message
            }
          )
        end
      end
  end

  def create
      @solid_cable_message = authorize(scope.new(solid_cable_message_attributes))

      if @solid_cable_message.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @solid_cable_message
              }
            )
          end
        end
      else
        flash.now.alert = @solid_cable_message.alert
        respond_to do |format|
          format.html { render(:new, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@solid_cable_message.alert],
                data: @solid_cable_message
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def update
      @solid_cable_message.assign_attributes(solid_cable_message_attributes)

      if @solid_cable_message.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @solid_cable_message
              }
            )
          end
        end
      else
        flash.now.alert = @solid_cable_message.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@solid_cable_message.alert],
                data: @solid_cable_message
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @solid_cable_message.destroy!

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @solid_cable_message

            }
          )
        end
      end
  end

  def delete
      @solid_cable_message.delete

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @solid_cable_message

            }
          )
        end
      end
  end

  def destroy_all
      authorize(SolidCableMessage)

      scope.destroy_all

      respond_to do |format|
        format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: nil

            }
          )
        end
      end
  end

  def delete_all
      authorize(SolidCableMessage)

      scope.delete_all

      respond_to do |format|
        format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: nil

            }
          )
        end
      end
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
        policy_scope(Guest).find(params.expect(:guest_id))
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
        policy_scope(User).find(params.expect(:user_id))
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
