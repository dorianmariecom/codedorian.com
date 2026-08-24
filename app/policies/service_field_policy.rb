# frozen_string_literal: true

class ServiceFieldPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(service: policy_scope(Service))
    end
  end

  def index? = admin? || advanced?
  def show? = admin? || advanced?
  def create? = admin?
  def update? = admin?
  def destroy? = admin?
  def destroy_all? = admin?
end
