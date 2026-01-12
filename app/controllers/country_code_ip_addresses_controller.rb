# frozen_string_literal: true

class CountryCodeIpAddressesController < ApplicationController
  before_action do
    add_breadcrumb(key: "country_code_ip_addresses.index", path: index_url)
  end
  before_action(
    :load_country_code_ip_address,
    only: %i[show update edit destroy lookup]
  )

  def index
    authorize(CountryCodeIpAddress)

    @country_code_ip_addresses =
      scope.page(params[:page]).order(created_at: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    authorize(@country_code_ip_address, :edit?) unless id == "me"

    respond_to do |format|
      format.json { render(json: @country_code_ip_address) }
      format.html { authorize(@country_code_ip_address, :edit?) }
    end
  end

  def lookup
    @country_code_ip_address.lookup!

    redirect_back_or_to(show_url, notice: t(".notice"))
  end

  def new
    @country_code_ip_address = authorize(scope.new(ip_address: request.ip))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @country_code_ip_address =
      authorize(scope.new(country_code_ip_address_params))

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

  def delete
    @country_code_ip_address.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(CountryCodeIpAddress)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(CountryCodeIpAddress)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_country_code_ip_address
    @country_code_ip_address =
      if id == "me"
        authorize(scope.find_or_create_by!(ip_address: request.ip, &:lookup!))
      else
        authorize(scope.find(id))
      end

    set_context(country_code_ip_address: @country_code_ip_address)
    add_breadcrumb(text: @country_code_ip_address, path: show_url)
  end

  def id
    params[:country_code_ip_address_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(CountryCodeIpAddress)
  end

  def versions_scope
    scope = policy_scope(Version)
    if @country_code_ip_address
      scope = scope.where_country_code_ip_address(@country_code_ip_address)
    end
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    if @country_code_ip_address
      scope = scope.where_country_code_ip_address(@country_code_ip_address)
    end
    scope
  end

  def model_class
    CountryCodeIpAddress
  end

  def model_instance
    @country_code_ip_address
  end

  def nested
    []
  end

  def filters
    []
  end

  def country_code_ip_address_params
    if admin?
      params.expect(country_code_ip_address: %i[ip_address country_code])
    else
      {}
    end
  end
end
