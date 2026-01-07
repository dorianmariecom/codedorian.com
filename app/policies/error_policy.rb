# frozen_string_literal: true

class ErrorPolicy < ApplicationPolicy
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

  def destroy_all?
    admin?
  end

  def not_found?
    true
  end

  def unprocessable_entity?
    true
  end

  def internal_server_error?
    true
  end
end
