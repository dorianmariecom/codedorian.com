# frozen_string_literal: true

class SolidCacheEntriesController < ApplicationController
  before_action do
    add_breadcrumb(key: "solid_cache_entries.index", path: index_url)
  end
  before_action(
    :load_solid_cache_entry,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(SolidCacheEntry)

    @solid_cache_entries = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @solid_cache_entry = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @solid_cache_entry = authorize(scope.new(solid_cache_entry_params))

    if @solid_cache_entry.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @solid_cache_entry.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @solid_cache_entry.assign_attributes(solid_cache_entry_params)

    if @solid_cache_entry.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @solid_cache_entry.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @solid_cache_entry.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @solid_cache_entry.delete

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(SolidCacheEntry)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(SolidCacheEntry)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_solid_cache_entry
    @solid_cache_entry = authorize(scope.find(id))
    set_context(solid_cache_entry: @solid_cache_entry)
    add_breadcrumb(text: @solid_cache_entry, path: show_url)
  end

  def id
    params[:solid_cache_entry_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(SolidCacheEntry)
  end

  def model_class
    SolidCacheEntry
  end

  def model_instance
    @solid_cache_entry
  end

  def nested
    []
  end

  def filters
    []
  end

  def solid_cache_entry_params
    admin? ? params.expect(solid_cache_entry: %i[key_base64 value_base64]) : {}
  end
end
