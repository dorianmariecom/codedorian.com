# frozen_string_literal: true

module ScheduleConcern
  extend ActiveSupport::Concern

  DEFAULT_INTERVAL = "1 day"
  WEEKDAYS = %w[sunday monday tuesday wednesday thursday friday saturday].freeze
  COUNTS = %w[first second third fourth fifth last].freeze

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
    "2 hours",
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
    "first monday",
    "first tuesday",
    "first wednesday",
    "first thursday",
    "first friday",
    "first saturday",
    "first sunday",
    "second monday",
    "second tuesday",
    "second wednesday",
    "second thursday",
    "second friday",
    "second saturday",
    "second sunday",
    "third monday",
    "third tuesday",
    "third wednesday",
    "third thursday",
    "third friday",
    "third saturday",
    "third sunday",
    "fourth monday",
    "fourth tuesday",
    "fourth wednesday",
    "fourth thursday",
    "fourth friday",
    "fourth saturday",
    "fourth sunday",
    "fifth monday",
    "fifth tuesday",
    "fifth wednesday",
    "fifth thursday",
    "fifth friday",
    "fifth saturday",
    "fifth sunday",
    "last monday",
    "last tuesday",
    "last wednesday",
    "last thursday",
    "last friday",
    "last saturday",
    "last sunday",
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
    "monday" => 1.day,
    "tuesday" => 1.day,
    "wednesday" => 1.day,
    "thursday" => 1.day,
    "friday" => 1.day,
    "saturday" => 1.day,
    "sunday" => 1.day,
    "week" => 1.week,
    "weeks" => 1.week,
    "month" => 1.month,
    "months" => 1.month,
    "year" => 1.year,
    "years" => 1.year
  }.freeze

  included do
    validates(:interval, inclusion: { in: INTERVALS })

    after_initialize { self.starts_at ||= default_starts_at }
    after_initialize { self.interval ||= default_interval }
  end

  class_methods do
    def interval_options
      INTERVALS.map { |interval| [translated_interval(interval), interval] }
    end

    def translated_interval(interval)
      count, per = interval.split

      if interval == "once"
        t("once")
      elsif count.to_i.to_s == count
        t(per.pluralize, count: count)
      else
        t(interval.parameterize.underscore)
      end
    end
  end

  def once?
    interval == "once"
  end

  def default_starts_at
    Time.zone.now.beginning_of_hour + 1.hour
  end

  def duration
    if once?
      0
    elsif count?
      count * PER.fetch(per)
    else
      1.month
    end
  end

  def count?
    count.is_an?(Integer) && count.positive?
  end

  def count
    count = interval.split.first

    if once?
      0
    elsif count.to_i.to_s == count
      count.to_i
    else
      count
    end
  end

  def per
    per = interval.split.last
    if once?
      "once"
    elsif count?
      per.pluralize
    else
      per
    end
  end

  def translated_interval
    if once?
      t("once")
    elsif count?
      t(per, count: count)
    else
      t(interval.parameterize.underscore)
    end
  end

  def next_at
    if once?
      starts_at
    elsif count?
      at = starts_at
      at += duration while at.past?
      at
    else
      weekday = WEEKDAYS.index(per)
      threshold = [starts_at, Time.zone.now].max
      month_cursor = threshold

      loop do
        at =
          if count == "last"
            last_day = month_cursor.end_of_month.beginning_of_day
            last_day - (1.day * ((last_day.wday - weekday) % WEEKDAYS.size))
          else
            weeks = COUNTS.index(count)

            loop do
              candidate = month_cursor.beginning_of_month
              month = candidate.month
              year = candidate.year
              candidate +=
                (1.day * ((weekday - candidate.wday) % WEEKDAYS.size))
              candidate += weeks.weeks

              if candidate.year == year && candidate.month == month
                break candidate
              end

              month_cursor = month_cursor.next_month
            end
          end

        return at if at >= threshold

        month_cursor = month_cursor.next_month
      end
    end
  end

  def previous_at
    if once?
      starts_at
    elsif count?
      at = starts_at
      return at if at.future?

      now = Time.zone.now
      at += duration while (at + duration) <= now
      at
    else
      weekday = WEEKDAYS.index(per)

      return starts_at if starts_at.future?

      now = Time.zone.now
      month_cursor = starts_at
      at = nil

      loop do
        candidate =
          if count == "last"
            last_day = month_cursor.end_of_month.beginning_of_day
            last_day - (1.day * ((last_day.wday - weekday) % WEEKDAYS.size))
          else
            weeks = COUNTS.index(count)

            loop do
              inner = month_cursor.beginning_of_month
              month = inner.month
              year = inner.year
              inner += (1.day * ((weekday - inner.wday) % WEEKDAYS.size))
              inner += weeks.weeks

              break inner if inner.year == year && inner.month == month

              month_cursor = month_cursor.next_month
            end
          end

        if candidate < starts_at
          month_cursor = month_cursor.next_month
          next
        end
        break if candidate > now

        at = candidate
        month_cursor = month_cursor.next_month
      end

      at || starts_at
    end
  end

  def default_interval
    DEFAULT_INTERVAL
  end
end
