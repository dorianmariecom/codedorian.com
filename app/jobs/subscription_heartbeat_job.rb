# frozen_string_literal: true

class SubscriptionHeartbeatJob < ContextJob
  def perform_with_context(url:, status: "done")
    uri = URI(url)
    uri.path = "#{uri.path.delete_suffix("/")}/fail" if status == "errored"
    response = Http.request(Net::HTTP::Post.new(uri), max_retries: 0)
    response.value
  end
end
