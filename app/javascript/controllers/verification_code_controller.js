import { Controller } from "@hotwired/stimulus";
import I18n from "i18n";
import { VALID_CLASSES, INVALID_CLASSES } from "constants";

const t = I18n("verification_code");

const VERIFICATION_CODE_REGEXP = window.constants.VERIFICATION_CODE_REGEXP;

export default class extends Controller {
  static targets = ["input", "error"];

  input() {
    if (!this.inputTarget.value && this.inputTarget.required) {
      this.errorTarget.innerText = t("not_present");
      this.inputTarget.classList.add(...INVALID_CLASSES);
      this.inputTarget.classList.remove(...VALID_CLASSES);
    } else if (
      this.inputTarget.value &&
      !this.inputTarget.value.match(VERIFICATION_CODE_REGEXP)
    ) {
      this.errorTarget.innerText = t("not_valid");
      this.inputTarget.classList.add(...INVALID_CLASSES);
      this.inputTarget.classList.remove(...VALID_CLASSES);
    } else {
      this.errorTarget.innerText = "";
      this.inputTarget.classList.add(...VALID_CLASSES);
      this.inputTarget.classList.remove(...INVALID_CLASSES);
    }
  }
}
