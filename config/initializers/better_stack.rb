# frozen_string_literal: true

Rails.logger =
  Logtail::Logger.create_default_logger(
    ENV.fetch("BETTER_STACK_SOURCE_TOKEN") { Config.better_stack.source_token },
    ingesting_host:
      ENV.fetch("BETTER_STACK_INGESTING_HOST") do
        Config.better_stack.ingesting_host
      end
  )
