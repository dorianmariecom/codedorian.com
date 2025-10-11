# frozen_string_literal: true

class StaticController < ApplicationController
  before_action { authorize(:static) }
  skip_after_action(:verify_policy_scoped)
  before_action :add_breadcrumb, except: :home

  def home
    @program = policy_scope(Program).new(user: current_user)
    set_error_context(program: @program)
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

  private

  def model_class
    Program
  end

  def model_instance
    @program
  end

  def nested
    [current_user]
  end
end
