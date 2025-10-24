# frozen_string_literal: true

class Error < SolidErrors::Error
  include(Search)

  has_many :occurrences, class_name: "ErrorOccurrence", dependent: :destroy

  scope :where_user, ->(user) { joins(:occurrences).where(<<~SQL.squish, user) }
    (
      ((solid_errors_occurrences.context::jsonb)->>'user')::jsonb
    )->>'id'::bigint = ?
  SQL

  def self.search_fields
    {
      id: {
        node: -> { arel_table[:id] },
        type: :integer
      },
      exception_class: {
        node: -> { arel_table[:exception_class] },
        type: :string
      },
      fingerprint: {
        node: -> { arel_table[:fingerprint] },
        type: :string
      },
      message: {
        node: -> { arel_table[:message] },
        type: :string
      },
      severity: {
        node: -> { arel_table[:severity] },
        type: :string
      },
      source: {
        node: -> { arel_table[:source] },
        type: :string
      },
      resolved_at: {
        node: -> { arel_table[:resolved_at] },
        type: :datetime
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

  def self.model_singular
    name.underscore.singularize.to_sym
  end

  def self.model_plural
    name.underscore.pluralize.to_sym
  end

  def model_singular
    self.class.name.underscore.singularize.to_sym
  end

  def model_plural
    self.class.name.underscore.pluralize.to_sym
  end

  def to_s
    Truncate.strip("#{exception_class}: #{message}")
  end
end
