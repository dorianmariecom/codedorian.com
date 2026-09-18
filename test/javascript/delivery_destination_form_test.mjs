import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@hotwired/stimulus") {
      return {
        url: new URL(
          "../../vendor/javascript/@hotwired--stimulus.js",
          import.meta.url,
        ).href,
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});

const { default: DeliveryDestinationFormController } =
  await import("../../app/javascript/controllers/delivery_destination_form_controller.js");

function form(channel) {
  const controller = new DeliveryDestinationFormController({});
  controller.channelTarget = {
    selectedOptions: [
      {
        dataset: {
          deliveryDestinationFormChannel: channel,
          deliveryDestinationFormShowRecipient: "true",
          deliveryDestinationFormShowVisibility: "true",
        },
      },
    ],
  };
  controller.recipientRowTarget = {};
  controller.recipientTarget = { value: "" };
  controller.visibilityRowTarget = {};
  controller.visibilityTarget = { value: "private" };
  return controller;
}

test("X and Mastodon require recipients only for private destinations", () => {
  for (const channel of ["x", "mastodon"]) {
    const controller = form(channel);
    controller.change();
    assert.equal(controller.recipientTarget.required, true);
    controller.visibilityTarget.value = "public";
    controller.change();
    assert.equal(controller.recipientTarget.required, false);
    controller.visibilityTarget.value = "private";
    controller.change();
    assert.equal(controller.recipientTarget.required, true);
  }
});

test("public Reddit destinations still require a subreddit", () => {
  const controller = form("reddit");
  controller.visibilityTarget.value = "public";
  controller.change();
  assert.equal(controller.recipientTarget.required, true);
});

test("hidden visibility resets to private before validating the recipient", () => {
  const controller = form("x");
  controller.visibilityTarget.value = "public";
  controller.channelTarget.selectedOptions[0].dataset.deliveryDestinationFormShowVisibility =
    "false";
  controller.change();
  assert.equal(controller.visibilityTarget.value, "private");
  assert.equal(controller.recipientTarget.required, true);
});

test("Slack ignores public visibility even when the channel flag is enabled", () => {
  const controller = form("slack");
  controller.visibilityTarget.value = "public";
  controller.change();
  assert.equal(controller.visibilityRowTarget.hidden, true);
  assert.equal(controller.visibilityTarget.value, "private");
  assert.equal(controller.recipientTarget.required, true);
});

test("Slack requires a matching connection and explains how to connect", () => {
  const controller = form("slack");
  controller.hasConnectionTarget = true;
  controller.hasSlackHelpTarget = true;
  controller.connectionRowTarget = {};
  controller.slackHelpTarget = {};
  controller.connectionTarget = {
    value: "2",
    options: [
      { value: "", dataset: {} },
      { value: "1", dataset: { provider: "slack" } },
      { value: "2", selected: true, dataset: { provider: "mastodon" } },
    ],
  };
  controller.change();
  assert.equal(controller.connectionTarget.required, true);
  assert.equal(controller.connectionRowTarget.hidden, false);
  assert.equal(controller.connectionTarget.value, "");
  assert.equal(controller.connectionTarget.options[1].disabled, false);
  assert.equal(controller.connectionTarget.options[2].disabled, true);
  assert.equal(controller.slackHelpTarget.hidden, false);
});

test("X public posts accept hashtags with browser pattern semantics", () => {
  const controller = form("x");
  controller.visibilityTarget.value = "public";
  controller.change();
  const pattern = new RegExp(`^(?:${controller.recipientTarget.pattern})$`, "v");
  for (const recipient of ["#testing", "#été", "@dorian", ""]) {
    assert.equal(pattern.test(recipient), true, recipient);
  }
  assert.equal(pattern.test("testing"), false);
  controller.visibilityTarget.value = "private";
  controller.change();
  const privatePattern = new RegExp(`^(?:${controller.recipientTarget.pattern})$`, "v");
  assert.equal(privatePattern.test("#testing"), false);
  assert.equal(privatePattern.test("@dorian"), true);
});

test("Slack recipient pattern accepts names but rejects whitespace", () => {
  const controller = form("slack");
  controller.change();
  const pattern = new RegExp(`^(?:${controller.recipientTarget.pattern})$`, "v");
  assert.equal(pattern.test("#testing"), true);
  assert.equal(pattern.test("@sam"), true);
  assert.equal(pattern.test("#two words"), false);
});

test("new messaging channels use private recipients and admin-managed senders", () => {
  for (const channel of ["messenger", "instagram", "telegram", "viber"]) {
    const controller = form(channel);
    controller.hasConnectionTarget = true;
    controller.hasMessagingHelpTarget = true;
    controller.connectionRowTarget = {};
    controller.messagingHelpTarget = {};
    controller.connectionTarget = { value: "1", options: [] };
    controller.visibilityTarget.value = "public";
    controller.change();
    assert.equal(controller.visibilityTarget.value, "private");
    assert.equal(controller.visibilityRowTarget.hidden, true);
    assert.equal(controller.recipientTarget.required, true);
    assert.equal(controller.connectionRowTarget.hidden, true);
    assert.equal(controller.connectionTarget.value, "");
    assert.equal(controller.messagingHelpTarget.hidden, channel === "messenger");
  }
});

test("Facebook forces public page posts without a recipient even with hidden visibility", () => {
  const controller = form("facebook");
  controller.channelTarget.selectedOptions[0].dataset.deliveryDestinationFormShowVisibility = "false";
  controller.visibilityTarget.options = [{ value: "private" }, { value: "public" }];
  controller.hasFacebookHelpTarget = true;
  controller.facebookHelpTarget = {};
  controller.recipientTarget.value = "old-recipient";
  controller.change();
  assert.equal(controller.visibilityTarget.value, "public");
  assert.equal(controller.visibilityRowTarget.hidden, false);
  assert.equal(controller.visibilityTarget.options[0].disabled, true);
  assert.equal(controller.recipientRowTarget.hidden, true);
  assert.equal(controller.recipientTarget.required, false);
  assert.equal(controller.recipientTarget.value, "");
  assert.equal(controller.facebookHelpTarget.hidden, false);
  controller.channelTarget.selectedOptions[0].dataset.deliveryDestinationFormChannel = "messenger";
  controller.change();
  assert.equal(controller.visibilityTarget.value, "private");
  assert.equal(controller.visibilityTarget.options[0].disabled, false);
  assert.equal(controller.facebookHelpTarget.hidden, true);
});

test("Messenger selects a connected Facebook person instead of a raw recipient", () => {
  const controller = form("messenger");
  controller.hasFacebookRecipientTarget = true;
  controller.facebookRecipientRowTarget = {};
  controller.facebookRecipientTarget = { value: "account-id" };
  controller.change();
  assert.equal(controller.facebookRecipientRowTarget.hidden, false);
  assert.equal(controller.facebookRecipientTarget.required, true);
  assert.equal(controller.facebookRecipientTarget.disabled, false);
  assert.equal(controller.recipientRowTarget.hidden, true);
  assert.equal(controller.recipientTarget.disabled, true);
  assert.equal(controller.recipientTarget.required, false);
  controller.channelTarget.selectedOptions[0].dataset.deliveryDestinationFormChannel = "instagram";
  controller.change();
  assert.equal(controller.facebookRecipientRowTarget.hidden, true);
  assert.equal(controller.facebookRecipientTarget.required, false);
  assert.equal(controller.facebookRecipientTarget.disabled, true);
  assert.equal(controller.recipientTarget.disabled, false);
});
