# frozen_string_literal: true

require "rails_helper"

RSpec.describe Program do
  include ActiveSupport::Testing::TimeHelpers

  describe "#scheduled_now?" do
    subject { program.scheduled_now? }

    before do
      travel_to(Time.zone.parse("2025-11-09 14:00:00"))
      Current.user = current_user
    end

    around { |example| Time.use_zone("Europe/Paris") { example.run } }

    let!(:user) { User.create! }
    let!(:scheduled) { true }
    let!(:program) { described_class.create!(scheduled: scheduled) }
    let!(:starts_at) { 1.day.ago }
    let!(:interval) { "30 minutes" }
    let!(:program_schedule) do
      ProgramSchedule.create!(
        program: program,
        starts_at: starts_at,
        interval: interval
      )
    end
    let!(:current_user) { user }

    it { is_expected.to be(true) }

    context "when there are no schedules" do
      let!(:program_schedule) { nil }

      it { is_expected.to be(false) }
    end

    context "when the program is not scheduled" do
      let!(:scheduled) { false }

      it { is_expected.to be(false) }
    end

    context "when there is a program execution" do
      let!(:status) { "done" }
      let!(:created_at) { 2.days.ago }

      let!(:program_execution) do
        ProgramExecution.create!(
          program: program,
          status: status,
          created_at: created_at
        )
      end

      it { is_expected.to be(true) }

      %w[initialized created in_progress].each do |execution_status|
        context "when the status is #{execution_status}" do
          let!(:status) { execution_status }

          it { is_expected.to be(false) }
        end
      end

      %w[done errored].each do |execution_status|
        context "when the status is #{execution_status}" do
          let!(:status) { execution_status }

          it { is_expected.to be(true) }
        end
      end

      context "when the execution was created 10 minutes ago" do
        let!(:created_at) { 10.minutes.ago }

        it { is_expected.to be(false) }
      end
    end

    context "when starts_at is in the future" do
      let!(:starts_at) { 10.minutes.from_now }

      it { is_expected.to be(false) }
    end

    context "when interval is once" do
      let!(:interval) { "once" }

      it { is_expected.to be(true) }

      context "when starts_at is in the future" do
        let!(:starts_at) { 10.minutes.from_now }

        it { is_expected.to be(false) }
      end
    end
  end
end
