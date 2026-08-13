# frozen_string_literal: true

class Plan < ApplicationRecord
  belongs_to :service, touch: true
  has_one :user, through: :service
  has_many :plan_schedules, dependent: :destroy
  accepts_nested_attributes_for :plan_schedules, allow_destroy: true
  has_many :subscriptions, dependent: :destroy
  has_rich_text :name_en
  has_rich_text :name_fr
  has_rich_text :description_en
  has_rich_text :description_fr
  has_rich_text :body_en
  has_rich_text :body_fr
  scope :where_user, ->(user) { joins(:service).where(services: { user_id: user }) }
  validate { can!(:update, service) }

  def self.search_fields = { **base_search_fields }
  def name = fr? ? name_fr : name_en
  def description = fr? ? description_fr : description_en
  def body = fr? ? body_fr : body_en
  def to_s = Truncate.strip(name&.to_plain_text).presence || t("to_s", id: id)
end
