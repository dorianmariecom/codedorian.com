# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    trait :admin do
      admin { true }
    end
  end

  factory :program do
    user
    name { "" }
    input { "" }
  end
end
