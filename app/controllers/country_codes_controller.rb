# frozen_string_literal: true

class CountryCodesController < ApplicationController
  before_action { authorize :country_code }
  skip_before_action :verify_authenticity_token
  skip_after_action :verify_policy_scoped
  skip_before_action :verify_captcha

  def create
    uri = URI.parse("http://ipinfo.io/#{request.ip}?token=#{token}")
    response = Net::HTTP.get_response(uri)
    json = JSON.parse(response.body)
    country_code = json["country"].presence || PhoneNumber::DEFAULT_COUNTRY_CODE
    render json: { country_code: }
  end

  private

  def token
    Rails.application.credentials.ipinfo_io.token
  end
end
