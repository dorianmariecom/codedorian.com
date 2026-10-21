# frozen_string_literal: true

class SubscriptionSetting
  INTEGER_PATTERN = /\A[+-]?\d+\z/
  INTEGER_RADIX = 10
  BOOLEAN_VALUES = %w[true false 1 0].freeze
  TRUE_VALUES = %w[true 1].freeze
  HTTP_METHODS = %w[get head post put patch delete options].freeze
  URL_SCHEMES = %w[http https].freeze
  NUMERIC_KINDS = %w[integer number integer_list].freeze

  def self.parse(field, value)
    text = value.to_s.strip.presence || field.default_value.to_s.strip.presence
    return nil if text.nil?

    result =
      case field.kind
      when "integer"
        raise ArgumentError unless text.match?(INTEGER_PATTERN)

        Integer(text, INTEGER_RADIX)
      when "number"
        number = BigDecimal(text)
        raise ArgumentError unless number.finite? && number.to_f.finite?

        number.to_f
      when "boolean"
        raise ArgumentError unless BOOLEAN_VALUES.include?(text)

        TRUE_VALUES.include?(text)
      when "date"
        date = Date.iso8601(text)
        raise ArgumentError unless date.iso8601 == text

        date
      when "string_list"
        items = text.split(",").map(&:strip).reject(&:empty?).uniq
        raise ArgumentError if items.empty?

        items
      when "integer_list"
        text
          .split(",", -1)
          .map do |item|
            raise ArgumentError unless item.strip.match?(INTEGER_PATTERN)

            Integer(item.strip, INTEGER_RADIX)
          end
          .uniq
      when "birthdays"
        text
          .split(",", -1)
          .map do |entry|
            name, separator, birthday_text = entry.strip.rpartition(" ")
            raise ArgumentError if name.blank? || separator.empty?

            birthday = Date.iso8601(birthday_text)
            unless birthday.iso8601 == birthday_text && birthday <= Date.current
              raise ArgumentError
            end

            { "name" => name, "birthday" => birthday.iso8601 }
          end
      when "time_zone"
        raise ArgumentError unless ActiveSupport::TimeZone[text]

        text
      when "http_method"
        method = text.downcase
        raise ArgumentError unless HTTP_METHODS.include?(method)

        method
      when "url"
        uri = URI.parse(text)
        unless URL_SCHEMES.include?(uri.scheme) && uri.host.present? &&
                 uri.userinfo.nil?
          raise ArgumentError
        end

        text
      when "email_address"
        unless text.match?(EmailAddress::EMAIL_ADDRESS_REGEXP)
          raise ArgumentError
        end

        text.downcase
      when "phone_number"
        parsed = Phonelib.parse(text)
        raise ArgumentError unless parsed.valid?

        parsed.e164
      else
        text
      end
    if NUMERIC_KINDS.include?(field.kind)
      Array(result).each do |number|
        raise ArgumentError if field.minimum && number < field.minimum
        raise ArgumentError if field.maximum && number > field.maximum
      end
    end
    result
  rescue URI::InvalidURIError
    raise ArgumentError
  end
end
