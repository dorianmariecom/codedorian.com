# frozen_string_literal: true

class StripeEventsController < ApplicationController
  before_action { add_breadcrumb(key: "stripe_events.index", path: index_url) }
  before_action :load_stripe_event, only: %i[show edit update destroy delete]

  def index
    authorize(StripeEvent)
    @stripe_events = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @stripe_events })
      end
    end
  end

  def show
    @versions =
      policy_scope(Version)
        .where_stripe_event(@stripe_event)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_stripe_event(@stripe_event)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @stripe_event })
      end
    end
  end

  def new
    @stripe_event = authorize(scope.new)
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @stripe_event })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @stripe_event })
      end
    end
  end

  def create
    @stripe_event = authorize(scope.new(stripe_event_params))

    if @stripe_event.save(context: :controller)
      render_saved
    else
      render_invalid(:new)
    end
  end

  def update
    @stripe_event.assign_attributes(stripe_event_params)

    if @stripe_event.save(context: :controller)
      render_saved
    else
      render_invalid(:edit)
    end
  end

  def destroy
    @stripe_event.destroy!
    render_deleted
  end

  def delete
    @stripe_event.delete
    render_deleted
  end

  def destroy_all
    authorize(StripeEvent)
    scope.destroy_all
    render_all_deleted
  end

  def delete_all
    authorize(StripeEvent)
    scope.delete_all
    render_all_deleted
  end

  private

  def load_stripe_event
    @stripe_event = authorize(scope.find(id))
    set_context(stripe_event: @stripe_event)
    add_breadcrumb(text: @stripe_event, path: show_url)
  end

  def id = params[:stripe_event_id].presence || params.expect(:id)

  def scope = searched_policy_scope(StripeEvent)
  def model_class = StripeEvent
  def model_instance = @stripe_event
  def nested = []
  def filters = []

  def stripe_event_params
    params.expect(
      stripe_event: %i[
        stripe_event_id
        event_type
        status
        livemode
        stripe_created_at
        processed_at
        processing_error
        payload
      ]
    )
  end

  def render_saved
    respond_to do |format|
      format.html { redirect_to(show_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @stripe_event
          }
        )
      end
    end
  end

  def render_invalid(template)
    flash.now.alert = @stripe_event.alert
    respond_to do |format|
      format.html { render(template, status: :unprocessable_content) }
      format.json do
        render(
          json: {
            status: :unprocessable_content,
            messages: [@stripe_event.alert],
            data: @stripe_event
          },
          status: :unprocessable_content
        )
      end
    end
  end

  def render_deleted
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @stripe_event
          }
        )
      end
    end
  end

  def render_all_deleted
    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end
end
