# frozen_string_literal: true

class DeliveryConnectionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      admin? ? scope.all : scope.where_user(current_user)
    end
  end

  def save_credentials? = admin? || owner?
  def index? = admin?
  def show? = admin?
  def create? = admin?
  def update? = admin?
  def destroy? = admin?
  def destroy_all? = admin?
end
