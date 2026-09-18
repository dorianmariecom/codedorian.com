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
    "slackHelp",
    "xHelp",
    "redditHelp",
    "mastodonHelp",
    "messagingHelp",
    "facebookHelp",
    "facebookRecipientRow",
    "facebookRecipient",
  ];

  connect() {
    window.requestAnimationFrame(() => {
      this.change();
    });
  }

  change() {
    const selectedChannel = this.channelTarget?.selectedOptions?.[0];
    const channel = selectedChannel?.dataset?.deliveryDestinationFormChannel;
    const showRecipient = channel !== "facebook" && this.parseBoolean(
      selectedChannel?.dataset?.deliveryDestinationFormShowRecipient,
    );
    const showVisibility =
      channel === "facebook" ||
      (["x", "mastodon", "reddit"].includes(channel) &&
        this.parseBoolean(
          selectedChannel?.dataset?.deliveryDestinationFormShowVisibility,
        ));

    const publicOnly = channel === "facebook" ||
      (channel === "reddit" && !this.parseBoolean(
        selectedChannel?.dataset?.deliveryDestinationFormPrivateEnabled,
      ));
    if (publicOnly) this.visibilityTarget.value = "public";
    for (const option of this.visibilityTarget.options || []) {
      if (option.value === "private") option.disabled = publicOnly;
    }

    this.updateField(
      this.recipientRowTarget,
      this.recipientTarget,
      showRecipient,
      { clearValue: true },
    );
    this.updateField(
      this.visibilityRowTarget,
      this.visibilityTarget,
      showVisibility,
      {
        forcePrivate: true,
      },
    );
    if (this.hasConnectionTarget) {
      const personal = ["slack", "x", "mastodon", "reddit"].includes(channel);
      this.connectionRowTarget.hidden = !personal;
      this.connectionTarget.required = personal;
      for (const option of this.connectionTarget.options) {
        const matches = !option.value || option.dataset.provider === channel;
        option.hidden = !matches;
        option.disabled = !matches;
        if (!matches && option.selected) this.connectionTarget.value = "";
      }
      if (!personal) this.connectionTarget.value = "";
    }
    if (this.hasSlackHelpTarget) this.slackHelpTarget.hidden = channel !== "slack";
    this.recipientTarget.pattern = channel === "slack" ? "[@#][^\\s@#<>]+" : ".*";
    if (this.hasXHelpTarget) this.xHelpTarget.hidden = channel !== "x";
    if (channel === "x") {
      this.recipientTarget.pattern = this.visibilityTarget.value === "public"
        ? "(@[a-zA-Z0-9_]{1,15}|#[\\p{L}\\p{N}_]+)?"
        : "@[a-zA-Z0-9_]{1,15}";
    }
    if (this.hasMastodonHelpTarget) this.mastodonHelpTarget.hidden = channel !== "mastodon";
    if (this.hasRedditHelpTarget) this.redditHelpTarget.hidden = channel !== "reddit";
    if (channel === "reddit") {
      this.recipientTarget.pattern = this.visibilityTarget.value === "public"
        ? String.raw`(?:r/|#)[a-zA-Z0-9_]{2,21}`
        : String.raw`(?:u/|@)[a-zA-Z0-9_\-]{3,20}`;
    }
    if (this.hasFacebookHelpTarget) this.facebookHelpTarget.hidden = channel !== "facebook";
    if (this.hasMessagingHelpTarget) this.messagingHelpTarget.hidden = !["instagram", "telegram", "viber"].includes(channel);
    const publicWithoutRecipient =
      this.visibilityTarget.value === "public" &&
      ["x", "mastodon", "facebook"].includes(channel);
    this.recipientTarget.required = showRecipient && !publicWithoutRecipient;
    if (this.hasFacebookRecipientTarget) {
      const messenger = channel === "messenger";
      this.facebookRecipientRowTarget.hidden = !messenger;
      this.facebookRecipientTarget.disabled = !messenger;
      this.facebookRecipientTarget.required = messenger;
      this.recipientTarget.disabled = messenger;
      if (messenger) {
        this.recipientRowTarget.hidden = true;
        this.recipientTarget.required = false;
      }
    }
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
