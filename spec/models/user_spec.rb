# frozen_string_literal: true

require "rails_helper"

RSpec.describe User do
  let!(:current_user) { create(:user, :admin) }

  before { Current.user = current_user }

  describe ".search" do
    subject do
      described_class.search(q: q).map(&:to_s)
    end

    let!(:user_admin) { create(:user, admin: true) }
    let!(:user_verified) { create(:user, verified: true) }
    let!(:user) { create(:user) }

    let!(:q) { "" }

    [
      "",
      "    ",
      " \n",
      "id>0",
      "verified:true",
      "verified:false",
      "admin:true",
      "admin:false",
      "admin>true or admin:true",
      "not admin:false",
      "verified!:true",
      "verified!=false",
      "verified^Yes",
      "admin^:No",
      "admin$TRUE",
      "admin>=FALSE",
      "admin<t or admin:t",
      "admin=true"
    ].each do |q|
      context q.inspect do
        let!(:q) { q }

        it { is_expected.to be_present }
      end
    end
  end
end
