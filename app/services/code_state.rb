# frozen_string_literal: true

class CodeState
  KEY_PREFIX = "code"
  DEFAULT_NAMESPACE = "state"
  CHECKPOINT_NAMESPACE = "checkpoints"
  RESULT_NAMESPACE = "result"

  def initialize(record, namespace: DEFAULT_NAMESPACE)
    @record = record
    @key = "#{KEY_PREFIX}:#{record.class.name}:#{record.id}:#{namespace}"
  end

  def read
    datum&.value || {}
  end

  def update
    @record.with_lock do
      stored = datum || Datum.new(user: owner, key: @key, value: {})
      stored.value = yield(stored.value || {})
      stored.save!
      stored.value
    end
  end

  private

  def owner
    case @record
    when Subscription, StepExecution
      @record.service.user
    when Program
      @record.user
    end
  end

  def datum
    Datum.where_user(owner).find_by(key: @key)
  end
end
