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
const DEFAULT_COUNTRY_CODE = window.DEFAULT_COUNTRY_CODE || "US";
const ERRORS = {
  IS_POSSIBLE: t("is_possible"),
  INVALID_COUNTRY_CODE: t("invalid_country_code"),
  TOO_SHORT: t("too_short"),
  TOO_LONG: t("too_long"),
  IS_POSSIBLE_LOCAL_ONLY: t("is_possible_local_only"),
  INVALID_LENGTH: t("invalid_length"),
  INVALID_PHONE_NUMBER: t("invalid_phone_number"),
};

const normalizeCountryCode = (countryCode) =>
  (countryCode || DEFAULT_COUNTRY_CODE).toLowerCase();

export default class extends Controller {
  static targets = ["input", "error", "hidden", "label"];

  static values = {
    trim: { type: Boolean, default: false },
  };

  connect() {
    this.iti = intlTelInput(this.inputTarget, {
      loadUtils: () => import("intl-tel-input/utils"),
      initialCountryLookup: this.initialCountryLookup,
    });
  }

  disconnect() {
    this.iti?.destroy();
    this.iti = null;
  }

  async input() {
    if (!this.iti) return;

    this.inputTarget.classList.add("input--touched");

    if (this.trimValue) {
      this.inputTarget.value = this.inputTarget.value.trim();
    }

    const iti = this.iti;
    let utilsLoaded = false;
    let phoneValid = false;
    let validationError = "INVALID_PHONE_NUMBER";

    try {
      await iti.promise;
      utilsLoaded = true;
    } catch {
      this.hiddenTarget.value = this.inputTarget.value;
    }

    if (this.iti !== iti) return;

    if (utilsLoaded) {
      phoneValid = iti.isValidNumber();
      validationError = iti.getValidationError();

      const valid = this.inputTarget.checkValidity() && phoneValid;
      this.hiddenTarget.value = valid
        ? iti.getNumber()
        : this.inputTarget.value;
    }

    if (this.inputTarget.checkValidity() && phoneValid) {
      this.errorTarget.hidden = true;
      this.errorTarget.innerText = "";
      this.inputTarget.classList.add(...VALID_CLASSES);
      this.inputTarget.classList.remove(...INVALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_VALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_INVALID_CLASSES);
    } else {
      if (this.inputTarget.required && !this.inputTarget.value) {
        this.errorTarget.innerText = t("not_present");
      } else if (!phoneValid) {
        this.errorTarget.innerText =
          ERRORS[validationError] || ERRORS.INVALID_PHONE_NUMBER;
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

  async initialCountryLookup() {
    try {
      const response = await fetch("/country_code_ip_addresses/me", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("country code lookup failed");

      const json = await response.json();

      return normalizeCountryCode(json.country_code);
    } catch {
      return normalizeCountryCode();
    }
  }
}
