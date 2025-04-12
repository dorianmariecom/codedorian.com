# frozen_string_literal: true

module SolidErrors
  class OccurrencePolicy < ApplicationPolicy
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

    def destroy?
      admin?
    end

    def destroy_all?
      admin?
    end
  end
end
