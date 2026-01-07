# frozen_string_literal: true

class JobPolicy < ApplicationPolicy
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

  def retry?
    admin?
  end

  def discard?
    admin?
  end

  def destroy?
    admin?
  end

  def delete?
    destroy?
  end

  def retry_all?
    admin?
  end

  def discard_all?
    admin?
  end

  def destroy_all?
    admin?
  end
end
