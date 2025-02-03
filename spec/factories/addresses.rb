FactoryBot.define do
  factory :address do
    user { nil }
    primary { false }
    verified { false }
    address { "MyString" }
    address_components { "" }
    formatted_address { "MyString" }
    geometry { "" }
    place_id { "MyString" }
    plugs_code_jsonb { "MyString" }
    types { "" }
  end
end
