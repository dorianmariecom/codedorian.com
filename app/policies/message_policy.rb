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
    true
  end

  def update?
    from_current_user? || to_current_user? || admin?
  end

  def destroy?
    from_current_user? || to_current_user? || admin?
  end

  def delete?
    destroy?
  end

  def destroy_all?
    true
  end
end
