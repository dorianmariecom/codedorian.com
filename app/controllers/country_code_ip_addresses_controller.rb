# frozen_string_literal: true

class CountryCodeIpAddressesController < ApplicationController
  before_action { add_breadcrumb(key: "country_code_ip_addresses.index", path: index_url) }
  before_action(:load_country_code_ip_address, only: %i[show edit update destroy lookup])
  skip_before_action(:verify_authenticity_token, only: :lookup)
  skip_before_action(:verify_captcha, only: :lookup)

  def index
    authorize(CountryCodeIpAddress)

    @country_code_ip_addresses = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @country_code_ip_address = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @country_code_ip_address = authorize(scope.new(country_code_ip_address_params))

    if @country_code_ip_address.save
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @country_code_ip_address.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    if @country_code_ip_address.update(country_code_ip_address_params)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @country_code_ip_address.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @country_code_ip_address.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def lookup
    # Perform IP address lookup
    uri = URI.parse("http://ipinfo.io/#{@country_code_ip_address.ip_address}?token=#{token}")
    response = Net::HTTP.get_response(uri)
    json = JSON.parse(response.body)
    country_code = json["country"].presence || PhoneNumber::DEFAULT_COUNTRY_CODE
    
    if @country_code_ip_address.update(country_code: country_code)
      render(json: { country_code: country_code, success: true })
    else
      render(json: { error: @country_code_ip_address.errors.full_messages.join(", "), success: false }, status: :unprocessable_entity)
    end
  end

  def destroy_all
    authorize(CountryCodeIpAddress)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(CountryCodeIpAddress)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def scope
    searched_policy_scope(CountryCodeIpAddress)
  end

  def model_class
    CountryCodeIpAddress
  end

  def model_instance
    @country_code_ip_address
  end

  def id
    params[:country_code_ip_address_id].presence || params[:id]
  end

  def load_country_code_ip_address
    if id == "me"
      authorize(scope.find_or_create_by!(ip_address: request.ip, &:lookup!))
    else
      authorize(scope.find(id))
    end

    set_context(country_code_ip_address: @country_code_ip_address)
    add_breadcrumb(text: @country_code_ip_address, path: show_url)
  end

  def country_code_ip_address_params
    if admin?
      params.expect(country_code_ip_address: %i[ip_address country_code])
    else
      params.expect(country_code_ip_address: %i[ip_address country_code])
    end
  end

  def token
    Config.ipinfo.token
  end
end