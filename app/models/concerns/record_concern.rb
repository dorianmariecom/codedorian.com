# frozen_string_literal: true

module RecordConcern
  extend ActiveSupport::Concern

  included do
    include(ActionView::RecordIdentifier)
    include(Pundit::Authorization)
    include(CanConcern)
    include(PerformLaterConcern)
    include(Search)

    extend(Pundit::Authorization)
    extend(CanConcern)

    broadcasts_refreshes
  end

  class_methods do
    def base_search_fields
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

    def current_user
      Current.user_or_guest
    end

    def log_in(user)
      Current.user ||= user
    end

    def model_singular
      name.underscore.singularize.to_sym
    end

    def model_plural
      name.underscore.pluralize.to_sym
    end

    def t(key, ...)
      I18n.t("#{model_plural}.model.#{key}", ...)
    end
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

  def url_helpers
    Rails.application.routes.url_helpers
  end
end
