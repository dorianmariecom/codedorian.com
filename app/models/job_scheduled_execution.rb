# frozen_string_literal: true

class JobScheduledExecution < SolidQueue::ScheduledExecution
  include(RecordConcern)

  def self.search_fields
    { **base_search_fields }
  end

  def to_s
    t("to_s", id: id)
  end
end
