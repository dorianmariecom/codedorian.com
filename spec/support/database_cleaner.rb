# frozen_string_literal: true

RSpec.configure do |config|
  config.before(:suite) { DatabaseCleaner.clean_with(:truncation) }
  config.before { DatabaseCleaner.strategy = :transaction }
  config.before { DatabaseCleaner.start }
  config.after { DatabaseCleaner.clean }
  config.before(:all) { DatabaseCleaner.start }
  config.after(:all) { DatabaseCleaner.clean }
end
