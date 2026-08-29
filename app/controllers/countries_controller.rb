# frozen_string_literal: true

class CountriesController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "countries.index", path: index_url) }
  before_action(:load_country, only: %i[show edit update destroy delete])

  def index
    authorize(Country)
    @countries = scope.page(params[:page]).order(created_at: :asc)

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @countries }) }
    end
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @country }) }
    end
  end

  def new
    @country = authorize(scope.new(user: @user, primary: user.countries.none?))
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @country }) }
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @country }) }
    end
  end

  def create
    @country = authorize(scope.new(country_params))
    persist(:new, t(".notice"))
  end

  def update
    @country.assign_attributes(country_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @country.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @country.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(Country)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Country)
    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def persist(template, notice)
    if @country.save(context: :controller)
      log_in(@country.user)
      @user = @country.user
      respond_to do |format|
        format.html { redirect_to(show_url, notice: notice) }
        format.json do
          render(json: { status: :ok, messages: [notice], data: @country })
        end
      end
    else
      flash.now.alert = @country.alert
      respond_to do |format|
        format.html { render(template, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@country.alert],
              data: @country
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def respond_after_delete(notice)
    respond_to do |format|
      format.html { redirect_to(index_url, notice: notice) }
      format.json do
        render(json: { status: :ok, messages: [notice], data: @country })
      end
    end
  end

  def respond_after_delete_all(notice)
    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: notice) }
      format.json do
        render(json: { status: :ok, messages: [notice], data: nil })
      end
    end
  end

  def load_user
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params.expect(:user_id))
      end
    set_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def user
    @user || current_user
  end

  def scope
    result = searched_policy_scope(Country)
    result = result.where_user(@user) if @user
    result
  end

  def versions_scope
    policy_scope(Version).where_country(@country)
  end

  def logs_scope
    policy_scope(Log).where_country(@country)
  end

  def model_class = Country
  def model_instance = @country
  def nested(user: @user) = [user]
  def filters = [:user]
  def id = params[:country_id].presence || params[:id]

  def load_country
    @country = authorize(scope.find(id))
    set_context(country: @country)
    add_breadcrumb(text: @country, path: show_url)
  end

  def country_params
    fields = Country::EDITABLE_FIELDS
    fields = [:user_id, :verified, *fields] if admin?
    params.expect(country: fields)
  end
end
