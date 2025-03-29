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
              uri: "hotwire://fragment/web",
              pull_to_refresh_enabled: true
            }
          },
          { patterns: %w[/new$ /edit$], properties: { context: "modal" } }
        ]
      }
    )
  end
end
