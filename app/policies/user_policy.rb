# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      if admin?
        scope.all
      elsif current_user?
        scope.where(id: current_user)
      else
        scope.none
      end
    end
  end

  def index?
    true
  end

  def show?
    self? || admin?
  end

  def impersonate?
    admin?
  end

  def create?
    true
  end

  def update?
    self? || admin?
  end

  def destroy?
    self? || admin?
  end

  def destroy_all?
    true
  end

  private

  def self?
    current_user? && record? && current_user == record
  end
end
