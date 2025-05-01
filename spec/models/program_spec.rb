# frozen_string_literal: true

require "rails_helper"

RSpec.describe Program do
  let!(:current_user) { create(:user, :admin) }

  before { Current.user = current_user }

  describe ".search" do
    subject do
      described_class.search(q: q, params: params, fields: fields).map(&:to_s)
    end

    before { freeze_time "2025-04-30 22:00:00" } # wednesday

    let!(:program_pomodoro) do
      create(:program, name: "Pomodoro", created_at: 1.day.ago)
    end

    let!(:program_pomodoro_start) do
      create(:program, name: "pomodoro start", updated_at: 2.days.ago)
    end

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
      [program_pomodoro, program_pomodoro_start, program_pomodoro_break].map(
        &:to_s
      )
    end

    let!(:time_programs) { [program_time_now, program_time_hour].map(&:to_s) }

    let!(:q) { "" }
    let!(:params) { {} }
    let!(:fields) { Program.fields.keys }

    it { is_expected.to match_array(all_programs) }

    context "text queries" do
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

    context "field queries" do
      context "q = name:pomodoro" do
        let!(:q) { "name:pomodoro" }

        it { is_expected.to match_array(pomodoro_programs) }
      end

      context "q = input:pomodoro" do
        let!(:q) { "input:pomodoro" }

        it { is_expected.to be_empty }
      end

      context "q = id:(pomodoro_id)" do
        let!(:q) { "id:#{program_pomodoro.id}" }

        it { is_expected.to eq([program_pomodoro.to_s]) }
      end

      context "q = created_at:yesterday" do
        let!(:q) { "created_at:yesterday" }

        it { is_expected.to eq([program_pomodoro.to_s]) }
      end

      context %(q = updated_at:"2 days ago") do
        let!(:q) { %(updated_at:"2 days ago") }

        it { is_expected.to eq([program_pomodoro_start.to_s]) }
      end
    end

    context "range field queries" do
      context "q = name:pomodoro..zzz" do
        let!(:q) { "name:pomodoro..zzz" }

        it { is_expected.to match_array(pomodoro_programs) }
      end

      context "q = name:pomodoro...pomodoro" do
        let!(:q) { "name:pomodoro...pomodoro" }

        it { is_expected.to be_empty }
      end

      context "q = input:pomodoro..aaa" do
        let!(:q) { "input:pomodoro..aaa" }

        it { is_expected.to be_empty }
      end

      context "q = input:pomodoro...aaa" do
        let!(:q) { "input:pomodoro...aaa" }

        it { is_expected.to be_empty }
      end

      context "q = id:(pomodoro_id)..(pomodoro_id)" do
        let!(:q) { "id:#{program_pomodoro.id}..#{program_pomodoro.id}" }

        it { is_expected.to eq([program_pomodoro.to_s]) }
      end

      context "q = id:(pomodoro_id)...(pomodoro_id)" do
        let!(:q) { "id:#{program_pomodoro.id}...#{program_pomodoro.id}" }

        it { is_expected.to be_empty }
      end

      context "q = created_at:yesterday..yesterday" do
        let!(:q) { "created_at:yesterday..yesterday" }

        it { is_expected.to eq([program_pomodoro.to_s]) }
      end

      context "q = created_at:yesterday...yesterday" do
        let!(:q) { "created_at:yesterday...yesterday" }

        it { is_expected.to eq([program_pomodoro.to_s]) }
      end

      context %(q = updated_at:"2 days ago".."2 days ago") do
        let!(:q) { %(updated_at:"2 days ago".."2 days ago") }

        it { is_expected.to eq([program_pomodoro_start.to_s]) }
      end

      context %(q = updated_at:"2 days ago"..."2 days ago") do
        let!(:q) { %(updated_at:"2 days ago"..."2 days ago") }

        it { is_expected.to eq([program_pomodoro_start.to_s]) }
      end
    end
  end
end
