import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["checkbox", "target"];

  connect() {
    window.requestAnimationFrame(() => {
      this.sync();
    });
  }

  toggle() {
    this.sync();
  }

  sync() {
    if (!this.hasCheckboxTarget) return;

    this.targetTargets.forEach((target) => {
      target.hidden = !this.checkboxTarget.checked;
    });
  }
}
