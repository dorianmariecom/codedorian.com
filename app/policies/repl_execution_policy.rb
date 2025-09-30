# frozen_string_literal: true

class ReplExecutionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(repl_program: policy_scope(ReplProgram))
    end
  end

  def index?
    true
  end

  def create?
    false
  end

  def update?
    false
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

  private

  def user
    record.user
  end

  def user?
    !!user
  end

  def owner?
    current_user? && user? && current_user == user
  end
end
