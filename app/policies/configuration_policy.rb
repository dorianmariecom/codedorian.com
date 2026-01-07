# frozen_string_literal: true

class ConfigurationPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.all
    end
  end

  def index?
    admin?
  end

  def show?
    true
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

  def destroy_all?
    admin?
  end
end
