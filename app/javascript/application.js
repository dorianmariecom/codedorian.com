import "@hotwired/turbo-rails";
import "@rails/actiontext";
import "controllers";
import "trix";
import LocalTime from "local-time";
import consumer from "consumer";
import * as Sentry from "@sentry/browser";

const initSentry = () => {
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
        colorScheme: "light",
      }),
    ],
  });
};

initSentry();
LocalTime.start();

Object.entries(window.translations.trix).forEach(([key, value]) => {
  Trix.config.lang[key] = value;
});

document.addEventListener("turbo:morph", () => {
  LocalTime.run();
  initSentry();
});
