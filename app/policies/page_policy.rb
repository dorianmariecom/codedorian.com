# frozen_string_literal: true

class PagePolicy < ApplicationPolicy
  def home?
    true
  end

  def up?
    true
  end

  def about?
    true
  end
end
