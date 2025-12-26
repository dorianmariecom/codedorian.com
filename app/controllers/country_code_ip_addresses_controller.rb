# frozen_string_literal: true

class CountryCodeIpAddressesController < ApplicationController
  before_action { authorize(:country_code_ip_address) }
  skip_before_action(:verify_authenticity_token)
  skip_after_action(:verify_policy_scoped)
  skip_before_action(:verify_captcha)

  def me
    uri = URI.parse("http://ipinfo.io/#{request.ip}?token=#{token}")
    response = Net::HTTP.get_response(uri)
    json = JSON.parse(response.body)
    country_code = json["country"].presence || PhoneNumber::DEFAULT_COUNTRY_CODE
    render(json: { country_code: country_code })
  end

  private

  def token
    Config.ipinfo.token
  end
end