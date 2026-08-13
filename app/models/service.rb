# frozen_string_literal: true

class Service < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }, touch: true
  has_many :steps, -> { order(:position) }, dependent: :destroy, inverse_of: :service
  has_many :plans, dependent: :destroy
  has_many :subscriptions, through: :plans
  has_many :subscription_executions, through: :subscriptions
  has_many :step_executions, through: :subscription_executions
  has_rich_text :name_en
  has_rich_text :name_fr
  has_rich_text :description_en
  has_rich_text :description_fr
  has_rich_text :body_en
  has_rich_text :body_fr

  scope :where_user, ->(user) { where(user: user) }
  before_validation { self.user ||= Current.user! }
  validate { can!(:update, user) }

  def self.search_fields = { **base_search_fields, **User.associated_search_fields }
  def name = fr? ? name_fr : name_en
  def description = fr? ? description_fr : description_en
  def body = fr? ? body_fr : body_en
  def to_s = Truncate.strip(name&.to_plain_text).presence || t("to_s", id: id)
end
