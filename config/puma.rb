# frozen_string_literal: true

require "concurrent-ruby"

max_threads_count = ENV.fetch("RAILS_MAX_THREADS", 5)
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
processor_count = Concurrent.physical_processor_count
worker_count = Integer(ENV.fetch("WEB_CONCURRENCY") { processor_count })

threads(min_threads_count, max_threads_count)
workers(worker_count) if worker_count > 1
port(ENV.fetch("PORT", 3000))
environment(ENV.fetch("RAILS_ENV", "development"))
pidfile(ENV.fetch("PIDFILE", "tmp/pids/server.pid"))
plugin(:tmp_restart)
