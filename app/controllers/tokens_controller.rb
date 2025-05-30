# frozen_string_literal: true

class TokensController < ApplicationController
  before_action :load_user
  before_action :load_token, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url
  helper_method :delete_all_url
  helper_method :destroy_all_url

  def index
    authorize Token

    @tokens = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @token =
      authorize scope.new(user: @user, primary: user_or_guest.tokens.none?)
  end

  def edit
  end

  def create
    @token = authorize scope.new(token_params)

    if @token.save
      log_in(@token.user)
      redirect_to @token, notice: t(".notice")
    else
      flash.now.alert = @token.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @token.update(token_params)
      log_in(@token.user)
      redirect_to @token, notice: t(".notice")
    else
      flash.now.alert = @token.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @token.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Token

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize Token

    scope.delete_all

    redirect_back_or_to(url)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def user_or_guest
    @user || Guest.new
  end

  def scope
    scope = searched_policy_scope(Token)
    scope = scope.where(user: @user) if @user
    scope
  end

  def delete_all_url
    [:delete_all, @user, :tokens, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, :tokens, { search: { q: q } }].compact
  end

  def url
    [@user, :tokens].compact
  end

  def new_url
    [:new, @user, :token].compact
  end

  def id
    params[:token_id].presence || params[:id]
  end

  def load_token
    @token = authorize scope.find(id)
  end

  def token_params
    if admin?
      params.expect(token: %i[user_id token primary verified])
    else
      params.expect(token: %i[token primary])
    end
  end
end
