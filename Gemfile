# frozen_string_literal: true

source "https://rubygems.org"

git_source(:dorian) { |name| "https://github.com/dorianmariecom/#{name}" }
git_source(:rails) { |name| "https://github.com/rails/#{name}" }
git_source(:hotwired) { |name| "https://github.com/hotwired/#{name}" }

ruby "3.3.5"

gem "importmap-rails", dorian: "importmap-rails" # https://github.com/rails/importmap-rails/pull/257, https://github.com/rails/importmap-rails/pull/256
gem "rails", rails: :rails
gem "thruster", require: false
gem "turbo-rails", hotwired: "turbo-rails"
gem "zxcvbn-ruby", require: "zxcvbn"

gem "bcrypt"
gem "brakeman"
gem "bundler-audit"
gem "code-ruby"
gem "dorian"
gem "dorian-arguments"
gem "dotenv-rails"
gem "faker"
gem "heroicon"
gem "http_accept_language"
gem "irb"
gem "kamal"
gem "kaminari"
gem "local_time"
gem "mission_control-jobs"
gem "msgpack"
gem "net-http"
gem "open-uri"
gem "optparse"
gem "paper_trail"
gem "pg"
gem "phonelib"
gem "propshaft"
gem "puma"
gem "pundit"
gem "rack-attack"
gem "rails-i18n"
gem "redis"
gem "rpush"
gem "slim-rails"
gem "solid_cable"
gem "solid_cache"
gem "solid_errors"
gem "solid_queue"
gem "stimulus-rails"
gem "tailwindcss-rails"

group :production do
  gem "rack-timeout"
end

gem "image_processing", "~> 1.14"
