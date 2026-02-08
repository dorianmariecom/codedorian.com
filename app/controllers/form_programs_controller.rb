# frozen_string_literal: true

class FormProgramsController < ApplicationController
  before_action { add_breadcrumb(key: "form_programs.index", path: index_url) }
  before_action(:load_form_program, only: %i[show edit update destroy delete])

  def index
    authorize(FormProgram)

    @form_programs = scope.page(params[:page]).order(position: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @form_program = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @form_program = authorize(scope.new(form_program_params))

    if @form_program.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @form_program.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @form_program.assign_attributes(form_program_params)

    if @form_program.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @form_program.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @form_program.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @form_program.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(FormProgram)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(FormProgram)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope
    searched_policy_scope(FormProgram)
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_form_program(@form_program) if @form_program
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_form_program(@form_program) if @form_program
    scope
  end

  def model_class
    FormProgram
  end

  def model_instance
    @form_program
  end

  def nested
    []
  end

  def filters
    []
  end

  def id
    params[:form_program_id].presence || params[:id]
  end

  def load_form_program
    @form_program = authorize(scope.find(id))
    set_context(form_program: @form_program)
    add_breadcrumb(text: @form_program, path: show_url)
  end

  def form_program_params
    if admin?
      params.expect(form_program: %i[locale name description position])
    else
      {}
    end
  end
end
