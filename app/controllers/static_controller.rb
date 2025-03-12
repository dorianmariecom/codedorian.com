# frozen_string_literal: true

class StaticController < ApplicationController
  before_action { authorize :static }
  skip_after_action :verify_policy_scoped

  def home
  end

  def documentation
  end

  def up
  end

  def about
  end

  def terms
  end

  def privacy
  end

  def source
  end

  def account
    redirect_to current_user if registered?
  end

  def more
  end
end
