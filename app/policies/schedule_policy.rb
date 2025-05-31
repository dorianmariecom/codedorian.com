# frozen_string_literal: true

class SchedulePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(program: policy_scope(Program))
    end
  end

  def index?
    can?(:index, Program)
  end

  def create?
    can?(:create, Program)
  end

  def update?
    can?(:update, program)
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
