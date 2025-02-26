# frozen_string_literal: true

class Schedule < ApplicationRecord
  INTERVALS = [
    "once",
    "5 seconds",
    "10 seconds",
    "30 seconds",
    "1 minute",
    "5 minutes",
    "10 minutes",
    "30 minutes",
    "1 hour",
    "6 hours",
    "12 hours",
    "1 day",
    "2 days",
    "3 days",
    "4 days",
    "5 days",
    "6 days",
    "1 week",
    "2 weeks",
    "3 weeks",
    "4 weeks",
    "1 month",
    "2 months",
    "3 months",
    "4 months",
    "5 months",
    "6 months",
    "1 year",
    "2 years",
    "3 years",
    "4 years",
    "5 years",
    "10 years"
  ].freeze

  PER = {
    "second" => 1.second,
    "seconds" => 1.second,
    "minute" => 1.minute,
    "minutes" => 1.minute,
    "hour" => 1.hour,
    "hours" => 1.hour,
    "day" => 1.day,
    "days" => 1.day,
    "week" => 1.week,
    "weeks" => 1.week,
    "month" => 1.month,
    "months" => 1.month,
    "year" => 1.year,
    "years" => 1.year
  }.freeze

  belongs_to :program, touch: true

  has_one :user, through: :program

  validates :interval, inclusion: { in: INTERVALS }

  validate { can!(:update, program) }

  after_initialize { self.starts_at ||= default_starts_at }
  after_initialize { self.interval ||= default_interval }

  def self.interval_options
    INTERVALS.map do |interval|
      count = interval == "once" ? 0 : interval.split.first.to_i
      per = interval == "once" ? "once" : interval.split.last.pluralize

      [
        t(per, count:),
        interval
      ]
    end
  end

  def once?
    interval == "once"
  end

  def duration
    return 0 if once?

    count * PER.fetch(per)
  end

  def count
    return 0 if once?

    interval.split.first.to_i
  end

  def per
    return "once" if once?

    interval.split.last.pluralize
  end

  def translated_interval
    t(per, count:)
  end

  def next_at
    return starts_at if once?

    at = starts_at

    at += duration while at.past?

    at
  end

  def default_starts_at
    Time.zone.now.beginning_of_hour + 1.hour
  end

  def default_interval
    "1 day"
  end

  def to_s
    t("to_s", id:)
  end
end
