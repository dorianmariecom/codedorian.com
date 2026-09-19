# frozen_string_literal: true

class DeliveryConnectionOauth
  PROVIDERS = %w[google github slack x reddit mastodon facebook gmail google_workspace outlook].freeze
  ERRORS = [GithubOauth::Error, SlackOauth::Error, XOauth::Error, RedditOauth::Error, MastodonOauth::Error, FacebookOauth::Error, MailboxOauth::Error].freeze

  def self.pending(user:, provider:, redirect_uri:, server: nil, scope: nil)
    pending = {
      "state" => SecureRandom.hex(32), "verifier" => SecureRandom.urlsafe_base64(64),
      "user_id" => user.id, "provider" => provider, "expires_at" => 10.minutes.from_now.to_i
    }
    if provider.in?(%w[google gmail google_workspace])
      pending["scope"] = MailboxOauth.new(provider).scopes(scope: scope).join(" ")
    end
    if provider == "mastodon"
      pending.merge!(MastodonOauth.register(server: server, redirect_uri: redirect_uri).stringify_keys)
    end
    pending
  end

  def self.valid_state?(pending:, user:, provider:, state:)
    pending.is_a?(Hash) && user && pending["user_id"] == user.id &&
      pending["provider"] == provider && PROVIDERS.include?(provider) &&
      pending["expires_at"].to_i > Time.current.to_i &&
      pending["state"].is_a?(String) && state.is_a?(String) && state.present? &&
      ActiveSupport::SecurityUtils.secure_compare(pending["state"], state)
  end

  def self.authorization_url(pending:, redirect_uri:)
    state = pending.fetch("state")
    verifier = pending.fetch("verifier")
    case pending.fetch("provider")
    when "github" then GithubOauth.authorization_url(state: state, verifier: verifier, redirect_uri: redirect_uri)
    when "slack" then SlackOauth.authorization_url(state: state, redirect_uri: redirect_uri)
    when "x" then XOauth.authorization_url(state: state, verifier: verifier, redirect_uri: redirect_uri)
    when "reddit" then RedditOauth.authorization_url(state: state, redirect_uri: redirect_uri)
    when "mastodon" then MastodonOauth.authorization_url(registration: pending, state: state, redirect_uri: redirect_uri)
    when "facebook" then FacebookOauth.authorization_url(state: state, redirect_uri: redirect_uri)
    when "google", "gmail", "google_workspace", "outlook"
      MailboxOauth.new(pending.fetch("provider")).authorization_url(state: state, verifier: verifier, redirect_uri: redirect_uri, scope: pending["scope"])
    end
  end

  def self.exchange(pending:, code:, redirect_uri:)
    case pending.fetch("provider")
    when "github" then [GithubOauth.exchange(code: code, verifier: pending.fetch("verifier"), redirect_uri: redirect_uri)]
    when "slack" then SlackOauth.exchange(code: code, redirect_uri: redirect_uri)
    when "x" then [XOauth.exchange(code: code, verifier: pending.fetch("verifier"), redirect_uri: redirect_uri)]
    when "reddit" then [RedditOauth.exchange(code: code, redirect_uri: redirect_uri)]
    when "mastodon" then [MastodonOauth.exchange(registration: pending, code: code, redirect_uri: redirect_uri)]
    when "facebook" then FacebookOauth.exchange(code: code, redirect_uri: redirect_uri)
    when "google", "gmail", "google_workspace", "outlook"
      [MailboxOauth.new(pending.fetch("provider")).exchange(code: code, verifier: pending.fetch("verifier"), redirect_uri: redirect_uri, scope: pending["scope"])]
    end
  end
end
