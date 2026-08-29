# frozen_string_literal: true

class ConfigurationsController < ApplicationController
  before_action { add_breadcrumb(key: "configurations.index", path: index_url) }
  before_action(:load_configuration, only: %i[show update edit destroy delete])

  def index
    authorize(Configuration)

    @configurations = scope.page(params[:page]).order(name: :asc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @configurations })
      end
    end
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @configuration.content
          }
        )
      end
      format.html { authorize(@configuration, :edit?) }
    end
  end

  def new
    @configuration = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @configuration })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @configuration })
      end
    end
  end

  def create
    @configuration = authorize(scope.new(configuration_params))

    if @configuration.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @configuration
            }
          )
        end
      end
    else
      flash.now.alert = @configuration.alert
      respond_to do |format|
        format.html { render(:new, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@configuration.alert],
              data: @configuration
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @configuration.assign_attributes(configuration_params)

    if @configuration.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @configuration
            }
          )
        end
      end
    else
      flash.now.alert = @configuration.alert
      respond_to do |format|
        format.html { render(:edit, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@configuration.alert],
              data: @configuration
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def destroy
    @configuration.destroy!

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @configuration
          }
        )
      end
    end
  end

  def delete
    @configuration.delete

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @configuration
          }
        )
      end
    end
  end

  def destroy_all
    authorize(Configuration)

    scope.destroy_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete_all
    authorize(Configuration)

    scope.delete_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  private

  def load_configuration
    @configuration = authorize(scope.find_by!(name: id))

    set_context(configuration: @configuration)
    add_breadcrumb(text: @configuration, path: show_url)
  end

  def id
    params[:configuration_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(Configuration)
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_configuration(@configuration) if @configuration
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_configuration(@configuration) if @configuration
    scope
  end

  def model_class
    Configuration
  end

  def model_instance
    @configuration
  end

  def nested
    []
  end

  def filters
    []
  end

  def configuration_params
    admin? ? params.expect(configuration: %i[name content]) : {}
  end
end
