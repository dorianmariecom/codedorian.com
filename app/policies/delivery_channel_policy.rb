# frozen_string_literal: true

class DeliveryChannelPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve = current_user ? scope.all : scope.none
  end

  def index? = admin?
  def show? = admin?
  def create? = admin?
  def update? = admin?
  def destroy? = admin?
  def destroy_all? = admin?
end
