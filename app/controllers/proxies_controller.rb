# frozen_string_literal: true

class ProxiesController < ApplicationController
  MODES = %w[inline attachment].freeze
  DEFAULT_MODE = "inline"

  skip_after_action(:verify_policy_scoped, only: :show)

  def show
    authorize(:proxy)

    url = params[:url].to_s
    mode = params[:mode].to_s.presence_in(MODES) || DEFAULT_MODE

    tempfile = Down.download(url)
    content_type = tempfile.content_type
    filename = File.basename(tempfile.original_filename || URI(url).path)

    send_file(
      tempfile.path,
      type: content_type || "application/octet-stream",
      disposition: mode,
      filename: filename
    )
  end
end
