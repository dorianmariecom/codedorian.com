import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["form", "input"];

  select() {
    window.Turbo.visit(this.inputTarget.value);
  }
}
