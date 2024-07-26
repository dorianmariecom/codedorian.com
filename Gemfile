# frozen_string_literal: true

source "https://rubygems.org"

git_source(:dorian) { |name| "https://github.com/dorianmariecom/#{name}" }
git_source(:rails) { |name| "https://github.com/rails/#{name}" }

ruby "3.3.3"

gem "bcrypt"
gem "brakeman"
gem "bundler-audit"
gem "code-ruby"
gem "dorian"
gem "dotenv-rails"
gem "faker"
gem "heroicon"
gem "importmap-rails", dorian: "importmap-rails"
gem "irb"
gem "jbuilder"
gem "kamal"
gem "kaminari"
gem "mission_control-jobs", dorian: "mission_control-jobs"
gem "net-http"
gem "open-uri"
gem "optparse"
gem "pg"
gem "phonelib"
gem "propshaft"
gem "puma"
gem "pundit"
gem "rack-attack"
gem "rails", rails: :rails
gem "redis"
gem "rubocop"
gem "slim-rails"
gem "solid_errors", dorian: :solid_errors
gem "solid_queue", rails: :solid_queue
gem "stimulus-rails"
gem "tailwindcss-rails"
gem "turbo-rails"
gem "zxcvbn-ruby", require: "zxcvbn"

group :production do
  gem "rack-timeout"
end

group :development do
  gem "rubocop-rails-omakase"
end

group :test do
  gem "capybara"
  gem "factory_bot_rails"
  gem "rspec-rails"
  gem "selenium-webdriver"
  gem "sinatra"
  gem "timecop"
  gem "webmock"
end
