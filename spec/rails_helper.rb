require "spec_helper"

ENV["RAILS_ENV"] ||= "test"

require_relative "../config/environment"

if Rails.env.production?
  abort("The Rails environment is running in production mode!")
end

require "rspec/rails"

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

WebMock.disable_net_connect!(allow_localhost: true)

Capybara.server = :puma, { Silent: true }

if ENV["HEADFULL"]
  Capybara.current_driver = :selenium_chrome
else
  Capybara.current_driver = :selenium_chrome_headless
end

RSpec.configure do |config|
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
  config.include FactoryBot::Syntax::Methods

  config.before { Current.reset }
  config.after { Current.reset }
end
