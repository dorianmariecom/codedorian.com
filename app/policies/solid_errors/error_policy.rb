# frozen_string_literal: true

module SolidErrors
  class ErrorPolicy < ApplicationPolicy
    class Scope < ApplicationPolicy::Scope
      def resolve
        admin? ? scope.all : scope.none
      end
    end

    def index?
      admin?
    end

    def show?
      admin?
    end
  end
end
