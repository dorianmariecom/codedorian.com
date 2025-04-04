# frozen_string_literal: true

class ReplExecutionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(repl_program: policy_scope(ReplProgram))
    end
  end

  def index?
    can?(:index, ReplProgram)
  end

  def create?
    false
  end

  def update?
    false
  end

  def show?
    can?(:show, repl_program)
  end

  def destroy?
    can?(:destroy, repl_program)
  end

  def destroy_all?
    can?(:destroy_all, ReplProgram)
  end

  private

  def repl_program
    record.repl_program
  end
end
