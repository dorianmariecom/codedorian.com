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

globalThis.window = {};
globalThis.document = new EventTarget();
let script;
document.getElementById = (id) =>
  id === "recaptcha-enterprise" ? script : null;

await import("../../app/javascript/controllers/recaptcha_controller.js");

test("native menu pages reset recaptcha on every Turbo render without a form controller", () => {
  for (const locale of ["en", "fr", "en"]) {
    window.grecaptcha = { enterprise: {} };
    window.___grecaptcha_cfg = { locale };
    let removed = false;
    script = {
      remove() {
        removed = true;
        script = null;
      },
    };

    document.dispatchEvent(new Event("turbo:before-render"));

    assert.equal(removed, true);
    assert.equal(window.grecaptcha, undefined);
    assert.equal(window.___grecaptcha_cfg, undefined);
  }
});

test("Turbo navigation is safe before recaptcha has loaded", () => {
  script = null;

  assert.doesNotThrow(() => {
    document.dispatchEvent(new Event("turbo:before-render"));
  });
});
