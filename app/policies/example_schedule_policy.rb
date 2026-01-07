# frozen_string_literal: true

class ExampleSchedulePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(example: policy_scope(Example))
    end
  end

  def index?
    true
  end

  def show?
    true
  end

  def create?
    admin?
  end

  def update?
    admin?
  end

  def destroy?
    admin?
  end

  def delete?
    destroy?
  end

  def destroy_all?
    admin?
  end
end
