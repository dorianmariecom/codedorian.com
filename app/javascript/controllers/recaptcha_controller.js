import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this._typeSubmits().forEach((typeSubmit) => (typeSubmit.disabled = true));

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.onload = this.load.bind(this);
    script.src = `
      https://www.google.com/recaptcha/api.js
        ?render=${window.RECAPTCHA_SITE_KEY}
        &time=${Date.now()}
        &random=${Math.random()}
    `.replace(/\s/g, "");

    document.head.appendChild(script);
  }

  load() {
    grecaptcha.ready(() => {
      this.execute();
    });
  }

  execute() {
    grecaptcha
      .execute(window.RECAPTCHA_SITE_KEY, { action: "submit" })
      .then((token) => {
        this.element.value = token;
        this._typeSubmits().forEach(
          (typeSubmit) => (typeSubmit.disabled = false),
        );
      });
  }

  _typeSubmits() {
    return [...this.element.closest("form").querySelectorAll("[type=submit]")];
  }
}
