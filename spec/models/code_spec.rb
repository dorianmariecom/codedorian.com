require 'rails_helper'

RSpec.describe Code, type: :model do
  it "sends an email" do
    Current.user = create(:user, :dorian)

    expect_any_instance_of(EmailAddress).to receive(:deliver!)

    Code.evaluate(<<~CODE)
      Email.send(
        to: "dorian@dorianmarie.com",
        subject: "Hello",
        body: "What's up?"
      )
    CODE
  ensure
    Current.reset
  end
end