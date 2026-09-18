# frozen_string_literal: true

class SlackConnectionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      current_user? ? scope.where_user(current_user).where(provider: "slack") : scope.none
    end
  end

  def index? = current_user?
  def create? = current_user?
  def callback? = current_user?
  def destroy? = owner? && record.provider == "slack"
end
