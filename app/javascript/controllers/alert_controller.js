import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["modal", "form"]

  show() {
    this.modalTarget.hidden = false;
  }

  cancel() {
    this.modalTarget.hidden = true;
  }

  confirm() {
    this.formTarget.submit();
    this.modalTarget.hidden = true;
  }
}
