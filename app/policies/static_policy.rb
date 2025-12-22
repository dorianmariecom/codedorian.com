# frozen_string_literal: true

class StaticPolicy < ApplicationPolicy
  def home?
    true
  end

  def up?
    true
  end

  def about?
    true
  end

  def terms?
    true
  end

  def privacy?
    true
  end

  def icons?
    true
  end

  def ios?
    true
  end

  def android?
    true
  end

  def download?
    true
  end

  def form?
    true
  end

  def admin?
    admin?
  end
end
