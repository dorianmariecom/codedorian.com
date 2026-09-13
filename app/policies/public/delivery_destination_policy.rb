# frozen_string_literal: true

module Public
  class DeliveryDestinationPolicy < ApplicationPolicy
    class Scope < ApplicationPolicy::Scope
      def resolve
        scope.all
      end
    end

    def verification? = true
    def confirm_verification? = true
  end
end
