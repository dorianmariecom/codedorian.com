#!/usr/bin/env ruby
# frozen_string_literal: true

Current.with(user: User.new(admin: true)) do
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

  link =
    lambda do |kind, title_en, title_fr, path_input, position, image_ios:, image_android:, visibility_input: nil, default: false, verb: "get"|
      {
        kind: kind,
        title_en: title_en,
        title_fr: title_fr,
        path_input: path_input,
        verb: verb,
        visibility_input: visibility_input,
        image_ios: image_ios,
        image_android: image_android,
        position: position,
        default: default
      }
    end

  links = [
    link.call(
      "navigation",
      "home",
      "accueil",
      '"{locale_prefix}/"',
      0,
      image_ios: "house.fill",
      image_android: "home"
    ),
    link.call(
      "navigation",
      "form",
      "formulaire",
      '"{locale_prefix}/form"',
      1,
      image_ios: "checklist",
      image_android: "assignment"
    ),
    link.call(
      "navigation",
      "programs",
      "programmes",
      '"{locale_prefix}/users/{Current.user.id}/programs"',
      2,
      visibility_input: "Current.user&.advanced?",
      image_ios: "laptopcomputer",
      image_android: "computer"
    ),
    link.call(
      "navigation",
      "documentation",
      "documentation",
      '"{locale_prefix}/documentation"',
      3,
      visibility_input: "Current.user&.advanced?",
      image_ios: "document",
      image_android: "article"
    ),
    link.call(
      "navigation",
      "messages",
      "messages",
      '"{locale_prefix}/users/{Current.user.id}/messages"',
      4,
      visibility_input: "Current.user.something?",
      image_ios: "message.fill",
      image_android: "chat"
    ),
    link.call(
      "navigation",
      "account",
      "compte",
      '"{locale_prefix}/users/{Current.user.id}"',
      5,
      visibility_input: "Current.user.something?",
      image_ios: "person.crop.circle.fill",
      image_android: "account_circle"
    ),
    link.call(
      "navigation",
      "register",
      "s'inscrire",
      '"{locale_prefix}/users/new"',
      6,
      visibility_input: "Current.user.nothing?",
      image_ios: "person.badge.plus",
      image_android: "person_add"
    ),
    link.call(
      "navigation",
      "log in",
      "se connecter",
      '"{locale_prefix}/session/new"',
      7,
      visibility_input: "Current.user.nothing?",
      image_ios: "person.crop.circle.fill",
      image_android: "login"
    ),
    link.call(
      "navigation",
      "log out",
      "se déconnecter",
      '"{locale_prefix}/session"',
      8,
      visibility_input: "Current.user.something?",
      image_ios: "rectangle.portrait.and.arrow.right",
      image_android: "logout",
      verb: "delete"
    ),
    link.call(
      "navigation",
      "about",
      "à propos",
      '"{locale_prefix}/about"',
      9,
      image_ios: "info",
      image_android: "info"
    ),
    link.call(
      "navigation",
      "admin",
      "admin",
      '"{locale_prefix}/admin"',
      10,
      visibility_input: "Current.user&.admin?",
      image_ios: "suitcase",
      image_android: "work"
    ),
    link.call(
      "navigation",
      "french",
      "anglais",
      "Current.locale == :fr ? en_url : fr_url",
      11,
      image_ios: "flag",
      image_android: "language"
    ),
    link.call(
      "menu",
      "home",
      "accueil",
      '"{locale_prefix}/"',
      0,
      image_ios: "house.fill",
      image_android: "home"
    ),
    link.call(
      "menu",
      "form",
      "formulaire",
      '"{locale_prefix}/form"',
      1,
      image_ios: "checklist",
      image_android: "assignment"
    ),
    link.call(
      "menu",
      "programs",
      "programmes",
      '"{locale_prefix}/users/{Current.user.id}/programs"',
      2,
      visibility_input: "Current.user&.advanced?",
      image_ios: "laptopcomputer",
      image_android: "computer"
    ),
    link.call(
      "menu",
      "documentation",
      "documentation",
      '"{locale_prefix}/documentation"',
      3,
      visibility_input: "Current.user&.advanced?",
      image_ios: "document",
      image_android: "article"
    ),
    link.call(
      "menu",
      "messages",
      "messages",
      '"{locale_prefix}/users/{Current.user.id}/messages"',
      4,
      visibility_input: "Current.user.something?",
      image_ios: "message.fill",
      image_android: "chat"
    ),
    link.call(
      "menu",
      "account",
      "compte",
      '"{locale_prefix}/users/{Current.user.id}"',
      5,
      visibility_input: "Current.user.something?",
      image_ios: "person.crop.circle.fill",
      image_android: "account_circle"
    ),
    link.call(
      "menu",
      "register",
      "s'inscrire",
      '"{locale_prefix}/users/new"',
      6,
      visibility_input: "Current.user.nothing?",
      image_ios: "person.badge.plus",
      image_android: "person_add"
    ),
    link.call(
      "menu",
      "log in",
      "se connecter",
      '"{locale_prefix}/session/new"',
      7,
      visibility_input: "Current.user.nothing?",
      image_ios: "person.crop.circle.fill",
      image_android: "login"
    ),
    link.call(
      "menu",
      "log out",
      "se déconnecter",
      '"{locale_prefix}/session"',
      8,
      visibility_input: "Current.user.something?",
      image_ios: "rectangle.portrait.and.arrow.right",
      image_android: "logout",
      verb: "delete"
    ),
    link.call(
      "menu",
      "about",
      "à propos",
      '"{locale_prefix}/about"',
      9,
      image_ios: "info",
      image_android: "info"
    ),
    link.call(
      "menu",
      "admin",
      "admin",
      '"{locale_prefix}/admin"',
      10,
      visibility_input: "Current.user&.admin?",
      image_ios: "suitcase",
      image_android: "work"
    ),
    link.call(
      "menu",
      "french",
      "anglais",
      "Current.locale == :fr ? en_url : fr_url",
      11,
      image_ios: "flag",
      image_android: "language"
    ),
    link.call(
      "tabs",
      "programs",
      "programmes",
      '"{locale_prefix}/users/{Current.user.id}/programs"',
      0,
      visibility_input: "Current.user&.advanced?",
      image_ios: "laptopcomputer",
      image_android: "computer",
      default: true
    ),
    link.call(
      "tabs",
      "messages",
      "messages",
      '"{locale_prefix}/users/{Current.user.id}/messages"',
      1,
      visibility_input: "Current.user.something?",
      image_ios: "message.fill",
      image_android: "chat"
    ),
    link.call(
      "tabs",
      "documentation",
      "documentation",
      '"{locale_prefix}/documentation"',
      2,
      visibility_input: "Current.user&.advanced?",
      image_ios: "document",
      image_android: "article"
    ),
    link.call(
      "tabs",
      "account",
      "compte",
      '"{locale_prefix}/users/{Current.user.id}"',
      2,
      visibility_input: "Current.user&.simple?",
      image_ios: "person.crop.circle.fill",
      image_android: "account_circle"
    ),
    link.call(
      "tabs",
      "form",
      "formulaire",
      '"{locale_prefix}/form"',
      3,
      image_ios: "checklist",
      image_android: "assignment"
    ),
    link.call(
      "tabs",
      "account",
      "compte",
      '"{locale_prefix}/users/{Current.user.id}"',
      4,
      visibility_input: "Current.user&.advanced?",
      image_ios: "person.crop.circle.fill",
      image_android: "account_circle"
    ),
    link.call(
      "tabs",
      "register",
      "s'inscrire",
      '"{locale_prefix}/users/new"',
      5,
      visibility_input: "Current.user.nothing?",
      image_ios: "person.badge.plus",
      image_android: "person_add"
    ),
    link.call(
      "tabs",
      "log in",
      "se connecter",
      '"{locale_prefix}/session/new"',
      6,
      visibility_input: "Current.user.nothing?",
      image_ios: "person.crop.circle.fill",
      image_android: "login"
    )
  ]

  links.each do |attributes|
    next if Rails.env.test?

    p(Link.find_or_create_by!(**attributes))
  end
end
