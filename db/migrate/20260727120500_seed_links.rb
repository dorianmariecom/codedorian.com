# frozen_string_literal: true

class SeedLinks < ActiveRecord::Migration[8.1]
  def up
    now = Time.current

    links.each do |attributes|
      Link.insert_all!([attributes.merge(created_at: now, updated_at: now)])
    end
  end

  def down
    Link.delete_all
  end

  private

  def links
    [
      link("navigation", "home", "accueil", '"{locale_prefix}/"', 0, image_ios: "house.fill", image_android: "home"),
      link("navigation", "form", "formulaire", '"{locale_prefix}/form"', 1, image_ios: "checklist", image_android: "assignment"),
      link("navigation", "programs", "programmes", '"{locale_prefix}/users/{Current.user.id}/programs"', 2, visibility_input: "Current.user&.advanced?", image_ios: "laptopcomputer", image_android: "computer"),
      link("navigation", "documentation", "documentation", '"{locale_prefix}/documentation"', 3, visibility_input: "Current.user&.advanced?", image_ios: "document", image_android: "article"),
      link("navigation", "messages", "messages", '"{locale_prefix}/users/{Current.user.id}/messages"', 4, visibility_input: "Current.user.something?", image_ios: "message.fill", image_android: "chat"),
      link("navigation", "account", "compte", '"{locale_prefix}/users/{Current.user.id}"', 5, visibility_input: "Current.user.something?", image_ios: "person.crop.circle.fill", image_android: "account_circle"),
      link("navigation", "register", "s'inscrire", '"{locale_prefix}/users/new"', 6, visibility_input: "Current.user.nothing?", image_ios: "person.badge.plus", image_android: "person_add"),
      link("navigation", "log in", "se connecter", '"{locale_prefix}/session/new"', 7, visibility_input: "Current.user.nothing?", image_ios: "person.crop.circle.fill", image_android: "login"),
      link("navigation", "log out", "se déconnecter", '"{locale_prefix}/session"', 8, visibility_input: "Current.user.something?", image_ios: "rectangle.portrait.and.arrow.right", image_android: "logout", verb: "delete"),
      link("navigation", "about", "à propos", '"{locale_prefix}/about"', 9, image_ios: "info", image_android: "info"),
      link("navigation", "admin", "admin", '"{locale_prefix}/admin"', 10, visibility_input: "Current.user&.admin?", image_ios: "suitcase", image_android: "work"),
      link("navigation", "french", "anglais", "Current.locale == :fr ? en_url : fr_url", 11, image_ios: "flag", image_android: "language"),
      link("menu", "home", "accueil", '"{locale_prefix}/"', 0, image_ios: "house.fill", image_android: "home"),
      link("menu", "form", "formulaire", '"{locale_prefix}/form"', 1, image_ios: "checklist", image_android: "assignment"),
      link("menu", "programs", "programmes", '"{locale_prefix}/users/{Current.user.id}/programs"', 2, visibility_input: "Current.user&.advanced?", image_ios: "laptopcomputer", image_android: "computer"),
      link("menu", "documentation", "documentation", '"{locale_prefix}/documentation"', 3, visibility_input: "Current.user&.advanced?", image_ios: "document", image_android: "article"),
      link("menu", "messages", "messages", '"{locale_prefix}/users/{Current.user.id}/messages"', 4, visibility_input: "Current.user.something?", image_ios: "message.fill", image_android: "chat"),
      link("menu", "account", "compte", '"{locale_prefix}/users/{Current.user.id}"', 5, visibility_input: "Current.user.something?", image_ios: "person.crop.circle.fill", image_android: "account_circle"),
      link("menu", "register", "s'inscrire", '"{locale_prefix}/users/new"', 6, visibility_input: "Current.user.nothing?", image_ios: "person.badge.plus", image_android: "person_add"),
      link("menu", "log in", "se connecter", '"{locale_prefix}/session/new"', 7, visibility_input: "Current.user.nothing?", image_ios: "person.crop.circle.fill", image_android: "login"),
      link("menu", "log out", "se déconnecter", '"{locale_prefix}/session"', 8, visibility_input: "Current.user.something?", image_ios: "rectangle.portrait.and.arrow.right", image_android: "logout", verb: "delete"),
      link("menu", "about", "à propos", '"{locale_prefix}/about"', 9, image_ios: "info", image_android: "info"),
      link("menu", "admin", "admin", '"{locale_prefix}/admin"', 10, visibility_input: "Current.user&.admin?", image_ios: "suitcase", image_android: "work"),
      link("menu", "french", "anglais", "Current.locale == :fr ? en_url : fr_url", 11, image_ios: "flag", image_android: "language"),
      link("tabs", "programs", "programmes", '"{locale_prefix}/users/{Current.user.id}/programs"', 0, visibility_input: "Current.user&.advanced?", image_ios: "laptopcomputer", image_android: "computer", default: true),
      link("tabs", "messages", "messages", '"{locale_prefix}/users/{Current.user.id}/messages"', 1, visibility_input: "Current.user.something?", image_ios: "message.fill", image_android: "chat"),
      link("tabs", "documentation", "documentation", '"{locale_prefix}/documentation"', 2, visibility_input: "Current.user&.advanced?", image_ios: "document", image_android: "article"),
      link("tabs", "account", "compte", '"{locale_prefix}/users/{Current.user.id}"', 2, visibility_input: "Current.user&.simple?", image_ios: "person.crop.circle.fill", image_android: "account_circle"),
      link("tabs", "form", "formulaire", '"{locale_prefix}/form"', 3, image_ios: "checklist", image_android: "assignment"),
      link("tabs", "account", "compte", '"{locale_prefix}/users/{Current.user.id}"', 4, visibility_input: "Current.user&.advanced?", image_ios: "person.crop.circle.fill", image_android: "account_circle"),
      link("tabs", "register", "s'inscrire", '"{locale_prefix}/users/new"', 5, visibility_input: "Current.user.nothing?", image_ios: "person.badge.plus", image_android: "person_add"),
      link("tabs", "log in", "se connecter", '"{locale_prefix}/session/new"', 6, visibility_input: "Current.user.nothing?", image_ios: "person.crop.circle.fill", image_android: "login")
    ]
  end

  def link(kind, title_en, title_fr, path_input, position, image_ios:, image_android:, visibility_input: nil, default: false, verb: "get")
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
end
