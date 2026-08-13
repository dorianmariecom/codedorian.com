# frozen_string_literal: true

class SubscriptionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      admin? ? scope.all : scope.none
    end
  end

  def index?
    admin?
  end

  def show?
    admin?
  end

  def create?
    admin?
  end

  def update?
    admin?
  end

  def activate?
    update?
  end

  def deactivate?
    update?
  end

  def evaluate?
    admin?
  end

  def destroy?
    admin?
  end

  def destroy_all?
    admin?
  end
end
