import "@hotwired/turbo-rails";
import "@rails/actiontext";
import "controllers";
import "local-time";
import "trix";

Object.entries(window.translations.trix).forEach(([key, value]) => {
  Trix.config.lang[key] = value;
});
