# frozen_string_literal: true

class PromptsController < ApplicationController
  skip_after_action :verify_policy_scoped, only: :generate
  skip_after_action :verify_authorized, only: :generate
  skip_before_action :verify_captcha, only: :generate

  def generate
    render json: Prompt.generate(name: name_param)
  end

  private

  def name_param
    params.dig(:prompt, :name)
  end
end
