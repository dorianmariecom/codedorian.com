# frozen_string_literal: true

module SentryHelper
  def sentry_feedback
    %w[
      formTitle
      submitButtonLabel
      cancelButtonLabel
      confirmButtonLabel
      addScreenshotButtonLabel
      removeScreenshotButtonLabel
      nameLabel
      namePlaceholder
      emailLabel
      emailPlaceholder
      isRequiredLabel
      messageLabel
      messagePlaceholder
      successMessageText
      highlightToolText
      hideToolText
      removeHighlightText
    ].index_with { |variable| t("helpers.sentry.#{variable}") }
  end
end
