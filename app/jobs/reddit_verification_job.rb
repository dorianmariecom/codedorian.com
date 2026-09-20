# frozen_string_literal: true

class RedditVerificationJob < ApplicationJob
  def perform(destination:, token:, url:, locale:)
    destination.reload
    unless DeliveryDestination.find_by_verification(destination.id, token)
      return
    end
    unless destination.channel == "reddit" && destination.visibility_private?
      return
    end

    I18n.with_locale(locale) do
      RedditScript.compose(
        recipient: destination.recipient,
        subject: I18n.t("reddit_verification.subject"),
        text: I18n.t("reddit_verification.body", url: url, username: RedditScript.username)
      )
    end
  end
end
