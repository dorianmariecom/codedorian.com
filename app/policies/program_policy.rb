# frozen_string_literal: true

class ProgramPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(user: policy_scope(User))
    end
  end

  def index?
    admin? || advanced?
  end

  def show?
    (admin? || owner?) && advanced?
  end

  def create?
    return false unless advanced?
    return true if admin?

    current_user? && (!user? || owner?)
  end

  def update?
    (admin? || owner?) && advanced?
  end

  def evaluate?
    (admin? || owner?) && advanced?
  end

  def format?
    (admin? || owner?) && advanced?
  end

  def schedule?
    (admin? || owner?) && advanced?
  end

  def unschedule?
    (admin? || owner?) && advanced?
  end

  def destroy?
    (admin? || owner?) && advanced?
  end

  def schedule_all?
    admin? || advanced?
  end

  def format_all?
    admin? || advanced?
  end

  def unschedule_all?
    admin? || advanced?
  end

  def destroy_all?
    admin? || advanced?
  end
end
