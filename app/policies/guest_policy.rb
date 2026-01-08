# frozen_string_literal: true

class GuestPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      if admin?
        scope.all
      elsif current_guest?
        scope.where(id: current_guest)
      else
        scope.none
      end
    end
  end

  def index?
    true
  end

  def show?
    self? || admin?
  end

  def create?
    true
  end

  def update?
    self? || admin?
  end

  def destroy?
    self? || admin?
  end

  def destroy_all?
    true
  end
end
