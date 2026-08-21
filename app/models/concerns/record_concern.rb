# frozen_string_literal: true

module RecordConcern
  extend ActiveSupport::Concern

  included do
    include(Memoized)
    include(ActionView::RecordIdentifier)
    include(Pundit::Authorization)
    include(CanConcern)
    include(PerformLaterConcern)
    include(Search)

    extend(Memoized)
    extend(Pundit::Authorization)
    extend(CanConcern)

    broadcasts_refreshes
  end

  class_methods do
    def base_search_fields
      {
        **rich_text_search_fields,
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

    def rich_text_search_fields
      rich_text_association_names.to_h do |association_name|
        attribute_name = association_name.to_s.delete_prefix("rich_text_")
        rich_texts =
          Arel::Table.new(:action_text_rich_texts).alias(
            "#{table_name}_#{attribute_name}_rich_texts"
          )
        join =
          arel_table
            .join(rich_texts, Arel::Nodes::OuterJoin)
            .on(
              rich_texts[:record_type]
                .eq(polymorphic_name)
                .and(rich_texts[:record_id].eq(arel_table[:id]))
                .and(rich_texts[:name].eq(attribute_name))
            )
            .join_sources

        [
          attribute_name.to_sym,
          {
            node: -> { rich_texts[:body] },
            relation: ->(scope) { scope.joins(join) },
            type: :string
          }
        ]
      end
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

  def fr?
    I18n.locale == :fr
  end

  def en?
    I18n.locale = :en
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end
end
