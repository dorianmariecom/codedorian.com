import { Controller } from "@hotwired/stimulus";
import intlTelInput from "intl-tel-input";
import I18n from "i18n";
import {
  VALID_CLASSES,
  INVALID_CLASSES,
  LABEL_VALID_CLASSES,
  LABEL_INVALID_CLASSES,
} from "constants";

const t = I18n("phone_number");
const DEFAULT_COUNTRY_CODE = window.DEFAULT_COUNTRY_CODE;
const ERRORS = {
  0: t("is_possible"),
  1: t("invalid_country_code"),
  2: t("too_short"),
  3: t("too_long"),
  4: t("is_possible_local_only"),
  5: t("invalid_length"),
  "-99": t("invalid_phone_number"),
};

export default class extends Controller {
  static targets = ["input", "error", "hidden", "label"];

  static values = {
    trim: { type: Boolean, default: false },
  };

  connect() {
    this.iti = intlTelInput(this.inputTarget, {
      loadUtils: () => import("intl-tel-input/build/js/utils.js"),
      initialCountry: "auto",
      geoIpLookup: async function (success) {
        try {
          const response = await fetch("/country_code_ip_addresses/me", {
            headers: { Accept: "application/json" },
          });
          const json = await response.json();
          success(json.country_code || DEFAULT_COUNTRY_CODE);
        } catch {
          success(DEFAULT_COUNTRY_CODE);
        }
      },
    });
  }

  disconnect() {
    this.iti = null;
  }

  input() {
    this.hiddenTarget.value = this.iti.getNumber();
    this.inputTarget.classList.add("input--touched");

    if (this.trimValue) {
      this.inputTarget.value = this.inputTarget.value.trim();
    }

    if (this.inputTarget.checkValidity() && this.iti.isValidNumber()) {
      this.errorTarget.hidden = true;
      this.errorTarget.innerText = "";
      this.inputTarget.classList.add(...VALID_CLASSES);
      this.inputTarget.classList.remove(...INVALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_VALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_INVALID_CLASSES);
    } else {
      if (this.inputTarget.required && !this.inputTarget.value) {
        this.errorTarget.innerText = t("not_present");
      } else if (!this.iti.isValidNumber()) {
        this.errorTarget.innerText = ERRORS[this.iti.getValidationError()];
      } else {
        this.errorTarget.innerText = t("not_valid");
      }

      this.errorTarget.hidden = false;
      this.inputTarget.classList.add(...INVALID_CLASSES);
      this.inputTarget.classList.remove(...VALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_INVALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_VALID_CLASSES);
    }
  }
}
