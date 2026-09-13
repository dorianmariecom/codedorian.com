# frozen_string_literal: true

class EmailVerificationsController < ApplicationController
  RATE_LIMIT_STORE = ActiveSupport::Cache.lookup_store(:solid_cache_store)

  skip_after_action :verify_authorized, only: %i[show create]
  skip_after_action :verify_policy_scoped, only: %i[show create]
  before_action :current_user!, only: %i[request_account request_destination]
  before_action { no_store }
  before_action(only: :create) { verify_authenticity_token }

  rate_limit to: 5,
             store: RATE_LIMIT_STORE,
             within: 1.minute,
             only: %i[request_account request_destination],
             by: -> { current_user&.id || request.remote_ip },
             with: -> do
               verification_response(:limited, status: :too_many_requests)
             end

  def request_account
    record =
      authorize(
        policy_scope(EmailAddress).find(params.expect(:email_address_id)),
        :request_verification?
      )
    request_confirmation(record, email_address_path(record), "account")
  end

  def request_destination
    subscription =
      authorize(
        policy_scope(Subscription).find(params.expect(:subscription_id)),
        :manage_billing?
      )
    destination =
      subscription
        .subscription_destinations
        .selected
        .find(params.expect(:subscription_destination_id))
        .delivery_destination
    unless destination.user_id == subscription.user_id &&
             destination.channel == "email"
      raise ActiveRecord::RecordNotFound
    end

    request_confirmation(
      destination,
      subscription_path(subscription),
      "destination"
    )
  end

  def show
    unless verification_record
      return verification_response(:invalid, status: :unprocessable_content)
    end

    verification_response(:confirmation)
  end

  def create
    record = verification_record
    if record && SharedEmailVerification.confirm(record, params[:token])
      verification_response(:confirmed)
    else
      verification_response(:invalid, status: :unprocessable_content)
    end
  end

  private

  def request_confirmation(record, path, kind)
    unless record.verification_complete?
      url =
        email_verification_url(
          kind: kind,
          id: record.id,
          token: record.verification_token,
          locale: I18n.locale
        )
      EmailVerificationMailer
        .with(locale: I18n.locale)
        .confirmation(email_address: record.verification_email, url: url)
        .deliver_later
    end
    verification_response(
      record.verification_complete? ? :already_verified : :sent,
      path: path
    )
  end

  def verification_record
    case params[:kind]
    when "account"
      EmailAddress.find_by_verification(params[:id], params[:token])
    when "destination"
      DeliveryDestination.find_by_verification(params[:id], params[:token])
    end
  end

  def verification_response(key, status: :ok, path: nil)
    @message = t("email_verifications.#{key}")
    @confirmation = key == :confirmation
    respond_to do |format|
      format.html do
        if path
          redirect_to(path, notice: @message)
        else
          render :show, status: status
        end
      end
      format.json do
        render json: {
                 status: status,
                 messages: [@message],
                 data: nil
               },
               status: status
      end
    end
  end
end
