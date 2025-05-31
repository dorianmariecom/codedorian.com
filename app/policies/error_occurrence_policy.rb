# frozen_string_literal: true

class ErrorOccurrencePolicy < ApplicationPolicy
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

  def destroy?
    admin?
  end

  def destroy_all?
    admin?
  end

  def delete_all?
    admin?
  end
end
