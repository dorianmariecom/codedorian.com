# frozen_string_literal: true

class NilClassPolicy < ApplicationPolicy
  def index?
    false
  end

  def show?
    false
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

  def delete?
    destroy?
  end

  def destroy_all?
    false
  end
end
