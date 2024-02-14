import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["prompt", "name", "input"];

  async generate() {
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

    this.nameTarget.value = json.name;
    this.inputTarget.value = json.input;
  }
}
