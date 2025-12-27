# frozen_string_literal: true

class StaticController < ApplicationController
  before_action { authorize(:static) }
  skip_after_action(:verify_policy_scoped)
  before_action :add_breadcrumb, except: :home

  def home
  end

  def up
    # Check database connectivity
    ActiveRecord::Base.connection.execute("SELECT 1")
    
    render plain: "OK"
  rescue ActiveRecord::DatabaseConnectionError => e
    render plain: "Database connection error: #{e.message}", status: :service_unavailable
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

  def form
    redirect_to(Config.form.url, allow_other_host: true)
  end

  def admin
  end
end
