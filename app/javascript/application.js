import "@hotwired/turbo-rails";
import "@hotwired/turbo";
import "controllers";
import "local-time";
import "trix";
import "@rails/actiontext";

Object.entries(window.translations.trix).forEach(([key, value]) => {
  Trix.config.lang[key] = value;
});

[...document.querySelectorAll("[type=submit]")].forEach((element) => {
  element.disabled = true;
});

