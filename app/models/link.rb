# frozen_string_literal: true

class Link < ApplicationRecord
  KINDS = %w[navigation menu tabs].freeze
  VERBS = %w[get post put patch delete].freeze

  scope(:navigation, -> { where(kind: "navigation") })
  scope(:menu, -> { where(kind: "menu") })
  scope(:tabs, -> { where(kind: "tabs") })
  scope(:ordered, -> { order(position: :asc, id: :asc) })

  validates(:kind, inclusion: { in: KINDS })
  validates(:verb, inclusion: { in: VERBS })
  validates(:path_input, presence: true)

  validate { can!(:update, self) }

  def self.search_fields
    {
      kind: {
        node: -> { arel_table[:kind] },
        type: :string
      },
      verb: {
        node: -> { arel_table[:verb] },
        type: :string
      },
      title_en: {
        node: -> { arel_table[:title_en] },
        type: :string
      },
      title_fr: {
        node: -> { arel_table[:title_fr] },
        type: :string
      },
      path_input: {
        node: -> { arel_table[:path_input] },
        type: :string
      },
      visibility_input: {
        node: -> { arel_table[:visibility_input] },
        type: :string
      },
      position: {
        node: -> { arel_table[:position] },
        type: :integer
      },
      **base_search_fields
    }
  end

  def title
    fr? ? title_fr.presence || title_en : title_en.presence || title_fr
  end

  def title_sample
    Truncate.strip(title)
  end

  def visible?(context:)
    return true if visibility_input.blank?

    evaluate(visibility_input, context).truthy?
  rescue Code::Error
    false
  end

  def path(context:)
    evaluate(path_input, context).to_s
  rescue Code::Error
    ""
  end

  def image(platform)
    platform == :ios ? image_ios : image_android
  end

  def to_s
    title_sample.presence || t("to_s", id: id)
  end

  private

  def evaluate(input, context)
    Code.evaluate(input, context: context.to_code.code_to_context)
  end
end
