# frozen_string_literal: true

class ProgramExecution < ApplicationRecord
  STATUSES = %w[initialized created in_progress done errored].freeze

  scope(:initialized, -> { where(status: :initialized) })
  scope(:created, -> { where(status: :created) })
  scope(:in_progress, -> { where(status: :in_progress) })
  scope(:done, -> { where(status: :done) })
  scope(:errored, -> { where(status: :errored) })
  scope(:generating, -> { where(status: %i[initialized created in_progress]) })
  scope(
    :not_generating,
    -> { where.not(status: %i[initialized created in_progress]) }
  )
  scope(:where_user, ->(user) { joins(:user).where(users: { id: user }) })
  scope(:where_program, ->(program) { where(program: program) })

  belongs_to(:program)

  has_one(:user, through: :program)

  validate { can!(:update, program) }
  validates(:status, inclusion: { in: STATUSES })

  after_create_commit { created! if initialized? }

  def self.search_fields
    {
      input: {
        node: -> { arel_table[:input] },
        type: :string
      },
      output: {
        node: -> { arel_table[:output] },
        type: :string
      },
      result: {
        node: -> { arel_table[:result] },
        type: :string
      },
      error_class: {
        node: -> { arel_table[:error_class] },
        type: :string
      },
      error_message: {
        node: -> { arel_table[:error_message] },
        type: :string
      },
      **base_search_fields
    }
  end

  def initialized?
    status == "initialized"
  end

  def initialized!
    update!(status: :initialized)
  end

  def created?
    status == "created"
  end

  def created!
    update!(status: :created)
  end

  def in_progress?
    status == "in_progress"
  end

  def in_progress!
    update!(status: :in_progress)
  end

  def done?
    status == "done"
  end

  def done!
    update!(status: :done)
  end

  def errored?
    status == "errored"
  end

  def errored!
    update!(status: :errored)
  end

  def generating?
    initialized? || created? || in_progress?
  end

  def not_generating?
    !generating?
  end

  def input_sample
    Truncate.strip(input)
  end

  def output_sample
    Truncate.strip(output)
  end

  def result_sample
    Truncate.strip(result)
  end

  def error_sample
    Truncate.strip(error)
  end

  def error_class_sample
    Truncate.strip(error_class)
  end

  def error_message_sample
    Truncate.strip(error_message)
  end

  def error_backtrace_sample
    Truncate.strip(error_backtrace)
  end

  def error_app_backtrace
    Backtrace.app(error_backtrace)
  end

  def translated_status
    t("statuses.#{status}")
  end

  def translated_status_sample
    return if done?
    return if errored?

    translated_status
  end

  def to_s
    translated_status_sample.presence || error_class_sample.presence ||
      error_sample.presence || output_sample.presence ||
      result_sample.presence || input_sample.presence || t("to_s", id: id)
  end
end
