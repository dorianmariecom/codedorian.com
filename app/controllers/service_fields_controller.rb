# frozen_string_literal: true

class ServiceFieldsController < ApplicationController
  before_action(:load_service)
  before_action { add_breadcrumb(key: "service_fields.index", path: index_url) }
  before_action :load_service_field, only: %i[show edit update destroy delete]

  def index
    authorize(ServiceField)
    @service_fields =
      scope.page(params[:page]).order(:service_id, :position, :id)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @service_fields })
      end
    end
  end

  def show
    @versions =
      policy_scope(Version)
        .where_service_field(@service_field)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_service_field(@service_field)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @service_field })
      end
    end
  end

  def new
    @service_field =
      authorize(
        scope.new(
          params.fetch(:service_field, ActionController::Parameters.new).permit(
            :service_id
          )
        )
      )
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @service_field })
      end
    end
  end

  def edit
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @service_field })
      end
    end
  end

  def create
    @service_field = authorize(scope.new(service_field_params))
    persist(:new, t(".notice"))
  end

  def update
    @service_field.assign_attributes(service_field_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @service_field.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @service_field.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(ServiceField)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(ServiceField)
    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def scope
    records = searched_policy_scope(ServiceField)
    records = records.where_service(@service) if @service
    records
  end

  def model_class = ServiceField
  def model_instance = @service_field
  def nested = []
  def index_context_records = [@service]
  def filters = []

  def load_service
    return if params[:service_id].blank?

    @service = policy_scope(Service).find(params.expect(:service_id))
    set_context(service: @service)
  end

  def load_service_field
    @service_field = authorize(scope.find(params.expect(:id)))
    set_context(service_field: @service_field)
    add_breadcrumb(text: @service_field, path: show_url)
  end

  def service_field_params
    if admin?
      params.expect(
        service_field: %i[service_id key name_en name_fr kind required position]
      )
    else
      params.expect(
        service_field: %i[key name_en name_fr kind required position]
      )
    end
  end
end
