# frozen_string_literal: true

class TokensController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "tokens.index", path: index_url) }
  before_action(:load_token, only: %i[show edit update destroy delete])

  def index
    authorize(Token)

    @tokens = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @token =
      authorize(scope.new(user: @user, primary: user_or_guest.tokens.none?))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @token = authorize(scope.new(token_params))

    if @token.save(context: :controller)
      log_in(@token.user)
      @user = @token.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @token.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @token.assign_attributes(token_params)

    if @token.save(context: :controller)
      log_in(@token.user)
      @user = @token.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @token.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @token.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @token.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(Token)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Token)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_user
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params[:user_id])
      end

    set_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def user_or_guest
    @user || Guest.new
  end

  def scope
    scope = searched_policy_scope(Token)
    scope = scope.where_user(@user) if @user
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_token(@token) if @token
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_token(@token) if @token
    scope
  end

  def model_class
    Token
  end

  def model_instance
    @token
  end

  def nested(user: @user)
    [user]
  end

  def filters
    [:user]
  end

  def id
    params[:token_id].presence || params[:id]
  end

  def load_token
    @token = authorize(scope.find(id))
    set_context(token: @token)
    add_breadcrumb(text: @token, path: show_url)
  end

  def token_params
    if admin?
      params.expect(token: %i[user_id token primary verified])
    else
      params.expect(token: %i[token primary])
    end
  end
end
