import { Controller } from "@hotwired/stimulus";
import I18n from "i18n";
import {
  VALID_CLASSES,
  INVALID_CLASSES,
  LABEL_VALID_CLASSES,
  LABEL_INVALID_CLASSES,
} from "constants";

const t = I18n("address");

export default class extends Controller {
  static targets = [
    "input",
    "error",
    "label",
    "addressComponents",
    "formattedAddress",
    "geometry",
    "placeId",
    "types",
  ];

  static values = {
    trim: { type: Boolean, default: false },
  };

  connect() {
    if (typeof google !== "undefined") {
      this.autocomplete = new google.maps.places.Autocomplete(this.inputTarget);
      this.autocomplete.addListener("place_changed", this.input.bind(this));
    }
  }

  disconnect() {
    this.autocomplete = null;
  }

  keydown(event) {
    if (event.code === "Enter") {
      event.preventDefault();
    }
  }

  input() {
    const place = this.autocomplete.getPlace();

    if (place) {
      this.addressComponentsTarget.value = JSON.stringify(
        place.address_components,
      );
      this.formattedAddressTarget.value = place.formatted_address;
      this.geometryTarget.value = JSON.stringify(place.geometry);
      this.placeIdTarget.value = place.place_id;
      this.typesTarget.value = JSON.stringify(place.types);
    }

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
        this.errorTarget.innerText = t("not_present");
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
