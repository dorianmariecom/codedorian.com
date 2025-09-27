import { Controller } from "@hotwired/stimulus";
import I18n from "i18n";
import {
  VALID_CLASSES,
  INVALID_CLASSES,
  LABEL_VALID_CLASSES,
  LABEL_INVALID_CLASSES,
} from "constants";

window.googleMapsCallback = () =>
  window.dispatchEvent(new Event("google-maps-callback"));

const t = I18n("address");

export default class extends Controller {
  static targets = ["autocomplete", "address", "input", "error", "label"];

  static values = {
    trim: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
  };

  connect() {
    if (window.google?.maps?.places) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `
      https://maps.googleapis.com/maps/api/js
      ?key=${window.GOOGLE_MAPS_API_KEY}
      &callback=googleMapsCallback
      &loading=async
      &libraries=places
      &time=${Date.now()}
      &random=${Math.random()}
    `.replace(/[ \n]/g, "");

    document.head.appendChild(script);
  }

  async load() {
    await google.maps.importLibrary("places");
  }

  input(event) {
    this.addressTarget.value = event.data;
    this._validate();
  }

  async select({ placePrediction }) {
    const place = placePrediction.toPlace();
    await place.fetchFields({
      fields: [
        "id",
        "displayName",
        "formattedAddress",
        "adrFormatAddress",
        "addressComponents",
        "postalAddress",
        "plusCode",
        "types",
        "primaryType",
        "primaryTypeDisplayName",
        "location",
        "viewport",
      ],
    });

    this.autocompleteTarget.value = JSON.stringify(place.toJSON());
  }

  _validate() {
    if (this.trimValue) {
      this.addressTarget.value = this.addressTarget.value.trim();
    }

    if (this.requiredValue && this.addressTarget.value !== "") {
      this.errorTarget.hidden = true;
      this.errorTarget.innerText = "";
      this.inputTarget.classList.add(...VALID_CLASSES);
      this.inputTarget.classList.remove(...INVALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_VALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_INVALID_CLASSES);
    } else {
      this.errorTarget.innerText = t("not_present");
      this.errorTarget.hidden = false;
      this.inputTarget.classList.add(...INVALID_CLASSES);
      this.inputTarget.classList.remove(...VALID_CLASSES);
      this.labelTarget.classList.add(...LABEL_INVALID_CLASSES);
      this.labelTarget.classList.remove(...LABEL_VALID_CLASSES);
    }
  }
}
