# frozen_string_literal: true

class StaticController < ApplicationController
  before_action { authorize :static }
  skip_after_action :verify_policy_scoped

  def home
    @program = Program.new
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

  def icons
  end

  def ios
  end

  def android
  end
end
