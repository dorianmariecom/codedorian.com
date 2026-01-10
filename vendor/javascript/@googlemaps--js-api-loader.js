// @googlemaps/js-api-loader@2.0.2 downloaded from https://ga.jspm.io/npm:@googlemaps/js-api-loader@2.0.2/dist/index.js

function o(o, e) {
  o.src = e;
}
const e = (e) => {
  var a;
  var r;
  var s;
  var t = "The Google Maps JavaScript API";
  var i = "google";
  var n = "importLibrary";
  var l = "__ib__";
  var p = document;
  var c = window;
  var d = c[i] || (c[i] = {});
  var g = d.maps || (d.maps = {});
  var m = new Set();
  var u = new URLSearchParams();
  var h = () =>
    a ||
    (a = new Promise(async (n, c) => {
      await (r = p.createElement("script"));
      u.set("libraries", [...m] + "");
      for (s in e)
        u.set(
          s.replace(/[A-Z]/g, (o) => "_" + o[0].toLowerCase()),
          e[s],
        );
      u.set("callback", i + ".maps." + l);
      o(r, "https://maps.googleapis.com/maps/api/js?" + u);
      g[l] = n;
      r.onerror = () => (a = c(Error(t + " could not load.")));
      r.nonce = p.querySelector("script[nonce]")?.nonce || "";
      p.head.append(r);
    }));
  g[n]
    ? console.warn(t + " only loads once. Ignoring:", e)
    : (g[n] = (o, ...e) => m.add(o) && h().then(() => g[n](o, ...e)));
};
const a =
  "The Loader class is no longer available in this version.\nPlease use the new functional API: setOptions() and importLibrary().\nFor more information, see the updated documentation at: https://github.com/googlemaps/js-api-loader/blob/main/README.md";
const r = (o) =>
  `The setOptions() function should only be called once. The options passed to the additional call (${JSON.stringify(o)}) will be ignored.`;
const s = (o) =>
  `The google.maps.importLibrary() function is already defined, and @googlemaps/js-api-loader will use the existing function instead of overwriting it. The options passed to setOptions (${JSON.stringify(o)}) will be ignored.`;
const t =
  "No options were set before calling importLibrary. Make sure to configure the loader using setOptions().";
const i =
  "There already is a script loading the Google Maps JavaScript API, and no google.maps.importLibrary function is defined. @googlemaps/js-api-loader will proceed to bootstrap the API with the specified options, but the existing script might cause problems using the API. Make sure to remove the script loading the API.";
const n = process.env.NODE_ENV !== "production";
const l = n
  ? (o) => {
      console.warn(`[@googlemaps/js-api-loader] ${o}`);
    }
  : () => {};
const p = n
  ? (o) => {
      console.info(`[@googlemaps/js-api-loader] ${o}`);
    }
  : () => {};
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * @deprecated Use the new functional API: `setOptions()` and `importLibrary()`.
 * See the migration guide for more details: MIGRATION.md
 */ class Loader {
  constructor(...o) {
    throw new Error(`[@googlemaps/js-api-loader]: ${a}`);
  }
}
const c = process.env.NODE_ENV !== "production";
let d = false;
/**
 * Sets the options for the Maps JavaScript API.
 *
 * Has to be called before any library is loaded.
 *
 * See https://developers.google.com/maps/documentation/javascript/load-maps-js-api#required_parameters
 * for the full documentation of available options.
 *
 * @param options The options to set.
 */ function g(o) {
  if (d) l(r(o));
  else {
    u(o);
    d = true;
  }
}
async function m(o) {
  d || l(t);
  if (!window?.google?.maps?.importLibrary)
    throw new Error("google.maps.importLibrary is not installed.");
  return await google.maps.importLibrary(o);
}
function u(o) {
  const a = Boolean(window.google?.maps?.importLibrary);
  if (a) p(s(o));
  else if (c) {
    const o = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]',
    );
    o && l(i);
  }
  a || e(o);
}
export { Loader, m as importLibrary, g as setOptions };
