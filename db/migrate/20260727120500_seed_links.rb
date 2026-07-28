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
      link("navigation", "home", "accueil", '"/"', 0, image_ios: "house.fill", image_android: "home"),
      link("navigation", "form", "formulaire", '"/form"', 1, image_ios: "checklist", image_android: "assignment"),
      link("navigation", "documentation", "documentation", '"/documentation"', 2, visibility_input: "Current.user&.advanced?", image_ios: "document", image_android: "article"),
      link("navigation", "programs", "programmes", '"/users/{Current.user.id}/programs"', 3, visibility_input: "Current.user&.advanced?", image_ios: "laptopcomputer", image_android: "computer"),
      link("navigation", "messages", "messages", '"/users/{Current.user.id}/messages"', 4, visibility_input: "Current.user.something?", image_ios: "message.fill", image_android: "chat"),
      link("navigation", "account", "compte", '"/users/{Current.user.id}"', 5, visibility_input: "Current.user.something?", image_ios: "person.crop.circle.fill", image_android: "account_circle"),
      link("navigation", "register", "s'inscrire", '"/users/new"', 6, visibility_input: "Current.user.nothing?", image_ios: "person.badge.plus", image_android: "person_add"),
      link("navigation", "log in", "se connecter", '"/session/new"', 7, visibility_input: "Current.user.nothing?", image_ios: "person.crop.circle.fill", image_android: "login"),
      link("navigation", "log out", "se déconnecter", '"/session"', 8, visibility_input: "Current.user.something?", image_ios: "rectangle.portrait.and.arrow.right", image_android: "logout", verb: "delete"),
      link("navigation", "about", "à propos", '"/about"', 9, image_ios: "info", image_android: "info"),
      link("navigation", "admin", "admin", '"/admin"', 10, visibility_input: "Current.user&.admin?", image_ios: "suitcase", image_android: "work"),
      link("navigation", "french", "anglais", "Current.locale == :fr ? en_url : fr_url", 11, image_ios: "flag", image_android: "language"),
      link("menu", "home", "accueil", '"/"', 0, image_ios: "house.fill", image_android: "home"),
      link("menu", "form", "formulaire", '"/form"', 1, image_ios: "checklist", image_android: "assignment"),
      link("menu", "documentation", "documentation", '"/documentation"', 2, visibility_input: "Current.user&.advanced?", image_ios: "document", image_android: "article"),
      link("menu", "programs", "programmes", '"/users/{Current.user.id}/programs"', 3, visibility_input: "Current.user&.advanced?", image_ios: "laptopcomputer", image_android: "computer"),
      link("menu", "messages", "messages", '"/users/{Current.user.id}/messages"', 4, visibility_input: "Current.user.something?", image_ios: "message.fill", image_android: "chat"),
      link("menu", "account", "compte", '"/users/{Current.user.id}"', 5, visibility_input: "Current.user.something?", image_ios: "person.crop.circle.fill", image_android: "account_circle"),
      link("menu", "register", "s'inscrire", '"/users/new"', 6, visibility_input: "Current.user.nothing?", image_ios: "person.badge.plus", image_android: "person_add"),
      link("menu", "log in", "se connecter", '"/session/new"', 7, visibility_input: "Current.user.nothing?", image_ios: "person.crop.circle.fill", image_android: "login"),
      link("menu", "log out", "se déconnecter", '"/session"', 8, visibility_input: "Current.user.something?", image_ios: "rectangle.portrait.and.arrow.right", image_android: "logout", verb: "delete"),
      link("menu", "about", "à propos", '"/about"', 9, image_ios: "info", image_android: "info"),
      link("menu", "admin", "admin", '"/admin"', 10, visibility_input: "Current.user&.admin?", image_ios: "suitcase", image_android: "work"),
      link("menu", "french", "anglais", "Current.locale == :fr ? en_url : fr_url", 11, image_ios: "flag", image_android: "language"),
      link("tabs", "programs", "programmes", '"/users/{Current.user.id}/programs"', 0, visibility_input: "Current.user&.advanced?", image_ios: "laptopcomputer", image_android: "computer", default: true),
      link("tabs", "form", "formulaire", '"/form"', 1, image_ios: "checklist", image_android: "assignment"),
      link("tabs", "documentation", "documentation", '"/documentation"', 2, visibility_input: "Current.user&.advanced?", image_ios: "document", image_android: "article"),
      link("tabs", "messages", "messages", '"/users/{Current.user.id}/messages"', 3, visibility_input: "Current.user&.simple?", image_ios: "message.fill", image_android: "chat", default: true),
      link("tabs", "account", "compte", '"/users/{Current.user.id}"', 4, visibility_input: "Current.user.something?", image_ios: "person.crop.circle.fill", image_android: "account_circle"),
      link("tabs", "register", "s'inscrire", '"/users/new"', 5, visibility_input: "Current.user.nothing?", image_ios: "person.badge.plus", image_android: "person_add"),
      link("tabs", "log in", "se connecter", '"/session/new"', 6, visibility_input: "Current.user.nothing?", image_ios: "person.crop.circle.fill", image_android: "login")
    ]
  end

  def link(kind, title_en, title_fr, path_input, position, visibility_input: nil, image_ios:, image_android:, default: false, verb: "get")
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
