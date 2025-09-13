# frozen_string_literal: true

class SchedulePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(schedulable: policy_scope(Program)).or(
        scope.where(schedulable: policy_scope(Prompt))
      )
    end
  end

  def index?
    true
  end

  def create?
    true
  end

  def update?
    can?(:update, schedulable)
  end

  def show?
    can?(:show, schedulable)
  end

  def destroy?
    can?(:destroy, schedulable)
  end

  def destroy_all?
    true
  end

  def delete_all?
    true
  end

  private

  def schedulable
    record.schedulable
  end
end
