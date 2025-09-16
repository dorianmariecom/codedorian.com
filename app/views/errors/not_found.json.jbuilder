# frozen_string_literal: true

json.class(@class) if admin? && @class
json.message(@message) if admin? && @message
json.backtrace(@app_backtrace) if admin? && @app_backtrace
json.backtrace(@backtrace) if admin? && @backtrace
