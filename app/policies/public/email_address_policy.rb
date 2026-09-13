# frozen_string_literal: true

module Public
  class EmailAddressPolicy < ApplicationPolicy
    class Scope < ApplicationPolicy::Scope
      def resolve
        scope.all
      end
    end

    def verification? = true
    def confirm_verification? = true
  end
end
