Rails.application.config.session_store(
  :cookie_store,
  key: "_code_session",
  expire_after: nil
)
