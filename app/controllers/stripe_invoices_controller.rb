# frozen_string_literal: true

class StripeInvoicesController < ApplicationController
  before_action :load_plan
  before_action :load_service
  before_action :load_subscription
  before_action :load_user
  before_action do
    add_breadcrumb(key: "stripe_invoices.index", path: index_url)
  end
  before_action :load_stripe_invoice, only: %i[show edit update destroy delete]

  def index
    authorize(StripeInvoice)
    @stripe_invoices = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @stripe_invoices })
      end
    end
  end

  def show
    @versions =
      policy_scope(Version)
        .where_stripe_invoice(@stripe_invoice)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_stripe_invoice(@stripe_invoice)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @stripe_invoice })
      end
    end
  end

  def new
    @stripe_invoice = authorize(scope.new)
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @stripe_invoice })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @stripe_invoice })
      end
    end
  end

  def create
    @stripe_invoice = authorize(scope.new(stripe_invoice_params))
    persist(:new, t(".notice"))
  end

  def update
    @stripe_invoice.assign_attributes(stripe_invoice_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @stripe_invoice.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @stripe_invoice.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(StripeInvoice)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(StripeInvoice)
    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_plan
    return if params[:plan_id].blank?

    @plan = policy_scope(Plan).find(params.expect(:plan_id))
    set_context(plan: @plan)
    add_breadcrumb(text: @plan, path: @plan)
  end

  def load_service
    return if params[:service_id].blank?

    @service = policy_scope(Service).find(params.expect(:service_id))
    set_context(service: @service)
    add_breadcrumb(text: @service, path: @service)
  end

  def load_subscription
    return if params[:subscription_id].blank?

    @subscription =
      policy_scope(Subscription).find(params.expect(:subscription_id))
    set_context(subscription: @subscription)
    add_breadcrumb(text: @subscription, path: @subscription)
  end

  def load_user
    return if params[:user_id].blank?

    @user =
      policy_scope(User).find(
        (
          if params.expect(:user_id) == "me"
            current_user&.id
          else
            params.expect(:user_id)
          end
        )
      )
    set_context(user: @user)
    add_breadcrumb(text: @user, path: @user)
  end

  def parent_params
    {
      plan_id: @plan&.id,
      service_id: @service&.id,
      subscription_id: @subscription&.id,
      user_id: @user&.id
    }.compact
  end

  def load_stripe_invoice
    @stripe_invoice = authorize(scope.find(id))
    set_context(stripe_invoice: @stripe_invoice)
    add_breadcrumb(text: @stripe_invoice, path: show_url)
  end

  def id = params[:stripe_invoice_id].presence || params.expect(:id)

  def scope
    records = searched_policy_scope(StripeInvoice)
    records = records.where_plan(@plan) if @plan
    records = records.where_service(@service) if @service
    records = records.where_subscription(@subscription) if @subscription
    records = records.where_user(@user) if @user
    records
  end

  def model_class = StripeInvoice
  def model_instance = @stripe_invoice
  def nested = []
  def filters = []

  def stripe_invoice_params
    params.expect(
      stripe_invoice: %i[
        subscription_id
        stripe_invoice_id
        stripe_payment_intent_id
        number
        status
        currency
        amount_due
        amount_paid
        period_start
        period_end
        paid_at
        hosted_invoice_url
        invoice_pdf
      ]
    )
  end
end
