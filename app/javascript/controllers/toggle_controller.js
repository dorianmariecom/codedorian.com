import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["target"];

  toggle() {
    this.targetTargets.forEach((target) => {
      target.hidden = !target.hidden;
    });
  }
}
