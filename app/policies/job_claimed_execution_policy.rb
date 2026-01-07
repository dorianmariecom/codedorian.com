# frozen_string_literal: true

class JobClaimedExecutionPolicy < ApplicationPolicy
  class Scope < Scope
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

  def destroy?
    admin?
  end

  def delete?
    destroy?
  end
end
