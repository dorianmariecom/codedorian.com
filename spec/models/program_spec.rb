# frozen_string_literal: true

require "rails_helper"

RSpec.describe Program do
  let!(:current_user) { create(:user, :admin) }

  before { Current.user = current_user }

  describe ".search" do
    subject { described_class.search(q: q, params: params, fields: fields).map(&:to_s) }

    let!(:program_pomodoro) { create(:program, name: "pomodoro") }
    let!(:program_pomodoro_start) { create(:program, name: "pomodoro start") }
    let!(:program_pomodoro_break) { create(:program, name: "pomodoro break") }
    let!(:program_day) { create(:program, name: "day") }
    let!(:program_time_now) { create(:program, input: "Time.now") }
    let!(:program_time_hour) { create(:program, input: "Time.hour") }

    let!(:all_programs) do
      [
        program_pomodoro,
        program_pomodoro_start,
        program_pomodoro_break,
        program_day,
        program_time_now,
        program_time_hour
      ].map(&:to_s)
    end

    let!(:pomodoro_programs) do
      [
        program_pomodoro,
        program_pomodoro_start,
        program_pomodoro_break
      ].map(&:to_s)
    end

    let!(:time_programs) do
      [
        program_time_now,
        program_time_hour
      ].map(&:to_s)
    end

    let!(:q) { "" }
    let!(:params) { {} }
    let!(:fields) { Program.fields.keys }

    it { is_expected.to match_array(all_programs) }

    context "q = pomodoro" do
      let!(:q) { "pomodoro" }

      it { is_expected.to match_array(pomodoro_programs) }
    end

    context "q = start" do
      let!(:q) { "start" }

      it { is_expected.to eq([program_pomodoro_start.to_s]) }
    end

    context "q = break" do
      let!(:q) { "break" }

      it { is_expected.to eq([program_pomodoro_break.to_s]) }
    end

    context "q = pomodoro start" do
      let!(:q) { "pomodoro start" }

      it { is_expected.to eq([program_pomodoro_start.to_s]) }
    end

    context "q = doro start" do
      let!(:q) { "doro start" }

      it { is_expected.to eq([program_pomodoro_start.to_s]) }
    end

    context "q = pomo start" do
      let!(:q) { "pomo start" }

      it { is_expected.to eq([program_pomodoro_start.to_s]) }
    end

    context "q = pomodoro break" do
      let!(:q) { "pomodoro break" }

      it { is_expected.to eq([program_pomodoro_break.to_s]) }
    end

    context "q = doro break" do
      let!(:q) { "doro break" }

      it { is_expected.to eq([program_pomodoro_break.to_s]) }
    end

    context "q = pomo break" do
      let!(:q) { "pomo break" }

      it { is_expected.to eq([program_pomodoro_break.to_s]) }
    end

    context "q = time" do
      let!(:q) { "time" }

      it { is_expected.to match_array(time_programs) }
    end

    context "q = Time" do
      let!(:q) { "Time" }

      it { is_expected.to match_array(time_programs) }
    end

    context "q = TIME" do
      let!(:q) { "TIME" }

      it { is_expected.to match_array(time_programs) }
    end
  end
end
