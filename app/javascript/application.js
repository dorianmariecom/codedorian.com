import "@hotwired/turbo-rails";
import "@rails/actiontext";
import "controllers";
import "trix";
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
      Sentry.feedbackIntegration({
        autoInject: false,
        colorScheme: "light",
        ...window.SENTRY_FEEDBACK,
        themeLight: {
          foreground: "black",
          background: "white",
          accentForeground: "white",
          accentBackground: "black",
          successColor: "#00a63e",
          errorColor: "#e7000b",
          boxShadow: "none",
        },
      }),
    ],
  });
}

window.l =  LocalTime;

LocalTime.config.i18n[window.LOCALE] = window.translations.local_time;
LocalTime.config.locale = window.LOCALE;
LocalTime.config.useFormat24 = window.LOCALE === "fr";

LocalTime.start();

Object.entries(window.translations.trix).forEach(([key, value]) => {
  Trix.config.lang[key] = value;
});

document.addEventListener("turbo:morph", () => {
  LocalTime.run();
});
