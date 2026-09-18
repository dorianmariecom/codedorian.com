# frozen_string_literal: true

module DeliveryConnectionsHelper
  def selectable_facebook_accounts(user:)
    policy_scope(FacebookAccount).where_user(user || current_user).enabled.order(:name)
  end

  def selectable_delivery_connections(user:)
    DeliveryConnectionPolicy::Scope
      .new(current_user, DeliveryConnection)
      .resolve
      .where_user(user || current_user)
      .select(:id, :name, :provider)
      .order(:id)
  end
end
