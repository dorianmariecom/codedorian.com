import "@hotwired/turbo-rails";
import "lexxy-code";
import "controllers";
import LocalTime from "local-time";
import consumer from "consumer";
import * as Sentry from "@sentry/browser";

if (window.RAILS_ENV === "production") {
  window.Sentry = Sentry;

  Sentry.init({
    dsn: window.SENTRY_DSN,
    environment: window.SENTRY_ENVIRONMENT,
    release: window.SENTRY_RELEASE,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    sendDefaultPii: true,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });
}

window.l = LocalTime;

LocalTime.config.i18n[window.LOCALE] = window.translations.local_time;
LocalTime.config.locale = window.LOCALE;
LocalTime.config.useFormat24 = window.LOCALE === "fr";

LocalTime.start();

document.addEventListener("turbo:morph", () => {
  LocalTime.run();
});
