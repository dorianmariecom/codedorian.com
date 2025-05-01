# frozen_string_literal: true

require "rails_helper"

RSpec.describe Program do
  let!(:current_user) { create(:user, :admin) }

  before { Current.user = current_user }

  describe ".search" do
    subject do
      described_class.search(q: q, params: params, fields: fields).map(&:to_s)
    end

    let!(:program_pomodoro) { create(:program, name: "pomodoro") }
    let!(:program_pomodoro_start) { create(:program, name: "pomodoro start") }
    let!(:program_pomodoro_break) { create(:program, name: "pomodoro break") }
    let!(:program_day) { create(:program, name: "day") }
    let!(:program_time_now) { create(:program, input: "Time.now") }
    let!(:program_time_hour) { create(:program, input: "Time.hour") }

    let!(:q) { "" }
    let!(:params) { {} }
    let!(:fields) { described_class.fields.keys }

    [
      "",
      "    ",
      " \n",
      "pomo",
      "pomodoro",
      "pomo break",
      "time",
      "day",
      "name:pomodoro",
      "input:time",
      "updated_at:today",
      "created_at:today",
      "id:1",
      "id>0 and name:pomod",
      "id>0 or name:pomodo",
      "not id:0",
      "id!:0",
      "id!=0",
      "name^pomodoro",
      "name^:pomo",
      "name$oro",
      "id>=0",
      "name<zzz",
      "name=pomodoro",
      "name!:pomodoro",
      "name!!pomodoro",
      "name!^pomodoro",
      "name!$pomodoro",
      "name!>=zzz",
      "name!<=aaa",
      "name!=aaa",
      "name!>zzz",
      "name!<aaa",
      "user:id>0",
      "user:verified:false",
      "user:admin:false",
      "user:created_at:today",
      "user:updated_at:today"
    ].each do |q|
      context q.inspect do
        let!(:q) { q }

        it { is_expected.to be_present }
      end
    end
  end
end
