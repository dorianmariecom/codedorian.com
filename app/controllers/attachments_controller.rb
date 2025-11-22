# frozen_string_literal: true

class AttachmentsController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "attachments.index", path: index_url) }
  before_action(
    :load_attachment,
    only: %i[show edit update destroy preview download]
  )

  def index
    authorize(Attachment)

    @attachments = scope.page(params[:page]).order(created_at: :desc)
  end

  def preview
    send_data(
      @attachment.file.download,
      filename: @attachment.file.filename.to_s,
      type: @attachment.file.content_type,
      disposition: "inline"
    )
  end

  def download
    send_data(
      @attachment.file.download,
      filename: @attachment.file.filename.to_s,
      type: @attachment.file.content_type,
      disposition: "attachment"
    )
  end

  def show
  end

  def new
    @attachment = authorize(scope.new(user: @user))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @attachment = authorize(scope.new(attachment_params))

    if @attachment.save(context: :controller)
      log_in(@attachment.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @attachment.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @attachment.assign_attributes(attachment_params)

    if @attachment.save(context: :controller)
      log_in(@attachment.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @attachment.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @attachment.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Attachment)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Attachment)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_user
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params[:user_id])
      end

    set_error_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def scope
    scope = searched_policy_scope(Attachment)
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    Attachment
  end

  def model_instance
    @attachment
  end

  def nested(user: @user)
    [user]
  end

  def filters
    [:user]
  end

  def id
    params[:attachment_id].presence || params[:id]
  end

  def load_attachment
    @attachment = authorize(scope.find(id))
    set_error_context(attachment: @attachment)
    add_breadcrumb(text: @attachment, path: show_url)
  end

  def attachment_params
    if admin?
      params.expect(attachment: %i[user_id file])
    else
      params.expect(attachment: %i[file])
    end
  end
end
