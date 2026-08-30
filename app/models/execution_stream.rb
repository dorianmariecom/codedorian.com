# frozen_string_literal: true

class ExecutionStream < StringIO
  def initialize(execution:, channel:)
    @execution = execution
    @channel = channel
    super()
  end

  def write(content)
    written = super
    execution.append_to_stream!(channel, content)
    written
  end

  def print(*values)
    write(render { |stream| stream.print(*values) })
    nil
  end

  def puts(*values)
    write(render { |stream| stream.puts(*values) })
    nil
  end

  private

  attr_reader :execution, :channel

  def render
    stream = StringIO.new
    yield(stream)
    stream.string
  end
end
