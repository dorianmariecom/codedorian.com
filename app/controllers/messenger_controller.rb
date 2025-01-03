# frozen_string_literal: true

class MessengerController < ApplicationController
  skip_forgery_protection
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def create
    if params["hub.verify_token"] == webhook_token
      render plain: params["hub.challenge"]
    else
      head :bad_request
    end
  end

  private

  def webhook_token
    Rails.application.credentials.messenger.webhook_secret
  end
end
