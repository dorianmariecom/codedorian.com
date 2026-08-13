# frozen_string_literal: true

class PlanSchedule < ApplicationRecord
  include ScheduleConcern

  belongs_to :plan, touch: true
  has_one :service, through: :plan
  has_one :user, through: :service
  scope :where_user, ->(user) { joins(plan: :service).where(services: { user_id: user }) }
  validate { can!(:update, plan) }

  def self.search_fields = { interval: { node: -> { arel_table[:interval] }, type: :string }, starts_at: { node: -> { arel_table[:starts_at] }, type: :datetime }, **base_search_fields }
  def self.interval_options = ProgramSchedule.interval_options
  def translated_interval = ProgramSchedule.translated_interval(interval)
  def to_s = translated_interval.presence || t("to_s", id: id)
end
