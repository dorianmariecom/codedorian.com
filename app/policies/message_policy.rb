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
    current_user? || admin?
  end

  def show?
    from_current_user? || to_current_user? || admin?
  end

  def subject?
    from_current_user? || to_current_user? || admin?
  end

  def body?
    from_current_user? || to_current_user? || admin?
  end

  def content?
    from_current_user? || to_current_user? || admin?
  end

  def create?
    admin? && advanced?
  end

  def update?
    admin? || (advanced? && (from_current_user? || to_current_user?))
  end

  def destroy?
    admin? || (advanced? && (from_current_user? || to_current_user?))
  end

  def destroy_all?
    admin? && advanced?
  end

  private

  def from_user
    record? && record.from_user
  end

  def to_user
    record? && record.to_user
  end

  def from_user?
    !!from_user
  end

  def to_user?
    !!to_user
  end

  def from_current_user?
    from_user? && current_user? && from_user == current_user
  end

  def to_current_user?
    to_user? && current_user? && to_user == current_user
  end
end
