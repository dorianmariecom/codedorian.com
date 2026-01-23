// @sentry/core@10.34.0 downloaded from https://ga.jspm.io/npm:@sentry/core@10.34.0/build/esm/index.js

const t = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
const e = globalThis;
const n = "10.34.0";
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
const N = {};
function j(t, e) {
  C[t] = C[t] || [];
  C[t].push(e);
}
function R() {
  Object.keys(C).forEach((t) => {
    C[t] = void 0;
  });
}
function P(e, n) {
  if (!N[e]) {
    N[e] = true;
    try {
      n();
    } catch (n) {
      t && y.error(`Error while instrumenting ${e}`, n);
    }
  }
}
function M(e, n) {
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
  j(e, t);
  P(e, L);
}
function L() {
  D = e.onerror;
  e.onerror = function (t, e, n, o, s) {
    const r = { column: o, error: s, line: n, msg: t, url: e };
    M("error", r);
    return !!D && D.apply(this, arguments);
  };
  e.onerror.__SENTRY_INSTRUMENTED__ = true;
}
let q = null;
function U(t) {
  const e = "unhandledrejection";
  j(e, t);
  P(e, J);
}
function J() {
  q = e.onunhandledrejection;
  e.onunhandledrejection = function (t) {
    const e = t;
    M("unhandledrejection", e);
    return !q || q.apply(this, arguments);
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
 */ function G(t) {
  return W(t, "DOMError");
}
/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function K(t) {
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
let Et;
function At(t) {
  if (Et !== void 0) return Et ? Et(t) : t();
  const n = Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__");
  const o = e;
  if (n in o && typeof o[n] === "function") {
    Et = o[n];
    return Et(t);
  }
  Et = null;
  return t();
}
function Tt() {
  return At(() => Math.random());
}
function It() {
  return At(() => Date.now());
}
/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string (0 = unlimited)
 * @returns string Encoded
 */ function $t(t, e = 0) {
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
 */ function Ot(t, e) {
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
 */ function Ct(t, e) {
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
 */ function Nt(t, e, n = false) {
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
 */ function jt(t, e = [], n = false) {
  return e.some((e) => Nt(t, e, n));
}
function Rt() {
  const t = e;
  return t.crypto || t.msCrypto;
}
let Pt;
function Mt() {
  return Tt() * 16;
}
/**
 * UUID4 generator
 * @param crypto Object that provides the crypto API.
 * @returns string Generated UUID4.
 */ function Dt(t = Rt()) {
  try {
    if (t?.randomUUID) return At(() => t.randomUUID()).replace(/-/g, "");
  } catch {}
  Pt || (Pt = [1e7] + 1e3 + 4e3 + 8e3 + 1e11);
  return Pt.replace(/[018]/g, (t) =>
    (t ^ ((Mt() & 15) >> (t / 4))).toString(16),
  );
}
function Ft(t) {
  return t.exception?.values?.[0];
}
/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */ function Lt(t) {
  const { message: e, event_id: n } = t;
  if (e) return e;
  const o = Ft(t);
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
 */ function qt(t, e, n) {
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
 */ function Ut(t, e) {
  const n = Ft(t);
  if (!n) return;
  const o = { type: "generic", handled: true };
  const s = n.mechanism;
  n.mechanism = { ...o, ...s, ...e };
  if (e && "data" in e) {
    const t = { ...s?.data, ...e.data };
    n.mechanism.data = t;
  }
}
const Jt =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
function zt(t) {
  return parseInt(t || "", 10);
}
/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */ function Bt(t) {
  const e = t.match(Jt) || [];
  const n = zt(e[1]);
  const o = zt(e[2]);
  const s = zt(e[3]);
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
 */ function Wt(t, e, n = 5) {
  if (e.lineno === void 0) return;
  const o = t.length;
  const s = Math.max(Math.min(o - 1, e.lineno - 1), 0);
  e.pre_context = t.slice(Math.max(0, s - n), s).map((t) => Ot(t, 0));
  const r = Math.min(o - 1, s);
  e.context_line = Ot(t[r], e.colno || 0);
  e.post_context = t.slice(Math.min(s + 1, o), s + 1 + n).map((t) => Ot(t, 0));
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
 */ function Vt(t) {
  if (Gt(t)) return true;
  try {
    mt(t, "__sentry_captured__", true);
  } catch {}
  return false;
}
function Gt(t) {
  try {
    return t.__sentry_captured__;
  } catch {}
}
const Kt = 1e3;
function Ht() {
  return It() / Kt;
}
function Zt() {
  const { performance: t } = e;
  if (!t?.now || !t.timeOrigin) return Ht;
  const n = t.timeOrigin;
  return () => (n + At(() => t.now())) / Kt;
}
let Yt;
function Xt() {
  const t = Yt ?? (Yt = Zt());
  return t();
}
let Qt = null;
function te() {
  const { performance: t } = e;
  if (!t?.now) return;
  const n = 3e5;
  const o = At(() => t.now());
  const s = It();
  const r = t.timeOrigin;
  if (typeof r === "number") {
    const t = Math.abs(r + o - s);
    if (t < n) return r;
  }
  const i = t.timing?.navigationStart;
  if (typeof i === "number") {
    const t = Math.abs(i + o - s);
    if (t < n) return i;
  }
  return s - o;
}
function ee() {
  Qt === null && (Qt = te());
  return Qt;
}
/**
 * Creates a new `Session` object by setting certain default parameters. If optional @param context
 * is passed, the passed properties are applied to the session object.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns a new `Session` object
 */ function ne(t) {
  const e = Xt();
  const n = {
    sid: Dt(),
    init: true,
    timestamp: e,
    started: e,
    duration: 0,
    status: "ok",
    errors: 0,
    ignoreDuration: false,
    toJSON: () => re(n),
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
  t.timestamp = e.timestamp || Xt();
  e.abnormal_mechanism && (t.abnormal_mechanism = e.abnormal_mechanism);
  e.ignoreDuration && (t.ignoreDuration = e.ignoreDuration);
  e.sid && (t.sid = e.sid.length === 32 ? e.sid : Dt());
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
 */ function se(t, e) {
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
 */ function re(t) {
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
function ie(t, e, n = 2) {
  if (!e || typeof e !== "object" || n <= 0) return e;
  if (t && Object.keys(e).length === 0) return t;
  const o = { ...t };
  for (const t in e)
    Object.prototype.hasOwnProperty.call(e, t) &&
      (o[t] = ie(o[t], e[t], n - 1));
  return o;
}
function ae() {
  return Dt();
}
function ce() {
  return Dt().substring(16);
}
const ue = "_sentrySpan";
function le(t, e) {
  e ? mt(t, ue, e) : delete t[ue];
}
function pe(t) {
  return t[ue];
}
const fe = 100;
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
    this._propagationContext = { traceId: ae(), sampleRand: Tt() };
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
    le(t, pe(this));
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
    le(this, void 0);
    this._attachments = [];
    this.setPropagationContext({ traceId: ae(), sampleRand: Tt() });
    this._notifyScopeListeners();
    return this;
  }
  addBreadcrumb(t, e) {
    const n = typeof e === "number" ? e : fe;
    if (n <= 0) return this;
    const o = {
      timestamp: Ht(),
      ...t,
      message: t.message ? $t(t.message, 2048) : t.message,
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
      span: pe(this),
    };
  }
  setSDKProcessingMetadata(t) {
    this._sdkProcessingMetadata = ie(this._sdkProcessingMetadata, t, 2);
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
    const o = n?.event_id || Dt();
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
    const s = o?.event_id || Dt();
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
    const o = n?.event_id || Dt();
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
function de() {
  return r("defaultCurrentScope", () => new Scope());
}
function me() {
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
function ge() {
  const t = o();
  const e = s(t);
  return (e.stack = e.stack || new AsyncContextStack(de(), me()));
}
function he(t) {
  return ge().withScope(t);
}
function _e(t, e) {
  const n = ge();
  return n.withScope(() => {
    n.getStackTop().scope = t;
    return e(t);
  });
}
function ye(t) {
  return ge().withScope(() => t(ge().getIsolationScope()));
}
function be() {
  return {
    withIsolationScope: ye,
    withScope: he,
    withSetScope: _e,
    withSetIsolationScope: (t, e) => ye(e),
    getCurrentScope: () => ge().getScope(),
    getIsolationScope: () => ge().getIsolationScope(),
  };
}
function ve(t) {
  const e = o();
  const n = s(e);
  n.acs = t;
}
function Se(t) {
  const e = s(t);
  return e.acs ? e.acs : be();
}
function ke() {
  const t = o();
  const e = Se(t);
  return e.getCurrentScope();
}
function we() {
  const t = o();
  const e = Se(t);
  return e.getIsolationScope();
}
function xe() {
  return r("globalScope", () => new Scope());
}
function Ee(...t) {
  const e = o();
  const n = Se(e);
  if (t.length === 2) {
    const [e, o] = t;
    return e ? n.withSetScope(e, o) : n.withScope(o);
  }
  return n.withScope(t[0]);
}
function Ae(...t) {
  const e = o();
  const n = Se(e);
  if (t.length === 2) {
    const [e, o] = t;
    return e ? n.withSetIsolationScope(e, o) : n.withIsolationScope(o);
  }
  return n.withIsolationScope(t[0]);
}
function Te() {
  return ke().getClient();
}
function Ie(t) {
  const e = t.getPropagationContext();
  const { traceId: n, parentSpanId: o, propagationSpanId: s } = e;
  const r = { trace_id: n, span_id: s || ce() };
  o && (r.parent_span_id = o);
  return r;
}
const $e = "sentry.source";
const Oe = "sentry.sample_rate";
const Ce = "sentry.previous_trace_sample_rate";
const Ne = "sentry.op";
const je = "sentry.origin";
const Re = "sentry.idle_span_finish_reason";
const Pe = "sentry.measurement_unit";
const Me = "sentry.measurement_value";
const De = "sentry.custom_span_name";
const Fe = "sentry.profile_id";
const Le = "sentry.exclusive_time";
const qe = "cache.hit";
const Ue = "cache.key";
const Je = "cache.item_size";
const ze = "http.request.method";
const Be = "url.full";
const We = "sentry.link.type";
const Ve = 0;
const Ge = 1;
const Ke = 2;
/**
 * Converts a HTTP status code into a sentry status with a message.
 *
 * @param httpStatus The HTTP response status code.
 * @returns The span status or internal_error.
 */ function He(t) {
  if (t < 400 && t >= 100) return { code: Ge };
  if (t >= 400 && t < 500)
    switch (t) {
      case 401:
        return { code: Ke, message: "unauthenticated" };
      case 403:
        return { code: Ke, message: "permission_denied" };
      case 404:
        return { code: Ke, message: "not_found" };
      case 409:
        return { code: Ke, message: "already_exists" };
      case 413:
        return { code: Ke, message: "failed_precondition" };
      case 429:
        return { code: Ke, message: "resource_exhausted" };
      case 499:
        return { code: Ke, message: "cancelled" };
      default:
        return { code: Ke, message: "invalid_argument" };
    }
  if (t >= 500 && t < 600)
    switch (t) {
      case 501:
        return { code: Ke, message: "unimplemented" };
      case 503:
        return { code: Ke, message: "unavailable" };
      case 504:
        return { code: Ke, message: "deadline_exceeded" };
      default:
        return { code: Ke, message: "internal_error" };
    }
  return { code: Ke, message: "internal_error" };
}
function Ze(t, e) {
  t.setAttribute("http.response.status_code", e);
  const n = He(e);
  n.message !== "unknown_error" && t.setStatus(n);
}
const Ye = "_sentryScope";
const Xe = "_sentryIsolationScope";
function Qe(t) {
  try {
    const n = e.WeakRef;
    if (typeof n === "function") return new n(t);
  } catch {}
  return t;
}
function tn(t) {
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
function en(t, e, n) {
  if (t) {
    mt(t, Xe, Qe(n));
    mt(t, Ye, e);
  }
}
function nn(t) {
  const e = t;
  return { scope: e[Ye], isolationScope: tn(e[Xe]) };
}
const on = "sentry-";
const sn = /^sentry-/;
const rn = 8192;
/**
 * Takes a baggage header and turns it into Dynamic Sampling Context, by extracting all the "sentry-" prefixed values
 * from it.
 *
 * @param baggageHeader A very bread definition of a baggage header as it might appear in various frameworks.
 * @returns The Dynamic Sampling Context that was found on `baggageHeader`, if there was any, `undefined` otherwise.
 */ function an(t) {
  const e = un(t);
  if (!e) return;
  const n = Object.entries(e).reduce((t, [e, n]) => {
    if (e.match(sn)) {
      const o = e.slice(on.length);
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
 */ function cn(t) {
  if (!t) return;
  const e = Object.entries(t).reduce((t, [e, n]) => {
    n && (t[`${on}${e}`] = n);
    return t;
  }, {});
  return pn(e);
}
function un(t) {
  if (t && (H(t) || Array.isArray(t)))
    return Array.isArray(t)
      ? t.reduce((t, e) => {
          const n = ln(e);
          Object.entries(n).forEach(([e, n]) => {
            t[e] = n;
          });
          return t;
        }, {})
      : ln(t);
}
/**
 * Will parse a baggage header, which is a simple key-value map, into a flat object.
 *
 * @param baggageHeader The baggage header to parse.
 * @returns a flat object containing all the key-value pairs from `baggageHeader`.
 */ function ln(t) {
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
 */ function pn(e) {
  if (Object.keys(e).length !== 0)
    return Object.entries(e).reduce((e, [n, o], s) => {
      const r = `${encodeURIComponent(n)}=${encodeURIComponent(o)}`;
      const i = s === 0 ? r : `${e},${r}`;
      if (i.length > rn) {
        t &&
          y.warn(
            `Not adding key: ${n} with val: ${o} to baggage header due to exceeding baggage size limits.`,
          );
        return e;
      }
      return i;
    }, "");
}
const fn = /^o(\d+)\./;
const dn =
  /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;
function mn(t) {
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
 */ function gn(t, e = false) {
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
 */ function hn(t) {
  const e = dn.exec(t);
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
  return _n({
    host: r,
    pass: s,
    path: c,
    projectId: l,
    port: i,
    protocol: n,
    publicKey: o,
  });
}
function _n(t) {
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
function yn(e) {
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
  if (!mn(s)) {
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
 */ function bn(t) {
  const e = t.match(fn);
  return e?.[1];
}
function vn(t) {
  const e = t.getOptions();
  const { host: n } = t.getDsn() || {};
  let o;
  e.orgId ? (o = String(e.orgId)) : n && (o = bn(n));
  return o;
}
/**
 * Creates a valid Sentry Dsn object, identifying a Sentry instance and project.
 * @returns a valid DsnComponents object or `undefined` if @param from is an invalid DSN source
 */ function Sn(t) {
  const e = typeof t === "string" ? hn(t) : _n(t);
  if (e && yn(e)) return e;
}
function kn(t) {
  if (typeof t === "boolean") return Number(t);
  const e = typeof t === "string" ? parseFloat(t) : t;
  return typeof e !== "number" || isNaN(e) || e < 0 || e > 1 ? void 0 : e;
}
const wn = new RegExp(
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
 */ function xn(t) {
  if (!t) return;
  const e = t.match(wn);
  if (!e) return;
  let n;
  e[3] === "1" ? (n = true) : e[3] === "0" && (n = false);
  return { traceId: e[1], parentSampled: n, parentSpanId: e[2] };
}
function En(t, e) {
  const n = xn(t);
  const o = an(e);
  if (!n?.traceId) return { traceId: ae(), sampleRand: Tt() };
  const s = In(n, o);
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
function An(t = ae(), e = ce(), n) {
  let o = "";
  n !== void 0 && (o = n ? "-1" : "-0");
  return `${t}-${e}${o}`;
}
function Tn(t = ae(), e = ce(), n) {
  return `00-${t}-${e}-${n ? "01" : "00"}`;
}
function In(t, e) {
  const n = kn(e?.sample_rand);
  if (n !== void 0) return n;
  const o = kn(e?.sample_rate);
  return o && t?.parentSampled !== void 0
    ? t.parentSampled
      ? Tt() * o
      : o + Tt() * (1 - o)
    : Tt();
}
function $n(t, e) {
  const n = vn(t);
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
const On = 0;
const Cn = 1;
let Nn = false;
function jn(t) {
  const { spanId: e, traceId: n } = t.spanContext();
  const {
    data: o,
    op: s,
    parent_span_id: r,
    status: i,
    origin: a,
    links: c,
  } = qn(t);
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
function Rn(t) {
  const { spanId: e, traceId: n, isRemote: o } = t.spanContext();
  const s = o ? e : qn(t).parent_span_id;
  const r = nn(t).scope;
  const i = o ? r?.getPropagationContext().propagationSpanId || ce() : e;
  return { parent_span_id: s, span_id: i, trace_id: n };
}
function Pn(t) {
  const { traceId: e, spanId: n } = t.spanContext();
  const o = zn(t);
  return An(e, n, o);
}
function Mn(t) {
  const { traceId: e, spanId: n } = t.spanContext();
  const o = zn(t);
  return Tn(e, n, o);
}
function Dn(t) {
  return t && t.length > 0
    ? t.map(
        ({
          context: { spanId: t, traceId: e, traceFlags: n, ...o },
          attributes: s,
        }) => ({
          span_id: t,
          trace_id: e,
          sampled: n === Cn,
          attributes: s,
          ...o,
        }),
      )
    : void 0;
}
function Fn(t) {
  return typeof t === "number"
    ? Ln(t)
    : Array.isArray(t)
      ? t[0] + t[1] / 1e9
      : t instanceof Date
        ? Ln(t.getTime())
        : Xt();
}
function Ln(t) {
  const e = t > 9999999999;
  return e ? t / 1e3 : t;
}
function qn(t) {
  if (Jn(t)) return t.getSpanJSON();
  const { spanId: e, traceId: n } = t.spanContext();
  if (Un(t)) {
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
      start_timestamp: Fn(s),
      timestamp: Fn(i) || void 0,
      status: Bn(a),
      op: o[Ne],
      origin: o[je],
      links: Dn(c),
    };
  }
  return { span_id: e, trace_id: n, start_timestamp: 0, data: {} };
}
function Un(t) {
  const e = t;
  return (
    !!e.attributes && !!e.startTime && !!e.name && !!e.endTime && !!e.status
  );
}
function Jn(t) {
  return typeof t.getSpanJSON === "function";
}
function zn(t) {
  const { traceFlags: e } = t.spanContext();
  return e === Cn;
}
function Bn(t) {
  if (t && t.code !== Ve)
    return t.code === Ge ? "ok" : t.message || "internal_error";
}
const Wn = "_sentryChildSpans";
const Vn = "_sentryRootSpan";
function Gn(t, e) {
  const n = t[Vn] || t;
  mt(e, Vn, n);
  t[Wn] ? t[Wn].add(e) : mt(t, Wn, new Set([e]));
}
function Kn(t, e) {
  t[Wn] && t[Wn].delete(e);
}
function Hn(t) {
  const e = new Set();
  function n(t) {
    if (!e.has(t) && zn(t)) {
      e.add(t);
      const o = t[Wn] ? Array.from(t[Wn]) : [];
      for (const t of o) n(t);
    }
  }
  n(t);
  return Array.from(e);
}
function Zn(t) {
  return t[Vn] || t;
}
function Yn() {
  const t = o();
  const e = Se(t);
  return e.getActiveSpan ? e.getActiveSpan() : pe(ke());
}
function Xn() {
  if (!Nn) {
    u(() => {
      console.warn(
        "[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.",
      );
    });
    Nn = true;
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
 */ function Qn(t, e) {
  t.updateName(e);
  t.setAttributes({ [$e]: "custom", [De]: e });
}
let to = false;
function eo() {
  if (!to) {
    e.tag = "sentry_tracingErrorCallback";
    to = true;
    F(e);
    U(e);
  }
  function e() {
    const e = Yn();
    const n = e && Zn(e);
    if (n) {
      const e = "internal_error";
      t && y.log(`[Tracing] Root span: ${e} -> Global error occurred`);
      n.setStatus({ code: Ke, message: e });
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
 */ function no(t) {
  if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__)
    return false;
  const e = t || Te()?.getOptions();
  return !!e && (e.tracesSampleRate != null || !!e.tracesSampler);
}
function oo(t) {
  y.log(
    `Ignoring span ${t.op} - ${t.description} because it matches \`ignoreSpans\`.`,
  );
}
function so(e, n) {
  if (!n?.length || !e.description) return false;
  for (const o of n) {
    if (io(o)) {
      if (Nt(e.description, o)) {
        t && oo(e);
        return true;
      }
      continue;
    }
    if (!o.name && !o.op) continue;
    const n = !o.name || Nt(e.description, o.name);
    const s = !o.op || (e.op && Nt(e.op, o.op));
    if (n && s) {
      t && oo(e);
      return true;
    }
  }
  return false;
}
function ro(t, e) {
  const n = e.parent_span_id;
  const o = e.span_id;
  if (n) for (const e of t) e.parent_span_id === o && (e.parent_span_id = n);
}
function io(t) {
  return typeof t === "string" || t instanceof RegExp;
}
const ao = "production";
const co = "development";
const uo = "_frozenDsc";
function lo(t, e) {
  const n = t;
  mt(n, uo, e);
}
function po(t, e) {
  const n = e.getOptions();
  const { publicKey: o } = e.getDsn() || {};
  const s = {
    environment: n.environment || ao,
    release: n.release,
    public_key: o,
    trace_id: t,
    org_id: vn(e),
  };
  e.emit("createDsc", s);
  return s;
}
function fo(t, e) {
  const n = e.getPropagationContext();
  return n.dsc || po(n.traceId, t);
}
/**
 * Creates a dynamic sampling context from a span (and client and scope)
 *
 * @param span the span from which a few values like the root span name and sample rate are extracted.
 *
 * @returns a dynamic sampling context
 */ function mo(t) {
  const e = Te();
  if (!e) return {};
  const n = Zn(t);
  const o = qn(n);
  const s = o.data;
  const r = n.spanContext().traceState;
  const i = r?.get("sentry.sample_rate") ?? s[Oe] ?? s[Ce];
  function a(t) {
    (typeof i !== "number" && typeof i !== "string") ||
      (t.sample_rate = `${i}`);
    return t;
  }
  const c = n[uo];
  if (c) return a(c);
  const u = r?.get("sentry.dsc");
  const l = u && an(u);
  if (l) return a(l);
  const p = po(t.spanContext().traceId, e);
  const f = s[$e];
  const d = o.description;
  f !== "url" && d && (p.transaction = d);
  if (no()) {
    p.sampled = String(zn(n));
    p.sample_rand =
      r?.get("sentry.sample_rand") ??
      nn(n).scope?.getPropagationContext().sampleRand.toString();
  }
  a(p);
  e.emit("createDsc", p, n);
  return p;
}
function go(t) {
  const e = mo(t);
  return cn(e);
}
class SentryNonRecordingSpan {
  constructor(t = {}) {
    this._traceId = t.traceId || ae();
    this._spanId = t.spanId || ce();
  }
  spanContext() {
    return { spanId: this._spanId, traceId: this._traceId, traceFlags: On };
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
 */ function ho(t, e = 100, n = Infinity) {
  try {
    return yo("", t, e, n);
  } catch (t) {
    return { ERROR: `**non-serializable** (${t})` };
  }
}
function _o(t, e = 3, n = 102400) {
  const o = ho(t, e);
  return ko(o) > n ? _o(t, e - 1, n) : o;
}
/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */ function yo(t, e, n = Infinity, o = Infinity, s = xo()) {
  const [r, i] = s;
  if (
    e == null ||
    ["boolean", "string"].includes(typeof e) ||
    (typeof e === "number" && Number.isFinite(e))
  )
    return e;
  const a = bo(t, e);
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
      return yo("", t, c - 1, o, s);
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
    l[t] = yo(t, e, c - 1, o, s);
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
 */ function bo(t, e) {
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
    const n = vo(e);
    return /^HTML(\w*)Element$/.test(n)
      ? `[HTMLElement: ${n}]`
      : `[object ${n}]`;
  } catch (t) {
    return `**non-serializable** (${t})`;
  }
}
function vo(t) {
  const e = Object.getPrototypeOf(t);
  return e?.constructor ? e.constructor.name : "null prototype";
}
function So(t) {
  return ~-encodeURI(t).split(/%..|./).length;
}
function ko(t) {
  return So(JSON.stringify(t));
}
/**
 * Normalizes URLs in exceptions and stacktraces to a base path so Sentry can fingerprint
 * across platforms and working directory.
 *
 * @param url The URL to be normalized.
 * @param basePath The application base path.
 * @returns The normalized URL.
 */ function wo(t, e) {
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
function xo() {
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
function Eo(t, e = []) {
  return [t, e];
}
function Ao(t, e) {
  const [n, o] = t;
  return [n, [...o, e]];
}
function To(t, e) {
  const n = t[1];
  for (const t of n) {
    const n = t[0].type;
    const o = e(t, n);
    if (o) return true;
  }
  return false;
}
function Io(t, e) {
  return To(t, (t, n) => e.includes(n));
}
function $o(t) {
  const n = s(e);
  return n.encodePolyfill ? n.encodePolyfill(t) : new TextEncoder().encode(t);
}
function Oo(t) {
  const n = s(e);
  return n.decodePolyfill ? n.decodePolyfill(t) : new TextDecoder().decode(t);
}
function Co(t) {
  const [e, n] = t;
  let o = JSON.stringify(e);
  function s(t) {
    typeof o === "string"
      ? (o = typeof t === "string" ? o + t : [$o(o), t])
      : o.push(typeof t === "string" ? $o(t) : t);
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
        t = JSON.stringify(ho(n));
      }
      s(t);
    }
  }
  return typeof o === "string" ? o : No(o);
}
function No(t) {
  const e = t.reduce((t, e) => t + e.length, 0);
  const n = new Uint8Array(e);
  let o = 0;
  for (const e of t) {
    n.set(e, o);
    o += e.length;
  }
  return n;
}
function jo(t) {
  let e = typeof t === "string" ? $o(t) : t;
  function n(t) {
    const n = e.subarray(0, t);
    e = e.subarray(t + 1);
    return n;
  }
  function o() {
    let t = e.indexOf(10);
    t < 0 && (t = e.length);
    return JSON.parse(Oo(n(t)));
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
function Ro(t) {
  const e = { type: "span" };
  return [e, t];
}
function Po(t) {
  const e = typeof t.data === "string" ? $o(t.data) : t.data;
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
const Mo = {
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
function Do(t) {
  return Mo[t];
}
function Fo(t) {
  if (!t?.sdk) return;
  const { name: e, version: n } = t.sdk;
  return { name: e, version: n };
}
function Lo(t, e, n, o) {
  const s = t.sdkProcessingMetadata?.dynamicSamplingContext;
  return {
    event_id: t.event_id,
    sent_at: new Date().toISOString(),
    ...(e && { sdk: e }),
    ...(!!n && o && { dsn: gn(o) }),
    ...(s && { trace: s }),
  };
}
function qo(t, e) {
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
function Uo(t, e, n, o) {
  const s = Fo(n);
  const r = {
    sent_at: new Date().toISOString(),
    ...(s && { sdk: s }),
    ...(!!o && e && { dsn: gn(e) }),
  };
  const i =
    "aggregates" in t
      ? [{ type: "sessions" }, t]
      : [{ type: "session" }, t.toJSON()];
  return Eo(r, [i]);
}
function Jo(t, e, n, o) {
  const s = Fo(n);
  const r = t.type && t.type !== "replay_event" ? t.type : "event";
  qo(t, n?.sdk);
  const i = Lo(t, s, o, e);
  delete t.sdkProcessingMetadata;
  const a = [{ type: r }, t];
  return Eo(i, [a]);
}
function zo(t, e) {
  function n(t) {
    return !!t.trace_id && !!t.public_key;
  }
  const o = mo(t[0]);
  const s = e?.getDsn();
  const r = e?.getOptions().tunnel;
  const i = {
    sent_at: new Date().toISOString(),
    ...(n(o) && { trace: o }),
    ...(!!r && s && { dsn: gn(s) }),
  };
  const { beforeSendSpan: a, ignoreSpans: c } = e?.getOptions() || {};
  const u = c?.length ? t.filter((t) => !so(qn(t), c)) : t;
  const l = t.length - u.length;
  l && e?.recordDroppedEvent("before_send", "span", l);
  const p = a
    ? (t) => {
        const e = qn(t);
        const n = a(e);
        if (!n) {
          Xn();
          return e;
        }
        return n;
      }
    : qn;
  const f = [];
  for (const t of u) {
    const e = p(t);
    e && f.push(Ro(e));
  }
  return Eo(i, f);
}
function Bo(e) {
  if (!t) return;
  const {
    description: n = "< unknown name >",
    op: o = "< unknown op >",
    parent_span_id: s,
  } = qn(e);
  const { spanId: r } = e.spanContext();
  const i = zn(e);
  const a = Zn(e);
  const c = a === e;
  const u = `[Tracing] Starting ${i ? "sampled" : "unsampled"} ${c ? "root " : ""}span`;
  const l = [`op: ${o}`, `name: ${n}`, `ID: ${r}`];
  s && l.push(`parent ID: ${s}`);
  if (!c) {
    const { op: t, description: e } = qn(a);
    l.push(`root ID: ${a.spanContext().spanId}`);
    t && l.push(`root op: ${t}`);
    e && l.push(`root description: ${e}`);
  }
  y.log(`${u}\n  ${l.join("\n  ")}`);
}
function Wo(e) {
  if (!t) return;
  const { description: n = "< unknown name >", op: o = "< unknown op >" } =
    qn(e);
  const { spanId: s } = e.spanContext();
  const r = Zn(e);
  const i = r === e;
  const a = `[Tracing] Finishing "${o}" ${i ? "root " : ""}span "${n}" with ID ${s}`;
  y.log(a);
}
function Vo(e, n, o, s = Yn()) {
  const r = s && Zn(s);
  if (r) {
    t &&
      y.log(`[Measurement] Setting measurement on root span: ${e} = ${n} ${o}`);
    r.addEvent(e, { [Me]: n, [Pe]: o });
  }
}
function Go(t) {
  if (!t || t.length === 0) return;
  const e = {};
  t.forEach((t) => {
    const n = t.attributes || {};
    const o = n[Pe];
    const s = n[Me];
    typeof o === "string" &&
      typeof s === "number" &&
      (e[t.name] = { value: s, unit: o });
  });
  return e;
}
const Ko = 1e3;
class SentrySpan {
  constructor(t = {}) {
    this._traceId = t.traceId || ae();
    this._spanId = t.spanId || ce();
    this._startTime = t.startTimestamp || Xt();
    this._links = t.links;
    this._attributes = {};
    this.setAttributes({ [je]: "manual", [Ne]: t.op, ...t.attributes });
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
    return { spanId: t, traceId: e, traceFlags: n ? Cn : On };
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
    this._startTime = Fn(t);
  }
  setStatus(t) {
    this._status = t;
    return this;
  }
  updateName(t) {
    this._name = t;
    this.setAttribute($e, "custom");
    return this;
  }
  end(t) {
    if (!this._endTime) {
      this._endTime = Fn(t);
      Wo(this);
      this._onSpanEnded();
    }
  }
  getSpanJSON() {
    return {
      data: this._attributes,
      description: this._name,
      op: this._attributes[Ne],
      parent_span_id: this._parentSpanId,
      span_id: this._spanId,
      start_timestamp: this._startTime,
      status: Bn(this._status),
      timestamp: this._endTime,
      trace_id: this._traceId,
      origin: this._attributes[je],
      profile_id: this._attributes[Fe],
      exclusive_time: this._attributes[Le],
      measurements: Go(this._events),
      is_segment: (this._isStandaloneSpan && Zn(this) === this) || void 0,
      segment_id: this._isStandaloneSpan
        ? Zn(this).spanContext().spanId
        : void 0,
      links: Dn(this._links),
    };
  }
  isRecording() {
    return !this._endTime && !!this._sampled;
  }
  addEvent(e, n, o) {
    t && y.log("[Tracing] Adding an event to span:", e);
    const s = Ho(n) ? n : o || Xt();
    const r = Ho(n) ? {} : n || {};
    const i = { name: e, time: Fn(s), attributes: r };
    this._events.push(i);
    return this;
  }
  isStandaloneSpan() {
    return !!this._isStandaloneSpan;
  }
  _onSpanEnded() {
    const e = Te();
    e && e.emit("spanEnd", this);
    const n = this._isStandaloneSpan || this === Zn(this);
    if (!n) return;
    if (this._isStandaloneSpan) {
      if (this._sampled) Xo(zo([this], e));
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
      const t = nn(this).scope || ke();
      t.captureEvent(o);
    }
  }
  _convertSpanToTransaction() {
    if (!Zo(qn(this))) return;
    if (!this._name) {
      t &&
        y.warn(
          "Transaction has no name, falling back to `<unlabeled transaction>`.",
        );
      this._name = "<unlabeled transaction>";
    }
    const { scope: e, isolationScope: n } = nn(this);
    const o = e?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
    if (this._sampled !== true) return;
    const s = Hn(this).filter((t) => t !== this && !Yo(t));
    const r = s.map((t) => qn(t)).filter(Zo);
    const i = this._attributes[$e];
    /* eslint-disable @typescript-eslint/no-dynamic-delete */ delete this
      ._attributes[De];
    r.forEach((t) => {
      delete t.data[De];
    });
    const a = {
      contexts: { trace: jn(this) },
      spans:
        r.length > Ko
          ? r.sort((t, e) => t.start_timestamp - e.start_timestamp).slice(0, Ko)
          : r,
      start_timestamp: this._startTime,
      timestamp: this._endTime,
      transaction: this._name,
      type: "transaction",
      sdkProcessingMetadata: {
        capturedSpanScope: e,
        capturedSpanIsolationScope: n,
        dynamicSamplingContext: mo(this),
      },
      request: o,
      ...(i && { transaction_info: { source: i } }),
    };
    const c = Go(this._events);
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
function Ho(t) {
  return (t && typeof t === "number") || t instanceof Date || Array.isArray(t);
}
function Zo(t) {
  return !!t.start_timestamp && !!t.timestamp && !!t.span_id && !!t.trace_id;
}
function Yo(t) {
  return t instanceof SentrySpan && t.isStandaloneSpan();
}
function Xo(t) {
  const e = Te();
  if (!e) return;
  const n = t[1];
  n && n.length !== 0
    ? e.sendEnvelope(t)
    : e.recordDroppedEvent("before_send", "span");
}
function Qo(t, e, n = () => {}, o = () => {}) {
  let s;
  try {
    s = t();
  } catch (t) {
    e(t);
    n();
    throw t;
  }
  return ts(s, e, n, o);
}
function ts(t, e, n, o) {
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
function es(e, n, o) {
  if (!no(e)) return [false];
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
  const i = kn(r);
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
const ns = "__SENTRY_SUPPRESS_TRACING__";
function os(t, e) {
  const n = fs();
  if (n.startSpan) return n.startSpan(t, e);
  const o = ps(t);
  const { forceTransaction: s, parentSpan: r, scope: i } = t;
  const a = i?.clone();
  return Ee(a, () => {
    const n = hs(r);
    return n(() => {
      const n = ke();
      const i = gs(n, r);
      const a = t.onlyIfParent && !i;
      const c = a
        ? new SentryNonRecordingSpan()
        : ls({
            parentSpan: i,
            spanArguments: o,
            forceTransaction: s,
            scope: n,
          });
      le(n, c);
      return Qo(
        () => e(c),
        () => {
          const { status: t } = qn(c);
          !c.isRecording() ||
            (t && t !== "ok") ||
            c.setStatus({ code: Ke, message: "internal_error" });
        },
        () => {
          c.end();
        },
      );
    });
  });
}
function ss(t, e) {
  const n = fs();
  if (n.startSpanManual) return n.startSpanManual(t, e);
  const o = ps(t);
  const { forceTransaction: s, parentSpan: r, scope: i } = t;
  const a = i?.clone();
  return Ee(a, () => {
    const n = hs(r);
    return n(() => {
      const n = ke();
      const i = gs(n, r);
      const a = t.onlyIfParent && !i;
      const c = a
        ? new SentryNonRecordingSpan()
        : ls({
            parentSpan: i,
            spanArguments: o,
            forceTransaction: s,
            scope: n,
          });
      le(n, c);
      return Qo(
        () => e(c, () => c.end()),
        () => {
          const { status: t } = qn(c);
          !c.isRecording() ||
            (t && t !== "ok") ||
            c.setStatus({ code: Ke, message: "internal_error" });
        },
      );
    });
  });
}
function rs(t) {
  const e = fs();
  if (e.startInactiveSpan) return e.startInactiveSpan(t);
  const n = ps(t);
  const { forceTransaction: o, parentSpan: s } = t;
  const r = t.scope
    ? (e) => Ee(t.scope, e)
    : s !== void 0
      ? (t) => as(s, t)
      : (t) => t();
  return r(() => {
    const e = ke();
    const r = gs(e, s);
    const i = t.onlyIfParent && !r;
    return i
      ? new SentryNonRecordingSpan()
      : ls({ parentSpan: r, spanArguments: n, forceTransaction: o, scope: e });
  });
}
const is = (t, e) => {
  const n = o();
  const s = Se(n);
  if (s.continueTrace) return s.continueTrace(t, e);
  const { sentryTrace: r, baggage: i } = t;
  const a = Te();
  const c = an(i);
  return a && !$n(a, c?.org_id)
    ? us(e)
    : Ee((t) => {
        const n = En(r, i);
        t.setPropagationContext(n);
        le(t, void 0);
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
 */ function as(t, e) {
  const n = fs();
  return n.withActiveSpan
    ? n.withActiveSpan(t, e)
    : Ee((n) => {
        le(n, t || void 0);
        return e(n);
      });
}
function cs(t) {
  const e = fs();
  return e.suppressTracing
    ? e.suppressTracing(t)
    : Ee((e) => {
        e.setSDKProcessingMetadata({ [ns]: true });
        const n = t();
        e.setSDKProcessingMetadata({ [ns]: void 0 });
        return n;
      });
}
function us(e) {
  return Ee((n) => {
    n.setPropagationContext({ traceId: ae(), sampleRand: Tt() });
    t &&
      y.log(
        `Starting a new trace with id ${n.getPropagationContext().traceId}`,
      );
    return as(null, e);
  });
}
function ls({
  parentSpan: t,
  spanArguments: e,
  forceTransaction: n,
  scope: o,
}) {
  if (!no()) {
    const o = new SentryNonRecordingSpan();
    if (n || !t) {
      const t = {
        sampled: "false",
        sample_rate: "0",
        transaction: e.name,
        ...mo(o),
      };
      lo(o, t);
    }
    return o;
  }
  const s = we();
  let r;
  if (t && !n) {
    r = ms(t, o, e);
    Gn(t, r);
  } else if (t) {
    const n = mo(t);
    const { traceId: s, spanId: i } = t.spanContext();
    const a = zn(t);
    r = ds({ traceId: s, parentSpanId: i, ...e }, o, a);
    lo(r, n);
  } else {
    const {
      traceId: t,
      dsc: n,
      parentSpanId: i,
      sampled: a,
    } = { ...s.getPropagationContext(), ...o.getPropagationContext() };
    r = ds({ traceId: t, parentSpanId: i, ...e }, o, a);
    n && lo(r, n);
  }
  Bo(r);
  en(r, o, s);
  return r;
}
function ps(t) {
  const e = t.experimental || {};
  const n = { isStandalone: e.standalone, ...t };
  if (t.startTime) {
    const e = { ...n };
    e.startTimestamp = Fn(t.startTime);
    delete e.startTime;
    return e;
  }
  return n;
}
function fs() {
  const t = o();
  return Se(t);
}
function ds(e, n, o) {
  const s = Te();
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
  const [p, f, d] = n.getScopeData().sdkProcessingMetadata[ns]
    ? [false]
    : es(
        r,
        {
          name: i,
          parentSampled: c,
          attributes: u,
          parentSampleRate: kn(l.dsc?.sample_rate),
        },
        l.sampleRand,
      );
  const m = new SentrySpan({
    ...e,
    attributes: { [$e]: "custom", [Oe]: f !== void 0 && d ? f : void 0, ...u },
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
function ms(t, e, n) {
  const { spanId: o, traceId: s } = t.spanContext();
  const r = !e.getScopeData().sdkProcessingMetadata[ns] && zn(t);
  const i = r
    ? new SentrySpan({ ...n, parentSpanId: o, traceId: s, sampled: r })
    : new SentryNonRecordingSpan({ traceId: s });
  Gn(t, i);
  const a = Te();
  if (a) {
    a.emit("spanStart", i);
    n.endTimestamp && a.emit("spanEnd", i);
  }
  return i;
}
function gs(t, e) {
  if (e) return e;
  if (e === null) return;
  const n = pe(t);
  if (!n) return;
  const o = Te();
  const s = o ? o.getOptions() : {};
  return s.parentSpanIsAlwaysRootSpan ? Zn(n) : n;
}
function hs(t) {
  return t !== void 0 ? (e) => as(t, e) : (t) => t();
}
const _s = { idleTimeout: 1e3, finalTimeout: 3e4, childSpanTimeout: 15e3 };
const ys = "heartbeatFailed";
const bs = "idleTimeout";
const vs = "finalTimeout";
const Ss = "externalFinish";
function ks(e, n = {}) {
  const o = new Map();
  let s = false;
  let r;
  let i = Ss;
  let a = !n.disableAutoFinish;
  const c = [];
  const {
    idleTimeout: u = _s.idleTimeout,
    finalTimeout: l = _s.finalTimeout,
    childSpanTimeout: p = _s.childSpanTimeout,
    beforeSpanEnd: f,
    trimIdleSpanEndTimestamp: d = true,
  } = n;
  const m = Te();
  if (!m || !no()) {
    const t = new SentryNonRecordingSpan();
    const e = { sample_rate: "0", sampled: "false", ...mo(t) };
    lo(t, e);
    return t;
  }
  const g = ke();
  const h = Yn();
  const _ = ws(e);
  _.end = new Proxy(_.end, {
    apply(t, e, n) {
      f && f(_);
      if (e instanceof SentryNonRecordingSpan) return;
      const [o, ...s] = n;
      const r = o || Xt();
      const i = Fn(r);
      const a = Hn(_).filter((t) => t !== _);
      const c = qn(_);
      if (!a.length || !d) {
        x(i);
        return Reflect.apply(t, e, [i, ...s]);
      }
      const u = m.getOptions().ignoreSpans;
      const p = a?.reduce(
        (t, e) => {
          const n = qn(e);
          return n.timestamp
            ? u && so(n, u)
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
        i = bs;
        _.end(t);
      }
    }, u);
  }
  function S(t) {
    r = setTimeout(() => {
      if (!s && a) {
        i = ys;
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
    const e = Xt();
    S(e + p / 1e3);
  }
  /**
   * Remove an activity from usage
   * @param spanId The span id that represents the activity
   */ function w(t) {
    o.has(t) && o.delete(t);
    if (o.size === 0) {
      const t = Xt();
      v(t + u / 1e3);
    }
  }
  function x(e) {
    s = true;
    o.clear();
    c.forEach((t) => t());
    le(g, h);
    const n = qn(_);
    const { start_timestamp: r } = n;
    if (!r) return;
    const a = n.data;
    a[Re] || _.setAttribute(Re, i);
    const p = n.status;
    (p && p !== "unknown") || _.setStatus({ code: Ge });
    y.log(`[Tracing] Idle span "${n.op}" finished`);
    const f = Hn(_).filter((t) => t !== _);
    let d = 0;
    f.forEach((n) => {
      if (n.isRecording()) {
        n.setStatus({ code: Ke, message: "cancelled" });
        n.end(e);
        t &&
          y.log(
            "[Tracing] Cancelling span since span ended early",
            JSON.stringify(n, void 0, 2),
          );
      }
      const o = qn(n);
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
        Kn(_, n);
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
        !!qn(t).timestamp ||
        (t instanceof SentrySpan && t.isStandaloneSpan())
      )
        return;
      const e = Hn(_);
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
      _.setStatus({ code: Ke, message: "deadline_exceeded" });
      i = vs;
      _.end();
    }
  }, l);
  return _;
}
function ws(e) {
  const n = rs(e);
  le(ke(), n);
  t && y.log("[Tracing] Started span is an idle span");
  return n;
}
/* eslint-disable @typescript-eslint/no-explicit-any */ const xs = 0;
const Es = 1;
const As = 2;
/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */ function Ts(t) {
  return new SyncPromise((e) => {
    e(t);
  });
}
/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */ function Is(t) {
  return new SyncPromise((e, n) => {
    n(t);
  });
}
class SyncPromise {
  constructor(t) {
    this._state = xs;
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
    if (this._state === xs) return;
    const t = this._handlers.slice();
    this._handlers = [];
    t.forEach((t) => {
      if (!t[0]) {
        this._state === Es && t[1](this._value);
        this._state === As && t[2](this._value);
        t[0] = true;
      }
    });
  }
  _runExecutor(t) {
    const e = (t, e) => {
      if (this._state === xs)
        if (nt(e)) void e.then(n, o);
        else {
          this._state = t;
          this._value = e;
          this._executeHandlers();
        }
    };
    const n = (t) => {
      e(Es, t);
    };
    const o = (t) => {
      e(As, t);
    };
    try {
      t(n, o);
    } catch (t) {
      o(t);
    }
  }
}
function $s(t, e, n, o = 0) {
  try {
    const s = Os(e, n, t, o);
    return nt(s) ? s : Ts(s);
  } catch (t) {
    return Is(t);
  }
}
function Os(e, n, o, s) {
  const r = o[s];
  if (!e || !r) return e;
  const i = r({ ...e }, n);
  t && i === null && y.log(`Event processor "${r.id || "?"}" dropped event`);
  return nt(i) ? i.then((t) => Os(t, n, o, s + 1)) : Os(i, n, o, s + 1);
}
let Cs;
let Ns;
let js;
let Rs;
function Ps(t) {
  const n = e._sentryDebugIds;
  const o = e._debugIds;
  if (!n && !o) return {};
  const s = n ? Object.keys(n) : [];
  const r = o ? Object.keys(o) : [];
  if (Rs && s.length === Ns && r.length === js) return Rs;
  Ns = s.length;
  js = r.length;
  Rs = {};
  Cs || (Cs = {});
  const i = (e, n) => {
    for (const o of e) {
      const e = n[o];
      const s = Cs?.[o];
      if (s && Rs && e) {
        Rs[s[0]] = e;
        Cs && (Cs[o] = [s[0], e]);
      } else if (e) {
        const n = t(o);
        for (let t = n.length - 1; t >= 0; t--) {
          const s = n[t];
          const r = s?.filename;
          if (r && Rs && Cs) {
            Rs[r] = e;
            Cs[o] = [r, e];
            break;
          }
        }
      }
    }
  };
  n && i(s, n);
  o && i(r, o);
  return Rs;
}
function Ms(t, e) {
  const n = Ps(t);
  if (!n) return [];
  const o = [];
  for (const t of e)
    t && n[t] && o.push({ type: "sourcemap", code_file: t, debug_id: n[t] });
  return o;
}
function Ds(t, e) {
  const {
    fingerprint: n,
    span: o,
    breadcrumbs: s,
    sdkProcessingMetadata: r,
  } = e;
  Us(t, e);
  o && Bs(t, o);
  Ws(t, n);
  Js(t, s);
  zs(t, r);
}
function Fs(t, e) {
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
  Ls(t, "extra", n);
  Ls(t, "tags", o);
  Ls(t, "attributes", s);
  Ls(t, "user", r);
  Ls(t, "contexts", i);
  t.sdkProcessingMetadata = ie(t.sdkProcessingMetadata, c, 2);
  a && (t.level = a);
  m && (t.transactionName = m);
  g && (t.span = g);
  u.length && (t.breadcrumbs = [...t.breadcrumbs, ...u]);
  l.length && (t.fingerprint = [...t.fingerprint, ...l]);
  p.length && (t.eventProcessors = [...t.eventProcessors, ...p]);
  f.length && (t.attachments = [...t.attachments, ...f]);
  t.propagationContext = { ...t.propagationContext, ...d };
}
function Ls(t, e, n) {
  t[e] = ie(t[e], n, 1);
}
/**
 * Get the scope data for the current scope after merging with the
 * global scope and isolation scope.
 *
 * @param currentScope - The current scope.
 * @returns The scope data.
 */ function qs(t, e) {
  const n = xe().getScopeData();
  t && Fs(n, t.getScopeData());
  e && Fs(n, e.getScopeData());
  return n;
}
function Us(t, e) {
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
function Js(t, e) {
  const n = [...(t.breadcrumbs || []), ...e];
  t.breadcrumbs = n.length ? n : void 0;
}
function zs(t, e) {
  t.sdkProcessingMetadata = { ...t.sdkProcessingMetadata, ...e };
}
function Bs(t, e) {
  t.contexts = { trace: Rn(e), ...t.contexts };
  t.sdkProcessingMetadata = {
    dynamicSamplingContext: mo(e),
    ...t.sdkProcessingMetadata,
  };
  const n = Zn(e);
  const o = qn(n).description;
  o && !t.transaction && t.type === "transaction" && (t.transaction = o);
}
function Ws(t, e) {
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
 */ function Vs(t, e, n, o, s, r) {
  const { normalizeDepth: i = 3, normalizeMaxBreadth: a = 1e3 } = t;
  const c = {
    ...e,
    event_id: e.event_id || n.event_id || Dt(),
    timestamp: e.timestamp || Ht(),
  };
  const u = n.integrations || t.integrations.map((t) => t.name);
  Gs(c, t);
  Zs(c, u);
  s && s.emit("applyFrameMetadata", e);
  e.type === void 0 && Ks(c, t.stackParser);
  const l = Xs(o, n.captureContext);
  n.mechanism && Ut(c, n.mechanism);
  const p = s ? s.getEventProcessors() : [];
  const f = qs(r, l);
  const d = [...(n.attachments || []), ...f.attachments];
  d.length && (n.attachments = d);
  Ds(c, f);
  const m = [...p, ...f.eventProcessors];
  const g = $s(m, c, n);
  return g.then((t) => {
    t && Hs(t);
    return typeof i === "number" && i > 0 ? Ys(t, i, a) : t;
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
 */ function Gs(t, e) {
  const { environment: n, release: o, dist: s, maxValueLength: r } = e;
  t.environment = t.environment || n || ao;
  !t.release && o && (t.release = o);
  !t.dist && s && (t.dist = s);
  const i = t.request;
  i?.url && r && (i.url = $t(i.url, r));
  r &&
    t.exception?.values?.forEach((t) => {
      t.value && (t.value = $t(t.value, r));
    });
}
function Ks(t, e) {
  const n = Ps(e);
  t.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((t) => {
      t.filename && (t.debug_id = n[t.filename]);
    });
  });
}
function Hs(t) {
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
 */ function Zs(t, e) {
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
 */ function Ys(t, e, n) {
  if (!t) return null;
  const o = {
    ...t,
    ...(t.breadcrumbs && {
      breadcrumbs: t.breadcrumbs.map((t) => ({
        ...t,
        ...(t.data && { data: ho(t.data, e, n) }),
      })),
    }),
    ...(t.user && { user: ho(t.user, e, n) }),
    ...(t.contexts && { contexts: ho(t.contexts, e, n) }),
    ...(t.extra && { extra: ho(t.extra, e, n) }),
  };
  if (t.contexts?.trace && o.contexts) {
    o.contexts.trace = t.contexts.trace;
    t.contexts.trace.data &&
      (o.contexts.trace.data = ho(t.contexts.trace.data, e, n));
  }
  t.spans &&
    (o.spans = t.spans.map((t) => ({
      ...t,
      ...(t.data && { data: ho(t.data, e, n) }),
    })));
  t.contexts?.flags &&
    o.contexts &&
    (o.contexts.flags = ho(t.contexts.flags, 3, n));
  return o;
}
function Xs(t, e) {
  if (!e) return t;
  const n = t ? t.clone() : new Scope();
  n.update(e);
  return n;
}
function Qs(t) {
  if (t) return tr(t) || nr(t) ? { captureContext: t } : t;
}
function tr(t) {
  return t instanceof Scope || typeof t === "function";
}
const er = [
  "user",
  "level",
  "extra",
  "contexts",
  "tags",
  "fingerprint",
  "propagationContext",
];
function nr(t) {
  return Object.keys(t).some((t) => er.includes(t));
}
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception The exception to capture.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured Sentry event.
 */ function or(t, e) {
  return ke().captureException(t, Qs(e));
}
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param captureContext Define the level of the message or pass in additional data to attach to the message.
 * @returns the id of the captured message.
 */ function sr(t, e) {
  const n = typeof e === "string" ? e : void 0;
  const o = typeof e !== "string" ? { captureContext: e } : void 0;
  return ke().captureMessage(t, n, o);
}
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured event.
 */ function rr(t, e) {
  return ke().captureEvent(t, e);
}
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */ function ir(t, e) {
  we().setContext(t, e);
}
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */ function ar(t) {
  we().setExtras(t);
}
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */ function cr(t, e) {
  we().setExtra(t, e);
}
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */ function ur(t) {
  we().setTags(t);
}
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */ function lr(t, e) {
  we().setTag(t, e);
}
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */ function pr(t) {
  we().setUser(t);
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
 */ function fr() {
  return we().lastEventId();
}
/**
 * Create a cron monitor check in and send it to Sentry.
 *
 * @param checkIn An object that describes a check in.
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function dr(e, n) {
  const o = ke();
  const s = Te();
  if (s) {
    if (s.captureCheckIn) return s.captureCheckIn(e, n, o);
    t &&
      y.warn(
        "Cannot capture check-in. Client does not support sending check-ins.",
      );
  } else t && y.warn("Cannot capture check-in. No client defined.");
  return Dt();
}
/**
 * Wraps a callback with a cron monitor check in. The check in will be sent to Sentry when the callback finishes.
 *
 * @param monitorSlug The distinct slug of the monitor.
 * @param callback Callback to be monitored
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function mr(t, e, n) {
  function o() {
    const o = dr({ monitorSlug: t, status: "in_progress" }, n);
    const s = Xt();
    function r(e) {
      dr({ monitorSlug: t, status: e, checkInId: o, duration: Xt() - s });
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
  return Ae(() => (n?.isolateTrace ? us(o) : o()));
}
/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */ async function gr(e) {
  const n = Te();
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
 */ async function hr(e) {
  const n = Te();
  if (n) return n.close(e);
  t && y.warn("Cannot flush events and disable SDK. No client defined.");
  return Promise.resolve(false);
}
function _r() {
  return !!Te();
}
function yr() {
  const t = Te();
  return t?.getOptions().enabled !== false && !!t?.getTransport();
}
function br(t) {
  we().addEventProcessor(t);
}
/**
 * Start a session on the current isolation scope.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns the new active session
 */ function vr(t) {
  const n = we();
  const o = ke();
  const { userAgent: s } = e.navigator || {};
  const r = ne({
    user: o.getUser() || n.getUser(),
    ...(s && { userAgent: s }),
    ...t,
  });
  const i = n.getSession();
  i?.status === "ok" && oe(i, { status: "exited" });
  Sr();
  n.setSession(r);
  return r;
}
function Sr() {
  const t = we();
  const e = ke();
  const n = e.getSession() || t.getSession();
  n && se(n);
  kr();
  t.setSession();
}
function kr() {
  const t = we();
  const e = Te();
  const n = t.getSession();
  n && e && e.captureSession(n);
}
/**
 * Sends the current session on the scope to Sentry
 *
 * @param end If set the session will be marked as exited and removed from the scope.
 *            Defaults to `false`.
 */ function wr(t = false) {
  t ? Sr() : kr();
}
const xr = "7";
function Er(t) {
  const e = t.protocol ? `${t.protocol}:` : "";
  const n = t.port ? `:${t.port}` : "";
  return `${e}//${t.host}${n}${t.path ? `/${t.path}` : ""}/api/`;
}
function Ar(t) {
  return `${Er(t)}${t.projectId}/envelope/`;
}
function Tr(t, e) {
  const n = { sentry_version: xr };
  t.publicKey && (n.sentry_key = t.publicKey);
  e && (n.sentry_client = `${e.name}/${e.version}`);
  return new URLSearchParams(n).toString();
}
function Ir(t, e, n) {
  return e || `${Ar(t)}?${Tr(t, n)}`;
}
function $r(t, e) {
  const n = Sn(t);
  if (!n) return "";
  const o = `${Er(n)}embed/error-page/`;
  let s = `dsn=${gn(n)}`;
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
const Or = [];
function Cr(t) {
  const e = {};
  t.forEach((t) => {
    const { name: n } = t;
    const o = e[n];
    (o && !o.isDefaultInstance && t.isDefaultInstance) || (e[n] = t);
  });
  return Object.values(e);
}
function Nr(t) {
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
  return Cr(o);
}
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */ function jr(t, e) {
  const n = {};
  e.forEach((e) => {
    e && Pr(t, e, n);
  });
  return n;
}
function Rr(t, e) {
  for (const n of e) n?.afterAllSetup && n.afterAllSetup(t);
}
function Pr(e, n, o) {
  if (o[n.name])
    t &&
      y.log(`Integration skipped because it was already installed: ${n.name}`);
  else {
    o[n.name] = n;
    if (!Or.includes(n.name) && typeof n.setupOnce === "function") {
      n.setupOnce();
      Or.push(n.name);
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
function Mr(e) {
  const n = Te();
  n
    ? n.addIntegration(e)
    : t &&
      y.warn(
        `Cannot add integration "${e.name}" because no SDK Client is available.`,
      );
}
function Dr(t) {
  return t;
}
function Fr(t) {
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
 */ function Lr(t, e) {
  const { value: n, unit: o } = Fr(t) ? t : { value: t, unit: void 0 };
  const s = Ur(n);
  const r = o && typeof o === "string" ? { unit: o } : {};
  if (s) return { ...s, ...r };
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
 */ function qr(t, e = false) {
  const n = {};
  for (const [o, s] of Object.entries(t ?? {})) {
    const t = Lr(s, e);
    t && (n[o] = t);
  }
  return n;
}
function Ur(t) {
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
function Jr(t, e) {
  return e
    ? Ee(e, () => {
        const n = Yn();
        const o = n ? Rn(n) : Ie(e);
        const s = n ? mo(n) : fo(t, e);
        return [s, o];
      })
    : [void 0, void 0];
}
const zr = { trace: 1, debug: 5, info: 9, warn: 13, error: 17, fatal: 21 };
/**
 * Creates a log container envelope item for a list of logs.
 *
 * @param items - The logs to include in the envelope.
 * @returns The created log container envelope item.
 */ function Br(t) {
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
 */ function Wr(t, e, n, o) {
  const s = {};
  e?.sdk && (s.sdk = { name: e.sdk.name, version: e.sdk.version });
  !n || !o || (s.dsn = gn(o));
  return Eo(s, [Br(t)]);
}
const Vr = 100;
/**
 * Sets a log attribute if the value exists and the attribute key is not already present.
 *
 * @param logAttributes - The log attributes object to modify.
 * @param key - The attribute key to set.
 * @param value - The value to set (only sets if truthy and key not present).
 * @param setEvenIfPresent - Whether to set the attribute if it is present. Defaults to true.
 */ function Gr(t, e, n, o = true) {
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
 */ function Kr(t, e) {
  const n = Xr();
  const o = Yr(t);
  if (o === void 0) n.set(t, [e]);
  else if (o.length >= Vr) {
    Zr(t, o);
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
 */ function Hr(e, n = ke(), o = Kr) {
  const s = n?.getClient() ?? Te();
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
  const [, l] = Jr(s, n);
  const p = { ...e.attributes };
  const {
    user: { id: f, email: d, username: m },
    attributes: g = {},
  } = qs(we(), n);
  Gr(p, "user.id", f, false);
  Gr(p, "user.email", d, false);
  Gr(p, "user.name", m, false);
  Gr(p, "sentry.release", r);
  Gr(p, "sentry.environment", i);
  const { name: h, version: _ } = s.getSdkMetadata()?.sdk ?? {};
  Gr(p, "sentry.sdk.name", h);
  Gr(p, "sentry.sdk.version", _);
  const b = s.getIntegrationByName("Replay");
  const v = b?.getReplayId(true);
  Gr(p, "sentry.replay_id", v);
  v &&
    b?.getRecordingMode() === "buffer" &&
    Gr(p, "sentry._internal.replay_is_buffering", true);
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
  const k = pe(n);
  Gr(p, "sentry.trace.parent_span_id", k?.spanContext().spanId);
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
    timestamp: Xt(),
    level: E,
    body: A,
    trace_id: l?.trace_id,
    severity_number: I ?? zr[E],
    attributes: { ...qr(g), ...qr(T, true) },
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
 */ function Zr(t, e) {
  const n = e ?? Yr(t) ?? [];
  if (n.length === 0) return;
  const o = t.getOptions();
  const s = Wr(n, o._metadata, o.tunnel, t.getDsn());
  Xr().set(t, []);
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
 */ function Yr(t) {
  return Xr().get(t);
}
function Xr() {
  return r("clientToLogBufferMap", () => new WeakMap());
}
/**
 * Creates a metric container envelope item for a list of metrics.
 *
 * @param items - The metrics to include in the envelope.
 * @returns The created metric container envelope item.
 */ function Qr(t) {
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
 */ function ti(t, e, n, o) {
  const s = {};
  e?.sdk && (s.sdk = { name: e.sdk.name, version: e.sdk.version });
  !n || !o || (s.dsn = gn(o));
  return Eo(s, [Qr(t)]);
}
const ei = 1e3;
/**
 * Sets a metric attribute if the value exists and the attribute key is not already present.
 *
 * @param metricAttributes - The metric attributes object to modify.
 * @param key - The attribute key to set.
 * @param value - The value to set (only sets if truthy and key not present).
 * @param setEvenIfPresent - Whether to set the attribute if it is present. Defaults to true.
 */ function ni(t, e, n, o = true) {
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
 */ function oi(t, e) {
  const n = ui();
  const o = ci(t);
  if (o === void 0) n.set(t, [e]);
  else if (o.length >= ei) {
    ai(t, o);
    n.set(t, [e]);
  } else n.set(t, [...o, e]);
}
function si(t, e, n) {
  const { release: o, environment: s } = e.getOptions();
  const r = { ...t.attributes };
  ni(r, "user.id", n.id, false);
  ni(r, "user.email", n.email, false);
  ni(r, "user.name", n.username, false);
  ni(r, "sentry.release", o);
  ni(r, "sentry.environment", s);
  const { name: i, version: a } = e.getSdkMetadata()?.sdk ?? {};
  ni(r, "sentry.sdk.name", i);
  ni(r, "sentry.sdk.version", a);
  const c = e.getIntegrationByName("Replay");
  const u = c?.getReplayId(true);
  ni(r, "sentry.replay_id", u);
  u &&
    c?.getRecordingMode() === "buffer" &&
    ni(r, "sentry._internal.replay_is_buffering", true);
  return { ...t, attributes: r };
}
function ri(t, e, n, o) {
  const [, s] = Jr(e, n);
  const r = pe(n);
  const i = r ? r.spanContext().traceId : s?.trace_id;
  const a = r ? r.spanContext().spanId : void 0;
  return {
    timestamp: Xt(),
    trace_id: i ?? "",
    span_id: a,
    name: t.name,
    type: t.type,
    unit: t.unit,
    value: t.value,
    attributes: { ...qr(o), ...qr(t.attributes, "skip-undefined") },
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
 */ function ii(e, n) {
  const o = n?.scope ?? ke();
  const s = n?.captureSerializedMetric ?? oi;
  const r = o?.getClient() ?? Te();
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
  const { user: l, attributes: p } = qs(we(), o);
  const f = si(e, r, l);
  r.emit("processMetric", f);
  const d = c || i?.beforeSendMetric;
  const m = d ? d(f) : f;
  if (!m) {
    t && y.log("`beforeSendMetric` returned `null`, will not send metric.");
    return;
  }
  const g = ri(m, r, o, p);
  t && y.log("[Metric]", g);
  s(r, g);
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
 */ function ai(t, e) {
  const n = e ?? ci(t) ?? [];
  if (n.length === 0) return;
  const o = t.getOptions();
  const s = ti(n, o._metadata, o.tunnel, t.getDsn());
  ui().set(t, []);
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
 */ function ci(t) {
  return ui().get(t);
}
function ui() {
  return r("clientToMetricBufferMap", () => new WeakMap());
}
const li = Symbol.for("SentryBufferFullError");
/**
 * Creates an new PromiseBuffer object with the specified limit
 * @param limit max number of promises that can be stored in the buffer
 */ function pi(t = 100) {
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
    if (!n()) return Is(li);
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
    if (!e.size) return Ts(true);
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
const fi = 6e4;
/**
 * Extracts Retry-After value from the request header or returns default value
 * @param header string representation of 'Retry-After' header
 * @param now current unix timestamp
 *
 */ function di(t, e = It()) {
  const n = parseInt(`${t}`, 10);
  if (!isNaN(n)) return n * 1e3;
  const o = Date.parse(`${t}`);
  return isNaN(o) ? fi : o - e;
}
function mi(t, e) {
  return t[e] || t.all || 0;
}
function gi(t, e, n = It()) {
  return mi(t, e) > n;
}
function hi(t, { statusCode: e, headers: n }, o = It()) {
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
  else i ? (s.all = o + di(i, o)) : e === 429 && (s.all = o + 6e4);
  return s;
}
const _i = 64;
/**
 * Creates an instance of a Sentry `Transport`
 *
 * @param options
 * @param makeRequest
 */ function yi(e, n, o = pi(e.bufferSize || _i)) {
  let s = {};
  const r = (t) => o.drain(t);
  function i(r) {
    const i = [];
    To(r, (t, n) => {
      const o = Do(n);
      gi(s, o) ? e.recordDroppedEvent("ratelimit_backoff", o) : i.push(t);
    });
    if (i.length === 0) return Promise.resolve({});
    const a = Eo(r[0], i);
    const c = (n) => {
      Io(a, ["client_report"])
        ? t &&
          y.warn(
            `Dropping client report. Will not send outcomes (reason: ${n}).`,
          )
        : To(a, (t, o) => {
            e.recordDroppedEvent(n, Do(o));
          });
    };
    const u = () =>
      n({ body: Co(a) }).then(
        (e) => {
          e.statusCode !== void 0 &&
            (e.statusCode < 200 || e.statusCode >= 300) &&
            t &&
            y.warn(
              `Sentry responded with status code ${e.statusCode} to sent event.`,
            );
          s = hi(s, e);
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
        if (e === li) {
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
 */ function bi(t, e, n) {
  const o = [
    { type: "client_report" },
    { timestamp: n || Ht(), discarded_events: t },
  ];
  return Eo(e ? { dsn: e } : {}, [o]);
}
function vi(t) {
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
function Si(t) {
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
    profile_id: i?.[Fe],
    exclusive_time: i?.[Le],
    measurements: t.measurements,
    is_segment: true,
  };
}
function ki(t) {
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
          ...(t.profile_id && { [Fe]: t.profile_id }),
          ...(t.exclusive_time && { [Le]: t.exclusive_time }),
        },
      },
    },
    measurements: t.measurements,
  };
}
const wi = "Not capturing exception because it's already been captured.";
const xi = "Discarded session because of missing or non-string release";
const Ei = Symbol.for("SentryInternalError");
const Ai = Symbol.for("SentryDoNotSendEventError");
const Ti = 5e3;
function Ii(t) {
  return { message: t, [Ei]: true };
}
function $i(t) {
  return { message: t, [Ai]: true };
}
function Oi(t) {
  return !!t && typeof t === "object" && Ei in t;
}
function Ci(t) {
  return !!t && typeof t === "object" && Ai in t;
}
function Ni(t, e, n, o, s) {
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
      }, Ti);
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
    this._promiseBuffer = pi(e.transportOptions?.bufferSize ?? _i);
    e.dsn
      ? (this._dsn = Sn(e.dsn))
      : t && y.warn("No DSN provided, client will not send events.");
    if (this._dsn) {
      const t = Ir(this._dsn, e.tunnel, e._metadata ? e._metadata.sdk : void 0);
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
      Ni(this, "afterCaptureLog", "flushLogs", Li, Zr);
    const n =
      this._options.enableMetrics ??
      this._options._experiments?.enableMetrics ??
      true;
    n && Ni(this, "afterCaptureMetric", "flushMetrics", Fi, ai);
  }
  captureException(e, n, o) {
    const s = Dt();
    if (Vt(e)) {
      t && y.log(wi);
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
    const s = { event_id: Dt(), ...n };
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
    const s = Dt();
    if (n?.originalException && Vt(n.originalException)) {
      t && y.log(wi);
      return s;
    }
    const r = { event_id: s, ...n };
    const i = e.sdkProcessingMetadata || {};
    const a = i.capturedSpanScope;
    const c = i.capturedSpanIsolationScope;
    const u = ji(e.type);
    this._process(() => this._captureEvent(e, r, a || o, c), u);
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
    Pr(this, t, this._integrations);
    e || Rr(this, [t]);
  }
  sendEvent(t, e = {}) {
    this.emit("beforeSendEvent", t, e);
    let n = Jo(t, this._dsn, this._options._metadata, this._options.tunnel);
    for (const t of e.attachments || []) n = Ao(n, Po(t));
    this.sendEnvelope(n).then((e) => this.emit("afterSendEvent", t, e));
  }
  sendSession(e) {
    const { release: n, environment: o = ao } = this._options;
    if ("aggregates" in e) {
      const s = e.attrs || {};
      if (!s.release && !n) {
        t && y.warn(xi);
        return;
      }
      s.release = s.release || n;
      s.environment = s.environment || o;
      e.attrs = s;
    } else {
      if (!e.release && !n) {
        t && y.warn(xi);
        return;
      }
      e.release = e.release || n;
      e.environment = e.environment || o;
    }
    this.emit("beforeSendSession", e);
    const s = Uo(e, this._dsn, this._options._metadata, this._options.tunnel);
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
    this._integrations = jr(this, t);
    Rr(this, t);
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
      oe(t, {
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
    return Vs(s, t, e, n, this, o).then((t) => {
      if (t === null) return t;
      this.emit("postprocessEvent", t, e);
      t.contexts = { trace: Ie(n), ...t.contexts };
      const o = fo(this, n);
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
   */ _captureEvent(e, n = {}, o = ke(), s = we()) {
    t && Mi(e) && y.log(`Captured error event \`${vi(e)[0] || "<unknown>"}\``);
    return this._processEvent(e, n, o, s).then(
      (t) => t.event_id,
      (e) => {
        t && (Ci(e) ? y.log(e.message) : Oi(e) ? y.warn(e.message) : y.warn(e));
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
    const i = Di(t);
    const a = Mi(t);
    const c = t.type || "error";
    const u = `before send for type \`${c}\``;
    const l = typeof r === "undefined" ? void 0 : kn(r);
    if (a && typeof l === "number" && Tt() > l) {
      this.recordDroppedEvent("sample_rate", "error");
      return Is(
        $i(
          `Discarding event because it's not included in the random sample (sampling rate = ${r})`,
        ),
      );
    }
    const p = ji(t.type);
    return this._prepareEvent(t, e, n, o)
      .then((t) => {
        if (t === null) {
          this.recordDroppedEvent("event_processor", p);
          throw $i("An event processor returned `null`, will not send event.");
        }
        const n = e.data && e.data.__sentry__ === true;
        if (n) return t;
        const o = Pi(this, s, t, e);
        return Ri(o, u);
      })
      .then((s) => {
        if (s === null) {
          this.recordDroppedEvent("before_send", p);
          if (i) {
            const e = t.spans || [];
            const n = 1 + e.length;
            this.recordDroppedEvent("before_send", "span", n);
          }
          throw $i(`${u} returned \`null\`, will not send event.`);
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
        if (Ci(t) || Oi(t)) throw t;
        this.captureException(t, {
          mechanism: { handled: false, type: "internal" },
          data: { __sentry__: true },
          originalException: t,
        });
        throw Ii(
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
        t === li && this.recordDroppedEvent("queue_overflow", e);
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
    const n = bi(e, this._options.tunnel && gn(this._dsn));
    this.sendEnvelope(n);
  }
}
function ji(t) {
  return t === "replay_event" ? "replay" : t || "error";
}
function Ri(t, e) {
  const n = `${e} must return \`null\` or a valid event.`;
  if (nt(t))
    return t.then(
      (t) => {
        if (!X(t) && t !== null) throw Ii(n);
        return t;
      },
      (t) => {
        throw Ii(`${e} rejected with ${t}`);
      },
    );
  if (!X(t) && t !== null) throw Ii(n);
  return t;
}
function Pi(t, e, n, o) {
  const {
    beforeSend: s,
    beforeSendTransaction: r,
    beforeSendSpan: i,
    ignoreSpans: a,
  } = e;
  let c = n;
  if (Mi(c) && s) return s(c, o);
  if (Di(c)) {
    if (i || a) {
      const e = Si(c);
      if (a?.length && so(e, a)) return null;
      if (i) {
        const t = i(e);
        t ? (c = ie(n, ki(t))) : Xn();
      }
      if (c.spans) {
        const e = [];
        const n = c.spans;
        for (const t of n)
          if (a?.length && so(t, a)) ro(n, t);
          else if (i) {
            const n = i(t);
            if (n) e.push(n);
            else {
              Xn();
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
function Mi(t) {
  return t.type === void 0;
}
function Di(t) {
  return t.type === "transaction";
}
/**
 * Estimate the size of a metric in bytes.
 *
 * @param metric - The metric to estimate the size of.
 * @returns The estimated size of the metric in bytes.
 */ function Fi(t) {
  let e = 0;
  t.name && (e += t.name.length * 2);
  e += 8;
  return e + qi(t.attributes);
}
/**
 * Estimate the size of a log in bytes.
 *
 * @param log - The log to estimate the size of.
 * @returns The estimated size of the log in bytes.
 */ function Li(t) {
  let e = 0;
  t.message && (e += t.message.length * 2);
  return e + qi(t.attributes);
}
/**
 * Estimate the size of attributes in bytes.
 *
 * @param attributes - The attributes object to estimate the size of.
 * @returns The estimated size of the attributes in bytes.
 */ function qi(t) {
  if (!t) return 0;
  let e = 0;
  Object.values(t).forEach((t) => {
    Array.isArray(t)
      ? (e += t.length * Ui(t[0]))
      : Y(t)
        ? (e += Ui(t))
        : (e += 100);
  });
  return e;
}
function Ui(t) {
  return typeof t === "string"
    ? t.length * 2
    : typeof t === "number"
      ? 8
      : typeof t === "boolean"
        ? 4
        : 0;
}
function Ji(t, e, n, o, s) {
  const r = { sent_at: new Date().toISOString() };
  n?.sdk && (r.sdk = { name: n.sdk.name, version: n.sdk.version });
  !o || !s || (r.dsn = gn(s));
  e && (r.trace = e);
  const i = zi(t);
  return Eo(r, [i]);
}
function zi(t) {
  const e = { type: "check_in" };
  return [e, t];
}
function Bi(t) {
  const e = t._metadata?.sdk;
  const n = e?.name && e?.version ? `${e?.name}/${e?.version}` : void 0;
  t.transportOptions = {
    ...t.transportOptions,
    headers: { ...(n && { "user-agent": n }), ...t.transportOptions?.headers },
  };
}
function Wi(t, e) {
  return t(e.stack || "", 1);
}
function Vi(t) {
  return (
    B(t) &&
    "__sentry_fetch_url_host__" in t &&
    typeof t.__sentry_fetch_url_host__ === "string"
  );
}
function Gi(t) {
  return Vi(t) ? `${t.message} (${t.__sentry_fetch_url_host__})` : t.message;
}
function Ki(t, e) {
  const n = { type: e.name || e.constructor.name, value: Gi(e) };
  const o = Wi(t, e);
  o.length && (n.stacktrace = { frames: o });
  return n;
}
function Hi(t) {
  for (const e in t)
    if (Object.prototype.hasOwnProperty.call(t, e)) {
      const n = t[e];
      if (n instanceof Error) return n;
    }
}
function Zi(t) {
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
  const n = Yi(t);
  return `${n && n !== "Object" ? `'${n}'` : "Object"} captured as exception with keys: ${e}`;
}
function Yi(t) {
  try {
    const e = Object.getPrototypeOf(t);
    return e ? e.constructor.name : void 0;
  } catch {}
}
function Xi(t, e, n, o) {
  if (B(n)) return [n, void 0];
  e.synthetic = true;
  if (X(n)) {
    const e = t?.getOptions().normalizeDepth;
    const s = { __serialized__: _o(n, e) };
    const r = Hi(n);
    if (r) return [r, s];
    const i = Zi(n);
    const a = o?.syntheticException || new Error(i);
    a.message = i;
    return [a, s];
  }
  const s = o?.syntheticException || new Error(n);
  s.message = `${n}`;
  return [s, void 0];
}
function Qi(t, e, n, o) {
  const s = o?.data && o.data.mechanism;
  const r = s || { handled: true, type: "generic" };
  const [i, a] = Xi(t, r, n, o);
  const c = { exception: { values: [Ki(e, i)] } };
  a && (c.extra = a);
  qt(c, void 0, void 0);
  Ut(c, r);
  return { ...c, event_id: o?.event_id };
}
function ta(t, e, n = "info", o, s) {
  const r = { event_id: o?.event_id, level: n };
  if (s && o?.syntheticException) {
    const n = Wi(t, o.syntheticException);
    if (n.length) {
      r.exception = { values: [{ value: e, stacktrace: { frames: n } }] };
      Ut(r, { synthetic: true });
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
    eo();
    Bi(t);
    super(t);
    this._setUpMetricsProcessing();
  }
  eventFromException(t, e) {
    const n = Qi(this, this._options.stackParser, t, e);
    n.level = "error";
    return Ts(n);
  }
  eventFromMessage(t, e = "info", n) {
    return Ts(
      ta(this._options.stackParser, t, e, n, this._options.attachStacktrace),
    );
  }
  captureException(t, e, n) {
    ea(e);
    return super.captureException(t, e, n);
  }
  captureEvent(t, e, n) {
    const o = !t.type && t.exception?.values && t.exception.values.length > 0;
    o && ea(e);
    return super.captureEvent(t, e, n);
  }
  /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */ captureCheckIn(e, n, o) {
    const s = "checkInId" in e && e.checkInId ? e.checkInId : Dt();
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
    const [l, p] = Jr(this, o);
    p && (u.contexts = { trace: p });
    const f = Ji(u, l, this.getSdkMetadata(), c, this.getDsn());
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
function ea(t) {
  const e = we().getScopeData().sdkProcessingMetadata.requestSession;
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
 */ function na(e, n) {
  n.debug === true &&
    (t
      ? y.enable()
      : u(() => {
          console.warn(
            "[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.",
          );
        }));
  const o = ke();
  o.update(n.initialScope);
  const s = new e(n);
  oa(s);
  s.init();
  return s;
}
function oa(t) {
  ke().setClient(t);
}
const sa = 100;
const ra = 5e3;
const ia = 36e5;
/**
 * Wraps a transport and stores and retries events when they fail to send.
 *
 * @param createTransport The transport to wrap.
 */ function aa(e) {
  function n(...e) {
    t && y.log("[Offline]:", ...e);
  }
  return (t) => {
    const o = e(t);
    if (!t.createStore)
      throw new Error("No `createStore` function was provided");
    const s = t.createStore(t);
    let r = ra;
    let i;
    function a(e, n, o) {
      return (
        !Io(e, ["client_report"]) && (!t.shouldStore || t.shouldStore(e, n, o))
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
        r = Math.min(r * 2, ia);
      }
    }
    async function l(e, i = false) {
      if (!i && Io(e, ["replay_event", "replay_recording"])) {
        await s.push(e);
        c(sa);
        return {};
      }
      try {
        if (t.shouldSend && (await t.shouldSend(e)) === false)
          throw new Error(
            "Envelope not sent because `shouldSend` callback returned false",
          );
        const n = await o.send(e);
        let s = sa;
        if (n)
          if (n.headers?.["retry-after"]) s = di(n.headers["retry-after"]);
          else if (n.headers?.["x-sentry-rate-limits"]) s = 6e4;
          else if ((n.statusCode || 0) >= 400) return n;
        c(s);
        r = ra;
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
          r = ra;
          c(sa);
        }
        return o.flush(t);
      },
    };
  };
}
const ca = "MULTIPLEXED_TRANSPORT_EXTRA_KEY";
function ua(t, e) {
  let n;
  To(t, (t, o) => {
    e.includes(o) && (n = Array.isArray(t) ? t[1] : void 0);
    return !!n;
  });
  return n;
}
function la(t, e) {
  return (n) => {
    const o = t(n);
    return {
      ...o,
      send: async (t) => {
        const n = ua(t, ["event", "transaction", "profile", "replay_event"]);
        n && (n.release = e);
        return o.send(t);
      },
    };
  };
}
function pa(t, e) {
  return Eo(e ? { ...t[0], dsn: e } : t[0], t[1]);
}
function fa(t, e) {
  return (n) => {
    const o = t(n);
    const s = new Map();
    const r =
      e ||
      ((t) => {
        const e = t.getEvent();
        return e?.extra?.[ca] && Array.isArray(e.extra[ca]) ? e.extra[ca] : [];
      });
    function i(e, o) {
      const r = o ? `${e}:${o}` : e;
      let i = s.get(r);
      if (!i) {
        const a = hn(e);
        if (!a) return;
        const c = Ir(a, n.tunnel);
        i = o ? la(t, o)({ ...n, url: c }) : t({ ...n, url: c });
        s.set(r, i);
      }
      return [e, i];
    }
    async function a(t) {
      function e(e) {
        const n = e?.length ? e : ["event"];
        return ua(t, n);
      }
      const n = r({ envelope: t, getEvent: e })
        .map((t) =>
          typeof t === "string" ? i(t, void 0) : i(t.dsn, t.release),
        )
        .filter((t) => !!t);
      const s = n.length ? n : [["", o]];
      const a = await Promise.all(s.map(([e, n]) => n.send(pa(t, e))));
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
const da = new Set();
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
 */ function ma(e) {
  e.forEach((e) => {
    da.add(e);
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
 */ function ga(t) {
  return da.has(t);
}
function ha() {
  da.clear();
  t && y.log("Cleared AI provider skip registrations");
}
const _a = "thismessage:/";
/**
 * Checks if the URL object is relative
 *
 * @param url - The URL object to check
 * @returns True if the URL object is relative, false otherwise
 */ function ya(t) {
  return "isRelative" in t;
}
/**
 * Parses string to a URL object
 *
 * @param url - The URL to parse
 * @returns The parsed URL object or undefined if the URL is invalid
 */ function ba(t, e) {
  const n = t.indexOf("://") <= 0 && t.indexOf("//") !== 0;
  const o = e ?? (n ? _a : void 0);
  try {
    if ("canParse" in URL && !URL.canParse(t, o)) return;
    const e = new URL(t, o);
    return n
      ? { isRelative: n, pathname: e.pathname, search: e.search, hash: e.hash }
      : e;
  } catch {}
}
function va(t) {
  if (ya(t)) return t.pathname;
  const e = new URL(t);
  e.search = "";
  e.hash = "";
  ["80", "443"].includes(e.port) && (e.port = "");
  e.password && (e.password = "%filtered%");
  e.username && (e.username = "%filtered%");
  return e.toString();
}
function Sa(t, e, n, o) {
  const s = n?.method?.toUpperCase() ?? "GET";
  const r = o || (t ? (e === "client" ? va(t) : t.pathname) : "/");
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
 */ function ka(t, e, n, o, s) {
  const r = { [je]: n, [$e]: "url" };
  if (s) {
    r[e === "server" ? "http.route" : "url.template"] = s;
    r[$e] = "route";
  }
  o?.method && (r[ze] = o.method.toUpperCase());
  if (t) {
    t.search && (r["url.query"] = t.search);
    t.hash && (r["url.fragment"] = t.hash);
    if (t.pathname) {
      r["url.path"] = t.pathname;
      t.pathname === "/" && (r[$e] = "route");
    }
    if (!ya(t)) {
      r[Be] = t.href;
      t.port && (r["url.port"] = t.port);
      t.protocol && (r["url.scheme"] = t.protocol);
      t.hostname &&
        (r[e === "server" ? "server.address" : "url.domain"] = t.hostname);
    }
  }
  return [Sa(t, e, o, s), r];
}
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */ function wa(t) {
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
 */ function xa(t) {
  return t.split(/[?#]/, 1)[0];
}
function Ea(t) {
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
 */ function Aa(t, e) {
  const n = e?.getDsn();
  const o = e?.getOptions().tunnel;
  return Ia(t, n) || Ta(t, o);
}
function Ta(t, e) {
  return !!e && $a(t) === $a(e);
}
function Ia(t, e) {
  const n = ba(t);
  return (
    !(!n || ya(n)) &&
    !!e &&
    n.host.includes(e.host) &&
    /(^|&|\?)sentry_key=/.test(n.search)
  );
}
function $a(t) {
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
 */ function Oa(t, ...e) {
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
 */ const Ca = Oa;
/**
 * @internal
 * @deprecated -- set ip inferral via via SDK metadata options on client instead.
 */ function Na(t) {
  t.user?.ip_address === void 0 &&
    (t.user = { ...t.user, ip_address: "{{auto}}" });
}
function ja(t) {
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
 */ function Ra(t, e, o = [e], s = "npm") {
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
 */ function Pa(t = {}) {
  const e = t.client || Te();
  if (!yr() || !e) return {};
  const n = o();
  const s = Se(n);
  if (s.getTraceData) return s.getTraceData(t);
  const r = t.scope || ke();
  const i = t.span || Yn();
  const a = i ? Pn(i) : Ma(r);
  const c = i ? mo(i) : fo(e, r);
  const u = cn(c);
  const l = wn.test(a);
  if (!l) {
    y.warn("Invalid sentry-trace data. Cannot generate trace data");
    return {};
  }
  const p = { "sentry-trace": a, baggage: u };
  t.propagateTraceparent && (p.traceparent = i ? Mn(i) : Da(r));
  return p;
}
function Ma(t) {
  const {
    traceId: e,
    sampled: n,
    propagationSpanId: o,
  } = t.getPropagationContext();
  return An(e, o, n);
}
function Da(t) {
  const {
    traceId: e,
    sampled: n,
    propagationSpanId: o,
  } = t.getPropagationContext();
  return Tn(e, o, n);
}
function Fa(t) {
  return Object.entries(t || Pa())
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
 */ function La(t, e, n) {
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
function qa(t) {
  const e = {};
  try {
    t.forEach((t, n) => {
      typeof t === "string" && (e[n] = t);
    });
  } catch {}
  return e;
}
function Ua(t) {
  const e = Object.create(null);
  try {
    Object.entries(t).forEach(([t, n]) => {
      typeof n === "string" && (e[t] = n);
    });
  } catch {}
  return e;
}
function Ja(t) {
  const e = qa(t.headers);
  return { method: t.method, url: t.url, query_string: Ya(t.url), headers: e };
}
function za(t) {
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
  const a = Ba({ url: i, host: o, protocol: r });
  const c = t.body || void 0;
  const u = t.cookies;
  return {
    url: a,
    method: t.method,
    query_string: Ya(i),
    headers: Ua(e),
    cookies: u,
    data: c,
  };
}
function Ba({ url: t, protocol: e, host: n }) {
  return t?.startsWith("http") ? t : t && n ? `${e}://${n}${t}` : void 0;
}
const Wa = [
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
const Va = ["x-forwarded-", "-user"];
function Ga(t, e = false) {
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
          Ha(n, s, a, i, e);
        }
      } else Ha(n, s, "", o, e);
    });
  } catch {}
  return n;
}
function Ka(t) {
  return t.replace(/-/g, "_");
}
function Ha(t, e, n, o, s) {
  const r = n
    ? `http.request.header.${Ka(e)}.${Ka(n)}`
    : `http.request.header.${Ka(e)}`;
  const i = Za(n || e, o, s);
  i !== void 0 && (t[r] = i);
}
function Za(t, e, n) {
  const o = n
    ? Wa.some((e) => t.includes(e))
    : [...Va, ...Wa].some((e) => t.includes(e));
  return o
    ? "[Filtered]"
    : Array.isArray(e)
      ? e.map((t) => (t != null ? String(t) : t)).join(";")
      : typeof e === "string"
        ? e
        : void 0;
}
function Ya(t) {
  if (t)
    try {
      const e = new URL(t, "http://s.io").search.slice(1);
      return e.length ? e : void 0;
    } catch {
      return;
    }
}
const Xa = 100;
function Qa(t, e) {
  const n = Te();
  const o = we();
  if (!n) return;
  const { beforeBreadcrumb: s = null, maxBreadcrumbs: r = Xa } = n.getOptions();
  if (r <= 0) return;
  const i = Ht();
  const a = { timestamp: i, ...t };
  const c = s ? u(() => s(a, e)) : a;
  if (c !== null) {
    n.emit && n.emit("beforeAddBreadcrumb", c, e);
    o.addBreadcrumb(c, r);
  }
}
let tc;
const ec = "FunctionToString";
const nc = new WeakMap();
const oc = () => ({
  name: ec,
  setupOnce() {
    tc = Function.prototype.toString;
    try {
      Function.prototype.toString = function (...t) {
        const e = ht(this);
        const n = nc.has(Te()) && e !== void 0 ? e : this;
        return tc.apply(n, t);
      };
    } catch {}
  },
  setup(t) {
    nc.set(t, true);
  },
});
const sc = Dr(oc);
const rc = [
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
const ic = "EventFilters";
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
 */ const ac = Dr((t = {}) => {
  let e;
  return {
    name: ic,
    setup(n) {
      const o = n.getOptions();
      e = uc(t, o);
    },
    processEvent(n, o, s) {
      if (!e) {
        const n = s.getOptions();
        e = uc(t, n);
      }
      return lc(n, e) ? null : n;
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
 */ const cc = Dr((t = {}) => ({ ...ac(t), name: "InboundFilters" }));
function uc(t = {}, e = {}) {
  return {
    allowUrls: [...(t.allowUrls || []), ...(e.allowUrls || [])],
    denyUrls: [...(t.denyUrls || []), ...(e.denyUrls || [])],
    ignoreErrors: [
      ...(t.ignoreErrors || []),
      ...(e.ignoreErrors || []),
      ...(t.disableErrorDefaults ? [] : rc),
    ],
    ignoreTransactions: [
      ...(t.ignoreTransactions || []),
      ...(e.ignoreTransactions || []),
    ],
  };
}
function lc(e, n) {
  if (e.type) {
    if (e.type === "transaction" && fc(e, n.ignoreTransactions)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`ignoreTransactions\` option.\nEvent: ${Lt(e)}`,
        );
      return true;
    }
  } else {
    if (pc(e, n.ignoreErrors)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${Lt(e)}`,
        );
      return true;
    }
    if (_c(e)) {
      t &&
        y.warn(
          `Event dropped due to not having an error message, error type or stacktrace.\nEvent: ${Lt(e)}`,
        );
      return true;
    }
    if (dc(e, n.denyUrls)) {
      t &&
        y.warn(
          `Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${Lt(e)}.\nUrl: ${hc(e)}`,
        );
      return true;
    }
    if (!mc(e, n.allowUrls)) {
      t &&
        y.warn(
          `Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${Lt(e)}.\nUrl: ${hc(e)}`,
        );
      return true;
    }
  }
  return false;
}
function pc(t, e) {
  return !!e?.length && vi(t).some((t) => jt(t, e));
}
function fc(t, e) {
  if (!e?.length) return false;
  const n = t.transaction;
  return !!n && jt(n, e);
}
function dc(t, e) {
  if (!e?.length) return false;
  const n = hc(t);
  return !!n && jt(n, e);
}
function mc(t, e) {
  if (!e?.length) return true;
  const n = hc(t);
  return !n || jt(n, e);
}
function gc(t = []) {
  for (let e = t.length - 1; e >= 0; e--) {
    const n = t[e];
    if (n && n.filename !== "<anonymous>" && n.filename !== "[native code]")
      return n.filename || null;
  }
  return null;
}
function hc(e) {
  try {
    const t = [...(e.exception?.values ?? [])]
      .reverse()
      .find(
        (t) =>
          t.mechanism?.parent_id === void 0 && t.stacktrace?.frames?.length,
      );
    const n = t?.stacktrace?.frames;
    return n ? gc(n) : null;
  } catch {
    t && y.error(`Cannot extract url for event ${Lt(e)}`);
    return null;
  }
}
function _c(t) {
  return (
    !!t.exception?.values?.length &&
    !t.message &&
    !t.exception.values.some(
      (t) => t.stacktrace || (t.type && t.type !== "Error") || t.value,
    )
  );
}
function yc(t, e, n, o, s, r) {
  if (!s.exception?.values || !r || !st(r.originalException, Error)) return;
  const i =
    s.exception.values.length > 0
      ? s.exception.values[s.exception.values.length - 1]
      : void 0;
  i &&
    (s.exception.values = bc(
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
function bc(t, e, n, o, s, r, i, a) {
  if (r.length >= n + 1) return r;
  let c = [...r];
  if (st(o[s], Error)) {
    vc(i, a);
    const r = t(e, o[s]);
    const u = c.length;
    Sc(r, s, u, a);
    c = bc(t, e, n, o[s], s, [r, ...c], r, u);
  }
  Array.isArray(o.errors) &&
    o.errors.forEach((o, r) => {
      if (st(o, Error)) {
        vc(i, a);
        const u = t(e, o);
        const l = c.length;
        Sc(u, `errors[${r}]`, l, a);
        c = bc(t, e, n, o, s, [u, ...c], u, l);
      }
    });
  return c;
}
function vc(t, e) {
  t.mechanism = {
    handled: true,
    type: "auto.core.linked_errors",
    ...t.mechanism,
    ...(t.type === "AggregateError" && { is_exception_group: true }),
    exception_id: e,
  };
}
function Sc(t, e, n, o) {
  t.mechanism = {
    handled: true,
    ...t.mechanism,
    type: "chained",
    source: e,
    exception_id: n,
    parent_id: o,
  };
}
const kc = "cause";
const wc = 5;
const xc = "LinkedErrors";
const Ec = (t = {}) => {
  const e = t.limit || wc;
  const n = t.key || kc;
  return {
    name: xc,
    preprocessEvent(t, o, s) {
      const r = s.getOptions();
      yc(Ki, r.stackParser, n, e, t, o);
    },
  };
};
const Ac = Dr(Ec);
const Tc = new Map();
const Ic = new Set();
/**
 * Builds a map of filenames to module metadata from the global _sentryModuleMetadata object.
 * This is useful for forwarding metadata from web workers to the main thread.
 *
 * @param parser - Stack parser to use for extracting filenames from stack traces
 * @returns A map of filename to metadata object
 */ function $c(t) {
  if (!e._sentryModuleMetadata) return {};
  const n = {};
  for (const o of Object.keys(e._sentryModuleMetadata)) {
    const s = e._sentryModuleMetadata[o];
    const r = t(o);
    for (const t of r.reverse())
      if (t.filename) {
        n[t.filename] = s;
        break;
      }
  }
  return n;
}
function Oc(t) {
  if (e._sentryModuleMetadata)
    for (const n of Object.keys(e._sentryModuleMetadata)) {
      const o = e._sentryModuleMetadata[n];
      if (Ic.has(n)) continue;
      Ic.add(n);
      const s = t(n);
      for (const t of s.reverse())
        if (t.filename) {
          Tc.set(t.filename, o);
          break;
        }
    }
}
function Cc(t, e) {
  Oc(t);
  return Tc.get(e);
}
function Nc(t, e) {
  e.exception?.values?.forEach((e) => {
    e.stacktrace?.frames?.forEach((e) => {
      if (!e.filename || e.module_metadata) return;
      const n = Cc(t, e.filename);
      n && (e.module_metadata = n);
    });
  });
}
function jc(t) {
  t.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((t) => {
      delete t.module_metadata;
    });
  });
}
const Rc = Dr(() => ({
  name: "ModuleMetadata",
  setup(t) {
    t.on("beforeEnvelope", (t) => {
      To(t, (t, e) => {
        if (e === "event") {
          const e = Array.isArray(t) ? t[1] : void 0;
          if (e) {
            jc(e);
            t[1] = e;
          }
        }
      });
    });
    t.on("applyFrameMetadata", (e) => {
      if (e.type) return;
      const n = t.getOptions().stackParser;
      Nc(n, e);
    });
  },
}));
function Pc(t) {
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
const Mc = [
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
function Dc(t) {
  const e = Mc.map((e) => {
    const n = t[e];
    const o = Array.isArray(n) ? n.join(";") : n;
    return e === "Forwarded" ? Fc(o) : o?.split(",").map((t) => t.trim());
  });
  const n = e.reduce((t, e) => (e ? t.concat(e) : t), []);
  const o = n.find((t) => t !== null && Lc(t));
  return o || null;
}
function Fc(t) {
  if (!t) return null;
  for (const e of t.split(";")) if (e.startsWith("for=")) return e.slice(4);
  return null;
}
function Lc(t) {
  const e =
    /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/;
  return e.test(t);
}
const qc = {
  cookies: true,
  data: true,
  headers: true,
  query_string: true,
  url: true,
};
const Uc = "RequestData";
const Jc = (t = {}) => {
  const e = { ...qc, ...t.include };
  return {
    name: Uc,
    processEvent(t, n, o) {
      const { sdkProcessingMetadata: s = {} } = t;
      const { normalizedRequest: r, ipAddress: i } = s;
      const a = { ...e, ip: e.ip ?? o.getOptions().sendDefaultPii };
      r && Bc(t, r, { ipAddress: i }, a);
      return t;
    },
  };
};
const zc = Dr(Jc);
function Bc(t, e, n, o) {
  t.request = { ...t.request, ...Wc(e, o) };
  if (o.ip) {
    const o = (e.headers && Dc(e.headers)) || n.ipAddress;
    o && (t.user = { ...t.user, ip_address: o });
  }
}
function Wc(t, e) {
  const n = {};
  const o = { ...t.headers };
  if (e.headers) {
    n.headers = o;
    e.cookies || delete o.cookie;
    e.ip ||
      Mc.forEach((t) => {
        delete o[t];
      });
  }
  n.method = t.method;
  e.url && (n.url = t.url);
  if (e.cookies) {
    const e = t.cookies || (o?.cookie ? Pc(o.cookie) : void 0);
    n.cookies = e || {};
  }
  e.query_string && (n.query_string = t.query_string);
  e.data && (n.data = t.data);
  return n;
}
function Vc(t) {
  const e = "console";
  j(e, t);
  P(e, Gc);
}
function Gc() {
  "console" in e &&
    i.forEach(function (t) {
      t in e.console &&
        dt(e.console, t, function (n) {
          c[t] = n;
          return function (...n) {
            const o = { args: n, level: t };
            M("console", o);
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
 */ function Kc(t) {
  return t === "warn"
    ? "warning"
    : ["fatal", "error", "warning", "log", "info", "debug"].includes(t)
      ? t
      : "log";
}
const Hc = "CaptureConsole";
const Zc = (t = {}) => {
  const n = t.levels || i;
  const o = t.handled ?? true;
  return {
    name: Hc,
    setup(t) {
      "console" in e &&
        Vc(({ args: e, level: s }) => {
          Te() === t && n.includes(s) && Xc(e, s, o);
        });
    },
  };
};
const Yc = Dr(Zc);
function Xc(t, e, n) {
  const o = Kc(e);
  const s = new Error();
  const r = { level: Kc(e), extra: { arguments: t } };
  Ee((i) => {
    i.addEventProcessor((t) => {
      t.logger = "console";
      Ut(t, { handled: n, type: "auto.core.capture_console" });
      return t;
    });
    if (e === "assert") {
      if (!t[0]) {
        const e = `Assertion failed: ${Ct(t.slice(1), " ") || "console.assert"}`;
        i.setExtra("arguments", t.slice(1));
        i.captureMessage(e, o, { captureContext: r, syntheticException: s });
      }
      return;
    }
    const a = t.find((t) => t instanceof Error);
    if (a) {
      or(a, r);
      return;
    }
    const c = Ct(t, " ");
    i.captureMessage(c, o, { captureContext: r, syntheticException: s });
  });
}
const Qc = "Dedupe";
const tu = () => {
  let e;
  return {
    name: Qc,
    processEvent(n) {
      if (n.type) return n;
      try {
        if (nu(n, e)) {
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
const eu = Dr(tu);
function nu(t, e) {
  return !!e && (!!ou(t, e) || !!su(t, e));
}
function ou(t, e) {
  const n = t.message;
  const o = e.message;
  return (
    !(!n && !o) &&
    !((n && !o) || (!n && o)) &&
    n === o &&
    !!iu(t, e) &&
    !!ru(t, e)
  );
}
function su(t, e) {
  const n = au(e);
  const o = au(t);
  return (
    !(!n || !o) &&
    n.type === o.type &&
    n.value === o.value &&
    !!iu(t, e) &&
    !!ru(t, e)
  );
}
function ru(t, e) {
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
function iu(t, e) {
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
function au(t) {
  return t.exception?.values?.[0];
}
const cu = "ExtraErrorData";
const uu = (t = {}) => {
  const { depth: e = 3, captureErrorCause: n = true } = t;
  return {
    name: cu,
    processEvent(t, o, s) {
      const { maxValueLength: r } = s.getOptions();
      return pu(t, o, e, n, r);
    },
  };
};
const lu = Dr(uu);
function pu(t, e = {}, n, o, s) {
  if (!e.originalException || !B(e.originalException)) return t;
  const r = e.originalException.name || e.originalException.constructor.name;
  const i = fu(e.originalException, o, s);
  if (i) {
    const e = { ...t.contexts };
    const o = ho(i, n);
    if (X(o)) {
      mt(o, "__sentry_skip_normalization__", true);
      e[r] = o;
    }
    return { ...t, contexts: e };
  }
  return t;
}
function fu(e, n, o) {
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
      s[n] = B(r) || typeof r === "string" ? (o ? $t(`${r}`, o) : `${r}`) : r;
    }
    if (n && e.cause !== void 0)
      if (B(e.cause)) {
        const t = e.cause.name || e.cause.constructor.name;
        s.cause = { [t]: fu(e.cause, false, o) };
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
function du(t, e) {
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
const mu =
  /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
function gu(t) {
  const e = t.length > 1024 ? `<truncated>${t.slice(-1024)}` : t;
  const n = mu.exec(e);
  return n ? n.slice(1) : [];
}
function hu(...t) {
  let e = "";
  let n = false;
  for (let o = t.length - 1; o >= -1 && !n; o--) {
    const s = o >= 0 ? t[o] : "/";
    if (s) {
      e = `${s}/${e}`;
      n = s.charAt(0) === "/";
    }
  }
  e = du(
    e.split("/").filter((t) => !!t),
    !n,
  ).join("/");
  return (n ? "/" : "") + e || ".";
}
function _u(t) {
  let e = 0;
  for (; e < t.length; e++) if (t[e] !== "") break;
  let n = t.length - 1;
  for (; n >= 0; n--) if (t[n] !== "") break;
  return e > n ? [] : t.slice(e, n - e + 1);
}
function yu(t, e) {
  t = hu(t).slice(1);
  e = hu(e).slice(1);
  const n = _u(t.split("/"));
  const o = _u(e.split("/"));
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
function bu(t) {
  const e = vu(t);
  const n = t.slice(-1) === "/";
  let o = du(
    t.split("/").filter((t) => !!t),
    !e,
  ).join("/");
  o || e || (o = ".");
  o && n && (o += "/");
  return (e ? "/" : "") + o;
}
function vu(t) {
  return t.charAt(0) === "/";
}
function Su(...t) {
  return bu(t.join("/"));
}
function ku(t) {
  const e = gu(t);
  const n = e[0] || "";
  let o = e[1];
  if (!n && !o) return ".";
  o && (o = o.slice(0, o.length - 1));
  return n + o;
}
function wu(t, e) {
  let n = gu(t)[2] || "";
  e && n.slice(e.length * -1) === e && (n = n.slice(0, n.length - e.length));
  return n;
}
const xu = "RewriteFrames";
const Eu = Dr((t = {}) => {
  const n = t.root;
  const o = t.prefix || "app:///";
  const s = "window" in e && !!e.window;
  const r = t.iteratee || Au({ isBrowser: s, root: n, prefix: o });
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
    name: xu,
    processEvent(t) {
      let e = t;
      t.exception && Array.isArray(t.exception.values) && (e = i(e));
      return e;
    },
  };
});
function Au({ isBrowser: t, root: e, prefix: n }) {
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
      const r = e ? yu(e, t) : wu(t);
      o.filename = `${n}${r}`;
    }
    return o;
  };
}
const Tu = [
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
const Iu = [
  "createUser",
  "deleteUser",
  "listUsers",
  "getUserById",
  "updateUserById",
  "inviteUserByEmail",
];
const $u = {
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
const Ou = ["select", "insert", "upsert", "update", "delete"];
function Cu(t) {
  try {
    t.__SENTRY_INSTRUMENTED__ = true;
  } catch {}
}
function Nu(t) {
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
 */ function ju(t, e = {}) {
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
 */ function Ru(t, e) {
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
          : (n && $u[n]) || "filter";
  return `${s}(${t}, ${o.join(".")})`;
}
function Pu(t, e = false) {
  return new Proxy(t, {
    apply(n, o, s) {
      return os(
        {
          name: `auth ${e ? "(admin) " : ""}${t.name}`,
          attributes: {
            [je]: "auto.db.supabase",
            [Ne]: "db",
            "db.system": "postgresql",
            "db.operation": `auth.${e ? "admin." : ""}${t.name}`,
          },
        },
        (t) =>
          Reflect.apply(n, o, s)
            .then((e) => {
              if (e && typeof e === "object" && "error" in e && e.error) {
                t.setStatus({ code: Ke });
                or(e.error, {
                  mechanism: { handled: false, type: "auto.db.supabase.auth" },
                });
              } else t.setStatus({ code: Ge });
              t.end();
              return e;
            })
            .catch((e) => {
              t.setStatus({ code: Ke });
              t.end();
              or(e, {
                mechanism: { handled: false, type: "auto.db.supabase.auth" },
              });
              throw e;
            })
            .then(...s),
      );
    },
  });
}
function Mu(t) {
  const e = t.auth;
  if (e && !Nu(t.auth)) {
    for (const n of Tu) {
      const o = e[n];
      o && typeof t.auth[n] === "function" && (t.auth[n] = Pu(o));
    }
    for (const n of Iu) {
      const o = e.admin[n];
      o &&
        typeof t.auth.admin[n] === "function" &&
        (t.auth.admin[n] = Pu(o, true));
    }
    Cu(t.auth);
  }
}
function Du(t) {
  if (!Nu(t.prototype.from)) {
    t.prototype.from = new Proxy(t.prototype.from, {
      apply(t, e, n) {
        const o = Reflect.apply(t, e, n);
        const s = o.constructor;
        Lu(s);
        return o;
      },
    });
    Cu(t.prototype.from);
  }
}
function Fu(t) {
  if (!Nu(t.prototype.then)) {
    t.prototype.then = new Proxy(t.prototype.then, {
      apply(t, e, n) {
        const o = Ou;
        const s = e;
        const r = ju(s.method, s.headers);
        if (!o.includes(r)) return Reflect.apply(t, e, n);
        if (!s?.url?.pathname || typeof s.url.pathname !== "string")
          return Reflect.apply(t, e, n);
        const i = s.url.pathname.split("/");
        const a = i.length > 0 ? i[i.length - 1] : "";
        const c = [];
        for (const [t, e] of s.url.searchParams.entries()) c.push(Ru(t, e));
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
          [je]: "auto.db.supabase",
          [Ne]: "db",
        };
        c.length && (p["db.query"] = c);
        Object.keys(u).length && (p["db.body"] = u);
        return os({ name: l, attributes: p }, (o) =>
          Reflect.apply(t, e, [])
            .then(
              (t) => {
                if (o) {
                  t &&
                    typeof t === "object" &&
                    "status" in t &&
                    Ze(o, t.status || 500);
                  o.end();
                }
                if (t.error) {
                  const e = new Error(t.error.message);
                  t.error.code && (e.code = t.error.code);
                  t.error.details && (e.details = t.error.details);
                  const n = {};
                  c.length && (n.query = c);
                  Object.keys(u).length && (n.body = u);
                  or(e, (t) => {
                    t.addEventProcessor((t) => {
                      Ut(t, {
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
                Qa(e);
                return t;
              },
              (t) => {
                if (o) {
                  Ze(o, 500);
                  o.end();
                }
                throw t;
              },
            )
            .then(...n),
        );
      },
    });
    Cu(t.prototype.then);
  }
}
function Lu(e) {
  for (const n of Ou)
    if (!Nu(e.prototype[n])) {
      e.prototype[n] = new Proxy(e.prototype[n], {
        apply(e, o, s) {
          const r = Reflect.apply(e, o, s);
          const i = r.constructor;
          t && y.log(`Instrumenting ${n} operation's PostgRESTFilterBuilder`);
          Fu(i);
          return r;
        },
      });
      Cu(e.prototype[n]);
    }
}
const qu = (e) => {
  if (!e) {
    t &&
      y.warn(
        "Supabase integration was not installed because no Supabase client was provided.",
      );
    return;
  }
  const n = e.constructor === Function ? e : e.constructor;
  Du(n);
  Mu(e);
};
const Uu = "Supabase";
const Ju = (t) => ({
  setupOnce() {
    qu(t);
  },
  name: Uu,
});
const zu = Dr((t) => Ju(t.supabaseClient));
const Bu = 10;
const Wu = "ZodErrors";
function Vu(t) {
  return B(t) && t.name === "ZodError" && Array.isArray(t.issues);
}
function Gu(t) {
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
 */ function Ku(t) {
  return t.map((t) => (typeof t === "number" ? "<array>" : t)).join(".");
}
function Hu(t) {
  const e = new Set();
  for (const n of t.issues) {
    const t = Ku(n.path);
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
  return `Failed to validate keys: ${$t(n.join(", "), 100)}`;
}
function Zu(t, e = false, n, o) {
  if (
    !n.exception?.values ||
    !o.originalException ||
    !Vu(o.originalException) ||
    o.originalException.issues.length === 0
  )
    return n;
  try {
    const s = e
      ? o.originalException.issues
      : o.originalException.issues.slice(0, t);
    const r = s.map(Gu);
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
          { ...n.exception.values[0], value: Hu(o.originalException) },
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
const Yu = (t = {}) => {
  const e = t.limit ?? Bu;
  return {
    name: Wu,
    processEvent(n, o) {
      const s = Zu(e, t.saveZodIssuesAsAttachment, n, o);
      return s;
    },
  };
};
const Xu = Dr(Yu);
const Qu = Dr((t) => ({
  name: "ThirdPartyErrorsFilter",
  setup(t) {
    t.on("beforeEnvelope", (t) => {
      To(t, (t, e) => {
        if (e === "event") {
          const e = Array.isArray(t) ? t[1] : void 0;
          if (e) {
            jc(e);
            t[1] = e;
          }
        }
      });
    });
    t.on("applyFrameMetadata", (e) => {
      if (e.type) return;
      const n = t.getOptions().stackParser;
      Nc(n, e);
    });
  },
  processEvent(e) {
    const n = el(e, t.ignoreSentryInternalFrames);
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
function tl(t, e) {
  if (e !== 0 || !t.context_line || !t.filename) return false;
  if (
    !t.filename.includes("sentry") ||
    !t.filename.includes("helpers") ||
    !t.context_line.includes(sl)
  )
    return false;
  if (t.pre_context) {
    const e = t.pre_context.length;
    for (let n = 0; n < e; n++) if (t.pre_context[n]?.includes(ol)) return true;
  }
  return false;
}
function el(t, e) {
  const n = $(t);
  if (n)
    return n
      .filter(
        (t, n) =>
          !!t.filename &&
          (t.lineno != null || t.colno != null || t.instruction_addr != null) &&
          (!e || !tl(t, n)),
      )
      .map((t) =>
        t.module_metadata
          ? Object.keys(t.module_metadata)
              .filter((t) => t.startsWith(nl))
              .map((t) => t.slice(nl.length))
          : [],
      );
}
const nl = "_sentryBundlerPluginAppKey:";
const ol = "Attempt to invoke user-land function";
const sl = "fn.apply(this, wrappedArguments)";
const rl = "Console";
const il = Dr((t = {}) => {
  const e = new Set(t.levels || i);
  return {
    name: rl,
    setup(t) {
      Vc(({ args: n, level: o }) => {
        Te() === t && e.has(o) && al(o, n);
      });
    },
  };
});
function al(t, e) {
  const n = {
    category: "console",
    data: { arguments: e, logger: "console" },
    level: Kc(t),
    message: cl(e),
  };
  if (t === "assert") {
    if (e[0] !== false) return;
    {
      const t = e.slice(1);
      n.message =
        t.length > 0 ? `Assertion failed: ${cl(t)}` : "Assertion failed";
      n.data.arguments = t;
    }
  }
  Qa(n, { input: e, level: t });
}
function cl(t) {
  return "util" in e && typeof e.util.format === "function"
    ? e.util.format(...t)
    : Ct(t, " ");
}
const ul = 100;
const ll = 10;
const pl = "flag.evaluation.";
function fl(t) {
  const e = ke();
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
 */ function dl(t, e, n = ul) {
  const o = ke().getScopeData().contexts;
  o.flags || (o.flags = { values: [] });
  const s = o.flags.values;
  ml(s, t, e, n);
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
 */ function ml(e, n, o, s) {
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
 */ function gl(t, e, n = ll) {
  if (typeof e !== "boolean") return;
  const o = Yn();
  if (!o) return;
  const s = qn(o).data;
  if (`${pl}${t}` in s) {
    o.setAttribute(`${pl}${t}`, e);
    return;
  }
  const r = Object.keys(s).filter((t) => t.startsWith(pl)).length;
  r < n && o.setAttribute(`${pl}${t}`, e);
}
const hl = Dr(() => ({
  name: "FeatureFlags",
  processEvent(t, e, n) {
    return fl(t);
  },
  addFeatureFlag(t, e) {
    dl(t, e);
    gl(t, e);
  },
}));
const _l = Dr(({ growthbookClass: t }) => ({
  name: "GrowthBook",
  setupOnce() {
    const e = t.prototype;
    typeof e.isOn === "function" && dt(e, "isOn", yl);
    typeof e.getFeatureValue === "function" && dt(e, "getFeatureValue", yl);
  },
  processEvent(t, e, n) {
    return fl(t);
  },
}));
function yl(t) {
  return function (...e) {
    const n = e[0];
    const o = t.apply(this, e);
    if (typeof n === "string" && typeof o === "boolean") {
      dl(n, o);
      gl(n, o);
    }
    return o;
  };
}
function bl(t) {
  return (
    !!t &&
    typeof t._profiler !== "undefined" &&
    typeof t._profiler.start === "function" &&
    typeof t._profiler.stop === "function"
  );
}
function vl() {
  const e = Te();
  if (!e) {
    t && y.warn("No Sentry client available, profiling is not started");
    return;
  }
  const n = e.getIntegrationByName("ProfilingIntegration");
  n
    ? bl(n)
      ? n._profiler.start()
      : t && y.warn("Profiler is not available on profiling integration.")
    : t && y.warn("ProfilingIntegration is not available");
}
function Sl() {
  const e = Te();
  if (!e) {
    t && y.warn("No Sentry client available, profiling is not started");
    return;
  }
  const n = e.getIntegrationByName("ProfilingIntegration");
  n
    ? bl(n)
      ? n._profiler.stop()
      : t && y.warn("Profiler is not available on profiling integration.")
    : t && y.warn("ProfilingIntegration is not available");
}
const kl = { startProfiler: vl, stopProfiler: Sl };
/**
 * Create and track fetch request spans for usage in combination with `addFetchInstrumentationHandler`.
 *
 * @returns Span if a span was created, otherwise void.
 */ function wl(t, e, n, o, s) {
  if (!t.fetchData) return;
  const { method: r, url: i } = t.fetchData;
  const a = no() && e(i);
  if (t.endTimestamp && a) {
    const e = t.fetchData.__span;
    if (!e) return;
    const n = o[e];
    if (n) {
      Al(n, t);
      xl(n, t, s);
      delete o[e];
    }
    return;
  }
  const {
    spanOrigin: c = "auto.http.browser",
    propagateTraceparent: u = false,
  } = typeof s === "object" ? s : { spanOrigin: s };
  const l = !!Yn();
  const p = a && l ? rs($l(i, r, c)) : new SentryNonRecordingSpan();
  t.fetchData.__span = p.spanContext().spanId;
  o[p.spanContext().spanId] = p;
  if (n(t.fetchData.url)) {
    const e = t.args[0];
    const n = t.args[1] || {};
    const o = El(e, n, no() && l ? p : void 0, u);
    if (o) {
      t.args[1] = n;
      n.headers = o;
    }
  }
  const f = Te();
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
function xl(t, e, n) {
  const o = typeof n === "object" && n !== null ? n.onRequestSpanEnd : void 0;
  o?.(t, { headers: e.response?.headers, error: e.error });
}
function El(t, e, n, o) {
  const s = Pa({ span: n, propagateTraceparent: o });
  const r = s["sentry-trace"];
  const i = s.baggage;
  const a = s.traceparent;
  if (!r) return;
  const c = e.headers || (it(t) ? t.headers : void 0);
  if (c) {
    if (Il(c)) {
      const t = new Headers(c);
      t.get("sentry-trace") || t.set("sentry-trace", r);
      o && a && !t.get("traceparent") && t.set("traceparent", a);
      if (i) {
        const e = t.get("baggage");
        e ? Tl(e) || t.set("baggage", `${e},${i}`) : t.set("baggage", i);
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
      const e = c.find((t) => t[0] === "baggage" && Tl(t[1]));
      i && !e && t.push(["baggage", i]);
      return t;
    }
    {
      const t = "sentry-trace" in c ? c["sentry-trace"] : void 0;
      const e = "traceparent" in c ? c.traceparent : void 0;
      const n = "baggage" in c ? c.baggage : void 0;
      const s = n ? (Array.isArray(n) ? [...n] : [n]) : [];
      const u = n && (Array.isArray(n) ? n.find((t) => Tl(t)) : Tl(n));
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
function Al(t, e) {
  if (e.response) {
    Ze(t, e.response.status);
    const n = e.response?.headers?.get("content-length");
    if (n) {
      const e = parseInt(n);
      e > 0 && t.setAttribute("http.response_content_length", e);
    }
  } else e.error && t.setStatus({ code: Ke, message: "internal_error" });
  t.end();
}
function Tl(t) {
  return t.split(",").some((t) => t.trim().startsWith(on));
}
function Il(t) {
  return typeof Headers !== "undefined" && st(t, Headers);
}
function $l(t, e, n) {
  const o = ba(t);
  return { name: o ? `${e} ${va(o)}` : e, attributes: Ol(t, o, e, n) };
}
function Ol(t, e, n, o) {
  const s = {
    url: t,
    type: "fetch",
    "http.method": n,
    [je]: o,
    [Ne]: "http.client",
  };
  if (e) {
    if (!ya(e)) {
      s["http.url"] = e.href;
      s["server.address"] = e.host;
    }
    e.search && (s["http.query"] = e.search);
    e.hash && (s["http.fragment"] = e.hash);
  }
  return s;
}
const Cl = { mechanism: { handled: false, type: "auto.rpc.trpc.middleware" } };
function Nl(t) {
  typeof t === "object" &&
    t !== null &&
    "ok" in t &&
    !t.ok &&
    "error" in t &&
    or(t.error, Cl);
}
function jl(t = {}) {
  return async function (e) {
    const { path: n, type: o, next: s, rawInput: r, getRawInput: i } = e;
    const a = Te();
    const c = a?.getOptions();
    const u = { procedure_path: n, procedure_type: o };
    mt(
      u,
      "__sentry_override_normalization_depth__",
      1 + (c?.normalizeDepth ?? 5),
    );
    if (t.attachRpcInput !== void 0 ? t.attachRpcInput : c?.sendDefaultPii) {
      r !== void 0 && (u.input = ho(r));
      if (i !== void 0 && typeof i === "function")
        try {
          const t = await i();
          u.input = ho(t);
        } catch {}
    }
    return Ae((e) => {
      e.setContext("trpc", u);
      return ss(
        {
          name: `trpc/${n}`,
          op: "rpc.server",
          attributes: { [$e]: "route", [je]: "auto.rpc.trpc" },
          forceTransaction: !!t.forceTransaction,
        },
        async (t) => {
          try {
            const e = await s();
            Nl(e);
            t.end();
            return e;
          } catch (e) {
            or(e, Cl);
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
 */ function Rl(t, e, n) {
  try {
    const o = Te();
    if (!o) return;
    const s = Yn();
    s?.isRecording() && s.setStatus({ code: Ke, message: "internal_error" });
    or(t, {
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
 */ function Pl(t, e) {
  dt(
    t,
    e,
    (t) =>
      function (n, ...o) {
        const s = o[o.length - 1];
        if (typeof s !== "function") return t.call(this, n, ...o);
        const r = Ml(s, e, n);
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
 */ function Ml(e, n, o) {
  return function (...s) {
    try {
      return Dl.call(this, e, n, o, s);
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
 */ function Dl(t, e, n, o) {
  try {
    const s = t.apply(this, o);
    return s && typeof s === "object" && typeof s.then === "function"
      ? Promise.resolve(s).catch((t) => {
          Fl(t, e, n);
          throw t;
        })
      : s;
  } catch (t) {
    Fl(t, e, n);
    throw t;
  }
}
/**
 * Captures handler execution errors based on handler type
 * @internal
 * @param error - Error to capture
 * @param methodName - MCP method name
 * @param handlerName - Handler identifier
 */ function Fl(t, e, n) {
  try {
    const o = {};
    if (e === "tool") {
      o.tool_name = n;
      t.name === "ProtocolValidationError" ||
      t.message.includes("validation") ||
      t.message.includes("protocol")
        ? Rl(t, "validation", o)
        : t.name === "ServerTimeoutError" ||
            t.message.includes("timed out") ||
            t.message.includes("timeout")
          ? Rl(t, "timeout", o)
          : Rl(t, "tool_execution", o);
    } else if (e === "resource") {
      o.resource_uri = n;
      Rl(t, "resource_execution", o);
    } else if (e === "prompt") {
      o.prompt_name = n;
      Rl(t, "prompt_execution", o);
    }
  } catch (t) {}
}
/**
 * Wraps tool handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function Ll(t) {
  Pl(t, "tool");
}
/**
 * Wraps resource handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function ql(t) {
  Pl(t, "resource");
}
/**
 * Wraps prompt handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function Ul(t) {
  Pl(t, "prompt");
}
/**
 * Wraps all MCP handler types (tool, resource, prompt) for span correlation
 * @param serverInstance - MCP server instance
 */ function Jl(t) {
  Ll(t);
  ql(t);
  Ul(t);
}
const zl = "mcp.method.name";
const Bl = "mcp.request.id";
const Wl = "mcp.session.id";
const Vl = "mcp.transport";
const Gl = "mcp.server.name";
const Kl = "mcp.server.title";
const Hl = "mcp.server.version";
const Zl = "mcp.protocol.version";
const Yl = "mcp.tool.name";
const Xl = "mcp.resource.uri";
const Ql = "mcp.prompt.name";
const tp = "mcp.tool.result.is_error";
const ep = "mcp.tool.result.content_count";
const np = "mcp.prompt.result.description";
const op = "mcp.prompt.result.message_count";
const sp = "mcp.request.argument";
const rp = "mcp.logging.level";
const ip = "mcp.logging.logger";
const ap = "mcp.logging.data_type";
const cp = "mcp.logging.message";
const up = "network.transport";
const lp = "network.protocol.version";
const pp = "client.address";
const fp = "client.port";
const dp = "mcp.server";
const mp = "mcp.notification.client_to_server";
const gp = "mcp.notification.server_to_client";
const hp = "auto.function.mcp_server";
const _p = "auto.mcp.notification";
const yp = "route";
/**
 * Validates if a message is a JSON-RPC request
 * @param message - Message to validate
 * @returns True if message is a JSON-RPC request
 */ function bp(t) {
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
 */ function vp(t) {
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
 */ function Sp(t) {
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
 */ function kp(e) {
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
 */ function wp(t) {
  return t != null && typeof t === "object";
}
/**
 * Build attributes for tool result content items
 * @param content - Array of content items from tool result
 * @param includeContent - Whether to include actual content (text, URIs) or just metadata
 * @returns Attributes extracted from each content item
 */ function xp(t, e) {
  const n = { [ep]: t.length };
  for (const [o, s] of t.entries()) {
    if (!wp(s)) continue;
    const r = t.length === 1 ? "mcp.tool.result" : `mcp.tool.result.${o}`;
    typeof s.type === "string" && (n[`${r}.content_type`] = s.type);
    if (e) {
      const t = (t, e) => {
        typeof e === "string" && (n[`${r}.${t}`] = e);
      };
      t("mime_type", s.mimeType);
      t("uri", s.uri);
      t("name", s.name);
      typeof s.text === "string" && (n[`${r}.content`] = s.text);
      typeof s.data === "string" && (n[`${r}.data_size`] = s.data.length);
      const e = s.resource;
      if (wp(e)) {
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
 */ function Ep(t, e) {
  if (!wp(t)) return {};
  const n = Array.isArray(t.content) ? xp(t.content, e) : {};
  typeof t.isError === "boolean" && (n[tp] = t.isError);
  return n;
}
/**
 * Extract prompt result attributes for span instrumentation
 * @param result - Prompt execution result
 * @param recordOutputs - Whether to include actual content or just metadata (counts)
 * @returns Attributes extracted from prompt result
 */ function Ap(t, e) {
  const n = {};
  if (!wp(t)) return n;
  e && typeof t.description === "string" && (n[np] = t.description);
  if (Array.isArray(t.messages)) {
    n[op] = t.messages.length;
    if (e) {
      const e = t.messages;
      for (const [t, o] of e.entries()) {
        if (!wp(o)) continue;
        const s =
          e.length === 1 ? "mcp.prompt.result" : `mcp.prompt.result.${t}`;
        const r = (t, o) => {
          if (typeof o === "string") {
            const r = e.length === 1 ? `${s}.message_${t}` : `${s}.${t}`;
            n[r] = o;
          }
        };
        r("role", o.role);
        if (wp(o.content)) {
          const t = o.content;
          if (typeof t.text === "string") {
            const o = e.length === 1 ? `${s}.message_content` : `${s}.content`;
            n[o] = t.text;
          }
        }
      }
    }
  }
  return n;
}
const Tp = new WeakMap();
/**
 * Stores session data for a transport with sessionId
 * @param transport - MCP transport instance
 * @param sessionData - Session data to store
 */ function Ip(t, e) {
  t.sessionId && Tp.set(t, e);
}
/**
 * Updates session data for a transport with sessionId (merges with existing data)
 * @param transport - MCP transport instance
 * @param partialSessionData - Partial session data to merge with existing data
 */ function $p(t, e) {
  if (t.sessionId) {
    const n = Tp.get(t) || {};
    Tp.set(t, { ...n, ...e });
  }
}
/**
 * Retrieves client information for a transport
 * @param transport - MCP transport instance
 * @returns Client information if available
 */ function Op(t) {
  return Tp.get(t)?.clientInfo;
}
/**
 * Retrieves protocol version for a transport
 * @param transport - MCP transport instance
 * @returns Protocol version if available
 */ function Cp(t) {
  return Tp.get(t)?.protocolVersion;
}
/**
 * Retrieves full session data for a transport
 * @param transport - MCP transport instance
 * @returns Complete session data if available
 */ function Np(t) {
  return Tp.get(t);
}
/**
 * Cleans up session data for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function jp(t) {
  Tp.delete(t);
}
/**
 * Extracts and validates PartyInfo from an unknown object
 * @param obj - Unknown object that might contain party info
 * @returns Validated PartyInfo object with only string properties
 */ function Rp(t) {
  const e = {};
  if (wp(t)) {
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
 */ function Pp(t) {
  const e = {};
  if (wp(t.params)) {
    typeof t.params.protocolVersion === "string" &&
      (e.protocolVersion = t.params.protocolVersion);
    t.params.clientInfo && (e.clientInfo = Rp(t.params.clientInfo));
  }
  return e;
}
/**
 * Extracts session data from "initialize" response
 * @param result - "initialize" response result containing server info and protocol version
 * @returns Partial session data extracted from response including protocol version and server info
 */ function Mp(t) {
  const e = {};
  if (wp(t)) {
    typeof t.protocolVersion === "string" &&
      (e.protocolVersion = t.protocolVersion);
    t.serverInfo && (e.serverInfo = Rp(t.serverInfo));
  }
  return e;
}
/**
 * Build client attributes from stored client info
 * @param transport - MCP transport instance
 * @returns Client attributes for span instrumentation
 */ function Dp(t) {
  const e = Op(t);
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
 */ function Fp(t) {
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
 */ function Lp(t) {
  const e = Np(t)?.serverInfo;
  const n = {};
  e?.name && (n[Gl] = e.name);
  e?.title && (n[Kl] = e.title);
  e?.version && (n[Hl] = e.version);
  return n;
}
/**
 * Build server attributes from PartyInfo directly
 * @param serverInfo - Server party info
 * @returns Server attributes for span instrumentation
 */ function qp(t) {
  const e = {};
  t?.name && (e[Gl] = t.name);
  t?.title && (e[Kl] = t.title);
  t?.version && (e[Hl] = t.version);
  return e;
}
/**
 * Extracts client connection info from extra handler data
 * @param extra - Extra handler data containing connection info
 * @returns Client address and port information
 */ function Up(t) {
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
 */ function Jp(t) {
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
 */ function zp(t, e) {
  const n = t && "sessionId" in t ? t.sessionId : void 0;
  const o = e ? Up(e) : {};
  const { mcpTransport: s, networkTransport: r } = Jp(t);
  const i = Dp(t);
  const a = Lp(t);
  const c = Cp(t);
  const u = {
    ...(n && { [Wl]: n }),
    ...(o.address && { [pp]: o.address }),
    ...(o.port && { [fp]: o.port }),
    [Vl]: s,
    [up]: r,
    [lp]: "2.0",
    ...(c && { [Zl]: c }),
    ...i,
    ...a,
  };
  return u;
}
const Bp = new WeakMap();
/**
 * Gets or creates the span map for a specific transport instance
 * @internal
 * @param transport - MCP transport instance
 * @returns Span map for the transport
 */ function Wp(t) {
  let e = Bp.get(t);
  if (!e) {
    e = new Map();
    Bp.set(t, e);
  }
  return e;
}
/**
 * Stores span context for later correlation with handler execution
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param span - Active span to correlate
 * @param method - MCP method name
 */ function Vp(t, e, n, o) {
  const s = Wp(t);
  s.set(e, { span: n, method: o, startTime: Date.now() });
}
/**
 * Completes span with results and cleans up correlation
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param result - Execution result for attribute extraction
 * @param options - Resolved MCP options
 */ function Gp(t, e, n, o) {
  const s = Wp(t);
  const r = s.get(e);
  if (r) {
    const { span: t, method: i } = r;
    if (i === "initialize") {
      const e = Mp(n);
      const o = qp(e.serverInfo);
      const s = { ...o };
      e.protocolVersion && (s[Zl] = e.protocolVersion);
      t.setAttributes(s);
    } else if (i === "tools/call") {
      const e = Ep(n, o.recordOutputs);
      t.setAttributes(e);
    } else if (i === "prompts/get") {
      const e = Ap(n, o.recordOutputs);
      t.setAttributes(e);
    }
    t.end();
    s.delete(e);
  }
}
/**
 * Cleans up pending spans for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function Kp(t) {
  const e = Bp.get(t);
  if (e) {
    for (const [, t] of e) {
      t.span.setStatus({ code: Ke, message: "cancelled" });
      t.span.end();
    }
    e.clear();
  }
}
const Hp = {
  "tools/call": {
    targetField: "name",
    targetAttribute: Yl,
    captureArguments: true,
    argumentsField: "arguments",
  },
  "resources/read": {
    targetField: "uri",
    targetAttribute: Xl,
    captureUri: true,
  },
  "resources/subscribe": { targetField: "uri", targetAttribute: Xl },
  "resources/unsubscribe": { targetField: "uri", targetAttribute: Xl },
  "prompts/get": {
    targetField: "name",
    targetAttribute: Ql,
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
 */ function Zp(t, e) {
  const n = Hp[t];
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
 */ function Yp(t, e) {
  const n = {};
  const o = Hp[t];
  if (!o) return n;
  if (o.captureArguments && o.argumentsField && e?.[o.argumentsField]) {
    const t = e[o.argumentsField];
    if (typeof t === "object" && t !== null)
      for (const [e, o] of Object.entries(t))
        n[`${sp}.${e.toLowerCase()}`] = JSON.stringify(o);
  }
  o.captureUri && e?.uri && (n[`${sp}.uri`] = JSON.stringify(e.uri));
  o.captureName && e?.name && (n[`${sp}.name`] = JSON.stringify(e.name));
  return n;
}
function Xp(t) {
  return typeof t === "string" ? t : JSON.stringify(t);
}
/**
 * Extracts additional attributes for specific notification types
 * @param method - Notification method name
 * @param params - Notification parameters
 * @param recordInputs - Whether to include actual content or just metadata
 * @returns Method-specific attributes for span instrumentation
 */ function Qp(t, e, n) {
  const o = {};
  switch (t) {
    case "notifications/cancelled":
      e?.requestId && (o["mcp.cancelled.request_id"] = String(e.requestId));
      e?.reason && (o["mcp.cancelled.reason"] = String(e.reason));
      break;
    case "notifications/message":
      e?.level && (o[rp] = String(e.level));
      e?.logger && (o[ip] = String(e.logger));
      if (e?.data !== void 0) {
        o[ap] = typeof e.data;
        n && (o[cp] = Xp(e.data));
      }
      break;
    case "notifications/progress":
      e?.progressToken && (o["mcp.progress.token"] = String(e.progressToken));
      typeof e?.progress === "number" &&
        (o["mcp.progress.current"] = e.progress);
      if (typeof e?.total === "number") {
        o["mcp.progress.total"] = e.total;
        typeof e?.progress === "number" &&
          (o["mcp.progress.percentage"] = (e.progress / e.total) * 100);
      }
      e?.message && (o["mcp.progress.message"] = String(e.message));
      break;
    case "notifications/resources/updated":
      if (e?.uri) {
        o[Xl] = String(e.uri);
        const t = ba(String(e.uri));
        t &&
          !ya(t) &&
          (o["mcp.resource.protocol"] = t.protocol.replace(":", ""));
      }
      break;
    case "notifications/initialized":
      o["mcp.lifecycle.phase"] = "initialization_complete";
      o["mcp.protocol.ready"] = 1;
      break;
  }
  return o;
}
/**
 * Build type-specific attributes based on message type
 * @param type - Span type (request or notification)
 * @param message - JSON-RPC message
 * @param params - Optional parameters for attribute extraction
 * @param recordInputs - Whether to capture input arguments in spans
 * @returns Type-specific attributes for span instrumentation
 */ function tf(t, e, n, o) {
  if (t === "request") {
    const t = e;
    const s = Zp(t.method, n || {});
    return {
      ...(t.id !== void 0 && { [Bl]: String(t.id) }),
      ...s.attributes,
      ...(o ? Yp(t.method, n || {}) : {}),
    };
  }
  return Qp(e.method, n || {}, o);
}
const ef = new Set([pp, fp, Xl]);
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
 */ function nf(t) {
  return ef.has(t);
}
/**
 * Removes network PII attributes from span data when sendDefaultPii is false
 * @param spanData - Raw span attributes
 * @param sendDefaultPii - Whether to include PII data
 * @returns Filtered span attributes
 */ function of(t, e) {
  return e
    ? t
    : Object.entries(t).reduce((t, [e, n]) => {
        nf(e) || (t[e] = n);
        return t;
      }, {});
}
/**
 * Creates a span name based on the method and target
 * @internal
 * @param method - MCP method name
 * @param target - Optional target identifier
 * @returns Formatted span name
 */ function sf(t, e) {
  return e ? `${t} ${e}` : t;
}
/**
 * Build Sentry-specific attributes based on span type
 * @internal
 * @param type - Span type configuration
 * @returns Sentry-specific attributes
 */ function rf(t) {
  let e;
  let n;
  switch (t) {
    case "request":
      e = dp;
      n = hp;
      break;
    case "notification-incoming":
      e = mp;
      n = _p;
      break;
    case "notification-outgoing":
      e = gp;
      n = _p;
      break;
  }
  return { [Ne]: e, [je]: n, [$e]: yp };
}
/**
 * Unified builder for creating MCP spans
 * @internal
 * @param config - Span configuration
 * @returns Created span
 */ function af(t) {
  const {
    type: e,
    message: n,
    transport: o,
    extra: s,
    callback: r,
    options: i,
  } = t;
  const { method: a } = n;
  const c = n.params;
  let u;
  if (e === "request") {
    const t = Zp(a, c || {});
    u = sf(a, t.target);
  } else u = a;
  const l = { ...zp(o, s), [zl]: a, ...tf(e, n, c, i?.recordInputs), ...rf(e) };
  const p = Te();
  const f = Boolean(p?.getOptions().sendDefaultPii);
  const d = of(l, f);
  return os({ name: u, forceTransaction: true, attributes: d }, r);
}
/**
 * Creates a span for incoming MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param extra - Extra handler data
 * @param options - Resolved MCP options
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function cf(t, e, n, o, s) {
  return af({
    type: "notification-incoming",
    message: t,
    transport: e,
    extra: n,
    callback: s,
    options: o,
  });
}
/**
 * Creates a span for outgoing MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param options - Resolved MCP options
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function uf(t, e, n, o) {
  return af({
    type: "notification-outgoing",
    message: t,
    transport: e,
    options: n,
    callback: o,
  });
}
/**
 * Builds span configuration for MCP server requests
 * @param jsonRpcMessage - Request message
 * @param transport - MCP transport instance
 * @param extra - Optional extra handler data
 * @param options - Resolved MCP options
 * @returns Span configuration object
 */ function lf(t, e, n, o) {
  const { method: s } = t;
  const r = t.params;
  const i = Zp(s, r || {});
  const a = sf(s, i.target);
  const c = {
    ...zp(e, n),
    [zl]: s,
    ...tf("request", t, r, o?.recordInputs),
    ...rf("request"),
  };
  const u = Te();
  const l = Boolean(u?.getOptions().sendDefaultPii);
  const p = of(c, l);
  return { name: a, op: dp, forceTransaction: true, attributes: p };
}
/**
 * Wraps transport.onmessage to create spans for incoming messages.
 * For "initialize" requests, extracts and stores client info and protocol version
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 * @param options - Resolved MCP options
 */ function pf(t, e) {
  t.onmessage &&
    dt(
      t,
      "onmessage",
      (t) =>
        function (n, o) {
          if (bp(n)) {
            const s = n.method === "initialize";
            let r;
            if (s)
              try {
                r = Pp(n);
                Ip(this, r);
              } catch {}
            const i = we().clone();
            return Ae(i, () => {
              const i = lf(n, this, o, e);
              const a = rs(i);
              s &&
                r &&
                a.setAttributes({
                  ...Fp(r.clientInfo),
                  ...(r.protocolVersion && { [Zl]: r.protocolVersion }),
                });
              Vp(this, n.id, a, n.method);
              return as(a, () => t.call(this, n, o));
            });
          }
          return vp(n)
            ? cf(n, this, o, e, () => t.call(this, n, o))
            : t.call(this, n, o);
        },
    );
}
/**
 * Wraps transport.send to handle outgoing messages and response correlation.
 * For "initialize" responses, extracts and stores protocol version and server info
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 * @param options - Resolved MCP options
 */ function ff(t, e) {
  t.send &&
    dt(
      t,
      "send",
      (t) =>
        async function (...n) {
          const [o] = n;
          if (vp(o)) return uf(o, this, e, () => t.call(this, ...n));
          if (Sp(o) && o.id !== null && o.id !== void 0) {
            o.error && gf(o.error);
            if (
              wp(o.result) &&
              (o.result.protocolVersion || o.result.serverInfo)
            )
              try {
                const t = Mp(o.result);
                $p(this, t);
              } catch {}
            Gp(this, o.id, o.result, e);
          }
          return t.call(this, ...n);
        },
    );
}
/**
 * Wraps transport.onclose to clean up pending spans for this transport only
 * @param transport - MCP transport instance to wrap
 */ function df(t) {
  t.onclose &&
    dt(
      t,
      "onclose",
      (t) =>
        function (...e) {
          Kp(this);
          jp(this);
          return t.call(this, ...e);
        },
    );
}
/**
 * Wraps transport error handlers to capture connection errors
 * @param transport - MCP transport instance to wrap
 */ function mf(t) {
  t.onerror &&
    dt(
      t,
      "onerror",
      (t) =>
        function (e) {
          hf(e);
          return t.call(this, e);
        },
    );
}
/**
 * Captures JSON-RPC error responses for server-side errors.
 * @see https://www.jsonrpc.org/specification#error_object
 * @internal
 * @param errorResponse - JSON-RPC error response
 */ function gf(t) {
  try {
    if (t && typeof t === "object" && "code" in t && "message" in t) {
      const e = t;
      const n = e.code === -32603 || (e.code >= -32099 && e.code <= -32e3);
      if (n) {
        const t = new Error(e.message);
        t.name = `JsonRpcError_${e.code}`;
        Rl(t, "protocol");
      }
    }
  } catch {}
}
/**
 * Captures transport connection errors
 * @internal
 * @param error - Transport error
 */ function hf(t) {
  try {
    Rl(t, "transport");
  } catch {}
}
const _f = new WeakSet();
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
 */ function yf(t, e) {
  if (_f.has(t)) return t;
  if (!kp(t)) return t;
  const n = t;
  const o = Te();
  const s = Boolean(o?.getOptions().sendDefaultPii);
  const r = {
    recordInputs: e?.recordInputs ?? s,
    recordOutputs: e?.recordOutputs ?? s,
  };
  dt(
    n,
    "connect",
    (t) =>
      async function (e, ...n) {
        const o = await t.call(this, e, ...n);
        pf(e, r);
        ff(e, r);
        df(e);
        mf(e);
        return o;
      },
  );
  Jl(n);
  _f.add(t);
  return t;
}
function bf(t, e = {}, n = ke()) {
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
  const p = n?.getClient() || Te();
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
 */ function vf(t, e, n, o, s) {
  Hr({ level: t, message: e, attributes: n, severityNumber: s }, o);
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
 */ function Sf(t, e, { scope: n } = {}) {
  vf("trace", t, e, n);
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
 */ function kf(t, e, { scope: n } = {}) {
  vf("debug", t, e, n);
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
 */ function wf(t, e, { scope: n } = {}) {
  vf("info", t, e, n);
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
 */ function xf(t, e, { scope: n } = {}) {
  vf("warn", t, e, n);
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
 */ function Ef(t, e, { scope: n } = {}) {
  vf("error", t, e, n);
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
 */ function Af(t, e, { scope: n } = {}) {
  vf("fatal", t, e, n);
}
var Tf = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      debug: kf,
      error: Ef,
      fatal: Af,
      fmt: Ca,
      info: wf,
      trace: Sf,
      warn: xf,
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
 */ function If(t, n, o) {
  return "util" in e && typeof e.util.format === "function"
    ? e.util.format(...t)
    : $f(t, n, o);
}
/**
 * Joins the given values into a string.
 *
 * @param values - The values to join.
 * @param normalizeDepth - The depth to normalize the values.
 * @param normalizeMaxBreadth - The max breadth to normalize the values.
 * @returns The joined string.
 */ function $f(t, e, n) {
  return t
    .map((t) => (Y(t) ? String(t) : JSON.stringify(ho(t, e, n))))
    .join(" ");
}
/**
 * Checks if a string contains console substitution patterns like %s, %d, %i, %f, %o, %O, %c.
 *
 * @param str - The string to check
 * @returns true if the string contains console substitution patterns
 */ function Of(t) {
  return /%[sdifocO]/.test(t);
}
/**
 * Creates template attributes for multiple console arguments.
 *
 * @param args - The console arguments
 * @returns An object with template and parameter attributes
 */ function Cf(t, e) {
  const n = {};
  const o = new Array(e.length).fill("{}").join(" ");
  n["sentry.message.template"] = `${t} ${o}`;
  e.forEach((t, e) => {
    n[`sentry.message.parameter.${e}`] = t;
  });
  return n;
}
const Nf = "ConsoleLogs";
const jf = { [je]: "auto.log.console" };
const Rf = (e = {}) => {
  const n = e.levels || i;
  return {
    name: Nf,
    setup(e) {
      const {
        enableLogs: o,
        normalizeDepth: s = 3,
        normalizeMaxBreadth: r = 1e3,
      } = e.getOptions();
      o
        ? Vc(({ args: t, level: o }) => {
            if (Te() !== e || !n.includes(o)) return;
            const i = t[0];
            const a = t.slice(1);
            if (o === "assert") {
              if (!i) {
                const t =
                  a.length > 0
                    ? `Assertion failed: ${If(a, s, r)}`
                    : "Assertion failed";
                Hr({ level: "error", message: t, attributes: jf });
              }
              return;
            }
            const c = o === "log";
            const u = t.length > 1 && typeof t[0] === "string" && !Of(t[0]);
            const l = { ...jf, ...(u ? Cf(i, a) : {}) };
            Hr({
              level: c ? "info" : o,
              message: If(t, s, r),
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
const Pf = Dr(Rf);
/**
 * Capture a metric with the given type, name, and value.
 *
 * @param type - The type of the metric.
 * @param name - The name of the metric.
 * @param value - The value of the metric.
 * @param options - Options for capturing the metric.
 */ function Mf(t, e, n, o) {
  ii(
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
 */ function Df(t, e = 1, n) {
  Mf("counter", t, e, n);
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
 */ function Ff(t, e, n) {
  Mf("gauge", t, e, n);
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
 */ function Lf(t, e, n) {
  Mf("distribution", t, e, n);
}
var qf = Object.freeze(
  Object.defineProperty(
    { __proto__: null, count: Df, distribution: Lf, gauge: Ff },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
const Uf = ["trace", "debug", "info", "warn", "error", "fatal"];
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
 */ function Jf(t = {}) {
  const e = new Set(t.levels ?? Uf);
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
      const l = n || Te();
      if (!l) return;
      const p = Wf(o, s);
      if (!e.has(p)) return;
      const { normalizeDepth: f = 3, normalizeMaxBreadth: d = 1e3 } =
        l.getOptions();
      const m = [];
      r && m.push(r);
      i && i.length > 0 && m.push(If(i, f, d));
      const g = m.join(" ");
      u["sentry.origin"] = "auto.log.consola";
      a && (u["consola.tag"] = a);
      o && (u["consola.type"] = o);
      s != null && typeof s === "number" && (u["consola.level"] = s);
      Hr({ level: p, message: g, attributes: u });
    },
  };
}
const zf = {
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
const Bf = {
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
 */ function Wf(t, e) {
  if (t === "verbose") return "debug";
  if (t === "silent") return "trace";
  if (t) {
    const e = zf[t];
    if (e) return e;
  }
  if (typeof e === "number") {
    const t = Bf[e];
    if (t) return t;
  }
  return "info";
}
const Vf = "gen_ai.prompt";
const Gf = "gen_ai.system";
const Kf = "gen_ai.request.model";
const Hf = "gen_ai.request.stream";
const Zf = "gen_ai.request.temperature";
const Yf = "gen_ai.request.max_tokens";
const Xf = "gen_ai.request.frequency_penalty";
const Qf = "gen_ai.request.presence_penalty";
const td = "gen_ai.request.top_p";
const ed = "gen_ai.request.top_k";
const nd = "gen_ai.request.encoding_format";
const od = "gen_ai.request.dimensions";
const sd = "gen_ai.response.finish_reasons";
const rd = "gen_ai.response.model";
const id = "gen_ai.response.id";
const ad = "gen_ai.response.stop_reason";
const cd = "gen_ai.usage.input_tokens";
const ud = "gen_ai.usage.output_tokens";
const ld = "gen_ai.usage.total_tokens";
const pd = "gen_ai.operation.name";
const fd = "gen_ai.request.messages.original_length";
const dd = "gen_ai.request.messages";
const md = "gen_ai.response.text";
const gd = "gen_ai.request.available_tools";
const hd = "gen_ai.response.streaming";
const _d = "gen_ai.response.tool_calls";
const yd = "gen_ai.agent.name";
const bd = "gen_ai.pipeline.name";
const vd = "gen_ai.conversation.id";
const Sd = "gen_ai.usage.cache_creation_input_tokens";
const kd = "gen_ai.usage.cache_read_input_tokens";
const wd = "gen_ai.usage.input_tokens.cache_write";
const xd = "gen_ai.usage.input_tokens.cached";
const Ed = "gen_ai.invoke_agent";
const Ad = "gen_ai.generate_text";
const Td = "gen_ai.stream_text";
const Id = "gen_ai.generate_object";
const $d = "gen_ai.stream_object";
const Od = "gen_ai.embed";
const Cd = "gen_ai.embed_many";
const Nd = "gen_ai.execute_tool";
const jd = "openai.response.id";
const Rd = "openai.response.model";
const Pd = "openai.response.timestamp";
const Md = "openai.usage.completion_tokens";
const Dd = "openai.usage.prompt_tokens";
const Fd = {
  CHAT: "chat",
  RESPONSES: "responses",
  EMBEDDINGS: "embeddings",
  CONVERSATIONS: "conversations",
};
const Ld = "anthropic.response.timestamp";
const qd = new Map();
const Ud = 2e4;
const Jd = (t) => new TextEncoder().encode(t).length;
const zd = (t) => Jd(JSON.stringify(t));
/**
 * Truncate a string to fit within maxBytes when encoded as UTF-8.
 * Uses binary search for efficiency with multi-byte characters.
 *
 * @param text - The string to truncate
 * @param maxBytes - Maximum byte length (UTF-8 encoded)
 * @returns Truncated string that fits within maxBytes
 */ function Bd(t, e) {
  if (Jd(t) <= e) return t;
  let n = 0;
  let o = t.length;
  let s = "";
  while (n <= o) {
    const r = Math.floor((n + o) / 2);
    const i = t.slice(0, r);
    const a = Jd(i);
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
 */ function Wd(t) {
  return typeof t === "string" ? t : "text" in t ? t.text : "";
}
/**
 * Create a new part with updated text content while preserving the original structure.
 *
 * @param part - Original part (string or object)
 * @param text - New text content
 * @returns New part with updated text
 */ function Vd(t, e) {
  return typeof t === "string" ? e : { ...t, text: e };
}
function Gd(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "content" in t &&
    typeof t.content === "string"
  );
}
function Kd(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "content" in t &&
    Array.isArray(t.content)
  );
}
function Hd(t) {
  return (
    !(!t || typeof t !== "object") &&
    (Zd(t) ||
      Yd(t) ||
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
function Zd(t) {
  return (
    "type" in t && typeof t.type === "string" && "source" in t && Hd(t.source)
  );
}
function Yd(t) {
  return (
    "inlineData" in t &&
    !!t.inlineData &&
    typeof t.inlineData === "object" &&
    "data" in t.inlineData &&
    typeof t.inlineData.data === "string"
  );
}
function Xd(t) {
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
 */ function Qd(t, e) {
  const n = { ...t, content: "" };
  const o = zd(n);
  const s = e - o;
  if (s <= 0) return [];
  const r = Bd(t.content, s);
  return [{ ...t, content: r }];
}
/**
 * Truncate a message with `parts: [...]` format (Google GenAI).
 * Keeps as many complete parts as possible, only truncating the first part if needed.
 *
 * @param message - Message with parts array
 * @param maxBytes - Maximum byte limit
 * @returns Array with truncated message, or empty array if it doesn't fit
 */ function tm(t, e) {
  const { parts: n } = t;
  const o = n.map((t) => Vd(t, ""));
  const s = zd({ ...t, parts: o });
  let r = e - s;
  if (r <= 0) return [];
  const i = [];
  for (const t of n) {
    const e = Wd(t);
    const n = Jd(e);
    if (!(n <= r)) {
      if (i.length === 0) {
        const n = Bd(e, r);
        n && i.push(Vd(t, n));
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
 */ function em(t, e) {
  return t && typeof t === "object"
    ? Gd(t)
      ? Qd(t, e)
      : Xd(t)
        ? tm(t, e)
        : []
    : [];
}
const nm = "[Filtered]";
const om = ["image_url", "data", "content", "b64_json", "result", "uri"];
function sm(t) {
  const e = { ...t };
  Hd(e.source) && (e.source = sm(e.source));
  Yd(t) && (e.inlineData = { ...t.inlineData, data: nm });
  for (const t of om) typeof e[t] === "string" && (e[t] = nm);
  return e;
}
function rm(t) {
  const e = t.map((t) => {
    let e;
    if (!!t && typeof t === "object") {
      Kd(t)
        ? (e = { ...t, content: rm(t.content) })
        : "content" in t &&
          Hd(t.content) &&
          (e = { ...t, content: sm(t.content) });
      Xd(t) && (e = { ...(e ?? t), parts: rm(t.parts) });
      Hd(e) ? (e = sm(e)) : Hd(t) && (e = sm(t));
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
 */ function im(t, e) {
  if (!Array.isArray(t) || t.length === 0) return t;
  const n = rm(t);
  const o = zd(n);
  if (o <= e) return n;
  const s = n.map(zd);
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
    return em(t, e);
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
 */ function am(t) {
  return im(t, Ud);
}
/**
 * Truncate GenAI string input using the default byte limit.
 *
 * @param input - The string to truncate
 * @returns Truncated string
 */ function cm(t) {
  return Bd(t, Ud);
}
function um(t) {
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
function lm(t) {
  return `gen_ai.${um(t)}`;
}
function pm(t, e) {
  return t ? `${t}.${e}` : e;
}
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param cachedInputTokens - The number of cached input tokens
 * @param cachedOutputTokens - The number of cached output tokens
 */ function fm(t, e, n, o, s) {
  e !== void 0 && t.setAttributes({ [cd]: e });
  n !== void 0 && t.setAttributes({ [ud]: n });
  if (e !== void 0 || n !== void 0 || o !== void 0 || s !== void 0) {
    const r = (e ?? 0) + (n ?? 0) + (o ?? 0) + (s ?? 0);
    t.setAttributes({ [ld]: r });
  }
}
/**
 * Get the truncated JSON string for a string or array of strings.
 *
 * @param value - The string or array of strings to truncate
 * @returns The truncated JSON string
 */ function dm(t) {
  if (typeof t === "string") return cm(t);
  if (Array.isArray(t)) {
    const e = am(t);
    return JSON.stringify(e);
  }
  return JSON.stringify(t);
}
const mm = "operation.name";
const gm = "ai.prompt";
const hm = "ai.schema";
const _m = "ai.response.object";
const ym = "ai.response.text";
const bm = "ai.response.toolCalls";
const vm = "ai.prompt.messages";
const Sm = "ai.prompt.tools";
const km = "ai.model.id";
const wm = "ai.response.providerMetadata";
const xm = "ai.usage.cachedInputTokens";
const Em = "ai.telemetry.functionId";
const Am = "ai.usage.completionTokens";
const Tm = "ai.usage.promptTokens";
const Im = "ai.toolCall.name";
const $m = "ai.toolCall.id";
const Om = "ai.toolCall.args";
const Cm = "ai.toolCall.result";
function Nm(t, e) {
  const n = t.parent_span_id;
  if (!n) return;
  const o = t.data[cd];
  const s = t.data[ud];
  if (typeof o === "number" || typeof s === "number") {
    const t = e.get(n) || { inputTokens: 0, outputTokens: 0 };
    typeof o === "number" && (t.inputTokens += o);
    typeof s === "number" && (t.outputTokens += s);
    e.set(n, t);
  }
}
function jm(t, e) {
  const n = e.get(t.span_id);
  if (n && t.data) {
    n.inputTokens > 0 && (t.data[cd] = n.inputTokens);
    n.outputTokens > 0 && (t.data[ud] = n.outputTokens);
    (n.inputTokens > 0 || n.outputTokens > 0) &&
      (t.data["gen_ai.usage.total_tokens"] = n.inputTokens + n.outputTokens);
  }
}
function Rm(t) {
  return qd.get(t);
}
function Pm(t) {
  qd.delete(t);
}
function Mm(t) {
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
function Dm(t) {
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
function Fm(t, e) {
  if (e[gm]) {
    const n = dm(e[gm]);
    t.setAttribute("gen_ai.prompt", n);
  }
  const n = e[gm];
  if (typeof n !== "string" || e[dd] || e[vm]) {
    if (typeof e[vm] === "string")
      try {
        const n = JSON.parse(e[vm]);
        Array.isArray(n) &&
          t.setAttributes({ [vm]: void 0, [dd]: dm(n), [fd]: n.length });
      } catch {}
  } else {
    const e = Dm(n);
    e.length && t.setAttributes({ [dd]: dm(e), [fd]: e.length });
  }
}
function Lm(t) {
  switch (t) {
    case "ai.generateText":
    case "ai.streamText":
    case "ai.generateObject":
    case "ai.streamObject":
    case "ai.embed":
    case "ai.embedMany":
      return Ed;
    case "ai.generateText.doGenerate":
      return Ad;
    case "ai.streamText.doStream":
      return Td;
    case "ai.generateObject.doGenerate":
      return Id;
    case "ai.streamObject.doStream":
      return $d;
    case "ai.embed.doEmbed":
      return Od;
    case "ai.embedMany.doEmbed":
      return Cd;
    case "ai.toolCall":
      return Nd;
    default:
      return t.startsWith("ai.stream") ? "ai.run" : void 0;
  }
}
function qm(t, e) {
  t.setAttribute(je, e);
}
function Um(t) {
  const { data: e, description: n } = qn(t);
  n &&
    (e[Im] && e[$m] && n === "ai.toolCall"
      ? Wm(t, e)
      : n.startsWith("ai.") && Vm(t, n, e));
}
function Jm(t) {
  if (t.type === "transaction" && t.spans) {
    const e = new Map();
    for (const n of t.spans) {
      zm(n);
      Nm(n, e);
    }
    for (const n of t.spans) n.op === "gen_ai.invoke_agent" && jm(n, e);
    const n = t.contexts?.trace;
    n && n.op === "gen_ai.invoke_agent" && jm(n, e);
  }
  return t;
}
function zm(t) {
  const { data: e, origin: n } = t;
  if (n === "auto.vercelai.otel") {
    Bm(e, Am, ud);
    Bm(e, Tm, cd);
    Bm(e, xm, xd);
    typeof e[cd] === "number" &&
      typeof e[xd] === "number" &&
      (e[cd] = e[cd] + e[xd]);
    typeof e[ud] === "number" &&
      typeof e[cd] === "number" &&
      (e["gen_ai.usage.total_tokens"] = e[ud] + e[cd]);
    e[Sm] && Array.isArray(e[Sm]) && (e[Sm] = Mm(e[Sm]));
    Bm(e, mm, pd);
    Bm(e, vm, dd);
    Bm(e, ym, "gen_ai.response.text");
    Bm(e, bm, "gen_ai.response.tool_calls");
    Bm(e, _m, "gen_ai.response.object");
    Bm(e, Sm, "gen_ai.request.available_tools");
    Bm(e, Om, "gen_ai.tool.input");
    Bm(e, Cm, "gen_ai.tool.output");
    Bm(e, hm, "gen_ai.request.schema");
    Bm(e, km, Kf);
    Km(e);
    for (const t of Object.keys(e))
      t.startsWith("ai.") && Bm(e, t, `vercel.${t}`);
  }
}
function Bm(t, e, n) {
  if (t[e] != null) {
    t[n] = t[e];
    delete t[e];
  }
}
function Wm(t, e) {
  qm(t, "auto.vercelai.otel");
  t.setAttribute(Ne, "gen_ai.execute_tool");
  Bm(e, Im, "gen_ai.tool.name");
  Bm(e, $m, "gen_ai.tool.call.id");
  const n = e["gen_ai.tool.call.id"];
  typeof n === "string" && qd.set(n, t);
  e["gen_ai.tool.type"] || t.setAttribute("gen_ai.tool.type", "function");
  const o = e["gen_ai.tool.name"];
  o && t.updateName(`execute_tool ${o}`);
}
function Vm(t, e, n) {
  qm(t, "auto.vercelai.otel");
  const o = e.replace("ai.", "");
  t.setAttribute("ai.pipeline.name", o);
  t.updateName(o);
  const s = n[Em];
  if (s && typeof s === "string") {
    t.updateName(`${o} ${s}`);
    t.setAttribute("gen_ai.function_id", s);
  }
  Fm(t, n);
  n[km] && !n[rd] && t.setAttribute(rd, n[km]);
  t.setAttribute("ai.streaming", e.includes("stream"));
  const r = Lm(e);
  r && t.setAttribute(Ne, r);
  const i = n[km];
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
    }
}
function Gm(t) {
  t.on("spanStart", Um);
  t.addEventProcessor(Object.assign(Jm, { id: "VercelAiEventProcessor" }));
}
function Km(t) {
  const e = t[wm];
  if (e)
    try {
      const n = JSON.parse(e);
      const o = n.openai ?? n.azure;
      if (o) {
        Hm(t, xd, o.cachedPromptTokens);
        Hm(t, "gen_ai.usage.output_tokens.reasoning", o.reasoningTokens);
        Hm(
          t,
          "gen_ai.usage.output_tokens.prediction_accepted",
          o.acceptedPredictionTokens,
        );
        Hm(
          t,
          "gen_ai.usage.output_tokens.prediction_rejected",
          o.rejectedPredictionTokens,
        );
        Hm(t, "gen_ai.conversation.id", o.responseId);
      }
      if (n.anthropic) {
        const e =
          n.anthropic.usage?.cache_read_input_tokens ??
          n.anthropic.cacheReadInputTokens;
        Hm(t, xd, e);
        const o =
          n.anthropic.usage?.cache_creation_input_tokens ??
          n.anthropic.cacheCreationInputTokens;
        Hm(t, wd, o);
      }
      if (n.bedrock?.usage) {
        Hm(t, xd, n.bedrock.usage.cacheReadInputTokens);
        Hm(t, wd, n.bedrock.usage.cacheWriteInputTokens);
      }
      if (n.deepseek) {
        Hm(t, xd, n.deepseek.promptCacheHitTokens);
        Hm(
          t,
          "gen_ai.usage.input_tokens.cache_miss",
          n.deepseek.promptCacheMissTokens,
        );
      }
    } catch {}
}
function Hm(t, e, n) {
  n != null && (t[e] = n);
}
const Zm = "OpenAI";
const Ym = [
  "responses.create",
  "chat.completions.create",
  "embeddings.create",
  "conversations.create",
];
const Xm = [
  "response.output_item.added",
  "response.function_call_arguments.delta",
  "response.function_call_arguments.done",
  "response.output_item.done",
];
const Qm = [
  "response.created",
  "response.in_progress",
  "response.failed",
  "response.completed",
  "response.incomplete",
  "response.queued",
  "response.output_text.delta",
  ...Xm,
];
function tg(t) {
  return t.includes("chat.completions")
    ? Fd.CHAT
    : t.includes("responses")
      ? Fd.RESPONSES
      : t.includes("embeddings")
        ? Fd.EMBEDDINGS
        : t.includes("conversations")
          ? Fd.CONVERSATIONS
          : t.split(".").pop() || "unknown";
}
function eg(t) {
  return `gen_ai.${tg(t)}`;
}
function ng(t) {
  return Ym.includes(t);
}
function og(t, e) {
  return t ? `${t}.${e}` : e;
}
function sg(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "chat.completion"
  );
}
function rg(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "response"
  );
}
function ig(t) {
  if (t === null || typeof t !== "object" || !("object" in t)) return false;
  const e = t;
  return (
    e.object === "list" &&
    typeof e.model === "string" &&
    e.model.toLowerCase().includes("embedding")
  );
}
function ag(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "conversation"
  );
}
function cg(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "type" in t &&
    typeof t.type === "string" &&
    t.type.startsWith("response.")
  );
}
function ug(t) {
  return (
    t !== null &&
    typeof t === "object" &&
    "object" in t &&
    t.object === "chat.completion.chunk"
  );
}
function lg(t, e, n) {
  gg(t, e.id, e.model, e.created);
  e.usage &&
    mg(
      t,
      e.usage.prompt_tokens,
      e.usage.completion_tokens,
      e.usage.total_tokens,
    );
  if (Array.isArray(e.choices)) {
    const o = e.choices.map((t) => t.finish_reason).filter((t) => t !== null);
    o.length > 0 && t.setAttributes({ [sd]: JSON.stringify(o) });
    if (n) {
      const n = e.choices
        .map((t) => t.message?.tool_calls)
        .filter((t) => Array.isArray(t) && t.length > 0)
        .flat();
      n.length > 0 && t.setAttributes({ [_d]: JSON.stringify(n) });
    }
  }
}
function pg(t, e, n) {
  gg(t, e.id, e.model, e.created_at);
  e.status && t.setAttributes({ [sd]: JSON.stringify([e.status]) });
  e.usage &&
    mg(t, e.usage.input_tokens, e.usage.output_tokens, e.usage.total_tokens);
  if (n) {
    const n = e;
    if (Array.isArray(n.output) && n.output.length > 0) {
      const e = n.output.filter(
        (t) =>
          typeof t === "object" && t !== null && t.type === "function_call",
      );
      e.length > 0 && t.setAttributes({ [_d]: JSON.stringify(e) });
    }
  }
}
function fg(t, e) {
  t.setAttributes({ [Rd]: e.model, [rd]: e.model });
  e.usage && mg(t, e.usage.prompt_tokens, void 0, e.usage.total_tokens);
}
function dg(t, e) {
  const { id: n, created_at: o } = e;
  t.setAttributes({ [jd]: n, [id]: n, [vd]: n });
  o && t.setAttributes({ [Pd]: new Date(o * 1e3).toISOString() });
}
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param totalTokens - The number of total tokens
 */ function mg(t, e, n, o) {
  e !== void 0 && t.setAttributes({ [Dd]: e, [cd]: e });
  n !== void 0 && t.setAttributes({ [Md]: n, [ud]: n });
  o !== void 0 && t.setAttributes({ [ld]: o });
}
/**
 * Set common response attributes
 * @param span - The span to add attributes to
 * @param id - The response id
 * @param model - The response model
 * @param timestamp - The response timestamp
 */ function gg(t, e, n, o) {
  t.setAttributes({ [jd]: e, [id]: e });
  t.setAttributes({ [Rd]: n, [rd]: n });
  t.setAttributes({ [Pd]: new Date(o * 1e3).toISOString() });
}
function hg(t) {
  return "conversation" in t && typeof t.conversation === "string"
    ? t.conversation
    : "previous_response_id" in t && typeof t.previous_response_id === "string"
      ? t.previous_response_id
      : void 0;
}
function _g(t) {
  const e = { [Kf]: t.model ?? "unknown" };
  "temperature" in t && (e[Zf] = t.temperature);
  "top_p" in t && (e[td] = t.top_p);
  "frequency_penalty" in t && (e[Xf] = t.frequency_penalty);
  "presence_penalty" in t && (e[Qf] = t.presence_penalty);
  "stream" in t && (e[Hf] = t.stream);
  "encoding_format" in t && (e[nd] = t.encoding_format);
  "dimensions" in t && (e[od] = t.dimensions);
  const n = hg(t);
  n && (e[vd] = n);
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
 */ function yg(t, e) {
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
 */ function bg(t, e, n) {
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
      o.delta?.tool_calls && yg(o.delta.tool_calls, e);
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
 */ function vg(t, e, n, o) {
  if (!(t && typeof t === "object")) {
    e.eventTypes.push("unknown:non-object");
    return;
  }
  if (t instanceof Error) {
    o.setStatus({ code: Ke, message: "internal_error" });
    or(t, {
      mechanism: { handled: false, type: "auto.ai.openai.stream-response" },
    });
    return;
  }
  if (!("type" in t)) return;
  const s = t;
  if (Qm.includes(s.type)) {
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
 */ async function* Sg(t, e, n) {
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
      ug(s) ? bg(s, o, n) : cg(s) && vg(s, o, n, e);
      yield s;
    }
  } finally {
    gg(e, o.responseId, o.responseModel, o.responseTimestamp);
    mg(e, o.promptTokens, o.completionTokens, o.totalTokens);
    e.setAttributes({ [hd]: true });
    o.finishReasons.length &&
      e.setAttributes({ [sd]: JSON.stringify(o.finishReasons) });
    n &&
      o.responseTexts.length &&
      e.setAttributes({ [md]: o.responseTexts.join("") });
    const t = Object.values(o.chatCompletionToolCalls);
    const s = [...t, ...o.responsesApiToolCalls];
    s.length > 0 && e.setAttributes({ [_d]: JSON.stringify(s) });
    e.end();
  }
}
function kg(t) {
  const e = Array.isArray(t.tools) ? t.tools : [];
  const n = t.web_search_options && typeof t.web_search_options === "object";
  const o = n ? [{ type: "web_search_options", ...t.web_search_options }] : [];
  const s = [...e, ...o];
  return s.length > 0 ? JSON.stringify(s) : void 0;
}
function wg(t, e) {
  const n = { [Gf]: "openai", [pd]: tg(e), [je]: "auto.ai.openai" };
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    const o = kg(e);
    o && (n[gd] = o);
    Object.assign(n, _g(e));
  } else n[Kf] = "unknown";
  return n;
}
function xg(t, e, n) {
  if (!e || typeof e !== "object") return;
  const o = e;
  if (sg(o)) {
    lg(t, o, n);
    if (n && o.choices?.length) {
      const e = o.choices.map((t) => t.message?.content || "");
      t.setAttributes({ [md]: JSON.stringify(e) });
    }
  } else if (rg(o)) {
    pg(t, o, n);
    n && o.output_text && t.setAttributes({ [md]: o.output_text });
  } else ig(o) ? fg(t, o) : ag(o) && dg(t, o);
}
function Eg(t, e) {
  const n = "input" in e ? e.input : "messages" in e ? e.messages : void 0;
  const o = Array.isArray(n) ? n.length : void 0;
  if (n && o !== 0) {
    const e = dm(n);
    t.setAttribute(dd, e);
    o && t.setAttribute(fd, o);
  }
}
function Ag(t, e, n, o) {
  return async function (...s) {
    const r = wg(s, e);
    const i = r[Kf] || "unknown";
    const a = tg(e);
    const c = s[0];
    const u = c && typeof c === "object" && c.stream === true;
    return u
      ? ss(
          { name: `${a} ${i} stream-response`, op: eg(e), attributes: r },
          async (r) => {
            try {
              o.recordInputs && c && Eg(r, c);
              const e = await t.apply(n, s);
              return Sg(e, r, o.recordOutputs ?? false);
            } catch (t) {
              r.setStatus({ code: Ke, message: "internal_error" });
              or(t, {
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
      : os({ name: `${a} ${i}`, op: eg(e), attributes: r }, async (r) => {
          try {
            o.recordInputs && c && Eg(r, c);
            const e = await t.apply(n, s);
            xg(r, e, o.recordOutputs);
            return e;
          } catch (t) {
            or(t, {
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
function Tg(t, e = "", n) {
  return new Proxy(t, {
    get(t, o) {
      const s = t[o];
      const r = og(e, String(o));
      return typeof s === "function" && ng(r)
        ? Ag(s, r, t, n)
        : typeof s === "function"
          ? s.bind(t)
          : s && typeof s === "object"
            ? Tg(s, r, n)
            : s;
    },
  });
}
function Ig(t, e) {
  const n = Boolean(Te()?.getOptions().sendDefaultPii);
  const o = { recordInputs: n, recordOutputs: n, ...e };
  return Tg(t, "", o);
}
/**
 * Checks if an event is an error event
 * @param event - The event to process
 * @param state - The state of the streaming process
 * @param recordOutputs - Whether to record outputs
 * @param span - The span to update
 * @returns Whether an error occurred
 */ function $g(t, e) {
  if ("type" in t && typeof t.type === "string" && t.type === "error") {
    e.setStatus({ code: Ke, message: t.error?.type ?? "internal_error" });
    or(t.error, {
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
 */ function Og(t, e) {
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
function Cg(t, e) {
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
function Ng(t, e, n) {
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
function jg(t, e) {
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
 */ function Rg(t, e, n, o) {
  if (!(t && typeof t === "object")) return;
  const s = $g(t, o);
  if (!s) {
    Og(t, e);
    Cg(t, e);
    Ng(t, e, n);
    jg(t, e);
  }
}
function Pg(t, e, n) {
  if (e.isRecording()) {
    t.responseId && e.setAttributes({ [id]: t.responseId });
    t.responseModel && e.setAttributes({ [rd]: t.responseModel });
    fm(
      e,
      t.promptTokens,
      t.completionTokens,
      t.cacheCreationInputTokens,
      t.cacheReadInputTokens,
    );
    e.setAttributes({ [hd]: true });
    t.finishReasons.length > 0 &&
      e.setAttributes({ [sd]: JSON.stringify(t.finishReasons) });
    n &&
      t.responseTexts.length > 0 &&
      e.setAttributes({ [md]: t.responseTexts.join("") });
    n &&
      t.toolCalls.length > 0 &&
      e.setAttributes({ [_d]: JSON.stringify(t.toolCalls) });
    e.end();
  }
}
async function* Mg(t, e, n) {
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
      Rg(s, o, n, e);
      yield s;
    }
  } finally {
    o.responseId && e.setAttributes({ [id]: o.responseId });
    o.responseModel && e.setAttributes({ [rd]: o.responseModel });
    fm(
      e,
      o.promptTokens,
      o.completionTokens,
      o.cacheCreationInputTokens,
      o.cacheReadInputTokens,
    );
    e.setAttributes({ [hd]: true });
    o.finishReasons.length > 0 &&
      e.setAttributes({ [sd]: JSON.stringify(o.finishReasons) });
    n &&
      o.responseTexts.length > 0 &&
      e.setAttributes({ [md]: o.responseTexts.join("") });
    n &&
      o.toolCalls.length > 0 &&
      e.setAttributes({ [_d]: JSON.stringify(o.toolCalls) });
    e.end();
  }
}
function Dg(t, e, n) {
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
    Rg(t, o, n, e);
  });
  t.on("message", () => {
    Pg(o, e, n);
  });
  t.on("error", (t) => {
    or(t, {
      mechanism: { handled: false, type: "auto.ai.anthropic.stream_error" },
    });
    if (e.isRecording()) {
      e.setStatus({ code: Ke, message: "stream_error" });
      e.end();
    }
  });
  return t;
}
const Fg = "Anthropic_AI";
const Lg = [
  "messages.create",
  "messages.stream",
  "messages.countTokens",
  "models.get",
  "completions.create",
  "models.retrieve",
  "beta.messages.create",
];
function qg(t) {
  return Lg.includes(t);
}
function Ug(t, e) {
  const n = Array.isArray(e) ? e.length : void 0;
  n !== 0 && t.setAttributes({ [dd]: dm(e), [fd]: n });
}
function Jg(t, e) {
  if (e.error) {
    t.setStatus({ code: Ke, message: e.error.type || "internal_error" });
    or(e.error, {
      mechanism: { handled: false, type: "auto.ai.anthropic.anthropic_error" },
    });
  }
}
function zg(t) {
  const { system: e, messages: n, input: o } = t;
  const s =
    typeof e === "string" ? [{ role: "system", content: t.system }] : [];
  const r = Array.isArray(o) ? o : o != null ? [o] : void 0;
  const i = Array.isArray(n) ? n : n != null ? [n] : [];
  const a = r ?? i;
  return [...s, ...a];
}
function Bg(t, e) {
  const n = { [Gf]: "anthropic", [pd]: um(e), [je]: "auto.ai.anthropic" };
  if (t.length > 0 && typeof t[0] === "object" && t[0] !== null) {
    const e = t[0];
    e.tools && Array.isArray(e.tools) && (n[gd] = JSON.stringify(e.tools));
    n[Kf] = e.model ?? "unknown";
    "temperature" in e && (n[Zf] = e.temperature);
    "top_p" in e && (n[td] = e.top_p);
    "stream" in e && (n[Hf] = e.stream);
    "top_k" in e && (n[ed] = e.top_k);
    "frequency_penalty" in e && (n[Xf] = e.frequency_penalty);
    "max_tokens" in e && (n[Yf] = e.max_tokens);
  } else
    n[Kf] = e === "models.retrieve" || e === "models.get" ? t[0] : "unknown";
  return n;
}
function Wg(t, e) {
  const n = zg(e);
  Ug(t, n);
  "prompt" in e && t.setAttributes({ [Vf]: JSON.stringify(e.prompt) });
}
function Vg(t, e) {
  if ("content" in e && Array.isArray(e.content)) {
    t.setAttributes({
      [md]: e.content
        .map((t) => t.text)
        .filter((t) => !!t)
        .join(""),
    });
    const n = [];
    for (const t of e.content)
      (t.type !== "tool_use" && t.type !== "server_tool_use") || n.push(t);
    n.length > 0 && t.setAttributes({ [_d]: JSON.stringify(n) });
  }
  "completion" in e && t.setAttributes({ [md]: e.completion });
  "input_tokens" in e &&
    t.setAttributes({ [md]: JSON.stringify(e.input_tokens) });
}
function Gg(t, e) {
  if ("id" in e && "model" in e) {
    t.setAttributes({ [id]: e.id, [rd]: e.model });
    "created" in e &&
      typeof e.created === "number" &&
      t.setAttributes({ [Ld]: new Date(e.created * 1e3).toISOString() });
    "created_at" in e &&
      typeof e.created_at === "number" &&
      t.setAttributes({ [Ld]: new Date(e.created_at * 1e3).toISOString() });
    "usage" in e &&
      e.usage &&
      fm(
        t,
        e.usage.input_tokens,
        e.usage.output_tokens,
        e.usage.cache_creation_input_tokens,
        e.usage.cache_read_input_tokens,
      );
  }
}
function Kg(t, e, n) {
  if (e && typeof e === "object")
    if ("type" in e && e.type === "error") Jg(t, e);
    else {
      n && Vg(t, e);
      Gg(t, e);
    }
}
function Hg(t, e, n) {
  or(t, {
    mechanism: {
      handled: false,
      type: "auto.ai.anthropic",
      data: { function: n },
    },
  });
  if (e.isRecording()) {
    e.setStatus({ code: Ke, message: "internal_error" });
    e.end();
  }
  throw t;
}
function Zg(t, e, n, o, s, r, i, a, c, u, l) {
  const p = s[Kf] ?? "unknown";
  const f = { name: `${r} ${p} stream-response`, op: lm(i), attributes: s };
  return ss(
    f,
    u && !l
      ? async (e) => {
          try {
            c.recordInputs && a && Wg(e, a);
            const s = await t.apply(n, o);
            return Mg(s, e, c.recordOutputs ?? false);
          } catch (t) {
            return Hg(t, e, i);
          }
        }
      : (t) => {
          try {
            c.recordInputs && a && Wg(t, a);
            const s = e.apply(n, o);
            return Dg(s, t, c.recordOutputs ?? false);
          } catch (e) {
            return Hg(e, t, i);
          }
        },
  );
}
function Yg(t, e, n, o) {
  return new Proxy(t, {
    apply(s, r, i) {
      const a = Bg(i, e);
      const c = a[Kf] ?? "unknown";
      const u = um(e);
      const l = typeof i[0] === "object" ? i[0] : void 0;
      const p = Boolean(l?.stream);
      const f = e === "messages.stream";
      return p || f
        ? Zg(t, s, n, i, a, u, e, l, o, p, f)
        : os({ name: `${u} ${c}`, op: lm(e), attributes: a }, (t) => {
            o.recordInputs && l && Wg(t, l);
            return Qo(
              () => s.apply(n, i),
              (t) => {
                or(t, {
                  mechanism: {
                    handled: false,
                    type: "auto.ai.anthropic",
                    data: { function: e },
                  },
                });
              },
              () => {},
              (e) => Kg(t, e, o.recordOutputs),
            );
          });
    },
  });
}
function Xg(t, e = "", n) {
  return new Proxy(t, {
    get(t, o) {
      const s = t[o];
      const r = pm(e, String(o));
      return typeof s === "function" && qg(r)
        ? Yg(s, r, t, n)
        : typeof s === "function"
          ? s.bind(t)
          : s && typeof s === "object"
            ? Xg(s, r, n)
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
 */ function Qg(t, e) {
  const n = Boolean(Te()?.getOptions().sendDefaultPii);
  const o = { recordInputs: n, recordOutputs: n, ...e };
  return Xg(t, "", o);
}
const th = "Google_GenAI";
const eh = [
  "models.generateContent",
  "models.generateContentStream",
  "chats.create",
  "sendMessage",
  "sendMessageStream",
];
const nh = "google_genai";
const oh = "chats.create";
const sh = "chat";
/**
 * Checks if a response chunk contains an error
 * @param chunk - The response chunk to check
 * @param span - The span to update if error is found
 * @returns Whether an error occurred
 */ function rh(t, e) {
  const n = t?.promptFeedback;
  if (n?.blockReason) {
    const t = n.blockReasonMessage ?? n.blockReason;
    e.setStatus({ code: Ke, message: `Content blocked: ${t}` });
    or(`Content blocked: ${t}`, {
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
 */ function ih(t, e) {
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
 */ function ah(t, e, n) {
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
 */ function ch(t, e, n, o) {
  if (t && !rh(t, o)) {
    ih(t, e);
    ah(t, e, n);
  }
}
async function* uh(t, e, n) {
  const o = { responseTexts: [], finishReasons: [], toolCalls: [] };
  try {
    for await (const s of t) {
      ch(s, o, n, e);
      yield s;
    }
  } finally {
    const t = { [hd]: true };
    o.responseId && (t[id] = o.responseId);
    o.responseModel && (t[rd] = o.responseModel);
    o.promptTokens !== void 0 && (t[cd] = o.promptTokens);
    o.completionTokens !== void 0 && (t[ud] = o.completionTokens);
    o.totalTokens !== void 0 && (t[ld] = o.totalTokens);
    o.finishReasons.length && (t[sd] = JSON.stringify(o.finishReasons));
    n && o.responseTexts.length && (t[md] = o.responseTexts.join(""));
    n && o.toolCalls.length && (t[_d] = JSON.stringify(o.toolCalls));
    e.setAttributes(t);
    e.end();
  }
}
function lh(t) {
  if (eh.includes(t)) return true;
  const e = t.split(".").pop();
  return eh.includes(e);
}
function ph(t) {
  return t.includes("Stream");
}
function fh(t, e = "user") {
  return typeof t === "string"
    ? [{ role: e, content: t }]
    : Array.isArray(t)
      ? t.flatMap((t) => fh(t, e))
      : typeof t === "object" && t
        ? "role" in t && typeof t.role === "string"
          ? [t]
          : "parts" in t
            ? [{ ...t, role: e }]
            : [{ role: e, content: t }]
        : [];
}
function dh(t, e) {
  if ("model" in t && typeof t.model === "string") return t.model;
  if (e && typeof e === "object") {
    const t = e;
    if ("model" in t && typeof t.model === "string") return t.model;
    if ("modelVersion" in t && typeof t.modelVersion === "string")
      return t.modelVersion;
  }
  return "unknown";
}
function mh(t) {
  const e = {};
  "temperature" in t &&
    typeof t.temperature === "number" &&
    (e[Zf] = t.temperature);
  "topP" in t && typeof t.topP === "number" && (e[td] = t.topP);
  "topK" in t && typeof t.topK === "number" && (e[ed] = t.topK);
  "maxOutputTokens" in t &&
    typeof t.maxOutputTokens === "number" &&
    (e[Yf] = t.maxOutputTokens);
  "frequencyPenalty" in t &&
    typeof t.frequencyPenalty === "number" &&
    (e[Xf] = t.frequencyPenalty);
  "presencePenalty" in t &&
    typeof t.presencePenalty === "number" &&
    (e[Qf] = t.presencePenalty);
  return e;
}
function gh(t, e, n) {
  const o = { [Gf]: nh, [pd]: um(t), [je]: "auto.ai.google_genai" };
  if (e) {
    o[Kf] = dh(e, n);
    if ("config" in e && typeof e.config === "object" && e.config) {
      const t = e.config;
      Object.assign(o, mh(t));
      if ("tools" in t && Array.isArray(t.tools)) {
        const e = t.tools.flatMap((t) => t.functionDeclarations);
        o[gd] = JSON.stringify(e);
      }
    }
  } else o[Kf] = dh({}, n);
  return o;
}
function hh(t, e) {
  const n = [];
  "config" in e &&
    e.config &&
    typeof e.config === "object" &&
    "systemInstruction" in e.config &&
    e.config.systemInstruction &&
    n.push(...fh(e.config.systemInstruction, "system"));
  "history" in e && n.push(...fh(e.history, "user"));
  "contents" in e && n.push(...fh(e.contents, "user"));
  "message" in e && n.push(...fh(e.message, "user"));
  Array.isArray(n) &&
    n.length &&
    t.setAttributes({ [fd]: n.length, [dd]: JSON.stringify(am(n)) });
}
function _h(t, e, n) {
  if (e && typeof e === "object") {
    e.modelVersion && t.setAttribute(rd, e.modelVersion);
    if (e.usageMetadata && typeof e.usageMetadata === "object") {
      const n = e.usageMetadata;
      typeof n.promptTokenCount === "number" &&
        t.setAttributes({ [cd]: n.promptTokenCount });
      typeof n.candidatesTokenCount === "number" &&
        t.setAttributes({ [ud]: n.candidatesTokenCount });
      typeof n.totalTokenCount === "number" &&
        t.setAttributes({ [ld]: n.totalTokenCount });
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
      n.length > 0 && t.setAttributes({ [md]: n.join("") });
    }
    if (n && e.functionCalls) {
      const n = e.functionCalls;
      Array.isArray(n) &&
        n.length > 0 &&
        t.setAttributes({ [_d]: JSON.stringify(n) });
    }
  }
}
function yh(t, e, n, o) {
  const s = e === oh;
  return new Proxy(t, {
    apply(t, r, i) {
      const a = i[0];
      const c = gh(e, a, n);
      const u = c[Kf] ?? "unknown";
      const l = um(e);
      return ph(e)
        ? ss(
            { name: `${l} ${u} stream-response`, op: lm(e), attributes: c },
            async (s) => {
              try {
                o.recordInputs && a && hh(s, a);
                const e = await t.apply(n, i);
                return uh(e, s, Boolean(o.recordOutputs));
              } catch (t) {
                s.setStatus({ code: Ke, message: "internal_error" });
                or(t, {
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
        : os(
            {
              name: s ? `${l} ${u} create` : `${l} ${u}`,
              op: lm(e),
              attributes: c,
            },
            (r) => {
              o.recordInputs && a && hh(r, a);
              return Qo(
                () => t.apply(n, i),
                (t) => {
                  or(t, {
                    mechanism: {
                      handled: false,
                      type: "auto.ai.google_genai",
                      data: { function: e },
                    },
                  });
                },
                () => {},
                (t) => {
                  s || _h(r, t, o.recordOutputs);
                },
              );
            },
          );
    },
  });
}
function bh(t, e = "", n) {
  return new Proxy(t, {
    get: (t, o, s) => {
      const r = Reflect.get(t, o, s);
      const i = pm(e, String(o));
      if (typeof r === "function" && lh(i)) {
        if (i === oh) {
          const e = yh(r, i, t, n);
          return function (...t) {
            const o = e(...t);
            return o && typeof o === "object" ? bh(o, sh, n) : o;
          };
        }
        return yh(r, i, t, n);
      }
      return typeof r === "function"
        ? r.bind(t)
        : r && typeof r === "object"
          ? bh(r, i, n)
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
 */ function vh(t, e) {
  const n = Boolean(Te()?.getOptions().sendDefaultPii);
  const o = { recordInputs: n, recordOutputs: n, ...e };
  return bh(t, "", o);
}
const Sh = "LangChain";
const kh = "auto.ai.langchain";
const wh = {
  human: "user",
  ai: "assistant",
  assistant: "assistant",
  system: "system",
  function: "function",
  tool: "tool",
};
const xh = (t, e, n) => {
  n != null && (t[e] = n);
};
const Eh = (t, e, n) => {
  const o = Number(n);
  Number.isNaN(o) || (t[e] = o);
};
function Ah(t) {
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
 */ function Th(t) {
  const e = t.toLowerCase();
  return wh[e] ?? e;
}
function Ih(t) {
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
 */ function $h(t) {
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
 */ function Oh(t) {
  return t.map((t) => {
    const e = t._getType;
    if (typeof e === "function") {
      const n = e.call(t);
      return { role: Th(n), content: Ah(t.content) };
    }
    const n = t.constructor?.name;
    if (n) return { role: Th(Ih(n)), content: Ah(t.content) };
    if (t.type) {
      const e = String(t.type).toLowerCase();
      return { role: Th(e), content: Ah(t.content) };
    }
    if (t.role) return { role: Th(String(t.role)), content: Ah(t.content) };
    if (t.lc === 1 && t.kwargs) {
      const e = t.id;
      const n = Array.isArray(e) && e.length > 0 ? e[e.length - 1] : "";
      const o = typeof n === "string" ? Ih(n) : "user";
      return { role: Th(o), content: Ah(t.kwargs?.content) };
    }
    return { role: "user", content: Ah(t.content) };
  });
}
function Ch(t, e, n) {
  const o = {};
  const s = "kwargs" in t ? t.kwargs : void 0;
  const r = e?.temperature ?? n?.ls_temperature ?? s?.temperature;
  Eh(o, Zf, r);
  const i = e?.max_tokens ?? n?.ls_max_tokens ?? s?.max_tokens;
  Eh(o, Yf, i);
  const a = e?.top_p ?? s?.top_p;
  Eh(o, td, a);
  const c = e?.frequency_penalty;
  Eh(o, Xf, c);
  const u = e?.presence_penalty;
  Eh(o, Qf, u);
  e && "stream" in e && xh(o, Hf, Boolean(e.stream));
  return o;
}
function Nh(t, e, n, o, s, r) {
  return {
    [Gf]: Ah(t ?? "langchain"),
    [pd]: n,
    [Kf]: Ah(e),
    [je]: kh,
    ...Ch(o, s, r),
  };
}
function jh(t, e, n, o, s) {
  const r = s?.ls_provider;
  const i = o?.model ?? s?.ls_model_name ?? "unknown";
  const a = Nh(r, i, "pipeline", t, o, s);
  if (n && Array.isArray(e) && e.length > 0) {
    xh(a, fd, e.length);
    const t = e.map((t) => ({ role: "user", content: t }));
    xh(a, dd, Ah(t));
  }
  return a;
}
function Rh(t, e, n, o, s) {
  const r = s?.ls_provider ?? t.id?.[2];
  const i = o?.model ?? s?.ls_model_name ?? "unknown";
  const a = Nh(r, i, "chat", t, o, s);
  if (n && Array.isArray(e) && e.length > 0) {
    const t = Oh(e.flat());
    xh(a, fd, t.length);
    const n = am(t);
    xh(a, dd, Ah(n));
  }
  return a;
}
function Ph(t, e) {
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
  n.length > 0 && xh(e, _d, Ah(n));
}
function Mh(t, e) {
  if (!t) return;
  const n = t.tokenUsage;
  const o = t.usage;
  if (n) {
    Eh(e, cd, n.promptTokens);
    Eh(e, ud, n.completionTokens);
    Eh(e, ld, n.totalTokens);
  } else if (o) {
    Eh(e, cd, o.input_tokens);
    Eh(e, ud, o.output_tokens);
    const t = Number(o.input_tokens);
    const n = Number(o.output_tokens);
    const s = (Number.isNaN(t) ? 0 : t) + (Number.isNaN(n) ? 0 : n);
    s > 0 && Eh(e, ld, s);
    o.cache_creation_input_tokens !== void 0 &&
      Eh(e, Sd, o.cache_creation_input_tokens);
    o.cache_read_input_tokens !== void 0 &&
      Eh(e, kd, o.cache_read_input_tokens);
  }
}
function Dh(t, e) {
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
    o.length > 0 && xh(n, sd, Ah(o));
    Ph(t.generations, n);
    if (e) {
      const e = t.generations
        .flat()
        .map((t) => t.text ?? t.message?.content)
        .filter((t) => typeof t === "string");
      e.length > 0 && xh(n, md, Ah(e));
    }
  }
  Mh(t.llmOutput, n);
  const o = t.llmOutput;
  const s = t.generations?.[0]?.[0];
  const r = s?.message;
  const i = o?.model_name ?? o?.model ?? r?.response_metadata?.model_name;
  i && xh(n, rd, i);
  const a = o?.id ?? r?.id;
  a && xh(n, id, a);
  const c = o?.stop_reason ?? r?.response_metadata?.finish_reason;
  c && xh(n, ad, Ah(c));
  return n;
}
function Fh(t = {}) {
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
      const l = $h(a);
      const p = jh(t, n, e, l, c);
      const f = p[Kf];
      const d = p[pd];
      ss(
        {
          name: `${d} ${f}`,
          op: "gen_ai.pipeline",
          attributes: { ...p, [Ne]: "gen_ai.pipeline" },
        },
        (t) => {
          o.set(s, t);
          return t;
        },
      );
    },
    handleChatModelStart(t, n, s, r, i, a, c, u) {
      const l = $h(a);
      const p = Rh(t, n, e, l, c);
      const f = p[Kf];
      const d = p[pd];
      ss(
        {
          name: `${d} ${f}`,
          op: "gen_ai.chat",
          attributes: { ...p, [Ne]: "gen_ai.chat" },
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
        const o = Dh(t, n);
        o && c.setAttributes(o);
        s(e);
      }
    },
    handleLLMError(t, e) {
      const n = o.get(e);
      if (n?.isRecording()) {
        n.setStatus({ code: Ke, message: "llm_error" });
        s(e);
      }
      or(t, { mechanism: { handled: false, type: `${kh}.llm_error_handler` } });
    },
    handleChainStart(t, n, s, r) {
      const i = t.name || "unknown_chain";
      const a = { [je]: "auto.ai.langchain", "langchain.chain.name": i };
      e && (a["langchain.chain.inputs"] = JSON.stringify(n));
      ss(
        {
          name: `chain ${i}`,
          op: "gen_ai.invoke_agent",
          attributes: { ...a, [Ne]: "gen_ai.invoke_agent" },
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
        n.setStatus({ code: Ke, message: "chain_error" });
        s(e);
      }
      or(t, {
        mechanism: { handled: false, type: `${kh}.chain_error_handler` },
      });
    },
    handleToolStart(t, n, s, r) {
      const i = t.name || "unknown_tool";
      const a = { [je]: kh, "gen_ai.tool.name": i };
      e && (a["gen_ai.tool.input"] = n);
      ss(
        {
          name: `execute_tool ${i}`,
          op: "gen_ai.execute_tool",
          attributes: { ...a, [Ne]: "gen_ai.execute_tool" },
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
        n.setStatus({ code: Ke, message: "tool_error" });
        s(e);
      }
      or(t, {
        mechanism: { handled: false, type: `${kh}.tool_error_handler` },
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
const Lh = "LangGraph";
const qh = "auto.ai.langgraph";
function Uh(t) {
  if (!t || t.length === 0) return null;
  const e = [];
  for (const n of t)
    if (n && typeof n === "object") {
      const t = n.tool_calls;
      t && Array.isArray(t) && e.push(...t);
    }
  return e.length > 0 ? e : null;
}
function Jh(t) {
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
function zh(t, e) {
  const n = e;
  if (n.response_metadata && typeof n.response_metadata === "object") {
    const e = n.response_metadata;
    e.model_name &&
      typeof e.model_name === "string" &&
      t.setAttribute(rd, e.model_name);
    e.finish_reason &&
      typeof e.finish_reason === "string" &&
      t.setAttribute(sd, [e.finish_reason]);
  }
}
function Bh(t) {
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
function Wh(t, e, n) {
  const o = n;
  const s = o?.messages;
  if (!s || !Array.isArray(s)) return;
  const r = e?.length ?? 0;
  const i = s.length > r ? s.slice(r) : [];
  if (i.length === 0) return;
  const a = Uh(i);
  a && t.setAttribute(_d, JSON.stringify(a));
  const c = Oh(i);
  t.setAttribute(md, JSON.stringify(c));
  let u = 0;
  let l = 0;
  let p = 0;
  for (const e of i) {
    const n = Jh(e);
    u += n.inputTokens;
    l += n.outputTokens;
    p += n.totalTokens;
    zh(t, e);
  }
  u > 0 && t.setAttribute(cd, u);
  l > 0 && t.setAttribute(ud, l);
  p > 0 && t.setAttribute(ld, p);
}
function Vh(t, e) {
  return new Proxy(t, {
    apply(t, n, o) {
      return os(
        {
          op: "gen_ai.create_agent",
          name: "create_agent",
          attributes: {
            [je]: qh,
            [Ne]: "gen_ai.create_agent",
            [pd]: "create_agent",
          },
        },
        (s) => {
          try {
            const r = Reflect.apply(t, n, o);
            const i = o.length > 0 ? o[0] : {};
            if (i?.name && typeof i.name === "string") {
              s.setAttribute(yd, i.name);
              s.updateName(`create_agent ${i.name}`);
            }
            const a = r.invoke;
            a && typeof a === "function" && (r.invoke = Gh(a.bind(r), r, i, e));
            return r;
          } catch (t) {
            s.setStatus({ code: Ke, message: "internal_error" });
            or(t, {
              mechanism: { handled: false, type: "auto.ai.langgraph.error" },
            });
            throw t;
          }
        },
      );
    },
  });
}
function Gh(t, e, n, o) {
  return new Proxy(t, {
    apply(t, s, r) {
      return os(
        {
          op: "gen_ai.invoke_agent",
          name: "invoke_agent",
          attributes: { [je]: qh, [Ne]: Ed, [pd]: "invoke_agent" },
        },
        async (i) => {
          try {
            const a = n?.name;
            if (a && typeof a === "string") {
              i.setAttribute(bd, a);
              i.setAttribute(yd, a);
              i.updateName(`invoke_agent ${a}`);
            }
            const c = r.length > 1 ? r[1] : void 0;
            const u = c?.configurable;
            const l = u?.thread_id;
            l && typeof l === "string" && i.setAttribute(vd, l);
            const p = Bh(e);
            p && i.setAttribute(gd, JSON.stringify(p));
            const f = o.recordInputs;
            const d = o.recordOutputs;
            const m = r.length > 0 ? (r[0].messages ?? []) : [];
            if (m && f) {
              const t = Oh(m);
              const e = am(t);
              i.setAttributes({ [dd]: JSON.stringify(e), [fd]: t.length });
            }
            const g = await Reflect.apply(t, s, r);
            d && Wh(i, m ?? null, g);
            return g;
          } catch (t) {
            i.setStatus({ code: Ke, message: "internal_error" });
            or(t, {
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
 */ function Kh(t, e) {
  const n = e || {};
  t.compile = Vh(t.compile.bind(t), n);
  return t;
}
function Hh(t) {
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
const Zh = e;
/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */ function Yh() {
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
 */ function Xh() {
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
 */ function Qh() {
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
 */ function t_() {
  return "history" in Zh && !!Zh.history;
}
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ const e_ = n_;
function n_() {
  if (!("fetch" in Zh)) return false;
  try {
    new Headers();
    new Request("data:,");
    new Response();
    return true;
  } catch {
    return false;
  }
}
function o_(t) {
  return (
    t && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(t.toString())
  );
}
/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */ function s_() {
  if (typeof EdgeRuntime === "string") return true;
  if (!n_()) return false;
  if (o_(Zh.fetch)) return true;
  let e = false;
  const n = Zh.document;
  if (n && typeof n.createElement === "function")
    try {
      const t = n.createElement("iframe");
      t.hidden = true;
      n.head.appendChild(t);
      t.contentWindow?.fetch && (e = o_(t.contentWindow.fetch));
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
 */ function r_() {
  return "ReportingObserver" in Zh;
}
/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ function i_() {
  if (!n_()) return false;
  try {
    new Request("_", { referrerPolicy: "origin" });
    return true;
  } catch {
    return false;
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */ function a_(t, e) {
  const n = "fetch";
  j(n, t);
  P(n, () => u_(void 0, e));
}
function c_(t) {
  const e = "fetch-body-resolved";
  j(e, t);
  P(e, () => u_(p_));
}
function u_(t, n = false) {
  (n && !s_()) ||
    dt(e, "fetch", function (n) {
      return function (...o) {
        const s = new Error();
        const { method: r, url: i } = m_(o);
        const a = {
          args: o,
          fetchData: { method: r, url: i },
          startTimestamp: Xt() * 1e3,
          virtualError: s,
          headers: g_(o),
        };
        t || M("fetch", { ...a });
        return n.apply(e, o).then(
          async (e) => {
            t
              ? t(e)
              : M("fetch", { ...a, endTimestamp: Xt() * 1e3, response: e });
            return e;
          },
          (t) => {
            M("fetch", { ...a, endTimestamp: Xt() * 1e3, error: t });
            if (B(t) && t.stack === void 0) {
              t.stack = s.stack;
              mt(t, "framesToPop", 1);
            }
            const e = Te();
            const n = e?.getOptions().enhanceFetchErrorMessages ?? "always";
            const o = n !== false;
            if (
              o &&
              t instanceof TypeError &&
              (t.message === "Failed to fetch" ||
                t.message === "Load failed" ||
                t.message === "NetworkError when attempting to fetch resource.")
            )
              try {
                const e = new URL(a.fetchData.url);
                const o = e.host;
                n === "always"
                  ? (t.message = `${t.message} (${o})`)
                  : mt(t, "__sentry_fetch_url_host__", o);
              } catch {}
            throw t;
          },
        );
      };
    });
}
async function l_(t, e) {
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
function p_(t) {
  let e;
  try {
    e = t.clone();
  } catch {
    return;
  }
  l_(e, () => {
    M("fetch-body-resolved", { endTimestamp: Xt() * 1e3, response: t });
  });
}
function f_(t, e) {
  return !!t && typeof t === "object" && !!t[e];
}
function d_(t) {
  return typeof t === "string"
    ? t
    : t
      ? f_(t, "url")
        ? t.url
        : t.toString
          ? t.toString()
          : ""
      : "";
}
function m_(t) {
  if (t.length === 0) return { method: "GET", url: "" };
  if (t.length === 2) {
    const [e, n] = t;
    return {
      url: d_(e),
      method: f_(n, "method")
        ? String(n.method).toUpperCase()
        : it(e) && f_(e, "method")
          ? String(e.method).toUpperCase()
          : "GET",
    };
  }
  const e = t[0];
  return {
    url: d_(e),
    method: f_(e, "method") ? String(e.method).toUpperCase() : "GET",
  };
}
function g_(t) {
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
 */ function h_() {
  return (
    typeof __SENTRY_BROWSER_BUNDLE__ !== "undefined" &&
    !!__SENTRY_BROWSER_BUNDLE__
  );
}
function __() {
  return "npm";
}
/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */ function y_() {
  return (
    !h_() &&
    Object.prototype.toString.call(
      typeof process !== "undefined" ? process : 0,
    ) === "[object process]"
  );
}
/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */ function b_(t, e) {
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
 */ function v_(t, e = module) {
  let n;
  try {
    n = b_(e, t);
  } catch {}
  if (!n)
    try {
      const { cwd: o } = b_(e, "process");
      n = b_(e, `${o()}/node_modules/${t}`);
    } catch {}
  return n;
}
function S_() {
  return typeof window !== "undefined" && (!y_() || k_());
}
function k_() {
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
 */ function w_(t, e, n) {
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
function x_(t, e = false) {
  const n =
    e ||
    (t &&
      !t.startsWith("/") &&
      !t.match(/^[A-Z]:/) &&
      !t.startsWith(".") &&
      !t.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//));
  return !n && t !== void 0 && !t.includes("node_modules/");
}
function E_(t) {
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
        lineno: T_(i[3]),
        colno: T_(i[4]),
        in_app: x_(a || "", c),
      };
    }
    return s.match(e) ? { filename: s } : void 0;
  };
}
function A_(t) {
  return [90, E_(t)];
}
function T_(t) {
  return parseInt(t || "", 10) || void 0;
}
/**
 * A node.js watchdog timer
 * @param pollInterval The interval that we expect to get polled at
 * @param anrThreshold The threshold for when we consider ANR
 * @param callback The callback to call for ANR
 * @returns An object with `poll` and `enabled` functions {@link WatchdogReturn}
 */ function I_(t, e, n, o) {
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
function $_(t, e, n) {
  const o = e ? e.replace(/^file:\/\//, "") : void 0;
  const s = t.location.columnNumber ? t.location.columnNumber + 1 : void 0;
  const r = t.location.lineNumber ? t.location.lineNumber + 1 : void 0;
  return {
    filename: o,
    module: n(o),
    function: t.functionName || v,
    colno: s,
    lineno: r,
    in_app: o ? x_(o) : void 0,
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
function O_(t) {
  if (typeof EdgeRuntime !== "string") return;
  const n = e[Symbol.for("@vercel/request-context")];
  const o = n?.get?.();
  o?.waitUntil && o.waitUntil(t);
}
async function C_(t) {
  try {
    y.log("Flushing events...");
    await gr(t);
    y.log("Done flushing events");
  } catch (t) {
    y.log("Error while flushing events:\n", t);
  }
}
async function N_(t = {}) {
  const { timeout: n = 2e3 } = t;
  if (
    "cloudflareWaitUntil" in t &&
    typeof t?.cloudflareWaitUntil === "function"
  ) {
    t.cloudflareWaitUntil(C_(n));
    return;
  }
  if (
    "cloudflareCtx" in t &&
    typeof t.cloudflareCtx?.waitUntil === "function"
  ) {
    t.cloudflareCtx.waitUntil(C_(n));
    return;
  }
  if (e[Symbol.for("@vercel/request-context")]) {
    O_(C_(n));
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
  o && (await C_(n));
}
/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */ function j_(t) {
  return t.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
export {
  Fg as ANTHROPIC_AI_INTEGRATION_NAME,
  i as CONSOLE_LEVELS,
  Client,
  ao as DEFAULT_ENVIRONMENT,
  fi as DEFAULT_RETRY_AFTER,
  co as DEV_ENVIRONMENT,
  e as GLOBAL_OBJ,
  th as GOOGLE_GENAI_INTEGRATION_NAME,
  Sh as LANGCHAIN_INTEGRATION_NAME,
  Lh as LANGGRAPH_INTEGRATION_NAME,
  LRUMap,
  rn as MAX_BAGGAGE_STRING_LENGTH,
  ca as MULTIPLEXED_TRANSPORT_EXTRA_KEY,
  Zm as OPENAI_INTEGRATION_NAME,
  n as SDK_VERSION,
  qe as SEMANTIC_ATTRIBUTE_CACHE_HIT,
  Je as SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE,
  Ue as SEMANTIC_ATTRIBUTE_CACHE_KEY,
  Le as SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME,
  ze as SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD,
  Fe as SEMANTIC_ATTRIBUTE_PROFILE_ID,
  De as SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME,
  Re as SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON,
  Pe as SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT,
  Me as SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE,
  Ne as SEMANTIC_ATTRIBUTE_SENTRY_OP,
  je as SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  Ce as SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE,
  Oe as SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE,
  $e as SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  Be as SEMANTIC_ATTRIBUTE_URL_FULL,
  We as SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE,
  on as SENTRY_BAGGAGE_KEY_PREFIX,
  sn as SENTRY_BAGGAGE_KEY_PREFIX_REGEX,
  li as SENTRY_BUFFER_FULL_ERROR,
  Ke as SPAN_STATUS_ERROR,
  Ge as SPAN_STATUS_OK,
  Ve as SPAN_STATUS_UNSET,
  Scope,
  SentryError,
  SentryNonRecordingSpan,
  SentrySpan,
  ServerRuntimeClient,
  SyncPromise,
  wn as TRACEPARENT_REGEXP,
  _s as TRACING_DEFAULTS,
  v as UNKNOWN_FUNCTION,
  ul as _INTERNAL_FLAG_BUFFER_SIZE,
  ll as _INTERNAL_MAX_FLAGS_PER_SPAN,
  gl as _INTERNAL_addFeatureFlagToActiveSpan,
  Hr as _INTERNAL_captureLog,
  ii as _INTERNAL_captureMetric,
  Kr as _INTERNAL_captureSerializedLog,
  oi as _INTERNAL_captureSerializedMetric,
  Pm as _INTERNAL_cleanupToolCallSpan,
  ha as _INTERNAL_clearAiProviderSkips,
  fl as _INTERNAL_copyFlagsFromScopeToEvent,
  Gi as _INTERNAL_enhanceErrorWithSentryInfo,
  Zr as _INTERNAL_flushLogsBuffer,
  ai as _INTERNAL_flushMetricsBuffer,
  Rm as _INTERNAL_getSpanForToolCallId,
  dl as _INTERNAL_insertFlagToScope,
  It as _INTERNAL_safeDateNow,
  Tt as _INTERNAL_safeMathRandom,
  le as _INTERNAL_setSpanForScope,
  ga as _INTERNAL_shouldSkipAiProviderWrapping,
  ma as _INTERNAL_skipAiProviderWrapping,
  At as _INTERNAL_withRandomSafeContext,
  ja as addAutoIpAddressToSession,
  Na as addAutoIpAddressToUser,
  Qa as addBreadcrumb,
  Gn as addChildSpanToSpan,
  Vc as addConsoleInstrumentationHandler,
  Wt as addContextToFrame,
  br as addEventProcessor,
  Ut as addExceptionMechanism,
  qt as addExceptionTypeValue,
  c_ as addFetchEndInstrumentationHandler,
  a_ as addFetchInstrumentationHandler,
  F as addGlobalErrorInstrumentationHandler,
  U as addGlobalUnhandledRejectionInstrumentationHandler,
  j as addHandler,
  Mr as addIntegration,
  Ao as addItemToEnvelope,
  mt as addNonEnumerableProperty,
  Gm as addVercelAiProcessors,
  yc as applyAggregateErrorsToEvent,
  Ds as applyScopeDataToEvent,
  Ra as applySdkMetadata,
  an as baggageHeaderToDynamicSamplingContext,
  wu as basename,
  ee as browserPerformanceTimeOrigin,
  $_ as callFrameToStackFrame,
  dr as captureCheckIn,
  Yc as captureConsoleIntegration,
  rr as captureEvent,
  or as captureException,
  bf as captureFeedback,
  sr as captureMessage,
  wr as captureSession,
  Vt as checkOrSetAlreadyCaught,
  hr as close,
  se as closeSession,
  il as consoleIntegration,
  Pf as consoleLoggingIntegration,
  u as consoleSandbox,
  is as continueTrace,
  Dn as convertSpanLinksForEnvelope,
  _t as convertToPlainObject,
  Po as createAttachmentEnvelopeItem,
  Ji as createCheckInEnvelope,
  bi as createClientReportEnvelope,
  Jf as createConsolaReporter,
  Eo as createEnvelope,
  Jo as createEventEnvelope,
  Lo as createEventEnvelopeHeaders,
  Fh as createLangChainCallbackHandler,
  Uo as createSessionEnvelope,
  zo as createSpanEnvelope,
  Ro as createSpanEnvelopeItem,
  w as createStackParser,
  yi as createTransport,
  Ht as dateTimestampInSeconds,
  La as debounce,
  y as debug,
  eu as dedupeIntegration,
  Dr as defineIntegration,
  ku as dirname,
  mi as disabledUntil,
  St as dropUndefinedKeys,
  hn as dsnFromString,
  gn as dsnToString,
  cn as dynamicSamplingContextToSentryBaggageHeader,
  Sr as endSession,
  Io as envelopeContainsItemType,
  Do as envelopeItemTypeToDataCategory,
  j_ as escapeStringForRegex,
  ac as eventFiltersIntegration,
  ta as eventFromMessage,
  Qi as eventFromUnknownInput,
  Ki as exceptionFromError,
  lu as extraErrorDataIntegration,
  vt as extractExceptionKeysForMessage,
  Ya as extractQueryParamsFromUrl,
  xn as extractTraceparentData,
  hl as featureFlagsIntegration,
  x_ as filenameIsInApp,
  dt as fill,
  gr as flush,
  N_ as flushIfServerless,
  Ca as fmt,
  To as forEachEnvelopeItem,
  sc as functionToStringIntegration,
  An as generateSentryTraceHeader,
  ce as generateSpanId,
  ae as generateTraceId,
  Tn as generateTraceparentHeader,
  Yn as getActiveSpan,
  Hh as getBreadcrumbLogLevelFromHttpStatusCode,
  nn as getCapturedScopesOnSpan,
  Te as getClient,
  qs as getCombinedScopeData,
  ft as getComponentName,
  ke as getCurrentScope,
  Ms as getDebugImagesForResources,
  de as getDefaultCurrentScope,
  me as getDefaultIsolationScope,
  po as getDynamicSamplingContextFromClient,
  fo as getDynamicSamplingContextFromScope,
  mo as getDynamicSamplingContextFromSpan,
  Ir as getEnvelopeEndpointWithUrlEncodedAuth,
  Lt as getEventDescription,
  Ps as getFilenameToDebugIdMap,
  $c as getFilenameToMetadataMap,
  $ as getFramesFromEvent,
  I as getFunctionName,
  xe as getGlobalScope,
  r as getGlobalSingleton,
  ka as getHttpSpanDetailsFromUrlObject,
  Nr as getIntegrationsToSetup,
  we as getIsolationScope,
  pt as getLocationHref,
  o as getMainCarrier,
  ht as getOriginalFunction,
  $r as getReportDialogEndpoint,
  Zn as getRootSpan,
  __ as getSDKSource,
  Ea as getSanitizedUrlString,
  va as getSanitizedUrlStringFromUrlObject,
  Fo as getSdkMetadataForEnvelopeHeader,
  Hn as getSpanDescendants,
  He as getSpanStatusFromHttpCode,
  Bn as getStatusMessage,
  Ie as getTraceContextFromScope,
  Pa as getTraceData,
  Fa as getTraceMetaTags,
  _l as growthbookIntegration,
  Qo as handleCallbackErrors,
  no as hasSpansEnabled,
  Ua as headersToDict,
  ut as htmlTreeAsString,
  Ga as httpHeadersToSpanAttributes,
  za as httpRequestToRequestData,
  cc as inboundFiltersIntegration,
  na as initAndBind,
  Or as installedIntegrations,
  Qg as instrumentAnthropicAiClient,
  wl as instrumentFetchRequest,
  vh as instrumentGoogleGenAIClient,
  Kh as instrumentLangGraph,
  Ig as instrumentOpenAiClient,
  Vh as instrumentStateGraphCompile,
  qu as instrumentSupabaseClient,
  vu as isAbsolute,
  S_ as isBrowser,
  h_ as isBrowserBundle,
  G as isDOMError,
  K as isDOMException,
  tt as isElement,
  yr as isEnabled,
  B as isError,
  V as isErrorEvent,
  Q as isEvent,
  _r as isInitialized,
  st as isInstanceOf,
  Nt as isMatchingPattern,
  o_ as isNativeFunction,
  y_ as isNodeEnv,
  Z as isParameterizedString,
  X as isPlainObject,
  Y as isPrimitive,
  gi as isRateLimited,
  et as isRegExp,
  Aa as isSentryRequestUrl,
  H as isString,
  ot as isSyntheticEvent,
  nt as isThenable,
  ya as isURLObjectRelative,
  rt as isVueViewModel,
  Su as join,
  fr as lastEventId,
  Ac as linkedErrorsIntegration,
  v_ as loadModule,
  Wo as logSpanEnd,
  Bo as logSpanStart,
  Tf as logger,
  Sn as makeDsn,
  fa as makeMultiplexedTransport,
  aa as makeOfflineTransport,
  pi as makePromiseBuffer,
  ne as makeSession,
  gt as markFunctionWrapped,
  P as maybeInstrument,
  Fs as mergeScopeData,
  qf as metrics,
  Rc as moduleMetadataIntegration,
  E_ as node,
  A_ as nodeStackLineParser,
  ho as normalize,
  bu as normalizePath,
  _o as normalizeToSize,
  wo as normalizeUrlToBase,
  $s as notifyEventProcessors,
  pn as objectToBaggageHeader,
  xt as objectify,
  c as originalConsoleMethods,
  Oa as parameterize,
  un as parseBaggageHeader,
  jo as parseEnvelope,
  di as parseRetryAfterHeader,
  kn as parseSampleRate,
  Bt as parseSemver,
  Wi as parseStackFrames,
  ba as parseStringToURLObject,
  wa as parseUrl,
  Vs as prepareEvent,
  kl as profiler,
  En as propagationContextFromHeaders,
  eo as registerSpanErrorInstrumentation,
  Is as rejectedSyncPromise,
  yu as relative,
  w_ as replaceExports,
  zc as requestDataIntegration,
  R as resetInstrumentationHandlers,
  hu as resolve,
  Ts as resolvedSyncPromise,
  Eu as rewriteFramesIntegration,
  Ct as safeJoin,
  es as sampleSpan,
  Co as serializeEnvelope,
  ve as setAsyncContextStrategy,
  en as setCapturedScopesOnSpan,
  ir as setContext,
  oa as setCurrentClient,
  cr as setExtra,
  ar as setExtras,
  Ze as setHttpStatus,
  Vo as setMeasurement,
  lr as setTag,
  ur as setTags,
  pr as setUser,
  Kc as severityLevelFromString,
  $n as shouldContinueTrace,
  Ot as snipLine,
  zn as spanIsSampled,
  Fn as spanTimeInputToSeconds,
  go as spanToBaggageHeader,
  qn as spanToJSON,
  Rn as spanToTraceContext,
  Pn as spanToTraceHeader,
  x as stackParserFromStackParserOptions,
  ks as startIdleSpan,
  rs as startInactiveSpan,
  us as startNewTrace,
  vr as startSession,
  os as startSpan,
  ss as startSpanManual,
  jt as stringMatchesSomePattern,
  E as stripSentryFramesAndReverse,
  xa as stripUrlQueryAndFragment,
  zu as supabaseIntegration,
  Xh as supportsDOMError,
  Qh as supportsDOMException,
  Yh as supportsErrorEvent,
  e_ as supportsFetch,
  t_ as supportsHistory,
  s_ as supportsNativeFetch,
  i_ as supportsReferrerPolicy,
  r_ as supportsReportingObserver,
  cs as suppressTracing,
  Qu as thirdPartyErrorFilterIntegration,
  Go as timedEventsToMeasurements,
  Xt as timestampInSeconds,
  M as triggerHandlers,
  jl as trpcMiddleware,
  $t as truncate,
  hi as updateRateLimits,
  oe as updateSession,
  Qn as updateSpanName,
  Dt as uuid4,
  O_ as vercelWaitUntil,
  I_ as watchdogTimer,
  qa as winterCGHeadersToDict,
  Ja as winterCGRequestToRequestData,
  as as withActiveSpan,
  Ae as withIsolationScope,
  mr as withMonitor,
  Ee as withScope,
  yf as wrapMcpServerWithSentry,
  Xu as zodErrorsIntegration,
};
