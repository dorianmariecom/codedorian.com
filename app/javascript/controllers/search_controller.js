import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "advanced",
    "itemTemplate",
    "emptyTemplate",
  ];

  static values = {
    defaultType: { type: String, default: "key_value" },
    advancedOpen: { type: Boolean, default: false },
  };

  addItem(event) {
    const empty = event.target.closest(".js-search-empty");
    empty.remove()

    const html = Object.entries(this._rootValues()).reduce((html, [key, value]) => {
      return html.replaceAll(`{${key}}`, this._escapeHtml(value))
    }, this.itemTemplateTarget.innerHTML);

    this.advancedTarget.insertAdjacentHTML('beforeend', html);
  }

  orItem(event) {
  }

  andItem(event) {
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

  _escapeHtml(unsafe) {
    return (unsafe ?? "")
      .toString()
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  _rootValues() {
    return {
      type_id: "search_type",
      type_name: "search[type]",
      free_field_name: "search[free_field]",
      free_field_id: "search_free_field",
      key_value_key_name: "search[key_value][key]",
      key_value_key_id: "search_key_value_key",
      key_value_operator_name: "search[key_value][operator]",
      key_value_operator_id: "search_key_value_operator",
      key_value_type_name: "search[key_value][type]",
      key_value_type_id: "search_key_value_type",
      key_value_value_name: "search[key_value][value]",
      key_value_value_id: "search_key_value_value",
      key_value_first_name: "search[key_value][first]",
      key_value_first_id: "search_key_value_first",
      key_value_last_name: "search[key_value][last]",
      key_value_last_id: "search_key_value_last",
    }
  }
}
