# frozen_string_literal: true

class GuestsController < ApplicationController
  before_action { authorize(Guest) }
  skip_after_action(:verify_policy_scoped)

  def index
    @guests = [current_guest]
  end

  def show
    @guest = current_guest
    set_error_context(guest: @guest)
  end

  def new
    redirect_to(index_url)
  end

  def edit
    redirect_to(index_url)
  end

  def create
    redirect_to(index_url)
  end

  def update
    redirect_to(index_url)
  end

  def destroy
    redirect_to(index_url)
  end

  def destroy_all
    redirect_to(index_url)
  end

  def delete_all
    redirect_to(index_url)
  end

  def model_class
    Guest
  end

  def model_instance
    @guest
  end

  def nested
    []
  end
end
