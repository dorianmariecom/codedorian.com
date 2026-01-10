# Repository Guidelines

## Project Structure & Module Organization

- `app/` holds the Rails application code (models, controllers, jobs, views, helpers).
- `app/javascript/` contains frontend controllers and JS utilities; `app/assets/` contains Tailwind and image assets.
- `config/` contains environment, initializer, and deployment configuration.
- `db/` contains migrations, schema, and seeds.
- `test/` contains Minitest tests.
- `public/` hosts static assets (favicons, images).

## Build, Test, and Development Commands

- `bin/dev`: run the full dev stack via `Procfile.dev` (web, tailwind, jobs, etc.).
- `bin/rails server`: start the Rails server directly.
- `bin/rails tailwindcss:watch`: watch and rebuild Tailwind CSS.
- `bin/rails test`: run the Minitest suite.
- `bin/rails test:system`: run system tests.
- `bin/ci`: run CI checks (eager_load, rubocop, brakeman, audits, secrets).
- `bin/format`: run the formatter (delegates to the `dorian` gem).
- `bin/build`: Docker build + push; note it prunes Docker volumes, so use with care.

## Coding Style & Naming Conventions

- Ruby style is enforced by RuboCop (`.rubocop.yml`); run `bin/rubocop` before reviews.
- Rails naming conventions apply: snake_case for Ruby, PascalCase for classes, pluralized controllers.
- JS lives under `app/javascript/` and follows standard ES module naming (e.g., `*_controller.js` for Stimulus).
- Keep changes consistent with existing files (indentation, spacing, and layout).

## Commit & Pull Request Guidelines

- Recent commits use short, lowercase, imperative summaries (e.g., "less links").
- Keep commit messages concise and specific to the change.
- PRs should include a clear description, affected areas, and screenshots for UI changes.

## Configuration Tips

- Credentials live in `config/credentials/*.yml.enc`; use Rails credentials tooling.
- Local settings belong in `config/environments/development.rb` and `.env`-style secrets are not committed.
