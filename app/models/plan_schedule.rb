# frozen_string_literal: true

class PlanSchedule < ApplicationRecord
  scope :where_service,
        ->(service) { where(plan_id: Plan.where_service(service).select(:id)) }
  include ScheduleConcern

  attribute :time_zone, :string, default: -> { Time.zone.tzinfo.name }
  validates :time_zone, presence: true
  validate do
    errors.add(:time_zone, :invalid) unless ActiveSupport::TimeZone[time_zone]
  end

  def starts_at=(value)
    value = Time.find_zone!(time_zone).parse(value) if value.is_a?(String) &&
      value.present?
    super
  end

  def local_starts_at
    starts_at.in_time_zone(time_zone)
  end

  def starts_at_in(time_zone:)
    local = local_starts_at
    Time.find_zone!(time_zone).local(
      local.year,
      local.month,
      local.day,
      local.hour,
      local.min,
      local.sec + local.subsec
    )
  end

  belongs_to :plan, touch: true
  has_one :service, through: :plan
  has_one :user, through: :service
  scope :where_user,
        ->(user) { joins(plan: :service).where(services: { user_id: user }) }
  scope :where_plan, ->(plan) { where(plan: plan) }
  validate { can!(:update, plan) }

  def self.search_fields
    {
      interval: {
        node: -> { arel_table[:interval] },
        type: :string
      },
      starts_at: {
        node: -> { arel_table[:starts_at] },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def self.interval_options = ProgramSchedule.interval_options
  def translated_interval = ProgramSchedule.translated_interval(interval)

  def translated_interval_sample
    Truncate.strip(translated_interval)
  end

  def plan_sample
    Truncate.strip(plan)
  end

  def to_s
    Utils.join(translated_interval_sample, plan_sample, id_sample).presence ||
      t("to_s", id:)
  end

  def to_code
    Code::Object::PlanSchedule.new(
      id: id,
      created_at: created_at,
      interval: interval,
      plan_id: plan_id,
      starts_at: starts_at,
      updated_at: updated_at
    )
  end
end
