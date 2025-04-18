# frozen_string_literal: true

Rails.application.config.after_initialize do
  module SolidErrors
    class Error < Record
      MESSAGE_LIMIT = 140
      OMISSION = "…"

      def to_s
        "#{exception_class}: #{message}".truncate(
          MESSAGE_LIMIT,
          omission: OMISSION
        )
      end
    end
  end
end
