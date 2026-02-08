# frozen_string_literal: true

class FormDeliveriesController < ApplicationController
  before_action do
    add_breadcrumb(key: "form_deliveries.index", path: index_url)
  end
  before_action(:load_form_delivery, only: %i[show edit update destroy delete])

  def index
    authorize(FormDelivery)

    @form_deliveries = scope.page(params[:page]).order(position: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @form_delivery = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @form_delivery = authorize(scope.new(form_delivery_params))

    if @form_delivery.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @form_delivery.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @form_delivery.assign_attributes(form_delivery_params)

    if @form_delivery.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @form_delivery.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @form_delivery.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @form_delivery.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(FormDelivery)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(FormDelivery)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope
    searched_policy_scope(FormDelivery)
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_form_delivery(@form_delivery) if @form_delivery
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_form_delivery(@form_delivery) if @form_delivery
    scope
  end

  def model_class
    FormDelivery
  end

  def model_instance
    @form_delivery
  end

  def nested
    []
  end

  def filters
    []
  end

  def id
    params[:form_delivery_id].presence || params[:id]
  end

  def load_form_delivery
    @form_delivery = authorize(scope.find(id))
    set_context(form_delivery: @form_delivery)
    add_breadcrumb(text: @form_delivery, path: show_url)
  end

  def form_delivery_params
    if admin?
      params.expect(form_delivery: %i[locale name description position])
    else
      {}
    end
  end
end
