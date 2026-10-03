# frozen_string_literal: true

class SitemapsController < ApplicationController
  def show
    authorize(Page, :sitemap?)

    pages = policy_scope(Page).where_public.order(path: :asc)
    services = policy_scope(Service).order(:id)
    plans = policy_scope(Plan).order(:id)

    @pages =
      Rails
        .cache
        .fetch(
          ["sitemap/pages/v1", pages.cache_key_with_version],
          expires_in: 1.hour
        ) { pages.pluck(:path, :updated_at) }
    @services =
      Rails
        .cache
        .fetch(
          ["sitemap/services/v1", services.cache_key_with_version],
          expires_in: 1.hour
        ) { services.pluck(:id, :updated_at) }
    @plans =
      Rails
        .cache
        .fetch(
          ["sitemap/plans/v1", plans.cache_key_with_version],
          expires_in: 1.hour
        ) { plans.pluck(:id, :updated_at) }
  end
end
