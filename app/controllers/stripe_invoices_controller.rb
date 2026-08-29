# frozen_string_literal: true

class StripeInvoicesController < ApplicationController
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

    if @stripe_invoice.save(context: :controller)
      render_saved
    else
      render_invalid(:new)
    end
  end

  def update
    @stripe_invoice.assign_attributes(stripe_invoice_params)

    if @stripe_invoice.save(context: :controller)
      render_saved
    else
      render_invalid(:edit)
    end
  end

  def destroy
    @stripe_invoice.destroy!
    render_deleted
  end

  def delete
    @stripe_invoice.delete
    render_deleted
  end

  def destroy_all
    authorize(StripeInvoice)
    scope.destroy_all
    render_all_deleted
  end

  def delete_all
    authorize(StripeInvoice)
    scope.delete_all
    render_all_deleted
  end

  private

  def load_stripe_invoice
    @stripe_invoice = authorize(scope.find(id))
    set_context(stripe_invoice: @stripe_invoice)
    add_breadcrumb(text: @stripe_invoice, path: show_url)
  end

  def id = params[:stripe_invoice_id].presence || params.expect(:id)

  def scope = searched_policy_scope(StripeInvoice)
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

  def render_saved
    respond_to do |format|
      format.html { redirect_to(show_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @stripe_invoice
          }
        )
      end
    end
  end

  def render_invalid(template)
    flash.now.alert = @stripe_invoice.alert
    respond_to do |format|
      format.html { render(template, status: :unprocessable_content) }
      format.json do
        render(
          json: {
            status: :unprocessable_content,
            messages: [@stripe_invoice.alert],
            data: @stripe_invoice
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
            data: @stripe_invoice
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
