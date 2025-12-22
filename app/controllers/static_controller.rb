# frozen_string_literal: true

class StaticController < ApplicationController
  before_action { authorize(:static) }
  skip_after_action(:verify_policy_scoped)
  before_action :add_breadcrumb, except: :home

  def home
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

  def admin
  end

  def form
    redirect_to(Config.form.url, allow_other_host: true)
  end
end
