import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["prompt", "input", "loading"];

  async generate(e) {
    e.preventDefault();

    this.loadingTarget.classList.remove("hidden");

    const csrfToken = document.querySelector("[name='csrf-token']")?.content;

    const response = await fetch("/prompts", {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: this.promptTarget.value }),
    });

    const json = await response.json();

    this.inputTarget.value = json.input;
    this.loadingTarget.classList.add("hidden");
  }
}
