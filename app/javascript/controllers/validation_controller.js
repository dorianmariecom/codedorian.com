import { Controller } from "@hotwired/stimulus";
import I18n from "i18n";
import {
  VALID_CLASSES,
  INVALID_CLASSES,
  LABEL_VALID_CLASSES,
  LABEL_INVALID_CLASSES,
} from "constants";

const t = I18n("validation");

export default class extends Controller {
  static targets = ["input", "error", "label"];

  static values = {
    gender: { type: String, default: "masculine" },
    trim: { type: Boolean, default: false },
  };

  input() {
    this.inputTarget.classList.add("input--touched");

    if (this.trimValue) {
      this.inputTarget.value = this.inputTarget.value.trim();
    }

    if (this.inputTarget.checkValidity()) {
      this.errorTarget.hidden = true;
      this.errorTarget.innerText = "";
      this.inputTarget.classList.add(...VALID_CLASSES);
      this.inputTarget.classList.remove(...INVALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_VALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_INVALID_CLASSES);
    } else {
      if (this.inputTarget.required && !this.inputTarget.value) {
        this.errorTarget.innerText = t(`not_present.${this.genderValue}`);
      } else if (this.inputTarget.type === "email") {
        this.errorTarget.innerText = t(`not_email.${this.genderValue}`);
      } else {
        this.errorTarget.innerText = t(`not_valid.${this.genderValue}`);
      }

      this.errorTarget.hidden = false;
      this.inputTarget.classList.add(...INVALID_CLASSES);
      this.inputTarget.classList.remove(...VALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_INVALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_VALID_CLASSES);
    }
  }
}
