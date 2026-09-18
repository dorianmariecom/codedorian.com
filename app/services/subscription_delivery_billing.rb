# frozen_string_literal: true

class SubscriptionDeliveryBilling
  def self.price_for(subscription)
    base = subscription.plan.price_for(subscription)
    selections =
      subscription.subscription_destinations.selected.preload(
        delivery_destination: :delivery_channel
      )
    if selections.empty?
      raise StripeBilling::PricingError, I18n.t("delivery.choose_destination")
    end
    unless selections.all? do |selection|
             selection.amount_currency == base[:amount_currency]
           end
      raise StripeBilling::PricingError, I18n.t("delivery.currency_mismatch")
    end

    total = base[:amount_cents] + selections.sum(&:amount_cents)
    subscription.assign_attributes(
      delivery_base_amount_cents: base[:amount_cents],
      delivery_amount_cents: total,
      delivery_amount_currency: base[:amount_currency]
    )
    { amount_cents: total, amount_currency: base[:amount_currency] }
  end

  def self.normalize_ids(ids)
    Array(ids).compact_blank.map { |id| Integer(id) }.uniq
  rescue ArgumentError, TypeError
    raise StripeBilling::PricingError, I18n.t("delivery.invalid_destinations")
  end

  def self.preview(subscription)
    destinations =
      subscription.delivery_destinations.reject(&:marked_for_destruction?)
    destinations.each do |destination|
      destination.user = subscription.user if destination.new_record?
    end
    unless destinations.any? &&
             destinations.all? do |destination|
               destination.valid? && destination.available?
             end
      raise StripeBilling::PricingError, I18n.t("delivery.invalid_destinations")
    end

    base = subscription.plan.price_for(subscription)
    existing =
      subscription.subscription_destinations.selected.index_by(
        &:delivery_destination_id
      )
    items =
      destinations.each_with_index.map do |destination, index|
        selection = existing[destination.id]
        currency =
          selection&.amount_currency ||
            destination.delivery_channel.amount_currency
        unless currency == base[:amount_currency]
          raise StripeBilling::PricingError,
                I18n.t("delivery.currency_mismatch")
        end
        {
          "destination_id" => destination.id || "new_#{index}",
          "name" => destination.to_s,
          "amount_cents" =>
            selection&.amount_cents || destination.delivery_channel.amount_cents
        }
      end
    {
      "base_amount_cents" => base[:amount_cents],
      "amount_cents" =>
        base[:amount_cents] + items.sum { |item| item["amount_cents"] },
      "amount_currency" => base[:amount_currency],
      "items" => items
    }
  end

  def self.select!(subscription, ids, sync: true, expected_quote: nil)
    ids = normalize_ids(ids)
    destinations =
      DeliveryDestination.where(user_id: subscription.user_id, id: ids).preload(
        :delivery_channel
      )
    unless destinations.size == ids.size && destinations.all?(&:available?) &&
             ids.any?
      raise StripeBilling::PricingError, I18n.t("delivery.invalid_destinations")
    end

    subscription.with_lock do
      if subscription.delivery_change_key.present?
        raise StripeBilling::PricingError, I18n.t("delivery.change_pending")
      end

      subscription
        .subscription_destinations
        .where.not(delivery_destination_id: ids)
        .find_each do |selection|
          selection.update!(selected: false, active: false)
        end
      destinations.each do |destination|
        selection =
          subscription.subscription_destinations.find_or_initialize_by(
            delivery_destination: destination
          )
        unless selection.persisted? && selection.selected?
          selection.assign_attributes(
            amount_cents: destination.delivery_channel.amount_cents,
            amount_currency: destination.delivery_channel.amount_currency
          )
        end
        selection.selected = true
        selection.active = subscription.active? unless subscription.billed?
        selection.save!
      end
      price = price_for(subscription)
      if expected_quote && subscription.delivery_pricing != expected_quote
        raise StripeBilling::PricingError, I18n.t("delivery.price_changed")
      end

      subscription.assign_attributes(price) unless subscription.billed?
      if subscription.billed?
        subscription.delivery_change_key = SecureRandom.uuid
      end
      subscription.save!
      subscription.reset_checkout! unless subscription.billed?
    end
    sync!(subscription) if subscription.billed? && sync
  end

  def self.sync!(subscription)
    return if subscription.delivery_change_key.blank?

    remote = Stripe::Subscription.retrieve(subscription.stripe_subscription_id)
    confirm!(subscription, remote)
    return if subscription.delivery_change_key.blank?

    item = remote.items.data.sole
    quote = subscription.delivery_pricing
    price =
      Stripe::Price.create(
        {
          product: item.price.product,
          currency: quote.fetch("amount_currency"),
          unit_amount: quote.fetch("amount_cents"),
          recurring: {
            interval: "month"
          },
          tax_behavior: "inclusive"
        },
        {
          idempotency_key: "delivery-price-#{subscription.delivery_change_key}"
        }
      )
    remote =
      Stripe::Subscription.update(
        subscription.stripe_subscription_id,
        {
          items: [{ id: item.id, price: price.id }],
          payment_behavior: "pending_if_incomplete",
          proration_behavior:
            (
              if quote.fetch("amount_cents") > subscription.amount_cents.to_i
                "always_invoice"
              else
                "none"
              end
            )
        },
        {
          idempotency_key: "delivery-change-#{subscription.delivery_change_key}"
        }
      )
    confirm!(subscription, remote)
  end

  def self.confirm!(subscription, remote)
    return if subscription.delivery_change_key.blank?
    return unless remote.status == "active" && remote[:pending_update].blank?

    item = remote.items&.data&.first
    price = item&.price
    quote = subscription.delivery_pricing
    unless price && price.unit_amount == quote["amount_cents"] &&
             price.currency == quote["amount_currency"]
      return
    end

    subscription.with_lock do
      subscription.subscription_destinations.selected.find_each(&:active!)
      subscription.update!(
        amount_cents: quote.fetch("amount_cents"),
        amount_currency: quote.fetch("amount_currency"),
        delivery_change_key: nil
      )
    end
  end
end
