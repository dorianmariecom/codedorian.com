# frozen_string_literal: true

class SessionPolicy < ApplicationPolicy
  def create?
    true
  end

  def destroy?
    true
  end
end
