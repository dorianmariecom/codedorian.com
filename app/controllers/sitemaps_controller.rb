# frozen_string_literal: true

class SitemapsController < ApplicationController
  def show
    authorize(Page, :sitemap?)

    @pages = policy_scope(Page).where_public.order(path: :asc)
    @services = policy_scope(Service).order(:id)
    @plans = policy_scope(Plan).order(:id)
  end
end
