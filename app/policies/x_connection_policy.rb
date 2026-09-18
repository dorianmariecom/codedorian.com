# frozen_string_literal: true

class XConnectionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      current_user? ? scope.where_user(current_user).where(provider: "x") : scope.none
    end
  end

  def index? = current_user?
  def create? = current_user?
  def callback? = current_user?
  def destroy? = owner? && record.provider == "x"
end
