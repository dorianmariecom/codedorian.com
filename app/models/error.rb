# frozen_string_literal: true

class Error < SolidErrors::Error
  MESSAGE_LIMIT = 140
  OMISSION = "…"

  def to_s
    "#{exception_class}: #{message}".truncate(
      MESSAGE_LIMIT,
      omission: OMISSION
    )
  end
end
