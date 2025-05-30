# frozen_string_literal: true

class ReplProgramPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(repl_session: policy_scope(ReplSession))
    end
  end

  def index?
    can?(:index, ReplSession)
  end

  def create?
    can?(:create, ReplSession)
  end

  def update?
    can?(:update, repl_session)
  end

  def show?
    can?(:show, repl_session)
  end

  def destroy?
    can?(:destroy, repl_session)
  end

  def destroy_all?
    true
  end

  def delete_all?
    true
  end

  private

  def repl_session
    record.repl_session
  end
end
