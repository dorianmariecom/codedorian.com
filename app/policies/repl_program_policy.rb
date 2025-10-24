# frozen_string_literal: true

class ReplProgramPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(repl_session: policy_scope(ReplSession))
    end
  end

  def index?
    true
  end

  def create?
    true
  end

  def update?
    owner? || admin?
  end

  def show?
    owner? || admin?
  end

  def destroy?
    owner? || admin?
  end

  def destroy_all?
    true
  end

  def delete_all?
    true
  end
end
