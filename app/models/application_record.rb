# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include Pundit::Authorization
  include CanConcern

  extend Pundit::Authorization
  extend CanConcern

  broadcasts_refreshes
  has_paper_trail
  primary_abstract_class

  def self.current_user
    Current.user_or_guest
  end

  def self.log_in(user)
    Current.user ||= user
  end

  def self.model_singular
    name.underscore.singularize.to_sym
  end

  def self.model_plural
    name.underscore.pluralize.to_sym
  end

  def self.t(key, ...)
    I18n.t("#{model_plural}.model.#{key}", ...)
  end

  def alert
    errors.full_messages.to_sentence
  end

  def current_user
    Current.user_or_guest
  end

  def log_in(user)
    Current.user ||= user
  end

  def model_singular
    self.class.name.underscore.singularize.to_sym
  end

  def model_plural
    self.class.name.underscore.pluralize.to_sym
  end

  def t(key, ...)
    I18n.t("#{model_plural}.model.#{key}", ...)
  end
end
