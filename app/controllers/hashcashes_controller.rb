# frozen_string_literal: true

class HashcashesController < ApplicationController
  before_action { add_breadcrumb(key: "hashcashes.index", path: index_url) }
  before_action :load_hashcash, only: %i[show edit update destroy delete]

  def challenge
    @hashcash = authorize(policy_scope(Hashcash).new, :challenge?)
    response.headers["Cache-Control"] = "no-store"
    data =
      @hashcash.issue_challenge(
        method: params[:method],
        path: params[:path],
        body_sha256: params[:body_sha256],
        content_type: params[:content_type],
        origin: request.base_url,
        user_id: current_user&.id
      )
    render(json: { status: :ok, messages: [], data: data })
  rescue Hashcash::InvalidChallenge
    render(
      json: {
        status: :bad_request,
        messages: [t(".invalid")],
        data: nil
      },
      status: :bad_request
    )
  end

  def index
    authorize(Hashcash)
    @hashcashes = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @hashcashes })
      end
    end
  end

  def show
    @versions =
      policy_scope(Version)
        .where_hashcash(@hashcash)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_hashcash(@hashcash)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @hashcash })
      end
    end
  end

  def new
    @hashcash = authorize(scope.new)
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @hashcash })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @hashcash })
      end
    end
  end

  def create
    @hashcash = authorize(scope.new(hashcash_params))
    persist(:new, t(".notice"))
  end

  def update
    @hashcash.assign_attributes(hashcash_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @hashcash.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @hashcash.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(Hashcash)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Hashcash)
    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_hashcash
    @hashcash = authorize(scope.find(id))
    set_context(hashcash: @hashcash)
    add_breadcrumb(text: @hashcash, path: show_url)
  end

  def id = params[:hashcash_id].presence || params.expect(:id)

  def scope = searched_policy_scope(Hashcash)
  def model_class = Hashcash
  def model_instance = @hashcash
  def nested = []
  def filters = []

  def hashcash_params
    admin? ? params.expect(hashcash: %i[challenge_id expires_at]) : {}
  end
end
