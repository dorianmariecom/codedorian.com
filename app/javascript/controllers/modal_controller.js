import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  close() {
    this.dispatch("closed");
  }

  hide() {
    this.dispatch("hidden");
  }

  escape() {
    this.dispatch("escaped");
  }

  confirm() {
    this.dispatch("confirmed");
  }

  cancel() {
    this.dispatch("canceled");
  }

  nothing() {}
}
