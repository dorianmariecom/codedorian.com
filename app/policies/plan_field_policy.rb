# frozen_string_literal: true

class PlanFieldPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(plan: policy_scope(Plan))
    end
  end

  def index? = admin? || advanced?
  def show? = admin? || advanced?
  def create? = admin?
  def update? = admin?
  def destroy? = admin?
  def destroy_all? = admin?
end
