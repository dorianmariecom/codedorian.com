#!/usr/bin/env ruby
# frozen_string_literal: true

(config = Rails.application.credentials.apple)
  .applications
  .each do |application|
  config.environments.each do |environment|
    puts "#{application[:name]} | #{application[:bundle_id]} | #{environment}... "

    if Rpush::Apnsp8::App.find_by(name: application[:name], environment:)
      puts "skipping"
    else
      app = Rpush::Apnsp8::App.new
      app.name = application[:name]
      app.apn_key = config.apn_key
      app.environment = environment
      app.apn_key_id = config.apn_key_id
      app.team_id = config.team_id
      app.bundle_id = application[:bundle_id]
      app.save!
      puts "done"
    end
  end
end
