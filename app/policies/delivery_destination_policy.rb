# frozen_string_literal: true

class DeliveryDestinationPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if current_user&.admin?
      return scope.none unless current_user

      scope.where(user_id: current_user.id)
    end
  end

  def index? = admin?
  def show? = admin?
  def create? = admin?
  def update? = admin?
  def destroy? = admin?
  def destroy_all? = admin?
end
