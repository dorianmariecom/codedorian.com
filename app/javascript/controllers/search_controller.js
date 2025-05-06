import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "advanced",
    "itemTemplate",
    "buttonTemplate",
  ];

  static classes = ["group"];

  static values = {
    defaultType: { type: String, default: "key_value" },
    advancedOpen: { type: Boolean, default: false },
  };

  addItem(event) {
    const group = event.target.closest(".js-search-group");
    const newItem = this.itemTemplateTarget.content.cloneNode(true);
    group.appendChild(newItem);
  }

  chooseKeyValue(event) {
    const item = event.target.closest(".js-search-item");
    const keyValue = item.querySelector(".js-search-key-value");
    const freeField = item.querySelector(".js-search-free-field");

    keyValue.hidden = false;
    freeField.hidden = true;
  }

  chooseFreeField(event) {
    const item = event.target.closest(".js-search-item");
    const keyValue = item.querySelector(".js-search-key-value");
    const freeField = item.querySelector(".js-search-free-field");

    keyValue.hidden = true;
    freeField.hidden = false;
  }

  removeItem(event) {
    event.target.closest(".js-search-item").remove();
  }

  toggleAdvanced() {
    this.advancedOpenValue = this.advancedTarget.open;
  }

  advancedOpenValueChanged(advancedOpen) {
    if (advancedOpen !== this.advancedTarget.open) {
      this.advancedTarget.open = advancedOpen;
    }
  }
}
