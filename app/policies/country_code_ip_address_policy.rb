# frozen_string_literal: true

class CountryCodeIpAddressPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.all
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

  def lookup?
    true
  end

  def destroy_all?
    admin?
  end

  def delete_all?
    admin?
  end
end