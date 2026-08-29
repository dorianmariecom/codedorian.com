# frozen_string_literal: true

class SubscriptionExecution < ApplicationRecord
  STATUSES = %w[initialized in_progress done errored].freeze
  belongs_to :subscription, touch: true
  has_one :user, through: :subscription
  has_one :plan, through: :subscription
  has_one :service, through: :plan
  has_many :step_executions, dependent: :destroy
  scope :where_user,
        ->(user) do
          joins(:subscription).where(subscriptions: { user_id: user })
        end
  scope :where_subscription,
        ->(subscription) { where(subscription: subscription) }
  scope :where_plan,
        ->(plan) do
          joins(:subscription).where(subscriptions: { plan_id: plan })
        end
  scope :where_service,
        ->(service) do
          joins(subscription: :plan).where(plans: { service_id: service })
        end
  validates :status, inclusion: { in: STATUSES }
  validate { can!(:update, subscription) }

  def self.search_fields
    {
      status: {
        node: -> { arel_table[:status] },
        type: :string
      },
      **base_search_fields
    }
  end

  def done? = status == "done"
  def done! = update!(status: :done)
  def errored? = status == "errored"
  def errored! = update!(status: :errored)
  def generating? = status.in?(%w[initialized in_progress])

  def finish!
    step_executions.reload
    return errored! if step_executions.any?(&:errored?)
    return if step_executions.any?(&:generating?)

    done!
  end

  def in_progress? = status == "in_progress"
  def translated_status = t("statuses.#{status}")

  def translated_status_sample
    Truncate.strip(translated_status)
  end

  def subscription_sample
    Truncate.strip(subscription)
  end

  def to_s
    Utils.join(
      translated_status_sample.presence || subscription_sample,
      id_sample
    ).presence || t("to_s", id:)
  end

  def to_code
    Code::Object::SubscriptionExecution.new(
      id: id,
      created_at: created_at,
      status: status,
      subscription_id: subscription_id,
      updated_at: updated_at
    )
  end
end
