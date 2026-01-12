# frozen_string_literal: true

class ExamplesController < ApplicationController
  before_action { add_breadcrumb(key: "examples.index", path: index_url) }
  before_action(:load_example, only: %i[show edit update destroy delete])

  def index
    authorize(Example)

    @examples = scope.page(params[:page]).order(position: :asc)
    @example_schedules = example_schedules_scope
  end

  def show
    @example_schedules =
      example_schedules_scope.order(created_at: :asc).page(params[:page])
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @example = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @example = authorize(scope.new(example_params))

    if @example.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @example.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @example.assign_attributes(example_params)

    if @example.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @example.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @example.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @example.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(Example)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Example)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope
    searched_policy_scope(Example)
  end

  def example_schedules_scope
    scope = policy_scope(ExampleSchedule)
    scope = scope.where_example(@example) if @example
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_example(@example) if @example
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_example(@example) if @example
    scope
  end

  def model_class
    Example
  end

  def model_instance
    @example
  end

  def nested
    []
  end

  def filters
    []
  end

  def id
    params[:example_id].presence || params[:id]
  end

  def load_example
    @example = authorize(scope.find(id))
    set_context(example: @example)
    add_breadcrumb(text: @example, path: show_url)
  end

  def example_params
    if admin?
      params.expect(
        example: [
          :description,
          :input,
          :name,
          :position,
          :title,
          :locale,
          { example_schedules_attributes: [%i[id _destroy starts_at interval]] }
        ]
      )
    else
      {}
    end
  end
end
