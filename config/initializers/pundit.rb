# frozen_string_literal: true

module PunditAuthorizationCurrentUserPatch
  protected

  def pundit
    pundit_reset! if defined?(@pundit) && @pundit&.user != pundit_user

    super
  end

  def policy_scope(...)
    pundit
    super
  end
end

Pundit::Authorization.prepend(PunditAuthorizationCurrentUserPatch)
