# frozen_string_literal: true

class MessagePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(from_user: policy_scope(User)).or(
        scope.where(to_user: policy_scope(User))
      )
    end
  end

  def index?
    true
  end

  def show?
    from_current_user? || to_current_user? || admin?
  end

  def create?
    true
  end

  def update?
    from_current_user? || to_current_user? || admin?
  end

  def destroy?
    from_current_user? || to_current_user? || admin?
  end

  def destroy_all?
    current_user?
  end

  private

  delegate :from_user, :to_user, to: :record

  def from_current_user?
    current_user? && from_user && current_user == from_user
  end

  def to_current_user?
    current_user? && to_user && current_user == to_user
  end
end
