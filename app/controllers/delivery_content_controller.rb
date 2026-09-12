# frozen_string_literal: true

class DeliveryContentController < ApplicationController
  skip_before_action :verify_captcha, only: :show
  skip_after_action :verify_authorized, :verify_policy_scoped, only: :show
  def show
    @delivery = Delivery.find_public(params[:token])
    unless @delivery&.destination_snapshot&.fetch("visibility", nil) == "public"
      return head :not_found
    end
    unless @delivery.delivery_destination.enabled? &&
             @delivery.delivery_destination.public?
      return head :not_found
    end

    render :show, layout: false
  end
end
