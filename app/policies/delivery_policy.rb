# frozen_string_literal: true

class DeliveryPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where_subscription(policy_scope(Subscription))
    end
  end

  def index? = admin?
  def show? = admin? || owner?
  def retry? = admin?
  def reconcile? = admin?
  def create? = admin?
  def update? = admin?
  def destroy? = admin?
  def destroy_all? = admin?
end
