import { Controller } from "@hotwired/stimulus";

const INTERVAL_MILLISECONDS = 5000;

export default class extends Controller {
  static targets = ["response", "action"];

  connect() {
    requestAnimationFrame(() => {
      this._input().disabled = true;

      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.onload = this.load.bind(this);
      script.src = `
          https://www.google.com/recaptcha/enterprise.js
          ?render=${window.RECAPTCHA_SITE_KEY}
          &time=${Date.now()}
          &random=${Math.random()}
      `.replace(/\s/g, "");

      document.head.appendChild(script);

      this.interval = setInterval(
        this.execute.bind(this),
        INTERVAL_MILLISECONDS,
      );
    });
  }

  disconnect() {
    clearInterval(this.interval);
    this.interval = null;
  }

  load() {
    window.grecaptcha.enterprise.ready(() => {
      this.execute();
    });
  }

  execute() {
    if (window.grecaptcha?.enterprise) {
      grecaptcha.enterprise
        .execute(window.RECAPTCHA_SITE_KEY, { action: this.actionTarget.value })
        .then((token) => {
          this.responseTarget.value = token;
          this._input().disabled = false;
        });
    }
  }

  _input() {
    return (
      this.element.closest("form").querySelector("[type=submit]") ||
      this.element.closest("form")
    );
  }
}
