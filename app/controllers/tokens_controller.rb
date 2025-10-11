# frozen_string_literal: true

class TokensController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "tokens.index", path: index_url) }
  before_action(:load_token, only: %i[show edit update destroy])

  def index
    authorize(Token)

    @tokens = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
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

    if @token.save
      log_in(@token.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @token.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @token.update(token_params)
      log_in(@token.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @token.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @token.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Token)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Token)

    scope.delete_all

    redirect_back_or_to(index_url)
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

    set_error_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def user_or_guest
    @user || Guest.new
  end

  def scope
    scope = searched_policy_scope(Token)
    scope = scope.where(user: @user) if @user
    scope
  end

  def model_class
    Token
  end

  def model_instance
    @token
  end

  def nested
    [@user]
  end

  def id
    params[:token_id].presence || params[:id]
  end

  def load_token
    @token = authorize(scope.find(id))
    set_error_context(token: @token)
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
