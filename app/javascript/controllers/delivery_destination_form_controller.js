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
    "connectionOptions",
  ];

  connect() {
    window.requestAnimationFrame(() => this.change());
  }

  change() {
    const data = this.channelTarget.selectedOptions[0]?.dataset || {};
    const visibilityRestriction =
      data.deliveryDestinationFormVisibilityRestriction;
    if (visibilityRestriction)
      this.visibilityTarget.value = visibilityRestriction;
    this.visibilityRowTarget.hidden =
      data.deliveryDestinationFormShowVisibility !== "true";
    for (const option of this.visibilityTarget.options || []) {
      option.hidden =
        !!visibilityRestriction && option.value !== visibilityRestriction;
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
      const selected = this.connectionTarget.value;
      const providers = (data.deliveryDestinationFormProviders || "").split(
        " ",
      );
      const options = Array.from(this.connectionOptionsTarget.content.children)
        .filter((option) =>
          providers.includes(option.dataset.deliveryDestinationFormProvider),
        )
        .map((option) => option.cloneNode(true));
      this.connectionTarget.replaceChildren(
        this.connectionTarget.options[0].cloneNode(true),
        ...options,
      );
      this.connectionTarget.value = options.some(
        (option) => option.value === selected,
      )
        ? selected
        : "";
      this.connectionRowTarget.hidden = !showConnection;
      this.connectionTarget.required = showConnection;
      if (!showConnection) this.connectionTarget.value = "";
    }
  }
}
