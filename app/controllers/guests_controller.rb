# frozen_string_literal: true

class GuestsController < ApplicationController
  before_action { authorize Guest }
  skip_after_action :verify_policy_scoped

  helper_method :delete_all_url
  helper_method :destroy_all_url

  def index
    @guests = [current_guest]
  end

  def show
    @guest = current_guest
  end

  def new
    redirect_to :guests
  end

  def edit
    redirect_to :guests
  end

  def create
    redirect_to :guests
  end

  def update
    redirect_to :guests
  end

  def destroy
    redirect_to :guests
  end

  def destroy_all
    redirect_to :guests
  end

  def delete_all
    redirect_to :guests
  end

  private

  def delete_all_url
    [:delete_all, :guests, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, :guests, { search: { q: q } }].compact
  end
end
