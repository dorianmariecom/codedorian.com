// @sentry/core@10.30.0 downloaded from https://ga.jspm.io/npm:@sentry/core@10.30.0/build/esm/index.js

const t = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
const e = globalThis;
const n = "10.30.0";
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
    return E(o.slice(s));
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
const N = {};
function j(t, e) {
  C[t] = C[t] || [];
  C[t].push(e);
}
function P() {
  Object.keys(C).forEach((t) => {
    C[t] = void 0;
  });
}
function M(e, n) {
  if (!N[e]) {
    N[e] = true;
    try {
      n();
    } catch (n) {
      t && y.error(`Error while instrumenting ${e}`, n);
    }
  }
}
function R(e, n) {
  const s = e && C[e];
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
let D = null;
function F(t) {
  const e = "error";
  j(e, t);
  M(e, L);
}
function L() {
  D = e.onerror;
  e.onerror = function (t, e, n, s, o) {
    const r = { column: s, error: o, line: n, msg: t, url: e };
    R("error", r);
    return !!D && D.apply(this, arguments);
  };
  e.onerror.__SENTRY_INSTRUMENTED__ = true;
}
let U = null;
function q(t) {
  const e = "unhandledrejection";
  j(e, t);
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
      return ot(t, Error);
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
  return typeof Event !== "undefined" && ot(t, Event);
}
/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function tt(t) {
  return typeof Element !== "undefined" && ot(t, Element);
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
 */ function st(t) {
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
 */ function ot(t, e) {
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
  return typeof Request !== "undefined" && ot(t, Request);
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
    const s = 5;
    const o = [];
    let r = 0;
    let i = 0;
    const a = " > ";
    const c = a.length;
    let u;
    const l = Array.isArray(e) ? e : e.keyAttrs;
    const p = (!Array.isArray(e) && e.maxStringLength) || ct;
    while (n && r++ < s) {
      u = lt(n, l);
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
 */ function lt(t, e) {
  const n = t;
  const s = [];
  if (!n?.tagName) return "";
  if (at.HTMLElement && n instanceof HTMLElement && n.dataset) {
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
    if (t && H(t)) {
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
 */ function dt(e, n, s) {
  if (!(n in e)) return;
  const o = e[n];
  if (typeof o !== "function") return;
  const r = s(o);
  typeof r === "function" && gt(r, o);
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
 */ function mt(e, n, s) {
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
      ot(t, CustomEvent) &&
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
    const s = Object.keys(t);
    s.forEach((s) => {
      const o = t[s];
      o !== void 0 && (n[s] = kt(o, e));
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
 */ function Tt(t, e) {
  if (!Array.isArray(t)) return "";
  const n = [];
  for (let e = 0; e < t.length; e++) {
    const s = t[e];
    try {
      rt(s) ? n.push(O(s)) : n.push(String(s));
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
function Nt() {
  return Math.random() * 16;
}
/**
 * UUID4 generator
 * @param crypto Object that provides the crypto API.
 * @returns string Generated UUID4.
 */ function jt(t = Ot()) {
  try {
    if (t?.randomUUID) return t.randomUUID().replace(/-/g, "");
  } catch {}
  Ct || (Ct = [1e7] + 1e3 + 4e3 + 8e3 + 1e11);
  return Ct.replace(/[018]/g, (t) =>
    (t ^ ((Nt() & 15) >> (t / 4))).toString(16),
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
  const s = Pt(t);
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
 */ function Rt(t, e, n) {
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
 */ function Dt(t, e) {
  const n = Pt(t);
  if (!n) return;
  const s = { type: "generic", handled: true };
  const o = n.mechanism;
  n.mechanism = { ...s, ...o, ...e };
  if (e && "data" in e) {
    const t = { ...o?.data, ...e.data };
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
  const s = Lt(e[2]);
  const o = Lt(e[3]);
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
 */ function qt(t, e, n = 5) {
  if (e.lineno === void 0) return;
  const s = t.length;
  const o = Math.max(Math.min(s - 1, e.lineno - 1), 0);
  e.pre_context = t.slice(Math.max(0, o - n), o).map((t) => At(t, 0));
  const r = Math.min(s - 1, o);
  e.context_line = At(t[r], e.colno || 0);
  e.post_context = t.slice(Math.min(o + 1, s), o + 1 + n).map((t) => At(t, 0));
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
  const s = t.now();
  const o = Date.now();
  const r = t.timeOrigin ? Math.abs(t.timeOrigin + s - o) : n;
  const i = r < n;
  const a = t.timing?.navigationStart;
  const c = typeof a === "number";
  const u = c ? Math.abs(a + s - o) : n;
  const l = u < n;
  return i || l
    ? r <= u
      ? [t.timeOrigin, "timeOrigin"]
      : [a, "navigationStart"]
    : [o, "dateNow"];
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
    sid: jt(),
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
  e.sid && (t.sid = e.sid.length === 32 ? e.sid : jt());
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
  const s = { ...t };
  for (const t in e)
    Object.prototype.hasOwnProperty.call(e, t) &&
      (s[t] = ne(s[t], e[t], n - 1));
  return s;
}
function se() {
  return jt();
}
function oe() {
  return jt().substring(16);
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
    this._propagationContext = { traceId: se(), sampleRand: Math.random() };
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
   * TODO:
   * Currently, these attributes are not applied to any telemetry data but they will be in the future.
   *
   * @param newAttributes - The attributes to set on the scope. You can either pass in key-value pairs, or
   * an object with a `value` and an optional `unit` (if applicable to your attribute).
   *
   * @example
   * ```typescript
   * scope.setAttributes({
   *   is_admin: true,
   *   payment_selection: 'credit_card',
   *   clicked_products: [130, 554, 292],
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
   * TODO:
   * Currently, these attributes are not applied to any telemetry data but they will be in the future.
   *
   * @param key - The attribute key.
   * @param value - the attribute value. You can either pass in a raw value, or an attribute
   * object with a `value` and an optional `unit` (if applicable to your attribute).
   *
   * @example
   * ```typescript
   * scope.setAttribute('is_admin', true);
   * scope.setAttribute('clicked_products', [130, 554, 292]);
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
      tags: s,
      attributes: o,
      extra: r,
      user: i,
      contexts: a,
      level: c,
      fingerprint: u = [],
      propagationContext: l,
    } = n || {};
    this._tags = { ...this._tags, ...s };
    this._attributes = { ...this._attributes, ...o };
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
    this.setPropagationContext({ traceId: se(), sampleRand: Math.random() });
    this._notifyScopeListeners();
    return this;
  }
  addBreadcrumb(t, e) {
    const n = typeof e === "number" ? e : ce;
    if (n <= 0) return this;
    const s = {
      timestamp: Wt(),
      ...t,
      message: t.message ? Et(t.message, 2048) : t.message,
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
    const s = n?.event_id || jt();
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
    const o = s?.event_id || jt();
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
    const s = n?.event_id || jt();
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
  const t = s();
  const e = o(t);
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
  const e = s();
  const n = o(e);
  n.acs = t;
}
function _e(t) {
  const e = o(t);
  return e.acs ? e.acs : ge();
}
function ye() {
  const t = s();
  const e = _e(t);
  return e.getCurrentScope();
}
function be() {
  const t = s();
  const e = _e(t);
  return e.getIsolationScope();
}
function ve() {
  return r("globalScope", () => new Scope());
}
function Se(...t) {
  const e = s();
  const n = _e(e);
  if (t.length === 2) {
    const [e, s] = t;
    return e ? n.withSetScope(e, s) : n.withScope(s);
  }
  return n.withScope(t[0]);
}
function ke(...t) {
  const e = s();
  const n = _e(e);
  if (t.length === 2) {
    const [e, s] = t;
    return e ? n.withSetIsolationScope(e, s) : n.withIsolationScope(s);
  }
  return n.withIsolationScope(t[0]);
}
function we() {
  return ye().getClient();
}
function xe(t) {
  const e = t.getPropagationContext();
  const { traceId: n, parentSpanId: s, propagationSpanId: o } = e;
  const r = { trace_id: n, span_id: o || oe() };
  s && (r.parent_span_id = s);
  return r;
}
const Ee = "sentry.source";
const Ae = "sentry.sample_rate";
const Te = "sentry.previous_trace_sample_rate";
const Ie = "sentry.op";
const $e = "sentry.origin";
const Oe = "sentry.idle_span_finish_reason";
const Ce = "sentry.measurement_unit";
const Ne = "sentry.measurement_value";
const je = "sentry.custom_span_name";
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
  const e = on(t);
  if (!e) return;
  const n = Object.entries(e).reduce((t, [e, n]) => {
    if (e.match(tn)) {
      const s = e.slice(Qe.length);
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
 */ function sn(t) {
  if (!t) return;
  const e = Object.entries(t).reduce((t, [e, n]) => {
    n && (t[`${Qe}${e}`] = n);
    return t;
  }, {});
  return an(e);
}
function on(t) {
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
 */ function an(e) {
  if (Object.keys(e).length !== 0)
    return Object.entries(e).reduce((e, [n, s], o) => {
      const r = `${encodeURIComponent(n)}=${encodeURIComponent(s)}`;
      const i = o === 0 ? r : `${e},${r}`;
      if (i.length > en) {
        t &&
          y.warn(
            `Not adding key: ${n} with val: ${s} to baggage header due to exceeding baggage size limits.`,
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
 */ function fn(t) {
  const e = un.exec(t);
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
  return dn({
    host: r,
    pass: o,
    path: c,
    projectId: l,
    port: i,
    protocol: n,
    publicKey: s,
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
  if (!ln(o)) {
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
 */ function gn(t) {
  const e = t.match(cn);
  return e?.[1];
}
function hn(t) {
  const e = t.getOptions();
  const { host: n } = t.getDsn() || {};
  let s;
  e.orgId ? (s = String(e.orgId)) : n && (s = gn(n));
  return s;
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
  const s = nn(e);
  if (!n?.traceId) return { traceId: se(), sampleRand: Math.random() };
  const o = xn(n, s);
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
function kn(t = se(), e = oe(), n) {
  let s = "";
  n !== void 0 && (s = n ? "-1" : "-0");
  return `${t}-${e}${s}`;
}
function wn(t = se(), e = oe(), n) {
  return `00-${t}-${e}-${n ? "01" : "00"}`;
}
function xn(t, e) {
  const n = yn(e?.sample_rand);
  if (n !== void 0) return n;
  const s = yn(e?.sample_rate);
  return s && t?.parentSampled !== void 0
    ? t.parentSampled
      ? Math.random() * s
      : s + Math.random() * (1 - s)
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
  const s = t.getOptions().strictTraceContinuation || false;
  if (s && ((e && !n) || (!e && n))) {
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
    data: s,
    op: o,
    parent_span_id: r,
    status: i,
    origin: a,
    links: c,
  } = Rn(t);
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
function On(t) {
  const { spanId: e, traceId: n, isRemote: s } = t.spanContext();
  const o = s ? e : Rn(t).parent_span_id;
  const r = Xe(t).scope;
  const i = s ? r?.getPropagationContext().propagationSpanId || oe() : e;
  return { parent_span_id: o, span_id: i, trace_id: n };
}
function Cn(t) {
  const { traceId: e, spanId: n } = t.spanContext();
  const s = Ln(t);
  return kn(e, n, s);
}
function Nn(t) {
  const { traceId: e, spanId: n } = t.spanContext();
  const s = Ln(t);
  return wn(e, n, s);
}
function jn(t) {
  return t && t.length > 0
    ? t.map(
        ({
          context: { spanId: t, traceId: e, traceFlags: n, ...s },
          attributes: o,
        }) => ({
          span_id: t,
          trace_id: e,
          sampled: n === Tn,
          attributes: o,
          ...s,
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
      start_timestamp: Pn(o),
      timestamp: Pn(i) || void 0,
      status: Un(a),
      op: s[Ie],
      origin: s[$e],
      links: jn(c),
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
      const s = t[qn] ? Array.from(t[qn]) : [];
      for (const t of s) n(t);
    }
  }
  n(t);
  return Array.from(e);
}
function Vn(t) {
  return t[Jn] || t;
}
function Kn() {
  const t = s();
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
  t.setAttributes({ [Ee]: "custom", [je]: e });
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
function ts(e, n) {
  if (!n?.length || !e.description) return false;
  for (const s of n) {
    if (ns(s)) {
      if (It(e.description, s)) {
        t && Qn(e);
        return true;
      }
      continue;
    }
    if (!s.name && !s.op) continue;
    const n = !s.name || It(e.description, s.name);
    const o = !s.op || (e.op && It(e.op, s.op));
    if (n && o) {
      t && Qn(e);
      return true;
    }
  }
  return false;
}
function es(t, e) {
  const n = e.parent_span_id;
  const s = e.span_id;
  if (n) for (const e of t) e.parent_span_id === s && (e.parent_span_id = n);
}
function ns(t) {
  return typeof t === "string" || t instanceof RegExp;
}
const ss = "production";
const os = "_frozenDsc";
function rs(t, e) {
  const n = t;
  mt(n, os, e);
}
function is(t, e) {
  const n = e.getOptions();
  const { publicKey: s } = e.getDsn() || {};
  const o = {
    environment: n.environment || ss,
    release: n.release,
    public_key: s,
    trace_id: t,
    org_id: hn(e),
  };
  e.emit("createDsc", o);
  return o;
}
function as(t, e) {
  const n = e.getPropagationContext();
  return n.dsc || is(n.traceId, t);
}
/**
 * Creates a dynamic sampling context from a span (and client and scope)
 *
 * @param span the span from which a few values like the root span name and sample rate are extracted.
 *
 * @returns a dynamic sampling context
 */ function cs(t) {
  const e = we();
  if (!e) return {};
  const n = Vn(t);
  const s = Rn(n);
  const o = s.data;
  const r = n.spanContext().traceState;
  const i = r?.get("sentry.sample_rate") ?? o[Ae] ?? o[Te];
  function a(t) {
    (typeof i !== "number" && typeof i !== "string") ||
      (t.sample_rate = `${i}`);
    return t;
  }
  const c = n[os];
  if (c) return a(c);
  const u = r?.get("sentry.dsc");
  const l = u && nn(u);
  if (l) return a(l);
  const p = is(t.spanContext().traceId, e);
  const f = o[Ee];
  const d = s.description;
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
function us(t) {
  const e = cs(t);
  return sn(e);
}
class SentryNonRecordingSpan {
  constructor(t = {}) {
    this._traceId = t.traceId || se();
    this._spanId = t.spanId || oe();
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
 */ function ls(t, e = 100, n = Infinity) {
  try {
    return fs("", t, e, n);
  } catch (t) {
    return { ERROR: `**non-serializable** (${t})` };
  }
}
function ps(t, e = 3, n = 102400) {
  const s = ls(t, e);
  return hs(s) > n ? ps(t, e - 1, n) : s;
}
/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */ function fs(t, e, n = Infinity, s = Infinity, o = ys()) {
  const [r, i] = o;
  if (
    e == null ||
    ["boolean", "string"].includes(typeof e) ||
    (typeof e === "number" && Number.isFinite(e))
  )
    return e;
  const a = ds(t, e);
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
      return fs("", t, c - 1, s, o);
    } catch {}
  const l = Array.isArray(e) ? [] : {};
  let p = 0;
  const f = _t(e);
  for (const t in f) {
    if (!Object.prototype.hasOwnProperty.call(f, t)) continue;
    if (p >= s) {
      l[t] = "[MaxProperties ~]";
      break;
    }
    const e = f[t];
    l[t] = fs(t, e, c - 1, s, o);
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
 */ function ds(t, e) {
  try {
    if (t === "domain" && e && typeof e === "object" && e._events)
      return "[Domain]";
    if (t === "domainEmitter") return "[DomainEmitter]";
    if (typeof global !== "undefined" && e === global) return "[Global]";
    if (typeof window !== "undefined" && e === window) return "[Window]";
    if (typeof document !== "undefined" && e === document) return "[Document]";
    if (rt(e)) return O(e);
    if (st(e)) return "[SyntheticEvent]";
    if (typeof e === "number" && !Number.isFinite(e)) return `[${e}]`;
    if (typeof e === "function") return `[Function: ${I(e)}]`;
    if (typeof e === "symbol") return `[${String(e)}]`;
    if (typeof e === "bigint") return `[BigInt: ${String(e)}]`;
    const n = ms(e);
    return /^HTML(\w*)Element$/.test(n)
      ? `[HTMLElement: ${n}]`
      : `[object ${n}]`;
  } catch (t) {
    return `**non-serializable** (${t})`;
  }
}
function ms(t) {
  const e = Object.getPrototypeOf(t);
  return e?.constructor ? e.constructor.name : "null prototype";
}
function gs(t) {
  return ~-encodeURI(t).split(/%..|./).length;
}
function hs(t) {
  return gs(JSON.stringify(t));
}
/**
 * Normalizes URLs in exceptions and stacktraces to a base path so Sentry can fingerprint
 * across platforms and working directory.
 *
 * @param url The URL to be normalized.
 * @param basePath The application base path.
 * @returns The normalized URL.
 */ function _s(t, e) {
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
function ys() {
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
function bs(t, e = []) {
  return [t, e];
}
function vs(t, e) {
  const [n, s] = t;
  return [n, [...s, e]];
}
function Ss(t, e) {
  const n = t[1];
  for (const t of n) {
    const n = t[0].type;
    const s = e(t, n);
    if (s) return true;
  }
  return false;
}
function ks(t, e) {
  return Ss(t, (t, n) => e.includes(n));
}
function ws(t) {
  const n = o(e);
  return n.encodePolyfill ? n.encodePolyfill(t) : new TextEncoder().encode(t);
}
function xs(t) {
  const n = o(e);
  return n.decodePolyfill ? n.decodePolyfill(t) : new TextDecoder().decode(t);
}
function Es(t) {
  const [e, n] = t;
  let s = JSON.stringify(e);
  function o(t) {
    typeof s === "string"
      ? (s = typeof t === "string" ? s + t : [ws(s), t])
      : s.push(typeof t === "string" ? ws(t) : t);
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
        t = JSON.stringify(ls(n));
      }
      o(t);
    }
  }
  return typeof s === "string" ? s : As(s);
}
function As(t) {
  const e = t.reduce((t, e) => t + e.length, 0);
  const n = new Uint8Array(e);
  let s = 0;
  for (const e of t) {
    n.set(e, s);
    s += e.length;
  }
  return n;
}
function Ts(t) {
  let e = typeof t === "string" ? ws(t) : t;
  function n(t) {
    const n = e.subarray(0, t);
    e = e.subarray(t + 1);
    return n;
  }
  function s() {
    let t = e.indexOf(10);
    t < 0 && (t = e.length);
    return JSON.parse(xs(n(t)));
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
function Is(t) {
  const e = { type: "span" };
  return [e, t];
}
function $s(t) {
  const e = typeof t.data === "string" ? ws(t.data) : t.data;
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
const Os = {
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
function Cs(t) {
  return Os[t];
}
function Ns(t) {
  if (!t?.sdk) return;
  const { name: e, version: n } = t.sdk;
  return { name: e, version: n };
}
function js(t, e, n, s) {
  const o = t.sdkProcessingMetadata?.dynamicSamplingContext;
  return {
    event_id: t.event_id,
    sent_at: new Date().toISOString(),
    ...(e && { sdk: e }),
    ...(!!n && s && { dsn: pn(s) }),
    ...(o && { trace: o }),
  };
}
function Ps(t, e) {
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
function Ms(t, e, n, s) {
  const o = Ns(n);
  const r = {
    sent_at: new Date().toISOString(),
    ...(o && { sdk: o }),
    ...(!!s && e && { dsn: pn(e) }),
  };
  const i =
    "aggregates" in t
      ? [{ type: "sessions" }, t]
      : [{ type: "session" }, t.toJSON()];
  return bs(r, [i]);
}
function Rs(t, e, n, s) {
  const o = Ns(n);
  const r = t.type && t.type !== "replay_event" ? t.type : "event";
  Ps(t, n?.sdk);
  const i = js(t, o, s, e);
  delete t.sdkProcessingMetadata;
  const a = [{ type: r }, t];
  return bs(i, [a]);
}
function Ds(t, e) {
  function n(t) {
    return !!t.trace_id && !!t.public_key;
  }
  const s = cs(t[0]);
  const o = e?.getDsn();
  const r = e?.getOptions().tunnel;
  const i = {
    sent_at: new Date().toISOString(),
    ...(n(s) && { trace: s }),
    ...(!!r && o && { dsn: pn(o) }),
  };
  const { beforeSendSpan: a, ignoreSpans: c } = e?.getOptions() || {};
  const u = c?.length ? t.filter((t) => !ts(Rn(t), c)) : t;
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
    e && f.push(Is(e));
  }
  return bs(i, f);
}
function Fs(e) {
  if (!t) return;
  const {
    description: n = "< unknown name >",
    op: s = "< unknown op >",
    parent_span_id: o,
  } = Rn(e);
  const { spanId: r } = e.spanContext();
  const i = Ln(e);
  const a = Vn(e);
  const c = a === e;
  const u = `[Tracing] Starting ${i ? "sampled" : "unsampled"} ${c ? "root " : ""}span`;
  const l = [`op: ${s}`, `name: ${n}`, `ID: ${r}`];
  o && l.push(`parent ID: ${o}`);
  if (!c) {
    const { op: t, description: e } = Rn(a);
    l.push(`root ID: ${a.spanContext().spanId}`);
    t && l.push(`root op: ${t}`);
    e && l.push(`root description: ${e}`);
  }
  y.log(`${u}\n  ${l.join("\n  ")}`);
}
function Ls(e) {
  if (!t) return;
  const { description: n = "< unknown name >", op: s = "< unknown op >" } =
    Rn(e);
  const { spanId: o } = e.spanContext();
  const r = Vn(e);
  const i = r === e;
  const a = `[Tracing] Finishing "${s}" ${i ? "root " : ""}span "${n}" with ID ${o}`;
  y.log(a);
}
function Us(e, n, s, o = Kn()) {
  const r = o && Vn(o);
  if (r) {
    t &&
      y.log(`[Measurement] Setting measurement on root span: ${e} = ${n} ${s}`);
    r.addEvent(e, { [Ne]: n, [Ce]: s });
  }
}
function qs(t) {
  if (!t || t.length === 0) return;
  const e = {};
  t.forEach((t) => {
    const n = t.attributes || {};
    const s = n[Ce];
    const o = n[Ne];
    typeof s === "string" &&
      typeof o === "number" &&
      (e[t.name] = { value: o, unit: s });
  });
  return e;
}
const Js = 1e3;
class SentrySpan {
  constructor(t = {}) {
    this._traceId = t.traceId || se();
    this._spanId = t.spanId || oe();
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
      Ls(this);
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
      measurements: qs(this._events),
      is_segment: (this._isStandaloneSpan && Vn(this) === this) || void 0,
      segment_id: this._isStandaloneSpan
        ? Vn(this).spanContext().spanId
        : void 0,
      links: jn(this._links),
    };
  }
  isRecording() {
    return !this._endTime && !!this._sampled;
  }
  addEvent(e, n, s) {
    t && y.log("[Tracing] Adding an event to span:", e);
    const o = zs(n) ? n : s || Gt();
    const r = zs(n) ? {} : n || {};
    const i = { name: e, time: Pn(o), attributes: r };
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
      if (this._sampled) Vs(Ds([this], e));
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
      const t = Xe(this).scope || ye();
      t.captureEvent(s);
    }
  }
  _convertSpanToTransaction() {
    if (!Bs(Rn(this))) return;
    if (!this._name) {
      t &&
        y.warn(
          "Transaction has no name, falling back to `<unlabeled transaction>`.",
        );
      this._name = "<unlabeled transaction>";
    }
    const { scope: e, isolationScope: n } = Xe(this);
    const s = e?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
    if (this._sampled !== true) return;
    const o = Wn(this).filter((t) => t !== this && !Ws(t));
    const r = o.map((t) => Rn(t)).filter(Bs);
    const i = this._attributes[Ee];
    /* eslint-disable @typescript-eslint/no-dynamic-delete */ delete this
      ._attributes[je];
    r.forEach((t) => {
      delete t.data[je];
    });
    const a = {
      contexts: { trace: $n(this) },
      spans:
        r.length > Js
          ? r.sort((t, e) => t.start_timestamp - e.start_timestamp).slice(0, Js)
          : r,
      start_timestamp: this._startTime,
      timestamp: this._endTime,
      transaction: this._name,
      type: "transaction",
      sdkProcessingMetadata: {
        capturedSpanScope: e,
        capturedSpanIsolationScope: n,
        dynamicSamplingContext: cs(this),
      },
      request: s,
      ...(i && { transaction_info: { source: i } }),
    };
    const c = qs(this._events);
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
function zs(t) {
  return (t && typeof t === "number") || t instanceof Date || Array.isArray(t);
}
function Bs(t) {
  return !!t.start_timestamp && !!t.timestamp && !!t.span_id && !!t.trace_id;
}
function Ws(t) {
  return t instanceof SentrySpan && t.isStandaloneSpan();
}
function Vs(t) {
  const e = we();
  if (!e) return;
  const n = t[1];
  n && n.length !== 0
    ? e.sendEnvelope(t)
    : e.recordDroppedEvent("before_send", "span");
}
function Ks(t, e, n = () => {}, s = () => {}) {
  let o;
  try {
    o = t();
  } catch (t) {
    e(t);
    n();
    throw t;
  }
  return Gs(o, e, n, s);
}
function Gs(t, e, n, s) {
  if (nt(t))
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
function Hs(e, n, s) {
  if (!Xn(e)) return [false];
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
const Zs = "__SENTRY_SUPPRESS_TRACING__";
function Ys(t, e) {
  const n = io();
  if (n.startSpan) return n.startSpan(t, e);
  const s = ro(t);
  const { forceTransaction: o, parentSpan: r, scope: i } = t;
  const a = i?.clone();
  return Se(a, () => {
    const n = lo(r);
    return n(() => {
      const n = ye();
      const i = uo(n, r);
      const a = t.onlyIfParent && !i;
      const c = a
        ? new SentryNonRecordingSpan()
        : oo({
            parentSpan: i,
            spanArguments: s,
            forceTransaction: o,
            scope: n,
          });
      ie(n, c);
      return Ks(
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
function Xs(t, e) {
  const n = io();
  if (n.startSpanManual) return n.startSpanManual(t, e);
  const s = ro(t);
  const { forceTransaction: o, parentSpan: r, scope: i } = t;
  const a = i?.clone();
  return Se(a, () => {
    const n = lo(r);
    return n(() => {
      const n = ye();
      const i = uo(n, r);
      const a = t.onlyIfParent && !i;
      const c = a
        ? new SentryNonRecordingSpan()
        : oo({
            parentSpan: i,
            spanArguments: s,
            forceTransaction: o,
            scope: n,
          });
      ie(n, c);
      return Ks(
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
function Qs(t) {
  const e = io();
  if (e.startInactiveSpan) return e.startInactiveSpan(t);
  const n = ro(t);
  const { forceTransaction: s, parentSpan: o } = t;
  const r = t.scope
    ? (e) => Se(t.scope, e)
    : o !== void 0
      ? (t) => eo(o, t)
      : (t) => t();
  return r(() => {
    const e = ye();
    const r = uo(e, o);
    const i = t.onlyIfParent && !r;
    return i
      ? new SentryNonRecordingSpan()
      : oo({ parentSpan: r, spanArguments: n, forceTransaction: s, scope: e });
  });
}
const to = (t, e) => {
  const n = s();
  const o = _e(n);
  if (o.continueTrace) return o.continueTrace(t, e);
  const { sentryTrace: r, baggage: i } = t;
  const a = we();
  const c = nn(i);
  return a && !En(a, c?.org_id)
    ? so(e)
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
 */ function eo(t, e) {
  const n = io();
  return n.withActiveSpan
    ? n.withActiveSpan(t, e)
    : Se((n) => {
        ie(n, t || void 0);
        return e(n);
      });
}
function no(t) {
  const e = io();
  return e.suppressTracing
    ? e.suppressTracing(t)
    : Se((e) => {
        e.setSDKProcessingMetadata({ [Zs]: true });
        const n = t();
        e.setSDKProcessingMetadata({ [Zs]: void 0 });
        return n;
      });
}
function so(e) {
  return Se((n) => {
    n.setPropagationContext({ traceId: se(), sampleRand: Math.random() });
    t &&
      y.log(
        `Starting a new trace with id ${n.getPropagationContext().traceId}`,
      );
    return eo(null, e);
  });
}
function oo({
  parentSpan: t,
  spanArguments: e,
  forceTransaction: n,
  scope: s,
}) {
  if (!Xn()) {
    const s = new SentryNonRecordingSpan();
    if (n || !t) {
      const t = {
        sampled: "false",
        sample_rate: "0",
        transaction: e.name,
        ...cs(s),
      };
      rs(s, t);
    }
    return s;
  }
  const o = be();
  let r;
  if (t && !n) {
    r = co(t, s, e);
    zn(t, r);
  } else if (t) {
    const n = cs(t);
    const { traceId: o, spanId: i } = t.spanContext();
    const a = Ln(t);
    r = ao({ traceId: o, parentSpanId: i, ...e }, s, a);
    rs(r, n);
  } else {
    const {
      traceId: t,
      dsc: n,
      parentSpanId: i,
      sampled: a,
    } = { ...o.getPropagationContext(), ...s.getPropagationContext() };
    r = ao({ traceId: t, parentSpanId: i, ...e }, s, a);
    n && rs(r, n);
  }
  Fs(r);
  Ye(r, s, o);
  return r;
}
function ro(t) {
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
function io() {
  const t = s();
  return _e(t);
}
function ao(e, n, s) {
  const o = we();
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
  const [p, f, d] = n.getScopeData().sdkProcessingMetadata[Zs]
    ? [false]
    : Hs(
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
function co(t, e, n) {
  const { spanId: s, traceId: o } = t.spanContext();
  const r = !e.getScopeData().sdkProcessingMetadata[Zs] && Ln(t);
  const i = r
    ? new SentrySpan({ ...n, parentSpanId: s, traceId: o, sampled: r })
    : new SentryNonRecordingSpan({ traceId: o });
  zn(t, i);
  const a = we();
  if (a) {
    a.emit("spanStart", i);
    n.endTimestamp && a.emit("spanEnd", i);
  }
  return i;
}
function uo(t, e) {
  if (e) return e;
  if (e === null) return;
  const n = ae(t);
  if (!n) return;
  const s = we();
  const o = s ? s.getOptions() : {};
  return o.parentSpanIsAlwaysRootSpan ? Vn(n) : n;
}
function lo(t) {
  return t !== void 0 ? (e) => eo(t, e) : (t) => t();
}
const po = { idleTimeout: 1e3, finalTimeout: 3e4, childSpanTimeout: 15e3 };
const fo = "heartbeatFailed";
const mo = "idleTimeout";
const go = "finalTimeout";
const ho = "externalFinish";
function _o(e, n = {}) {
  const s = new Map();
  let o = false;
  let r;
  let i = ho;
  let a = !n.disableAutoFinish;
  const c = [];
  const {
    idleTimeout: u = po.idleTimeout,
    finalTimeout: l = po.finalTimeout,
    childSpanTimeout: p = po.childSpanTimeout,
    beforeSpanEnd: f,
    trimIdleSpanEndTimestamp: d = true,
  } = n;
  const m = we();
  if (!m || !Xn()) {
    const t = new SentryNonRecordingSpan();
    const e = { sample_rate: "0", sampled: "false", ...cs(t) };
    rs(t, e);
    return t;
  }
  const g = ye();
  const h = Kn();
  const _ = yo(e);
  _.end = new Proxy(_.end, {
    apply(t, e, n) {
      f && f(_);
      if (e instanceof SentryNonRecordingSpan) return;
      const [s, ...o] = n;
      const r = s || Gt();
      const i = Pn(r);
      const a = Wn(_).filter((t) => t !== _);
      const c = Rn(_);
      if (!a.length || !d) {
        x(i);
        return Reflect.apply(t, e, [i, ...o]);
      }
      const u = m.getOptions().ignoreSpans;
      const p = a?.reduce(
        (t, e) => {
          const n = Rn(e);
          return n.timestamp
            ? u && ts(n, u)
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
        i = mo;
        _.end(t);
      }
    }, u);
  }
  function S(t) {
    r = setTimeout(() => {
      if (!o && a) {
        i = fo;
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
    const e = Gt();
    S(e + p / 1e3);
  }
  /**
   * Remove an activity from usage
   * @param spanId The span id that represents the activity
   */ function w(t) {
    s.has(t) && s.delete(t);
    if (s.size === 0) {
      const t = Gt();
      v(t + u / 1e3);
    }
  }
  function x(e) {
    o = true;
    s.clear();
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
      const s = Rn(n);
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
        Bn(_, n);
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
      _.setStatus({ code: Be, message: "deadline_exceeded" });
      i = go;
      _.end();
    }
  }, l);
  return _;
}
function yo(e) {
  const n = Qs(e);
  ie(ye(), n);
  t && y.log("[Tracing] Started span is an idle span");
  return n;
}
/* eslint-disable @typescript-eslint/no-explicit-any */ const bo = 0;
const vo = 1;
const So = 2;
/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */ function ko(t) {
  return new SyncPromise((e) => {
    e(t);
  });
}
/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */ function wo(t) {
  return new SyncPromise((e, n) => {
    n(t);
  });
}
class SyncPromise {
  constructor(t) {
    this._state = bo;
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
    if (this._state === bo) return;
    const t = this._handlers.slice();
    this._handlers = [];
    t.forEach((t) => {
      if (!t[0]) {
        this._state === vo && t[1](this._value);
        this._state === So && t[2](this._value);
        t[0] = true;
      }
    });
  }
  _runExecutor(t) {
    const e = (t, e) => {
      if (this._state === bo)
        if (nt(e)) void e.then(n, s);
        else {
          this._state = t;
          this._value = e;
          this._executeHandlers();
        }
    };
    const n = (t) => {
      e(vo, t);
    };
    const s = (t) => {
      e(So, t);
    };
    try {
      t(n, s);
    } catch (t) {
      s(t);
    }
  }
}
function xo(t, e, n, s = 0) {
  try {
    const o = Eo(e, n, t, s);
    return nt(o) ? o : ko(o);
  } catch (t) {
    return wo(t);
  }
}
function Eo(e, n, s, o) {
  const r = s[o];
  if (!e || !r) return e;
  const i = r({ ...e }, n);
  t && i === null && y.log(`Event processor "${r.id || "?"}" dropped event`);
  return nt(i) ? i.then((t) => Eo(t, n, s, o + 1)) : Eo(i, n, s, o + 1);
}
function Ao(t, e) {
  const {
    fingerprint: n,
    span: s,
    breadcrumbs: o,
    sdkProcessingMetadata: r,
  } = e;
  $o(t, e);
  s && No(t, s);
  jo(t, n);
  Oo(t, o);
  Co(t, r);
}
function To(t, e) {
  const {
    extra: n,
    tags: s,
    user: o,
    contexts: r,
    level: i,
    sdkProcessingMetadata: a,
    breadcrumbs: c,
    fingerprint: u,
    eventProcessors: l,
    attachments: p,
    propagationContext: f,
    transactionName: d,
    span: m,
  } = e;
  Io(t, "extra", n);
  Io(t, "tags", s);
  Io(t, "user", o);
  Io(t, "contexts", r);
  t.sdkProcessingMetadata = ne(t.sdkProcessingMetadata, a, 2);
  i && (t.level = i);
  d && (t.transactionName = d);
  m && (t.span = m);
  c.length && (t.breadcrumbs = [...t.breadcrumbs, ...c]);
  u.length && (t.fingerprint = [...t.fingerprint, ...u]);
  l.length && (t.eventProcessors = [...t.eventProcessors, ...l]);
  p.length && (t.attachments = [...t.attachments, ...p]);
  t.propagationContext = { ...t.propagationContext, ...f };
}
function Io(t, e, n) {
  t[e] = ne(t[e], n, 1);
}
function $o(t, e) {
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
function Oo(t, e) {
  const n = [...(t.breadcrumbs || []), ...e];
  t.breadcrumbs = n.length ? n : void 0;
}
function Co(t, e) {
  t.sdkProcessingMetadata = { ...t.sdkProcessingMetadata, ...e };
}
function No(t, e) {
  t.contexts = { trace: On(e), ...t.contexts };
  t.sdkProcessingMetadata = {
    dynamicSamplingContext: cs(e),
    ...t.sdkProcessingMetadata,
  };
  const n = Vn(e);
  const s = Rn(n).description;
  s && !t.transaction && t.type === "transaction" && (t.transaction = s);
}
function jo(t, e) {
  t.fingerprint = t.fingerprint
    ? Array.isArray(t.fingerprint)
      ? t.fingerprint
      : [t.fingerprint]
    : [];
  e && (t.fingerprint = t.fingerprint.concat(e));
  t.fingerprint.length || delete t.fingerprint;
}
let Po;
let Mo;
let Ro;
let Do;
function Fo(t) {
  const n = e._sentryDebugIds;
  const s = e._debugIds;
  if (!n && !s) return {};
  const o = n ? Object.keys(n) : [];
  const r = s ? Object.keys(s) : [];
  if (Do && o.length === Mo && r.length === Ro) return Do;
  Mo = o.length;
  Ro = r.length;
  Do = {};
  Po || (Po = {});
  const i = (e, n) => {
    for (const s of e) {
      const e = n[s];
      const o = Po?.[s];
      if (o && Do && e) {
        Do[o[0]] = e;
        Po && (Po[s] = [o[0], e]);
      } else if (e) {
        const n = t(s);
        for (let t = n.length - 1; t >= 0; t--) {
          const o = n[t];
          const r = o?.filename;
          if (r && Do && Po) {
            Do[r] = e;
            Po[s] = [r, e];
            break;
          }
        }
      }
    }
  };
  n && i(o, n);
  s && i(r, s);
  return Do;
}
function Lo(t, e) {
  const n = Fo(t);
  if (!n) return [];
  const s = [];
  for (const t of e)
    t && n[t] && s.push({ type: "sourcemap", code_file: t, debug_id: n[t] });
  return s;
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
 */ function Uo(t, e, n, s, o, r) {
  const { normalizeDepth: i = 3, normalizeMaxBreadth: a = 1e3 } = t;
  const c = {
    ...e,
    event_id: e.event_id || n.event_id || jt(),
    timestamp: e.timestamp || Wt(),
  };
  const u = n.integrations || t.integrations.map((t) => t.name);
  qo(c, t);
  Bo(c, u);
  o && o.emit("applyFrameMetadata", e);
  e.type === void 0 && Jo(c, t.stackParser);
  const l = Vo(s, n.captureContext);
  n.mechanism && Dt(c, n.mechanism);
  const p = o ? o.getEventProcessors() : [];
  const f = ve().getScopeData();
  if (r) {
    const t = r.getScopeData();
    To(f, t);
  }
  if (l) {
    const t = l.getScopeData();
    To(f, t);
  }
  const d = [...(n.attachments || []), ...f.attachments];
  d.length && (n.attachments = d);
  Ao(c, f);
  const m = [...p, ...f.eventProcessors];
  const g = xo(m, c, n);
  return g.then((t) => {
    t && zo(t);
    return typeof i === "number" && i > 0 ? Wo(t, i, a) : t;
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
 */ function qo(t, e) {
  const { environment: n, release: s, dist: o, maxValueLength: r } = e;
  t.environment = t.environment || n || ss;
  !t.release && s && (t.release = s);
  !t.dist && o && (t.dist = o);
  const i = t.request;
  i?.url && r && (i.url = Et(i.url, r));
  r &&
    t.exception?.values?.forEach((t) => {
      t.value && (t.value = Et(t.value, r));
    });
}
function Jo(t, e) {
  const n = Fo(e);
  t.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((t) => {
      t.filename && (t.debug_id = n[t.filename]);
    });
  });
}
function zo(t) {
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
 */ function Bo(t, e) {
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
 */ function Wo(t, e, n) {
  if (!t) return null;
  const s = {
    ...t,
    ...(t.breadcrumbs && {
      breadcrumbs: t.breadcrumbs.map((t) => ({
        ...t,
        ...(t.data && { data: ls(t.data, e, n) }),
      })),
    }),
    ...(t.user && { user: ls(t.user, e, n) }),
    ...(t.contexts && { contexts: ls(t.contexts, e, n) }),
    ...(t.extra && { extra: ls(t.extra, e, n) }),
  };
  if (t.contexts?.trace && s.contexts) {
    s.contexts.trace = t.contexts.trace;
    t.contexts.trace.data &&
      (s.contexts.trace.data = ls(t.contexts.trace.data, e, n));
  }
  t.spans &&
    (s.spans = t.spans.map((t) => ({
      ...t,
      ...(t.data && { data: ls(t.data, e, n) }),
    })));
  t.contexts?.flags &&
    s.contexts &&
    (s.contexts.flags = ls(t.contexts.flags, 3, n));
  return s;
}
function Vo(t, e) {
  if (!e) return t;
  const n = t ? t.clone() : new Scope();
  n.update(e);
  return n;
}
function Ko(t) {
  if (t) return Go(t) || Zo(t) ? { captureContext: t } : t;
}
function Go(t) {
  return t instanceof Scope || typeof t === "function";
}
const Ho = [
  "user",
  "level",
  "extra",
  "contexts",
  "tags",
  "fingerprint",
  "propagationContext",
];
function Zo(t) {
  return Object.keys(t).some((t) => Ho.includes(t));
}
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception The exception to capture.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured Sentry event.
 */ function Yo(t, e) {
  return ye().captureException(t, Ko(e));
}
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param captureContext Define the level of the message or pass in additional data to attach to the message.
 * @returns the id of the captured message.
 */ function Xo(t, e) {
  const n = typeof e === "string" ? e : void 0;
  const s = typeof e !== "string" ? { captureContext: e } : void 0;
  return ye().captureMessage(t, n, s);
}
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured event.
 */ function Qo(t, e) {
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
 */ function sr(t) {
  be().setTags(t);
}
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */ function or(t, e) {
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
  const s = ye();
  const o = we();
  if (o) {
    if (o.captureCheckIn) return o.captureCheckIn(e, n, s);
    t &&
      y.warn(
        "Cannot capture check-in. Client does not support sending check-ins.",
      );
  } else t && y.warn("Cannot capture check-in. No client defined.");
  return jt();
}
/**
 * Wraps a callback with a cron monitor check in. The check in will be sent to Sentry when the callback finishes.
 *
 * @param monitorSlug The distinct slug of the monitor.
 * @param callback Callback to be monitored
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function cr(t, e, n) {
  function s() {
    const s = ar({ monitorSlug: t, status: "in_progress" }, n);
    const o = Gt();
    function r(e) {
      ar({ monitorSlug: t, status: e, checkInId: s, duration: Gt() - o });
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
  return ke(() => (n?.isolateTrace ? so(s) : s()));
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
  const s = ye();
  const { userAgent: o } = e.navigator || {};
  const r = Xt({
    user: s.getUser() || n.getUser(),
    ...(o && { userAgent: o }),
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
  const s = `${br(n)}embed/error-page/`;
  let o = `dsn=${pn(n)}`;
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
const xr = [];
function Er(t) {
  const e = {};
  t.forEach((t) => {
    const { name: n } = t;
    const s = e[n];
    (s && !s.isDefaultInstance && t.isDefaultInstance) || (e[n] = t);
  });
  return Object.values(e);
}
function Ar(t) {
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
  return Er(s);
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
function $r(e, n, s) {
  if (s[n.name])
    t &&
      y.log(`Integration skipped because it was already installed: ${n.name}`);
  else {
    s[n.name] = n;
    if (!xr.includes(n.name) && typeof n.setupOnce === "function") {
      n.setupOnce();
      xr.push(n.name);
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
function Nr(t, e) {
  return e
    ? Se(e, () => {
        const n = Kn();
        const s = n ? On(n) : xe(e);
        const o = n ? cs(n) : as(t, e);
        return [o, s];
      })
    : [void 0, void 0];
}
const jr = { trace: 1, debug: 5, info: 9, warn: 13, error: 17, fatal: 21 };
/**
 * Creates a log container envelope item for a list of logs.
 *
 * @param items - The logs to include in the envelope.
 * @returns The created log container envelope item.
 */ function Pr(t) {
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
 */ function Mr(t, e, n, s) {
  const o = {};
  e?.sdk && (o.sdk = { name: e.sdk.name, version: e.sdk.version });
  !n || !s || (o.dsn = pn(s));
  return bs(o, [Pr(t)]);
}
const Rr = 100;
/**
 * Converts a log attribute to a serialized log attribute.
 *
 * @param key - The key of the log attribute.
 * @param value - The value of the log attribute.
 * @returns The serialized log attribute.
 */ function Dr(t) {
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
 * Sets a log attribute if the value exists and the attribute key is not already present.
 *
 * @param logAttributes - The log attributes object to modify.
 * @param key - The attribute key to set.
 * @param value - The value to set (only sets if truthy and key not present).
 * @param setEvenIfPresent - Whether to set the attribute if it is present. Defaults to true.
 */ function Fr(t, e, n, s = true) {
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
 */ function Lr(t, e) {
  const n = Br();
  const s = Jr(t);
  if (s === void 0) n.set(t, [e]);
  else if (s.length >= Rr) {
    qr(t, s);
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
 */ function Ur(e, n = ye(), s = Lr) {
  const o = n?.getClient() ?? we();
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
  const [, l] = Nr(o, n);
  const p = { ...e.attributes };
  const {
    user: { id: f, email: d, username: m },
  } = zr(n);
  Fr(p, "user.id", f, false);
  Fr(p, "user.email", d, false);
  Fr(p, "user.name", m, false);
  Fr(p, "sentry.release", r);
  Fr(p, "sentry.environment", i);
  const { name: g, version: h } = o.getSdkMetadata()?.sdk ?? {};
  Fr(p, "sentry.sdk.name", g);
  Fr(p, "sentry.sdk.version", h);
  const _ = o.getIntegrationByName("Replay");
  const b = _?.getReplayId(true);
  Fr(p, "sentry.replay_id", b);
  b &&
    _?.getRecordingMode() === "buffer" &&
    Fr(p, "sentry._internal.replay_is_buffering", true);
  const v = e.message;
  if (Z(v)) {
    const {
      __sentry_template_string__: t,
      __sentry_template_values__: e = [],
    } = v;
    e?.length && (p["sentry.message.template"] = t);
    e.forEach((t, e) => {
      p[`sentry.message.parameter.${e}`] = t;
    });
  }
  const S = ae(n);
  Fr(p, "sentry.trace.parent_span_id", S?.spanContext().spanId);
  const k = { ...e, attributes: p };
  o.emit("beforeCaptureLog", k);
  const w = c ? u(() => c(k)) : k;
  if (!w) {
    o.recordDroppedEvent("before_send", "log_item", 1);
    t && y.warn("beforeSendLog returned null, log will not be captured.");
    return;
  }
  const { level: x, message: E, attributes: A = {}, severityNumber: T } = w;
  const I = {
    timestamp: Gt(),
    level: x,
    body: E,
    trace_id: l?.trace_id,
    severity_number: T ?? jr[x],
    attributes: Object.keys(A).reduce((t, e) => {
      t[e] = Dr(A[e]);
      return t;
    }, {}),
  };
  s(o, I);
  o.emit("afterCaptureLog", w);
}
/**
 * Flushes the logs buffer to Sentry.
 *
 * @param client - A client.
 * @param maybeLogBuffer - A log buffer. Uses the log buffer for the given client if not provided.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function qr(t, e) {
  const n = e ?? Jr(t) ?? [];
  if (n.length === 0) return;
  const s = t.getOptions();
  const o = Mr(n, s._metadata, s.tunnel, t.getDsn());
  Br().set(t, []);
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
 */ function Jr(t) {
  return Br().get(t);
}
/**
 * Get the scope data for the current scope after merging with the
 * global scope and isolation scope.
 *
 * @param currentScope - The current scope.
 * @returns The scope data.
 */ function zr(t) {
  const e = ve().getScopeData();
  To(e, be().getScopeData());
  To(e, t.getScopeData());
  return e;
}
function Br() {
  return r("clientToLogBufferMap", () => new WeakMap());
}
/**
 * Creates a metric container envelope item for a list of metrics.
 *
 * @param items - The metrics to include in the envelope.
 * @returns The created metric container envelope item.
 */ function Wr(t) {
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
 */ function Vr(t, e, n, s) {
  const o = {};
  e?.sdk && (o.sdk = { name: e.sdk.name, version: e.sdk.version });
  !n || !s || (o.dsn = pn(s));
  return bs(o, [Wr(t)]);
}
const Kr = 1e3;
/**
 * Converts a metric attribute to a serialized metric attribute.
 *
 * @param value - The value of the metric attribute.
 * @returns The serialized metric attribute.
 */ function Gr(t) {
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
 */ function Hr(t, e, n, s = true) {
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
 */ function Zr(t, e) {
  const n = si();
  const s = ei(t);
  if (s === void 0) n.set(t, [e]);
  else if (s.length >= Kr) {
    ti(t, s);
    n.set(t, [e]);
  } else n.set(t, [...s, e]);
}
function Yr(t, e, n) {
  const { release: s, environment: o } = e.getOptions();
  const r = { ...t.attributes };
  const {
    user: { id: i, email: a, username: c },
  } = ni(n);
  Hr(r, "user.id", i, false);
  Hr(r, "user.email", a, false);
  Hr(r, "user.name", c, false);
  Hr(r, "sentry.release", s);
  Hr(r, "sentry.environment", o);
  const { name: u, version: l } = e.getSdkMetadata()?.sdk ?? {};
  Hr(r, "sentry.sdk.name", u);
  Hr(r, "sentry.sdk.version", l);
  const p = e.getIntegrationByName("Replay");
  const f = p?.getReplayId(true);
  Hr(r, "sentry.replay_id", f);
  f &&
    p?.getRecordingMode() === "buffer" &&
    Hr(r, "sentry._internal.replay_is_buffering", true);
  return { ...t, attributes: r };
}
function Xr(t, e, n) {
  const s = {};
  for (const e in t.attributes)
    t.attributes[e] !== void 0 && (s[e] = Gr(t.attributes[e]));
  const [, o] = Nr(e, n);
  const r = ae(n);
  const i = r ? r.spanContext().traceId : o?.trace_id;
  const a = r ? r.spanContext().spanId : void 0;
  return {
    timestamp: Gt(),
    trace_id: i ?? "",
    span_id: a,
    name: t.name,
    type: t.type,
    unit: t.unit,
    value: t.value,
    attributes: s,
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
 */ function Qr(e, n) {
  const s = n?.scope ?? ye();
  const o = n?.captureSerializedMetric ?? Zr;
  const r = s?.getClient() ?? we();
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
  const l = Yr(e, r, s);
  r.emit("processMetric", l);
  const p = c || i?.beforeSendMetric;
  const f = p ? p(l) : l;
  if (!f) {
    t && y.log("`beforeSendMetric` returned `null`, will not send metric.");
    return;
  }
  const d = Xr(f, r, s);
  t && y.log("[Metric]", d);
  o(r, d);
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
 */ function ti(t, e) {
  const n = e ?? ei(t) ?? [];
  if (n.length === 0) return;
  const s = t.getOptions();
  const o = Vr(n, s._metadata, s.tunnel, t.getDsn());
  si().set(t, []);
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
 */ function ei(t) {
  return si().get(t);
}
/**
 * Get the scope data for the current scope after merging with the
 * global scope and isolation scope.
 *
 * @param currentScope - The current scope.
 * @returns The scope data.
 */ function ni(t) {
  const e = ve().getScopeData();
  To(e, be().getScopeData());
  To(e, t.getScopeData());
  return e;
}
function si() {
  return r("clientToMetricBufferMap", () => new WeakMap());
}
const oi = Symbol.for("SentryBufferFullError");
/**
 * Creates an new PromiseBuffer object with the specified limit
 * @param limit max number of promises that can be stored in the buffer
 */ function ri(t = 100) {
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
    if (!n()) return wo(oi);
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
    if (!e.size) return ko(true);
    const n = Promise.allSettled(Array.from(e)).then(() => true);
    if (!t) return n;
    const s = [n, new Promise((e) => setTimeout(() => e(false), t))];
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
const ii = 6e4;
/**
 * Extracts Retry-After value from the request header or returns default value
 * @param header string representation of 'Retry-After' header
 * @param now current unix timestamp
 *
 */ function ai(t, e = Date.now()) {
  const n = parseInt(`${t}`, 10);
  if (!isNaN(n)) return n * 1e3;
  const s = Date.parse(`${t}`);
  return isNaN(s) ? ii : s - e;
}
function ci(t, e) {
  return t[e] || t.all || 0;
}
function ui(t, e, n = Date.now()) {
  return ci(t, e) > n;
}
function li(t, { statusCode: e, headers: n }, s = Date.now()) {
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
  else i ? (o.all = s + ai(i, s)) : e === 429 && (o.all = s + 6e4);
  return o;
}
const pi = 64;
/**
 * Creates an instance of a Sentry `Transport`
 *
 * @param options
 * @param makeRequest
 */ function fi(e, n, s = ri(e.bufferSize || pi)) {
  let o = {};
  const r = (t) => s.drain(t);
  function i(r) {
    const i = [];
    Ss(r, (t, n) => {
      const s = Cs(n);
      ui(o, s) ? e.recordDroppedEvent("ratelimit_backoff", s) : i.push(t);
    });
    if (i.length === 0) return Promise.resolve({});
    const a = bs(r[0], i);
    const c = (t) => {
      Ss(a, (n, s) => {
        e.recordDroppedEvent(t, Cs(s));
      });
    };
    const u = () =>
      n({ body: Es(a) }).then(
        (e) => {
          e.statusCode !== void 0 &&
            (e.statusCode < 200 || e.statusCode >= 300) &&
            t &&
            y.warn(
              `Sentry responded with status code ${e.statusCode} to sent event.`,
            );
          o = li(o, e);
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
        if (e === oi) {
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
 */ function di(t, e, n) {
  const s = [
    { type: "client_report" },
    { timestamp: n || Wt(), discarded_events: t },
  ];
  return bs(e ? { dsn: e } : {}, [s]);
}
function mi(t) {
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
function gi(t) {
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
    profile_id: i?.[Pe],
    exclusive_time: i?.[Me],
    measurements: t.measurements,
    is_segment: true,
  };
}
function hi(t) {
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
const _i = "Not capturing exception because it's already been captured.";
const yi = "Discarded session because of missing or non-string release";
const bi = Symbol.for("SentryInternalError");
const vi = Symbol.for("SentryDoNotSendEventError");
const Si = 5e3;
function ki(t) {
  return { message: t, [bi]: true };
}
function wi(t) {
  return { message: t, [vi]: true };
}
function xi(t) {
  return !!t && typeof t === "object" && bi in t;
}
function Ei(t) {
  return !!t && typeof t === "object" && vi in t;
}
function Ai(t, e, n, s, o) {
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
      i = setTimeout(() => {
        o(t);
      }, Si);
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
    this._promiseBuffer = ri(e.transportOptions?.bufferSize ?? pi);
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
      Ai(this, "afterCaptureLog", "flushLogs", ji, qr);
    const n =
      this._options.enableMetrics ??
      this._options._experiments?.enableMetrics ??
      true;
    n && Ai(this, "afterCaptureMetric", "flushMetrics", Ni, ti);
  }
  captureException(e, n, s) {
    const o = jt();
    if (Jt(e)) {
      t && y.log(_i);
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
    const o = { event_id: jt(), ...n };
    const r = Z(t) ? t : String(t);
    const i = Y(t);
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
    const o = jt();
    if (n?.originalException && Jt(n.originalException)) {
      t && y.log(_i);
      return o;
    }
    const r = { event_id: o, ...n };
    const i = e.sdkProcessingMetadata || {};
    const a = i.capturedSpanScope;
    const c = i.capturedSpanIsolationScope;
    const u = Ti(e.type);
    this._process(() => this._captureEvent(e, r, a || s, c), u);
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
    let n = Rs(t, this._dsn, this._options._metadata, this._options.tunnel);
    for (const t of e.attachments || []) n = vs(n, $s(t));
    this.sendEnvelope(n).then((e) => this.emit("afterSendEvent", t, e));
  }
  sendSession(e) {
    const { release: n, environment: s = ss } = this._options;
    if ("aggregates" in e) {
      const o = e.attrs || {};
      if (!o.release && !n) {
        t && y.warn(yi);
        return;
      }
      o.release = o.release || n;
      o.environment = o.environment || s;
      e.attrs = o;
    } else {
      if (!e.release && !n) {
        t && y.warn(yi);
        return;
      }
      e.release = e.release || n;
      e.environment = e.environment || s;
    }
    this.emit("beforeSendSession", e);
    const o = Ms(e, this._dsn, this._options._metadata, this._options.tunnel);
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
    this._integrations = Tr(this, t);
    Ir(this, t);
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
      Qt(t, {
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
    return Uo(o, t, e, n, this, s).then((t) => {
      if (t === null) return t;
      this.emit("postprocessEvent", t, e);
      t.contexts = { trace: xe(n), ...t.contexts };
      const s = as(this, n);
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
   */ _captureEvent(e, n = {}, s = ye(), o = be()) {
    t && Oi(e) && y.log(`Captured error event \`${mi(e)[0] || "<unknown>"}\``);
    return this._processEvent(e, n, s, o).then(
      (t) => t.event_id,
      (e) => {
        t && (Ei(e) ? y.log(e.message) : xi(e) ? y.warn(e.message) : y.warn(e));
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
    const i = Ci(t);
    const a = Oi(t);
    const c = t.type || "error";
    const u = `before send for type \`${c}\``;
    const l = typeof r === "undefined" ? void 0 : yn(r);
    if (a && typeof l === "number" && Math.random() > l) {
      this.recordDroppedEvent("sample_rate", "error");
      return wo(
        wi(
          `Discarding event because it's not included in the random sample (sampling rate = ${r})`,
        ),
      );
    }
    const p = Ti(t.type);
    return this._prepareEvent(t, e, n, s)
      .then((t) => {
        if (t === null) {
          this.recordDroppedEvent("event_processor", p);
          throw wi("An event processor returned `null`, will not send event.");
        }
        const n = e.data && e.data.__sentry__ === true;
        if (n) return t;
        const s = $i(this, o, t, e);
        return Ii(s, u);
      })
      .then((o) => {
        if (o === null) {
          this.recordDroppedEvent("before_send", p);
          if (i) {
            const e = t.spans || [];
            const n = 1 + e.length;
            this.recordDroppedEvent("before_send", "span", n);
          }
          throw wi(`${u} returned \`null\`, will not send event.`);
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
        if (Ei(t) || xi(t)) throw t;
        this.captureException(t, {
          mechanism: { handled: false, type: "internal" },
          data: { __sentry__: true },
          originalException: t,
        });
        throw ki(
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
        t === oi && this.recordDroppedEvent("queue_overflow", e);
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
    const n = di(e, this._options.tunnel && pn(this._dsn));
    this.sendEnvelope(n);
  }
}
function Ti(t) {
  return t === "replay_event" ? "replay" : t || "error";
}
function Ii(t, e) {
  const n = `${e} must return \`null\` or a valid event.`;
  if (nt(t))
    return t.then(
      (t) => {
        if (!X(t) && t !== null) throw ki(n);
        return t;
      },
      (t) => {
        throw ki(`${e} rejected with ${t}`);
      },
    );
  if (!X(t) && t !== null) throw ki(n);
  return t;
}
function $i(t, e, n, s) {
  const {
    beforeSend: o,
    beforeSendTransaction: r,
    beforeSendSpan: i,
    ignoreSpans: a,
  } = e;
  let c = n;
  if (Oi(c) && o) return o(c, s);
  if (Ci(c)) {
    if (i || a) {
      const e = gi(c);
      if (a?.length && ts(e, a)) return null;
      if (i) {
        const t = i(e);
        t ? (c = ne(n, hi(t))) : Gn();
      }
      if (c.spans) {
        const e = [];
        const n = c.spans;
        for (const t of n)
          if (a?.length && ts(t, a)) es(n, t);
          else if (i) {
            const n = i(t);
            if (n) e.push(n);
            else {
              Gn();
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
function Oi(t) {
  return t.type === void 0;
}
function Ci(t) {
  return t.type === "transaction";
}
/**
 * Estimate the size of a metric in bytes.
 *
 * @param metric - The metric to estimate the size of.
 * @returns The estimated size of the metric in bytes.
 */ function Ni(t) {
  let e = 0;
  t.name && (e += t.name.length * 2);
  e += 8;
  return e + Pi(t.attributes);
}
/**
 * Estimate the size of a log in bytes.
 *
 * @param log - The log to estimate the size of.
 * @returns The estimated size of the log in bytes.
 */ function ji(t) {
  let e = 0;
  t.message && (e += t.message.length * 2);
  return e + Pi(t.attributes);
}
/**
 * Estimate the size of attributes in bytes.
 *
 * @param attributes - The attributes object to estimate the size of.
 * @returns The estimated size of the attributes in bytes.
 */ function Pi(t) {
  if (!t) return 0;
  let e = 0;
  Object.values(t).forEach((t) => {
    Array.isArray(t)
      ? (e += t.length * Mi(t[0]))
      : Y(t)
        ? (e += Mi(t))
        : (e += 100);
  });
  return e;
}
function Mi(t) {
  return typeof t === "string"
    ? t.length * 2
    : typeof t === "number"
      ? 8
      : typeof t === "boolean"
        ? 4
        : 0;
}
function Ri(t, e, n, s, o) {
  const r = { sent_at: new Date().toISOString() };
  n?.sdk && (r.sdk = { name: n.sdk.name, version: n.sdk.version });
  !s || !o || (r.dsn = pn(o));
  e && (r.trace = e);
  const i = Di(t);
  return bs(r, [i]);
}
function Di(t) {
  const e = { type: "check_in" };
  return [e, t];
}
function Fi(t) {
  const e = t._metadata?.sdk;
  const n = e?.name && e?.version ? `${e?.name}/${e?.version}` : void 0;
  t.transportOptions = {
    ...t.transportOptions,
    headers: { ...(n && { "user-agent": n }), ...t.transportOptions?.headers },
  };
}
function Li(t, e) {
  return t(e.stack || "", 1);
}
function Ui(t, e) {
  const n = { type: e.name || e.constructor.name, value: e.message };
  const s = Li(t, e);
  s.length && (n.stacktrace = { frames: s });
  return n;
}
function qi(t) {
  for (const e in t)
    if (Object.prototype.hasOwnProperty.call(t, e)) {
      const n = t[e];
      if (n instanceof Error) return n;
    }
}
function Ji(t) {
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
  const n = zi(t);
  return `${n && n !== "Object" ? `'${n}'` : "Object"} captured as exception with keys: ${e}`;
}
function zi(t) {
  try {
    const e = Object.getPrototypeOf(t);
    return e ? e.constructor.name : void 0;
  } catch {}
}
function Bi(t, e, n, s) {
  if (B(n)) return [n, void 0];
  e.synthetic = true;
  if (X(n)) {
    const e = t?.getOptions().normalizeDepth;
    const o = { __serialized__: ps(n, e) };
    const r = qi(n);
    if (r) return [r, o];
    const i = Ji(n);
    const a = s?.syntheticException || new Error(i);
    a.message = i;
    return [a, o];
  }
  const o = s?.syntheticException || new Error(n);
  o.message = `${n}`;
  return [o, void 0];
}
function Wi(t, e, n, s) {
  const o = s?.data && s.data.mechanism;
  const r = o || { handled: true, type: "generic" };
  const [i, a] = Bi(t, r, n, s);
  const c = { exception: { values: [Ui(e, i)] } };
  a && (c.extra = a);
  Rt(c, void 0, void 0);
  Dt(c, r);
  return { ...c, event_id: s?.event_id };
}
function Vi(t, e, n = "info", s, o) {
  const r = { event_id: s?.event_id, level: n };
  if (o && s?.syntheticException) {
    const n = Li(t, s.syntheticException);
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
    Fi(t);
    super(t);
    this._setUpMetricsProcessing();
  }
  eventFromException(t, e) {
    const n = Wi(this, this._options.stackParser, t, e);
    n.level = "error";
    return ko(n);
  }
  eventFromMessage(t, e = "info", n) {
    return ko(
      Vi(this._options.stackParser, t, e, n, this._options.attachStacktrace),
    );
  }
  captureException(t, e, n) {
    Ki(e);
    return super.captureException(t, e, n);
  }
  captureEvent(t, e, n) {
    const s = !t.type && t.exception?.values && t.exception.values.length > 0;
    s && Ki(e);
    return super.captureEvent(t, e, n);
  }
  /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */ captureCheckIn(e, n, s) {
    const o = "checkInId" in e && e.checkInId ? e.checkInId : jt();
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
    const [l, p] = Nr(this, s);
    p && (u.contexts = { trace: p });
    const f = Ri(u, l, this.getSdkMetadata(), c, this.getDsn());
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
function Ki(t) {
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
 */ function Gi(e, n) {
  n.debug === true &&
    (t
      ? y.enable()
      : u(() => {
          console.warn(
            "[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.",
          );
        }));
  const s = ye();
  s.update(n.initialScope);
  const o = new e(n);
  Hi(o);
  o.init();
  return o;
}
function Hi(t) {
  ye().setClient(t);
}
const Zi = 100;
const Yi = 5e3;
const Xi = 36e5;
/**
 * Wraps a transport and stores and retries events when they fail to send.
 *
 * @param createTransport The transport to wrap.
 */ function Qi(e) {
  function n(...e) {
    t && y.log("[Offline]:", ...e);
  }
  return (t) => {
    const s = e(t);
    if (!t.createStore)
      throw new Error("No `createStore` function was provided");
    const o = t.createStore(t);
    let r = Yi;
    let i;
    function a(e, n, s) {
      return (
        !ks(e, ["client_report"]) && (!t.shouldStore || t.shouldStore(e, n, s))
      );
    }
    function c(t) {
      i && clearTimeout(i);
      i = setTimeout(async () => {
        i = void 0;
        const t = await o.shift();
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
        r = Math.min(r * 2, Xi);
      }
    }
    async function l(e, i = false) {
      if (!i && ks(e, ["replay_event", "replay_recording"])) {
        await o.push(e);
        c(Zi);
        return {};
      }
      try {
        if (t.shouldSend && (await t.shouldSend(e)) === false)
          throw new Error(
            "Envelope not sent because `shouldSend` callback returned false",
          );
        const n = await s.send(e);
        let o = Zi;
        if (n)
          if (n.headers?.["retry-after"]) o = ai(n.headers["retry-after"]);
          else if (n.headers?.["x-sentry-rate-limits"]) o = 6e4;
          else if ((n.statusCode || 0) >= 400) return n;
        c(o);
        r = Yi;
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
          r = Yi;
          c(Zi);
        }
        return s.flush(t);
      },
    };
  };
}
const ta = "MULTIPLEXED_TRANSPORT_EXTRA_KEY";
function ea(t, e) {
  let n;
  Ss(t, (t, s) => {
    e.includes(s) && (n = Array.isArray(t) ? t[1] : void 0);
    return !!n;
  });
  return n;
}
function na(t, e) {
  return (n) => {
    const s = t(n);
    return {
      ...s,
      send: async (t) => {
        const n = ea(t, ["event", "transaction", "profile", "replay_event"]);
        n && (n.release = e);
        return s.send(t);
      },
    };
  };
}
function sa(t, e) {
  return bs(e ? { ...t[0], dsn: e } : t[0], t[1]);
}
function oa(t, e) {
  return (n) => {
    const s = t(n);
    const o = new Map();
    const r =
      e ||
      ((t) => {
        const e = t.getEvent();
        return e?.extra?.[ta] && Array.isArray(e.extra[ta]) ? e.extra[ta] : [];
      });
    function i(e, s) {
      const r = s ? `${e}:${s}` : e;
      let i = o.get(r);
      if (!i) {
        const a = fn(e);
        if (!a) return;
        const c = kr(a, n.tunnel);
        i = s ? na(t, s)({ ...n, url: c }) : t({ ...n, url: c });
        o.set(r, i);
      }
      return [e, i];
    }
    async function a(t) {
      function e(e) {
        const n = e?.length ? e : ["event"];
        return ea(t, n);
      }
      const n = r({ envelope: t, getEvent: e })
        .map((t) =>
          typeof t === "string" ? i(t, void 0) : i(t.dsn, t.release),
        )
        .filter((t) => !!t);
      const o = n.length ? n : [["", s]];
      const a = await Promise.all(o.map(([e, n]) => n.send(sa(t, e))));
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
const ra = new Set();
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
 */ function ia(e) {
  e.forEach((e) => {
    ra.add(e);
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
 */ function aa(t) {
  return ra.has(t);
}
function ca() {
  ra.clear();
  t && y.log("Cleared AI provider skip registrations");
}
const ua = "thismessage:/";
/**
 * Checks if the URL object is relative
 *
 * @param url - The URL object to check
 * @returns True if the URL object is relative, false otherwise
 */ function la(t) {
  return "isRelative" in t;
}
/**
 * Parses string to a URL object
 *
 * @param url - The URL to parse
 * @returns The parsed URL object or undefined if the URL is invalid
 */ function pa(t, e) {
  const n = t.indexOf("://") <= 0 && t.indexOf("//") !== 0;
  const s = e ?? (n ? ua : void 0);
  try {
    if ("canParse" in URL && !URL.canParse(t, s)) return;
    const e = new URL(t, s);
    return n
      ? { isRelative: n, pathname: e.pathname, search: e.search, hash: e.hash }
      : e;
  } catch {}
}
function fa(t) {
  if (la(t)) return t.pathname;
  const e = new URL(t);
  e.search = "";
  e.hash = "";
  ["80", "443"].includes(e.port) && (e.port = "");
  e.password && (e.password = "%filtered%");
  e.username && (e.username = "%filtered%");
  return e.toString();
}
function da(t, e, n, s) {
  const o = n?.method?.toUpperCase() ?? "GET";
  const r = s || (t ? (e === "client" ? fa(t) : t.pathname) : "/");
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
 */ function ma(t, e, n, s, o) {
  const r = { [$e]: n, [Ee]: "url" };
  if (o) {
    r[e === "server" ? "http.route" : "url.template"] = o;
    r[Ee] = "route";
  }
  s?.method && (r[Le] = s.method.toUpperCase());
  if (t) {
    t.search && (r["url.query"] = t.search);
    t.hash && (r["url.fragment"] = t.hash);
    if (t.pathname) {
      r["url.path"] = t.pathname;
      t.pathname === "/" && (r[Ee] = "route");
    }
    if (!la(t)) {
      r[Ue] = t.href;
      t.port && (r["url.port"] = t.port);
      t.protocol && (r["url.scheme"] = t.protocol);
      t.hostname &&
        (r[e === "server" ? "server.address" : "url.domain"] = t.hostname);
    }
  }
  return [da(t, e, s, o), r];
}
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */ function ga(t) {
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
 */ function ha(t) {
  return t.split(/[?#]/, 1)[0];
}
function _a(t) {
  const { protocol: e, host: n, path: s } = t;
  const o =
    n
      ?.replace(/^.*@/, "[filtered]:[filtered]@")
      .replace(/(:80)$/, "")
      .replace(/(:443)$/, "") || "";
  return `${e ? `${e}://` : ""}${o}${s}`;
}
/**
 * Checks whether given url points to Sentry server
 *
 * @param url url to verify
 */ function ya(t, e) {
  const n = e?.getDsn();
  const s = e?.getOptions().tunnel;
  return va(t, n) || ba(t, s);
}
function ba(t, e) {
  return !!e && Sa(t) === Sa(e);
}
function va(t, e) {
  const n = pa(t);
  return (
    !(!n || la(n)) &&
    !!e &&
    n.host.includes(e.host) &&
    /(^|&|\?)sentry_key=/.test(n.search)
  );
}
function Sa(t) {
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
 */ function ka(t, ...e) {
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
 */ const wa = ka;
/**
 * @internal
 * @deprecated -- set ip inferral via via SDK metadata options on client instead.
 */ function xa(t) {
  t.user?.ip_address === void 0 &&
    (t.user = { ...t.user, ip_address: "{{auto}}" });
}
function Ea(t) {
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
 */ function Aa(t, e, s = [e], o = "npm") {
  const r = t._metadata || {};
  r.sdk ||
    (r.sdk = {
      name: `sentry.javascript.${e}`,
      packages: s.map((t) => ({ name: `${o}:@sentry/${t}`, version: n })),
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
 */ function Ta(t = {}) {
  const e = t.client || we();
  if (!fr() || !e) return {};
  const n = s();
  const o = _e(n);
  if (o.getTraceData) return o.getTraceData(t);
  const r = t.scope || ye();
  const i = t.span || Kn();
  const a = i ? Cn(i) : Ia(r);
  const c = i ? cs(i) : as(e, r);
  const u = sn(c);
  const l = bn.test(a);
  if (!l) {
    y.warn("Invalid sentry-trace data. Cannot generate trace data");
    return {};
  }
  const p = { "sentry-trace": a, baggage: u };
  if (t.propagateTraceparent) {
    const t = i ? Nn(i) : $a(r);
    t && (p.traceparent = t);
  }
  return p;
}
function Ia(t) {
  const {
    traceId: e,
    sampled: n,
    propagationSpanId: s,
  } = t.getPropagationContext();
  return kn(e, s, n);
}
function $a(t) {
  const {
    traceId: e,
    sampled: n,
    propagationSpanId: s,
  } = t.getPropagationContext();
  return wn(e, s, n);
}
function Oa(t) {
  return Object.entries(t || Ta())
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
 */ function Ca(t, e, n) {
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
function Na(t) {
  const e = {};
  try {
    t.forEach((t, n) => {
      typeof t === "string" && (e[n] = t);
    });
  } catch {}
  return e;
}
function ja(t) {
  const e = Object.create(null);
  try {
    Object.entries(t).forEach(([t, n]) => {
      typeof n === "string" && (e[t] = n);
    });
  } catch {}
  return e;
}
function Pa(t) {
  const e = Na(t.headers);
  return { method: t.method, url: t.url, query_string: La(t.url), headers: e };
}
function Ma(t) {
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
  const a = Ra({ url: i, host: s, protocol: r });
  const c = t.body || void 0;
  const u = t.cookies;
  return {
    url: a,
    method: t.method,
    query_string: La(i),
    headers: ja(e),
    cookies: u,
    data: c,
  };
}
function Ra({ url: t, protocol: e, host: n }) {
  return t?.startsWith("http") ? t : t && n ? `${e}://${n}${t}` : void 0;
}
const Da = [
  "auth",
  "token",
  "secret",
  "cookie",
  "-user",
  "password",
  "key",
  "jwt",
  "bearer",
  "sso",
  "saml",
];
function Fa(t) {
  const e = {};
  try {
    Object.entries(t).forEach(([t, n]) => {
      if (n == null) return;
      const s = t.toLowerCase();
      const o = Da.some((t) => s.includes(t));
      const r = `http.request.header.${s.replace(/-/g, "_")}`;
      o
        ? (e[r] = "[Filtered]")
        : Array.isArray(n)
          ? (e[r] = n.map((t) => (t != null ? String(t) : t)).join(";"))
          : typeof n === "string" && (e[r] = n);
    });
  } catch {}
  return e;
}
function La(t) {
  if (t)
    try {
      const e = new URL(t, "http://s.io").search.slice(1);
      return e.length ? e : void 0;
    } catch {
      return;
    }
}
const Ua = 100;
function qa(t, e) {
  const n = we();
  const s = be();
  if (!n) return;
  const { beforeBreadcrumb: o = null, maxBreadcrumbs: r = Ua } = n.getOptions();
  if (r <= 0) return;
  const i = Wt();
  const a = { timestamp: i, ...t };
  const c = o ? u(() => o(a, e)) : a;
  if (c !== null) {
    n.emit && n.emit("beforeAddBreadcrumb", c, e);
    s.addBreadcrumb(c, r);
  }
}
let Ja;
const za = "FunctionToString";
const Ba = new WeakMap();
const Wa = () => ({
  name: za,
  setupOnce() {
    Ja = Function.prototype.toString;
    try {
      Function.prototype.toString = function (...t) {
        const e = ht(this);
        const n = Ba.has(we()) && e !== void 0 ? e : this;
        return Ja.apply(n, t);
      };
    } catch {}
  },
  setup(t) {
    Ba.set(t, true);
  },
});
const Va = Cr(Wa);
const Ka = [
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
const Ga = "EventFilters";
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
 */ const Ha = Cr((t = {}) => {
  let e;
  return {
    name: Ga,
    setup(n) {
      const s = n.getOptions();
      e = Ya(t, s);
    },
    processEvent(n, s, o) {
      if (!e) {
        const n = o.getOptions();
        e = Ya(t, n);
      }
      return Xa(n, e) ? null : n;
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
 */ const Za = Cr((t = {}) => ({ ...Ha(t), name: "InboundFilters" }));
function Ya(t = {}, e = {}) {
  return {
    allowUrls: [...(t.allowUrls || []), ...(e.allowUrls || [])],
    denyUrls: [...(t.denyUrls || []), ...(e.denyUrls || [])],
    ignoreErrors: [
      ...(t.ignoreErrors || []),
      ...(e.ignoreErrors || []),
      ...(t.disableErrorDefaults ? [] : Ka),
    ],
    ignoreTransactions: [
      ...(t.ignoreTransactions || []),
      ...(e.ignoreTransactions || []),
    ],
  };
}
function Xa(e, n) {
  if (e.type) {
    if (e.type === "transaction" && tc(e, n.ignoreTransactions)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`ignoreTransactions\` option.\nEvent: ${Mt(e)}`,
        );
      return true;
    }
  } else {
    if (Qa(e, n.ignoreErrors)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${Mt(e)}`,
        );
      return true;
    }
    if (rc(e)) {
      t &&
        y.warn(
          `Event dropped due to not having an error message, error type or stacktrace.\nEvent: ${Mt(e)}`,
        );
      return true;
    }
    if (ec(e, n.denyUrls)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${Mt(e)}.\nUrl: ${oc(e)}`,
        );
      return true;
    }
    if (!nc(e, n.allowUrls)) {
      t &&
        y.warn(
          `Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${Mt(e)}.\nUrl: ${oc(e)}`,
        );
      return true;
    }
  }
  return false;
}
function Qa(t, e) {
  return !!e?.length && mi(t).some((t) => $t(t, e));
}
function tc(t, e) {
  if (!e?.length) return false;
  const n = t.transaction;
  return !!n && $t(n, e);
}
function ec(t, e) {
  if (!e?.length) return false;
  const n = oc(t);
  return !!n && $t(n, e);
}
function nc(t, e) {
  if (!e?.length) return true;
  const n = oc(t);
  return !n || $t(n, e);
}
function sc(t = []) {
  for (let e = t.length - 1; e >= 0; e--) {
    const n = t[e];
    if (n && n.filename !== "<anonymous>" && n.filename !== "[native code]")
      return n.filename || null;
  }
  return null;
}
function oc(e) {
  try {
    const t = [...(e.exception?.values ?? [])]
      .reverse()
      .find(
        (t) =>
          t.mechanism?.parent_id === void 0 && t.stacktrace?.frames?.length,
      );
    const n = t?.stacktrace?.frames;
    return n ? sc(n) : null;
  } catch {
    t && y.error(`Cannot extract url for event ${Mt(e)}`);
    return null;
  }
}
function rc(t) {
  return (
    !!t.exception?.values?.length &&
    !t.message &&
    !t.exception.values.some(
      (t) => t.stacktrace || (t.type && t.type !== "Error") || t.value,
    )
  );
}
function ic(t, e, n, s, o, r) {
  if (!o.exception?.values || !r || !ot(r.originalException, Error)) return;
  const i =
    o.exception.values.length > 0
      ? o.exception.values[o.exception.values.length - 1]
      : void 0;
  i &&
    (o.exception.values = ac(
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
function ac(t, e, n, s, o, r, i, a) {
  if (r.length >= n + 1) return r;
  let c = [...r];
  if (ot(s[o], Error)) {
    cc(i, a);
    const r = t(e, s[o]);
    const u = c.length;
    uc(r, o, u, a);
    c = ac(t, e, n, s[o], o, [r, ...c], r, u);
  }
  Array.isArray(s.errors) &&
    s.errors.forEach((s, r) => {
      if (ot(s, Error)) {
        cc(i, a);
        const u = t(e, s);
        const l = c.length;
        uc(u, `errors[${r}]`, l, a);
        c = ac(t, e, n, s, o, [u, ...c], u, l);
      }
    });
  return c;
}
function cc(t, e) {
  t.mechanism = {
    handled: true,
    type: "auto.core.linked_errors",
    ...t.mechanism,
    ...(t.type === "AggregateError" && { is_exception_group: true }),
    exception_id: e,
  };
}
function uc(t, e, n, s) {
  t.mechanism = {
    handled: true,
    ...t.mechanism,
    type: "chained",
    source: e,
    exception_id: n,
    parent_id: s,
  };
}
const lc = "cause";
const pc = 5;
const fc = "LinkedErrors";
const dc = (t = {}) => {
  const e = t.limit || pc;
  const n = t.key || lc;
  return {
    name: fc,
    preprocessEvent(t, s, o) {
      const r = o.getOptions();
      ic(Ui, r.stackParser, n, e, t, s);
    },
  };
};
const mc = Cr(dc);
const gc = new Map();
const hc = new Set();
function _c(t) {
  if (e._sentryModuleMetadata)
    for (const n of Object.keys(e._sentryModuleMetadata)) {
      const s = e._sentryModuleMetadata[n];
      if (hc.has(n)) continue;
      hc.add(n);
      const o = t(n);
      for (const t of o.reverse())
        if (t.filename) {
          gc.set(t.filename, s);
          break;
        }
    }
}
function yc(t, e) {
  _c(t);
  return gc.get(e);
}
function bc(t, e) {
  e.exception?.values?.forEach((e) => {
    e.stacktrace?.frames?.forEach((e) => {
      if (!e.filename || e.module_metadata) return;
      const n = yc(t, e.filename);
      n && (e.module_metadata = n);
    });
  });
}
function vc(t) {
  t.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((t) => {
      delete t.module_metadata;
    });
  });
}
const Sc = Cr(() => ({
  name: "ModuleMetadata",
  setup(t) {
    t.on("beforeEnvelope", (t) => {
      Ss(t, (t, e) => {
        if (e === "event") {
          const e = Array.isArray(t) ? t[1] : void 0;
          if (e) {
            vc(e);
            t[1] = e;
          }
        }
      });
    });
    t.on("applyFrameMetadata", (e) => {
      if (e.type) return;
      const n = t.getOptions().stackParser;
      bc(n, e);
    });
  },
}));
function kc(t) {
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
const wc = [
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
function xc(t) {
  const e = wc.map((e) => {
    const n = t[e];
    const s = Array.isArray(n) ? n.join(";") : n;
    return e === "Forwarded" ? Ec(s) : s?.split(",").map((t) => t.trim());
  });
  const n = e.reduce((t, e) => (e ? t.concat(e) : t), []);
  const s = n.find((t) => t !== null && Ac(t));
  return s || null;
}
function Ec(t) {
  if (!t) return null;
  for (const e of t.split(";")) if (e.startsWith("for=")) return e.slice(4);
  return null;
}
function Ac(t) {
  const e =
    /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/;
  return e.test(t);
}
const Tc = {
  cookies: true,
  data: true,
  headers: true,
  query_string: true,
  url: true,
};
const Ic = "RequestData";
const $c = (t = {}) => {
  const e = { ...Tc, ...t.include };
  return {
    name: Ic,
    processEvent(t, n, s) {
      const { sdkProcessingMetadata: o = {} } = t;
      const { normalizedRequest: r, ipAddress: i } = o;
      const a = { ...e, ip: e.ip ?? s.getOptions().sendDefaultPii };
      r && Cc(t, r, { ipAddress: i }, a);
      return t;
    },
  };
};
const Oc = Cr($c);
function Cc(t, e, n, s) {
  t.request = { ...t.request, ...Nc(e, s) };
  if (s.ip) {
    const s = (e.headers && xc(e.headers)) || n.ipAddress;
    s && (t.user = { ...t.user, ip_address: s });
  }
}
function Nc(t, e) {
  const n = {};
  const s = { ...t.headers };
  if (e.headers) {
    n.headers = s;
    e.cookies || delete s.cookie;
    e.ip ||
      wc.forEach((t) => {
        delete s[t];
      });
  }
  n.method = t.method;
  e.url && (n.url = t.url);
  if (e.cookies) {
    const e = t.cookies || (s?.cookie ? kc(s.cookie) : void 0);
    n.cookies = e || {};
  }
  e.query_string && (n.query_string = t.query_string);
  e.data && (n.data = t.data);
  return n;
}
function jc(t) {
  const e = "console";
  j(e, t);
  M(e, Pc);
}
function Pc() {
  "console" in e &&
    i.forEach(function (t) {
      t in e.console &&
        dt(e.console, t, function (n) {
          c[t] = n;
          return function (...n) {
            const s = { args: n, level: t };
            R("console", s);
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
 */ function Mc(t) {
  return t === "warn"
    ? "warning"
    : ["fatal", "error", "warning", "log", "info", "debug"].includes(t)
      ? t
      : "log";
}
const Rc = "CaptureConsole";
const Dc = (t = {}) => {
  const n = t.levels || i;
  const s = t.handled ?? true;
  return {
    name: Rc,
    setup(t) {
      "console" in e &&
        jc(({ args: e, level: o }) => {
          we() === t && n.includes(o) && Lc(e, o, s);
        });
    },
  };
};
const Fc = Cr(Dc);
function Lc(t, e, n) {
  const s = Mc(e);
  const o = new Error();
  const r = { level: Mc(e), extra: { arguments: t } };
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
        i.captureMessage(e, s, { captureContext: r, syntheticException: o });
      }
      return;
    }
    const a = t.find((t) => t instanceof Error);
    if (a) {
      Yo(a, r);
      return;
    }
    const c = Tt(t, " ");
    i.captureMessage(c, s, { captureContext: r, syntheticException: o });
  });
}
const Uc = "Dedupe";
const qc = () => {
  let e;
  return {
    name: Uc,
    processEvent(n) {
      if (n.type) return n;
      try {
        if (zc(n, e)) {
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
const Jc = Cr(qc);
function zc(t, e) {
  return !!e && (!!Bc(t, e) || !!Wc(t, e));
}
function Bc(t, e) {
  const n = t.message;
  const s = e.message;
  return (
    !(!n && !s) &&
    !((n && !s) || (!n && s)) &&
    n === s &&
    !!Kc(t, e) &&
    !!Vc(t, e)
  );
}
function Wc(t, e) {
  const n = Gc(e);
  const s = Gc(t);
  return (
    !(!n || !s) &&
    n.type === s.type &&
    n.value === s.value &&
    !!Kc(t, e) &&
    !!Vc(t, e)
  );
}
function Vc(t, e) {
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
function Kc(t, e) {
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
function Gc(t) {
  return t.exception?.values?.[0];
}
const Hc = "ExtraErrorData";
const Zc = (t = {}) => {
  const { depth: e = 3, captureErrorCause: n = true } = t;
  return {
    name: Hc,
    processEvent(t, s, o) {
      const { maxValueLength: r } = o.getOptions();
      return Xc(t, s, e, n, r);
    },
  };
};
const Yc = Cr(Zc);
function Xc(t, e = {}, n, s, o) {
  if (!e.originalException || !B(e.originalException)) return t;
  const r = e.originalException.name || e.originalException.constructor.name;
  const i = Qc(e.originalException, s, o);
  if (i) {
    const e = { ...t.contexts };
    const s = ls(i, n);
    if (X(s)) {
      mt(s, "__sentry_skip_normalization__", true);
      e[r] = s;
    }
    return { ...t, contexts: e };
  }
  return t;
}
function Qc(e, n, s) {
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
      o[n] = B(r) || typeof r === "string" ? (s ? Et(`${r}`, s) : `${r}`) : r;
    }
    if (n && e.cause !== void 0)
      if (B(e.cause)) {
        const t = e.cause.name || e.cause.constructor.name;
        o.cause = { [t]: Qc(e.cause, false, s) };
      } else o.cause = e.cause;
    if (typeof e.toJSON === "function") {
      const t = e.toJSON();
      for (const e of Object.keys(t)) {
        const n = t[e];
        o[e] = B(n) ? n.toString() : n;
      }
    }
    return o;
  } catch (e) {
    t && y.error("Unable to extract extra data from the Error object:", e);
  }
  return null;
}
function tu(t, e) {
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
const eu =
  /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
function nu(t) {
  const e = t.length > 1024 ? `<truncated>${t.slice(-1024)}` : t;
  const n = eu.exec(e);
  return n ? n.slice(1) : [];
}
function su(...t) {
  let e = "";
  let n = false;
  for (let s = t.length - 1; s >= -1 && !n; s--) {
    const o = s >= 0 ? t[s] : "/";
    if (o) {
      e = `${o}/${e}`;
      n = o.charAt(0) === "/";
    }
  }
  e = tu(
    e.split("/").filter((t) => !!t),
    !n,
  ).join("/");
  return (n ? "/" : "") + e || ".";
}
function ou(t) {
  let e = 0;
  for (; e < t.length; e++) if (t[e] !== "") break;
  let n = t.length - 1;
  for (; n >= 0; n--) if (t[n] !== "") break;
  return e > n ? [] : t.slice(e, n - e + 1);
}
function ru(t, e) {
  t = su(t).slice(1);
  e = su(e).slice(1);
  const n = ou(t.split("/"));
  const s = ou(e.split("/"));
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
function iu(t) {
  const e = au(t);
  const n = t.slice(-1) === "/";
  let s = tu(
    t.split("/").filter((t) => !!t),
    !e,
  ).join("/");
  s || e || (s = ".");
  s && n && (s += "/");
  return (e ? "/" : "") + s;
}
function au(t) {
  return t.charAt(0) === "/";
}
function cu(...t) {
  return iu(t.join("/"));
}
function uu(t) {
  const e = nu(t);
  const n = e[0] || "";
  let s = e[1];
  if (!n && !s) return ".";
  s && (s = s.slice(0, s.length - 1));
  return n + s;
}
function lu(t, e) {
  let n = nu(t)[2] || "";
  e && n.slice(e.length * -1) === e && (n = n.slice(0, n.length - e.length));
  return n;
}
const pu = "RewriteFrames";
const fu = Cr((t = {}) => {
  const n = t.root;
  const s = t.prefix || "app:///";
  const o = "window" in e && !!e.window;
  const r = t.iteratee || du({ isBrowser: o, root: n, prefix: s });
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
    name: pu,
    processEvent(t) {
      let e = t;
      t.exception && Array.isArray(t.exception.values) && (e = i(e));
      return e;
    },
  };
});
function du({ isBrowser: t, root: e, prefix: n }) {
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
      const r = e ? ru(e, t) : lu(t);
      s.filename = `${n}${r}`;
    }
    return s;
  };
}
const mu = [
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
const gu = [
  "createUser",
  "deleteUser",
  "listUsers",
  "getUserById",
  "updateUserById",
  "inviteUserByEmail",
];
const hu = {
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
const _u = ["select", "insert", "upsert", "update", "delete"];
function yu(t) {
  try {
    t.__SENTRY_INSTRUMENTED__ = true;
  } catch {}
}
function bu(t) {
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
 */ function vu(t, e = {}) {
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
 */ function Su(t, e) {
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
          : (n && hu[n]) || "filter";
  return `${o}(${t}, ${s.join(".")})`;
}
function ku(t, e = false) {
  return new Proxy(t, {
    apply(n, s, o) {
      return Ys(
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
          Reflect.apply(n, s, o)
            .then((e) => {
              if (e && typeof e === "object" && "error" in e && e.error) {
                t.setStatus({ code: Be });
                Yo(e.error, {
                  mechanism: { handled: false, type: "auto.db.supabase.auth" },
                });
              } else t.setStatus({ code: ze });
              t.end();
              return e;
            })
            .catch((e) => {
              t.setStatus({ code: Be });
              t.end();
              Yo(e, {
                mechanism: { handled: false, type: "auto.db.supabase.auth" },
              });
              throw e;
            })
            .then(...o),
      );
    },
  });
}
function wu(t) {
  const e = t.auth;
  if (e && !bu(t.auth)) {
    for (const n of mu) {
      const s = e[n];
      s && typeof t.auth[n] === "function" && (t.auth[n] = ku(s));
    }
    for (const n of gu) {
      const s = e.admin[n];
      s &&
        typeof t.auth.admin[n] === "function" &&
        (t.auth.admin[n] = ku(s, true));
    }
    yu(t.auth);
  }
}
function xu(t) {
  if (!bu(t.prototype.from)) {
    t.prototype.from = new Proxy(t.prototype.from, {
      apply(t, e, n) {
        const s = Reflect.apply(t, e, n);
        const o = s.constructor;
        Au(o);
        return s;
      },
    });
    yu(t.prototype.from);
  }
}
function Eu(t) {
  if (!bu(t.prototype.then)) {
    t.prototype.then = new Proxy(t.prototype.then, {
      apply(t, e, n) {
        const s = _u;
        const o = e;
        const r = vu(o.method, o.headers);
        if (!s.includes(r)) return Reflect.apply(t, e, n);
        if (!o?.url?.pathname || typeof o.url.pathname !== "string")
          return Reflect.apply(t, e, n);
        const i = o.url.pathname.split("/");
        const a = i.length > 0 ? i[i.length - 1] : "";
        const c = [];
        for (const [t, e] of o.url.searchParams.entries()) c.push(Su(t, e));
        const u = Object.create(null);
        if (X(o.body)) for (const [t, e] of Object.entries(o.body)) u[t] = e;
        const l = `${r === "select" ? "" : `${r}${u ? "(...) " : ""}`}${c.join(" ")} from(${a})`;
        const p = {
          "db.table": a,
          "db.schema": o.schema,
          "db.url": o.url.origin,
          "db.sdk": o.headers["X-Client-Info"],
          "db.system": "postgresql",
          "db.operation": r,
          [$e]: "auto.db.supabase",
          [Ie]: "db",
        };
        c.length && (p["db.query"] = c);
        Object.keys(u).length && (p["db.body"] = u);
        return Ys({ name: l, attributes: p }, (s) =>
          Reflect.apply(t, e, [])
            .then(
              (t) => {
                if (s) {
                  t &&
                    typeof t === "object" &&
                    "status" in t &&
                    Ve(s, t.status || 500);
                  s.end();
                }
                if (t.error) {
                  const e = new Error(t.error.message);
                  t.error.code && (e.code = t.error.code);
                  t.error.details && (e.details = t.error.details);
                  const n = {};
                  c.length && (n.query = c);
                  Object.keys(u).length && (n.body = u);
                  Yo(e, (t) => {
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
                qa(e);
                return t;
              },
              (t) => {
                if (s) {
                  Ve(s, 500);
                  s.end();
                }
                throw t;
              },
            )
            .then(...n),
        );
      },
    });
    yu(t.prototype.then);
  }
}
function Au(e) {
  for (const n of _u)
    if (!bu(e.prototype[n])) {
      e.prototype[n] = new Proxy(e.prototype[n], {
        apply(e, s, o) {
          const r = Reflect.apply(e, s, o);
          const i = r.constructor;
          t && y.log(`Instrumenting ${n} operation's PostgRESTFilterBuilder`);
          Eu(i);
          return r;
        },
      });
      yu(e.prototype[n]);
    }
}
const Tu = (e) => {
  if (!e) {
    t &&
      y.warn(
        "Supabase integration was not installed because no Supabase client was provided.",
      );
    return;
  }
  const n = e.constructor === Function ? e : e.constructor;
  xu(n);
  wu(e);
};
const Iu = "Supabase";
const $u = (t) => ({
  setupOnce() {
    Tu(t);
  },
  name: Iu,
});
const Ou = Cr((t) => $u(t.supabaseClient));
const Cu = 10;
const Nu = "ZodErrors";
function ju(t) {
  return B(t) && t.name === "ZodError" && Array.isArray(t.issues);
}
function Pu(t) {
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
 */ function Mu(t) {
  return t.map((t) => (typeof t === "number" ? "<array>" : t)).join(".");
}
function Ru(t) {
  const e = new Set();
  for (const n of t.issues) {
    const t = Mu(n.path);
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
function Du(t, e = false, n, s) {
  if (
    !n.exception?.values ||
    !s.originalException ||
    !ju(s.originalException) ||
    s.originalException.issues.length === 0
  )
    return n;
  try {
    const o = e
      ? s.originalException.issues
      : s.originalException.issues.slice(0, t);
    const r = o.map(Pu);
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
          { ...n.exception.values[0], value: Ru(s.originalException) },
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
const Fu = (t = {}) => {
  const e = t.limit ?? Cu;
  return {
    name: Nu,
    processEvent(n, s) {
      const o = Du(e, t.saveZodIssuesAsAttachment, n, s);
      return o;
    },
  };
};
const Lu = Cr(Fu);
const Uu = Cr((t) => ({
  name: "ThirdPartyErrorsFilter",
  setup(t) {
    t.on("beforeEnvelope", (t) => {
      Ss(t, (t, e) => {
        if (e === "event") {
          const e = Array.isArray(t) ? t[1] : void 0;
          if (e) {
            vc(e);
            t[1] = e;
          }
        }
      });
    });
    t.on("applyFrameMetadata", (e) => {
      if (e.type) return;
      const n = t.getOptions().stackParser;
      bc(n, e);
    });
  },
  processEvent(e) {
    const n = qu(e);
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
function qu(t) {
  const e = $(t);
  if (e)
    return e
      .filter((t) => !!t.filename && (t.lineno ?? t.colno) != null)
      .map((t) =>
        t.module_metadata
          ? Object.keys(t.module_metadata)
              .filter((t) => t.startsWith(Ju))
              .map((t) => t.slice(Ju.length))
          : [],
      );
}
const Ju = "_sentryBundlerPluginAppKey:";
const zu = "Console";
const Bu = Cr((t = {}) => {
  const e = new Set(t.levels || i);
  return {
    name: zu,
    setup(t) {
      jc(({ args: n, level: s }) => {
        we() === t && e.has(s) && Wu(s, n);
      });
    },
  };
});
function Wu(t, e) {
  const n = {
    category: "console",
    data: { arguments: e, logger: "console" },
    level: Mc(t),
    message: Vu(e),
  };
  if (t === "assert") {
    if (e[0] !== false) return;
    {
      const t = e.slice(1);
      n.message =
        t.length > 0 ? `Assertion failed: ${Vu(t)}` : "Assertion failed";
      n.data.arguments = t;
    }
  }
  qa(n, { input: e, level: t });
}
function Vu(t) {
  return "util" in e && typeof e.util.format === "function"
    ? e.util.format(...t)
    : Tt(t, " ");
}
const Ku = 100;
const Gu = 10;
const Hu = "flag.evaluation.";
function Zu(t) {
  const e = ye();
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
 */ function Yu(t, e, n = Ku) {
  const s = ye().getScopeData().contexts;
  s.flags || (s.flags = { values: [] });
  const o = s.flags.values;
  Xu(o, t, e, n);
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
 */ function Xu(e, n, s, o) {
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
 */ function Qu(t, e, n = Gu) {
  if (typeof e !== "boolean") return;
  const s = Kn();
  if (!s) return;
  const o = Rn(s).data;
  if (`${Hu}${t}` in o) {
    s.setAttribute(`${Hu}${t}`, e);
    return;
  }
  const r = Object.keys(o).filter((t) => t.startsWith(Hu)).length;
  r < n && s.setAttribute(`${Hu}${t}`, e);
}
const tl = Cr(() => ({
  name: "FeatureFlags",
  processEvent(t, e, n) {
    return Zu(t);
  },
  addFeatureFlag(t, e) {
    Yu(t, e);
    Qu(t, e);
  },
}));
const el = Cr(({ growthbookClass: t }) => ({
  name: "GrowthBook",
  setupOnce() {
    const e = t.prototype;
    typeof e.isOn === "function" && dt(e, "isOn", nl);
    typeof e.getFeatureValue === "function" && dt(e, "getFeatureValue", nl);
  },
  processEvent(t, e, n) {
    return Zu(t);
  },
}));
function nl(t) {
  return function (...e) {
    const n = e[0];
    const s = t.apply(this, e);
    if (typeof n === "string" && typeof s === "boolean") {
      Yu(n, s);
      Qu(n, s);
    }
    return s;
  };
}
function sl(t) {
  return (
    !!t &&
    typeof t._profiler !== "undefined" &&
    typeof t._profiler.start === "function" &&
    typeof t._profiler.stop === "function"
  );
}
function ol() {
  const e = we();
  if (!e) {
    t && y.warn("No Sentry client available, profiling is not started");
    return;
  }
  const n = e.getIntegrationByName("ProfilingIntegration");
  n
    ? sl(n)
      ? n._profiler.start()
      : t && y.warn("Profiler is not available on profiling integration.")
    : t && y.warn("ProfilingIntegration is not available");
}
function rl() {
  const e = we();
  if (!e) {
    t && y.warn("No Sentry client available, profiling is not started");
    return;
  }
  const n = e.getIntegrationByName("ProfilingIntegration");
  n
    ? sl(n)
      ? n._profiler.stop()
      : t && y.warn("Profiler is not available on profiling integration.")
    : t && y.warn("ProfilingIntegration is not available");
}
const il = { startProfiler: ol, stopProfiler: rl };
/**
 * Create and track fetch request spans for usage in combination with `addFetchInstrumentationHandler`.
 *
 * @returns Span if a span was created, otherwise void.
 */ function al(t, e, n, s, o) {
  if (!t.fetchData) return;
  const { method: r, url: i } = t.fetchData;
  const a = Xn() && e(i);
  if (t.endTimestamp && a) {
    const e = t.fetchData.__span;
    if (!e) return;
    const n = s[e];
    if (n) {
      ll(n, t);
      cl(n, t, o);
      delete s[e];
    }
    return;
  }
  const {
    spanOrigin: c = "auto.http.browser",
    propagateTraceparent: u = false,
  } = typeof o === "object" ? o : { spanOrigin: o };
  const l = !!Kn();
  const p = a && l ? Qs(dl(i, r, c)) : new SentryNonRecordingSpan();
  t.fetchData.__span = p.spanContext().spanId;
  s[p.spanContext().spanId] = p;
  if (n(t.fetchData.url)) {
    const e = t.args[0];
    const n = t.args[1] || {};
    const s = ul(e, n, Xn() && l ? p : void 0, u);
    if (s) {
      t.args[1] = n;
      n.headers = s;
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
function cl(t, e, n) {
  const s = typeof n === "object" && n !== null ? n.onRequestSpanEnd : void 0;
  s?.(t, { headers: e.response?.headers, error: e.error });
}
function ul(t, e, n, s) {
  const o = Ta({ span: n, propagateTraceparent: s });
  const r = o["sentry-trace"];
  const i = o.baggage;
  const a = o.traceparent;
  if (!r) return;
  const c = e.headers || (it(t) ? t.headers : void 0);
  if (c) {
    if (fl(c)) {
      const t = new Headers(c);
      t.get("sentry-trace") || t.set("sentry-trace", r);
      s && a && !t.get("traceparent") && t.set("traceparent", a);
      if (i) {
        const e = t.get("baggage");
        e ? pl(e) || t.set("baggage", `${e},${i}`) : t.set("baggage", i);
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
      const e = c.find((t) => t[0] === "baggage" && pl(t[1]));
      i && !e && t.push(["baggage", i]);
      return t;
    }
    {
      const t = "sentry-trace" in c ? c["sentry-trace"] : void 0;
      const e = "traceparent" in c ? c.traceparent : void 0;
      const n = "baggage" in c ? c.baggage : void 0;
      const o = n ? (Array.isArray(n) ? [...n] : [n]) : [];
      const u = n && (Array.isArray(n) ? n.find((t) => pl(t)) : pl(n));
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
function ll(t, e) {
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
function pl(t) {
  return t.split(",").some((t) => t.trim().startsWith(Qe));
}
function fl(t) {
  return typeof Headers !== "undefined" && ot(t, Headers);
}
function dl(t, e, n) {
  const s = pa(t);
  return { name: s ? `${e} ${fa(s)}` : e, attributes: ml(t, s, e, n) };
}
function ml(t, e, n, s) {
  const o = {
    url: t,
    type: "fetch",
    "http.method": n,
    [$e]: s,
    [Ie]: "http.client",
  };
  if (e) {
    if (!la(e)) {
      o["http.url"] = e.href;
      o["server.address"] = e.host;
    }
    e.search && (o["http.query"] = e.search);
    e.hash && (o["http.fragment"] = e.hash);
  }
  return o;
}
const gl = { mechanism: { handled: false, type: "auto.rpc.trpc.middleware" } };
function hl(t) {
  typeof t === "object" &&
    t !== null &&
    "ok" in t &&
    !t.ok &&
    "error" in t &&
    Yo(t.error, gl);
}
function _l(t = {}) {
  return async function (e) {
    const { path: n, type: s, next: o, rawInput: r, getRawInput: i } = e;
    const a = we();
    const c = a?.getOptions();
    const u = { procedure_path: n, procedure_type: s };
    mt(
      u,
      "__sentry_override_normalization_depth__",
      1 + (c?.normalizeDepth ?? 5),
    );
    if (t.attachRpcInput !== void 0 ? t.attachRpcInput : c?.sendDefaultPii) {
      r !== void 0 && (u.input = ls(r));
      if (i !== void 0 && typeof i === "function")
        try {
          const t = await i();
          u.input = ls(t);
        } catch {}
    }
    return ke((e) => {
      e.setContext("trpc", u);
      return Xs(
        {
          name: `trpc/${n}`,
          op: "rpc.server",
          attributes: { [Ee]: "route", [$e]: "auto.rpc.trpc" },
          forceTransaction: !!t.forceTransaction,
        },
        async (t) => {
          try {
            const e = await o();
            hl(e);
            t.end();
            return e;
          } catch (e) {
            Yo(e, gl);
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
 */ function yl(t, e, n) {
  try {
    const s = we();
    if (!s) return;
    const o = Kn();
    o?.isRecording() && o.setStatus({ code: Be, message: "internal_error" });
    Yo(t, {
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
 */ function bl(t, e) {
  dt(
    t,
    e,
    (t) =>
      function (n, ...s) {
        const o = s[s.length - 1];
        if (typeof o !== "function") return t.call(this, n, ...s);
        const r = vl(o, e, n);
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
 */ function vl(e, n, s) {
  return function (...o) {
    try {
      return Sl.call(this, e, n, s, o);
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
 */ function Sl(t, e, n, s) {
  try {
    const o = t.apply(this, s);
    return o && typeof o === "object" && typeof o.then === "function"
      ? Promise.resolve(o).catch((t) => {
          kl(t, e, n);
          throw t;
        })
      : o;
  } catch (t) {
    kl(t, e, n);
    throw t;
  }
}
/**
 * Captures handler execution errors based on handler type
 * @internal
 * @param error - Error to capture
 * @param methodName - MCP method name
 * @param handlerName - Handler identifier
 */ function kl(t, e, n) {
  try {
    const s = {};
    if (e === "tool") {
      s.tool_name = n;
      t.name === "ProtocolValidationError" ||
      t.message.includes("validation") ||
      t.message.includes("protocol")
        ? yl(t, "validation", s)
        : t.name === "ServerTimeoutError" ||
            t.message.includes("timed out") ||
            t.message.includes("timeout")
          ? yl(t, "timeout", s)
          : yl(t, "tool_execution", s);
    } else if (e === "resource") {
      s.resource_uri = n;
      yl(t, "resource_execution", s);
    } else if (e === "prompt") {
      s.prompt_name = n;
      yl(t, "prompt_execution", s);
    }
  } catch (t) {}
}
/**
 * Wraps tool handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function wl(t) {
  bl(t, "tool");
}
/**
 * Wraps resource handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function xl(t) {
  bl(t, "resource");
}
/**
 * Wraps prompt handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function El(t) {
  bl(t, "prompt");
}
/**
 * Wraps all MCP handler types (tool, resource, prompt) for span correlation
 * @param serverInstance - MCP server instance
 */ function Al(t) {
  wl(t);
  xl(t);
  El(t);
}
const Tl = "mcp.method.name";
const Il = "mcp.request.id";
const $l = "mcp.session.id";
const Ol = "mcp.transport";
const Cl = "mcp.server.name";
const Nl = "mcp.server.title";
const jl = "mcp.server.version";
const Pl = "mcp.protocol.version";
const Ml = "mcp.tool.name";
const Rl = "mcp.resource.uri";
const Dl = "mcp.prompt.name";
const Fl = "mcp.tool.result.is_error";
const Ll = "mcp.tool.result.content_count";
const Ul = "mcp.tool.result.content";
const ql = "mcp.tool.result";
const Jl = "mcp.prompt.result.description";
const zl = "mcp.prompt.result.message_count";
const Bl = "mcp.prompt.result.message_content";
const Wl = "mcp.prompt.result";
const Vl = "mcp.request.argument";
const Kl = "mcp.logging.level";
const Gl = "mcp.logging.logger";
const Hl = "mcp.logging.data_type";
const Zl = "mcp.logging.message";
const Yl = "network.transport";
const Xl = "network.protocol.version";
const Ql = "client.address";
const tp = "client.port";
const ep = "mcp.server";
const np = "mcp.notification.client_to_server";
const sp = "mcp.notification.server_to_client";
const op = "auto.function.mcp_server";
const rp = "auto.mcp.notification";
const ip = "route";
const ap = new Set([Ql, tp, Zl, Jl, Bl, Rl, Ul]);
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
 */ function cp(t) {
  return (
    !!ap.has(t) ||
    !!t.startsWith(`${Vl}.`) ||
    !(
      (!t.startsWith(`${ql}.`) && !t.startsWith(`${Wl}.`)) ||
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
 */ function up(t, e) {
  return e
    ? t
    : Object.entries(t).reduce((t, [e, n]) => {
        cp(e) || (t[e] = n);
        return t;
      }, {});
}
/**
 * Validates if a message is a JSON-RPC request
 * @param message - Message to validate
 * @returns True if message is a JSON-RPC request
 */ function lp(t) {
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
 */ function pp(t) {
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
 */ function fp(t) {
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
 */ function dp(e) {
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
 */ function mp(t) {
  return t != null && typeof t === "object";
}
/**
 * Build attributes for tool result content items
 * @param content - Array of content items from tool result
 * @returns Attributes extracted from each content item including type, text, mime type, URI, and resource info
 */ function gp(t) {
  const e = { [Ll]: t.length };
  for (const [n, s] of t.entries()) {
    if (!mp(s)) continue;
    const o = t.length === 1 ? "mcp.tool.result" : `mcp.tool.result.${n}`;
    const r = (t, n) => {
      typeof n === "string" && (e[`${o}.${t}`] = n);
    };
    r("content_type", s.type);
    r("mime_type", s.mimeType);
    r("uri", s.uri);
    r("name", s.name);
    typeof s.text === "string" && (e[`${o}.content`] = s.text);
    typeof s.data === "string" && (e[`${o}.data_size`] = s.data.length);
    const i = s.resource;
    if (mp(i)) {
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
 */ function hp(t) {
  if (!mp(t)) return {};
  const e = Array.isArray(t.content) ? gp(t.content) : {};
  typeof t.isError === "boolean" && (e[Fl] = t.isError);
  return e;
}
/**
 * Extract prompt result attributes for span instrumentation
 * @param result - Prompt execution result
 * @returns Attributes extracted from prompt result
 */ function _p(t) {
  const e = {};
  if (!mp(t)) return e;
  typeof t.description === "string" && (e[Jl] = t.description);
  if (Array.isArray(t.messages)) {
    e[zl] = t.messages.length;
    const n = t.messages;
    for (const [t, s] of n.entries()) {
      if (!mp(s)) continue;
      const o = n.length === 1 ? "mcp.prompt.result" : `mcp.prompt.result.${t}`;
      const r = (t, s) => {
        if (typeof s === "string") {
          const r = n.length === 1 ? `${o}.message_${t}` : `${o}.${t}`;
          e[r] = s;
        }
      };
      r("role", s.role);
      if (mp(s.content)) {
        const t = s.content;
        if (typeof t.text === "string") {
          const s = n.length === 1 ? `${o}.message_content` : `${o}.content`;
          e[s] = t.text;
        }
      }
    }
  }
  return e;
}
const yp = new WeakMap();
/**
 * Gets or creates the span map for a specific transport instance
 * @internal
 * @param transport - MCP transport instance
 * @returns Span map for the transport
 */ function bp(t) {
  let e = yp.get(t);
  if (!e) {
    e = new Map();
    yp.set(t, e);
  }
  return e;
}
/**
 * Stores span context for later correlation with handler execution
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param span - Active span to correlate
 * @param method - MCP method name
 */ function vp(t, e, n, s) {
  const o = bp(t);
  o.set(e, { span: n, method: s, startTime: Date.now() });
}
/**
 * Completes span with tool results and cleans up correlation
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param result - Tool execution result for attribute extraction
 */ function Sp(t, e, n) {
  const s = bp(t);
  const o = s.get(e);
  if (o) {
    const { span: t, method: r } = o;
    if (r === "tools/call") {
      const e = hp(n);
      const s = we();
      const o = Boolean(s?.getOptions().sendDefaultPii);
      const r = up(e, o);
      t.setAttributes(r);
    } else if (r === "prompts/get") {
      const e = _p(n);
      const s = we();
      const o = Boolean(s?.getOptions().sendDefaultPii);
      const r = up(e, o);
      t.setAttributes(r);
    }
    t.end();
    s.delete(e);
  }
}
/**
 * Cleans up pending spans for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function kp(t) {
  const e = yp.get(t);
  if (e) {
    for (const [, t] of e) {
      t.span.setStatus({ code: Be, message: "cancelled" });
      t.span.end();
    }
    e.clear();
  }
}
const wp = new WeakMap();
/**
 * Stores session data for a transport with sessionId
 * @param transport - MCP transport instance
 * @param sessionData - Session data to store
 */ function xp(t, e) {
  t.sessionId && wp.set(t, e);
}
/**
 * Updates session data for a transport with sessionId (merges with existing data)
 * @param transport - MCP transport instance
 * @param partialSessionData - Partial session data to merge with existing data
 */ function Ep(t, e) {
  if (t.sessionId) {
    const n = wp.get(t) || {};
    wp.set(t, { ...n, ...e });
  }
}
/**
 * Retrieves client information for a transport
 * @param transport - MCP transport instance
 * @returns Client information if available
 */ function Ap(t) {
  return wp.get(t)?.clientInfo;
}
/**
 * Retrieves protocol version for a transport
 * @param transport - MCP transport instance
 * @returns Protocol version if available
 */ function Tp(t) {
  return wp.get(t)?.protocolVersion;
}
/**
 * Retrieves full session data for a transport
 * @param transport - MCP transport instance
 * @returns Complete session data if available
 */ function Ip(t) {
  return wp.get(t);
}
/**
 * Cleans up session data for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function $p(t) {
  wp.delete(t);
}
/**
 * Extracts and validates PartyInfo from an unknown object
 * @param obj - Unknown object that might contain party info
 * @returns Validated PartyInfo object with only string properties
 */ function Op(t) {
  const e = {};
  if (mp(t)) {
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
 */ function Cp(t) {
  const e = {};
  if (mp(t.params)) {
    typeof t.params.protocolVersion === "string" &&
      (e.protocolVersion = t.params.protocolVersion);
    t.params.clientInfo && (e.clientInfo = Op(t.params.clientInfo));
  }
  return e;
}
/**
 * Extracts session data from "initialize" response
 * @param result - "initialize" response result containing server info and protocol version
 * @returns Partial session data extracted from response including protocol version and server info
 */ function Np(t) {
  const e = {};
  if (mp(t)) {
    typeof t.protocolVersion === "string" &&
      (e.protocolVersion = t.protocolVersion);
    t.serverInfo && (e.serverInfo = Op(t.serverInfo));
  }
  return e;
}
/**
 * Build client attributes from stored client info
 * @param transport - MCP transport instance
 * @returns Client attributes for span instrumentation
 */ function jp(t) {
  const e = Ap(t);
  const n = {};
  e?.name && (n["mcp.client.name"] = e.name);
  e?.title && (n["mcp.client.title"] = e.title);
  e?.version && (n["mcp.client.version"] = e.version);
  return n;
}
/**
 * Build server attributes from stored server info
 * @param transport - MCP transport instance
 * @returns Server attributes for span instrumentation
 */ function Pp(t) {
  const e = Ip(t)?.serverInfo;
  const n = {};
  e?.name && (n[Cl] = e.name);
  e?.title && (n[Nl] = e.title);
  e?.version && (n[jl] = e.version);
  return n;
}
/**
 * Extracts client connection info from extra handler data
 * @param extra - Extra handler data containing connection info
 * @returns Client address and port information
 */ function Mp(t) {
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
 */ function Rp(t) {
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
 */ function Dp(t, e) {
  const n = t && "sessionId" in t ? t.sessionId : void 0;
  const s = e ? Mp(e) : {};
  const { mcpTransport: o, networkTransport: r } = Rp(t);
  const i = jp(t);
  const a = Pp(t);
  const c = Tp(t);
  const u = {
    ...(n && { [$l]: n }),
    ...(s.address && { [Ql]: s.address }),
    ...(s.port && { [tp]: s.port }),
    [Ol]: o,
    [Yl]: r,
    [Xl]: "2.0",
    ...(c && { [Pl]: c }),
    ...i,
    ...a,
  };
  return u;
}
const Fp = {
  "tools/call": {
    targetField: "name",
    targetAttribute: Ml,
    captureArguments: true,
    argumentsField: "arguments",
  },
  "resources/read": {
    targetField: "uri",
    targetAttribute: Rl,
    captureUri: true,
  },
  "resources/subscribe": { targetField: "uri", targetAttribute: Rl },
  "resources/unsubscribe": { targetField: "uri", targetAttribute: Rl },
  "prompts/get": {
    targetField: "name",
    targetAttribute: Dl,
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
 */ function Lp(t, e) {
  const n = Fp[t];
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
 */ function Up(t, e) {
  const n = {};
  const s = Fp[t];
  if (!s) return n;
  if (s.captureArguments && s.argumentsField && e?.[s.argumentsField]) {
    const t = e[s.argumentsField];
    if (typeof t === "object" && t !== null)
      for (const [e, s] of Object.entries(t))
        n[`${Vl}.${e.toLowerCase()}`] = JSON.stringify(s);
  }
  s.captureUri && e?.uri && (n[`${Vl}.uri`] = JSON.stringify(e.uri));
  s.captureName && e?.name && (n[`${Vl}.name`] = JSON.stringify(e.name));
  return n;
}
/**
 * Extracts additional attributes for specific notification types
 * @param method - Notification method name
 * @param params - Notification parameters
 * @returns Method-specific attributes for span instrumentation
 */ function qp(t, e) {
  const n = {};
  switch (t) {
    case "notifications/cancelled":
      e?.requestId && (n["mcp.cancelled.request_id"] = String(e.requestId));
      e?.reason && (n["mcp.cancelled.reason"] = String(e.reason));
      break;
    case "notifications/message":
      e?.level && (n[Kl] = String(e.level));
      e?.logger && (n[Gl] = String(e.logger));
      if (e?.data !== void 0) {
        n[Hl] = typeof e.data;
        typeof e.data === "string"
          ? (n[Zl] = e.data)
          : (n[Zl] = JSON.stringify(e.data));
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
        n[Rl] = String(e.uri);
        const t = pa(String(e.uri));
        t &&
          !la(t) &&
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
 */ function Jp(t, e, n) {
  if (t === "request") {
    const t = e;
    const s = Lp(t.method, n || {});
    return {
      ...(t.id !== void 0 && { [Il]: String(t.id) }),
      ...s.attributes,
      ...Up(t.method, n || {}),
    };
  }
  return qp(e.method, n || {});
}
/**
 * Creates a span name based on the method and target
 * @internal
 * @param method - MCP method name
 * @param target - Optional target identifier
 * @returns Formatted span name
 */ function zp(t, e) {
  return e ? `${t} ${e}` : t;
}
/**
 * Build Sentry-specific attributes based on span type
 * @internal
 * @param type - Span type configuration
 * @returns Sentry-specific attributes
 */ function Bp(t) {
  let e;
  let n;
  switch (t) {
    case "request":
      e = ep;
      n = op;
      break;
    case "notification-incoming":
      e = np;
      n = rp;
      break;
    case "notification-outgoing":
      e = sp;
      n = rp;
      break;
  }
  return { [Ie]: e, [$e]: n, [Ee]: ip };
}
/**
 * Unified builder for creating MCP spans
 * @internal
 * @param config - Span configuration
 * @returns Created span
 */ function Wp(t) {
  const { type: e, message: n, transport: s, extra: o, callback: r } = t;
  const { method: i } = n;
  const a = n.params;
  let c;
  if (e === "request") {
    const t = Lp(i, a || {});
    c = zp(i, t.target);
  } else c = i;
  const u = { ...Dp(s, o), [Tl]: i, ...Jp(e, n, a), ...Bp(e) };
  const l = we();
  const p = Boolean(l?.getOptions().sendDefaultPii);
  const f = up(u, p);
  return Ys({ name: c, forceTransaction: true, attributes: f }, r);
}
/**
 * Creates a span for incoming MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param extra - Extra handler data
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function Vp(t, e, n, s) {
  return Wp({
    type: "notification-incoming",
    message: t,
    transport: e,
    extra: n,
    callback: s,
  });
}
/**
 * Creates a span for outgoing MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function Kp(t, e, n) {
  return Wp({
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
 */ function Gp(t, e, n) {
  const { method: s } = t;
  const o = t.params;
  const r = Lp(s, o || {});
  const i = zp(s, r.target);
  const a = { ...Dp(e, n), [Tl]: s, ...Jp("request", t, o), ...Bp("request") };
  const c = we();
  const u = Boolean(c?.getOptions().sendDefaultPii);
  const l = up(a, u);
  return { name: i, op: ep, forceTransaction: true, attributes: l };
}
/**
 * Wraps transport.onmessage to create spans for incoming messages.
 * For "initialize" requests, extracts and stores client info and protocol version
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 */ function Hp(t) {
  t.onmessage &&
    dt(
      t,
      "onmessage",
      (t) =>
        function (e, n) {
          if (lp(e)) {
            if (e.method === "initialize")
              try {
                const t = Cp(e);
                xp(this, t);
              } catch {}
            const s = be().clone();
            return ke(s, () => {
              const s = Gp(e, this, n);
              const o = Qs(s);
              vp(this, e.id, o, e.method);
              return eo(o, () => t.call(this, e, n));
            });
          }
          return pp(e)
            ? Vp(e, this, n, () => t.call(this, e, n))
            : t.call(this, e, n);
        },
    );
}
/**
 * Wraps transport.send to handle outgoing messages and response correlation.
 * For "initialize" responses, extracts and stores protocol version and server info
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 */ function Zp(t) {
  t.send &&
    dt(
      t,
      "send",
      (t) =>
        async function (...e) {
          const [n] = e;
          if (pp(n)) return Kp(n, this, () => t.call(this, ...e));
          if (fp(n) && n.id !== null && n.id !== void 0) {
            n.error && Qp(n.error);
            if (
              mp(n.result) &&
              (n.result.protocolVersion || n.result.serverInfo)
            )
              try {
                const t = Np(n.result);
                Ep(this, t);
              } catch {}
            Sp(this, n.id, n.result);
          }
          return t.call(this, ...e);
        },
    );
}
/**
 * Wraps transport.onclose to clean up pending spans for this transport only
 * @param transport - MCP transport instance to wrap
 */ function Yp(t) {
  t.onclose &&
    dt(
      t,
      "onclose",
      (t) =>
        function (...e) {
          kp(this);
          $p(this);
          return t.call(this, ...e);
        },
    );
}
/**
 * Wraps transport error handlers to capture connection errors
 * @param transport - MCP transport instance to wrap
 */ function Xp(t) {
  t.onerror &&
    dt(
      t,
      "onerror",
      (t) =>
        function (e) {
          tf(e);
          return t.call(this, e);
        },
    );
}
/**
 * Captures JSON-RPC error responses for server-side errors.
 * @see https://www.jsonrpc.org/specification#error_object
 * @internal
 * @param errorResponse - JSON-RPC error response
 */ function Qp(t) {
  try {
    if (t && typeof t === "object" && "code" in t && "message" in t) {
      const e = t;
      const n = e.code === -32603 || (e.code >= -32099 && e.code <= -32e3);
      if (n) {
        const t = new Error(e.message);
        t.name = `JsonRpcError_${e.code}`;
        yl(t, "protocol");
      }
    }
  } catch {}
}
/**
 * Captures transport connection errors
 * @internal
 * @param error - Transport error
 */ function tf(t) {
  try {
    yl(t, "transport");
  } catch {}
}
const ef = new WeakSet();
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
 */ function nf(t) {
  if (ef.has(t)) return t;
  if (!dp(t)) return t;
  const e = t;
  dt(
    e,
    "connect",
    (t) =>
      async function (e, ...n) {
        const s = await t.call(this, e, ...n);
        Hp(e);
        Zp(e);
        Yp(e);
        Xp(e);
        return s;
      },
  );
  Al(e);
  ef.add(t);
  return t;
}
function sf(t, e = {}, n = ye()) {
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
 */ function of(t, e, n, s, o) {
  Ur({ level: t, message: e, attributes: n, severityNumber: o }, s);
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
 */ function rf(t, e, { scope: n } = {}) {
  of("trace", t, e, n);
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
 */ function af(t, e, { scope: n } = {}) {
  of("debug", t, e, n);
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
 */ function cf(t, e, { scope: n } = {}) {
  of("info", t, e, n);
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
 */ function uf(t, e, { scope: n } = {}) {
  of("warn", t, e, n);
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
 */ function lf(t, e, { scope: n } = {}) {
  of("error", t, e, n);
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
 */ function pf(t, e, { scope: n } = {}) {
  of("fatal", t, e, n);
}
var ff = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      debug: af,
      error: lf,
      fatal: pf,
      fmt: wa,
      info: cf,
      trace: rf,
      warn: uf,
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
 */ function df(t, n, s) {
  return "util" in e && typeof e.util.format === "function"
    ? e.util.format(...t)
    : mf(t, n, s);
}
/**
 * Joins the given values into a string.
 *
 * @param values - The values to join.
 * @param normalizeDepth - The depth to normalize the values.
 * @param normalizeMaxBreadth - The max breadth to normalize the values.
 * @returns The joined string.
 */ function mf(t, e, n) {
  return t
    .map((t) => (Y(t) ? String(t) : JSON.stringify(ls(t, e, n))))
    .join(" ");
}
/**
 * Checks if a string contains console substitution patterns like %s, %d, %i, %f, %o, %O, %c.
 *
 * @param str - The string to check
 * @returns true if the string contains console substitution patterns
 */ function gf(t) {
  return /%[sdifocO]/.test(t);
}
/**
 * Creates template attributes for multiple console arguments.
 *
 * @param args - The console arguments
 * @returns An object with template and parameter attributes
 */ function hf(t, e) {
  const n = {};
  const s = new Array(e.length).fill("{}").join(" ");
  n["sentry.message.template"] = `${t} ${s}`;
  e.forEach((t, e) => {
    n[`sentry.message.parameter.${e}`] = t;
  });
  return n;
}
const _f = "ConsoleLogs";
const yf = { [$e]: "auto.log.console" };
const bf = (e = {}) => {
  const n = e.levels || i;
  return {
    name: _f,
    setup(e) {
      const {
        enableLogs: s,
        normalizeDepth: o = 3,
        normalizeMaxBreadth: r = 1e3,
      } = e.getOptions();
      s
        ? jc(({ args: t, level: s }) => {
            if (we() !== e || !n.includes(s)) return;
            const i = t[0];
            const a = t.slice(1);
            if (s === "assert") {
              if (!i) {
                const t =
                  a.length > 0
                    ? `Assertion failed: ${df(a, o, r)}`
                    : "Assertion failed";
                Ur({ level: "error", message: t, attributes: yf });
              }
              return;
            }
            const c = s === "log";
            const u = t.length > 1 && typeof t[0] === "string" && !gf(t[0]);
            const l = { ...yf, ...(u ? hf(i, a) : {}) };
            Ur({
              level: c ? "info" : s,
              message: df(t, o, r),
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
const vf = Cr(bf);
/**
 * Capture a metric with the given type, name, and value.
 *
 * @param type - The type of the metric.
 * @param name - The name of the metric.
 * @param value - The value of the metric.
 * @param options - Options for capturing the metric.
 */ function Sf(t, e, n, s) {
  Qr(
    { type: t, name: e, value: n, unit: s?.unit, attributes: s?.attributes },
    { scope: s?.scope },
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
 */ function kf(t, e = 1, n) {
  Sf("counter", t, e, n);
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
 */ function wf(t, e, n) {
  Sf("gauge", t, e, n);
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
 */ function xf(t, e, n) {
  Sf("distribution", t, e, n);
}
var Ef = Object.freeze(
  Object.defineProperty(
    { __proto__: null, count: kf, distribution: xf, gauge: wf },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
const Af = ["trace", "debug", "info", "warn", "error", "fatal"];
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
 */ function Tf(t = {}) {
  const e = new Set(t.levels ?? Af);
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
      const l = n || we();
      if (!l) return;
      const p = Of(s, o);
      if (!e.has(p)) return;
      const { normalizeDepth: f = 3, normalizeMaxBreadth: d = 1e3 } =
        l.getOptions();
      const m = [];
      r && m.push(r);
      i && i.length > 0 && m.push(df(i, f, d));
      const g = m.join(" ");
      u["sentry.origin"] = "auto.log.consola";
      a && (u["consola.tag"] = a);
      s && (u["consola.type"] = s);
      o != null && typeof o === "number" && (u["consola.level"] = o);
      Ur({ level: p, message: g, attributes: u });
    },
  };
}
const If = {
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
const $f = {
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
 */ function Of(t, e) {
  if (t === "verbose") return "debug";
  if (t === "silent") return "trace";
  if (t) {
    const e = If[t];
    if (e) return e;
  }
  if (typeof e === "number") {
    const t = $f[e];
    if (t) return t;
  }
  return "info";
}
const Cf = "gen_ai.prompt";
const Nf = "gen_ai.system";
const jf = "gen_ai.request.model";
const Pf = "gen_ai.request.stream";
const Mf = "gen_ai.request.temperature";
const Rf = "gen_ai.request.max_tokens";
const Df = "gen_ai.request.frequency_penalty";
const Ff = "gen_ai.request.presence_penalty";
const Lf = "gen_ai.request.top_p";
const Uf = "gen_ai.request.top_k";
const qf = "gen_ai.request.encoding_format";
const Jf = "gen_ai.request.dimensions";
const zf = "gen_ai.response.finish_reasons";
const Bf = "gen_ai.response.model";
const Wf = "gen_ai.response.id";
const Vf = "gen_ai.response.stop_reason";
const Kf = "gen_ai.usage.input_tokens";
const Gf = "gen_ai.usage.output_tokens";
const Hf = "gen_ai.usage.total_tokens";
const Zf = "gen_ai.operation.name";
const Yf = "gen_ai.request.messages";
const Xf = "gen_ai.response.text";
const Qf = "gen_ai.request.available_tools";
const td = "gen_ai.response.streaming";
const ed = "gen_ai.response.tool_calls";
const nd = "gen_ai.agent.name";
const sd = "gen_ai.pipeline.name";
const od = "gen_ai.usage.cache_creation_input_tokens";
const rd = "gen_ai.usage.cache_read_input_tokens";
const id = "gen_ai.usage.input_tokens.cache_write";
const ad = "gen_ai.usage.input_tokens.cached";
const cd = "gen_ai.invoke_agent";
const ud = "openai.response.id";
const ld = "openai.response.model";
const pd = "openai.response.timestamp";
const fd = "openai.usage.completion_tokens";
const dd = "openai.usage.prompt_tokens";
const md = { CHAT: "chat", RESPONSES: "responses", EMBEDDINGS: "embeddings" };
const gd = "anthropic.response.timestamp";
const hd = new Map();
const _d = 2e4;
const yd = (t) => new TextEncoder().encode(t).length;
const bd = (t) => yd(JSON.stringify(t));
/**
 * Truncate a string to fit within maxBytes when encoded as UTF-8.
 * Uses binary search for efficiency with multi-byte characters.
 *
 * @param text - The string to truncate
 * @param maxBytes - Maximum byte length (UTF-8 encoded)
 * @returns Truncated string that fits within maxBytes
 */ function vd(t, e) {
  if (yd(t) <= e) return t;
  let n = 0;
  let s = t.length;
  let o = "";
  while (n <= s) {
    const r = Math.floor((n + s) / 2);
    const i = t.slice(0, r);
    const a = yd(i);
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
 */ function Sd(t) {
  return typeof t === "string" ? t : t.text;
}
/**
 * Create a new part with updated text content while preserving the original structure.
 *
 * @param part - Original part (string or object)
 * @param text - New text content
 * @returns New part with updated text
 */ function kd(t, e) {
  return typeof t === "string" ? e : { ...t, text: e };
}
function wd(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "content" in t &&
    typeof t.content === "string"
  );
}
function xd(t) {
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
 */ function Ed(t, e) {
  const n = { ...t, content: "" };
  const s = bd(n);
  const o = e - s;
  if (o <= 0) return [];
  const r = vd(t.content, o);
  return [{ ...t, content: r }];
}
/**
 * Truncate a message with `parts: [...]` format (Google GenAI).
 * Keeps as many complete parts as possible, only truncating the first part if needed.
 *
 * @param message - Message with parts array
 * @param maxBytes - Maximum byte limit
 * @returns Array with truncated message, or empty array if it doesn't fit
 */ function Ad(t, e) {
  const { parts: n } = t;
  const s = n.map((t) => kd(t, ""));
  const o = bd({ ...t, parts: s });
  let r = e - o;
  if (r <= 0) return [];
  const i = [];
  for (const t of n) {
    const e = Sd(t);
    const n = yd(e);
    if (!(n <= r)) {
      if (i.length === 0) {
        const n = vd(e, r);
        n && i.push(kd(t, n));
        break;
      }
      break;
    }
    i.push(t);
    r -= n;
  }
  return i.length > 0 ? [{ ...t, parts: i }] : [];
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
 */ function Td(t, e) {
  return t && typeof t === "object"
    ? wd(t)
      ? Ed(t, e)
      : xd(t)
        ? Ad(t, e)
        : []
    : [];
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
 */ function Id(t, e) {
  if (!Array.isArray(t) || t.length === 0) return t;
  const n = bd(t);
  if (n <= e) return t;
  const s = t.map(bd);
  let o = 0;
  let r = t.length;
  for (let n = t.length - 1; n >= 0; n--) {
    const t = s[n];
    if (t && o + t > e) break;
    t && (o += t);
    r = n;
  }
  if (r === t.length) {
    const n = t[t.length - 1];
    return Td(n, e);
  }
  return t.slice(r);
}
/**
 * Truncate GenAI messages using the default byte limit.
 *
 * Convenience wrapper around `truncateMessagesByBytes` with the default limit.
 *
 * @param messages - Array of messages to truncate
 * @returns Truncated array of messages
 */ function $d(t) {
  return Id(t, _d);
}
/**
 * Truncate GenAI string input using the default byte limit.
 *
 * @param input - The string to truncate
 * @returns Truncated string
 */ function Od(t) {
  return vd(t, _d);
}
function Cd(t) {
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
function Nd(t) {
  return `gen_ai.${Cd(t)}`;
}
function jd(t, e) {
  return t ? `${t}.${e}` : e;
}
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param cachedInputTokens - The number of cached input tokens
 * @param cachedOutputTokens - The number of cached output tokens
 */ function Pd(t, e, n, s, o) {
  e !== void 0 && t.setAttributes({ [Kf]: e });
  n !== void 0 && t.setAttributes({ [Gf]: n });
  if (e !== void 0 || n !== void 0 || s !== void 0 || o !== void 0) {
    const r = (e ?? 0) + (n ?? 0) + (s ?? 0) + (o ?? 0);
    t.setAttributes({ [Hf]: r });
  }
}
/**
 * Get the truncated JSON string for a string or array of strings.
 *
 * @param value - The string or array of strings to truncate
 * @returns The truncated JSON string
 */ function Md(t) {
  if (typeof t === "string") return Od(t);
  if (Array.isArray(t)) {
    const e = $d(t);
    return JSON.stringify(e);
  }
  return JSON.stringify(t);
}
const Rd = "operation.name";
const Dd = "ai.prompt";
const Fd = "ai.schema";
const Ld = "ai.response.object";
const Ud = "ai.response.text";
const qd = "ai.response.toolCalls";
const Jd = "ai.prompt.messages";
const zd = "ai.prompt.tools";
const Bd = "ai.model.id";
const Wd = "ai.model.provider";
const Vd = "ai.response.providerMetadata";
const Kd = "ai.usage.cachedInputTokens";
const Gd = "ai.telemetry.functionId";
const Hd = "ai.usage.completionTokens";
const Zd = "ai.usage.promptTokens";
const Yd = "ai.toolCall.name";
const Xd = "ai.toolCall.id";
const Qd = "ai.toolCall.args";
const tm = "ai.toolCall.result";
function em(t, e) {
  const n = t.parent_span_id;
  if (!n) return;
  const s = t.data[Kf];
  const o = t.data[Gf];
  if (typeof s === "number" || typeof o === "number") {
    const t = e.get(n) || { inputTokens: 0, outputTokens: 0 };
    typeof s === "number" && (t.inputTokens += s);
    typeof o === "number" && (t.outputTokens += o);
    e.set(n, t);
  }
}
function nm(t, e) {
  const n = e.get(t.span_id);
  if (n && t.data) {
    n.inputTokens > 0 && (t.data[Kf] = n.inputTokens);
    n.outputTokens > 0 && (t.data[Gf] = n.outputTokens);
    (n.inputTokens > 0 || n.outputTokens > 0) &&
      (t.data["gen_ai.usage.total_tokens"] = n.inputTokens + n.outputTokens);
  }
}
function sm(t) {
  return hd.get(t);
}
function om(t) {
  hd.delete(t);
}
function rm(t) {
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
function im(t) {
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
function am(t, e) {
  if (e[Dd]) {
    const n = Md(e[Dd]);
    t.setAttribute("gen_ai.prompt", n);
  }
  const n = e[Dd];
  if (typeof n === "string" && !e[Yf] && !e[Jd]) {
    const e = im(n);
    e.length && t.setAttribute(Yf, Md(e));
  }
}
function cm(t, e) {
  t.setAttribute($e, e);
}
function um(t) {
  const { data: e, description: n } = Rn(t);
  if (!n) return;
  if (e[Yd] && e[Xd] && n === "ai.toolCall") {
    dm(t, e);
    return;
  }
  const s = e[Bd];
  const o = e[Wd];
  typeof s === "string" && typeof o === "string" && s && o && mm(t, n, e);
}
function lm(t) {
  if (t.type === "transaction" && t.spans) {
    const e = new Map();
    for (const n of t.spans) {
      pm(n);
      em(n, e);
    }
    for (const n of t.spans) n.op === "gen_ai.invoke_agent" && nm(n, e);
    const n = t.contexts?.trace;
    n && n.op === "gen_ai.invoke_agent" && nm(n, e);
  }
  return t;
}
function pm(t) {
  const { data: e, origin: n } = t;
  if (n === "auto.vercelai.otel") {
    fm(e, Hd, Gf);
    fm(e, Zd, Kf);
    fm(e, Kd, ad);
    typeof e[Gf] === "number" &&
      typeof e[Kf] === "number" &&
      (e["gen_ai.usage.total_tokens"] = e[Gf] + e[Kf]);
    e[zd] && Array.isArray(e[zd]) && (e[zd] = rm(e[zd]));
    fm(e, Rd, Zf);
    fm(e, Jd, Yf);
    fm(e, Ud, "gen_ai.response.text");
    fm(e, qd, "gen_ai.response.tool_calls");
    fm(e, Ld, "gen_ai.response.object");
    fm(e, zd, "gen_ai.request.available_tools");
    fm(e, Qd, "gen_ai.tool.input");
    fm(e, tm, "gen_ai.tool.output");
    fm(e, Fd, "gen_ai.request.schema");
    fm(e, Bd, jf);
    hm(e);
    for (const t of Object.keys(e))
      t.startsWith("ai.") && fm(e, t, `vercel.${t}`);
  }
}
function fm(t, e, n) {
  if (t[e] != null) {
    t[n] = t[e];
    delete t[e];
  }
}
function dm(t, e) {
  cm(t, "auto.vercelai.otel");
  t.setAttribute(Ie, "gen_ai.execute_tool");
  fm(e, Yd, "gen_ai.tool.name");
  fm(e, Xd, "gen_ai.tool.call.id");
  const n = e["gen_ai.tool.call.id"];
  typeof n === "string" && hd.set(n, t);
  e["gen_ai.tool.type"] || t.setAttribute("gen_ai.tool.type", "function");
  const s = e["gen_ai.tool.name"];
  s && t.updateName(`execute_tool ${s}`);
}
function mm(t, e, n) {
  cm(t, "auto.vercelai.otel");
  const s = e.replace("ai.", "");
  t.setAttribute("ai.pipeline.name", s);
  t.updateName(s);
  const o = n[Gd];
  if (o && typeof o === "string") {
    t.updateName(`${s} ${o}`);
    t.setAttribute("gen_ai.function_id", o);
  }
  am(t, n);
  n[Bd] && !n[Bf] && t.setAttribute(Bf, n[Bd]);
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
                          t.updateName(`embed_many ${n[Bd]}`);
                        }
                      else t.setAttribute(Ie, "gen_ai.invoke_agent");
                    else {
                      t.setAttribute(Ie, "gen_ai.embed");
                      t.updateName(`embed ${n[Bd]}`);
                    }
                  else t.setAttribute(Ie, "gen_ai.invoke_agent");
                else {
                  t.setAttribute(Ie, "gen_ai.stream_object");
                  t.updateName(`stream_object ${n[Bd]}`);
                }
              else t.setAttribute(Ie, "gen_ai.invoke_agent");
            else {
              t.setAttribute(Ie, "gen_ai.generate_object");
              t.updateName(`generate_object ${n[Bd]}`);
            }
          else t.setAttribute(Ie, "gen_ai.invoke_agent");
        else {
          t.setAttribute(Ie, "gen_ai.stream_text");
          t.updateName(`stream_text ${n[Bd]}`);
        }
      else t.setAttribute(Ie, "gen_ai.invoke_agent");
    else {
      t.setAttribute(Ie, "gen_ai.generate_text");
      t.updateName(`generate_text ${n[Bd]}`);
    }
  else t.setAttribute(Ie, "gen_ai.invoke_agent");
}
function gm(t) {
  t.on("spanStart", um);
  t.addEventProcessor(Object.assign(lm, { id: "VercelAiEventProcessor" }));
}
function hm(t) {
  const e = t[Vd];
  if (e)
    try {
      const n = JSON.parse(e);
      if (n.openai) {
        _m(t, ad, n.openai.cachedPromptTokens);
        _m(t, "gen_ai.usage.output_tokens.reasoning", n.openai.reasoningTokens);
        _m(
          t,
          "gen_ai.usage.output_tokens.prediction_accepted",
          n.openai.acceptedPredictionTokens,
        );
        _m(
          t,
          "gen_ai.usage.output_tokens.prediction_rejected",
          n.openai.rejectedPredictionTokens,
        );
        _m(t, "gen_ai.conversation.id", n.openai.responseId);
      }
      if (n.anthropic) {
        const e =
          n.anthropic.usage?.cache_read_input_tokens ??
          n.anthropic.cacheReadInputTokens;
        _m(t, ad, e);
        const s =
          n.anthropic.usage?.cache_creation_input_tokens ??
          n.anthropic.cacheCreationInputTokens;
        _m(t, id, s);
      }
      if (n.bedrock?.usage) {
        _m(t, ad, n.bedrock.usage.cacheReadInputTokens);
        _m(t, id, n.bedrock.usage.cacheWriteInputTokens);
      }
      if (n.deepseek) {
        _m(t, ad, n.deepseek.promptCacheHitTokens);
        _m(
          t,
          "gen_ai.usage.input_tokens.cache_miss",
          n.deepseek.promptCacheMissTokens,
        );
      }
    } catch {}
}
function _m(t, e, n) {
  n != null && (t[e] = n);
}
const ym = "OpenAI";
const bm = ["responses.create", "chat.completions.create", "embeddings.create"];
const vm = [
  "response.output_item.added",
  "response.function_call_arguments.delta",
  "response.function_call_arguments.done",
  "response.output_item.done",
];
const Sm = [
  "response.created",
  "response.in_progress",
  "response.failed",
  "response.completed",
  "response.incomplete",
  "response.queued",
  "response.output_text.delta",
  ...vm,
];
function km(t) {
  return t.includes("chat.completions")
    ? md.CHAT
    : t.includes("responses")
      ? md.RESPONSES
      : t.includes("embeddings")
        ? md.EMBEDDINGS
        : t.split(".").pop() || "unknown";
}
function wm(t) {
  return `gen_ai.${km(t)}`;
}
function xm(t) {
  return bm.includes(t);
}
function Em(t, e) {
  return t ? `${t}.${e}` : e;
}
function Am(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "chat.completion"
  );
}
function Tm(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "response"
  );
}
function Im(t) {
  if (t === null || typeof t !== "object" || !("object" in t)) return false;
  const e = t;
  return (
    e.object === "list" &&
    typeof e.model === "string" &&
    e.model.toLowerCase().includes("embedding")
  );
}
function $m(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "type" in t &&
    typeof t.type === "string" &&
    t.type.startsWith("response.")
  );
}
function Om(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "chat.completion.chunk"
  );
}
function Cm(t, e, n) {
  Mm(t, e.id, e.model, e.created);
  e.usage &&
    Pm(
      t,
      e.usage.prompt_tokens,
      e.usage.completion_tokens,
      e.usage.total_tokens,
    );
  if (Array.isArray(e.choices)) {
    const s = e.choices.map((t) => t.finish_reason).filter((t) => t !== null);
    s.length > 0 && t.setAttributes({ [zf]: JSON.stringify(s) });
    if (n) {
      const n = e.choices
        .map((t) => t.message?.tool_calls)
        .filter((t) => Array.isArray(t) && t.length > 0)
        .flat();
      n.length > 0 && t.setAttributes({ [ed]: JSON.stringify(n) });
    }
  }
}
function Nm(t, e, n) {
  Mm(t, e.id, e.model, e.created_at);
  e.status && t.setAttributes({ [zf]: JSON.stringify([e.status]) });
  e.usage &&
    Pm(t, e.usage.input_tokens, e.usage.output_tokens, e.usage.total_tokens);
  if (n) {
    const n = e;
    if (Array.isArray(n.output) && n.output.length > 0) {
      const e = n.output.filter(
        (t) =>
          typeof t === "object" && t !== null && t.type === "function_call",
      );
      e.length > 0 && t.setAttributes({ [ed]: JSON.stringify(e) });
    }
  }
}
function jm(t, e) {
  t.setAttributes({ [ld]: e.model, [Bf]: e.model });
  e.usage && Pm(t, e.usage.prompt_tokens, void 0, e.usage.total_tokens);
}
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param totalTokens - The number of total tokens
 */ function Pm(t, e, n, s) {
  e !== void 0 && t.setAttributes({ [dd]: e, [Kf]: e });
  n !== void 0 && t.setAttributes({ [fd]: n, [Gf]: n });
  s !== void 0 && t.setAttributes({ [Hf]: s });
}
/**
 * Set common response attributes
 * @param span - The span to add attributes to
 * @param id - The response id
 * @param model - The response model
 * @param timestamp - The response timestamp
 */ function Mm(t, e, n, s) {
  t.setAttributes({ [ud]: e, [Wf]: e });
  t.setAttributes({ [ld]: n, [Bf]: n });
  t.setAttributes({ [pd]: new Date(s * 1e3).toISOString() });
}
/**
 * Processes tool calls from a chat completion chunk delta.
 * Follows the pattern: accumulate by index, then convert to array at the end.
 *
 * @param toolCalls - Array of tool calls from the delta.
 * @param state - The current streaming state to update.
 *
 *  @see https://platform.openai.com/docs/guides/function-calling#streaming
 */ function Rm(t, e) {
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
 */ function Dm(t, e, n) {
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
      s.delta?.tool_calls && Rm(s.delta.tool_calls, e);
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
 */ function Fm(t, e, n, s) {
  if (!(t && typeof t === "object")) {
    e.eventTypes.push("unknown:non-object");
    return;
  }
  if (t instanceof Error) {
    s.setStatus({ code: Be, message: "internal_error" });
    Yo(t, {
      mechanism: { handled: false, type: "auto.ai.openai.stream-response" },
    });
    return;
  }
  if (!("type" in t)) return;
  const o = t;
  if (Sm.includes(o.type)) {
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
 */ async function* Lm(t, e, n) {
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
      Om(o) ? Dm(o, s, n) : $m(o) && Fm(o, s, n, e);
      yield o;
    }
  } finally {
    Mm(e, s.responseId, s.responseModel, s.responseTimestamp);
    Pm(e, s.promptTokens, s.completionTokens, s.totalTokens);
    e.setAttributes({ [td]: true });
    s.finishReasons.length &&
      e.setAttributes({ [zf]: JSON.stringify(s.finishReasons) });
    n &&
      s.responseTexts.length &&
      e.setAttributes({ [Xf]: s.responseTexts.join("") });
    const t = Object.values(s.chatCompletionToolCalls);
    const o = [...t, ...s.responsesApiToolCalls];
    o.length > 0 && e.setAttributes({ [ed]: JSON.stringify(o) });
    e.end();
  }
}
function Um(t, e) {
  const n = { [Nf]: "openai", [Zf]: km(e), [$e]: "auto.ai.openai" };
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    const s = Array.isArray(e.tools) ? e.tools : [];
    const o = e.web_search_options && typeof e.web_search_options === "object";
    const r = o
      ? [{ type: "web_search_options", ...e.web_search_options }]
      : [];
    const i = [...s, ...r];
    i.length > 0 && (n[Qf] = JSON.stringify(i));
  }
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    n[jf] = e.model ?? "unknown";
    "temperature" in e && (n[Mf] = e.temperature);
    "top_p" in e && (n[Lf] = e.top_p);
    "frequency_penalty" in e && (n[Df] = e.frequency_penalty);
    "presence_penalty" in e && (n[Ff] = e.presence_penalty);
    "stream" in e && (n[Pf] = e.stream);
    "encoding_format" in e && (n[qf] = e.encoding_format);
    "dimensions" in e && (n[Jf] = e.dimensions);
  } else n[jf] = "unknown";
  return n;
}
function qm(t, e, n) {
  if (!e || typeof e !== "object") return;
  const s = e;
  if (Am(s)) {
    Cm(t, s, n);
    if (n && s.choices?.length) {
      const e = s.choices.map((t) => t.message?.content || "");
      t.setAttributes({ [Xf]: JSON.stringify(e) });
    }
  } else if (Tm(s)) {
    Nm(t, s, n);
    n && s.output_text && t.setAttributes({ [Xf]: s.output_text });
  } else Im(s) && jm(t, s);
}
function Jm(t, e) {
  if ("messages" in e) {
    const n = Md(e.messages);
    t.setAttributes({ [Yf]: n });
  }
  if ("input" in e) {
    const n = Md(e.input);
    t.setAttributes({ [Yf]: n });
  }
}
function zm(t, e, n, s) {
  return async function (...o) {
    const r = Um(o, e);
    const i = r[jf] || "unknown";
    const a = km(e);
    const c = o[0];
    const u = c && typeof c === "object" && c.stream === true;
    return u
      ? Xs(
          { name: `${a} ${i} stream-response`, op: wm(e), attributes: r },
          async (r) => {
            try {
              s.recordInputs && c && Jm(r, c);
              const e = await t.apply(n, o);
              return Lm(e, r, s.recordOutputs ?? false);
            } catch (t) {
              r.setStatus({ code: Be, message: "internal_error" });
              Yo(t, {
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
      : Ys({ name: `${a} ${i}`, op: wm(e), attributes: r }, async (r) => {
          try {
            s.recordInputs && c && Jm(r, c);
            const e = await t.apply(n, o);
            qm(r, e, s.recordOutputs);
            return e;
          } catch (t) {
            Yo(t, {
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
function Bm(t, e = "", n) {
  return new Proxy(t, {
    get(t, s) {
      const o = t[s];
      const r = Em(e, String(s));
      return typeof o === "function" && xm(r)
        ? zm(o, r, t, n)
        : typeof o === "function"
          ? o.bind(t)
          : o && typeof o === "object"
            ? Bm(o, r, n)
            : o;
    },
  });
}
function Wm(t, e) {
  const n = Boolean(we()?.getOptions().sendDefaultPii);
  const s = { recordInputs: n, recordOutputs: n, ...e };
  return Bm(t, "", s);
}
/**
 * Checks if an event is an error event
 * @param event - The event to process
 * @param state - The state of the streaming process
 * @param recordOutputs - Whether to record outputs
 * @param span - The span to update
 * @returns Whether an error occurred
 */ function Vm(t, e) {
  if ("type" in t && typeof t.type === "string" && t.type === "error") {
    e.setStatus({ code: Be, message: t.error?.type ?? "internal_error" });
    Yo(t.error, {
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
 */ function Km(t, e) {
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
function Gm(t, e) {
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
function Hm(t, e, n) {
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
function Zm(t, e) {
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
 */ function Ym(t, e, n, s) {
  if (!(t && typeof t === "object")) return;
  const o = Vm(t, s);
  if (!o) {
    Km(t, e);
    Gm(t, e);
    Hm(t, e, n);
    Zm(t, e);
  }
}
function Xm(t, e, n) {
  if (e.isRecording()) {
    t.responseId && e.setAttributes({ [Wf]: t.responseId });
    t.responseModel && e.setAttributes({ [Bf]: t.responseModel });
    Pd(
      e,
      t.promptTokens,
      t.completionTokens,
      t.cacheCreationInputTokens,
      t.cacheReadInputTokens,
    );
    e.setAttributes({ [td]: true });
    t.finishReasons.length > 0 &&
      e.setAttributes({ [zf]: JSON.stringify(t.finishReasons) });
    n &&
      t.responseTexts.length > 0 &&
      e.setAttributes({ [Xf]: t.responseTexts.join("") });
    n &&
      t.toolCalls.length > 0 &&
      e.setAttributes({ [ed]: JSON.stringify(t.toolCalls) });
    e.end();
  }
}
async function* Qm(t, e, n) {
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
      Ym(o, s, n, e);
      yield o;
    }
  } finally {
    s.responseId && e.setAttributes({ [Wf]: s.responseId });
    s.responseModel && e.setAttributes({ [Bf]: s.responseModel });
    Pd(
      e,
      s.promptTokens,
      s.completionTokens,
      s.cacheCreationInputTokens,
      s.cacheReadInputTokens,
    );
    e.setAttributes({ [td]: true });
    s.finishReasons.length > 0 &&
      e.setAttributes({ [zf]: JSON.stringify(s.finishReasons) });
    n &&
      s.responseTexts.length > 0 &&
      e.setAttributes({ [Xf]: s.responseTexts.join("") });
    n &&
      s.toolCalls.length > 0 &&
      e.setAttributes({ [ed]: JSON.stringify(s.toolCalls) });
    e.end();
  }
}
function tg(t, e, n) {
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
    Ym(t, s, n, e);
  });
  t.on("message", () => {
    Xm(s, e, n);
  });
  t.on("error", (t) => {
    Yo(t, {
      mechanism: { handled: false, type: "auto.ai.anthropic.stream_error" },
    });
    if (e.isRecording()) {
      e.setStatus({ code: Be, message: "stream_error" });
      e.end();
    }
  });
  return t;
}
const eg = "Anthropic_AI";
const ng = [
  "messages.create",
  "messages.stream",
  "messages.countTokens",
  "models.get",
  "completions.create",
  "models.retrieve",
  "beta.messages.create",
];
function sg(t) {
  return ng.includes(t);
}
function og(t, e) {
  if (e.error) {
    t.setStatus({ code: Be, message: e.error.type || "internal_error" });
    Yo(e.error, {
      mechanism: { handled: false, type: "auto.ai.anthropic.anthropic_error" },
    });
  }
}
function rg(t) {
  const { system: e, messages: n } = t;
  const s =
    typeof e === "string" ? [{ role: "system", content: t.system }] : [];
  const o = Array.isArray(n) ? n : n != null ? [n] : [];
  return [...s, ...o];
}
function ig(t, e) {
  const n = { [Nf]: "anthropic", [Zf]: Cd(e), [$e]: "auto.ai.anthropic" };
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    e.tools && Array.isArray(e.tools) && (n[Qf] = JSON.stringify(e.tools));
    n[jf] = e.model ?? "unknown";
    "temperature" in e && (n[Mf] = e.temperature);
    "top_p" in e && (n[Lf] = e.top_p);
    "stream" in e && (n[Pf] = e.stream);
    "top_k" in e && (n[Uf] = e.top_k);
    "frequency_penalty" in e && (n[Df] = e.frequency_penalty);
    "max_tokens" in e && (n[Rf] = e.max_tokens);
  } else
    n[jf] = e === "models.retrieve" || e === "models.get" ? t[0] : "unknown";
  return n;
}
function ag(t, e) {
  const n = rg(e);
  if (n.length) {
    const e = Md(n);
    t.setAttributes({ [Yf]: e });
  }
  if ("input" in e) {
    const n = Md(e.input);
    t.setAttributes({ [Yf]: n });
  }
  "prompt" in e && t.setAttributes({ [Cf]: JSON.stringify(e.prompt) });
}
function cg(t, e) {
  if ("content" in e && Array.isArray(e.content)) {
    t.setAttributes({
      [Xf]: e.content
        .map((t) => t.text)
        .filter((t) => !!t)
        .join(""),
    });
    const n = [];
    for (const t of e.content)
      (t.type !== "tool_use" && t.type !== "server_tool_use") || n.push(t);
    n.length > 0 && t.setAttributes({ [ed]: JSON.stringify(n) });
  }
  "completion" in e && t.setAttributes({ [Xf]: e.completion });
  "input_tokens" in e &&
    t.setAttributes({ [Xf]: JSON.stringify(e.input_tokens) });
}
function ug(t, e) {
  if ("id" in e && "model" in e) {
    t.setAttributes({ [Wf]: e.id, [Bf]: e.model });
    "created" in e &&
      typeof e.created === "number" &&
      t.setAttributes({ [gd]: new Date(e.created * 1e3).toISOString() });
    "created_at" in e &&
      typeof e.created_at === "number" &&
      t.setAttributes({ [gd]: new Date(e.created_at * 1e3).toISOString() });
    "usage" in e &&
      e.usage &&
      Pd(
        t,
        e.usage.input_tokens,
        e.usage.output_tokens,
        e.usage.cache_creation_input_tokens,
        e.usage.cache_read_input_tokens,
      );
  }
}
function lg(t, e, n) {
  if (e && typeof e === "object")
    if ("type" in e && e.type === "error") og(t, e);
    else {
      n && cg(t, e);
      ug(t, e);
    }
}
function pg(t, e, n) {
  Yo(t, {
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
function fg(t, e, n, s, o, r, i, a, c, u, l) {
  const p = o[jf] ?? "unknown";
  const f = { name: `${r} ${p} stream-response`, op: Nd(i), attributes: o };
  return Xs(
    f,
    u && !l
      ? async (e) => {
          try {
            c.recordInputs && a && ag(e, a);
            const o = await t.apply(n, s);
            return Qm(o, e, c.recordOutputs ?? false);
          } catch (t) {
            return pg(t, e, i);
          }
        }
      : (t) => {
          try {
            c.recordInputs && a && ag(t, a);
            const o = e.apply(n, s);
            return tg(o, t, c.recordOutputs ?? false);
          } catch (e) {
            return pg(e, t, i);
          }
        },
  );
}
function dg(t, e, n, s) {
  return new Proxy(t, {
    apply(o, r, i) {
      const a = ig(i, e);
      const c = a[jf] ?? "unknown";
      const u = Cd(e);
      const l = typeof i[0] === "object" ? i[0] : void 0;
      const p = Boolean(l?.stream);
      const f = e === "messages.stream";
      return p || f
        ? fg(t, o, n, i, a, u, e, l, s, p, f)
        : Ys({ name: `${u} ${c}`, op: Nd(e), attributes: a }, (t) => {
            s.recordInputs && l && ag(t, l);
            return Ks(
              () => o.apply(n, i),
              (t) => {
                Yo(t, {
                  mechanism: {
                    handled: false,
                    type: "auto.ai.anthropic",
                    data: { function: e },
                  },
                });
              },
              () => {},
              (e) => lg(t, e, s.recordOutputs),
            );
          });
    },
  });
}
function mg(t, e = "", n) {
  return new Proxy(t, {
    get(t, s) {
      const o = t[s];
      const r = jd(e, String(s));
      return typeof o === "function" && sg(r)
        ? dg(o, r, t, n)
        : typeof o === "function"
          ? o.bind(t)
          : o && typeof o === "object"
            ? mg(o, r, n)
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
 */ function gg(t, e) {
  const n = Boolean(we()?.getOptions().sendDefaultPii);
  const s = { recordInputs: n, recordOutputs: n, ...e };
  return mg(t, "", s);
}
const hg = "Google_GenAI";
const _g = [
  "models.generateContent",
  "models.generateContentStream",
  "chats.create",
  "sendMessage",
  "sendMessageStream",
];
const yg = "google_genai";
const bg = "chats.create";
const vg = "chat";
/**
 * Checks if a response chunk contains an error
 * @param chunk - The response chunk to check
 * @param span - The span to update if error is found
 * @returns Whether an error occurred
 */ function Sg(t, e) {
  const n = t?.promptFeedback;
  if (n?.blockReason) {
    const t = n.blockReasonMessage ?? n.blockReason;
    e.setStatus({ code: Be, message: `Content blocked: ${t}` });
    Yo(`Content blocked: ${t}`, {
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
 */ function kg(t, e) {
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
 */ function wg(t, e, n) {
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
 */ function xg(t, e, n, s) {
  if (t && !Sg(t, s)) {
    kg(t, e);
    wg(t, e, n);
  }
}
async function* Eg(t, e, n) {
  const s = { responseTexts: [], finishReasons: [], toolCalls: [] };
  try {
    for await (const o of t) {
      xg(o, s, n, e);
      yield o;
    }
  } finally {
    const t = { [td]: true };
    s.responseId && (t[Wf] = s.responseId);
    s.responseModel && (t[Bf] = s.responseModel);
    s.promptTokens !== void 0 && (t[Kf] = s.promptTokens);
    s.completionTokens !== void 0 && (t[Gf] = s.completionTokens);
    s.totalTokens !== void 0 && (t[Hf] = s.totalTokens);
    s.finishReasons.length && (t[zf] = JSON.stringify(s.finishReasons));
    n && s.responseTexts.length && (t[Xf] = s.responseTexts.join(""));
    n && s.toolCalls.length && (t[ed] = JSON.stringify(s.toolCalls));
    e.setAttributes(t);
    e.end();
  }
}
function Ag(t) {
  if (_g.includes(t)) return true;
  const e = t.split(".").pop();
  return _g.includes(e);
}
function Tg(t) {
  return (
    t.includes("Stream") ||
    t.endsWith("generateContentStream") ||
    t.endsWith("sendMessageStream")
  );
}
function Ig(t, e) {
  if ("model" in t && typeof t.model === "string") return t.model;
  if (e && typeof e === "object") {
    const t = e;
    if ("model" in t && typeof t.model === "string") return t.model;
    if ("modelVersion" in t && typeof t.modelVersion === "string")
      return t.modelVersion;
  }
  return "unknown";
}
function $g(t) {
  const e = {};
  "temperature" in t &&
    typeof t.temperature === "number" &&
    (e[Mf] = t.temperature);
  "topP" in t && typeof t.topP === "number" && (e[Lf] = t.topP);
  "topK" in t && typeof t.topK === "number" && (e[Uf] = t.topK);
  "maxOutputTokens" in t &&
    typeof t.maxOutputTokens === "number" &&
    (e[Rf] = t.maxOutputTokens);
  "frequencyPenalty" in t &&
    typeof t.frequencyPenalty === "number" &&
    (e[Df] = t.frequencyPenalty);
  "presencePenalty" in t &&
    typeof t.presencePenalty === "number" &&
    (e[Ff] = t.presencePenalty);
  return e;
}
function Og(t, e, n) {
  const s = { [Nf]: yg, [Zf]: Cd(t), [$e]: "auto.ai.google_genai" };
  if (e) {
    s[jf] = Ig(e, n);
    if ("config" in e && typeof e.config === "object" && e.config) {
      const t = e.config;
      Object.assign(s, $g(t));
      if ("tools" in t && Array.isArray(t.tools)) {
        const e = t.tools.flatMap((t) => t.functionDeclarations);
        s[Qf] = JSON.stringify(e);
      }
    }
  } else s[jf] = Ig({}, n);
  return s;
}
function Cg(t, e) {
  if ("contents" in e) {
    const n = e.contents;
    const s = Md(n);
    t.setAttributes({ [Yf]: s });
  }
  if ("message" in e) {
    const n = e.message;
    const s = Md(n);
    t.setAttributes({ [Yf]: s });
  }
  if ("history" in e) {
    const n = e.history;
    const s = Md(n);
    t.setAttributes({ [Yf]: s });
  }
}
function Ng(t, e, n) {
  if (e && typeof e === "object") {
    if (e.usageMetadata && typeof e.usageMetadata === "object") {
      const n = e.usageMetadata;
      typeof n.promptTokenCount === "number" &&
        t.setAttributes({ [Kf]: n.promptTokenCount });
      typeof n.candidatesTokenCount === "number" &&
        t.setAttributes({ [Gf]: n.candidatesTokenCount });
      typeof n.totalTokenCount === "number" &&
        t.setAttributes({ [Hf]: n.totalTokenCount });
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
      n.length > 0 && t.setAttributes({ [Xf]: n.join("") });
    }
    if (n && e.functionCalls) {
      const n = e.functionCalls;
      Array.isArray(n) &&
        n.length > 0 &&
        t.setAttributes({ [ed]: JSON.stringify(n) });
    }
  }
}
function jg(t, e, n, s) {
  const o = e === bg;
  return new Proxy(t, {
    apply(t, r, i) {
      const a = i[0];
      const c = Og(e, a, n);
      const u = c[jf] ?? "unknown";
      const l = Cd(e);
      return Tg(e)
        ? Xs(
            { name: `${l} ${u} stream-response`, op: Nd(e), attributes: c },
            async (o) => {
              try {
                s.recordInputs && a && Cg(o, a);
                const e = await t.apply(n, i);
                return Eg(e, o, Boolean(s.recordOutputs));
              } catch (t) {
                o.setStatus({ code: Be, message: "internal_error" });
                Yo(t, {
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
        : Ys(
            {
              name: o ? `${l} ${u} create` : `${l} ${u}`,
              op: Nd(e),
              attributes: c,
            },
            (r) => {
              s.recordInputs && a && Cg(r, a);
              return Ks(
                () => t.apply(n, i),
                (t) => {
                  Yo(t, {
                    mechanism: {
                      handled: false,
                      type: "auto.ai.google_genai",
                      data: { function: e },
                    },
                  });
                },
                () => {},
                (t) => {
                  o || Ng(r, t, s.recordOutputs);
                },
              );
            },
          );
    },
  });
}
function Pg(t, e = "", n) {
  return new Proxy(t, {
    get: (t, s, o) => {
      const r = Reflect.get(t, s, o);
      const i = jd(e, String(s));
      if (typeof r === "function" && Ag(i)) {
        if (i === bg) {
          const e = jg(r, i, t, n);
          return function (...t) {
            const s = e(...t);
            return s && typeof s === "object" ? Pg(s, vg, n) : s;
          };
        }
        return jg(r, i, t, n);
      }
      return typeof r === "function"
        ? r.bind(t)
        : r && typeof r === "object"
          ? Pg(r, i, n)
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
 */ function Mg(t, e) {
  const n = Boolean(we()?.getOptions().sendDefaultPii);
  const s = { recordInputs: n, recordOutputs: n, ...e };
  return Pg(t, "", s);
}
const Rg = "LangChain";
const Dg = "auto.ai.langchain";
const Fg = {
  human: "user",
  ai: "assistant",
  assistant: "assistant",
  system: "system",
  function: "function",
  tool: "tool",
};
const Lg = (t, e, n) => {
  n != null && (t[e] = n);
};
const Ug = (t, e, n) => {
  const s = Number(n);
  Number.isNaN(s) || (t[e] = s);
};
function qg(t) {
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
 */ function Jg(t) {
  const e = t.toLowerCase();
  return Fg[e] ?? e;
}
function zg(t) {
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
 */ function Bg(t) {
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
 */ function Wg(t) {
  return t.map((t) => {
    const e = t._getType;
    if (typeof e === "function") {
      const n = e.call(t);
      return { role: Jg(n), content: qg(t.content) };
    }
    const n = t.constructor?.name;
    if (n) return { role: Jg(zg(n)), content: qg(t.content) };
    if (t.type) {
      const e = String(t.type).toLowerCase();
      return { role: Jg(e), content: qg(t.content) };
    }
    if (t.role) return { role: Jg(String(t.role)), content: qg(t.content) };
    if (t.lc === 1 && t.kwargs) {
      const e = t.id;
      const n = Array.isArray(e) && e.length > 0 ? e[e.length - 1] : "";
      const s = typeof n === "string" ? zg(n) : "user";
      return { role: Jg(s), content: qg(t.kwargs?.content) };
    }
    return { role: "user", content: qg(t.content) };
  });
}
function Vg(t, e, n) {
  const s = {};
  const o = "kwargs" in t ? t.kwargs : void 0;
  const r = e?.temperature ?? n?.ls_temperature ?? o?.temperature;
  Ug(s, Mf, r);
  const i = e?.max_tokens ?? n?.ls_max_tokens ?? o?.max_tokens;
  Ug(s, Rf, i);
  const a = e?.top_p ?? o?.top_p;
  Ug(s, Lf, a);
  const c = e?.frequency_penalty;
  Ug(s, Df, c);
  const u = e?.presence_penalty;
  Ug(s, Ff, u);
  e && "stream" in e && Lg(s, Pf, Boolean(e.stream));
  return s;
}
function Kg(t, e, n, s, o, r) {
  return {
    [Nf]: qg(t ?? "langchain"),
    [Zf]: n,
    [jf]: qg(e),
    [$e]: Dg,
    ...Vg(s, o, r),
  };
}
function Gg(t, e, n, s, o) {
  const r = o?.ls_provider;
  const i = s?.model ?? o?.ls_model_name ?? "unknown";
  const a = Kg(r, i, "pipeline", t, s, o);
  if (n && Array.isArray(e) && e.length > 0) {
    const t = e.map((t) => ({ role: "user", content: t }));
    Lg(a, Yf, qg(t));
  }
  return a;
}
function Hg(t, e, n, s, o) {
  const r = o?.ls_provider ?? t.id?.[2];
  const i = s?.model ?? o?.ls_model_name ?? "unknown";
  const a = Kg(r, i, "chat", t, s, o);
  if (n && Array.isArray(e) && e.length > 0) {
    const t = Wg(e.flat());
    const n = $d(t);
    Lg(a, Yf, qg(n));
  }
  return a;
}
function Zg(t, e) {
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
  n.length > 0 && Lg(e, ed, qg(n));
}
function Yg(t, e) {
  if (!t) return;
  const n = t.tokenUsage;
  const s = t.usage;
  if (n) {
    Ug(e, Kf, n.promptTokens);
    Ug(e, Gf, n.completionTokens);
    Ug(e, Hf, n.totalTokens);
  } else if (s) {
    Ug(e, Kf, s.input_tokens);
    Ug(e, Gf, s.output_tokens);
    const t = Number(s.input_tokens);
    const n = Number(s.output_tokens);
    const o = (Number.isNaN(t) ? 0 : t) + (Number.isNaN(n) ? 0 : n);
    o > 0 && Ug(e, Hf, o);
    s.cache_creation_input_tokens !== void 0 &&
      Ug(e, od, s.cache_creation_input_tokens);
    s.cache_read_input_tokens !== void 0 &&
      Ug(e, rd, s.cache_read_input_tokens);
  }
}
function Xg(t, e) {
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
    s.length > 0 && Lg(n, zf, qg(s));
    Zg(t.generations, n);
    if (e) {
      const e = t.generations
        .flat()
        .map((t) => t.text ?? t.message?.content)
        .filter((t) => typeof t === "string");
      e.length > 0 && Lg(n, Xf, qg(e));
    }
  }
  Yg(t.llmOutput, n);
  const s = t.llmOutput;
  const o = t.generations?.[0]?.[0];
  const r = o?.message;
  const i = s?.model_name ?? s?.model ?? r?.response_metadata?.model_name;
  i && Lg(n, Bf, i);
  const a = s?.id ?? r?.id;
  a && Lg(n, Wf, a);
  const c = s?.stop_reason ?? r?.response_metadata?.finish_reason;
  c && Lg(n, Vf, qg(c));
  return n;
}
function Qg(t = {}) {
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
      const l = Bg(a);
      const p = Gg(t, n, e, l, c);
      const f = p[jf];
      const d = p[Zf];
      Xs(
        {
          name: `${d} ${f}`,
          op: "gen_ai.pipeline",
          attributes: { ...p, [Ie]: "gen_ai.pipeline" },
        },
        (t) => {
          s.set(o, t);
          return t;
        },
      );
    },
    handleChatModelStart(t, n, o, r, i, a, c, u) {
      const l = Bg(a);
      const p = Hg(t, n, e, l, c);
      const f = p[jf];
      const d = p[Zf];
      Xs(
        {
          name: `${d} ${f}`,
          op: "gen_ai.chat",
          attributes: { ...p, [Ie]: "gen_ai.chat" },
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
        const s = Xg(t, n);
        s && c.setAttributes(s);
        o(e);
      }
    },
    handleLLMError(t, e) {
      const n = s.get(e);
      if (n?.isRecording()) {
        n.setStatus({ code: Be, message: "llm_error" });
        o(e);
      }
      Yo(t, { mechanism: { handled: false, type: `${Dg}.llm_error_handler` } });
    },
    handleChainStart(t, n, o, r) {
      const i = t.name || "unknown_chain";
      const a = { [$e]: "auto.ai.langchain", "langchain.chain.name": i };
      e && (a["langchain.chain.inputs"] = JSON.stringify(n));
      Xs(
        {
          name: `chain ${i}`,
          op: "gen_ai.invoke_agent",
          attributes: { ...a, [Ie]: "gen_ai.invoke_agent" },
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
        n.setStatus({ code: Be, message: "chain_error" });
        o(e);
      }
      Yo(t, {
        mechanism: { handled: false, type: `${Dg}.chain_error_handler` },
      });
    },
    handleToolStart(t, n, o, r) {
      const i = t.name || "unknown_tool";
      const a = { [$e]: Dg, "gen_ai.tool.name": i };
      e && (a["gen_ai.tool.input"] = n);
      Xs(
        {
          name: `execute_tool ${i}`,
          op: "gen_ai.execute_tool",
          attributes: { ...a, [Ie]: "gen_ai.execute_tool" },
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
        n && r.setAttributes({ "gen_ai.tool.output": JSON.stringify(t) });
        o(e);
      }
    },
    handleToolError(t, e) {
      const n = s.get(e);
      if (n?.isRecording()) {
        n.setStatus({ code: Be, message: "tool_error" });
        o(e);
      }
      Yo(t, {
        mechanism: { handled: false, type: `${Dg}.tool_error_handler` },
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
const th = "LangGraph";
const eh = "auto.ai.langgraph";
function nh(t) {
  if (!t || t.length === 0) return null;
  const e = [];
  for (const n of t)
    if (n && typeof n === "object") {
      const t = n.tool_calls;
      t && Array.isArray(t) && e.push(...t);
    }
  return e.length > 0 ? e : null;
}
function sh(t) {
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
function oh(t, e) {
  const n = e;
  if (n.response_metadata && typeof n.response_metadata === "object") {
    const e = n.response_metadata;
    e.model_name &&
      typeof e.model_name === "string" &&
      t.setAttribute(Bf, e.model_name);
    e.finish_reason &&
      typeof e.finish_reason === "string" &&
      t.setAttribute(zf, [e.finish_reason]);
  }
}
function rh(t) {
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
function ih(t, e, n) {
  const s = n;
  const o = s?.messages;
  if (!o || !Array.isArray(o)) return;
  const r = e?.length ?? 0;
  const i = o.length > r ? o.slice(r) : [];
  if (i.length === 0) return;
  const a = nh(i);
  a && t.setAttribute(ed, JSON.stringify(a));
  const c = Wg(i);
  t.setAttribute(Xf, JSON.stringify(c));
  let u = 0;
  let l = 0;
  let p = 0;
  for (const e of i) {
    const n = sh(e);
    u += n.inputTokens;
    l += n.outputTokens;
    p += n.totalTokens;
    oh(t, e);
  }
  u > 0 && t.setAttribute(Kf, u);
  l > 0 && t.setAttribute(Gf, l);
  p > 0 && t.setAttribute(Hf, p);
}
function ah(t, e) {
  return new Proxy(t, {
    apply(t, n, s) {
      return Ys(
        {
          op: "gen_ai.create_agent",
          name: "create_agent",
          attributes: {
            [$e]: eh,
            [Ie]: "gen_ai.create_agent",
            [Zf]: "create_agent",
          },
        },
        (o) => {
          try {
            const r = Reflect.apply(t, n, s);
            const i = s.length > 0 ? s[0] : {};
            if (i?.name && typeof i.name === "string") {
              o.setAttribute(nd, i.name);
              o.updateName(`create_agent ${i.name}`);
            }
            const a = r.invoke;
            a && typeof a === "function" && (r.invoke = ch(a.bind(r), r, i, e));
            return r;
          } catch (t) {
            o.setStatus({ code: Be, message: "internal_error" });
            Yo(t, {
              mechanism: { handled: false, type: "auto.ai.langgraph.error" },
            });
            throw t;
          }
        },
      );
    },
  });
}
function ch(t, e, n, s) {
  return new Proxy(t, {
    apply(t, o, r) {
      return Ys(
        {
          op: "gen_ai.invoke_agent",
          name: "invoke_agent",
          attributes: { [$e]: eh, [Ie]: cd, [Zf]: "invoke_agent" },
        },
        async (i) => {
          try {
            const a = n?.name;
            if (a && typeof a === "string") {
              i.setAttribute(sd, a);
              i.setAttribute(nd, a);
              i.updateName(`invoke_agent ${a}`);
            }
            const c = rh(e);
            c && i.setAttribute(Qf, JSON.stringify(c));
            const u = s.recordInputs;
            const l = s.recordOutputs;
            const p = r.length > 0 ? (r[0].messages ?? []) : [];
            if (p && u) {
              const t = Wg(p);
              const e = $d(t);
              i.setAttribute(Yf, JSON.stringify(e));
            }
            const f = await Reflect.apply(t, o, r);
            l && ih(i, p ?? null, f);
            return f;
          } catch (t) {
            i.setStatus({ code: Be, message: "internal_error" });
            Yo(t, {
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
 */ function uh(t, e) {
  const n = e || {};
  t.compile = ah(t.compile.bind(t), n);
  return t;
}
function lh(t) {
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
const ph = e;
/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */ function fh() {
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
 */ function dh() {
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
 */ function mh() {
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
 */ function gh() {
  return "history" in ph && !!ph.history;
}
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ const hh = _h;
function _h() {
  if (!("fetch" in ph)) return false;
  try {
    new Headers();
    new Request("data:,");
    new Response();
    return true;
  } catch {
    return false;
  }
}
function yh(t) {
  return (
    t && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(t.toString())
  );
}
/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */ function bh() {
  if (typeof EdgeRuntime === "string") return true;
  if (!_h()) return false;
  if (yh(ph.fetch)) return true;
  let e = false;
  const n = ph.document;
  if (n && typeof n.createElement === "function")
    try {
      const t = n.createElement("iframe");
      t.hidden = true;
      n.head.appendChild(t);
      t.contentWindow?.fetch && (e = yh(t.contentWindow.fetch));
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
 */ function vh() {
  return "ReportingObserver" in ph;
}
/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ function Sh() {
  if (!_h()) return false;
  try {
    new Request("_", { referrerPolicy: "origin" });
    return true;
  } catch {
    return false;
  }
}
function kh(t, e) {
  const n = "fetch";
  j(n, t);
  M(n, () => xh(void 0, e));
}
function wh(t) {
  const e = "fetch-body-resolved";
  j(e, t);
  M(e, () => xh(Ah));
}
function xh(t, n = false) {
  (n && !bh()) ||
    dt(e, "fetch", function (n) {
      return function (...s) {
        const o = new Error();
        const { method: r, url: i } = $h(s);
        const a = {
          args: s,
          fetchData: { method: r, url: i },
          startTimestamp: Gt() * 1e3,
          virtualError: o,
          headers: Oh(s),
        };
        t || R("fetch", { ...a });
        return n.apply(e, s).then(
          async (e) => {
            t
              ? t(e)
              : R("fetch", { ...a, endTimestamp: Gt() * 1e3, response: e });
            return e;
          },
          (t) => {
            R("fetch", { ...a, endTimestamp: Gt() * 1e3, error: t });
            if (B(t) && t.stack === void 0) {
              t.stack = o.stack;
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
async function Eh(t, e) {
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
function Ah(t) {
  let e;
  try {
    e = t.clone();
  } catch {
    return;
  }
  Eh(e, () => {
    R("fetch-body-resolved", { endTimestamp: Gt() * 1e3, response: t });
  });
}
function Th(t, e) {
  return !!t && typeof t === "object" && !!t[e];
}
function Ih(t) {
  return typeof t === "string"
    ? t
    : t
      ? Th(t, "url")
        ? t.url
        : t.toString
          ? t.toString()
          : ""
      : "";
}
function $h(t) {
  if (t.length === 0) return { method: "GET", url: "" };
  if (t.length === 2) {
    const [e, n] = t;
    return {
      url: Ih(e),
      method: Th(n, "method")
        ? String(n.method).toUpperCase()
        : it(e) && Th(e, "method")
          ? String(e.method).toUpperCase()
          : "GET",
    };
  }
  const e = t[0];
  return {
    url: Ih(e),
    method: Th(e, "method") ? String(e.method).toUpperCase() : "GET",
  };
}
function Oh(t) {
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
 */ function Ch() {
  return (
    typeof __SENTRY_BROWSER_BUNDLE__ !== "undefined" &&
    !!__SENTRY_BROWSER_BUNDLE__
  );
}
function Nh() {
  return "npm";
}
/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */ function jh() {
  return (
    !Ch() &&
    Object.prototype.toString.call(
      typeof process !== "undefined" ? process : 0,
    ) === "[object process]"
  );
}
/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */ function Ph(t, e) {
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
 */ function Mh(t, e = module) {
  let n;
  try {
    n = Ph(e, t);
  } catch {}
  if (!n)
    try {
      const { cwd: s } = Ph(e, "process");
      n = Ph(e, `${s()}/node_modules/${t}`);
    } catch {}
  return n;
}
function Rh() {
  return typeof window !== "undefined" && (!jh() || Dh());
}
function Dh() {
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
 */ function Fh(t, e, n) {
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
function Lh(t, e = false) {
  const n =
    e ||
    (t &&
      !t.startsWith("/") &&
      !t.match(/^[A-Z]:/) &&
      !t.startsWith(".") &&
      !t.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//));
  return !n && t !== void 0 && !t.includes("node_modules/");
}
function Uh(t) {
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
      let a = i[2]?.startsWith("file://") ? i[2].slice(7) : i[2];
      const c = i[5] === "native";
      a?.match(/\/[A-Z]:/) && (a = a.slice(1));
      a || !i[5] || c || (a = i[5]);
      return {
        filename: a ? decodeURI(a) : void 0,
        module: t ? t(a) : void 0,
        function: s,
        lineno: Jh(i[3]),
        colno: Jh(i[4]),
        in_app: Lh(a || "", c),
      };
    }
    return o.match(e) ? { filename: o } : void 0;
  };
}
function qh(t) {
  return [90, Uh(t)];
}
function Jh(t) {
  return parseInt(t || "", 10) || void 0;
}
/**
 * A node.js watchdog timer
 * @param pollInterval The interval that we expect to get polled at
 * @param anrThreshold The threshold for when we consider ANR
 * @param callback The callback to call for ANR
 * @returns An object with `poll` and `enabled` functions {@link WatchdogReturn}
 */ function zh(t, e, n, s) {
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
function Bh(t, e, n) {
  const s = e ? e.replace(/^file:\/\//, "") : void 0;
  const o = t.location.columnNumber ? t.location.columnNumber + 1 : void 0;
  const r = t.location.lineNumber ? t.location.lineNumber + 1 : void 0;
  return {
    filename: s,
    module: n(s),
    function: t.functionName || v,
    colno: o,
    lineno: r,
    in_app: s ? Lh(s) : void 0,
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
function Wh(t) {
  const n = e[Symbol.for("@vercel/request-context")];
  const s = n?.get?.();
  s?.waitUntil && s.waitUntil(t);
}
async function Vh(t) {
  try {
    y.log("Flushing events...");
    await ur(t);
    y.log("Done flushing events");
  } catch (t) {
    y.log("Error while flushing events:\n", t);
  }
}
async function Kh(t = {}) {
  const { timeout: n = 2e3 } = t;
  if (
    "cloudflareWaitUntil" in t &&
    typeof t?.cloudflareWaitUntil === "function"
  ) {
    t.cloudflareWaitUntil(Vh(n));
    return;
  }
  if (
    "cloudflareCtx" in t &&
    typeof t.cloudflareCtx?.waitUntil === "function"
  ) {
    t.cloudflareCtx.waitUntil(Vh(n));
    return;
  }
  if (e[Symbol.for("@vercel/request-context")]) {
    Wh(Vh(n));
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
  s && (await Vh(n));
}
/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */ function Gh(t) {
  return t.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
export {
  eg as ANTHROPIC_AI_INTEGRATION_NAME,
  i as CONSOLE_LEVELS,
  Client,
  ss as DEFAULT_ENVIRONMENT,
  ii as DEFAULT_RETRY_AFTER,
  e as GLOBAL_OBJ,
  hg as GOOGLE_GENAI_INTEGRATION_NAME,
  Rg as LANGCHAIN_INTEGRATION_NAME,
  th as LANGGRAPH_INTEGRATION_NAME,
  LRUMap,
  en as MAX_BAGGAGE_STRING_LENGTH,
  ta as MULTIPLEXED_TRANSPORT_EXTRA_KEY,
  ym as OPENAI_INTEGRATION_NAME,
  n as SDK_VERSION,
  Re as SEMANTIC_ATTRIBUTE_CACHE_HIT,
  Fe as SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE,
  De as SEMANTIC_ATTRIBUTE_CACHE_KEY,
  Me as SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME,
  Le as SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD,
  Pe as SEMANTIC_ATTRIBUTE_PROFILE_ID,
  je as SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME,
  Oe as SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON,
  Ce as SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT,
  Ne as SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE,
  Ie as SEMANTIC_ATTRIBUTE_SENTRY_OP,
  $e as SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  Te as SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE,
  Ae as SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE,
  Ee as SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  Ue as SEMANTIC_ATTRIBUTE_URL_FULL,
  qe as SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE,
  Qe as SENTRY_BAGGAGE_KEY_PREFIX,
  tn as SENTRY_BAGGAGE_KEY_PREFIX_REGEX,
  oi as SENTRY_BUFFER_FULL_ERROR,
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
  po as TRACING_DEFAULTS,
  v as UNKNOWN_FUNCTION,
  Ku as _INTERNAL_FLAG_BUFFER_SIZE,
  Gu as _INTERNAL_MAX_FLAGS_PER_SPAN,
  Qu as _INTERNAL_addFeatureFlagToActiveSpan,
  Ur as _INTERNAL_captureLog,
  Qr as _INTERNAL_captureMetric,
  Lr as _INTERNAL_captureSerializedLog,
  Zr as _INTERNAL_captureSerializedMetric,
  om as _INTERNAL_cleanupToolCallSpan,
  ca as _INTERNAL_clearAiProviderSkips,
  Zu as _INTERNAL_copyFlagsFromScopeToEvent,
  qr as _INTERNAL_flushLogsBuffer,
  ti as _INTERNAL_flushMetricsBuffer,
  sm as _INTERNAL_getSpanForToolCallId,
  Yu as _INTERNAL_insertFlagToScope,
  ie as _INTERNAL_setSpanForScope,
  aa as _INTERNAL_shouldSkipAiProviderWrapping,
  ia as _INTERNAL_skipAiProviderWrapping,
  Ea as addAutoIpAddressToSession,
  xa as addAutoIpAddressToUser,
  qa as addBreadcrumb,
  zn as addChildSpanToSpan,
  jc as addConsoleInstrumentationHandler,
  qt as addContextToFrame,
  dr as addEventProcessor,
  Dt as addExceptionMechanism,
  Rt as addExceptionTypeValue,
  wh as addFetchEndInstrumentationHandler,
  kh as addFetchInstrumentationHandler,
  F as addGlobalErrorInstrumentationHandler,
  q as addGlobalUnhandledRejectionInstrumentationHandler,
  j as addHandler,
  Or as addIntegration,
  vs as addItemToEnvelope,
  mt as addNonEnumerableProperty,
  gm as addVercelAiProcessors,
  ic as applyAggregateErrorsToEvent,
  Ao as applyScopeDataToEvent,
  Aa as applySdkMetadata,
  nn as baggageHeaderToDynamicSamplingContext,
  lu as basename,
  Yt as browserPerformanceTimeOrigin,
  Bh as callFrameToStackFrame,
  ar as captureCheckIn,
  Fc as captureConsoleIntegration,
  Qo as captureEvent,
  Yo as captureException,
  sf as captureFeedback,
  Xo as captureMessage,
  _r as captureSession,
  Jt as checkOrSetAlreadyCaught,
  lr as close,
  te as closeSession,
  Bu as consoleIntegration,
  vf as consoleLoggingIntegration,
  u as consoleSandbox,
  to as continueTrace,
  jn as convertSpanLinksForEnvelope,
  _t as convertToPlainObject,
  $s as createAttachmentEnvelopeItem,
  Ri as createCheckInEnvelope,
  di as createClientReportEnvelope,
  Tf as createConsolaReporter,
  bs as createEnvelope,
  Rs as createEventEnvelope,
  js as createEventEnvelopeHeaders,
  Qg as createLangChainCallbackHandler,
  Ms as createSessionEnvelope,
  Ds as createSpanEnvelope,
  Is as createSpanEnvelopeItem,
  w as createStackParser,
  fi as createTransport,
  Wt as dateTimestampInSeconds,
  Ca as debounce,
  y as debug,
  Jc as dedupeIntegration,
  Cr as defineIntegration,
  uu as dirname,
  ci as disabledUntil,
  St as dropUndefinedKeys,
  fn as dsnFromString,
  pn as dsnToString,
  sn as dynamicSamplingContextToSentryBaggageHeader,
  gr as endSession,
  ks as envelopeContainsItemType,
  Cs as envelopeItemTypeToDataCategory,
  Gh as escapeStringForRegex,
  Ha as eventFiltersIntegration,
  Vi as eventFromMessage,
  Wi as eventFromUnknownInput,
  Ui as exceptionFromError,
  Yc as extraErrorDataIntegration,
  vt as extractExceptionKeysForMessage,
  La as extractQueryParamsFromUrl,
  vn as extractTraceparentData,
  tl as featureFlagsIntegration,
  Lh as filenameIsInApp,
  dt as fill,
  ur as flush,
  Kh as flushIfServerless,
  wa as fmt,
  Ss as forEachEnvelopeItem,
  Va as functionToStringIntegration,
  kn as generateSentryTraceHeader,
  oe as generateSpanId,
  se as generateTraceId,
  Kn as getActiveSpan,
  lh as getBreadcrumbLogLevelFromHttpStatusCode,
  Xe as getCapturedScopesOnSpan,
  we as getClient,
  ft as getComponentName,
  ye as getCurrentScope,
  Lo as getDebugImagesForResources,
  ue as getDefaultCurrentScope,
  le as getDefaultIsolationScope,
  is as getDynamicSamplingContextFromClient,
  as as getDynamicSamplingContextFromScope,
  cs as getDynamicSamplingContextFromSpan,
  kr as getEnvelopeEndpointWithUrlEncodedAuth,
  Mt as getEventDescription,
  Fo as getFilenameToDebugIdMap,
  $ as getFramesFromEvent,
  I as getFunctionName,
  ve as getGlobalScope,
  r as getGlobalSingleton,
  ma as getHttpSpanDetailsFromUrlObject,
  Ar as getIntegrationsToSetup,
  be as getIsolationScope,
  pt as getLocationHref,
  s as getMainCarrier,
  ht as getOriginalFunction,
  wr as getReportDialogEndpoint,
  Vn as getRootSpan,
  Nh as getSDKSource,
  _a as getSanitizedUrlString,
  fa as getSanitizedUrlStringFromUrlObject,
  Ns as getSdkMetadataForEnvelopeHeader,
  Wn as getSpanDescendants,
  We as getSpanStatusFromHttpCode,
  Un as getStatusMessage,
  xe as getTraceContextFromScope,
  Ta as getTraceData,
  Oa as getTraceMetaTags,
  el as growthbookIntegration,
  Ks as handleCallbackErrors,
  Xn as hasSpansEnabled,
  ja as headersToDict,
  ut as htmlTreeAsString,
  Fa as httpHeadersToSpanAttributes,
  Ma as httpRequestToRequestData,
  Za as inboundFiltersIntegration,
  Gi as initAndBind,
  xr as installedIntegrations,
  gg as instrumentAnthropicAiClient,
  al as instrumentFetchRequest,
  Mg as instrumentGoogleGenAIClient,
  uh as instrumentLangGraph,
  Wm as instrumentOpenAiClient,
  ah as instrumentStateGraphCompile,
  Tu as instrumentSupabaseClient,
  au as isAbsolute,
  Rh as isBrowser,
  Ch as isBrowserBundle,
  K as isDOMError,
  G as isDOMException,
  tt as isElement,
  fr as isEnabled,
  B as isError,
  V as isErrorEvent,
  Q as isEvent,
  pr as isInitialized,
  ot as isInstanceOf,
  It as isMatchingPattern,
  yh as isNativeFunction,
  jh as isNodeEnv,
  Z as isParameterizedString,
  X as isPlainObject,
  Y as isPrimitive,
  ui as isRateLimited,
  et as isRegExp,
  ya as isSentryRequestUrl,
  H as isString,
  st as isSyntheticEvent,
  nt as isThenable,
  la as isURLObjectRelative,
  rt as isVueViewModel,
  cu as join,
  ir as lastEventId,
  mc as linkedErrorsIntegration,
  Mh as loadModule,
  Ls as logSpanEnd,
  Fs as logSpanStart,
  ff as logger,
  _n as makeDsn,
  oa as makeMultiplexedTransport,
  Qi as makeOfflineTransport,
  ri as makePromiseBuffer,
  Xt as makeSession,
  gt as markFunctionWrapped,
  M as maybeInstrument,
  To as mergeScopeData,
  Ef as metrics,
  Sc as moduleMetadataIntegration,
  Uh as node,
  qh as nodeStackLineParser,
  ls as normalize,
  iu as normalizePath,
  ps as normalizeToSize,
  _s as normalizeUrlToBase,
  xo as notifyEventProcessors,
  an as objectToBaggageHeader,
  xt as objectify,
  c as originalConsoleMethods,
  ka as parameterize,
  on as parseBaggageHeader,
  Ts as parseEnvelope,
  ai as parseRetryAfterHeader,
  yn as parseSampleRate,
  Ut as parseSemver,
  Li as parseStackFrames,
  pa as parseStringToURLObject,
  ga as parseUrl,
  Uo as prepareEvent,
  il as profiler,
  Sn as propagationContextFromHeaders,
  Yn as registerSpanErrorInstrumentation,
  wo as rejectedSyncPromise,
  ru as relative,
  Fh as replaceExports,
  Oc as requestDataIntegration,
  P as resetInstrumentationHandlers,
  su as resolve,
  ko as resolvedSyncPromise,
  fu as rewriteFramesIntegration,
  Tt as safeJoin,
  Hs as sampleSpan,
  Es as serializeEnvelope,
  he as setAsyncContextStrategy,
  Ye as setCapturedScopesOnSpan,
  tr as setContext,
  Hi as setCurrentClient,
  nr as setExtra,
  er as setExtras,
  Ve as setHttpStatus,
  Us as setMeasurement,
  or as setTag,
  sr as setTags,
  rr as setUser,
  Mc as severityLevelFromString,
  En as shouldContinueTrace,
  At as snipLine,
  Ln as spanIsSampled,
  Pn as spanTimeInputToSeconds,
  us as spanToBaggageHeader,
  Rn as spanToJSON,
  On as spanToTraceContext,
  Cn as spanToTraceHeader,
  x as stackParserFromStackParserOptions,
  _o as startIdleSpan,
  Qs as startInactiveSpan,
  so as startNewTrace,
  mr as startSession,
  Ys as startSpan,
  Xs as startSpanManual,
  $t as stringMatchesSomePattern,
  E as stripSentryFramesAndReverse,
  ha as stripUrlQueryAndFragment,
  Ou as supabaseIntegration,
  dh as supportsDOMError,
  mh as supportsDOMException,
  fh as supportsErrorEvent,
  hh as supportsFetch,
  gh as supportsHistory,
  bh as supportsNativeFetch,
  Sh as supportsReferrerPolicy,
  vh as supportsReportingObserver,
  no as suppressTracing,
  Uu as thirdPartyErrorFilterIntegration,
  qs as timedEventsToMeasurements,
  Gt as timestampInSeconds,
  R as triggerHandlers,
  _l as trpcMiddleware,
  Et as truncate,
  li as updateRateLimits,
  Qt as updateSession,
  Hn as updateSpanName,
  jt as uuid4,
  Wh as vercelWaitUntil,
  zh as watchdogTimer,
  Na as winterCGHeadersToDict,
  Pa as winterCGRequestToRequestData,
  eo as withActiveSpan,
  ke as withIsolationScope,
  cr as withMonitor,
  Se as withScope,
  nf as wrapMcpServerWithSentry,
  Lu as zodErrorsIntegration,
};
