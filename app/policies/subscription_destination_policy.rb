# frozen_string_literal: true

class SubscriptionDestinationPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if current_user&.admin?
      return scope.none unless current_user

      scope.joins(:subscription).where(
        subscriptions: {
          user_id: current_user.id
        }
      )
    end
  end

  def index? = current_user?
  def show? = admin? || record.user == current_user
  def create? = admin?
  def update? = admin?
  def destroy? = admin?
  def destroy_all? = admin?
end
