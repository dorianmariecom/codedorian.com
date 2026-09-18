# frozen_string_literal: true

Rails.application.config.filter_parameters += %i[
  code
  code_verifier
  verifier
  state
  access_token
  auth_token
  api_key
  smtp_password
  passw
  secret
  token
  _key
  crypt
  salt
  certificate
  otp
  ssn
]
