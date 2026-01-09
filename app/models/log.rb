# frozen_string_literal: true

class Log < ApplicationRecord
  validate(:parse_and_validate_context, on: :controller)

  def self.search_fields
    {
      message: {
        node: -> { arel_table[:message] },
        type: :string
      },
      context: {
        node: -> { arel_table[:context] },
        type: :string
      },
      **base_search_fields
    }
  end

  def self.convert(object)
    if object.is_an?(ActionDispatch::Request)
      request = object

      {
        accept: request.accept,
        base_url: request.base_url,
        content_length: request.content_length,
        content_type: request.content_type,
        domain: request.domain,
        formats: request.formats.map(&:to_s),
        full_path: request.fullpath,
        host: request.host,
        ip: request.ip,
        method: request.method,
        path: request.path,
        path_parameters: request.path_parameters,
        port: request.port,
        protocol: request.protocol,
        query_parameters: request.query_parameters,
        referrer: request.referrer,
        remote_ip: request.remote_ip,
        scheme: request.scheme,
        subdomain: request.subdomain,
        url: request.original_url,
        user_agent: request.user_agent,
        xhr: request.xhr?
      }
    elsif object.is_an?(Exception)
      error = object

      {
        app_backtrace: Backtrace.app(error.backtrace),
        backtrace: error.backtrace,
        class: error.class,
        message: error.message
      }
    elsif object.is_an?(ActiveJob::Base)
      job = object
      arguments =
        begin
          job.arguments
        rescue ActiveJob::DeserializationError
        end

      { arguments: arguments, class: job.class, **job.serialize }
    elsif object.is_a?(Gem::Version)
      object.to_s
    elsif object.is_a?(Hash)
      object.transform_values { |value| convert(value) }
    elsif object.is_an?(Array)
      object.map { |element| convert(element) }
    else
      object.as_json
    end
  end

  def parse_and_validate_context
    self.context = JSON.parse(context.to_s)
  rescue JSON::ParserError
    errors.add(:context, t("invalid_json"))
  end

  def message_sample
    Truncate.strip(message)
  end

  def context_sample
    Truncate.strip(context.to_json)
  end

  def context_json
    JSON.pretty_generate(context)
  end

  def to_s
    message_sample.presence || context_sample.presence || t("to_s", id: id)
  end
end
