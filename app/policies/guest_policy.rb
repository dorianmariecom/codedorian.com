# frozen_string_literal: true

class GuestPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    true
  end

  def update?
    true
  end

  def destroy?
    true
  end

  def destroy_all?
    true
  end

  def delete_all?
    true
  end
end
