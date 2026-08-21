# frozen_string_literal: true

require "test_helper"

class RichTextSearchTest < ActiveSupport::TestCase
  MODELS = [Service, Plan, Step, Page, Message].freeze

  test "every rich text attribute is an explicit search field" do
    MODELS.each do |model|
      rich_text_attributes =
        model.rich_text_association_names.map do |association_name|
          association_name.to_s.delete_prefix("rich_text_").to_sym
        end

      assert_equal(
        rich_text_attributes.sort,
        (rich_text_attributes & model.search_fields.keys).sort,
        model.name
      )
    end
  end

  test "every associated rich text body can be searched" do
    Current.with(user: users(:admin)) do
      records = {
        Service => services(:service),
        Plan => plans(:plan),
        Step => steps(:step),
        Page => pages(:page),
        Message => messages(:message)
      }

      records.each do |model, record|
        model.rich_text_association_names.each do |association_name|
          attribute_name =
            association_name.to_s.delete_prefix("rich_text_")
          token =
            "searchable-#{model.model_name.singular}-#{attribute_name}"

          record.update!(attribute_name => "<p>#{token}</p>")

          assert_includes(model.search(q: token), record, token)
          assert_includes(
            model.search(q: "#{attribute_name}:#{token}"),
            record,
            "#{attribute_name}:#{token}"
          )
        end
      end
    end
  end
end
