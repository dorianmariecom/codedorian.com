# frozen_string_literal: true

class SubscriptionHeartbeatJob < ContextJob
  def perform_with_context(url:)
    response = Http.request(Net::HTTP::Post.new(URI(url)), max_retries: 0)
    response.value
  end
end
