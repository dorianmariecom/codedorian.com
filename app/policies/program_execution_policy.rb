# frozen_string_literal: true

class ProgramExecutionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(program: policy_scope(Program))
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

  # TODO: refactor into applicationpolicy
  def user
    record.user
  end

  def user?
    !!user
  end

  def owner?
    user? && current_user? && user == current_user
  end
end
