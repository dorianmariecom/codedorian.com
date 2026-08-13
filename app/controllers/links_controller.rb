# frozen_string_literal: true

class LinksController < ApplicationController
  before_action { add_breadcrumb(key: "links.index", path: index_url) }
  before_action(:load_link, only: %i[show update edit destroy delete])

  def index
    authorize(Link)

    @links =
      scope.page(params[:page]).order(kind: :asc, position: :asc, id: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @link = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @link = authorize(scope.new(link_params))

    if @link.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @link.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @link.assign_attributes(link_params)

    if @link.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @link.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @link.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @link.delete

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Link)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Link)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
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
