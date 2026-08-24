# frozen_string_literal: true

class SubscriptionPolicy < ApplicationPolicy
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

  def create? = current_user?

  def update?
    admin? || owner?
  end

  def activate?
    admin?
  end

  def deactivate?
    admin?
  end

  def evaluate?
    admin?
  end

  def destroy?
    admin? || owner?
  end

  def delete? = admin?

  def destroy_all?
    admin?
  end
end
