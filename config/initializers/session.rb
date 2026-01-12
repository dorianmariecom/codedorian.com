# frozen_string_literal: true

ActiveRecord::SessionStore::Session.serializer = :null

Rails.application.config.session_store(
  :active_record_store,
  key: "_code_session",
  expire_after: 20.years
)
