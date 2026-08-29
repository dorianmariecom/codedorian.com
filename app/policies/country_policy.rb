# frozen_string_literal: true

class CountryPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(user: policy_scope(User))
    end
  end

  def index?
    admin? || (current_user? && advanced?)
  end

  def show?
    admin? || (owner? && advanced?)
  end

  def create?
    return true if admin?

    current_user? && advanced? && (!user? || owner?)
  end

  def update?
    admin? || (owner? && advanced?)
  end

  def destroy?
    admin? || (owner? && advanced?)
  end

  def destroy_all?
    admin?
  end
end
