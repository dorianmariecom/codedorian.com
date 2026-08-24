# frozen_string_literal: true

class SubscriptionExecutionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope
        .joins(:subscription)
        .where(subscription: policy_scope(Subscription))
    end
  end

  def index?
    admin? || advanced?
  end

  def show?
    admin? || (advanced? && owner?)
  end

  def create?
    admin?
  end

  def update?
    admin?
  end

  def destroy?
    admin?
  end

  def destroy_all?
    admin?
  end
end
