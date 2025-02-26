# frozen_string_literal: true

class PasswordValidationsController < ApplicationController
  before_action { authorize :password_validation }
  skip_after_action :verify_policy_scoped
  skip_before_action :verify_captcha

  def create
    result = PasswordValidator.check(params[:password])
    render json: { success: result.success?, message: result.message }
  end
end
