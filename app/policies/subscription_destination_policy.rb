# frozen_string_literal: true

class SubscriptionDestinationPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where_subscription(policy_scope(Subscription))
    end
  end

  def index? = current_user?
  def show? = admin? || record.user == current_user
  def create? = admin?
  def update? = admin?
  def destroy? = admin?
  def destroy_all? = admin?
end
