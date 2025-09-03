# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Rails code — `models/`, `controllers/`, `views/`, `policies/`, `jobs/`, `helpers/`, `javascript/`.
- `app/assets/`: static assets; Tailwind at `app/assets/tailwind/application.css`.
- `config/`: environment, routes, credentials.
- `db/`: migrations and seeds.
- `spec/`: RSpec tests with `rails_helper.rb`, `support/`, and `factories/`.
- `bin/`: project scripts (e.g., `bin/dev`, `bin/rspec`, `bin/ci`).

## Build, Test, and Development Commands

- `bundle install`: install gems; ensure Ruby `3.4.5`.
- `bin/rails db:setup`: create, migrate, and seed the database.
- `bin/dev`: run the app locally via Overmind + `Procfile.dev` (web, css, jobs). First run installs Overmind.
- `bin/rspec`: run the test suite.
- `bin/rubocop`: lint Ruby code.
- `bin/ci`: run full local CI (eager load, RuboCop, RSpec, Brakeman, importmap audit, bundler audit, npm audit, secrets scan).

## Coding Style & Naming Conventions

- Ruby: 2‑space indentation; prefer clear, small methods. Follow RuboCop; many cops are relaxed but consistency is expected.
- Files: `snake_case.rb`; classes/modules `CamelCase`.
- RSpec files: `*_spec.rb`. Factories in `spec/factories/`.
- Views: Slim templates; keep helpers/presenters minimal and testable.

## Testing Guidelines

- Framework: RSpec with FactoryBot and DatabaseCleaner.
- Location: place unit tests under `spec/models/`, request/controller specs under `spec/` accordingly.
- Conventions: one expectation per behavior; use `describe ".method"`/`"#instance_method"` and meaningful contexts.
- Run: `bin/rspec` for quick checks; `bin/ci` before pushing.

## Commit & Pull Request Guidelines

- Commits: short imperative subjects (e.g., "fix z-index of editor"). Group related changes; include rationale in the body when useful.
- PRs: include summary, linked issues, and screenshots/GIFs for UI changes. Note migrations and any ops impacts.
- Quality gate: ensure `bin/ci` passes locally; no secrets or credentials in diffs (`bin/secrets`).

## Security & Configuration Tips

- Environment: manage `.env.*` via Dotenv; never commit real secrets.
- Audits: `bin/brakeman`, `bin/bundler-audit`, and `npm audit` (also run by `bin/ci`).
- Deployment: Kamal scripts live in `.kamal/` and `bin/deploy` (production workflows only).

## Architecture Overview

- Authorization: Pundit policies in `app/policies/`; call `authorize(record)` in controllers and scope queries with `policy_scope`.
- Background jobs: SolidQueue runs via `bin/jobs`; enqueue with `MyJob.perform_later(args)`.
- Push notifications: Rpush configured in production; manage apps/notifications via Rails console. See cleanup examples in `README.md`.
- Assets/CSS: Tailwind via `tailwindcss-rails` with `bin/css` watcher.

## Deployment Notes (Kamal)

- Environments: staging and production are configured under `.kamal/`.
- One‑shot deploy both envs: `bin/deploy` (pushes git, deploys staging then production).
- Target a single env: `kamal deploy -d staging` or `kamal deploy -d production`.
- Locks: `kamal lock release -d <env>` is handled in `bin/deploy` for safe concurrent releases.
- Prereqs: Docker available on the host; app builds from `Dockerfile`. Ensure `bin/ci` passes before deploying.
