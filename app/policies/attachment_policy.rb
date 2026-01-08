# frozen_string_literal: true

class AttachmentPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(user: policy_scope(User))
    end
  end

  def index?
    true
  end

  def preview?
    owner? || admin?
  end

  def download?
    owner? || admin?
  end

  def show?
    owner? || admin?
  end

  def create?
    true
  end

  def update?
    owner? || admin?
  end

  def destroy?
    owner? || admin?
  end

  def destroy_all?
    true
  end
end
