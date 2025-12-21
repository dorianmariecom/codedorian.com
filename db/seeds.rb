#!/usr/bin/env ruby
# frozen_string_literal: true

rpush_config = Rails.application.credentials.rpush
ios_config = rpush_config.ios
android_config = rpush_config.android

rpush_config.applications.each do |application|
  ios_config.environments.each do |environment|
    Rpush::Apnsp8::App.find_or_create_by!(
      name: application[:name],
      environment: environment,
      bundle_id: application[:bundle_id],
      team_id: ios_config.team_id,
      apn_key: ios_config.apn_key,
      apn_key_id: ios_config.apn_key_id
    )
  end

  android_config.environments.each do |environment|
    Rpush::Fcm::App.find_or_create_by!(
      name: application[:name],
      environment: environment,
      bundle_id: application[:bundle_id],
      firebase_project_id: android_config.firebase_project_id,
      json_key: android_config.json_key.to_json
    )
  end
end
