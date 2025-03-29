# frozen_string_literal: true

class StaticPolicy < ApplicationPolicy
  def home?
    true
  end

  def documentation?
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

  def source?
    true
  end

  def more?
    true
  end

  def account?
    true
  end

  def icon?
    true
  end
end
