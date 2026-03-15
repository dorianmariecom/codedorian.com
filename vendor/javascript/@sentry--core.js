// @sentry/core@10.40.0 downloaded from https://ga.jspm.io/npm:@sentry/core@10.40.0/build/esm/index.js

const t = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
const e = globalThis;
const n = "10.40.0";
function s() {
  o(e);
  return e;
}
function o(t) {
  const e = (t.__SENTRY__ = t.__SENTRY__ || {});
  e.version = e.version || n;
  return (e[n] = e[n] || {});
}
/**
 * Returns a global singleton contained in the global `__SENTRY__[]` object.
 *
 * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
 * function and added to the `__SENTRY__` object.
 *
 * @param name name of the global singleton on __SENTRY__
 * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
 * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `GLOBAL_OBJ`'s return value
 * @returns the singleton
 */ function r(t, s, o = e) {
  const r = (o.__SENTRY__ = o.__SENTRY__ || {});
  const i = (r[n] = r[n] || {});
  return i[t] || (i[t] = s());
}
const i = ["debug", "info", "warn", "error", "log", "assert", "trace"];
const a = "Sentry Logger ";
const c = {};
/**
 * Temporarily disable sentry console instrumentations.
 *
 * @param callback The function to run against the original `console` messages
 * @returns The results of the callback
 */ function u(t) {
  if (!("console" in e)) return t();
  const n = e.console;
  const s = {};
  const o = Object.keys(c);
  o.forEach((t) => {
    const e = c[t];
    s[t] = n[t];
    n[t] = e;
  });
  try {
    return t();
  } finally {
    o.forEach((t) => {
      n[t] = s[t];
    });
  }
}
function l() {
  _().enabled = true;
}
function p() {
  _().enabled = false;
}
function f() {
  return _().enabled;
}
function d(...t) {
  h("log", ...t);
}
function m(...t) {
  h("warn", ...t);
}
function g(...t) {
  h("error", ...t);
}
function h(n, ...s) {
  t &&
    f() &&
    u(() => {
      e.console[n](`${a}[${n}]:`, ...s);
    });
}
function _() {
  return t
    ? r("loggerSettings", () => ({ enabled: false }))
    : { enabled: false };
}
const y = { enable: l, disable: p, isEnabled: f, log: d, warn: m, error: g };
const b = 50;
const v = "?";
const S = /\(error: (.*)\)/;
const k = /captureMessage|captureException/;
function w(...t) {
  const e = t.sort((t, e) => t[0] - e[0]).map((t) => t[1]);
  return (t, n = 0, s = 0) => {
    const o = [];
    const r = t.split("\n");
    for (let t = n; t < r.length; t++) {
      let n = r[t];
      n.length > 1024 && (n = n.slice(0, 1024));
      const i = S.test(n) ? n.replace(S, "$1") : n;
      if (!i.match(/\S*Error: /)) {
        for (const t of e) {
          const e = t(i);
          if (e) {
            o.push(e);
            break;
          }
        }
        if (o.length >= b + s) break;
      }
    }
    return A(o.slice(s));
  };
}
function x(t) {
  return Array.isArray(t) ? w(...t) : t;
}
function A(t) {
  if (!t.length) return [];
  const e = Array.from(t);
  /sentryWrapped/.test(E(e).function || "") && e.pop();
  e.reverse();
  if (k.test(E(e).function || "")) {
    e.pop();
    k.test(E(e).function || "") && e.pop();
  }
  return e
    .slice(0, b)
    .map((t) => ({
      ...t,
      filename: t.filename || E(e).filename,
      function: t.function || v,
    }));
}
function E(t) {
  return t[t.length - 1] || {};
}
const T = "<anonymous>";
function I(t) {
  try {
    return (t && typeof t === "function" && t.name) || T;
  } catch {
    return T;
  }
}
function $(t) {
  const e = t.exception;
  if (e) {
    const t = [];
    try {
      e.values.forEach((e) => {
        e.stacktrace.frames && t.push(...e.stacktrace.frames);
      });
      return t;
    } catch {
      return;
    }
  }
}
/**
 * Get the internal name of an internal Vue value, to represent it in a stacktrace.
 *
 * @param value The value to get the internal name of.
 */ function O(t) {
  const e = "__v_isVNode" in t && t.__v_isVNode;
  return e ? "[VueVNode]" : "[VueViewModel]";
}
function C(t) {
  let e = t?.startsWith("file://") ? t.slice(7) : t;
  e?.match(/\/[A-Z]:/) && (e = e.slice(1));
  return e;
}
const N = {};
const j = {};
function R(t, e) {
  N[t] = N[t] || [];
  N[t].push(e);
}
function M() {
  Object.keys(N).forEach((t) => {
    N[t] = void 0;
  });
}
function P(e, n) {
  if (!j[e]) {
    j[e] = true;
    try {
      n();
    } catch (n) {
      t && y.error(`Error while instrumenting ${e}`, n);
    }
  }
}
function D(e, n) {
  const s = e && N[e];
  if (s)
    for (const o of s)
      try {
        o(n);
      } catch (n) {
        t &&
          y.error(
            `Error while triggering instrumentation handler.\nType: ${e}\nName: ${I(o)}\nError:`,
            n,
          );
      }
}
let F = null;
function L(t) {
  const e = "error";
  R(e, t);
  P(e, q);
}
function q() {
  F = e.onerror;
  e.onerror = function (t, e, n, s, o) {
    const r = { column: s, error: o, line: n, msg: t, url: e };
    D("error", r);
    return !!F && F.apply(this, arguments);
  };
  e.onerror.__SENTRY_INSTRUMENTED__ = true;
}
let U = null;
function J(t) {
  const e = "unhandledrejection";
  R(e, t);
  P(e, z);
}
function z() {
  U = e.onunhandledrejection;
  e.onunhandledrejection = function (t) {
    const e = t;
    D("unhandledrejection", e);
    return !U || U.apply(this, arguments);
  };
  e.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
}
const B = Object.prototype.toString;
/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function W(t) {
  switch (B.call(t)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
      return true;
    default:
      return rt(t, Error);
  }
}
/**
 * Checks whether given value is an instance of the given built-in class.
 *
 * @param wat The value to be checked
 * @param className
 * @returns A boolean representing the result.
 */ function V(t, e) {
  return B.call(t) === `[object ${e}]`;
}
/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function G(t) {
  return V(t, "ErrorEvent");
}
/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function K(t) {
  return V(t, "DOMError");
}
/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function H(t) {
  return V(t, "DOMException");
}
/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function Z(t) {
  return V(t, "String");
}
/**
 * Checks whether given string is parameterized
 * {@link isParameterizedString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function Y(t) {
  return (
    typeof t === "object" &&
    t !== null &&
    "__sentry_template_string__" in t &&
    "__sentry_template_values__" in t
  );
}
/**
 * Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function X(t) {
  return (
    t === null || Y(t) || (typeof t !== "object" && typeof t !== "function")
  );
}
/**
 * Checks whether given value's type is an object literal, or a class instance.
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function Q(t) {
  return V(t, "Object");
}
/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function tt(t) {
  return typeof Event !== "undefined" && rt(t, Event);
}
/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function et(t) {
  return typeof Element !== "undefined" && rt(t, Element);
}
/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function nt(t) {
  return V(t, "RegExp");
}
/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */ function st(t) {
  return Boolean(t?.then && typeof t.then === "function");
}
/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function ot(t) {
  return (
    Q(t) &&
    "nativeEvent" in t &&
    "preventDefault" in t &&
    "stopPropagation" in t
  );
}
/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */ function rt(t, e) {
  try {
    return t instanceof e;
  } catch {
    return false;
  }
}
/**
 * Checks whether given value's type is a Vue ViewModel or a VNode.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function it(t) {
  return !!(
    typeof t === "object" &&
    t !== null &&
    (t.__isVue || t._isVue || t.__v_isVNode)
  );
}
function at(t) {
  return typeof Request !== "undefined" && rt(t, Request);
}
const ct = e;
const ut = 80;
/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */ function lt(t, e = {}) {
  if (!t) return "<unknown>";
  try {
    let n = t;
    const s = 5;
    const o = [];
    let r = 0;
    let i = 0;
    const a = " > ";
    const c = a.length;
    let u;
    const l = Array.isArray(e) ? e : e.keyAttrs;
    const p = (!Array.isArray(e) && e.maxStringLength) || ut;
    while (n && r++ < s) {
      u = pt(n, l);
      if (u === "html" || (r > 1 && i + o.length * c + u.length >= p)) break;
      o.push(u);
      i += u.length;
      n = n.parentNode;
    }
    return o.reverse().join(a);
  } catch {
    return "<unknown>";
  }
}
/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */ function pt(t, e) {
  const n = t;
  const s = [];
  if (!n?.tagName) return "";
  if (ct.HTMLElement && n instanceof HTMLElement && n.dataset) {
    if (n.dataset.sentryComponent) return n.dataset.sentryComponent;
    if (n.dataset.sentryElement) return n.dataset.sentryElement;
  }
  s.push(n.tagName.toLowerCase());
  const o = e?.length
    ? e.filter((t) => n.getAttribute(t)).map((t) => [t, n.getAttribute(t)])
    : null;
  if (o?.length)
    o.forEach((t) => {
      s.push(`[${t[0]}="${t[1]}"]`);
    });
  else {
    n.id && s.push(`#${n.id}`);
    const t = n.className;
    if (t && Z(t)) {
      const e = t.split(/\s+/);
      for (const t of e) s.push(`.${t}`);
    }
  }
  const r = ["aria-label", "type", "name", "title", "alt"];
  for (const t of r) {
    const e = n.getAttribute(t);
    e && s.push(`[${t}="${e}"]`);
  }
  return s.join("");
}
function ft() {
  try {
    return ct.document.location.href;
  } catch {
    return "";
  }
}
/**
 * Given a DOM element, traverses up the tree until it finds the first ancestor node
 * that has the `data-sentry-component` or `data-sentry-element` attribute with `data-sentry-component` taking
 * precedence. This attribute is added at build-time by projects that have the component name annotation plugin installed.
 *
 * @returns a string representation of the component for the provided DOM element, or `null` if not found
 */ function dt(t) {
  if (!ct.HTMLElement) return null;
  let e = t;
  const n = 5;
  for (let t = 0; t < n; t++) {
    if (!e) return null;
    if (e instanceof HTMLElement) {
      if (e.dataset.sentryComponent) return e.dataset.sentryComponent;
      if (e.dataset.sentryElement) return e.dataset.sentryElement;
    }
    e = e.parentNode;
  }
  return null;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Replace a method in an object with a wrapped version of itself.
 *
 * If the method on the passed object is not a function, the wrapper will not be applied.
 *
 * @param source An object that contains a method to be wrapped.
 * @param name The name of the method to be wrapped.
 * @param replacementFactory A higher-order function that takes the original version of the given method and returns a
 * wrapped version. Note: The function returned by `replacementFactory` needs to be a non-arrow function, in order to
 * preserve the correct value of `this`, and the original method must be called using `origMethod.call(this, <other
 * args>)` or `origMethod.apply(this, [<other args>])` (rather than being called directly), again to preserve `this`.
 * @returns void
 */ function mt(e, n, s) {
  if (!(n in e)) return;
  const o = e[n];
  if (typeof o !== "function") return;
  const r = s(o);
  typeof r === "function" && ht(r, o);
  try {
    e[n] = r;
  } catch {
    t && y.log(`Failed to replace method "${n}" in object`, e);
  }
}
/**
 * Defines a non-enumerable property on the given object.
 *
 * @param obj The object on which to set the property
 * @param name The name of the property to be set
 * @param value The value to which to set the property
 */ function gt(e, n, s) {
  try {
    Object.defineProperty(e, n, {
      value: s,
      writable: true,
      configurable: true,
    });
  } catch {
    t && y.log(`Failed to add non-enumerable property "${n}" to object`, e);
  }
}
/**
 * Remembers the original function on the wrapped function and
 * patches up the prototype.
 *
 * @param wrapped the wrapper function
 * @param original the original function that gets wrapped
 */ function ht(t, e) {
  try {
    const n = e.prototype || {};
    t.prototype = e.prototype = n;
    gt(t, "__sentry_original__", e);
  } catch {}
}
/**
 * This extracts the original function if available.  See
 * `markFunctionWrapped` for more information.
 *
 * @param func the function to unwrap
 * @returns the unwrapped version of the function if available.
 */ function _t(t) {
  return t.__sentry_original__;
}
/**
 * Transforms any `Error` or `Event` into a plain object with all of their enumerable properties, and some of their
 * non-enumerable properties attached.
 *
 * @param value Initial source that we have to transform in order for it to be usable by the serializer
 * @returns An Event or Error turned into an object - or the value argument itself, when value is neither an Event nor
 *  an Error.
 */ function yt(t) {
  if (W(t))
    return { message: t.message, name: t.name, stack: t.stack, ...vt(t) };
  if (tt(t)) {
    const e = {
      type: t.type,
      target: bt(t.target),
      currentTarget: bt(t.currentTarget),
      ...vt(t),
    };
    typeof CustomEvent !== "undefined" &&
      rt(t, CustomEvent) &&
      (e.detail = t.detail);
    return e;
  }
  return t;
}
function bt(t) {
  try {
    return et(t) ? lt(t) : Object.prototype.toString.call(t);
  } catch {
    return "<unknown>";
  }
}
function vt(t) {
  if (typeof t === "object" && t !== null) {
    const e = {};
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
    return e;
  }
  return {};
}
function St(t) {
  const e = Object.keys(yt(t));
  e.sort();
  return e[0] ? e.join(", ") : "[object has no keys]";
}
/**
 * Given any object, return a new object having removed all fields whose value was `undefined`.
 * Works recursively on objects and arrays.
 *
 * Attention: This function keeps circular references in the returned object.
 *
 * @deprecated This function is no longer used by the SDK and will be removed in a future major version.
 */ function kt(t) {
  const e = new Map();
  return wt(t, e);
}
function wt(t, e) {
  if (t === null || typeof t !== "object") return t;
  const n = e.get(t);
  if (n !== void 0) return n;
  if (Array.isArray(t)) {
    const n = [];
    e.set(t, n);
    t.forEach((t) => {
      n.push(wt(t, e));
    });
    return n;
  }
  if (xt(t)) {
    const n = {};
    e.set(t, n);
    const s = Object.keys(t);
    s.forEach((s) => {
      const o = t[s];
      o !== void 0 && (n[s] = wt(o, e));
    });
    return n;
  }
  return t;
}
function xt(t) {
  const e = t.constructor;
  return e === Object || e === void 0;
}
/**
 * Ensure that something is an object.
 *
 * Turns `undefined` and `null` into `String`s and all other primitives into instances of their respective wrapper
 * classes (String, Boolean, Number, etc.). Acts as the identity function on non-primitives.
 *
 * @param wat The subject of the objectification
 * @returns A version of `wat` which can safely be used with `Object` class methods
 */ function At(t) {
  let e;
  switch (true) {
    case t == void 0:
      e = new String(t);
      break;
    case typeof t === "symbol" || typeof t === "bigint":
      e = Object(t);
      break;
    case X(t):
      e = new t.constructor(t);
      break;
    default:
      e = t;
      break;
  }
  return e;
}
let Et;
function Tt(t) {
  if (Et !== void 0) return Et ? Et(t) : t();
  const n = Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__");
  const s = e;
  if (n in s && typeof s[n] === "function") {
    Et = s[n];
    return Et(t);
  }
  Et = null;
  return t();
}
function It() {
  return Tt(() => Math.random());
}
function $t() {
  return Tt(() => Date.now());
}
/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string (0 = unlimited)
 * @returns string Encoded
 */ function Ot(t, e = 0) {
  return typeof t !== "string" || e === 0 || t.length <= e
    ? t
    : `${t.slice(0, e)}...`;
}
/**
 * This is basically just `trim_line` from
 * https://github.com/getsentry/sentry/blob/master/src/sentry/lang/javascript/processor.py#L67
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */ function Ct(t, e) {
  let n = t;
  const s = n.length;
  if (s <= 150) return n;
  e > s && (e = s);
  let o = Math.max(e - 60, 0);
  o < 5 && (o = 0);
  let r = Math.min(o + 140, s);
  r > s - 5 && (r = s);
  r === s && (o = Math.max(r - 140, 0));
  n = n.slice(o, r);
  o > 0 && (n = `'{snip} ${n}`);
  r < s && (n += " {snip}");
  return n;
}
/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */ function Nt(t, e) {
  if (!Array.isArray(t)) return "";
  const n = [];
  for (let e = 0; e < t.length; e++) {
    const s = t[e];
    try {
      it(s) ? n.push(O(s)) : n.push(String(s));
    } catch {
      n.push("[value cannot be serialized]");
    }
  }
  return n.join(e);
}
/**
 * Checks if the given value matches a regex or string
 *
 * @param value The string to test
 * @param pattern Either a regex or a string against which `value` will be matched
 * @param requireExactStringMatch If true, `value` must match `pattern` exactly. If false, `value` will match
 * `pattern` if it contains `pattern`. Only applies to string-type patterns.
 */ function jt(t, e, n = false) {
  return (
    !!Z(t) && (nt(e) ? e.test(t) : !!Z(e) && (n ? t === e : t.includes(e)))
  );
}
/**
 * Test the given string against an array of strings and regexes. By default, string matching is done on a
 * substring-inclusion basis rather than a strict equality basis
 *
 * @param testString The string to test
 * @param patterns The patterns against which to test the string
 * @param requireExactStringMatch If true, `testString` must match one of the given string patterns exactly in order to
 * count. If false, `testString` will match a string pattern if it contains that pattern.
 * @returns
 */ function Rt(t, e = [], n = false) {
  return e.some((e) => jt(t, e, n));
}
function Mt() {
  const t = e;
  return t.crypto || t.msCrypto;
}
let Pt;
function Dt() {
  return It() * 16;
}
/**
 * UUID4 generator
 * @param crypto Object that provides the crypto API.
 * @returns string Generated UUID4.
 */ function Ft(t = Mt()) {
  try {
    if (t?.randomUUID) return Tt(() => t.randomUUID()).replace(/-/g, "");
  } catch {}
  Pt || (Pt = [1e7] + 1e3 + 4e3 + 8e3 + 1e11);
  return Pt.replace(/[018]/g, (t) =>
    (t ^ ((Dt() & 15) >> (t / 4))).toString(16),
  );
}
function Lt(t) {
  return t.exception?.values?.[0];
}
/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */ function qt(t) {
  const { message: e, event_id: n } = t;
  if (e) return e;
  const s = Lt(t);
  return s
    ? s.type && s.value
      ? `${s.type}: ${s.value}`
      : s.type || s.value || n || "<unknown>"
    : n || "<unknown>";
}
/**
 * Adds exception values, type and value to an synthetic Exception.
 * @param event The event to modify.
 * @param value Value of the exception.
 * @param type Type of the exception.
 * @hidden
 */ function Ut(t, e, n) {
  const s = (t.exception = t.exception || {});
  const o = (s.values = s.values || []);
  const r = (o[0] = o[0] || {});
  r.value || (r.value = e || "");
  r.type || (r.type = n || "Error");
}
/**
 * Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
 *
 * @param event The event to modify.
 * @param newMechanism Mechanism data to add to the event.
 * @hidden
 */ function Jt(t, e) {
  const n = Lt(t);
  if (!n) return;
  const s = { type: "generic", handled: true };
  const o = n.mechanism;
  n.mechanism = { ...s, ...o, ...e };
  if (e && "data" in e) {
    const t = { ...o?.data, ...e.data };
    n.mechanism.data = t;
  }
}
const zt =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
function Bt(t) {
  return parseInt(t || "", 10);
}
/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */ function Wt(t) {
  const e = t.match(zt) || [];
  const n = Bt(e[1]);
  const s = Bt(e[2]);
  const o = Bt(e[3]);
  return {
    buildmetadata: e[5],
    major: isNaN(n) ? void 0 : n,
    minor: isNaN(s) ? void 0 : s,
    patch: isNaN(o) ? void 0 : o,
    prerelease: e[4],
  };
}
/**
 * This function adds context (pre/post/line) lines to the provided frame
 *
 * @param lines string[] containing all lines
 * @param frame StackFrame that will be mutated
 * @param linesOfContext number of context lines we want to add pre/post
 */ function Vt(t, e, n = 5) {
  if (e.lineno === void 0) return;
  const s = t.length;
  const o = Math.max(Math.min(s - 1, e.lineno - 1), 0);
  e.pre_context = t.slice(Math.max(0, o - n), o).map((t) => Ct(t, 0));
  const r = Math.min(s - 1, o);
  e.context_line = Ct(t[r], e.colno || 0);
  e.post_context = t.slice(Math.min(o + 1, s), o + 1 + n).map((t) => Ct(t, 0));
}
/**
 * Checks whether or not we've already captured the given exception (note: not an identical exception - the very object
 * in question), and marks it captured if not.
 *
 * This is useful because it's possible for an error to get captured by more than one mechanism. After we intercept and
 * record an error, we rethrow it (assuming we've intercepted it before it's reached the top-level global handlers), so
 * that we don't interfere with whatever effects the error might have had were the SDK not there. At that point, because
 * the error has been rethrown, it's possible for it to bubble up to some other code we've instrumented. If it's not
 * caught after that, it will bubble all the way up to the global handlers (which of course we also instrument). This
 * function helps us ensure that even if we encounter the same error more than once, we only record it the first time we
 * see it.
 *
 * Note: It will ignore primitives (always return `false` and not mark them as seen), as properties can't be set on
 * them. {@link: Object.objectify} can be used on exceptions to convert any that are primitives into their equivalent
 * object wrapper forms so that this check will always work. However, because we need to flag the exact object which
 * will get rethrown, and because that rethrowing happens outside of the event processing pipeline, the objectification
 * must be done before the exception captured.
 *
 * @param A thrown exception to check or flag as having been seen
 * @returns `true` if the exception has already been captured, `false` if not (with the side effect of marking it seen)
 */ function Gt(t) {
  if (Kt(t)) return true;
  try {
    gt(t, "__sentry_captured__", true);
  } catch {}
  return false;
}
function Kt(t) {
  try {
    return t.__sentry_captured__;
  } catch {}
}
const Ht = 1e3;
function Zt() {
  return $t() / Ht;
}
function Yt() {
  const { performance: t } = e;
  if (!t?.now || !t.timeOrigin) return Zt;
  const n = t.timeOrigin;
  return () => (n + Tt(() => t.now())) / Ht;
}
let Xt;
function Qt() {
  const t = Xt ?? (Xt = Yt());
  return t();
}
let te = null;
function ee() {
  const { performance: t } = e;
  if (!t?.now) return;
  const n = 3e5;
  const s = Tt(() => t.now());
  const o = $t();
  const r = t.timeOrigin;
  if (typeof r === "number") {
    const t = Math.abs(r + s - o);
    if (t < n) return r;
  }
  const i = t.timing?.navigationStart;
  if (typeof i === "number") {
    const t = Math.abs(i + s - o);
    if (t < n) return i;
  }
  return o - s;
}
function ne() {
  te === null && (te = ee());
  return te;
}
/**
 * Creates a new `Session` object by setting certain default parameters. If optional @param context
 * is passed, the passed properties are applied to the session object.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns a new `Session` object
 */ function se(t) {
  const e = Qt();
  const n = {
    sid: Ft(),
    init: true,
    timestamp: e,
    started: e,
    duration: 0,
    status: "ok",
    errors: 0,
    ignoreDuration: false,
    toJSON: () => ie(n),
  };
  t && oe(n, t);
  return n;
}
/**
 * Updates a session object with the properties passed in the context.
 *
 * Note that this function mutates the passed object and returns void.
 * (Had to do this instead of returning a new and updated session because closing and sending a session
 * makes an update to the session after it was passed to the sending logic.
 * @see Client.captureSession )
 *
 * @param session the `Session` to update
 * @param context the `SessionContext` holding the properties that should be updated in @param session
 */ function oe(t, e = {}) {
  if (e.user) {
    !t.ipAddress && e.user.ip_address && (t.ipAddress = e.user.ip_address);
    t.did || e.did || (t.did = e.user.id || e.user.email || e.user.username);
  }
  t.timestamp = e.timestamp || Qt();
  e.abnormal_mechanism && (t.abnormal_mechanism = e.abnormal_mechanism);
  e.ignoreDuration && (t.ignoreDuration = e.ignoreDuration);
  e.sid && (t.sid = e.sid.length === 32 ? e.sid : Ft());
  e.init !== void 0 && (t.init = e.init);
  !t.did && e.did && (t.did = `${e.did}`);
  typeof e.started === "number" && (t.started = e.started);
  if (t.ignoreDuration) t.duration = void 0;
  else if (typeof e.duration === "number") t.duration = e.duration;
  else {
    const e = t.timestamp - t.started;
    t.duration = e >= 0 ? e : 0;
  }
  e.release && (t.release = e.release);
  e.environment && (t.environment = e.environment);
  !t.ipAddress && e.ipAddress && (t.ipAddress = e.ipAddress);
  !t.userAgent && e.userAgent && (t.userAgent = e.userAgent);
  typeof e.errors === "number" && (t.errors = e.errors);
  e.status && (t.status = e.status);
}
/**
 * Closes a session by setting its status and updating the session object with it.
 * Internally calls `updateSession` to update the passed session object.
 *
 * Note that this function mutates the passed session (@see updateSession for explanation).
 *
 * @param session the `Session` object to be closed
 * @param status the `SessionStatus` with which the session was closed. If you don't pass a status,
 *               this function will keep the previously set status, unless it was `'ok'` in which case
 *               it is changed to `'exited'`.
 */ function re(t, e) {
  let n = {};
  e ? (n = { status: e }) : t.status === "ok" && (n = { status: "exited" });
  oe(t, n);
}
/**
 * Serializes a passed session object to a JSON object with a slightly different structure.
 * This is necessary because the Sentry backend requires a slightly different schema of a session
 * than the one the JS SDKs use internally.
 *
 * @param session the session to be converted
 *
 * @returns a JSON object of the passed session
 */ function ie(t) {
  return {
    sid: `${t.sid}`,
    init: t.init,
    started: new Date(t.started * 1e3).toISOString(),
    timestamp: new Date(t.timestamp * 1e3).toISOString(),
    status: t.status,
    errors: t.errors,
    did:
      typeof t.did === "number" || typeof t.did === "string"
        ? `${t.did}`
        : void 0,
    duration: t.duration,
    abnormal_mechanism: t.abnormal_mechanism,
    attrs: {
      release: t.release,
      environment: t.environment,
      ip_address: t.ipAddress,
      user_agent: t.userAgent,
    },
  };
}
function ae(t, e, n = 2) {
  if (!e || typeof e !== "object" || n <= 0) return e;
  if (t && Object.keys(e).length === 0) return t;
  const s = { ...t };
  for (const t in e)
    Object.prototype.hasOwnProperty.call(e, t) &&
      (s[t] = ae(s[t], e[t], n - 1));
  return s;
}
function ce() {
  return Ft();
}
function ue() {
  return Ft().substring(16);
}
const le = "_sentrySpan";
function pe(t, e) {
  e ? gt(t, le, e) : delete t[le];
}
function fe(t) {
  return t[le];
}
const de = 100;
class Scope {
  constructor() {
    this._notifyingListeners = false;
    this._scopeListeners = [];
    this._eventProcessors = [];
    this._breadcrumbs = [];
    this._attachments = [];
    this._user = {};
    this._tags = {};
    this._attributes = {};
    this._extra = {};
    this._contexts = {};
    this._sdkProcessingMetadata = {};
    this._propagationContext = { traceId: ce(), sampleRand: It() };
  }
  clone() {
    const t = new Scope();
    t._breadcrumbs = [...this._breadcrumbs];
    t._tags = { ...this._tags };
    t._attributes = { ...this._attributes };
    t._extra = { ...this._extra };
    t._contexts = { ...this._contexts };
    this._contexts.flags &&
      (t._contexts.flags = { values: [...this._contexts.flags.values] });
    t._user = this._user;
    t._level = this._level;
    t._session = this._session;
    t._transactionName = this._transactionName;
    t._fingerprint = this._fingerprint;
    t._eventProcessors = [...this._eventProcessors];
    t._attachments = [...this._attachments];
    t._sdkProcessingMetadata = { ...this._sdkProcessingMetadata };
    t._propagationContext = { ...this._propagationContext };
    t._client = this._client;
    t._lastEventId = this._lastEventId;
    t._conversationId = this._conversationId;
    pe(t, fe(this));
    return t;
  }
  setClient(t) {
    this._client = t;
  }
  setLastEventId(t) {
    this._lastEventId = t;
  }
  getClient() {
    return this._client;
  }
  lastEventId() {
    return this._lastEventId;
  }
  addScopeListener(t) {
    this._scopeListeners.push(t);
  }
  addEventProcessor(t) {
    this._eventProcessors.push(t);
    return this;
  }
  setUser(t) {
    this._user = t || {
      email: void 0,
      id: void 0,
      ip_address: void 0,
      username: void 0,
    };
    this._session && oe(this._session, { user: t });
    this._notifyScopeListeners();
    return this;
  }
  getUser() {
    return this._user;
  }
  setConversationId(t) {
    this._conversationId = t || void 0;
    this._notifyScopeListeners();
    return this;
  }
  setTags(t) {
    this._tags = { ...this._tags, ...t };
    this._notifyScopeListeners();
    return this;
  }
  setTag(t, e) {
    return this.setTags({ [t]: e });
  }
  /**
   * Sets attributes onto the scope.
   *
   * These attributes are currently applied to logs and metrics.
   * In the future, they will also be applied to spans.
   *
   * Important: For now, only strings, numbers and boolean attributes are supported, despite types allowing for
   * more complex attribute types. We'll add this support in the future but already specify the wider type to
   * avoid a breaking change in the future.
   *
   * @param newAttributes - The attributes to set on the scope. You can either pass in key-value pairs, or
   * an object with a `value` and an optional `unit` (if applicable to your attribute).
   *
   * @example
   * ```typescript
   * scope.setAttributes({
   *   is_admin: true,
   *   payment_selection: 'credit_card',
   *   render_duration: { value: 'render_duration', unit: 'ms' },
   * });
   * ```
   */ setAttributes(t) {
    this._attributes = { ...this._attributes, ...t };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * Sets an attribute onto the scope.
   *
   * These attributes are currently applied to logs and metrics.
   * In the future, they will also be applied to spans.
   *
   * Important: For now, only strings, numbers and boolean attributes are supported, despite types allowing for
   * more complex attribute types. We'll add this support in the future but already specify the wider type to
   * avoid a breaking change in the future.
   *
   * @param key - The attribute key.
   * @param value - the attribute value. You can either pass in a raw value, or an attribute
   * object with a `value` and an optional `unit` (if applicable to your attribute).
   *
   * @example
   * ```typescript
   * scope.setAttribute('is_admin', true);
   * scope.setAttribute('render_duration', { value: 'render_duration', unit: 'ms' });
   * ```
   */
  setAttribute(t, e) {
    return this.setAttributes({ [t]: e });
  }
  /**
   * Removes the attribute with the given key from the scope.
   *
   * @param key - The attribute key.
   *
   * @example
   * ```typescript
   * scope.removeAttribute('is_admin');
   * ```
   */ removeAttribute(t) {
    if (t in this._attributes) {
      delete this._attributes[t];
      this._notifyScopeListeners();
    }
    return this;
  }
  setExtras(t) {
    this._extra = { ...this._extra, ...t };
    this._notifyScopeListeners();
    return this;
  }
  setExtra(t, e) {
    this._extra = { ...this._extra, [t]: e };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * Sets the fingerprint on the scope to send with the events.
   * @param {string[]} fingerprint Fingerprint to group events in Sentry.
   */ setFingerprint(t) {
    this._fingerprint = t;
    this._notifyScopeListeners();
    return this;
  }
  setLevel(t) {
    this._level = t;
    this._notifyScopeListeners();
    return this;
  }
  setTransactionName(t) {
    this._transactionName = t;
    this._notifyScopeListeners();
    return this;
  }
  setContext(t, e) {
    e === null ? delete this._contexts[t] : (this._contexts[t] = e);
    this._notifyScopeListeners();
    return this;
  }
  setSession(t) {
    t ? (this._session = t) : delete this._session;
    this._notifyScopeListeners();
    return this;
  }
  getSession() {
    return this._session;
  }
  update(t) {
    if (!t) return this;
    const e = typeof t === "function" ? t(this) : t;
    const n = e instanceof Scope ? e.getScopeData() : Q(e) ? t : void 0;
    const {
      tags: s,
      attributes: o,
      extra: r,
      user: i,
      contexts: a,
      level: c,
      fingerprint: u = [],
      propagationContext: l,
      conversationId: p,
    } = n || {};
    this._tags = { ...this._tags, ...s };
    this._attributes = { ...this._attributes, ...o };
    this._extra = { ...this._extra, ...r };
    this._contexts = { ...this._contexts, ...a };
    i && Object.keys(i).length && (this._user = i);
    c && (this._level = c);
    u.length && (this._fingerprint = u);
    l && (this._propagationContext = l);
    p && (this._conversationId = p);
    return this;
  }
  clear() {
    this._breadcrumbs = [];
    this._tags = {};
    this._attributes = {};
    this._extra = {};
    this._user = {};
    this._contexts = {};
    this._level = void 0;
    this._transactionName = void 0;
    this._fingerprint = void 0;
    this._session = void 0;
    this._conversationId = void 0;
    pe(this, void 0);
    this._attachments = [];
    this.setPropagationContext({ traceId: ce(), sampleRand: It() });
    this._notifyScopeListeners();
    return this;
  }
  addBreadcrumb(t, e) {
    const n = typeof e === "number" ? e : de;
    if (n <= 0) return this;
    const s = {
      timestamp: Zt(),
      ...t,
      message: t.message ? Ot(t.message, 2048) : t.message,
    };
    this._breadcrumbs.push(s);
    if (this._breadcrumbs.length > n) {
      this._breadcrumbs = this._breadcrumbs.slice(-n);
      this._client?.recordDroppedEvent("buffer_overflow", "log_item");
    }
    this._notifyScopeListeners();
    return this;
  }
  getLastBreadcrumb() {
    return this._breadcrumbs[this._breadcrumbs.length - 1];
  }
  clearBreadcrumbs() {
    this._breadcrumbs = [];
    this._notifyScopeListeners();
    return this;
  }
  addAttachment(t) {
    this._attachments.push(t);
    return this;
  }
  clearAttachments() {
    this._attachments = [];
    return this;
  }
  getScopeData() {
    return {
      breadcrumbs: this._breadcrumbs,
      attachments: this._attachments,
      contexts: this._contexts,
      tags: this._tags,
      attributes: this._attributes,
      extra: this._extra,
      user: this._user,
      level: this._level,
      fingerprint: this._fingerprint || [],
      eventProcessors: this._eventProcessors,
      propagationContext: this._propagationContext,
      sdkProcessingMetadata: this._sdkProcessingMetadata,
      transactionName: this._transactionName,
      span: fe(this),
      conversationId: this._conversationId,
    };
  }
  setSDKProcessingMetadata(t) {
    this._sdkProcessingMetadata = ae(this._sdkProcessingMetadata, t, 2);
    return this;
  }
  setPropagationContext(t) {
    this._propagationContext = t;
    return this;
  }
  getPropagationContext() {
    return this._propagationContext;
  }
  /**
   * Capture an exception for this scope.
   *
   * @returns {string} The id of the captured Sentry event.
   */ captureException(e, n) {
    const s = n?.event_id || Ft();
    if (!this._client) {
      t &&
        y.warn("No client configured on scope - will not capture exception!");
      return s;
    }
    const o = new Error("Sentry syntheticException");
    this._client.captureException(
      e,
      { originalException: e, syntheticException: o, ...n, event_id: s },
      this,
    );
    return s;
  }
  /**
   * Capture a message for this scope.
   *
   * @returns {string} The id of the captured message.
   */ captureMessage(e, n, s) {
    const o = s?.event_id || Ft();
    if (!this._client) {
      t && y.warn("No client configured on scope - will not capture message!");
      return o;
    }
    const r = s?.syntheticException ?? new Error(e);
    this._client.captureMessage(
      e,
      n,
      { originalException: e, syntheticException: r, ...s, event_id: o },
      this,
    );
    return o;
  }
  /**
   * Capture a Sentry event for this scope.
   *
   * @returns {string} The id of the captured event.
   */ captureEvent(e, n) {
    const s = e.event_id || n?.event_id || Ft();
    if (!this._client) {
      t && y.warn("No client configured on scope - will not capture event!");
      return s;
    }
    this._client.captureEvent(e, { ...n, event_id: s }, this);
    return s;
  }
  _notifyScopeListeners() {
    if (!this._notifyingListeners) {
      this._notifyingListeners = true;
      this._scopeListeners.forEach((t) => {
        t(this);
      });
      this._notifyingListeners = false;
    }
  }
}
function me() {
  return r("defaultCurrentScope", () => new Scope());
}
function ge() {
  return r("defaultIsolationScope", () => new Scope());
}
class AsyncContextStack {
  constructor(t, e) {
    let n;
    n = t || new Scope();
    let s;
    s = e || new Scope();
    this._stack = [{ scope: n }];
    this._isolationScope = s;
  }
  withScope(t) {
    const e = this._pushScope();
    let n;
    try {
      n = t(e);
    } catch (t) {
      this._popScope();
      throw t;
    }
    if (st(n))
      return n.then(
        (t) => {
          this._popScope();
          return t;
        },
        (t) => {
          this._popScope();
          throw t;
        },
      );
    this._popScope();
    return n;
  }
  getClient() {
    return this.getStackTop().client;
  }
  getScope() {
    return this.getStackTop().scope;
  }
  getIsolationScope() {
    return this._isolationScope;
  }
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  _pushScope() {
    const t = this.getScope().clone();
    this._stack.push({ client: this.getClient(), scope: t });
    return t;
  }
  _popScope() {
    return !(this._stack.length <= 1) && !!this._stack.pop();
  }
}
function he() {
  const t = s();
  const e = o(t);
  return (e.stack = e.stack || new AsyncContextStack(me(), ge()));
}
function _e(t) {
  return he().withScope(t);
}
function ye(t, e) {
  const n = he();
  return n.withScope(() => {
    n.getStackTop().scope = t;
    return e(t);
  });
}
function be(t) {
  return he().withScope(() => t(he().getIsolationScope()));
}
function ve() {
  return {
    withIsolationScope: be,
    withScope: _e,
    withSetScope: ye,
    withSetIsolationScope: (t, e) => be(e),
    getCurrentScope: () => he().getScope(),
    getIsolationScope: () => he().getIsolationScope(),
  };
}
function Se(t) {
  const e = s();
  const n = o(e);
  n.acs = t;
}
function ke(t) {
  const e = o(t);
  return e.acs ? e.acs : ve();
}
function we() {
  const t = s();
  const e = ke(t);
  return e.getCurrentScope();
}
function xe() {
  const t = s();
  const e = ke(t);
  return e.getIsolationScope();
}
function Ae() {
  return r("globalScope", () => new Scope());
}
function Ee(...t) {
  const e = s();
  const n = ke(e);
  if (t.length === 2) {
    const [e, s] = t;
    return e ? n.withSetScope(e, s) : n.withScope(s);
  }
  return n.withScope(t[0]);
}
function Te(...t) {
  const e = s();
  const n = ke(e);
  if (t.length === 2) {
    const [e, s] = t;
    return e ? n.withSetIsolationScope(e, s) : n.withIsolationScope(s);
  }
  return n.withIsolationScope(t[0]);
}
function Ie() {
  return we().getClient();
}
function $e(t) {
  const e = t.getPropagationContext();
  const { traceId: n, parentSpanId: s, propagationSpanId: o } = e;
  const r = { trace_id: n, span_id: o || ue() };
  s && (r.parent_span_id = s);
  return r;
}
const Oe = "sentry.source";
const Ce = "sentry.sample_rate";
const Ne = "sentry.previous_trace_sample_rate";
const je = "sentry.op";
const Re = "sentry.origin";
const Me = "sentry.idle_span_finish_reason";
const Pe = "sentry.measurement_unit";
const De = "sentry.measurement_value";
const Fe = "sentry.custom_span_name";
const Le = "sentry.profile_id";
const qe = "sentry.exclusive_time";
const Ue = "cache.hit";
const Je = "cache.key";
const ze = "cache.item_size";
const Be = "http.request.method";
const We = "url.full";
const Ve = "sentry.link.type";
const Ge = "gen_ai.conversation.id";
const Ke = 0;
const He = 1;
const Ze = 2;
/**
 * Converts a HTTP status code into a sentry status with a message.
 *
 * @param httpStatus The HTTP response status code.
 * @returns The span status or internal_error.
 */ function Ye(t) {
  if (t < 400 && t >= 100) return { code: He };
  if (t >= 400 && t < 500)
    switch (t) {
      case 401:
        return { code: Ze, message: "unauthenticated" };
      case 403:
        return { code: Ze, message: "permission_denied" };
      case 404:
        return { code: Ze, message: "not_found" };
      case 409:
        return { code: Ze, message: "already_exists" };
      case 413:
        return { code: Ze, message: "failed_precondition" };
      case 429:
        return { code: Ze, message: "resource_exhausted" };
      case 499:
        return { code: Ze, message: "cancelled" };
      default:
        return { code: Ze, message: "invalid_argument" };
    }
  if (t >= 500 && t < 600)
    switch (t) {
      case 501:
        return { code: Ze, message: "unimplemented" };
      case 503:
        return { code: Ze, message: "unavailable" };
      case 504:
        return { code: Ze, message: "deadline_exceeded" };
      default:
        return { code: Ze, message: "internal_error" };
    }
  return { code: Ze, message: "internal_error" };
}
function Xe(t, e) {
  t.setAttribute("http.response.status_code", e);
  const n = Ye(e);
  n.message !== "unknown_error" && t.setStatus(n);
}
const Qe = "_sentryScope";
const tn = "_sentryIsolationScope";
function en(t) {
  try {
    const n = e.WeakRef;
    if (typeof n === "function") return new n(t);
  } catch {}
  return t;
}
function nn(t) {
  if (t) {
    if (typeof t === "object" && "deref" in t && typeof t.deref === "function")
      try {
        return t.deref();
      } catch {
        return;
      }
    return t;
  }
}
function sn(t, e, n) {
  if (t) {
    gt(t, tn, en(n));
    gt(t, Qe, e);
  }
}
function on(t) {
  const e = t;
  return { scope: e[Qe], isolationScope: nn(e[tn]) };
}
const rn = "sentry-";
const an = /^sentry-/;
const cn = 8192;
/**
 * Takes a baggage header and turns it into Dynamic Sampling Context, by extracting all the "sentry-" prefixed values
 * from it.
 *
 * @param baggageHeader A very bread definition of a baggage header as it might appear in various frameworks.
 * @returns The Dynamic Sampling Context that was found on `baggageHeader`, if there was any, `undefined` otherwise.
 */ function un(t) {
  const e = pn(t);
  if (!e) return;
  const n = Object.entries(e).reduce((t, [e, n]) => {
    if (e.match(an)) {
      const s = e.slice(rn.length);
      t[s] = n;
    }
    return t;
  }, {});
  return Object.keys(n).length > 0 ? n : void 0;
}
/**
 * Turns a Dynamic Sampling Object into a baggage header by prefixing all the keys on the object with "sentry-".
 *
 * @param dynamicSamplingContext The Dynamic Sampling Context to turn into a header. For convenience and compatibility
 * with the `getDynamicSamplingContext` method on the Transaction class ,this argument can also be `undefined`. If it is
 * `undefined` the function will return `undefined`.
 * @returns a baggage header, created from `dynamicSamplingContext`, or `undefined` either if `dynamicSamplingContext`
 * was `undefined`, or if `dynamicSamplingContext` didn't contain any values.
 */ function ln(t) {
  if (!t) return;
  const e = Object.entries(t).reduce((t, [e, n]) => {
    n && (t[`${rn}${e}`] = n);
    return t;
  }, {});
  return dn(e);
}
function pn(t) {
  if (t && (Z(t) || Array.isArray(t)))
    return Array.isArray(t)
      ? t.reduce((t, e) => {
          const n = fn(e);
          Object.entries(n).forEach(([e, n]) => {
            t[e] = n;
          });
          return t;
        }, {})
      : fn(t);
}
/**
 * Will parse a baggage header, which is a simple key-value map, into a flat object.
 *
 * @param baggageHeader The baggage header to parse.
 * @returns a flat object containing all the key-value pairs from `baggageHeader`.
 */ function fn(t) {
  return t
    .split(",")
    .map((t) => {
      const e = t.indexOf("=");
      if (e === -1) return [];
      const n = t.slice(0, e);
      const s = t.slice(e + 1);
      return [n, s].map((t) => {
        try {
          return decodeURIComponent(t.trim());
        } catch {
          return;
        }
      });
    })
    .reduce((t, [e, n]) => {
      e && n && (t[e] = n);
      return t;
    }, {});
}
/**
 * Turns a flat object (key-value pairs) into a baggage header, which is also just key-value pairs.
 *
 * @param object The object to turn into a baggage header.
 * @returns a baggage header string, or `undefined` if the object didn't have any values, since an empty baggage header
 * is not spec compliant.
 */ function dn(e) {
  if (Object.keys(e).length !== 0)
    return Object.entries(e).reduce((e, [n, s], o) => {
      const r = `${encodeURIComponent(n)}=${encodeURIComponent(s)}`;
      const i = o === 0 ? r : `${e},${r}`;
      if (i.length > cn) {
        t &&
          y.warn(
            `Not adding key: ${n} with val: ${s} to baggage header due to exceeding baggage size limits.`,
          );
        return e;
      }
      return i;
    }, "");
}
const mn = /^o(\d+)\./;
const gn =
  /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;
function hn(t) {
  return t === "http" || t === "https";
}
/**
 * Renders the string representation of this Dsn.
 *
 * By default, this will render the public representation without the password
 * component. To get the deprecated private representation, set `withPassword`
 * to true.
 *
 * @param withPassword When set to true, the password will be included.
 */ function _n(t, e = false) {
  const {
    host: n,
    path: s,
    pass: o,
    port: r,
    projectId: i,
    protocol: a,
    publicKey: c,
  } = t;
  return `${a}://${c}${e && o ? `:${o}` : ""}@${n}${r ? `:${r}` : ""}/${s ? `${s}/` : s}${i}`;
}
/**
 * Parses a Dsn from a given string.
 *
 * @param str A Dsn as string
 * @returns Dsn as DsnComponents or undefined if @param str is not a valid DSN string
 */ function yn(t) {
  const e = gn.exec(t);
  if (!e) {
    u(() => {
      console.error(`Invalid Sentry Dsn: ${t}`);
    });
    return;
  }
  const [n, s, o = "", r = "", i = "", a = ""] = e.slice(1);
  let c = "";
  let l = a;
  const p = l.split("/");
  if (p.length > 1) {
    c = p.slice(0, -1).join("/");
    l = p.pop();
  }
  if (l) {
    const t = l.match(/^\d+/);
    t && (l = t[0]);
  }
  return bn({
    host: r,
    pass: o,
    path: c,
    projectId: l,
    port: i,
    protocol: n,
    publicKey: s,
  });
}
function bn(t) {
  return {
    protocol: t.protocol,
    publicKey: t.publicKey || "",
    pass: t.pass || "",
    host: t.host,
    port: t.port || "",
    path: t.path || "",
    projectId: t.projectId,
  };
}
function vn(e) {
  if (!t) return true;
  const { port: n, projectId: s, protocol: o } = e;
  const r = ["protocol", "publicKey", "host", "projectId"];
  const i = r.find((t) => {
    if (!e[t]) {
      y.error(`Invalid Sentry Dsn: ${t} missing`);
      return true;
    }
    return false;
  });
  if (i) return false;
  if (!s.match(/^\d+$/)) {
    y.error(`Invalid Sentry Dsn: Invalid projectId ${s}`);
    return false;
  }
  if (!hn(o)) {
    y.error(`Invalid Sentry Dsn: Invalid protocol ${o}`);
    return false;
  }
  if (n && isNaN(parseInt(n, 10))) {
    y.error(`Invalid Sentry Dsn: Invalid port ${n}`);
    return false;
  }
  return true;
}
/**
 * Extract the org ID from a DSN host.
 *
 * @param host The host from a DSN
 * @returns The org ID if found, undefined otherwise
 */ function Sn(t) {
  const e = t.match(mn);
  return e?.[1];
}
function kn(t) {
  const e = t.getOptions();
  const { host: n } = t.getDsn() || {};
  let s;
  e.orgId ? (s = String(e.orgId)) : n && (s = Sn(n));
  return s;
}
/**
 * Creates a valid Sentry Dsn object, identifying a Sentry instance and project.
 * @returns a valid DsnComponents object or `undefined` if @param from is an invalid DSN source
 */ function wn(t) {
  const e = typeof t === "string" ? yn(t) : bn(t);
  if (e && vn(e)) return e;
}
function xn(t) {
  if (typeof t === "boolean") return Number(t);
  const e = typeof t === "string" ? parseFloat(t) : t;
  return typeof e !== "number" || isNaN(e) || e < 0 || e > 1 ? void 0 : e;
}
const An = new RegExp(
  "^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$",
);
/**
 * Extract transaction context data from a `sentry-trace` header.
 *
 * This is terrible naming but the function has nothing to do with the W3C traceparent header.
 * It can only parse the `sentry-trace` header and extract the "trace parent" data.
 *
 * @param traceparent Traceparent string
 *
 * @returns Object containing data from the header, or undefined if traceparent string is malformed
 */ function En(t) {
  if (!t) return;
  const e = t.match(An);
  if (!e) return;
  let n;
  e[3] === "1" ? (n = true) : e[3] === "0" && (n = false);
  return { traceId: e[1], parentSampled: n, parentSpanId: e[2] };
}
function Tn(t, e) {
  const n = En(t);
  const s = un(e);
  if (!n?.traceId) return { traceId: ce(), sampleRand: It() };
  const o = On(n, s);
  s && (s.sample_rand = o.toString());
  const { traceId: r, parentSpanId: i, parentSampled: a } = n;
  return {
    traceId: r,
    parentSpanId: i,
    sampled: a,
    dsc: s || {},
    sampleRand: o,
  };
}
function In(t = ce(), e = ue(), n) {
  let s = "";
  n !== void 0 && (s = n ? "-1" : "-0");
  return `${t}-${e}${s}`;
}
function $n(t = ce(), e = ue(), n) {
  return `00-${t}-${e}-${n ? "01" : "00"}`;
}
function On(t, e) {
  const n = xn(e?.sample_rand);
  if (n !== void 0) return n;
  const s = xn(e?.sample_rate);
  return s && t?.parentSampled !== void 0
    ? t.parentSampled
      ? It() * s
      : s + It() * (1 - s)
    : It();
}
function Cn(t, e) {
  const n = kn(t);
  if (e && n && e !== n) {
    y.log(
      `Won't continue trace because org IDs don't match (incoming baggage: ${e}, SDK options: ${n})`,
    );
    return false;
  }
  const s = t.getOptions().strictTraceContinuation || false;
  if (s && ((e && !n) || (!e && n))) {
    y.log(
      `Starting a new trace because strict trace continuation is enabled but one org ID is missing (incoming baggage: ${e}, Sentry client: ${n})`,
    );
    return false;
  }
  return true;
}
const Nn = 0;
const jn = 1;
let Rn = false;
function Mn(t) {
  const { spanId: e, traceId: n } = t.spanContext();
  const {
    data: s,
    op: o,
    parent_span_id: r,
    status: i,
    origin: a,
    links: c,
  } = Jn(t);
  return {
    parent_span_id: r,
    span_id: e,
    trace_id: n,
    data: s,
    op: o,
    status: i,
    origin: a,
    links: c,
  };
}
function Pn(t) {
  const { spanId: e, traceId: n, isRemote: s } = t.spanContext();
  const o = s ? e : Jn(t).parent_span_id;
  const r = on(t).scope;
  const i = s ? r?.getPropagationContext().propagationSpanId || ue() : e;
  return { parent_span_id: o, span_id: i, trace_id: n };
}
function Dn(t) {
  const { traceId: e, spanId: n } = t.spanContext();
  const s = Wn(t);
  return In(e, n, s);
}
function Fn(t) {
  const { traceId: e, spanId: n } = t.spanContext();
  const s = Wn(t);
  return $n(e, n, s);
}
function Ln(t) {
  return t && t.length > 0
    ? t.map(
        ({
          context: { spanId: t, traceId: e, traceFlags: n, ...s },
          attributes: o,
        }) => ({
          span_id: t,
          trace_id: e,
          sampled: n === jn,
          attributes: o,
          ...s,
        }),
      )
    : void 0;
}
function qn(t) {
  return typeof t === "number"
    ? Un(t)
    : Array.isArray(t)
      ? t[0] + t[1] / 1e9
      : t instanceof Date
        ? Un(t.getTime())
        : Qt();
}
function Un(t) {
  const e = t > 9999999999;
  return e ? t / 1e3 : t;
}
function Jn(t) {
  if (Bn(t)) return t.getSpanJSON();
  const { spanId: e, traceId: n } = t.spanContext();
  if (zn(t)) {
    const {
      attributes: s,
      startTime: o,
      name: r,
      endTime: i,
      status: a,
      links: c,
    } = t;
    const u =
      "parentSpanId" in t
        ? t.parentSpanId
        : "parentSpanContext" in t
          ? t.parentSpanContext?.spanId
          : void 0;
    return {
      span_id: e,
      trace_id: n,
      data: s,
      description: r,
      parent_span_id: u,
      start_timestamp: qn(o),
      timestamp: qn(i) || void 0,
      status: Vn(a),
      op: s[je],
      origin: s[Re],
      links: Ln(c),
    };
  }
  return { span_id: e, trace_id: n, start_timestamp: 0, data: {} };
}
function zn(t) {
  const e = t;
  return (
    !!e.attributes && !!e.startTime && !!e.name && !!e.endTime && !!e.status
  );
}
function Bn(t) {
  return typeof t.getSpanJSON === "function";
}
function Wn(t) {
  const { traceFlags: e } = t.spanContext();
  return e === jn;
}
function Vn(t) {
  if (t && t.code !== Ke)
    return t.code === He ? "ok" : t.message || "internal_error";
}
const Gn = "_sentryChildSpans";
const Kn = "_sentryRootSpan";
function Hn(t, e) {
  const n = t[Kn] || t;
  gt(e, Kn, n);
  t[Gn] ? t[Gn].add(e) : gt(t, Gn, new Set([e]));
}
function Zn(t, e) {
  t[Gn] && t[Gn].delete(e);
}
function Yn(t) {
  const e = new Set();
  function n(t) {
    if (!e.has(t) && Wn(t)) {
      e.add(t);
      const s = t[Gn] ? Array.from(t[Gn]) : [];
      for (const t of s) n(t);
    }
  }
  n(t);
  return Array.from(e);
}
function Xn(t) {
  return t[Kn] || t;
}
function Qn() {
  const t = s();
  const e = ke(t);
  return e.getActiveSpan ? e.getActiveSpan() : fe(we());
}
function ts() {
  if (!Rn) {
    u(() => {
      console.warn(
        "[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.",
      );
    });
    Rn = true;
  }
}
/**
 * Updates the name of the given span and ensures that the span name is not
 * overwritten by the Sentry SDK.
 *
 * Use this function instead of `span.updateName()` if you want to make sure that
 * your name is kept. For some spans, for example root `http.server` spans the
 * Sentry SDK would otherwise overwrite the span name with a high-quality name
 * it infers when the span ends.
 *
 * Use this function in server code or when your span is started on the server
 * and on the client (browser). If you only update a span name on the client,
 * you can also use `span.updateName()` the SDK does not overwrite the name.
 *
 * @param span - The span to update the name of.
 * @param name - The name to set on the span.
 */ function es(t, e) {
  t.updateName(e);
  t.setAttributes({ [Oe]: "custom", [Fe]: e });
}
let ns = false;
function ss() {
  if (!ns) {
    e.tag = "sentry_tracingErrorCallback";
    ns = true;
    L(e);
    J(e);
  }
  function e() {
    const e = Qn();
    const n = e && Xn(e);
    if (n) {
      const e = "internal_error";
      t && y.log(`[Tracing] Root span: ${e} -> Global error occurred`);
      n.setStatus({ code: Ze, message: e });
    }
  }
}
/**
 * Determines if span recording is currently enabled.
 *
 * Spans are recorded when at least one of `tracesSampleRate` and `tracesSampler`
 * is defined in the SDK config. This function does not make any assumption about
 * sampling decisions, it only checks if the SDK is configured to record spans.
 *
 * Important: This function only determines if span recording is enabled. Trace
 * continuation and propagation is separately controlled and not covered by this function.
 * If this function returns `false`, traces can still be propagated (which is what
 * we refer to by "Tracing without Performance")
 * @see https://develop.sentry.dev/sdk/telemetry/traces/tracing-without-performance/
 *
 * @param maybeOptions An SDK options object to be passed to this function.
 * If this option is not provided, the function will use the current client's options.
 */ function os(t) {
  if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__)
    return false;
  const e = t || Ie()?.getOptions();
  return !!e && (e.tracesSampleRate != null || !!e.tracesSampler);
}
function rs(t) {
  y.log(
    `Ignoring span ${t.op} - ${t.description} because it matches \`ignoreSpans\`.`,
  );
}
function is(e, n) {
  if (!n?.length || !e.description) return false;
  for (const s of n) {
    if (cs(s)) {
      if (jt(e.description, s)) {
        t && rs(e);
        return true;
      }
      continue;
    }
    if (!s.name && !s.op) continue;
    const n = !s.name || jt(e.description, s.name);
    const o = !s.op || (e.op && jt(e.op, s.op));
    if (n && o) {
      t && rs(e);
      return true;
    }
  }
  return false;
}
function as(t, e) {
  const n = e.parent_span_id;
  const s = e.span_id;
  if (n) for (const e of t) e.parent_span_id === s && (e.parent_span_id = n);
}
function cs(t) {
  return typeof t === "string" || t instanceof RegExp;
}
const us = "production";
const ls = "development";
const ps = "_frozenDsc";
function fs(t, e) {
  const n = t;
  gt(n, ps, e);
}
function ds(t, e) {
  const n = e.getOptions();
  const { publicKey: s } = e.getDsn() || {};
  const o = {
    environment: n.environment || us,
    release: n.release,
    public_key: s,
    trace_id: t,
    org_id: kn(e),
  };
  e.emit("createDsc", o);
  return o;
}
function ms(t, e) {
  const n = e.getPropagationContext();
  return n.dsc || ds(n.traceId, t);
}
/**
 * Creates a dynamic sampling context from a span (and client and scope)
 *
 * @param span the span from which a few values like the root span name and sample rate are extracted.
 *
 * @returns a dynamic sampling context
 */ function gs(t) {
  const e = Ie();
  if (!e) return {};
  const n = Xn(t);
  const s = Jn(n);
  const o = s.data;
  const r = n.spanContext().traceState;
  const i = r?.get("sentry.sample_rate") ?? o[Ce] ?? o[Ne];
  function a(t) {
    (typeof i !== "number" && typeof i !== "string") ||
      (t.sample_rate = `${i}`);
    return t;
  }
  const c = n[ps];
  if (c) return a(c);
  const u = r?.get("sentry.dsc");
  const l = u && un(u);
  if (l) return a(l);
  const p = ds(t.spanContext().traceId, e);
  const f = o[Oe];
  const d = s.description;
  f !== "url" && d && (p.transaction = d);
  if (os()) {
    p.sampled = String(Wn(n));
    p.sample_rand =
      r?.get("sentry.sample_rand") ??
      on(n).scope?.getPropagationContext().sampleRand.toString();
  }
  a(p);
  e.emit("createDsc", p, n);
  return p;
}
function hs(t) {
  const e = gs(t);
  return ln(e);
}
class SentryNonRecordingSpan {
  constructor(t = {}) {
    this._traceId = t.traceId || ce();
    this._spanId = t.spanId || ue();
  }
  spanContext() {
    return { spanId: this._spanId, traceId: this._traceId, traceFlags: Nn };
  }
  end(t) {}
  setAttribute(t, e) {
    return this;
  }
  setAttributes(t) {
    return this;
  }
  setStatus(t) {
    return this;
  }
  updateName(t) {
    return this;
  }
  isRecording() {
    return false;
  }
  addEvent(t, e, n) {
    return this;
  }
  addLink(t) {
    return this;
  }
  addLinks(t) {
    return this;
  }
  recordException(t, e) {}
}
/**
 * Recursively normalizes the given object.
 *
 * - Creates a copy to prevent original input mutation
 * - Skips non-enumerable properties
 * - When stringifying, calls `toJSON` if implemented
 * - Removes circular references
 * - Translates non-serializable values (`undefined`/`NaN`/functions) to serializable format
 * - Translates known global objects/classes to a string representations
 * - Takes care of `Error` object serialization
 * - Optionally limits depth of final output
 * - Optionally limits number of properties/elements included in any single object/array
 *
 * @param input The object to be normalized.
 * @param depth The max depth to which to normalize the object. (Anything deeper stringified whole.)
 * @param maxProperties The max number of elements or properties to be included in any single array or
 * object in the normalized output.
 * @returns A normalized version of the object, or `"**non-serializable**"` if any errors are thrown during normalization.
 */ function _s(t, e = 100, n = Infinity) {
  try {
    return bs("", t, e, n);
  } catch (t) {
    return { ERROR: `**non-serializable** (${t})` };
  }
}
function ys(t, e = 3, n = 102400) {
  const s = _s(t, e);
  return ws(s) > n ? ys(t, e - 1, n) : s;
}
/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */ function bs(t, e, n = Infinity, s = Infinity, o = As()) {
  const [r, i] = o;
  if (
    e == null ||
    ["boolean", "string"].includes(typeof e) ||
    (typeof e === "number" && Number.isFinite(e))
  )
    return e;
  const a = vs(t, e);
  if (!a.startsWith("[object ")) return a;
  if (e.__sentry_skip_normalization__) return e;
  const c =
    typeof e.__sentry_override_normalization_depth__ === "number"
      ? e.__sentry_override_normalization_depth__
      : n;
  if (c === 0) return a.replace("object ", "");
  if (r(e)) return "[Circular ~]";
  const u = e;
  if (u && typeof u.toJSON === "function")
    try {
      const t = u.toJSON();
      return bs("", t, c - 1, s, o);
    } catch {}
  const l = Array.isArray(e) ? [] : {};
  let p = 0;
  const f = yt(e);
  for (const t in f) {
    if (!Object.prototype.hasOwnProperty.call(f, t)) continue;
    if (p >= s) {
      l[t] = "[MaxProperties ~]";
      break;
    }
    const e = f[t];
    l[t] = bs(t, e, c - 1, s, o);
    p++;
  }
  i(e);
  return l;
}
/**
 * Stringify the given value. Handles various known special values and types.
 *
 * Not meant to be used on simple primitives which already have a string representation, as it will, for example, turn
 * the number 1231 into "[Object Number]", nor on `null`, as it will throw.
 *
 * @param value The value to stringify
 * @returns A stringified representation of the given value
 */ function vs(t, e) {
  try {
    if (t === "domain" && e && typeof e === "object" && e._events)
      return "[Domain]";
    if (t === "domainEmitter") return "[DomainEmitter]";
    if (typeof global !== "undefined" && e === global) return "[Global]";
    if (typeof window !== "undefined" && e === window) return "[Window]";
    if (typeof document !== "undefined" && e === document) return "[Document]";
    if (it(e)) return O(e);
    if (ot(e)) return "[SyntheticEvent]";
    if (typeof e === "number" && !Number.isFinite(e)) return `[${e}]`;
    if (typeof e === "function") return `[Function: ${I(e)}]`;
    if (typeof e === "symbol") return `[${String(e)}]`;
    if (typeof e === "bigint") return `[BigInt: ${String(e)}]`;
    const n = Ss(e);
    return /^HTML(\w*)Element$/.test(n)
      ? `[HTMLElement: ${n}]`
      : `[object ${n}]`;
  } catch (t) {
    return `**non-serializable** (${t})`;
  }
}
function Ss(t) {
  const e = Object.getPrototypeOf(t);
  return e?.constructor ? e.constructor.name : "null prototype";
}
function ks(t) {
  return ~-encodeURI(t).split(/%..|./).length;
}
function ws(t) {
  return ks(JSON.stringify(t));
}
/**
 * Normalizes URLs in exceptions and stacktraces to a base path so Sentry can fingerprint
 * across platforms and working directory.
 *
 * @param url The URL to be normalized.
 * @param basePath The application base path.
 * @returns The normalized URL.
 */ function xs(t, e) {
  const n = e.replace(/\\/g, "/").replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  let s = t;
  try {
    s = decodeURI(t);
  } catch {}
  return s
    .replace(/\\/g, "/")
    .replace(/webpack:\/?/g, "")
    .replace(new RegExp(`(file://)?/*${n}/*`, "ig"), "app:///");
}
function As() {
  const t = new WeakSet();
  function e(e) {
    if (t.has(e)) return true;
    t.add(e);
    return false;
  }
  function n(e) {
    t.delete(e);
  }
  return [e, n];
}
function Es(t, e = []) {
  return [t, e];
}
function Ts(t, e) {
  const [n, s] = t;
  return [n, [...s, e]];
}
function Is(t, e) {
  const n = t[1];
  for (const t of n) {
    const n = t[0].type;
    const s = e(t, n);
    if (s) return true;
  }
  return false;
}
function $s(t, e) {
  return Is(t, (t, n) => e.includes(n));
}
function Os(t) {
  const n = o(e);
  return n.encodePolyfill ? n.encodePolyfill(t) : new TextEncoder().encode(t);
}
function Cs(t) {
  const n = o(e);
  return n.decodePolyfill ? n.decodePolyfill(t) : new TextDecoder().decode(t);
}
function Ns(t) {
  const [e, n] = t;
  let s = JSON.stringify(e);
  function o(t) {
    typeof s === "string"
      ? (s = typeof t === "string" ? s + t : [Os(s), t])
      : s.push(typeof t === "string" ? Os(t) : t);
  }
  for (const t of n) {
    const [e, n] = t;
    o(`\n${JSON.stringify(e)}\n`);
    if (typeof n === "string" || n instanceof Uint8Array) o(n);
    else {
      let t;
      try {
        t = JSON.stringify(n);
      } catch {
        t = JSON.stringify(_s(n));
      }
      o(t);
    }
  }
  return typeof s === "string" ? s : js(s);
}
function js(t) {
  const e = t.reduce((t, e) => t + e.length, 0);
  const n = new Uint8Array(e);
  let s = 0;
  for (const e of t) {
    n.set(e, s);
    s += e.length;
  }
  return n;
}
function Rs(t) {
  let e = typeof t === "string" ? Os(t) : t;
  function n(t) {
    const n = e.subarray(0, t);
    e = e.subarray(t + 1);
    return n;
  }
  function s() {
    let t = e.indexOf(10);
    t < 0 && (t = e.length);
    return JSON.parse(Cs(n(t)));
  }
  const o = s();
  const r = [];
  while (e.length) {
    const t = s();
    const e = typeof t.length === "number" ? t.length : void 0;
    r.push([t, e ? n(e) : s()]);
  }
  return [o, r];
}
function Ms(t) {
  const e = { type: "span" };
  return [e, t];
}
function Ps(t) {
  const e = typeof t.data === "string" ? Os(t.data) : t.data;
  return [
    {
      type: "attachment",
      length: e.length,
      filename: t.filename,
      content_type: t.contentType,
      attachment_type: t.attachmentType,
    },
    e,
  ];
}
const Ds = {
  session: "session",
  sessions: "session",
  attachment: "attachment",
  transaction: "transaction",
  event: "error",
  client_report: "internal",
  user_report: "default",
  profile: "profile",
  profile_chunk: "profile",
  replay_event: "replay",
  replay_recording: "replay",
  check_in: "monitor",
  feedback: "feedback",
  span: "span",
  raw_security: "security",
  log: "log_item",
  metric: "metric",
  trace_metric: "metric",
};
function Fs(t) {
  return Ds[t];
}
function Ls(t) {
  if (!t?.sdk) return;
  const { name: e, version: n } = t.sdk;
  return { name: e, version: n };
}
function qs(t, e, n, s) {
  const o = t.sdkProcessingMetadata?.dynamicSamplingContext;
  return {
    event_id: t.event_id,
    sent_at: new Date().toISOString(),
    ...(e && { sdk: e }),
    ...(!!n && s && { dsn: _n(s) }),
    ...(o && { trace: o }),
  };
}
function Us(t, e) {
  if (!e) return t;
  const n = t.sdk || {};
  t.sdk = {
    ...n,
    name: n.name || e.name,
    version: n.version || e.version,
    integrations: [...(t.sdk?.integrations || []), ...(e.integrations || [])],
    packages: [...(t.sdk?.packages || []), ...(e.packages || [])],
    settings:
      t.sdk?.settings || e.settings
        ? { ...t.sdk?.settings, ...e.settings }
        : void 0,
  };
  return t;
}
function Js(t, e, n, s) {
  const o = Ls(n);
  const r = {
    sent_at: new Date().toISOString(),
    ...(o && { sdk: o }),
    ...(!!s && e && { dsn: _n(e) }),
  };
  const i =
    "aggregates" in t
      ? [{ type: "sessions" }, t]
      : [{ type: "session" }, t.toJSON()];
  return Es(r, [i]);
}
function zs(t, e, n, s) {
  const o = Ls(n);
  const r = t.type && t.type !== "replay_event" ? t.type : "event";
  Us(t, n?.sdk);
  const i = qs(t, o, s, e);
  delete t.sdkProcessingMetadata;
  const a = [{ type: r }, t];
  return Es(i, [a]);
}
function Bs(t, e) {
  function n(t) {
    return !!t.trace_id && !!t.public_key;
  }
  const s = gs(t[0]);
  const o = e?.getDsn();
  const r = e?.getOptions().tunnel;
  const i = {
    sent_at: new Date().toISOString(),
    ...(n(s) && { trace: s }),
    ...(!!r && o && { dsn: _n(o) }),
  };
  const { beforeSendSpan: a, ignoreSpans: c } = e?.getOptions() || {};
  const u = c?.length ? t.filter((t) => !is(Jn(t), c)) : t;
  const l = t.length - u.length;
  l && e?.recordDroppedEvent("before_send", "span", l);
  const p = a
    ? (t) => {
        const e = Jn(t);
        const n = a(e);
        if (!n) {
          ts();
          return e;
        }
        return n;
      }
    : Jn;
  const f = [];
  for (const t of u) {
    const e = p(t);
    e && f.push(Ms(e));
  }
  return Es(i, f);
}
function Ws(e) {
  if (!t) return;
  const {
    description: n = "< unknown name >",
    op: s = "< unknown op >",
    parent_span_id: o,
  } = Jn(e);
  const { spanId: r } = e.spanContext();
  const i = Wn(e);
  const a = Xn(e);
  const c = a === e;
  const u = `[Tracing] Starting ${i ? "sampled" : "unsampled"} ${c ? "root " : ""}span`;
  const l = [`op: ${s}`, `name: ${n}`, `ID: ${r}`];
  o && l.push(`parent ID: ${o}`);
  if (!c) {
    const { op: t, description: e } = Jn(a);
    l.push(`root ID: ${a.spanContext().spanId}`);
    t && l.push(`root op: ${t}`);
    e && l.push(`root description: ${e}`);
  }
  y.log(`${u}\n  ${l.join("\n  ")}`);
}
function Vs(e) {
  if (!t) return;
  const { description: n = "< unknown name >", op: s = "< unknown op >" } =
    Jn(e);
  const { spanId: o } = e.spanContext();
  const r = Xn(e);
  const i = r === e;
  const a = `[Tracing] Finishing "${s}" ${i ? "root " : ""}span "${n}" with ID ${o}`;
  y.log(a);
}
function Gs(e, n, s, o = Qn()) {
  const r = o && Xn(o);
  if (r) {
    t &&
      y.log(`[Measurement] Setting measurement on root span: ${e} = ${n} ${s}`);
    r.addEvent(e, { [De]: n, [Pe]: s });
  }
}
function Ks(t) {
  if (!t || t.length === 0) return;
  const e = {};
  t.forEach((t) => {
    const n = t.attributes || {};
    const s = n[Pe];
    const o = n[De];
    typeof s === "string" &&
      typeof o === "number" &&
      (e[t.name] = { value: o, unit: s });
  });
  return e;
}
const Hs = 1e3;
class SentrySpan {
  constructor(t = {}) {
    this._traceId = t.traceId || ce();
    this._spanId = t.spanId || ue();
    this._startTime = t.startTimestamp || Qt();
    this._links = t.links;
    this._attributes = {};
    this.setAttributes({ [Re]: "manual", [je]: t.op, ...t.attributes });
    this._name = t.name;
    t.parentSpanId && (this._parentSpanId = t.parentSpanId);
    "sampled" in t && (this._sampled = t.sampled);
    t.endTimestamp && (this._endTime = t.endTimestamp);
    this._events = [];
    this._isStandaloneSpan = t.isStandalone;
    this._endTime && this._onSpanEnded();
  }
  addLink(t) {
    this._links ? this._links.push(t) : (this._links = [t]);
    return this;
  }
  addLinks(t) {
    this._links ? this._links.push(...t) : (this._links = t);
    return this;
  }
  recordException(t, e) {}
  spanContext() {
    const { _spanId: t, _traceId: e, _sampled: n } = this;
    return { spanId: t, traceId: e, traceFlags: n ? jn : Nn };
  }
  setAttribute(t, e) {
    e === void 0 ? delete this._attributes[t] : (this._attributes[t] = e);
    return this;
  }
  setAttributes(t) {
    Object.keys(t).forEach((e) => this.setAttribute(e, t[e]));
    return this;
  }
  updateStartTime(t) {
    this._startTime = qn(t);
  }
  setStatus(t) {
    this._status = t;
    return this;
  }
  updateName(t) {
    this._name = t;
    this.setAttribute(Oe, "custom");
    return this;
  }
  end(t) {
    if (!this._endTime) {
      this._endTime = qn(t);
      Vs(this);
      this._onSpanEnded();
    }
  }
  getSpanJSON() {
    return {
      data: this._attributes,
      description: this._name,
      op: this._attributes[je],
      parent_span_id: this._parentSpanId,
      span_id: this._spanId,
      start_timestamp: this._startTime,
      status: Vn(this._status),
      timestamp: this._endTime,
      trace_id: this._traceId,
      origin: this._attributes[Re],
      profile_id: this._attributes[Le],
      exclusive_time: this._attributes[qe],
      measurements: Ks(this._events),
      is_segment: (this._isStandaloneSpan && Xn(this) === this) || void 0,
      segment_id: this._isStandaloneSpan
        ? Xn(this).spanContext().spanId
        : void 0,
      links: Ln(this._links),
    };
  }
  isRecording() {
    return !this._endTime && !!this._sampled;
  }
  addEvent(e, n, s) {
    t && y.log("[Tracing] Adding an event to span:", e);
    const o = Zs(n) ? n : s || Qt();
    const r = Zs(n) ? {} : n || {};
    const i = { name: e, time: qn(o), attributes: r };
    this._events.push(i);
    return this;
  }
  isStandaloneSpan() {
    return !!this._isStandaloneSpan;
  }
  _onSpanEnded() {
    const e = Ie();
    e && e.emit("spanEnd", this);
    const n = this._isStandaloneSpan || this === Xn(this);
    if (!n) return;
    if (this._isStandaloneSpan) {
      if (this._sampled) Qs(Bs([this], e));
      else {
        t &&
          y.log(
            "[Tracing] Discarding standalone span because its trace was not chosen to be sampled.",
          );
        e && e.recordDroppedEvent("sample_rate", "span");
      }
      return;
    }
    const s = this._convertSpanToTransaction();
    if (s) {
      const t = on(this).scope || we();
      t.captureEvent(s);
    }
  }
  _convertSpanToTransaction() {
    if (!Ys(Jn(this))) return;
    if (!this._name) {
      t &&
        y.warn(
          "Transaction has no name, falling back to `<unlabeled transaction>`.",
        );
      this._name = "<unlabeled transaction>";
    }
    const { scope: e, isolationScope: n } = on(this);
    const s = e?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
    if (this._sampled !== true) return;
    const o = Yn(this).filter((t) => t !== this && !Xs(t));
    const r = o.map((t) => Jn(t)).filter(Ys);
    const i = this._attributes[Oe];
    /* eslint-disable @typescript-eslint/no-dynamic-delete */ delete this
      ._attributes[Fe];
    r.forEach((t) => {
      delete t.data[Fe];
    });
    const a = {
      contexts: { trace: Mn(this) },
      spans:
        r.length > Hs
          ? r.sort((t, e) => t.start_timestamp - e.start_timestamp).slice(0, Hs)
          : r,
      start_timestamp: this._startTime,
      timestamp: this._endTime,
      transaction: this._name,
      type: "transaction",
      sdkProcessingMetadata: {
        capturedSpanScope: e,
        capturedSpanIsolationScope: n,
        dynamicSamplingContext: gs(this),
      },
      request: s,
      ...(i && { transaction_info: { source: i } }),
    };
    const c = Ks(this._events);
    const u = c && Object.keys(c).length;
    if (u) {
      t &&
        y.log(
          "[Measurements] Adding measurements to transaction event",
          JSON.stringify(c, void 0, 2),
        );
      a.measurements = c;
    }
    return a;
  }
}
function Zs(t) {
  return (t && typeof t === "number") || t instanceof Date || Array.isArray(t);
}
function Ys(t) {
  return !!t.start_timestamp && !!t.timestamp && !!t.span_id && !!t.trace_id;
}
function Xs(t) {
  return t instanceof SentrySpan && t.isStandaloneSpan();
}
function Qs(t) {
  const e = Ie();
  if (!e) return;
  const n = t[1];
  n && n.length !== 0
    ? e.sendEnvelope(t)
    : e.recordDroppedEvent("before_send", "span");
}
function to(t, e, n = () => {}, s = () => {}) {
  let o;
  try {
    o = t();
  } catch (t) {
    e(t);
    n();
    throw t;
  }
  return eo(o, e, n, s);
}
function eo(t, e, n, s) {
  if (st(t))
    return t.then(
      (t) => {
        n();
        s(t);
        return t;
      },
      (t) => {
        e(t);
        n();
        throw t;
      },
    );
  n();
  s(t);
  return t;
}
function no(e, n, s) {
  if (!os(e)) return [false];
  let o;
  let r;
  if (typeof e.tracesSampler === "function") {
    r = e.tracesSampler({
      ...n,
      inheritOrSampleWith: (t) =>
        typeof n.parentSampleRate === "number"
          ? n.parentSampleRate
          : typeof n.parentSampled === "boolean"
            ? Number(n.parentSampled)
            : t,
    });
    o = true;
  } else if (n.parentSampled !== void 0) r = n.parentSampled;
  else if (typeof e.tracesSampleRate !== "undefined") {
    r = e.tracesSampleRate;
    o = true;
  }
  const i = xn(r);
  if (i === void 0) {
    t &&
      y.warn(
        `[Tracing] Discarding root span because of invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(r)} of type ${JSON.stringify(typeof r)}.`,
      );
    return [false];
  }
  if (!i) {
    t &&
      y.log(
        "[Tracing] Discarding transaction because " +
          (typeof e.tracesSampler === "function"
            ? "tracesSampler returned 0 or false"
            : "a negative sampling decision was inherited or tracesSampleRate is set to 0"),
      );
    return [false, i, o];
  }
  const a = s < i;
  a ||
    (t &&
      y.log(
        `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(r)})`,
      ));
  return [a, i, o];
}
const so = "__SENTRY_SUPPRESS_TRACING__";
function oo(t, e) {
  const n = mo();
  if (n.startSpan) return n.startSpan(t, e);
  const s = fo(t);
  const { forceTransaction: o, parentSpan: r, scope: i } = t;
  const a = i?.clone();
  return Ee(a, () => {
    const n = yo(r);
    return n(() => {
      const n = we();
      const i = _o(n, r);
      const a = t.onlyIfParent && !i;
      const c = a
        ? new SentryNonRecordingSpan()
        : po({
            parentSpan: i,
            spanArguments: s,
            forceTransaction: o,
            scope: n,
          });
      pe(n, c);
      return to(
        () => e(c),
        () => {
          const { status: t } = Jn(c);
          !c.isRecording() ||
            (t && t !== "ok") ||
            c.setStatus({ code: Ze, message: "internal_error" });
        },
        () => {
          c.end();
        },
      );
    });
  });
}
function ro(t, e) {
  const n = mo();
  if (n.startSpanManual) return n.startSpanManual(t, e);
  const s = fo(t);
  const { forceTransaction: o, parentSpan: r, scope: i } = t;
  const a = i?.clone();
  return Ee(a, () => {
    const n = yo(r);
    return n(() => {
      const n = we();
      const i = _o(n, r);
      const a = t.onlyIfParent && !i;
      const c = a
        ? new SentryNonRecordingSpan()
        : po({
            parentSpan: i,
            spanArguments: s,
            forceTransaction: o,
            scope: n,
          });
      pe(n, c);
      return to(
        () => e(c, () => c.end()),
        () => {
          const { status: t } = Jn(c);
          !c.isRecording() ||
            (t && t !== "ok") ||
            c.setStatus({ code: Ze, message: "internal_error" });
        },
      );
    });
  });
}
function io(t) {
  const e = mo();
  if (e.startInactiveSpan) return e.startInactiveSpan(t);
  const n = fo(t);
  const { forceTransaction: s, parentSpan: o } = t;
  const r = t.scope
    ? (e) => Ee(t.scope, e)
    : o !== void 0
      ? (t) => co(o, t)
      : (t) => t();
  return r(() => {
    const e = we();
    const r = _o(e, o);
    const i = t.onlyIfParent && !r;
    return i
      ? new SentryNonRecordingSpan()
      : po({ parentSpan: r, spanArguments: n, forceTransaction: s, scope: e });
  });
}
const ao = (t, e) => {
  const n = s();
  const o = ke(n);
  if (o.continueTrace) return o.continueTrace(t, e);
  const { sentryTrace: r, baggage: i } = t;
  const a = Ie();
  const c = un(i);
  return a && !Cn(a, c?.org_id)
    ? lo(e)
    : Ee((t) => {
        const n = Tn(r, i);
        t.setPropagationContext(n);
        pe(t, void 0);
        return e();
      });
};
/**
 * Forks the current scope and sets the provided span as active span in the context of the provided callback. Can be
 * passed `null` to start an entirely new span tree.
 *
 * @param span Spans started in the context of the provided callback will be children of this span. If `null` is passed,
 * spans started within the callback will not be attached to a parent span.
 * @param callback Execution context in which the provided span will be active. Is passed the newly forked scope.
 * @returns the value returned from the provided callback function.
 */ function co(t, e) {
  const n = mo();
  return n.withActiveSpan
    ? n.withActiveSpan(t, e)
    : Ee((n) => {
        pe(n, t || void 0);
        return e(n);
      });
}
function uo(t) {
  const e = mo();
  return e.suppressTracing
    ? e.suppressTracing(t)
    : Ee((e) => {
        e.setSDKProcessingMetadata({ [so]: true });
        const n = t();
        e.setSDKProcessingMetadata({ [so]: void 0 });
        return n;
      });
}
function lo(e) {
  return Ee((n) => {
    n.setPropagationContext({ traceId: ce(), sampleRand: It() });
    t &&
      y.log(
        `Starting a new trace with id ${n.getPropagationContext().traceId}`,
      );
    return co(null, e);
  });
}
function po({
  parentSpan: t,
  spanArguments: e,
  forceTransaction: n,
  scope: s,
}) {
  if (!os()) {
    const s = new SentryNonRecordingSpan();
    if (n || !t) {
      const t = {
        sampled: "false",
        sample_rate: "0",
        transaction: e.name,
        ...gs(s),
      };
      fs(s, t);
    }
    return s;
  }
  const o = xe();
  let r;
  if (t && !n) {
    r = ho(t, s, e);
    Hn(t, r);
  } else if (t) {
    const n = gs(t);
    const { traceId: o, spanId: i } = t.spanContext();
    const a = Wn(t);
    r = go({ traceId: o, parentSpanId: i, ...e }, s, a);
    fs(r, n);
  } else {
    const {
      traceId: t,
      dsc: n,
      parentSpanId: i,
      sampled: a,
    } = { ...o.getPropagationContext(), ...s.getPropagationContext() };
    r = go({ traceId: t, parentSpanId: i, ...e }, s, a);
    n && fs(r, n);
  }
  Ws(r);
  sn(r, s, o);
  return r;
}
function fo(t) {
  const e = t.experimental || {};
  const n = { isStandalone: e.standalone, ...t };
  if (t.startTime) {
    const e = { ...n };
    e.startTimestamp = qn(t.startTime);
    delete e.startTime;
    return e;
  }
  return n;
}
function mo() {
  const t = s();
  return ke(t);
}
function go(e, n, s) {
  const o = Ie();
  const r = o?.getOptions() || {};
  const { name: i = "" } = e;
  const a = {
    spanAttributes: { ...e.attributes },
    spanName: i,
    parentSampled: s,
  };
  o?.emit("beforeSampling", a, { decision: false });
  const c = a.parentSampled ?? s;
  const u = a.spanAttributes;
  const l = n.getPropagationContext();
  const [p, f, d] = n.getScopeData().sdkProcessingMetadata[so]
    ? [false]
    : no(
        r,
        {
          name: i,
          parentSampled: c,
          attributes: u,
          parentSampleRate: xn(l.dsc?.sample_rate),
        },
        l.sampleRand,
      );
  const m = new SentrySpan({
    ...e,
    attributes: { [Oe]: "custom", [Ce]: f !== void 0 && d ? f : void 0, ...u },
    sampled: p,
  });
  if (!p && o) {
    t &&
      y.log(
        "[Tracing] Discarding root span because its trace was not chosen to be sampled.",
      );
    o.recordDroppedEvent("sample_rate", "transaction");
  }
  o && o.emit("spanStart", m);
  return m;
}
function ho(t, e, n) {
  const { spanId: s, traceId: o } = t.spanContext();
  const r = !e.getScopeData().sdkProcessingMetadata[so] && Wn(t);
  const i = r
    ? new SentrySpan({ ...n, parentSpanId: s, traceId: o, sampled: r })
    : new SentryNonRecordingSpan({ traceId: o });
  Hn(t, i);
  const a = Ie();
  if (a) {
    a.emit("spanStart", i);
    n.endTimestamp && a.emit("spanEnd", i);
  }
  return i;
}
function _o(t, e) {
  if (e) return e;
  if (e === null) return;
  const n = fe(t);
  if (!n) return;
  const s = Ie();
  const o = s ? s.getOptions() : {};
  return o.parentSpanIsAlwaysRootSpan ? Xn(n) : n;
}
function yo(t) {
  return t !== void 0 ? (e) => co(t, e) : (t) => t();
}
const bo = { idleTimeout: 1e3, finalTimeout: 3e4, childSpanTimeout: 15e3 };
const vo = "heartbeatFailed";
const So = "idleTimeout";
const ko = "finalTimeout";
const wo = "externalFinish";
function xo(e, n = {}) {
  const s = new Map();
  let o = false;
  let r;
  let i = wo;
  let a = !n.disableAutoFinish;
  const c = [];
  const {
    idleTimeout: u = bo.idleTimeout,
    finalTimeout: l = bo.finalTimeout,
    childSpanTimeout: p = bo.childSpanTimeout,
    beforeSpanEnd: f,
    trimIdleSpanEndTimestamp: d = true,
  } = n;
  const m = Ie();
  if (!m || !os()) {
    const t = new SentryNonRecordingSpan();
    const e = { sample_rate: "0", sampled: "false", ...gs(t) };
    fs(t, e);
    return t;
  }
  const g = we();
  const h = Qn();
  const _ = Ao(e);
  _.end = new Proxy(_.end, {
    apply(t, e, n) {
      f && f(_);
      if (e instanceof SentryNonRecordingSpan) return;
      const [s, ...o] = n;
      const r = s || Qt();
      const i = qn(r);
      const a = Yn(_).filter((t) => t !== _);
      const c = Jn(_);
      if (!a.length || !d) {
        x(i);
        return Reflect.apply(t, e, [i, ...o]);
      }
      const u = m.getOptions().ignoreSpans;
      const p = a?.reduce(
        (t, e) => {
          const n = Jn(e);
          return n.timestamp
            ? u && is(n, u)
              ? t
              : t
                ? Math.max(t, n.timestamp)
                : n.timestamp
            : t;
        },
        void 0,
      );
      const g = c.start_timestamp;
      const h = Math.min(
        g ? g + l / 1e3 : Infinity,
        Math.max(g || -Infinity, Math.min(i, p || Infinity)),
      );
      x(h);
      return Reflect.apply(t, e, [h, ...o]);
    },
  });
  function b() {
    if (r) {
      clearTimeout(r);
      r = void 0;
    }
  }
  function v(t) {
    b();
    r = setTimeout(() => {
      if (!o && s.size === 0 && a) {
        i = So;
        _.end(t);
      }
    }, u);
  }
  function S(t) {
    r = setTimeout(() => {
      if (!o && a) {
        i = vo;
        _.end(t);
      }
    }, p);
  }
  /**
   * Start tracking a specific activity.
   * @param spanId The span id that represents the activity
   */ function k(t) {
    b();
    s.set(t, true);
    const e = Qt();
    S(e + p / 1e3);
  }
  /**
   * Remove an activity from usage
   * @param spanId The span id that represents the activity
   */ function w(t) {
    s.has(t) && s.delete(t);
    if (s.size === 0) {
      const t = Qt();
      v(t + u / 1e3);
    }
  }
  function x(e) {
    o = true;
    s.clear();
    c.forEach((t) => t());
    pe(g, h);
    const n = Jn(_);
    const { start_timestamp: r } = n;
    if (!r) return;
    const a = n.data;
    a[Me] || _.setAttribute(Me, i);
    const p = n.status;
    (p && p !== "unknown") || _.setStatus({ code: He });
    y.log(`[Tracing] Idle span "${n.op}" finished`);
    const f = Yn(_).filter((t) => t !== _);
    let d = 0;
    f.forEach((n) => {
      if (n.isRecording()) {
        n.setStatus({ code: Ze, message: "cancelled" });
        n.end(e);
        t &&
          y.log(
            "[Tracing] Cancelling span since span ended early",
            JSON.stringify(n, void 0, 2),
          );
      }
      const s = Jn(n);
      const { timestamp: o = 0, start_timestamp: r = 0 } = s;
      const i = r <= e;
      const a = (l + u) / 1e3;
      const c = o - r <= a;
      if (t) {
        const t = JSON.stringify(n, void 0, 2);
        i
          ? c ||
            y.log(
              "[Tracing] Discarding span since it finished after idle span final timeout",
              t,
            )
          : y.log(
              "[Tracing] Discarding span since it happened after idle span was finished",
              t,
            );
      }
      if (!c || !i) {
        Zn(_, n);
        d++;
      }
    });
    d > 0 && _.setAttribute("sentry.idle_span_discarded_spans", d);
  }
  c.push(
    m.on("spanStart", (t) => {
      if (
        o ||
        t === _ ||
        !!Jn(t).timestamp ||
        (t instanceof SentrySpan && t.isStandaloneSpan())
      )
        return;
      const e = Yn(_);
      e.includes(t) && k(t.spanContext().spanId);
    }),
  );
  c.push(
    m.on("spanEnd", (t) => {
      o || w(t.spanContext().spanId);
    }),
  );
  c.push(
    m.on("idleSpanEnableAutoFinish", (t) => {
      if (t === _) {
        a = true;
        v();
        s.size && S();
      }
    }),
  );
  n.disableAutoFinish || v();
  setTimeout(() => {
    if (!o) {
      _.setStatus({ code: Ze, message: "deadline_exceeded" });
      i = ko;
      _.end();
    }
  }, l);
  return _;
}
function Ao(e) {
  const n = io(e);
  pe(we(), n);
  t && y.log("[Tracing] Started span is an idle span");
  return n;
}
/* eslint-disable @typescript-eslint/no-explicit-any */ const Eo = 0;
const To = 1;
const Io = 2;
/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */ function $o(t) {
  return new SyncPromise((e) => {
    e(t);
  });
}
/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */ function Oo(t) {
  return new SyncPromise((e, n) => {
    n(t);
  });
}
class SyncPromise {
  constructor(t) {
    this._state = Eo;
    this._handlers = [];
    this._runExecutor(t);
  }
  then(t, e) {
    return new SyncPromise((n, s) => {
      this._handlers.push([
        false,
        (e) => {
          if (t)
            try {
              n(t(e));
            } catch (t) {
              s(t);
            }
          else n(e);
        },
        (t) => {
          if (e)
            try {
              n(e(t));
            } catch (t) {
              s(t);
            }
          else s(t);
        },
      ]);
      this._executeHandlers();
    });
  }
  catch(t) {
    return this.then((t) => t, t);
  }
  finally(t) {
    return new SyncPromise((e, n) => {
      let s;
      let o;
      return this.then(
        (e) => {
          o = false;
          s = e;
          t && t();
        },
        (e) => {
          o = true;
          s = e;
          t && t();
        },
      ).then(() => {
        o ? n(s) : e(s);
      });
    });
  }
  _executeHandlers() {
    if (this._state === Eo) return;
    const t = this._handlers.slice();
    this._handlers = [];
    t.forEach((t) => {
      if (!t[0]) {
        this._state === To && t[1](this._value);
        this._state === Io && t[2](this._value);
        t[0] = true;
      }
    });
  }
  _runExecutor(t) {
    const e = (t, e) => {
      if (this._state === Eo)
        if (st(e)) void e.then(n, s);
        else {
          this._state = t;
          this._value = e;
          this._executeHandlers();
        }
    };
    const n = (t) => {
      e(To, t);
    };
    const s = (t) => {
      e(Io, t);
    };
    try {
      t(n, s);
    } catch (t) {
      s(t);
    }
  }
}
function Co(t, e, n, s = 0) {
  try {
    const o = No(e, n, t, s);
    return st(o) ? o : $o(o);
  } catch (t) {
    return Oo(t);
  }
}
function No(e, n, s, o) {
  const r = s[o];
  if (!e || !r) return e;
  const i = r({ ...e }, n);
  t && i === null && y.log(`Event processor "${r.id || "?"}" dropped event`);
  return st(i) ? i.then((t) => No(t, n, s, o + 1)) : No(i, n, s, o + 1);
}
let jo;
let Ro;
let Mo;
let Po;
function Do(t) {
  const n = e._sentryDebugIds;
  const s = e._debugIds;
  if (!n && !s) return {};
  const o = n ? Object.keys(n) : [];
  const r = s ? Object.keys(s) : [];
  if (Po && o.length === Ro && r.length === Mo) return Po;
  Ro = o.length;
  Mo = r.length;
  Po = {};
  jo || (jo = {});
  const i = (e, n) => {
    for (const s of e) {
      const e = n[s];
      const o = jo?.[s];
      if (o && Po && e) {
        Po[o[0]] = e;
        jo && (jo[s] = [o[0], e]);
      } else if (e) {
        const n = t(s);
        for (let t = n.length - 1; t >= 0; t--) {
          const o = n[t];
          const r = o?.filename;
          if (r && Po && jo) {
            Po[r] = e;
            jo[s] = [r, e];
            break;
          }
        }
      }
    }
  };
  n && i(o, n);
  s && i(r, s);
  return Po;
}
function Fo(t, e) {
  const n = Do(t);
  if (!n) return [];
  const s = [];
  for (const t of e) {
    const e = C(t);
    e && n[e] && s.push({ type: "sourcemap", code_file: t, debug_id: n[e] });
  }
  return s;
}
function Lo(t, e) {
  const {
    fingerprint: n,
    span: s,
    breadcrumbs: o,
    sdkProcessingMetadata: r,
  } = e;
  zo(t, e);
  s && Vo(t, s);
  Go(t, n);
  Bo(t, o);
  Wo(t, r);
}
function qo(t, e) {
  const {
    extra: n,
    tags: s,
    attributes: o,
    user: r,
    contexts: i,
    level: a,
    sdkProcessingMetadata: c,
    breadcrumbs: u,
    fingerprint: l,
    eventProcessors: p,
    attachments: f,
    propagationContext: d,
    transactionName: m,
    span: g,
  } = e;
  Uo(t, "extra", n);
  Uo(t, "tags", s);
  Uo(t, "attributes", o);
  Uo(t, "user", r);
  Uo(t, "contexts", i);
  t.sdkProcessingMetadata = ae(t.sdkProcessingMetadata, c, 2);
  a && (t.level = a);
  m && (t.transactionName = m);
  g && (t.span = g);
  u.length && (t.breadcrumbs = [...t.breadcrumbs, ...u]);
  l.length && (t.fingerprint = [...t.fingerprint, ...l]);
  p.length && (t.eventProcessors = [...t.eventProcessors, ...p]);
  f.length && (t.attachments = [...t.attachments, ...f]);
  t.propagationContext = { ...t.propagationContext, ...d };
}
function Uo(t, e, n) {
  t[e] = ae(t[e], n, 1);
}
/**
 * Get the scope data for the current scope after merging with the
 * global scope and isolation scope.
 *
 * @param currentScope - The current scope.
 * @returns The scope data.
 */ function Jo(t, e) {
  const n = Ae().getScopeData();
  t && qo(n, t.getScopeData());
  e && qo(n, e.getScopeData());
  return n;
}
function zo(t, e) {
  const {
    extra: n,
    tags: s,
    user: o,
    contexts: r,
    level: i,
    transactionName: a,
  } = e;
  Object.keys(n).length && (t.extra = { ...n, ...t.extra });
  Object.keys(s).length && (t.tags = { ...s, ...t.tags });
  Object.keys(o).length && (t.user = { ...o, ...t.user });
  Object.keys(r).length && (t.contexts = { ...r, ...t.contexts });
  i && (t.level = i);
  a && t.type !== "transaction" && (t.transaction = a);
}
function Bo(t, e) {
  const n = [...(t.breadcrumbs || []), ...e];
  t.breadcrumbs = n.length ? n : void 0;
}
function Wo(t, e) {
  t.sdkProcessingMetadata = { ...t.sdkProcessingMetadata, ...e };
}
function Vo(t, e) {
  t.contexts = { trace: Pn(e), ...t.contexts };
  t.sdkProcessingMetadata = {
    dynamicSamplingContext: gs(e),
    ...t.sdkProcessingMetadata,
  };
  const n = Xn(e);
  const s = Jn(n).description;
  s && !t.transaction && t.type === "transaction" && (t.transaction = s);
}
function Go(t, e) {
  t.fingerprint = t.fingerprint
    ? Array.isArray(t.fingerprint)
      ? t.fingerprint
      : [t.fingerprint]
    : [];
  e && (t.fingerprint = t.fingerprint.concat(e));
  t.fingerprint.length || delete t.fingerprint;
}
/**
 * Adds common information to events.
 *
 * The information includes release and environment from `options`,
 * breadcrumbs and context (extra, tags and user) from the scope.
 *
 * Information that is already present in the event is never overwritten. For
 * nested objects, such as the context, keys are merged.
 *
 * @param event The original event.
 * @param hint May contain additional information about the original exception.
 * @param scope A scope containing event metadata.
 * @returns A new event with more information.
 * @hidden
 */ function Ko(t, e, n, s, o, r) {
  const { normalizeDepth: i = 3, normalizeMaxBreadth: a = 1e3 } = t;
  const c = {
    ...e,
    event_id: e.event_id || n.event_id || Ft(),
    timestamp: e.timestamp || Zt(),
  };
  const u = n.integrations || t.integrations.map((t) => t.name);
  Ho(c, t);
  Xo(c, u);
  o && o.emit("applyFrameMetadata", e);
  e.type === void 0 && Zo(c, t.stackParser);
  const l = tr(s, n.captureContext);
  n.mechanism && Jt(c, n.mechanism);
  const p = o ? o.getEventProcessors() : [];
  const f = Jo(r, l);
  const d = [...(n.attachments || []), ...f.attachments];
  d.length && (n.attachments = d);
  Lo(c, f);
  const m = [...p, ...f.eventProcessors];
  const g = n.data && n.data.__sentry__ === true;
  const h = g ? $o(c) : Co(m, c, n);
  return h.then((t) => {
    t && Yo(t);
    return typeof i === "number" && i > 0 ? Qo(t, i, a) : t;
  });
}
/**
 * Enhances event using the client configuration.
 * It takes care of all "static" values like environment, release and `dist`,
 * as well as truncating overly long values.
 *
 * Only exported for tests.
 *
 * @param event event instance to be enhanced
 */ function Ho(t, e) {
  const { environment: n, release: s, dist: o, maxValueLength: r } = e;
  t.environment = t.environment || n || us;
  !t.release && s && (t.release = s);
  !t.dist && o && (t.dist = o);
  const i = t.request;
  i?.url && r && (i.url = Ot(i.url, r));
  r &&
    t.exception?.values?.forEach((t) => {
      t.value && (t.value = Ot(t.value, r));
    });
}
function Zo(t, e) {
  const n = Do(e);
  t.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((t) => {
      t.filename && (t.debug_id = n[t.filename]);
    });
  });
}
function Yo(t) {
  const e = {};
  t.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((t) => {
      if (t.debug_id) {
        t.abs_path
          ? (e[t.abs_path] = t.debug_id)
          : t.filename && (e[t.filename] = t.debug_id);
        delete t.debug_id;
      }
    });
  });
  if (Object.keys(e).length === 0) return;
  t.debug_meta = t.debug_meta || {};
  t.debug_meta.images = t.debug_meta.images || [];
  const n = t.debug_meta.images;
  Object.entries(e).forEach(([t, e]) => {
    n.push({ type: "sourcemap", code_file: t, debug_id: e });
  });
}
/**
 * This function adds all used integrations to the SDK info in the event.
 * @param event The event that will be filled with all integrations.
 */ function Xo(t, e) {
  if (e.length > 0) {
    t.sdk = t.sdk || {};
    t.sdk.integrations = [...(t.sdk.integrations || []), ...e];
  }
}
/**
 * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
 * Normalized keys:
 * - `breadcrumbs.data`
 * - `user`
 * - `contexts`
 * - `extra`
 * @param event Event
 * @returns Normalized event
 */ function Qo(t, e, n) {
  if (!t) return null;
  const s = {
    ...t,
    ...(t.breadcrumbs && {
      breadcrumbs: t.breadcrumbs.map((t) => ({
        ...t,
        ...(t.data && { data: _s(t.data, e, n) }),
      })),
    }),
    ...(t.user && { user: _s(t.user, e, n) }),
    ...(t.contexts && { contexts: _s(t.contexts, e, n) }),
    ...(t.extra && { extra: _s(t.extra, e, n) }),
  };
  if (t.contexts?.trace && s.contexts) {
    s.contexts.trace = t.contexts.trace;
    t.contexts.trace.data &&
      (s.contexts.trace.data = _s(t.contexts.trace.data, e, n));
  }
  t.spans &&
    (s.spans = t.spans.map((t) => ({
      ...t,
      ...(t.data && { data: _s(t.data, e, n) }),
    })));
  t.contexts?.flags &&
    s.contexts &&
    (s.contexts.flags = _s(t.contexts.flags, 3, n));
  return s;
}
function tr(t, e) {
  if (!e) return t;
  const n = t ? t.clone() : new Scope();
  n.update(e);
  return n;
}
function er(t) {
  if (t) return nr(t) || or(t) ? { captureContext: t } : t;
}
function nr(t) {
  return t instanceof Scope || typeof t === "function";
}
const sr = [
  "user",
  "level",
  "extra",
  "contexts",
  "tags",
  "fingerprint",
  "propagationContext",
];
function or(t) {
  return Object.keys(t).some((t) => sr.includes(t));
}
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception The exception to capture.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured Sentry event.
 */ function rr(t, e) {
  return we().captureException(t, er(e));
}
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param captureContext Define the level of the message or pass in additional data to attach to the message.
 * @returns the id of the captured message.
 */ function ir(t, e) {
  const n = typeof e === "string" ? e : void 0;
  const s = typeof e !== "string" ? { captureContext: e } : void 0;
  return we().captureMessage(t, n, s);
}
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured event.
 */ function ar(t, e) {
  return we().captureEvent(t, e);
}
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */ function cr(t, e) {
  xe().setContext(t, e);
}
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */ function ur(t) {
  xe().setExtras(t);
}
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */ function lr(t, e) {
  xe().setExtra(t, e);
}
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */ function pr(t) {
  xe().setTags(t);
}
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */ function fr(t, e) {
  xe().setTag(t, e);
}
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */ function dr(t) {
  xe().setUser(t);
}
/**
 * Sets the conversation ID for the current isolation scope.
 *
 * @param conversationId The conversation ID to set. Pass `null` or `undefined` to unset the conversation ID.
 */ function mr(t) {
  xe().setConversationId(t);
}
/**
 * The last error event id of the isolation scope.
 *
 * Warning: This function really returns the last recorded error event id on the current
 * isolation scope. If you call this function after handling a certain error and another error
 * is captured in between, the last one is returned instead of the one you might expect.
 * Also, ids of events that were never sent to Sentry (for example because
 * they were dropped in `beforeSend`) could be returned.
 *
 * @returns The last event id of the isolation scope.
 */ function gr() {
  return xe().lastEventId();
}
/**
 * Create a cron monitor check in and send it to Sentry.
 *
 * @param checkIn An object that describes a check in.
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function hr(e, n) {
  const s = we();
  const o = Ie();
  if (o) {
    if (o.captureCheckIn) return o.captureCheckIn(e, n, s);
    t &&
      y.warn(
        "Cannot capture check-in. Client does not support sending check-ins.",
      );
  } else t && y.warn("Cannot capture check-in. No client defined.");
  return Ft();
}
/**
 * Wraps a callback with a cron monitor check in. The check in will be sent to Sentry when the callback finishes.
 *
 * @param monitorSlug The distinct slug of the monitor.
 * @param callback Callback to be monitored
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function _r(t, e, n) {
  function s() {
    const s = hr({ monitorSlug: t, status: "in_progress" }, n);
    const o = Qt();
    function r(e) {
      hr({ monitorSlug: t, status: e, checkInId: s, duration: Qt() - o });
    }
    let i;
    try {
      i = e();
    } catch (t) {
      r("error");
      throw t;
    }
    if (st(i))
      return i.then(
        (t) => {
          r("ok");
          return t;
        },
        (t) => {
          r("error");
          throw t;
        },
      );
    r("ok");
    return i;
  }
  return Te(() => (n?.isolateTrace ? lo(s) : s()));
}
/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */ async function yr(e) {
  const n = Ie();
  if (n) return n.flush(e);
  t && y.warn("Cannot flush events. No client defined.");
  return Promise.resolve(false);
}
/**
 * Call `close()` on the current client, if there is one. See {@link Client.close}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue before shutting down. Omitting this
 * parameter will cause the client to wait until all events are sent before disabling itself.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */ async function br(e) {
  const n = Ie();
  if (n) return n.close(e);
  t && y.warn("Cannot flush events and disable SDK. No client defined.");
  return Promise.resolve(false);
}
function vr() {
  return !!Ie();
}
function Sr() {
  const t = Ie();
  return t?.getOptions().enabled !== false && !!t?.getTransport();
}
function kr(t) {
  xe().addEventProcessor(t);
}
/**
 * Start a session on the current isolation scope.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns the new active session
 */ function wr(t) {
  const n = xe();
  const { user: s } = Jo(n, we());
  const { userAgent: o } = e.navigator || {};
  const r = se({ user: s, ...(o && { userAgent: o }), ...t });
  const i = n.getSession();
  i?.status === "ok" && oe(i, { status: "exited" });
  xr();
  n.setSession(r);
  return r;
}
function xr() {
  const t = xe();
  const e = we();
  const n = e.getSession() || t.getSession();
  n && re(n);
  Ar();
  t.setSession();
}
function Ar() {
  const t = xe();
  const e = Ie();
  const n = t.getSession();
  n && e && e.captureSession(n);
}
/**
 * Sends the current session on the scope to Sentry
 *
 * @param end If set the session will be marked as exited and removed from the scope.
 *            Defaults to `false`.
 */ function Er(t = false) {
  t ? xr() : Ar();
}
const Tr = "7";
function Ir(t) {
  const e = t.protocol ? `${t.protocol}:` : "";
  const n = t.port ? `:${t.port}` : "";
  return `${e}//${t.host}${n}${t.path ? `/${t.path}` : ""}/api/`;
}
function $r(t) {
  return `${Ir(t)}${t.projectId}/envelope/`;
}
function Or(t, e) {
  const n = { sentry_version: Tr };
  t.publicKey && (n.sentry_key = t.publicKey);
  e && (n.sentry_client = `${e.name}/${e.version}`);
  return new URLSearchParams(n).toString();
}
function Cr(t, e, n) {
  return e || `${$r(t)}?${Or(t, n)}`;
}
function Nr(t, e) {
  const n = wn(t);
  if (!n) return "";
  const s = `${Ir(n)}embed/error-page/`;
  let o = `dsn=${_n(n)}`;
  for (const t in e)
    if (t !== "dsn" && t !== "onClose")
      if (t === "user") {
        const t = e.user;
        if (!t) continue;
        t.name && (o += `&name=${encodeURIComponent(t.name)}`);
        t.email && (o += `&email=${encodeURIComponent(t.email)}`);
      } else o += `&${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`;
  return `${s}?${o}`;
}
const jr = [];
function Rr(t) {
  const e = {};
  t.forEach((t) => {
    const { name: n } = t;
    const s = e[n];
    (s && !s.isDefaultInstance && t.isDefaultInstance) || (e[n] = t);
  });
  return Object.values(e);
}
function Mr(t) {
  const e = t.defaultIntegrations || [];
  const n = t.integrations;
  e.forEach((t) => {
    t.isDefaultInstance = true;
  });
  let s;
  if (Array.isArray(n)) s = [...e, ...n];
  else if (typeof n === "function") {
    const t = n(e);
    s = Array.isArray(t) ? t : [t];
  } else s = e;
  return Rr(s);
}
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */ function Pr(t, e) {
  const n = {};
  e.forEach((e) => {
    e && Fr(t, e, n);
  });
  return n;
}
function Dr(t, e) {
  for (const n of e) n?.afterAllSetup && n.afterAllSetup(t);
}
function Fr(e, n, s) {
  if (s[n.name])
    t &&
      y.log(`Integration skipped because it was already installed: ${n.name}`);
  else {
    s[n.name] = n;
    if (!jr.includes(n.name) && typeof n.setupOnce === "function") {
      n.setupOnce();
      jr.push(n.name);
    }
    n.setup && typeof n.setup === "function" && n.setup(e);
    if (typeof n.preprocessEvent === "function") {
      const t = n.preprocessEvent.bind(n);
      e.on("preprocessEvent", (n, s) => t(n, s, e));
    }
    if (typeof n.processEvent === "function") {
      const t = n.processEvent.bind(n);
      const s = Object.assign((n, s) => t(n, s, e), { id: n.name });
      e.addEventProcessor(s);
    }
    t && y.log(`Integration installed: ${n.name}`);
  }
}
function Lr(e) {
  const n = Ie();
  n
    ? n.addIntegration(e)
    : t &&
      y.warn(
        `Cannot add integration "${e.name}" because no SDK Client is available.`,
      );
}
function qr(t) {
  return t;
}
function Ur(t) {
  return (
    typeof t === "object" &&
    t != null &&
    !Array.isArray(t) &&
    Object.keys(t).includes("value")
  );
}
/**
 * Converts an attribute value to a typed attribute value.
 *
 * For now, we intentionally only support primitive values and attribute objects with primitive values.
 * If @param useFallback is true, we stringify non-primitive values to a string attribute value. Otherwise
 * we return `undefined` for unsupported values.
 *
 * @param value - The value of the passed attribute.
 * @param useFallback - If true, unsupported values will be stringified to a string attribute value.
 *                      Defaults to false. In this case, `undefined` is returned for unsupported values.
 * @returns The typed attribute.
 */ function Jr(t, e) {
  const { value: n, unit: s } = Ur(t) ? t : { value: t, unit: void 0 };
  const o = Br(n);
  const r = s && typeof s === "string" ? { unit: s } : {};
  if (o) return { ...o, ...r };
  if (!e || (e === "skip-undefined" && n === void 0)) return;
  let i = "";
  try {
    i = JSON.stringify(n) ?? "";
  } catch {}
  return { value: i, type: "string", ...r };
}
/**
 * Serializes raw attributes to typed attributes as expected in our envelopes.
 *
 * @param attributes The raw attributes to serialize.
 * @param fallback   If true, unsupported values will be stringified to a string attribute value.
 *                   Defaults to false. In this case, `undefined` is returned for unsupported values.
 *
 * @returns The serialized attributes.
 */ function zr(t, e = false) {
  const n = {};
  for (const [s, o] of Object.entries(t ?? {})) {
    const t = Jr(o, e);
    t && (n[s] = t);
  }
  return n;
}
function Br(t) {
  const e =
    typeof t === "string"
      ? "string"
      : typeof t === "boolean"
        ? "boolean"
        : typeof t !== "number" || Number.isNaN(t)
          ? null
          : Number.isInteger(t)
            ? "integer"
            : "double";
  if (e) return { value: t, type: e };
}
function Wr(t, e) {
  return e
    ? Ee(e, () => {
        const n = Qn();
        const s = n ? Pn(n) : $e(e);
        const o = n ? gs(n) : ms(t, e);
        return [o, s];
      })
    : [void 0, void 0];
}
const Vr = { trace: 1, debug: 5, info: 9, warn: 13, error: 17, fatal: 21 };
/**
 * Creates a log container envelope item for a list of logs.
 *
 * @param items - The logs to include in the envelope.
 * @returns The created log container envelope item.
 */ function Gr(t) {
  return [
    {
      type: "log",
      item_count: t.length,
      content_type: "application/vnd.sentry.items.log+json",
    },
    { items: t },
  ];
}
/**
 * Creates an envelope for a list of logs.
 *
 * Logs from multiple traces can be included in the same envelope.
 *
 * @param logs - The logs to include in the envelope.
 * @param metadata - The metadata to include in the envelope.
 * @param tunnel - The tunnel to include in the envelope.
 * @param dsn - The DSN to include in the envelope.
 * @returns The created envelope.
 */ function Kr(t, e, n, s) {
  const o = {};
  e?.sdk && (o.sdk = { name: e.sdk.name, version: e.sdk.version });
  !n || !s || (o.dsn = _n(s));
  return Es(o, [Gr(t)]);
}
const Hr = 100;
/**
 * Sets a log attribute if the value exists and the attribute key is not already present.
 *
 * @param logAttributes - The log attributes object to modify.
 * @param key - The attribute key to set.
 * @param value - The value to set (only sets if truthy and key not present).
 * @param setEvenIfPresent - Whether to set the attribute if it is present. Defaults to true.
 */ function Zr(t, e, n, s = true) {
  !n || (t[e] && !s) || (t[e] = n);
}
/**
 * Captures a serialized log event and adds it to the log buffer for the given client.
 *
 * @param client - A client. Uses the current client if not provided.
 * @param serializedLog - The serialized log event to capture.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function Yr(t, e) {
  const n = ei();
  const s = ti(t);
  if (s === void 0) n.set(t, [e]);
  else if (s.length >= Hr) {
    Qr(t, s);
    n.set(t, [e]);
  } else n.set(t, [...s, e]);
}
/**
 * Captures a log event and sends it to Sentry.
 *
 * @param log - The log event to capture.
 * @param scope - A scope. Uses the current scope if not provided.
 * @param client - A client. Uses the current client if not provided.
 * @param captureSerializedLog - A function to capture the serialized log.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function Xr(e, n = we(), s = Yr) {
  const o = n?.getClient() ?? Ie();
  if (!o) {
    t && y.warn("No client available to capture log.");
    return;
  }
  const {
    release: r,
    environment: i,
    enableLogs: a = false,
    beforeSendLog: c,
  } = o.getOptions();
  if (!a) {
    t && y.warn("logging option not enabled, log will not be captured.");
    return;
  }
  const [, l] = Wr(o, n);
  const p = { ...e.attributes };
  const {
    user: { id: f, email: d, username: m },
    attributes: g = {},
  } = Jo(xe(), n);
  Zr(p, "user.id", f, false);
  Zr(p, "user.email", d, false);
  Zr(p, "user.name", m, false);
  Zr(p, "sentry.release", r);
  Zr(p, "sentry.environment", i);
  const { name: h, version: _ } = o.getSdkMetadata()?.sdk ?? {};
  Zr(p, "sentry.sdk.name", h);
  Zr(p, "sentry.sdk.version", _);
  const b = o.getIntegrationByName("Replay");
  const v = b?.getReplayId(true);
  Zr(p, "sentry.replay_id", v);
  v &&
    b?.getRecordingMode() === "buffer" &&
    Zr(p, "sentry._internal.replay_is_buffering", true);
  const S = e.message;
  if (Y(S)) {
    const {
      __sentry_template_string__: t,
      __sentry_template_values__: e = [],
    } = S;
    e?.length && (p["sentry.message.template"] = t);
    e.forEach((t, e) => {
      p[`sentry.message.parameter.${e}`] = t;
    });
  }
  const k = fe(n);
  Zr(p, "sentry.trace.parent_span_id", k?.spanContext().spanId);
  const w = { ...e, attributes: p };
  o.emit("beforeCaptureLog", w);
  const x = c ? u(() => c(w)) : w;
  if (!x) {
    o.recordDroppedEvent("before_send", "log_item", 1);
    t && y.warn("beforeSendLog returned null, log will not be captured.");
    return;
  }
  const { level: A, message: E, attributes: T = {}, severityNumber: I } = x;
  const $ = {
    timestamp: Qt(),
    level: A,
    body: E,
    trace_id: l?.trace_id,
    severity_number: I ?? Vr[A],
    attributes: { ...zr(g), ...zr(T, true) },
  };
  s(o, $);
  o.emit("afterCaptureLog", x);
}
/**
 * Flushes the logs buffer to Sentry.
 *
 * @param client - A client.
 * @param maybeLogBuffer - A log buffer. Uses the log buffer for the given client if not provided.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function Qr(t, e) {
  const n = e ?? ti(t) ?? [];
  if (n.length === 0) return;
  const s = t.getOptions();
  const o = Kr(n, s._metadata, s.tunnel, t.getDsn());
  ei().set(t, []);
  t.emit("flushLogs");
  t.sendEnvelope(o);
}
/**
 * Returns the log buffer for a given client.
 *
 * Exported for testing purposes.
 *
 * @param client - The client to get the log buffer for.
 * @returns The log buffer for the given client.
 */ function ti(t) {
  return ei().get(t);
}
function ei() {
  return r("clientToLogBufferMap", () => new WeakMap());
}
/**
 * Creates a metric container envelope item for a list of metrics.
 *
 * @param items - The metrics to include in the envelope.
 * @returns The created metric container envelope item.
 */ function ni(t) {
  return [
    {
      type: "trace_metric",
      item_count: t.length,
      content_type: "application/vnd.sentry.items.trace-metric+json",
    },
    { items: t },
  ];
}
/**
 * Creates an envelope for a list of metrics.
 *
 * Metrics from multiple traces can be included in the same envelope.
 *
 * @param metrics - The metrics to include in the envelope.
 * @param metadata - The metadata to include in the envelope.
 * @param tunnel - The tunnel to include in the envelope.
 * @param dsn - The DSN to include in the envelope.
 * @returns The created envelope.
 */ function si(t, e, n, s) {
  const o = {};
  e?.sdk && (o.sdk = { name: e.sdk.name, version: e.sdk.version });
  !n || !s || (o.dsn = _n(s));
  return Es(o, [ni(t)]);
}
const oi = 1e3;
/**
 * Sets a metric attribute if the value exists and the attribute key is not already present.
 *
 * @param metricAttributes - The metric attributes object to modify.
 * @param key - The attribute key to set.
 * @param value - The value to set (only sets if truthy and key not present).
 * @param setEvenIfPresent - Whether to set the attribute if it is present. Defaults to true.
 */ function ri(t, e, n, s = true) {
  !n || (!s && e in t) || (t[e] = n);
}
/**
 * Captures a serialized metric event and adds it to the metric buffer for the given client.
 *
 * @param client - A client. Uses the current client if not provided.
 * @param serializedMetric - The serialized metric event to capture.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function ii(t, e) {
  const n = fi();
  const s = pi(t);
  if (s === void 0) n.set(t, [e]);
  else if (s.length >= oi) {
    li(t, s);
    n.set(t, [e]);
  } else n.set(t, [...s, e]);
}
function ai(t, e, n) {
  const { release: s, environment: o } = e.getOptions();
  const r = { ...t.attributes };
  ri(r, "user.id", n.id, false);
  ri(r, "user.email", n.email, false);
  ri(r, "user.name", n.username, false);
  ri(r, "sentry.release", s);
  ri(r, "sentry.environment", o);
  const { name: i, version: a } = e.getSdkMetadata()?.sdk ?? {};
  ri(r, "sentry.sdk.name", i);
  ri(r, "sentry.sdk.version", a);
  const c = e.getIntegrationByName("Replay");
  const u = c?.getReplayId(true);
  ri(r, "sentry.replay_id", u);
  u &&
    c?.getRecordingMode() === "buffer" &&
    ri(r, "sentry._internal.replay_is_buffering", true);
  return { ...t, attributes: r };
}
function ci(t, e, n, s) {
  const [, o] = Wr(e, n);
  const r = fe(n);
  const i = r ? r.spanContext().traceId : o?.trace_id;
  const a = r ? r.spanContext().spanId : void 0;
  return {
    timestamp: Qt(),
    trace_id: i ?? "",
    span_id: a,
    name: t.name,
    type: t.type,
    unit: t.unit,
    value: t.value,
    attributes: { ...zr(s), ...zr(t.attributes, "skip-undefined") },
  };
}
/**
 * Captures a metric event and sends it to Sentry.
 *
 * @param metric - The metric event to capture.
 * @param options - Options for capturing the metric.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function ui(e, n) {
  const s = n?.scope ?? we();
  const o = n?.captureSerializedMetric ?? ii;
  const r = s?.getClient() ?? Ie();
  if (!r) {
    t && y.warn("No client available to capture metric.");
    return;
  }
  const {
    _experiments: i,
    enableMetrics: a,
    beforeSendMetric: c,
  } = r.getOptions();
  const u = a ?? i?.enableMetrics ?? true;
  if (!u) {
    t && y.warn("metrics option not enabled, metric will not be captured.");
    return;
  }
  const { user: l, attributes: p } = Jo(xe(), s);
  const f = ai(e, r, l);
  r.emit("processMetric", f);
  const d = c || i?.beforeSendMetric;
  const m = d ? d(f) : f;
  if (!m) {
    t && y.log("`beforeSendMetric` returned `null`, will not send metric.");
    return;
  }
  const g = ci(m, r, s, p);
  t && y.log("[Metric]", g);
  o(r, g);
  r.emit("afterCaptureMetric", m);
}
/**
 * Flushes the metrics buffer to Sentry.
 *
 * @param client - A client.
 * @param maybeMetricBuffer - A metric buffer. Uses the metric buffer for the given client if not provided.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function li(t, e) {
  const n = e ?? pi(t) ?? [];
  if (n.length === 0) return;
  const s = t.getOptions();
  const o = si(n, s._metadata, s.tunnel, t.getDsn());
  fi().set(t, []);
  t.emit("flushMetrics");
  t.sendEnvelope(o);
}
/**
 * Returns the metric buffer for a given client.
 *
 * Exported for testing purposes.
 *
 * @param client - The client to get the metric buffer for.
 * @returns The metric buffer for the given client.
 */ function pi(t) {
  return fi().get(t);
}
function fi() {
  return r("clientToMetricBufferMap", () => new WeakMap());
}
/**
 * Calls `unref` on a timer, if the method is available on @param timer.
 *
 * `unref()` is used to allow processes to exit immediately, even if the timer
 * is still running and hasn't resolved yet.
 *
 * Use this in places where code can run on browser or server, since browsers
 * do not support `unref`.
 */ function di(t) {
  typeof t === "object" && typeof t.unref === "function" && t.unref();
  return t;
}
const mi = Symbol.for("SentryBufferFullError");
/**
 * Creates an new PromiseBuffer object with the specified limit
 * @param limit max number of promises that can be stored in the buffer
 */ function gi(t = 100) {
  const e = new Set();
  function n() {
    return e.size < t;
  }
  /**
   * Remove a promise from the queue.
   *
   * @param task Can be any PromiseLike<T>
   * @returns Removed promise.
   */ function s(t) {
    e.delete(t);
  }
  /**
   * Add a promise (representing an in-flight action) to the queue, and set it to remove itself on fulfillment.
   *
   * @param taskProducer A function producing any PromiseLike<T>; In previous versions this used to be `task:
   *        PromiseLike<T>`, but under that model, Promises were instantly created on the call-site and their executor
   *        functions therefore ran immediately. Thus, even if the buffer was full, the action still happened. By
   *        requiring the promise to be wrapped in a function, we can defer promise creation until after the buffer
   *        limit check.
   * @returns The original promise.
   */ function o(t) {
    if (!n()) return Oo(mi);
    const o = t();
    e.add(o);
    void o.then(
      () => s(o),
      () => s(o),
    );
    return o;
  }
  /**
   * Wait for all promises in the queue to resolve or for timeout to expire, whichever comes first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the queue is still non-empty. Passing `0` (or
   * not passing anything) will make the promise wait as long as it takes for the queue to drain before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if the queue is already empty or drains before the timeout, and
   * `false` otherwise
   */ function r(t) {
    if (!e.size) return $o(true);
    const n = Promise.allSettled(Array.from(e)).then(() => true);
    if (!t) return n;
    const s = [n, new Promise((e) => di(setTimeout(() => e(false), t)))];
    return Promise.race(s);
  }
  return {
    get $() {
      return Array.from(e);
    },
    add: o,
    drain: r,
  };
}
const hi = 6e4;
/**
 * Extracts Retry-After value from the request header or returns default value
 * @param header string representation of 'Retry-After' header
 * @param now current unix timestamp
 *
 */ function _i(t, e = $t()) {
  const n = parseInt(`${t}`, 10);
  if (!isNaN(n)) return n * 1e3;
  const s = Date.parse(`${t}`);
  return isNaN(s) ? hi : s - e;
}
function yi(t, e) {
  return t[e] || t.all || 0;
}
function bi(t, e, n = $t()) {
  return yi(t, e) > n;
}
function vi(t, { statusCode: e, headers: n }, s = $t()) {
  const o = { ...t };
  const r = n?.["x-sentry-rate-limits"];
  const i = n?.["retry-after"];
  if (r)
    for (const t of r.trim().split(",")) {
      const [e, n, , , r] = t.split(":", 5);
      const i = parseInt(e, 10);
      const a = (isNaN(i) ? 60 : i) * 1e3;
      if (n)
        for (const t of n.split(";"))
          (t === "metric_bucket" && r && !r.split(";").includes("custom")) ||
            (o[t] = s + a);
      else o.all = s + a;
    }
  else i ? (o.all = s + _i(i, s)) : e === 429 && (o.all = s + 6e4);
  return o;
}
const Si = 64;
/**
 * Creates an instance of a Sentry `Transport`
 *
 * @param options
 * @param makeRequest
 */ function ki(e, n, s = gi(e.bufferSize || Si)) {
  let o = {};
  const r = (t) => s.drain(t);
  function i(r) {
    const i = [];
    Is(r, (t, n) => {
      const s = Fs(n);
      bi(o, s) ? e.recordDroppedEvent("ratelimit_backoff", s) : i.push(t);
    });
    if (i.length === 0) return Promise.resolve({});
    const a = Es(r[0], i);
    const c = (n) => {
      $s(a, ["client_report"])
        ? t &&
          y.warn(
            `Dropping client report. Will not send outcomes (reason: ${n}).`,
          )
        : Is(a, (t, s) => {
            e.recordDroppedEvent(n, Fs(s));
          });
    };
    const u = () =>
      n({ body: Ns(a) }).then(
        (e) => {
          if (e.statusCode === 413) {
            t &&
              y.error(
                "Sentry responded with status code 413. Envelope was discarded due to exceeding size limits.",
              );
            c("send_error");
            return e;
          }
          t &&
            e.statusCode !== void 0 &&
            (e.statusCode < 200 || e.statusCode >= 300) &&
            y.warn(
              `Sentry responded with status code ${e.statusCode} to sent event.`,
            );
          o = vi(o, e);
          return e;
        },
        (e) => {
          c("network_error");
          t && y.error("Encountered error running transport request:", e);
          throw e;
        },
      );
    return s.add(u).then(
      (t) => t,
      (e) => {
        if (e === mi) {
          t && y.error("Skipped sending event because buffer is full.");
          c("queue_overflow");
          return Promise.resolve({});
        }
        throw e;
      },
    );
  }
  return { send: i, flush: r };
}
/**
 * Creates client report envelope
 * @param discarded_events An array of discard events
 * @param dsn A DSN that can be set on the header. Optional.
 */ function wi(t, e, n) {
  const s = [
    { type: "client_report" },
    { timestamp: n || Zt(), discarded_events: t },
  ];
  return Es(e ? { dsn: e } : {}, [s]);
}
function xi(t) {
  const e = [];
  t.message && e.push(t.message);
  try {
    const n = t.exception.values[t.exception.values.length - 1];
    if (n?.value) {
      e.push(n.value);
      n.type && e.push(`${n.type}: ${n.value}`);
    }
  } catch {}
  return e;
}
function Ai(t) {
  const {
    trace_id: e,
    parent_span_id: n,
    span_id: s,
    status: o,
    origin: r,
    data: i,
    op: a,
  } = t.contexts?.trace ?? {};
  return {
    data: i ?? {},
    description: t.transaction,
    op: a,
    parent_span_id: n,
    span_id: s ?? "",
    start_timestamp: t.start_timestamp ?? 0,
    status: o,
    timestamp: t.timestamp,
    trace_id: e ?? "",
    origin: r,
    profile_id: i?.[Le],
    exclusive_time: i?.[qe],
    measurements: t.measurements,
    is_segment: true,
  };
}
function Ei(t) {
  return {
    type: "transaction",
    timestamp: t.timestamp,
    start_timestamp: t.start_timestamp,
    transaction: t.description,
    contexts: {
      trace: {
        trace_id: t.trace_id,
        span_id: t.span_id,
        parent_span_id: t.parent_span_id,
        op: t.op,
        status: t.status,
        origin: t.origin,
        data: {
          ...t.data,
          ...(t.profile_id && { [Le]: t.profile_id }),
          ...(t.exclusive_time && { [qe]: t.exclusive_time }),
        },
      },
    },
    measurements: t.measurements,
  };
}
const Ti = "Not capturing exception because it's already been captured.";
const Ii = "Discarded session because of missing or non-string release";
const $i = Symbol.for("SentryInternalError");
const Oi = Symbol.for("SentryDoNotSendEventError");
const Ci = 5e3;
function Ni(t) {
  return { message: t, [$i]: true };
}
function ji(t) {
  return { message: t, [Oi]: true };
}
function Ri(t) {
  return !!t && typeof t === "object" && $i in t;
}
function Mi(t) {
  return !!t && typeof t === "object" && Oi in t;
}
function Pi(t, e, n, s, o) {
  let r = 0;
  let i;
  let a = false;
  t.on(n, () => {
    r = 0;
    clearTimeout(i);
    a = false;
  });
  t.on(e, (e) => {
    r += s(e);
    if (r >= 8e5) o(t);
    else if (!a) {
      a = true;
      i = di(
        setTimeout(() => {
          o(t);
        }, Ci),
      );
    }
  });
  t.on("flush", () => {
    o(t);
  });
}
class Client {
  /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */
  constructor(e) {
    this._options = e;
    this._integrations = {};
    this._numProcessing = 0;
    this._outcomes = {};
    this._hooks = {};
    this._eventProcessors = [];
    this._promiseBuffer = gi(e.transportOptions?.bufferSize ?? Si);
    e.dsn
      ? (this._dsn = wn(e.dsn))
      : t && y.warn("No DSN provided, client will not send events.");
    if (this._dsn) {
      const t = Cr(this._dsn, e.tunnel, e._metadata ? e._metadata.sdk : void 0);
      this._transport = e.transport({
        tunnel: this._options.tunnel,
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...e.transportOptions,
        url: t,
      });
    }
    this._options.enableLogs =
      this._options.enableLogs ?? this._options._experiments?.enableLogs;
    this._options.enableLogs &&
      Pi(this, "afterCaptureLog", "flushLogs", zi, Qr);
    const n =
      this._options.enableMetrics ??
      this._options._experiments?.enableMetrics ??
      true;
    n && Pi(this, "afterCaptureMetric", "flushMetrics", Ji, li);
  }
  captureException(e, n, s) {
    const o = Ft();
    if (Gt(e)) {
      t && y.log(Ti);
      return o;
    }
    const r = { event_id: o, ...n };
    this._process(
      () =>
        this.eventFromException(e, r)
          .then((t) => this._captureEvent(t, r, s))
          .then((t) => t),
      "error",
    );
    return r.event_id;
  }
  captureMessage(t, e, n, s) {
    const o = { event_id: Ft(), ...n };
    const r = Y(t) ? t : String(t);
    const i = X(t);
    const a = i
      ? this.eventFromMessage(r, e, o)
      : this.eventFromException(t, o);
    this._process(
      () => a.then((t) => this._captureEvent(t, o, s)),
      i ? "unknown" : "error",
    );
    return o.event_id;
  }
  captureEvent(e, n, s) {
    const o = Ft();
    if (n?.originalException && Gt(n.originalException)) {
      t && y.log(Ti);
      return o;
    }
    const r = { event_id: o, ...n };
    const i = e.sdkProcessingMetadata || {};
    const a = i.capturedSpanScope;
    const c = i.capturedSpanIsolationScope;
    const u = Di(e.type);
    this._process(() => this._captureEvent(e, r, a || s, c), u);
    return r.event_id;
  }
  captureSession(t) {
    this.sendSession(t);
    oe(t, { init: false });
  }
  /**
   * Create a cron monitor check in and send it to Sentry. This method is not available on all clients.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   * @param scope An optional scope containing event metadata.
   * @returns A string representing the id of the check in.
   */ getDsn() {
    return this._dsn;
  }
  getOptions() {
    return this._options;
  }
  getSdkMetadata() {
    return this._options._metadata;
  }
  getTransport() {
    return this._transport;
  }
  /**
   * Wait for all events to be sent or the timeout to expire, whichever comes first.
   *
   * @param timeout Maximum time in ms the client should wait for events to be flushed. Omitting this parameter will
   *   cause the client to wait until all events are sent before resolving the promise.
   * @returns A promise that will resolve with `true` if all events are sent before the timeout, or `false` if there are
   * still events in the queue when the timeout is reached.
   */
  async flush(t) {
    const e = this._transport;
    if (!e) return true;
    this.emit("flush");
    const n = await this._isClientDoneProcessing(t);
    const s = await e.flush(t);
    return n && s;
  }
  /**
   * Flush the event queue and set the client to `enabled = false`. See {@link Client.flush}.
   *
   * @param {number} timeout Maximum time in ms the client should wait before shutting down. Omitting this parameter will cause
   *   the client to wait until all events are sent before disabling itself.
   * @returns {Promise<boolean>} A promise which resolves to `true` if the flush completes successfully before the timeout, or `false` if
   * it doesn't.
   */
  async close(t) {
    Qr(this);
    const e = await this.flush(t);
    this.getOptions().enabled = false;
    this.emit("close");
    return e;
  }
  getEventProcessors() {
    return this._eventProcessors;
  }
  addEventProcessor(t) {
    this._eventProcessors.push(t);
  }
  init() {
    (this._isEnabled() ||
      this._options.integrations.some(({ name: t }) =>
        t.startsWith("Spotlight"),
      )) &&
      this._setupIntegrations();
  }
  /**
   * Gets an installed integration by its name.
   *
   * @returns {Integration|undefined} The installed integration or `undefined` if no integration with that `name` was installed.
   */ getIntegrationByName(t) {
    return this._integrations[t];
  }
  addIntegration(t) {
    const e = this._integrations[t.name];
    Fr(this, t, this._integrations);
    e || Dr(this, [t]);
  }
  sendEvent(t, e = {}) {
    this.emit("beforeSendEvent", t, e);
    let n = zs(t, this._dsn, this._options._metadata, this._options.tunnel);
    for (const t of e.attachments || []) n = Ts(n, Ps(t));
    this.sendEnvelope(n).then((e) => this.emit("afterSendEvent", t, e));
  }
  sendSession(e) {
    const { release: n, environment: s = us } = this._options;
    if ("aggregates" in e) {
      const o = e.attrs || {};
      if (!o.release && !n) {
        t && y.warn(Ii);
        return;
      }
      o.release = o.release || n;
      o.environment = o.environment || s;
      e.attrs = o;
    } else {
      if (!e.release && !n) {
        t && y.warn(Ii);
        return;
      }
      e.release = e.release || n;
      e.environment = e.environment || s;
    }
    this.emit("beforeSendSession", e);
    const o = Js(e, this._dsn, this._options._metadata, this._options.tunnel);
    this.sendEnvelope(o);
  }
  recordDroppedEvent(e, n, s = 1) {
    if (this._options.sendClientReports) {
      const o = `${e}:${n}`;
      t && y.log(`Recording outcome: "${o}"${s > 1 ? ` (${s} times)` : ""}`);
      this._outcomes[o] = (this._outcomes[o] || 0) + s;
    }
  }
  /* eslint-disable @typescript-eslint/unified-signatures */
  /**
   * Register a callback for whenever a span is started.
   * Receives the span as argument.
   * @returns {() => void} A function that, when executed, removes the registered callback.
   */ on(t, e) {
    const n = (this._hooks[t] = this._hooks[t] || new Set());
    const s = (...t) => e(...t);
    n.add(s);
    return () => {
      n.delete(s);
    };
  }
  emit(t, ...e) {
    const n = this._hooks[t];
    n && n.forEach((t) => t(...e));
  }
  async sendEnvelope(e) {
    this.emit("beforeEnvelope", e);
    if (this._isEnabled() && this._transport)
      try {
        return await this._transport.send(e);
      } catch (e) {
        t && y.error("Error while sending envelope:", e);
        return {};
      }
    t && y.error("Transport disabled");
    return {};
  }
  /* eslint-enable @typescript-eslint/unified-signatures */ _setupIntegrations() {
    const { integrations: t } = this._options;
    this._integrations = Pr(this, t);
    Dr(this, t);
  }
  _updateSessionFromEvent(t, e) {
    let n = e.level === "fatal";
    let s = false;
    const o = e.exception?.values;
    if (o) {
      s = true;
      n = false;
      for (const t of o)
        if (t.mechanism?.handled === false) {
          n = true;
          break;
        }
    }
    const r = t.status === "ok";
    const i = (r && t.errors === 0) || (r && n);
    if (i) {
      oe(t, {
        ...(n && { status: "crashed" }),
        errors: t.errors || Number(s || n),
      });
      this.captureSession(t);
    }
  }
  /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */ async _isClientDoneProcessing(t) {
    let e = 0;
    while (!t || e < t) {
      await new Promise((t) => setTimeout(t, 1));
      if (!this._numProcessing) return true;
      e++;
    }
    return false;
  }
  _isEnabled() {
    return this.getOptions().enabled !== false && this._transport !== void 0;
  }
  /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param currentScope A scope containing event metadata.
   * @returns A new event with more information.
   */ _prepareEvent(t, e, n, s) {
    const o = this.getOptions();
    const r = Object.keys(this._integrations);
    !e.integrations && r?.length && (e.integrations = r);
    this.emit("preprocessEvent", t, e);
    t.type || s.setLastEventId(t.event_id || e.event_id);
    return Ko(o, t, e, n, this, s).then((t) => {
      if (t === null) return t;
      this.emit("postprocessEvent", t, e);
      t.contexts = { trace: $e(n), ...t.contexts };
      const s = ms(this, n);
      t.sdkProcessingMetadata = {
        dynamicSamplingContext: s,
        ...t.sdkProcessingMetadata,
      };
      return t;
    });
  }
  /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */ _captureEvent(e, n = {}, s = we(), o = xe()) {
    t && qi(e) && y.log(`Captured error event \`${xi(e)[0] || "<unknown>"}\``);
    return this._processEvent(e, n, s, o).then(
      (t) => t.event_id,
      (e) => {
        t && (Mi(e) ? y.log(e.message) : Ri(e) ? y.warn(e.message) : y.warn(e));
      },
    );
  }
  /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param currentScope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */ _processEvent(t, e, n, s) {
    const o = this.getOptions();
    const { sampleRate: r } = o;
    const i = Ui(t);
    const a = qi(t);
    const c = t.type || "error";
    const u = `before send for type \`${c}\``;
    const l = typeof r === "undefined" ? void 0 : xn(r);
    if (a && typeof l === "number" && It() > l) {
      this.recordDroppedEvent("sample_rate", "error");
      return Oo(
        ji(
          `Discarding event because it's not included in the random sample (sampling rate = ${r})`,
        ),
      );
    }
    const p = Di(t.type);
    return this._prepareEvent(t, e, n, s)
      .then((t) => {
        if (t === null) {
          this.recordDroppedEvent("event_processor", p);
          throw ji("An event processor returned `null`, will not send event.");
        }
        const n = e.data && e.data.__sentry__ === true;
        if (n) return t;
        const s = Li(this, o, t, e);
        return Fi(s, u);
      })
      .then((o) => {
        if (o === null) {
          this.recordDroppedEvent("before_send", p);
          if (i) {
            const e = t.spans || [];
            const n = 1 + e.length;
            this.recordDroppedEvent("before_send", "span", n);
          }
          throw ji(`${u} returned \`null\`, will not send event.`);
        }
        const r = n.getSession() || s.getSession();
        a && r && this._updateSessionFromEvent(r, o);
        if (i) {
          const t = o.sdkProcessingMetadata?.spanCountBeforeProcessing || 0;
          const e = o.spans ? o.spans.length : 0;
          const n = t - e;
          n > 0 && this.recordDroppedEvent("before_send", "span", n);
        }
        const c = o.transaction_info;
        if (i && c && o.transaction !== t.transaction) {
          const t = "custom";
          o.transaction_info = { ...c, source: t };
        }
        this.sendEvent(o, e);
        return o;
      })
      .then(null, (t) => {
        if (Mi(t) || Ri(t)) throw t;
        this.captureException(t, {
          mechanism: { handled: false, type: "internal" },
          data: { __sentry__: true },
          originalException: t,
        });
        throw Ni(
          `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: ${t}`,
        );
      });
  }
  _process(t, e) {
    this._numProcessing++;
    void this._promiseBuffer.add(t).then(
      (t) => {
        this._numProcessing--;
        return t;
      },
      (t) => {
        this._numProcessing--;
        t === mi && this.recordDroppedEvent("queue_overflow", e);
        return t;
      },
    );
  }
  _clearOutcomes() {
    const t = this._outcomes;
    this._outcomes = {};
    return Object.entries(t).map(([t, e]) => {
      const [n, s] = t.split(":");
      return { reason: n, category: s, quantity: e };
    });
  }
  _flushOutcomes() {
    t && y.log("Flushing outcomes...");
    const e = this._clearOutcomes();
    if (e.length === 0) {
      t && y.log("No outcomes to send");
      return;
    }
    if (!this._dsn) {
      t && y.log("No dsn provided, will not send outcomes");
      return;
    }
    t && y.log("Sending outcomes:", e);
    const n = wi(e, this._options.tunnel && _n(this._dsn));
    this.sendEnvelope(n);
  }
}
function Di(t) {
  return t === "replay_event" ? "replay" : t || "error";
}
function Fi(t, e) {
  const n = `${e} must return \`null\` or a valid event.`;
  if (st(t))
    return t.then(
      (t) => {
        if (!Q(t) && t !== null) throw Ni(n);
        return t;
      },
      (t) => {
        throw Ni(`${e} rejected with ${t}`);
      },
    );
  if (!Q(t) && t !== null) throw Ni(n);
  return t;
}
function Li(t, e, n, s) {
  const {
    beforeSend: o,
    beforeSendTransaction: r,
    beforeSendSpan: i,
    ignoreSpans: a,
  } = e;
  let c = n;
  if (qi(c) && o) return o(c, s);
  if (Ui(c)) {
    if (i || a) {
      const e = Ai(c);
      if (a?.length && is(e, a)) return null;
      if (i) {
        const t = i(e);
        t ? (c = ae(n, Ei(t))) : ts();
      }
      if (c.spans) {
        const e = [];
        const n = c.spans;
        for (const t of n)
          if (a?.length && is(t, a)) as(n, t);
          else if (i) {
            const n = i(t);
            if (n) e.push(n);
            else {
              ts();
              e.push(t);
            }
          } else e.push(t);
        const s = c.spans.length - e.length;
        s && t.recordDroppedEvent("before_send", "span", s);
        c.spans = e;
      }
    }
    if (r) {
      if (c.spans) {
        const t = c.spans.length;
        c.sdkProcessingMetadata = {
          ...n.sdkProcessingMetadata,
          spanCountBeforeProcessing: t,
        };
      }
      return r(c, s);
    }
  }
  return c;
}
function qi(t) {
  return t.type === void 0;
}
function Ui(t) {
  return t.type === "transaction";
}
/**
 * Estimate the size of a metric in bytes.
 *
 * @param metric - The metric to estimate the size of.
 * @returns The estimated size of the metric in bytes.
 */ function Ji(t) {
  let e = 0;
  t.name && (e += t.name.length * 2);
  e += 8;
  return e + Bi(t.attributes);
}
/**
 * Estimate the size of a log in bytes.
 *
 * @param log - The log to estimate the size of.
 * @returns The estimated size of the log in bytes.
 */ function zi(t) {
  let e = 0;
  t.message && (e += t.message.length * 2);
  return e + Bi(t.attributes);
}
/**
 * Estimate the size of attributes in bytes.
 *
 * @param attributes - The attributes object to estimate the size of.
 * @returns The estimated size of the attributes in bytes.
 */ function Bi(t) {
  if (!t) return 0;
  let e = 0;
  Object.values(t).forEach((t) => {
    Array.isArray(t)
      ? (e += t.length * Wi(t[0]))
      : X(t)
        ? (e += Wi(t))
        : (e += 100);
  });
  return e;
}
function Wi(t) {
  return typeof t === "string"
    ? t.length * 2
    : typeof t === "number"
      ? 8
      : typeof t === "boolean"
        ? 4
        : 0;
}
function Vi(t, e, n, s, o) {
  const r = { sent_at: new Date().toISOString() };
  n?.sdk && (r.sdk = { name: n.sdk.name, version: n.sdk.version });
  !s || !o || (r.dsn = _n(o));
  e && (r.trace = e);
  const i = Gi(t);
  return Es(r, [i]);
}
function Gi(t) {
  const e = { type: "check_in" };
  return [e, t];
}
function Ki(t) {
  const e = t._metadata?.sdk;
  const n = e?.name && e?.version ? `${e?.name}/${e?.version}` : void 0;
  t.transportOptions = {
    ...t.transportOptions,
    headers: { ...(n && { "user-agent": n }), ...t.transportOptions?.headers },
  };
}
function Hi(t, e) {
  return t(e.stack || "", 1);
}
function Zi(t) {
  return (
    W(t) &&
    "__sentry_fetch_url_host__" in t &&
    typeof t.__sentry_fetch_url_host__ === "string"
  );
}
function Yi(t) {
  return Zi(t) ? `${t.message} (${t.__sentry_fetch_url_host__})` : t.message;
}
function Xi(t, e) {
  const n = { type: e.name || e.constructor.name, value: Yi(e) };
  const s = Hi(t, e);
  s.length && (n.stacktrace = { frames: s });
  return n;
}
function Qi(t) {
  for (const e in t)
    if (Object.prototype.hasOwnProperty.call(t, e)) {
      const n = t[e];
      if (n instanceof Error) return n;
    }
}
function ta(t) {
  if ("name" in t && typeof t.name === "string") {
    let e = `'${t.name}' captured as exception`;
    "message" in t &&
      typeof t.message === "string" &&
      (e += ` with message '${t.message}'`);
    return e;
  }
  if ("message" in t && typeof t.message === "string") return t.message;
  const e = St(t);
  if (G(t))
    return `Event \`ErrorEvent\` captured as exception with message \`${t.message}\``;
  const n = ea(t);
  return `${n && n !== "Object" ? `'${n}'` : "Object"} captured as exception with keys: ${e}`;
}
function ea(t) {
  try {
    const e = Object.getPrototypeOf(t);
    return e ? e.constructor.name : void 0;
  } catch {}
}
function na(t, e, n, s) {
  if (W(n)) return [n, void 0];
  e.synthetic = true;
  if (Q(n)) {
    const e = t?.getOptions().normalizeDepth;
    const o = { __serialized__: ys(n, e) };
    const r = Qi(n);
    if (r) return [r, o];
    const i = ta(n);
    const a = s?.syntheticException || new Error(i);
    a.message = i;
    return [a, o];
  }
  const o = s?.syntheticException || new Error(n);
  o.message = `${n}`;
  return [o, void 0];
}
function sa(t, e, n, s) {
  const o = s?.data && s.data.mechanism;
  const r = o || { handled: true, type: "generic" };
  const [i, a] = na(t, r, n, s);
  const c = { exception: { values: [Xi(e, i)] } };
  a && (c.extra = a);
  Ut(c, void 0, void 0);
  Jt(c, r);
  return { ...c, event_id: s?.event_id };
}
function oa(t, e, n = "info", s, o) {
  const r = { event_id: s?.event_id, level: n };
  if (o && s?.syntheticException) {
    const n = Hi(t, s.syntheticException);
    if (n.length) {
      r.exception = { values: [{ value: e, stacktrace: { frames: n } }] };
      Jt(r, { synthetic: true });
    }
  }
  if (Y(e)) {
    const { __sentry_template_string__: t, __sentry_template_values__: n } = e;
    r.logentry = { message: t, params: n };
    return r;
  }
  r.message = e;
  return r;
}
class ServerRuntimeClient extends Client {
  /**
   * Creates a new Edge SDK instance.
   * @param options Configuration options for this SDK.
   */
  constructor(t) {
    ss();
    Ki(t);
    super(t);
    this._setUpMetricsProcessing();
  }
  eventFromException(t, e) {
    const n = sa(this, this._options.stackParser, t, e);
    n.level = "error";
    return $o(n);
  }
  eventFromMessage(t, e = "info", n) {
    return $o(
      oa(this._options.stackParser, t, e, n, this._options.attachStacktrace),
    );
  }
  captureException(t, e, n) {
    ra(e);
    return super.captureException(t, e, n);
  }
  captureEvent(t, e, n) {
    const s = !t.type && t.exception?.values && t.exception.values.length > 0;
    s && ra(e);
    return super.captureEvent(t, e, n);
  }
  /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */ captureCheckIn(e, n, s) {
    const o = "checkInId" in e && e.checkInId ? e.checkInId : Ft();
    if (!this._isEnabled()) {
      t && y.warn("SDK not enabled, will not capture check-in.");
      return o;
    }
    const r = this.getOptions();
    const { release: i, environment: a, tunnel: c } = r;
    const u = {
      check_in_id: o,
      monitor_slug: e.monitorSlug,
      status: e.status,
      release: i,
      environment: a,
    };
    "duration" in e && (u.duration = e.duration);
    n &&
      (u.monitor_config = {
        schedule: n.schedule,
        checkin_margin: n.checkinMargin,
        max_runtime: n.maxRuntime,
        timezone: n.timezone,
        failure_issue_threshold: n.failureIssueThreshold,
        recovery_threshold: n.recoveryThreshold,
      });
    const [l, p] = Wr(this, s);
    p && (u.contexts = { trace: p });
    const f = Vi(u, l, this.getSdkMetadata(), c, this.getDsn());
    t && y.log("Sending checkin:", e.monitorSlug, e.status);
    this.sendEnvelope(f);
    return o;
  }
  _prepareEvent(t, e, n, s) {
    this._options.platform &&
      (t.platform = t.platform || this._options.platform);
    this._options.runtime &&
      (t.contexts = {
        ...t.contexts,
        runtime: t.contexts?.runtime || this._options.runtime,
      });
    this._options.serverName &&
      (t.server_name = t.server_name || this._options.serverName);
    return super._prepareEvent(t, e, n, s);
  }
  _setUpMetricsProcessing() {
    this.on("processMetric", (t) => {
      this._options.serverName &&
        (t.attributes = {
          "server.address": this._options.serverName,
          ...t.attributes,
        });
    });
  }
}
function ra(t) {
  const e = xe().getScopeData().sdkProcessingMetadata.requestSession;
  if (e) {
    const n = t?.mechanism?.handled ?? true;
    n && e.status !== "crashed"
      ? (e.status = "errored")
      : n || (e.status = "crashed");
  }
}
/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */ function ia(e, n) {
  n.debug === true &&
    (t
      ? y.enable()
      : u(() => {
          console.warn(
            "[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.",
          );
        }));
  const s = we();
  s.update(n.initialScope);
  const o = new e(n);
  aa(o);
  o.init();
  return o;
}
function aa(t) {
  we().setClient(t);
}
const ca = 100;
const ua = 5e3;
const la = 36e5;
/**
 * Wraps a transport and stores and retries events when they fail to send.
 *
 * @param createTransport The transport to wrap.
 */ function pa(e) {
  function n(...e) {
    t && y.log("[Offline]:", ...e);
  }
  return (t) => {
    const s = e(t);
    if (!t.createStore)
      throw new Error("No `createStore` function was provided");
    const o = t.createStore(t);
    let r = ua;
    let i;
    function a(e, n, s) {
      return (
        !$s(e, ["client_report"]) && (!t.shouldStore || t.shouldStore(e, n, s))
      );
    }
    function c(t) {
      i && clearTimeout(i);
      i = di(
        setTimeout(async () => {
          i = void 0;
          const t = await o.shift();
          if (t) {
            n("Attempting to send previously queued event");
            t[0].sent_at = new Date().toISOString();
            void l(t, true).catch((t) => {
              n("Failed to retry sending", t);
            });
          }
        }, t),
      );
    }
    function u() {
      if (!i) {
        c(r);
        r = Math.min(r * 2, la);
      }
    }
    async function l(e, i = false) {
      if (!i && $s(e, ["replay_event", "replay_recording"])) {
        await o.push(e);
        c(ca);
        return {};
      }
      try {
        if (t.shouldSend && (await t.shouldSend(e)) === false)
          throw new Error(
            "Envelope not sent because `shouldSend` callback returned false",
          );
        const n = await s.send(e);
        let o = ca;
        if (n)
          if (n.headers?.["retry-after"]) o = _i(n.headers["retry-after"]);
          else if (n.headers?.["x-sentry-rate-limits"]) o = 6e4;
          else if ((n.statusCode || 0) >= 400) return n;
        c(o);
        r = ua;
        return n;
      } catch (t) {
        if (await a(e, t, r)) {
          i ? await o.unshift(e) : await o.push(e);
          u();
          n("Error sending. Event queued.", t);
          return {};
        }
        throw t;
      }
    }
    t.flushAtStartup && u();
    return {
      send: l,
      flush: (t) => {
        if (t === void 0) {
          r = ua;
          c(ca);
        }
        return s.flush(t);
      },
    };
  };
}
const fa = "MULTIPLEXED_TRANSPORT_EXTRA_KEY";
function da(t, e) {
  let n;
  Is(t, (t, s) => {
    e.includes(s) && (n = Array.isArray(t) ? t[1] : void 0);
    return !!n;
  });
  return n;
}
function ma(t, e) {
  return (n) => {
    const s = t(n);
    return {
      ...s,
      send: async (t) => {
        const n = da(t, ["event", "transaction", "profile", "replay_event"]);
        n && (n.release = e);
        return s.send(t);
      },
    };
  };
}
function ga(t, e) {
  return Es(e ? { ...t[0], dsn: e } : t[0], t[1]);
}
function ha(t, e) {
  return (n) => {
    const s = t(n);
    const o = new Map();
    const r =
      e ||
      ((t) => {
        const e = t.getEvent();
        return e?.extra?.[fa] && Array.isArray(e.extra[fa]) ? e.extra[fa] : [];
      });
    function i(e, s) {
      const r = s ? `${e}:${s}` : e;
      let i = o.get(r);
      if (!i) {
        const a = yn(e);
        if (!a) return;
        const c = Cr(a, n.tunnel);
        i = s ? ma(t, s)({ ...n, url: c }) : t({ ...n, url: c });
        o.set(r, i);
      }
      return [e, i];
    }
    async function a(t) {
      function e(e) {
        const n = e?.length ? e : ["event"];
        return da(t, n);
      }
      const n = r({ envelope: t, getEvent: e })
        .map((t) =>
          typeof t === "string" ? i(t, void 0) : i(t.dsn, t.release),
        )
        .filter((t) => !!t);
      const o = n.length ? n : [["", s]];
      const a = await Promise.all(o.map(([e, n]) => n.send(ga(t, e))));
      return a[0];
    }
    async function c(t) {
      const e = [...o.values(), s];
      const n = await Promise.all(e.map((e) => e.flush(t)));
      return n.every((t) => t);
    }
    return { send: a, flush: c };
  };
}
const _a = new Set();
/**
 * Mark AI provider modules to skip instrumentation wrapping.
 *
 * This prevents duplicate spans when a higher-level integration (like LangChain)
 * already instruments AI providers at a higher abstraction level.
 *
 * @internal
 * @param modules - Array of npm module names to skip (e.g., '@anthropic-ai/sdk', 'openai')
 *
 * @example
 * ```typescript
 * // In LangChain integration
 * _INTERNAL_skipAiProviderWrapping(['@anthropic-ai/sdk', 'openai', '@google/generative-ai']);
 * ```
 */ function ya(e) {
  e.forEach((e) => {
    _a.add(e);
    t && y.log(`AI provider "${e}" wrapping will be skipped`);
  });
}
/**
 * Check if an AI provider module should skip instrumentation wrapping.
 *
 * @internal
 * @param module - The npm module name (e.g., '@anthropic-ai/sdk', 'openai')
 * @returns true if wrapping should be skipped
 *
 * @example
 * ```typescript
 * // In AI provider instrumentation
 * if (_INTERNAL_shouldSkipAiProviderWrapping('@anthropic-ai/sdk')) {
 *   return Reflect.construct(Original, args); // Don't instrument
 * }
 * ```
 */ function ba(t) {
  return _a.has(t);
}
function va() {
  _a.clear();
  t && y.log("Cleared AI provider skip registrations");
}
const Sa = new Set(["false", "f", "n", "no", "off", "0"]);
const ka = new Set(["true", "t", "y", "yes", "on", "1"]);
/**
 * A helper function which casts an ENV variable value to `true` or `false` using the constants defined above.
 * In strict mode, it may return `null` if the value doesn't match any of the predefined values.
 *
 * @param value The value of the env variable
 * @param options -- Only has `strict` key for now, which requires a strict match for `true` in TRUTHY_ENV_VALUES
 * @returns true/false if the lowercase value matches the predefined values above. If not, null in strict mode,
 *          and Boolean(value) in loose mode.
 */ function wa(t, e) {
  const n = String(t).toLowerCase();
  return !Sa.has(n) && (!!ka.has(n) || (e?.strict ? null : Boolean(t)));
}
const xa = "thismessage:/";
/**
 * Checks if the URL object is relative
 *
 * @param url - The URL object to check
 * @returns True if the URL object is relative, false otherwise
 */ function Aa(t) {
  return "isRelative" in t;
}
/**
 * Parses string to a URL object
 *
 * @param url - The URL to parse
 * @returns The parsed URL object or undefined if the URL is invalid
 */ function Ea(t, e) {
  const n = t.indexOf("://") <= 0 && t.indexOf("//") !== 0;
  const s = e ?? (n ? xa : void 0);
  try {
    if ("canParse" in URL && !URL.canParse(t, s)) return;
    const e = new URL(t, s);
    return n
      ? { isRelative: n, pathname: e.pathname, search: e.search, hash: e.hash }
      : e;
  } catch {}
}
function Ta(t) {
  if (Aa(t)) return t.pathname;
  const e = new URL(t);
  e.search = "";
  e.hash = "";
  ["80", "443"].includes(e.port) && (e.port = "");
  e.password && (e.password = "%filtered%");
  e.username && (e.username = "%filtered%");
  return e.toString();
}
function Ia(t, e, n, s) {
  const o = n?.method?.toUpperCase() ?? "GET";
  const r = s || (t ? (e === "client" ? Ta(t) : t.pathname) : "/");
  return `${o} ${r}`;
}
/**
 * Takes a parsed URL object and returns a set of attributes for the span
 * that represents the HTTP request for that url. This is used for both server
 * and client http spans.
 *
 * Follows https://opentelemetry.io/docs/specs/semconv/http/.
 *
 * @param urlObject - see {@link parseStringToURLObject}
 * @param kind - The type of HTTP operation (server or client)
 * @param spanOrigin - The origin of the span
 * @param request - The request object, see {@link PartialRequest}
 * @param routeName - The name of the route, must be low cardinality
 * @returns The span name and attributes for the HTTP operation
 */ function $a(t, e, n, s, o) {
  const r = { [Re]: n, [Oe]: "url" };
  if (o) {
    r[e === "server" ? "http.route" : "url.template"] = o;
    r[Oe] = "route";
  }
  s?.method && (r[Be] = s.method.toUpperCase());
  if (t) {
    t.search && (r["url.query"] = t.search);
    t.hash && (r["url.fragment"] = t.hash);
    if (t.pathname) {
      r["url.path"] = t.pathname;
      t.pathname === "/" && (r[Oe] = "route");
    }
    if (!Aa(t)) {
      r[We] = t.href;
      t.port && (r["url.port"] = t.port);
      t.protocol && (r["url.scheme"] = t.protocol);
      t.hostname &&
        (r[e === "server" ? "server.address" : "url.domain"] = t.hostname);
    }
  }
  return [Ia(t, e, s, o), r];
}
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */ function Oa(t) {
  if (!t) return {};
  const e = t.match(
    /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/,
  );
  if (!e) return {};
  const n = e[6] || "";
  const s = e[8] || "";
  return {
    host: e[4],
    path: e[5],
    protocol: e[2],
    search: n,
    hash: s,
    relative: e[5] + n + s,
  };
}
/**
 * Strip the query string and fragment off of a given URL or path (if present)
 *
 * @param urlPath Full URL or path, including possible query string and/or fragment
 * @returns URL or path without query string or fragment
 */ function Ca(t) {
  return t.split(/[?#]/, 1)[0];
}
function Na(t) {
  const { protocol: e, host: n, path: s } = t;
  const o =
    n
      ?.replace(/^.*@/, "[filtered]:[filtered]@")
      .replace(/(:80)$/, "")
      .replace(/(:443)$/, "") || "";
  return `${e ? `${e}://` : ""}${o}${s}`;
}
/**
 * Strips the content from a data URL, returning a placeholder with the MIME type.
 *
 * Data URLs can be very long (e.g. base64 encoded scripts for Web Workers),
 * with little valuable information, often leading to envelopes getting dropped due
 * to size limit violations. Therefore, we strip data URLs and replace them with a
 * placeholder.
 *
 * @param url - The URL to process
 * @param includeDataPrefix - If true, includes the first 10 characters of the data stream
 *                            for debugging (e.g., to identify magic bytes like WASM's AGFzbQ).
 *                            Defaults to true.
 * @returns For data URLs, returns a short format like `data:text/javascript;base64,SGVsbG8gV2... [truncated]`.
 *          For non-data URLs, returns the original URL unchanged.
 */ function ja(t, e = true) {
  if (t.startsWith("data:")) {
    const n = t.match(/^data:([^;,]+)/);
    const s = n ? n[1] : "text/plain";
    const o = t.includes(";base64,");
    const r = t.indexOf(",");
    let i = "";
    if (e && r !== -1) {
      const e = t.slice(r + 1);
      i = e.length > 10 ? `${e.slice(0, 10)}... [truncated]` : e;
    }
    return `data:${s}${o ? ",base64" : ""}${i ? `,${i}` : ""}`;
  }
  return t;
}
/**
 * Checks whether given url points to Sentry server
 *
 * @param url url to verify
 */ function Ra(t, e) {
  const n = e?.getDsn();
  const s = e?.getOptions().tunnel;
  return Pa(t, n) || Ma(t, s);
}
function Ma(t, e) {
  return !!e && Da(t) === Da(e);
}
function Pa(t, e) {
  const n = Ea(t);
  return (
    !(!n || Aa(n)) &&
    !!e &&
    n.host.includes(e.host) &&
    /(^|&|\?)sentry_key=/.test(n.search)
  );
}
function Da(t) {
  return t[t.length - 1] === "/" ? t.slice(0, -1) : t;
}
/**
 * Tagged template function which returns parameterized representation of the message
 * For example: parameterize`This is a log statement with ${x} and ${y} params`, would return:
 * "__sentry_template_string__": 'This is a log statement with %s and %s params',
 * "__sentry_template_values__": ['first', 'second']
 *
 * @param strings An array of string values splitted between expressions
 * @param values Expressions extracted from template string
 *
 * @returns A `ParameterizedString` object that can be passed into `captureMessage` or Sentry.logger.X methods.
 */ function Fa(t, ...e) {
  const n = new String(String.raw(t, ...e));
  n.__sentry_template_string__ = t
    .join("\0")
    .replace(/%/g, "%%")
    .replace(/\0/g, "%s");
  n.__sentry_template_values__ = e;
  return n;
}
/**
 * Tagged template function which returns parameterized representation of the message.
 *
 * @param strings An array of string values splitted between expressions
 * @param values Expressions extracted from template string
 * @returns A `ParameterizedString` object that can be passed into `captureMessage` or Sentry.logger.X methods.
 */ const La = Fa;
/**
 * Core Sentry tunnel handler - framework agnostic.
 *
 * Validates the envelope DSN against allowed DSNs, then forwards the
 * envelope to the Sentry ingest endpoint.
 *
 * @returns A `Response` — either the upstream Sentry response on success, or an error response.
 */ async function qa(t) {
  const { request: e, allowedDsns: n } = t;
  if (n.length === 0)
    return new Response("Tunnel not configured", { status: 500 });
  const s = new Uint8Array(await e.arrayBuffer());
  let o;
  try {
    [o] = Rs(s);
  } catch {
    return new Response("Invalid envelope", { status: 400 });
  }
  if (!o)
    return new Response("Invalid envelope: missing header", { status: 400 });
  const r = o.dsn;
  if (!r) return new Response("Invalid envelope: missing DSN", { status: 400 });
  const i = n.some((t) => t === r);
  if (!i) {
    y.warn(`Sentry tunnel: rejected request with unauthorized DSN (${r})`);
    return new Response("DSN not allowed", { status: 403 });
  }
  const a = wn(r);
  if (!a) {
    y.warn(`Could not extract DSN Components from: ${r}`);
    return new Response("Invalid DSN", { status: 403 });
  }
  const c = Cr(a);
  try {
    return await fetch(c, {
      method: "POST",
      headers: { "Content-Type": "application/x-sentry-envelope" },
      body: s,
    });
  } catch (t) {
    y.error("Sentry tunnel: failed to forward envelope", t);
    return new Response("Failed to forward envelope to Sentry", {
      status: 500,
    });
  }
}
/**
 * @internal
 * @deprecated -- set ip inferral via via SDK metadata options on client instead.
 */ function Ua(t) {
  t.user?.ip_address === void 0 &&
    (t.user = { ...t.user, ip_address: "{{auto}}" });
}
function Ja(t) {
  "aggregates" in t
    ? t.attrs?.ip_address === void 0 &&
      (t.attrs = { ...t.attrs, ip_address: "{{auto}}" })
    : t.ipAddress === void 0 && (t.ipAddress = "{{auto}}");
}
/**
 * A builder for the SDK metadata in the options for the SDK initialization.
 *
 * Note: This function is identical to `buildMetadata` in Remix and NextJS and SvelteKit.
 * We don't extract it for bundle size reasons.
 * @see https://github.com/getsentry/sentry-javascript/pull/7404
 * @see https://github.com/getsentry/sentry-javascript/pull/4196
 *
 * If you make changes to this function consider updating the others as well.
 *
 * @param options SDK options object that gets mutated
 * @param names list of package names
 */ function za(t, e, s = [e], o = "npm") {
  const r = ((t._metadata = t._metadata || {}).sdk = t._metadata.sdk || {});
  if (!r.name) {
    r.name = `sentry.javascript.${e}`;
    r.packages = s.map((t) => ({ name: `${o}:@sentry/${t}`, version: n }));
    r.version = n;
  }
}
/**
 * Extracts trace propagation data from the current span or from the client's scope (via transaction or propagation
 * context) and serializes it to `sentry-trace` and `baggage` values. These values can be used to propagate
 * a trace via our tracing Http headers or Html `<meta>` tags.
 *
 * This function also applies some validation to the generated sentry-trace and baggage values to ensure that
 * only valid strings are returned.
 *
 * If (@param options.propagateTraceparent) is `true`, the function will also generate a `traceparent` value,
 * following the W3C traceparent header format.
 *
 * @returns an object with the tracing data values. The object keys are the name of the tracing key to be used as header
 * or meta tag name.
 */ function Ba(t = {}) {
  const e = t.client || Ie();
  if (!Sr() || !e) return {};
  const n = s();
  const o = ke(n);
  if (o.getTraceData) return o.getTraceData(t);
  const r = t.scope || we();
  const i = t.span || Qn();
  const a = i ? Dn(i) : Wa(r);
  const c = i ? gs(i) : ms(e, r);
  const u = ln(c);
  const l = An.test(a);
  if (!l) {
    y.warn("Invalid sentry-trace data. Cannot generate trace data");
    return {};
  }
  const p = { "sentry-trace": a, baggage: u };
  t.propagateTraceparent && (p.traceparent = i ? Fn(i) : Va(r));
  return p;
}
function Wa(t) {
  const {
    traceId: e,
    sampled: n,
    propagationSpanId: s,
  } = t.getPropagationContext();
  return In(e, s, n);
}
function Va(t) {
  const {
    traceId: e,
    sampled: n,
    propagationSpanId: s,
  } = t.getPropagationContext();
  return $n(e, s, n);
}
const Ga =
  "[Tracing] Not injecting trace data for url because it does not match tracePropagationTargets:";
function Ka(e, n, s) {
  if (typeof e !== "string" || !n) return true;
  const o = s?.get(e);
  if (o !== void 0) {
    t && !o && y.log(Ga, e);
    return o;
  }
  const r = Rt(e, n);
  s?.set(e, r);
  t && !r && y.log(Ga, e);
  return r;
}
function Ha(t) {
  return Object.entries(t || Ba())
    .map(([t, e]) => `<meta name="${t}" content="${e}"/>`)
    .join("\n");
}
/**
 * Heavily simplified debounce function based on lodash.debounce.
 *
 * This function takes a callback function (@param fun) and delays its invocation
 * by @param wait milliseconds. Optionally, a maxWait can be specified in @param options,
 * which ensures that the callback is invoked at least once after the specified max. wait time.
 *
 * @param func the function whose invocation is to be debounced
 * @param wait the minimum time until the function is invoked after it was called once
 * @param options the options object, which can contain the `maxWait` property
 *
 * @returns the debounced version of the function, which needs to be called at least once to start the
 *          debouncing process. Subsequent calls will reset the debouncing timer and, in case @paramfunc
 *          was already invoked in the meantime, return @param func's return value.
 *          The debounced function has two additional properties:
 *          - `flush`: Invokes the debounced function immediately and returns its return value
 *          - `cancel`: Cancels the debouncing process and resets the debouncing timer
 */ function Za(t, e, n) {
  let s;
  let o;
  let r;
  const i = n?.maxWait ? Math.max(n.maxWait, e) : 0;
  const a = n?.setTimeoutImpl || setTimeout;
  function c() {
    u();
    s = t();
    return s;
  }
  function u() {
    o !== void 0 && clearTimeout(o);
    r !== void 0 && clearTimeout(r);
    o = r = void 0;
  }
  function l() {
    return o !== void 0 || r !== void 0 ? c() : s;
  }
  function p() {
    o && clearTimeout(o);
    o = a(c, e);
    i && r === void 0 && (r = a(c, i));
    return s;
  }
  p.cancel = u;
  p.flush = l;
  return p;
}
function Ya(t) {
  const e = {};
  try {
    t.forEach((t, n) => {
      typeof t === "string" && (e[n] = t);
    });
  } catch {}
  return e;
}
function Xa(t) {
  const e = Object.create(null);
  try {
    Object.entries(t).forEach(([t, n]) => {
      typeof n === "string" && (e[t] = n);
    });
  } catch {}
  return e;
}
function Qa(t) {
  const e = Ya(t.headers);
  return { method: t.method, url: t.url, query_string: cc(t.url), headers: e };
}
function tc(t) {
  const e = t.headers || {};
  const n =
    typeof e["x-forwarded-host"] === "string" ? e["x-forwarded-host"] : void 0;
  const s = n || (typeof e.host === "string" ? e.host : void 0);
  const o =
    typeof e["x-forwarded-proto"] === "string"
      ? e["x-forwarded-proto"]
      : void 0;
  const r = o || t.protocol || (t.socket?.encrypted ? "https" : "http");
  const i = t.url || "";
  const a = ec({ url: i, host: s, protocol: r });
  const c = t.body || void 0;
  const u = t.cookies;
  return {
    url: a,
    method: t.method,
    query_string: cc(i),
    headers: Xa(e),
    cookies: u,
    data: c,
  };
}
function ec({ url: t, protocol: e, host: n }) {
  return t?.startsWith("http") ? t : t && n ? `${e}://${n}${t}` : void 0;
}
const nc = [
  "auth",
  "token",
  "secret",
  "session",
  "password",
  "passwd",
  "pwd",
  "key",
  "jwt",
  "bearer",
  "sso",
  "saml",
  "csrf",
  "xsrf",
  "credentials",
  "set-cookie",
  "cookie",
];
const sc = ["x-forwarded-", "-user"];
function oc(t, e = false) {
  const n = {};
  try {
    Object.entries(t).forEach(([t, s]) => {
      if (s == null) return;
      const o = t.toLowerCase();
      const r = o === "cookie" || o === "set-cookie";
      if (r && typeof s === "string" && s !== "") {
        const t = o === "set-cookie";
        const r = s.indexOf(";");
        const i = t && r !== -1 ? s.substring(0, r) : s;
        const a = t ? [i] : i.split("; ");
        for (const t of a) {
          const s = t.indexOf("=");
          const r = s !== -1 ? t.substring(0, s) : t;
          const i = s !== -1 ? t.substring(s + 1) : "";
          const a = r.toLowerCase();
          ic(n, o, a, i, e);
        }
      } else ic(n, o, "", s, e);
    });
  } catch {}
  return n;
}
function rc(t) {
  return t.replace(/-/g, "_");
}
function ic(t, e, n, s, o) {
  const r = n
    ? `http.request.header.${rc(e)}.${rc(n)}`
    : `http.request.header.${rc(e)}`;
  const i = ac(n || e, s, o);
  i !== void 0 && (t[r] = i);
}
function ac(t, e, n) {
  const s = n
    ? nc.some((e) => t.includes(e))
    : [...sc, ...nc].some((e) => t.includes(e));
  return s
    ? "[Filtered]"
    : Array.isArray(e)
      ? e.map((t) => (t != null ? String(t) : t)).join(";")
      : typeof e === "string"
        ? e
        : void 0;
}
function cc(t) {
  if (t)
    try {
      const e = new URL(t, "http://s.io").search.slice(1);
      return e.length ? e : void 0;
    } catch {
      return;
    }
}
const uc = 100;
function lc(t, e) {
  const n = Ie();
  const s = xe();
  if (!n) return;
  const { beforeBreadcrumb: o = null, maxBreadcrumbs: r = uc } = n.getOptions();
  if (r <= 0) return;
  const i = Zt();
  const a = { timestamp: i, ...t };
  const c = o ? u(() => o(a, e)) : a;
  if (c !== null) {
    n.emit && n.emit("beforeAddBreadcrumb", c, e);
    s.addBreadcrumb(c, r);
  }
}
let pc;
const fc = "FunctionToString";
const dc = new WeakMap();
const mc = () => ({
  name: fc,
  setupOnce() {
    pc = Function.prototype.toString;
    try {
      Function.prototype.toString = function (...t) {
        const e = _t(this);
        const n = dc.has(Ie()) && e !== void 0 ? e : this;
        return pc.apply(n, t);
      };
    } catch {}
  },
  setup(t) {
    dc.set(t, true);
  },
});
const gc = qr(mc);
const hc = [
  /^Script error\.?$/,
  /^Javascript error: Script error\.? on line 0$/,
  /^ResizeObserver loop completed with undelivered notifications.$/,
  /^Cannot redefine property: googletag$/,
  /^Can't find variable: gmo$/,
  /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
  'can\'t redefine non-configurable property "solana"',
  "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)",
  "Can't find variable: _AutofillCallbackHandler",
  /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/,
  /^Java exception was raised during method invocation$/,
];
const _c = "EventFilters";
/**
 * An integration that filters out events (errors and transactions) based on:
 *
 * - (Errors) A curated list of known low-value or irrelevant errors (see {@link DEFAULT_IGNORE_ERRORS})
 * - (Errors) A list of error messages or urls/filenames passed in via
 *   - Top level Sentry.init options (`ignoreErrors`, `denyUrls`, `allowUrls`)
 *   - The same options passed to the integration directly via @param options
 * - (Transactions/Spans) A list of root span (transaction) names passed in via
 *   - Top level Sentry.init option (`ignoreTransactions`)
 *   - The same option passed to the integration directly via @param options
 *
 * Events filtered by this integration will not be sent to Sentry.
 */ const yc = qr((t = {}) => {
  let e;
  return {
    name: _c,
    setup(n) {
      const s = n.getOptions();
      e = vc(t, s);
    },
    processEvent(n, s, o) {
      if (!e) {
        const n = o.getOptions();
        e = vc(t, n);
      }
      return Sc(n, e) ? null : n;
    },
  };
});
/**
 * An integration that filters out events (errors and transactions) based on:
 *
 * - (Errors) A curated list of known low-value or irrelevant errors (see {@link DEFAULT_IGNORE_ERRORS})
 * - (Errors) A list of error messages or urls/filenames passed in via
 *   - Top level Sentry.init options (`ignoreErrors`, `denyUrls`, `allowUrls`)
 *   - The same options passed to the integration directly via @param options
 * - (Transactions/Spans) A list of root span (transaction) names passed in via
 *   - Top level Sentry.init option (`ignoreTransactions`)
 *   - The same option passed to the integration directly via @param options
 *
 * Events filtered by this integration will not be sent to Sentry.
 *
 * @deprecated this integration was renamed and will be removed in a future major version.
 * Use `eventFiltersIntegration` instead.
 */ const bc = qr((t = {}) => ({ ...yc(t), name: "InboundFilters" }));
function vc(t = {}, e = {}) {
  return {
    allowUrls: [...(t.allowUrls || []), ...(e.allowUrls || [])],
    denyUrls: [...(t.denyUrls || []), ...(e.denyUrls || [])],
    ignoreErrors: [
      ...(t.ignoreErrors || []),
      ...(e.ignoreErrors || []),
      ...(t.disableErrorDefaults ? [] : hc),
    ],
    ignoreTransactions: [
      ...(t.ignoreTransactions || []),
      ...(e.ignoreTransactions || []),
    ],
  };
}
function Sc(e, n) {
  if (e.type) {
    if (e.type === "transaction" && wc(e, n.ignoreTransactions)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`ignoreTransactions\` option.\nEvent: ${qt(e)}`,
        );
      return true;
    }
  } else {
    if (kc(e, n.ignoreErrors)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${qt(e)}`,
        );
      return true;
    }
    if (Ic(e)) {
      t &&
        y.warn(
          `Event dropped due to not having an error message, error type or stacktrace.\nEvent: ${qt(e)}`,
        );
      return true;
    }
    if (xc(e, n.denyUrls)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${qt(e)}.\nUrl: ${Tc(e)}`,
        );
      return true;
    }
    if (!Ac(e, n.allowUrls)) {
      t &&
        y.warn(
          `Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${qt(e)}.\nUrl: ${Tc(e)}`,
        );
      return true;
    }
  }
  return false;
}
function kc(t, e) {
  return !!e?.length && xi(t).some((t) => Rt(t, e));
}
function wc(t, e) {
  if (!e?.length) return false;
  const n = t.transaction;
  return !!n && Rt(n, e);
}
function xc(t, e) {
  if (!e?.length) return false;
  const n = Tc(t);
  return !!n && Rt(n, e);
}
function Ac(t, e) {
  if (!e?.length) return true;
  const n = Tc(t);
  return !n || Rt(n, e);
}
function Ec(t = []) {
  for (let e = t.length - 1; e >= 0; e--) {
    const n = t[e];
    if (n && n.filename !== "<anonymous>" && n.filename !== "[native code]")
      return n.filename || null;
  }
  return null;
}
function Tc(e) {
  try {
    const t = [...(e.exception?.values ?? [])]
      .reverse()
      .find(
        (t) =>
          t.mechanism?.parent_id === void 0 && t.stacktrace?.frames?.length,
      );
    const n = t?.stacktrace?.frames;
    return n ? Ec(n) : null;
  } catch {
    t && y.error(`Cannot extract url for event ${qt(e)}`);
    return null;
  }
}
function Ic(t) {
  return (
    !!t.exception?.values?.length &&
    !t.message &&
    !t.exception.values.some(
      (t) => t.stacktrace || (t.type && t.type !== "Error") || t.value,
    )
  );
}
function $c(t, e, n, s, o, r) {
  if (!o.exception?.values || !r || !rt(r.originalException, Error)) return;
  const i =
    o.exception.values.length > 0
      ? o.exception.values[o.exception.values.length - 1]
      : void 0;
  i &&
    (o.exception.values = Oc(
      t,
      e,
      s,
      r.originalException,
      n,
      o.exception.values,
      i,
      0,
    ));
}
function Oc(t, e, n, s, o, r, i, a) {
  if (r.length >= n + 1) return r;
  let c = [...r];
  if (rt(s[o], Error)) {
    Nc(i, a, s);
    const r = t(e, s[o]);
    const u = c.length;
    jc(r, o, u, a);
    c = Oc(t, e, n, s[o], o, [r, ...c], r, u);
  }
  Cc(s) &&
    s.errors.forEach((r, u) => {
      if (rt(r, Error)) {
        Nc(i, a, s);
        const l = t(e, r);
        const p = c.length;
        jc(l, `errors[${u}]`, p, a);
        c = Oc(t, e, n, r, o, [l, ...c], l, p);
      }
    });
  return c;
}
function Cc(t) {
  return Array.isArray(t.errors);
}
function Nc(t, e, n) {
  t.mechanism = {
    handled: true,
    type: "auto.core.linked_errors",
    ...(Cc(n) && { is_exception_group: true }),
    ...t.mechanism,
    exception_id: e,
  };
}
function jc(t, e, n, s) {
  t.mechanism = {
    handled: true,
    ...t.mechanism,
    type: "chained",
    source: e,
    exception_id: n,
    parent_id: s,
  };
}
const Rc = "cause";
const Mc = 5;
const Pc = "LinkedErrors";
const Dc = (t = {}) => {
  const e = t.limit || Mc;
  const n = t.key || Rc;
  return {
    name: Pc,
    preprocessEvent(t, s, o) {
      const r = o.getOptions();
      $c(Xi, r.stackParser, n, e, t, s);
    },
  };
};
const Fc = qr(Dc);
const Lc = new Map();
const qc = new Set();
/**
 * Builds a map of filenames to module metadata from the global _sentryModuleMetadata object.
 * This is useful for forwarding metadata from web workers to the main thread.
 *
 * @param parser - Stack parser to use for extracting filenames from stack traces
 * @returns A map of filename to metadata object
 */ function Uc(t) {
  if (!e._sentryModuleMetadata) return {};
  const n = {};
  for (const s of Object.keys(e._sentryModuleMetadata)) {
    const o = e._sentryModuleMetadata[s];
    const r = t(s);
    for (const t of r.reverse())
      if (t.filename) {
        n[t.filename] = o;
        break;
      }
  }
  return n;
}
function Jc(t) {
  if (e._sentryModuleMetadata)
    for (const n of Object.keys(e._sentryModuleMetadata)) {
      const s = e._sentryModuleMetadata[n];
      if (qc.has(n)) continue;
      qc.add(n);
      const o = t(n);
      for (const t of o.reverse())
        if (t.filename) {
          Lc.set(t.filename, s);
          break;
        }
    }
}
function zc(t, e) {
  Jc(t);
  return Lc.get(e);
}
function Bc(t, e) {
  e.exception?.values?.forEach((e) => {
    e.stacktrace?.frames?.forEach((e) => {
      if (!e.filename || e.module_metadata) return;
      const n = zc(t, e.filename);
      n && (e.module_metadata = n);
    });
  });
}
function Wc(t) {
  t.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((t) => {
      delete t.module_metadata;
    });
  });
}
const Vc = qr(() => ({
  name: "ModuleMetadata",
  setup(t) {
    t.on("beforeEnvelope", (t) => {
      Is(t, (t, e) => {
        if (e === "event") {
          const e = Array.isArray(t) ? t[1] : void 0;
          if (e) {
            Wc(e);
            t[1] = e;
          }
        }
      });
    });
    t.on("applyFrameMetadata", (e) => {
      if (e.type) return;
      const n = t.getOptions().stackParser;
      Bc(n, e);
    });
  },
}));
function Gc(t) {
  const e = {};
  let n = 0;
  while (n < t.length) {
    const s = t.indexOf("=", n);
    if (s === -1) break;
    let o = t.indexOf(";", n);
    if (o === -1) o = t.length;
    else if (o < s) {
      n = t.lastIndexOf(";", s - 1) + 1;
      continue;
    }
    const r = t.slice(n, s).trim();
    if (void 0 === e[r]) {
      let n = t.slice(s + 1, o).trim();
      n.charCodeAt(0) === 34 && (n = n.slice(1, -1));
      try {
        e[r] = n.indexOf("%") !== -1 ? decodeURIComponent(n) : n;
      } catch {
        e[r] = n;
      }
    }
    n = o + 1;
  }
  return e;
}
const Kc = [
  "X-Client-IP",
  "X-Forwarded-For",
  "Fly-Client-IP",
  "CF-Connecting-IP",
  "Fastly-Client-Ip",
  "True-Client-Ip",
  "X-Real-IP",
  "X-Cluster-Client-IP",
  "X-Forwarded",
  "Forwarded-For",
  "Forwarded",
  "X-Vercel-Forwarded-For",
];
function Hc(t) {
  const e = {};
  for (const n of Object.keys(t)) e[n.toLowerCase()] = t[n];
  const n = Kc.map((t) => {
    const n = e[t.toLowerCase()];
    const s = Array.isArray(n) ? n.join(";") : n;
    return t === "Forwarded" ? Zc(s) : s?.split(",").map((t) => t.trim());
  });
  const s = n.reduce((t, e) => (e ? t.concat(e) : t), []);
  const o = s.find((t) => t !== null && Yc(t));
  return o || null;
}
function Zc(t) {
  if (!t) return null;
  for (const e of t.split(";")) if (e.startsWith("for=")) return e.slice(4);
  return null;
}
function Yc(t) {
  const e =
    /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/;
  return e.test(t);
}
const Xc = {
  cookies: true,
  data: true,
  headers: true,
  query_string: true,
  url: true,
};
const Qc = "RequestData";
const tu = (t = {}) => {
  const e = { ...Xc, ...t.include };
  return {
    name: Qc,
    processEvent(t, n, s) {
      const { sdkProcessingMetadata: o = {} } = t;
      const { normalizedRequest: r, ipAddress: i } = o;
      const a = { ...e, ip: e.ip ?? s.getOptions().sendDefaultPii };
      r && nu(t, r, { ipAddress: i }, a);
      return t;
    },
  };
};
const eu = qr(tu);
function nu(t, e, n, s) {
  t.request = { ...t.request, ...su(e, s) };
  if (s.ip) {
    const s = (e.headers && Hc(e.headers)) || n.ipAddress;
    s && (t.user = { ...t.user, ip_address: s });
  }
}
function su(t, e) {
  const n = {};
  const s = { ...t.headers };
  if (e.headers) {
    n.headers = s;
    e.cookies || delete s.cookie;
    e.ip ||
      Kc.forEach((t) => {
        delete s[t];
      });
  }
  n.method = t.method;
  e.url && (n.url = t.url);
  if (e.cookies) {
    const e = t.cookies || (s?.cookie ? Gc(s.cookie) : void 0);
    n.cookies = e || {};
  }
  e.query_string && (n.query_string = t.query_string);
  e.data && (n.data = t.data);
  return n;
}
function ou(t) {
  const e = "console";
  R(e, t);
  P(e, ru);
}
function ru() {
  "console" in e &&
    i.forEach(function (t) {
      t in e.console &&
        mt(e.console, t, function (n) {
          c[t] = n;
          return function (...n) {
            const s = { args: n, level: t };
            D("console", s);
            const o = c[t];
            o?.apply(e.console, n);
          };
        });
    });
}
/**
 * Converts a string-based level into a `SeverityLevel`, normalizing it along the way.
 *
 * @param level String representation of desired `SeverityLevel`.
 * @returns The `SeverityLevel` corresponding to the given string, or 'log' if the string isn't a valid level.
 */ function iu(t) {
  return t === "warn"
    ? "warning"
    : ["fatal", "error", "warning", "log", "info", "debug"].includes(t)
      ? t
      : "log";
}
const au = "CaptureConsole";
const cu = (t = {}) => {
  const n = t.levels || i;
  const s = t.handled ?? true;
  return {
    name: au,
    setup(t) {
      "console" in e &&
        ou(({ args: e, level: o }) => {
          Ie() === t && n.includes(o) && lu(e, o, s);
        });
    },
  };
};
const uu = qr(cu);
function lu(t, e, n) {
  const s = iu(e);
  const o = new Error();
  const r = { level: iu(e), extra: { arguments: t } };
  Ee((i) => {
    i.addEventProcessor((t) => {
      t.logger = "console";
      Jt(t, { handled: n, type: "auto.core.capture_console" });
      return t;
    });
    if (e === "assert") {
      if (!t[0]) {
        const e = `Assertion failed: ${Nt(t.slice(1), " ") || "console.assert"}`;
        i.setExtra("arguments", t.slice(1));
        i.captureMessage(e, s, { captureContext: r, syntheticException: o });
      }
      return;
    }
    const a = t.find((t) => t instanceof Error);
    if (a) {
      rr(a, r);
      return;
    }
    const c = Nt(t, " ");
    i.captureMessage(c, s, { captureContext: r, syntheticException: o });
  });
}
const pu = "Dedupe";
const fu = () => {
  let e;
  return {
    name: pu,
    processEvent(n) {
      if (n.type) return n;
      try {
        if (mu(n, e)) {
          t &&
            y.warn(
              "Event dropped due to being a duplicate of previously captured event.",
            );
          return null;
        }
      } catch {}
      return (e = n);
    },
  };
};
const du = qr(fu);
function mu(t, e) {
  return !!e && (!!gu(t, e) || !!hu(t, e));
}
function gu(t, e) {
  const n = t.message;
  const s = e.message;
  return (
    !(!n && !s) &&
    !((n && !s) || (!n && s)) &&
    n === s &&
    !!yu(t, e) &&
    !!_u(t, e)
  );
}
function hu(t, e) {
  const n = bu(e);
  const s = bu(t);
  return (
    !(!n || !s) &&
    n.type === s.type &&
    n.value === s.value &&
    !!yu(t, e) &&
    !!_u(t, e)
  );
}
function _u(t, e) {
  let n = $(t);
  let s = $(e);
  if (!n && !s) return true;
  if ((n && !s) || (!n && s)) return false;
  n;
  s;
  if (s.length !== n.length) return false;
  for (let t = 0; t < s.length; t++) {
    const e = s[t];
    const o = n[t];
    if (
      e.filename !== o.filename ||
      e.lineno !== o.lineno ||
      e.colno !== o.colno ||
      e.function !== o.function
    )
      return false;
  }
  return true;
}
function yu(t, e) {
  let n = t.fingerprint;
  let s = e.fingerprint;
  if (!n && !s) return true;
  if ((n && !s) || (!n && s)) return false;
  n;
  s;
  try {
    return !!(n.join("") === s.join(""));
  } catch {
    return false;
  }
}
function bu(t) {
  return t.exception?.values?.[0];
}
const vu = "ExtraErrorData";
const Su = (t = {}) => {
  const { depth: e = 3, captureErrorCause: n = true } = t;
  return {
    name: vu,
    processEvent(t, s, o) {
      const { maxValueLength: r } = o.getOptions();
      return wu(t, s, e, n, r);
    },
  };
};
const ku = qr(Su);
function wu(t, e = {}, n, s, o) {
  if (!e.originalException || !W(e.originalException)) return t;
  const r = e.originalException.name || e.originalException.constructor.name;
  const i = xu(e.originalException, s, o);
  if (i) {
    const e = { ...t.contexts };
    const s = _s(i, n);
    if (Q(s)) {
      gt(s, "__sentry_skip_normalization__", true);
      e[r] = s;
    }
    return { ...t, contexts: e };
  }
  return t;
}
function xu(e, n, s) {
  try {
    const t = [
      "name",
      "message",
      "stack",
      "line",
      "column",
      "fileName",
      "lineNumber",
      "columnNumber",
      "toJSON",
    ];
    const o = {};
    for (const n of Object.keys(e)) {
      if (t.indexOf(n) !== -1) continue;
      const r = e[n];
      o[n] = W(r) || typeof r === "string" ? (s ? Ot(`${r}`, s) : `${r}`) : r;
    }
    if (n && e.cause !== void 0)
      if (W(e.cause)) {
        const t = e.cause.name || e.cause.constructor.name;
        o.cause = { [t]: xu(e.cause, false, s) };
      } else o.cause = e.cause;
    if (typeof e.toJSON === "function") {
      const t = e.toJSON();
      for (const e of Object.keys(t)) {
        const n = t[e];
        o[e] = W(n) ? n.toString() : n;
      }
    }
    return o;
  } catch (e) {
    t && y.error("Unable to extract extra data from the Error object:", e);
  }
  return null;
}
function Au(t, e) {
  let n = 0;
  for (let e = t.length - 1; e >= 0; e--) {
    const s = t[e];
    if (s === ".") t.splice(e, 1);
    else if (s === "..") {
      t.splice(e, 1);
      n++;
    } else if (n) {
      t.splice(e, 1);
      n--;
    }
  }
  if (e) for (; n--; n) t.unshift("..");
  return t;
}
const Eu =
  /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
function Tu(t) {
  const e = t.length > 1024 ? `<truncated>${t.slice(-1024)}` : t;
  const n = Eu.exec(e);
  return n ? n.slice(1) : [];
}
function Iu(...t) {
  let e = "";
  let n = false;
  for (let s = t.length - 1; s >= -1 && !n; s--) {
    const o = s >= 0 ? t[s] : "/";
    if (o) {
      e = `${o}/${e}`;
      n = o.charAt(0) === "/";
    }
  }
  e = Au(
    e.split("/").filter((t) => !!t),
    !n,
  ).join("/");
  return (n ? "/" : "") + e || ".";
}
function $u(t) {
  let e = 0;
  for (; e < t.length; e++) if (t[e] !== "") break;
  let n = t.length - 1;
  for (; n >= 0; n--) if (t[n] !== "") break;
  return e > n ? [] : t.slice(e, n - e + 1);
}
function Ou(t, e) {
  t = Iu(t).slice(1);
  e = Iu(e).slice(1);
  const n = $u(t.split("/"));
  const s = $u(e.split("/"));
  const o = Math.min(n.length, s.length);
  let r = o;
  for (let t = 0; t < o; t++)
    if (n[t] !== s[t]) {
      r = t;
      break;
    }
  let i = [];
  for (let t = r; t < n.length; t++) i.push("..");
  i = i.concat(s.slice(r));
  return i.join("/");
}
function Cu(t) {
  const e = Nu(t);
  const n = t.slice(-1) === "/";
  let s = Au(
    t.split("/").filter((t) => !!t),
    !e,
  ).join("/");
  s || e || (s = ".");
  s && n && (s += "/");
  return (e ? "/" : "") + s;
}
function Nu(t) {
  return t.charAt(0) === "/";
}
function ju(...t) {
  return Cu(t.join("/"));
}
function Ru(t) {
  const e = Tu(t);
  const n = e[0] || "";
  let s = e[1];
  if (!n && !s) return ".";
  s && (s = s.slice(0, s.length - 1));
  return n + s;
}
function Mu(t, e) {
  let n = Tu(t)[2] || "";
  e && n.slice(e.length * -1) === e && (n = n.slice(0, n.length - e.length));
  return n;
}
const Pu = "RewriteFrames";
const Du = qr((t = {}) => {
  const n = t.root;
  const s = t.prefix || "app:///";
  const o = "window" in e && !!e.window;
  const r = t.iteratee || Fu({ isBrowser: o, root: n, prefix: s });
  function i(t) {
    try {
      return {
        ...t,
        exception: {
          ...t.exception,
          values: t.exception.values.map((t) => ({
            ...t,
            ...(t.stacktrace && { stacktrace: a(t.stacktrace) }),
          })),
        },
      };
    } catch {
      return t;
    }
  }
  function a(t) {
    return { ...t, frames: t?.frames?.map((t) => r(t)) };
  }
  return {
    name: Pu,
    processEvent(t) {
      let e = t;
      t.exception && Array.isArray(t.exception.values) && (e = i(e));
      return e;
    },
  };
});
function Fu({ isBrowser: t, root: e, prefix: n }) {
  return (s) => {
    if (!s.filename) return s;
    const o =
      /^[a-zA-Z]:\\/.test(s.filename) ||
      (s.filename.includes("\\") && !s.filename.includes("/"));
    const r = /^\//.test(s.filename);
    if (t) {
      if (e) {
        const t = s.filename;
        t.indexOf(e) === 0 && (s.filename = t.replace(e, n));
      }
    } else if (o || r) {
      const t = o
        ? s.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/")
        : s.filename;
      const r = e ? Ou(e, t) : Mu(t);
      s.filename = `${n}${r}`;
    }
    return s;
  };
}
const Lu = [
  "reauthenticate",
  "signInAnonymously",
  "signInWithOAuth",
  "signInWithIdToken",
  "signInWithOtp",
  "signInWithPassword",
  "signInWithSSO",
  "signOut",
  "signUp",
  "verifyOtp",
];
const qu = [
  "createUser",
  "deleteUser",
  "listUsers",
  "getUserById",
  "updateUserById",
  "inviteUserByEmail",
];
const Uu = {
  eq: "eq",
  neq: "neq",
  gt: "gt",
  gte: "gte",
  lt: "lt",
  lte: "lte",
  like: "like",
  "like(all)": "likeAllOf",
  "like(any)": "likeAnyOf",
  ilike: "ilike",
  "ilike(all)": "ilikeAllOf",
  "ilike(any)": "ilikeAnyOf",
  is: "is",
  in: "in",
  cs: "contains",
  cd: "containedBy",
  sr: "rangeGt",
  nxl: "rangeGte",
  sl: "rangeLt",
  nxr: "rangeLte",
  adj: "rangeAdjacent",
  ov: "overlaps",
  fts: "",
  plfts: "plain",
  phfts: "phrase",
  wfts: "websearch",
  not: "not",
};
const Ju = ["select", "insert", "upsert", "update", "delete"];
function zu(t) {
  try {
    t.__SENTRY_INSTRUMENTED__ = true;
  } catch {}
}
function Bu(t) {
  try {
    return t.__SENTRY_INSTRUMENTED__;
  } catch {
    return false;
  }
}
/**
 * Extracts the database operation type from the HTTP method and headers
 * @param method - The HTTP method of the request
 * @param headers - The request headers
 * @returns The database operation type ('select', 'insert', 'upsert', 'update', or 'delete')
 */ function Wu(t, e = {}) {
  switch (t) {
    case "GET":
      return "select";
    case "POST":
      return e.Prefer?.includes("resolution=") ? "upsert" : "insert";
    case "PATCH":
      return "update";
    case "DELETE":
      return "delete";
    default:
      return "<unknown-op>";
  }
}
/**
 * Translates Supabase filter parameters into readable method names for tracing
 * @param key - The filter key from the URL search parameters
 * @param query - The filter value from the URL search parameters
 * @returns A string representation of the filter as a method call
 */ function Vu(t, e) {
  if (e === "" || e === "*") return "select(*)";
  if (t === "select") return `select(${e})`;
  if (t === "or" || t.endsWith(".or")) return `${t}${e}`;
  const [n, ...s] = e.split(".");
  let o;
  o = n?.startsWith("fts")
    ? "textSearch"
    : n?.startsWith("plfts")
      ? "textSearch[plain]"
      : n?.startsWith("phfts")
        ? "textSearch[phrase]"
        : n?.startsWith("wfts")
          ? "textSearch[websearch]"
          : (n && Uu[n]) || "filter";
  return `${o}(${t}, ${s.join(".")})`;
}
function Gu(t, e = false) {
  return new Proxy(t, {
    apply(n, s, o) {
      return oo(
        {
          name: `auth ${e ? "(admin) " : ""}${t.name}`,
          attributes: {
            [Re]: "auto.db.supabase",
            [je]: "db",
            "db.system": "postgresql",
            "db.operation": `auth.${e ? "admin." : ""}${t.name}`,
          },
        },
        (t) =>
          Reflect.apply(n, s, o)
            .then((e) => {
              if (e && typeof e === "object" && "error" in e && e.error) {
                t.setStatus({ code: Ze });
                rr(e.error, {
                  mechanism: { handled: false, type: "auto.db.supabase.auth" },
                });
              } else t.setStatus({ code: He });
              t.end();
              return e;
            })
            .catch((e) => {
              t.setStatus({ code: Ze });
              t.end();
              rr(e, {
                mechanism: { handled: false, type: "auto.db.supabase.auth" },
              });
              throw e;
            })
            .then(...o),
      );
    },
  });
}
function Ku(t) {
  const e = t.auth;
  if (e && !Bu(t.auth)) {
    for (const n of Lu) {
      const s = e[n];
      s && typeof t.auth[n] === "function" && (t.auth[n] = Gu(s));
    }
    for (const n of qu) {
      const s = e.admin[n];
      s &&
        typeof t.auth.admin[n] === "function" &&
        (t.auth.admin[n] = Gu(s, true));
    }
    zu(t.auth);
  }
}
function Hu(t) {
  if (!Bu(t.prototype.from)) {
    t.prototype.from = new Proxy(t.prototype.from, {
      apply(t, e, n) {
        const s = Reflect.apply(t, e, n);
        const o = s.constructor;
        Yu(o);
        return s;
      },
    });
    zu(t.prototype.from);
  }
}
function Zu(t) {
  if (!Bu(t.prototype.then)) {
    t.prototype.then = new Proxy(t.prototype.then, {
      apply(t, e, n) {
        const s = Ju;
        const o = e;
        const r = Wu(o.method, o.headers);
        if (!s.includes(r)) return Reflect.apply(t, e, n);
        if (!o?.url?.pathname || typeof o.url.pathname !== "string")
          return Reflect.apply(t, e, n);
        const i = o.url.pathname.split("/");
        const a = i.length > 0 ? i[i.length - 1] : "";
        const c = [];
        for (const [t, e] of o.url.searchParams.entries()) c.push(Vu(t, e));
        const u = Object.create(null);
        if (Q(o.body)) for (const [t, e] of Object.entries(o.body)) u[t] = e;
        const l = `${r === "select" ? "" : `${r}${u ? "(...) " : ""}`}${c.join(" ")} from(${a})`;
        const p = {
          "db.table": a,
          "db.schema": o.schema,
          "db.url": o.url.origin,
          "db.sdk": o.headers["X-Client-Info"],
          "db.system": "postgresql",
          "db.operation": r,
          [Re]: "auto.db.supabase",
          [je]: "db",
        };
        c.length && (p["db.query"] = c);
        Object.keys(u).length && (p["db.body"] = u);
        return oo({ name: l, attributes: p }, (s) =>
          Reflect.apply(t, e, [])
            .then(
              (t) => {
                if (s) {
                  t &&
                    typeof t === "object" &&
                    "status" in t &&
                    Xe(s, t.status || 500);
                  s.end();
                }
                if (t.error) {
                  const e = new Error(t.error.message);
                  t.error.code && (e.code = t.error.code);
                  t.error.details && (e.details = t.error.details);
                  const n = {};
                  c.length && (n.query = c);
                  Object.keys(u).length && (n.body = u);
                  rr(e, (t) => {
                    t.addEventProcessor((t) => {
                      Jt(t, {
                        handled: false,
                        type: "auto.db.supabase.postgres",
                      });
                      return t;
                    });
                    t.setContext("supabase", n);
                    return t;
                  });
                }
                const e = { type: "supabase", category: `db.${r}`, message: l };
                const n = {};
                c.length && (n.query = c);
                Object.keys(u).length && (n.body = u);
                Object.keys(n).length && (e.data = n);
                lc(e);
                return t;
              },
              (t) => {
                if (s) {
                  Xe(s, 500);
                  s.end();
                }
                throw t;
              },
            )
            .then(...n),
        );
      },
    });
    zu(t.prototype.then);
  }
}
function Yu(e) {
  for (const n of Ju)
    if (!Bu(e.prototype[n])) {
      e.prototype[n] = new Proxy(e.prototype[n], {
        apply(e, s, o) {
          const r = Reflect.apply(e, s, o);
          const i = r.constructor;
          t && y.log(`Instrumenting ${n} operation's PostgRESTFilterBuilder`);
          Zu(i);
          return r;
        },
      });
      zu(e.prototype[n]);
    }
}
const Xu = (e) => {
  if (!e) {
    t &&
      y.warn(
        "Supabase integration was not installed because no Supabase client was provided.",
      );
    return;
  }
  const n = e.constructor === Function ? e : e.constructor;
  Hu(n);
  Ku(e);
};
const Qu = "Supabase";
const tl = (t) => ({
  setupOnce() {
    Xu(t);
  },
  name: Qu,
});
const el = qr((t) => tl(t.supabaseClient));
const nl = 10;
const sl = "ZodErrors";
function ol(t) {
  return W(t) && t.name === "ZodError" && Array.isArray(t.issues);
}
function rl(t) {
  return {
    ...t,
    path: "path" in t && Array.isArray(t.path) ? t.path.join(".") : void 0,
    keys: "keys" in t ? JSON.stringify(t.keys) : void 0,
    unionErrors: "unionErrors" in t ? JSON.stringify(t.unionErrors) : void 0,
  };
}
/**
 * Takes ZodError issue path array and returns a flattened version as a string.
 * This makes it easier to display paths within a Sentry error message.
 *
 * Array indexes are normalized to reduce duplicate entries
 *
 * @param path ZodError issue path
 * @returns flattened path
 *
 * @example
 * flattenIssuePath([0, 'foo', 1, 'bar']) // -> '<array>.foo.<array>.bar'
 */ function il(t) {
  return t.map((t) => (typeof t === "number" ? "<array>" : t)).join(".");
}
function al(t) {
  const e = new Set();
  for (const n of t.issues) {
    const t = il(n.path);
    t.length > 0 && e.add(t);
  }
  const n = Array.from(e);
  if (n.length === 0) {
    let e = "variable";
    if (t.issues.length > 0) {
      const n = t.issues[0];
      n !== void 0 &&
        "expected" in n &&
        typeof n.expected === "string" &&
        (e = n.expected);
    }
    return `Failed to validate ${e}`;
  }
  return `Failed to validate keys: ${Ot(n.join(", "), 100)}`;
}
function cl(t, e = false, n, s) {
  if (
    !n.exception?.values ||
    !s.originalException ||
    !ol(s.originalException) ||
    s.originalException.issues.length === 0
  )
    return n;
  try {
    const o = e
      ? s.originalException.issues
      : s.originalException.issues.slice(0, t);
    const r = o.map(rl);
    if (e) {
      Array.isArray(s.attachments) || (s.attachments = []);
      s.attachments.push({
        filename: "zod_issues.json",
        data: JSON.stringify({ issues: r }),
      });
    }
    return {
      ...n,
      exception: {
        ...n.exception,
        values: [
          { ...n.exception.values[0], value: al(s.originalException) },
          ...n.exception.values.slice(1),
        ],
      },
      extra: { ...n.extra, "zoderror.issues": r.slice(0, t) },
    };
  } catch (t) {
    return {
      ...n,
      extra: {
        ...n.extra,
        "zoderrors sentry integration parse error": {
          message:
            "an exception was thrown while processing ZodError within applyZodErrorsToEvent()",
          error:
            t instanceof Error
              ? `${t.name}: ${t.message}\n${t.stack}`
              : "unknown",
        },
      },
    };
  }
}
const ul = (t = {}) => {
  const e = t.limit ?? nl;
  return {
    name: sl,
    processEvent(n, s) {
      const o = cl(e, t.saveZodIssuesAsAttachment, n, s);
      return o;
    },
  };
};
const ll = qr(ul);
const pl = qr((t) => ({
  name: "ThirdPartyErrorsFilter",
  setup(t) {
    t.on("beforeEnvelope", (t) => {
      Is(t, (t, e) => {
        if (e === "event") {
          const e = Array.isArray(t) ? t[1] : void 0;
          if (e) {
            Wc(e);
            t[1] = e;
          }
        }
      });
    });
    t.on("applyFrameMetadata", (e) => {
      if (e.type) return;
      const n = t.getOptions().stackParser;
      Bc(n, e);
    });
  },
  processEvent(e) {
    const n = dl(e, t.ignoreSentryInternalFrames);
    if (n) {
      const s =
        t.behaviour === "drop-error-if-contains-third-party-frames" ||
        t.behaviour === "apply-tag-if-contains-third-party-frames"
          ? "some"
          : "every";
      const o = n[s]((e) => !e.some((e) => t.filterKeys.includes(e)));
      if (o) {
        const n =
          t.behaviour === "drop-error-if-contains-third-party-frames" ||
          t.behaviour ===
            "drop-error-if-exclusively-contains-third-party-frames";
        if (n) return null;
        e.tags = { ...e.tags, third_party_code: true };
      }
    }
    return e;
  },
}));
function fl(t, e) {
  if (e !== 0 || !t.context_line || !t.filename) return false;
  if (
    !t.filename.includes("sentry") ||
    !t.filename.includes("helpers") ||
    !t.context_line.includes(hl)
  )
    return false;
  if (t.pre_context) {
    const e = t.pre_context.length;
    for (let n = 0; n < e; n++) if (t.pre_context[n]?.includes(gl)) return true;
  }
  return false;
}
function dl(t, e) {
  const n = $(t);
  if (n)
    return n
      .filter(
        (t, n) =>
          !!t.filename &&
          (t.lineno != null || t.colno != null || t.instruction_addr != null) &&
          (!e || !fl(t, n)),
      )
      .map((t) =>
        t.module_metadata
          ? Object.keys(t.module_metadata)
              .filter((t) => t.startsWith(ml))
              .map((t) => t.slice(ml.length))
          : [],
      );
}
const ml = "_sentryBundlerPluginAppKey:";
const gl = "Attempt to invoke user-land function";
const hl = "fn.apply(this, wrappedArguments)";
const _l = "Console";
const yl = qr((t = {}) => {
  const e = new Set(t.levels || i);
  return {
    name: _l,
    setup(t) {
      ou(({ args: n, level: s }) => {
        Ie() === t && e.has(s) && bl(s, n);
      });
    },
  };
});
function bl(t, e) {
  const n = {
    category: "console",
    data: { arguments: e, logger: "console" },
    level: iu(t),
    message: vl(e),
  };
  if (t === "assert") {
    if (e[0] !== false) return;
    {
      const t = e.slice(1);
      n.message =
        t.length > 0 ? `Assertion failed: ${vl(t)}` : "Assertion failed";
      n.data.arguments = t;
    }
  }
  lc(n, { input: e, level: t });
}
function vl(t) {
  return "util" in e && typeof e.util.format === "function"
    ? e.util.format(...t)
    : Nt(t, " ");
}
const Sl = 100;
const kl = 10;
const wl = "flag.evaluation.";
function xl(t) {
  const e = we();
  const n = e.getScopeData().contexts.flags;
  const s = n ? n.values : [];
  if (!s.length) return t;
  t.contexts === void 0 && (t.contexts = {});
  t.contexts.flags = { values: [...s] };
  return t;
}
/**
 * Inserts a flag into the current scope's context while maintaining ordered LRU properties.
 * Not thread-safe. After inserting:
 * - The flag buffer is sorted in order of recency, with the newest evaluation at the end.
 * - The names in the buffer are always unique.
 * - The length of the buffer never exceeds `maxSize`.
 *
 * @param name     Name of the feature flag to insert.
 * @param value    Value of the feature flag.
 * @param maxSize  Max number of flags the buffer should store. Default value should always be used in production.
 */ function Al(t, e, n = Sl) {
  const s = we().getScopeData().contexts;
  s.flags || (s.flags = { values: [] });
  const o = s.flags.values;
  El(o, t, e, n);
}
/**
 * Exported for tests only. Currently only accepts boolean values (otherwise no-op).
 * Inserts a flag into a FeatureFlag array while maintaining the following properties:
 * - Flags are sorted in order of recency, with the newest evaluation at the end.
 * - The flag names are always unique.
 * - The length of the array never exceeds `maxSize`.
 *
 * @param flags      The buffer to insert the flag into.
 * @param name       Name of the feature flag to insert.
 * @param value      Value of the feature flag.
 * @param maxSize    Max number of flags the buffer should store. Default value should always be used in production.
 */ function El(e, n, s, o) {
  if (typeof s !== "boolean") return;
  if (e.length > o) {
    t &&
      y.error(
        `[Feature Flags] insertToFlagBuffer called on a buffer larger than maxSize=${o}`,
      );
    return;
  }
  const r = e.findIndex((t) => t.flag === n);
  r !== -1 && e.splice(r, 1);
  e.length === o && e.shift();
  e.push({ flag: n, result: s });
}
/**
 * Records a feature flag evaluation for the active span. This is a no-op for non-boolean values.
 * The flag and its value is stored in span attributes with the `flag.evaluation` prefix. Once the
 * unique flags for a span reaches maxFlagsPerSpan, subsequent flags are dropped.
 *
 * @param name             Name of the feature flag.
 * @param value            Value of the feature flag. Non-boolean values are ignored.
 * @param maxFlagsPerSpan  Max number of flags a buffer should store. Default value should always be used in production.
 */ function Tl(t, e, n = kl) {
  if (typeof e !== "boolean") return;
  const s = Qn();
  if (!s) return;
  const o = Jn(s).data;
  if (`${wl}${t}` in o) {
    s.setAttribute(`${wl}${t}`, e);
    return;
  }
  const r = Object.keys(o).filter((t) => t.startsWith(wl)).length;
  r < n && s.setAttribute(`${wl}${t}`, e);
}
const Il = qr(() => ({
  name: "FeatureFlags",
  processEvent(t, e, n) {
    return xl(t);
  },
  addFeatureFlag(t, e) {
    Al(t, e);
    Tl(t, e);
  },
}));
const $l = qr(({ growthbookClass: t }) => ({
  name: "GrowthBook",
  setupOnce() {
    const e = t.prototype;
    typeof e.isOn === "function" && mt(e, "isOn", Ol);
    typeof e.getFeatureValue === "function" && mt(e, "getFeatureValue", Ol);
  },
  processEvent(t, e, n) {
    return xl(t);
  },
}));
function Ol(t) {
  return function (...e) {
    const n = e[0];
    const s = t.apply(this, e);
    if (typeof n === "string" && typeof s === "boolean") {
      Al(n, s);
      Tl(n, s);
    }
    return s;
  };
}
const Cl = "ConversationId";
const Nl = () => ({
  name: Cl,
  setup(t) {
    t.on("spanStart", (t) => {
      const e = we().getScopeData();
      const n = xe().getScopeData();
      const s = e.conversationId || n.conversationId;
      s && t.setAttribute(Ge, s);
    });
  },
});
const jl = qr(Nl);
function Rl(t) {
  return (
    !!t &&
    typeof t._profiler !== "undefined" &&
    typeof t._profiler.start === "function" &&
    typeof t._profiler.stop === "function"
  );
}
function Ml() {
  const e = Ie();
  if (!e) {
    t && y.warn("No Sentry client available, profiling is not started");
    return;
  }
  const n = e.getIntegrationByName("ProfilingIntegration");
  n
    ? Rl(n)
      ? n._profiler.start()
      : t && y.warn("Profiler is not available on profiling integration.")
    : t && y.warn("ProfilingIntegration is not available");
}
function Pl() {
  const e = Ie();
  if (!e) {
    t && y.warn("No Sentry client available, profiling is not started");
    return;
  }
  const n = e.getIntegrationByName("ProfilingIntegration");
  n
    ? Rl(n)
      ? n._profiler.stop()
      : t && y.warn("Profiler is not available on profiling integration.")
    : t && y.warn("ProfilingIntegration is not available");
}
const Dl = { startProfiler: Ml, stopProfiler: Pl };
/**
 * Create and track fetch request spans for usage in combination with `addFetchInstrumentationHandler`.
 *
 * @returns Span if a span was created, otherwise void.
 */ function Fl(t, e, n, s, o) {
  if (!t.fetchData) return;
  const { method: r, url: i } = t.fetchData;
  const a = os() && e(i);
  if (t.endTimestamp) {
    const e = t.fetchData.__span;
    if (!e) return;
    const n = s[e];
    if (n) {
      if (a) {
        Ul(n, t);
        Ll(n, t, o);
      }
      delete s[e];
    }
    return;
  }
  const {
    spanOrigin: c = "auto.http.browser",
    propagateTraceparent: u = false,
  } = typeof o === "object" ? o : { spanOrigin: o };
  const l = !!Qn();
  const p = a && l ? io(Bl(i, r, c)) : new SentryNonRecordingSpan();
  t.fetchData.__span = p.spanContext().spanId;
  s[p.spanContext().spanId] = p;
  if (n(t.fetchData.url)) {
    const e = t.args[0];
    const n = { ...(t.args[1] || {}) };
    const s = ql(e, n, os() && l ? p : void 0, u);
    if (s) {
      t.args[1] = n;
      n.headers = s;
    }
  }
  const f = Ie();
  if (f) {
    const e = {
      input: t.args,
      response: t.response,
      startTimestamp: t.startTimestamp,
      endTimestamp: t.endTimestamp,
    };
    f.emit("beforeOutgoingRequestSpan", p, e);
  }
  return p;
}
function Ll(t, e, n) {
  const s = typeof n === "object" && n !== null ? n.onRequestSpanEnd : void 0;
  s?.(t, { headers: e.response?.headers, error: e.error });
}
function ql(t, e, n, s) {
  const o = Ba({ span: n, propagateTraceparent: s });
  const r = o["sentry-trace"];
  const i = o.baggage;
  const a = o.traceparent;
  if (!r) return;
  const c = e.headers || (at(t) ? t.headers : void 0);
  if (c) {
    if (zl(c)) {
      const t = new Headers(c);
      t.get("sentry-trace") || t.set("sentry-trace", r);
      s && a && !t.get("traceparent") && t.set("traceparent", a);
      if (i) {
        const e = t.get("baggage");
        e ? Jl(e) || t.set("baggage", `${e},${i}`) : t.set("baggage", i);
      }
      return t;
    }
    if (Array.isArray(c)) {
      const t = [...c];
      c.find((t) => t[0] === "sentry-trace") || t.push(["sentry-trace", r]);
      s &&
        a &&
        !c.find((t) => t[0] === "traceparent") &&
        t.push(["traceparent", a]);
      const e = c.find((t) => t[0] === "baggage" && Jl(t[1]));
      i && !e && t.push(["baggage", i]);
      return t;
    }
    {
      const t = "sentry-trace" in c ? c["sentry-trace"] : void 0;
      const e = "traceparent" in c ? c.traceparent : void 0;
      const n = "baggage" in c ? c.baggage : void 0;
      const o = n ? (Array.isArray(n) ? [...n] : [n]) : [];
      const u = n && (Array.isArray(n) ? n.find((t) => Jl(t)) : Jl(n));
      i && !u && o.push(i);
      const l = {
        ...c,
        "sentry-trace": t ?? r,
        baggage: o.length > 0 ? o.join(",") : void 0,
      };
      s && a && !e && (l.traceparent = a);
      return l;
    }
  }
  return { ...o };
}
function Ul(t, e) {
  if (e.response) {
    Xe(t, e.response.status);
    const n = e.response?.headers?.get("content-length");
    if (n) {
      const e = parseInt(n);
      e > 0 && t.setAttribute("http.response_content_length", e);
    }
  } else e.error && t.setStatus({ code: Ze, message: "internal_error" });
  t.end();
}
function Jl(t) {
  return t.split(",").some((t) => t.trim().startsWith(rn));
}
function zl(t) {
  return typeof Headers !== "undefined" && rt(t, Headers);
}
function Bl(t, e, n) {
  if (t.startsWith("data:")) {
    const s = ja(t);
    return { name: `${e} ${s}`, attributes: Wl(t, void 0, e, n) };
  }
  const s = Ea(t);
  const o = s ? Ta(s) : t;
  return { name: `${e} ${o}`, attributes: Wl(t, s, e, n) };
}
function Wl(t, e, n, s) {
  const o = {
    url: ja(t),
    type: "fetch",
    "http.method": n,
    [Re]: s,
    [je]: "http.client",
  };
  if (e) {
    if (!Aa(e)) {
      o["http.url"] = ja(e.href);
      o["server.address"] = e.host;
    }
    e.search && (o["http.query"] = e.search);
    e.hash && (o["http.fragment"] = e.hash);
  }
  return o;
}
const Vl = { mechanism: { handled: false, type: "auto.rpc.trpc.middleware" } };
function Gl(t) {
  typeof t === "object" &&
    t !== null &&
    "ok" in t &&
    !t.ok &&
    "error" in t &&
    rr(t.error, Vl);
}
function Kl(t = {}) {
  return async function (e) {
    const { path: n, type: s, next: o, rawInput: r, getRawInput: i } = e;
    const a = Ie();
    const c = a?.getOptions();
    const u = { procedure_path: n, procedure_type: s };
    gt(
      u,
      "__sentry_override_normalization_depth__",
      1 + (c?.normalizeDepth ?? 5),
    );
    if (t.attachRpcInput !== void 0 ? t.attachRpcInput : c?.sendDefaultPii) {
      r !== void 0 && (u.input = _s(r));
      if (i !== void 0 && typeof i === "function")
        try {
          const t = await i();
          u.input = _s(t);
        } catch {}
    }
    return Te((e) => {
      e.setContext("trpc", u);
      return ro(
        {
          name: `trpc/${n}`,
          op: "rpc.server",
          attributes: { [Oe]: "route", [Re]: "auto.rpc.trpc" },
          forceTransaction: !!t.forceTransaction,
        },
        async (t) => {
          try {
            const e = await o();
            Gl(e);
            t.end();
            return e;
          } catch (e) {
            rr(e, Vl);
            t.end();
            throw e;
          }
        },
      );
    });
  };
}
/**
 * Captures an error without affecting MCP server operation.
 *
 * The active span already contains all MCP context (method, tool, arguments, etc.)
 * @param error - Error to capture
 * @param errorType - Classification of error type for filtering
 * @param extraData - Additional context data to include
 */ function Hl(t, e, n) {
  try {
    const s = Ie();
    if (!s) return;
    const o = Qn();
    o?.isRecording() && o.setStatus({ code: Ze, message: "internal_error" });
    rr(t, {
      mechanism: {
        type: "auto.ai.mcp_server",
        handled: false,
        data: { error_type: e || "handler_execution", ...n },
      },
    });
  } catch {}
}
/**
 * Generic function to wrap MCP server method handlers
 * @internal
 * @param serverInstance - MCP server instance
 * @param methodName - Method name to wrap (tool, resource, prompt)
 */ function Zl(t, e) {
  mt(
    t,
    e,
    (t) =>
      function (n, ...s) {
        const o = s[s.length - 1];
        if (typeof o !== "function") return t.call(this, n, ...s);
        const r = Yl(o, e, n);
        return t.call(this, n, ...s.slice(0, -1), r);
      },
  );
}
/**
 * Creates a wrapped handler with span correlation and error capture
 * @internal
 * @param originalHandler - Original handler function
 * @param methodName - MCP method name
 * @param handlerName - Handler identifier
 * @returns Wrapped handler function
 */ function Yl(e, n, s) {
  return function (...o) {
    try {
      return Xl.call(this, e, n, s, o);
    } catch (n) {
      t && y.warn("MCP handler wrapping failed:", n);
      return e.apply(this, o);
    }
  };
}
/**
 * Creates an error-capturing wrapper for handler execution
 * @internal
 * @param originalHandler - Original handler function
 * @param methodName - MCP method name
 * @param handlerName - Handler identifier
 * @param handlerArgs - Handler arguments
 * @param extraHandlerData - Additional handler context
 * @returns Handler execution result
 */ function Xl(t, e, n, s) {
  try {
    const o = t.apply(this, s);
    return o && typeof o === "object" && typeof o.then === "function"
      ? Promise.resolve(o).catch((t) => {
          Ql(t, e, n);
          throw t;
        })
      : o;
  } catch (t) {
    Ql(t, e, n);
    throw t;
  }
}
/**
 * Captures handler execution errors based on handler type
 * @internal
 * @param error - Error to capture
 * @param methodName - MCP method name
 * @param handlerName - Handler identifier
 */ function Ql(t, e, n) {
  try {
    const s = {};
    if (e === "tool") {
      s.tool_name = n;
      t.name === "ProtocolValidationError" ||
      t.message.includes("validation") ||
      t.message.includes("protocol")
        ? Hl(t, "validation", s)
        : t.name === "ServerTimeoutError" ||
            t.message.includes("timed out") ||
            t.message.includes("timeout")
          ? Hl(t, "timeout", s)
          : Hl(t, "tool_execution", s);
    } else if (e === "resource") {
      s.resource_uri = n;
      Hl(t, "resource_execution", s);
    } else if (e === "prompt") {
      s.prompt_name = n;
      Hl(t, "prompt_execution", s);
    }
  } catch (t) {}
}
/**
 * Wraps tool handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function tp(t) {
  Zl(t, "tool");
}
/**
 * Wraps resource handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function ep(t) {
  Zl(t, "resource");
}
/**
 * Wraps prompt handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function np(t) {
  Zl(t, "prompt");
}
/**
 * Wraps all MCP handler types (tool, resource, prompt) for span correlation
 * @param serverInstance - MCP server instance
 */ function sp(t) {
  tp(t);
  ep(t);
  np(t);
}
const op = "mcp.method.name";
const rp = "mcp.request.id";
const ip = "mcp.session.id";
const ap = "mcp.transport";
const cp = "mcp.server.name";
const up = "mcp.server.title";
const lp = "mcp.server.version";
const pp = "mcp.protocol.version";
const fp = "mcp.tool.name";
const dp = "mcp.resource.uri";
const mp = "mcp.prompt.name";
const gp = "mcp.tool.result.is_error";
const hp = "mcp.tool.result.content_count";
const _p = "mcp.prompt.result.description";
const yp = "mcp.prompt.result.message_count";
const bp = "mcp.request.argument";
const vp = "mcp.logging.level";
const Sp = "mcp.logging.logger";
const kp = "mcp.logging.data_type";
const wp = "mcp.logging.message";
const xp = "network.transport";
const Ap = "network.protocol.version";
const Ep = "client.address";
const Tp = "client.port";
const Ip = "mcp.server";
const $p = "mcp.notification.client_to_server";
const Op = "mcp.notification.server_to_client";
const Cp = "auto.function.mcp_server";
const Np = "auto.mcp.notification";
const jp = "route";
/**
 * Validates if a message is a JSON-RPC request
 * @param message - Message to validate
 * @returns True if message is a JSON-RPC request
 */ function Rp(t) {
  return (
    typeof t === "object" &&
    t !== null &&
    "jsonrpc" in t &&
    t.jsonrpc === "2.0" &&
    "method" in t &&
    "id" in t
  );
}
/**
 * Validates if a message is a JSON-RPC notification
 * @param message - Message to validate
 * @returns True if message is a JSON-RPC notification
 */ function Mp(t) {
  return (
    typeof t === "object" &&
    t !== null &&
    "jsonrpc" in t &&
    t.jsonrpc === "2.0" &&
    "method" in t &&
    !("id" in t)
  );
}
/**
 * Validates if a message is a JSON-RPC response
 * @param message - Message to validate
 * @returns True if message is a JSON-RPC response
 */ function Pp(t) {
  return (
    typeof t === "object" &&
    t !== null &&
    "jsonrpc" in t &&
    t.jsonrpc === "2.0" &&
    "id" in t &&
    ("result" in t || "error" in t)
  );
}
/**
 * Validates MCP server instance with type checking
 * @param instance - Object to validate as MCP server instance
 * @returns True if instance has required MCP server methods
 */ function Dp(e) {
  if (
    typeof e === "object" &&
    e !== null &&
    "resource" in e &&
    "tool" in e &&
    "prompt" in e &&
    "connect" in e
  )
    return true;
  t && y.warn("Did not patch MCP server. Interface is incompatible.");
  return false;
}
/**
 * Check if the item is a valid content item
 * @param item - The item to check
 * @returns True if the item is a valid content item, false otherwise
 */ function Fp(t) {
  return t != null && typeof t === "object";
}
/**
 * Build attributes for tool result content items
 * @param content - Array of content items from tool result
 * @param includeContent - Whether to include actual content (text, URIs) or just metadata
 * @returns Attributes extracted from each content item
 */ function Lp(t, e) {
  const n = { [hp]: t.length };
  for (const [s, o] of t.entries()) {
    if (!Fp(o)) continue;
    const r = t.length === 1 ? "mcp.tool.result" : `mcp.tool.result.${s}`;
    typeof o.type === "string" && (n[`${r}.content_type`] = o.type);
    if (e) {
      const t = (t, e) => {
        typeof e === "string" && (n[`${r}.${t}`] = e);
      };
      t("mime_type", o.mimeType);
      t("uri", o.uri);
      t("name", o.name);
      typeof o.text === "string" && (n[`${r}.content`] = o.text);
      typeof o.data === "string" && (n[`${r}.data_size`] = o.data.length);
      const e = o.resource;
      if (Fp(e)) {
        t("resource_uri", e.uri);
        t("resource_mime_type", e.mimeType);
      }
    }
  }
  return n;
}
/**
 * Extract tool result attributes for span instrumentation
 * @param result - Tool execution result
 * @param recordOutputs - Whether to include actual content or just metadata (counts, error status)
 * @returns Attributes extracted from tool result content
 */ function qp(t, e) {
  if (!Fp(t)) return {};
  const n = Array.isArray(t.content) ? Lp(t.content, e) : {};
  typeof t.isError === "boolean" && (n[gp] = t.isError);
  return n;
}
/**
 * Extract prompt result attributes for span instrumentation
 * @param result - Prompt execution result
 * @param recordOutputs - Whether to include actual content or just metadata (counts)
 * @returns Attributes extracted from prompt result
 */ function Up(t, e) {
  const n = {};
  if (!Fp(t)) return n;
  e && typeof t.description === "string" && (n[_p] = t.description);
  if (Array.isArray(t.messages)) {
    n[yp] = t.messages.length;
    if (e) {
      const e = t.messages;
      for (const [t, s] of e.entries()) {
        if (!Fp(s)) continue;
        const o =
          e.length === 1 ? "mcp.prompt.result" : `mcp.prompt.result.${t}`;
        const r = (t, s) => {
          if (typeof s === "string") {
            const r = e.length === 1 ? `${o}.message_${t}` : `${o}.${t}`;
            n[r] = s;
          }
        };
        r("role", s.role);
        if (Fp(s.content)) {
          const t = s.content;
          if (typeof t.text === "string") {
            const s = e.length === 1 ? `${o}.message_content` : `${o}.content`;
            n[s] = t.text;
          }
        }
      }
    }
  }
  return n;
}
const Jp = new Map();
const zp = new WeakMap();
function Bp(t) {
  const e = t.sessionId;
  return e ? Jp.get(e) : zp.get(t);
}
function Wp(t, e) {
  const n = t.sessionId;
  n ? Jp.set(n, e) : zp.set(t, e);
}
/**
 * Stores session data for a transport
 * @param transport - MCP transport instance
 * @param sessionData - Session data to store
 */ function Vp(t, e) {
  Wp(t, e);
}
/**
 * Updates session data for a transport (merges with existing data)
 * @param transport - MCP transport instance
 * @param partialSessionData - Partial session data to merge with existing data
 */ function Gp(t, e) {
  const n = Bp(t) || {};
  Wp(t, { ...n, ...e });
}
/**
 * Retrieves client information for a transport
 * @param transport - MCP transport instance
 * @returns Client information if available
 */ function Kp(t) {
  return Bp(t)?.clientInfo;
}
/**
 * Retrieves protocol version for a transport
 * @param transport - MCP transport instance
 * @returns Protocol version if available
 */ function Hp(t) {
  return Bp(t)?.protocolVersion;
}
/**
 * Retrieves full session data for a transport
 * @param transport - MCP transport instance
 * @returns Complete session data if available
 */ function Zp(t) {
  return Bp(t);
}
/**
 * Cleans up session data for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function Yp(t) {
  const e = t.sessionId;
  e && Jp.delete(e);
}
/**
 * Extracts and validates PartyInfo from an unknown object
 * @param obj - Unknown object that might contain party info
 * @returns Validated PartyInfo object with only string properties
 */ function Xp(t) {
  const e = {};
  if (Fp(t)) {
    typeof t.name === "string" && (e.name = t.name);
    typeof t.title === "string" && (e.title = t.title);
    typeof t.version === "string" && (e.version = t.version);
  }
  return e;
}
/**
 * Extracts session data from "initialize" requests
 * @param request - JSON-RPC "initialize" request containing client info and protocol version
 * @returns Session data extracted from request parameters including protocol version and client info
 */ function Qp(t) {
  const e = {};
  if (Fp(t.params)) {
    typeof t.params.protocolVersion === "string" &&
      (e.protocolVersion = t.params.protocolVersion);
    t.params.clientInfo && (e.clientInfo = Xp(t.params.clientInfo));
  }
  return e;
}
/**
 * Extracts session data from "initialize" response
 * @param result - "initialize" response result containing server info and protocol version
 * @returns Partial session data extracted from response including protocol version and server info
 */ function tf(t) {
  const e = {};
  if (Fp(t)) {
    typeof t.protocolVersion === "string" &&
      (e.protocolVersion = t.protocolVersion);
    t.serverInfo && (e.serverInfo = Xp(t.serverInfo));
  }
  return e;
}
/**
 * Build client attributes from stored client info
 * @param transport - MCP transport instance
 * @returns Client attributes for span instrumentation
 */ function ef(t) {
  const e = Kp(t);
  const n = {};
  e?.name && (n["mcp.client.name"] = e.name);
  e?.title && (n["mcp.client.title"] = e.title);
  e?.version && (n["mcp.client.version"] = e.version);
  return n;
}
/**
 * Build client attributes from PartyInfo directly
 * @param clientInfo - Client party info
 * @returns Client attributes for span instrumentation
 */ function nf(t) {
  const e = {};
  t?.name && (e["mcp.client.name"] = t.name);
  t?.title && (e["mcp.client.title"] = t.title);
  t?.version && (e["mcp.client.version"] = t.version);
  return e;
}
/**
 * Build server attributes from stored server info
 * @param transport - MCP transport instance
 * @returns Server attributes for span instrumentation
 */ function sf(t) {
  const e = Zp(t)?.serverInfo;
  const n = {};
  e?.name && (n[cp] = e.name);
  e?.title && (n[up] = e.title);
  e?.version && (n[lp] = e.version);
  return n;
}
/**
 * Build server attributes from PartyInfo directly
 * @param serverInfo - Server party info
 * @returns Server attributes for span instrumentation
 */ function of(t) {
  const e = {};
  t?.name && (e[cp] = t.name);
  t?.title && (e[up] = t.title);
  t?.version && (e[lp] = t.version);
  return e;
}
/**
 * Extracts client connection info from extra handler data
 * @param extra - Extra handler data containing connection info
 * @returns Client address and port information
 */ function rf(t) {
  return {
    address:
      t?.requestInfo?.remoteAddress ||
      t?.clientAddress ||
      t?.request?.ip ||
      t?.request?.connection?.remoteAddress,
    port:
      t?.requestInfo?.remotePort ||
      t?.clientPort ||
      t?.request?.connection?.remotePort,
  };
}
/**
 * Extracts transport types based on transport constructor name
 * @param transport - MCP transport instance
 * @returns Transport type mapping for span attributes
 */ function af(t) {
  if (!t?.constructor)
    return { mcpTransport: "unknown", networkTransport: "unknown" };
  const e =
    typeof t.constructor?.name === "string" ? t.constructor.name : "unknown";
  let n = "unknown";
  const s = e.toLowerCase();
  s.includes("stdio")
    ? (n = "pipe")
    : (s.includes("http") || s.includes("sse")) && (n = "tcp");
  return { mcpTransport: e, networkTransport: n };
}
/**
 * Build transport and network attributes
 * @param transport - MCP transport instance
 * @param extra - Optional extra handler data
 * @returns Transport attributes for span instrumentation
 * @note sessionId may be undefined during initial setup - session should be established by client during initialize flow
 */ function cf(t, e) {
  const n = t && "sessionId" in t ? t.sessionId : void 0;
  const s = e ? rf(e) : {};
  const { mcpTransport: o, networkTransport: r } = af(t);
  const i = ef(t);
  const a = sf(t);
  const c = Hp(t);
  const u = {
    ...(n && { [ip]: n }),
    ...(s.address && { [Ep]: s.address }),
    ...(s.port && { [Tp]: s.port }),
    [ap]: o,
    [xp]: r,
    [Ap]: "2.0",
    ...(c && { [pp]: c }),
    ...i,
    ...a,
  };
  return u;
}
const uf = new Map();
const lf = new WeakMap();
/**
 * Gets or creates the span map for a transport, using sessionId when available
 * @internal
 * @param transport - MCP transport instance
 * @returns Span map for the transport/session
 */ function pf(t) {
  const e = t.sessionId;
  if (e) {
    let t = uf.get(e);
    if (!t) {
      t = new Map();
      uf.set(e, t);
    }
    return t;
  }
  let n = lf.get(t);
  if (!n) {
    n = new Map();
    lf.set(t, n);
  }
  return n;
}
/**
 * Stores span context for later correlation with handler execution
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param span - Active span to correlate
 * @param method - MCP method name
 */ function ff(t, e, n, s) {
  const o = pf(t);
  o.set(e, { span: n, method: s, startTime: Date.now() });
}
/**
 * Completes span with results and cleans up correlation
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param result - Execution result for attribute extraction
 * @param options - Resolved MCP options
 */ function df(t, e, n, s) {
  const o = pf(t);
  const r = o.get(e);
  if (r) {
    const { span: t, method: i } = r;
    if (i === "initialize") {
      const e = tf(n);
      const s = of(e.serverInfo);
      const o = { ...s };
      e.protocolVersion && (o[pp] = e.protocolVersion);
      t.setAttributes(o);
    } else if (i === "tools/call") {
      const e = qp(n, s.recordOutputs);
      t.setAttributes(e);
    } else if (i === "prompts/get") {
      const e = Up(n, s.recordOutputs);
      t.setAttributes(e);
    }
    t.end();
    o.delete(e);
  }
}
/**
 * Cleans up pending spans for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function mf(t) {
  const e = t.sessionId;
  if (e) {
    const t = uf.get(e);
    if (t) {
      for (const [, e] of t) {
        e.span.setStatus({ code: Ze, message: "cancelled" });
        e.span.end();
      }
      uf.delete(e);
    }
    return;
  }
  const n = lf.get(t);
  if (n) {
    for (const [, t] of n) {
      t.span.setStatus({ code: Ze, message: "cancelled" });
      t.span.end();
    }
    n.clear();
  }
}
const gf = {
  "tools/call": {
    targetField: "name",
    targetAttribute: fp,
    captureArguments: true,
    argumentsField: "arguments",
  },
  "resources/read": {
    targetField: "uri",
    targetAttribute: dp,
    captureUri: true,
  },
  "resources/subscribe": { targetField: "uri", targetAttribute: dp },
  "resources/unsubscribe": { targetField: "uri", targetAttribute: dp },
  "prompts/get": {
    targetField: "name",
    targetAttribute: mp,
    captureName: true,
    captureArguments: true,
    argumentsField: "arguments",
  },
};
/**
 * Extracts target info from method and params based on method type
 * @param method - MCP method name
 * @param params - Method parameters
 * @returns Target name and attributes for span instrumentation
 */ function hf(t, e) {
  const n = gf[t];
  if (!n) return { attributes: {} };
  const s =
    n.targetField && typeof e?.[n.targetField] === "string"
      ? e[n.targetField]
      : void 0;
  return {
    target: s,
    attributes: s && n.targetAttribute ? { [n.targetAttribute]: s } : {},
  };
}
/**
 * Extracts request arguments based on method type
 * @param method - MCP method name
 * @param params - Method parameters
 * @returns Arguments as span attributes with mcp.request.argument prefix
 */ function _f(t, e) {
  const n = {};
  const s = gf[t];
  if (!s) return n;
  if (s.captureArguments && s.argumentsField && e?.[s.argumentsField]) {
    const t = e[s.argumentsField];
    if (typeof t === "object" && t !== null)
      for (const [e, s] of Object.entries(t))
        n[`${bp}.${e.toLowerCase()}`] = JSON.stringify(s);
  }
  s.captureUri && e?.uri && (n[`${bp}.uri`] = JSON.stringify(e.uri));
  s.captureName && e?.name && (n[`${bp}.name`] = JSON.stringify(e.name));
  return n;
}
function yf(t) {
  return typeof t === "string" ? t : JSON.stringify(t);
}
/**
 * Extracts additional attributes for specific notification types
 * @param method - Notification method name
 * @param params - Notification parameters
 * @param recordInputs - Whether to include actual content or just metadata
 * @returns Method-specific attributes for span instrumentation
 */ function bf(t, e, n) {
  const s = {};
  switch (t) {
    case "notifications/cancelled":
      e?.requestId && (s["mcp.cancelled.request_id"] = String(e.requestId));
      e?.reason && (s["mcp.cancelled.reason"] = String(e.reason));
      break;
    case "notifications/message":
      e?.level && (s[vp] = String(e.level));
      e?.logger && (s[Sp] = String(e.logger));
      if (e?.data !== void 0) {
        s[kp] = typeof e.data;
        n && (s[wp] = yf(e.data));
      }
      break;
    case "notifications/progress":
      e?.progressToken && (s["mcp.progress.token"] = String(e.progressToken));
      typeof e?.progress === "number" &&
        (s["mcp.progress.current"] = e.progress);
      if (typeof e?.total === "number") {
        s["mcp.progress.total"] = e.total;
        typeof e?.progress === "number" &&
          (s["mcp.progress.percentage"] = (e.progress / e.total) * 100);
      }
      e?.message && (s["mcp.progress.message"] = String(e.message));
      break;
    case "notifications/resources/updated":
      if (e?.uri) {
        s[dp] = String(e.uri);
        const t = Ea(String(e.uri));
        t &&
          !Aa(t) &&
          (s["mcp.resource.protocol"] = t.protocol.replace(":", ""));
      }
      break;
    case "notifications/initialized":
      s["mcp.lifecycle.phase"] = "initialization_complete";
      s["mcp.protocol.ready"] = 1;
      break;
  }
  return s;
}
/**
 * Build type-specific attributes based on message type
 * @param type - Span type (request or notification)
 * @param message - JSON-RPC message
 * @param params - Optional parameters for attribute extraction
 * @param recordInputs - Whether to capture input arguments in spans
 * @returns Type-specific attributes for span instrumentation
 */ function vf(t, e, n, s) {
  if (t === "request") {
    const t = e;
    const o = hf(t.method, n || {});
    return {
      ...(t.id !== void 0 && { [rp]: String(t.id) }),
      ...o.attributes,
      ...(s ? _f(t.method, n || {}) : {}),
    };
  }
  return bf(e.method, n || {}, s);
}
const Sf = new Set([Ep, Tp, dp]);
/**
 * Checks if an attribute key should be considered network PII.
 *
 * Returns true for:
 * - client.address (IP address)
 * - client.port (port number)
 * - mcp.resource.uri (potentially sensitive URIs)
 *
 * @param key - Attribute key to evaluate
 * @returns true if the attribute should be filtered out (is network PII), false if it should be preserved
 * @internal
 */ function kf(t) {
  return Sf.has(t);
}
/**
 * Removes network PII attributes from span data when sendDefaultPii is false
 * @param spanData - Raw span attributes
 * @param sendDefaultPii - Whether to include PII data
 * @returns Filtered span attributes
 */ function wf(t, e) {
  return e
    ? t
    : Object.entries(t).reduce((t, [e, n]) => {
        kf(e) || (t[e] = n);
        return t;
      }, {});
}
/**
 * Creates a span name based on the method and target
 * @internal
 * @param method - MCP method name
 * @param target - Optional target identifier
 * @returns Formatted span name
 */ function xf(t, e) {
  return e ? `${t} ${e}` : t;
}
/**
 * Build Sentry-specific attributes based on span type
 * @internal
 * @param type - Span type configuration
 * @returns Sentry-specific attributes
 */ function Af(t) {
  let e;
  let n;
  switch (t) {
    case "request":
      e = Ip;
      n = Cp;
      break;
    case "notification-incoming":
      e = $p;
      n = Np;
      break;
    case "notification-outgoing":
      e = Op;
      n = Np;
      break;
  }
  return { [je]: e, [Re]: n, [Oe]: jp };
}
/**
 * Unified builder for creating MCP spans
 * @internal
 * @param config - Span configuration
 * @returns Created span
 */ function Ef(t) {
  const {
    type: e,
    message: n,
    transport: s,
    extra: o,
    callback: r,
    options: i,
  } = t;
  const { method: a } = n;
  const c = n.params;
  let u;
  if (e === "request") {
    const t = hf(a, c || {});
    u = xf(a, t.target);
  } else u = a;
  const l = { ...cf(s, o), [op]: a, ...vf(e, n, c, i?.recordInputs), ...Af(e) };
  const p = Ie();
  const f = Boolean(p?.getOptions().sendDefaultPii);
  const d = wf(l, f);
  return oo({ name: u, forceTransaction: true, attributes: d }, r);
}
/**
 * Creates a span for incoming MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param extra - Extra handler data
 * @param options - Resolved MCP options
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function Tf(t, e, n, s, o) {
  return Ef({
    type: "notification-incoming",
    message: t,
    transport: e,
    extra: n,
    callback: o,
    options: s,
  });
}
/**
 * Creates a span for outgoing MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param options - Resolved MCP options
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function If(t, e, n, s) {
  return Ef({
    type: "notification-outgoing",
    message: t,
    transport: e,
    options: n,
    callback: s,
  });
}
/**
 * Builds span configuration for MCP server requests
 * @param jsonRpcMessage - Request message
 * @param transport - MCP transport instance
 * @param extra - Optional extra handler data
 * @param options - Resolved MCP options
 * @returns Span configuration object
 */ function $f(t, e, n, s) {
  const { method: o } = t;
  const r = t.params;
  const i = hf(o, r || {});
  const a = xf(o, i.target);
  const c = {
    ...cf(e, n),
    [op]: o,
    ...vf("request", t, r, s?.recordInputs),
    ...Af("request"),
  };
  const u = Ie();
  const l = Boolean(u?.getOptions().sendDefaultPii);
  const p = wf(c, l);
  return { name: a, op: Ip, forceTransaction: true, attributes: p };
}
/**
 * Wraps transport.onmessage to create spans for incoming messages.
 * For "initialize" requests, extracts and stores client info and protocol version
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 * @param options - Resolved MCP options
 */ function Of(t, e) {
  t.onmessage &&
    mt(
      t,
      "onmessage",
      (t) =>
        function (n, s) {
          if (Rp(n)) {
            const o = n.method === "initialize";
            let r;
            if (o)
              try {
                r = Qp(n);
                Vp(this, r);
              } catch {}
            const i = xe().clone();
            return Te(i, () => {
              const i = $f(n, this, s, e);
              const a = io(i);
              o &&
                r &&
                a.setAttributes({
                  ...nf(r.clientInfo),
                  ...(r.protocolVersion && { [pp]: r.protocolVersion }),
                });
              ff(this, n.id, a, n.method);
              return co(a, () => t.call(this, n, s));
            });
          }
          return Mp(n)
            ? Tf(n, this, s, e, () => t.call(this, n, s))
            : t.call(this, n, s);
        },
    );
}
/**
 * Wraps transport.send to handle outgoing messages and response correlation.
 * For "initialize" responses, extracts and stores protocol version and server info
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 * @param options - Resolved MCP options
 */ function Cf(t, e) {
  t.send &&
    mt(
      t,
      "send",
      (t) =>
        async function (...n) {
          const [s] = n;
          if (Mp(s)) return If(s, this, e, () => t.call(this, ...n));
          if (Pp(s) && s.id !== null && s.id !== void 0) {
            s.error && Rf(s.error);
            if (
              Fp(s.result) &&
              (s.result.protocolVersion || s.result.serverInfo)
            )
              try {
                const t = tf(s.result);
                Gp(this, t);
              } catch {}
            df(this, s.id, s.result, e);
          }
          return t.call(this, ...n);
        },
    );
}
/**
 * Wraps transport.onclose to clean up pending spans for this transport only
 * @param transport - MCP transport instance to wrap
 */ function Nf(t) {
  t.onclose &&
    mt(
      t,
      "onclose",
      (t) =>
        function (...e) {
          mf(this);
          Yp(this);
          return t.call(this, ...e);
        },
    );
}
/**
 * Wraps transport error handlers to capture connection errors
 * @param transport - MCP transport instance to wrap
 */ function jf(t) {
  t.onerror &&
    mt(
      t,
      "onerror",
      (t) =>
        function (e) {
          Mf(e);
          return t.call(this, e);
        },
    );
}
/**
 * Captures JSON-RPC error responses for server-side errors.
 * @see https://www.jsonrpc.org/specification#error_object
 * @internal
 * @param errorResponse - JSON-RPC error response
 */ function Rf(t) {
  try {
    if (t && typeof t === "object" && "code" in t && "message" in t) {
      const e = t;
      const n = e.code === -32603 || (e.code >= -32099 && e.code <= -32e3);
      if (n) {
        const t = new Error(e.message);
        t.name = `JsonRpcError_${e.code}`;
        Hl(t, "protocol");
      }
    }
  } catch {}
}
/**
 * Captures transport connection errors
 * @internal
 * @param error - Transport error
 */ function Mf(t) {
  try {
    Hl(t, "transport");
  } catch {}
}
const Pf = new WeakSet();
/**
 * Wraps a MCP Server instance from the `@modelcontextprotocol/sdk` package with Sentry instrumentation.
 *
 * Compatible with versions `^1.9.0` of the `@modelcontextprotocol/sdk` package.
 * Automatically instruments transport methods and handler functions for comprehensive monitoring.
 *
 * @example
 * ```typescript
 * import * as Sentry from '@sentry/core';
 * import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
 * import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
 *
 * // Default: inputs/outputs captured based on sendDefaultPii option
 * const server = Sentry.wrapMcpServerWithSentry(
 *   new McpServer({ name: "my-server", version: "1.0.0" })
 * );
 *
 * // Explicitly control input/output capture
 * const server = Sentry.wrapMcpServerWithSentry(
 *   new McpServer({ name: "my-server", version: "1.0.0" }),
 *   { recordInputs: true, recordOutputs: false }
 * );
 *
 * const transport = new StreamableHTTPServerTransport();
 * await server.connect(transport);
 * ```
 *
 * @param mcpServerInstance - MCP server instance to instrument
 * @param options - Optional configuration for recording inputs and outputs
 * @returns Instrumented server instance (same reference)
 */ function Df(t, e) {
  if (Pf.has(t)) return t;
  if (!Dp(t)) return t;
  const n = t;
  const s = Ie();
  const o = Boolean(s?.getOptions().sendDefaultPii);
  const r = {
    recordInputs: e?.recordInputs ?? o,
    recordOutputs: e?.recordOutputs ?? o,
  };
  mt(
    n,
    "connect",
    (t) =>
      async function (e, ...n) {
        const s = await t.call(this, e, ...n);
        Of(e, r);
        Cf(e, r);
        Nf(e);
        jf(e);
        return s;
      },
  );
  sp(n);
  Pf.add(t);
  return t;
}
function Ff(t, e = {}, n = we()) {
  const {
    message: s,
    name: o,
    email: r,
    url: i,
    source: a,
    associatedEventId: c,
    tags: u,
  } = t;
  const l = {
    contexts: {
      feedback: {
        contact_email: r,
        name: o,
        message: s,
        url: i,
        source: a,
        associated_event_id: c,
      },
    },
    type: "feedback",
    level: "info",
    tags: u,
  };
  const p = n?.getClient() || Ie();
  p && p.emit("beforeSendFeedback", l, e);
  const f = n.captureEvent(l, e);
  return f;
}
/**
 * Capture a log with the given level.
 *
 * @param level - The level of the log.
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., userId: 100.
 * @param scope - The scope to capture the log with.
 * @param severityNumber - The severity number of the log.
 */ function Lf(t, e, n, s, o) {
  Xr({ level: t, message: e, attributes: n, severityNumber: o }, s);
}
/**
 * @summary Capture a log with the `trace` level. Requires the `enableLogs` option to be enabled.
 *
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., { userId: 100, route: '/dashboard' }.
 * @param metadata - additional metadata to capture the log with.
 *
 * @example
 *
 * ```
 * Sentry.logger.trace('User clicked submit button', {
 *   buttonId: 'submit-form',
 *   formId: 'user-profile',
 *   timestamp: Date.now()
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.trace(Sentry.logger.fmt`User ${user} navigated to ${page}`, {
 *   userId: '123',
 *   sessionId: 'abc-xyz'
 * });
 * ```
 */ function qf(t, e, { scope: n } = {}) {
  Lf("trace", t, e, n);
}
/**
 * @summary Capture a log with the `debug` level. Requires the `enableLogs` option to be enabled.
 *
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., { component: 'Header', state: 'loading' }.
 * @param metadata - additional metadata to capture the log with.
 *
 * @example
 *
 * ```
 * Sentry.logger.debug('Component mounted', {
 *   component: 'UserProfile',
 *   props: { userId: 123 },
 *   renderTime: 150
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.debug(Sentry.logger.fmt`API request to ${endpoint} failed`, {
 *   statusCode: 404,
 *   requestId: 'req-123',
 *   duration: 250
 * });
 * ```
 */ function Uf(t, e, { scope: n } = {}) {
  Lf("debug", t, e, n);
}
/**
 * @summary Capture a log with the `info` level. Requires the `enableLogs` option to be enabled.
 *
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., { feature: 'checkout', status: 'completed' }.
 * @param metadata - additional metadata to capture the log with.
 *
 * @example
 *
 * ```
 * Sentry.logger.info('User completed checkout', {
 *   orderId: 'order-123',
 *   amount: 99.99,
 *   paymentMethod: 'credit_card'
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.info(Sentry.logger.fmt`User ${user} updated profile picture`, {
 *   userId: 'user-123',
 *   imageSize: '2.5MB',
 *   timestamp: Date.now()
 * });
 * ```
 */ function Jf(t, e, { scope: n } = {}) {
  Lf("info", t, e, n);
}
/**
 * @summary Capture a log with the `warn` level. Requires the `enableLogs` option to be enabled.
 *
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., { browser: 'Chrome', version: '91.0' }.
 * @param metadata - additional metadata to capture the log with.
 *
 * @example
 *
 * ```
 * Sentry.logger.warn('Browser compatibility issue detected', {
 *   browser: 'Safari',
 *   version: '14.0',
 *   feature: 'WebRTC',
 *   fallback: 'enabled'
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.warn(Sentry.logger.fmt`API endpoint ${endpoint} is deprecated`, {
 *   recommendedEndpoint: '/api/v2/users',
 *   sunsetDate: '2024-12-31',
 *   clientVersion: '1.2.3'
 * });
 * ```
 */ function zf(t, e, { scope: n } = {}) {
  Lf("warn", t, e, n);
}
/**
 * @summary Capture a log with the `error` level. Requires the `enableLogs` option to be enabled.
 *
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., { error: 'NetworkError', url: '/api/data' }.
 * @param metadata - additional metadata to capture the log with.
 *
 * @example
 *
 * ```
 * Sentry.logger.error('Failed to load user data', {
 *   error: 'NetworkError',
 *   url: '/api/users/123',
 *   statusCode: 500,
 *   retryCount: 3
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.error(Sentry.logger.fmt`Payment processing failed for order ${orderId}`, {
 *   error: 'InsufficientFunds',
 *   amount: 100.00,
 *   currency: 'USD',
 *   userId: 'user-456'
 * });
 * ```
 */ function Bf(t, e, { scope: n } = {}) {
  Lf("error", t, e, n);
}
/**
 * @summary Capture a log with the `fatal` level. Requires the `enableLogs` option to be enabled.
 *
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., { appState: 'corrupted', sessionId: 'abc-123' }.
 * @param metadata - additional metadata to capture the log with.
 *
 * @example
 *
 * ```
 * Sentry.logger.fatal('Application state corrupted', {
 *   lastKnownState: 'authenticated',
 *   sessionId: 'session-123',
 *   timestamp: Date.now(),
 *   recoveryAttempted: true
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.fatal(Sentry.logger.fmt`Critical system failure in ${service}`, {
 *   service: 'payment-processor',
 *   errorCode: 'CRITICAL_FAILURE',
 *   affectedUsers: 150,
 *   timestamp: Date.now()
 * });
 * ```
 */ function Wf(t, e, { scope: n } = {}) {
  Lf("fatal", t, e, n);
}
var Vf = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      debug: Uf,
      error: Bf,
      fatal: Wf,
      fmt: La,
      info: Jf,
      trace: qf,
      warn: zf,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
/**
 * Formats the given values into a string.
 *
 * @param values - The values to format.
 * @param normalizeDepth - The depth to normalize the values.
 * @param normalizeMaxBreadth - The max breadth to normalize the values.
 * @returns The formatted string.
 */ function Gf(t, n, s) {
  return "util" in e && typeof e.util.format === "function"
    ? e.util.format(...t)
    : Kf(t, n, s);
}
/**
 * Joins the given values into a string.
 *
 * @param values - The values to join.
 * @param normalizeDepth - The depth to normalize the values.
 * @param normalizeMaxBreadth - The max breadth to normalize the values.
 * @returns The joined string.
 */ function Kf(t, e, n) {
  return t
    .map((t) => (X(t) ? String(t) : JSON.stringify(_s(t, e, n))))
    .join(" ");
}
/**
 * Checks if a string contains console substitution patterns like %s, %d, %i, %f, %o, %O, %c.
 *
 * @param str - The string to check
 * @returns true if the string contains console substitution patterns
 */ function Hf(t) {
  return /%[sdifocO]/.test(t);
}
/**
 * Creates template attributes for multiple console arguments.
 *
 * @param args - The console arguments
 * @returns An object with template and parameter attributes
 */ function Zf(t, e) {
  const n = {};
  const s = new Array(e.length).fill("{}").join(" ");
  n["sentry.message.template"] = `${t} ${s}`;
  e.forEach((t, e) => {
    n[`sentry.message.parameter.${e}`] = t;
  });
  return n;
}
const Yf = "ConsoleLogs";
const Xf = { [Re]: "auto.log.console" };
const Qf = (e = {}) => {
  const n = e.levels || i;
  return {
    name: Yf,
    setup(e) {
      const {
        enableLogs: s,
        normalizeDepth: o = 3,
        normalizeMaxBreadth: r = 1e3,
      } = e.getOptions();
      s
        ? ou(({ args: t, level: s }) => {
            if (Ie() !== e || !n.includes(s)) return;
            const i = t[0];
            const a = t.slice(1);
            if (s === "assert") {
              if (!i) {
                const t =
                  a.length > 0
                    ? `Assertion failed: ${Gf(a, o, r)}`
                    : "Assertion failed";
                Xr({ level: "error", message: t, attributes: Xf });
              }
              return;
            }
            const c = s === "log";
            const u = t.length > 1 && typeof t[0] === "string" && !Hf(t[0]);
            const l = { ...Xf, ...(u ? Zf(i, a) : {}) };
            Xr({
              level: c ? "info" : s,
              message: Gf(t, o, r),
              severityNumber: c ? 10 : void 0,
              attributes: l,
            });
          })
        : t &&
          y.warn(
            "`enableLogs` is not enabled, ConsoleLogs integration disabled",
          );
    },
  };
};
const td = qr(Qf);
/**
 * Capture a metric with the given type, name, and value.
 *
 * @param type - The type of the metric.
 * @param name - The name of the metric.
 * @param value - The value of the metric.
 * @param options - Options for capturing the metric.
 */ function ed(t, e, n, s) {
  ui(
    { type: t, name: e, value: n, unit: s?.unit, attributes: s?.attributes },
    { scope: s?.scope },
  );
}
/**
 * @summary Increment a counter metric.
 *
 * @param name - The name of the counter metric.
 * @param value - The value to increment by (defaults to 1).
 * @param options - Options for capturing the metric.
 *
 * @example
 *
 * ```
 * Sentry.metrics.count('api.requests', 1, {
 *   attributes: {
 *     endpoint: '/api/users',
 *     method: 'GET',
 *     status: 200
 *   }
 * });
 * ```
 *
 * @example With custom value
 *
 * ```
 * Sentry.metrics.count('items.processed', 5, {
 *   attributes: {
 *     processor: 'batch-processor',
 *     queue: 'high-priority'
 *   }
 * });
 * ```
 */ function nd(t, e = 1, n) {
  ed("counter", t, e, n);
}
/**
 * @summary Set a gauge metric to a specific value.
 *
 * @param name - The name of the gauge metric.
 * @param value - The current value of the gauge.
 * @param options - Options for capturing the metric.
 *
 * @example
 *
 * ```
 * Sentry.metrics.gauge('memory.usage', 1024, {
 *   unit: 'megabyte',
 *   attributes: {
 *     process: 'web-server',
 *     region: 'us-east-1'
 *   }
 * });
 * ```
 *
 * @example Without unit
 *
 * ```
 * Sentry.metrics.gauge('active.connections', 42, {
 *   attributes: {
 *     server: 'api-1',
 *     protocol: 'websocket'
 *   }
 * });
 * ```
 */ function sd(t, e, n) {
  ed("gauge", t, e, n);
}
/**
 * @summary Record a value in a distribution metric.
 *
 * @param name - The name of the distribution metric.
 * @param value - The value to record in the distribution.
 * @param options - Options for capturing the metric.
 *
 * @example
 *
 * ```
 * Sentry.metrics.distribution('task.duration', 500, {
 *   unit: 'millisecond',
 *   attributes: {
 *     task: 'data-processing',
 *     priority: 'high'
 *   }
 * });
 * ```
 *
 * @example Without unit
 *
 * ```
 * Sentry.metrics.distribution('batch.size', 100, {
 *   attributes: {
 *     processor: 'batch-1',
 *     type: 'async'
 *   }
 * });
 * ```
 */ function od(t, e, n) {
  ed("distribution", t, e, n);
}
var rd = Object.freeze(
  Object.defineProperty(
    { __proto__: null, count: nd, distribution: od, gauge: sd },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
const id = ["trace", "debug", "info", "warn", "error", "fatal"];
/**
 * Creates a new Sentry reporter for Consola that forwards logs to Sentry. Requires the `enableLogs` option to be enabled.
 *
 * **Note: This integration supports Consola v3.x only.** The reporter interface and log object structure
 * may differ in other versions of Consola.
 *
 * @param options - Configuration options for the reporter.
 * @returns A Consola reporter that can be added to consola instances.
 *
 * @example
 * ```ts
 * import * as Sentry from '@sentry/node';
 * import { consola } from 'consola';
 *
 * Sentry.init({
 *   enableLogs: true,
 * });
 *
 * const sentryReporter = Sentry.createConsolaReporter({
 *   // Optional: filter levels to capture
 *   levels: ['error', 'warn', 'info'],
 * });
 *
 * consola.addReporter(sentryReporter);
 *
 * // Now consola logs will be captured by Sentry
 * consola.info('This will be sent to Sentry');
 * consola.error('This error will also be sent to Sentry');
 * ```
 */ function ad(t = {}) {
  const e = new Set(t.levels ?? id);
  const n = t.client;
  return {
    log(t) {
      const {
        type: s,
        level: o,
        message: r,
        args: i,
        tag: a,
        date: c,
        ...u
      } = t;
      const l = n || Ie();
      if (!l) return;
      const p = ld(s, o);
      if (!e.has(p)) return;
      const { normalizeDepth: f = 3, normalizeMaxBreadth: d = 1e3 } =
        l.getOptions();
      const m = [];
      r && m.push(r);
      i && i.length > 0 && m.push(Gf(i, f, d));
      const g = m.join(" ");
      u["sentry.origin"] = "auto.log.consola";
      a && (u["consola.tag"] = a);
      s && (u["consola.type"] = s);
      o != null && typeof o === "number" && (u["consola.level"] = o);
      Xr({ level: p, message: g, attributes: u });
    },
  };
}
const cd = {
  silent: "trace",
  fatal: "fatal",
  error: "error",
  warn: "warn",
  log: "info",
  info: "info",
  success: "info",
  fail: "error",
  ready: "info",
  start: "info",
  box: "info",
  debug: "debug",
  trace: "trace",
  verbose: "debug",
  critical: "fatal",
  notice: "info",
};
const ud = {
  0: "fatal",
  1: "warn",
  2: "info",
  3: "info",
  4: "debug",
  5: "trace",
};
/**
 * Determines the log severity level from Consola type and level.
 *
 * @param type - The Consola log type (e.g., 'error', 'warn', 'info')
 * @param level - The Consola numeric log level (0-5) or null for some types like 'verbose'
 * @returns The corresponding Sentry log severity level
 */ function ld(t, e) {
  if (t === "verbose") return "debug";
  if (t === "silent") return "trace";
  if (t) {
    const e = cd[t];
    if (e) return e;
  }
  if (typeof e === "number") {
    const t = ud[e];
    if (t) return t;
  }
  return "info";
}
const pd = "gen_ai.prompt";
const fd = "gen_ai.system";
const dd = "gen_ai.request.model";
const md = "gen_ai.request.stream";
const gd = "gen_ai.request.temperature";
const hd = "gen_ai.request.max_tokens";
const _d = "gen_ai.request.frequency_penalty";
const yd = "gen_ai.request.presence_penalty";
const bd = "gen_ai.request.top_p";
const vd = "gen_ai.request.top_k";
const Sd = "gen_ai.request.encoding_format";
const kd = "gen_ai.request.dimensions";
const wd = "gen_ai.response.finish_reasons";
const xd = "gen_ai.response.model";
const Ad = "gen_ai.response.id";
const Ed = "gen_ai.response.stop_reason";
const Td = "gen_ai.usage.input_tokens";
const Id = "gen_ai.usage.output_tokens";
const $d = "gen_ai.usage.total_tokens";
const Od = "gen_ai.operation.name";
const Cd = "sentry.sdk_meta.gen_ai.input.messages.original_length";
const Nd = "gen_ai.input.messages";
const jd = "gen_ai.system_instructions";
const Rd = "gen_ai.response.text";
const Md = "gen_ai.request.available_tools";
const Pd = "gen_ai.response.streaming";
const Dd = "gen_ai.response.tool_calls";
const Fd = "gen_ai.agent.name";
const Ld = "gen_ai.pipeline.name";
const qd = "gen_ai.conversation.id";
const Ud = "gen_ai.usage.cache_creation_input_tokens";
const Jd = "gen_ai.usage.cache_read_input_tokens";
const zd = "gen_ai.usage.input_tokens.cache_write";
const Bd = "gen_ai.usage.input_tokens.cached";
const Wd = "gen_ai.invoke_agent";
const Vd = "gen_ai.generate_text";
const Gd = "gen_ai.stream_text";
const Kd = "gen_ai.generate_object";
const Hd = "gen_ai.stream_object";
const Zd = "gen_ai.embeddings.input";
const Yd = "gen_ai.embed";
const Xd = "gen_ai.embed_many";
const Qd = "gen_ai.rerank";
const tm = "gen_ai.execute_tool";
const em = "gen_ai.tool.name";
const nm = "gen_ai.tool.call.id";
const sm = "gen_ai.tool.type";
const om = "gen_ai.tool.input";
const rm = "gen_ai.tool.output";
const im = "openai.response.id";
const am = "openai.response.model";
const cm = "openai.response.timestamp";
const um = "openai.usage.completion_tokens";
const lm = "openai.usage.prompt_tokens";
const pm = { CHAT: "chat", EMBEDDINGS: "embeddings" };
const fm = "anthropic.response.timestamp";
const dm = new Map();
const mm = new Set([
  "ai.generateText",
  "ai.streamText",
  "ai.generateObject",
  "ai.streamObject",
  "ai.embed",
  "ai.embedMany",
  "ai.rerank",
]);
const gm = new Set([
  "ai.generateText.doGenerate",
  "ai.streamText.doStream",
  "ai.generateObject.doGenerate",
  "ai.streamObject.doStream",
]);
const hm = new Set(["ai.embed.doEmbed", "ai.embedMany.doEmbed"]);
const _m = new Set(["ai.rerank.doRerank"]);
const ym = 2e4;
const bm = (t) => new TextEncoder().encode(t).length;
const vm = (t) => bm(JSON.stringify(t));
/**
 * Truncate a string to fit within maxBytes when encoded as UTF-8.
 * Uses binary search for efficiency with multi-byte characters.
 *
 * @param text - The string to truncate
 * @param maxBytes - Maximum byte length (UTF-8 encoded)
 * @returns Truncated string that fits within maxBytes
 */ function Sm(t, e) {
  if (bm(t) <= e) return t;
  let n = 0;
  let s = t.length;
  let o = "";
  while (n <= s) {
    const r = Math.floor((n + s) / 2);
    const i = t.slice(0, r);
    const a = bm(i);
    if (a <= e) {
      o = i;
      n = r + 1;
    } else s = r - 1;
  }
  return o;
}
/**
 * Extract text content from a Google GenAI message part.
 * Parts are either plain strings or objects with a text property.
 *
 * @returns The text content
 */ function km(t) {
  return typeof t === "string" ? t : "text" in t ? t.text : "";
}
/**
 * Create a new part with updated text content while preserving the original structure.
 *
 * @param part - Original part (string or object)
 * @param text - New text content
 * @returns New part with updated text
 */ function wm(t, e) {
  return typeof t === "string" ? e : { ...t, text: e };
}
function xm(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "content" in t &&
    typeof t.content === "string"
  );
}
function Am(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "content" in t &&
    Array.isArray(t.content)
  );
}
function Em(t) {
  return (
    !(!t || typeof t !== "object") &&
    (Tm(t) ||
      Im(t) ||
      ("media_type" in t && typeof t.media_type === "string" && "data" in t) ||
      ("image_url" in t &&
        typeof t.image_url === "string" &&
        t.image_url.startsWith("data:")) ||
      ("type" in t && (t.type === "blob" || t.type === "base64")) ||
      "b64_json" in t ||
      ("type" in t && "result" in t && t.type === "image_generation") ||
      ("uri" in t && typeof t.uri === "string" && t.uri.startsWith("data:")))
  );
}
function Tm(t) {
  return (
    "type" in t && typeof t.type === "string" && "source" in t && Em(t.source)
  );
}
function Im(t) {
  return (
    "inlineData" in t &&
    !!t.inlineData &&
    typeof t.inlineData === "object" &&
    "data" in t.inlineData &&
    typeof t.inlineData.data === "string"
  );
}
function $m(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "parts" in t &&
    Array.isArray(t.parts) &&
    t.parts.length > 0
  );
}
/**
 * Truncate a message with `content: string` format (OpenAI/Anthropic).
 *
 * @param message - Message with content property
 * @param maxBytes - Maximum byte limit
 * @returns Array with truncated message, or empty array if it doesn't fit
 */ function Om(t, e) {
  const n = { ...t, content: "" };
  const s = vm(n);
  const o = e - s;
  if (o <= 0) return [];
  const r = Sm(t.content, o);
  return [{ ...t, content: r }];
}
/**
 * Truncate a message with `parts: [...]` format (Google GenAI).
 * Keeps as many complete parts as possible, only truncating the first part if needed.
 *
 * @param message - Message with parts array
 * @param maxBytes - Maximum byte limit
 * @returns Array with truncated message, or empty array if it doesn't fit
 */ function Cm(t, e) {
  const { parts: n } = t;
  const s = n.map((t) => wm(t, ""));
  const o = vm({ ...t, parts: s });
  let r = e - o;
  if (r <= 0) return [];
  const i = [];
  for (const t of n) {
    const e = km(t);
    const n = bm(e);
    if (!(n <= r)) {
      if (i.length === 0) {
        const n = Sm(e, r);
        n && i.push(wm(t, n));
        break;
      }
      break;
    }
    i.push(t);
    r -= n;
  }
  return i.length <= 0 ? [] : [{ ...t, parts: i }];
}
/**
 * Truncate a single message to fit within maxBytes.
 *
 * Supports two message formats:
 * - OpenAI/Anthropic: `{ ..., content: string }`
 * - Google GenAI: `{ ..., parts: Array<string | {text: string} | non-text> }`
 *
 * @param message - The message to truncate
 * @param maxBytes - Maximum byte limit for the message
 * @returns Array containing the truncated message, or empty array if truncation fails
 */ function Nm(t, e) {
  if (!t) return [];
  if (typeof t === "string") {
    const n = Sm(t, e);
    return n ? [n] : [];
  }
  return typeof t !== "object" ? [] : xm(t) ? Om(t, e) : $m(t) ? Cm(t, e) : [];
}
const jm = "[Filtered]";
const Rm = ["image_url", "data", "content", "b64_json", "result", "uri"];
function Mm(t) {
  const e = { ...t };
  Em(e.source) && (e.source = Mm(e.source));
  Im(t) && (e.inlineData = { ...t.inlineData, data: jm });
  for (const t of Rm) typeof e[t] === "string" && (e[t] = jm);
  return e;
}
function Pm(t) {
  const e = t.map((t) => {
    let e;
    if (!!t && typeof t === "object") {
      Am(t)
        ? (e = { ...t, content: Pm(t.content) })
        : "content" in t &&
          Em(t.content) &&
          (e = { ...t, content: Mm(t.content) });
      $m(t) && (e = { ...(e ?? t), parts: Pm(t.parts) });
      Em(e) ? (e = Mm(e)) : Em(t) && (e = Mm(t));
    }
    return e ?? t;
  });
  return e;
}
/**
 * Truncate an array of messages to fit within a byte limit.
 *
 * Strategy:
 * - Always keeps only the last (newest) message
 * - Strips inline media from the message
 * - Truncates the message content if it exceeds the byte limit
 *
 * @param messages - Array of messages to truncate
 * @param maxBytes - Maximum total byte limit for the message
 * @returns Array containing only the last message (possibly truncated)
 *
 * @example
 * ```ts
 * const messages = [msg1, msg2, msg3, msg4]; // newest is msg4
 * const truncated = truncateMessagesByBytes(messages, 10000);
 * // Returns [msg4] (truncated if needed)
 * ```
 */ function Dm(t, e) {
  if (!Array.isArray(t) || t.length === 0) return t;
  const n = t[t.length - 1];
  const s = Pm([n]);
  const o = s[0];
  const r = vm(o);
  return r <= e ? s : Nm(o, e);
}
/**
 * Truncate GenAI messages using the default byte limit.
 *
 * Convenience wrapper around `truncateMessagesByBytes` with the default limit.
 *
 * @param messages - Array of messages to truncate
 * @returns Truncated array of messages
 */ function Fm(t) {
  return Dm(t, ym);
}
/**
 * Truncate GenAI string input using the default byte limit.
 *
 * @param input - The string to truncate
 * @returns Truncated string
 */ function Lm(t) {
  return Sm(t, ym);
}
function qm(t) {
  return t.includes("messages")
    ? "chat"
    : t.includes("completions")
      ? "text_completion"
      : t.includes("generateContent")
        ? "generate_content"
        : t.includes("models")
          ? "models"
          : t.includes("chat")
            ? "chat"
            : t.split(".").pop() || "unknown";
}
function Um(t) {
  return `gen_ai.${qm(t)}`;
}
function Jm(t, e) {
  return t ? `${t}.${e}` : e;
}
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param cachedInputTokens - The number of cached input tokens
 * @param cachedOutputTokens - The number of cached output tokens
 */ function zm(t, e, n, s, o) {
  e !== void 0 && t.setAttributes({ [Td]: e });
  n !== void 0 && t.setAttributes({ [Id]: n });
  if (e !== void 0 || n !== void 0 || s !== void 0 || o !== void 0) {
    const r = (e ?? 0) + (n ?? 0) + (s ?? 0) + (o ?? 0);
    t.setAttributes({ [$d]: r });
  }
}
/**
 * Get the truncated JSON string for a string or array of strings.
 *
 * @param value - The string or array of strings to truncate
 * @returns The truncated JSON string
 */ function Bm(t) {
  if (typeof t === "string") return Lm(t);
  if (Array.isArray(t)) {
    const e = Fm(t);
    return JSON.stringify(e);
  }
  return JSON.stringify(t);
}
/**
 * Extract system instructions from messages array.
 * Finds the first system message and formats it according to OpenTelemetry semantic conventions.
 *
 * @param messages - Array of messages to extract system instructions from
 * @returns systemInstructions (JSON string) and filteredMessages (without system message)
 */ function Wm(t) {
  if (!Array.isArray(t))
    return { systemInstructions: void 0, filteredMessages: t };
  const e = t.findIndex(
    (t) => t && typeof t === "object" && "role" in t && t.role === "system",
  );
  if (e === -1) return { systemInstructions: void 0, filteredMessages: t };
  const n = t[e];
  const s =
    typeof n.content === "string"
      ? n.content
      : n.content !== void 0
        ? JSON.stringify(n.content)
        : void 0;
  if (!s) return { systemInstructions: void 0, filteredMessages: t };
  const o = JSON.stringify([{ type: "text", content: s }]);
  const r = [...t.slice(0, e), ...t.slice(e + 1)];
  return { systemInstructions: o, filteredMessages: r };
}
const Vm = "operation.name";
const Gm = "ai.operationId";
const Km = "ai.prompt";
const Hm = "ai.schema";
const Zm = "ai.response.object";
const Ym = "ai.response.text";
const Xm = "ai.response.toolCalls";
const Qm = "ai.prompt.messages";
const tg = "ai.prompt.tools";
const eg = "ai.model.id";
const ng = "ai.response.providerMetadata";
const sg = "ai.usage.cachedInputTokens";
const og = "ai.telemetry.functionId";
const rg = "ai.usage.completionTokens";
const ig = "ai.usage.promptTokens";
const ag = "ai.toolCall.name";
const cg = "ai.toolCall.id";
const ug = "ai.toolCall.args";
const lg = "ai.toolCall.result";
function pg(t, e) {
  const n = t.parent_span_id;
  if (!n) return;
  const s = t.data[Td];
  const o = t.data[Id];
  if (typeof s === "number" || typeof o === "number") {
    const t = e.get(n) || { inputTokens: 0, outputTokens: 0 };
    typeof s === "number" && (t.inputTokens += s);
    typeof o === "number" && (t.outputTokens += o);
    e.set(n, t);
  }
}
function fg(t, e) {
  const n = e.get(t.span_id);
  if (n && t.data) {
    n.inputTokens > 0 && (t.data[Td] = n.inputTokens);
    n.outputTokens > 0 && (t.data[Id] = n.outputTokens);
    (n.inputTokens > 0 || n.outputTokens > 0) &&
      (t.data["gen_ai.usage.total_tokens"] = n.inputTokens + n.outputTokens);
  }
}
function dg(t) {
  return dm.get(t);
}
function mg(t) {
  dm.delete(t);
}
function gg(t) {
  const e = t.map((t) => {
    if (typeof t === "string")
      try {
        return JSON.parse(t);
      } catch {
        return t;
      }
    return t;
  });
  return JSON.stringify(e);
}
/**
 * Filter out invalid entries in messages array
 * @param input - The input array to filter
 * @returns The filtered array
 */ function hg(t) {
  return t.filter(
    (t) => !!t && typeof t === "object" && "role" in t && "content" in t,
  );
}
function _g(t) {
  try {
    const e = JSON.parse(t);
    if (!!e && typeof e === "object") {
      let { messages: t } = e;
      const { prompt: n, system: s } = e;
      const o = [];
      typeof s === "string" && o.push({ role: "system", content: s });
      if (typeof t === "string")
        try {
          t = JSON.parse(t);
        } catch {}
      if (Array.isArray(t)) {
        o.push(...hg(t));
        return o;
      }
      if (Array.isArray(n)) {
        o.push(...hg(n));
        return o;
      }
      typeof n === "string" && o.push({ role: "user", content: n });
      if (o.length > 0) return o;
    }
  } catch {}
  return [];
}
function yg(t, e) {
  if (typeof e[Km] !== "string" || e[Nd] || e[Qm]) {
    if (typeof e[Qm] === "string")
      try {
        const n = JSON.parse(e[Qm]);
        if (Array.isArray(n)) {
          const { systemInstructions: e, filteredMessages: s } = Wm(n);
          e && t.setAttribute(jd, e);
          const o = Array.isArray(s) ? s.length : 0;
          const r = Bm(s);
          t.setAttributes({ [Qm]: r, [Nd]: r, [Cd]: o });
        }
      } catch {}
  } else {
    const n = e[Km];
    const s = _g(n);
    if (s.length) {
      const { systemInstructions: e, filteredMessages: n } = Wm(s);
      e && t.setAttribute(jd, e);
      const o = Array.isArray(n) ? n.length : 0;
      const r = Bm(n);
      t.setAttributes({ [Km]: r, [Nd]: r, [Cd]: o });
    }
  }
}
function bg(t) {
  switch (t) {
    case "ai.generateText":
    case "ai.streamText":
    case "ai.generateObject":
    case "ai.streamObject":
    case "ai.embed":
    case "ai.embedMany":
    case "ai.rerank":
      return Wd;
    case "ai.generateText.doGenerate":
      return Vd;
    case "ai.streamText.doStream":
      return Gd;
    case "ai.generateObject.doGenerate":
      return Kd;
    case "ai.streamObject.doStream":
      return Hd;
    case "ai.embed.doEmbed":
      return Yd;
    case "ai.embedMany.doEmbed":
      return Xd;
    case "ai.rerank.doRerank":
      return Qd;
    case "ai.toolCall":
      return tm;
    default:
      return t.startsWith("ai.stream") ? "ai.run" : void 0;
  }
}
function vg(t, e) {
  t.setAttribute(Re, e);
}
function Sg(t) {
  return mm.has(t)
    ? "invoke_agent"
    : gm.has(t)
      ? "generate_content"
      : hm.has(t)
        ? "embeddings"
        : _m.has(t)
          ? "rerank"
          : t === "ai.toolCall"
            ? "execute_tool"
            : t;
}
function kg(t) {
  const { data: e, description: n } = Jn(t);
  n &&
    (e[ag] && e[cg] && n === "ai.toolCall"
      ? Eg(t, e)
      : (e[Gm] || n.startsWith("ai.")) && Tg(t, n, e));
}
function wg(t) {
  if (t.type === "transaction" && t.spans) {
    const e = new Map();
    for (const n of t.spans) {
      xg(n);
      pg(n, e);
    }
    for (const n of t.spans) n.op === "gen_ai.invoke_agent" && fg(n, e);
    const n = t.contexts?.trace;
    n && n.op === "gen_ai.invoke_agent" && fg(n, e);
  }
  return t;
}
function xg(t) {
  const { data: e, origin: n } = t;
  if (n === "auto.vercelai.otel") {
    Ag(e, rg, Id);
    Ag(e, ig, Td);
    Ag(e, sg, Bd);
    Ag(e, "ai.usage.inputTokens", Td);
    Ag(e, "ai.usage.outputTokens", Id);
    Ag(
      e,
      "ai.response.avgOutputTokensPerSecond",
      "ai.response.avgCompletionTokensPerSecond",
    );
    typeof e[Td] === "number" &&
      typeof e[Bd] === "number" &&
      (e[Td] = e[Td] + e[Bd]);
    typeof e[Id] === "number" &&
      typeof e[Td] === "number" &&
      (e[$d] = e[Id] + e[Td]);
    e[tg] && Array.isArray(e[tg]) && (e[tg] = gg(e[tg]));
    if (e[Vm]) {
      const t = Sg(e[Vm]);
      e[Od] = t;
      delete e[Vm];
    }
    Ag(e, Qm, Nd);
    Ag(e, Ym, "gen_ai.response.text");
    Ag(e, Xm, "gen_ai.response.tool_calls");
    Ag(e, Zm, "gen_ai.response.object");
    Ag(e, tg, "gen_ai.request.available_tools");
    Ag(e, ug, om);
    Ag(e, lg, rm);
    Ag(e, Hm, "gen_ai.request.schema");
    Ag(e, eg, dd);
    $g(e);
    for (const t of Object.keys(e))
      t.startsWith("ai.") && Ag(e, t, `vercel.${t}`);
  }
}
function Ag(t, e, n) {
  if (t[e] != null) {
    t[n] = t[e];
    delete t[e];
  }
}
function Eg(t, e) {
  vg(t, "auto.vercelai.otel");
  t.setAttribute(je, "gen_ai.execute_tool");
  t.setAttribute(Od, "execute_tool");
  Ag(e, ag, em);
  Ag(e, cg, nm);
  const n = e[nm];
  typeof n === "string" && dm.set(n, t);
  e[sm] || t.setAttribute(sm, "function");
  const s = e[em];
  s && t.updateName(`execute_tool ${s}`);
}
function Tg(t, e, n) {
  vg(t, "auto.vercelai.otel");
  const s = e.replace("ai.", "");
  t.setAttribute("ai.pipeline.name", s);
  t.updateName(s);
  const o = n[og];
  if (o && typeof o === "string") {
    t.updateName(`${s} ${o}`);
    t.setAttribute("gen_ai.function_id", o);
  }
  yg(t, n);
  n[eg] && !n[xd] && t.setAttribute(xd, n[eg]);
  t.setAttribute("ai.streaming", e.includes("stream"));
  const r = bg(e);
  r && t.setAttribute(je, r);
  const i = n[eg];
  if (i)
    switch (e) {
      case "ai.generateText.doGenerate":
        t.updateName(`generate_text ${i}`);
        break;
      case "ai.streamText.doStream":
        t.updateName(`stream_text ${i}`);
        break;
      case "ai.generateObject.doGenerate":
        t.updateName(`generate_object ${i}`);
        break;
      case "ai.streamObject.doStream":
        t.updateName(`stream_object ${i}`);
        break;
      case "ai.embed.doEmbed":
        t.updateName(`embed ${i}`);
        break;
      case "ai.embedMany.doEmbed":
        t.updateName(`embed_many ${i}`);
        break;
      case "ai.rerank.doRerank":
        t.updateName(`rerank ${i}`);
        break;
    }
}
function Ig(t) {
  t.on("spanStart", kg);
  t.addEventProcessor(Object.assign(wg, { id: "VercelAiEventProcessor" }));
}
function $g(t) {
  const e = t[ng];
  if (e)
    try {
      const n = JSON.parse(e);
      const s = n.openai ?? n.azure;
      if (s) {
        Og(t, Bd, s.cachedPromptTokens);
        Og(t, "gen_ai.usage.output_tokens.reasoning", s.reasoningTokens);
        Og(
          t,
          "gen_ai.usage.output_tokens.prediction_accepted",
          s.acceptedPredictionTokens,
        );
        Og(
          t,
          "gen_ai.usage.output_tokens.prediction_rejected",
          s.rejectedPredictionTokens,
        );
        Og(t, "gen_ai.conversation.id", s.responseId);
      }
      if (n.anthropic) {
        const e =
          n.anthropic.usage?.cache_read_input_tokens ??
          n.anthropic.cacheReadInputTokens;
        Og(t, Bd, e);
        const s =
          n.anthropic.usage?.cache_creation_input_tokens ??
          n.anthropic.cacheCreationInputTokens;
        Og(t, zd, s);
      }
      if (n.bedrock?.usage) {
        Og(t, Bd, n.bedrock.usage.cacheReadInputTokens);
        Og(t, zd, n.bedrock.usage.cacheWriteInputTokens);
      }
      if (n.deepseek) {
        Og(t, Bd, n.deepseek.promptCacheHitTokens);
        Og(
          t,
          "gen_ai.usage.input_tokens.cache_miss",
          n.deepseek.promptCacheMissTokens,
        );
      }
    } catch {}
}
function Og(t, e, n) {
  n != null && (t[e] = n);
}
const Cg = "OpenAI";
const Ng = [
  "responses.create",
  "chat.completions.create",
  "embeddings.create",
  "conversations.create",
];
const jg = [
  "response.output_item.added",
  "response.function_call_arguments.delta",
  "response.function_call_arguments.done",
  "response.output_item.done",
];
const Rg = [
  "response.created",
  "response.in_progress",
  "response.failed",
  "response.completed",
  "response.incomplete",
  "response.queued",
  "response.output_text.delta",
  ...jg,
];
function Mg(t) {
  return t.includes("chat.completions") || t.includes("responses")
    ? pm.CHAT
    : t.includes("embeddings")
      ? pm.EMBEDDINGS
      : t.includes("conversations")
        ? pm.CHAT
        : t.split(".").pop() || "unknown";
}
function Pg(t) {
  return `gen_ai.${Mg(t)}`;
}
function Dg(t) {
  return Ng.includes(t);
}
function Fg(t, e) {
  return t ? `${t}.${e}` : e;
}
function Lg(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "chat.completion"
  );
}
function qg(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "response"
  );
}
function Ug(t) {
  if (t === null || typeof t !== "object" || !("object" in t)) return false;
  const e = t;
  return (
    e.object === "list" &&
    typeof e.model === "string" &&
    e.model.toLowerCase().includes("embedding")
  );
}
function Jg(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "conversation"
  );
}
function zg(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "type" in t &&
    typeof t.type === "string" &&
    t.type.startsWith("response.")
  );
}
function Bg(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "chat.completion.chunk"
  );
}
function Wg(t, e, n) {
  Zg(t, e.id, e.model, e.created);
  e.usage &&
    Hg(
      t,
      e.usage.prompt_tokens,
      e.usage.completion_tokens,
      e.usage.total_tokens,
    );
  if (Array.isArray(e.choices)) {
    const s = e.choices.map((t) => t.finish_reason).filter((t) => t !== null);
    s.length > 0 && t.setAttributes({ [wd]: JSON.stringify(s) });
    if (n) {
      const n = e.choices
        .map((t) => t.message?.tool_calls)
        .filter((t) => Array.isArray(t) && t.length > 0)
        .flat();
      n.length > 0 && t.setAttributes({ [Dd]: JSON.stringify(n) });
    }
  }
}
function Vg(t, e, n) {
  Zg(t, e.id, e.model, e.created_at);
  e.status && t.setAttributes({ [wd]: JSON.stringify([e.status]) });
  e.usage &&
    Hg(t, e.usage.input_tokens, e.usage.output_tokens, e.usage.total_tokens);
  if (n) {
    const n = e;
    if (Array.isArray(n.output) && n.output.length > 0) {
      const e = n.output.filter(
        (t) =>
          typeof t === "object" && t !== null && t.type === "function_call",
      );
      e.length > 0 && t.setAttributes({ [Dd]: JSON.stringify(e) });
    }
  }
}
function Gg(t, e) {
  t.setAttributes({ [am]: e.model, [xd]: e.model });
  e.usage && Hg(t, e.usage.prompt_tokens, void 0, e.usage.total_tokens);
}
function Kg(t, e) {
  const { id: n, created_at: s } = e;
  t.setAttributes({ [im]: n, [Ad]: n, [qd]: n });
  s && t.setAttributes({ [cm]: new Date(s * 1e3).toISOString() });
}
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param totalTokens - The number of total tokens
 */ function Hg(t, e, n, s) {
  e !== void 0 && t.setAttributes({ [lm]: e, [Td]: e });
  n !== void 0 && t.setAttributes({ [um]: n, [Id]: n });
  s !== void 0 && t.setAttributes({ [$d]: s });
}
/**
 * Set common response attributes
 * @param span - The span to add attributes to
 * @param id - The response id
 * @param model - The response model
 * @param timestamp - The response timestamp
 */ function Zg(t, e, n, s) {
  t.setAttributes({ [im]: e, [Ad]: e });
  t.setAttributes({ [am]: n, [xd]: n });
  t.setAttributes({ [cm]: new Date(s * 1e3).toISOString() });
}
function Yg(t) {
  return "conversation" in t && typeof t.conversation === "string"
    ? t.conversation
    : "previous_response_id" in t && typeof t.previous_response_id === "string"
      ? t.previous_response_id
      : void 0;
}
function Xg(t) {
  const e = { [dd]: t.model ?? "unknown" };
  "temperature" in t && (e[gd] = t.temperature);
  "top_p" in t && (e[bd] = t.top_p);
  "frequency_penalty" in t && (e[_d] = t.frequency_penalty);
  "presence_penalty" in t && (e[yd] = t.presence_penalty);
  "stream" in t && (e[md] = t.stream);
  "encoding_format" in t && (e[Sd] = t.encoding_format);
  "dimensions" in t && (e[kd] = t.dimensions);
  const n = Yg(t);
  n && (e[qd] = n);
  return e;
}
/**
 * Processes tool calls from a chat completion chunk delta.
 * Follows the pattern: accumulate by index, then convert to array at the end.
 *
 * @param toolCalls - Array of tool calls from the delta.
 * @param state - The current streaming state to update.
 *
 *  @see https://platform.openai.com/docs/guides/function-calling#streaming
 */ function Qg(t, e) {
  for (const n of t) {
    const t = n.index;
    if (t !== void 0 && n.function)
      if (t in e.chatCompletionToolCalls) {
        const s = e.chatCompletionToolCalls[t];
        n.function.arguments &&
          s?.function &&
          (s.function.arguments += n.function.arguments);
      } else
        e.chatCompletionToolCalls[t] = {
          ...n,
          function: {
            name: n.function.name,
            arguments: n.function.arguments || "",
          },
        };
  }
}
/**
 * Processes a single OpenAI ChatCompletionChunk event, updating the streaming state.
 *
 * @param chunk - The ChatCompletionChunk event to process.
 * @param state - The current streaming state to update.
 * @param recordOutputs - Whether to record output text fragments.
 */ function th(t, e, n) {
  e.responseId = t.id ?? e.responseId;
  e.responseModel = t.model ?? e.responseModel;
  e.responseTimestamp = t.created ?? e.responseTimestamp;
  if (t.usage) {
    e.promptTokens = t.usage.prompt_tokens;
    e.completionTokens = t.usage.completion_tokens;
    e.totalTokens = t.usage.total_tokens;
  }
  for (const s of t.choices ?? []) {
    if (n) {
      s.delta?.content && e.responseTexts.push(s.delta.content);
      s.delta?.tool_calls && Qg(s.delta.tool_calls, e);
    }
    s.finish_reason && e.finishReasons.push(s.finish_reason);
  }
}
/**
 * Processes a single OpenAI Responses API streaming event, updating the streaming state and span.
 *
 * @param streamEvent - The event to process (may be an error or unknown object).
 * @param state - The current streaming state to update.
 * @param recordOutputs - Whether to record output text fragments.
 * @param span - The span to update with error status if needed.
 */ function eh(t, e, n, s) {
  if (!(t && typeof t === "object")) {
    e.eventTypes.push("unknown:non-object");
    return;
  }
  if (t instanceof Error) {
    s.setStatus({ code: Ze, message: "internal_error" });
    rr(t, {
      mechanism: { handled: false, type: "auto.ai.openai.stream-response" },
    });
    return;
  }
  if (!("type" in t)) return;
  const o = t;
  if (Rg.includes(o.type)) {
    if (n) {
      o.type === "response.output_item.done" &&
        "item" in o &&
        e.responsesApiToolCalls.push(o.item);
      if (o.type === "response.output_text.delta" && "delta" in o && o.delta) {
        e.responseTexts.push(o.delta);
        return;
      }
    }
    if ("response" in o) {
      const { response: t } = o;
      e.responseId = t.id ?? e.responseId;
      e.responseModel = t.model ?? e.responseModel;
      e.responseTimestamp = t.created_at ?? e.responseTimestamp;
      if (t.usage) {
        e.promptTokens = t.usage.input_tokens;
        e.completionTokens = t.usage.output_tokens;
        e.totalTokens = t.usage.total_tokens;
      }
      t.status && e.finishReasons.push(t.status);
      n && t.output_text && e.responseTexts.push(t.output_text);
    }
  } else e.eventTypes.push(o.type);
}
/**
 * Instruments a stream of OpenAI events, updating the provided span with relevant attributes and
 * optionally recording output text. This function yields each event from the input stream as it is processed.
 *
 * @template T - The type of events in the stream.
 * @param stream - The async iterable stream of events to instrument.
 * @param span - The span to add attributes to and to finish at the end of the stream.
 * @param recordOutputs - Whether to record output text fragments in the span.
 * @returns An async generator yielding each event from the input stream.
 */ async function* nh(t, e, n) {
  const s = {
    eventTypes: [],
    responseTexts: [],
    finishReasons: [],
    responseId: "",
    responseModel: "",
    responseTimestamp: 0,
    promptTokens: void 0,
    completionTokens: void 0,
    totalTokens: void 0,
    chatCompletionToolCalls: {},
    responsesApiToolCalls: [],
  };
  try {
    for await (const o of t) {
      Bg(o) ? th(o, s, n) : zg(o) && eh(o, s, n, e);
      yield o;
    }
  } finally {
    Zg(e, s.responseId, s.responseModel, s.responseTimestamp);
    Hg(e, s.promptTokens, s.completionTokens, s.totalTokens);
    e.setAttributes({ [Pd]: true });
    s.finishReasons.length &&
      e.setAttributes({ [wd]: JSON.stringify(s.finishReasons) });
    n &&
      s.responseTexts.length &&
      e.setAttributes({ [Rd]: s.responseTexts.join("") });
    const t = Object.values(s.chatCompletionToolCalls);
    const o = [...t, ...s.responsesApiToolCalls];
    o.length > 0 && e.setAttributes({ [Dd]: JSON.stringify(o) });
    e.end();
  }
}
function sh(e) {
  const n = Array.isArray(e.tools) ? e.tools : [];
  const s = e.web_search_options && typeof e.web_search_options === "object";
  const o = s ? [{ type: "web_search_options", ...e.web_search_options }] : [];
  const r = [...n, ...o];
  if (r.length !== 0)
    try {
      return JSON.stringify(r);
    } catch (e) {
      t && y.error("Failed to serialize OpenAI tools:", e);
      return;
    }
}
function oh(t, e) {
  const n = { [fd]: "openai", [Od]: Mg(e), [Re]: "auto.ai.openai" };
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    const s = sh(e);
    s && (n[Md] = s);
    Object.assign(n, Xg(e));
  } else n[dd] = "unknown";
  return n;
}
function rh(t, e, n) {
  if (!e || typeof e !== "object") return;
  const s = e;
  if (Lg(s)) {
    Wg(t, s, n);
    if (n && s.choices?.length) {
      const e = s.choices.map((t) => t.message?.content || "");
      t.setAttributes({ [Rd]: JSON.stringify(e) });
    }
  } else if (qg(s)) {
    Vg(t, s, n);
    n && s.output_text && t.setAttributes({ [Rd]: s.output_text });
  } else Ug(s) ? Gg(t, s) : Jg(s) && Kg(t, s);
}
function ih(t, e, n) {
  if (n === pm.EMBEDDINGS && "input" in e) {
    const n = e.input;
    if (n == null) return;
    if (typeof n === "string" && n.length === 0) return;
    if (Array.isArray(n) && n.length === 0) return;
    t.setAttribute(Zd, typeof n === "string" ? n : JSON.stringify(n));
    return;
  }
  const s = "input" in e ? e.input : "messages" in e ? e.messages : void 0;
  if (!s) return;
  if (Array.isArray(s) && s.length === 0) return;
  const { systemInstructions: o, filteredMessages: r } = Wm(s);
  o && t.setAttribute(jd, o);
  const i = Bm(r);
  t.setAttribute(Nd, i);
  Array.isArray(r) ? t.setAttribute(Cd, r.length) : t.setAttribute(Cd, 1);
}
async function ah(t, e) {
  const n = t.catch((t) => {
    rr(t, { mechanism: { handled: false, type: "auto.ai.openai" } });
    throw t;
  });
  const s = await e;
  const o = await n;
  return o && typeof o === "object" && "data" in o ? { ...o, data: s } : s;
}
function ch(t, e) {
  return st(t)
    ? new Proxy(t, {
        get(t, n) {
          const s = n in Promise.prototype || n === Symbol.toStringTag;
          const o = s ? e : t;
          const r = Reflect.get(o, n);
          return n === "withResponse" && typeof r === "function"
            ? function () {
                const n = r.call(t);
                return ah(n, e);
              }
            : typeof r === "function"
              ? r.bind(o)
              : r;
        },
      })
    : e;
}
function uh(t, e, n, s) {
  return function (...o) {
    const r = oh(o, e);
    const i = r[dd] || "unknown";
    const a = Mg(e);
    const c = o[0];
    const u = c && typeof c === "object" && c.stream === true;
    const l = {
      name: `${a} ${i}${u ? " stream-response" : ""}`,
      op: Pg(e),
      attributes: r,
    };
    if (u) {
      let r;
      const i = ro(l, (i) => {
        r = t.apply(n, o);
        s.recordInputs && c && ih(i, c, a);
        return (async () => {
          try {
            const t = await r;
            return nh(t, i, s.recordOutputs ?? false);
          } catch (t) {
            i.setStatus({ code: Ze, message: "internal_error" });
            rr(t, {
              mechanism: {
                handled: false,
                type: "auto.ai.openai.stream",
                data: { function: e },
              },
            });
            i.end();
            throw t;
          }
        })();
      });
      return ch(r, i);
    }
    let p;
    const f = oo(l, (r) => {
      p = t.apply(n, o);
      s.recordInputs && c && ih(r, c, a);
      return p.then(
        (t) => {
          rh(r, t, s.recordOutputs);
          return t;
        },
        (t) => {
          rr(t, {
            mechanism: {
              handled: false,
              type: "auto.ai.openai",
              data: { function: e },
            },
          });
          throw t;
        },
      );
    });
    return ch(p, f);
  };
}
function lh(t, e = "", n) {
  return new Proxy(t, {
    get(t, s) {
      const o = t[s];
      const r = Fg(e, String(s));
      return typeof o === "function" && Dg(r)
        ? uh(o, r, t, n)
        : typeof o === "function"
          ? o.bind(t)
          : o && typeof o === "object"
            ? lh(o, r, n)
            : o;
    },
  });
}
function ph(t, e) {
  const n = Boolean(Ie()?.getOptions().sendDefaultPii);
  const s = { recordInputs: n, recordOutputs: n, ...e };
  return lh(t, "", s);
}
/**
 * Checks if an event is an error event
 * @param event - The event to process
 * @param state - The state of the streaming process
 * @param recordOutputs - Whether to record outputs
 * @param span - The span to update
 * @returns Whether an error occurred
 */ function fh(t, e) {
  if ("type" in t && typeof t.type === "string" && t.type === "error") {
    e.setStatus({ code: Ze, message: t.error?.type ?? "internal_error" });
    rr(t.error, {
      mechanism: { handled: false, type: "auto.ai.anthropic.anthropic_error" },
    });
    return true;
  }
  return false;
}
/**
 * Processes the message metadata of an event
 * @param event - The event to process
 * @param state - The state of the streaming process
 */ function dh(t, e) {
  t.type === "message_delta" &&
    t.usage &&
    "output_tokens" in t.usage &&
    typeof t.usage.output_tokens === "number" &&
    (e.completionTokens = t.usage.output_tokens);
  if (t.message) {
    const n = t.message;
    n.id && (e.responseId = n.id);
    n.model && (e.responseModel = n.model);
    n.stop_reason && e.finishReasons.push(n.stop_reason);
    if (n.usage) {
      typeof n.usage.input_tokens === "number" &&
        (e.promptTokens = n.usage.input_tokens);
      typeof n.usage.cache_creation_input_tokens === "number" &&
        (e.cacheCreationInputTokens = n.usage.cache_creation_input_tokens);
      typeof n.usage.cache_read_input_tokens === "number" &&
        (e.cacheReadInputTokens = n.usage.cache_read_input_tokens);
    }
  }
}
function mh(t, e) {
  t.type === "content_block_start" &&
    typeof t.index === "number" &&
    t.content_block &&
    ((t.content_block.type !== "tool_use" &&
      t.content_block.type !== "server_tool_use") ||
      (e.activeToolBlocks[t.index] = {
        id: t.content_block.id,
        name: t.content_block.name,
        inputJsonParts: [],
      }));
}
function gh(t, e, n) {
  if (t.type === "content_block_delta" && t.delta) {
    if (
      typeof t.index === "number" &&
      "partial_json" in t.delta &&
      typeof t.delta.partial_json === "string"
    ) {
      const n = e.activeToolBlocks[t.index];
      n && n.inputJsonParts.push(t.delta.partial_json);
    }
    n && typeof t.delta.text === "string" && e.responseTexts.push(t.delta.text);
  }
}
function hh(t, e) {
  if (t.type !== "content_block_stop" || typeof t.index !== "number") return;
  const n = e.activeToolBlocks[t.index];
  if (!n) return;
  const s = n.inputJsonParts.join("");
  let o;
  try {
    o = s ? JSON.parse(s) : {};
  } catch {
    o = { __unparsed: s };
  }
  e.toolCalls.push({ type: "tool_use", id: n.id, name: n.name, input: o });
  delete e.activeToolBlocks[t.index];
}
/**
 * Processes an event
 * @param event - The event to process
 * @param state - The state of the streaming process
 * @param recordOutputs - Whether to record outputs
 * @param span - The span to update
 */ function _h(t, e, n, s) {
  if (!(t && typeof t === "object")) return;
  const o = fh(t, s);
  if (!o) {
    dh(t, e);
    mh(t, e);
    gh(t, e, n);
    hh(t, e);
  }
}
function yh(t, e, n) {
  if (e.isRecording()) {
    t.responseId && e.setAttributes({ [Ad]: t.responseId });
    t.responseModel && e.setAttributes({ [xd]: t.responseModel });
    zm(
      e,
      t.promptTokens,
      t.completionTokens,
      t.cacheCreationInputTokens,
      t.cacheReadInputTokens,
    );
    e.setAttributes({ [Pd]: true });
    t.finishReasons.length > 0 &&
      e.setAttributes({ [wd]: JSON.stringify(t.finishReasons) });
    n &&
      t.responseTexts.length > 0 &&
      e.setAttributes({ [Rd]: t.responseTexts.join("") });
    n &&
      t.toolCalls.length > 0 &&
      e.setAttributes({ [Dd]: JSON.stringify(t.toolCalls) });
    e.end();
  }
}
async function* bh(t, e, n) {
  const s = {
    responseTexts: [],
    finishReasons: [],
    responseId: "",
    responseModel: "",
    promptTokens: void 0,
    completionTokens: void 0,
    cacheCreationInputTokens: void 0,
    cacheReadInputTokens: void 0,
    toolCalls: [],
    activeToolBlocks: {},
  };
  try {
    for await (const o of t) {
      _h(o, s, n, e);
      yield o;
    }
  } finally {
    s.responseId && e.setAttributes({ [Ad]: s.responseId });
    s.responseModel && e.setAttributes({ [xd]: s.responseModel });
    zm(
      e,
      s.promptTokens,
      s.completionTokens,
      s.cacheCreationInputTokens,
      s.cacheReadInputTokens,
    );
    e.setAttributes({ [Pd]: true });
    s.finishReasons.length > 0 &&
      e.setAttributes({ [wd]: JSON.stringify(s.finishReasons) });
    n &&
      s.responseTexts.length > 0 &&
      e.setAttributes({ [Rd]: s.responseTexts.join("") });
    n &&
      s.toolCalls.length > 0 &&
      e.setAttributes({ [Dd]: JSON.stringify(s.toolCalls) });
    e.end();
  }
}
function vh(t, e, n) {
  const s = {
    responseTexts: [],
    finishReasons: [],
    responseId: "",
    responseModel: "",
    promptTokens: void 0,
    completionTokens: void 0,
    cacheCreationInputTokens: void 0,
    cacheReadInputTokens: void 0,
    toolCalls: [],
    activeToolBlocks: {},
  };
  t.on("streamEvent", (t) => {
    _h(t, s, n, e);
  });
  t.on("message", () => {
    yh(s, e, n);
  });
  t.on("error", (t) => {
    rr(t, {
      mechanism: { handled: false, type: "auto.ai.anthropic.stream_error" },
    });
    if (e.isRecording()) {
      e.setStatus({ code: Ze, message: "stream_error" });
      e.end();
    }
  });
  return t;
}
const Sh = "Anthropic_AI";
const kh = [
  "messages.create",
  "messages.stream",
  "messages.countTokens",
  "models.get",
  "completions.create",
  "models.retrieve",
  "beta.messages.create",
];
function wh(t) {
  return kh.includes(t);
}
function xh(t, e) {
  if (Array.isArray(e) && e.length === 0) return;
  const { systemInstructions: n, filteredMessages: s } = Wm(e);
  n && t.setAttributes({ [jd]: n });
  const o = Array.isArray(s) ? s.length : 1;
  t.setAttributes({ [Nd]: Bm(s), [Cd]: o });
}
function Ah(t, e) {
  if (e.error) {
    t.setStatus({ code: Ze, message: e.error.type || "internal_error" });
    rr(e.error, {
      mechanism: { handled: false, type: "auto.ai.anthropic.anthropic_error" },
    });
  }
}
function Eh(t) {
  const { system: e, messages: n, input: s } = t;
  const o =
    typeof e === "string" ? [{ role: "system", content: t.system }] : [];
  const r = Array.isArray(s) ? s : s != null ? [s] : void 0;
  const i = Array.isArray(n) ? n : n != null ? [n] : [];
  const a = r ?? i;
  return [...o, ...a];
}
function Th(t, e) {
  const n = { [fd]: "anthropic", [Od]: qm(e), [Re]: "auto.ai.anthropic" };
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    e.tools && Array.isArray(e.tools) && (n[Md] = JSON.stringify(e.tools));
    n[dd] = e.model ?? "unknown";
    "temperature" in e && (n[gd] = e.temperature);
    "top_p" in e && (n[bd] = e.top_p);
    "stream" in e && (n[md] = e.stream);
    "top_k" in e && (n[vd] = e.top_k);
    "frequency_penalty" in e && (n[_d] = e.frequency_penalty);
    "max_tokens" in e && (n[hd] = e.max_tokens);
  } else
    n[dd] = e === "models.retrieve" || e === "models.get" ? t[0] : "unknown";
  return n;
}
function Ih(t, e) {
  const n = Eh(e);
  xh(t, n);
  "prompt" in e && t.setAttributes({ [pd]: JSON.stringify(e.prompt) });
}
function $h(t, e) {
  if ("content" in e && Array.isArray(e.content)) {
    t.setAttributes({
      [Rd]: e.content
        .map((t) => t.text)
        .filter((t) => !!t)
        .join(""),
    });
    const n = [];
    for (const t of e.content)
      (t.type !== "tool_use" && t.type !== "server_tool_use") || n.push(t);
    n.length > 0 && t.setAttributes({ [Dd]: JSON.stringify(n) });
  }
  "completion" in e && t.setAttributes({ [Rd]: e.completion });
  "input_tokens" in e &&
    t.setAttributes({ [Rd]: JSON.stringify(e.input_tokens) });
}
function Oh(t, e) {
  if ("id" in e && "model" in e) {
    t.setAttributes({ [Ad]: e.id, [xd]: e.model });
    "created" in e &&
      typeof e.created === "number" &&
      t.setAttributes({ [fm]: new Date(e.created * 1e3).toISOString() });
    "created_at" in e &&
      typeof e.created_at === "number" &&
      t.setAttributes({ [fm]: new Date(e.created_at * 1e3).toISOString() });
    "usage" in e &&
      e.usage &&
      zm(
        t,
        e.usage.input_tokens,
        e.usage.output_tokens,
        e.usage.cache_creation_input_tokens,
        e.usage.cache_read_input_tokens,
      );
  }
}
function Ch(t, e, n) {
  if (e && typeof e === "object")
    if ("type" in e && e.type === "error") Ah(t, e);
    else {
      n && $h(t, e);
      Oh(t, e);
    }
}
function Nh(t, e, n) {
  rr(t, {
    mechanism: {
      handled: false,
      type: "auto.ai.anthropic",
      data: { function: n },
    },
  });
  if (e.isRecording()) {
    e.setStatus({ code: Ze, message: "internal_error" });
    e.end();
  }
  throw t;
}
function jh(t, e, n, s, o, r, i, a, c, u, l) {
  const p = o[dd] ?? "unknown";
  const f = { name: `${r} ${p} stream-response`, op: Um(i), attributes: o };
  return ro(
    f,
    u && !l
      ? async (e) => {
          try {
            c.recordInputs && a && Ih(e, a);
            const o = await t.apply(n, s);
            return bh(o, e, c.recordOutputs ?? false);
          } catch (t) {
            return Nh(t, e, i);
          }
        }
      : (t) => {
          try {
            c.recordInputs && a && Ih(t, a);
            const o = e.apply(n, s);
            return vh(o, t, c.recordOutputs ?? false);
          } catch (e) {
            return Nh(e, t, i);
          }
        },
  );
}
function Rh(t, e, n, s) {
  return new Proxy(t, {
    apply(o, r, i) {
      const a = Th(i, e);
      const c = a[dd] ?? "unknown";
      const u = qm(e);
      const l = typeof i[0] === "object" ? i[0] : void 0;
      const p = Boolean(l?.stream);
      const f = e === "messages.stream";
      return p || f
        ? jh(t, o, n, i, a, u, e, l, s, p, f)
        : oo({ name: `${u} ${c}`, op: Um(e), attributes: a }, (t) => {
            s.recordInputs && l && Ih(t, l);
            return to(
              () => o.apply(n, i),
              (t) => {
                rr(t, {
                  mechanism: {
                    handled: false,
                    type: "auto.ai.anthropic",
                    data: { function: e },
                  },
                });
              },
              () => {},
              (e) => Ch(t, e, s.recordOutputs),
            );
          });
    },
  });
}
function Mh(t, e = "", n) {
  return new Proxy(t, {
    get(t, s) {
      const o = t[s];
      const r = Jm(e, String(s));
      return typeof o === "function" && wh(r)
        ? Rh(o, r, t, n)
        : typeof o === "function"
          ? o.bind(t)
          : o && typeof o === "object"
            ? Mh(o, r, n)
            : o;
    },
  });
}
/**
 * Instrument an Anthropic AI client with Sentry tracing
 * Can be used across Node.js, Cloudflare Workers, and Vercel Edge
 *
 * @template T - The type of the client that extends object
 * @param client - The Anthropic AI client to instrument
 * @param options - Optional configuration for recording inputs and outputs
 * @returns The instrumented client with the same type as the input
 */ function Ph(t, e) {
  const n = Boolean(Ie()?.getOptions().sendDefaultPii);
  const s = { recordInputs: n, recordOutputs: n, ...e };
  return Mh(t, "", s);
}
const Dh = "Google_GenAI";
const Fh = [
  "models.generateContent",
  "models.generateContentStream",
  "chats.create",
  "sendMessage",
  "sendMessageStream",
];
const Lh = "google_genai";
const qh = "chats.create";
const Uh = "chat";
/**
 * Checks if a response chunk contains an error
 * @param chunk - The response chunk to check
 * @param span - The span to update if error is found
 * @returns Whether an error occurred
 */ function Jh(t, e) {
  const n = t?.promptFeedback;
  if (n?.blockReason) {
    const t = n.blockReasonMessage ?? n.blockReason;
    e.setStatus({ code: Ze, message: `Content blocked: ${t}` });
    rr(`Content blocked: ${t}`, {
      mechanism: { handled: false, type: "auto.ai.google_genai" },
    });
    return true;
  }
  return false;
}
/**
 * Processes response metadata from a chunk
 * @param chunk - The response chunk to process
 * @param state - The state of the streaming process
 */ function zh(t, e) {
  typeof t.responseId === "string" && (e.responseId = t.responseId);
  typeof t.modelVersion === "string" && (e.responseModel = t.modelVersion);
  const n = t.usageMetadata;
  if (n) {
    typeof n.promptTokenCount === "number" &&
      (e.promptTokens = n.promptTokenCount);
    typeof n.candidatesTokenCount === "number" &&
      (e.completionTokens = n.candidatesTokenCount);
    typeof n.totalTokenCount === "number" &&
      (e.totalTokens = n.totalTokenCount);
  }
}
/**
 * Processes candidate content from a response chunk
 * @param chunk - The response chunk to process
 * @param state - The state of the streaming process
 * @param recordOutputs - Whether to record outputs
 */ function Bh(t, e, n) {
  Array.isArray(t.functionCalls) && e.toolCalls.push(...t.functionCalls);
  for (const s of t.candidates ?? []) {
    s?.finishReason &&
      !e.finishReasons.includes(s.finishReason) &&
      e.finishReasons.push(s.finishReason);
    for (const t of s?.content?.parts ?? []) {
      n && t.text && e.responseTexts.push(t.text);
      t.functionCall &&
        e.toolCalls.push({
          type: "function",
          id: t.functionCall.id,
          name: t.functionCall.name,
          arguments: t.functionCall.args,
        });
    }
  }
}
/**
 * Processes a single chunk from the Google GenAI stream
 * @param chunk - The chunk to process
 * @param state - The state of the streaming process
 * @param recordOutputs - Whether to record outputs
 * @param span - The span to update
 */ function Wh(t, e, n, s) {
  if (t && !Jh(t, s)) {
    zh(t, e);
    Bh(t, e, n);
  }
}
async function* Vh(t, e, n) {
  const s = { responseTexts: [], finishReasons: [], toolCalls: [] };
  try {
    for await (const o of t) {
      Wh(o, s, n, e);
      yield o;
    }
  } finally {
    const t = { [Pd]: true };
    s.responseId && (t[Ad] = s.responseId);
    s.responseModel && (t[xd] = s.responseModel);
    s.promptTokens !== void 0 && (t[Td] = s.promptTokens);
    s.completionTokens !== void 0 && (t[Id] = s.completionTokens);
    s.totalTokens !== void 0 && (t[$d] = s.totalTokens);
    s.finishReasons.length && (t[wd] = JSON.stringify(s.finishReasons));
    n && s.responseTexts.length && (t[Rd] = s.responseTexts.join(""));
    n && s.toolCalls.length && (t[Dd] = JSON.stringify(s.toolCalls));
    e.setAttributes(t);
    e.end();
  }
}
function Gh(t) {
  if (Fh.includes(t)) return true;
  const e = t.split(".").pop();
  return Fh.includes(e);
}
function Kh(t) {
  return t.includes("Stream");
}
function Hh(t, e = "user") {
  return typeof t === "string"
    ? [{ role: e, content: t }]
    : Array.isArray(t)
      ? t.flatMap((t) => Hh(t, e))
      : typeof t === "object" && t
        ? "role" in t && typeof t.role === "string"
          ? [t]
          : "parts" in t
            ? [{ ...t, role: e }]
            : [{ role: e, content: t }]
        : [];
}
function Zh(t, e) {
  if ("model" in t && typeof t.model === "string") return t.model;
  if (e && typeof e === "object") {
    const t = e;
    if ("model" in t && typeof t.model === "string") return t.model;
    if ("modelVersion" in t && typeof t.modelVersion === "string")
      return t.modelVersion;
  }
  return "unknown";
}
function Yh(t) {
  const e = {};
  "temperature" in t &&
    typeof t.temperature === "number" &&
    (e[gd] = t.temperature);
  "topP" in t && typeof t.topP === "number" && (e[bd] = t.topP);
  "topK" in t && typeof t.topK === "number" && (e[vd] = t.topK);
  "maxOutputTokens" in t &&
    typeof t.maxOutputTokens === "number" &&
    (e[hd] = t.maxOutputTokens);
  "frequencyPenalty" in t &&
    typeof t.frequencyPenalty === "number" &&
    (e[_d] = t.frequencyPenalty);
  "presencePenalty" in t &&
    typeof t.presencePenalty === "number" &&
    (e[yd] = t.presencePenalty);
  return e;
}
function Xh(t, e, n) {
  const s = { [fd]: Lh, [Od]: qm(t), [Re]: "auto.ai.google_genai" };
  if (e) {
    s[dd] = Zh(e, n);
    if ("config" in e && typeof e.config === "object" && e.config) {
      const t = e.config;
      Object.assign(s, Yh(t));
      if ("tools" in t && Array.isArray(t.tools)) {
        const e = t.tools.flatMap((t) => t.functionDeclarations);
        s[Md] = JSON.stringify(e);
      }
    }
  } else s[dd] = Zh({}, n);
  return s;
}
function Qh(t, e) {
  const n = [];
  "config" in e &&
    e.config &&
    typeof e.config === "object" &&
    "systemInstruction" in e.config &&
    e.config.systemInstruction &&
    n.push(...Hh(e.config.systemInstruction, "system"));
  "history" in e && n.push(...Hh(e.history, "user"));
  "contents" in e && n.push(...Hh(e.contents, "user"));
  "message" in e && n.push(...Hh(e.message, "user"));
  if (Array.isArray(n) && n.length) {
    const { systemInstructions: e, filteredMessages: s } = Wm(n);
    e && t.setAttribute(jd, e);
    const o = Array.isArray(s) ? s.length : 0;
    t.setAttributes({ [Cd]: o, [Nd]: JSON.stringify(Fm(s)) });
  }
}
function t_(t, e, n) {
  if (e && typeof e === "object") {
    e.modelVersion && t.setAttribute(xd, e.modelVersion);
    if (e.usageMetadata && typeof e.usageMetadata === "object") {
      const n = e.usageMetadata;
      typeof n.promptTokenCount === "number" &&
        t.setAttributes({ [Td]: n.promptTokenCount });
      typeof n.candidatesTokenCount === "number" &&
        t.setAttributes({ [Id]: n.candidatesTokenCount });
      typeof n.totalTokenCount === "number" &&
        t.setAttributes({ [$d]: n.totalTokenCount });
    }
    if (n && Array.isArray(e.candidates) && e.candidates.length > 0) {
      const n = e.candidates
        .map((t) =>
          t.content?.parts && Array.isArray(t.content.parts)
            ? t.content.parts
                .map((t) => (typeof t.text === "string" ? t.text : ""))
                .filter((t) => t.length > 0)
                .join("")
            : "",
        )
        .filter((t) => t.length > 0);
      n.length > 0 && t.setAttributes({ [Rd]: n.join("") });
    }
    if (n && e.functionCalls) {
      const n = e.functionCalls;
      Array.isArray(n) &&
        n.length > 0 &&
        t.setAttributes({ [Dd]: JSON.stringify(n) });
    }
  }
}
function e_(t, e, n, s) {
  const o = e === qh;
  return new Proxy(t, {
    apply(t, r, i) {
      const a = i[0];
      const c = Xh(e, a, n);
      const u = c[dd] ?? "unknown";
      const l = qm(e);
      return Kh(e)
        ? ro(
            { name: `${l} ${u} stream-response`, op: Um(e), attributes: c },
            async (o) => {
              try {
                s.recordInputs && a && Qh(o, a);
                const e = await t.apply(n, i);
                return Vh(e, o, Boolean(s.recordOutputs));
              } catch (t) {
                o.setStatus({ code: Ze, message: "internal_error" });
                rr(t, {
                  mechanism: {
                    handled: false,
                    type: "auto.ai.google_genai",
                    data: { function: e },
                  },
                });
                o.end();
                throw t;
              }
            },
          )
        : oo(
            {
              name: o ? `${l} ${u} create` : `${l} ${u}`,
              op: Um(e),
              attributes: c,
            },
            (r) => {
              s.recordInputs && a && Qh(r, a);
              return to(
                () => t.apply(n, i),
                (t) => {
                  rr(t, {
                    mechanism: {
                      handled: false,
                      type: "auto.ai.google_genai",
                      data: { function: e },
                    },
                  });
                },
                () => {},
                (t) => {
                  o || t_(r, t, s.recordOutputs);
                },
              );
            },
          );
    },
  });
}
function n_(t, e = "", n) {
  return new Proxy(t, {
    get: (t, s, o) => {
      const r = Reflect.get(t, s, o);
      const i = Jm(e, String(s));
      if (typeof r === "function" && Gh(i)) {
        if (i === qh) {
          const e = e_(r, i, t, n);
          return function (...t) {
            const s = e(...t);
            return s && typeof s === "object" ? n_(s, Uh, n) : s;
          };
        }
        return e_(r, i, t, n);
      }
      return typeof r === "function"
        ? r.bind(t)
        : r && typeof r === "object"
          ? n_(r, i, n)
          : r;
    },
  });
}
/**
 * Instrument a Google GenAI client with Sentry tracing
 * Can be used across Node.js, Cloudflare Workers, and Vercel Edge
 *
 * @template T - The type of the client that extends client object
 * @param client - The Google GenAI client to instrument
 * @param options - Optional configuration for recording inputs and outputs
 * @returns The instrumented client with the same type as the input
 *
 * @example
 * ```typescript
 * import { GoogleGenAI } from '@google/genai';
 * import { instrumentGoogleGenAIClient } from '@sentry/core';
 *
 * const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
 * const instrumentedClient = instrumentGoogleGenAIClient(genAI);
 *
 * // Now both chats.create and sendMessage will be instrumented
 * const chat = instrumentedClient.chats.create({ model: 'gemini-1.5-pro' });
 * const response = await chat.sendMessage({ message: 'Hello' });
 * ```
 */ function s_(t, e) {
  const n = Boolean(Ie()?.getOptions().sendDefaultPii);
  const s = { recordInputs: n, recordOutputs: n, ...e };
  return n_(t, "", s);
}
const o_ = "LangChain";
const r_ = "auto.ai.langchain";
const i_ = {
  human: "user",
  ai: "assistant",
  assistant: "assistant",
  system: "system",
  function: "function",
  tool: "tool",
};
const a_ = (t, e, n) => {
  n != null && (t[e] = n);
};
const c_ = (t, e, n) => {
  const s = Number(n);
  Number.isNaN(s) || (t[e] = s);
};
function u_(t) {
  if (typeof t === "string") return t;
  try {
    return JSON.stringify(t);
  } catch {
    return String(t);
  }
}
/**
 * Normalizes a single role token to our canonical set.
 *
 * @param role Incoming role value (free-form, any casing)
 * @returns Canonical role: 'user' | 'assistant' | 'system' | 'function' | 'tool' | <passthrough>
 */ function l_(t) {
  const e = t.toLowerCase();
  return i_[e] ?? e;
}
function p_(t) {
  return t.includes("System")
    ? "system"
    : t.includes("Human")
      ? "user"
      : t.includes("AI") || t.includes("Assistant")
        ? "assistant"
        : t.includes("Function")
          ? "function"
          : t.includes("Tool")
            ? "tool"
            : "user";
}
/**
 * Returns invocation params from a LangChain `tags` object.
 *
 * LangChain often passes runtime parameters (model, temperature, etc.) via the
 * `tags.invocation_params` bag. If `tags` is an array (LangChain sometimes uses
 * string tags), we return `undefined`.
 *
 * @param tags LangChain tags (string[] or record)
 * @returns The `invocation_params` object, if present
 */ function f_(t) {
  if (t && !Array.isArray(t)) return t.invocation_params;
}
/**
 * Normalizes a heterogeneous set of LangChain messages to `{ role, content }`.
 *
 * Why so many branches? LangChain messages can arrive in several shapes:
 *  - Message classes with `_getType()` (most reliable)
 *  - Classes with meaningful constructor names (e.g. `SystemMessage`)
 *  - Plain objects with `type`, or `{ role, content }`
 *  - Serialized format with `{ lc: 1, id: [...], kwargs: { content } }`
 * We preserve the prioritization to minimize behavioral drift.
 *
 * @param messages Mixed LangChain messages
 * @returns Array of normalized `{ role, content }`
 */ function d_(t) {
  return t.map((t) => {
    const e = t._getType;
    if (typeof e === "function") {
      const n = e.call(t);
      return { role: l_(n), content: u_(t.content) };
    }
    if (t.lc === 1 && t.kwargs) {
      const e = t.id;
      const n = Array.isArray(e) && e.length > 0 ? e[e.length - 1] : "";
      const s = typeof n === "string" ? p_(n) : "user";
      return { role: l_(s), content: u_(t.kwargs?.content) };
    }
    if (t.type) {
      const e = String(t.type).toLowerCase();
      return { role: l_(e), content: u_(t.content) };
    }
    if (t.role) return { role: l_(String(t.role)), content: u_(t.content) };
    const n = t.constructor?.name;
    return n && n !== "Object"
      ? { role: l_(p_(n)), content: u_(t.content) }
      : { role: "user", content: u_(t.content) };
  });
}
function m_(t, e, n) {
  const s = {};
  const o = "kwargs" in t ? t.kwargs : void 0;
  const r = e?.temperature ?? n?.ls_temperature ?? o?.temperature;
  c_(s, gd, r);
  const i = e?.max_tokens ?? n?.ls_max_tokens ?? o?.max_tokens;
  c_(s, hd, i);
  const a = e?.top_p ?? o?.top_p;
  c_(s, bd, a);
  const c = e?.frequency_penalty;
  c_(s, _d, c);
  const u = e?.presence_penalty;
  c_(s, yd, u);
  e && "stream" in e && a_(s, md, Boolean(e.stream));
  return s;
}
function g_(t, e, n, s, o) {
  return {
    [fd]: u_(t ?? "langchain"),
    [Od]: "chat",
    [dd]: u_(e),
    [Re]: r_,
    ...m_(n, s, o),
  };
}
function h_(t, e, n, s, o) {
  const r = o?.ls_provider;
  const i = s?.model ?? o?.ls_model_name ?? "unknown";
  const a = g_(r, i, t, s, o);
  if (n && Array.isArray(e) && e.length > 0) {
    a_(a, Cd, e.length);
    const t = e.map((t) => ({ role: "user", content: t }));
    a_(a, Nd, u_(t));
  }
  return a;
}
function __(t, e, n, s, o) {
  const r = o?.ls_provider ?? t.id?.[2];
  const i = s?.model ?? o?.ls_model_name ?? "unknown";
  const a = g_(r, i, t, s, o);
  if (n && Array.isArray(e) && e.length > 0) {
    const t = d_(e.flat());
    const { systemInstructions: n, filteredMessages: s } = Wm(t);
    n && a_(a, jd, n);
    const o = Array.isArray(s) ? s.length : 0;
    a_(a, Cd, o);
    const r = Fm(s);
    a_(a, Nd, u_(r));
  }
  return a;
}
function y_(t, e) {
  const n = [];
  const s = t.flat();
  for (const t of s) {
    const e = t.message?.content;
    if (Array.isArray(e))
      for (const t of e) {
        const e = t;
        e.type === "tool_use" && n.push(e);
      }
  }
  n.length > 0 && a_(e, Dd, u_(n));
}
function b_(t, e) {
  if (!t) return;
  const n = t.tokenUsage;
  const s = t.usage;
  if (n) {
    c_(e, Td, n.promptTokens);
    c_(e, Id, n.completionTokens);
    c_(e, $d, n.totalTokens);
  } else if (s) {
    c_(e, Td, s.input_tokens);
    c_(e, Id, s.output_tokens);
    const t = Number(s.input_tokens);
    const n = Number(s.output_tokens);
    const o = (Number.isNaN(t) ? 0 : t) + (Number.isNaN(n) ? 0 : n);
    o > 0 && c_(e, $d, o);
    s.cache_creation_input_tokens !== void 0 &&
      c_(e, Ud, s.cache_creation_input_tokens);
    s.cache_read_input_tokens !== void 0 &&
      c_(e, Jd, s.cache_read_input_tokens);
  }
}
function v_(t, e) {
  if (!t) return;
  const n = {};
  if (Array.isArray(t.generations)) {
    const s = t.generations
      .flat()
      .map((t) =>
        t.generationInfo?.finish_reason
          ? t.generationInfo.finish_reason
          : t.generation_info?.finish_reason
            ? t.generation_info.finish_reason
            : null,
      )
      .filter((t) => typeof t === "string");
    s.length > 0 && a_(n, wd, u_(s));
    y_(t.generations, n);
    if (e) {
      const e = t.generations
        .flat()
        .map((t) => t.text ?? t.message?.content)
        .filter((t) => typeof t === "string");
      e.length > 0 && a_(n, Rd, u_(e));
    }
  }
  b_(t.llmOutput, n);
  const s = t.llmOutput;
  const o = t.generations?.[0]?.[0];
  const r = o?.message;
  const i = s?.model_name ?? s?.model ?? r?.response_metadata?.model_name;
  i && a_(n, xd, i);
  const a = s?.id ?? r?.id;
  a && a_(n, Ad, a);
  const c = s?.stop_reason ?? r?.response_metadata?.finish_reason;
  c && a_(n, Ed, u_(c));
  return n;
}
function S_(t = {}) {
  const e = t.recordInputs ?? false;
  const n = t.recordOutputs ?? false;
  const s = new Map();
  const o = (t) => {
    const e = s.get(t);
    if (e?.isRecording()) {
      e.end();
      s.delete(t);
    }
  };
  const r = {
    lc_serializable: false,
    lc_namespace: ["langchain_core", "callbacks", "sentry"],
    lc_secrets: void 0,
    lc_attributes: void 0,
    lc_aliases: void 0,
    lc_serializable_keys: void 0,
    lc_id: ["langchain_core", "callbacks", "sentry"],
    lc_kwargs: {},
    name: "SentryCallbackHandler",
    ignoreLLM: false,
    ignoreChain: false,
    ignoreAgent: false,
    ignoreRetriever: false,
    ignoreCustomEvent: false,
    raiseError: false,
    awaitHandlers: true,
    handleLLMStart(t, n, o, r, i, a, c, u) {
      const l = f_(a);
      const p = h_(t, n, e, l, c);
      const f = p[dd];
      const d = p[Od];
      ro(
        {
          name: `${d} ${f}`,
          op: "gen_ai.chat",
          attributes: { ...p, [je]: "gen_ai.chat" },
        },
        (t) => {
          s.set(o, t);
          return t;
        },
      );
    },
    handleChatModelStart(t, n, o, r, i, a, c, u) {
      const l = f_(a);
      const p = __(t, n, e, l, c);
      const f = p[dd];
      const d = p[Od];
      ro(
        {
          name: `${d} ${f}`,
          op: "gen_ai.chat",
          attributes: { ...p, [je]: "gen_ai.chat" },
        },
        (t) => {
          s.set(o, t);
          return t;
        },
      );
    },
    handleLLMEnd(t, e, r, i, a) {
      const c = s.get(e);
      if (c?.isRecording()) {
        const s = v_(t, n);
        s && c.setAttributes(s);
        o(e);
      }
    },
    handleLLMError(t, e) {
      const n = s.get(e);
      if (n?.isRecording()) {
        n.setStatus({ code: Ze, message: "llm_error" });
        o(e);
      }
      rr(t, { mechanism: { handled: false, type: `${r_}.llm_error_handler` } });
    },
    handleChainStart(t, n, o, r) {
      const i = t.name || "unknown_chain";
      const a = { [Re]: "auto.ai.langchain", "langchain.chain.name": i };
      e && (a["langchain.chain.inputs"] = JSON.stringify(n));
      ro(
        {
          name: `chain ${i}`,
          op: "gen_ai.invoke_agent",
          attributes: { ...a, [je]: "gen_ai.invoke_agent" },
        },
        (t) => {
          s.set(o, t);
          return t;
        },
      );
    },
    handleChainEnd(t, e) {
      const r = s.get(e);
      if (r?.isRecording()) {
        n && r.setAttributes({ "langchain.chain.outputs": JSON.stringify(t) });
        o(e);
      }
    },
    handleChainError(t, e) {
      const n = s.get(e);
      if (n?.isRecording()) {
        n.setStatus({ code: Ze, message: "chain_error" });
        o(e);
      }
      rr(t, {
        mechanism: { handled: false, type: `${r_}.chain_error_handler` },
      });
    },
    handleToolStart(t, n, o, r) {
      const i = t.name || "unknown_tool";
      const a = { [Re]: r_, [em]: i };
      e && (a[om] = n);
      ro(
        {
          name: `execute_tool ${i}`,
          op: "gen_ai.execute_tool",
          attributes: { ...a, [je]: "gen_ai.execute_tool" },
        },
        (t) => {
          s.set(o, t);
          return t;
        },
      );
    },
    handleToolEnd(t, e) {
      const r = s.get(e);
      if (r?.isRecording()) {
        n && r.setAttributes({ [rm]: JSON.stringify(t) });
        o(e);
      }
    },
    handleToolError(t, e) {
      const n = s.get(e);
      if (n?.isRecording()) {
        n.setStatus({ code: Ze, message: "tool_error" });
        o(e);
      }
      rr(t, {
        mechanism: { handled: false, type: `${r_}.tool_error_handler` },
      });
    },
    copy() {
      return r;
    },
    toJSON() {
      return { lc: 1, type: "not_implemented", id: r.lc_id };
    },
    toJSONNotImplemented() {
      return { lc: 1, type: "not_implemented", id: r.lc_id };
    },
  };
  return r;
}
const k_ = "LangGraph";
const w_ = "auto.ai.langgraph";
function x_(t) {
  if (!t || t.length === 0) return null;
  const e = [];
  for (const n of t)
    if (n && typeof n === "object") {
      const t = n.tool_calls;
      t && Array.isArray(t) && e.push(...t);
    }
  return e.length > 0 ? e : null;
}
function A_(t) {
  const e = t;
  let n = 0;
  let s = 0;
  let o = 0;
  if (e.usage_metadata && typeof e.usage_metadata === "object") {
    const t = e.usage_metadata;
    typeof t.input_tokens === "number" && (n = t.input_tokens);
    typeof t.output_tokens === "number" && (s = t.output_tokens);
    typeof t.total_tokens === "number" && (o = t.total_tokens);
    return { inputTokens: n, outputTokens: s, totalTokens: o };
  }
  if (e.response_metadata && typeof e.response_metadata === "object") {
    const t = e.response_metadata;
    if (t.tokenUsage && typeof t.tokenUsage === "object") {
      const e = t.tokenUsage;
      typeof e.promptTokens === "number" && (n = e.promptTokens);
      typeof e.completionTokens === "number" && (s = e.completionTokens);
      typeof e.totalTokens === "number" && (o = e.totalTokens);
    }
  }
  return { inputTokens: n, outputTokens: s, totalTokens: o };
}
function E_(t, e) {
  const n = e;
  if (n.response_metadata && typeof n.response_metadata === "object") {
    const e = n.response_metadata;
    e.model_name &&
      typeof e.model_name === "string" &&
      t.setAttribute(xd, e.model_name);
    e.finish_reason &&
      typeof e.finish_reason === "string" &&
      t.setAttribute(wd, [e.finish_reason]);
  }
}
function T_(t) {
  if (!t.builder?.nodes?.tools?.runnable?.tools) return null;
  const e = t.builder?.nodes?.tools?.runnable?.tools;
  return e && Array.isArray(e) && e.length !== 0
    ? e.map((t) => ({
        name: t.lc_kwargs?.name,
        description: t.lc_kwargs?.description,
        schema: t.lc_kwargs?.schema,
      }))
    : null;
}
function I_(t, e, n) {
  const s = n;
  const o = s?.messages;
  if (!o || !Array.isArray(o)) return;
  const r = e?.length ?? 0;
  const i = o.length > r ? o.slice(r) : [];
  if (i.length === 0) return;
  const a = x_(i);
  a && t.setAttribute(Dd, JSON.stringify(a));
  const c = d_(i);
  t.setAttribute(Rd, JSON.stringify(c));
  let u = 0;
  let l = 0;
  let p = 0;
  for (const e of i) {
    const n = A_(e);
    u += n.inputTokens;
    l += n.outputTokens;
    p += n.totalTokens;
    E_(t, e);
  }
  u > 0 && t.setAttribute(Td, u);
  l > 0 && t.setAttribute(Id, l);
  p > 0 && t.setAttribute($d, p);
}
function $_(t, e) {
  return new Proxy(t, {
    apply(t, n, s) {
      return oo(
        {
          op: "gen_ai.create_agent",
          name: "create_agent",
          attributes: {
            [Re]: w_,
            [je]: "gen_ai.create_agent",
            [Od]: "create_agent",
          },
        },
        (o) => {
          try {
            const r = Reflect.apply(t, n, s);
            const i = s.length > 0 ? s[0] : {};
            if (i?.name && typeof i.name === "string") {
              o.setAttribute(Fd, i.name);
              o.updateName(`create_agent ${i.name}`);
            }
            const a = r.invoke;
            a && typeof a === "function" && (r.invoke = O_(a.bind(r), r, i, e));
            return r;
          } catch (t) {
            o.setStatus({ code: Ze, message: "internal_error" });
            rr(t, {
              mechanism: { handled: false, type: "auto.ai.langgraph.error" },
            });
            throw t;
          }
        },
      );
    },
  });
}
function O_(t, e, n, s) {
  return new Proxy(t, {
    apply(t, o, r) {
      return oo(
        {
          op: "gen_ai.invoke_agent",
          name: "invoke_agent",
          attributes: { [Re]: w_, [je]: Wd, [Od]: "invoke_agent" },
        },
        async (i) => {
          try {
            const a = n?.name;
            if (a && typeof a === "string") {
              i.setAttribute(Ld, a);
              i.setAttribute(Fd, a);
              i.updateName(`invoke_agent ${a}`);
            }
            const c = r.length > 1 ? r[1] : void 0;
            const u = c?.configurable;
            const l = u?.thread_id;
            l && typeof l === "string" && i.setAttribute(qd, l);
            const p = T_(e);
            p && i.setAttribute(Md, JSON.stringify(p));
            const f = s.recordInputs;
            const d = s.recordOutputs;
            const m = r.length > 0 ? (r[0]?.messages ?? []) : [];
            if (m && f) {
              const t = d_(m);
              const { systemInstructions: e, filteredMessages: n } = Wm(t);
              e && i.setAttribute(jd, e);
              const s = Fm(n);
              const o = Array.isArray(n) ? n.length : 0;
              i.setAttributes({ [Nd]: JSON.stringify(s), [Cd]: o });
            }
            const g = await Reflect.apply(t, o, r);
            d && I_(i, m ?? null, g);
            return g;
          } catch (t) {
            i.setStatus({ code: Ze, message: "internal_error" });
            rr(t, {
              mechanism: { handled: false, type: "auto.ai.langgraph.error" },
            });
            throw t;
          }
        },
      );
    },
  });
}
/**
 * Directly instruments a StateGraph instance to add tracing spans
 *
 * This function can be used to manually instrument LangGraph StateGraph instances
 * in environments where automatic instrumentation is not available or desired.
 *
 * @param stateGraph - The StateGraph instance to instrument
 * @param options - Optional configuration for recording inputs/outputs
 *
 * @example
 * ```typescript
 * import { instrumentLangGraph } from '@sentry/cloudflare';
 * import { StateGraph } from '@langchain/langgraph';
 *
 * const graph = new StateGraph(MessagesAnnotation)
 *   .addNode('agent', mockLlm)
 *   .addEdge(START, 'agent')
 *   .addEdge('agent', END);
 *
 * instrumentLangGraph(graph, { recordInputs: true, recordOutputs: true });
 * const compiled = graph.compile({ name: 'my_agent' });
 * ```
 */ function C_(t, e) {
  const n = e || {};
  t.compile = $_(t.compile.bind(t), n);
  return t;
}
function N_(t) {
  return t === void 0
    ? void 0
    : t >= 400 && t < 500
      ? "warning"
      : t >= 500
        ? "error"
        : void 0;
}
/**
 * An error emitted by Sentry SDKs and related utilities.
 * @deprecated This class is no longer used and will be removed in a future version. Use `Error` instead.
 */ class SentryError extends Error {
  constructor(t, e = "warn") {
    super(t);
    this.message = t;
    this.logLevel = e;
  }
}
const j_ = e;
/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */ function R_() {
  try {
    new ErrorEvent("");
    return true;
  } catch {
    return false;
  }
}
/**
 * Tells whether current environment supports DOMError objects
 * {@link supportsDOMError}.
 *
 * @returns Answer to the given question.
 */ function M_() {
  try {
    new DOMError("");
    return true;
  } catch {
    return false;
  }
}
/**
 * Tells whether current environment supports DOMException objects
 * {@link supportsDOMException}.
 *
 * @returns Answer to the given question.
 */ function P_() {
  try {
    new DOMException("");
    return true;
  } catch {
    return false;
  }
}
/**
 * Tells whether current environment supports History API
 * {@link supportsHistory}.
 *
 * @returns Answer to the given question.
 */ function D_() {
  return "history" in j_ && !!j_.history;
}
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ const F_ = L_;
function L_() {
  if (!("fetch" in j_)) return false;
  try {
    new Headers();
    new Request("data:,");
    new Response();
    return true;
  } catch {
    return false;
  }
}
function q_(t) {
  return (
    t && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(t.toString())
  );
}
/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */ function U_() {
  if (typeof EdgeRuntime === "string") return true;
  if (!L_()) return false;
  if (q_(j_.fetch)) return true;
  let e = false;
  const n = j_.document;
  if (n && typeof n.createElement === "function")
    try {
      const t = n.createElement("iframe");
      t.hidden = true;
      n.head.appendChild(t);
      t.contentWindow?.fetch && (e = q_(t.contentWindow.fetch));
      n.head.removeChild(t);
    } catch (e) {
      t &&
        y.warn(
          "Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ",
          e,
        );
    }
  return e;
}
/**
 * Tells whether current environment supports ReportingObserver API
 * {@link supportsReportingObserver}.
 *
 * @returns Answer to the given question.
 */ function J_() {
  return "ReportingObserver" in j_;
}
/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ function z_() {
  if (!L_()) return false;
  try {
    new Request("_", { referrerPolicy: "origin" });
    return true;
  } catch {
    return false;
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */ function B_(t, e) {
  const n = "fetch";
  R(n, t);
  P(n, () => V_(void 0, e));
}
function W_(t) {
  const e = "fetch-body-resolved";
  R(e, t);
  P(e, () => V_(K_));
}
function V_(t, n = false) {
  (n && !U_()) ||
    mt(e, "fetch", function (n) {
      return function (...s) {
        const o = new Error();
        const { method: r, url: i } = Y_(s);
        const a = {
          args: s,
          fetchData: { method: r, url: i },
          startTimestamp: Qt() * 1e3,
          virtualError: o,
          headers: X_(s),
        };
        t || D("fetch", { ...a });
        return n.apply(e, s).then(
          async (e) => {
            t
              ? t(e)
              : D("fetch", { ...a, endTimestamp: Qt() * 1e3, response: e });
            return e;
          },
          (t) => {
            D("fetch", { ...a, endTimestamp: Qt() * 1e3, error: t });
            if (W(t) && t.stack === void 0) {
              t.stack = o.stack;
              gt(t, "framesToPop", 1);
            }
            const e = Ie();
            const n = e?.getOptions().enhanceFetchErrorMessages ?? "always";
            const s = n !== false;
            if (
              s &&
              t instanceof TypeError &&
              (t.message === "Failed to fetch" ||
                t.message === "Load failed" ||
                t.message === "NetworkError when attempting to fetch resource.")
            )
              try {
                const e = new URL(a.fetchData.url);
                const s = e.host;
                n === "always"
                  ? (t.message = `${t.message} (${s})`)
                  : gt(t, "__sentry_fetch_url_host__", s);
              } catch {}
            throw t;
          },
        );
      };
    });
}
async function G_(t, e) {
  if (t?.body) {
    const n = t.body;
    const s = n.getReader();
    const o = setTimeout(() => {
      n.cancel().then(null, () => {});
    }, 9e4);
    let r = true;
    while (r) {
      let t;
      try {
        t = setTimeout(() => {
          n.cancel().then(null, () => {});
        }, 5e3);
        const { done: o } = await s.read();
        clearTimeout(t);
        if (o) {
          e();
          r = false;
        }
      } catch {
        r = false;
      } finally {
        clearTimeout(t);
      }
    }
    clearTimeout(o);
    s.releaseLock();
    n.cancel().then(null, () => {});
  }
}
function K_(t) {
  let e;
  try {
    e = t.clone();
  } catch {
    return;
  }
  G_(e, () => {
    D("fetch-body-resolved", { endTimestamp: Qt() * 1e3, response: t });
  });
}
function H_(t, e) {
  return !!t && typeof t === "object" && !!t[e];
}
function Z_(t) {
  return typeof t === "string"
    ? t
    : t
      ? H_(t, "url")
        ? t.url
        : t.toString
          ? t.toString()
          : ""
      : "";
}
function Y_(t) {
  if (t.length === 0) return { method: "GET", url: "" };
  if (t.length === 2) {
    const [e, n] = t;
    return {
      url: Z_(e),
      method: H_(n, "method")
        ? String(n.method).toUpperCase()
        : at(e) && H_(e, "method")
          ? String(e.method).toUpperCase()
          : "GET",
    };
  }
  const e = t[0];
  return {
    url: Z_(e),
    method: H_(e, "method") ? String(e.method).toUpperCase() : "GET",
  };
}
function X_(t) {
  const [e, n] = t;
  try {
    if (typeof n === "object" && n !== null && "headers" in n && n.headers)
      return new Headers(n.headers);
    if (at(e)) return new Headers(e.headers);
  } catch {}
}
/**
 * Figures out if we're building a browser bundle.
 *
 * @returns true if this is a browser bundle build.
 */ function Q_() {
  return (
    typeof __SENTRY_BROWSER_BUNDLE__ !== "undefined" &&
    !!__SENTRY_BROWSER_BUNDLE__
  );
}
function ty() {
  return "npm";
}
/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */ function ey() {
  return (
    !Q_() &&
    Object.prototype.toString.call(
      typeof process !== "undefined" ? process : 0,
    ) === "[object process]"
  );
}
/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */ function ny(t, e) {
  return t.require(e);
}
/**
 * Helper for dynamically loading module that should work with linked dependencies.
 * The problem is that we _should_ be using `require(require.resolve(moduleName, { paths: [cwd()] }))`
 * However it's _not possible_ to do that with Webpack, as it has to know all the dependencies during
 * build time. `require.resolve` is also not available in any other way, so we cannot create,
 * a fake helper like we do with `dynamicRequire`.
 *
 * We always prefer to use local package, thus the value is not returned early from each `try/catch` block.
 * That is to mimic the behavior of `require.resolve` exactly.
 *
 * @param moduleName module name to require
 * @param existingModule module to use for requiring
 * @returns possibly required module
 */ function sy(t, e = module) {
  let n;
  try {
    n = ny(e, t);
  } catch {}
  if (!n)
    try {
      const { cwd: s } = ny(e, "process");
      n = ny(e, `${s()}/node_modules/${t}`);
    } catch {}
  return n;
}
function oy() {
  return typeof window !== "undefined" && (!ey() || ry());
}
function ry() {
  const t = e.process;
  return t?.type === "renderer";
}
/**
 * Replaces constructor functions in module exports, handling read-only properties,
 * and both default and named exports by wrapping them with the constructor.
 *
 * @param exports The module exports object to modify
 * @param exportName The name of the export to replace (e.g., 'GoogleGenAI', 'Anthropic', 'OpenAI')
 * @param wrappedConstructor The wrapped constructor function to replace the original with
 * @returns void
 */ function iy(t, e, n) {
  const s = t[e];
  if (typeof s === "function") {
    try {
      t[e] = n;
    } catch (s) {
      Object.defineProperty(t, e, {
        value: n,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    if (t.default === s)
      try {
        t.default = n;
      } catch (e) {
        Object.defineProperty(t, "default", {
          value: n,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
  }
}
function ay(t, e = false) {
  const n =
    e ||
    (t &&
      !t.startsWith("/") &&
      !t.match(/^[A-Z]:/) &&
      !t.startsWith(".") &&
      !t.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//));
  return !n && t !== void 0 && !t.includes("node_modules/");
}
function cy(t) {
  const e = /^\s*[-]{4,}$/;
  const n = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
  const s = /at (?:async )?(.+?) \(data:(.*?),/;
  return (o) => {
    const r = o.match(s);
    if (r) return { filename: `<data:${r[2]}>`, function: r[1] };
    const i = o.match(n);
    if (i) {
      let e;
      let n;
      let s;
      let o;
      let r;
      if (i[1]) {
        s = i[1];
        let t = s.lastIndexOf(".");
        s[t - 1] === "." && t--;
        if (t > 0) {
          e = s.slice(0, t);
          n = s.slice(t + 1);
          const o = e.indexOf(".Module");
          if (o > 0) {
            s = s.slice(o + 1);
            e = e.slice(0, o);
          }
        }
        o = void 0;
      }
      if (n) {
        o = e;
        r = n;
      }
      if (n === "<anonymous>") {
        r = void 0;
        s = void 0;
      }
      if (s === void 0) {
        r = r || v;
        s = o ? `${o}.${r}` : r;
      }
      let a = C(i[2]);
      const c = i[5] === "native";
      a || !i[5] || c || (a = i[5]);
      const u = a ? py(a) : void 0;
      return {
        filename: u ?? a,
        module: u && t?.(u),
        function: s,
        lineno: ly(i[3]),
        colno: ly(i[4]),
        in_app: ay(a || "", c),
      };
    }
    return o.match(e) ? { filename: o } : void 0;
  };
}
function uy(t) {
  return [90, cy(t)];
}
function ly(t) {
  return parseInt(t || "", 10) || void 0;
}
function py(t) {
  try {
    return decodeURI(t);
  } catch {
    return;
  }
}
/**
 * A node.js watchdog timer
 * @param pollInterval The interval that we expect to get polled at
 * @param anrThreshold The threshold for when we consider ANR
 * @param callback The callback to call for ANR
 * @returns An object with `poll` and `enabled` functions {@link WatchdogReturn}
 */ function fy(t, e, n, s) {
  const o = t();
  let r = false;
  let i = true;
  setInterval(() => {
    const t = o.getTimeMs();
    if (r === false && t > e + n) {
      r = true;
      i && s();
    }
    t < e + n && (r = false);
  }, 20);
  return {
    poll: () => {
      o.reset();
    },
    enabled: (t) => {
      i = t;
    },
  };
}
function dy(t, e, n) {
  const s = e ? e.replace(/^file:\/\//, "") : void 0;
  const o = t.location.columnNumber ? t.location.columnNumber + 1 : void 0;
  const r = t.location.lineNumber ? t.location.lineNumber + 1 : void 0;
  return {
    filename: s,
    module: n(s),
    function: t.functionName || v,
    colno: o,
    lineno: r,
    in_app: s ? ay(s) : void 0,
  };
}
class LRUMap {
  constructor(t) {
    this._maxSize = t;
    this._cache = new Map();
  }
  get size() {
    return this._cache.size;
  }
  get(t) {
    const e = this._cache.get(t);
    if (e !== void 0) {
      this._cache.delete(t);
      this._cache.set(t, e);
      return e;
    }
  }
  set(t, e) {
    if (this._cache.size >= this._maxSize) {
      const t = this._cache.keys().next().value;
      this._cache.delete(t);
    }
    this._cache.set(t, e);
  }
  remove(t) {
    const e = this._cache.get(t);
    e && this._cache.delete(t);
    return e;
  }
  clear() {
    this._cache.clear();
  }
  keys() {
    return Array.from(this._cache.keys());
  }
  values() {
    const t = [];
    this._cache.forEach((e) => t.push(e));
    return t;
  }
}
function my(t) {
  if (typeof EdgeRuntime !== "string") return;
  const n = e[Symbol.for("@vercel/request-context")];
  const s = n?.get?.();
  s?.waitUntil && s.waitUntil(t);
}
async function gy(t) {
  try {
    y.log("Flushing events...");
    await yr(t);
    y.log("Done flushing events");
  } catch (t) {
    y.log("Error while flushing events:\n", t);
  }
}
async function hy(t = {}) {
  const { timeout: n = 2e3 } = t;
  if (
    "cloudflareWaitUntil" in t &&
    typeof t?.cloudflareWaitUntil === "function"
  ) {
    t.cloudflareWaitUntil(gy(n));
    return;
  }
  if (
    "cloudflareCtx" in t &&
    typeof t.cloudflareCtx?.waitUntil === "function"
  ) {
    t.cloudflareCtx.waitUntil(gy(n));
    return;
  }
  if (e[Symbol.for("@vercel/request-context")]) {
    my(gy(n));
    return;
  }
  if (typeof process === "undefined") return;
  const s =
    !!process.env.FUNCTIONS_WORKER_RUNTIME ||
    !!process.env.LAMBDA_TASK_ROOT ||
    !!process.env.K_SERVICE ||
    !!process.env.CF_PAGES ||
    !!process.env.VERCEL ||
    !!process.env.NETLIFY;
  s && (await gy(n));
}
/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */ function _y(t) {
  return t.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
export {
  Sh as ANTHROPIC_AI_INTEGRATION_NAME,
  i as CONSOLE_LEVELS,
  Client,
  us as DEFAULT_ENVIRONMENT,
  hi as DEFAULT_RETRY_AFTER,
  ls as DEV_ENVIRONMENT,
  Ge as GEN_AI_CONVERSATION_ID_ATTRIBUTE,
  e as GLOBAL_OBJ,
  Dh as GOOGLE_GENAI_INTEGRATION_NAME,
  o_ as LANGCHAIN_INTEGRATION_NAME,
  k_ as LANGGRAPH_INTEGRATION_NAME,
  LRUMap,
  cn as MAX_BAGGAGE_STRING_LENGTH,
  fa as MULTIPLEXED_TRANSPORT_EXTRA_KEY,
  Cg as OPENAI_INTEGRATION_NAME,
  n as SDK_VERSION,
  Ue as SEMANTIC_ATTRIBUTE_CACHE_HIT,
  ze as SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE,
  Je as SEMANTIC_ATTRIBUTE_CACHE_KEY,
  qe as SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME,
  Be as SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD,
  Le as SEMANTIC_ATTRIBUTE_PROFILE_ID,
  Fe as SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME,
  Me as SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON,
  Pe as SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT,
  De as SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE,
  je as SEMANTIC_ATTRIBUTE_SENTRY_OP,
  Re as SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  Ne as SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE,
  Ce as SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE,
  Oe as SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  We as SEMANTIC_ATTRIBUTE_URL_FULL,
  Ve as SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE,
  rn as SENTRY_BAGGAGE_KEY_PREFIX,
  an as SENTRY_BAGGAGE_KEY_PREFIX_REGEX,
  mi as SENTRY_BUFFER_FULL_ERROR,
  Ze as SPAN_STATUS_ERROR,
  He as SPAN_STATUS_OK,
  Ke as SPAN_STATUS_UNSET,
  Scope,
  SentryError,
  SentryNonRecordingSpan,
  SentrySpan,
  ServerRuntimeClient,
  SyncPromise,
  An as TRACEPARENT_REGEXP,
  bo as TRACING_DEFAULTS,
  v as UNKNOWN_FUNCTION,
  Sl as _INTERNAL_FLAG_BUFFER_SIZE,
  kl as _INTERNAL_MAX_FLAGS_PER_SPAN,
  Tl as _INTERNAL_addFeatureFlagToActiveSpan,
  Xr as _INTERNAL_captureLog,
  ui as _INTERNAL_captureMetric,
  Yr as _INTERNAL_captureSerializedLog,
  ii as _INTERNAL_captureSerializedMetric,
  mg as _INTERNAL_cleanupToolCallSpan,
  va as _INTERNAL_clearAiProviderSkips,
  xl as _INTERNAL_copyFlagsFromScopeToEvent,
  Yi as _INTERNAL_enhanceErrorWithSentryInfo,
  Qr as _INTERNAL_flushLogsBuffer,
  li as _INTERNAL_flushMetricsBuffer,
  dg as _INTERNAL_getSpanForToolCallId,
  Al as _INTERNAL_insertFlagToScope,
  $t as _INTERNAL_safeDateNow,
  It as _INTERNAL_safeMathRandom,
  pe as _INTERNAL_setSpanForScope,
  ba as _INTERNAL_shouldSkipAiProviderWrapping,
  ya as _INTERNAL_skipAiProviderWrapping,
  Tt as _INTERNAL_withRandomSafeContext,
  Ja as addAutoIpAddressToSession,
  Ua as addAutoIpAddressToUser,
  lc as addBreadcrumb,
  Hn as addChildSpanToSpan,
  ou as addConsoleInstrumentationHandler,
  Vt as addContextToFrame,
  kr as addEventProcessor,
  Jt as addExceptionMechanism,
  Ut as addExceptionTypeValue,
  W_ as addFetchEndInstrumentationHandler,
  B_ as addFetchInstrumentationHandler,
  L as addGlobalErrorInstrumentationHandler,
  J as addGlobalUnhandledRejectionInstrumentationHandler,
  R as addHandler,
  Lr as addIntegration,
  Ts as addItemToEnvelope,
  gt as addNonEnumerableProperty,
  Ig as addVercelAiProcessors,
  $c as applyAggregateErrorsToEvent,
  Lo as applyScopeDataToEvent,
  za as applySdkMetadata,
  un as baggageHeaderToDynamicSamplingContext,
  Mu as basename,
  ne as browserPerformanceTimeOrigin,
  dy as callFrameToStackFrame,
  hr as captureCheckIn,
  uu as captureConsoleIntegration,
  ar as captureEvent,
  rr as captureException,
  Ff as captureFeedback,
  ir as captureMessage,
  Er as captureSession,
  Gt as checkOrSetAlreadyCaught,
  br as close,
  re as closeSession,
  yl as consoleIntegration,
  td as consoleLoggingIntegration,
  u as consoleSandbox,
  ao as continueTrace,
  jl as conversationIdIntegration,
  Ln as convertSpanLinksForEnvelope,
  yt as convertToPlainObject,
  Ps as createAttachmentEnvelopeItem,
  Vi as createCheckInEnvelope,
  wi as createClientReportEnvelope,
  ad as createConsolaReporter,
  Es as createEnvelope,
  zs as createEventEnvelope,
  qs as createEventEnvelopeHeaders,
  S_ as createLangChainCallbackHandler,
  Js as createSessionEnvelope,
  Bs as createSpanEnvelope,
  Ms as createSpanEnvelopeItem,
  w as createStackParser,
  ki as createTransport,
  Zt as dateTimestampInSeconds,
  Za as debounce,
  y as debug,
  du as dedupeIntegration,
  qr as defineIntegration,
  Ru as dirname,
  yi as disabledUntil,
  kt as dropUndefinedKeys,
  yn as dsnFromString,
  _n as dsnToString,
  ln as dynamicSamplingContextToSentryBaggageHeader,
  xr as endSession,
  wa as envToBool,
  $s as envelopeContainsItemType,
  Fs as envelopeItemTypeToDataCategory,
  _y as escapeStringForRegex,
  yc as eventFiltersIntegration,
  oa as eventFromMessage,
  sa as eventFromUnknownInput,
  Xi as exceptionFromError,
  ku as extraErrorDataIntegration,
  St as extractExceptionKeysForMessage,
  cc as extractQueryParamsFromUrl,
  En as extractTraceparentData,
  Il as featureFlagsIntegration,
  ay as filenameIsInApp,
  mt as fill,
  yr as flush,
  hy as flushIfServerless,
  La as fmt,
  Is as forEachEnvelopeItem,
  gc as functionToStringIntegration,
  In as generateSentryTraceHeader,
  ue as generateSpanId,
  ce as generateTraceId,
  $n as generateTraceparentHeader,
  Qn as getActiveSpan,
  N_ as getBreadcrumbLogLevelFromHttpStatusCode,
  on as getCapturedScopesOnSpan,
  Ie as getClient,
  Jo as getCombinedScopeData,
  dt as getComponentName,
  we as getCurrentScope,
  Fo as getDebugImagesForResources,
  me as getDefaultCurrentScope,
  ge as getDefaultIsolationScope,
  ds as getDynamicSamplingContextFromClient,
  ms as getDynamicSamplingContextFromScope,
  gs as getDynamicSamplingContextFromSpan,
  Cr as getEnvelopeEndpointWithUrlEncodedAuth,
  qt as getEventDescription,
  Do as getFilenameToDebugIdMap,
  Uc as getFilenameToMetadataMap,
  $ as getFramesFromEvent,
  I as getFunctionName,
  Ae as getGlobalScope,
  r as getGlobalSingleton,
  $a as getHttpSpanDetailsFromUrlObject,
  Mr as getIntegrationsToSetup,
  xe as getIsolationScope,
  ft as getLocationHref,
  s as getMainCarrier,
  _t as getOriginalFunction,
  Nr as getReportDialogEndpoint,
  Xn as getRootSpan,
  ty as getSDKSource,
  Na as getSanitizedUrlString,
  Ta as getSanitizedUrlStringFromUrlObject,
  Ls as getSdkMetadataForEnvelopeHeader,
  Yn as getSpanDescendants,
  Ye as getSpanStatusFromHttpCode,
  Vn as getStatusMessage,
  $e as getTraceContextFromScope,
  Ba as getTraceData,
  Ha as getTraceMetaTags,
  $l as growthbookIntegration,
  to as handleCallbackErrors,
  qa as handleTunnelRequest,
  os as hasSpansEnabled,
  Xa as headersToDict,
  lt as htmlTreeAsString,
  oc as httpHeadersToSpanAttributes,
  tc as httpRequestToRequestData,
  bc as inboundFiltersIntegration,
  ia as initAndBind,
  jr as installedIntegrations,
  Ph as instrumentAnthropicAiClient,
  Fl as instrumentFetchRequest,
  s_ as instrumentGoogleGenAIClient,
  C_ as instrumentLangGraph,
  ph as instrumentOpenAiClient,
  $_ as instrumentStateGraphCompile,
  Xu as instrumentSupabaseClient,
  Nu as isAbsolute,
  Kt as isAlreadyCaptured,
  oy as isBrowser,
  Q_ as isBrowserBundle,
  K as isDOMError,
  H as isDOMException,
  et as isElement,
  Sr as isEnabled,
  W as isError,
  G as isErrorEvent,
  tt as isEvent,
  vr as isInitialized,
  rt as isInstanceOf,
  jt as isMatchingPattern,
  q_ as isNativeFunction,
  ey as isNodeEnv,
  Y as isParameterizedString,
  Q as isPlainObject,
  X as isPrimitive,
  bi as isRateLimited,
  nt as isRegExp,
  Ra as isSentryRequestUrl,
  Z as isString,
  ot as isSyntheticEvent,
  st as isThenable,
  Aa as isURLObjectRelative,
  it as isVueViewModel,
  ju as join,
  gr as lastEventId,
  Fc as linkedErrorsIntegration,
  sy as loadModule,
  Vs as logSpanEnd,
  Ws as logSpanStart,
  Vf as logger,
  wn as makeDsn,
  ha as makeMultiplexedTransport,
  pa as makeOfflineTransport,
  gi as makePromiseBuffer,
  se as makeSession,
  ht as markFunctionWrapped,
  P as maybeInstrument,
  qo as mergeScopeData,
  rd as metrics,
  Vc as moduleMetadataIntegration,
  cy as node,
  uy as nodeStackLineParser,
  _s as normalize,
  Cu as normalizePath,
  ys as normalizeToSize,
  xs as normalizeUrlToBase,
  Co as notifyEventProcessors,
  dn as objectToBaggageHeader,
  At as objectify,
  c as originalConsoleMethods,
  Fa as parameterize,
  pn as parseBaggageHeader,
  Rs as parseEnvelope,
  _i as parseRetryAfterHeader,
  xn as parseSampleRate,
  Wt as parseSemver,
  Hi as parseStackFrames,
  Ea as parseStringToURLObject,
  Oa as parseUrl,
  Ko as prepareEvent,
  Dl as profiler,
  Tn as propagationContextFromHeaders,
  ss as registerSpanErrorInstrumentation,
  Oo as rejectedSyncPromise,
  Ou as relative,
  iy as replaceExports,
  eu as requestDataIntegration,
  M as resetInstrumentationHandlers,
  Iu as resolve,
  $o as resolvedSyncPromise,
  Du as rewriteFramesIntegration,
  Nt as safeJoin,
  no as sampleSpan,
  Ns as serializeEnvelope,
  Se as setAsyncContextStrategy,
  sn as setCapturedScopesOnSpan,
  cr as setContext,
  mr as setConversationId,
  aa as setCurrentClient,
  lr as setExtra,
  ur as setExtras,
  Xe as setHttpStatus,
  Gs as setMeasurement,
  fr as setTag,
  pr as setTags,
  dr as setUser,
  iu as severityLevelFromString,
  Cn as shouldContinueTrace,
  Ka as shouldPropagateTraceForUrl,
  Ct as snipLine,
  Wn as spanIsSampled,
  qn as spanTimeInputToSeconds,
  hs as spanToBaggageHeader,
  Jn as spanToJSON,
  Pn as spanToTraceContext,
  Dn as spanToTraceHeader,
  x as stackParserFromStackParserOptions,
  xo as startIdleSpan,
  io as startInactiveSpan,
  lo as startNewTrace,
  wr as startSession,
  oo as startSpan,
  ro as startSpanManual,
  Rt as stringMatchesSomePattern,
  ja as stripDataUrlContent,
  A as stripSentryFramesAndReverse,
  Ca as stripUrlQueryAndFragment,
  el as supabaseIntegration,
  M_ as supportsDOMError,
  P_ as supportsDOMException,
  R_ as supportsErrorEvent,
  F_ as supportsFetch,
  D_ as supportsHistory,
  U_ as supportsNativeFetch,
  z_ as supportsReferrerPolicy,
  J_ as supportsReportingObserver,
  uo as suppressTracing,
  pl as thirdPartyErrorFilterIntegration,
  Ks as timedEventsToMeasurements,
  Qt as timestampInSeconds,
  D as triggerHandlers,
  Kl as trpcMiddleware,
  Ot as truncate,
  vi as updateRateLimits,
  oe as updateSession,
  es as updateSpanName,
  Ft as uuid4,
  my as vercelWaitUntil,
  fy as watchdogTimer,
  Ya as winterCGHeadersToDict,
  Qa as winterCGRequestToRequestData,
  co as withActiveSpan,
  Te as withIsolationScope,
  _r as withMonitor,
  Ee as withScope,
  Df as wrapMcpServerWithSentry,
  ll as zodErrorsIntegration,
};
