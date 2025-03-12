# frozen_string_literal: true

class GuestsController < ApplicationController
  before_action { authorize Guest }
  skip_after_action :verify_policy_scoped

  def index
    @guests = [current_guest]
  end

  def show
    @guest = current_guest
  end

  def new
  end

  def create
  end

  def edit
  end

  def update
  end

  def destroy
  end

  def destroy_all
  end
end
