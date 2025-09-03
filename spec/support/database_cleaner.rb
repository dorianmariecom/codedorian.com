# frozen_string_literal: true

RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner[:active_record].strategy = :truncation
    DatabaseCleaner[:active_record].clean_with(:truncation)
  end

  config.before { DatabaseCleaner[:active_record].start }

  config.after { DatabaseCleaner[:active_record].clean }
end
