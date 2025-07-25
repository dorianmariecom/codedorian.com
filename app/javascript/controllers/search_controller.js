import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["form"];

  search() {
    this.formTarget.requestSubmit();
  }
}
