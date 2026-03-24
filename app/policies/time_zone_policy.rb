# frozen_string_literal: true

class TimeZonePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(user: policy_scope(User))
    end
  end

  def index?
    admin? && advanced?
  end

  def show?
    (admin? || owner?) && advanced?
  end

  def create?
    admin? && advanced?
  end

  def update?
    (admin? || owner?) && advanced?
  end

  def destroy?
    (admin? || owner?) && advanced?
  end

  def destroy_all?
    admin? && advanced?
  end
end
