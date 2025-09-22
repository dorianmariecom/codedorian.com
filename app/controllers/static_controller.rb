# frozen_string_literal: true

class StaticController < ApplicationController
  before_action { authorize(:static) }
  skip_after_action(:verify_policy_scoped)

  def home
    @program = policy_scope(Program).new(user: current_user)
  end

  def up
  end

  def about
  end

  def terms
  end

  def privacy
  end

  def icons
  end

  def ios
  end

  def android
  end

  def download
  end
end
