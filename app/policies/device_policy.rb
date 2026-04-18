# frozen_string_literal: true

class DevicePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(user: policy_scope(User))
    end
  end

  def index?
    admin? || current_user?
  end

  def show?
    admin? || owner?
  end

  def create?
    return true if admin?

    current_user? && (!user? || owner?)
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
