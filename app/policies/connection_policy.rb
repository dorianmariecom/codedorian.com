# frozen_string_literal: true

class ConnectionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?

      current_user? ? scope.where_user(current_user) : scope.none
    end
  end

  def connect?
    current_user? && ConnectionOauth::PROVIDERS.include?(record.provider) &&
      (admin? || !Connection::ADMIN_PROVIDERS.include?(record.provider))
  end

  def callback? = connect?

  def save_credentials? = admin? || owner?
  def index? = current_user?
  def show? = admin? || owner?
  def create? = admin?
  def update? = admin?
  def destroy? = admin? || owner?
  def delete? = admin?
  def destroy_all? = admin?
end
