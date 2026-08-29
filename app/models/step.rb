# frozen_string_literal: true

class Step < ApplicationRecord
  def self.format_all
    ApplicationRecord.transaction { find_each(&:format!) }
  end

  belongs_to :service, touch: true
  has_one :user, through: :service
  has_many :step_executions, dependent: :destroy
  has_rich_text :name_en
  has_rich_text :name_fr
  has_rich_text :description_en
  has_rich_text :description_fr
  has_rich_text :body_en
  has_rich_text :body_fr
  scope :where_user,
        ->(user) { joins(:service).where(services: { user_id: user }) }
  validates :position, :offset_seconds, presence: true
  validates :position, uniqueness: { scope: :service_id }
  validate { can!(:update, service) }

  def self.search_fields
    {
      input: {
        node: -> { arel_table[:input] },
        type: :string
      },
      position: {
        node: -> { arel_table[:position] },
        type: :integer
      },
      offset_seconds: {
        node: -> { arel_table[:offset_seconds] },
        type: :integer
      },
      **base_search_fields
    }
  end

  def name = fr? ? name_fr : name_en
  def description = fr? ? description_fr : description_en
  def body = fr? ? body_fr : body_en

  def to_s
    Utils.join(service, Truncate.strip(name&.to_plain_text)).presence ||
      t("to_s", id:)
  end

  def format!
    update!(input: Code.format(input))
  end

  def to_code
    Code::Object::Step.new(
      id: id,
      created_at: created_at,
      input: input,
      offset_seconds: offset_seconds,
      position: position,
      service_id: service_id,
      updated_at: updated_at
    )
  end
end
