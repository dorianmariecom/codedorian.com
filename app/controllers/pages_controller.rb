# frozen_string_literal: true

class PagesController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(except: :show) do
    add_breadcrumb(key: "pages.index", path: index_url)
  end
  before_action(:load_page, only: %i[show edit update destroy delete])

  helper_method(:page_displayed?)

  def index
    authorize(Page)

    @pages = scope.page(params[:page]).order(path: :asc, id: :asc)
  end

  def show
    if !@page.authorized?
      raise(ActiveRecord::RecordNotFound)
    elsif page_displayed?
      @page.ancestors.each do |page|
        add_breadcrumb(text: page, path: page.path)
      end
    else
      add_breadcrumb(key: "pages.index", path: index_url)
      add_breadcrumb(text: @page, path: show_url)

      @versions = versions_scope.order(created_at: :desc).page(params[:page])
      @logs = logs_scope.order(created_at: :desc).page(params[:page])
    end
  end

  def new
    @page = authorize(scope.new(user: @user))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @page = authorize(scope.new(page_params))

    if @page.save(context: :controller)
      log_in(@page.user)
      @user = @page.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @page.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @page.assign_attributes(page_params)

    if @page.save(context: :controller)
      log_in(@page.user)
      @user = @page.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @page.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @page.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @page.delete

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Page)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Page)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params.expect(:guest_id))
      end

    set_context(guest: @guest)
    add_breadcrumb(key: "guests.index", path: :guests)
    add_breadcrumb(text: @guest, path: @guest)
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

  def scope
    scope = searched_policy_scope(Page)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_page(@page) if @page
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_page(@page) if @page
    scope
  end

  def model_class
    Page
  end

  def model_instance
    @page
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:page_id].presence || params[:id]
  end

  def load_page
    @page =
      authorize(
        scope.find_by(id: id) ||
          scope.find_by!(path: "/#{params.fetch(:path, nil)}")
      )
    set_context(page: @page)
    add_breadcrumb(text: @page, path: show_url) if action_name != "show"
  end

  memoize def page_displayed?
    return true if request.path == root_path
    return true if params.key?(:path)
    return true if cannot?(:update, @page)
    false
  end

  def page_params
    if admin?
      params.expect(
        page: %i[
          user_id
          parent_id
          path
          title_en
          title_fr
          description_en
          description_fr
          body_en
          body_fr
          authorization
        ]
      )
    else
      {}
    end
  end
end
