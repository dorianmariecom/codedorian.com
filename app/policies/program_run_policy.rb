# frozen_string_literal: true

class ProgramRunPolicy < ApplicationPolicy
  def create?
    true
  end

  def show?
    current_user?
  end
end
