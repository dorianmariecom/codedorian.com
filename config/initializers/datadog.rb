# frozen_string_literal: true

if Rails.env.production?
  ENV["DD_GIT_COMMIT_SHA"] = ENV.fetch("KAMAL_VERSION") do
    `git rev-parse HEAD`.strip
  end

  require "datadog/auto_instrument"

  Datadog.configure do |c|
    c.env = ENV.fetch("CODE_ENV", "localhost")
    c.service = "codedorian.com"
    c.tracing.sampling.default_rate = 1.0
    c.profiling.enabled = true
    c.appsec.enabled = true
  end
end
