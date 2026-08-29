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

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @country_code_ip_addresses
          }
        )
      end
    end
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    authorize(@country_code_ip_address, :edit?) unless id == "me"

    respond_to do |format|
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @country_code_ip_address
          }
        )
      end
      format.html { authorize(@country_code_ip_address, :edit?) }
    end
  end

  def lookup
    @country_code_ip_address.lookup!

    respond_to do |format|
      format.html { redirect_back_or_to(show_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @country_code_ip_address
          }
        )
      end
    end
  end

  def new
    @country_code_ip_address = authorize(scope.new(ip_address: request.ip))

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @country_code_ip_address
          }
        )
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @country_code_ip_address
          }
        )
      end
    end
  end

  def create
    @country_code_ip_address =
      authorize(scope.new(country_code_ip_address_params))

    if @country_code_ip_address.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @country_code_ip_address
            }
          )
        end
      end
    else
      flash.now.alert = @country_code_ip_address.alert
      respond_to do |format|
        format.html { render(:new, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@country_code_ip_address.alert],
              data: @country_code_ip_address
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @country_code_ip_address.assign_attributes(country_code_ip_address_params)

    if @country_code_ip_address.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @country_code_ip_address
            }
          )
        end
      end
    else
      flash.now.alert = @country_code_ip_address.alert
      respond_to do |format|
        format.html { render(:edit, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@country_code_ip_address.alert],
              data: @country_code_ip_address
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def destroy
    @country_code_ip_address.destroy!

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @country_code_ip_address
          }
        )
      end
    end
  end

  def delete
    @country_code_ip_address.delete

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @country_code_ip_address
          }
        )
      end
    end
  end

  def destroy_all
    authorize(CountryCodeIpAddress)

    scope.destroy_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete_all
    authorize(CountryCodeIpAddress)

    scope.delete_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
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
