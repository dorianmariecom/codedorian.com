# frozen_string_literal: true

require "test_helper"

class ExecutionStreamTest < ActiveSupport::TestCase
  include(ActionCable::TestHelper)

  test "appends and broadcasts each output call without auditing or touching" do
    execution = program_executions(:program_execution)
    execution.update_columns(output: nil, error: nil)
    program_updated_at = execution.program.reload.updated_at
    version_count = execution.versions.count

    assert_broadcasts(execution.to_gid_param, 2) do
      stream = execution.stream_io(:output)
      stream.print("hello")
      stream.puts(" world")
    end

    assert_equal("hello world\n", execution.reload.output)
    assert_equal(version_count, execution.versions.count)
    assert_equal(program_updated_at, execution.program.reload.updated_at)
  end

  test "rejects invalid channels" do
    execution = program_executions(:program_execution)

    error =
      assert_raises(ArgumentError) do
        execution.append_to_stream!(:result, "nope")
      end

    assert_equal("invalid stream channel: result", error.message)
  end

  test "streams program output and warnings while evaluating" do
    program = programs(:program)
    execution = nil

    Current.with(user: program.user, program: program) do
      program.update!(
        input: <<~CODE
          puts("hello")
          print("world")
          warn("careful")
        CODE
      )
      execution = program.program_executions.create!(status: :in_progress)

      assert_broadcasts(execution.to_gid_param, 3) do
        program.evaluate!(program_execution: execution)
      end
    end

    assert_predicate(execution.reload, :done?)
    assert_equal("hello\nworld", execution.output)
    assert_equal("careful\n", execution.error)
  end

  test "keeps partial step streams when evaluation errors" do
    execution = step_executions(:step_execution)

    Current.with(
      user: execution.step.service.user,
      step_execution: execution
    ) do
      execution.update!(
        input: <<~CODE
          puts("before")
          warn("careful")
          UnknownConstant
        CODE
      )

      assert_broadcasts(execution.to_gid_param, 2) { execution.evaluate! }
    end

    assert_predicate(execution.reload, :errored?)
    assert_equal("before\n", execution.output)
    assert_equal("careful\n", execution.error)
    assert_equal("Code::Error", execution.error_class)
    assert_match(/UnknownConstant/, execution.error_message)
  end
end
