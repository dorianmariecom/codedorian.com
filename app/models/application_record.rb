# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include(RecordConcern)

  has_paper_trail
  primary_abstract_class

  scope :where_guest, ->(_guest) { none }

  def read_attribute_for_serialization(attribute_name)
    content = super

    return content if Current.admin?
    return content if !attribute_name.to_sym.in?(self.class.encrypted_attributes)
    return content if content.blank?

    Password.hidden
  end
end
