# frozen_string_literal: true

class CountryCodeIpAddressPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.all
    end
  end

  def index?
    admin?
  end

  def show?
    true
  end

  def lookup?
    admin?
  end

  def create?
    admin?
  end

  def update?
    admin? || new_record?
  end

  def destroy?
    admin?
  end

  def destroy_all?
    admin?
  end
end
