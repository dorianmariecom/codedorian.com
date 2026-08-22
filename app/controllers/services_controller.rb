# frozen_string_literal: true

class ServicesController < ApplicationController
  before_action { add_breadcrumb(key: "services.index", path: index_url) }
  before_action :load_service, only: %i[show edit update destroy delete]

  def index
    authorize(Service)
    @services = scope.page(params[:page]).order(created_at: :desc)
    @steps = policy_scope(Step)
    @plans = policy_scope(Plan)
    @subscriptions = policy_scope(Subscription)
  end

  def show
    unless can?(:update, @service)
      @plans = @service.plans.order(created_at: :desc)
      return
    end

    @steps =
      policy_scope(Step)
        .where(service: @service)
        .order(:position)
        .page(params[:page])
    @plans =
      policy_scope(Plan)
        .where(service: @service)
        .order(created_at: :desc)
        .page(params[:page])
    @subscriptions =
      policy_scope(Subscription)
        .joins(:plan)
        .where(plans: { service_id: @service.id })
        .order(created_at: :desc)
        .page(params[:page])
    @subscription_executions =
      policy_scope(SubscriptionExecution)
        .joins(subscription: :plan)
        .where(plans: { service_id: @service.id })
        .order(created_at: :desc)
        .page(params[:page])
    @step_executions =
      policy_scope(StepExecution)
        .joins(subscription_execution: { subscription: :plan })
        .where(plans: { service_id: @service.id })
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where(item: @service)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_service(@service)
        .order(created_at: :desc)
        .page(params[:page])
  end

  def new
    @service = authorize(scope.new)
    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @service = authorize(scope.new(service_params))
    if @service.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @service.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @service.assign_attributes(service_params)
    if @service.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @service.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @service.destroy!
    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @service.delete
    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Service)
    scope.destroy_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Service)
    scope.delete_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope = searched_policy_scope(Service)
  def model_class = Service
  def model_instance = @service
  def nested = []
  def filters = []

  def load_service
    @service = authorize(scope.find(params.expect(:id)))
    set_context(service: @service)
    add_breadcrumb(text: @service, path: show_url)
  end

  def service_params
    params.expect(
      service: [
        :user_id,
        :name_en,
        :name_fr,
        :description_en,
        :description_fr,
        :body_en,
        :body_fr,
        {
          service_fields_attributes: [
            %i[id _destroy key name_en name_fr kind required position]
          ]
        }
      ]
    )
  end
end
