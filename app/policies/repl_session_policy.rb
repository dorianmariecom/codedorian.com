# frozen_string_literal: true

class ReplSessionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(user: policy_scope(User))
    end
  end

  def index?
    true
  end

  def show?
    owner? || admin?
  end

  def create?
    true
  end

  def evaluate?
    owner? || admin?
  end

  def update?
    owner? || admin?
  end

  def destroy?
    owner? || admin?
  end

  def delete?
    destroy?
  end

  def destroy_all?
    true
  end
end
