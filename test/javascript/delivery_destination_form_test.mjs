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
const { default: Controller } =
  await import("../../app/javascript/controllers/delivery_destination_form_controller.js");

function form(data = {}) {
  const controller = new Controller({});
  controller.channelTarget = { selectedOptions: [{ dataset: data }] };
  controller.recipientRowTarget = {};
  controller.recipientTarget = {
    value: "",
    removeAttribute(name) {
      delete this[name];
    },
  };
  controller.visibilityRowTarget = {};
  controller.visibilityTarget = {
    value: "private",
    options: [{ value: "private" }, { value: "public" }],
  };
  controller.hasConnectionTarget = true;
  controller.connectionRowTarget = {};
  controller.connectionTarget = { value: "123" };
  return controller;
}

test("visibility and patterns follow channel data without provider names", () => {
  const controller = form({
    deliveryDestinationFormShowRecipient: "true",
    deliveryDestinationFormShowVisibility: "true",
    deliveryDestinationFormShowConnection: "true",
    deliveryDestinationFormPublicPattern: "#[a-z]+",
    deliveryDestinationFormPrivatePattern: "@[a-z]+",
    deliveryDestinationFormPublicRequired: "false",
    deliveryDestinationFormPrivateRequired: "true",
  });
  controller.change();
  assert.equal(controller.recipientTarget.pattern, "@[a-z]+");
  assert.equal(controller.recipientTarget.required, true);
  assert.equal(controller.connectionRowTarget.hidden, false);
  controller.visibilityTarget.value = "public";
  controller.change();
  assert.equal(controller.recipientTarget.pattern, "#[a-z]+");
  assert.equal(controller.recipientTarget.required, false);
  assert.equal(controller.visibilityRowTarget.hidden, false);
});

test("restricted hidden fields remain enabled and use the configured visibility", () => {
  const controller = form({
    deliveryDestinationFormOnly: "public",
    deliveryDestinationFormPublicPattern: "",
  });
  controller.recipientTarget.value = "old";
  controller.change();
  assert.equal(controller.visibilityTarget.value, "public");
  assert.equal(controller.visibilityRowTarget.hidden, true);
  assert.equal(controller.visibilityTarget.options[0].hidden, true);
  assert.equal(controller.visibilityTarget.options[0].disabled, undefined);
  assert.equal(controller.recipientRowTarget.hidden, true);
  assert.equal(controller.recipientTarget.value, "");
  assert.equal(controller.recipientTarget.disabled, undefined);
  assert.equal(controller.recipientTarget.pattern, "");
  assert.equal(controller.connectionTarget.value, "");
  controller.channelTarget.selectedOptions[0].dataset = {
    deliveryDestinationFormOnly: "private",
  };
  controller.change();
  assert.equal(controller.visibilityTarget.value, "private");
  assert.equal(controller.recipientTarget.pattern, undefined);
  assert.equal(controller.visibilityTarget.options[0].hidden, false);
});

test("changing to an unrestricted channel restores both visibility options", () => {
  const controller = form({ deliveryDestinationFormOnly: "public" });
  controller.change();
  controller.channelTarget.selectedOptions[0].dataset = {
    deliveryDestinationFormShowVisibility: "true",
  };
  controller.change();
  assert.equal(controller.visibilityRowTarget.hidden, false);
  for (const option of controller.visibilityTarget.options)
    assert.equal(option.hidden, false);
});
