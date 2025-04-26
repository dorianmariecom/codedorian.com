# frozen_string_literal: true

require "rails_helper"

RSpec.describe Program do
  let!(:current_user) { create(:user, :admin) }

  before { Current.user = current_user }

  describe ".search" do
    subject { described_class.search(q: q, params: params, fields: fields) }

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
      ]
    end

    let!(:q) { "" }
    let!(:params) { {} }
    let!(:fields) { described_class.fields.keys }

    it { expect(subject.size).to eq(all_programs.size) }
    it { is_expected.to match_array(all_programs) }
  end
end
