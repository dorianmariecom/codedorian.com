import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "channel",
    "recipientRow",
    "recipient",
    "visibilityRow",
    "visibility"
  ];

  connect() {
    window.requestAnimationFrame(() => {
      this.change();
    });
  }

  change() {
    const selectedChannel = this.channelTarget?.selectedOptions?.[0];
    const showRecipient = this.parseBoolean(
      selectedChannel?.dataset?.deliveryDestinationFormShowRecipient
    );
    const showVisibility = this.parseBoolean(
      selectedChannel?.dataset?.deliveryDestinationFormShowVisibility
    );

    this.updateField(
      this.recipientRowTarget,
      this.recipientTarget,
      showRecipient,
      { clearValue: true }
    );
    this.updateField(
      this.visibilityRowTarget,
      this.visibilityTarget,
      showVisibility,
      {
        forcePrivate: true
      }
    );
    const channel = selectedChannel?.dataset?.deliveryDestinationFormChannel;
    const publicWithoutRecipient =
      this.visibilityTarget.value === "public" &&
      ["x", "mastodon"].includes(channel);
    this.recipientTarget.required = showRecipient && !publicWithoutRecipient;
  }

  parseBoolean(value) {
    if (value === undefined) {
      return false;
    }

    return value === "true";
  }

  updateField(row, input, visible, options = {}) {
    if (!row || !input) {
      return;
    }

    row.hidden = !visible;
    input.required = visible;

    if (!visible) {
      if (options.clearValue) {
        input.value = "";
      }
      if (options.forcePrivate) {
        input.value = "private";
      }
      return;
    }
  }
}
