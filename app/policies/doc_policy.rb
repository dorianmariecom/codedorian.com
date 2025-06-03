# frozen_string_literal: true

class DocPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end
end
