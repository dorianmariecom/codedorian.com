# frozen_string_literal: true

class AddressPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(user: policy_scope(User))
    end
  end

  def index?
    (admin? || current_user?) && advanced?
  end

  def show?
    (admin? || owner?) && advanced?
  end

  def create?
    return false unless advanced?
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
