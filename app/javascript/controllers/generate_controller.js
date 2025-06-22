import { Controller } from "@hotwired/stimulus";

const INTERVAL_DELAY_MS = 500;

const ELLIPSIS = ["&nbsp;&nbsp;&nbsp;", ".&nbsp;&nbsp;", "..&nbsp;", "..."];

export default class extends Controller {
  static targets = ["name", "input", "button"];

  static values = {
    index: Number,
    interval: Number,
  };

  async generate() {
    this.buttonTarget.disabled = false;

    this.intervalValue = setInterval(() => {
      this.buttonTarget.innerHTML =
        this.buttonTarget.dataset.loadingText + ELLIPSIS[this.indexValue];
      this.indexValue = (this.indexValue + 1) % ELLIPSIS.length;
    }, INTERVAL_DELAY_MS);

    try {
      const csrfToken = document.querySelector("[name='csrf-token']")?.content;

      const response = await fetch("/generate", {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ prompt: { name: this.nameTarget.value } }),
      });

      const json = await response.json();

      this.inputTarget.value = json.input;
    } catch {}

    clearInterval(this.intervalValue);
    this.buttonTarget.disabled = false;
    this.buttonTarget.innerText = this.buttonTarget.dataset.initialText;
  }
}
