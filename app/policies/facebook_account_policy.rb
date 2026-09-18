# frozen_string_literal: true

class FacebookAccountPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      admin? ? scope.all : scope.where_user(current_user)
    end
  end

  def index? = current_user?
  def create? = current_user?
  def callback? = current_user?
  def refresh? = admin? || owner?
  def destroy? = admin? || owner?
end
