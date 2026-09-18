import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "channel",
    "recipientRow",
    "recipient",
    "visibilityRow",
    "visibility",
    "connectionRow",
    "connection",
  ];

  connect() {
    window.requestAnimationFrame(() => this.change());
  }

  change() {
    const data = this.channelTarget.selectedOptions[0]?.dataset || {};
    const only = data.deliveryDestinationFormOnly;
    if (only) this.visibilityTarget.value = only;
    this.visibilityRowTarget.hidden =
      data.deliveryDestinationFormShowVisibility !== "true";
    for (const option of this.visibilityTarget.options || []) {
      option.hidden = !!only && option.value !== only;
    }

    const publicVisibility = this.visibilityTarget.value === "public";
    const pattern = publicVisibility
      ? data.deliveryDestinationFormPublicPattern
      : data.deliveryDestinationFormPrivatePattern;
    const required = publicVisibility
      ? data.deliveryDestinationFormPublicRequired
      : data.deliveryDestinationFormPrivateRequired;
    this.recipientRowTarget.hidden =
      data.deliveryDestinationFormShowRecipient !== "true";
    this.recipientTarget.required =
      !this.recipientRowTarget.hidden && required === "true";
    if (pattern === undefined) this.recipientTarget.removeAttribute("pattern");
    else this.recipientTarget.pattern = pattern;
    if (this.recipientRowTarget.hidden) this.recipientTarget.value = "";

    if (this.hasConnectionTarget) {
      const showConnection =
        data.deliveryDestinationFormShowConnection === "true";
      this.connectionRowTarget.hidden = !showConnection;
      this.connectionTarget.required = showConnection;
      if (!showConnection) this.connectionTarget.value = "";
    }
  }
}
