# frozen_string_literal: true

Rpush.configure do |config|
  config.client = :active_record
  config.push_poll = 2
  config.batch_size = 100
  config.pid_file = "tmp/rpush.pid"
  config.log_file = "log/rpush.log"
  config.log_level = Rails.logger.level
end
