import { Controller } from "@hotwired/stimulus";
import I18n from "i18n";
import debounce from "debounce";
import {
  VALID_CLASSES,
  INVALID_CLASSES,
  LABEL_VALID_CLASSES,
  LABEL_INVALID_CLASSES,
} from "constants";

const t = I18n("password");

export default class extends Controller {
  static targets = ["input", "error", "show", "hide", "label"];

  initialize() {
    this.validate = debounce(this.validate, 300).bind(this);
  }

  input() {
    if (!this.inputTarget.value && this.inputTarget.required) {
      this.errorTarget.hidden = false;
      this.errorTarget.innerText = t("not_present");
      this.inputTarget.classList.add(...INVALID_CLASSES);
      this.inputTarget.classList.remove(...VALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_INVALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_VALID_CLASSES);
    } else {
      this.validate();
    }
  }

  async validate() {
    const csrfToken = document.querySelector("[name='csrf-token']")?.content;

    const response = await fetch("/password_validations", {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: this.inputTarget.value }),
    });

    const json = await response.json();

    if (json.success) {
      this.errorTarget.innerText = "";
      this.errorTarget.hidden = true;
      this.inputTarget.classList.add(...VALID_CLASSES);
      this.inputTarget.classList.remove(...INVALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_VALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_INVALID_CLASSES);
    } else {
      this.errorTarget.hidden = false;
      this.errorTarget.innerText = json.message || t("not_present");
      this.inputTarget.classList.add(...INVALID_CLASSES);
      this.inputTarget.classList.remove(...VALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_INVALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_VALID_CLASSES);
    }
  }

  show(event) {
    event.preventDefault();

    this.inputTarget.type = "text";
    this.showTarget.hidden = true;
    this.hideTarget.hidden = false;
  }

  hide(event) {
    event.preventDefault();

    this.inputTarget.type = "password";
    this.showTarget.hidden = false;
    this.hideTarget.hidden = true;
  }
}
