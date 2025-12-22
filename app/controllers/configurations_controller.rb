# frozen_string_literal: true

class ConfigurationsController < ApplicationController
  before_action { add_breadcrumb(key: "configurations.index", path: index_url) }
  before_action(:load_configuration, only: %i[show update edit destroy])

  def index
    authorize(Configuration)

    @configurations = scope.page(params[:page]).order(name: :asc)
  end

  def show
    respond_to do |format|
      format.json { render json: @configuration.content }
      format.html { authorize(@configuration, :edit?) }
    end
  end

  def new
    @configuration = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @configuration = authorize(scope.new(configuration_params))

    if @configuration.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @configuration.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @configuration.assign_attributes(configuration_params)

    if @configuration.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @configuration.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @configuration.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Configuration)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Configuration)

    scope.delete_all

    redirect_back_or_to(index_url)
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
    params.expect(configuration: %i[name content])
  end
end
