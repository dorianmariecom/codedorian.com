# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include ActionView::RecordIdentifier
  include Pundit::Authorization
  include CanConcern
  include Search

  extend Pundit::Authorization
  extend CanConcern

  broadcasts_refreshes
  has_paper_trail
  primary_abstract_class

  def self.base_search_fields
    {
      id: {
        node: -> { arel_table[:id] },
        type: :integer
      },
      updated_at: {
        node: -> { arel_table[:updated_at] },
        type: :datetime
      },
      created_at: {
        node: -> { arel_table[:created_at] },
        type: :datetime
      }
    }
  end

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
