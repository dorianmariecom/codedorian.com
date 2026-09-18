# frozen_string_literal: true

class FacebookConnectionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      admin? ? scope.where_user(current_user).where(provider: "facebook") : scope.none
    end
  end

  def index? = admin?
  def create? = admin?
  def callback? = admin?
  def destroy? = admin? && owner? && record.provider == "facebook"
end
