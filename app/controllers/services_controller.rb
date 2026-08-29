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

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @services
            }
          )
        end
      end
  end

  def show
      unless can?(:update, @service)
        @plans =
          @service
            .plans
            .includes(:plan_schedules)
            .order(created_at: :desc)
            .page(params[:page])
        @steps =
          policy_scope(Step)
            .where(service: @service)
            .order(:position)
            .page(params[:page])
        @service_fields =
          policy_scope(ServiceField)
            .where(service: @service)
            .order(:position, :id)
            .page(params[:page])
        @plan_fields =
          policy_scope(PlanField)
            .joins(:plan)
            .where(plans: { service_id: @service.id })
            .order(:plan_id, :position, :id)
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
      @plan_fields =
        policy_scope(PlanField)
          .joins(:plan)
          .where(plans: { service_id: @service.id })
          .order(:plan_id, :position, :id)
          .page(params[:page])
      @service_fields =
        policy_scope(ServiceField)
          .where(service: @service)
          .order(:position, :id)
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

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @service
            }
          )
        end
      end
  end

  def new
      @service = authorize(scope.new)
      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @service
            }
          )
        end
      end
  end

  def edit
      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @service
            }
          )
        end
      end
  end

  def create
      @service = authorize(scope.new(service_params))
      if @service.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @service
              }
            )
          end
        end
      else
        flash.now.alert = @service.alert
        respond_to do |format|
          format.html { render(:new, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@service.alert],
                data: @service
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def update
      @service.assign_attributes(service_params)
      if @service.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @service
              }
            )
          end
        end
      else
        flash.now.alert = @service.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@service.alert],
                data: @service
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @service.destroy!
      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @service
            }
          )
        end
      end
  end

  def delete
      @service.delete
      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @service
            }
          )
        end
      end
  end

  def destroy_all
      authorize(Service)
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
      authorize(Service)
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
