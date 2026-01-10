// @sentry/core@10.32.1 downloaded from https://ga.jspm.io/npm:@sentry/core@10.32.1/build/esm/index.js

const t = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
const e = globalThis;
const n = "10.32.1";
function o() {
  s(e);
  return e;
}
function s(t) {
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
 */ function r(t, o, s = e) {
  const r = (s.__SENTRY__ = s.__SENTRY__ || {});
  const i = (r[n] = r[n] || {});
  return i[t] || (i[t] = o());
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
  const o = {};
  const s = Object.keys(c);
  s.forEach((t) => {
    const e = c[t];
    o[t] = n[t];
    n[t] = e;
  });
  try {
    return t();
  } finally {
    s.forEach((t) => {
      n[t] = o[t];
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
function h(n, ...o) {
  t &&
    f() &&
    u(() => {
      e.console[n](`${a}[${n}]:`, ...o);
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
  return (t, n = 0, o = 0) => {
    const s = [];
    const r = t.split("\n");
    for (let t = n; t < r.length; t++) {
      let n = r[t];
      n.length > 1024 && (n = n.slice(0, 1024));
      const i = S.test(n) ? n.replace(S, "$1") : n;
      if (!i.match(/\S*Error: /)) {
        for (const t of e) {
          const e = t(i);
          if (e) {
            s.push(e);
            break;
          }
        }
        if (s.length >= b + o) break;
      }
    }
    return E(s.slice(o));
  };
}
function x(t) {
  return Array.isArray(t) ? w(...t) : t;
}
function E(t) {
  if (!t.length) return [];
  const e = Array.from(t);
  /sentryWrapped/.test(A(e).function || "") && e.pop();
  e.reverse();
  if (k.test(A(e).function || "")) {
    e.pop();
    k.test(A(e).function || "") && e.pop();
  }
  return e
    .slice(0, b)
    .map((t) => ({
      ...t,
      filename: t.filename || A(e).filename,
      function: t.function || v,
    }));
}
function A(t) {
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
const C = {};
const j = {};
function N(t, e) {
  C[t] = C[t] || [];
  C[t].push(e);
}
function P() {
  Object.keys(C).forEach((t) => {
    C[t] = void 0;
  });
}
function M(e, n) {
  if (!j[e]) {
    j[e] = true;
    try {
      n();
    } catch (n) {
      t && y.error(`Error while instrumenting ${e}`, n);
    }
  }
}
function R(e, n) {
  const o = e && C[e];
  if (o)
    for (const s of o)
      try {
        s(n);
      } catch (n) {
        t &&
          y.error(
            `Error while triggering instrumentation handler.\nType: ${e}\nName: ${I(s)}\nError:`,
            n,
          );
      }
}
let D = null;
function F(t) {
  const e = "error";
  N(e, t);
  M(e, L);
}
function L() {
  D = e.onerror;
  e.onerror = function (t, e, n, o, s) {
    const r = { column: o, error: s, line: n, msg: t, url: e };
    R("error", r);
    return !!D && D.apply(this, arguments);
  };
  e.onerror.__SENTRY_INSTRUMENTED__ = true;
}
let U = null;
function q(t) {
  const e = "unhandledrejection";
  N(e, t);
  M(e, J);
}
function J() {
  U = e.onunhandledrejection;
  e.onunhandledrejection = function (t) {
    const e = t;
    R("unhandledrejection", e);
    return !U || U.apply(this, arguments);
  };
  e.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
}
const z = Object.prototype.toString;
/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function B(t) {
  switch (z.call(t)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
      return true;
    default:
      return st(t, Error);
  }
}
/**
 * Checks whether given value is an instance of the given built-in class.
 *
 * @param wat The value to be checked
 * @param className
 * @returns A boolean representing the result.
 */ function W(t, e) {
  return z.call(t) === `[object ${e}]`;
}
/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function V(t) {
  return W(t, "ErrorEvent");
}
/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function K(t) {
  return W(t, "DOMError");
}
/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function G(t) {
  return W(t, "DOMException");
}
/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function H(t) {
  return W(t, "String");
}
/**
 * Checks whether given string is parameterized
 * {@link isParameterizedString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function Z(t) {
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
 */ function Y(t) {
  return (
    t === null || Z(t) || (typeof t !== "object" && typeof t !== "function")
  );
}
/**
 * Checks whether given value's type is an object literal, or a class instance.
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function X(t) {
  return W(t, "Object");
}
/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function Q(t) {
  return typeof Event !== "undefined" && st(t, Event);
}
/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function tt(t) {
  return typeof Element !== "undefined" && st(t, Element);
}
/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function et(t) {
  return W(t, "RegExp");
}
/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */ function nt(t) {
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
    X(t) &&
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
 */ function st(t, e) {
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
 */ function rt(t) {
  return !!(
    typeof t === "object" &&
    t !== null &&
    (t.__isVue || t._isVue || t.__v_isVNode)
  );
}
function it(t) {
  return typeof Request !== "undefined" && st(t, Request);
}
const at = e;
const ct = 80;
/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */ function ut(t, e = {}) {
  if (!t) return "<unknown>";
  try {
    let n = t;
    const o = 5;
    const s = [];
    let r = 0;
    let i = 0;
    const a = " > ";
    const c = a.length;
    let u;
    const l = Array.isArray(e) ? e : e.keyAttrs;
    const p = (!Array.isArray(e) && e.maxStringLength) || ct;
    while (n && r++ < o) {
      u = lt(n, l);
      if (u === "html" || (r > 1 && i + s.length * c + u.length >= p)) break;
      s.push(u);
      i += u.length;
      n = n.parentNode;
    }
    return s.reverse().join(a);
  } catch {
    return "<unknown>";
  }
}
/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */ function lt(t, e) {
  const n = t;
  const o = [];
  if (!n?.tagName) return "";
  if (at.HTMLElement && n instanceof HTMLElement && n.dataset) {
    if (n.dataset.sentryComponent) return n.dataset.sentryComponent;
    if (n.dataset.sentryElement) return n.dataset.sentryElement;
  }
  o.push(n.tagName.toLowerCase());
  const s = e?.length
    ? e.filter((t) => n.getAttribute(t)).map((t) => [t, n.getAttribute(t)])
    : null;
  if (s?.length)
    s.forEach((t) => {
      o.push(`[${t[0]}="${t[1]}"]`);
    });
  else {
    n.id && o.push(`#${n.id}`);
    const t = n.className;
    if (t && H(t)) {
      const e = t.split(/\s+/);
      for (const t of e) o.push(`.${t}`);
    }
  }
  const r = ["aria-label", "type", "name", "title", "alt"];
  for (const t of r) {
    const e = n.getAttribute(t);
    e && o.push(`[${t}="${e}"]`);
  }
  return o.join("");
}
function pt() {
  try {
    return at.document.location.href;
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
 */ function ft(t) {
  if (!at.HTMLElement) return null;
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
 */ function dt(e, n, o) {
  if (!(n in e)) return;
  const s = e[n];
  if (typeof s !== "function") return;
  const r = o(s);
  typeof r === "function" && gt(r, s);
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
 */ function mt(e, n, o) {
  try {
    Object.defineProperty(e, n, {
      value: o,
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
 */ function gt(t, e) {
  try {
    const n = e.prototype || {};
    t.prototype = e.prototype = n;
    mt(t, "__sentry_original__", e);
  } catch {}
}
/**
 * This extracts the original function if available.  See
 * `markFunctionWrapped` for more information.
 *
 * @param func the function to unwrap
 * @returns the unwrapped version of the function if available.
 */ function ht(t) {
  return t.__sentry_original__;
}
/**
 * Transforms any `Error` or `Event` into a plain object with all of their enumerable properties, and some of their
 * non-enumerable properties attached.
 *
 * @param value Initial source that we have to transform in order for it to be usable by the serializer
 * @returns An Event or Error turned into an object - or the value argument itself, when value is neither an Event nor
 *  an Error.
 */ function _t(t) {
  if (B(t))
    return { message: t.message, name: t.name, stack: t.stack, ...bt(t) };
  if (Q(t)) {
    const e = {
      type: t.type,
      target: yt(t.target),
      currentTarget: yt(t.currentTarget),
      ...bt(t),
    };
    typeof CustomEvent !== "undefined" &&
      st(t, CustomEvent) &&
      (e.detail = t.detail);
    return e;
  }
  return t;
}
function yt(t) {
  try {
    return tt(t) ? ut(t) : Object.prototype.toString.call(t);
  } catch {
    return "<unknown>";
  }
}
function bt(t) {
  if (typeof t === "object" && t !== null) {
    const e = {};
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
    return e;
  }
  return {};
}
function vt(t) {
  const e = Object.keys(_t(t));
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
 */ function St(t) {
  const e = new Map();
  return kt(t, e);
}
function kt(t, e) {
  if (t === null || typeof t !== "object") return t;
  const n = e.get(t);
  if (n !== void 0) return n;
  if (Array.isArray(t)) {
    const n = [];
    e.set(t, n);
    t.forEach((t) => {
      n.push(kt(t, e));
    });
    return n;
  }
  if (wt(t)) {
    const n = {};
    e.set(t, n);
    const o = Object.keys(t);
    o.forEach((o) => {
      const s = t[o];
      s !== void 0 && (n[o] = kt(s, e));
    });
    return n;
  }
  return t;
}
function wt(t) {
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
 */ function xt(t) {
  let e;
  switch (true) {
    case t == void 0:
      e = new String(t);
      break;
    case typeof t === "symbol" || typeof t === "bigint":
      e = Object(t);
      break;
    case Y(t):
      e = new t.constructor(t);
      break;
    default:
      e = t;
      break;
  }
  return e;
}
/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string (0 = unlimited)
 * @returns string Encoded
 */ function Et(t, e = 0) {
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
 */ function At(t, e) {
  let n = t;
  const o = n.length;
  if (o <= 150) return n;
  e > o && (e = o);
  let s = Math.max(e - 60, 0);
  s < 5 && (s = 0);
  let r = Math.min(s + 140, o);
  r > o - 5 && (r = o);
  r === o && (s = Math.max(r - 140, 0));
  n = n.slice(s, r);
  s > 0 && (n = `'{snip} ${n}`);
  r < o && (n += " {snip}");
  return n;
}
/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */ function Tt(t, e) {
  if (!Array.isArray(t)) return "";
  const n = [];
  for (let e = 0; e < t.length; e++) {
    const o = t[e];
    try {
      rt(o) ? n.push(O(o)) : n.push(String(o));
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
 */ function It(t, e, n = false) {
  return (
    !!H(t) && (et(e) ? e.test(t) : !!H(e) && (n ? t === e : t.includes(e)))
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
 */ function $t(t, e = [], n = false) {
  return e.some((e) => It(t, e, n));
}
function Ot() {
  const t = e;
  return t.crypto || t.msCrypto;
}
let Ct;
function jt() {
  return Math.random() * 16;
}
/**
 * UUID4 generator
 * @param crypto Object that provides the crypto API.
 * @returns string Generated UUID4.
 */ function Nt(t = Ot()) {
  try {
    if (t?.randomUUID) return t.randomUUID().replace(/-/g, "");
  } catch {}
  Ct || (Ct = [1e7] + 1e3 + 4e3 + 8e3 + 1e11);
  return Ct.replace(/[018]/g, (t) =>
    (t ^ ((jt() & 15) >> (t / 4))).toString(16),
  );
}
function Pt(t) {
  return t.exception?.values?.[0];
}
/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */ function Mt(t) {
  const { message: e, event_id: n } = t;
  if (e) return e;
  const o = Pt(t);
  return o
    ? o.type && o.value
      ? `${o.type}: ${o.value}`
      : o.type || o.value || n || "<unknown>"
    : n || "<unknown>";
}
/**
 * Adds exception values, type and value to an synthetic Exception.
 * @param event The event to modify.
 * @param value Value of the exception.
 * @param type Type of the exception.
 * @hidden
 */ function Rt(t, e, n) {
  const o = (t.exception = t.exception || {});
  const s = (o.values = o.values || []);
  const r = (s[0] = s[0] || {});
  r.value || (r.value = e || "");
  r.type || (r.type = n || "Error");
}
/**
 * Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
 *
 * @param event The event to modify.
 * @param newMechanism Mechanism data to add to the event.
 * @hidden
 */ function Dt(t, e) {
  const n = Pt(t);
  if (!n) return;
  const o = { type: "generic", handled: true };
  const s = n.mechanism;
  n.mechanism = { ...o, ...s, ...e };
  if (e && "data" in e) {
    const t = { ...s?.data, ...e.data };
    n.mechanism.data = t;
  }
}
const Ft =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
function Lt(t) {
  return parseInt(t || "", 10);
}
/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */ function Ut(t) {
  const e = t.match(Ft) || [];
  const n = Lt(e[1]);
  const o = Lt(e[2]);
  const s = Lt(e[3]);
  return {
    buildmetadata: e[5],
    major: isNaN(n) ? void 0 : n,
    minor: isNaN(o) ? void 0 : o,
    patch: isNaN(s) ? void 0 : s,
    prerelease: e[4],
  };
}
/**
 * This function adds context (pre/post/line) lines to the provided frame
 *
 * @param lines string[] containing all lines
 * @param frame StackFrame that will be mutated
 * @param linesOfContext number of context lines we want to add pre/post
 */ function qt(t, e, n = 5) {
  if (e.lineno === void 0) return;
  const o = t.length;
  const s = Math.max(Math.min(o - 1, e.lineno - 1), 0);
  e.pre_context = t.slice(Math.max(0, s - n), s).map((t) => At(t, 0));
  const r = Math.min(o - 1, s);
  e.context_line = At(t[r], e.colno || 0);
  e.post_context = t.slice(Math.min(s + 1, o), s + 1 + n).map((t) => At(t, 0));
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
 */ function Jt(t) {
  if (zt(t)) return true;
  try {
    mt(t, "__sentry_captured__", true);
  } catch {}
  return false;
}
function zt(t) {
  try {
    return t.__sentry_captured__;
  } catch {}
}
const Bt = 1e3;
function Wt() {
  return Date.now() / Bt;
}
function Vt() {
  const { performance: t } = e;
  if (!t?.now || !t.timeOrigin) return Wt;
  const n = t.timeOrigin;
  return () => (n + t.now()) / Bt;
}
let Kt;
function Gt() {
  const t = Kt ?? (Kt = Vt());
  return t();
}
let Ht;
function Zt() {
  const { performance: t } = e;
  if (!t?.now) return [void 0, "none"];
  const n = 36e5;
  const o = t.now();
  const s = Date.now();
  const r = t.timeOrigin ? Math.abs(t.timeOrigin + o - s) : n;
  const i = r < n;
  const a = t.timing?.navigationStart;
  const c = typeof a === "number";
  const u = c ? Math.abs(a + o - s) : n;
  const l = u < n;
  return i || l
    ? r <= u
      ? [t.timeOrigin, "timeOrigin"]
      : [a, "navigationStart"]
    : [s, "dateNow"];
}
function Yt() {
  Ht || (Ht = Zt());
  return Ht[0];
}
/**
 * Creates a new `Session` object by setting certain default parameters. If optional @param context
 * is passed, the passed properties are applied to the session object.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns a new `Session` object
 */ function Xt(t) {
  const e = Gt();
  const n = {
    sid: Nt(),
    init: true,
    timestamp: e,
    started: e,
    duration: 0,
    status: "ok",
    errors: 0,
    ignoreDuration: false,
    toJSON: () => ee(n),
  };
  t && Qt(n, t);
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
 */ function Qt(t, e = {}) {
  if (e.user) {
    !t.ipAddress && e.user.ip_address && (t.ipAddress = e.user.ip_address);
    t.did || e.did || (t.did = e.user.id || e.user.email || e.user.username);
  }
  t.timestamp = e.timestamp || Gt();
  e.abnormal_mechanism && (t.abnormal_mechanism = e.abnormal_mechanism);
  e.ignoreDuration && (t.ignoreDuration = e.ignoreDuration);
  e.sid && (t.sid = e.sid.length === 32 ? e.sid : Nt());
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
 */ function te(t, e) {
  let n = {};
  e ? (n = { status: e }) : t.status === "ok" && (n = { status: "exited" });
  Qt(t, n);
}
/**
 * Serializes a passed session object to a JSON object with a slightly different structure.
 * This is necessary because the Sentry backend requires a slightly different schema of a session
 * than the one the JS SDKs use internally.
 *
 * @param session the session to be converted
 *
 * @returns a JSON object of the passed session
 */ function ee(t) {
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
function ne(t, e, n = 2) {
  if (!e || typeof e !== "object" || n <= 0) return e;
  if (t && Object.keys(e).length === 0) return t;
  const o = { ...t };
  for (const t in e)
    Object.prototype.hasOwnProperty.call(e, t) &&
      (o[t] = ne(o[t], e[t], n - 1));
  return o;
}
function oe() {
  return Nt();
}
function se() {
  return Nt().substring(16);
}
const re = "_sentrySpan";
function ie(t, e) {
  e ? mt(t, re, e) : delete t[re];
}
function ae(t) {
  return t[re];
}
const ce = 100;
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
    this._propagationContext = { traceId: oe(), sampleRand: Math.random() };
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
    ie(t, ae(this));
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
    this._session && Qt(this._session, { user: t });
    this._notifyScopeListeners();
    return this;
  }
  getUser() {
    return this._user;
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
   * These attributes are currently only applied to logs.
   * In the future, they will also be applied to metrics and spans.
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
   * These attributes are currently only applied to logs.
   * In the future, they will also be applied to metrics and spans.
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
    const n = e instanceof Scope ? e.getScopeData() : X(e) ? t : void 0;
    const {
      tags: o,
      attributes: s,
      extra: r,
      user: i,
      contexts: a,
      level: c,
      fingerprint: u = [],
      propagationContext: l,
    } = n || {};
    this._tags = { ...this._tags, ...o };
    this._attributes = { ...this._attributes, ...s };
    this._extra = { ...this._extra, ...r };
    this._contexts = { ...this._contexts, ...a };
    i && Object.keys(i).length && (this._user = i);
    c && (this._level = c);
    u.length && (this._fingerprint = u);
    l && (this._propagationContext = l);
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
    ie(this, void 0);
    this._attachments = [];
    this.setPropagationContext({ traceId: oe(), sampleRand: Math.random() });
    this._notifyScopeListeners();
    return this;
  }
  addBreadcrumb(t, e) {
    const n = typeof e === "number" ? e : ce;
    if (n <= 0) return this;
    const o = {
      timestamp: Wt(),
      ...t,
      message: t.message ? Et(t.message, 2048) : t.message,
    };
    this._breadcrumbs.push(o);
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
      span: ae(this),
    };
  }
  setSDKProcessingMetadata(t) {
    this._sdkProcessingMetadata = ne(this._sdkProcessingMetadata, t, 2);
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
    const o = n?.event_id || Nt();
    if (!this._client) {
      t &&
        y.warn("No client configured on scope - will not capture exception!");
      return o;
    }
    const s = new Error("Sentry syntheticException");
    this._client.captureException(
      e,
      { originalException: e, syntheticException: s, ...n, event_id: o },
      this,
    );
    return o;
  }
  /**
   * Capture a message for this scope.
   *
   * @returns {string} The id of the captured message.
   */ captureMessage(e, n, o) {
    const s = o?.event_id || Nt();
    if (!this._client) {
      t && y.warn("No client configured on scope - will not capture message!");
      return s;
    }
    const r = o?.syntheticException ?? new Error(e);
    this._client.captureMessage(
      e,
      n,
      { originalException: e, syntheticException: r, ...o, event_id: s },
      this,
    );
    return s;
  }
  /**
   * Capture a Sentry event for this scope.
   *
   * @returns {string} The id of the captured event.
   */ captureEvent(e, n) {
    const o = n?.event_id || Nt();
    if (!this._client) {
      t && y.warn("No client configured on scope - will not capture event!");
      return o;
    }
    this._client.captureEvent(e, { ...n, event_id: o }, this);
    return o;
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
function ue() {
  return r("defaultCurrentScope", () => new Scope());
}
function le() {
  return r("defaultIsolationScope", () => new Scope());
}
class AsyncContextStack {
  constructor(t, e) {
    let n;
    n = t || new Scope();
    let o;
    o = e || new Scope();
    this._stack = [{ scope: n }];
    this._isolationScope = o;
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
    if (nt(n))
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
function pe() {
  const t = o();
  const e = s(t);
  return (e.stack = e.stack || new AsyncContextStack(ue(), le()));
}
function fe(t) {
  return pe().withScope(t);
}
function de(t, e) {
  const n = pe();
  return n.withScope(() => {
    n.getStackTop().scope = t;
    return e(t);
  });
}
function me(t) {
  return pe().withScope(() => t(pe().getIsolationScope()));
}
function ge() {
  return {
    withIsolationScope: me,
    withScope: fe,
    withSetScope: de,
    withSetIsolationScope: (t, e) => me(e),
    getCurrentScope: () => pe().getScope(),
    getIsolationScope: () => pe().getIsolationScope(),
  };
}
function he(t) {
  const e = o();
  const n = s(e);
  n.acs = t;
}
function _e(t) {
  const e = s(t);
  return e.acs ? e.acs : ge();
}
function ye() {
  const t = o();
  const e = _e(t);
  return e.getCurrentScope();
}
function be() {
  const t = o();
  const e = _e(t);
  return e.getIsolationScope();
}
function ve() {
  return r("globalScope", () => new Scope());
}
function Se(...t) {
  const e = o();
  const n = _e(e);
  if (t.length === 2) {
    const [e, o] = t;
    return e ? n.withSetScope(e, o) : n.withScope(o);
  }
  return n.withScope(t[0]);
}
function ke(...t) {
  const e = o();
  const n = _e(e);
  if (t.length === 2) {
    const [e, o] = t;
    return e ? n.withSetIsolationScope(e, o) : n.withIsolationScope(o);
  }
  return n.withIsolationScope(t[0]);
}
function we() {
  return ye().getClient();
}
function xe(t) {
  const e = t.getPropagationContext();
  const { traceId: n, parentSpanId: o, propagationSpanId: s } = e;
  const r = { trace_id: n, span_id: s || se() };
  o && (r.parent_span_id = o);
  return r;
}
const Ee = "sentry.source";
const Ae = "sentry.sample_rate";
const Te = "sentry.previous_trace_sample_rate";
const Ie = "sentry.op";
const $e = "sentry.origin";
const Oe = "sentry.idle_span_finish_reason";
const Ce = "sentry.measurement_unit";
const je = "sentry.measurement_value";
const Ne = "sentry.custom_span_name";
const Pe = "sentry.profile_id";
const Me = "sentry.exclusive_time";
const Re = "cache.hit";
const De = "cache.key";
const Fe = "cache.item_size";
const Le = "http.request.method";
const Ue = "url.full";
const qe = "sentry.link.type";
const Je = 0;
const ze = 1;
const Be = 2;
/**
 * Converts a HTTP status code into a sentry status with a message.
 *
 * @param httpStatus The HTTP response status code.
 * @returns The span status or internal_error.
 */ function We(t) {
  if (t < 400 && t >= 100) return { code: ze };
  if (t >= 400 && t < 500)
    switch (t) {
      case 401:
        return { code: Be, message: "unauthenticated" };
      case 403:
        return { code: Be, message: "permission_denied" };
      case 404:
        return { code: Be, message: "not_found" };
      case 409:
        return { code: Be, message: "already_exists" };
      case 413:
        return { code: Be, message: "failed_precondition" };
      case 429:
        return { code: Be, message: "resource_exhausted" };
      case 499:
        return { code: Be, message: "cancelled" };
      default:
        return { code: Be, message: "invalid_argument" };
    }
  if (t >= 500 && t < 600)
    switch (t) {
      case 501:
        return { code: Be, message: "unimplemented" };
      case 503:
        return { code: Be, message: "unavailable" };
      case 504:
        return { code: Be, message: "deadline_exceeded" };
      default:
        return { code: Be, message: "internal_error" };
    }
  return { code: Be, message: "internal_error" };
}
function Ve(t, e) {
  t.setAttribute("http.response.status_code", e);
  const n = We(e);
  n.message !== "unknown_error" && t.setStatus(n);
}
const Ke = "_sentryScope";
const Ge = "_sentryIsolationScope";
function He(t) {
  try {
    const n = e.WeakRef;
    if (typeof n === "function") return new n(t);
  } catch {}
  return t;
}
function Ze(t) {
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
function Ye(t, e, n) {
  if (t) {
    mt(t, Ge, He(n));
    mt(t, Ke, e);
  }
}
function Xe(t) {
  const e = t;
  return { scope: e[Ke], isolationScope: Ze(e[Ge]) };
}
const Qe = "sentry-";
const tn = /^sentry-/;
const en = 8192;
/**
 * Takes a baggage header and turns it into Dynamic Sampling Context, by extracting all the "sentry-" prefixed values
 * from it.
 *
 * @param baggageHeader A very bread definition of a baggage header as it might appear in various frameworks.
 * @returns The Dynamic Sampling Context that was found on `baggageHeader`, if there was any, `undefined` otherwise.
 */ function nn(t) {
  const e = sn(t);
  if (!e) return;
  const n = Object.entries(e).reduce((t, [e, n]) => {
    if (e.match(tn)) {
      const o = e.slice(Qe.length);
      t[o] = n;
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
 */ function on(t) {
  if (!t) return;
  const e = Object.entries(t).reduce((t, [e, n]) => {
    n && (t[`${Qe}${e}`] = n);
    return t;
  }, {});
  return an(e);
}
function sn(t) {
  if (t && (H(t) || Array.isArray(t)))
    return Array.isArray(t)
      ? t.reduce((t, e) => {
          const n = rn(e);
          Object.entries(n).forEach(([e, n]) => {
            t[e] = n;
          });
          return t;
        }, {})
      : rn(t);
}
/**
 * Will parse a baggage header, which is a simple key-value map, into a flat object.
 *
 * @param baggageHeader The baggage header to parse.
 * @returns a flat object containing all the key-value pairs from `baggageHeader`.
 */ function rn(t) {
  return t
    .split(",")
    .map((t) => {
      const e = t.indexOf("=");
      if (e === -1) return [];
      const n = t.slice(0, e);
      const o = t.slice(e + 1);
      return [n, o].map((t) => {
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
 */ function an(e) {
  if (Object.keys(e).length !== 0)
    return Object.entries(e).reduce((e, [n, o], s) => {
      const r = `${encodeURIComponent(n)}=${encodeURIComponent(o)}`;
      const i = s === 0 ? r : `${e},${r}`;
      if (i.length > en) {
        t &&
          y.warn(
            `Not adding key: ${n} with val: ${o} to baggage header due to exceeding baggage size limits.`,
          );
        return e;
      }
      return i;
    }, "");
}
const cn = /^o(\d+)\./;
const un = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function ln(t) {
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
 */ function pn(t, e = false) {
  const {
    host: n,
    path: o,
    pass: s,
    port: r,
    projectId: i,
    protocol: a,
    publicKey: c,
  } = t;
  return `${a}://${c}${e && s ? `:${s}` : ""}@${n}${r ? `:${r}` : ""}/${o ? `${o}/` : o}${i}`;
}
/**
 * Parses a Dsn from a given string.
 *
 * @param str A Dsn as string
 * @returns Dsn as DsnComponents or undefined if @param str is not a valid DSN string
 */ function fn(t) {
  const e = un.exec(t);
  if (!e) {
    u(() => {
      console.error(`Invalid Sentry Dsn: ${t}`);
    });
    return;
  }
  const [n, o, s = "", r = "", i = "", a = ""] = e.slice(1);
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
  return dn({
    host: r,
    pass: s,
    path: c,
    projectId: l,
    port: i,
    protocol: n,
    publicKey: o,
  });
}
function dn(t) {
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
function mn(e) {
  if (!t) return true;
  const { port: n, projectId: o, protocol: s } = e;
  const r = ["protocol", "publicKey", "host", "projectId"];
  const i = r.find((t) => {
    if (!e[t]) {
      y.error(`Invalid Sentry Dsn: ${t} missing`);
      return true;
    }
    return false;
  });
  if (i) return false;
  if (!o.match(/^\d+$/)) {
    y.error(`Invalid Sentry Dsn: Invalid projectId ${o}`);
    return false;
  }
  if (!ln(s)) {
    y.error(`Invalid Sentry Dsn: Invalid protocol ${s}`);
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
 */ function gn(t) {
  const e = t.match(cn);
  return e?.[1];
}
function hn(t) {
  const e = t.getOptions();
  const { host: n } = t.getDsn() || {};
  let o;
  e.orgId ? (o = String(e.orgId)) : n && (o = gn(n));
  return o;
}
/**
 * Creates a valid Sentry Dsn object, identifying a Sentry instance and project.
 * @returns a valid DsnComponents object or `undefined` if @param from is an invalid DSN source
 */ function _n(t) {
  const e = typeof t === "string" ? fn(t) : dn(t);
  if (e && mn(e)) return e;
}
function yn(t) {
  if (typeof t === "boolean") return Number(t);
  const e = typeof t === "string" ? parseFloat(t) : t;
  return typeof e !== "number" || isNaN(e) || e < 0 || e > 1 ? void 0 : e;
}
const bn = new RegExp(
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
 */ function vn(t) {
  if (!t) return;
  const e = t.match(bn);
  if (!e) return;
  let n;
  e[3] === "1" ? (n = true) : e[3] === "0" && (n = false);
  return { traceId: e[1], parentSampled: n, parentSpanId: e[2] };
}
function Sn(t, e) {
  const n = vn(t);
  const o = nn(e);
  if (!n?.traceId) return { traceId: oe(), sampleRand: Math.random() };
  const s = xn(n, o);
  o && (o.sample_rand = s.toString());
  const { traceId: r, parentSpanId: i, parentSampled: a } = n;
  return {
    traceId: r,
    parentSpanId: i,
    sampled: a,
    dsc: o || {},
    sampleRand: s,
  };
}
function kn(t = oe(), e = se(), n) {
  let o = "";
  n !== void 0 && (o = n ? "-1" : "-0");
  return `${t}-${e}${o}`;
}
function wn(t = oe(), e = se(), n) {
  return `00-${t}-${e}-${n ? "01" : "00"}`;
}
function xn(t, e) {
  const n = yn(e?.sample_rand);
  if (n !== void 0) return n;
  const o = yn(e?.sample_rate);
  return o && t?.parentSampled !== void 0
    ? t.parentSampled
      ? Math.random() * o
      : o + Math.random() * (1 - o)
    : Math.random();
}
function En(t, e) {
  const n = hn(t);
  if (e && n && e !== n) {
    y.log(
      `Won't continue trace because org IDs don't match (incoming baggage: ${e}, SDK options: ${n})`,
    );
    return false;
  }
  const o = t.getOptions().strictTraceContinuation || false;
  if (o && ((e && !n) || (!e && n))) {
    y.log(
      `Starting a new trace because strict trace continuation is enabled but one org ID is missing (incoming baggage: ${e}, Sentry client: ${n})`,
    );
    return false;
  }
  return true;
}
const An = 0;
const Tn = 1;
let In = false;
function $n(t) {
  const { spanId: e, traceId: n } = t.spanContext();
  const {
    data: o,
    op: s,
    parent_span_id: r,
    status: i,
    origin: a,
    links: c,
  } = Rn(t);
  return {
    parent_span_id: r,
    span_id: e,
    trace_id: n,
    data: o,
    op: s,
    status: i,
    origin: a,
    links: c,
  };
}
function On(t) {
  const { spanId: e, traceId: n, isRemote: o } = t.spanContext();
  const s = o ? e : Rn(t).parent_span_id;
  const r = Xe(t).scope;
  const i = o ? r?.getPropagationContext().propagationSpanId || se() : e;
  return { parent_span_id: s, span_id: i, trace_id: n };
}
function Cn(t) {
  const { traceId: e, spanId: n } = t.spanContext();
  const o = Ln(t);
  return kn(e, n, o);
}
function jn(t) {
  const { traceId: e, spanId: n } = t.spanContext();
  const o = Ln(t);
  return wn(e, n, o);
}
function Nn(t) {
  return t && t.length > 0
    ? t.map(
        ({
          context: { spanId: t, traceId: e, traceFlags: n, ...o },
          attributes: s,
        }) => ({
          span_id: t,
          trace_id: e,
          sampled: n === Tn,
          attributes: s,
          ...o,
        }),
      )
    : void 0;
}
function Pn(t) {
  return typeof t === "number"
    ? Mn(t)
    : Array.isArray(t)
      ? t[0] + t[1] / 1e9
      : t instanceof Date
        ? Mn(t.getTime())
        : Gt();
}
function Mn(t) {
  const e = t > 9999999999;
  return e ? t / 1e3 : t;
}
function Rn(t) {
  if (Fn(t)) return t.getSpanJSON();
  const { spanId: e, traceId: n } = t.spanContext();
  if (Dn(t)) {
    const {
      attributes: o,
      startTime: s,
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
      data: o,
      description: r,
      parent_span_id: u,
      start_timestamp: Pn(s),
      timestamp: Pn(i) || void 0,
      status: Un(a),
      op: o[Ie],
      origin: o[$e],
      links: Nn(c),
    };
  }
  return { span_id: e, trace_id: n, start_timestamp: 0, data: {} };
}
function Dn(t) {
  const e = t;
  return (
    !!e.attributes && !!e.startTime && !!e.name && !!e.endTime && !!e.status
  );
}
function Fn(t) {
  return typeof t.getSpanJSON === "function";
}
function Ln(t) {
  const { traceFlags: e } = t.spanContext();
  return e === Tn;
}
function Un(t) {
  if (t && t.code !== Je)
    return t.code === ze ? "ok" : t.message || "internal_error";
}
const qn = "_sentryChildSpans";
const Jn = "_sentryRootSpan";
function zn(t, e) {
  const n = t[Jn] || t;
  mt(e, Jn, n);
  t[qn] ? t[qn].add(e) : mt(t, qn, new Set([e]));
}
function Bn(t, e) {
  t[qn] && t[qn].delete(e);
}
function Wn(t) {
  const e = new Set();
  function n(t) {
    if (!e.has(t) && Ln(t)) {
      e.add(t);
      const o = t[qn] ? Array.from(t[qn]) : [];
      for (const t of o) n(t);
    }
  }
  n(t);
  return Array.from(e);
}
function Vn(t) {
  return t[Jn] || t;
}
function Kn() {
  const t = o();
  const e = _e(t);
  return e.getActiveSpan ? e.getActiveSpan() : ae(ye());
}
function Gn() {
  if (!In) {
    u(() => {
      console.warn(
        "[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.",
      );
    });
    In = true;
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
 */ function Hn(t, e) {
  t.updateName(e);
  t.setAttributes({ [Ee]: "custom", [Ne]: e });
}
let Zn = false;
function Yn() {
  if (!Zn) {
    e.tag = "sentry_tracingErrorCallback";
    Zn = true;
    F(e);
    q(e);
  }
  function e() {
    const e = Kn();
    const n = e && Vn(e);
    if (n) {
      const e = "internal_error";
      t && y.log(`[Tracing] Root span: ${e} -> Global error occurred`);
      n.setStatus({ code: Be, message: e });
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
 */ function Xn(t) {
  if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__)
    return false;
  const e = t || we()?.getOptions();
  return !!e && (e.tracesSampleRate != null || !!e.tracesSampler);
}
function Qn(t) {
  y.log(
    `Ignoring span ${t.op} - ${t.description} because it matches \`ignoreSpans\`.`,
  );
}
function to(e, n) {
  if (!n?.length || !e.description) return false;
  for (const o of n) {
    if (no(o)) {
      if (It(e.description, o)) {
        t && Qn(e);
        return true;
      }
      continue;
    }
    if (!o.name && !o.op) continue;
    const n = !o.name || It(e.description, o.name);
    const s = !o.op || (e.op && It(e.op, o.op));
    if (n && s) {
      t && Qn(e);
      return true;
    }
  }
  return false;
}
function eo(t, e) {
  const n = e.parent_span_id;
  const o = e.span_id;
  if (n) for (const e of t) e.parent_span_id === o && (e.parent_span_id = n);
}
function no(t) {
  return typeof t === "string" || t instanceof RegExp;
}
const oo = "production";
const so = "_frozenDsc";
function ro(t, e) {
  const n = t;
  mt(n, so, e);
}
function io(t, e) {
  const n = e.getOptions();
  const { publicKey: o } = e.getDsn() || {};
  const s = {
    environment: n.environment || oo,
    release: n.release,
    public_key: o,
    trace_id: t,
    org_id: hn(e),
  };
  e.emit("createDsc", s);
  return s;
}
function ao(t, e) {
  const n = e.getPropagationContext();
  return n.dsc || io(n.traceId, t);
}
/**
 * Creates a dynamic sampling context from a span (and client and scope)
 *
 * @param span the span from which a few values like the root span name and sample rate are extracted.
 *
 * @returns a dynamic sampling context
 */ function co(t) {
  const e = we();
  if (!e) return {};
  const n = Vn(t);
  const o = Rn(n);
  const s = o.data;
  const r = n.spanContext().traceState;
  const i = r?.get("sentry.sample_rate") ?? s[Ae] ?? s[Te];
  function a(t) {
    (typeof i !== "number" && typeof i !== "string") ||
      (t.sample_rate = `${i}`);
    return t;
  }
  const c = n[so];
  if (c) return a(c);
  const u = r?.get("sentry.dsc");
  const l = u && nn(u);
  if (l) return a(l);
  const p = io(t.spanContext().traceId, e);
  const f = s[Ee];
  const d = o.description;
  f !== "url" && d && (p.transaction = d);
  if (Xn()) {
    p.sampled = String(Ln(n));
    p.sample_rand =
      r?.get("sentry.sample_rand") ??
      Xe(n).scope?.getPropagationContext().sampleRand.toString();
  }
  a(p);
  e.emit("createDsc", p, n);
  return p;
}
function uo(t) {
  const e = co(t);
  return on(e);
}
class SentryNonRecordingSpan {
  constructor(t = {}) {
    this._traceId = t.traceId || oe();
    this._spanId = t.spanId || se();
  }
  spanContext() {
    return { spanId: this._spanId, traceId: this._traceId, traceFlags: An };
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
 */ function lo(t, e = 100, n = Infinity) {
  try {
    return fo("", t, e, n);
  } catch (t) {
    return { ERROR: `**non-serializable** (${t})` };
  }
}
function po(t, e = 3, n = 102400) {
  const o = lo(t, e);
  return _o(o) > n ? po(t, e - 1, n) : o;
}
/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */ function fo(t, e, n = Infinity, o = Infinity, s = bo()) {
  const [r, i] = s;
  if (
    e == null ||
    ["boolean", "string"].includes(typeof e) ||
    (typeof e === "number" && Number.isFinite(e))
  )
    return e;
  const a = mo(t, e);
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
      return fo("", t, c - 1, o, s);
    } catch {}
  const l = Array.isArray(e) ? [] : {};
  let p = 0;
  const f = _t(e);
  for (const t in f) {
    if (!Object.prototype.hasOwnProperty.call(f, t)) continue;
    if (p >= o) {
      l[t] = "[MaxProperties ~]";
      break;
    }
    const e = f[t];
    l[t] = fo(t, e, c - 1, o, s);
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
 */ function mo(t, e) {
  try {
    if (t === "domain" && e && typeof e === "object" && e._events)
      return "[Domain]";
    if (t === "domainEmitter") return "[DomainEmitter]";
    if (typeof global !== "undefined" && e === global) return "[Global]";
    if (typeof window !== "undefined" && e === window) return "[Window]";
    if (typeof document !== "undefined" && e === document) return "[Document]";
    if (rt(e)) return O(e);
    if (ot(e)) return "[SyntheticEvent]";
    if (typeof e === "number" && !Number.isFinite(e)) return `[${e}]`;
    if (typeof e === "function") return `[Function: ${I(e)}]`;
    if (typeof e === "symbol") return `[${String(e)}]`;
    if (typeof e === "bigint") return `[BigInt: ${String(e)}]`;
    const n = go(e);
    return /^HTML(\w*)Element$/.test(n)
      ? `[HTMLElement: ${n}]`
      : `[object ${n}]`;
  } catch (t) {
    return `**non-serializable** (${t})`;
  }
}
function go(t) {
  const e = Object.getPrototypeOf(t);
  return e?.constructor ? e.constructor.name : "null prototype";
}
function ho(t) {
  return ~-encodeURI(t).split(/%..|./).length;
}
function _o(t) {
  return ho(JSON.stringify(t));
}
/**
 * Normalizes URLs in exceptions and stacktraces to a base path so Sentry can fingerprint
 * across platforms and working directory.
 *
 * @param url The URL to be normalized.
 * @param basePath The application base path.
 * @returns The normalized URL.
 */ function yo(t, e) {
  const n = e.replace(/\\/g, "/").replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  let o = t;
  try {
    o = decodeURI(t);
  } catch {}
  return o
    .replace(/\\/g, "/")
    .replace(/webpack:\/?/g, "")
    .replace(new RegExp(`(file://)?/*${n}/*`, "ig"), "app:///");
}
function bo() {
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
function vo(t, e = []) {
  return [t, e];
}
function So(t, e) {
  const [n, o] = t;
  return [n, [...o, e]];
}
function ko(t, e) {
  const n = t[1];
  for (const t of n) {
    const n = t[0].type;
    const o = e(t, n);
    if (o) return true;
  }
  return false;
}
function wo(t, e) {
  return ko(t, (t, n) => e.includes(n));
}
function xo(t) {
  const n = s(e);
  return n.encodePolyfill ? n.encodePolyfill(t) : new TextEncoder().encode(t);
}
function Eo(t) {
  const n = s(e);
  return n.decodePolyfill ? n.decodePolyfill(t) : new TextDecoder().decode(t);
}
function Ao(t) {
  const [e, n] = t;
  let o = JSON.stringify(e);
  function s(t) {
    typeof o === "string"
      ? (o = typeof t === "string" ? o + t : [xo(o), t])
      : o.push(typeof t === "string" ? xo(t) : t);
  }
  for (const t of n) {
    const [e, n] = t;
    s(`\n${JSON.stringify(e)}\n`);
    if (typeof n === "string" || n instanceof Uint8Array) s(n);
    else {
      let t;
      try {
        t = JSON.stringify(n);
      } catch {
        t = JSON.stringify(lo(n));
      }
      s(t);
    }
  }
  return typeof o === "string" ? o : To(o);
}
function To(t) {
  const e = t.reduce((t, e) => t + e.length, 0);
  const n = new Uint8Array(e);
  let o = 0;
  for (const e of t) {
    n.set(e, o);
    o += e.length;
  }
  return n;
}
function Io(t) {
  let e = typeof t === "string" ? xo(t) : t;
  function n(t) {
    const n = e.subarray(0, t);
    e = e.subarray(t + 1);
    return n;
  }
  function o() {
    let t = e.indexOf(10);
    t < 0 && (t = e.length);
    return JSON.parse(Eo(n(t)));
  }
  const s = o();
  const r = [];
  while (e.length) {
    const t = o();
    const e = typeof t.length === "number" ? t.length : void 0;
    r.push([t, e ? n(e) : o()]);
  }
  return [s, r];
}
function $o(t) {
  const e = { type: "span" };
  return [e, t];
}
function Oo(t) {
  const e = typeof t.data === "string" ? xo(t.data) : t.data;
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
const Co = {
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
function jo(t) {
  return Co[t];
}
function No(t) {
  if (!t?.sdk) return;
  const { name: e, version: n } = t.sdk;
  return { name: e, version: n };
}
function Po(t, e, n, o) {
  const s = t.sdkProcessingMetadata?.dynamicSamplingContext;
  return {
    event_id: t.event_id,
    sent_at: new Date().toISOString(),
    ...(e && { sdk: e }),
    ...(!!n && o && { dsn: pn(o) }),
    ...(s && { trace: s }),
  };
}
function Mo(t, e) {
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
function Ro(t, e, n, o) {
  const s = No(n);
  const r = {
    sent_at: new Date().toISOString(),
    ...(s && { sdk: s }),
    ...(!!o && e && { dsn: pn(e) }),
  };
  const i =
    "aggregates" in t
      ? [{ type: "sessions" }, t]
      : [{ type: "session" }, t.toJSON()];
  return vo(r, [i]);
}
function Do(t, e, n, o) {
  const s = No(n);
  const r = t.type && t.type !== "replay_event" ? t.type : "event";
  Mo(t, n?.sdk);
  const i = Po(t, s, o, e);
  delete t.sdkProcessingMetadata;
  const a = [{ type: r }, t];
  return vo(i, [a]);
}
function Fo(t, e) {
  function n(t) {
    return !!t.trace_id && !!t.public_key;
  }
  const o = co(t[0]);
  const s = e?.getDsn();
  const r = e?.getOptions().tunnel;
  const i = {
    sent_at: new Date().toISOString(),
    ...(n(o) && { trace: o }),
    ...(!!r && s && { dsn: pn(s) }),
  };
  const { beforeSendSpan: a, ignoreSpans: c } = e?.getOptions() || {};
  const u = c?.length ? t.filter((t) => !to(Rn(t), c)) : t;
  const l = t.length - u.length;
  l && e?.recordDroppedEvent("before_send", "span", l);
  const p = a
    ? (t) => {
        const e = Rn(t);
        const n = a(e);
        if (!n) {
          Gn();
          return e;
        }
        return n;
      }
    : Rn;
  const f = [];
  for (const t of u) {
    const e = p(t);
    e && f.push($o(e));
  }
  return vo(i, f);
}
function Lo(e) {
  if (!t) return;
  const {
    description: n = "< unknown name >",
    op: o = "< unknown op >",
    parent_span_id: s,
  } = Rn(e);
  const { spanId: r } = e.spanContext();
  const i = Ln(e);
  const a = Vn(e);
  const c = a === e;
  const u = `[Tracing] Starting ${i ? "sampled" : "unsampled"} ${c ? "root " : ""}span`;
  const l = [`op: ${o}`, `name: ${n}`, `ID: ${r}`];
  s && l.push(`parent ID: ${s}`);
  if (!c) {
    const { op: t, description: e } = Rn(a);
    l.push(`root ID: ${a.spanContext().spanId}`);
    t && l.push(`root op: ${t}`);
    e && l.push(`root description: ${e}`);
  }
  y.log(`${u}\n  ${l.join("\n  ")}`);
}
function Uo(e) {
  if (!t) return;
  const { description: n = "< unknown name >", op: o = "< unknown op >" } =
    Rn(e);
  const { spanId: s } = e.spanContext();
  const r = Vn(e);
  const i = r === e;
  const a = `[Tracing] Finishing "${o}" ${i ? "root " : ""}span "${n}" with ID ${s}`;
  y.log(a);
}
function qo(e, n, o, s = Kn()) {
  const r = s && Vn(s);
  if (r) {
    t &&
      y.log(`[Measurement] Setting measurement on root span: ${e} = ${n} ${o}`);
    r.addEvent(e, { [je]: n, [Ce]: o });
  }
}
function Jo(t) {
  if (!t || t.length === 0) return;
  const e = {};
  t.forEach((t) => {
    const n = t.attributes || {};
    const o = n[Ce];
    const s = n[je];
    typeof o === "string" &&
      typeof s === "number" &&
      (e[t.name] = { value: s, unit: o });
  });
  return e;
}
const zo = 1e3;
class SentrySpan {
  constructor(t = {}) {
    this._traceId = t.traceId || oe();
    this._spanId = t.spanId || se();
    this._startTime = t.startTimestamp || Gt();
    this._links = t.links;
    this._attributes = {};
    this.setAttributes({ [$e]: "manual", [Ie]: t.op, ...t.attributes });
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
    return { spanId: t, traceId: e, traceFlags: n ? Tn : An };
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
    this._startTime = Pn(t);
  }
  setStatus(t) {
    this._status = t;
    return this;
  }
  updateName(t) {
    this._name = t;
    this.setAttribute(Ee, "custom");
    return this;
  }
  end(t) {
    if (!this._endTime) {
      this._endTime = Pn(t);
      Uo(this);
      this._onSpanEnded();
    }
  }
  getSpanJSON() {
    return {
      data: this._attributes,
      description: this._name,
      op: this._attributes[Ie],
      parent_span_id: this._parentSpanId,
      span_id: this._spanId,
      start_timestamp: this._startTime,
      status: Un(this._status),
      timestamp: this._endTime,
      trace_id: this._traceId,
      origin: this._attributes[$e],
      profile_id: this._attributes[Pe],
      exclusive_time: this._attributes[Me],
      measurements: Jo(this._events),
      is_segment: (this._isStandaloneSpan && Vn(this) === this) || void 0,
      segment_id: this._isStandaloneSpan
        ? Vn(this).spanContext().spanId
        : void 0,
      links: Nn(this._links),
    };
  }
  isRecording() {
    return !this._endTime && !!this._sampled;
  }
  addEvent(e, n, o) {
    t && y.log("[Tracing] Adding an event to span:", e);
    const s = Bo(n) ? n : o || Gt();
    const r = Bo(n) ? {} : n || {};
    const i = { name: e, time: Pn(s), attributes: r };
    this._events.push(i);
    return this;
  }
  isStandaloneSpan() {
    return !!this._isStandaloneSpan;
  }
  _onSpanEnded() {
    const e = we();
    e && e.emit("spanEnd", this);
    const n = this._isStandaloneSpan || this === Vn(this);
    if (!n) return;
    if (this._isStandaloneSpan) {
      if (this._sampled) Ko(Fo([this], e));
      else {
        t &&
          y.log(
            "[Tracing] Discarding standalone span because its trace was not chosen to be sampled.",
          );
        e && e.recordDroppedEvent("sample_rate", "span");
      }
      return;
    }
    const o = this._convertSpanToTransaction();
    if (o) {
      const t = Xe(this).scope || ye();
      t.captureEvent(o);
    }
  }
  _convertSpanToTransaction() {
    if (!Wo(Rn(this))) return;
    if (!this._name) {
      t &&
        y.warn(
          "Transaction has no name, falling back to `<unlabeled transaction>`.",
        );
      this._name = "<unlabeled transaction>";
    }
    const { scope: e, isolationScope: n } = Xe(this);
    const o = e?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
    if (this._sampled !== true) return;
    const s = Wn(this).filter((t) => t !== this && !Vo(t));
    const r = s.map((t) => Rn(t)).filter(Wo);
    const i = this._attributes[Ee];
    /* eslint-disable @typescript-eslint/no-dynamic-delete */ delete this
      ._attributes[Ne];
    r.forEach((t) => {
      delete t.data[Ne];
    });
    const a = {
      contexts: { trace: $n(this) },
      spans:
        r.length > zo
          ? r.sort((t, e) => t.start_timestamp - e.start_timestamp).slice(0, zo)
          : r,
      start_timestamp: this._startTime,
      timestamp: this._endTime,
      transaction: this._name,
      type: "transaction",
      sdkProcessingMetadata: {
        capturedSpanScope: e,
        capturedSpanIsolationScope: n,
        dynamicSamplingContext: co(this),
      },
      request: o,
      ...(i && { transaction_info: { source: i } }),
    };
    const c = Jo(this._events);
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
function Bo(t) {
  return (t && typeof t === "number") || t instanceof Date || Array.isArray(t);
}
function Wo(t) {
  return !!t.start_timestamp && !!t.timestamp && !!t.span_id && !!t.trace_id;
}
function Vo(t) {
  return t instanceof SentrySpan && t.isStandaloneSpan();
}
function Ko(t) {
  const e = we();
  if (!e) return;
  const n = t[1];
  n && n.length !== 0
    ? e.sendEnvelope(t)
    : e.recordDroppedEvent("before_send", "span");
}
function Go(t, e, n = () => {}, o = () => {}) {
  let s;
  try {
    s = t();
  } catch (t) {
    e(t);
    n();
    throw t;
  }
  return Ho(s, e, n, o);
}
function Ho(t, e, n, o) {
  if (nt(t))
    return t.then(
      (t) => {
        n();
        o(t);
        return t;
      },
      (t) => {
        e(t);
        n();
        throw t;
      },
    );
  n();
  o(t);
  return t;
}
function Zo(e, n, o) {
  if (!Xn(e)) return [false];
  let s;
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
    s = true;
  } else if (n.parentSampled !== void 0) r = n.parentSampled;
  else if (typeof e.tracesSampleRate !== "undefined") {
    r = e.tracesSampleRate;
    s = true;
  }
  const i = yn(r);
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
    return [false, i, s];
  }
  const a = o < i;
  a ||
    (t &&
      y.log(
        `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(r)})`,
      ));
  return [a, i, s];
}
const Yo = "__SENTRY_SUPPRESS_TRACING__";
function Xo(t, e) {
  const n = as();
  if (n.startSpan) return n.startSpan(t, e);
  const o = is(t);
  const { forceTransaction: s, parentSpan: r, scope: i } = t;
  const a = i?.clone();
  return Se(a, () => {
    const n = ps(r);
    return n(() => {
      const n = ye();
      const i = ls(n, r);
      const a = t.onlyIfParent && !i;
      const c = a
        ? new SentryNonRecordingSpan()
        : rs({
            parentSpan: i,
            spanArguments: o,
            forceTransaction: s,
            scope: n,
          });
      ie(n, c);
      return Go(
        () => e(c),
        () => {
          const { status: t } = Rn(c);
          !c.isRecording() ||
            (t && t !== "ok") ||
            c.setStatus({ code: Be, message: "internal_error" });
        },
        () => {
          c.end();
        },
      );
    });
  });
}
function Qo(t, e) {
  const n = as();
  if (n.startSpanManual) return n.startSpanManual(t, e);
  const o = is(t);
  const { forceTransaction: s, parentSpan: r, scope: i } = t;
  const a = i?.clone();
  return Se(a, () => {
    const n = ps(r);
    return n(() => {
      const n = ye();
      const i = ls(n, r);
      const a = t.onlyIfParent && !i;
      const c = a
        ? new SentryNonRecordingSpan()
        : rs({
            parentSpan: i,
            spanArguments: o,
            forceTransaction: s,
            scope: n,
          });
      ie(n, c);
      return Go(
        () => e(c, () => c.end()),
        () => {
          const { status: t } = Rn(c);
          !c.isRecording() ||
            (t && t !== "ok") ||
            c.setStatus({ code: Be, message: "internal_error" });
        },
      );
    });
  });
}
function ts(t) {
  const e = as();
  if (e.startInactiveSpan) return e.startInactiveSpan(t);
  const n = is(t);
  const { forceTransaction: o, parentSpan: s } = t;
  const r = t.scope
    ? (e) => Se(t.scope, e)
    : s !== void 0
      ? (t) => ns(s, t)
      : (t) => t();
  return r(() => {
    const e = ye();
    const r = ls(e, s);
    const i = t.onlyIfParent && !r;
    return i
      ? new SentryNonRecordingSpan()
      : rs({ parentSpan: r, spanArguments: n, forceTransaction: o, scope: e });
  });
}
const es = (t, e) => {
  const n = o();
  const s = _e(n);
  if (s.continueTrace) return s.continueTrace(t, e);
  const { sentryTrace: r, baggage: i } = t;
  const a = we();
  const c = nn(i);
  return a && !En(a, c?.org_id)
    ? ss(e)
    : Se((t) => {
        const n = Sn(r, i);
        t.setPropagationContext(n);
        ie(t, void 0);
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
 */ function ns(t, e) {
  const n = as();
  return n.withActiveSpan
    ? n.withActiveSpan(t, e)
    : Se((n) => {
        ie(n, t || void 0);
        return e(n);
      });
}
function os(t) {
  const e = as();
  return e.suppressTracing
    ? e.suppressTracing(t)
    : Se((e) => {
        e.setSDKProcessingMetadata({ [Yo]: true });
        const n = t();
        e.setSDKProcessingMetadata({ [Yo]: void 0 });
        return n;
      });
}
function ss(e) {
  return Se((n) => {
    n.setPropagationContext({ traceId: oe(), sampleRand: Math.random() });
    t &&
      y.log(
        `Starting a new trace with id ${n.getPropagationContext().traceId}`,
      );
    return ns(null, e);
  });
}
function rs({
  parentSpan: t,
  spanArguments: e,
  forceTransaction: n,
  scope: o,
}) {
  if (!Xn()) {
    const o = new SentryNonRecordingSpan();
    if (n || !t) {
      const t = {
        sampled: "false",
        sample_rate: "0",
        transaction: e.name,
        ...co(o),
      };
      ro(o, t);
    }
    return o;
  }
  const s = be();
  let r;
  if (t && !n) {
    r = us(t, o, e);
    zn(t, r);
  } else if (t) {
    const n = co(t);
    const { traceId: s, spanId: i } = t.spanContext();
    const a = Ln(t);
    r = cs({ traceId: s, parentSpanId: i, ...e }, o, a);
    ro(r, n);
  } else {
    const {
      traceId: t,
      dsc: n,
      parentSpanId: i,
      sampled: a,
    } = { ...s.getPropagationContext(), ...o.getPropagationContext() };
    r = cs({ traceId: t, parentSpanId: i, ...e }, o, a);
    n && ro(r, n);
  }
  Lo(r);
  Ye(r, o, s);
  return r;
}
function is(t) {
  const e = t.experimental || {};
  const n = { isStandalone: e.standalone, ...t };
  if (t.startTime) {
    const e = { ...n };
    e.startTimestamp = Pn(t.startTime);
    delete e.startTime;
    return e;
  }
  return n;
}
function as() {
  const t = o();
  return _e(t);
}
function cs(e, n, o) {
  const s = we();
  const r = s?.getOptions() || {};
  const { name: i = "" } = e;
  const a = {
    spanAttributes: { ...e.attributes },
    spanName: i,
    parentSampled: o,
  };
  s?.emit("beforeSampling", a, { decision: false });
  const c = a.parentSampled ?? o;
  const u = a.spanAttributes;
  const l = n.getPropagationContext();
  const [p, f, d] = n.getScopeData().sdkProcessingMetadata[Yo]
    ? [false]
    : Zo(
        r,
        {
          name: i,
          parentSampled: c,
          attributes: u,
          parentSampleRate: yn(l.dsc?.sample_rate),
        },
        l.sampleRand,
      );
  const m = new SentrySpan({
    ...e,
    attributes: { [Ee]: "custom", [Ae]: f !== void 0 && d ? f : void 0, ...u },
    sampled: p,
  });
  if (!p && s) {
    t &&
      y.log(
        "[Tracing] Discarding root span because its trace was not chosen to be sampled.",
      );
    s.recordDroppedEvent("sample_rate", "transaction");
  }
  s && s.emit("spanStart", m);
  return m;
}
function us(t, e, n) {
  const { spanId: o, traceId: s } = t.spanContext();
  const r = !e.getScopeData().sdkProcessingMetadata[Yo] && Ln(t);
  const i = r
    ? new SentrySpan({ ...n, parentSpanId: o, traceId: s, sampled: r })
    : new SentryNonRecordingSpan({ traceId: s });
  zn(t, i);
  const a = we();
  if (a) {
    a.emit("spanStart", i);
    n.endTimestamp && a.emit("spanEnd", i);
  }
  return i;
}
function ls(t, e) {
  if (e) return e;
  if (e === null) return;
  const n = ae(t);
  if (!n) return;
  const o = we();
  const s = o ? o.getOptions() : {};
  return s.parentSpanIsAlwaysRootSpan ? Vn(n) : n;
}
function ps(t) {
  return t !== void 0 ? (e) => ns(t, e) : (t) => t();
}
const fs = { idleTimeout: 1e3, finalTimeout: 3e4, childSpanTimeout: 15e3 };
const ds = "heartbeatFailed";
const ms = "idleTimeout";
const gs = "finalTimeout";
const hs = "externalFinish";
function _s(e, n = {}) {
  const o = new Map();
  let s = false;
  let r;
  let i = hs;
  let a = !n.disableAutoFinish;
  const c = [];
  const {
    idleTimeout: u = fs.idleTimeout,
    finalTimeout: l = fs.finalTimeout,
    childSpanTimeout: p = fs.childSpanTimeout,
    beforeSpanEnd: f,
    trimIdleSpanEndTimestamp: d = true,
  } = n;
  const m = we();
  if (!m || !Xn()) {
    const t = new SentryNonRecordingSpan();
    const e = { sample_rate: "0", sampled: "false", ...co(t) };
    ro(t, e);
    return t;
  }
  const g = ye();
  const h = Kn();
  const _ = ys(e);
  _.end = new Proxy(_.end, {
    apply(t, e, n) {
      f && f(_);
      if (e instanceof SentryNonRecordingSpan) return;
      const [o, ...s] = n;
      const r = o || Gt();
      const i = Pn(r);
      const a = Wn(_).filter((t) => t !== _);
      const c = Rn(_);
      if (!a.length || !d) {
        x(i);
        return Reflect.apply(t, e, [i, ...s]);
      }
      const u = m.getOptions().ignoreSpans;
      const p = a?.reduce(
        (t, e) => {
          const n = Rn(e);
          return n.timestamp
            ? u && to(n, u)
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
      return Reflect.apply(t, e, [h, ...s]);
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
      if (!s && o.size === 0 && a) {
        i = ms;
        _.end(t);
      }
    }, u);
  }
  function S(t) {
    r = setTimeout(() => {
      if (!s && a) {
        i = ds;
        _.end(t);
      }
    }, p);
  }
  /**
   * Start tracking a specific activity.
   * @param spanId The span id that represents the activity
   */ function k(t) {
    b();
    o.set(t, true);
    const e = Gt();
    S(e + p / 1e3);
  }
  /**
   * Remove an activity from usage
   * @param spanId The span id that represents the activity
   */ function w(t) {
    o.has(t) && o.delete(t);
    if (o.size === 0) {
      const t = Gt();
      v(t + u / 1e3);
    }
  }
  function x(e) {
    s = true;
    o.clear();
    c.forEach((t) => t());
    ie(g, h);
    const n = Rn(_);
    const { start_timestamp: r } = n;
    if (!r) return;
    const a = n.data;
    a[Oe] || _.setAttribute(Oe, i);
    const p = n.status;
    (p && p !== "unknown") || _.setStatus({ code: ze });
    y.log(`[Tracing] Idle span "${n.op}" finished`);
    const f = Wn(_).filter((t) => t !== _);
    let d = 0;
    f.forEach((n) => {
      if (n.isRecording()) {
        n.setStatus({ code: Be, message: "cancelled" });
        n.end(e);
        t &&
          y.log(
            "[Tracing] Cancelling span since span ended early",
            JSON.stringify(n, void 0, 2),
          );
      }
      const o = Rn(n);
      const { timestamp: s = 0, start_timestamp: r = 0 } = o;
      const i = r <= e;
      const a = (l + u) / 1e3;
      const c = s - r <= a;
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
        Bn(_, n);
        d++;
      }
    });
    d > 0 && _.setAttribute("sentry.idle_span_discarded_spans", d);
  }
  c.push(
    m.on("spanStart", (t) => {
      if (
        s ||
        t === _ ||
        !!Rn(t).timestamp ||
        (t instanceof SentrySpan && t.isStandaloneSpan())
      )
        return;
      const e = Wn(_);
      e.includes(t) && k(t.spanContext().spanId);
    }),
  );
  c.push(
    m.on("spanEnd", (t) => {
      s || w(t.spanContext().spanId);
    }),
  );
  c.push(
    m.on("idleSpanEnableAutoFinish", (t) => {
      if (t === _) {
        a = true;
        v();
        o.size && S();
      }
    }),
  );
  n.disableAutoFinish || v();
  setTimeout(() => {
    if (!s) {
      _.setStatus({ code: Be, message: "deadline_exceeded" });
      i = gs;
      _.end();
    }
  }, l);
  return _;
}
function ys(e) {
  const n = ts(e);
  ie(ye(), n);
  t && y.log("[Tracing] Started span is an idle span");
  return n;
}
/* eslint-disable @typescript-eslint/no-explicit-any */ const bs = 0;
const vs = 1;
const Ss = 2;
/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */ function ks(t) {
  return new SyncPromise((e) => {
    e(t);
  });
}
/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */ function ws(t) {
  return new SyncPromise((e, n) => {
    n(t);
  });
}
class SyncPromise {
  constructor(t) {
    this._state = bs;
    this._handlers = [];
    this._runExecutor(t);
  }
  then(t, e) {
    return new SyncPromise((n, o) => {
      this._handlers.push([
        false,
        (e) => {
          if (t)
            try {
              n(t(e));
            } catch (t) {
              o(t);
            }
          else n(e);
        },
        (t) => {
          if (e)
            try {
              n(e(t));
            } catch (t) {
              o(t);
            }
          else o(t);
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
      let o;
      let s;
      return this.then(
        (e) => {
          s = false;
          o = e;
          t && t();
        },
        (e) => {
          s = true;
          o = e;
          t && t();
        },
      ).then(() => {
        s ? n(o) : e(o);
      });
    });
  }
  _executeHandlers() {
    if (this._state === bs) return;
    const t = this._handlers.slice();
    this._handlers = [];
    t.forEach((t) => {
      if (!t[0]) {
        this._state === vs && t[1](this._value);
        this._state === Ss && t[2](this._value);
        t[0] = true;
      }
    });
  }
  _runExecutor(t) {
    const e = (t, e) => {
      if (this._state === bs)
        if (nt(e)) void e.then(n, o);
        else {
          this._state = t;
          this._value = e;
          this._executeHandlers();
        }
    };
    const n = (t) => {
      e(vs, t);
    };
    const o = (t) => {
      e(Ss, t);
    };
    try {
      t(n, o);
    } catch (t) {
      o(t);
    }
  }
}
function xs(t, e, n, o = 0) {
  try {
    const s = Es(e, n, t, o);
    return nt(s) ? s : ks(s);
  } catch (t) {
    return ws(t);
  }
}
function Es(e, n, o, s) {
  const r = o[s];
  if (!e || !r) return e;
  const i = r({ ...e }, n);
  t && i === null && y.log(`Event processor "${r.id || "?"}" dropped event`);
  return nt(i) ? i.then((t) => Es(t, n, o, s + 1)) : Es(i, n, o, s + 1);
}
function As(t, e) {
  const {
    fingerprint: n,
    span: o,
    breadcrumbs: s,
    sdkProcessingMetadata: r,
  } = e;
  $s(t, e);
  o && js(t, o);
  Ns(t, n);
  Os(t, s);
  Cs(t, r);
}
function Ts(t, e) {
  const {
    extra: n,
    tags: o,
    attributes: s,
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
  Is(t, "extra", n);
  Is(t, "tags", o);
  Is(t, "attributes", s);
  Is(t, "user", r);
  Is(t, "contexts", i);
  t.sdkProcessingMetadata = ne(t.sdkProcessingMetadata, c, 2);
  a && (t.level = a);
  m && (t.transactionName = m);
  g && (t.span = g);
  u.length && (t.breadcrumbs = [...t.breadcrumbs, ...u]);
  l.length && (t.fingerprint = [...t.fingerprint, ...l]);
  p.length && (t.eventProcessors = [...t.eventProcessors, ...p]);
  f.length && (t.attachments = [...t.attachments, ...f]);
  t.propagationContext = { ...t.propagationContext, ...d };
}
function Is(t, e, n) {
  t[e] = ne(t[e], n, 1);
}
function $s(t, e) {
  const {
    extra: n,
    tags: o,
    user: s,
    contexts: r,
    level: i,
    transactionName: a,
  } = e;
  Object.keys(n).length && (t.extra = { ...n, ...t.extra });
  Object.keys(o).length && (t.tags = { ...o, ...t.tags });
  Object.keys(s).length && (t.user = { ...s, ...t.user });
  Object.keys(r).length && (t.contexts = { ...r, ...t.contexts });
  i && (t.level = i);
  a && t.type !== "transaction" && (t.transaction = a);
}
function Os(t, e) {
  const n = [...(t.breadcrumbs || []), ...e];
  t.breadcrumbs = n.length ? n : void 0;
}
function Cs(t, e) {
  t.sdkProcessingMetadata = { ...t.sdkProcessingMetadata, ...e };
}
function js(t, e) {
  t.contexts = { trace: On(e), ...t.contexts };
  t.sdkProcessingMetadata = {
    dynamicSamplingContext: co(e),
    ...t.sdkProcessingMetadata,
  };
  const n = Vn(e);
  const o = Rn(n).description;
  o && !t.transaction && t.type === "transaction" && (t.transaction = o);
}
function Ns(t, e) {
  t.fingerprint = t.fingerprint
    ? Array.isArray(t.fingerprint)
      ? t.fingerprint
      : [t.fingerprint]
    : [];
  e && (t.fingerprint = t.fingerprint.concat(e));
  t.fingerprint.length || delete t.fingerprint;
}
let Ps;
let Ms;
let Rs;
let Ds;
function Fs(t) {
  const n = e._sentryDebugIds;
  const o = e._debugIds;
  if (!n && !o) return {};
  const s = n ? Object.keys(n) : [];
  const r = o ? Object.keys(o) : [];
  if (Ds && s.length === Ms && r.length === Rs) return Ds;
  Ms = s.length;
  Rs = r.length;
  Ds = {};
  Ps || (Ps = {});
  const i = (e, n) => {
    for (const o of e) {
      const e = n[o];
      const s = Ps?.[o];
      if (s && Ds && e) {
        Ds[s[0]] = e;
        Ps && (Ps[o] = [s[0], e]);
      } else if (e) {
        const n = t(o);
        for (let t = n.length - 1; t >= 0; t--) {
          const s = n[t];
          const r = s?.filename;
          if (r && Ds && Ps) {
            Ds[r] = e;
            Ps[o] = [r, e];
            break;
          }
        }
      }
    }
  };
  n && i(s, n);
  o && i(r, o);
  return Ds;
}
function Ls(t, e) {
  const n = Fs(t);
  if (!n) return [];
  const o = [];
  for (const t of e)
    t && n[t] && o.push({ type: "sourcemap", code_file: t, debug_id: n[t] });
  return o;
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
 */ function Us(t, e, n, o, s, r) {
  const { normalizeDepth: i = 3, normalizeMaxBreadth: a = 1e3 } = t;
  const c = {
    ...e,
    event_id: e.event_id || n.event_id || Nt(),
    timestamp: e.timestamp || Wt(),
  };
  const u = n.integrations || t.integrations.map((t) => t.name);
  qs(c, t);
  Bs(c, u);
  s && s.emit("applyFrameMetadata", e);
  e.type === void 0 && Js(c, t.stackParser);
  const l = Vs(o, n.captureContext);
  n.mechanism && Dt(c, n.mechanism);
  const p = s ? s.getEventProcessors() : [];
  const f = ve().getScopeData();
  if (r) {
    const t = r.getScopeData();
    Ts(f, t);
  }
  if (l) {
    const t = l.getScopeData();
    Ts(f, t);
  }
  const d = [...(n.attachments || []), ...f.attachments];
  d.length && (n.attachments = d);
  As(c, f);
  const m = [...p, ...f.eventProcessors];
  const g = xs(m, c, n);
  return g.then((t) => {
    t && zs(t);
    return typeof i === "number" && i > 0 ? Ws(t, i, a) : t;
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
 */ function qs(t, e) {
  const { environment: n, release: o, dist: s, maxValueLength: r } = e;
  t.environment = t.environment || n || oo;
  !t.release && o && (t.release = o);
  !t.dist && s && (t.dist = s);
  const i = t.request;
  i?.url && r && (i.url = Et(i.url, r));
  r &&
    t.exception?.values?.forEach((t) => {
      t.value && (t.value = Et(t.value, r));
    });
}
function Js(t, e) {
  const n = Fs(e);
  t.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((t) => {
      t.filename && (t.debug_id = n[t.filename]);
    });
  });
}
function zs(t) {
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
 */ function Bs(t, e) {
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
 */ function Ws(t, e, n) {
  if (!t) return null;
  const o = {
    ...t,
    ...(t.breadcrumbs && {
      breadcrumbs: t.breadcrumbs.map((t) => ({
        ...t,
        ...(t.data && { data: lo(t.data, e, n) }),
      })),
    }),
    ...(t.user && { user: lo(t.user, e, n) }),
    ...(t.contexts && { contexts: lo(t.contexts, e, n) }),
    ...(t.extra && { extra: lo(t.extra, e, n) }),
  };
  if (t.contexts?.trace && o.contexts) {
    o.contexts.trace = t.contexts.trace;
    t.contexts.trace.data &&
      (o.contexts.trace.data = lo(t.contexts.trace.data, e, n));
  }
  t.spans &&
    (o.spans = t.spans.map((t) => ({
      ...t,
      ...(t.data && { data: lo(t.data, e, n) }),
    })));
  t.contexts?.flags &&
    o.contexts &&
    (o.contexts.flags = lo(t.contexts.flags, 3, n));
  return o;
}
function Vs(t, e) {
  if (!e) return t;
  const n = t ? t.clone() : new Scope();
  n.update(e);
  return n;
}
function Ks(t) {
  if (t) return Gs(t) || Zs(t) ? { captureContext: t } : t;
}
function Gs(t) {
  return t instanceof Scope || typeof t === "function";
}
const Hs = [
  "user",
  "level",
  "extra",
  "contexts",
  "tags",
  "fingerprint",
  "propagationContext",
];
function Zs(t) {
  return Object.keys(t).some((t) => Hs.includes(t));
}
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception The exception to capture.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured Sentry event.
 */ function Ys(t, e) {
  return ye().captureException(t, Ks(e));
}
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param captureContext Define the level of the message or pass in additional data to attach to the message.
 * @returns the id of the captured message.
 */ function Xs(t, e) {
  const n = typeof e === "string" ? e : void 0;
  const o = typeof e !== "string" ? { captureContext: e } : void 0;
  return ye().captureMessage(t, n, o);
}
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured event.
 */ function Qs(t, e) {
  return ye().captureEvent(t, e);
}
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */ function tr(t, e) {
  be().setContext(t, e);
}
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */ function er(t) {
  be().setExtras(t);
}
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */ function nr(t, e) {
  be().setExtra(t, e);
}
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */ function or(t) {
  be().setTags(t);
}
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */ function sr(t, e) {
  be().setTag(t, e);
}
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */ function rr(t) {
  be().setUser(t);
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
 */ function ir() {
  return be().lastEventId();
}
/**
 * Create a cron monitor check in and send it to Sentry.
 *
 * @param checkIn An object that describes a check in.
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function ar(e, n) {
  const o = ye();
  const s = we();
  if (s) {
    if (s.captureCheckIn) return s.captureCheckIn(e, n, o);
    t &&
      y.warn(
        "Cannot capture check-in. Client does not support sending check-ins.",
      );
  } else t && y.warn("Cannot capture check-in. No client defined.");
  return Nt();
}
/**
 * Wraps a callback with a cron monitor check in. The check in will be sent to Sentry when the callback finishes.
 *
 * @param monitorSlug The distinct slug of the monitor.
 * @param callback Callback to be monitored
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function cr(t, e, n) {
  function o() {
    const o = ar({ monitorSlug: t, status: "in_progress" }, n);
    const s = Gt();
    function r(e) {
      ar({ monitorSlug: t, status: e, checkInId: o, duration: Gt() - s });
    }
    let i;
    try {
      i = e();
    } catch (t) {
      r("error");
      throw t;
    }
    if (nt(i))
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
  return ke(() => (n?.isolateTrace ? ss(o) : o()));
}
/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */ async function ur(e) {
  const n = we();
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
 */ async function lr(e) {
  const n = we();
  if (n) return n.close(e);
  t && y.warn("Cannot flush events and disable SDK. No client defined.");
  return Promise.resolve(false);
}
function pr() {
  return !!we();
}
function fr() {
  const t = we();
  return t?.getOptions().enabled !== false && !!t?.getTransport();
}
function dr(t) {
  be().addEventProcessor(t);
}
/**
 * Start a session on the current isolation scope.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns the new active session
 */ function mr(t) {
  const n = be();
  const o = ye();
  const { userAgent: s } = e.navigator || {};
  const r = Xt({
    user: o.getUser() || n.getUser(),
    ...(s && { userAgent: s }),
    ...t,
  });
  const i = n.getSession();
  i?.status === "ok" && Qt(i, { status: "exited" });
  gr();
  n.setSession(r);
  return r;
}
function gr() {
  const t = be();
  const e = ye();
  const n = e.getSession() || t.getSession();
  n && te(n);
  hr();
  t.setSession();
}
function hr() {
  const t = be();
  const e = we();
  const n = t.getSession();
  n && e && e.captureSession(n);
}
/**
 * Sends the current session on the scope to Sentry
 *
 * @param end If set the session will be marked as exited and removed from the scope.
 *            Defaults to `false`.
 */ function _r(t = false) {
  t ? gr() : hr();
}
const yr = "7";
function br(t) {
  const e = t.protocol ? `${t.protocol}:` : "";
  const n = t.port ? `:${t.port}` : "";
  return `${e}//${t.host}${n}${t.path ? `/${t.path}` : ""}/api/`;
}
function vr(t) {
  return `${br(t)}${t.projectId}/envelope/`;
}
function Sr(t, e) {
  const n = { sentry_version: yr };
  t.publicKey && (n.sentry_key = t.publicKey);
  e && (n.sentry_client = `${e.name}/${e.version}`);
  return new URLSearchParams(n).toString();
}
function kr(t, e, n) {
  return e || `${vr(t)}?${Sr(t, n)}`;
}
function wr(t, e) {
  const n = _n(t);
  if (!n) return "";
  const o = `${br(n)}embed/error-page/`;
  let s = `dsn=${pn(n)}`;
  for (const t in e)
    if (t !== "dsn" && t !== "onClose")
      if (t === "user") {
        const t = e.user;
        if (!t) continue;
        t.name && (s += `&name=${encodeURIComponent(t.name)}`);
        t.email && (s += `&email=${encodeURIComponent(t.email)}`);
      } else s += `&${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`;
  return `${o}?${s}`;
}
const xr = [];
function Er(t) {
  const e = {};
  t.forEach((t) => {
    const { name: n } = t;
    const o = e[n];
    (o && !o.isDefaultInstance && t.isDefaultInstance) || (e[n] = t);
  });
  return Object.values(e);
}
function Ar(t) {
  const e = t.defaultIntegrations || [];
  const n = t.integrations;
  e.forEach((t) => {
    t.isDefaultInstance = true;
  });
  let o;
  if (Array.isArray(n)) o = [...e, ...n];
  else if (typeof n === "function") {
    const t = n(e);
    o = Array.isArray(t) ? t : [t];
  } else o = e;
  return Er(o);
}
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */ function Tr(t, e) {
  const n = {};
  e.forEach((e) => {
    e && $r(t, e, n);
  });
  return n;
}
function Ir(t, e) {
  for (const n of e) n?.afterAllSetup && n.afterAllSetup(t);
}
function $r(e, n, o) {
  if (o[n.name])
    t &&
      y.log(`Integration skipped because it was already installed: ${n.name}`);
  else {
    o[n.name] = n;
    if (!xr.includes(n.name) && typeof n.setupOnce === "function") {
      n.setupOnce();
      xr.push(n.name);
    }
    n.setup && typeof n.setup === "function" && n.setup(e);
    if (typeof n.preprocessEvent === "function") {
      const t = n.preprocessEvent.bind(n);
      e.on("preprocessEvent", (n, o) => t(n, o, e));
    }
    if (typeof n.processEvent === "function") {
      const t = n.processEvent.bind(n);
      const o = Object.assign((n, o) => t(n, o, e), { id: n.name });
      e.addEventProcessor(o);
    }
    t && y.log(`Integration installed: ${n.name}`);
  }
}
function Or(e) {
  const n = we();
  n
    ? n.addIntegration(e)
    : t &&
      y.warn(
        `Cannot add integration "${e.name}" because no SDK Client is available.`,
      );
}
function Cr(t) {
  return t;
}
function jr(t) {
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
 */ function Nr(t, e) {
  const { value: n, unit: o } = jr(t) ? t : { value: t, unit: void 0 };
  const s = Mr(n);
  const r = o && typeof o === "string" ? { unit: o } : {};
  if (s) return { ...s, ...r };
  if (!e) return;
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
 */ function Pr(t, e = false) {
  const n = {};
  for (const [o, s] of Object.entries(t)) {
    const t = Nr(s, e);
    t && (n[o] = t);
  }
  return n;
}
function Mr(t) {
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
function Rr(t, e) {
  return e
    ? Se(e, () => {
        const n = Kn();
        const o = n ? On(n) : xe(e);
        const s = n ? co(n) : ao(t, e);
        return [s, o];
      })
    : [void 0, void 0];
}
const Dr = { trace: 1, debug: 5, info: 9, warn: 13, error: 17, fatal: 21 };
/**
 * Creates a log container envelope item for a list of logs.
 *
 * @param items - The logs to include in the envelope.
 * @returns The created log container envelope item.
 */ function Fr(t) {
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
 */ function Lr(t, e, n, o) {
  const s = {};
  e?.sdk && (s.sdk = { name: e.sdk.name, version: e.sdk.version });
  !n || !o || (s.dsn = pn(o));
  return vo(s, [Fr(t)]);
}
const Ur = 100;
/**
 * Sets a log attribute if the value exists and the attribute key is not already present.
 *
 * @param logAttributes - The log attributes object to modify.
 * @param key - The attribute key to set.
 * @param value - The value to set (only sets if truthy and key not present).
 * @param setEvenIfPresent - Whether to set the attribute if it is present. Defaults to true.
 */ function qr(t, e, n, o = true) {
  !n || (t[e] && !o) || (t[e] = n);
}
/**
 * Captures a serialized log event and adds it to the log buffer for the given client.
 *
 * @param client - A client. Uses the current client if not provided.
 * @param serializedLog - The serialized log event to capture.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function Jr(t, e) {
  const n = Kr();
  const o = Wr(t);
  if (o === void 0) n.set(t, [e]);
  else if (o.length >= Ur) {
    Br(t, o);
    n.set(t, [e]);
  } else n.set(t, [...o, e]);
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
 */ function zr(e, n = ye(), o = Jr) {
  const s = n?.getClient() ?? we();
  if (!s) {
    t && y.warn("No client available to capture log.");
    return;
  }
  const {
    release: r,
    environment: i,
    enableLogs: a = false,
    beforeSendLog: c,
  } = s.getOptions();
  if (!a) {
    t && y.warn("logging option not enabled, log will not be captured.");
    return;
  }
  const [, l] = Rr(s, n);
  const p = { ...e.attributes };
  const {
    user: { id: f, email: d, username: m },
    attributes: g = {},
  } = Vr(n);
  qr(p, "user.id", f, false);
  qr(p, "user.email", d, false);
  qr(p, "user.name", m, false);
  qr(p, "sentry.release", r);
  qr(p, "sentry.environment", i);
  const { name: h, version: _ } = s.getSdkMetadata()?.sdk ?? {};
  qr(p, "sentry.sdk.name", h);
  qr(p, "sentry.sdk.version", _);
  const b = s.getIntegrationByName("Replay");
  const v = b?.getReplayId(true);
  qr(p, "sentry.replay_id", v);
  v &&
    b?.getRecordingMode() === "buffer" &&
    qr(p, "sentry._internal.replay_is_buffering", true);
  const S = e.message;
  if (Z(S)) {
    const {
      __sentry_template_string__: t,
      __sentry_template_values__: e = [],
    } = S;
    e?.length && (p["sentry.message.template"] = t);
    e.forEach((t, e) => {
      p[`sentry.message.parameter.${e}`] = t;
    });
  }
  const k = ae(n);
  qr(p, "sentry.trace.parent_span_id", k?.spanContext().spanId);
  const w = { ...e, attributes: p };
  s.emit("beforeCaptureLog", w);
  const x = c ? u(() => c(w)) : w;
  if (!x) {
    s.recordDroppedEvent("before_send", "log_item", 1);
    t && y.warn("beforeSendLog returned null, log will not be captured.");
    return;
  }
  const { level: E, message: A, attributes: T = {}, severityNumber: I } = x;
  const $ = {
    timestamp: Gt(),
    level: E,
    body: A,
    trace_id: l?.trace_id,
    severity_number: I ?? Dr[E],
    attributes: { ...Pr(g), ...Pr(T, true) },
  };
  o(s, $);
  s.emit("afterCaptureLog", x);
}
/**
 * Flushes the logs buffer to Sentry.
 *
 * @param client - A client.
 * @param maybeLogBuffer - A log buffer. Uses the log buffer for the given client if not provided.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function Br(t, e) {
  const n = e ?? Wr(t) ?? [];
  if (n.length === 0) return;
  const o = t.getOptions();
  const s = Lr(n, o._metadata, o.tunnel, t.getDsn());
  Kr().set(t, []);
  t.emit("flushLogs");
  t.sendEnvelope(s);
}
/**
 * Returns the log buffer for a given client.
 *
 * Exported for testing purposes.
 *
 * @param client - The client to get the log buffer for.
 * @returns The log buffer for the given client.
 */ function Wr(t) {
  return Kr().get(t);
}
/**
 * Get the scope data for the current scope after merging with the
 * global scope and isolation scope.
 *
 * @param currentScope - The current scope.
 * @returns The scope data.
 */ function Vr(t) {
  const e = ve().getScopeData();
  Ts(e, be().getScopeData());
  Ts(e, t.getScopeData());
  return e;
}
function Kr() {
  return r("clientToLogBufferMap", () => new WeakMap());
}
/**
 * Creates a metric container envelope item for a list of metrics.
 *
 * @param items - The metrics to include in the envelope.
 * @returns The created metric container envelope item.
 */ function Gr(t) {
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
 */ function Hr(t, e, n, o) {
  const s = {};
  e?.sdk && (s.sdk = { name: e.sdk.name, version: e.sdk.version });
  !n || !o || (s.dsn = pn(o));
  return vo(s, [Gr(t)]);
}
const Zr = 1e3;
/**
 * Converts a metric attribute to a serialized metric attribute.
 *
 * @param value - The value of the metric attribute.
 * @returns The serialized metric attribute.
 */ function Yr(t) {
  switch (typeof t) {
    case "number":
      return Number.isInteger(t)
        ? { value: t, type: "integer" }
        : { value: t, type: "double" };
    case "boolean":
      return { value: t, type: "boolean" };
    case "string":
      return { value: t, type: "string" };
    default: {
      let e = "";
      try {
        e = JSON.stringify(t) ?? "";
      } catch {}
      return { value: e, type: "string" };
    }
  }
}
/**
 * Sets a metric attribute if the value exists and the attribute key is not already present.
 *
 * @param metricAttributes - The metric attributes object to modify.
 * @param key - The attribute key to set.
 * @param value - The value to set (only sets if truthy and key not present).
 * @param setEvenIfPresent - Whether to set the attribute if it is present. Defaults to true.
 */ function Xr(t, e, n, o = true) {
  !n || (!o && e in t) || (t[e] = n);
}
/**
 * Captures a serialized metric event and adds it to the metric buffer for the given client.
 *
 * @param client - A client. Uses the current client if not provided.
 * @param serializedMetric - The serialized metric event to capture.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function Qr(t, e) {
  const n = ii();
  const o = si(t);
  if (o === void 0) n.set(t, [e]);
  else if (o.length >= Zr) {
    oi(t, o);
    n.set(t, [e]);
  } else n.set(t, [...o, e]);
}
function ti(t, e, n) {
  const { release: o, environment: s } = e.getOptions();
  const r = { ...t.attributes };
  const {
    user: { id: i, email: a, username: c },
  } = ri(n);
  Xr(r, "user.id", i, false);
  Xr(r, "user.email", a, false);
  Xr(r, "user.name", c, false);
  Xr(r, "sentry.release", o);
  Xr(r, "sentry.environment", s);
  const { name: u, version: l } = e.getSdkMetadata()?.sdk ?? {};
  Xr(r, "sentry.sdk.name", u);
  Xr(r, "sentry.sdk.version", l);
  const p = e.getIntegrationByName("Replay");
  const f = p?.getReplayId(true);
  Xr(r, "sentry.replay_id", f);
  f &&
    p?.getRecordingMode() === "buffer" &&
    Xr(r, "sentry._internal.replay_is_buffering", true);
  return { ...t, attributes: r };
}
function ei(t, e, n) {
  const o = {};
  for (const e in t.attributes)
    t.attributes[e] !== void 0 && (o[e] = Yr(t.attributes[e]));
  const [, s] = Rr(e, n);
  const r = ae(n);
  const i = r ? r.spanContext().traceId : s?.trace_id;
  const a = r ? r.spanContext().spanId : void 0;
  return {
    timestamp: Gt(),
    trace_id: i ?? "",
    span_id: a,
    name: t.name,
    type: t.type,
    unit: t.unit,
    value: t.value,
    attributes: o,
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
 */ function ni(e, n) {
  const o = n?.scope ?? ye();
  const s = n?.captureSerializedMetric ?? Qr;
  const r = o?.getClient() ?? we();
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
  const l = ti(e, r, o);
  r.emit("processMetric", l);
  const p = c || i?.beforeSendMetric;
  const f = p ? p(l) : l;
  if (!f) {
    t && y.log("`beforeSendMetric` returned `null`, will not send metric.");
    return;
  }
  const d = ei(f, r, o);
  t && y.log("[Metric]", d);
  s(r, d);
  r.emit("afterCaptureMetric", f);
}
/**
 * Flushes the metrics buffer to Sentry.
 *
 * @param client - A client.
 * @param maybeMetricBuffer - A metric buffer. Uses the metric buffer for the given client if not provided.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function oi(t, e) {
  const n = e ?? si(t) ?? [];
  if (n.length === 0) return;
  const o = t.getOptions();
  const s = Hr(n, o._metadata, o.tunnel, t.getDsn());
  ii().set(t, []);
  t.emit("flushMetrics");
  t.sendEnvelope(s);
}
/**
 * Returns the metric buffer for a given client.
 *
 * Exported for testing purposes.
 *
 * @param client - The client to get the metric buffer for.
 * @returns The metric buffer for the given client.
 */ function si(t) {
  return ii().get(t);
}
/**
 * Get the scope data for the current scope after merging with the
 * global scope and isolation scope.
 *
 * @param currentScope - The current scope.
 * @returns The scope data.
 */ function ri(t) {
  const e = ve().getScopeData();
  Ts(e, be().getScopeData());
  Ts(e, t.getScopeData());
  return e;
}
function ii() {
  return r("clientToMetricBufferMap", () => new WeakMap());
}
const ai = Symbol.for("SentryBufferFullError");
/**
 * Creates an new PromiseBuffer object with the specified limit
 * @param limit max number of promises that can be stored in the buffer
 */ function ci(t = 100) {
  const e = new Set();
  function n() {
    return e.size < t;
  }
  /**
   * Remove a promise from the queue.
   *
   * @param task Can be any PromiseLike<T>
   * @returns Removed promise.
   */ function o(t) {
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
   */ function s(t) {
    if (!n()) return ws(ai);
    const s = t();
    e.add(s);
    void s.then(
      () => o(s),
      () => o(s),
    );
    return s;
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
    if (!e.size) return ks(true);
    const n = Promise.allSettled(Array.from(e)).then(() => true);
    if (!t) return n;
    const o = [n, new Promise((e) => setTimeout(() => e(false), t))];
    return Promise.race(o);
  }
  return {
    get $() {
      return Array.from(e);
    },
    add: s,
    drain: r,
  };
}
const ui = 6e4;
/**
 * Extracts Retry-After value from the request header or returns default value
 * @param header string representation of 'Retry-After' header
 * @param now current unix timestamp
 *
 */ function li(t, e = Date.now()) {
  const n = parseInt(`${t}`, 10);
  if (!isNaN(n)) return n * 1e3;
  const o = Date.parse(`${t}`);
  return isNaN(o) ? ui : o - e;
}
function pi(t, e) {
  return t[e] || t.all || 0;
}
function fi(t, e, n = Date.now()) {
  return pi(t, e) > n;
}
function di(t, { statusCode: e, headers: n }, o = Date.now()) {
  const s = { ...t };
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
            (s[t] = o + a);
      else s.all = o + a;
    }
  else i ? (s.all = o + li(i, o)) : e === 429 && (s.all = o + 6e4);
  return s;
}
const mi = 64;
/**
 * Creates an instance of a Sentry `Transport`
 *
 * @param options
 * @param makeRequest
 */ function gi(e, n, o = ci(e.bufferSize || mi)) {
  let s = {};
  const r = (t) => o.drain(t);
  function i(r) {
    const i = [];
    ko(r, (t, n) => {
      const o = jo(n);
      fi(s, o) ? e.recordDroppedEvent("ratelimit_backoff", o) : i.push(t);
    });
    if (i.length === 0) return Promise.resolve({});
    const a = vo(r[0], i);
    const c = (t) => {
      ko(a, (n, o) => {
        e.recordDroppedEvent(t, jo(o));
      });
    };
    const u = () =>
      n({ body: Ao(a) }).then(
        (e) => {
          e.statusCode !== void 0 &&
            (e.statusCode < 200 || e.statusCode >= 300) &&
            t &&
            y.warn(
              `Sentry responded with status code ${e.statusCode} to sent event.`,
            );
          s = di(s, e);
          return e;
        },
        (e) => {
          c("network_error");
          t && y.error("Encountered error running transport request:", e);
          throw e;
        },
      );
    return o.add(u).then(
      (t) => t,
      (e) => {
        if (e === ai) {
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
 */ function hi(t, e, n) {
  const o = [
    { type: "client_report" },
    { timestamp: n || Wt(), discarded_events: t },
  ];
  return vo(e ? { dsn: e } : {}, [o]);
}
function _i(t) {
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
function yi(t) {
  const {
    trace_id: e,
    parent_span_id: n,
    span_id: o,
    status: s,
    origin: r,
    data: i,
    op: a,
  } = t.contexts?.trace ?? {};
  return {
    data: i ?? {},
    description: t.transaction,
    op: a,
    parent_span_id: n,
    span_id: o ?? "",
    start_timestamp: t.start_timestamp ?? 0,
    status: s,
    timestamp: t.timestamp,
    trace_id: e ?? "",
    origin: r,
    profile_id: i?.[Pe],
    exclusive_time: i?.[Me],
    measurements: t.measurements,
    is_segment: true,
  };
}
function bi(t) {
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
          ...(t.profile_id && { [Pe]: t.profile_id }),
          ...(t.exclusive_time && { [Me]: t.exclusive_time }),
        },
      },
    },
    measurements: t.measurements,
  };
}
const vi = "Not capturing exception because it's already been captured.";
const Si = "Discarded session because of missing or non-string release";
const ki = Symbol.for("SentryInternalError");
const wi = Symbol.for("SentryDoNotSendEventError");
const xi = 5e3;
function Ei(t) {
  return { message: t, [ki]: true };
}
function Ai(t) {
  return { message: t, [wi]: true };
}
function Ti(t) {
  return !!t && typeof t === "object" && ki in t;
}
function Ii(t) {
  return !!t && typeof t === "object" && wi in t;
}
function $i(t, e, n, o, s) {
  let r = 0;
  let i;
  let a = false;
  t.on(n, () => {
    r = 0;
    clearTimeout(i);
    a = false;
  });
  t.on(e, (e) => {
    r += o(e);
    if (r >= 8e5) s(t);
    else if (!a) {
      a = true;
      i = setTimeout(() => {
        s(t);
      }, xi);
    }
  });
  t.on("flush", () => {
    s(t);
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
    this._promiseBuffer = ci(e.transportOptions?.bufferSize ?? mi);
    e.dsn
      ? (this._dsn = _n(e.dsn))
      : t && y.warn("No DSN provided, client will not send events.");
    if (this._dsn) {
      const t = kr(this._dsn, e.tunnel, e._metadata ? e._metadata.sdk : void 0);
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
      $i(this, "afterCaptureLog", "flushLogs", Ri, Br);
    const n =
      this._options.enableMetrics ??
      this._options._experiments?.enableMetrics ??
      true;
    n && $i(this, "afterCaptureMetric", "flushMetrics", Mi, oi);
  }
  captureException(e, n, o) {
    const s = Nt();
    if (Jt(e)) {
      t && y.log(vi);
      return s;
    }
    const r = { event_id: s, ...n };
    this._process(
      () =>
        this.eventFromException(e, r)
          .then((t) => this._captureEvent(t, r, o))
          .then((t) => t),
      "error",
    );
    return r.event_id;
  }
  captureMessage(t, e, n, o) {
    const s = { event_id: Nt(), ...n };
    const r = Z(t) ? t : String(t);
    const i = Y(t);
    const a = i
      ? this.eventFromMessage(r, e, s)
      : this.eventFromException(t, s);
    this._process(
      () => a.then((t) => this._captureEvent(t, s, o)),
      i ? "unknown" : "error",
    );
    return s.event_id;
  }
  captureEvent(e, n, o) {
    const s = Nt();
    if (n?.originalException && Jt(n.originalException)) {
      t && y.log(vi);
      return s;
    }
    const r = { event_id: s, ...n };
    const i = e.sdkProcessingMetadata || {};
    const a = i.capturedSpanScope;
    const c = i.capturedSpanIsolationScope;
    const u = Oi(e.type);
    this._process(() => this._captureEvent(e, r, a || o, c), u);
    return r.event_id;
  }
  captureSession(t) {
    this.sendSession(t);
    Qt(t, { init: false });
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
    const o = await e.flush(t);
    return n && o;
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
    $r(this, t, this._integrations);
    e || Ir(this, [t]);
  }
  sendEvent(t, e = {}) {
    this.emit("beforeSendEvent", t, e);
    let n = Do(t, this._dsn, this._options._metadata, this._options.tunnel);
    for (const t of e.attachments || []) n = So(n, Oo(t));
    this.sendEnvelope(n).then((e) => this.emit("afterSendEvent", t, e));
  }
  sendSession(e) {
    const { release: n, environment: o = oo } = this._options;
    if ("aggregates" in e) {
      const s = e.attrs || {};
      if (!s.release && !n) {
        t && y.warn(Si);
        return;
      }
      s.release = s.release || n;
      s.environment = s.environment || o;
      e.attrs = s;
    } else {
      if (!e.release && !n) {
        t && y.warn(Si);
        return;
      }
      e.release = e.release || n;
      e.environment = e.environment || o;
    }
    this.emit("beforeSendSession", e);
    const s = Ro(e, this._dsn, this._options._metadata, this._options.tunnel);
    this.sendEnvelope(s);
  }
  recordDroppedEvent(e, n, o = 1) {
    if (this._options.sendClientReports) {
      const s = `${e}:${n}`;
      t && y.log(`Recording outcome: "${s}"${o > 1 ? ` (${o} times)` : ""}`);
      this._outcomes[s] = (this._outcomes[s] || 0) + o;
    }
  }
  /* eslint-disable @typescript-eslint/unified-signatures */
  /**
   * Register a callback for whenever a span is started.
   * Receives the span as argument.
   * @returns {() => void} A function that, when executed, removes the registered callback.
   */ on(t, e) {
    const n = (this._hooks[t] = this._hooks[t] || new Set());
    const o = (...t) => e(...t);
    n.add(o);
    return () => {
      n.delete(o);
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
    this._integrations = Tr(this, t);
    Ir(this, t);
  }
  _updateSessionFromEvent(t, e) {
    let n = e.level === "fatal";
    let o = false;
    const s = e.exception?.values;
    if (s) {
      o = true;
      n = false;
      for (const t of s)
        if (t.mechanism?.handled === false) {
          n = true;
          break;
        }
    }
    const r = t.status === "ok";
    const i = (r && t.errors === 0) || (r && n);
    if (i) {
      Qt(t, {
        ...(n && { status: "crashed" }),
        errors: t.errors || Number(o || n),
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
   */ _prepareEvent(t, e, n, o) {
    const s = this.getOptions();
    const r = Object.keys(this._integrations);
    !e.integrations && r?.length && (e.integrations = r);
    this.emit("preprocessEvent", t, e);
    t.type || o.setLastEventId(t.event_id || e.event_id);
    return Us(s, t, e, n, this, o).then((t) => {
      if (t === null) return t;
      this.emit("postprocessEvent", t, e);
      t.contexts = { trace: xe(n), ...t.contexts };
      const o = ao(this, n);
      t.sdkProcessingMetadata = {
        dynamicSamplingContext: o,
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
   */ _captureEvent(e, n = {}, o = ye(), s = be()) {
    t && Ni(e) && y.log(`Captured error event \`${_i(e)[0] || "<unknown>"}\``);
    return this._processEvent(e, n, o, s).then(
      (t) => t.event_id,
      (e) => {
        t && (Ii(e) ? y.log(e.message) : Ti(e) ? y.warn(e.message) : y.warn(e));
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
   */ _processEvent(t, e, n, o) {
    const s = this.getOptions();
    const { sampleRate: r } = s;
    const i = Pi(t);
    const a = Ni(t);
    const c = t.type || "error";
    const u = `before send for type \`${c}\``;
    const l = typeof r === "undefined" ? void 0 : yn(r);
    if (a && typeof l === "number" && Math.random() > l) {
      this.recordDroppedEvent("sample_rate", "error");
      return ws(
        Ai(
          `Discarding event because it's not included in the random sample (sampling rate = ${r})`,
        ),
      );
    }
    const p = Oi(t.type);
    return this._prepareEvent(t, e, n, o)
      .then((t) => {
        if (t === null) {
          this.recordDroppedEvent("event_processor", p);
          throw Ai("An event processor returned `null`, will not send event.");
        }
        const n = e.data && e.data.__sentry__ === true;
        if (n) return t;
        const o = ji(this, s, t, e);
        return Ci(o, u);
      })
      .then((s) => {
        if (s === null) {
          this.recordDroppedEvent("before_send", p);
          if (i) {
            const e = t.spans || [];
            const n = 1 + e.length;
            this.recordDroppedEvent("before_send", "span", n);
          }
          throw Ai(`${u} returned \`null\`, will not send event.`);
        }
        const r = n.getSession() || o.getSession();
        a && r && this._updateSessionFromEvent(r, s);
        if (i) {
          const t = s.sdkProcessingMetadata?.spanCountBeforeProcessing || 0;
          const e = s.spans ? s.spans.length : 0;
          const n = t - e;
          n > 0 && this.recordDroppedEvent("before_send", "span", n);
        }
        const c = s.transaction_info;
        if (i && c && s.transaction !== t.transaction) {
          const t = "custom";
          s.transaction_info = { ...c, source: t };
        }
        this.sendEvent(s, e);
        return s;
      })
      .then(null, (t) => {
        if (Ii(t) || Ti(t)) throw t;
        this.captureException(t, {
          mechanism: { handled: false, type: "internal" },
          data: { __sentry__: true },
          originalException: t,
        });
        throw Ei(
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
        t === ai && this.recordDroppedEvent("queue_overflow", e);
        return t;
      },
    );
  }
  _clearOutcomes() {
    const t = this._outcomes;
    this._outcomes = {};
    return Object.entries(t).map(([t, e]) => {
      const [n, o] = t.split(":");
      return { reason: n, category: o, quantity: e };
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
    const n = hi(e, this._options.tunnel && pn(this._dsn));
    this.sendEnvelope(n);
  }
}
function Oi(t) {
  return t === "replay_event" ? "replay" : t || "error";
}
function Ci(t, e) {
  const n = `${e} must return \`null\` or a valid event.`;
  if (nt(t))
    return t.then(
      (t) => {
        if (!X(t) && t !== null) throw Ei(n);
        return t;
      },
      (t) => {
        throw Ei(`${e} rejected with ${t}`);
      },
    );
  if (!X(t) && t !== null) throw Ei(n);
  return t;
}
function ji(t, e, n, o) {
  const {
    beforeSend: s,
    beforeSendTransaction: r,
    beforeSendSpan: i,
    ignoreSpans: a,
  } = e;
  let c = n;
  if (Ni(c) && s) return s(c, o);
  if (Pi(c)) {
    if (i || a) {
      const e = yi(c);
      if (a?.length && to(e, a)) return null;
      if (i) {
        const t = i(e);
        t ? (c = ne(n, bi(t))) : Gn();
      }
      if (c.spans) {
        const e = [];
        const n = c.spans;
        for (const t of n)
          if (a?.length && to(t, a)) eo(n, t);
          else if (i) {
            const n = i(t);
            if (n) e.push(n);
            else {
              Gn();
              e.push(t);
            }
          } else e.push(t);
        const o = c.spans.length - e.length;
        o && t.recordDroppedEvent("before_send", "span", o);
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
      return r(c, o);
    }
  }
  return c;
}
function Ni(t) {
  return t.type === void 0;
}
function Pi(t) {
  return t.type === "transaction";
}
/**
 * Estimate the size of a metric in bytes.
 *
 * @param metric - The metric to estimate the size of.
 * @returns The estimated size of the metric in bytes.
 */ function Mi(t) {
  let e = 0;
  t.name && (e += t.name.length * 2);
  e += 8;
  return e + Di(t.attributes);
}
/**
 * Estimate the size of a log in bytes.
 *
 * @param log - The log to estimate the size of.
 * @returns The estimated size of the log in bytes.
 */ function Ri(t) {
  let e = 0;
  t.message && (e += t.message.length * 2);
  return e + Di(t.attributes);
}
/**
 * Estimate the size of attributes in bytes.
 *
 * @param attributes - The attributes object to estimate the size of.
 * @returns The estimated size of the attributes in bytes.
 */ function Di(t) {
  if (!t) return 0;
  let e = 0;
  Object.values(t).forEach((t) => {
    Array.isArray(t)
      ? (e += t.length * Fi(t[0]))
      : Y(t)
        ? (e += Fi(t))
        : (e += 100);
  });
  return e;
}
function Fi(t) {
  return typeof t === "string"
    ? t.length * 2
    : typeof t === "number"
      ? 8
      : typeof t === "boolean"
        ? 4
        : 0;
}
function Li(t, e, n, o, s) {
  const r = { sent_at: new Date().toISOString() };
  n?.sdk && (r.sdk = { name: n.sdk.name, version: n.sdk.version });
  !o || !s || (r.dsn = pn(s));
  e && (r.trace = e);
  const i = Ui(t);
  return vo(r, [i]);
}
function Ui(t) {
  const e = { type: "check_in" };
  return [e, t];
}
function qi(t) {
  const e = t._metadata?.sdk;
  const n = e?.name && e?.version ? `${e?.name}/${e?.version}` : void 0;
  t.transportOptions = {
    ...t.transportOptions,
    headers: { ...(n && { "user-agent": n }), ...t.transportOptions?.headers },
  };
}
function Ji(t, e) {
  return t(e.stack || "", 1);
}
function zi(t, e) {
  const n = { type: e.name || e.constructor.name, value: e.message };
  const o = Ji(t, e);
  o.length && (n.stacktrace = { frames: o });
  return n;
}
function Bi(t) {
  for (const e in t)
    if (Object.prototype.hasOwnProperty.call(t, e)) {
      const n = t[e];
      if (n instanceof Error) return n;
    }
}
function Wi(t) {
  if ("name" in t && typeof t.name === "string") {
    let e = `'${t.name}' captured as exception`;
    "message" in t &&
      typeof t.message === "string" &&
      (e += ` with message '${t.message}'`);
    return e;
  }
  if ("message" in t && typeof t.message === "string") return t.message;
  const e = vt(t);
  if (V(t))
    return `Event \`ErrorEvent\` captured as exception with message \`${t.message}\``;
  const n = Vi(t);
  return `${n && n !== "Object" ? `'${n}'` : "Object"} captured as exception with keys: ${e}`;
}
function Vi(t) {
  try {
    const e = Object.getPrototypeOf(t);
    return e ? e.constructor.name : void 0;
  } catch {}
}
function Ki(t, e, n, o) {
  if (B(n)) return [n, void 0];
  e.synthetic = true;
  if (X(n)) {
    const e = t?.getOptions().normalizeDepth;
    const s = { __serialized__: po(n, e) };
    const r = Bi(n);
    if (r) return [r, s];
    const i = Wi(n);
    const a = o?.syntheticException || new Error(i);
    a.message = i;
    return [a, s];
  }
  const s = o?.syntheticException || new Error(n);
  s.message = `${n}`;
  return [s, void 0];
}
function Gi(t, e, n, o) {
  const s = o?.data && o.data.mechanism;
  const r = s || { handled: true, type: "generic" };
  const [i, a] = Ki(t, r, n, o);
  const c = { exception: { values: [zi(e, i)] } };
  a && (c.extra = a);
  Rt(c, void 0, void 0);
  Dt(c, r);
  return { ...c, event_id: o?.event_id };
}
function Hi(t, e, n = "info", o, s) {
  const r = { event_id: o?.event_id, level: n };
  if (s && o?.syntheticException) {
    const n = Ji(t, o.syntheticException);
    if (n.length) {
      r.exception = { values: [{ value: e, stacktrace: { frames: n } }] };
      Dt(r, { synthetic: true });
    }
  }
  if (Z(e)) {
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
    Yn();
    qi(t);
    super(t);
    this._setUpMetricsProcessing();
  }
  eventFromException(t, e) {
    const n = Gi(this, this._options.stackParser, t, e);
    n.level = "error";
    return ks(n);
  }
  eventFromMessage(t, e = "info", n) {
    return ks(
      Hi(this._options.stackParser, t, e, n, this._options.attachStacktrace),
    );
  }
  captureException(t, e, n) {
    Zi(e);
    return super.captureException(t, e, n);
  }
  captureEvent(t, e, n) {
    const o = !t.type && t.exception?.values && t.exception.values.length > 0;
    o && Zi(e);
    return super.captureEvent(t, e, n);
  }
  /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */ captureCheckIn(e, n, o) {
    const s = "checkInId" in e && e.checkInId ? e.checkInId : Nt();
    if (!this._isEnabled()) {
      t && y.warn("SDK not enabled, will not capture check-in.");
      return s;
    }
    const r = this.getOptions();
    const { release: i, environment: a, tunnel: c } = r;
    const u = {
      check_in_id: s,
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
    const [l, p] = Rr(this, o);
    p && (u.contexts = { trace: p });
    const f = Li(u, l, this.getSdkMetadata(), c, this.getDsn());
    t && y.log("Sending checkin:", e.monitorSlug, e.status);
    this.sendEnvelope(f);
    return s;
  }
  _prepareEvent(t, e, n, o) {
    this._options.platform &&
      (t.platform = t.platform || this._options.platform);
    this._options.runtime &&
      (t.contexts = {
        ...t.contexts,
        runtime: t.contexts?.runtime || this._options.runtime,
      });
    this._options.serverName &&
      (t.server_name = t.server_name || this._options.serverName);
    return super._prepareEvent(t, e, n, o);
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
function Zi(t) {
  const e = be().getScopeData().sdkProcessingMetadata.requestSession;
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
 */ function Yi(e, n) {
  n.debug === true &&
    (t
      ? y.enable()
      : u(() => {
          console.warn(
            "[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.",
          );
        }));
  const o = ye();
  o.update(n.initialScope);
  const s = new e(n);
  Xi(s);
  s.init();
  return s;
}
function Xi(t) {
  ye().setClient(t);
}
const Qi = 100;
const ta = 5e3;
const ea = 36e5;
/**
 * Wraps a transport and stores and retries events when they fail to send.
 *
 * @param createTransport The transport to wrap.
 */ function na(e) {
  function n(...e) {
    t && y.log("[Offline]:", ...e);
  }
  return (t) => {
    const o = e(t);
    if (!t.createStore)
      throw new Error("No `createStore` function was provided");
    const s = t.createStore(t);
    let r = ta;
    let i;
    function a(e, n, o) {
      return (
        !wo(e, ["client_report"]) && (!t.shouldStore || t.shouldStore(e, n, o))
      );
    }
    function c(t) {
      i && clearTimeout(i);
      i = setTimeout(async () => {
        i = void 0;
        const t = await s.shift();
        if (t) {
          n("Attempting to send previously queued event");
          t[0].sent_at = new Date().toISOString();
          void l(t, true).catch((t) => {
            n("Failed to retry sending", t);
          });
        }
      }, t);
      typeof i !== "number" && i.unref && i.unref();
    }
    function u() {
      if (!i) {
        c(r);
        r = Math.min(r * 2, ea);
      }
    }
    async function l(e, i = false) {
      if (!i && wo(e, ["replay_event", "replay_recording"])) {
        await s.push(e);
        c(Qi);
        return {};
      }
      try {
        if (t.shouldSend && (await t.shouldSend(e)) === false)
          throw new Error(
            "Envelope not sent because `shouldSend` callback returned false",
          );
        const n = await o.send(e);
        let s = Qi;
        if (n)
          if (n.headers?.["retry-after"]) s = li(n.headers["retry-after"]);
          else if (n.headers?.["x-sentry-rate-limits"]) s = 6e4;
          else if ((n.statusCode || 0) >= 400) return n;
        c(s);
        r = ta;
        return n;
      } catch (t) {
        if (await a(e, t, r)) {
          i ? await s.unshift(e) : await s.push(e);
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
          r = ta;
          c(Qi);
        }
        return o.flush(t);
      },
    };
  };
}
const oa = "MULTIPLEXED_TRANSPORT_EXTRA_KEY";
function sa(t, e) {
  let n;
  ko(t, (t, o) => {
    e.includes(o) && (n = Array.isArray(t) ? t[1] : void 0);
    return !!n;
  });
  return n;
}
function ra(t, e) {
  return (n) => {
    const o = t(n);
    return {
      ...o,
      send: async (t) => {
        const n = sa(t, ["event", "transaction", "profile", "replay_event"]);
        n && (n.release = e);
        return o.send(t);
      },
    };
  };
}
function ia(t, e) {
  return vo(e ? { ...t[0], dsn: e } : t[0], t[1]);
}
function aa(t, e) {
  return (n) => {
    const o = t(n);
    const s = new Map();
    const r =
      e ||
      ((t) => {
        const e = t.getEvent();
        return e?.extra?.[oa] && Array.isArray(e.extra[oa]) ? e.extra[oa] : [];
      });
    function i(e, o) {
      const r = o ? `${e}:${o}` : e;
      let i = s.get(r);
      if (!i) {
        const a = fn(e);
        if (!a) return;
        const c = kr(a, n.tunnel);
        i = o ? ra(t, o)({ ...n, url: c }) : t({ ...n, url: c });
        s.set(r, i);
      }
      return [e, i];
    }
    async function a(t) {
      function e(e) {
        const n = e?.length ? e : ["event"];
        return sa(t, n);
      }
      const n = r({ envelope: t, getEvent: e })
        .map((t) =>
          typeof t === "string" ? i(t, void 0) : i(t.dsn, t.release),
        )
        .filter((t) => !!t);
      const s = n.length ? n : [["", o]];
      const a = await Promise.all(s.map(([e, n]) => n.send(ia(t, e))));
      return a[0];
    }
    async function c(t) {
      const e = [...s.values(), o];
      const n = await Promise.all(e.map((e) => e.flush(t)));
      return n.every((t) => t);
    }
    return { send: a, flush: c };
  };
}
const ca = new Set();
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
 */ function ua(e) {
  e.forEach((e) => {
    ca.add(e);
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
 */ function la(t) {
  return ca.has(t);
}
function pa() {
  ca.clear();
  t && y.log("Cleared AI provider skip registrations");
}
const fa = "thismessage:/";
/**
 * Checks if the URL object is relative
 *
 * @param url - The URL object to check
 * @returns True if the URL object is relative, false otherwise
 */ function da(t) {
  return "isRelative" in t;
}
/**
 * Parses string to a URL object
 *
 * @param url - The URL to parse
 * @returns The parsed URL object or undefined if the URL is invalid
 */ function ma(t, e) {
  const n = t.indexOf("://") <= 0 && t.indexOf("//") !== 0;
  const o = e ?? (n ? fa : void 0);
  try {
    if ("canParse" in URL && !URL.canParse(t, o)) return;
    const e = new URL(t, o);
    return n
      ? { isRelative: n, pathname: e.pathname, search: e.search, hash: e.hash }
      : e;
  } catch {}
}
function ga(t) {
  if (da(t)) return t.pathname;
  const e = new URL(t);
  e.search = "";
  e.hash = "";
  ["80", "443"].includes(e.port) && (e.port = "");
  e.password && (e.password = "%filtered%");
  e.username && (e.username = "%filtered%");
  return e.toString();
}
function ha(t, e, n, o) {
  const s = n?.method?.toUpperCase() ?? "GET";
  const r = o || (t ? (e === "client" ? ga(t) : t.pathname) : "/");
  return `${s} ${r}`;
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
 */ function _a(t, e, n, o, s) {
  const r = { [$e]: n, [Ee]: "url" };
  if (s) {
    r[e === "server" ? "http.route" : "url.template"] = s;
    r[Ee] = "route";
  }
  o?.method && (r[Le] = o.method.toUpperCase());
  if (t) {
    t.search && (r["url.query"] = t.search);
    t.hash && (r["url.fragment"] = t.hash);
    if (t.pathname) {
      r["url.path"] = t.pathname;
      t.pathname === "/" && (r[Ee] = "route");
    }
    if (!da(t)) {
      r[Ue] = t.href;
      t.port && (r["url.port"] = t.port);
      t.protocol && (r["url.scheme"] = t.protocol);
      t.hostname &&
        (r[e === "server" ? "server.address" : "url.domain"] = t.hostname);
    }
  }
  return [ha(t, e, o, s), r];
}
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */ function ya(t) {
  if (!t) return {};
  const e = t.match(
    /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/,
  );
  if (!e) return {};
  const n = e[6] || "";
  const o = e[8] || "";
  return {
    host: e[4],
    path: e[5],
    protocol: e[2],
    search: n,
    hash: o,
    relative: e[5] + n + o,
  };
}
/**
 * Strip the query string and fragment off of a given URL or path (if present)
 *
 * @param urlPath Full URL or path, including possible query string and/or fragment
 * @returns URL or path without query string or fragment
 */ function ba(t) {
  return t.split(/[?#]/, 1)[0];
}
function va(t) {
  const { protocol: e, host: n, path: o } = t;
  const s =
    n
      ?.replace(/^.*@/, "[filtered]:[filtered]@")
      .replace(/(:80)$/, "")
      .replace(/(:443)$/, "") || "";
  return `${e ? `${e}://` : ""}${s}${o}`;
}
/**
 * Checks whether given url points to Sentry server
 *
 * @param url url to verify
 */ function Sa(t, e) {
  const n = e?.getDsn();
  const o = e?.getOptions().tunnel;
  return wa(t, n) || ka(t, o);
}
function ka(t, e) {
  return !!e && xa(t) === xa(e);
}
function wa(t, e) {
  const n = ma(t);
  return (
    !(!n || da(n)) &&
    !!e &&
    n.host.includes(e.host) &&
    /(^|&|\?)sentry_key=/.test(n.search)
  );
}
function xa(t) {
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
 */ function Ea(t, ...e) {
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
 */ const Aa = Ea;
/**
 * @internal
 * @deprecated -- set ip inferral via via SDK metadata options on client instead.
 */ function Ta(t) {
  t.user?.ip_address === void 0 &&
    (t.user = { ...t.user, ip_address: "{{auto}}" });
}
function Ia(t) {
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
 */ function $a(t, e, o = [e], s = "npm") {
  const r = t._metadata || {};
  r.sdk ||
    (r.sdk = {
      name: `sentry.javascript.${e}`,
      packages: o.map((t) => ({ name: `${s}:@sentry/${t}`, version: n })),
      version: n,
    });
  t._metadata = r;
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
 */ function Oa(t = {}) {
  const e = t.client || we();
  if (!fr() || !e) return {};
  const n = o();
  const s = _e(n);
  if (s.getTraceData) return s.getTraceData(t);
  const r = t.scope || ye();
  const i = t.span || Kn();
  const a = i ? Cn(i) : Ca(r);
  const c = i ? co(i) : ao(e, r);
  const u = on(c);
  const l = bn.test(a);
  if (!l) {
    y.warn("Invalid sentry-trace data. Cannot generate trace data");
    return {};
  }
  const p = { "sentry-trace": a, baggage: u };
  t.propagateTraceparent && (p.traceparent = i ? jn(i) : ja(r));
  return p;
}
function Ca(t) {
  const {
    traceId: e,
    sampled: n,
    propagationSpanId: o,
  } = t.getPropagationContext();
  return kn(e, o, n);
}
function ja(t) {
  const {
    traceId: e,
    sampled: n,
    propagationSpanId: o,
  } = t.getPropagationContext();
  return wn(e, o, n);
}
function Na(t) {
  return Object.entries(t || Oa())
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
 */ function Pa(t, e, n) {
  let o;
  let s;
  let r;
  const i = n?.maxWait ? Math.max(n.maxWait, e) : 0;
  const a = n?.setTimeoutImpl || setTimeout;
  function c() {
    u();
    o = t();
    return o;
  }
  function u() {
    s !== void 0 && clearTimeout(s);
    r !== void 0 && clearTimeout(r);
    s = r = void 0;
  }
  function l() {
    return s !== void 0 || r !== void 0 ? c() : o;
  }
  function p() {
    s && clearTimeout(s);
    s = a(c, e);
    i && r === void 0 && (r = a(c, i));
    return o;
  }
  p.cancel = u;
  p.flush = l;
  return p;
}
function Ma(t) {
  const e = {};
  try {
    t.forEach((t, n) => {
      typeof t === "string" && (e[n] = t);
    });
  } catch {}
  return e;
}
function Ra(t) {
  const e = Object.create(null);
  try {
    Object.entries(t).forEach(([t, n]) => {
      typeof n === "string" && (e[t] = n);
    });
  } catch {}
  return e;
}
function Da(t) {
  const e = Ma(t.headers);
  return { method: t.method, url: t.url, query_string: Va(t.url), headers: e };
}
function Fa(t) {
  const e = t.headers || {};
  const n =
    typeof e["x-forwarded-host"] === "string" ? e["x-forwarded-host"] : void 0;
  const o = n || (typeof e.host === "string" ? e.host : void 0);
  const s =
    typeof e["x-forwarded-proto"] === "string"
      ? e["x-forwarded-proto"]
      : void 0;
  const r = s || t.protocol || (t.socket?.encrypted ? "https" : "http");
  const i = t.url || "";
  const a = La({ url: i, host: o, protocol: r });
  const c = t.body || void 0;
  const u = t.cookies;
  return {
    url: a,
    method: t.method,
    query_string: Va(i),
    headers: Ra(e),
    cookies: u,
    data: c,
  };
}
function La({ url: t, protocol: e, host: n }) {
  return t?.startsWith("http") ? t : t && n ? `${e}://${n}${t}` : void 0;
}
const Ua = [
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
const qa = ["x-forwarded-", "-user"];
function Ja(t, e = false) {
  const n = {};
  try {
    Object.entries(t).forEach(([t, o]) => {
      if (o == null) return;
      const s = t.toLowerCase();
      const r = s === "cookie" || s === "set-cookie";
      if (r && typeof o === "string" && o !== "") {
        const t = s === "set-cookie";
        const r = o.indexOf(";");
        const i = t && r !== -1 ? o.substring(0, r) : o;
        const a = t ? [i] : i.split("; ");
        for (const t of a) {
          const o = t.indexOf("=");
          const r = o !== -1 ? t.substring(0, o) : t;
          const i = o !== -1 ? t.substring(o + 1) : "";
          const a = r.toLowerCase();
          Ba(n, s, a, i, e);
        }
      } else Ba(n, s, "", o, e);
    });
  } catch {}
  return n;
}
function za(t) {
  return t.replace(/-/g, "_");
}
function Ba(t, e, n, o, s) {
  const r = n
    ? `http.request.header.${za(e)}.${za(n)}`
    : `http.request.header.${za(e)}`;
  const i = Wa(n || e, o, s);
  i !== void 0 && (t[r] = i);
}
function Wa(t, e, n) {
  const o = n
    ? Ua.some((e) => t.includes(e))
    : [...qa, ...Ua].some((e) => t.includes(e));
  return o
    ? "[Filtered]"
    : Array.isArray(e)
      ? e.map((t) => (t != null ? String(t) : t)).join(";")
      : typeof e === "string"
        ? e
        : void 0;
}
function Va(t) {
  if (t)
    try {
      const e = new URL(t, "http://s.io").search.slice(1);
      return e.length ? e : void 0;
    } catch {
      return;
    }
}
const Ka = 100;
function Ga(t, e) {
  const n = we();
  const o = be();
  if (!n) return;
  const { beforeBreadcrumb: s = null, maxBreadcrumbs: r = Ka } = n.getOptions();
  if (r <= 0) return;
  const i = Wt();
  const a = { timestamp: i, ...t };
  const c = s ? u(() => s(a, e)) : a;
  if (c !== null) {
    n.emit && n.emit("beforeAddBreadcrumb", c, e);
    o.addBreadcrumb(c, r);
  }
}
let Ha;
const Za = "FunctionToString";
const Ya = new WeakMap();
const Xa = () => ({
  name: Za,
  setupOnce() {
    Ha = Function.prototype.toString;
    try {
      Function.prototype.toString = function (...t) {
        const e = ht(this);
        const n = Ya.has(we()) && e !== void 0 ? e : this;
        return Ha.apply(n, t);
      };
    } catch {}
  },
  setup(t) {
    Ya.set(t, true);
  },
});
const Qa = Cr(Xa);
const tc = [
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
const ec = "EventFilters";
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
 */ const nc = Cr((t = {}) => {
  let e;
  return {
    name: ec,
    setup(n) {
      const o = n.getOptions();
      e = sc(t, o);
    },
    processEvent(n, o, s) {
      if (!e) {
        const n = s.getOptions();
        e = sc(t, n);
      }
      return rc(n, e) ? null : n;
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
 */ const oc = Cr((t = {}) => ({ ...nc(t), name: "InboundFilters" }));
function sc(t = {}, e = {}) {
  return {
    allowUrls: [...(t.allowUrls || []), ...(e.allowUrls || [])],
    denyUrls: [...(t.denyUrls || []), ...(e.denyUrls || [])],
    ignoreErrors: [
      ...(t.ignoreErrors || []),
      ...(e.ignoreErrors || []),
      ...(t.disableErrorDefaults ? [] : tc),
    ],
    ignoreTransactions: [
      ...(t.ignoreTransactions || []),
      ...(e.ignoreTransactions || []),
    ],
  };
}
function rc(e, n) {
  if (e.type) {
    if (e.type === "transaction" && ac(e, n.ignoreTransactions)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`ignoreTransactions\` option.\nEvent: ${Mt(e)}`,
        );
      return true;
    }
  } else {
    if (ic(e, n.ignoreErrors)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${Mt(e)}`,
        );
      return true;
    }
    if (fc(e)) {
      t &&
        y.warn(
          `Event dropped due to not having an error message, error type or stacktrace.\nEvent: ${Mt(e)}`,
        );
      return true;
    }
    if (cc(e, n.denyUrls)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${Mt(e)}.\nUrl: ${pc(e)}`,
        );
      return true;
    }
    if (!uc(e, n.allowUrls)) {
      t &&
        y.warn(
          `Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${Mt(e)}.\nUrl: ${pc(e)}`,
        );
      return true;
    }
  }
  return false;
}
function ic(t, e) {
  return !!e?.length && _i(t).some((t) => $t(t, e));
}
function ac(t, e) {
  if (!e?.length) return false;
  const n = t.transaction;
  return !!n && $t(n, e);
}
function cc(t, e) {
  if (!e?.length) return false;
  const n = pc(t);
  return !!n && $t(n, e);
}
function uc(t, e) {
  if (!e?.length) return true;
  const n = pc(t);
  return !n || $t(n, e);
}
function lc(t = []) {
  for (let e = t.length - 1; e >= 0; e--) {
    const n = t[e];
    if (n && n.filename !== "<anonymous>" && n.filename !== "[native code]")
      return n.filename || null;
  }
  return null;
}
function pc(e) {
  try {
    const t = [...(e.exception?.values ?? [])]
      .reverse()
      .find(
        (t) =>
          t.mechanism?.parent_id === void 0 && t.stacktrace?.frames?.length,
      );
    const n = t?.stacktrace?.frames;
    return n ? lc(n) : null;
  } catch {
    t && y.error(`Cannot extract url for event ${Mt(e)}`);
    return null;
  }
}
function fc(t) {
  return (
    !!t.exception?.values?.length &&
    !t.message &&
    !t.exception.values.some(
      (t) => t.stacktrace || (t.type && t.type !== "Error") || t.value,
    )
  );
}
function dc(t, e, n, o, s, r) {
  if (!s.exception?.values || !r || !st(r.originalException, Error)) return;
  const i =
    s.exception.values.length > 0
      ? s.exception.values[s.exception.values.length - 1]
      : void 0;
  i &&
    (s.exception.values = mc(
      t,
      e,
      o,
      r.originalException,
      n,
      s.exception.values,
      i,
      0,
    ));
}
function mc(t, e, n, o, s, r, i, a) {
  if (r.length >= n + 1) return r;
  let c = [...r];
  if (st(o[s], Error)) {
    gc(i, a);
    const r = t(e, o[s]);
    const u = c.length;
    hc(r, s, u, a);
    c = mc(t, e, n, o[s], s, [r, ...c], r, u);
  }
  Array.isArray(o.errors) &&
    o.errors.forEach((o, r) => {
      if (st(o, Error)) {
        gc(i, a);
        const u = t(e, o);
        const l = c.length;
        hc(u, `errors[${r}]`, l, a);
        c = mc(t, e, n, o, s, [u, ...c], u, l);
      }
    });
  return c;
}
function gc(t, e) {
  t.mechanism = {
    handled: true,
    type: "auto.core.linked_errors",
    ...t.mechanism,
    ...(t.type === "AggregateError" && { is_exception_group: true }),
    exception_id: e,
  };
}
function hc(t, e, n, o) {
  t.mechanism = {
    handled: true,
    ...t.mechanism,
    type: "chained",
    source: e,
    exception_id: n,
    parent_id: o,
  };
}
const _c = "cause";
const yc = 5;
const bc = "LinkedErrors";
const vc = (t = {}) => {
  const e = t.limit || yc;
  const n = t.key || _c;
  return {
    name: bc,
    preprocessEvent(t, o, s) {
      const r = s.getOptions();
      dc(zi, r.stackParser, n, e, t, o);
    },
  };
};
const Sc = Cr(vc);
const kc = new Map();
const wc = new Set();
function xc(t) {
  if (e._sentryModuleMetadata)
    for (const n of Object.keys(e._sentryModuleMetadata)) {
      const o = e._sentryModuleMetadata[n];
      if (wc.has(n)) continue;
      wc.add(n);
      const s = t(n);
      for (const t of s.reverse())
        if (t.filename) {
          kc.set(t.filename, o);
          break;
        }
    }
}
function Ec(t, e) {
  xc(t);
  return kc.get(e);
}
function Ac(t, e) {
  e.exception?.values?.forEach((e) => {
    e.stacktrace?.frames?.forEach((e) => {
      if (!e.filename || e.module_metadata) return;
      const n = Ec(t, e.filename);
      n && (e.module_metadata = n);
    });
  });
}
function Tc(t) {
  t.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((t) => {
      delete t.module_metadata;
    });
  });
}
const Ic = Cr(() => ({
  name: "ModuleMetadata",
  setup(t) {
    t.on("beforeEnvelope", (t) => {
      ko(t, (t, e) => {
        if (e === "event") {
          const e = Array.isArray(t) ? t[1] : void 0;
          if (e) {
            Tc(e);
            t[1] = e;
          }
        }
      });
    });
    t.on("applyFrameMetadata", (e) => {
      if (e.type) return;
      const n = t.getOptions().stackParser;
      Ac(n, e);
    });
  },
}));
function $c(t) {
  const e = {};
  let n = 0;
  while (n < t.length) {
    const o = t.indexOf("=", n);
    if (o === -1) break;
    let s = t.indexOf(";", n);
    if (s === -1) s = t.length;
    else if (s < o) {
      n = t.lastIndexOf(";", o - 1) + 1;
      continue;
    }
    const r = t.slice(n, o).trim();
    if (void 0 === e[r]) {
      let n = t.slice(o + 1, s).trim();
      n.charCodeAt(0) === 34 && (n = n.slice(1, -1));
      try {
        e[r] = n.indexOf("%") !== -1 ? decodeURIComponent(n) : n;
      } catch {
        e[r] = n;
      }
    }
    n = s + 1;
  }
  return e;
}
const Oc = [
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
function Cc(t) {
  const e = Oc.map((e) => {
    const n = t[e];
    const o = Array.isArray(n) ? n.join(";") : n;
    return e === "Forwarded" ? jc(o) : o?.split(",").map((t) => t.trim());
  });
  const n = e.reduce((t, e) => (e ? t.concat(e) : t), []);
  const o = n.find((t) => t !== null && Nc(t));
  return o || null;
}
function jc(t) {
  if (!t) return null;
  for (const e of t.split(";")) if (e.startsWith("for=")) return e.slice(4);
  return null;
}
function Nc(t) {
  const e =
    /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/;
  return e.test(t);
}
const Pc = {
  cookies: true,
  data: true,
  headers: true,
  query_string: true,
  url: true,
};
const Mc = "RequestData";
const Rc = (t = {}) => {
  const e = { ...Pc, ...t.include };
  return {
    name: Mc,
    processEvent(t, n, o) {
      const { sdkProcessingMetadata: s = {} } = t;
      const { normalizedRequest: r, ipAddress: i } = s;
      const a = { ...e, ip: e.ip ?? o.getOptions().sendDefaultPii };
      r && Fc(t, r, { ipAddress: i }, a);
      return t;
    },
  };
};
const Dc = Cr(Rc);
function Fc(t, e, n, o) {
  t.request = { ...t.request, ...Lc(e, o) };
  if (o.ip) {
    const o = (e.headers && Cc(e.headers)) || n.ipAddress;
    o && (t.user = { ...t.user, ip_address: o });
  }
}
function Lc(t, e) {
  const n = {};
  const o = { ...t.headers };
  if (e.headers) {
    n.headers = o;
    e.cookies || delete o.cookie;
    e.ip ||
      Oc.forEach((t) => {
        delete o[t];
      });
  }
  n.method = t.method;
  e.url && (n.url = t.url);
  if (e.cookies) {
    const e = t.cookies || (o?.cookie ? $c(o.cookie) : void 0);
    n.cookies = e || {};
  }
  e.query_string && (n.query_string = t.query_string);
  e.data && (n.data = t.data);
  return n;
}
function Uc(t) {
  const e = "console";
  N(e, t);
  M(e, qc);
}
function qc() {
  "console" in e &&
    i.forEach(function (t) {
      t in e.console &&
        dt(e.console, t, function (n) {
          c[t] = n;
          return function (...n) {
            const o = { args: n, level: t };
            R("console", o);
            const s = c[t];
            s?.apply(e.console, n);
          };
        });
    });
}
/**
 * Converts a string-based level into a `SeverityLevel`, normalizing it along the way.
 *
 * @param level String representation of desired `SeverityLevel`.
 * @returns The `SeverityLevel` corresponding to the given string, or 'log' if the string isn't a valid level.
 */ function Jc(t) {
  return t === "warn"
    ? "warning"
    : ["fatal", "error", "warning", "log", "info", "debug"].includes(t)
      ? t
      : "log";
}
const zc = "CaptureConsole";
const Bc = (t = {}) => {
  const n = t.levels || i;
  const o = t.handled ?? true;
  return {
    name: zc,
    setup(t) {
      "console" in e &&
        Uc(({ args: e, level: s }) => {
          we() === t && n.includes(s) && Vc(e, s, o);
        });
    },
  };
};
const Wc = Cr(Bc);
function Vc(t, e, n) {
  const o = Jc(e);
  const s = new Error();
  const r = { level: Jc(e), extra: { arguments: t } };
  Se((i) => {
    i.addEventProcessor((t) => {
      t.logger = "console";
      Dt(t, { handled: n, type: "auto.core.capture_console" });
      return t;
    });
    if (e === "assert") {
      if (!t[0]) {
        const e = `Assertion failed: ${Tt(t.slice(1), " ") || "console.assert"}`;
        i.setExtra("arguments", t.slice(1));
        i.captureMessage(e, o, { captureContext: r, syntheticException: s });
      }
      return;
    }
    const a = t.find((t) => t instanceof Error);
    if (a) {
      Ys(a, r);
      return;
    }
    const c = Tt(t, " ");
    i.captureMessage(c, o, { captureContext: r, syntheticException: s });
  });
}
const Kc = "Dedupe";
const Gc = () => {
  let e;
  return {
    name: Kc,
    processEvent(n) {
      if (n.type) return n;
      try {
        if (Zc(n, e)) {
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
const Hc = Cr(Gc);
function Zc(t, e) {
  return !!e && (!!Yc(t, e) || !!Xc(t, e));
}
function Yc(t, e) {
  const n = t.message;
  const o = e.message;
  return (
    !(!n && !o) &&
    !((n && !o) || (!n && o)) &&
    n === o &&
    !!tu(t, e) &&
    !!Qc(t, e)
  );
}
function Xc(t, e) {
  const n = eu(e);
  const o = eu(t);
  return (
    !(!n || !o) &&
    n.type === o.type &&
    n.value === o.value &&
    !!tu(t, e) &&
    !!Qc(t, e)
  );
}
function Qc(t, e) {
  let n = $(t);
  let o = $(e);
  if (!n && !o) return true;
  if ((n && !o) || (!n && o)) return false;
  n;
  o;
  if (o.length !== n.length) return false;
  for (let t = 0; t < o.length; t++) {
    const e = o[t];
    const s = n[t];
    if (
      e.filename !== s.filename ||
      e.lineno !== s.lineno ||
      e.colno !== s.colno ||
      e.function !== s.function
    )
      return false;
  }
  return true;
}
function tu(t, e) {
  let n = t.fingerprint;
  let o = e.fingerprint;
  if (!n && !o) return true;
  if ((n && !o) || (!n && o)) return false;
  n;
  o;
  try {
    return !!(n.join("") === o.join(""));
  } catch {
    return false;
  }
}
function eu(t) {
  return t.exception?.values?.[0];
}
const nu = "ExtraErrorData";
const ou = (t = {}) => {
  const { depth: e = 3, captureErrorCause: n = true } = t;
  return {
    name: nu,
    processEvent(t, o, s) {
      const { maxValueLength: r } = s.getOptions();
      return ru(t, o, e, n, r);
    },
  };
};
const su = Cr(ou);
function ru(t, e = {}, n, o, s) {
  if (!e.originalException || !B(e.originalException)) return t;
  const r = e.originalException.name || e.originalException.constructor.name;
  const i = iu(e.originalException, o, s);
  if (i) {
    const e = { ...t.contexts };
    const o = lo(i, n);
    if (X(o)) {
      mt(o, "__sentry_skip_normalization__", true);
      e[r] = o;
    }
    return { ...t, contexts: e };
  }
  return t;
}
function iu(e, n, o) {
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
    const s = {};
    for (const n of Object.keys(e)) {
      if (t.indexOf(n) !== -1) continue;
      const r = e[n];
      s[n] = B(r) || typeof r === "string" ? (o ? Et(`${r}`, o) : `${r}`) : r;
    }
    if (n && e.cause !== void 0)
      if (B(e.cause)) {
        const t = e.cause.name || e.cause.constructor.name;
        s.cause = { [t]: iu(e.cause, false, o) };
      } else s.cause = e.cause;
    if (typeof e.toJSON === "function") {
      const t = e.toJSON();
      for (const e of Object.keys(t)) {
        const n = t[e];
        s[e] = B(n) ? n.toString() : n;
      }
    }
    return s;
  } catch (e) {
    t && y.error("Unable to extract extra data from the Error object:", e);
  }
  return null;
}
function au(t, e) {
  let n = 0;
  for (let e = t.length - 1; e >= 0; e--) {
    const o = t[e];
    if (o === ".") t.splice(e, 1);
    else if (o === "..") {
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
const cu =
  /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
function uu(t) {
  const e = t.length > 1024 ? `<truncated>${t.slice(-1024)}` : t;
  const n = cu.exec(e);
  return n ? n.slice(1) : [];
}
function lu(...t) {
  let e = "";
  let n = false;
  for (let o = t.length - 1; o >= -1 && !n; o--) {
    const s = o >= 0 ? t[o] : "/";
    if (s) {
      e = `${s}/${e}`;
      n = s.charAt(0) === "/";
    }
  }
  e = au(
    e.split("/").filter((t) => !!t),
    !n,
  ).join("/");
  return (n ? "/" : "") + e || ".";
}
function pu(t) {
  let e = 0;
  for (; e < t.length; e++) if (t[e] !== "") break;
  let n = t.length - 1;
  for (; n >= 0; n--) if (t[n] !== "") break;
  return e > n ? [] : t.slice(e, n - e + 1);
}
function fu(t, e) {
  t = lu(t).slice(1);
  e = lu(e).slice(1);
  const n = pu(t.split("/"));
  const o = pu(e.split("/"));
  const s = Math.min(n.length, o.length);
  let r = s;
  for (let t = 0; t < s; t++)
    if (n[t] !== o[t]) {
      r = t;
      break;
    }
  let i = [];
  for (let t = r; t < n.length; t++) i.push("..");
  i = i.concat(o.slice(r));
  return i.join("/");
}
function du(t) {
  const e = mu(t);
  const n = t.slice(-1) === "/";
  let o = au(
    t.split("/").filter((t) => !!t),
    !e,
  ).join("/");
  o || e || (o = ".");
  o && n && (o += "/");
  return (e ? "/" : "") + o;
}
function mu(t) {
  return t.charAt(0) === "/";
}
function gu(...t) {
  return du(t.join("/"));
}
function hu(t) {
  const e = uu(t);
  const n = e[0] || "";
  let o = e[1];
  if (!n && !o) return ".";
  o && (o = o.slice(0, o.length - 1));
  return n + o;
}
function _u(t, e) {
  let n = uu(t)[2] || "";
  e && n.slice(e.length * -1) === e && (n = n.slice(0, n.length - e.length));
  return n;
}
const yu = "RewriteFrames";
const bu = Cr((t = {}) => {
  const n = t.root;
  const o = t.prefix || "app:///";
  const s = "window" in e && !!e.window;
  const r = t.iteratee || vu({ isBrowser: s, root: n, prefix: o });
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
    name: yu,
    processEvent(t) {
      let e = t;
      t.exception && Array.isArray(t.exception.values) && (e = i(e));
      return e;
    },
  };
});
function vu({ isBrowser: t, root: e, prefix: n }) {
  return (o) => {
    if (!o.filename) return o;
    const s =
      /^[a-zA-Z]:\\/.test(o.filename) ||
      (o.filename.includes("\\") && !o.filename.includes("/"));
    const r = /^\//.test(o.filename);
    if (t) {
      if (e) {
        const t = o.filename;
        t.indexOf(e) === 0 && (o.filename = t.replace(e, n));
      }
    } else if (s || r) {
      const t = s
        ? o.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/")
        : o.filename;
      const r = e ? fu(e, t) : _u(t);
      o.filename = `${n}${r}`;
    }
    return o;
  };
}
const Su = [
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
const ku = [
  "createUser",
  "deleteUser",
  "listUsers",
  "getUserById",
  "updateUserById",
  "inviteUserByEmail",
];
const wu = {
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
const xu = ["select", "insert", "upsert", "update", "delete"];
function Eu(t) {
  try {
    t.__SENTRY_INSTRUMENTED__ = true;
  } catch {}
}
function Au(t) {
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
 */ function Tu(t, e = {}) {
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
 */ function Iu(t, e) {
  if (e === "" || e === "*") return "select(*)";
  if (t === "select") return `select(${e})`;
  if (t === "or" || t.endsWith(".or")) return `${t}${e}`;
  const [n, ...o] = e.split(".");
  let s;
  s = n?.startsWith("fts")
    ? "textSearch"
    : n?.startsWith("plfts")
      ? "textSearch[plain]"
      : n?.startsWith("phfts")
        ? "textSearch[phrase]"
        : n?.startsWith("wfts")
          ? "textSearch[websearch]"
          : (n && wu[n]) || "filter";
  return `${s}(${t}, ${o.join(".")})`;
}
function $u(t, e = false) {
  return new Proxy(t, {
    apply(n, o, s) {
      return Xo(
        {
          name: `auth ${e ? "(admin) " : ""}${t.name}`,
          attributes: {
            [$e]: "auto.db.supabase",
            [Ie]: "db",
            "db.system": "postgresql",
            "db.operation": `auth.${e ? "admin." : ""}${t.name}`,
          },
        },
        (t) =>
          Reflect.apply(n, o, s)
            .then((e) => {
              if (e && typeof e === "object" && "error" in e && e.error) {
                t.setStatus({ code: Be });
                Ys(e.error, {
                  mechanism: { handled: false, type: "auto.db.supabase.auth" },
                });
              } else t.setStatus({ code: ze });
              t.end();
              return e;
            })
            .catch((e) => {
              t.setStatus({ code: Be });
              t.end();
              Ys(e, {
                mechanism: { handled: false, type: "auto.db.supabase.auth" },
              });
              throw e;
            })
            .then(...s),
      );
    },
  });
}
function Ou(t) {
  const e = t.auth;
  if (e && !Au(t.auth)) {
    for (const n of Su) {
      const o = e[n];
      o && typeof t.auth[n] === "function" && (t.auth[n] = $u(o));
    }
    for (const n of ku) {
      const o = e.admin[n];
      o &&
        typeof t.auth.admin[n] === "function" &&
        (t.auth.admin[n] = $u(o, true));
    }
    Eu(t.auth);
  }
}
function Cu(t) {
  if (!Au(t.prototype.from)) {
    t.prototype.from = new Proxy(t.prototype.from, {
      apply(t, e, n) {
        const o = Reflect.apply(t, e, n);
        const s = o.constructor;
        Nu(s);
        return o;
      },
    });
    Eu(t.prototype.from);
  }
}
function ju(t) {
  if (!Au(t.prototype.then)) {
    t.prototype.then = new Proxy(t.prototype.then, {
      apply(t, e, n) {
        const o = xu;
        const s = e;
        const r = Tu(s.method, s.headers);
        if (!o.includes(r)) return Reflect.apply(t, e, n);
        if (!s?.url?.pathname || typeof s.url.pathname !== "string")
          return Reflect.apply(t, e, n);
        const i = s.url.pathname.split("/");
        const a = i.length > 0 ? i[i.length - 1] : "";
        const c = [];
        for (const [t, e] of s.url.searchParams.entries()) c.push(Iu(t, e));
        const u = Object.create(null);
        if (X(s.body)) for (const [t, e] of Object.entries(s.body)) u[t] = e;
        const l = `${r === "select" ? "" : `${r}${u ? "(...) " : ""}`}${c.join(" ")} from(${a})`;
        const p = {
          "db.table": a,
          "db.schema": s.schema,
          "db.url": s.url.origin,
          "db.sdk": s.headers["X-Client-Info"],
          "db.system": "postgresql",
          "db.operation": r,
          [$e]: "auto.db.supabase",
          [Ie]: "db",
        };
        c.length && (p["db.query"] = c);
        Object.keys(u).length && (p["db.body"] = u);
        return Xo({ name: l, attributes: p }, (o) =>
          Reflect.apply(t, e, [])
            .then(
              (t) => {
                if (o) {
                  t &&
                    typeof t === "object" &&
                    "status" in t &&
                    Ve(o, t.status || 500);
                  o.end();
                }
                if (t.error) {
                  const e = new Error(t.error.message);
                  t.error.code && (e.code = t.error.code);
                  t.error.details && (e.details = t.error.details);
                  const n = {};
                  c.length && (n.query = c);
                  Object.keys(u).length && (n.body = u);
                  Ys(e, (t) => {
                    t.addEventProcessor((t) => {
                      Dt(t, {
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
                Ga(e);
                return t;
              },
              (t) => {
                if (o) {
                  Ve(o, 500);
                  o.end();
                }
                throw t;
              },
            )
            .then(...n),
        );
      },
    });
    Eu(t.prototype.then);
  }
}
function Nu(e) {
  for (const n of xu)
    if (!Au(e.prototype[n])) {
      e.prototype[n] = new Proxy(e.prototype[n], {
        apply(e, o, s) {
          const r = Reflect.apply(e, o, s);
          const i = r.constructor;
          t && y.log(`Instrumenting ${n} operation's PostgRESTFilterBuilder`);
          ju(i);
          return r;
        },
      });
      Eu(e.prototype[n]);
    }
}
const Pu = (e) => {
  if (!e) {
    t &&
      y.warn(
        "Supabase integration was not installed because no Supabase client was provided.",
      );
    return;
  }
  const n = e.constructor === Function ? e : e.constructor;
  Cu(n);
  Ou(e);
};
const Mu = "Supabase";
const Ru = (t) => ({
  setupOnce() {
    Pu(t);
  },
  name: Mu,
});
const Du = Cr((t) => Ru(t.supabaseClient));
const Fu = 10;
const Lu = "ZodErrors";
function Uu(t) {
  return B(t) && t.name === "ZodError" && Array.isArray(t.issues);
}
function qu(t) {
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
 */ function Ju(t) {
  return t.map((t) => (typeof t === "number" ? "<array>" : t)).join(".");
}
function zu(t) {
  const e = new Set();
  for (const n of t.issues) {
    const t = Ju(n.path);
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
  return `Failed to validate keys: ${Et(n.join(", "), 100)}`;
}
function Bu(t, e = false, n, o) {
  if (
    !n.exception?.values ||
    !o.originalException ||
    !Uu(o.originalException) ||
    o.originalException.issues.length === 0
  )
    return n;
  try {
    const s = e
      ? o.originalException.issues
      : o.originalException.issues.slice(0, t);
    const r = s.map(qu);
    if (e) {
      Array.isArray(o.attachments) || (o.attachments = []);
      o.attachments.push({
        filename: "zod_issues.json",
        data: JSON.stringify({ issues: r }),
      });
    }
    return {
      ...n,
      exception: {
        ...n.exception,
        values: [
          { ...n.exception.values[0], value: zu(o.originalException) },
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
const Wu = (t = {}) => {
  const e = t.limit ?? Fu;
  return {
    name: Lu,
    processEvent(n, o) {
      const s = Bu(e, t.saveZodIssuesAsAttachment, n, o);
      return s;
    },
  };
};
const Vu = Cr(Wu);
const Ku = Cr((t) => ({
  name: "ThirdPartyErrorsFilter",
  setup(t) {
    t.on("beforeEnvelope", (t) => {
      ko(t, (t, e) => {
        if (e === "event") {
          const e = Array.isArray(t) ? t[1] : void 0;
          if (e) {
            Tc(e);
            t[1] = e;
          }
        }
      });
    });
    t.on("applyFrameMetadata", (e) => {
      if (e.type) return;
      const n = t.getOptions().stackParser;
      Ac(n, e);
    });
  },
  processEvent(e) {
    const n = Gu(e);
    if (n) {
      const o =
        t.behaviour === "drop-error-if-contains-third-party-frames" ||
        t.behaviour === "apply-tag-if-contains-third-party-frames"
          ? "some"
          : "every";
      const s = n[o]((e) => !e.some((e) => t.filterKeys.includes(e)));
      if (s) {
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
function Gu(t) {
  const e = $(t);
  if (e)
    return e
      .filter((t) => !!t.filename && (t.lineno ?? t.colno) != null)
      .map((t) =>
        t.module_metadata
          ? Object.keys(t.module_metadata)
              .filter((t) => t.startsWith(Hu))
              .map((t) => t.slice(Hu.length))
          : [],
      );
}
const Hu = "_sentryBundlerPluginAppKey:";
const Zu = "Console";
const Yu = Cr((t = {}) => {
  const e = new Set(t.levels || i);
  return {
    name: Zu,
    setup(t) {
      Uc(({ args: n, level: o }) => {
        we() === t && e.has(o) && Xu(o, n);
      });
    },
  };
});
function Xu(t, e) {
  const n = {
    category: "console",
    data: { arguments: e, logger: "console" },
    level: Jc(t),
    message: Qu(e),
  };
  if (t === "assert") {
    if (e[0] !== false) return;
    {
      const t = e.slice(1);
      n.message =
        t.length > 0 ? `Assertion failed: ${Qu(t)}` : "Assertion failed";
      n.data.arguments = t;
    }
  }
  Ga(n, { input: e, level: t });
}
function Qu(t) {
  return "util" in e && typeof e.util.format === "function"
    ? e.util.format(...t)
    : Tt(t, " ");
}
const tl = 100;
const el = 10;
const nl = "flag.evaluation.";
function ol(t) {
  const e = ye();
  const n = e.getScopeData().contexts.flags;
  const o = n ? n.values : [];
  if (!o.length) return t;
  t.contexts === void 0 && (t.contexts = {});
  t.contexts.flags = { values: [...o] };
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
 */ function sl(t, e, n = tl) {
  const o = ye().getScopeData().contexts;
  o.flags || (o.flags = { values: [] });
  const s = o.flags.values;
  rl(s, t, e, n);
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
 */ function rl(e, n, o, s) {
  if (typeof o !== "boolean") return;
  if (e.length > s) {
    t &&
      y.error(
        `[Feature Flags] insertToFlagBuffer called on a buffer larger than maxSize=${s}`,
      );
    return;
  }
  const r = e.findIndex((t) => t.flag === n);
  r !== -1 && e.splice(r, 1);
  e.length === s && e.shift();
  e.push({ flag: n, result: o });
}
/**
 * Records a feature flag evaluation for the active span. This is a no-op for non-boolean values.
 * The flag and its value is stored in span attributes with the `flag.evaluation` prefix. Once the
 * unique flags for a span reaches maxFlagsPerSpan, subsequent flags are dropped.
 *
 * @param name             Name of the feature flag.
 * @param value            Value of the feature flag. Non-boolean values are ignored.
 * @param maxFlagsPerSpan  Max number of flags a buffer should store. Default value should always be used in production.
 */ function il(t, e, n = el) {
  if (typeof e !== "boolean") return;
  const o = Kn();
  if (!o) return;
  const s = Rn(o).data;
  if (`${nl}${t}` in s) {
    o.setAttribute(`${nl}${t}`, e);
    return;
  }
  const r = Object.keys(s).filter((t) => t.startsWith(nl)).length;
  r < n && o.setAttribute(`${nl}${t}`, e);
}
const al = Cr(() => ({
  name: "FeatureFlags",
  processEvent(t, e, n) {
    return ol(t);
  },
  addFeatureFlag(t, e) {
    sl(t, e);
    il(t, e);
  },
}));
const cl = Cr(({ growthbookClass: t }) => ({
  name: "GrowthBook",
  setupOnce() {
    const e = t.prototype;
    typeof e.isOn === "function" && dt(e, "isOn", ul);
    typeof e.getFeatureValue === "function" && dt(e, "getFeatureValue", ul);
  },
  processEvent(t, e, n) {
    return ol(t);
  },
}));
function ul(t) {
  return function (...e) {
    const n = e[0];
    const o = t.apply(this, e);
    if (typeof n === "string" && typeof o === "boolean") {
      sl(n, o);
      il(n, o);
    }
    return o;
  };
}
function ll(t) {
  return (
    !!t &&
    typeof t._profiler !== "undefined" &&
    typeof t._profiler.start === "function" &&
    typeof t._profiler.stop === "function"
  );
}
function pl() {
  const e = we();
  if (!e) {
    t && y.warn("No Sentry client available, profiling is not started");
    return;
  }
  const n = e.getIntegrationByName("ProfilingIntegration");
  n
    ? ll(n)
      ? n._profiler.start()
      : t && y.warn("Profiler is not available on profiling integration.")
    : t && y.warn("ProfilingIntegration is not available");
}
function fl() {
  const e = we();
  if (!e) {
    t && y.warn("No Sentry client available, profiling is not started");
    return;
  }
  const n = e.getIntegrationByName("ProfilingIntegration");
  n
    ? ll(n)
      ? n._profiler.stop()
      : t && y.warn("Profiler is not available on profiling integration.")
    : t && y.warn("ProfilingIntegration is not available");
}
const dl = { startProfiler: pl, stopProfiler: fl };
/**
 * Create and track fetch request spans for usage in combination with `addFetchInstrumentationHandler`.
 *
 * @returns Span if a span was created, otherwise void.
 */ function ml(t, e, n, o, s) {
  if (!t.fetchData) return;
  const { method: r, url: i } = t.fetchData;
  const a = Xn() && e(i);
  if (t.endTimestamp && a) {
    const e = t.fetchData.__span;
    if (!e) return;
    const n = o[e];
    if (n) {
      _l(n, t);
      gl(n, t, s);
      delete o[e];
    }
    return;
  }
  const {
    spanOrigin: c = "auto.http.browser",
    propagateTraceparent: u = false,
  } = typeof s === "object" ? s : { spanOrigin: s };
  const l = !!Kn();
  const p = a && l ? ts(vl(i, r, c)) : new SentryNonRecordingSpan();
  t.fetchData.__span = p.spanContext().spanId;
  o[p.spanContext().spanId] = p;
  if (n(t.fetchData.url)) {
    const e = t.args[0];
    const n = t.args[1] || {};
    const o = hl(e, n, Xn() && l ? p : void 0, u);
    if (o) {
      t.args[1] = n;
      n.headers = o;
    }
  }
  const f = we();
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
function gl(t, e, n) {
  const o = typeof n === "object" && n !== null ? n.onRequestSpanEnd : void 0;
  o?.(t, { headers: e.response?.headers, error: e.error });
}
function hl(t, e, n, o) {
  const s = Oa({ span: n, propagateTraceparent: o });
  const r = s["sentry-trace"];
  const i = s.baggage;
  const a = s.traceparent;
  if (!r) return;
  const c = e.headers || (it(t) ? t.headers : void 0);
  if (c) {
    if (bl(c)) {
      const t = new Headers(c);
      t.get("sentry-trace") || t.set("sentry-trace", r);
      o && a && !t.get("traceparent") && t.set("traceparent", a);
      if (i) {
        const e = t.get("baggage");
        e ? yl(e) || t.set("baggage", `${e},${i}`) : t.set("baggage", i);
      }
      return t;
    }
    if (Array.isArray(c)) {
      const t = [...c];
      c.find((t) => t[0] === "sentry-trace") || t.push(["sentry-trace", r]);
      o &&
        a &&
        !c.find((t) => t[0] === "traceparent") &&
        t.push(["traceparent", a]);
      const e = c.find((t) => t[0] === "baggage" && yl(t[1]));
      i && !e && t.push(["baggage", i]);
      return t;
    }
    {
      const t = "sentry-trace" in c ? c["sentry-trace"] : void 0;
      const e = "traceparent" in c ? c.traceparent : void 0;
      const n = "baggage" in c ? c.baggage : void 0;
      const s = n ? (Array.isArray(n) ? [...n] : [n]) : [];
      const u = n && (Array.isArray(n) ? n.find((t) => yl(t)) : yl(n));
      i && !u && s.push(i);
      const l = {
        ...c,
        "sentry-trace": t ?? r,
        baggage: s.length > 0 ? s.join(",") : void 0,
      };
      o && a && !e && (l.traceparent = a);
      return l;
    }
  }
  return { ...s };
}
function _l(t, e) {
  if (e.response) {
    Ve(t, e.response.status);
    const n = e.response?.headers?.get("content-length");
    if (n) {
      const e = parseInt(n);
      e > 0 && t.setAttribute("http.response_content_length", e);
    }
  } else e.error && t.setStatus({ code: Be, message: "internal_error" });
  t.end();
}
function yl(t) {
  return t.split(",").some((t) => t.trim().startsWith(Qe));
}
function bl(t) {
  return typeof Headers !== "undefined" && st(t, Headers);
}
function vl(t, e, n) {
  const o = ma(t);
  return { name: o ? `${e} ${ga(o)}` : e, attributes: Sl(t, o, e, n) };
}
function Sl(t, e, n, o) {
  const s = {
    url: t,
    type: "fetch",
    "http.method": n,
    [$e]: o,
    [Ie]: "http.client",
  };
  if (e) {
    if (!da(e)) {
      s["http.url"] = e.href;
      s["server.address"] = e.host;
    }
    e.search && (s["http.query"] = e.search);
    e.hash && (s["http.fragment"] = e.hash);
  }
  return s;
}
const kl = { mechanism: { handled: false, type: "auto.rpc.trpc.middleware" } };
function wl(t) {
  typeof t === "object" &&
    t !== null &&
    "ok" in t &&
    !t.ok &&
    "error" in t &&
    Ys(t.error, kl);
}
function xl(t = {}) {
  return async function (e) {
    const { path: n, type: o, next: s, rawInput: r, getRawInput: i } = e;
    const a = we();
    const c = a?.getOptions();
    const u = { procedure_path: n, procedure_type: o };
    mt(
      u,
      "__sentry_override_normalization_depth__",
      1 + (c?.normalizeDepth ?? 5),
    );
    if (t.attachRpcInput !== void 0 ? t.attachRpcInput : c?.sendDefaultPii) {
      r !== void 0 && (u.input = lo(r));
      if (i !== void 0 && typeof i === "function")
        try {
          const t = await i();
          u.input = lo(t);
        } catch {}
    }
    return ke((e) => {
      e.setContext("trpc", u);
      return Qo(
        {
          name: `trpc/${n}`,
          op: "rpc.server",
          attributes: { [Ee]: "route", [$e]: "auto.rpc.trpc" },
          forceTransaction: !!t.forceTransaction,
        },
        async (t) => {
          try {
            const e = await s();
            wl(e);
            t.end();
            return e;
          } catch (e) {
            Ys(e, kl);
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
 */ function El(t, e, n) {
  try {
    const o = we();
    if (!o) return;
    const s = Kn();
    s?.isRecording() && s.setStatus({ code: Be, message: "internal_error" });
    Ys(t, {
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
 */ function Al(t, e) {
  dt(
    t,
    e,
    (t) =>
      function (n, ...o) {
        const s = o[o.length - 1];
        if (typeof s !== "function") return t.call(this, n, ...o);
        const r = Tl(s, e, n);
        return t.call(this, n, ...o.slice(0, -1), r);
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
 */ function Tl(e, n, o) {
  return function (...s) {
    try {
      return Il.call(this, e, n, o, s);
    } catch (n) {
      t && y.warn("MCP handler wrapping failed:", n);
      return e.apply(this, s);
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
 */ function Il(t, e, n, o) {
  try {
    const s = t.apply(this, o);
    return s && typeof s === "object" && typeof s.then === "function"
      ? Promise.resolve(s).catch((t) => {
          $l(t, e, n);
          throw t;
        })
      : s;
  } catch (t) {
    $l(t, e, n);
    throw t;
  }
}
/**
 * Captures handler execution errors based on handler type
 * @internal
 * @param error - Error to capture
 * @param methodName - MCP method name
 * @param handlerName - Handler identifier
 */ function $l(t, e, n) {
  try {
    const o = {};
    if (e === "tool") {
      o.tool_name = n;
      t.name === "ProtocolValidationError" ||
      t.message.includes("validation") ||
      t.message.includes("protocol")
        ? El(t, "validation", o)
        : t.name === "ServerTimeoutError" ||
            t.message.includes("timed out") ||
            t.message.includes("timeout")
          ? El(t, "timeout", o)
          : El(t, "tool_execution", o);
    } else if (e === "resource") {
      o.resource_uri = n;
      El(t, "resource_execution", o);
    } else if (e === "prompt") {
      o.prompt_name = n;
      El(t, "prompt_execution", o);
    }
  } catch (t) {}
}
/**
 * Wraps tool handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function Ol(t) {
  Al(t, "tool");
}
/**
 * Wraps resource handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function Cl(t) {
  Al(t, "resource");
}
/**
 * Wraps prompt handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function jl(t) {
  Al(t, "prompt");
}
/**
 * Wraps all MCP handler types (tool, resource, prompt) for span correlation
 * @param serverInstance - MCP server instance
 */ function Nl(t) {
  Ol(t);
  Cl(t);
  jl(t);
}
const Pl = "mcp.method.name";
const Ml = "mcp.request.id";
const Rl = "mcp.session.id";
const Dl = "mcp.transport";
const Fl = "mcp.server.name";
const Ll = "mcp.server.title";
const Ul = "mcp.server.version";
const ql = "mcp.protocol.version";
const Jl = "mcp.tool.name";
const zl = "mcp.resource.uri";
const Bl = "mcp.prompt.name";
const Wl = "mcp.tool.result.is_error";
const Vl = "mcp.tool.result.content_count";
const Kl = "mcp.tool.result.content";
const Gl = "mcp.tool.result";
const Hl = "mcp.prompt.result.description";
const Zl = "mcp.prompt.result.message_count";
const Yl = "mcp.prompt.result.message_content";
const Xl = "mcp.prompt.result";
const Ql = "mcp.request.argument";
const tp = "mcp.logging.level";
const ep = "mcp.logging.logger";
const np = "mcp.logging.data_type";
const op = "mcp.logging.message";
const sp = "network.transport";
const rp = "network.protocol.version";
const ip = "client.address";
const ap = "client.port";
const cp = "mcp.server";
const up = "mcp.notification.client_to_server";
const lp = "mcp.notification.server_to_client";
const pp = "auto.function.mcp_server";
const fp = "auto.mcp.notification";
const dp = "route";
const mp = new Set([ip, ap, op, Hl, Yl, zl, Kl]);
/**
 * Checks if an attribute key should be considered PII.
 *
 * Returns true for:
 * - Explicit PII attributes (client.address, client.port, mcp.logging.message, etc.)
 * - All request arguments (mcp.request.argument.*)
 * - Tool and prompt result content (mcp.tool.result.*, mcp.prompt.result.*) except metadata
 *
 * Preserves metadata attributes ending with _count, _error, or .is_error as they don't contain sensitive data.
 *
 * @param key - Attribute key to evaluate
 * @returns true if the attribute should be filtered out (is PII), false if it should be preserved
 * @internal
 */ function gp(t) {
  return (
    !!mp.has(t) ||
    !!t.startsWith(`${Ql}.`) ||
    !(
      (!t.startsWith(`${Gl}.`) && !t.startsWith(`${Xl}.`)) ||
      t.endsWith("_count") ||
      t.endsWith("_error") ||
      t.endsWith(".is_error")
    )
  );
}
/**
 * Removes PII attributes from span data when sendDefaultPii is false
 * @param spanData - Raw span attributes
 * @param sendDefaultPii - Whether to include PII data
 * @returns Filtered span attributes
 */ function hp(t, e) {
  return e
    ? t
    : Object.entries(t).reduce((t, [e, n]) => {
        gp(e) || (t[e] = n);
        return t;
      }, {});
}
/**
 * Validates if a message is a JSON-RPC request
 * @param message - Message to validate
 * @returns True if message is a JSON-RPC request
 */ function _p(t) {
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
 */ function yp(t) {
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
 */ function bp(t) {
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
 */ function vp(e) {
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
 */ function Sp(t) {
  return t != null && typeof t === "object";
}
/**
 * Build attributes for tool result content items
 * @param content - Array of content items from tool result
 * @returns Attributes extracted from each content item including type, text, mime type, URI, and resource info
 */ function kp(t) {
  const e = { [Vl]: t.length };
  for (const [n, o] of t.entries()) {
    if (!Sp(o)) continue;
    const s = t.length === 1 ? "mcp.tool.result" : `mcp.tool.result.${n}`;
    const r = (t, n) => {
      typeof n === "string" && (e[`${s}.${t}`] = n);
    };
    r("content_type", o.type);
    r("mime_type", o.mimeType);
    r("uri", o.uri);
    r("name", o.name);
    typeof o.text === "string" && (e[`${s}.content`] = o.text);
    typeof o.data === "string" && (e[`${s}.data_size`] = o.data.length);
    const i = o.resource;
    if (Sp(i)) {
      r("resource_uri", i.uri);
      r("resource_mime_type", i.mimeType);
    }
  }
  return e;
}
/**
 * Extract tool result attributes for span instrumentation
 * @param result - Tool execution result
 * @returns Attributes extracted from tool result content
 */ function wp(t) {
  if (!Sp(t)) return {};
  const e = Array.isArray(t.content) ? kp(t.content) : {};
  typeof t.isError === "boolean" && (e[Wl] = t.isError);
  return e;
}
/**
 * Extract prompt result attributes for span instrumentation
 * @param result - Prompt execution result
 * @returns Attributes extracted from prompt result
 */ function xp(t) {
  const e = {};
  if (!Sp(t)) return e;
  typeof t.description === "string" && (e[Hl] = t.description);
  if (Array.isArray(t.messages)) {
    e[Zl] = t.messages.length;
    const n = t.messages;
    for (const [t, o] of n.entries()) {
      if (!Sp(o)) continue;
      const s = n.length === 1 ? "mcp.prompt.result" : `mcp.prompt.result.${t}`;
      const r = (t, o) => {
        if (typeof o === "string") {
          const r = n.length === 1 ? `${s}.message_${t}` : `${s}.${t}`;
          e[r] = o;
        }
      };
      r("role", o.role);
      if (Sp(o.content)) {
        const t = o.content;
        if (typeof t.text === "string") {
          const o = n.length === 1 ? `${s}.message_content` : `${s}.content`;
          e[o] = t.text;
        }
      }
    }
  }
  return e;
}
const Ep = new WeakMap();
/**
 * Stores session data for a transport with sessionId
 * @param transport - MCP transport instance
 * @param sessionData - Session data to store
 */ function Ap(t, e) {
  t.sessionId && Ep.set(t, e);
}
/**
 * Updates session data for a transport with sessionId (merges with existing data)
 * @param transport - MCP transport instance
 * @param partialSessionData - Partial session data to merge with existing data
 */ function Tp(t, e) {
  if (t.sessionId) {
    const n = Ep.get(t) || {};
    Ep.set(t, { ...n, ...e });
  }
}
/**
 * Retrieves client information for a transport
 * @param transport - MCP transport instance
 * @returns Client information if available
 */ function Ip(t) {
  return Ep.get(t)?.clientInfo;
}
/**
 * Retrieves protocol version for a transport
 * @param transport - MCP transport instance
 * @returns Protocol version if available
 */ function $p(t) {
  return Ep.get(t)?.protocolVersion;
}
/**
 * Retrieves full session data for a transport
 * @param transport - MCP transport instance
 * @returns Complete session data if available
 */ function Op(t) {
  return Ep.get(t);
}
/**
 * Cleans up session data for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function Cp(t) {
  Ep.delete(t);
}
/**
 * Extracts and validates PartyInfo from an unknown object
 * @param obj - Unknown object that might contain party info
 * @returns Validated PartyInfo object with only string properties
 */ function jp(t) {
  const e = {};
  if (Sp(t)) {
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
 */ function Np(t) {
  const e = {};
  if (Sp(t.params)) {
    typeof t.params.protocolVersion === "string" &&
      (e.protocolVersion = t.params.protocolVersion);
    t.params.clientInfo && (e.clientInfo = jp(t.params.clientInfo));
  }
  return e;
}
/**
 * Extracts session data from "initialize" response
 * @param result - "initialize" response result containing server info and protocol version
 * @returns Partial session data extracted from response including protocol version and server info
 */ function Pp(t) {
  const e = {};
  if (Sp(t)) {
    typeof t.protocolVersion === "string" &&
      (e.protocolVersion = t.protocolVersion);
    t.serverInfo && (e.serverInfo = jp(t.serverInfo));
  }
  return e;
}
/**
 * Build client attributes from stored client info
 * @param transport - MCP transport instance
 * @returns Client attributes for span instrumentation
 */ function Mp(t) {
  const e = Ip(t);
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
 */ function Rp(t) {
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
 */ function Dp(t) {
  const e = Op(t)?.serverInfo;
  const n = {};
  e?.name && (n[Fl] = e.name);
  e?.title && (n[Ll] = e.title);
  e?.version && (n[Ul] = e.version);
  return n;
}
/**
 * Build server attributes from PartyInfo directly
 * @param serverInfo - Server party info
 * @returns Server attributes for span instrumentation
 */ function Fp(t) {
  const e = {};
  t?.name && (e[Fl] = t.name);
  t?.title && (e[Ll] = t.title);
  t?.version && (e[Ul] = t.version);
  return e;
}
/**
 * Extracts client connection info from extra handler data
 * @param extra - Extra handler data containing connection info
 * @returns Client address and port information
 */ function Lp(t) {
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
 */ function Up(t) {
  if (!t?.constructor)
    return { mcpTransport: "unknown", networkTransport: "unknown" };
  const e =
    typeof t.constructor?.name === "string" ? t.constructor.name : "unknown";
  let n = "unknown";
  const o = e.toLowerCase();
  o.includes("stdio")
    ? (n = "pipe")
    : (o.includes("http") || o.includes("sse")) && (n = "tcp");
  return { mcpTransport: e, networkTransport: n };
}
/**
 * Build transport and network attributes
 * @param transport - MCP transport instance
 * @param extra - Optional extra handler data
 * @returns Transport attributes for span instrumentation
 * @note sessionId may be undefined during initial setup - session should be established by client during initialize flow
 */ function qp(t, e) {
  const n = t && "sessionId" in t ? t.sessionId : void 0;
  const o = e ? Lp(e) : {};
  const { mcpTransport: s, networkTransport: r } = Up(t);
  const i = Mp(t);
  const a = Dp(t);
  const c = $p(t);
  const u = {
    ...(n && { [Rl]: n }),
    ...(o.address && { [ip]: o.address }),
    ...(o.port && { [ap]: o.port }),
    [Dl]: s,
    [sp]: r,
    [rp]: "2.0",
    ...(c && { [ql]: c }),
    ...i,
    ...a,
  };
  return u;
}
const Jp = new WeakMap();
/**
 * Gets or creates the span map for a specific transport instance
 * @internal
 * @param transport - MCP transport instance
 * @returns Span map for the transport
 */ function zp(t) {
  let e = Jp.get(t);
  if (!e) {
    e = new Map();
    Jp.set(t, e);
  }
  return e;
}
/**
 * Stores span context for later correlation with handler execution
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param span - Active span to correlate
 * @param method - MCP method name
 */ function Bp(t, e, n, o) {
  const s = zp(t);
  s.set(e, { span: n, method: o, startTime: Date.now() });
}
/**
 * Completes span with results and cleans up correlation
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param result - Execution result for attribute extraction
 */ function Wp(t, e, n) {
  const o = zp(t);
  const s = o.get(e);
  if (s) {
    const { span: t, method: r } = s;
    if (r === "initialize") {
      const e = Pp(n);
      const o = Fp(e.serverInfo);
      const s = { ...o };
      e.protocolVersion && (s[ql] = e.protocolVersion);
      t.setAttributes(s);
    } else if (r === "tools/call") {
      const e = wp(n);
      const o = we();
      const s = Boolean(o?.getOptions().sendDefaultPii);
      const r = hp(e, s);
      t.setAttributes(r);
    } else if (r === "prompts/get") {
      const e = xp(n);
      const o = we();
      const s = Boolean(o?.getOptions().sendDefaultPii);
      const r = hp(e, s);
      t.setAttributes(r);
    }
    t.end();
    o.delete(e);
  }
}
/**
 * Cleans up pending spans for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function Vp(t) {
  const e = Jp.get(t);
  if (e) {
    for (const [, t] of e) {
      t.span.setStatus({ code: Be, message: "cancelled" });
      t.span.end();
    }
    e.clear();
  }
}
const Kp = {
  "tools/call": {
    targetField: "name",
    targetAttribute: Jl,
    captureArguments: true,
    argumentsField: "arguments",
  },
  "resources/read": {
    targetField: "uri",
    targetAttribute: zl,
    captureUri: true,
  },
  "resources/subscribe": { targetField: "uri", targetAttribute: zl },
  "resources/unsubscribe": { targetField: "uri", targetAttribute: zl },
  "prompts/get": {
    targetField: "name",
    targetAttribute: Bl,
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
 */ function Gp(t, e) {
  const n = Kp[t];
  if (!n) return { attributes: {} };
  const o =
    n.targetField && typeof e?.[n.targetField] === "string"
      ? e[n.targetField]
      : void 0;
  return {
    target: o,
    attributes: o && n.targetAttribute ? { [n.targetAttribute]: o } : {},
  };
}
/**
 * Extracts request arguments based on method type
 * @param method - MCP method name
 * @param params - Method parameters
 * @returns Arguments as span attributes with mcp.request.argument prefix
 */ function Hp(t, e) {
  const n = {};
  const o = Kp[t];
  if (!o) return n;
  if (o.captureArguments && o.argumentsField && e?.[o.argumentsField]) {
    const t = e[o.argumentsField];
    if (typeof t === "object" && t !== null)
      for (const [e, o] of Object.entries(t))
        n[`${Ql}.${e.toLowerCase()}`] = JSON.stringify(o);
  }
  o.captureUri && e?.uri && (n[`${Ql}.uri`] = JSON.stringify(e.uri));
  o.captureName && e?.name && (n[`${Ql}.name`] = JSON.stringify(e.name));
  return n;
}
/**
 * Extracts additional attributes for specific notification types
 * @param method - Notification method name
 * @param params - Notification parameters
 * @returns Method-specific attributes for span instrumentation
 */ function Zp(t, e) {
  const n = {};
  switch (t) {
    case "notifications/cancelled":
      e?.requestId && (n["mcp.cancelled.request_id"] = String(e.requestId));
      e?.reason && (n["mcp.cancelled.reason"] = String(e.reason));
      break;
    case "notifications/message":
      e?.level && (n[tp] = String(e.level));
      e?.logger && (n[ep] = String(e.logger));
      if (e?.data !== void 0) {
        n[np] = typeof e.data;
        typeof e.data === "string"
          ? (n[op] = e.data)
          : (n[op] = JSON.stringify(e.data));
      }
      break;
    case "notifications/progress":
      e?.progressToken && (n["mcp.progress.token"] = String(e.progressToken));
      typeof e?.progress === "number" &&
        (n["mcp.progress.current"] = e.progress);
      if (typeof e?.total === "number") {
        n["mcp.progress.total"] = e.total;
        typeof e?.progress === "number" &&
          (n["mcp.progress.percentage"] = (e.progress / e.total) * 100);
      }
      e?.message && (n["mcp.progress.message"] = String(e.message));
      break;
    case "notifications/resources/updated":
      if (e?.uri) {
        n[zl] = String(e.uri);
        const t = ma(String(e.uri));
        t &&
          !da(t) &&
          (n["mcp.resource.protocol"] = t.protocol.replace(":", ""));
      }
      break;
    case "notifications/initialized":
      n["mcp.lifecycle.phase"] = "initialization_complete";
      n["mcp.protocol.ready"] = 1;
      break;
  }
  return n;
}
/**
 * Build type-specific attributes based on message type
 * @param type - Span type (request or notification)
 * @param message - JSON-RPC message
 * @param params - Optional parameters for attribute extraction
 * @returns Type-specific attributes for span instrumentation
 */ function Yp(t, e, n) {
  if (t === "request") {
    const t = e;
    const o = Gp(t.method, n || {});
    return {
      ...(t.id !== void 0 && { [Ml]: String(t.id) }),
      ...o.attributes,
      ...Hp(t.method, n || {}),
    };
  }
  return Zp(e.method, n || {});
}
/**
 * Creates a span name based on the method and target
 * @internal
 * @param method - MCP method name
 * @param target - Optional target identifier
 * @returns Formatted span name
 */ function Xp(t, e) {
  return e ? `${t} ${e}` : t;
}
/**
 * Build Sentry-specific attributes based on span type
 * @internal
 * @param type - Span type configuration
 * @returns Sentry-specific attributes
 */ function Qp(t) {
  let e;
  let n;
  switch (t) {
    case "request":
      e = cp;
      n = pp;
      break;
    case "notification-incoming":
      e = up;
      n = fp;
      break;
    case "notification-outgoing":
      e = lp;
      n = fp;
      break;
  }
  return { [Ie]: e, [$e]: n, [Ee]: dp };
}
/**
 * Unified builder for creating MCP spans
 * @internal
 * @param config - Span configuration
 * @returns Created span
 */ function tf(t) {
  const { type: e, message: n, transport: o, extra: s, callback: r } = t;
  const { method: i } = n;
  const a = n.params;
  let c;
  if (e === "request") {
    const t = Gp(i, a || {});
    c = Xp(i, t.target);
  } else c = i;
  const u = { ...qp(o, s), [Pl]: i, ...Yp(e, n, a), ...Qp(e) };
  const l = we();
  const p = Boolean(l?.getOptions().sendDefaultPii);
  const f = hp(u, p);
  return Xo({ name: c, forceTransaction: true, attributes: f }, r);
}
/**
 * Creates a span for incoming MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param extra - Extra handler data
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function ef(t, e, n, o) {
  return tf({
    type: "notification-incoming",
    message: t,
    transport: e,
    extra: n,
    callback: o,
  });
}
/**
 * Creates a span for outgoing MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function nf(t, e, n) {
  return tf({
    type: "notification-outgoing",
    message: t,
    transport: e,
    callback: n,
  });
}
/**
 * Builds span configuration for MCP server requests
 * @param jsonRpcMessage - Request message
 * @param transport - MCP transport instance
 * @param extra - Optional extra handler data
 * @returns Span configuration object
 */ function of(t, e, n) {
  const { method: o } = t;
  const s = t.params;
  const r = Gp(o, s || {});
  const i = Xp(o, r.target);
  const a = { ...qp(e, n), [Pl]: o, ...Yp("request", t, s), ...Qp("request") };
  const c = we();
  const u = Boolean(c?.getOptions().sendDefaultPii);
  const l = hp(a, u);
  return { name: i, op: cp, forceTransaction: true, attributes: l };
}
/**
 * Wraps transport.onmessage to create spans for incoming messages.
 * For "initialize" requests, extracts and stores client info and protocol version
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 */ function sf(t) {
  t.onmessage &&
    dt(
      t,
      "onmessage",
      (t) =>
        function (e, n) {
          if (_p(e)) {
            const o = e.method === "initialize";
            let s;
            if (o)
              try {
                s = Np(e);
                Ap(this, s);
              } catch {}
            const r = be().clone();
            return ke(r, () => {
              const r = of(e, this, n);
              const i = ts(r);
              o &&
                s &&
                i.setAttributes({
                  ...Rp(s.clientInfo),
                  ...(s.protocolVersion && { [ql]: s.protocolVersion }),
                });
              Bp(this, e.id, i, e.method);
              return ns(i, () => t.call(this, e, n));
            });
          }
          return yp(e)
            ? ef(e, this, n, () => t.call(this, e, n))
            : t.call(this, e, n);
        },
    );
}
/**
 * Wraps transport.send to handle outgoing messages and response correlation.
 * For "initialize" responses, extracts and stores protocol version and server info
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 */ function rf(t) {
  t.send &&
    dt(
      t,
      "send",
      (t) =>
        async function (...e) {
          const [n] = e;
          if (yp(n)) return nf(n, this, () => t.call(this, ...e));
          if (bp(n) && n.id !== null && n.id !== void 0) {
            n.error && uf(n.error);
            if (
              Sp(n.result) &&
              (n.result.protocolVersion || n.result.serverInfo)
            )
              try {
                const t = Pp(n.result);
                Tp(this, t);
              } catch {}
            Wp(this, n.id, n.result);
          }
          return t.call(this, ...e);
        },
    );
}
/**
 * Wraps transport.onclose to clean up pending spans for this transport only
 * @param transport - MCP transport instance to wrap
 */ function af(t) {
  t.onclose &&
    dt(
      t,
      "onclose",
      (t) =>
        function (...e) {
          Vp(this);
          Cp(this);
          return t.call(this, ...e);
        },
    );
}
/**
 * Wraps transport error handlers to capture connection errors
 * @param transport - MCP transport instance to wrap
 */ function cf(t) {
  t.onerror &&
    dt(
      t,
      "onerror",
      (t) =>
        function (e) {
          lf(e);
          return t.call(this, e);
        },
    );
}
/**
 * Captures JSON-RPC error responses for server-side errors.
 * @see https://www.jsonrpc.org/specification#error_object
 * @internal
 * @param errorResponse - JSON-RPC error response
 */ function uf(t) {
  try {
    if (t && typeof t === "object" && "code" in t && "message" in t) {
      const e = t;
      const n = e.code === -32603 || (e.code >= -32099 && e.code <= -32e3);
      if (n) {
        const t = new Error(e.message);
        t.name = `JsonRpcError_${e.code}`;
        El(t, "protocol");
      }
    }
  } catch {}
}
/**
 * Captures transport connection errors
 * @internal
 * @param error - Transport error
 */ function lf(t) {
  try {
    El(t, "transport");
  } catch {}
}
const pf = new WeakSet();
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
 * const server = Sentry.wrapMcpServerWithSentry(
 *   new McpServer({ name: "my-server", version: "1.0.0" })
 * );
 *
 * const transport = new StreamableHTTPServerTransport();
 * await server.connect(transport);
 * ```
 *
 * @param mcpServerInstance - MCP server instance to instrument
 * @returns Instrumented server instance (same reference)
 */ function ff(t) {
  if (pf.has(t)) return t;
  if (!vp(t)) return t;
  const e = t;
  dt(
    e,
    "connect",
    (t) =>
      async function (e, ...n) {
        const o = await t.call(this, e, ...n);
        sf(e);
        rf(e);
        af(e);
        cf(e);
        return o;
      },
  );
  Nl(e);
  pf.add(t);
  return t;
}
function df(t, e = {}, n = ye()) {
  const {
    message: o,
    name: s,
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
        name: s,
        message: o,
        url: i,
        source: a,
        associated_event_id: c,
      },
    },
    type: "feedback",
    level: "info",
    tags: u,
  };
  const p = n?.getClient() || we();
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
 */ function mf(t, e, n, o, s) {
  zr({ level: t, message: e, attributes: n, severityNumber: s }, o);
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
 */ function gf(t, e, { scope: n } = {}) {
  mf("trace", t, e, n);
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
 */ function hf(t, e, { scope: n } = {}) {
  mf("debug", t, e, n);
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
 */ function _f(t, e, { scope: n } = {}) {
  mf("info", t, e, n);
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
 */ function yf(t, e, { scope: n } = {}) {
  mf("warn", t, e, n);
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
 */ function bf(t, e, { scope: n } = {}) {
  mf("error", t, e, n);
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
 */ function vf(t, e, { scope: n } = {}) {
  mf("fatal", t, e, n);
}
var Sf = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      debug: hf,
      error: bf,
      fatal: vf,
      fmt: Aa,
      info: _f,
      trace: gf,
      warn: yf,
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
 */ function kf(t, n, o) {
  return "util" in e && typeof e.util.format === "function"
    ? e.util.format(...t)
    : wf(t, n, o);
}
/**
 * Joins the given values into a string.
 *
 * @param values - The values to join.
 * @param normalizeDepth - The depth to normalize the values.
 * @param normalizeMaxBreadth - The max breadth to normalize the values.
 * @returns The joined string.
 */ function wf(t, e, n) {
  return t
    .map((t) => (Y(t) ? String(t) : JSON.stringify(lo(t, e, n))))
    .join(" ");
}
/**
 * Checks if a string contains console substitution patterns like %s, %d, %i, %f, %o, %O, %c.
 *
 * @param str - The string to check
 * @returns true if the string contains console substitution patterns
 */ function xf(t) {
  return /%[sdifocO]/.test(t);
}
/**
 * Creates template attributes for multiple console arguments.
 *
 * @param args - The console arguments
 * @returns An object with template and parameter attributes
 */ function Ef(t, e) {
  const n = {};
  const o = new Array(e.length).fill("{}").join(" ");
  n["sentry.message.template"] = `${t} ${o}`;
  e.forEach((t, e) => {
    n[`sentry.message.parameter.${e}`] = t;
  });
  return n;
}
const Af = "ConsoleLogs";
const Tf = { [$e]: "auto.log.console" };
const If = (e = {}) => {
  const n = e.levels || i;
  return {
    name: Af,
    setup(e) {
      const {
        enableLogs: o,
        normalizeDepth: s = 3,
        normalizeMaxBreadth: r = 1e3,
      } = e.getOptions();
      o
        ? Uc(({ args: t, level: o }) => {
            if (we() !== e || !n.includes(o)) return;
            const i = t[0];
            const a = t.slice(1);
            if (o === "assert") {
              if (!i) {
                const t =
                  a.length > 0
                    ? `Assertion failed: ${kf(a, s, r)}`
                    : "Assertion failed";
                zr({ level: "error", message: t, attributes: Tf });
              }
              return;
            }
            const c = o === "log";
            const u = t.length > 1 && typeof t[0] === "string" && !xf(t[0]);
            const l = { ...Tf, ...(u ? Ef(i, a) : {}) };
            zr({
              level: c ? "info" : o,
              message: kf(t, s, r),
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
const $f = Cr(If);
/**
 * Capture a metric with the given type, name, and value.
 *
 * @param type - The type of the metric.
 * @param name - The name of the metric.
 * @param value - The value of the metric.
 * @param options - Options for capturing the metric.
 */ function Of(t, e, n, o) {
  ni(
    { type: t, name: e, value: n, unit: o?.unit, attributes: o?.attributes },
    { scope: o?.scope },
  );
}
/**
 * @summary Increment a counter metric. Requires the `_experiments.enableMetrics` option to be enabled.
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
 */ function Cf(t, e = 1, n) {
  Of("counter", t, e, n);
}
/**
 * @summary Set a gauge metric to a specific value. Requires the `_experiments.enableMetrics` option to be enabled.
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
 */ function jf(t, e, n) {
  Of("gauge", t, e, n);
}
/**
 * @summary Record a value in a distribution metric. Requires the `_experiments.enableMetrics` option to be enabled.
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
 */ function Nf(t, e, n) {
  Of("distribution", t, e, n);
}
var Pf = Object.freeze(
  Object.defineProperty(
    { __proto__: null, count: Cf, distribution: Nf, gauge: jf },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
const Mf = ["trace", "debug", "info", "warn", "error", "fatal"];
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
 */ function Rf(t = {}) {
  const e = new Set(t.levels ?? Mf);
  const n = t.client;
  return {
    log(t) {
      const {
        type: o,
        level: s,
        message: r,
        args: i,
        tag: a,
        date: c,
        ...u
      } = t;
      const l = n || we();
      if (!l) return;
      const p = Lf(o, s);
      if (!e.has(p)) return;
      const { normalizeDepth: f = 3, normalizeMaxBreadth: d = 1e3 } =
        l.getOptions();
      const m = [];
      r && m.push(r);
      i && i.length > 0 && m.push(kf(i, f, d));
      const g = m.join(" ");
      u["sentry.origin"] = "auto.log.consola";
      a && (u["consola.tag"] = a);
      o && (u["consola.type"] = o);
      s != null && typeof s === "number" && (u["consola.level"] = s);
      zr({ level: p, message: g, attributes: u });
    },
  };
}
const Df = {
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
const Ff = {
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
 */ function Lf(t, e) {
  if (t === "verbose") return "debug";
  if (t === "silent") return "trace";
  if (t) {
    const e = Df[t];
    if (e) return e;
  }
  if (typeof e === "number") {
    const t = Ff[e];
    if (t) return t;
  }
  return "info";
}
const Uf = "gen_ai.prompt";
const qf = "gen_ai.system";
const Jf = "gen_ai.request.model";
const zf = "gen_ai.request.stream";
const Bf = "gen_ai.request.temperature";
const Wf = "gen_ai.request.max_tokens";
const Vf = "gen_ai.request.frequency_penalty";
const Kf = "gen_ai.request.presence_penalty";
const Gf = "gen_ai.request.top_p";
const Hf = "gen_ai.request.top_k";
const Zf = "gen_ai.request.encoding_format";
const Yf = "gen_ai.request.dimensions";
const Xf = "gen_ai.response.finish_reasons";
const Qf = "gen_ai.response.model";
const td = "gen_ai.response.id";
const ed = "gen_ai.response.stop_reason";
const nd = "gen_ai.usage.input_tokens";
const od = "gen_ai.usage.output_tokens";
const sd = "gen_ai.usage.total_tokens";
const rd = "gen_ai.operation.name";
const id = "gen_ai.request.messages";
const ad = "gen_ai.response.text";
const cd = "gen_ai.request.available_tools";
const ud = "gen_ai.response.streaming";
const ld = "gen_ai.response.tool_calls";
const pd = "gen_ai.agent.name";
const fd = "gen_ai.pipeline.name";
const dd = "gen_ai.usage.cache_creation_input_tokens";
const md = "gen_ai.usage.cache_read_input_tokens";
const gd = "gen_ai.usage.input_tokens.cache_write";
const hd = "gen_ai.usage.input_tokens.cached";
const _d = "gen_ai.invoke_agent";
const yd = "openai.response.id";
const bd = "openai.response.model";
const vd = "openai.response.timestamp";
const Sd = "openai.usage.completion_tokens";
const kd = "openai.usage.prompt_tokens";
const wd = { CHAT: "chat", RESPONSES: "responses", EMBEDDINGS: "embeddings" };
const xd = "anthropic.response.timestamp";
const Ed = new Map();
const Ad = 2e4;
const Td = (t) => new TextEncoder().encode(t).length;
const Id = (t) => Td(JSON.stringify(t));
/**
 * Truncate a string to fit within maxBytes when encoded as UTF-8.
 * Uses binary search for efficiency with multi-byte characters.
 *
 * @param text - The string to truncate
 * @param maxBytes - Maximum byte length (UTF-8 encoded)
 * @returns Truncated string that fits within maxBytes
 */ function $d(t, e) {
  if (Td(t) <= e) return t;
  let n = 0;
  let o = t.length;
  let s = "";
  while (n <= o) {
    const r = Math.floor((n + o) / 2);
    const i = t.slice(0, r);
    const a = Td(i);
    if (a <= e) {
      s = i;
      n = r + 1;
    } else o = r - 1;
  }
  return s;
}
/**
 * Extract text content from a Google GenAI message part.
 * Parts are either plain strings or objects with a text property.
 *
 * @returns The text content
 */ function Od(t) {
  return typeof t === "string" ? t : "text" in t ? t.text : "";
}
/**
 * Create a new part with updated text content while preserving the original structure.
 *
 * @param part - Original part (string or object)
 * @param text - New text content
 * @returns New part with updated text
 */ function Cd(t, e) {
  return typeof t === "string" ? e : { ...t, text: e };
}
function jd(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "content" in t &&
    typeof t.content === "string"
  );
}
function Nd(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "content" in t &&
    Array.isArray(t.content)
  );
}
function Pd(t) {
  return (
    !(!t || typeof t !== "object") &&
    (Md(t) ||
      Rd(t) ||
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
function Md(t) {
  return (
    "type" in t && typeof t.type === "string" && "source" in t && Pd(t.source)
  );
}
function Rd(t) {
  return (
    "inlineData" in t &&
    !!t.inlineData &&
    typeof t.inlineData === "object" &&
    "data" in t.inlineData &&
    typeof t.inlineData.data === "string"
  );
}
function Dd(t) {
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
 */ function Fd(t, e) {
  const n = { ...t, content: "" };
  const o = Id(n);
  const s = e - o;
  if (s <= 0) return [];
  const r = $d(t.content, s);
  return [{ ...t, content: r }];
}
/**
 * Truncate a message with `parts: [...]` format (Google GenAI).
 * Keeps as many complete parts as possible, only truncating the first part if needed.
 *
 * @param message - Message with parts array
 * @param maxBytes - Maximum byte limit
 * @returns Array with truncated message, or empty array if it doesn't fit
 */ function Ld(t, e) {
  const { parts: n } = t;
  const o = n.map((t) => Cd(t, ""));
  const s = Id({ ...t, parts: o });
  let r = e - s;
  if (r <= 0) return [];
  const i = [];
  for (const t of n) {
    const e = Od(t);
    const n = Td(e);
    if (!(n <= r)) {
      if (i.length === 0) {
        const n = $d(e, r);
        n && i.push(Cd(t, n));
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
 */ function Ud(t, e) {
  return t && typeof t === "object"
    ? jd(t)
      ? Fd(t, e)
      : Dd(t)
        ? Ld(t, e)
        : []
    : [];
}
const qd = "[Filtered]";
const Jd = ["image_url", "data", "content", "b64_json", "result", "uri"];
function zd(t) {
  const e = { ...t };
  Pd(e.source) && (e.source = zd(e.source));
  Rd(t) && (e.inlineData = { ...t.inlineData, data: qd });
  for (const t of Jd) typeof e[t] === "string" && (e[t] = qd);
  return e;
}
function Bd(t) {
  const e = t.map((t) => {
    let e;
    if (!!t && typeof t === "object") {
      Nd(t)
        ? (e = { ...t, content: Bd(t.content) })
        : "content" in t &&
          Pd(t.content) &&
          (e = { ...t, content: zd(t.content) });
      Dd(t) && (e = { ...(e ?? t), parts: Bd(t.parts) });
      Pd(e) ? (e = zd(e)) : Pd(t) && (e = zd(t));
    }
    return e ?? t;
  });
  return e;
}
/**
 * Truncate an array of messages to fit within a byte limit.
 *
 * Strategy:
 * - Keeps the newest messages (from the end of the array)
 * - Uses O(n) algorithm: precompute sizes once, then find largest suffix under budget
 * - If no complete messages fit, attempts to truncate the newest single message
 *
 * @param messages - Array of messages to truncate
 * @param maxBytes - Maximum total byte limit for all messages
 * @returns Truncated array of messages
 *
 * @example
 * ```ts
 * const messages = [msg1, msg2, msg3, msg4]; // newest is msg4
 * const truncated = truncateMessagesByBytes(messages, 10000);
 * // Returns [msg3, msg4] if they fit, or [msg4] if only it fits, etc.
 * ```
 */ function Wd(t, e) {
  if (!Array.isArray(t) || t.length === 0) return t;
  const n = Bd(t);
  const o = Id(n);
  if (o <= e) return n;
  const s = n.map(Id);
  let r = 0;
  let i = n.length;
  for (let t = n.length - 1; t >= 0; t--) {
    const n = s[t];
    if (n && r + n > e) break;
    n && (r += n);
    i = t;
  }
  if (i === n.length) {
    const t = n[n.length - 1];
    return Ud(t, e);
  }
  return n.slice(i);
}
/**
 * Truncate GenAI messages using the default byte limit.
 *
 * Convenience wrapper around `truncateMessagesByBytes` with the default limit.
 *
 * @param messages - Array of messages to truncate
 * @returns Truncated array of messages
 */ function Vd(t) {
  return Wd(t, Ad);
}
/**
 * Truncate GenAI string input using the default byte limit.
 *
 * @param input - The string to truncate
 * @returns Truncated string
 */ function Kd(t) {
  return $d(t, Ad);
}
function Gd(t) {
  return t.includes("messages")
    ? "messages"
    : t.includes("completions")
      ? "completions"
      : t.includes("models")
        ? "models"
        : t.includes("chat")
          ? "chat"
          : t.split(".").pop() || "unknown";
}
function Hd(t) {
  return `gen_ai.${Gd(t)}`;
}
function Zd(t, e) {
  return t ? `${t}.${e}` : e;
}
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param cachedInputTokens - The number of cached input tokens
 * @param cachedOutputTokens - The number of cached output tokens
 */ function Yd(t, e, n, o, s) {
  e !== void 0 && t.setAttributes({ [nd]: e });
  n !== void 0 && t.setAttributes({ [od]: n });
  if (e !== void 0 || n !== void 0 || o !== void 0 || s !== void 0) {
    const r = (e ?? 0) + (n ?? 0) + (o ?? 0) + (s ?? 0);
    t.setAttributes({ [sd]: r });
  }
}
/**
 * Get the truncated JSON string for a string or array of strings.
 *
 * @param value - The string or array of strings to truncate
 * @returns The truncated JSON string
 */ function Xd(t) {
  if (typeof t === "string") return Kd(t);
  if (Array.isArray(t)) {
    const e = Vd(t);
    return JSON.stringify(e);
  }
  return JSON.stringify(t);
}
const Qd = "operation.name";
const tm = "ai.prompt";
const em = "ai.schema";
const nm = "ai.response.object";
const om = "ai.response.text";
const sm = "ai.response.toolCalls";
const rm = "ai.prompt.messages";
const im = "ai.prompt.tools";
const am = "ai.model.id";
const cm = "ai.response.providerMetadata";
const um = "ai.usage.cachedInputTokens";
const lm = "ai.telemetry.functionId";
const pm = "ai.usage.completionTokens";
const fm = "ai.usage.promptTokens";
const dm = "ai.toolCall.name";
const mm = "ai.toolCall.id";
const gm = "ai.toolCall.args";
const hm = "ai.toolCall.result";
function _m(t, e) {
  const n = t.parent_span_id;
  if (!n) return;
  const o = t.data[nd];
  const s = t.data[od];
  if (typeof o === "number" || typeof s === "number") {
    const t = e.get(n) || { inputTokens: 0, outputTokens: 0 };
    typeof o === "number" && (t.inputTokens += o);
    typeof s === "number" && (t.outputTokens += s);
    e.set(n, t);
  }
}
function ym(t, e) {
  const n = e.get(t.span_id);
  if (n && t.data) {
    n.inputTokens > 0 && (t.data[nd] = n.inputTokens);
    n.outputTokens > 0 && (t.data[od] = n.outputTokens);
    (n.inputTokens > 0 || n.outputTokens > 0) &&
      (t.data["gen_ai.usage.total_tokens"] = n.inputTokens + n.outputTokens);
  }
}
function bm(t) {
  return Ed.get(t);
}
function vm(t) {
  Ed.delete(t);
}
function Sm(t) {
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
function km(t) {
  try {
    const e = JSON.parse(t);
    if (!!e && typeof e === "object") {
      const { prompt: t, system: n } = e;
      if (typeof t === "string" || typeof n === "string") {
        const e = [];
        typeof n === "string" && e.push({ role: "system", content: n });
        typeof t === "string" && e.push({ role: "user", content: t });
        return e;
      }
    }
  } catch {}
  return [];
}
function wm(t, e) {
  if (e[tm]) {
    const n = Xd(e[tm]);
    t.setAttribute("gen_ai.prompt", n);
  }
  const n = e[tm];
  if (typeof n === "string" && !e[id] && !e[rm]) {
    const e = km(n);
    e.length && t.setAttribute(id, Xd(e));
  }
}
function xm(t, e) {
  t.setAttribute($e, e);
}
function Em(t) {
  const { data: e, description: n } = Rn(t);
  if (!n) return;
  if (e[dm] && e[mm] && n === "ai.toolCall") {
    $m(t, e);
    return;
  }
  const o = e[am];
  typeof o === "string" && o && Om(t, n, e);
}
function Am(t) {
  if (t.type === "transaction" && t.spans) {
    const e = new Map();
    for (const n of t.spans) {
      Tm(n);
      _m(n, e);
    }
    for (const n of t.spans) n.op === "gen_ai.invoke_agent" && ym(n, e);
    const n = t.contexts?.trace;
    n && n.op === "gen_ai.invoke_agent" && ym(n, e);
  }
  return t;
}
function Tm(t) {
  const { data: e, origin: n } = t;
  if (n === "auto.vercelai.otel") {
    Im(e, pm, od);
    Im(e, fm, nd);
    Im(e, um, hd);
    typeof e[nd] === "number" &&
      typeof e[hd] === "number" &&
      (e[nd] = e[nd] + e[hd]);
    typeof e[od] === "number" &&
      typeof e[nd] === "number" &&
      (e["gen_ai.usage.total_tokens"] = e[od] + e[nd]);
    e[im] && Array.isArray(e[im]) && (e[im] = Sm(e[im]));
    Im(e, Qd, rd);
    Im(e, rm, id);
    Im(e, om, "gen_ai.response.text");
    Im(e, sm, "gen_ai.response.tool_calls");
    Im(e, nm, "gen_ai.response.object");
    Im(e, im, "gen_ai.request.available_tools");
    Im(e, gm, "gen_ai.tool.input");
    Im(e, hm, "gen_ai.tool.output");
    Im(e, em, "gen_ai.request.schema");
    Im(e, am, Jf);
    jm(e);
    for (const t of Object.keys(e))
      t.startsWith("ai.") && Im(e, t, `vercel.${t}`);
  }
}
function Im(t, e, n) {
  if (t[e] != null) {
    t[n] = t[e];
    delete t[e];
  }
}
function $m(t, e) {
  xm(t, "auto.vercelai.otel");
  t.setAttribute(Ie, "gen_ai.execute_tool");
  Im(e, dm, "gen_ai.tool.name");
  Im(e, mm, "gen_ai.tool.call.id");
  const n = e["gen_ai.tool.call.id"];
  typeof n === "string" && Ed.set(n, t);
  e["gen_ai.tool.type"] || t.setAttribute("gen_ai.tool.type", "function");
  const o = e["gen_ai.tool.name"];
  o && t.updateName(`execute_tool ${o}`);
}
function Om(t, e, n) {
  xm(t, "auto.vercelai.otel");
  const o = e.replace("ai.", "");
  t.setAttribute("ai.pipeline.name", o);
  t.updateName(o);
  const s = n[lm];
  if (s && typeof s === "string") {
    t.updateName(`${o} ${s}`);
    t.setAttribute("gen_ai.function_id", s);
  }
  wm(t, n);
  n[am] && !n[Qf] && t.setAttribute(Qf, n[am]);
  t.setAttribute("ai.streaming", e.includes("stream"));
  if (e !== "ai.generateText")
    if (e !== "ai.generateText.doGenerate")
      if (e !== "ai.streamText")
        if (e !== "ai.streamText.doStream")
          if (e !== "ai.generateObject")
            if (e !== "ai.generateObject.doGenerate")
              if (e !== "ai.streamObject")
                if (e !== "ai.streamObject.doStream")
                  if (e !== "ai.embed")
                    if (e !== "ai.embed.doEmbed")
                      if (e !== "ai.embedMany")
                        if (e !== "ai.embedMany.doEmbed")
                          e.startsWith("ai.stream") &&
                            t.setAttribute(Ie, "ai.run");
                        else {
                          t.setAttribute(Ie, "gen_ai.embed_many");
                          t.updateName(`embed_many ${n[am]}`);
                        }
                      else t.setAttribute(Ie, "gen_ai.invoke_agent");
                    else {
                      t.setAttribute(Ie, "gen_ai.embed");
                      t.updateName(`embed ${n[am]}`);
                    }
                  else t.setAttribute(Ie, "gen_ai.invoke_agent");
                else {
                  t.setAttribute(Ie, "gen_ai.stream_object");
                  t.updateName(`stream_object ${n[am]}`);
                }
              else t.setAttribute(Ie, "gen_ai.invoke_agent");
            else {
              t.setAttribute(Ie, "gen_ai.generate_object");
              t.updateName(`generate_object ${n[am]}`);
            }
          else t.setAttribute(Ie, "gen_ai.invoke_agent");
        else {
          t.setAttribute(Ie, "gen_ai.stream_text");
          t.updateName(`stream_text ${n[am]}`);
        }
      else t.setAttribute(Ie, "gen_ai.invoke_agent");
    else {
      t.setAttribute(Ie, "gen_ai.generate_text");
      t.updateName(`generate_text ${n[am]}`);
    }
  else t.setAttribute(Ie, "gen_ai.invoke_agent");
}
function Cm(t) {
  t.on("spanStart", Em);
  t.addEventProcessor(Object.assign(Am, { id: "VercelAiEventProcessor" }));
}
function jm(t) {
  const e = t[cm];
  if (e)
    try {
      const n = JSON.parse(e);
      if (n.openai) {
        Nm(t, hd, n.openai.cachedPromptTokens);
        Nm(t, "gen_ai.usage.output_tokens.reasoning", n.openai.reasoningTokens);
        Nm(
          t,
          "gen_ai.usage.output_tokens.prediction_accepted",
          n.openai.acceptedPredictionTokens,
        );
        Nm(
          t,
          "gen_ai.usage.output_tokens.prediction_rejected",
          n.openai.rejectedPredictionTokens,
        );
        Nm(t, "gen_ai.conversation.id", n.openai.responseId);
      }
      if (n.anthropic) {
        const e =
          n.anthropic.usage?.cache_read_input_tokens ??
          n.anthropic.cacheReadInputTokens;
        Nm(t, hd, e);
        const o =
          n.anthropic.usage?.cache_creation_input_tokens ??
          n.anthropic.cacheCreationInputTokens;
        Nm(t, gd, o);
      }
      if (n.bedrock?.usage) {
        Nm(t, hd, n.bedrock.usage.cacheReadInputTokens);
        Nm(t, gd, n.bedrock.usage.cacheWriteInputTokens);
      }
      if (n.deepseek) {
        Nm(t, hd, n.deepseek.promptCacheHitTokens);
        Nm(
          t,
          "gen_ai.usage.input_tokens.cache_miss",
          n.deepseek.promptCacheMissTokens,
        );
      }
    } catch {}
}
function Nm(t, e, n) {
  n != null && (t[e] = n);
}
const Pm = "OpenAI";
const Mm = ["responses.create", "chat.completions.create", "embeddings.create"];
const Rm = [
  "response.output_item.added",
  "response.function_call_arguments.delta",
  "response.function_call_arguments.done",
  "response.output_item.done",
];
const Dm = [
  "response.created",
  "response.in_progress",
  "response.failed",
  "response.completed",
  "response.incomplete",
  "response.queued",
  "response.output_text.delta",
  ...Rm,
];
function Fm(t) {
  return t.includes("chat.completions")
    ? wd.CHAT
    : t.includes("responses")
      ? wd.RESPONSES
      : t.includes("embeddings")
        ? wd.EMBEDDINGS
        : t.split(".").pop() || "unknown";
}
function Lm(t) {
  return `gen_ai.${Fm(t)}`;
}
function Um(t) {
  return Mm.includes(t);
}
function qm(t, e) {
  return t ? `${t}.${e}` : e;
}
function Jm(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "chat.completion"
  );
}
function zm(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "response"
  );
}
function Bm(t) {
  if (t === null || typeof t !== "object" || !("object" in t)) return false;
  const e = t;
  return (
    e.object === "list" &&
    typeof e.model === "string" &&
    e.model.toLowerCase().includes("embedding")
  );
}
function Wm(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "type" in t &&
    typeof t.type === "string" &&
    t.type.startsWith("response.")
  );
}
function Vm(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "chat.completion.chunk"
  );
}
function Km(t, e, n) {
  Ym(t, e.id, e.model, e.created);
  e.usage &&
    Zm(
      t,
      e.usage.prompt_tokens,
      e.usage.completion_tokens,
      e.usage.total_tokens,
    );
  if (Array.isArray(e.choices)) {
    const o = e.choices.map((t) => t.finish_reason).filter((t) => t !== null);
    o.length > 0 && t.setAttributes({ [Xf]: JSON.stringify(o) });
    if (n) {
      const n = e.choices
        .map((t) => t.message?.tool_calls)
        .filter((t) => Array.isArray(t) && t.length > 0)
        .flat();
      n.length > 0 && t.setAttributes({ [ld]: JSON.stringify(n) });
    }
  }
}
function Gm(t, e, n) {
  Ym(t, e.id, e.model, e.created_at);
  e.status && t.setAttributes({ [Xf]: JSON.stringify([e.status]) });
  e.usage &&
    Zm(t, e.usage.input_tokens, e.usage.output_tokens, e.usage.total_tokens);
  if (n) {
    const n = e;
    if (Array.isArray(n.output) && n.output.length > 0) {
      const e = n.output.filter(
        (t) =>
          typeof t === "object" && t !== null && t.type === "function_call",
      );
      e.length > 0 && t.setAttributes({ [ld]: JSON.stringify(e) });
    }
  }
}
function Hm(t, e) {
  t.setAttributes({ [bd]: e.model, [Qf]: e.model });
  e.usage && Zm(t, e.usage.prompt_tokens, void 0, e.usage.total_tokens);
}
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param totalTokens - The number of total tokens
 */ function Zm(t, e, n, o) {
  e !== void 0 && t.setAttributes({ [kd]: e, [nd]: e });
  n !== void 0 && t.setAttributes({ [Sd]: n, [od]: n });
  o !== void 0 && t.setAttributes({ [sd]: o });
}
/**
 * Set common response attributes
 * @param span - The span to add attributes to
 * @param id - The response id
 * @param model - The response model
 * @param timestamp - The response timestamp
 */ function Ym(t, e, n, o) {
  t.setAttributes({ [yd]: e, [td]: e });
  t.setAttributes({ [bd]: n, [Qf]: n });
  t.setAttributes({ [vd]: new Date(o * 1e3).toISOString() });
}
/**
 * Processes tool calls from a chat completion chunk delta.
 * Follows the pattern: accumulate by index, then convert to array at the end.
 *
 * @param toolCalls - Array of tool calls from the delta.
 * @param state - The current streaming state to update.
 *
 *  @see https://platform.openai.com/docs/guides/function-calling#streaming
 */ function Xm(t, e) {
  for (const n of t) {
    const t = n.index;
    if (t !== void 0 && n.function)
      if (t in e.chatCompletionToolCalls) {
        const o = e.chatCompletionToolCalls[t];
        n.function.arguments &&
          o?.function &&
          (o.function.arguments += n.function.arguments);
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
 */ function Qm(t, e, n) {
  e.responseId = t.id ?? e.responseId;
  e.responseModel = t.model ?? e.responseModel;
  e.responseTimestamp = t.created ?? e.responseTimestamp;
  if (t.usage) {
    e.promptTokens = t.usage.prompt_tokens;
    e.completionTokens = t.usage.completion_tokens;
    e.totalTokens = t.usage.total_tokens;
  }
  for (const o of t.choices ?? []) {
    if (n) {
      o.delta?.content && e.responseTexts.push(o.delta.content);
      o.delta?.tool_calls && Xm(o.delta.tool_calls, e);
    }
    o.finish_reason && e.finishReasons.push(o.finish_reason);
  }
}
/**
 * Processes a single OpenAI Responses API streaming event, updating the streaming state and span.
 *
 * @param streamEvent - The event to process (may be an error or unknown object).
 * @param state - The current streaming state to update.
 * @param recordOutputs - Whether to record output text fragments.
 * @param span - The span to update with error status if needed.
 */ function tg(t, e, n, o) {
  if (!(t && typeof t === "object")) {
    e.eventTypes.push("unknown:non-object");
    return;
  }
  if (t instanceof Error) {
    o.setStatus({ code: Be, message: "internal_error" });
    Ys(t, {
      mechanism: { handled: false, type: "auto.ai.openai.stream-response" },
    });
    return;
  }
  if (!("type" in t)) return;
  const s = t;
  if (Dm.includes(s.type)) {
    if (n) {
      s.type === "response.output_item.done" &&
        "item" in s &&
        e.responsesApiToolCalls.push(s.item);
      if (s.type === "response.output_text.delta" && "delta" in s && s.delta) {
        e.responseTexts.push(s.delta);
        return;
      }
    }
    if ("response" in s) {
      const { response: t } = s;
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
  } else e.eventTypes.push(s.type);
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
 */ async function* eg(t, e, n) {
  const o = {
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
    for await (const s of t) {
      Vm(s) ? Qm(s, o, n) : Wm(s) && tg(s, o, n, e);
      yield s;
    }
  } finally {
    Ym(e, o.responseId, o.responseModel, o.responseTimestamp);
    Zm(e, o.promptTokens, o.completionTokens, o.totalTokens);
    e.setAttributes({ [ud]: true });
    o.finishReasons.length &&
      e.setAttributes({ [Xf]: JSON.stringify(o.finishReasons) });
    n &&
      o.responseTexts.length &&
      e.setAttributes({ [ad]: o.responseTexts.join("") });
    const t = Object.values(o.chatCompletionToolCalls);
    const s = [...t, ...o.responsesApiToolCalls];
    s.length > 0 && e.setAttributes({ [ld]: JSON.stringify(s) });
    e.end();
  }
}
function ng(t, e) {
  const n = { [qf]: "openai", [rd]: Fm(e), [$e]: "auto.ai.openai" };
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    const o = Array.isArray(e.tools) ? e.tools : [];
    const s = e.web_search_options && typeof e.web_search_options === "object";
    const r = s
      ? [{ type: "web_search_options", ...e.web_search_options }]
      : [];
    const i = [...o, ...r];
    i.length > 0 && (n[cd] = JSON.stringify(i));
  }
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    n[Jf] = e.model ?? "unknown";
    "temperature" in e && (n[Bf] = e.temperature);
    "top_p" in e && (n[Gf] = e.top_p);
    "frequency_penalty" in e && (n[Vf] = e.frequency_penalty);
    "presence_penalty" in e && (n[Kf] = e.presence_penalty);
    "stream" in e && (n[zf] = e.stream);
    "encoding_format" in e && (n[Zf] = e.encoding_format);
    "dimensions" in e && (n[Yf] = e.dimensions);
  } else n[Jf] = "unknown";
  return n;
}
function og(t, e, n) {
  if (!e || typeof e !== "object") return;
  const o = e;
  if (Jm(o)) {
    Km(t, o, n);
    if (n && o.choices?.length) {
      const e = o.choices.map((t) => t.message?.content || "");
      t.setAttributes({ [ad]: JSON.stringify(e) });
    }
  } else if (zm(o)) {
    Gm(t, o, n);
    n && o.output_text && t.setAttributes({ [ad]: o.output_text });
  } else Bm(o) && Hm(t, o);
}
function sg(t, e) {
  if ("messages" in e) {
    const n = Xd(e.messages);
    t.setAttributes({ [id]: n });
  }
  if ("input" in e) {
    const n = Xd(e.input);
    t.setAttributes({ [id]: n });
  }
}
function rg(t, e, n, o) {
  return async function (...s) {
    const r = ng(s, e);
    const i = r[Jf] || "unknown";
    const a = Fm(e);
    const c = s[0];
    const u = c && typeof c === "object" && c.stream === true;
    return u
      ? Qo(
          { name: `${a} ${i} stream-response`, op: Lm(e), attributes: r },
          async (r) => {
            try {
              o.recordInputs && c && sg(r, c);
              const e = await t.apply(n, s);
              return eg(e, r, o.recordOutputs ?? false);
            } catch (t) {
              r.setStatus({ code: Be, message: "internal_error" });
              Ys(t, {
                mechanism: {
                  handled: false,
                  type: "auto.ai.openai.stream",
                  data: { function: e },
                },
              });
              r.end();
              throw t;
            }
          },
        )
      : Xo({ name: `${a} ${i}`, op: Lm(e), attributes: r }, async (r) => {
          try {
            o.recordInputs && c && sg(r, c);
            const e = await t.apply(n, s);
            og(r, e, o.recordOutputs);
            return e;
          } catch (t) {
            Ys(t, {
              mechanism: {
                handled: false,
                type: "auto.ai.openai",
                data: { function: e },
              },
            });
            throw t;
          }
        });
  };
}
function ig(t, e = "", n) {
  return new Proxy(t, {
    get(t, o) {
      const s = t[o];
      const r = qm(e, String(o));
      return typeof s === "function" && Um(r)
        ? rg(s, r, t, n)
        : typeof s === "function"
          ? s.bind(t)
          : s && typeof s === "object"
            ? ig(s, r, n)
            : s;
    },
  });
}
function ag(t, e) {
  const n = Boolean(we()?.getOptions().sendDefaultPii);
  const o = { recordInputs: n, recordOutputs: n, ...e };
  return ig(t, "", o);
}
/**
 * Checks if an event is an error event
 * @param event - The event to process
 * @param state - The state of the streaming process
 * @param recordOutputs - Whether to record outputs
 * @param span - The span to update
 * @returns Whether an error occurred
 */ function cg(t, e) {
  if ("type" in t && typeof t.type === "string" && t.type === "error") {
    e.setStatus({ code: Be, message: t.error?.type ?? "internal_error" });
    Ys(t.error, {
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
 */ function ug(t, e) {
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
function lg(t, e) {
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
function pg(t, e, n) {
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
function fg(t, e) {
  if (t.type !== "content_block_stop" || typeof t.index !== "number") return;
  const n = e.activeToolBlocks[t.index];
  if (!n) return;
  const o = n.inputJsonParts.join("");
  let s;
  try {
    s = o ? JSON.parse(o) : {};
  } catch {
    s = { __unparsed: o };
  }
  e.toolCalls.push({ type: "tool_use", id: n.id, name: n.name, input: s });
  delete e.activeToolBlocks[t.index];
}
/**
 * Processes an event
 * @param event - The event to process
 * @param state - The state of the streaming process
 * @param recordOutputs - Whether to record outputs
 * @param span - The span to update
 */ function dg(t, e, n, o) {
  if (!(t && typeof t === "object")) return;
  const s = cg(t, o);
  if (!s) {
    ug(t, e);
    lg(t, e);
    pg(t, e, n);
    fg(t, e);
  }
}
function mg(t, e, n) {
  if (e.isRecording()) {
    t.responseId && e.setAttributes({ [td]: t.responseId });
    t.responseModel && e.setAttributes({ [Qf]: t.responseModel });
    Yd(
      e,
      t.promptTokens,
      t.completionTokens,
      t.cacheCreationInputTokens,
      t.cacheReadInputTokens,
    );
    e.setAttributes({ [ud]: true });
    t.finishReasons.length > 0 &&
      e.setAttributes({ [Xf]: JSON.stringify(t.finishReasons) });
    n &&
      t.responseTexts.length > 0 &&
      e.setAttributes({ [ad]: t.responseTexts.join("") });
    n &&
      t.toolCalls.length > 0 &&
      e.setAttributes({ [ld]: JSON.stringify(t.toolCalls) });
    e.end();
  }
}
async function* gg(t, e, n) {
  const o = {
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
    for await (const s of t) {
      dg(s, o, n, e);
      yield s;
    }
  } finally {
    o.responseId && e.setAttributes({ [td]: o.responseId });
    o.responseModel && e.setAttributes({ [Qf]: o.responseModel });
    Yd(
      e,
      o.promptTokens,
      o.completionTokens,
      o.cacheCreationInputTokens,
      o.cacheReadInputTokens,
    );
    e.setAttributes({ [ud]: true });
    o.finishReasons.length > 0 &&
      e.setAttributes({ [Xf]: JSON.stringify(o.finishReasons) });
    n &&
      o.responseTexts.length > 0 &&
      e.setAttributes({ [ad]: o.responseTexts.join("") });
    n &&
      o.toolCalls.length > 0 &&
      e.setAttributes({ [ld]: JSON.stringify(o.toolCalls) });
    e.end();
  }
}
function hg(t, e, n) {
  const o = {
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
    dg(t, o, n, e);
  });
  t.on("message", () => {
    mg(o, e, n);
  });
  t.on("error", (t) => {
    Ys(t, {
      mechanism: { handled: false, type: "auto.ai.anthropic.stream_error" },
    });
    if (e.isRecording()) {
      e.setStatus({ code: Be, message: "stream_error" });
      e.end();
    }
  });
  return t;
}
const _g = "Anthropic_AI";
const yg = [
  "messages.create",
  "messages.stream",
  "messages.countTokens",
  "models.get",
  "completions.create",
  "models.retrieve",
  "beta.messages.create",
];
function bg(t) {
  return yg.includes(t);
}
function vg(t, e) {
  if (e.error) {
    t.setStatus({ code: Be, message: e.error.type || "internal_error" });
    Ys(e.error, {
      mechanism: { handled: false, type: "auto.ai.anthropic.anthropic_error" },
    });
  }
}
function Sg(t) {
  const { system: e, messages: n } = t;
  const o =
    typeof e === "string" ? [{ role: "system", content: t.system }] : [];
  const s = Array.isArray(n) ? n : n != null ? [n] : [];
  return [...o, ...s];
}
function kg(t, e) {
  const n = { [qf]: "anthropic", [rd]: Gd(e), [$e]: "auto.ai.anthropic" };
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    e.tools && Array.isArray(e.tools) && (n[cd] = JSON.stringify(e.tools));
    n[Jf] = e.model ?? "unknown";
    "temperature" in e && (n[Bf] = e.temperature);
    "top_p" in e && (n[Gf] = e.top_p);
    "stream" in e && (n[zf] = e.stream);
    "top_k" in e && (n[Hf] = e.top_k);
    "frequency_penalty" in e && (n[Vf] = e.frequency_penalty);
    "max_tokens" in e && (n[Wf] = e.max_tokens);
  } else
    n[Jf] = e === "models.retrieve" || e === "models.get" ? t[0] : "unknown";
  return n;
}
function wg(t, e) {
  const n = Sg(e);
  if (n.length) {
    const e = Xd(n);
    t.setAttributes({ [id]: e });
  }
  if ("input" in e) {
    const n = Xd(e.input);
    t.setAttributes({ [id]: n });
  }
  "prompt" in e && t.setAttributes({ [Uf]: JSON.stringify(e.prompt) });
}
function xg(t, e) {
  if ("content" in e && Array.isArray(e.content)) {
    t.setAttributes({
      [ad]: e.content
        .map((t) => t.text)
        .filter((t) => !!t)
        .join(""),
    });
    const n = [];
    for (const t of e.content)
      (t.type !== "tool_use" && t.type !== "server_tool_use") || n.push(t);
    n.length > 0 && t.setAttributes({ [ld]: JSON.stringify(n) });
  }
  "completion" in e && t.setAttributes({ [ad]: e.completion });
  "input_tokens" in e &&
    t.setAttributes({ [ad]: JSON.stringify(e.input_tokens) });
}
function Eg(t, e) {
  if ("id" in e && "model" in e) {
    t.setAttributes({ [td]: e.id, [Qf]: e.model });
    "created" in e &&
      typeof e.created === "number" &&
      t.setAttributes({ [xd]: new Date(e.created * 1e3).toISOString() });
    "created_at" in e &&
      typeof e.created_at === "number" &&
      t.setAttributes({ [xd]: new Date(e.created_at * 1e3).toISOString() });
    "usage" in e &&
      e.usage &&
      Yd(
        t,
        e.usage.input_tokens,
        e.usage.output_tokens,
        e.usage.cache_creation_input_tokens,
        e.usage.cache_read_input_tokens,
      );
  }
}
function Ag(t, e, n) {
  if (e && typeof e === "object")
    if ("type" in e && e.type === "error") vg(t, e);
    else {
      n && xg(t, e);
      Eg(t, e);
    }
}
function Tg(t, e, n) {
  Ys(t, {
    mechanism: {
      handled: false,
      type: "auto.ai.anthropic",
      data: { function: n },
    },
  });
  if (e.isRecording()) {
    e.setStatus({ code: Be, message: "internal_error" });
    e.end();
  }
  throw t;
}
function Ig(t, e, n, o, s, r, i, a, c, u, l) {
  const p = s[Jf] ?? "unknown";
  const f = { name: `${r} ${p} stream-response`, op: Hd(i), attributes: s };
  return Qo(
    f,
    u && !l
      ? async (e) => {
          try {
            c.recordInputs && a && wg(e, a);
            const s = await t.apply(n, o);
            return gg(s, e, c.recordOutputs ?? false);
          } catch (t) {
            return Tg(t, e, i);
          }
        }
      : (t) => {
          try {
            c.recordInputs && a && wg(t, a);
            const s = e.apply(n, o);
            return hg(s, t, c.recordOutputs ?? false);
          } catch (e) {
            return Tg(e, t, i);
          }
        },
  );
}
function $g(t, e, n, o) {
  return new Proxy(t, {
    apply(s, r, i) {
      const a = kg(i, e);
      const c = a[Jf] ?? "unknown";
      const u = Gd(e);
      const l = typeof i[0] === "object" ? i[0] : void 0;
      const p = Boolean(l?.stream);
      const f = e === "messages.stream";
      return p || f
        ? Ig(t, s, n, i, a, u, e, l, o, p, f)
        : Xo({ name: `${u} ${c}`, op: Hd(e), attributes: a }, (t) => {
            o.recordInputs && l && wg(t, l);
            return Go(
              () => s.apply(n, i),
              (t) => {
                Ys(t, {
                  mechanism: {
                    handled: false,
                    type: "auto.ai.anthropic",
                    data: { function: e },
                  },
                });
              },
              () => {},
              (e) => Ag(t, e, o.recordOutputs),
            );
          });
    },
  });
}
function Og(t, e = "", n) {
  return new Proxy(t, {
    get(t, o) {
      const s = t[o];
      const r = Zd(e, String(o));
      return typeof s === "function" && bg(r)
        ? $g(s, r, t, n)
        : typeof s === "function"
          ? s.bind(t)
          : s && typeof s === "object"
            ? Og(s, r, n)
            : s;
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
 */ function Cg(t, e) {
  const n = Boolean(we()?.getOptions().sendDefaultPii);
  const o = { recordInputs: n, recordOutputs: n, ...e };
  return Og(t, "", o);
}
const jg = "Google_GenAI";
const Ng = [
  "models.generateContent",
  "models.generateContentStream",
  "chats.create",
  "sendMessage",
  "sendMessageStream",
];
const Pg = "google_genai";
const Mg = "chats.create";
const Rg = "chat";
/**
 * Checks if a response chunk contains an error
 * @param chunk - The response chunk to check
 * @param span - The span to update if error is found
 * @returns Whether an error occurred
 */ function Dg(t, e) {
  const n = t?.promptFeedback;
  if (n?.blockReason) {
    const t = n.blockReasonMessage ?? n.blockReason;
    e.setStatus({ code: Be, message: `Content blocked: ${t}` });
    Ys(`Content blocked: ${t}`, {
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
 */ function Fg(t, e) {
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
 */ function Lg(t, e, n) {
  Array.isArray(t.functionCalls) && e.toolCalls.push(...t.functionCalls);
  for (const o of t.candidates ?? []) {
    o?.finishReason &&
      !e.finishReasons.includes(o.finishReason) &&
      e.finishReasons.push(o.finishReason);
    for (const t of o?.content?.parts ?? []) {
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
 */ function Ug(t, e, n, o) {
  if (t && !Dg(t, o)) {
    Fg(t, e);
    Lg(t, e, n);
  }
}
async function* qg(t, e, n) {
  const o = { responseTexts: [], finishReasons: [], toolCalls: [] };
  try {
    for await (const s of t) {
      Ug(s, o, n, e);
      yield s;
    }
  } finally {
    const t = { [ud]: true };
    o.responseId && (t[td] = o.responseId);
    o.responseModel && (t[Qf] = o.responseModel);
    o.promptTokens !== void 0 && (t[nd] = o.promptTokens);
    o.completionTokens !== void 0 && (t[od] = o.completionTokens);
    o.totalTokens !== void 0 && (t[sd] = o.totalTokens);
    o.finishReasons.length && (t[Xf] = JSON.stringify(o.finishReasons));
    n && o.responseTexts.length && (t[ad] = o.responseTexts.join(""));
    n && o.toolCalls.length && (t[ld] = JSON.stringify(o.toolCalls));
    e.setAttributes(t);
    e.end();
  }
}
function Jg(t) {
  if (Ng.includes(t)) return true;
  const e = t.split(".").pop();
  return Ng.includes(e);
}
function zg(t) {
  return t.includes("Stream");
}
function Bg(t, e = "user") {
  return typeof t === "string"
    ? [{ role: e, content: t }]
    : Array.isArray(t)
      ? t.flatMap((t) => Bg(t, e))
      : typeof t === "object" && t
        ? "role" in t && typeof t.role === "string"
          ? [t]
          : "parts" in t
            ? [{ ...t, role: e }]
            : [{ role: e, content: t }]
        : [];
}
function Wg(t, e) {
  if ("model" in t && typeof t.model === "string") return t.model;
  if (e && typeof e === "object") {
    const t = e;
    if ("model" in t && typeof t.model === "string") return t.model;
    if ("modelVersion" in t && typeof t.modelVersion === "string")
      return t.modelVersion;
  }
  return "unknown";
}
function Vg(t) {
  const e = {};
  "temperature" in t &&
    typeof t.temperature === "number" &&
    (e[Bf] = t.temperature);
  "topP" in t && typeof t.topP === "number" && (e[Gf] = t.topP);
  "topK" in t && typeof t.topK === "number" && (e[Hf] = t.topK);
  "maxOutputTokens" in t &&
    typeof t.maxOutputTokens === "number" &&
    (e[Wf] = t.maxOutputTokens);
  "frequencyPenalty" in t &&
    typeof t.frequencyPenalty === "number" &&
    (e[Vf] = t.frequencyPenalty);
  "presencePenalty" in t &&
    typeof t.presencePenalty === "number" &&
    (e[Kf] = t.presencePenalty);
  return e;
}
function Kg(t, e, n) {
  const o = { [qf]: Pg, [rd]: Gd(t), [$e]: "auto.ai.google_genai" };
  if (e) {
    o[Jf] = Wg(e, n);
    if ("config" in e && typeof e.config === "object" && e.config) {
      const t = e.config;
      Object.assign(o, Vg(t));
      if ("tools" in t && Array.isArray(t.tools)) {
        const e = t.tools.flatMap((t) => t.functionDeclarations);
        o[cd] = JSON.stringify(e);
      }
    }
  } else o[Jf] = Wg({}, n);
  return o;
}
function Gg(t, e) {
  const n = [];
  "config" in e &&
    e.config &&
    typeof e.config === "object" &&
    "systemInstruction" in e.config &&
    e.config.systemInstruction &&
    n.push(...Bg(e.config.systemInstruction, "system"));
  "history" in e && n.push(...Bg(e.history, "user"));
  "contents" in e && n.push(...Bg(e.contents, "user"));
  "message" in e && n.push(...Bg(e.message, "user"));
  n.length && t.setAttributes({ [id]: JSON.stringify(Vd(n)) });
}
function Hg(t, e, n) {
  if (e && typeof e === "object") {
    e.modelVersion && t.setAttribute(Qf, e.modelVersion);
    if (e.usageMetadata && typeof e.usageMetadata === "object") {
      const n = e.usageMetadata;
      typeof n.promptTokenCount === "number" &&
        t.setAttributes({ [nd]: n.promptTokenCount });
      typeof n.candidatesTokenCount === "number" &&
        t.setAttributes({ [od]: n.candidatesTokenCount });
      typeof n.totalTokenCount === "number" &&
        t.setAttributes({ [sd]: n.totalTokenCount });
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
      n.length > 0 && t.setAttributes({ [ad]: n.join("") });
    }
    if (n && e.functionCalls) {
      const n = e.functionCalls;
      Array.isArray(n) &&
        n.length > 0 &&
        t.setAttributes({ [ld]: JSON.stringify(n) });
    }
  }
}
function Zg(t, e, n, o) {
  const s = e === Mg;
  return new Proxy(t, {
    apply(t, r, i) {
      const a = i[0];
      const c = Kg(e, a, n);
      const u = c[Jf] ?? "unknown";
      const l = Gd(e);
      return zg(e)
        ? Qo(
            { name: `${l} ${u} stream-response`, op: Hd(e), attributes: c },
            async (s) => {
              try {
                o.recordInputs && a && Gg(s, a);
                const e = await t.apply(n, i);
                return qg(e, s, Boolean(o.recordOutputs));
              } catch (t) {
                s.setStatus({ code: Be, message: "internal_error" });
                Ys(t, {
                  mechanism: {
                    handled: false,
                    type: "auto.ai.google_genai",
                    data: { function: e },
                  },
                });
                s.end();
                throw t;
              }
            },
          )
        : Xo(
            {
              name: s ? `${l} ${u} create` : `${l} ${u}`,
              op: Hd(e),
              attributes: c,
            },
            (r) => {
              o.recordInputs && a && Gg(r, a);
              return Go(
                () => t.apply(n, i),
                (t) => {
                  Ys(t, {
                    mechanism: {
                      handled: false,
                      type: "auto.ai.google_genai",
                      data: { function: e },
                    },
                  });
                },
                () => {},
                (t) => {
                  s || Hg(r, t, o.recordOutputs);
                },
              );
            },
          );
    },
  });
}
function Yg(t, e = "", n) {
  return new Proxy(t, {
    get: (t, o, s) => {
      const r = Reflect.get(t, o, s);
      const i = Zd(e, String(o));
      if (typeof r === "function" && Jg(i)) {
        if (i === Mg) {
          const e = Zg(r, i, t, n);
          return function (...t) {
            const o = e(...t);
            return o && typeof o === "object" ? Yg(o, Rg, n) : o;
          };
        }
        return Zg(r, i, t, n);
      }
      return typeof r === "function"
        ? r.bind(t)
        : r && typeof r === "object"
          ? Yg(r, i, n)
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
 */ function Xg(t, e) {
  const n = Boolean(we()?.getOptions().sendDefaultPii);
  const o = { recordInputs: n, recordOutputs: n, ...e };
  return Yg(t, "", o);
}
const Qg = "LangChain";
const th = "auto.ai.langchain";
const eh = {
  human: "user",
  ai: "assistant",
  assistant: "assistant",
  system: "system",
  function: "function",
  tool: "tool",
};
const nh = (t, e, n) => {
  n != null && (t[e] = n);
};
const oh = (t, e, n) => {
  const o = Number(n);
  Number.isNaN(o) || (t[e] = o);
};
function sh(t) {
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
 */ function rh(t) {
  const e = t.toLowerCase();
  return eh[e] ?? e;
}
function ih(t) {
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
 */ function ah(t) {
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
 */ function ch(t) {
  return t.map((t) => {
    const e = t._getType;
    if (typeof e === "function") {
      const n = e.call(t);
      return { role: rh(n), content: sh(t.content) };
    }
    const n = t.constructor?.name;
    if (n) return { role: rh(ih(n)), content: sh(t.content) };
    if (t.type) {
      const e = String(t.type).toLowerCase();
      return { role: rh(e), content: sh(t.content) };
    }
    if (t.role) return { role: rh(String(t.role)), content: sh(t.content) };
    if (t.lc === 1 && t.kwargs) {
      const e = t.id;
      const n = Array.isArray(e) && e.length > 0 ? e[e.length - 1] : "";
      const o = typeof n === "string" ? ih(n) : "user";
      return { role: rh(o), content: sh(t.kwargs?.content) };
    }
    return { role: "user", content: sh(t.content) };
  });
}
function uh(t, e, n) {
  const o = {};
  const s = "kwargs" in t ? t.kwargs : void 0;
  const r = e?.temperature ?? n?.ls_temperature ?? s?.temperature;
  oh(o, Bf, r);
  const i = e?.max_tokens ?? n?.ls_max_tokens ?? s?.max_tokens;
  oh(o, Wf, i);
  const a = e?.top_p ?? s?.top_p;
  oh(o, Gf, a);
  const c = e?.frequency_penalty;
  oh(o, Vf, c);
  const u = e?.presence_penalty;
  oh(o, Kf, u);
  e && "stream" in e && nh(o, zf, Boolean(e.stream));
  return o;
}
function lh(t, e, n, o, s, r) {
  return {
    [qf]: sh(t ?? "langchain"),
    [rd]: n,
    [Jf]: sh(e),
    [$e]: th,
    ...uh(o, s, r),
  };
}
function ph(t, e, n, o, s) {
  const r = s?.ls_provider;
  const i = o?.model ?? s?.ls_model_name ?? "unknown";
  const a = lh(r, i, "pipeline", t, o, s);
  if (n && Array.isArray(e) && e.length > 0) {
    const t = e.map((t) => ({ role: "user", content: t }));
    nh(a, id, sh(t));
  }
  return a;
}
function fh(t, e, n, o, s) {
  const r = s?.ls_provider ?? t.id?.[2];
  const i = o?.model ?? s?.ls_model_name ?? "unknown";
  const a = lh(r, i, "chat", t, o, s);
  if (n && Array.isArray(e) && e.length > 0) {
    const t = ch(e.flat());
    const n = Vd(t);
    nh(a, id, sh(n));
  }
  return a;
}
function dh(t, e) {
  const n = [];
  const o = t.flat();
  for (const t of o) {
    const e = t.message?.content;
    if (Array.isArray(e))
      for (const t of e) {
        const e = t;
        e.type === "tool_use" && n.push(e);
      }
  }
  n.length > 0 && nh(e, ld, sh(n));
}
function mh(t, e) {
  if (!t) return;
  const n = t.tokenUsage;
  const o = t.usage;
  if (n) {
    oh(e, nd, n.promptTokens);
    oh(e, od, n.completionTokens);
    oh(e, sd, n.totalTokens);
  } else if (o) {
    oh(e, nd, o.input_tokens);
    oh(e, od, o.output_tokens);
    const t = Number(o.input_tokens);
    const n = Number(o.output_tokens);
    const s = (Number.isNaN(t) ? 0 : t) + (Number.isNaN(n) ? 0 : n);
    s > 0 && oh(e, sd, s);
    o.cache_creation_input_tokens !== void 0 &&
      oh(e, dd, o.cache_creation_input_tokens);
    o.cache_read_input_tokens !== void 0 &&
      oh(e, md, o.cache_read_input_tokens);
  }
}
function gh(t, e) {
  if (!t) return;
  const n = {};
  if (Array.isArray(t.generations)) {
    const o = t.generations
      .flat()
      .map((t) =>
        t.generationInfo?.finish_reason
          ? t.generationInfo.finish_reason
          : t.generation_info?.finish_reason
            ? t.generation_info.finish_reason
            : null,
      )
      .filter((t) => typeof t === "string");
    o.length > 0 && nh(n, Xf, sh(o));
    dh(t.generations, n);
    if (e) {
      const e = t.generations
        .flat()
        .map((t) => t.text ?? t.message?.content)
        .filter((t) => typeof t === "string");
      e.length > 0 && nh(n, ad, sh(e));
    }
  }
  mh(t.llmOutput, n);
  const o = t.llmOutput;
  const s = t.generations?.[0]?.[0];
  const r = s?.message;
  const i = o?.model_name ?? o?.model ?? r?.response_metadata?.model_name;
  i && nh(n, Qf, i);
  const a = o?.id ?? r?.id;
  a && nh(n, td, a);
  const c = o?.stop_reason ?? r?.response_metadata?.finish_reason;
  c && nh(n, ed, sh(c));
  return n;
}
function hh(t = {}) {
  const e = t.recordInputs ?? false;
  const n = t.recordOutputs ?? false;
  const o = new Map();
  const s = (t) => {
    const e = o.get(t);
    if (e?.isRecording()) {
      e.end();
      o.delete(t);
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
    handleLLMStart(t, n, s, r, i, a, c, u) {
      const l = ah(a);
      const p = ph(t, n, e, l, c);
      const f = p[Jf];
      const d = p[rd];
      Qo(
        {
          name: `${d} ${f}`,
          op: "gen_ai.pipeline",
          attributes: { ...p, [Ie]: "gen_ai.pipeline" },
        },
        (t) => {
          o.set(s, t);
          return t;
        },
      );
    },
    handleChatModelStart(t, n, s, r, i, a, c, u) {
      const l = ah(a);
      const p = fh(t, n, e, l, c);
      const f = p[Jf];
      const d = p[rd];
      Qo(
        {
          name: `${d} ${f}`,
          op: "gen_ai.chat",
          attributes: { ...p, [Ie]: "gen_ai.chat" },
        },
        (t) => {
          o.set(s, t);
          return t;
        },
      );
    },
    handleLLMEnd(t, e, r, i, a) {
      const c = o.get(e);
      if (c?.isRecording()) {
        const o = gh(t, n);
        o && c.setAttributes(o);
        s(e);
      }
    },
    handleLLMError(t, e) {
      const n = o.get(e);
      if (n?.isRecording()) {
        n.setStatus({ code: Be, message: "llm_error" });
        s(e);
      }
      Ys(t, { mechanism: { handled: false, type: `${th}.llm_error_handler` } });
    },
    handleChainStart(t, n, s, r) {
      const i = t.name || "unknown_chain";
      const a = { [$e]: "auto.ai.langchain", "langchain.chain.name": i };
      e && (a["langchain.chain.inputs"] = JSON.stringify(n));
      Qo(
        {
          name: `chain ${i}`,
          op: "gen_ai.invoke_agent",
          attributes: { ...a, [Ie]: "gen_ai.invoke_agent" },
        },
        (t) => {
          o.set(s, t);
          return t;
        },
      );
    },
    handleChainEnd(t, e) {
      const r = o.get(e);
      if (r?.isRecording()) {
        n && r.setAttributes({ "langchain.chain.outputs": JSON.stringify(t) });
        s(e);
      }
    },
    handleChainError(t, e) {
      const n = o.get(e);
      if (n?.isRecording()) {
        n.setStatus({ code: Be, message: "chain_error" });
        s(e);
      }
      Ys(t, {
        mechanism: { handled: false, type: `${th}.chain_error_handler` },
      });
    },
    handleToolStart(t, n, s, r) {
      const i = t.name || "unknown_tool";
      const a = { [$e]: th, "gen_ai.tool.name": i };
      e && (a["gen_ai.tool.input"] = n);
      Qo(
        {
          name: `execute_tool ${i}`,
          op: "gen_ai.execute_tool",
          attributes: { ...a, [Ie]: "gen_ai.execute_tool" },
        },
        (t) => {
          o.set(s, t);
          return t;
        },
      );
    },
    handleToolEnd(t, e) {
      const r = o.get(e);
      if (r?.isRecording()) {
        n && r.setAttributes({ "gen_ai.tool.output": JSON.stringify(t) });
        s(e);
      }
    },
    handleToolError(t, e) {
      const n = o.get(e);
      if (n?.isRecording()) {
        n.setStatus({ code: Be, message: "tool_error" });
        s(e);
      }
      Ys(t, {
        mechanism: { handled: false, type: `${th}.tool_error_handler` },
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
const _h = "LangGraph";
const yh = "auto.ai.langgraph";
function bh(t) {
  if (!t || t.length === 0) return null;
  const e = [];
  for (const n of t)
    if (n && typeof n === "object") {
      const t = n.tool_calls;
      t && Array.isArray(t) && e.push(...t);
    }
  return e.length > 0 ? e : null;
}
function vh(t) {
  const e = t;
  let n = 0;
  let o = 0;
  let s = 0;
  if (e.usage_metadata && typeof e.usage_metadata === "object") {
    const t = e.usage_metadata;
    typeof t.input_tokens === "number" && (n = t.input_tokens);
    typeof t.output_tokens === "number" && (o = t.output_tokens);
    typeof t.total_tokens === "number" && (s = t.total_tokens);
    return { inputTokens: n, outputTokens: o, totalTokens: s };
  }
  if (e.response_metadata && typeof e.response_metadata === "object") {
    const t = e.response_metadata;
    if (t.tokenUsage && typeof t.tokenUsage === "object") {
      const e = t.tokenUsage;
      typeof e.promptTokens === "number" && (n = e.promptTokens);
      typeof e.completionTokens === "number" && (o = e.completionTokens);
      typeof e.totalTokens === "number" && (s = e.totalTokens);
    }
  }
  return { inputTokens: n, outputTokens: o, totalTokens: s };
}
function Sh(t, e) {
  const n = e;
  if (n.response_metadata && typeof n.response_metadata === "object") {
    const e = n.response_metadata;
    e.model_name &&
      typeof e.model_name === "string" &&
      t.setAttribute(Qf, e.model_name);
    e.finish_reason &&
      typeof e.finish_reason === "string" &&
      t.setAttribute(Xf, [e.finish_reason]);
  }
}
function kh(t) {
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
function wh(t, e, n) {
  const o = n;
  const s = o?.messages;
  if (!s || !Array.isArray(s)) return;
  const r = e?.length ?? 0;
  const i = s.length > r ? s.slice(r) : [];
  if (i.length === 0) return;
  const a = bh(i);
  a && t.setAttribute(ld, JSON.stringify(a));
  const c = ch(i);
  t.setAttribute(ad, JSON.stringify(c));
  let u = 0;
  let l = 0;
  let p = 0;
  for (const e of i) {
    const n = vh(e);
    u += n.inputTokens;
    l += n.outputTokens;
    p += n.totalTokens;
    Sh(t, e);
  }
  u > 0 && t.setAttribute(nd, u);
  l > 0 && t.setAttribute(od, l);
  p > 0 && t.setAttribute(sd, p);
}
function xh(t, e) {
  return new Proxy(t, {
    apply(t, n, o) {
      return Xo(
        {
          op: "gen_ai.create_agent",
          name: "create_agent",
          attributes: {
            [$e]: yh,
            [Ie]: "gen_ai.create_agent",
            [rd]: "create_agent",
          },
        },
        (s) => {
          try {
            const r = Reflect.apply(t, n, o);
            const i = o.length > 0 ? o[0] : {};
            if (i?.name && typeof i.name === "string") {
              s.setAttribute(pd, i.name);
              s.updateName(`create_agent ${i.name}`);
            }
            const a = r.invoke;
            a && typeof a === "function" && (r.invoke = Eh(a.bind(r), r, i, e));
            return r;
          } catch (t) {
            s.setStatus({ code: Be, message: "internal_error" });
            Ys(t, {
              mechanism: { handled: false, type: "auto.ai.langgraph.error" },
            });
            throw t;
          }
        },
      );
    },
  });
}
function Eh(t, e, n, o) {
  return new Proxy(t, {
    apply(t, s, r) {
      return Xo(
        {
          op: "gen_ai.invoke_agent",
          name: "invoke_agent",
          attributes: { [$e]: yh, [Ie]: _d, [rd]: "invoke_agent" },
        },
        async (i) => {
          try {
            const a = n?.name;
            if (a && typeof a === "string") {
              i.setAttribute(fd, a);
              i.setAttribute(pd, a);
              i.updateName(`invoke_agent ${a}`);
            }
            const c = kh(e);
            c && i.setAttribute(cd, JSON.stringify(c));
            const u = o.recordInputs;
            const l = o.recordOutputs;
            const p = r.length > 0 ? (r[0].messages ?? []) : [];
            if (p && u) {
              const t = ch(p);
              const e = Vd(t);
              i.setAttribute(id, JSON.stringify(e));
            }
            const f = await Reflect.apply(t, s, r);
            l && wh(i, p ?? null, f);
            return f;
          } catch (t) {
            i.setStatus({ code: Be, message: "internal_error" });
            Ys(t, {
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
 */ function Ah(t, e) {
  const n = e || {};
  t.compile = xh(t.compile.bind(t), n);
  return t;
}
function Th(t) {
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
const Ih = e;
/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */ function $h() {
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
 */ function Oh() {
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
 */ function Ch() {
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
 */ function jh() {
  return "history" in Ih && !!Ih.history;
}
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ const Nh = Ph;
function Ph() {
  if (!("fetch" in Ih)) return false;
  try {
    new Headers();
    new Request("data:,");
    new Response();
    return true;
  } catch {
    return false;
  }
}
function Mh(t) {
  return (
    t && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(t.toString())
  );
}
/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */ function Rh() {
  if (typeof EdgeRuntime === "string") return true;
  if (!Ph()) return false;
  if (Mh(Ih.fetch)) return true;
  let e = false;
  const n = Ih.document;
  if (n && typeof n.createElement === "function")
    try {
      const t = n.createElement("iframe");
      t.hidden = true;
      n.head.appendChild(t);
      t.contentWindow?.fetch && (e = Mh(t.contentWindow.fetch));
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
 */ function Dh() {
  return "ReportingObserver" in Ih;
}
/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ function Fh() {
  if (!Ph()) return false;
  try {
    new Request("_", { referrerPolicy: "origin" });
    return true;
  } catch {
    return false;
  }
}
function Lh(t, e) {
  const n = "fetch";
  N(n, t);
  M(n, () => qh(void 0, e));
}
function Uh(t) {
  const e = "fetch-body-resolved";
  N(e, t);
  M(e, () => qh(zh));
}
function qh(t, n = false) {
  (n && !Rh()) ||
    dt(e, "fetch", function (n) {
      return function (...o) {
        const s = new Error();
        const { method: r, url: i } = Vh(o);
        const a = {
          args: o,
          fetchData: { method: r, url: i },
          startTimestamp: Gt() * 1e3,
          virtualError: s,
          headers: Kh(o),
        };
        t || R("fetch", { ...a });
        return n.apply(e, o).then(
          async (e) => {
            t
              ? t(e)
              : R("fetch", { ...a, endTimestamp: Gt() * 1e3, response: e });
            return e;
          },
          (t) => {
            R("fetch", { ...a, endTimestamp: Gt() * 1e3, error: t });
            if (B(t) && t.stack === void 0) {
              t.stack = s.stack;
              mt(t, "framesToPop", 1);
            }
            if (
              t instanceof TypeError &&
              (t.message === "Failed to fetch" ||
                t.message === "Load failed" ||
                t.message === "NetworkError when attempting to fetch resource.")
            )
              try {
                const e = new URL(a.fetchData.url);
                t.message = `${t.message} (${e.host})`;
              } catch {}
            throw t;
          },
        );
      };
    });
}
async function Jh(t, e) {
  if (t?.body) {
    const n = t.body;
    const o = n.getReader();
    const s = setTimeout(() => {
      n.cancel().then(null, () => {});
    }, 9e4);
    let r = true;
    while (r) {
      let t;
      try {
        t = setTimeout(() => {
          n.cancel().then(null, () => {});
        }, 5e3);
        const { done: s } = await o.read();
        clearTimeout(t);
        if (s) {
          e();
          r = false;
        }
      } catch {
        r = false;
      } finally {
        clearTimeout(t);
      }
    }
    clearTimeout(s);
    o.releaseLock();
    n.cancel().then(null, () => {});
  }
}
function zh(t) {
  let e;
  try {
    e = t.clone();
  } catch {
    return;
  }
  Jh(e, () => {
    R("fetch-body-resolved", { endTimestamp: Gt() * 1e3, response: t });
  });
}
function Bh(t, e) {
  return !!t && typeof t === "object" && !!t[e];
}
function Wh(t) {
  return typeof t === "string"
    ? t
    : t
      ? Bh(t, "url")
        ? t.url
        : t.toString
          ? t.toString()
          : ""
      : "";
}
function Vh(t) {
  if (t.length === 0) return { method: "GET", url: "" };
  if (t.length === 2) {
    const [e, n] = t;
    return {
      url: Wh(e),
      method: Bh(n, "method")
        ? String(n.method).toUpperCase()
        : it(e) && Bh(e, "method")
          ? String(e.method).toUpperCase()
          : "GET",
    };
  }
  const e = t[0];
  return {
    url: Wh(e),
    method: Bh(e, "method") ? String(e.method).toUpperCase() : "GET",
  };
}
function Kh(t) {
  const [e, n] = t;
  try {
    if (typeof n === "object" && n !== null && "headers" in n && n.headers)
      return new Headers(n.headers);
    if (it(e)) return new Headers(e.headers);
  } catch {}
}
/**
 * Figures out if we're building a browser bundle.
 *
 * @returns true if this is a browser bundle build.
 */ function Gh() {
  return (
    typeof __SENTRY_BROWSER_BUNDLE__ !== "undefined" &&
    !!__SENTRY_BROWSER_BUNDLE__
  );
}
function Hh() {
  return "npm";
}
/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */ function Zh() {
  return (
    !Gh() &&
    Object.prototype.toString.call(
      typeof process !== "undefined" ? process : 0,
    ) === "[object process]"
  );
}
/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */ function Yh(t, e) {
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
 */ function Xh(t, e = module) {
  let n;
  try {
    n = Yh(e, t);
  } catch {}
  if (!n)
    try {
      const { cwd: o } = Yh(e, "process");
      n = Yh(e, `${o()}/node_modules/${t}`);
    } catch {}
  return n;
}
function Qh() {
  return typeof window !== "undefined" && (!Zh() || t_());
}
function t_() {
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
 */ function e_(t, e, n) {
  const o = t[e];
  if (typeof o === "function") {
    try {
      t[e] = n;
    } catch (o) {
      Object.defineProperty(t, e, {
        value: n,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    if (t.default === o)
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
function n_(t, e = false) {
  const n =
    e ||
    (t &&
      !t.startsWith("/") &&
      !t.match(/^[A-Z]:/) &&
      !t.startsWith(".") &&
      !t.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//));
  return !n && t !== void 0 && !t.includes("node_modules/");
}
function o_(t) {
  const e = /^\s*[-]{4,}$/;
  const n = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
  const o = /at (?:async )?(.+?) \(data:(.*?),/;
  return (s) => {
    const r = s.match(o);
    if (r) return { filename: `<data:${r[2]}>`, function: r[1] };
    const i = s.match(n);
    if (i) {
      let e;
      let n;
      let o;
      let s;
      let r;
      if (i[1]) {
        o = i[1];
        let t = o.lastIndexOf(".");
        o[t - 1] === "." && t--;
        if (t > 0) {
          e = o.slice(0, t);
          n = o.slice(t + 1);
          const s = e.indexOf(".Module");
          if (s > 0) {
            o = o.slice(s + 1);
            e = e.slice(0, s);
          }
        }
        s = void 0;
      }
      if (n) {
        s = e;
        r = n;
      }
      if (n === "<anonymous>") {
        r = void 0;
        o = void 0;
      }
      if (o === void 0) {
        r = r || v;
        o = s ? `${s}.${r}` : r;
      }
      let a = i[2]?.startsWith("file://") ? i[2].slice(7) : i[2];
      const c = i[5] === "native";
      a?.match(/\/[A-Z]:/) && (a = a.slice(1));
      a || !i[5] || c || (a = i[5]);
      return {
        filename: a ? decodeURI(a) : void 0,
        module: t ? t(a) : void 0,
        function: o,
        lineno: r_(i[3]),
        colno: r_(i[4]),
        in_app: n_(a || "", c),
      };
    }
    return s.match(e) ? { filename: s } : void 0;
  };
}
function s_(t) {
  return [90, o_(t)];
}
function r_(t) {
  return parseInt(t || "", 10) || void 0;
}
/**
 * A node.js watchdog timer
 * @param pollInterval The interval that we expect to get polled at
 * @param anrThreshold The threshold for when we consider ANR
 * @param callback The callback to call for ANR
 * @returns An object with `poll` and `enabled` functions {@link WatchdogReturn}
 */ function i_(t, e, n, o) {
  const s = t();
  let r = false;
  let i = true;
  setInterval(() => {
    const t = s.getTimeMs();
    if (r === false && t > e + n) {
      r = true;
      i && o();
    }
    t < e + n && (r = false);
  }, 20);
  return {
    poll: () => {
      s.reset();
    },
    enabled: (t) => {
      i = t;
    },
  };
}
function a_(t, e, n) {
  const o = e ? e.replace(/^file:\/\//, "") : void 0;
  const s = t.location.columnNumber ? t.location.columnNumber + 1 : void 0;
  const r = t.location.lineNumber ? t.location.lineNumber + 1 : void 0;
  return {
    filename: o,
    module: n(o),
    function: t.functionName || v,
    colno: s,
    lineno: r,
    in_app: o ? n_(o) : void 0,
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
function c_(t) {
  const n = e[Symbol.for("@vercel/request-context")];
  const o = n?.get?.();
  o?.waitUntil && o.waitUntil(t);
}
async function u_(t) {
  try {
    y.log("Flushing events...");
    await ur(t);
    y.log("Done flushing events");
  } catch (t) {
    y.log("Error while flushing events:\n", t);
  }
}
async function l_(t = {}) {
  const { timeout: n = 2e3 } = t;
  if (
    "cloudflareWaitUntil" in t &&
    typeof t?.cloudflareWaitUntil === "function"
  ) {
    t.cloudflareWaitUntil(u_(n));
    return;
  }
  if (
    "cloudflareCtx" in t &&
    typeof t.cloudflareCtx?.waitUntil === "function"
  ) {
    t.cloudflareCtx.waitUntil(u_(n));
    return;
  }
  if (e[Symbol.for("@vercel/request-context")]) {
    c_(u_(n));
    return;
  }
  if (typeof process === "undefined") return;
  const o =
    !!process.env.FUNCTIONS_WORKER_RUNTIME ||
    !!process.env.LAMBDA_TASK_ROOT ||
    !!process.env.K_SERVICE ||
    !!process.env.CF_PAGES ||
    !!process.env.VERCEL ||
    !!process.env.NETLIFY;
  o && (await u_(n));
}
/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */ function p_(t) {
  return t.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
export {
  _g as ANTHROPIC_AI_INTEGRATION_NAME,
  i as CONSOLE_LEVELS,
  Client,
  oo as DEFAULT_ENVIRONMENT,
  ui as DEFAULT_RETRY_AFTER,
  e as GLOBAL_OBJ,
  jg as GOOGLE_GENAI_INTEGRATION_NAME,
  Qg as LANGCHAIN_INTEGRATION_NAME,
  _h as LANGGRAPH_INTEGRATION_NAME,
  LRUMap,
  en as MAX_BAGGAGE_STRING_LENGTH,
  oa as MULTIPLEXED_TRANSPORT_EXTRA_KEY,
  Pm as OPENAI_INTEGRATION_NAME,
  n as SDK_VERSION,
  Re as SEMANTIC_ATTRIBUTE_CACHE_HIT,
  Fe as SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE,
  De as SEMANTIC_ATTRIBUTE_CACHE_KEY,
  Me as SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME,
  Le as SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD,
  Pe as SEMANTIC_ATTRIBUTE_PROFILE_ID,
  Ne as SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME,
  Oe as SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON,
  Ce as SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT,
  je as SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE,
  Ie as SEMANTIC_ATTRIBUTE_SENTRY_OP,
  $e as SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  Te as SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE,
  Ae as SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE,
  Ee as SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  Ue as SEMANTIC_ATTRIBUTE_URL_FULL,
  qe as SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE,
  Qe as SENTRY_BAGGAGE_KEY_PREFIX,
  tn as SENTRY_BAGGAGE_KEY_PREFIX_REGEX,
  ai as SENTRY_BUFFER_FULL_ERROR,
  Be as SPAN_STATUS_ERROR,
  ze as SPAN_STATUS_OK,
  Je as SPAN_STATUS_UNSET,
  Scope,
  SentryError,
  SentryNonRecordingSpan,
  SentrySpan,
  ServerRuntimeClient,
  SyncPromise,
  bn as TRACEPARENT_REGEXP,
  fs as TRACING_DEFAULTS,
  v as UNKNOWN_FUNCTION,
  tl as _INTERNAL_FLAG_BUFFER_SIZE,
  el as _INTERNAL_MAX_FLAGS_PER_SPAN,
  il as _INTERNAL_addFeatureFlagToActiveSpan,
  zr as _INTERNAL_captureLog,
  ni as _INTERNAL_captureMetric,
  Jr as _INTERNAL_captureSerializedLog,
  Qr as _INTERNAL_captureSerializedMetric,
  vm as _INTERNAL_cleanupToolCallSpan,
  pa as _INTERNAL_clearAiProviderSkips,
  ol as _INTERNAL_copyFlagsFromScopeToEvent,
  Br as _INTERNAL_flushLogsBuffer,
  oi as _INTERNAL_flushMetricsBuffer,
  bm as _INTERNAL_getSpanForToolCallId,
  sl as _INTERNAL_insertFlagToScope,
  ie as _INTERNAL_setSpanForScope,
  la as _INTERNAL_shouldSkipAiProviderWrapping,
  ua as _INTERNAL_skipAiProviderWrapping,
  Ia as addAutoIpAddressToSession,
  Ta as addAutoIpAddressToUser,
  Ga as addBreadcrumb,
  zn as addChildSpanToSpan,
  Uc as addConsoleInstrumentationHandler,
  qt as addContextToFrame,
  dr as addEventProcessor,
  Dt as addExceptionMechanism,
  Rt as addExceptionTypeValue,
  Uh as addFetchEndInstrumentationHandler,
  Lh as addFetchInstrumentationHandler,
  F as addGlobalErrorInstrumentationHandler,
  q as addGlobalUnhandledRejectionInstrumentationHandler,
  N as addHandler,
  Or as addIntegration,
  So as addItemToEnvelope,
  mt as addNonEnumerableProperty,
  Cm as addVercelAiProcessors,
  dc as applyAggregateErrorsToEvent,
  As as applyScopeDataToEvent,
  $a as applySdkMetadata,
  nn as baggageHeaderToDynamicSamplingContext,
  _u as basename,
  Yt as browserPerformanceTimeOrigin,
  a_ as callFrameToStackFrame,
  ar as captureCheckIn,
  Wc as captureConsoleIntegration,
  Qs as captureEvent,
  Ys as captureException,
  df as captureFeedback,
  Xs as captureMessage,
  _r as captureSession,
  Jt as checkOrSetAlreadyCaught,
  lr as close,
  te as closeSession,
  Yu as consoleIntegration,
  $f as consoleLoggingIntegration,
  u as consoleSandbox,
  es as continueTrace,
  Nn as convertSpanLinksForEnvelope,
  _t as convertToPlainObject,
  Oo as createAttachmentEnvelopeItem,
  Li as createCheckInEnvelope,
  hi as createClientReportEnvelope,
  Rf as createConsolaReporter,
  vo as createEnvelope,
  Do as createEventEnvelope,
  Po as createEventEnvelopeHeaders,
  hh as createLangChainCallbackHandler,
  Ro as createSessionEnvelope,
  Fo as createSpanEnvelope,
  $o as createSpanEnvelopeItem,
  w as createStackParser,
  gi as createTransport,
  Wt as dateTimestampInSeconds,
  Pa as debounce,
  y as debug,
  Hc as dedupeIntegration,
  Cr as defineIntegration,
  hu as dirname,
  pi as disabledUntil,
  St as dropUndefinedKeys,
  fn as dsnFromString,
  pn as dsnToString,
  on as dynamicSamplingContextToSentryBaggageHeader,
  gr as endSession,
  wo as envelopeContainsItemType,
  jo as envelopeItemTypeToDataCategory,
  p_ as escapeStringForRegex,
  nc as eventFiltersIntegration,
  Hi as eventFromMessage,
  Gi as eventFromUnknownInput,
  zi as exceptionFromError,
  su as extraErrorDataIntegration,
  vt as extractExceptionKeysForMessage,
  Va as extractQueryParamsFromUrl,
  vn as extractTraceparentData,
  al as featureFlagsIntegration,
  n_ as filenameIsInApp,
  dt as fill,
  ur as flush,
  l_ as flushIfServerless,
  Aa as fmt,
  ko as forEachEnvelopeItem,
  Qa as functionToStringIntegration,
  kn as generateSentryTraceHeader,
  se as generateSpanId,
  oe as generateTraceId,
  wn as generateTraceparentHeader,
  Kn as getActiveSpan,
  Th as getBreadcrumbLogLevelFromHttpStatusCode,
  Xe as getCapturedScopesOnSpan,
  we as getClient,
  ft as getComponentName,
  ye as getCurrentScope,
  Ls as getDebugImagesForResources,
  ue as getDefaultCurrentScope,
  le as getDefaultIsolationScope,
  io as getDynamicSamplingContextFromClient,
  ao as getDynamicSamplingContextFromScope,
  co as getDynamicSamplingContextFromSpan,
  kr as getEnvelopeEndpointWithUrlEncodedAuth,
  Mt as getEventDescription,
  Fs as getFilenameToDebugIdMap,
  $ as getFramesFromEvent,
  I as getFunctionName,
  ve as getGlobalScope,
  r as getGlobalSingleton,
  _a as getHttpSpanDetailsFromUrlObject,
  Ar as getIntegrationsToSetup,
  be as getIsolationScope,
  pt as getLocationHref,
  o as getMainCarrier,
  ht as getOriginalFunction,
  wr as getReportDialogEndpoint,
  Vn as getRootSpan,
  Hh as getSDKSource,
  va as getSanitizedUrlString,
  ga as getSanitizedUrlStringFromUrlObject,
  No as getSdkMetadataForEnvelopeHeader,
  Wn as getSpanDescendants,
  We as getSpanStatusFromHttpCode,
  Un as getStatusMessage,
  xe as getTraceContextFromScope,
  Oa as getTraceData,
  Na as getTraceMetaTags,
  cl as growthbookIntegration,
  Go as handleCallbackErrors,
  Xn as hasSpansEnabled,
  Ra as headersToDict,
  ut as htmlTreeAsString,
  Ja as httpHeadersToSpanAttributes,
  Fa as httpRequestToRequestData,
  oc as inboundFiltersIntegration,
  Yi as initAndBind,
  xr as installedIntegrations,
  Cg as instrumentAnthropicAiClient,
  ml as instrumentFetchRequest,
  Xg as instrumentGoogleGenAIClient,
  Ah as instrumentLangGraph,
  ag as instrumentOpenAiClient,
  xh as instrumentStateGraphCompile,
  Pu as instrumentSupabaseClient,
  mu as isAbsolute,
  Qh as isBrowser,
  Gh as isBrowserBundle,
  K as isDOMError,
  G as isDOMException,
  tt as isElement,
  fr as isEnabled,
  B as isError,
  V as isErrorEvent,
  Q as isEvent,
  pr as isInitialized,
  st as isInstanceOf,
  It as isMatchingPattern,
  Mh as isNativeFunction,
  Zh as isNodeEnv,
  Z as isParameterizedString,
  X as isPlainObject,
  Y as isPrimitive,
  fi as isRateLimited,
  et as isRegExp,
  Sa as isSentryRequestUrl,
  H as isString,
  ot as isSyntheticEvent,
  nt as isThenable,
  da as isURLObjectRelative,
  rt as isVueViewModel,
  gu as join,
  ir as lastEventId,
  Sc as linkedErrorsIntegration,
  Xh as loadModule,
  Uo as logSpanEnd,
  Lo as logSpanStart,
  Sf as logger,
  _n as makeDsn,
  aa as makeMultiplexedTransport,
  na as makeOfflineTransport,
  ci as makePromiseBuffer,
  Xt as makeSession,
  gt as markFunctionWrapped,
  M as maybeInstrument,
  Ts as mergeScopeData,
  Pf as metrics,
  Ic as moduleMetadataIntegration,
  o_ as node,
  s_ as nodeStackLineParser,
  lo as normalize,
  du as normalizePath,
  po as normalizeToSize,
  yo as normalizeUrlToBase,
  xs as notifyEventProcessors,
  an as objectToBaggageHeader,
  xt as objectify,
  c as originalConsoleMethods,
  Ea as parameterize,
  sn as parseBaggageHeader,
  Io as parseEnvelope,
  li as parseRetryAfterHeader,
  yn as parseSampleRate,
  Ut as parseSemver,
  Ji as parseStackFrames,
  ma as parseStringToURLObject,
  ya as parseUrl,
  Us as prepareEvent,
  dl as profiler,
  Sn as propagationContextFromHeaders,
  Yn as registerSpanErrorInstrumentation,
  ws as rejectedSyncPromise,
  fu as relative,
  e_ as replaceExports,
  Dc as requestDataIntegration,
  P as resetInstrumentationHandlers,
  lu as resolve,
  ks as resolvedSyncPromise,
  bu as rewriteFramesIntegration,
  Tt as safeJoin,
  Zo as sampleSpan,
  Ao as serializeEnvelope,
  he as setAsyncContextStrategy,
  Ye as setCapturedScopesOnSpan,
  tr as setContext,
  Xi as setCurrentClient,
  nr as setExtra,
  er as setExtras,
  Ve as setHttpStatus,
  qo as setMeasurement,
  sr as setTag,
  or as setTags,
  rr as setUser,
  Jc as severityLevelFromString,
  En as shouldContinueTrace,
  At as snipLine,
  Ln as spanIsSampled,
  Pn as spanTimeInputToSeconds,
  uo as spanToBaggageHeader,
  Rn as spanToJSON,
  On as spanToTraceContext,
  Cn as spanToTraceHeader,
  x as stackParserFromStackParserOptions,
  _s as startIdleSpan,
  ts as startInactiveSpan,
  ss as startNewTrace,
  mr as startSession,
  Xo as startSpan,
  Qo as startSpanManual,
  $t as stringMatchesSomePattern,
  E as stripSentryFramesAndReverse,
  ba as stripUrlQueryAndFragment,
  Du as supabaseIntegration,
  Oh as supportsDOMError,
  Ch as supportsDOMException,
  $h as supportsErrorEvent,
  Nh as supportsFetch,
  jh as supportsHistory,
  Rh as supportsNativeFetch,
  Fh as supportsReferrerPolicy,
  Dh as supportsReportingObserver,
  os as suppressTracing,
  Ku as thirdPartyErrorFilterIntegration,
  Jo as timedEventsToMeasurements,
  Gt as timestampInSeconds,
  R as triggerHandlers,
  xl as trpcMiddleware,
  Et as truncate,
  di as updateRateLimits,
  Qt as updateSession,
  Hn as updateSpanName,
  Nt as uuid4,
  c_ as vercelWaitUntil,
  i_ as watchdogTimer,
  Ma as winterCGHeadersToDict,
  Da as winterCGRequestToRequestData,
  ns as withActiveSpan,
  ke as withIsolationScope,
  cr as withMonitor,
  Se as withScope,
  ff as wrapMcpServerWithSentry,
  Vu as zodErrorsIntegration,
};
