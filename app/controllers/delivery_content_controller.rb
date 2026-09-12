# frozen_string_literal: true

class DeliveryContentController < ApplicationController
  skip_before_action :verify_captcha, only: :show
  skip_after_action :verify_authorized, :verify_policy_scoped, only: :show
  def show
    @delivery = Delivery.find_public(params[:token])
    return head :not_found unless @delivery&.visibility_public?

    unless @delivery.delivery_destination.enabled? &&
             @delivery.delivery_destination.visibility_public?
      head :not_found
    end
  end
end
