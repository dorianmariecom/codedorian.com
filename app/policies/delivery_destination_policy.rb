# frozen_string_literal: true

class DeliveryDestinationPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      admin? ? scope.all : scope.where_user(current_user)
    end
  end

  def index? = current_user?
  def show? = admin? || owner?
  def create? = current_user?
  def update? = admin? || owner?
  def destroy? = admin?
  def destroy_all? = admin?
end
