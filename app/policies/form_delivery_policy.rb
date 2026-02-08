# frozen_string_literal: true

class FormDeliveryPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      admin? ? scope.all : scope.where(locale: I18n.locale)
    end
  end

  def index?
    true
  end

  def show?
    true
  end

  def create?
    admin?
  end

  def update?
    admin?
  end

  def destroy?
    admin?
  end

  def destroy_all?
    admin?
  end
end
