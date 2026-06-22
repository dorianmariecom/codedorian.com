# frozen_string_literal: true

class PagePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.all
    end
  end

  def index?
    admin? && advanced?
  end

  def show?
    true
  end

  def create?
    admin? && advanced?
  end

  def update?
    admin? && advanced?
  end

  def destroy?
    admin? && advanced?
  end

  def destroy_all?
    admin? && advanced?
  end
end
