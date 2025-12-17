// @sentry-internal/feedback@10.30.0 downloaded from https://ga.jspm.io/npm:@sentry-internal/feedback@10.30.0/build/npm/esm/index.js

import {
  GLOBAL_OBJ as e,
  getClient as n,
  getCurrentScope as t,
  captureFeedback as o,
  getLocationHref as r,
  addIntegration as i,
  debug as a,
  isBrowser as l,
  getIsolationScope as s,
  getGlobalScope as c,
} from "@sentry/core";
const u = e;
const _ = u.document;
const d = u.navigator;
const f = "Report a Bug";
const h = "Cancel";
const p = "Send Bug Report";
const m = "Confirm";
const g = "Report a Bug";
const b = "your.email@example.org";
const v = "Email";
const y = "What's the bug? What did you expect?";
const x = "Description";
const w = "Your Name";
const k = "Name";
const C = "Thank you for your report!";
const S = "(required)";
const E = "Add a screenshot";
const L = "Remove screenshot";
const F = "Highlight";
const T = "Hide";
const H = "Remove";
const N = "widget";
const M = "api";
const P = 5e3;
const R = (e, i = { includeReplay: true }) => {
  if (!e.message)
    throw new Error("Unable to submit feedback with empty message");
  const a = n();
  if (!a) throw new Error("No client setup, cannot send feedback.");
  e.tags && Object.keys(e.tags).length && t().setTags(e.tags);
  const l = o({ source: M, url: r(), ...e }, i);
  return new Promise((e, n) => {
    const t = setTimeout(
      () => n("Unable to determine if Feedback was correctly sent."),
      3e4,
    );
    const o = a.on("afterSendEvent", (r, i) => {
      if (r.event_id === l) {
        clearTimeout(t);
        o();
        return i?.statusCode && i.statusCode >= 200 && i.statusCode < 300
          ? e(l)
          : n(
              i?.statusCode === 403
                ? "Unable to send feedback. This could be because this domain is not in your list of allowed domains."
                : "Unable to send feedback. This could be because of network issues, or because you are using an ad-blocker.",
            );
      }
    });
  });
};
const D = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
function B() {
  return (
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      d.userAgent,
    ) &&
    !(
      /Macintosh/i.test(d.userAgent) &&
      d.maxTouchPoints &&
      d.maxTouchPoints > 1
    ) &&
    !!isSecureContext
  );
}
function $(e, n) {
  return {
    ...e,
    ...n,
    tags: { ...e.tags, ...n.tags },
    onFormOpen: () => {
      n.onFormOpen?.();
      e.onFormOpen?.();
    },
    onFormClose: () => {
      n.onFormClose?.();
      e.onFormClose?.();
    },
    onSubmitSuccess: (t, o) => {
      n.onSubmitSuccess?.(t, o);
      e.onSubmitSuccess?.(t, o);
    },
    onSubmitError: (t) => {
      n.onSubmitError?.(t);
      e.onSubmitError?.(t);
    },
    onFormSubmitted: () => {
      n.onFormSubmitted?.();
      e.onFormSubmitted?.();
    },
    themeDark: { ...e.themeDark, ...n.themeDark },
    themeLight: { ...e.themeLight, ...n.themeLight },
  };
}
function A(e) {
  const n = _.createElement("style");
  n.textContent =
    '\n.widget__actor {\n  position: fixed;\n  z-index: var(--z-index);\n  margin: var(--page-margin);\n  inset: var(--actor-inset);\n\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 16px;\n\n  font-family: inherit;\n  font-size: var(--font-size);\n  font-weight: 600;\n  line-height: 1.14em;\n  text-decoration: none;\n\n  background: var(--actor-background, var(--background));\n  border-radius: var(--actor-border-radius, 1.7em/50%);\n  border: var(--actor-border, var(--border));\n  box-shadow: var(--actor-box-shadow, var(--box-shadow));\n  color: var(--actor-color, var(--foreground));\n  fill: var(--actor-color, var(--foreground));\n  cursor: pointer;\n  opacity: 1;\n  transition: transform 0.2s ease-in-out;\n  transform: translate(0, 0) scale(1);\n}\n.widget__actor[aria-hidden="true"] {\n  opacity: 0;\n  pointer-events: none;\n  visibility: hidden;\n  transform: translate(0, 16px) scale(0.98);\n}\n\n.widget__actor:hover {\n  background: var(--actor-hover-background, var(--background));\n  filter: var(--interactive-filter);\n}\n\n.widget__actor svg {\n  width: 1.14em;\n  height: 1.14em;\n}\n\n@media (max-width: 600px) {\n  .widget__actor span {\n    display: none;\n  }\n}\n';
  e && n.setAttribute("nonce", e);
  return n;
}
function q(e, n) {
  Object.entries(n).forEach(([n, t]) => {
    e.setAttributeNS(null, n, t);
  });
  return e;
}
const U = 20;
const I = "http://www.w3.org/2000/svg";
function z() {
  const e = (e) => u.document.createElementNS(I, e);
  const n = q(e("svg"), {
    width: `${U}`,
    height: `${U}`,
    viewBox: `0 0 ${U} ${U}`,
    fill: "var(--actor-color, var(--foreground))",
  });
  const t = q(e("g"), { clipPath: "url(#clip0_57_80)" });
  const o = q(e("path"), {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M15.6622 15H12.3997C12.2129 14.9959 12.031 14.9396 11.8747 14.8375L8.04965 12.2H7.49956V19.1C7.4875 19.3348 7.3888 19.5568 7.22256 19.723C7.05632 19.8892 6.83435 19.9879 6.59956 20H2.04956C1.80193 19.9968 1.56535 19.8969 1.39023 19.7218C1.21511 19.5467 1.1153 19.3101 1.11206 19.0625V12.2H0.949652C0.824431 12.2017 0.700142 12.1783 0.584123 12.1311C0.468104 12.084 0.362708 12.014 0.274155 11.9255C0.185602 11.8369 0.115689 11.7315 0.0685419 11.6155C0.0213952 11.4995 -0.00202913 11.3752 -0.00034808 11.25V3.75C-0.00900498 3.62067 0.0092504 3.49095 0.0532651 3.36904C0.0972798 3.24712 0.166097 3.13566 0.255372 3.04168C0.344646 2.94771 0.452437 2.87327 0.571937 2.82307C0.691437 2.77286 0.82005 2.74798 0.949652 2.75H8.04965L11.8747 0.1625C12.031 0.0603649 12.2129 0.00407221 12.3997 0H15.6622C15.9098 0.00323746 16.1464 0.103049 16.3215 0.278167C16.4966 0.453286 16.5964 0.689866 16.5997 0.9375V3.25269C17.3969 3.42959 18.1345 3.83026 18.7211 4.41679C19.5322 5.22788 19.9878 6.32796 19.9878 7.47502C19.9878 8.62209 19.5322 9.72217 18.7211 10.5333C18.1345 11.1198 17.3969 11.5205 16.5997 11.6974V14.0125C16.6047 14.1393 16.5842 14.2659 16.5395 14.3847C16.4948 14.5035 16.4268 14.6121 16.3394 14.7042C16.252 14.7962 16.147 14.8698 16.0307 14.9206C15.9144 14.9714 15.7891 14.9984 15.6622 15ZM1.89695 10.325H1.88715V4.625H8.33715C8.52423 4.62301 8.70666 4.56654 8.86215 4.4625L12.6872 1.875H14.7247V13.125H12.6872L8.86215 10.4875C8.70666 10.3835 8.52423 10.327 8.33715 10.325H2.20217C2.15205 10.3167 2.10102 10.3125 2.04956 10.3125C1.9981 10.3125 1.94708 10.3167 1.89695 10.325ZM2.98706 12.2V18.1625H5.66206V12.2H2.98706ZM16.5997 9.93612V5.01393C16.6536 5.02355 16.7072 5.03495 16.7605 5.04814C17.1202 5.13709 17.4556 5.30487 17.7425 5.53934C18.0293 5.77381 18.2605 6.06912 18.4192 6.40389C18.578 6.73866 18.6603 7.10452 18.6603 7.47502C18.6603 7.84552 18.578 8.21139 18.4192 8.54616C18.2605 8.88093 18.0293 9.17624 17.7425 9.41071C17.4556 9.64518 17.1202 9.81296 16.7605 9.90191C16.7072 9.91509 16.6536 9.9265 16.5997 9.93612Z",
  });
  n.appendChild(t).appendChild(o);
  const r = e("defs");
  const i = q(e("clipPath"), { id: "clip0_57_80" });
  const a = q(e("rect"), { width: `${U}`, height: `${U}`, fill: "white" });
  i.appendChild(a);
  r.appendChild(i);
  n.appendChild(r).appendChild(i).appendChild(a);
  return n;
}
function V({ triggerLabel: e, triggerAriaLabel: n, shadow: t, styleNonce: o }) {
  const r = _.createElement("button");
  r.type = "button";
  r.className = "widget__actor";
  r.ariaHidden = "false";
  r.ariaLabel = n || e || f;
  r.appendChild(z());
  if (e) {
    const n = _.createElement("span");
    n.appendChild(_.createTextNode(e));
    r.appendChild(n);
  }
  const i = A(o);
  return {
    el: r,
    appendToDom() {
      t.appendChild(i);
      t.appendChild(r);
    },
    removeFromDom() {
      r.remove();
      i.remove();
    },
    show() {
      r.ariaHidden = "false";
    },
    hide() {
      r.ariaHidden = "true";
    },
  };
}
const W = "rgba(88, 74, 192, 1)";
const O = {
  foreground: "#2b2233",
  background: "#ffffff",
  accentForeground: "white",
  accentBackground: W,
  successColor: "#268d75",
  errorColor: "#df3338",
  border: "1.5px solid rgba(41, 35, 47, 0.13)",
  boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
  outline: "1px auto var(--accent-background)",
  interactiveFilter: "brightness(95%)",
};
const j = {
  foreground: "#ebe6ef",
  background: "#29232f",
  accentForeground: "white",
  accentBackground: W,
  successColor: "#2da98c",
  errorColor: "#f55459",
  border: "1.5px solid rgba(235, 230, 239, 0.15)",
  boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
  outline: "1px auto var(--accent-background)",
  interactiveFilter: "brightness(150%)",
};
function Z(e) {
  return `\n  --foreground: ${e.foreground};\n  --background: ${e.background};\n  --accent-foreground: ${e.accentForeground};\n  --accent-background: ${e.accentBackground};\n  --success-color: ${e.successColor};\n  --error-color: ${e.errorColor};\n  --border: ${e.border};\n  --box-shadow: ${e.boxShadow};\n  --outline: ${e.outline};\n  --interactive-filter: ${e.interactiveFilter};\n  `;
}
function Y({ colorScheme: e, themeDark: n, themeLight: t, styleNonce: o }) {
  const r = _.createElement("style");
  r.textContent = `\n:host {\n  --font-family: system-ui, 'Helvetica Neue', Arial, sans-serif;\n  --font-size: 14px;\n  --z-index: 100000;\n\n  --page-margin: 16px;\n  --inset: auto 0 0 auto;\n  --actor-inset: var(--inset);\n\n  font-family: var(--font-family);\n  font-size: var(--font-size);\n\n  ${e !== "system" ? "color-scheme: only light;" : ""}\n\n  ${Z(e === "dark" ? { ...j, ...n } : { ...O, ...t })}\n}\n\n${e === "system" ? `\n@media (prefers-color-scheme: dark) {\n  :host {\n    ${Z({ ...j, ...n })}\n  }\n}` : ""}\n}\n`;
  o && r.setAttribute("nonce", o);
  return r;
}
const G = ({
  lazyLoadIntegration: e,
  getModalIntegration: n,
  getScreenshotIntegration: t,
}) => {
  const o = ({
    id: o = "sentry-feedback",
    autoInject: r = true,
    showBranding: s = true,
    isEmailRequired: c = false,
    isNameRequired: u = false,
    showEmail: d = true,
    showName: N = true,
    enableScreenshot: M = true,
    useSentryUser: P = { email: "email", name: "username" },
    tags: A,
    styleNonce: q,
    scriptNonce: U,
    colorScheme: I = "system",
    themeLight: z = {},
    themeDark: W = {},
    addScreenshotButtonLabel: O = E,
    cancelButtonLabel: j = h,
    confirmButtonLabel: Z = m,
    emailLabel: G = v,
    emailPlaceholder: X = b,
    formTitle: J = g,
    isRequiredLabel: K = S,
    messageLabel: Q = x,
    messagePlaceholder: ee = y,
    nameLabel: ne = k,
    namePlaceholder: te = w,
    removeScreenshotButtonLabel: oe = L,
    submitButtonLabel: re = p,
    successMessageText: ie = C,
    triggerLabel: ae = f,
    triggerAriaLabel: le = "",
    highlightToolText: se = F,
    hideToolText: ce = T,
    removeHighlightText: ue = H,
    onFormOpen: _e,
    onFormClose: de,
    onSubmitSuccess: fe,
    onSubmitError: he,
    onFormSubmitted: pe,
  } = {}) => {
    const me = {
      id: o,
      autoInject: r,
      showBranding: s,
      isEmailRequired: c,
      isNameRequired: u,
      showEmail: d,
      showName: N,
      enableScreenshot: M,
      useSentryUser: P,
      tags: A,
      styleNonce: q,
      scriptNonce: U,
      colorScheme: I,
      themeDark: W,
      themeLight: z,
      triggerLabel: ae,
      triggerAriaLabel: le,
      cancelButtonLabel: j,
      submitButtonLabel: re,
      confirmButtonLabel: Z,
      formTitle: J,
      emailLabel: G,
      emailPlaceholder: X,
      messageLabel: Q,
      messagePlaceholder: ee,
      nameLabel: ne,
      namePlaceholder: te,
      successMessageText: ie,
      isRequiredLabel: K,
      addScreenshotButtonLabel: O,
      removeScreenshotButtonLabel: oe,
      highlightToolText: se,
      hideToolText: ce,
      removeHighlightText: ue,
      onFormClose: de,
      onFormOpen: _e,
      onSubmitError: he,
      onSubmitSuccess: fe,
      onFormSubmitted: pe,
    };
    let ge = null;
    let be = [];
    const ve = (e) => {
      if (!ge) {
        const n = _.createElement("div");
        n.id = String(e.id);
        _.body.appendChild(n);
        ge = n.attachShadow({ mode: "open" });
        ge.appendChild(Y(e));
      }
      return ge;
    };
    const ye = async (o) => {
      const r = o.enableScreenshot && B();
      let l;
      let s;
      try {
        const t = n ? n() : await e("feedbackModalIntegration", U);
        l = t();
        i(l);
      } catch {
        D &&
          a.error(
            "[Feedback] Error when trying to load feedback integrations. Try using `feedbackSyncIntegration` in your `Sentry.init`.",
          );
        throw new Error("[Feedback] Missing feedback modal integration!");
      }
      try {
        const n = r
          ? t
            ? t()
            : await e("feedbackScreenshotIntegration", U)
          : void 0;
        if (n) {
          s = n();
          i(s);
        }
      } catch {
        D &&
          a.error(
            "[Feedback] Missing feedback screenshot integration. Proceeding without screenshots.",
          );
      }
      const c = l.createDialog({
        options: {
          ...o,
          onFormClose: () => {
            c?.close();
            o.onFormClose?.();
          },
          onFormSubmitted: () => {
            c?.close();
            o.onFormSubmitted?.();
          },
        },
        screenshotIntegration: s,
        sendFeedback: R,
        shadow: ve(o),
      });
      return c;
    };
    const xe = (e, n = {}) => {
      const t = $(me, n);
      const o =
        typeof e === "string"
          ? _.querySelector(e)
          : typeof e.addEventListener === "function"
            ? e
            : null;
      if (!o) {
        D && a.error("[Feedback] Unable to attach to target element");
        throw new Error("Unable to attach to target element");
      }
      let r = null;
      const i = async () => {
        r ||
          (r = await ye({
            ...t,
            onFormSubmitted: () => {
              r?.removeFromDom();
              t.onFormSubmitted?.();
            },
          }));
        r.appendToDom();
        r.open();
      };
      o.addEventListener("click", i);
      const l = () => {
        be = be.filter((e) => e !== l);
        r?.removeFromDom();
        r = null;
        o.removeEventListener("click", i);
      };
      be.push(l);
      return l;
    };
    const we = (e = {}) => {
      const n = $(me, e);
      const t = ve(n);
      const o = V({
        triggerLabel: n.triggerLabel,
        triggerAriaLabel: n.triggerAriaLabel,
        shadow: t,
        styleNonce: q,
      });
      xe(o.el, {
        ...n,
        onFormOpen() {
          o.hide();
        },
        onFormClose() {
          o.show();
        },
        onFormSubmitted() {
          o.show();
        },
      });
      return o;
    };
    return {
      name: "Feedback",
      setupOnce() {
        l() &&
          me.autoInject &&
          (_.readyState === "loading"
            ? _.addEventListener("DOMContentLoaded", () => we().appendToDom())
            : we().appendToDom());
      },
      attachTo: xe,
      createWidget(e = {}) {
        const n = we($(me, e));
        n.appendToDom();
        return n;
      },
      async createForm(e = {}) {
        return ye($(me, e));
      },
      remove() {
        if (ge) {
          ge.parentElement?.remove();
          ge = null;
        }
        be.forEach((e) => e());
        be = [];
      },
    };
  };
  return o;
};
function X() {
  const e = n();
  return e?.getIntegrationByName("Feedback");
}
var J,
  K,
  Q,
  ee,
  ne,
  te,
  oe,
  re = {},
  ie = [],
  ae = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
  le = Array.isArray;
function se(e, n) {
  for (var t in n) e[t] = n[t];
  return e;
}
function ce(e) {
  var n = e.parentNode;
  n && n.removeChild(e);
}
function ue(e, n, t) {
  var o,
    r,
    i,
    a = {};
  for (i in n)
    "key" == i ? (o = n[i]) : "ref" == i ? (r = n[i]) : (a[i] = n[i]);
  if (
    (arguments.length > 2 &&
      (a.children = arguments.length > 3 ? J.call(arguments, 2) : t),
    "function" == typeof e && null != e.defaultProps)
  )
    for (i in e.defaultProps) void 0 === a[i] && (a[i] = e.defaultProps[i]);
  return _e(e, a, o, r, null);
}
function _e(e, n, t, o, r) {
  var i = {
    type: e,
    props: n,
    key: t,
    ref: o,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: null == r ? ++Q : r,
    __i: -1,
    __u: 0,
  };
  return null == r && null != K.vnode && K.vnode(i), i;
}
function de(e) {
  return e.children;
}
function fe(e, n) {
  (this.props = e), (this.context = n);
}
function he(e, n) {
  if (null == n) return e.__ ? he(e.__, e.__i + 1) : null;
  for (var t; n < e.__k.length; n++)
    if (null != (t = e.__k[n]) && null != t.__e) return t.__e;
  return "function" == typeof e.type ? he(e) : null;
}
function pe(e, n, t) {
  var o,
    r = e.__v,
    i = r.__e,
    a = e.__P;
  if (a)
    return (
      ((o = se({}, r)).__v = r.__v + 1),
      K.vnode && K.vnode(o),
      Le(
        a,
        o,
        r,
        e.__n,
        void 0 !== a.ownerSVGElement,
        32 & r.__u ? [i] : null,
        n,
        null == i ? he(r) : i,
        !!(32 & r.__u),
        t,
      ),
      (o.__.__k[o.__i] = o),
      (o.__d = void 0),
      o.__e != i && me(o),
      o
    );
}
function me(e) {
  var n, t;
  if (null != (e = e.__) && null != e.__c) {
    for (e.__e = e.__c.base = null, n = 0; n < e.__k.length; n++)
      if (null != (t = e.__k[n]) && null != t.__e) {
        e.__e = e.__c.base = t.__e;
        break;
      }
    return me(e);
  }
}
function ge(e) {
  ((!e.__d && (e.__d = true) && ee.push(e) && !be.__r++) ||
    ne !== K.debounceRendering) &&
    ((ne = K.debounceRendering) || te)(be);
}
function be() {
  var e,
    n,
    t,
    o = [],
    r = [];
  for (ee.sort(oe); (e = ee.shift()); )
    e.__d &&
      ((t = ee.length),
      (n = pe(e, o, r) || n),
      0 === t || ee.length > t
        ? (Fe(o, n, r), (r.length = o.length = 0), (n = void 0), ee.sort(oe))
        : n && K.__c && K.__c(n, ie));
  n && Fe(o, n, r), (be.__r = 0);
}
function ve(e, n, t, o, r, i, a, l, s, c, u) {
  var _,
    d,
    f,
    h,
    p,
    m = (o && o.__k) || ie,
    g = n.length;
  for (t.__d = s, ye(t, n, m), s = t.__d, _ = 0; _ < g; _++)
    null != (f = t.__k[_]) &&
      "boolean" != typeof f &&
      "function" != typeof f &&
      ((d = -1 === f.__i ? re : m[f.__i] || re),
      (f.__i = _),
      Le(e, f, d, r, i, a, l, s, c, u),
      (h = f.__e),
      f.ref &&
        d.ref != f.ref &&
        (d.ref && He(d.ref, null, f), u.push(f.ref, f.__c || h, f)),
      null == p && null != h && (p = h),
      65536 & f.__u || d.__k === f.__k
        ? (s = xe(f, s, e))
        : "function" == typeof f.type && void 0 !== f.__d
          ? (s = f.__d)
          : h && (s = h.nextSibling),
      (f.__d = void 0),
      (f.__u &= -196609));
  (t.__d = s), (t.__e = p);
}
function ye(e, n, t) {
  var o,
    r,
    i,
    a,
    l,
    s = n.length,
    c = t.length,
    u = c,
    _ = 0;
  for (e.__k = [], o = 0; o < s; o++)
    null !=
    (r = e.__k[o] =
      null == (r = n[o]) || "boolean" == typeof r || "function" == typeof r
        ? null
        : "string" == typeof r ||
            "number" == typeof r ||
            "bigint" == typeof r ||
            r.constructor == String
          ? _e(null, r, null, null, r)
          : le(r)
            ? _e(de, { children: r }, null, null, null)
            : void 0 === r.constructor && r.__b > 0
              ? _e(r.type, r.props, r.key, r.ref ? r.ref : null, r.__v)
              : r)
      ? ((r.__ = e),
        (r.__b = e.__b + 1),
        (l = we(r, t, (a = o + _), u)),
        (r.__i = l),
        (i = null),
        -1 !== l && (u--, (i = t[l]) && (i.__u |= 131072)),
        null == i || null === i.__v
          ? (-1 == l && _--, "function" != typeof r.type && (r.__u |= 65536))
          : l !== a &&
            (l === a + 1
              ? _++
              : l > a
                ? u > s - a
                  ? (_ += l - a)
                  : _--
                : (_ = l < a && l == a - 1 ? l - a : 0),
            l !== o + _ && (r.__u |= 65536)))
      : (i = t[o]) &&
        null == i.key &&
        i.__e &&
        (i.__e == e.__d && (e.__d = he(i)),
        Ne(i, i, false),
        (t[o] = null),
        u--);
  if (u)
    for (o = 0; o < c; o++)
      null != (i = t[o]) &&
        0 == (131072 & i.__u) &&
        (i.__e == e.__d && (e.__d = he(i)), Ne(i, i));
}
function xe(e, n, t) {
  var o, r;
  if ("function" == typeof e.type) {
    for (o = e.__k, r = 0; o && r < o.length; r++)
      o[r] && ((o[r].__ = e), (n = xe(o[r], n, t)));
    return n;
  }
  e.__e != n && (t.insertBefore(e.__e, n || null), (n = e.__e));
  do {
    n = n && n.nextSibling;
  } while (null != n && 8 === n.nodeType);
  return n;
}
function we(e, n, t, o) {
  var r = e.key,
    i = e.type,
    a = t - 1,
    l = t + 1,
    s = n[t];
  if (null === s || (s && r == s.key && i === s.type)) return t;
  if (o > (null != s && 0 == (131072 & s.__u) ? 1 : 0))
    for (; a >= 0 || l < n.length; ) {
      if (a >= 0) {
        if ((s = n[a]) && 0 == (131072 & s.__u) && r == s.key && i === s.type)
          return a;
        a--;
      }
      if (l < n.length) {
        if ((s = n[l]) && 0 == (131072 & s.__u) && r == s.key && i === s.type)
          return l;
        l++;
      }
    }
  return -1;
}
function ke(e, n, t) {
  "-" === n[0]
    ? e.setProperty(n, null == t ? "" : t)
    : (e[n] =
        null == t ? "" : "number" != typeof t || ae.test(n) ? t : t + "px");
}
function Ce(e, n, t, o, r) {
  var i;
  e: if ("style" === n)
    if ("string" == typeof t) e.style.cssText = t;
    else {
      if (("string" == typeof o && (e.style.cssText = o = ""), o))
        for (n in o) (t && n in t) || ke(e.style, n, "");
      if (t) for (n in t) (o && t[n] === o[n]) || ke(e.style, n, t[n]);
    }
  else if ("o" === n[0] && "n" === n[1])
    (i = n !== (n = n.replace(/(PointerCapture)$|Capture$/i, "$1"))),
      (n = n.toLowerCase() in e ? n.toLowerCase().slice(2) : n.slice(2)),
      e.l || (e.l = {}),
      (e.l[n + i] = t),
      t
        ? o
          ? (t.u = o.u)
          : ((t.u = Date.now()), e.addEventListener(n, i ? Ee : Se, i))
        : e.removeEventListener(n, i ? Ee : Se, i);
  else {
    if (r) n = n.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (
      "width" !== n &&
      "height" !== n &&
      "href" !== n &&
      "list" !== n &&
      "form" !== n &&
      "tabIndex" !== n &&
      "download" !== n &&
      "rowSpan" !== n &&
      "colSpan" !== n &&
      "role" !== n &&
      n in e
    )
      try {
        e[n] = null == t ? "" : t;
        break e;
      } catch (e) {}
    "function" == typeof t ||
      (null == t || (false === t && "-" !== n[4])
        ? e.removeAttribute(n)
        : e.setAttribute(n, t));
  }
}
function Se(e) {
  if (this.l) {
    var n = this.l[e.type + false];
    if (e.t) {
      if (e.t <= n.u) return;
    } else e.t = Date.now();
    return n(K.event ? K.event(e) : e);
  }
}
function Ee(e) {
  if (this.l) return this.l[e.type + true](K.event ? K.event(e) : e);
}
function Le(e, n, t, o, r, i, a, l, s, c) {
  var u,
    _,
    d,
    f,
    h,
    p,
    m,
    g,
    b,
    v,
    y,
    x,
    w,
    k,
    C,
    S = n.type;
  if (void 0 !== n.constructor) return null;
  128 & t.__u && ((s = !!(32 & t.__u)), (i = [(l = n.__e = t.__e)])),
    (u = K.__b) && u(n);
  e: if ("function" == typeof S)
    try {
      if (
        ((g = n.props),
        (b = (u = S.contextType) && o[u.__c]),
        (v = u ? (b ? b.props.value : u.__) : o),
        t.__c
          ? (m = (_ = n.__c = t.__c).__ = _.__E)
          : ("prototype" in S && S.prototype.render
              ? (n.__c = _ = new S(g, v))
              : ((n.__c = _ = new fe(g, v)),
                (_.constructor = S),
                (_.render = Me)),
            b && b.sub(_),
            (_.props = g),
            _.state || (_.state = {}),
            (_.context = v),
            (_.__n = o),
            (d = _.__d = !0),
            (_.__h = []),
            (_._sb = [])),
        null == _.__s && (_.__s = _.state),
        null != S.getDerivedStateFromProps &&
          (_.__s == _.state && (_.__s = se({}, _.__s)),
          se(_.__s, S.getDerivedStateFromProps(g, _.__s))),
        (f = _.props),
        (h = _.state),
        (_.__v = n),
        d)
      )
        null == S.getDerivedStateFromProps &&
          null != _.componentWillMount &&
          _.componentWillMount(),
          null != _.componentDidMount && _.__h.push(_.componentDidMount);
      else {
        if (
          (null == S.getDerivedStateFromProps &&
            g !== f &&
            null != _.componentWillReceiveProps &&
            _.componentWillReceiveProps(g, v),
          !_.__e &&
            ((null != _.shouldComponentUpdate &&
              !1 === _.shouldComponentUpdate(g, _.__s, v)) ||
              n.__v === t.__v))
        ) {
          for (
            n.__v !== t.__v && ((_.props = g), (_.state = _.__s), (_.__d = !1)),
              n.__e = t.__e,
              n.__k = t.__k,
              n.__k.forEach(function (e) {
                e && (e.__ = n);
              }),
              y = 0;
            y < _._sb.length;
            y++
          )
            _.__h.push(_._sb[y]);
          (_._sb = []), _.__h.length && a.push(_);
          break e;
        }
        null != _.componentWillUpdate && _.componentWillUpdate(g, _.__s, v),
          null != _.componentDidUpdate &&
            _.__h.push(function () {
              _.componentDidUpdate(f, h, p);
            });
      }
      if (
        ((_.context = v),
        (_.props = g),
        (_.__P = e),
        (_.__e = !1),
        (x = K.__r),
        (w = 0),
        "prototype" in S && S.prototype.render)
      ) {
        for (
          _.state = _.__s,
            _.__d = !1,
            x && x(n),
            u = _.render(_.props, _.state, _.context),
            k = 0;
          k < _._sb.length;
          k++
        )
          _.__h.push(_._sb[k]);
        _._sb = [];
      } else
        do {
          (_.__d = !1),
            x && x(n),
            (u = _.render(_.props, _.state, _.context)),
            (_.state = _.__s);
        } while (_.__d && ++w < 25);
      (_.state = _.__s),
        null != _.getChildContext && (o = se(se({}, o), _.getChildContext())),
        d ||
          null == _.getSnapshotBeforeUpdate ||
          (p = _.getSnapshotBeforeUpdate(f, h)),
        ve(
          e,
          le(
            (C =
              null != u && u.type === de && null == u.key
                ? u.props.children
                : u),
          )
            ? C
            : [C],
          n,
          t,
          o,
          r,
          i,
          a,
          l,
          s,
          c,
        ),
        (_.base = n.__e),
        (n.__u &= -161),
        _.__h.length && a.push(_),
        m && (_.__E = _.__ = null);
    } catch (e) {
      (n.__v = null),
        s || null != i
          ? ((n.__e = l), (n.__u |= s ? 160 : 32), (i[i.indexOf(l)] = null))
          : ((n.__e = t.__e), (n.__k = t.__k)),
        K.__e(e, n, t);
    }
  else
    null == i && n.__v === t.__v
      ? ((n.__k = t.__k), (n.__e = t.__e))
      : (n.__e = Te(t.__e, n, t, o, r, i, a, s, c));
  (u = K.diffed) && u(n);
}
function Fe(e, n, t) {
  for (var o = 0; o < t.length; o++) He(t[o], t[++o], t[++o]);
  K.__c && K.__c(n, e),
    e.some(function (n) {
      try {
        (e = n.__h),
          (n.__h = []),
          e.some(function (e) {
            e.call(n);
          });
      } catch (e) {
        K.__e(e, n.__v);
      }
    });
}
function Te(e, n, t, o, r, i, a, l, s) {
  var c,
    u,
    _,
    d,
    f,
    h,
    p,
    m = t.props,
    g = n.props,
    b = n.type;
  if (("svg" === b && (r = true), null != i))
    for (c = 0; c < i.length; c++)
      if (
        (f = i[c]) &&
        "setAttribute" in f == !!b &&
        (b ? f.localName === b : 3 === f.nodeType)
      ) {
        (e = f), (i[c] = null);
        break;
      }
  if (null == e) {
    if (null === b) return document.createTextNode(g);
    (e = r
      ? document.createElementNS("http://www.w3.org/2000/svg", b)
      : document.createElement(b, g.is && g)),
      (i = null),
      (l = false);
  }
  if (null === b) m === g || (l && e.data === g) || (e.data = g);
  else {
    if (((i = i && J.call(e.childNodes)), (m = t.props || re), !l && null != i))
      for (m = {}, c = 0; c < e.attributes.length; c++)
        m[(f = e.attributes[c]).name] = f.value;
    for (c in m)
      (f = m[c]),
        "children" == c ||
          ("dangerouslySetInnerHTML" == c
            ? (_ = f)
            : "key" === c || c in g || Ce(e, c, null, f, r));
    for (c in g)
      (f = g[c]),
        "children" == c
          ? (d = f)
          : "dangerouslySetInnerHTML" == c
            ? (u = f)
            : "value" == c
              ? (h = f)
              : "checked" == c
                ? (p = f)
                : "key" === c ||
                  (l && "function" != typeof f) ||
                  m[c] === f ||
                  Ce(e, c, f, m[c], r);
    if (u)
      l ||
        (_ && (u.__html === _.__html || u.__html === e.innerHTML)) ||
        (e.innerHTML = u.__html),
        (n.__k = []);
    else if (
      (_ && (e.innerHTML = ""),
      ve(
        e,
        le(d) ? d : [d],
        n,
        t,
        o,
        r && "foreignObject" !== b,
        i,
        a,
        i ? i[0] : t.__k && he(t, 0),
        l,
        s,
      ),
      null != i)
    )
      for (c = i.length; c--; ) null != i[c] && ce(i[c]);
    l ||
      ((c = "value"),
      void 0 !== h &&
        (h !== e[c] ||
          ("progress" === b && !h) ||
          ("option" === b && h !== m[c])) &&
        Ce(e, c, h, m[c], false),
      (c = "checked"),
      void 0 !== p && p !== e[c] && Ce(e, c, p, m[c], false));
  }
  return e;
}
function He(e, n, t) {
  try {
    "function" == typeof e ? e(n) : (e.current = n);
  } catch (e) {
    K.__e(e, t);
  }
}
function Ne(e, n, t) {
  var o, r;
  if (
    (K.unmount && K.unmount(e),
    (o = e.ref) && ((o.current && o.current !== e.__e) || He(o, null, n)),
    null != (o = e.__c))
  ) {
    if (o.componentWillUnmount)
      try {
        o.componentWillUnmount();
      } catch (e) {
        K.__e(e, n);
      }
    (o.base = o.__P = null), (e.__c = void 0);
  }
  if ((o = e.__k))
    for (r = 0; r < o.length; r++)
      o[r] && Ne(o[r], n, t || "function" != typeof e.type);
  t || null == e.__e || ce(e.__e), (e.__ = e.__e = e.__d = void 0);
}
function Me(e, n, t) {
  return this.constructor(e, t);
}
function Pe(e, n, t) {
  var o, r, i, a;
  K.__ && K.__(e, n),
    (r = (o = false) ? null : n.__k),
    (i = []),
    (a = []),
    Le(
      n,
      (e = n.__k = ue(de, null, [e])),
      r || re,
      re,
      void 0 !== n.ownerSVGElement,
      r ? null : n.firstChild ? J.call(n.childNodes) : null,
      i,
      r ? r.__e : n.firstChild,
      o,
      a,
    ),
    (e.__d = void 0),
    Fe(i, e, a);
}
(J = ie.slice),
  (K = {
    __e: function (e, n, t, o) {
      for (var r, i, a; (n = n.__); )
        if ((r = n.__c) && !r.__)
          try {
            if (
              ((i = r.constructor) &&
                null != i.getDerivedStateFromError &&
                (r.setState(i.getDerivedStateFromError(e)), (a = r.__d)),
              null != r.componentDidCatch &&
                (r.componentDidCatch(e, o || {}), (a = r.__d)),
              a)
            )
              return (r.__E = r);
          } catch (n) {
            e = n;
          }
      throw e;
    },
  }),
  (Q = 0),
  (fe.prototype.setState = function (e, n) {
    var t;
    (t =
      null != this.__s && this.__s !== this.state
        ? this.__s
        : (this.__s = se({}, this.state))),
      "function" == typeof e && (e = e(se({}, t), this.props)),
      e && se(t, e),
      null != e && this.__v && (n && this._sb.push(n), ge(this));
  }),
  (fe.prototype.forceUpdate = function (e) {
    this.__v && ((this.__e = true), e && this.__h.push(e), ge(this));
  }),
  (fe.prototype.render = de),
  (ee = []),
  (te =
    "function" == typeof Promise
      ? Promise.prototype.then.bind(Promise.resolve())
      : setTimeout),
  (oe = function (e, n) {
    return e.__v.__b - n.__v.__b;
  }),
  (be.__r = 0);
var Re,
  De,
  Be,
  $e,
  Ae = 0,
  qe = [],
  Ue = [],
  Ie = K,
  ze = Ie.__b,
  Ve = Ie.__r,
  We = Ie.diffed,
  Oe = Ie.__c,
  je = Ie.unmount,
  Ze = Ie.__;
function Ye(e, n) {
  Ie.__h && Ie.__h(De, e, Ae || n), (Ae = 0);
  var t = De.__H || (De.__H = { __: [], __h: [] });
  return e >= t.__.length && t.__.push({ __V: Ue }), t.__[e];
}
function Ge(e) {
  return (Ae = 1), Xe(hn, e);
}
function Xe(e, n, t) {
  var o = Ye(Re++, 2);
  if (
    ((o.t = e),
    !o.__c &&
      ((o.__ = [
        t ? t(n) : hn(void 0, n),
        function (e) {
          var n = o.__N ? o.__N[0] : o.__[0],
            t = o.t(n, e);
          n !== t && ((o.__N = [t, o.__[1]]), o.__c.setState({}));
        },
      ]),
      (o.__c = De),
      !De.u))
  ) {
    var r = function (e, n, t) {
      if (!o.__c.__H) return true;
      var r = o.__c.__H.__.filter(function (e) {
        return !!e.__c;
      });
      if (
        r.every(function (e) {
          return !e.__N;
        })
      )
        return !i || i.call(this, e, n, t);
      var a = false;
      return (
        r.forEach(function (e) {
          if (e.__N) {
            var n = e.__[0];
            (e.__ = e.__N), (e.__N = void 0), n !== e.__[0] && (a = true);
          }
        }),
        !(!a && o.__c.props === e) && (!i || i.call(this, e, n, t))
      );
    };
    De.u = true;
    var i = De.shouldComponentUpdate,
      a = De.componentWillUpdate;
    (De.componentWillUpdate = function (e, n, t) {
      if (this.__e) {
        var o = i;
        (i = void 0), r(e, n, t), (i = o);
      }
      a && a.call(this, e, n, t);
    }),
      (De.shouldComponentUpdate = r);
  }
  return o.__N || o.__;
}
function Je(e, n) {
  var t = Ye(Re++, 3);
  !Ie.__s && fn(t.__H, n) && ((t.__ = e), (t.i = n), De.__H.__h.push(t));
}
function Ke(e, n) {
  var t = Ye(Re++, 4);
  !Ie.__s && fn(t.__H, n) && ((t.__ = e), (t.i = n), De.__h.push(t));
}
function Qe(e) {
  return (
    (Ae = 5),
    nn(function () {
      return { current: e };
    }, [])
  );
}
function en(e, n, t) {
  (Ae = 6),
    Ke(
      function () {
        return "function" == typeof e
          ? (e(n()),
            function () {
              return e(null);
            })
          : e
            ? ((e.current = n()),
              function () {
                return (e.current = null);
              })
            : void 0;
      },
      null == t ? t : t.concat(e),
    );
}
function nn(e, n) {
  var t = Ye(Re++, 7);
  return fn(t.__H, n) ? ((t.__V = e()), (t.i = n), (t.__h = e), t.__V) : t.__;
}
function tn(e, n) {
  return (
    (Ae = 8),
    nn(function () {
      return e;
    }, n)
  );
}
function on(e) {
  var n = De.context[e.__c],
    t = Ye(Re++, 9);
  return (
    (t.c = e),
    n ? (null == t.__ && ((t.__ = true), n.sub(De)), n.props.value) : e.__
  );
}
function rn(e, n) {
  Ie.useDebugValue && Ie.useDebugValue(n ? n(e) : e);
}
function an(e) {
  var n = Ye(Re++, 10),
    t = Ge();
  return (
    (n.__ = e),
    De.componentDidCatch ||
      (De.componentDidCatch = function (e, o) {
        n.__ && n.__(e, o), t[1](e);
      }),
    [
      t[0],
      function () {
        t[1](void 0);
      },
    ]
  );
}
function ln() {
  var e = Ye(Re++, 11);
  if (!e.__) {
    for (var n = De.__v; null !== n && !n.__m && null !== n.__; ) n = n.__;
    var t = n.__m || (n.__m = [0, 0]);
    e.__ = "P" + t[0] + "-" + t[1]++;
  }
  return e.__;
}
function sn() {
  for (var e; (e = qe.shift()); )
    if (e.__P && e.__H)
      try {
        e.__H.__h.forEach(_n), e.__H.__h.forEach(dn), (e.__H.__h = []);
      } catch (n) {
        (e.__H.__h = []), Ie.__e(n, e.__v);
      }
}
(Ie.__b = function (e) {
  (De = null), ze && ze(e);
}),
  (Ie.__ = function (e, n) {
    n.__k && n.__k.__m && (e.__m = n.__k.__m), Ze && Ze(e, n);
  }),
  (Ie.__r = function (e) {
    Ve && Ve(e), (Re = 0);
    var n = (De = e.__c).__H;
    n &&
      (Be === De
        ? ((n.__h = []),
          (De.__h = []),
          n.__.forEach(function (e) {
            e.__N && (e.__ = e.__N), (e.__V = Ue), (e.__N = e.i = void 0);
          }))
        : (n.__h.forEach(_n), n.__h.forEach(dn), (n.__h = []), (Re = 0))),
      (Be = De);
  }),
  (Ie.diffed = function (e) {
    We && We(e);
    var n = e.__c;
    n &&
      n.__H &&
      (n.__H.__h.length &&
        ((1 !== qe.push(n) && $e === Ie.requestAnimationFrame) ||
          (($e = Ie.requestAnimationFrame) || un)(sn)),
      n.__H.__.forEach(function (e) {
        e.i && (e.__H = e.i),
          e.__V !== Ue && (e.__ = e.__V),
          (e.i = void 0),
          (e.__V = Ue);
      })),
      (Be = De = null);
  }),
  (Ie.__c = function (e, n) {
    n.some(function (e) {
      try {
        e.__h.forEach(_n),
          (e.__h = e.__h.filter(function (e) {
            return !e.__ || dn(e);
          }));
      } catch (t) {
        n.some(function (e) {
          e.__h && (e.__h = []);
        }),
          (n = []),
          Ie.__e(t, e.__v);
      }
    }),
      Oe && Oe(e, n);
  }),
  (Ie.unmount = function (e) {
    je && je(e);
    var n,
      t = e.__c;
    t &&
      t.__H &&
      (t.__H.__.forEach(function (e) {
        try {
          _n(e);
        } catch (e) {
          n = e;
        }
      }),
      (t.__H = void 0),
      n && Ie.__e(n, t.__v));
  });
var cn = "function" == typeof requestAnimationFrame;
function un(e) {
  var n,
    t = function () {
      clearTimeout(o), cn && cancelAnimationFrame(n), setTimeout(e);
    },
    o = setTimeout(t, 100);
  cn && (n = requestAnimationFrame(t));
}
function _n(e) {
  var n = De,
    t = e.__c;
  "function" == typeof t && ((e.__c = void 0), t()), (De = n);
}
function dn(e) {
  var n = De;
  (e.__c = e.__()), (De = n);
}
function fn(e, n) {
  return (
    !e ||
    e.length !== n.length ||
    n.some(function (n, t) {
      return n !== e[t];
    })
  );
}
function hn(e, n) {
  return "function" == typeof n ? n(e) : n;
}
const pn = Object.defineProperty(
  {
    __proto__: null,
    useCallback: tn,
    useContext: on,
    useDebugValue: rn,
    useEffect: Je,
    useErrorBoundary: an,
    useId: ln,
    useImperativeHandle: en,
    useLayoutEffect: Ke,
    useMemo: nn,
    useReducer: Xe,
    useRef: Qe,
    useState: Ge,
  },
  Symbol.toStringTag,
  { value: "Module" },
);
const mn = "http://www.w3.org/2000/svg";
function gn() {
  const e = (e) => _.createElementNS(mn, e);
  const n = q(e("svg"), {
    width: "32",
    height: "30",
    viewBox: "0 0 72 66",
    fill: "inherit",
  });
  const t = q(e("path"), {
    transform: "translate(11, 11)",
    d: "M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z",
  });
  n.appendChild(t);
  return n;
}
function bn({ options: e }) {
  const n = nn(() => ({ __html: gn().outerHTML }), []);
  return ue(
    "h2",
    { class: "dialog__header" },
    ue("span", { class: "dialog__title" }, e.formTitle),
    e.showBranding
      ? ue("a", {
          class: "brand-link",
          target: "_blank",
          href: "https://sentry.io/welcome/",
          title: "Powered by Sentry",
          rel: "noopener noreferrer",
          dangerouslySetInnerHTML: n,
        })
      : null,
  );
}
function vn(e, n) {
  const t = [];
  n.isNameRequired && !e.name && t.push(n.nameLabel);
  n.isEmailRequired && !e.email && t.push(n.emailLabel);
  e.message || t.push(n.messageLabel);
  return t;
}
function yn(e, n) {
  const t = e.get(n);
  return typeof t === "string" ? t.trim() : "";
}
function xn({
  options: e,
  defaultEmail: n,
  defaultName: t,
  onFormClose: o,
  onSubmit: r,
  onSubmitSuccess: i,
  onSubmitError: l,
  showEmail: s,
  showName: c,
  screenshotInput: u,
}) {
  const {
    tags: _,
    addScreenshotButtonLabel: d,
    removeScreenshotButtonLabel: f,
    cancelButtonLabel: h,
    emailLabel: p,
    emailPlaceholder: m,
    isEmailRequired: g,
    isNameRequired: b,
    messageLabel: v,
    messagePlaceholder: y,
    nameLabel: x,
    namePlaceholder: w,
    submitButtonLabel: k,
    isRequiredLabel: C,
  } = e;
  const [S, E] = Ge(false);
  const [L, F] = Ge(null);
  const [T, H] = Ge(false);
  const M = u?.input;
  const [P, R] = Ge(null);
  const B = tn((e) => {
    R(e);
    H(false);
  }, []);
  const $ = tn(
    (e) => {
      const n = vn(e, {
        emailLabel: p,
        isEmailRequired: g,
        isNameRequired: b,
        messageLabel: v,
        nameLabel: x,
      });
      n.length > 0
        ? F(`Please enter in the following required fields: ${n.join(", ")}`)
        : F(null);
      return n.length === 0;
    },
    [p, g, b, v, x],
  );
  const A = tn(
    async (e) => {
      E(true);
      try {
        e.preventDefault();
        if (!(e.target instanceof HTMLFormElement)) return;
        const n = new FormData(e.target);
        const t = await (u && T ? u.value() : void 0);
        const o = {
          name: yn(n, "name"),
          email: yn(n, "email"),
          message: yn(n, "message"),
          attachments: t ? [t] : void 0,
        };
        if (!$(o)) return;
        try {
          const e = await r(
            {
              name: o.name,
              email: o.email,
              message: o.message,
              source: N,
              tags: _,
            },
            { attachments: o.attachments },
          );
          i(o, e);
        } catch (e) {
          D && a.error(e);
          F(e);
          l(e);
        }
      } finally {
        E(false);
      }
    },
    [u && T, i, l],
  );
  return ue(
    "form",
    { class: "form", onSubmit: A },
    M && T ? ue(M, { onError: B }) : null,
    ue(
      "fieldset",
      { class: "form__right", "data-sentry-feedback": true, disabled: S },
      ue(
        "div",
        { class: "form__top" },
        L ? ue("div", { class: "form__error-container" }, L) : null,
        c
          ? ue(
              "label",
              { for: "name", class: "form__label" },
              ue(wn, { label: x, isRequiredLabel: C, isRequired: b }),
              ue("input", {
                class: "form__input",
                defaultValue: t,
                id: "name",
                name: "name",
                placeholder: w,
                required: b,
                type: "text",
              }),
            )
          : ue("input", {
              "aria-hidden": true,
              value: t,
              name: "name",
              type: "hidden",
            }),
        s
          ? ue(
              "label",
              { for: "email", class: "form__label" },
              ue(wn, { label: p, isRequiredLabel: C, isRequired: g }),
              ue("input", {
                class: "form__input",
                defaultValue: n,
                id: "email",
                name: "email",
                placeholder: m,
                required: g,
                type: "email",
              }),
            )
          : ue("input", {
              "aria-hidden": true,
              value: n,
              name: "email",
              type: "hidden",
            }),
        ue(
          "label",
          { for: "message", class: "form__label" },
          ue(wn, { label: v, isRequiredLabel: C, isRequired: true }),
          ue("textarea", {
            autoFocus: true,
            class: "form__input form__input--textarea",
            id: "message",
            name: "message",
            placeholder: y,
            required: true,
            rows: 5,
          }),
        ),
        M
          ? ue(
              "label",
              { for: "screenshot", class: "form__label" },
              ue(
                "button",
                {
                  class: "btn btn--default",
                  disabled: S,
                  type: "button",
                  onClick: () => {
                    R(null);
                    H((e) => !e);
                  },
                },
                T ? f : d,
              ),
              P
                ? ue("div", { class: "form__error-container" }, P.message)
                : null,
            )
          : null,
      ),
      ue(
        "div",
        { class: "btn-group" },
        ue(
          "button",
          { class: "btn btn--primary", disabled: S, type: "submit" },
          k,
        ),
        ue(
          "button",
          {
            class: "btn btn--default",
            disabled: S,
            type: "button",
            onClick: o,
          },
          h,
        ),
      ),
    ),
  );
}
function wn({ label: e, isRequired: n, isRequiredLabel: t }) {
  return ue(
    "span",
    { class: "form__label__text" },
    e,
    n && ue("span", { class: "form__label__text--required" }, t),
  );
}
const kn = 16;
const Cn = 17;
const Sn = "http://www.w3.org/2000/svg";
function En() {
  const e = (e) => u.document.createElementNS(Sn, e);
  const n = q(e("svg"), {
    width: `${kn}`,
    height: `${Cn}`,
    viewBox: `0 0 ${kn} ${Cn}`,
    fill: "inherit",
  });
  const t = q(e("g"), { clipPath: "url(#clip0_57_156)" });
  const o = q(e("path"), {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M3.55544 15.1518C4.87103 16.0308 6.41775 16.5 8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.91775 15.5308 5.37103 14.6518 4.05544C13.7727 2.73985 12.5233 1.71447 11.0615 1.10897C9.59966 0.503466 7.99113 0.34504 6.43928 0.653721C4.88743 0.962403 3.46197 1.72433 2.34315 2.84315C1.22433 3.96197 0.462403 5.38743 0.153721 6.93928C-0.15496 8.49113 0.00346625 10.0997 0.608967 11.5615C1.21447 13.0233 2.23985 14.2727 3.55544 15.1518ZM4.40546 3.1204C5.46945 2.40946 6.72036 2.03 8 2.03C9.71595 2.03 11.3616 2.71166 12.575 3.92502C13.7883 5.13838 14.47 6.78405 14.47 8.5C14.47 9.77965 14.0905 11.0306 13.3796 12.0945C12.6687 13.1585 11.6582 13.9878 10.476 14.4775C9.29373 14.9672 7.99283 15.0953 6.73777 14.8457C5.48271 14.596 4.32987 13.9798 3.42502 13.075C2.52018 12.1701 1.90397 11.0173 1.65432 9.76224C1.40468 8.50718 1.5328 7.20628 2.0225 6.02404C2.5122 4.8418 3.34148 3.83133 4.40546 3.1204Z",
  });
  const r = q(e("path"), {
    d: "M6.68775 12.4297C6.78586 12.4745 6.89218 12.4984 7 12.5C7.11275 12.4955 7.22315 12.4664 7.32337 12.4145C7.4236 12.3627 7.51121 12.2894 7.58 12.2L12 5.63999C12.0848 5.47724 12.1071 5.28902 12.0625 5.11098C12.0178 4.93294 11.9095 4.77744 11.7579 4.67392C11.6064 4.57041 11.4221 4.52608 11.24 4.54931C11.0579 4.57254 10.8907 4.66173 10.77 4.79999L6.88 10.57L5.13 8.56999C5.06508 8.49566 4.98613 8.43488 4.89768 8.39111C4.80922 8.34735 4.713 8.32148 4.61453 8.31498C4.51605 8.30847 4.41727 8.32147 4.32382 8.35322C4.23038 8.38497 4.14413 8.43484 4.07 8.49999C3.92511 8.63217 3.83692 8.81523 3.82387 9.01092C3.81083 9.2066 3.87393 9.39976 4 9.54999L6.43 12.24C6.50187 12.3204 6.58964 12.385 6.68775 12.4297Z",
  });
  n.appendChild(t).append(r, o);
  const i = e("defs");
  const a = q(e("clipPath"), { id: "clip0_57_156" });
  const l = q(e("rect"), {
    width: `${kn}`,
    height: `${kn}`,
    fill: "white",
    transform: "translate(0 0.5)",
  });
  a.appendChild(l);
  i.appendChild(a);
  n.appendChild(i).appendChild(a).appendChild(l);
  return n;
}
function Ln({ open: e, onFormSubmitted: n, ...t }) {
  const o = t.options;
  const r = nn(() => ({ __html: En().outerHTML }), []);
  const [i, a] = Ge(null);
  const l = tn(() => {
    if (i) {
      clearTimeout(i);
      a(null);
    }
    n();
  }, [i]);
  const s = tn(
    (e, o) => {
      t.onSubmitSuccess(e, o);
      a(
        setTimeout(() => {
          n();
          a(null);
        }, P),
      );
    },
    [n],
  );
  return ue(
    de,
    null,
    i
      ? ue(
          "div",
          { class: "success__position", onClick: l },
          ue(
            "div",
            { class: "success__content" },
            o.successMessageText,
            ue("span", { class: "success__icon", dangerouslySetInnerHTML: r }),
          ),
        )
      : ue(
          "dialog",
          { class: "dialog", onClick: o.onFormClose, open: e },
          ue(
            "div",
            { class: "dialog__position" },
            ue(
              "div",
              {
                class: "dialog__content",
                onClick: (e) => {
                  e.stopPropagation();
                },
              },
              ue(bn, { options: o }),
              ue(xn, { ...t, onSubmitSuccess: s }),
            ),
          ),
        ),
  );
}
const Fn =
  "\n.dialog {\n  position: fixed;\n  z-index: var(--z-index);\n  margin: 0;\n  inset: 0;\n\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  height: 100vh;\n  width: 100vw;\n\n  color: var(--dialog-color, var(--foreground));\n  fill: var(--dialog-color, var(--foreground));\n  line-height: 1.75em;\n\n  background-color: rgba(0, 0, 0, 0.05);\n  border: none;\n  inset: 0;\n  opacity: 1;\n  transition: opacity 0.2s ease-in-out;\n}\n\n.dialog__position {\n  position: fixed;\n  z-index: var(--z-index);\n  inset: var(--dialog-inset);\n  padding: var(--page-margin);\n  display: flex;\n  max-height: calc(100vh - (2 * var(--page-margin)));\n}\n@media (max-width: 600px) {\n  .dialog__position {\n    inset: var(--page-margin);\n    padding: 0;\n  }\n}\n\n.dialog__position:has(.editor) {\n  inset: var(--page-margin);\n  padding: 0;\n}\n\n.dialog:not([open]) {\n  opacity: 0;\n  pointer-events: none;\n  visibility: hidden;\n}\n.dialog:not([open]) .dialog__content {\n  transform: translate(0, -16px) scale(0.98);\n}\n\n.dialog__content {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  padding: var(--dialog-padding, 24px);\n  max-width: 100%;\n  width: 100%;\n  max-height: 100%;\n  overflow: auto;\n\n  background: var(--dialog-background, var(--background));\n  border-radius: var(--dialog-border-radius, 20px);\n  border: var(--dialog-border, var(--border));\n  box-shadow: var(--dialog-box-shadow, var(--box-shadow));\n  transform: translate(0, 0) scale(1);\n  transition: transform 0.2s ease-in-out;\n}\n\n";
const Tn =
  "\n.dialog__header {\n  display: flex;\n  gap: 4px;\n  justify-content: space-between;\n  font-weight: var(--dialog-header-weight, 600);\n  margin: 0;\n}\n.dialog__title {\n  align-self: center;\n  width: var(--form-width, 272px);\n}\n\n@media (max-width: 600px) {\n  .dialog__title {\n    width: auto;\n  }\n}\n\n.dialog__position:has(.editor) .dialog__title {\n  width: auto;\n}\n\n\n.brand-link {\n  display: inline-flex;\n}\n.brand-link:focus-visible {\n  outline: var(--outline);\n}\n";
const Hn =
  "\n.form {\n  display: flex;\n  overflow: auto;\n  flex-direction: row;\n  gap: 16px;\n  flex: 1 0;\n}\n\n.form fieldset {\n  border: none;\n  margin: 0;\n  padding: 0;\n}\n\n.form__right {\n  flex: 0 0 auto;\n  display: flex;\n  overflow: auto;\n  flex-direction: column;\n  justify-content: space-between;\n  gap: 20px;\n  width: var(--form-width, 100%);\n}\n\n.dialog__position:has(.editor) .form__right {\n  width: var(--form-width, 272px);\n}\n\n.form__top {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.form__error-container {\n  color: var(--error-color);\n  fill: var(--error-color);\n}\n\n.form__label {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  margin: 0px;\n}\n\n.form__label__text {\n  display: flex;\n  gap: 4px;\n  align-items: center;\n}\n\n.form__label__text--required {\n  font-size: 0.85em;\n}\n\n.form__input {\n  font-family: inherit;\n  line-height: inherit;\n  background: transparent;\n  box-sizing: border-box;\n  border: var(--input-border, var(--border));\n  border-radius: var(--input-border-radius, 6px);\n  color: var(--input-color, inherit);\n  fill: var(--input-color, inherit);\n  font-size: var(--input-font-size, inherit);\n  font-weight: var(--input-font-weight, 500);\n  padding: 6px 12px;\n}\n\n.form__input::placeholder {\n  opacity: 0.65;\n  color: var(--input-placeholder-color, inherit);\n  filter: var(--interactive-filter);\n}\n\n.form__input:focus-visible {\n  outline: var(--input-focus-outline, var(--outline));\n}\n\n.form__input--textarea {\n  font-family: inherit;\n  resize: vertical;\n}\n\n.error {\n  color: var(--error-color);\n  fill: var(--error-color);\n}\n";
const Nn =
  "\n.btn-group {\n  display: grid;\n  gap: 8px;\n}\n\n.btn {\n  line-height: inherit;\n  border: var(--button-border, var(--border));\n  border-radius: var(--button-border-radius, 6px);\n  cursor: pointer;\n  font-family: inherit;\n  font-size: var(--button-font-size, inherit);\n  font-weight: var(--button-font-weight, 600);\n  padding: var(--button-padding, 6px 16px);\n}\n.btn[disabled] {\n  opacity: 0.6;\n  pointer-events: none;\n}\n\n.btn--primary {\n  color: var(--button-primary-color, var(--accent-foreground));\n  fill: var(--button-primary-color, var(--accent-foreground));\n  background: var(--button-primary-background, var(--accent-background));\n  border: var(--button-primary-border, var(--border));\n  border-radius: var(--button-primary-border-radius, 6px);\n  font-weight: var(--button-primary-font-weight, 500);\n}\n.btn--primary:hover {\n  color: var(--button-primary-hover-color, var(--accent-foreground));\n  fill: var(--button-primary-hover-color, var(--accent-foreground));\n  background: var(--button-primary-hover-background, var(--accent-background));\n  filter: var(--interactive-filter);\n}\n.btn--primary:focus-visible {\n  background: var(--button-primary-hover-background, var(--accent-background));\n  filter: var(--interactive-filter);\n  outline: var(--button-primary-focus-outline, var(--outline));\n}\n\n.btn--default {\n  color: var(--button-color, var(--foreground));\n  fill: var(--button-color, var(--foreground));\n  background: var(--button-background, var(--background));\n  border: var(--button-border, var(--border));\n  border-radius: var(--button-border-radius, 6px);\n  font-weight: var(--button-font-weight, 500);\n}\n.btn--default:hover {\n  color: var(--button-color, var(--foreground));\n  fill: var(--button-color, var(--foreground));\n  background: var(--button-hover-background, var(--background));\n  filter: var(--interactive-filter);\n}\n.btn--default:focus-visible {\n  background: var(--button-hover-background, var(--background));\n  filter: var(--interactive-filter);\n  outline: var(--button-focus-outline, var(--outline));\n}\n";
const Mn =
  "\n.success__position {\n  position: fixed;\n  inset: var(--dialog-inset);\n  padding: var(--page-margin);\n  z-index: var(--z-index);\n}\n.success__content {\n  background: var(--success-background, var(--background));\n  border: var(--success-border, var(--border));\n  border-radius: var(--success-border-radius, 1.7em/50%);\n  box-shadow: var(--success-box-shadow, var(--box-shadow));\n  font-weight: var(--success-font-weight, 600);\n  color: var(--success-color);\n  fill: var(--success-color);\n  padding: 12px 24px;\n  line-height: 1.75em;\n\n  display: grid;\n  align-items: center;\n  grid-auto-flow: column;\n  gap: 6px;\n  cursor: default;\n}\n\n.success__icon {\n  display: flex;\n}\n";
function Pn(e) {
  const n = _.createElement("style");
  n.textContent = `\n:host {\n  --dialog-inset: var(--inset);\n}\n\n${Fn}\n${Tn}\n${Hn}\n${Nn}\n${Mn}\n`;
  e && n.setAttribute("nonce", e);
  return n;
}
function Rn() {
  const e = t().getUser();
  const n = s().getUser();
  const o = c().getUser();
  return e && Object.keys(e).length ? e : n && Object.keys(n).length ? n : o;
}
const Dn = () => ({
  name: "FeedbackModal",
  setupOnce() {},
  createDialog: ({
    options: e,
    screenshotIntegration: t,
    sendFeedback: o,
    shadow: r,
  }) => {
    const i = r;
    const a = e.useSentryUser;
    const l = Rn();
    const s = _.createElement("div");
    const c = Pn(e.styleNonce);
    let u = "";
    const d = {
      get el() {
        return s;
      },
      appendToDom() {
        if (!i.contains(c) && !i.contains(s)) {
          i.appendChild(c);
          i.appendChild(s);
        }
      },
      removeFromDom() {
        s.remove();
        c.remove();
        _.body.style.overflow = u;
      },
      open() {
        h(true);
        e.onFormOpen?.();
        n()?.emit("openFeedbackWidget");
        u = _.body.style.overflow;
        _.body.style.overflow = "hidden";
      },
      close() {
        h(false);
        _.body.style.overflow = u;
      },
    };
    const f = t?.createInput({ h: ue, hooks: pn, dialog: d, options: e });
    const h = (n) => {
      Pe(
        ue(Ln, {
          options: e,
          screenshotInput: f,
          showName: e.showName || e.isNameRequired,
          showEmail: e.showEmail || e.isEmailRequired,
          defaultName: (a && l?.[a.name]) || "",
          defaultEmail: (a && l?.[a.email]) || "",
          onFormClose: () => {
            h(false);
            e.onFormClose?.();
          },
          onSubmit: o,
          onSubmitSuccess: (n, t) => {
            h(false);
            e.onSubmitSuccess?.(n, t);
          },
          onSubmitError: (n) => {
            e.onSubmitError?.(n);
          },
          onFormSubmitted: () => {
            e.onFormSubmitted?.();
          },
          open: n,
        }),
        s,
      );
    };
    return d;
  },
});
function Bn({ h: e }) {
  return function () {
    return e(
      "svg",
      {
        "data-test-id": "icon-close",
        viewBox: "0 0 16 16",
        fill: "#2B2233",
        height: "25px",
        width: "25px",
      },
      e("circle", { r: "7", cx: "8", cy: "8", fill: "white" }),
      e("path", {
        strokeWidth: "1.5",
        d: "M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM8,1.53A6.47,6.47,0,1,0,14.47,8,6.47,6.47,0,0,0,8,1.53Z",
      }),
      e("path", {
        strokeWidth: "1.5",
        d: "M5.34,11.41a.71.71,0,0,1-.53-.22.74.74,0,0,1,0-1.06l5.32-5.32a.75.75,0,0,1,1.06,1.06L5.87,11.19A.74.74,0,0,1,5.34,11.41Z",
      }),
      e("path", {
        strokeWidth: "1.5",
        d: "M10.66,11.41a.74.74,0,0,1-.53-.22L4.81,5.87A.75.75,0,0,1,5.87,4.81l5.32,5.32a.74.74,0,0,1,0,1.06A.71.71,0,0,1,10.66,11.41Z",
      }),
    );
  };
}
function $n(e) {
  const n = _.createElement("style");
  const t = "#1A141F";
  const o = "#302735";
  n.textContent = `\n.editor {\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n}\n\n.editor__image-container {\n  justify-items: center;\n  padding: 15px;\n  position: relative;\n  height: 100%;\n  border-radius: var(--menu-border-radius, 6px);\n\n  background-color: ${t};\n  background-image: repeating-linear-gradient(\n      -145deg,\n      transparent,\n      transparent 8px,\n      ${t} 8px,\n      ${t} 11px\n    ),\n    repeating-linear-gradient(\n      -45deg,\n      transparent,\n      transparent 15px,\n      ${o} 15px,\n      ${o} 16px\n    );\n}\n\n.editor__canvas-container {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.editor__canvas-container > * {\n  object-fit: contain;\n  position: absolute;\n}\n\n.editor__tool-container {\n  padding-top: 8px;\n  display: flex;\n  justify-content: center;\n}\n\n.editor__tool-bar {\n  display: flex;\n  gap: 8px;\n}\n\n.editor__tool {\n  display: flex;\n  padding: 8px 12px;\n  justify-content: center;\n  align-items: center;\n  border: var(--button-border, var(--border));\n  border-radius: var(--button-border-radius, 6px);\n  background: var(--button-background, var(--background));\n  color: var(--button-color, var(--foreground));\n}\n\n.editor__tool--active {\n  background: var(--button-primary-background, var(--accent-background));\n  color: var(--button-primary-color, var(--accent-foreground));\n}\n\n.editor__rect {\n  position: absolute;\n  z-index: 2;\n}\n\n.editor__rect button {\n  opacity: 0;\n  position: absolute;\n  top: -12px;\n  right: -12px;\n  cursor: pointer;\n  padding: 0;\n  z-index: 3;\n  border: none;\n  background: none;\n}\n\n.editor__rect:hover button {\n  opacity: 1;\n}\n`;
  e && n.setAttribute("nonce", e);
  return n;
}
function An({ h: e }) {
  return function ({ action: n, setAction: t, options: o }) {
    return e(
      "div",
      { class: "editor__tool-container" },
      e(
        "div",
        { class: "editor__tool-bar" },
        e(
          "button",
          {
            type: "button",
            class:
              "editor__tool " +
              (n === "highlight" ? "editor__tool--active" : ""),
            onClick: () => {
              t(n === "highlight" ? "" : "highlight");
            },
          },
          o.highlightToolText,
        ),
        e(
          "button",
          {
            type: "button",
            class:
              "editor__tool " + (n === "hide" ? "editor__tool--active" : ""),
            onClick: () => {
              t(n === "hide" ? "" : "hide");
            },
          },
          o.hideToolText,
        ),
      ),
    );
  };
}
function qn({ hooks: e }) {
  function n() {
    const [n, t] = e.useState(u.devicePixelRatio ?? 1);
    e.useEffect(() => {
      const e = () => {
        t(u.devicePixelRatio);
      };
      const n = matchMedia(`(resolution: ${u.devicePixelRatio}dppx)`);
      n.addEventListener("change", e);
      return () => {
        n.removeEventListener("change", e);
      };
    }, []);
    return n;
  }
  return function ({
    onBeforeScreenshot: t,
    onScreenshot: o,
    onAfterScreenshot: r,
    onError: i,
  }) {
    const a = n();
    e.useEffect(() => {
      const e = async () => {
        t();
        const e = await d.mediaDevices.getDisplayMedia({
          video: { width: u.innerWidth * a, height: u.innerHeight * a },
          audio: false,
          monitorTypeSurfaces: "exclude",
          preferCurrentTab: true,
          selfBrowserSurface: "include",
          surfaceSwitching: "exclude",
        });
        const n = _.createElement("video");
        await new Promise((t, r) => {
          n.srcObject = e;
          n.onloadedmetadata = () => {
            o(n, a);
            e.getTracks().forEach((e) => e.stop());
            t();
          };
          n.play().catch(r);
        });
        r();
      };
      e().catch(i);
    }, []);
  };
}
function Un(e, n, t) {
  switch (e.type) {
    case "highlight":
      n.shadowColor = "rgba(0, 0, 0, 0.7)";
      n.shadowBlur = 50;
      n.fillStyle = t;
      n.fillRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2);
      n.clearRect(e.x, e.y, e.w, e.h);
      break;
    case "hide":
      n.fillStyle = "rgb(0, 0, 0)";
      n.fillRect(e.x, e.y, e.w, e.h);
      break;
  }
}
function In(e, n, t) {
  if (!e) return;
  const o = e.getContext("2d", n);
  o && t(e, o);
}
function zn(e, n) {
  In(e, { alpha: true }, (e, t) => {
    t.drawImage(n, 0, 0, n.width, n.height, 0, 0, e.width, e.height);
  });
}
function Vn(e, n, t) {
  In(e, { alpha: true }, (e, o) => {
    if (t.length) {
      o.fillStyle = "rgba(0, 0, 0, 0.25)";
      o.fillRect(0, 0, e.width, e.height);
    }
    t.forEach((e) => {
      Un(e, o, n);
    });
  });
}
function Wn({ h: e, hooks: n, outputBuffer: t, dialog: o, options: r }) {
  const i = qn({ hooks: n });
  const a = An({ h: e });
  const l = Bn({ h: e });
  const s = { __html: $n(r.styleNonce).innerText };
  const c = o.el.style;
  const d = ({ screenshot: o }) => {
    const [i, c] = n.useState("highlight");
    const [d, f] = n.useState([]);
    const h = n.useRef(null);
    const p = n.useRef(null);
    const m = n.useRef(null);
    const g = n.useRef(null);
    const [b, v] = n.useState(1);
    const y = n.useMemo(() => {
      const e = _.getElementById(r.id);
      if (!e) return "white";
      const n = getComputedStyle(e);
      return (
        n.getPropertyValue("--button-primary-background") ||
        n.getPropertyValue("--accent-background")
      );
    }, [r.id]);
    n.useLayoutEffect(() => {
      const e = () => {
        const n = h.current;
        if (n) {
          In(o.canvas, { alpha: false }, (e) => {
            const t = Math.min(
              n.clientWidth / e.width,
              n.clientHeight / e.height,
            );
            v(t);
          });
          (n.clientHeight !== 0 && n.clientWidth !== 0) || setTimeout(e, 0);
        }
      };
      e();
      u.addEventListener("resize", e);
      return () => {
        u.removeEventListener("resize", e);
      };
    }, [o]);
    const x = n.useCallback(
      (e, n) => {
        In(e, { alpha: true }, (e, t) => {
          t.scale(n, n);
          e.width = o.canvas.width;
          e.height = o.canvas.height;
        });
      },
      [o],
    );
    n.useEffect(() => {
      x(p.current, o.dpi);
      zn(p.current, o.canvas);
    }, [o]);
    n.useEffect(() => {
      x(m.current, o.dpi);
      In(m.current, { alpha: true }, (e, n) => {
        n.clearRect(0, 0, e.width, e.height);
      });
      Vn(m.current, y, d);
    }, [d, y]);
    n.useEffect(() => {
      x(t, o.dpi);
      zn(t, o.canvas);
      In(_.createElement("canvas"), { alpha: true }, (e, n) => {
        n.scale(o.dpi, o.dpi);
        e.width = o.canvas.width;
        e.height = o.canvas.height;
        Vn(e, y, d);
        zn(t, e);
      });
    }, [d, o, y]);
    const w = (e) => {
      if (!i || !g.current) return;
      const n = g.current.getBoundingClientRect();
      const t = { type: i, x: e.offsetX / b, y: e.offsetY / b };
      const o = (e, t) => {
        const o = (t.clientX - n.x) / b;
        const r = (t.clientY - n.y) / b;
        return {
          type: e.type,
          x: Math.min(e.x, o),
          y: Math.min(e.y, r),
          w: Math.abs(o - e.x),
          h: Math.abs(r - e.y),
        };
      };
      const r = (e) => {
        In(m.current, { alpha: true }, (e, n) => {
          n.clearRect(0, 0, e.width, e.height);
        });
        Vn(m.current, y, [...d, o(t, e)]);
      };
      const a = (e) => {
        const n = o(t, e);
        n.w * b >= 1 && n.h * b >= 1 && f((e) => [...e, n]);
        _.removeEventListener("mousemove", r);
        _.removeEventListener("mouseup", a);
      };
      _.addEventListener("mousemove", r);
      _.addEventListener("mouseup", a);
    };
    const k = n.useCallback(
      (e) => (n) => {
        n.preventDefault();
        n.stopPropagation();
        f((n) => {
          const t = [...n];
          t.splice(e, 1);
          return t;
        });
      },
      [],
    );
    const C = {
      width: o.canvas.width * b + "px",
      height: o.canvas.height * b + "px",
    };
    const S = (e) => {
      e.stopPropagation();
    };
    return e(
      "div",
      { class: "editor" },
      e("style", { nonce: r.styleNonce, dangerouslySetInnerHTML: s }),
      e(
        "div",
        { class: "editor__image-container" },
        e(
          "div",
          { class: "editor__canvas-container", ref: h },
          e("canvas", { ref: p, id: "background", style: C }),
          e("canvas", { ref: m, id: "foreground", style: C }),
          e(
            "div",
            { ref: g, onMouseDown: w, style: C },
            d.map((n, t) =>
              e(
                "div",
                {
                  key: t,
                  class: "editor__rect",
                  style: {
                    top: n.y * b + "px",
                    left: n.x * b + "px",
                    width: n.w * b + "px",
                    height: n.h * b + "px",
                  },
                },
                e(
                  "button",
                  {
                    "aria-label": r.removeHighlightText,
                    onClick: k(t),
                    onMouseDown: S,
                    onMouseUp: S,
                    type: "button",
                  },
                  e(l, null),
                ),
              ),
            ),
          ),
        ),
      ),
      e(a, { options: r, action: i, setAction: c }),
    );
  };
  return function ({ onError: o }) {
    const [r, a] = n.useState();
    i({
      onBeforeScreenshot: n.useCallback(() => {
        c.display = "none";
      }, []),
      onScreenshot: n.useCallback((e, n) => {
        In(_.createElement("canvas"), { alpha: false }, (t, o) => {
          o.scale(n, n);
          t.width = e.videoWidth;
          t.height = e.videoHeight;
          o.drawImage(e, 0, 0, t.width, t.height);
          a({ canvas: t, dpi: n });
        });
        t.width = e.videoWidth;
        t.height = e.videoHeight;
      }, []),
      onAfterScreenshot: n.useCallback(() => {
        c.display = "block";
      }, []),
      onError: n.useCallback((e) => {
        c.display = "block";
        o(e);
      }, []),
    });
    return r ? e(d, { screenshot: r }) : e("div", null);
  };
}
const On = () => ({
  name: "FeedbackScreenshot",
  setupOnce() {},
  createInput: ({ h: e, hooks: n, dialog: t, options: o }) => {
    const r = _.createElement("canvas");
    return {
      input: Wn({ h: e, hooks: n, outputBuffer: r, dialog: t, options: o }),
      value: async () => {
        const e = await new Promise((e) => {
          r.toBlob(e, "image/png");
        });
        if (e) {
          const n = new Uint8Array(await e.arrayBuffer());
          const t = {
            data: n,
            filename: "screenshot.png",
            contentType: "application/png",
          };
          return t;
        }
      },
    };
  },
});
export {
  G as buildFeedbackIntegration,
  Dn as feedbackModalIntegration,
  On as feedbackScreenshotIntegration,
  X as getFeedback,
  R as sendFeedback,
};
