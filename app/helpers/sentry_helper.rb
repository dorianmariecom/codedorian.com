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
    ].to_h { |variable| [variable, t("helpers.sentry.#{variable}")] }
  end
end
