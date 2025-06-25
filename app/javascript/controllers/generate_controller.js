import { Controller } from "@hotwired/stimulus";

const INTERVAL_DELAY_MS = 500;
const RECAPTCHA_CHECK_INTERVAL_MS = 50;

const ELLIPSIS = ["&nbsp;&nbsp;&nbsp;", ".&nbsp;&nbsp;", "..&nbsp;", "..."];

export default class extends Controller {
  static targets = ["name", "input", "button", "nested", "form"];

  static values = {
    index: Number,
    interval: Number,
    repatchaIntervalValue: Number,
  };

  connect() {
    this.repatchaIntervalValue = setInterval(() => {
      this.buttonTarget.disabled = this.formTarget.disabled;
    }, RECAPTCHA_CHECK_INTERVAL_MS);
  }

  disconnect() {
    clearInterval(repatchaInterval);
  }

  async generate() {
    this.buttonTarget.disabled = false;

    this.intervalValue = setInterval(() => {
      this.buttonTarget.innerHTML =
        this.buttonTarget.dataset.loadingText + ELLIPSIS[this.indexValue];
      this.indexValue = (this.indexValue + 1) % ELLIPSIS.length;
    }, INTERVAL_DELAY_MS);

    try {
      const csrfToken = document.querySelector("[name='csrf-token']")?.content;
      const formData = new FormData(this.formTarget);
      formData.append("prompt[input]", this.nameTarget.value);

      const response = await fetch(this.formTarget.action, {
        method: this.formTarget.method,
        headers: {
          "X-CSRF-Token": csrfToken,
          Accept: "application/json",
        },
        body: formData,
      });

      const json = await response.json();

      this.inputTarget.value = json.input;

      this.nestedTarget.dispatchEvent(
        new CustomEvent("nested.schedules", {
          detail: { schedules: json.schedules },
        }),
      );
    } catch {}

    clearInterval(this.intervalValue);
    this.buttonTarget.disabled = false;
    this.buttonTarget.innerText = this.buttonTarget.dataset.initialText;
  }
}
