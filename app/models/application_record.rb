# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include(RecordConcern)

  has_paper_trail
  primary_abstract_class

  scope :where_guest, ->(_guest) { none }
end
