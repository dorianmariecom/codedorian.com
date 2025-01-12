# frozen_string_literal: true

class StaticController < ApplicationController
  before_action { authorize :static }
  skip_after_action :verify_policy_scoped

  layout "empty", only: :up

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

  def source
  end
end
