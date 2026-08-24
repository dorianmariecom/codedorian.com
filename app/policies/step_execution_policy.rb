# frozen_string_literal: true

class StepExecutionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(
        id:
          scope
            .joins(:subscription)
            .where(
              subscriptions: {
                id: policy_scope(Subscription).select(:id)
              }
            )
      )
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
