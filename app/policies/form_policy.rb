# frozen_string_literal: true

class FormPolicy < ApplicationPolicy
  def show?
    true
  end

  def create?
    true
  end
end
