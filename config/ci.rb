# frozen_string_literal: true

CI.run do
  step "rubocop", "bin/rubocop"
  step "brakeman", "bin/brakeman", "-A", "-q", "--color"
  step "importmap outdated", "bin/importmap", "outdated"
  step "importmap audit", "bin/importmap", "audit"
  step "bundler audit", "bin/bundler-audit", "check", "--update"
  step "npm audit", "npm", "audit"
  step "rspec", "bin/rspec"
  step "secrets", "bin/secrets"
end
