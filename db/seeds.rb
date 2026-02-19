#!/usr/bin/env ruby
# frozen_string_literal: true

def load_form_seed!(file_name:, root_key:, model:)
  path = Rails.root.join("db/seeds", file_name)
  rows = YAML.safe_load_file(path).fetch(root_key)

  rows.each { |attributes| p(model.find_or_create_by!(attributes)) }
end

ios_config = Config.rpush.ios
android_config = Config.rpush.android

Config.rpush.applications.each do |application|
  ios_config.environments.each do |environment|
    next if Rails.env.test?

    p(
      Rpush::Apnsp8::App.find_or_create_by!(
        name: application[:name],
        environment: environment,
        bundle_id: application[:bundle_id],
        team_id: ios_config.team_id,
        apn_key: ios_config.apn_key,
        apn_key_id: ios_config.apn_key_id
      )
    )
  end

  android_config.environments.each do |environment|
    next if Rails.env.test?

    p(
      Rpush::Fcm::App.find_or_create_by!(
        name: application[:name],
        environment: environment,
        bundle_id: application[:bundle_id],
        firebase_project_id: android_config.firebase_project_id,
        json_key: android_config.json_key.to_json
      )
    )
  end
end

Config.configurations.to_h.each do |name, content|
  next if Rails.env.test?

  p(Configuration.find_or_create_by!(name: name, content: content))
end

FormProgram.destroy_all
FormSchedule.destroy_all
FormDelivery.destroy_all

load_form_seed!(
  file_name: "form_programs.yml",
  root_key: "form_programs",
  model: FormProgram
)

load_form_seed!(
  file_name: "form_schedules.yml",
  root_key: "form_schedules",
  model: FormSchedule
)

load_form_seed!(
  file_name: "form_deliveries.yml",
  root_key: "form_deliveries",
  model: FormDelivery
)
