import "@hotwired/turbo-rails";
import "@rails/actiontext";
import "controllers";
import "trix";
import LocalTime from "local-time";

LocalTime.start();

Object.entries(window.translations.trix).forEach(([key, value]) => {
  Trix.config.lang[key] = value;
});

document.addEventListener("turbo:morph", () => {
  LocalTime.run();
});
