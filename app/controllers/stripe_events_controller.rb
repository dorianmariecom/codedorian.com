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
    persist(:new, t(".notice"))
  end

  def update
    @stripe_event.assign_attributes(stripe_event_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @stripe_event.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @stripe_event.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(StripeEvent)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(StripeEvent)
    scope.delete_all
    respond_after_delete_all(t(".notice"))
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
end
