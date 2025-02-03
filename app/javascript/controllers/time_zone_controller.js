import { Controller } from "@hotwired/stimulus";
import I18n from "i18n";
import {
  VALID_CLASSES,
  INVALID_CLASSES,
  LABEL_VALID_CLASSES,
  LABEL_INVALID_CLASSES,
} from "constants";

const t = I18n("time_zone");

export default class extends Controller {
  static targets = ["label", "input", "error"];

  connect() {
    if (!this.inputTarget.value) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.inputTarget.value = timeZone;
    }
  }

  input() {
    if (this.inputTarget.required && !this.inputTarget.value) {
      this.errorTarget.hidden = false;
      this.errorTarget.innerText = t("not_present");
      this.inputTarget.classList.add(...INVALID_CLASSES);
      this.inputTarget.classList.remove(...VALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_INVALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_VALID_CLASSES);
    } else {
      this.errorTarget.hidden = true;
      this.errorTarget.innerText = "";
      this.inputTarget.classList.add(...VALID_CLASSES);
      this.inputTarget.classList.remove(...INVALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_VALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_INVALID_CLASSES);
    }
  }
}
