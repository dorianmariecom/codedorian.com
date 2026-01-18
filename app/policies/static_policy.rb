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

  def download?
    true
  end

  def form?
    true
  end

  def book?
    true
  end

  def admin?
    current_user? && current_user.admin?
  end
end
