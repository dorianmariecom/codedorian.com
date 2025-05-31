# frozen_string_literal: true

class ConfigurationsController < ApplicationController
  before_action { authorize :configuration }
  skip_after_action :verify_policy_scoped

  def ios_v1
    render(
      json: {
        settings: {
        },
        rules: [
          { patterns: %w[/new$ /edit$], properties: { context: "modal" } }
        ]
      }
    )
  end

  def android_v1
    render(
      json: {
        settings: {
        },
        rules: [
          {
            patterns: [".*"],
            properties: {
              context: "default",
              uri: "hotwire://fragment/web",
              pull_to_refresh_enabled: true
            }
          }
        ]
      }
    )
  end

  def ios_v2
    render(
      json: {
        settings: {
        },
        rules: [
          { patterns: %w[/new$ /edit$], properties: { context: "modal" } },
          {
            patterns: %w[users/new$ session/new$],
            properties: {
              context: "default"
            }
          }
        ]
      }
    )
  end

  def android_v2
    render(
      json: {
        settings: {
        },
        rules: [
          {
            patterns: [".*"],
            properties: {
              context: "default",
              uri: "hotwire://fragment/web",
              pull_to_refresh_enabled: true
            }
          },
          {
            patterns: %w[(/new$ /edit$],
            properties: {
              context: "modal",
              uri: "hotwire://fragment/web/modal/sheet",
              pull_to_refresh_enabled: false
            }
          },
          {
            patterns: %w[users/new$ session/new$],
            properties: {
              context: "default",
              uri: "hotwire://fragment/web",
              pull_to_refresh_enabled: true
            }
          }
        ]
      }
    )
  end
end
