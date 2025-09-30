# frozen_string_literal: true

class ExecutionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(program: policy_scope(Program))
    end
  end

  def index?
    can?(:index, Program)
  end

  def create?
    false
  end

  def update?
    false
  end

  def show?
    can?(:show, program)
  end

  def destroy?
    can?(:destroy, program)
  end

  def destroy_all?
    true
  end

  def delete_all?
    true
  end

  private

  def program
    record.program
  end
end
