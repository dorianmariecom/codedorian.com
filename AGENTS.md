# Repository Guidelines

## Codebase Analysis

- This is a large Rails 8 application behind `codedorian.com`, not a simple marketing site.
- The app combines a public-facing website, an authenticated account area, an admin-style CRUD interface, a programmable "code/program" feature, a form/submission pipeline, and mobile app integration through Hotwire Native.
- The stack is Ruby `3.4.5`, PostgreSQL, Tailwind, Turbo, Stimulus, Importmap, Solid Queue, Solid Cable, Solid Cache, Pundit, PaperTrail, Sentry, Blazer, Recaptcha, and Rpush.
- The repository is broad: about `66` models, `52` controllers, `52` policies, `7` jobs, `336` view files, `26` Stimulus controllers, `60` tests, and `48` fixtures.

## Major Domains

- Identity and profile data:
  `User`, `Guest`, `Session`, `Token`, `Name`, `Handle`, `EmailAddress`, `PhoneNumber`, `Address`, `Password`, `TimeZone`, `Device`.
- Programming/runtime features:
  `Program`, `ProgramSchedule`, `ProgramExecution`, `Datum`, `Message`, `Example`, `ExampleSchedule`, plus `Code::Object::*` wrappers and `ProgramEvaluateJob`.
- Public form system:
  `FormProgram`, `FormSchedule`, `FormDelivery`, `Submission`, `SubmissionSection`, `SubmissionProgram`, `SubmissionSchedule`, `SubmissionDelivery`, plus `FormEmailJob`.
- Operations/auditing:
  `Log`, `Version`, `Error`, `ErrorOccurrence`, Solid Queue execution models, `JobContext`, `Configuration`, `CountryCodeIpAddress`.
- Realtime/mobile:
  Action Cable, Hotwire Native bridge controllers, push notification support via `rpush`, and environment-aware current state in `Current`.

## Architectural Patterns

- `ApplicationController` is the center of request lifecycle behavior. It sets `Current`, handles session and guest login, locale/time zone/version/commit context, Recaptcha verification, profiling auth, Pundit enforcement, and rescue behavior.
- `Current` is not a minor helper. It drives host/env detection, locale, time zone, mobile app naming, theme classes, and current user or guest identity. Changes to authentication, environment logic, or rendering often need a `Current` review.
- Most Active Record models include shared behavior through `RecordConcern`, which adds Pundit helpers, search support, broadcast refreshes, translation helpers, and common `base_search_fields`.
- The CRUD surface is intentionally generic. Many models define `search_fields`, `to_s`, and `*_sample` helpers because the UI and filtering system depend on those patterns.
- Authorization is pervasive. Controllers generally call `authorize(...)` and use `policy_scope(...)` or `searched_policy_scope(...)`; `ApplicationController` enforces both `verify_authorized` and `verify_policy_scoped`.
- Logs, versions, and errors are first-class nested resources throughout the app. Route changes often have cascading effects because resources commonly expose nested `logs`, `versions`, `errors`, and bulk actions.

## Controller Conventions

- Controllers are mostly resource-oriented and repetitive by design. Before changing one controller, inspect the sibling controllers for the same pattern rather than inventing a new one.
- Common controller behavior includes:
  nested user or guest loading via `load_user` and `load_guest`,
  breadcrumbs,
  `scope` methods built from `searched_policy_scope`,
  `model_class`, `model_instance`, `nested`, and `filters` helpers for shared views,
  both `destroy` and `delete` actions,
  bulk `*_all` actions.
- `ProgramsController` and form/submission controllers are the most domain-specific controllers and are usually the right place to start for product behavior.

## Frontend Analysis

- Frontend JS lives in `app/javascript/` and uses Importmap, not a bundler-driven SPA architecture.
- Stimulus is the primary interaction layer. There are standard controllers for forms, validation, modals, editors, search, phone numbers, addresses, and time zone updates.
- `app/javascript/controllers/bridge/*` is specifically for Hotwire Native integration. Web-only changes can break native behavior if these bridges or related layout data attributes are ignored.
- `app/javascript/application.js` initializes Turbo, Action Text, LocalTime, translations, Action Cable consumer usage, and production Sentry replay support.
- Layout rendering in `app/views/layouts/application.html.erb` injects a large amount of runtime data into `window.*`, including locale, environment, recaptcha, Google Maps, Sentry, and mobile bridge configuration.
- Styling is Tailwind-based from `app/assets/tailwind/application.css`, with the runtime CSS built into `app/assets/builds/tailwind.css`.

## Routing Analysis

- `config/routes.rb` is heavily meta-programmed with lambdas that define repeated REST resources plus `delete`, `destroy`, `delete_all`, `destroy_all`, `schedule_all`, `unschedule_all`, `retry_all`, and similar collection routes.
- This route file is a structural hotspot. Small route changes can affect a large number of controllers, views, helpers, and tests.
- Mounted engines and infrastructure routes include Blazer and Action Cable.

## Background Jobs And Async Work

- Background processing uses Solid Queue models plus app jobs such as `ProgramEvaluateJob`, `FormEmailJob`, `SchedulingJob`, and related context-aware job classes.
- `ContextJob` and `PerformLaterConcern` matter when jobs require `Current` or model context to be restored correctly.
- Program evaluation runs arbitrary code through the `code-ruby` integration, captures output and errors, and persists execution records. Treat changes here as high-risk.
- The development process stack in `Procfile.dev` includes `web`, `css`, `cloud`, `push`, and `jobs`, which reflects the app's reliance on async and mobile-related processes.

## Testing And Quality

- Tests are Minitest-based with request tests as the main coverage layer, plus model and system tests.
- `test/test_helper.rb` globally stubs Recaptcha, `ipinfo.io`, and Cloudflare requests with WebMock. Networked behavior should follow that pattern.
- Locale coverage is built into the test layer: custom test wrapping runs many tests in both `en` and `fr`.
- Useful commands:
  `bin/rails test`
  `bin/rails test:system`
  `bin/ci`
  `bin/format`
- `bin/ci` is strict and includes eager load, RuboCop, Brakeman, importmap audit, bundler audit, `npm audit`, secrets scanning, unit tests, and system tests.

## Working Rules For Agents

- Match existing patterns instead of simplifying the app into generic Rails CRUD. The repetition is intentional and usually backs shared partials, filters, and navigation.
- Check policy, scope, breadcrumbs, logs, versions, and nested routes whenever you change a resource controller.
- Check `Current`, locale handling, and Hotwire Native implications whenever you change layout, session, device, or navigation behavior.
- Check background jobs and context propagation whenever you change programs, submissions, scheduling, or mailers.
- Preserve bilingual behavior. Many flows are designed to work in both English and French.
- Prefer request tests for controller behavior and model tests for domain logic. System tests exist for login, logout, static pages, and simple interface flows.

## File Map

- `app/controllers/`: broad CRUD/admin surface plus public entry points such as `StaticController`, `FormsController`, `SessionController`, and `SessionsController`.
- `app/models/`: domain models, job wrappers, `Current`, concerns, code object adapters, and formatting helpers.
- `app/policies/`: one policy per resource, mirroring the controller surface.
- `app/views/`: a large partial-driven ERB UI, including nested forms and shared resource pages.
- `app/javascript/`: Stimulus controllers, bridge integration, and frontend runtime setup.
- `app/jobs/`, `app/mailers/`: async program execution, scheduling, and submission email delivery.
- `config/routes.rb`: primary structural map of the app.
- `db/schema.rb`: authoritative list of tables, including app tables plus Solid Queue, Solid Cache, Solid Errors, Action Text, Active Storage, Blazer, and Rpush.

## Commit And PR Guidance

- Keep commit messages short, lowercase, and imperative to match recent history.
- For UI changes, include screenshots in the PR.
- For behavior changes, explain which domain was touched: identity, program execution, forms, jobs, mobile bridge, or admin CRUD.
