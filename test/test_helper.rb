# frozen_string_literal: true

ENV["RAILS_ENV"] ||= "test"

require_relative "../config/environment"
require "rails/test_help"
require "webmock/minitest"
require_relative "support/controller_smoke_helper"

BCrypt::Engine.cost = BCrypt::Engine::MIN_COST

module ActiveSupport
  class TestCase
    parallelize(workers: :number_of_processors)
    fixtures :all

    setup do
      WebMock.disable_net_connect!(allow_localhost: true)
      stub_recaptcha_requests
      stub_ipinfo_requests
      stub_cloudflare_requests
    end

    def stub_recaptcha_requests
      stub_request(
        :post,
        %r{\Ahttps://www\.google\.com/recaptcha/api/siteverify}
      ).to_return(
        status: 200,
        body: { success: true, score: 0.9 }.to_json,
        headers: {
          "Content-Type" => "application/json"
        }
      )

      stub_request(
        :post,
        %r{\Ahttps://recaptchaenterprise\.googleapis\.com/}
      ).to_return(
        status: 200,
        body: {
          tokenProperties: {
            valid: true
          },
          riskAnalysis: {
            score: 0.9
          }
        }.to_json,
        headers: {
          "Content-Type" => "application/json"
        }
      )
    end

    def stub_ipinfo_requests
      stub_request(:get, %r{\Ahttp://ipinfo\.io/}).to_return(
        status: 200,
        body: { country: "US" }.to_json,
        headers: {
          "Content-Type" => "application/json"
        }
      )
    end

    def stub_cloudflare_requests
      stub_request(:get, "https://www.cloudflare.com/ips-v4/").to_return(
        status: 200,
        body: "",
        headers: {
          "Content-Type" => "text/plain"
        }
      )
      stub_request(:get, "https://www.cloudflare.com/ips-v6/").to_return(
        status: 200,
        body: "",
        headers: {
          "Content-Type" => "text/plain"
        }
      )
    end
  end
end

module LocaleTestHelper
  def test(name, &block)
    return super unless block

    %i[en fr].each do |locale|
      super("#{name} (#{locale})") do
        I18n.with_locale(locale) { instance_exec(&block) }
      end
    end
  end
end

ActiveSupport::TestCase.singleton_class.prepend(LocaleTestHelper)

module ActionDispatch
  class IntegrationTest
    include Rails.application.routes.url_helpers
    include ActionDispatch::TestProcess

    def default_url_options
      { locale: I18n.locale }
    end

    def sign_in(email, password)
      post(
        login_path,
        params: {
          session: {
            email_address: email,
            password: password
          }
        }
      )
    end
  end
end
