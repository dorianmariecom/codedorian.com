# frozen_string_literal: true

class ConfigurationsController < ApplicationController
  skip_after_action :verify_authorized
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
end
