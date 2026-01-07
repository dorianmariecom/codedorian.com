# frozen_string_literal: true

class ProgramPromptSchedulePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(program_prompt: policy_scope(ProgramPrompt))
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

  def update?
    owner? || admin?
  end

  def destroy?
    owner? || admin?
  end

  def delete?
    destroy?
  end

  def destroy_all?
    true
  end
end
