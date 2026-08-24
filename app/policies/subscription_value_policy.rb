# frozen_string_literal: true

class SubscriptionValuePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(subscription: policy_scope(Subscription))
    end
  end

  def index? = admin? || advanced?
  def show? = admin? || (advanced? && owner?)
  def create? = admin? || owner?
  def update? = admin? || owner?
  def destroy? = admin?
  def destroy_all? = admin?

  private

  def subscription = record? && record.subscription
  def subscription? = !!subscription
  def user = subscription? && subscription.user
  def user? = !!user

  def owner?
    current_user? && user? && user == current_user
  end
end
