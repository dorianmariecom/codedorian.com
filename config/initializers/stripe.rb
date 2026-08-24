# frozen_string_literal: true

Stripe.api_key = Config.stripe.secret_key
Stripe.api_version = "2026-07-29.dahlia"
