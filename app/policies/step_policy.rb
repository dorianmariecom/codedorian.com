# frozen_string_literal: true

class StepPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      admin? || advanced? ? scope.all : scope.none
    end
  end

  def index?
    admin? || advanced?
  end

  def show?
    admin? || advanced?
  end

  def create?
    admin?
  end

  def update?
    admin?
  end

  def format?
    admin?
  end

  def format_all?
    admin?
  end

  def destroy?
    admin?
  end

  def destroy_all?
    admin?
  end
end
