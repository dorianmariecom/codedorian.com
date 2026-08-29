# frozen_string_literal: true

class LinksController < ApplicationController
  before_action { add_breadcrumb(key: "links.index", path: index_url) }
  before_action(:load_link, only: %i[show update edit destroy delete])

  def index
    authorize(Link)

    @links =
      scope.page(params[:page]).order(kind: :asc, position: :asc, id: :asc)

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @links }) }
    end
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @link }) }
    end
  end

  def new
    @link = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @link }) }
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @link }) }
    end
  end

  def create
    @link = authorize(scope.new(link_params))
    persist(:new, t(".notice"))
  end

  def update
    @link.assign_attributes(link_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @link.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @link.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(Link)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Link)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_link
    @link = authorize(scope.find(params.expect(:id)))

    set_context(link: @link)
    add_breadcrumb(text: @link, path: show_url)
  end

  def scope
    searched_policy_scope(Link)
  end

  def versions_scope
    policy_scope(Version).where_link(@link)
  end

  def logs_scope
    policy_scope(Log).where_link(@link)
  end

  def model_class
    Link
  end

  def model_instance
    @link
  end

  def nested
    []
  end

  def filters
    []
  end

  def link_params
    if admin?
      params.expect(
        link: %i[
          kind
          verb
          title_en
          title_fr
          path_input
          visibility_input
          image_ios
          image_android
          position
          default
        ]
      )
    else
      {}
    end
  end
end
