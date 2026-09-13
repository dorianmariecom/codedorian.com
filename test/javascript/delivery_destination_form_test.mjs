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
