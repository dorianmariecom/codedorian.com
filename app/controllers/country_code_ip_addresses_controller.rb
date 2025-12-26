# frozen_string_literal: true

class CountryCodeIpAddressesController < ApplicationController
  before_action { add_breadcrumb(key: "country_code_ip_addresses.index", path: index_url) }
  before_action(:load_country_code_ip_address, only: %i[show edit update destroy])

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

    if @country_code_ip_address.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @country_code_ip_address.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @country_code_ip_address.assign_attributes(country_code_ip_address_params)

    if @country_code_ip_address.save(context: :controller)
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

  def nested(...)
    []
  end

  def filters
    []
  end

  def id
    params[:country_code_ip_address_id].presence || params[:id]
  end

  def load_country_code_ip_address
    @country_code_ip_address = authorize(scope.find(id))
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
end