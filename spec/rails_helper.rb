# frozen_string_literal: true

ENV["RAILS_ENV"] = "test"

require_relative "../config/environment"

ActiveRecord::Base.logger = nil

require "rspec/rails"

RSpec.configure do |config|
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end
