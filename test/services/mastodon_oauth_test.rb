# frozen_string_literal: true

require "test_helper"

class MastodonOauthTest < ActiveSupport::TestCase
  test "normalizes server origins and rejects unsafe URL components" do
    assert_equal "https://mastodon.social", MastodonOauth.origin(" Mastodon.social ")
    %w[http://mastodon.social https://user:pass@mastodon.social https://mastodon.social/path https://mastodon.social?query=1 https://mastodon.social:8443].each do |server|
      assert_raises(MastodonOauth::Error) { MastodonOauth.origin(server) }
    end
  end

  test "registration rejects private addresses and mixed DNS answers" do
    [["127.0.0.1"], ["93.184.216.34", "10.0.0.1"], ["::1"]].each do |addresses|
      with_addresses(addresses) do
        assert_raises(MastodonOauth::Error) do
          MastodonOauth.register(server: "mastodon.example", redirect_uri: "https://codedorian.com/callback")
        end
      end
    end
    assert_not_requested :post, "https://mastodon.example/api/v1/apps"
  end

  test "registration does not follow redirects or accept malformed responses" do
    [{ status: 302, headers: { "Location" => "http://127.0.0.1" } }, { body: "invalid" }, { body: "{}" }].each do |response|
      stub_request(:post, "https://mastodon.example/api/v1/apps").to_return(response)
      with_addresses(["93.184.216.34"]) do
        assert_raises(MastodonOauth::Error) do
          MastodonOauth.register(server: "mastodon.example", redirect_uri: "https://codedorian.com/callback")
        end
      end
    end
  end

  def with_addresses(addresses)
    original = Resolv.method(:getaddresses)
    Resolv.define_singleton_method(:getaddresses) { |_host| addresses }
    yield
  ensure
    Resolv.define_singleton_method(:getaddresses, original)
  end
end
