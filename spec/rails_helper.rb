# frozen_string_literal: true

ENV["RAILS_ENV"] = "test"

require_relative "../config/environment"

require "rspec/rails"

Rails.root.glob("spec/support/**/*.rb").each { |f| require f }

RSpec.configure { |config| config.include FactoryBot::Syntax::Methods }
