# frozen_string_literal: true

class GuestPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    false
  end

  def update?
    false
  end

  def destroy?
    false
  end

  def destroy_all?
    false
  end

  def delete_all?
    true
  end
end
