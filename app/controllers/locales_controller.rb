# frozen_string_literal: true

class LocalesController < ApplicationController
  skip_after_action(:verify_policy_scoped)
  skip_after_action(:verify_authorized)

  def update
    locale = params.expect(:selected_locale).presence_in(LOCALES_STRINGS)
    raise(ActionController::BadRequest, "invalid locale") unless locale

    if current_user
      current_user.update!(locale: locale)
    else
      cookies[:locale] = locale
    end

    respond_to do |format|
      format.html do
        redirect_to(requested_redirect_path || root_path(locale: locale))
      end
      format.json do
        render(json: { status: :ok, messages: [], data: { locale: locale } })
      end
    end
  end

  private

  def requested_redirect_path
    path = params[:redirect_to].to_s
    return if path.start_with?("//")
    return unless path.start_with?("/")

    path
  end
end
