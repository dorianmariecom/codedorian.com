# frozen_string_literal: true

class PromptPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(user: policy_scope(User))
    end
  end

  def index?
    true
  end

  def create?
    true
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

  def user?
    !!user
  end

  def user
    record? && record.user
  end

  def owner?
    current_user? && user? && current_user == user
  end
end
