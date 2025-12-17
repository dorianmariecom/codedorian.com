// @sentry-internal/replay@10.30.0 downloaded from https://ga.jspm.io/npm:@sentry-internal/replay@10.30.0/build/npm/esm/index.js

import {
  GLOBAL_OBJ as e,
  normalize as t,
  fill as n,
  htmlTreeAsString as s,
  browserPerformanceTimeOrigin as r,
  addBreadcrumb as o,
  debug as i,
  severityLevelFromString as a,
  captureException as c,
  uuid4 as l,
  getClient as u,
  getLocationHref as d,
  getCurrentScope as h,
  getActiveSpan as p,
  getDynamicSamplingContextFromSpan as m,
  isSentryRequestUrl as f,
  stringMatchesSomePattern as y,
  addEventProcessor as g,
  debounce as S,
  createEnvelope as k,
  createEventEnvelopeHeaders as b,
  getSdkMetadataForEnvelopeHeader as v,
  prepareEvent as w,
  getIsolationScope as _,
  updateRateLimits as I,
  isRateLimited as C,
  setContext as E,
  getRootSpan as M,
  spanToJSON as x,
  SEMANTIC_ATTRIBUTE_SENTRY_SOURCE as T,
  isBrowser as R,
  parseSampleRate as A,
  consoleSandbox as O,
} from "@sentry/core";
import {
  setTimeout as D,
  addPerformanceInstrumentationHandler as L,
  addLcpInstrumentationHandler as N,
  addClsInstrumentationHandler as F,
  addInpInstrumentationHandler as B,
  serializeFormData as P,
  getFetchRequestArgBody as z,
  getBodyString as U,
  SENTRY_XHR_DATA_KEY as W,
  parseXhrResponseHeaders as H,
  addClickKeypressInstrumentationHandler as j,
  addHistoryInstrumentationHandler as $,
} from "@sentry-internal/browser-utils";
const q = e;
const K = "sentryReplaySession";
const V = "replay_event";
const J = "Unable to send Replay";
const G = 3e5;
const Y = 9e5;
const X = 5e3;
const Q = 5500;
const Z = 6e4;
const ee = 5e3;
const te = 3;
const ne = 15e4;
const se = 5e3;
const re = 3e3;
const oe = 300;
const ie = 2e7;
const ae = 4999;
const ce = 5e4;
const le = 36e5;
var ue = Object.defineProperty;
var de = (e, t, n) =>
  t in e
    ? ue(e, t, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: n,
      })
    : (e[t] = n);
var he = (e, t, n) => de(e, typeof t !== "symbol" ? t + "" : t, n);
var pe = ((e) => {
  e[(e.Document = 0)] = "Document";
  e[(e.DocumentType = 1)] = "DocumentType";
  e[(e.Element = 2)] = "Element";
  e[(e.Text = 3)] = "Text";
  e[(e.CDATA = 4)] = "CDATA";
  e[(e.Comment = 5)] = "Comment";
  return e;
})(pe || {});
function me(e) {
  return e.nodeType === e.ELEMENT_NODE;
}
function fe(e) {
  const t = e?.host;
  return Boolean(t?.shadowRoot === e);
}
function ye(e) {
  return Object.prototype.toString.call(e) === "[object ShadowRoot]";
}
function ge(e) {
  e.includes(" background-clip: text;") &&
    !e.includes(" -webkit-background-clip: text;") &&
    (e = e.replace(
      /\sbackground-clip:\s*text;/g,
      " -webkit-background-clip: text; background-clip: text;",
    ));
  return e;
}
function Se(e) {
  const { cssText: t } = e;
  if (t.split('"').length < 3) return t;
  const n = ["@import", `url(${JSON.stringify(e.href)})`];
  e.layerName === ""
    ? n.push("layer")
    : e.layerName && n.push(`layer(${e.layerName})`);
  e.supportsText && n.push(`supports(${e.supportsText})`);
  e.media.length && n.push(e.media.mediaText);
  return n.join(" ") + ";";
}
function ke(e) {
  try {
    const t = e.rules || e.cssRules;
    return t ? ge(Array.from(t, ve).join("")) : null;
  } catch (e) {
    return null;
  }
}
function be(e) {
  let t = "";
  for (let n = 0; n < e.style.length; n++) {
    const s = e.style;
    const r = s[n];
    const o = s.getPropertyPriority(r);
    t += `${r}:${s.getPropertyValue(r)}${o ? " !important" : ""};`;
  }
  return `${e.selectorText} { ${t} }`;
}
function ve(e) {
  let t;
  if (_e(e))
    try {
      t = ke(e.styleSheet) || Se(e);
    } catch (e) {}
  else if (Ie(e)) {
    let t = e.cssText;
    const n = e.selectorText.includes(":");
    const s = typeof e.style.all === "string" && e.style.all;
    s && (t = be(e));
    n && (t = we(t));
    if (n || s) return t;
  }
  return t || e.cssText;
}
function we(e) {
  const t = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
  return e.replace(t, "$1\\$2");
}
function _e(e) {
  return "styleSheet" in e;
}
function Ie(e) {
  return "selectorText" in e;
}
class Mirror {
  constructor() {
    he(this, "idNodeMap", new Map());
    he(this, "nodeMetaMap", new WeakMap());
  }
  getId(e) {
    if (!e) return -1;
    const t = this.getMeta(e)?.id;
    return t ?? -1;
  }
  getNode(e) {
    return this.idNodeMap.get(e) || null;
  }
  getIds() {
    return Array.from(this.idNodeMap.keys());
  }
  getMeta(e) {
    return this.nodeMetaMap.get(e) || null;
  }
  removeNodeFromMap(e) {
    const t = this.getId(e);
    this.idNodeMap.delete(t);
    e.childNodes && e.childNodes.forEach((e) => this.removeNodeFromMap(e));
  }
  has(e) {
    return this.idNodeMap.has(e);
  }
  hasNode(e) {
    return this.nodeMetaMap.has(e);
  }
  add(e, t) {
    const n = t.id;
    this.idNodeMap.set(n, e);
    this.nodeMetaMap.set(e, t);
  }
  replace(e, t) {
    const n = this.getNode(e);
    if (n) {
      const e = this.nodeMetaMap.get(n);
      e && this.nodeMetaMap.set(t, e);
    }
    this.idNodeMap.set(e, t);
  }
  reset() {
    this.idNodeMap = new Map();
    this.nodeMetaMap = new WeakMap();
  }
}
function Ce() {
  return new Mirror();
}
function Ee({ maskInputOptions: e, tagName: t, type: n }) {
  t === "OPTION" && (t = "SELECT");
  return Boolean(
    e[t.toLowerCase()] ||
      (n && e[n]) ||
      n === "password" ||
      (t === "INPUT" && !n && e.text),
  );
}
function Me({ isMasked: e, element: t, value: n, maskInputFn: s }) {
  let r = n || "";
  if (!e) return r;
  s && (r = s(r, t));
  return "*".repeat(r.length);
}
function xe(e) {
  return e.toLowerCase();
}
function Te(e) {
  return e.toUpperCase();
}
const Re = "__rrweb_original__";
function Ae(e) {
  const t = e.getContext("2d");
  if (!t) return true;
  const n = 50;
  for (let s = 0; s < e.width; s += n)
    for (let r = 0; r < e.height; r += n) {
      const o = t.getImageData;
      const i = Re in o ? o[Re] : o;
      const a = new Uint32Array(
        i.call(
          t,
          s,
          r,
          Math.min(n, e.width - s),
          Math.min(n, e.height - r),
        ).data.buffer,
      );
      if (a.some((e) => e !== 0)) return false;
    }
  return true;
}
function Oe(e) {
  const t = e.type;
  return e.hasAttribute("data-rr-is-password") ? "password" : t ? xe(t) : null;
}
function De(e, t, n) {
  return t !== "INPUT" || (n !== "radio" && n !== "checkbox")
    ? e.value
    : e.getAttribute("value") || "";
}
function Le(e, t) {
  let n;
  try {
    n = new URL(e, t ?? window.location.href);
  } catch (e) {
    return null;
  }
  const s = /\.([0-9a-z]+)(?:$)/i;
  const r = n.pathname.match(s);
  return r?.[1] ?? null;
}
const Ne = {};
function Fe(e) {
  const t = Ne[e];
  if (t) return t;
  const n = window.document;
  let s = window[e];
  if (n && typeof n.createElement === "function")
    try {
      const t = n.createElement("iframe");
      t.hidden = true;
      n.head.appendChild(t);
      const r = t.contentWindow;
      r && r[e] && (s = r[e]);
      n.head.removeChild(t);
    } catch (e) {}
  return (Ne[e] = s.bind(window));
}
function Be(...e) {
  return Fe("setTimeout")(...e);
}
function Pe(...e) {
  return Fe("clearTimeout")(...e);
}
function ze(e) {
  try {
    return e.contentDocument;
  } catch (e) {}
}
let Ue = 1;
const We = new RegExp("[^a-z0-9-_:]");
const He = -2;
function je() {
  return Ue++;
}
function $e(e) {
  if (e instanceof HTMLFormElement) return "form";
  const t = xe(e.tagName);
  return We.test(t) ? "div" : t;
}
function qe(e) {
  let t = "";
  t =
    e.indexOf("//") > -1 ? e.split("/").slice(0, 3).join("/") : e.split("/")[0];
  t = t.split("?")[0];
  return t;
}
let Ke;
let Ve;
const Je = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
const Ge = /^(?:[a-z+]+:)?\/\//i;
const Ye = /^www\..*/i;
const Xe = /^(data:)([^,]*),(.*)/i;
function Qe(e, t) {
  if (!e || t.size === 0) return e;
  try {
    const n = e.split(";");
    const s = [];
    for (let e of n) {
      e = e.trim();
      if (!e) continue;
      const n = e.indexOf(":");
      if (n === -1) {
        s.push(e);
        continue;
      }
      const r = e.slice(0, n).trim();
      t.has(r) || s.push(e);
    }
    return s.join("; ") + (s.length > 0 && e.endsWith(";") ? ";" : "");
  } catch (t) {
    console.warn("Error filtering CSS properties:", t);
    return e;
  }
}
function Ze(e, t) {
  return (e || "").replace(Je, (e, n, s, r, o, i) => {
    const a = s || o || i;
    const c = n || r || "";
    if (!a) return e;
    if (Ge.test(a) || Ye.test(a)) return `url(${c}${a}${c})`;
    if (Xe.test(a)) return `url(${c}${a}${c})`;
    if (a[0] === "/") return `url(${c}${qe(t) + a}${c})`;
    const l = t.split("/");
    const u = a.split("/");
    l.pop();
    for (const e of u) e !== "." && (e === ".." ? l.pop() : l.push(e));
    return `url(${c}${l.join("/")}${c})`;
  });
}
const et = /^[^ \t\n\r\u000c]+/;
const tt = /^[, \t\n\r\u000c]+/;
function nt(e, t) {
  if (t.trim() === "") return t;
  let n = 0;
  function s(e) {
    let s;
    const r = e.exec(t.substring(n));
    if (r) {
      s = r[0];
      n += s.length;
      return s;
    }
    return "";
  }
  const r = [];
  while (true) {
    s(tt);
    if (n >= t.length) break;
    let o = s(et);
    if (o.slice(-1) === ",") {
      o = rt(e, o.substring(0, o.length - 1));
      r.push(o);
    } else {
      let s = "";
      o = rt(e, o);
      let i = false;
      while (true) {
        const e = t.charAt(n);
        if (e === "") {
          r.push((o + s).trim());
          break;
        }
        if (i) e === ")" && (i = false);
        else {
          if (e === ",") {
            n += 1;
            r.push((o + s).trim());
            break;
          }
          e === "(" && (i = true);
        }
        s += e;
        n += 1;
      }
    }
  }
  return r.join(", ");
}
const st = new WeakMap();
function rt(e, t) {
  return t && t.trim() !== "" ? it(e, t) : t;
}
function ot(e) {
  return Boolean(e.tagName === "svg" || e.ownerSVGElement);
}
function it(e, t) {
  let n = st.get(e);
  if (!n) {
    n = e.createElement("a");
    st.set(e, n);
  }
  if (t) {
    if (t.startsWith("blob:") || t.startsWith("data:")) return t;
  } else t = "";
  n.setAttribute("href", t);
  return n.href;
}
function at(e, t, n, s, r, o, i) {
  if (!s) return s;
  if (n === "src" || (n === "href" && (t !== "use" || s[0] !== "#")))
    return rt(e, s);
  if (n === "xlink:href" && s[0] !== "#") return rt(e, s);
  if (n === "background" && (t === "table" || t === "td" || t === "th"))
    return rt(e, s);
  if (n === "srcset") return nt(e, s);
  if (n === "style") {
    let t = Ze(s, it(e));
    i && i.size > 0 && (t = Qe(t, i));
    return t;
  }
  return t === "object" && n === "data"
    ? rt(e, s)
    : typeof o === "function"
      ? o(n, s, r)
      : s;
}
function ct(e, t, n) {
  return (e === "video" || e === "audio") && t === "autoplay";
}
function lt(e, t, n, s) {
  try {
    if (s && e.matches(s)) return false;
    if (typeof t === "string") {
      if (e.classList.contains(t)) return true;
    } else
      for (let n = e.classList.length; n--; ) {
        const s = e.classList[n];
        if (t.test(s)) return true;
      }
    if (n) return e.matches(n);
  } catch (e) {}
  return false;
}
function ut(e, t) {
  for (let n = e.classList.length; n--; ) {
    const s = e.classList[n];
    if (t.test(s)) return true;
  }
  return false;
}
function dt(e, t, n = Infinity, s = 0) {
  return e
    ? e.nodeType !== e.ELEMENT_NODE || s > n
      ? -1
      : t(e)
        ? s
        : dt(e.parentNode, t, n, s + 1)
    : -1;
}
function ht(e, t) {
  return (n) => {
    const s = n;
    if (s === null) return false;
    try {
      if (e)
        if (typeof e === "string") {
          if (s.matches(`.${e}`)) return true;
        } else if (ut(s, e)) return true;
      return !(!t || !s.matches(t));
    } catch {
      return false;
    }
  };
}
function pt(e, t, n, s, r, o) {
  try {
    const i = e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
    if (i === null) return false;
    if (i.tagName === "INPUT") {
      const e = i.getAttribute("autocomplete");
      const t = [
        "current-password",
        "new-password",
        "cc-number",
        "cc-exp",
        "cc-exp-month",
        "cc-exp-year",
        "cc-csc",
      ];
      if (t.includes(e)) return true;
    }
    let a = -1;
    let c = -1;
    if (o) {
      c = dt(i, ht(s, r));
      if (c < 0) return true;
      a = dt(i, ht(t, n), c >= 0 ? c : Infinity);
    } else {
      a = dt(i, ht(t, n));
      if (a < 0) return false;
      c = dt(i, ht(s, r), a >= 0 ? a : Infinity);
    }
    return a >= 0 ? !(c >= 0) || a <= c : !(c >= 0) && !!o;
  } catch (e) {}
  return !!o;
}
function mt(e, t, n) {
  const s = e.contentWindow;
  if (!s) return;
  let r = false;
  let o;
  try {
    o = s.document.readyState;
  } catch (e) {
    return;
  }
  if (o !== "complete") {
    const s = Be(() => {
      if (!r) {
        t();
        r = true;
      }
    }, n);
    e.addEventListener("load", () => {
      Pe(s);
      r = true;
      t();
    });
    return;
  }
  const i = "about:blank";
  if (s.location.href !== i || e.src === i || e.src === "") {
    Be(t, 0);
    return e.addEventListener("load", t);
  }
  e.addEventListener("load", t);
}
function ft(e, t, n) {
  let s = false;
  let r;
  try {
    r = e.sheet;
  } catch (e) {
    return;
  }
  if (r) return;
  const o = Be(() => {
    if (!s) {
      t();
      s = true;
    }
  }, n);
  e.addEventListener("load", () => {
    Pe(o);
    s = true;
    t();
  });
}
function yt(e, t) {
  const {
    doc: n,
    mirror: s,
    blockClass: r,
    blockSelector: o,
    unblockSelector: i,
    maskAllText: a,
    maskAttributeFn: c,
    maskTextClass: l,
    unmaskTextClass: u,
    maskTextSelector: d,
    unmaskTextSelector: h,
    inlineStylesheet: p,
    maskInputOptions: m = {},
    maskTextFn: f,
    maskInputFn: y,
    dataURLOptions: g = {},
    inlineImages: S,
    recordCanvas: k,
    keepIframeSrcFn: b,
    newlyAddedElement: v = false,
    ignoreCSSAttributes: w,
  } = t;
  const _ = gt(n, s);
  switch (e.nodeType) {
    case e.DOCUMENT_NODE:
      return e.compatMode !== "CSS1Compat"
        ? { type: pe.Document, childNodes: [], compatMode: e.compatMode }
        : { type: pe.Document, childNodes: [] };
    case e.DOCUMENT_TYPE_NODE:
      return {
        type: pe.DocumentType,
        name: e.name,
        publicId: e.publicId,
        systemId: e.systemId,
        rootId: _,
      };
    case e.ELEMENT_NODE:
      return kt(e, {
        doc: n,
        blockClass: r,
        blockSelector: o,
        unblockSelector: i,
        inlineStylesheet: p,
        maskAttributeFn: c,
        maskInputOptions: m,
        maskInputFn: y,
        dataURLOptions: g,
        inlineImages: S,
        recordCanvas: k,
        keepIframeSrcFn: b,
        newlyAddedElement: v,
        rootId: _,
        maskTextClass: l,
        unmaskTextClass: u,
        maskTextSelector: d,
        unmaskTextSelector: h,
        ignoreCSSAttributes: w,
      });
    case e.TEXT_NODE:
      return St(e, {
        doc: n,
        maskAllText: a,
        maskTextClass: l,
        unmaskTextClass: u,
        maskTextSelector: d,
        unmaskTextSelector: h,
        maskTextFn: f,
        maskInputOptions: m,
        maskInputFn: y,
        rootId: _,
      });
    case e.CDATA_SECTION_NODE:
      return { type: pe.CDATA, textContent: "", rootId: _ };
    case e.COMMENT_NODE:
      return { type: pe.Comment, textContent: e.textContent || "", rootId: _ };
    default:
      return false;
  }
}
function gt(e, t) {
  if (!t.hasNode(e)) return;
  const n = t.getId(e);
  return n === 1 ? void 0 : n;
}
function St(e, t) {
  const {
    maskAllText: n,
    maskTextClass: s,
    unmaskTextClass: r,
    maskTextSelector: o,
    unmaskTextSelector: i,
    maskTextFn: a,
    maskInputOptions: c,
    maskInputFn: l,
    rootId: u,
  } = t;
  const d = e.parentNode && e.parentNode.tagName;
  let h = e.textContent;
  const p = d === "STYLE" || void 0;
  const m = d === "SCRIPT" || void 0;
  const f = d === "TEXTAREA" || void 0;
  if (p && h) {
    try {
      e.nextSibling ||
        e.previousSibling ||
        (e.parentNode.sheet?.cssRules && (h = ke(e.parentNode.sheet)));
    } catch (t) {
      console.warn(
        `Cannot get CSS styles from text's parentNode. Error: ${t}`,
        e,
      );
    }
    h = Ze(h, it(t.doc));
  }
  m && (h = "SCRIPT_PLACEHOLDER");
  const y = pt(e, s, o, r, i, n);
  p ||
    m ||
    f ||
    !h ||
    !y ||
    (h = a ? a(h, e.parentElement) : h.replace(/[\S]/g, "*"));
  f &&
    h &&
    (c.textarea || y) &&
    (h = l ? l(h, e.parentNode) : h.replace(/[\S]/g, "*"));
  if (d === "OPTION" && h) {
    const t = Ee({ type: null, tagName: d, maskInputOptions: c });
    h = Me({
      isMasked: pt(e, s, o, r, i, t),
      element: e,
      value: h,
      maskInputFn: l,
    });
  }
  return { type: pe.Text, textContent: h || "", isStyle: p, rootId: u };
}
function kt(e, t) {
  const {
    doc: n,
    blockClass: s,
    blockSelector: r,
    unblockSelector: o,
    inlineStylesheet: i,
    maskInputOptions: a = {},
    maskAttributeFn: c,
    maskInputFn: l,
    dataURLOptions: u = {},
    inlineImages: d,
    recordCanvas: h,
    keepIframeSrcFn: p,
    newlyAddedElement: m = false,
    rootId: f,
    maskTextClass: y,
    unmaskTextClass: g,
    maskTextSelector: S,
    unmaskTextSelector: k,
    ignoreCSSAttributes: b,
  } = t;
  const v = lt(e, s, r, o);
  const w = $e(e);
  let _ = {};
  const I = e.attributes.length;
  for (let t = 0; t < I; t++) {
    const s = e.attributes[t];
    s.name &&
      !ct(w, s.name, s.value) &&
      (_[s.name] = at(n, w, xe(s.name), s.value, e, c, b));
  }
  if (w === "link" && i) {
    const t = Array.from(n.styleSheets).find((t) => t.href === e.href);
    let s = null;
    t && (s = ke(t));
    if (s) {
      _.rel = null;
      _.href = null;
      _.crossorigin = null;
      _._cssText = Ze(s, t.href);
    }
  }
  if (
    w === "style" &&
    e.sheet &&
    !(e.innerText || e.textContent || "").trim().length
  ) {
    const t = ke(e.sheet);
    t && (_._cssText = Ze(t, it(n)));
  }
  if (w === "input" || w === "textarea" || w === "select" || w === "option") {
    const t = e;
    const n = Oe(t);
    const s = De(t, Te(w), n);
    const r = t.checked;
    if (n !== "submit" && n !== "button" && s) {
      const e = pt(
        t,
        y,
        S,
        g,
        k,
        Ee({ type: n, tagName: Te(w), maskInputOptions: a }),
      );
      _.value = Me({ isMasked: e, element: t, value: s, maskInputFn: l });
    }
    r && (_.checked = r);
  }
  w === "option" &&
    (e.selected && !a.select ? (_.selected = true) : delete _.selected);
  if (w === "canvas" && h)
    if (e.__context === "2d")
      Ae(e) || (_.rr_dataURL = e.toDataURL(u.type, u.quality));
    else if (!("__context" in e)) {
      const t = e.toDataURL(u.type, u.quality);
      const s = n.createElement("canvas");
      s.width = e.width;
      s.height = e.height;
      const r = s.toDataURL(u.type, u.quality);
      t !== r && (_.rr_dataURL = t);
    }
  if (w === "img" && d) {
    if (!Ke) {
      Ke = n.createElement("canvas");
      Ve = Ke.getContext("2d");
    }
    const t = e;
    const s = t.currentSrc || t.getAttribute("src") || "<unknown-src>";
    const r = t.crossOrigin;
    const o = () => {
      t.removeEventListener("load", o);
      try {
        Ke.width = t.naturalWidth;
        Ke.height = t.naturalHeight;
        Ve.drawImage(t, 0, 0);
        _.rr_dataURL = Ke.toDataURL(u.type, u.quality);
      } catch (e) {
        if (t.crossOrigin !== "anonymous") {
          t.crossOrigin = "anonymous";
          t.complete && t.naturalWidth !== 0
            ? o()
            : t.addEventListener("load", o);
          return;
        }
        console.warn(`Cannot inline img src=${s}! Error: ${e}`);
      }
      t.crossOrigin === "anonymous" &&
        (r ? (_.crossOrigin = r) : t.removeAttribute("crossorigin"));
    };
    t.complete && t.naturalWidth !== 0 ? o() : t.addEventListener("load", o);
  }
  if (w === "audio" || w === "video") {
    _.rr_mediaState = e.paused ? "paused" : "played";
    _.rr_mediaCurrentTime = e.currentTime;
  }
  if (!m) {
    e.scrollLeft && (_.rr_scrollLeft = e.scrollLeft);
    e.scrollTop && (_.rr_scrollTop = e.scrollTop);
  }
  if (v) {
    const { width: t, height: n } = e.getBoundingClientRect();
    _ = { class: _.class, rr_width: `${t}px`, rr_height: `${n}px` };
  }
  if (w === "iframe" && !p(_.src)) {
    v || ze(e) || (_.rr_src = _.src);
    delete _.src;
  }
  let C;
  try {
    customElements.get(w) && (C = true);
  } catch (e) {}
  return {
    type: pe.Element,
    tagName: w,
    attributes: _,
    childNodes: [],
    isSVG: ot(e) || void 0,
    needBlock: v,
    rootId: f,
    isCustom: C,
  };
}
function bt(e) {
  return e === void 0 || e === null ? "" : e.toLowerCase();
}
function vt(e, t) {
  if (t.comment && e.type === pe.Comment) return true;
  if (e.type === pe.Element) {
    if (
      t.script &&
      (e.tagName === "script" ||
        (e.tagName === "link" &&
          (e.attributes.rel === "preload" ||
            e.attributes.rel === "modulepreload")) ||
        (e.tagName === "link" &&
          e.attributes.rel === "prefetch" &&
          typeof e.attributes.href === "string" &&
          Le(e.attributes.href) === "js"))
    )
      return true;
    if (
      t.headFavicon &&
      ((e.tagName === "link" && e.attributes.rel === "shortcut icon") ||
        (e.tagName === "meta" &&
          (bt(e.attributes.name).match(/^msapplication-tile(image|color)$/) ||
            bt(e.attributes.name) === "application-name" ||
            bt(e.attributes.rel) === "icon" ||
            bt(e.attributes.rel) === "apple-touch-icon" ||
            bt(e.attributes.rel) === "shortcut icon")))
    )
      return true;
    if (e.tagName === "meta") {
      if (
        t.headMetaDescKeywords &&
        bt(e.attributes.name).match(/^description|keywords$/)
      )
        return true;
      if (
        t.headMetaSocial &&
        (bt(e.attributes.property).match(/^(og|twitter|fb):/) ||
          bt(e.attributes.name).match(/^(og|twitter):/) ||
          bt(e.attributes.name) === "pinterest")
      )
        return true;
      if (
        t.headMetaRobots &&
        (bt(e.attributes.name) === "robots" ||
          bt(e.attributes.name) === "googlebot" ||
          bt(e.attributes.name) === "bingbot")
      )
        return true;
      if (t.headMetaHttpEquiv && e.attributes["http-equiv"] !== void 0)
        return true;
      if (
        t.headMetaAuthorship &&
        (bt(e.attributes.name) === "author" ||
          bt(e.attributes.name) === "generator" ||
          bt(e.attributes.name) === "framework" ||
          bt(e.attributes.name) === "publisher" ||
          bt(e.attributes.name) === "progid" ||
          bt(e.attributes.property).match(/^article:/) ||
          bt(e.attributes.property).match(/^product:/))
      )
        return true;
      if (
        t.headMetaVerification &&
        (bt(e.attributes.name) === "google-site-verification" ||
          bt(e.attributes.name) === "yandex-verification" ||
          bt(e.attributes.name) === "csrf-token" ||
          bt(e.attributes.name) === "p:domain_verify" ||
          bt(e.attributes.name) === "verify-v1" ||
          bt(e.attributes.name) === "verification" ||
          bt(e.attributes.name) === "shopify-checkout-api-token")
      )
        return true;
    }
  }
  return false;
}
function wt(e, t) {
  const {
    doc: n,
    mirror: s,
    blockClass: r,
    blockSelector: o,
    unblockSelector: i,
    maskAllText: a,
    maskTextClass: c,
    unmaskTextClass: l,
    maskTextSelector: u,
    unmaskTextSelector: d,
    skipChild: h = false,
    inlineStylesheet: p = true,
    maskInputOptions: m = {},
    maskAttributeFn: f,
    maskTextFn: y,
    maskInputFn: g,
    slimDOMOptions: S,
    dataURLOptions: k = {},
    inlineImages: b = false,
    recordCanvas: v = false,
    onSerialize: w,
    onIframeLoad: _,
    iframeLoadTimeout: I = 5e3,
    onBlockedImageLoad: C,
    onStylesheetLoad: E,
    stylesheetLoadTimeout: M = 5e3,
    keepIframeSrcFn: x = () => false,
    newlyAddedElement: T = false,
    ignoreCSSAttributes: R,
  } = t;
  let { preserveWhiteSpace: A = true } = t;
  const O = yt(e, {
    doc: n,
    mirror: s,
    blockClass: r,
    blockSelector: o,
    maskAllText: a,
    unblockSelector: i,
    maskTextClass: c,
    unmaskTextClass: l,
    maskTextSelector: u,
    unmaskTextSelector: d,
    inlineStylesheet: p,
    maskInputOptions: m,
    maskAttributeFn: f,
    maskTextFn: y,
    maskInputFn: g,
    dataURLOptions: k,
    inlineImages: b,
    recordCanvas: v,
    keepIframeSrcFn: x,
    newlyAddedElement: T,
    ignoreCSSAttributes: R,
  });
  if (!O) {
    console.warn(e, "not serialized");
    return null;
  }
  let D;
  D = s.hasNode(e)
    ? s.getId(e)
    : vt(O, S) ||
        (!A &&
          O.type === pe.Text &&
          !O.isStyle &&
          !O.textContent.replace(/^\s+|\s+$/gm, "").length)
      ? He
      : je();
  const L = Object.assign(O, { id: D });
  s.add(e, L);
  if (D === He) return null;
  w && w(e);
  let N = !h;
  if (L.type === pe.Element) {
    N = N && !L.needBlock;
    const t = e.shadowRoot;
    t && ye(t) && (L.isShadowHost = true);
  }
  if ((L.type === pe.Document || L.type === pe.Element) && N) {
    S.headWhitespace &&
      L.type === pe.Element &&
      L.tagName === "head" &&
      (A = false);
    const t = {
      doc: n,
      mirror: s,
      blockClass: r,
      blockSelector: o,
      maskAllText: a,
      unblockSelector: i,
      maskTextClass: c,
      unmaskTextClass: l,
      maskTextSelector: u,
      unmaskTextSelector: d,
      skipChild: h,
      inlineStylesheet: p,
      maskInputOptions: m,
      maskAttributeFn: f,
      maskTextFn: y,
      maskInputFn: g,
      slimDOMOptions: S,
      dataURLOptions: k,
      inlineImages: b,
      recordCanvas: v,
      preserveWhiteSpace: A,
      onSerialize: w,
      onIframeLoad: _,
      iframeLoadTimeout: I,
      onBlockedImageLoad: C,
      onStylesheetLoad: E,
      stylesheetLoadTimeout: M,
      keepIframeSrcFn: x,
      ignoreCSSAttributes: R,
    };
    const T = e.childNodes ? Array.from(e.childNodes) : [];
    for (const e of T) {
      const n = wt(e, t);
      n && L.childNodes.push(n);
    }
    if (me(e) && e.shadowRoot)
      for (const n of Array.from(e.shadowRoot.childNodes)) {
        const s = wt(n, t);
        if (s) {
          ye(e.shadowRoot) && (s.isShadow = true);
          L.childNodes.push(s);
        }
      }
  }
  e.parentNode && fe(e.parentNode) && ye(e.parentNode) && (L.isShadow = true);
  L.type !== pe.Element ||
    L.tagName !== "iframe" ||
    L.needBlock ||
    mt(
      e,
      () => {
        const t = ze(e);
        if (t && _) {
          const n = wt(t, {
            doc: t,
            mirror: s,
            blockClass: r,
            blockSelector: o,
            unblockSelector: i,
            maskAllText: a,
            maskTextClass: c,
            unmaskTextClass: l,
            maskTextSelector: u,
            unmaskTextSelector: d,
            skipChild: false,
            inlineStylesheet: p,
            maskInputOptions: m,
            maskAttributeFn: f,
            maskTextFn: y,
            maskInputFn: g,
            slimDOMOptions: S,
            dataURLOptions: k,
            inlineImages: b,
            recordCanvas: v,
            preserveWhiteSpace: A,
            onSerialize: w,
            onIframeLoad: _,
            iframeLoadTimeout: I,
            onStylesheetLoad: E,
            stylesheetLoadTimeout: M,
            keepIframeSrcFn: x,
            ignoreCSSAttributes: R,
          });
          n && _(e, n);
        }
      },
      I,
    );
  if (
    L.type === pe.Element &&
    L.tagName === "img" &&
    !e.complete &&
    L.needBlock
  ) {
    const t = e;
    const n = () => {
      if (t.isConnected && !t.complete && C)
        try {
          const e = t.getBoundingClientRect();
          e.width > 0 && e.height > 0 && C(t, L, e);
        } catch (e) {}
      t.removeEventListener("load", n);
    };
    t.isConnected && t.addEventListener("load", n);
  }
  L.type === pe.Element &&
    L.tagName === "link" &&
    typeof L.attributes.rel === "string" &&
    (L.attributes.rel === "stylesheet" ||
      (L.attributes.rel === "preload" &&
        typeof L.attributes.href === "string" &&
        Le(L.attributes.href) === "css")) &&
    ft(
      e,
      () => {
        if (E) {
          const t = wt(e, {
            doc: n,
            mirror: s,
            blockClass: r,
            blockSelector: o,
            unblockSelector: i,
            maskAllText: a,
            maskTextClass: c,
            unmaskTextClass: l,
            maskTextSelector: u,
            unmaskTextSelector: d,
            skipChild: false,
            inlineStylesheet: p,
            maskInputOptions: m,
            maskAttributeFn: f,
            maskTextFn: y,
            maskInputFn: g,
            slimDOMOptions: S,
            dataURLOptions: k,
            inlineImages: b,
            recordCanvas: v,
            preserveWhiteSpace: A,
            onSerialize: w,
            onIframeLoad: _,
            iframeLoadTimeout: I,
            onStylesheetLoad: E,
            stylesheetLoadTimeout: M,
            keepIframeSrcFn: x,
            ignoreCSSAttributes: R,
          });
          t && E(e, t);
        }
      },
      M,
    );
  L.type === pe.Element && delete L.needBlock;
  return L;
}
function _t(e, t) {
  const {
    mirror: n = new Mirror(),
    blockClass: s = "rr-block",
    blockSelector: r = null,
    unblockSelector: o = null,
    maskAllText: i = false,
    maskTextClass: a = "rr-mask",
    unmaskTextClass: c = null,
    maskTextSelector: l = null,
    unmaskTextSelector: u = null,
    inlineStylesheet: d = true,
    inlineImages: h = false,
    recordCanvas: p = false,
    maskAllInputs: m = false,
    maskAttributeFn: f,
    maskTextFn: y,
    maskInputFn: g,
    slimDOM: S = false,
    dataURLOptions: k,
    preserveWhiteSpace: b,
    onSerialize: v,
    onIframeLoad: w,
    iframeLoadTimeout: _,
    onBlockedImageLoad: I,
    onStylesheetLoad: C,
    stylesheetLoadTimeout: E,
    keepIframeSrcFn: M = () => false,
    ignoreCSSAttributes: x = new Set([]),
  } = t || {};
  const T =
    m === true
      ? {
          color: true,
          date: true,
          "datetime-local": true,
          email: true,
          month: true,
          number: true,
          range: true,
          search: true,
          tel: true,
          text: true,
          time: true,
          url: true,
          week: true,
          textarea: true,
          select: true,
        }
      : m === false
        ? {}
        : m;
  const R =
    S === true || S === "all"
      ? {
          script: true,
          comment: true,
          headFavicon: true,
          headWhitespace: true,
          headMetaDescKeywords: S === "all",
          headMetaSocial: true,
          headMetaRobots: true,
          headMetaHttpEquiv: true,
          headMetaAuthorship: true,
          headMetaVerification: true,
        }
      : S === false
        ? {}
        : S;
  return wt(e, {
    doc: e,
    mirror: n,
    blockClass: s,
    blockSelector: r,
    unblockSelector: o,
    maskAllText: i,
    maskTextClass: a,
    unmaskTextClass: c,
    maskTextSelector: l,
    unmaskTextSelector: u,
    skipChild: false,
    inlineStylesheet: d,
    maskInputOptions: T,
    maskAttributeFn: f,
    maskTextFn: y,
    maskInputFn: g,
    slimDOMOptions: R,
    dataURLOptions: k,
    inlineImages: h,
    recordCanvas: p,
    preserveWhiteSpace: b,
    onSerialize: v,
    onIframeLoad: w,
    iframeLoadTimeout: _,
    onBlockedImageLoad: I,
    onStylesheetLoad: C,
    stylesheetLoadTimeout: E,
    keepIframeSrcFn: M,
    newlyAddedElement: false,
    ignoreCSSAttributes: x,
  });
}
function It(e, t, n = document) {
  const s = { capture: true, passive: true };
  n.addEventListener(e, t, s);
  return () => n.removeEventListener(e, t, s);
}
const Ct =
  "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
let Et = {
  map: {},
  getId() {
    console.error(Ct);
    return -1;
  },
  getNode() {
    console.error(Ct);
    return null;
  },
  removeNodeFromMap() {
    console.error(Ct);
  },
  has() {
    console.error(Ct);
    return false;
  },
  reset() {
    console.error(Ct);
  },
};
typeof window !== "undefined" &&
  window.Proxy &&
  window.Reflect &&
  (Et = new Proxy(Et, {
    get(e, t, n) {
      t === "map" && console.error(Ct);
      return Reflect.get(e, t, n);
    },
  }));
function Mt(e, t, n = {}) {
  let s = null;
  let r = 0;
  return function (...o) {
    const i = Date.now();
    r || n.leading !== false || (r = i);
    const a = t - (i - r);
    const c = this;
    if (a <= 0 || a > t) {
      if (s) {
        Qt(s);
        s = null;
      }
      r = i;
      e.apply(c, o);
    } else
      s ||
        n.trailing === false ||
        (s = Xt(() => {
          r = n.leading === false ? 0 : Date.now();
          s = null;
          e.apply(c, o);
        }, a));
  };
}
function xt(e, t, n, s, r = window) {
  const o = r.Object.getOwnPropertyDescriptor(e, t);
  r.Object.defineProperty(
    e,
    t,
    s
      ? n
      : {
          set(e) {
            Xt(() => {
              n.set.call(this, e);
            }, 0);
            o && o.set && o.set.call(this, e);
          },
        },
  );
  return () => xt(e, t, o || {}, true);
}
function Tt(e, t, n) {
  try {
    if (!(t in e)) return () => {};
    const s = e[t];
    const r = n(s);
    if (typeof r === "function") {
      r.prototype = r.prototype || {};
      Object.defineProperties(r, {
        __rrweb_original__: { enumerable: false, value: s },
      });
    }
    e[t] = r;
    return () => {
      e[t] = s;
    };
  } catch {
    return () => {};
  }
}
let Rt = Date.now;
/[1-9][0-9]{12}/.test(Date.now().toString()) ||
  (Rt = () => new Date().getTime());
function At(e) {
  const t = e.document;
  return {
    left: t.scrollingElement
      ? t.scrollingElement.scrollLeft
      : e.pageXOffset !== void 0
        ? e.pageXOffset
        : t?.documentElement.scrollLeft ||
          t?.body?.parentElement?.scrollLeft ||
          t?.body?.scrollLeft ||
          0,
    top: t.scrollingElement
      ? t.scrollingElement.scrollTop
      : e.pageYOffset !== void 0
        ? e.pageYOffset
        : t?.documentElement.scrollTop ||
          t?.body?.parentElement?.scrollTop ||
          t?.body?.scrollTop ||
          0,
  };
}
function Ot() {
  return (
    window.innerHeight ||
    (document.documentElement && document.documentElement.clientHeight) ||
    (document.body && document.body.clientHeight)
  );
}
function Dt() {
  return (
    window.innerWidth ||
    (document.documentElement && document.documentElement.clientWidth) ||
    (document.body && document.body.clientWidth)
  );
}
function Lt(e) {
  if (!e) return null;
  try {
    const t = e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
    return t;
  } catch (e) {
    return null;
  }
}
function Nt(e, t, n, s, r) {
  if (!e) return false;
  const o = Lt(e);
  if (!o) return false;
  const i = ht(t, n);
  if (!r) {
    const e = s && o.matches(s);
    return i(o) && !e;
  }
  const a = dt(o, i);
  let c = -1;
  if (a < 0) return false;
  s && (c = dt(o, ht(null, s)));
  return (a > -1 && c < 0) || a < c;
}
function Ft(e, t) {
  return t.getId(e) !== -1;
}
function Bt(e, t) {
  return t.getId(e) === He;
}
function Pt(e, t) {
  if (fe(e)) return false;
  const n = t.getId(e);
  return (
    !t.has(n) ||
    ((!e.parentNode || e.parentNode.nodeType !== e.DOCUMENT_NODE) &&
      (!e.parentNode || Pt(e.parentNode, t)))
  );
}
function zt(e) {
  return Boolean(e.changedTouches);
}
function Ut(e = window) {
  "NodeList" in e &&
    !e.NodeList.prototype.forEach &&
    (e.NodeList.prototype.forEach = Array.prototype.forEach);
  "DOMTokenList" in e &&
    !e.DOMTokenList.prototype.forEach &&
    (e.DOMTokenList.prototype.forEach = Array.prototype.forEach);
  Node.prototype.contains ||
    (Node.prototype.contains = (...e) => {
      let t = e[0];
      if (!(0 in e)) throw new TypeError("1 argument is required");
      do {
        if (this === t) return true;
      } while ((t = t && t.parentNode));
      return false;
    });
}
function Wt(e, t) {
  return Boolean(e.nodeName === "IFRAME" && t.getMeta(e));
}
function Ht(e, t) {
  return Boolean(
    e.nodeName === "LINK" &&
      e.nodeType === e.ELEMENT_NODE &&
      e.getAttribute &&
      e.getAttribute("rel") === "stylesheet" &&
      t.getMeta(e),
  );
}
function jt(e) {
  return Boolean(e?.shadowRoot);
}
class StyleSheetMirror {
  constructor() {
    this.id = 1;
    this.styleIDMap = new WeakMap();
    this.idStyleMap = new Map();
  }
  getId(e) {
    return this.styleIDMap.get(e) ?? -1;
  }
  has(e) {
    return this.styleIDMap.has(e);
  }
  /**
   * @returns If the stylesheet is in the mirror, returns the id of the stylesheet. If not, return the new assigned id.
   */ add(e, t) {
    if (this.has(e)) return this.getId(e);
    let n;
    n = t === void 0 ? this.id++ : t;
    this.styleIDMap.set(e, n);
    this.idStyleMap.set(n, e);
    return n;
  }
  getStyle(e) {
    return this.idStyleMap.get(e) || null;
  }
  reset() {
    this.styleIDMap = new WeakMap();
    this.idStyleMap = new Map();
    this.id = 1;
  }
  generateId() {
    return this.id++;
  }
}
function $t(e) {
  let t = null;
  e.getRootNode?.()?.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
    e.getRootNode().host &&
    (t = e.getRootNode().host);
  return t;
}
function qt(e) {
  let t = e;
  let n;
  while ((n = $t(t))) t = n;
  return t;
}
function Kt(e) {
  const t = e.ownerDocument;
  if (!t) return false;
  const n = qt(e);
  return t.contains(n);
}
function Vt(e) {
  const t = e.ownerDocument;
  return !!t && (t.contains(e) || Kt(e));
}
const Jt = {};
function Gt(e) {
  const t = Jt[e];
  if (t) return t;
  const n = window.document;
  let s = window[e];
  if (n && typeof n.createElement === "function")
    try {
      const t = n.createElement("iframe");
      t.hidden = true;
      n.head.appendChild(t);
      const r = t.contentWindow;
      r && r[e] && (s = r[e]);
      n.head.removeChild(t);
    } catch (e) {}
  return (Jt[e] = s.bind(window));
}
function Yt(...e) {
  return Gt("requestAnimationFrame")(...e);
}
function Xt(...e) {
  return Gt("setTimeout")(...e);
}
function Qt(...e) {
  return Gt("clearTimeout")(...e);
}
var Zt = ((e) => {
  e[(e.DomContentLoaded = 0)] = "DomContentLoaded";
  e[(e.Load = 1)] = "Load";
  e[(e.FullSnapshot = 2)] = "FullSnapshot";
  e[(e.IncrementalSnapshot = 3)] = "IncrementalSnapshot";
  e[(e.Meta = 4)] = "Meta";
  e[(e.Custom = 5)] = "Custom";
  e[(e.Plugin = 6)] = "Plugin";
  return e;
})(Zt || {});
var en = ((e) => {
  e[(e.Mutation = 0)] = "Mutation";
  e[(e.MouseMove = 1)] = "MouseMove";
  e[(e.MouseInteraction = 2)] = "MouseInteraction";
  e[(e.Scroll = 3)] = "Scroll";
  e[(e.ViewportResize = 4)] = "ViewportResize";
  e[(e.Input = 5)] = "Input";
  e[(e.TouchMove = 6)] = "TouchMove";
  e[(e.MediaInteraction = 7)] = "MediaInteraction";
  e[(e.StyleSheetRule = 8)] = "StyleSheetRule";
  e[(e.CanvasMutation = 9)] = "CanvasMutation";
  e[(e.Font = 10)] = "Font";
  e[(e.Log = 11)] = "Log";
  e[(e.Drag = 12)] = "Drag";
  e[(e.StyleDeclaration = 13)] = "StyleDeclaration";
  e[(e.Selection = 14)] = "Selection";
  e[(e.AdoptedStyleSheet = 15)] = "AdoptedStyleSheet";
  e[(e.CustomElement = 16)] = "CustomElement";
  return e;
})(en || {});
var tn = ((e) => {
  e[(e.MouseUp = 0)] = "MouseUp";
  e[(e.MouseDown = 1)] = "MouseDown";
  e[(e.Click = 2)] = "Click";
  e[(e.ContextMenu = 3)] = "ContextMenu";
  e[(e.DblClick = 4)] = "DblClick";
  e[(e.Focus = 5)] = "Focus";
  e[(e.Blur = 6)] = "Blur";
  e[(e.TouchStart = 7)] = "TouchStart";
  e[(e.TouchMove_Departed = 8)] = "TouchMove_Departed";
  e[(e.TouchEnd = 9)] = "TouchEnd";
  e[(e.TouchCancel = 10)] = "TouchCancel";
  return e;
})(tn || {});
var nn = ((e) => {
  e[(e.Mouse = 0)] = "Mouse";
  e[(e.Pen = 1)] = "Pen";
  e[(e.Touch = 2)] = "Touch";
  return e;
})(nn || {});
var sn = ((e) => {
  e[(e.Play = 0)] = "Play";
  e[(e.Pause = 1)] = "Pause";
  e[(e.Seeked = 2)] = "Seeked";
  e[(e.VolumeChange = 3)] = "VolumeChange";
  e[(e.RateChange = 4)] = "RateChange";
  return e;
})(sn || {});
function rn(e) {
  try {
    return e.contentDocument;
  } catch (e) {}
}
function on(e) {
  try {
    return e.contentWindow;
  } catch (e) {}
}
function an(e) {
  return "__ln" in e;
}
class DoubleLinkedList {
  constructor() {
    this.length = 0;
    this.head = null;
    this.tail = null;
  }
  get(e) {
    if (e >= this.length) throw new Error("Position outside of list range");
    let t = this.head;
    for (let n = 0; n < e; n++) t = t?.next || null;
    return t;
  }
  addNode(e) {
    const t = { value: e, previous: null, next: null };
    e.__ln = t;
    if (e.previousSibling && an(e.previousSibling)) {
      const n = e.previousSibling.__ln.next;
      t.next = n;
      t.previous = e.previousSibling.__ln;
      e.previousSibling.__ln.next = t;
      n && (n.previous = t);
    } else if (
      e.nextSibling &&
      an(e.nextSibling) &&
      e.nextSibling.__ln.previous
    ) {
      const n = e.nextSibling.__ln.previous;
      t.previous = n;
      t.next = e.nextSibling.__ln;
      e.nextSibling.__ln.previous = t;
      n && (n.next = t);
    } else {
      this.head && (this.head.previous = t);
      t.next = this.head;
      this.head = t;
    }
    t.next === null && (this.tail = t);
    this.length++;
  }
  removeNode(e) {
    const t = e.__ln;
    if (this.head) {
      if (t.previous) {
        t.previous.next = t.next;
        t.next ? (t.next.previous = t.previous) : (this.tail = t.previous);
      } else {
        this.head = t.next;
        this.head ? (this.head.previous = null) : (this.tail = null);
      }
      e.__ln && delete e.__ln;
      this.length--;
    }
  }
}
const cn = (e, t) => `${e}@${t}`;
class MutationBuffer {
  constructor() {
    this.frozen = false;
    this.locked = false;
    this.texts = [];
    this.attributes = [];
    this.attributeMap = new WeakMap();
    this.removes = [];
    this.mapRemoves = [];
    this.movedMap = {};
    this.addedSet = new Set();
    this.movedSet = new Set();
    this.droppedSet = new Set();
    this.processMutations = (e) => {
      e.forEach(this.processMutation);
      this.emit();
    };
    this.emit = () => {
      if (this.frozen || this.locked) return;
      const e = [];
      const t = new Set();
      const n = new DoubleLinkedList();
      const s = (e) => {
        let t = e;
        let n = He;
        while (n === He) {
          t = t && t.nextSibling;
          n = t && this.mirror.getId(t);
        }
        return n;
      };
      const r = (r) => {
        if (!r.parentNode || !Vt(r)) return;
        const o = fe(r.parentNode)
          ? this.mirror.getId($t(r))
          : this.mirror.getId(r.parentNode);
        const i = s(r);
        if (o === -1 || i === -1) return n.addNode(r);
        const a = wt(r, {
          doc: this.doc,
          mirror: this.mirror,
          blockClass: this.blockClass,
          blockSelector: this.blockSelector,
          maskAllText: this.maskAllText,
          unblockSelector: this.unblockSelector,
          maskTextClass: this.maskTextClass,
          unmaskTextClass: this.unmaskTextClass,
          maskTextSelector: this.maskTextSelector,
          unmaskTextSelector: this.unmaskTextSelector,
          skipChild: true,
          newlyAddedElement: true,
          inlineStylesheet: this.inlineStylesheet,
          maskInputOptions: this.maskInputOptions,
          maskAttributeFn: this.maskAttributeFn,
          maskTextFn: this.maskTextFn,
          maskInputFn: this.maskInputFn,
          slimDOMOptions: this.slimDOMOptions,
          dataURLOptions: this.dataURLOptions,
          recordCanvas: this.recordCanvas,
          inlineImages: this.inlineImages,
          onSerialize: (e) => {
            Wt(e, this.mirror) &&
              !Nt(
                e,
                this.blockClass,
                this.blockSelector,
                this.unblockSelector,
                false,
              ) &&
              this.iframeManager.addIframe(e);
            Ht(e, this.mirror) && this.stylesheetManager.trackLinkElement(e);
            jt(r) &&
              this.shadowDomManager.addShadowRoot(r.shadowRoot, this.doc);
          },
          onIframeLoad: (e, t) => {
            if (
              !Nt(
                e,
                this.blockClass,
                this.blockSelector,
                this.unblockSelector,
                false,
              )
            ) {
              this.iframeManager.attachIframe(e, t);
              e.contentWindow && this.canvasManager.addWindow(e.contentWindow);
              this.shadowDomManager.observeAttachShadow(e);
            }
          },
          onStylesheetLoad: (e, t) => {
            this.stylesheetManager.attachLinkElement(e, t);
          },
          onBlockedImageLoad: (e, t, { width: n, height: s }) => {
            this.mutationCb({
              adds: [],
              removes: [],
              texts: [],
              attributes: [
                {
                  id: t.id,
                  attributes: { style: { width: `${n}px`, height: `${s}px` } },
                },
              ],
            });
          },
          ignoreCSSAttributes: this.ignoreCSSAttributes,
        });
        if (a) {
          e.push({ parentId: o, nextId: i, node: a });
          t.add(a.id);
        }
      };
      while (this.mapRemoves.length)
        this.mirror.removeNodeFromMap(this.mapRemoves.shift());
      for (const e of this.movedSet)
        (un(this.removes, e, this.mirror) &&
          !this.movedSet.has(e.parentNode)) ||
          r(e);
      for (const e of this.addedSet)
        hn(this.droppedSet, e) || un(this.removes, e, this.mirror)
          ? hn(this.movedSet, e)
            ? r(e)
            : this.droppedSet.add(e)
          : r(e);
      let o = null;
      while (n.length) {
        let e = null;
        if (o) {
          const t = this.mirror.getId(o.value.parentNode);
          const n = s(o.value);
          t !== -1 && n !== -1 && (e = o);
        }
        if (!e) {
          let t = n.tail;
          while (t) {
            const n = t;
            t = t.previous;
            if (n) {
              const t = this.mirror.getId(n.value.parentNode);
              const r = s(n.value);
              if (r === -1) continue;
              if (t !== -1) {
                e = n;
                break;
              }
              {
                const t = n.value;
                if (
                  t.parentNode &&
                  t.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
                ) {
                  const s = t.parentNode.host;
                  const r = this.mirror.getId(s);
                  if (r !== -1) {
                    e = n;
                    break;
                  }
                }
              }
            }
          }
        }
        if (!e) {
          while (n.head) n.removeNode(n.head.value);
          break;
        }
        o = e.previous;
        n.removeNode(e.value);
        r(e.value);
      }
      const i = {
        texts: this.texts
          .map((e) => ({ id: this.mirror.getId(e.node), value: e.value }))
          .filter((e) => !t.has(e.id))
          .filter((e) => this.mirror.has(e.id)),
        attributes: this.attributes
          .map((e) => {
            const { attributes: t } = e;
            if (typeof t.style === "string") {
              const n = JSON.stringify(e.styleDiff);
              const s = JSON.stringify(e._unchangedStyles);
              n.length < t.style.length &&
                (n + s).split("var(").length === t.style.split("var(").length &&
                (t.style = e.styleDiff);
            }
            return { id: this.mirror.getId(e.node), attributes: t };
          })
          .filter((e) => !t.has(e.id))
          .filter((e) => this.mirror.has(e.id)),
        removes: this.removes,
        adds: e,
      };
      if (
        i.texts.length ||
        i.attributes.length ||
        i.removes.length ||
        i.adds.length
      ) {
        this.texts = [];
        this.attributes = [];
        this.attributeMap = new WeakMap();
        this.removes = [];
        this.addedSet = new Set();
        this.movedSet = new Set();
        this.droppedSet = new Set();
        this.movedMap = {};
        this.mutationCb(i);
      }
    };
    this.processMutation = (e) => {
      if (!Bt(e.target, this.mirror))
        switch (e.type) {
          case "characterData": {
            const t = e.target.textContent;
            Nt(
              e.target,
              this.blockClass,
              this.blockSelector,
              this.unblockSelector,
              false,
            ) ||
              t === e.oldValue ||
              this.texts.push({
                value:
                  pt(
                    e.target,
                    this.maskTextClass,
                    this.maskTextSelector,
                    this.unmaskTextClass,
                    this.unmaskTextSelector,
                    this.maskAllText,
                  ) && t
                    ? this.maskTextFn
                      ? this.maskTextFn(t, Lt(e.target))
                      : t.replace(/[\S]/g, "*")
                    : t,
                node: e.target,
              });
            break;
          }
          case "attributes": {
            const t = e.target;
            let n = e.attributeName;
            let s = e.target.getAttribute(n);
            if (n === "value") {
              const n = Oe(t);
              const r = t.tagName;
              s = De(t, r, n);
              const o = Ee({
                maskInputOptions: this.maskInputOptions,
                tagName: r,
                type: n,
              });
              const i = pt(
                e.target,
                this.maskTextClass,
                this.maskTextSelector,
                this.unmaskTextClass,
                this.unmaskTextSelector,
                o,
              );
              s = Me({
                isMasked: i,
                element: t,
                value: s,
                maskInputFn: this.maskInputFn,
              });
            }
            if (
              Nt(
                e.target,
                this.blockClass,
                this.blockSelector,
                this.unblockSelector,
                false,
              ) ||
              s === e.oldValue
            )
              return;
            let r = this.attributeMap.get(e.target);
            if (
              t.tagName === "IFRAME" &&
              n === "src" &&
              !this.keepIframeSrcFn(s)
            ) {
              const e = rn(t);
              if (e) return;
              n = "rr_src";
            }
            if (!r) {
              r = {
                node: e.target,
                attributes: {},
                styleDiff: {},
                _unchangedStyles: {},
              };
              this.attributes.push(r);
              this.attributeMap.set(e.target, r);
            }
            n === "type" &&
              t.tagName === "INPUT" &&
              (e.oldValue || "").toLowerCase() === "password" &&
              t.setAttribute("data-rr-is-password", "true");
            if (!ct(t.tagName, n)) {
              r.attributes[n] = at(
                this.doc,
                xe(t.tagName),
                xe(n),
                s,
                t,
                this.maskAttributeFn,
              );
              if (n === "style") {
                if (!this.unattachedDoc)
                  try {
                    this.unattachedDoc =
                      document.implementation.createHTMLDocument();
                  } catch (e) {
                    this.unattachedDoc = this.doc;
                  }
                const n = this.unattachedDoc.createElement("span");
                e.oldValue && n.setAttribute("style", e.oldValue);
                for (const e of Array.from(t.style)) {
                  const s = t.style.getPropertyValue(e);
                  const o = t.style.getPropertyPriority(e);
                  s !== n.style.getPropertyValue(e) ||
                  o !== n.style.getPropertyPriority(e)
                    ? (r.styleDiff[e] = o === "" ? s : [s, o])
                    : (r._unchangedStyles[e] = [s, o]);
                }
                for (const e of Array.from(n.style))
                  t.style.getPropertyValue(e) === "" &&
                    (r.styleDiff[e] = false);
              }
            }
            break;
          }
          case "childList":
            if (
              Nt(
                e.target,
                this.blockClass,
                this.blockSelector,
                this.unblockSelector,
                true,
              )
            )
              return;
            e.addedNodes.forEach((t) => this.genAdds(t, e.target));
            e.removedNodes.forEach((t) => {
              const n = this.mirror.getId(t);
              const s = fe(e.target)
                ? this.mirror.getId(e.target.host)
                : this.mirror.getId(e.target);
              if (
                !Nt(
                  e.target,
                  this.blockClass,
                  this.blockSelector,
                  this.unblockSelector,
                  false,
                ) &&
                !Bt(t, this.mirror) &&
                Ft(t, this.mirror)
              ) {
                if (this.addedSet.has(t)) {
                  ln(this.addedSet, t);
                  this.droppedSet.add(t);
                } else
                  (this.addedSet.has(e.target) && n === -1) ||
                    Pt(e.target, this.mirror) ||
                    (this.movedSet.has(t) && this.movedMap[cn(n, s)]
                      ? ln(this.movedSet, t)
                      : this.removes.push({
                          parentId: s,
                          id: n,
                          isShadow: !(!fe(e.target) || !ye(e.target)) || void 0,
                        }));
                this.mapRemoves.push(t);
              }
            });
            break;
        }
    };
    this.genAdds = (e, t) => {
      if (
        !this.processedNodeManager.inOtherBuffer(e, this) &&
        !this.addedSet.has(e) &&
        !this.movedSet.has(e)
      ) {
        if (this.mirror.hasNode(e)) {
          if (Bt(e, this.mirror)) return;
          this.movedSet.add(e);
          let n = null;
          t && this.mirror.hasNode(t) && (n = this.mirror.getId(t));
          n && n !== -1 && (this.movedMap[cn(this.mirror.getId(e), n)] = true);
        } else {
          this.addedSet.add(e);
          this.droppedSet.delete(e);
        }
        if (
          !Nt(
            e,
            this.blockClass,
            this.blockSelector,
            this.unblockSelector,
            false,
          )
        ) {
          e.childNodes && e.childNodes.forEach((e) => this.genAdds(e));
          jt(e) &&
            e.shadowRoot.childNodes.forEach((t) => {
              this.processedNodeManager.add(t, this);
              this.genAdds(t, e);
            });
        }
      }
    };
  }
  init(e) {
    [
      "mutationCb",
      "blockClass",
      "blockSelector",
      "unblockSelector",
      "maskAllText",
      "maskTextClass",
      "unmaskTextClass",
      "maskTextSelector",
      "unmaskTextSelector",
      "inlineStylesheet",
      "maskInputOptions",
      "maskAttributeFn",
      "maskTextFn",
      "maskInputFn",
      "keepIframeSrcFn",
      "recordCanvas",
      "inlineImages",
      "slimDOMOptions",
      "dataURLOptions",
      "doc",
      "mirror",
      "iframeManager",
      "stylesheetManager",
      "shadowDomManager",
      "canvasManager",
      "processedNodeManager",
      "ignoreCSSAttributes",
    ].forEach((t) => {
      this[t] = e[t];
    });
  }
  freeze() {
    this.frozen = true;
    this.canvasManager.freeze();
  }
  unfreeze() {
    this.frozen = false;
    this.canvasManager.unfreeze();
    this.emit();
  }
  isFrozen() {
    return this.frozen;
  }
  lock() {
    this.locked = true;
    this.canvasManager.lock();
  }
  unlock() {
    this.locked = false;
    this.canvasManager.unlock();
    this.emit();
  }
  reset() {
    this.shadowDomManager.reset();
    this.canvasManager.reset();
  }
}
function ln(e, t) {
  e.delete(t);
  t.childNodes?.forEach((t) => ln(e, t));
}
function un(e, t, n) {
  return e.length !== 0 && dn(e, t, n);
}
function dn(e, t, n) {
  let s = t.parentNode;
  while (s) {
    const t = n.getId(s);
    if (e.some((e) => e.id === t)) return true;
    s = s.parentNode;
  }
  return false;
}
function hn(e, t) {
  return e.size !== 0 && pn(e, t);
}
function pn(e, t) {
  const { parentNode: n } = t;
  return !!n && (!!e.has(n) || pn(e, n));
}
let mn;
function fn(e) {
  mn = e;
}
function yn() {
  mn = void 0;
}
const gn = (e) => {
  if (!mn) return e;
  const t = (...t) => {
    try {
      return e(...t);
    } catch (e) {
      if (mn && mn(e) === true) return () => {};
      throw e;
    }
  };
  return t;
};
const Sn = [];
function kn(e) {
  try {
    if ("composedPath" in e) {
      const t = e.composedPath();
      if (t.length) return t[0];
    } else if ("path" in e && e.path.length) return e.path[0];
  } catch {}
  return e && e.target;
}
function bn(e, t) {
  const n = new MutationBuffer();
  Sn.push(n);
  n.init(e);
  let s = window.MutationObserver || window.__rrMutationObserver;
  const r = window?.Zone?.__symbol__?.("MutationObserver");
  r && window[r] && (s = window[r]);
  const o = new s(
    gn((t) => {
      (e.onMutation && e.onMutation(t) === false) ||
        n.processMutations.bind(n)(t);
    }),
  );
  o.observe(t, {
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true,
  });
  return o;
}
function vn({ mousemoveCb: e, sampling: t, doc: n, mirror: s }) {
  if (t.mousemove === false) return () => {};
  const r = typeof t.mousemove === "number" ? t.mousemove : 50;
  const o = typeof t.mousemoveCallback === "number" ? t.mousemoveCallback : 500;
  let i = [];
  let a;
  const c = Mt(
    gn((t) => {
      const n = Date.now() - a;
      e(
        i.map((e) => {
          e.timeOffset -= n;
          return e;
        }),
        t,
      );
      i = [];
      a = null;
    }),
    o,
  );
  const l = gn(
    Mt(
      gn((e) => {
        const t = kn(e);
        const { clientX: n, clientY: r } = zt(e) ? e.changedTouches[0] : e;
        a || (a = Rt());
        i.push({ x: n, y: r, id: s.getId(t), timeOffset: Rt() - a });
        c(
          typeof DragEvent !== "undefined" && e instanceof DragEvent
            ? en.Drag
            : e instanceof MouseEvent
              ? en.MouseMove
              : en.TouchMove,
        );
      }),
      r,
      { trailing: false },
    ),
  );
  const u = [It("mousemove", l, n), It("touchmove", l, n), It("drag", l, n)];
  return gn(() => {
    u.forEach((e) => e());
  });
}
function wn({
  mouseInteractionCb: e,
  doc: t,
  mirror: n,
  blockClass: s,
  blockSelector: r,
  unblockSelector: o,
  sampling: i,
}) {
  if (i.mouseInteraction === false) return () => {};
  const a =
    i.mouseInteraction === true || i.mouseInteraction === void 0
      ? {}
      : i.mouseInteraction;
  const c = [];
  let l = null;
  const u = (t) => (i) => {
    const a = kn(i);
    if (Nt(a, s, r, o, true)) return;
    let c = null;
    let u = t;
    if ("pointerType" in i) {
      switch (i.pointerType) {
        case "mouse":
          c = nn.Mouse;
          break;
        case "touch":
          c = nn.Touch;
          break;
        case "pen":
          c = nn.Pen;
          break;
      }
      c === nn.Touch
        ? tn[t] === tn.MouseDown
          ? (u = "TouchStart")
          : tn[t] === tn.MouseUp && (u = "TouchEnd")
        : c === nn.Pen;
    } else zt(i) && (c = nn.Touch);
    if (c !== null) {
      l = c;
      ((u.startsWith("Touch") && c === nn.Touch) ||
        (u.startsWith("Mouse") && c === nn.Mouse)) &&
        (c = null);
    } else if (tn[t] === tn.Click) {
      c = l;
      l = null;
    }
    const d = zt(i) ? i.changedTouches[0] : i;
    if (!d) return;
    const h = n.getId(a);
    const { clientX: p, clientY: m } = d;
    gn(e)({
      type: tn[u],
      id: h,
      x: p,
      y: m,
      ...(c !== null && { pointerType: c }),
    });
  };
  Object.keys(tn)
    .filter(
      (e) =>
        Number.isNaN(Number(e)) && !e.endsWith("_Departed") && a[e] !== false,
    )
    .forEach((e) => {
      let n = xe(e);
      const s = u(e);
      if (window.PointerEvent)
        switch (tn[e]) {
          case tn.MouseDown:
          case tn.MouseUp:
            n = n.replace("mouse", "pointer");
            break;
          case tn.TouchStart:
          case tn.TouchEnd:
            return;
        }
      c.push(It(n, s, t));
    });
  return gn(() => {
    c.forEach((e) => e());
  });
}
function _n({
  scrollCb: e,
  doc: t,
  mirror: n,
  blockClass: s,
  blockSelector: r,
  unblockSelector: o,
  sampling: i,
}) {
  const a = gn(
    Mt(
      gn((i) => {
        const a = kn(i);
        if (!a || Nt(a, s, r, o, true)) return;
        const c = n.getId(a);
        if (a === t && t.defaultView) {
          const n = At(t.defaultView);
          e({ id: c, x: n.left, y: n.top });
        } else e({ id: c, x: a.scrollLeft, y: a.scrollTop });
      }),
      i.scroll || 100,
    ),
  );
  return It("scroll", a, t);
}
function In({ viewportResizeCb: e }, { win: t }) {
  let n = -1;
  let s = -1;
  const r = gn(
    Mt(
      gn(() => {
        const t = Ot();
        const r = Dt();
        if (n !== t || s !== r) {
          e({ width: Number(r), height: Number(t) });
          n = t;
          s = r;
        }
      }),
      200,
    ),
  );
  return It("resize", r, t);
}
const Cn = ["INPUT", "TEXTAREA", "SELECT"];
const En = new WeakMap();
function Mn({
  inputCb: e,
  doc: t,
  mirror: n,
  blockClass: s,
  blockSelector: r,
  unblockSelector: o,
  ignoreClass: i,
  ignoreSelector: a,
  maskInputOptions: c,
  maskInputFn: l,
  sampling: u,
  userTriggeredOnInput: d,
  maskTextClass: h,
  unmaskTextClass: p,
  maskTextSelector: m,
  unmaskTextSelector: f,
}) {
  function y(e) {
    let n = kn(e);
    const u = e.isTrusted;
    const y = n && Te(n.tagName);
    y === "OPTION" && (n = n.parentElement);
    if (!n || !y || Cn.indexOf(y) < 0 || Nt(n, s, r, o, true)) return;
    const S = n;
    if (S.classList.contains(i) || (a && S.matches(a))) return;
    const k = Oe(n);
    let b = De(S, y, k);
    let v = false;
    const w = Ee({ maskInputOptions: c, tagName: y, type: k });
    const _ = pt(n, h, m, p, f, w);
    (k !== "radio" && k !== "checkbox") || (v = n.checked);
    b = Me({ isMasked: _, element: n, value: b, maskInputFn: l });
    g(
      n,
      d
        ? { text: b, isChecked: v, userTriggered: u }
        : { text: b, isChecked: v },
    );
    const I = n.name;
    k === "radio" &&
      I &&
      v &&
      t.querySelectorAll(`input[type="radio"][name="${I}"]`).forEach((e) => {
        if (e !== n) {
          const t = Me({
            isMasked: _,
            element: e,
            value: De(e, y, k),
            maskInputFn: l,
          });
          g(
            e,
            d
              ? { text: t, isChecked: !v, userTriggered: false }
              : { text: t, isChecked: !v },
          );
        }
      });
  }
  function g(t, s) {
    const r = En.get(t);
    if (!r || r.text !== s.text || r.isChecked !== s.isChecked) {
      En.set(t, s);
      const r = n.getId(t);
      gn(e)({ ...s, id: r });
    }
  }
  const S = u.input === "last" ? ["change"] : ["input", "change"];
  const k = S.map((e) => It(e, gn(y), t));
  const b = t.defaultView;
  if (!b)
    return () => {
      k.forEach((e) => e());
    };
  const v = b.Object.getOwnPropertyDescriptor(
    b.HTMLInputElement.prototype,
    "value",
  );
  const w = [
    [b.HTMLInputElement.prototype, "value"],
    [b.HTMLInputElement.prototype, "checked"],
    [b.HTMLSelectElement.prototype, "value"],
    [b.HTMLTextAreaElement.prototype, "value"],
    [b.HTMLSelectElement.prototype, "selectedIndex"],
    [b.HTMLOptionElement.prototype, "selected"],
  ];
  v &&
    v.set &&
    k.push(
      ...w.map((e) =>
        xt(
          e[0],
          e[1],
          {
            set() {
              gn(y)({ target: this, isTrusted: false });
            },
          },
          false,
          b,
        ),
      ),
    );
  return gn(() => {
    k.forEach((e) => e());
  });
}
function xn(e) {
  const t = [];
  function n(e, t) {
    if (
      (Pn("CSSGroupingRule") && e.parentRule instanceof CSSGroupingRule) ||
      (Pn("CSSMediaRule") && e.parentRule instanceof CSSMediaRule) ||
      (Pn("CSSSupportsRule") && e.parentRule instanceof CSSSupportsRule) ||
      (Pn("CSSConditionRule") && e.parentRule instanceof CSSConditionRule)
    ) {
      const n = Array.from(e.parentRule.cssRules);
      const s = n.indexOf(e);
      t.unshift(s);
    } else if (e.parentStyleSheet) {
      const n = Array.from(e.parentStyleSheet.cssRules);
      const s = n.indexOf(e);
      t.unshift(s);
    }
    return t;
  }
  return n(e, t);
}
function Tn(e, t, n) {
  let s, r;
  if (!e) return {};
  e.ownerNode ? (s = t.getId(e.ownerNode)) : (r = n.getId(e));
  return { styleId: r, id: s };
}
function Rn(
  { styleSheetRuleCb: e, mirror: t, stylesheetManager: n },
  { win: s },
) {
  if (!s.CSSStyleSheet || !s.CSSStyleSheet.prototype) return () => {};
  const r = s.CSSStyleSheet.prototype.insertRule;
  s.CSSStyleSheet.prototype.insertRule = new Proxy(r, {
    apply: gn((s, r, o) => {
      const [i, a] = o;
      const { id: c, styleId: l } = Tn(r, t, n.styleMirror);
      ((c && c !== -1) || (l && l !== -1)) &&
        e({ id: c, styleId: l, adds: [{ rule: i, index: a }] });
      return s.apply(r, o);
    }),
  });
  const o = s.CSSStyleSheet.prototype.deleteRule;
  s.CSSStyleSheet.prototype.deleteRule = new Proxy(o, {
    apply: gn((s, r, o) => {
      const [i] = o;
      const { id: a, styleId: c } = Tn(r, t, n.styleMirror);
      ((a && a !== -1) || (c && c !== -1)) &&
        e({ id: a, styleId: c, removes: [{ index: i }] });
      return s.apply(r, o);
    }),
  });
  let i;
  if (s.CSSStyleSheet.prototype.replace) {
    i = s.CSSStyleSheet.prototype.replace;
    s.CSSStyleSheet.prototype.replace = new Proxy(i, {
      apply: gn((s, r, o) => {
        const [i] = o;
        const { id: a, styleId: c } = Tn(r, t, n.styleMirror);
        ((a && a !== -1) || (c && c !== -1)) &&
          e({ id: a, styleId: c, replace: i });
        return s.apply(r, o);
      }),
    });
  }
  let a;
  if (s.CSSStyleSheet.prototype.replaceSync) {
    a = s.CSSStyleSheet.prototype.replaceSync;
    s.CSSStyleSheet.prototype.replaceSync = new Proxy(a, {
      apply: gn((s, r, o) => {
        const [i] = o;
        const { id: a, styleId: c } = Tn(r, t, n.styleMirror);
        ((a && a !== -1) || (c && c !== -1)) &&
          e({ id: a, styleId: c, replaceSync: i });
        return s.apply(r, o);
      }),
    });
  }
  const c = {};
  if (zn("CSSGroupingRule")) c.CSSGroupingRule = s.CSSGroupingRule;
  else {
    zn("CSSMediaRule") && (c.CSSMediaRule = s.CSSMediaRule);
    zn("CSSConditionRule") && (c.CSSConditionRule = s.CSSConditionRule);
    zn("CSSSupportsRule") && (c.CSSSupportsRule = s.CSSSupportsRule);
  }
  const l = {};
  Object.entries(c).forEach(([s, r]) => {
    l[s] = {
      insertRule: r.prototype.insertRule,
      deleteRule: r.prototype.deleteRule,
    };
    r.prototype.insertRule = new Proxy(l[s].insertRule, {
      apply: gn((s, r, o) => {
        const [i, a] = o;
        const { id: c, styleId: l } = Tn(r.parentStyleSheet, t, n.styleMirror);
        ((c && c !== -1) || (l && l !== -1)) &&
          e({
            id: c,
            styleId: l,
            adds: [{ rule: i, index: [...xn(r), a || 0] }],
          });
        return s.apply(r, o);
      }),
    });
    r.prototype.deleteRule = new Proxy(l[s].deleteRule, {
      apply: gn((s, r, o) => {
        const [i] = o;
        const { id: a, styleId: c } = Tn(r.parentStyleSheet, t, n.styleMirror);
        ((a && a !== -1) || (c && c !== -1)) &&
          e({ id: a, styleId: c, removes: [{ index: [...xn(r), i] }] });
        return s.apply(r, o);
      }),
    });
  });
  return gn(() => {
    s.CSSStyleSheet.prototype.insertRule = r;
    s.CSSStyleSheet.prototype.deleteRule = o;
    i && (s.CSSStyleSheet.prototype.replace = i);
    a && (s.CSSStyleSheet.prototype.replaceSync = a);
    Object.entries(c).forEach(([e, t]) => {
      t.prototype.insertRule = l[e].insertRule;
      t.prototype.deleteRule = l[e].deleteRule;
    });
  });
}
function An({ mirror: e, stylesheetManager: t }, n) {
  let s = null;
  s = n.nodeName === "#document" ? e.getId(n) : e.getId(n.host);
  const r =
    n.nodeName === "#document"
      ? n.defaultView?.Document
      : n.ownerDocument?.defaultView?.ShadowRoot;
  const o = r?.prototype
    ? Object.getOwnPropertyDescriptor(r?.prototype, "adoptedStyleSheets")
    : void 0;
  if (s === null || s === -1 || !r || !o) return () => {};
  Object.defineProperty(n, "adoptedStyleSheets", {
    configurable: o.configurable,
    enumerable: o.enumerable,
    get() {
      return o.get?.call(this);
    },
    set(e) {
      const n = o.set?.call(this, e);
      if (s !== null && s !== -1)
        try {
          t.adoptStyleSheets(e, s);
        } catch (e) {}
      return n;
    },
  });
  return gn(() => {
    Object.defineProperty(n, "adoptedStyleSheets", {
      configurable: o.configurable,
      enumerable: o.enumerable,
      get: o.get,
      set: o.set,
    });
  });
}
function On(
  {
    styleDeclarationCb: e,
    mirror: t,
    ignoreCSSAttributes: n,
    stylesheetManager: s,
  },
  { win: r },
) {
  const o = r.CSSStyleDeclaration.prototype.setProperty;
  r.CSSStyleDeclaration.prototype.setProperty = new Proxy(o, {
    apply: gn((r, i, a) => {
      const [c, l, u] = a;
      if (n.has(c)) return o.apply(i, [c, l, u]);
      const { id: d, styleId: h } = Tn(
        i.parentRule?.parentStyleSheet,
        t,
        s.styleMirror,
      );
      ((d && d !== -1) || (h && h !== -1)) &&
        e({
          id: d,
          styleId: h,
          set: { property: c, value: l, priority: u },
          index: xn(i.parentRule),
        });
      return r.apply(i, a);
    }),
  });
  const i = r.CSSStyleDeclaration.prototype.removeProperty;
  r.CSSStyleDeclaration.prototype.removeProperty = new Proxy(i, {
    apply: gn((r, o, a) => {
      const [c] = a;
      if (n.has(c)) return i.apply(o, [c]);
      const { id: l, styleId: u } = Tn(
        o.parentRule?.parentStyleSheet,
        t,
        s.styleMirror,
      );
      ((l && l !== -1) || (u && u !== -1)) &&
        e({
          id: l,
          styleId: u,
          remove: { property: c },
          index: xn(o.parentRule),
        });
      return r.apply(o, a);
    }),
  });
  return gn(() => {
    r.CSSStyleDeclaration.prototype.setProperty = o;
    r.CSSStyleDeclaration.prototype.removeProperty = i;
  });
}
function Dn({
  mediaInteractionCb: e,
  blockClass: t,
  blockSelector: n,
  unblockSelector: s,
  mirror: r,
  sampling: o,
  doc: i,
}) {
  const a = gn((i) =>
    Mt(
      gn((o) => {
        const a = kn(o);
        if (!a || Nt(a, t, n, s, true)) return;
        const { currentTime: c, volume: l, muted: u, playbackRate: d } = a;
        e({
          type: i,
          id: r.getId(a),
          currentTime: c,
          volume: l,
          muted: u,
          playbackRate: d,
        });
      }),
      o.media || 500,
    ),
  );
  const c = [
    It("play", a(sn.Play), i),
    It("pause", a(sn.Pause), i),
    It("seeked", a(sn.Seeked), i),
    It("volumechange", a(sn.VolumeChange), i),
    It("ratechange", a(sn.RateChange), i),
  ];
  return gn(() => {
    c.forEach((e) => e());
  });
}
function Ln({ fontCb: e, doc: t }) {
  const n = t.defaultView;
  if (!n) return () => {};
  const s = [];
  const r = new WeakMap();
  const o = n.FontFace;
  n.FontFace = function (e, t, n) {
    const s = new o(e, t, n);
    r.set(s, {
      family: e,
      buffer: typeof t !== "string",
      descriptors: n,
      fontSource:
        typeof t === "string"
          ? t
          : JSON.stringify(Array.from(new Uint8Array(t))),
    });
    return s;
  };
  const i = Tt(t.fonts, "add", function (t) {
    return function (n) {
      Xt(
        gn(() => {
          const t = r.get(n);
          if (t) {
            e(t);
            r.delete(n);
          }
        }),
        0,
      );
      return t.apply(this, [n]);
    };
  });
  s.push(() => {
    n.FontFace = o;
  });
  s.push(i);
  return gn(() => {
    s.forEach((e) => e());
  });
}
function Nn(e) {
  const {
    doc: t,
    mirror: n,
    blockClass: s,
    blockSelector: r,
    unblockSelector: o,
    selectionCb: i,
  } = e;
  let a = true;
  const c = gn(() => {
    const e = t.getSelection();
    if (!e || (a && e?.isCollapsed)) return;
    a = e.isCollapsed || false;
    const c = [];
    const l = e.rangeCount || 0;
    for (let t = 0; t < l; t++) {
      const i = e.getRangeAt(t);
      const {
        startContainer: a,
        startOffset: l,
        endContainer: u,
        endOffset: d,
      } = i;
      const h = Nt(a, s, r, o, true) || Nt(u, s, r, o, true);
      h ||
        c.push({
          start: n.getId(a),
          startOffset: l,
          end: n.getId(u),
          endOffset: d,
        });
    }
    i({ ranges: c });
  });
  c();
  return It("selectionchange", c);
}
function Fn({ doc: e, customElementCb: t }) {
  const n = e.defaultView;
  if (!n || !n.customElements) return () => {};
  const s = Tt(n.customElements, "define", function (e) {
    return function (n, s, r) {
      try {
        t({ define: { name: n } });
      } catch (e) {}
      return e.apply(this, [n, s, r]);
    };
  });
  return s;
}
function Bn(e, t = {}) {
  const n = e.doc.defaultView;
  if (!n) return () => {};
  let s;
  e.recordDOM && (s = bn(e, e.doc));
  const r = vn(e);
  const o = wn(e);
  const i = _n(e);
  const a = In(e, { win: n });
  const c = Mn(e);
  const l = Dn(e);
  let u = () => {};
  let d = () => {};
  let h = () => {};
  let p = () => {};
  if (e.recordDOM) {
    u = Rn(e, { win: n });
    d = An(e, e.doc);
    h = On(e, { win: n });
    e.collectFonts && (p = Ln(e));
  }
  const m = Nn(e);
  const f = Fn(e);
  const y = [];
  for (const t of e.plugins) y.push(t.observer(t.callback, n, t.options));
  return gn(() => {
    Sn.forEach((e) => e.reset());
    s?.disconnect();
    r();
    o();
    i();
    a();
    c();
    l();
    u();
    d();
    h();
    p();
    m();
    f();
    y.forEach((e) => e());
  });
}
function Pn(e) {
  return typeof window[e] !== "undefined";
}
function zn(e) {
  return Boolean(
    typeof window[e] !== "undefined" &&
      window[e].prototype &&
      "insertRule" in window[e].prototype &&
      "deleteRule" in window[e].prototype,
  );
}
class CrossOriginIframeMirror {
  constructor(e) {
    this.generateIdFn = e;
    this.iframeIdToRemoteIdMap = new WeakMap();
    this.iframeRemoteIdToIdMap = new WeakMap();
  }
  getId(e, t, n, s) {
    const r = n || this.getIdToRemoteIdMap(e);
    const o = s || this.getRemoteIdToIdMap(e);
    let i = r.get(t);
    if (!i) {
      i = this.generateIdFn();
      r.set(t, i);
      o.set(i, t);
    }
    return i;
  }
  getIds(e, t) {
    const n = this.getIdToRemoteIdMap(e);
    const s = this.getRemoteIdToIdMap(e);
    return t.map((t) => this.getId(e, t, n, s));
  }
  getRemoteId(e, t, n) {
    const s = n || this.getRemoteIdToIdMap(e);
    if (typeof t !== "number") return t;
    const r = s.get(t);
    return r || -1;
  }
  getRemoteIds(e, t) {
    const n = this.getRemoteIdToIdMap(e);
    return t.map((t) => this.getRemoteId(e, t, n));
  }
  reset(e) {
    if (e) {
      this.iframeIdToRemoteIdMap.delete(e);
      this.iframeRemoteIdToIdMap.delete(e);
    } else {
      this.iframeIdToRemoteIdMap = new WeakMap();
      this.iframeRemoteIdToIdMap = new WeakMap();
    }
  }
  getIdToRemoteIdMap(e) {
    let t = this.iframeIdToRemoteIdMap.get(e);
    if (!t) {
      t = new Map();
      this.iframeIdToRemoteIdMap.set(e, t);
    }
    return t;
  }
  getRemoteIdToIdMap(e) {
    let t = this.iframeRemoteIdToIdMap.get(e);
    if (!t) {
      t = new Map();
      this.iframeRemoteIdToIdMap.set(e, t);
    }
    return t;
  }
}
class IframeManagerNoop {
  constructor() {
    this.crossOriginIframeMirror = new CrossOriginIframeMirror(je);
    this.crossOriginIframeRootIdMap = new WeakMap();
  }
  addIframe() {}
  addLoadListener() {}
  attachIframe() {}
}
class IframeManager {
  constructor(e) {
    this.iframes = new WeakMap();
    this.crossOriginIframeMap = new WeakMap();
    this.crossOriginIframeMirror = new CrossOriginIframeMirror(je);
    this.crossOriginIframeRootIdMap = new WeakMap();
    this.mutationCb = e.mutationCb;
    this.wrappedEmit = e.wrappedEmit;
    this.stylesheetManager = e.stylesheetManager;
    this.recordCrossOriginIframes = e.recordCrossOriginIframes;
    this.crossOriginIframeStyleMirror = new CrossOriginIframeMirror(
      this.stylesheetManager.styleMirror.generateId.bind(
        this.stylesheetManager.styleMirror,
      ),
    );
    this.mirror = e.mirror;
    this.recordCrossOriginIframes &&
      window.addEventListener("message", this.handleMessage.bind(this));
  }
  addIframe(e) {
    this.iframes.set(e, true);
    e.contentWindow && this.crossOriginIframeMap.set(e.contentWindow, e);
  }
  addLoadListener(e) {
    this.loadListener = e;
  }
  attachIframe(e, t) {
    this.mutationCb({
      adds: [{ parentId: this.mirror.getId(e), nextId: null, node: t }],
      removes: [],
      texts: [],
      attributes: [],
      isAttachIframe: true,
    });
    this.recordCrossOriginIframes &&
      e.contentWindow?.addEventListener(
        "message",
        this.handleMessage.bind(this),
      );
    this.loadListener?.(e);
    const n = rn(e);
    n &&
      n.adoptedStyleSheets &&
      n.adoptedStyleSheets.length > 0 &&
      this.stylesheetManager.adoptStyleSheets(
        n.adoptedStyleSheets,
        this.mirror.getId(n),
      );
  }
  handleMessage(e) {
    const t = e;
    if (t.data.type !== "rrweb" || t.origin !== t.data.origin) return;
    const n = e.source;
    if (!n) return;
    const s = this.crossOriginIframeMap.get(e.source);
    if (!s) return;
    const r = this.transformCrossOriginEvent(s, t.data.event);
    r && this.wrappedEmit(r, t.data.isCheckout);
  }
  transformCrossOriginEvent(e, t) {
    switch (t.type) {
      case Zt.FullSnapshot: {
        this.crossOriginIframeMirror.reset(e);
        this.crossOriginIframeStyleMirror.reset(e);
        this.replaceIdOnNode(t.data.node, e);
        const n = t.data.node.id;
        this.crossOriginIframeRootIdMap.set(e, n);
        this.patchRootIdOnNode(t.data.node, n);
        return {
          timestamp: t.timestamp,
          type: Zt.IncrementalSnapshot,
          data: {
            source: en.Mutation,
            adds: [
              {
                parentId: this.mirror.getId(e),
                nextId: null,
                node: t.data.node,
              },
            ],
            removes: [],
            texts: [],
            attributes: [],
            isAttachIframe: true,
          },
        };
      }
      case Zt.Meta:
      case Zt.Load:
      case Zt.DomContentLoaded:
        return false;
      case Zt.Plugin:
        return t;
      case Zt.Custom:
        this.replaceIds(t.data.payload, e, [
          "id",
          "parentId",
          "previousId",
          "nextId",
        ]);
        return t;
      case Zt.IncrementalSnapshot:
        switch (t.data.source) {
          case en.Mutation:
            t.data.adds.forEach((t) => {
              this.replaceIds(t, e, ["parentId", "nextId", "previousId"]);
              this.replaceIdOnNode(t.node, e);
              const n = this.crossOriginIframeRootIdMap.get(e);
              n && this.patchRootIdOnNode(t.node, n);
            });
            t.data.removes.forEach((t) => {
              this.replaceIds(t, e, ["parentId", "id"]);
            });
            t.data.attributes.forEach((t) => {
              this.replaceIds(t, e, ["id"]);
            });
            t.data.texts.forEach((t) => {
              this.replaceIds(t, e, ["id"]);
            });
            return t;
          case en.Drag:
          case en.TouchMove:
          case en.MouseMove:
            t.data.positions.forEach((t) => {
              this.replaceIds(t, e, ["id"]);
            });
            return t;
          case en.ViewportResize:
            return false;
          case en.MediaInteraction:
          case en.MouseInteraction:
          case en.Scroll:
          case en.CanvasMutation:
          case en.Input:
            this.replaceIds(t.data, e, ["id"]);
            return t;
          case en.StyleSheetRule:
          case en.StyleDeclaration:
            this.replaceIds(t.data, e, ["id"]);
            this.replaceStyleIds(t.data, e, ["styleId"]);
            return t;
          case en.Font:
            return t;
          case en.Selection:
            t.data.ranges.forEach((t) => {
              this.replaceIds(t, e, ["start", "end"]);
            });
            return t;
          case en.AdoptedStyleSheet:
            this.replaceIds(t.data, e, ["id"]);
            this.replaceStyleIds(t.data, e, ["styleIds"]);
            t.data.styles?.forEach((t) => {
              this.replaceStyleIds(t, e, ["styleId"]);
            });
            return t;
        }
    }
    return false;
  }
  replace(e, t, n, s) {
    for (const r of s)
      (Array.isArray(t[r]) || typeof t[r] === "number") &&
        (Array.isArray(t[r])
          ? (t[r] = e.getIds(n, t[r]))
          : (t[r] = e.getId(n, t[r])));
    return t;
  }
  replaceIds(e, t, n) {
    return this.replace(this.crossOriginIframeMirror, e, t, n);
  }
  replaceStyleIds(e, t, n) {
    return this.replace(this.crossOriginIframeStyleMirror, e, t, n);
  }
  replaceIdOnNode(e, t) {
    this.replaceIds(e, t, ["id", "rootId"]);
    "childNodes" in e &&
      e.childNodes.forEach((e) => {
        this.replaceIdOnNode(e, t);
      });
  }
  patchRootIdOnNode(e, t) {
    e.type === pe.Document || e.rootId || (e.rootId = t);
    "childNodes" in e &&
      e.childNodes.forEach((e) => {
        this.patchRootIdOnNode(e, t);
      });
  }
}
class ShadowDomManagerNoop {
  init() {}
  addShadowRoot() {}
  observeAttachShadow() {}
  reset() {}
}
class ShadowDomManager {
  constructor(e) {
    this.shadowDoms = new WeakSet();
    this.restoreHandlers = [];
    this.mutationCb = e.mutationCb;
    this.scrollCb = e.scrollCb;
    this.bypassOptions = e.bypassOptions;
    this.mirror = e.mirror;
    this.init();
  }
  init() {
    this.reset();
    this.patchAttachShadow(Element, document);
  }
  addShadowRoot(e, t) {
    if (!ye(e)) return;
    if (this.shadowDoms.has(e)) return;
    this.shadowDoms.add(e);
    this.bypassOptions.canvasManager.addShadowRoot(e);
    const n = bn(
      {
        ...this.bypassOptions,
        doc: t,
        mutationCb: this.mutationCb,
        mirror: this.mirror,
        shadowDomManager: this,
      },
      e,
    );
    this.restoreHandlers.push(() => n.disconnect());
    this.restoreHandlers.push(
      _n({
        ...this.bypassOptions,
        scrollCb: this.scrollCb,
        doc: e,
        mirror: this.mirror,
      }),
    );
    Xt(() => {
      e.adoptedStyleSheets &&
        e.adoptedStyleSheets.length > 0 &&
        this.bypassOptions.stylesheetManager.adoptStyleSheets(
          e.adoptedStyleSheets,
          this.mirror.getId(e.host),
        );
      this.restoreHandlers.push(
        An(
          {
            mirror: this.mirror,
            stylesheetManager: this.bypassOptions.stylesheetManager,
          },
          e,
        ),
      );
    }, 0);
  }
  observeAttachShadow(e) {
    const t = rn(e);
    const n = on(e);
    t && n && this.patchAttachShadow(n.Element, t);
  }
  patchAttachShadow(e, t) {
    const n = this;
    this.restoreHandlers.push(
      Tt(e.prototype, "attachShadow", function (e) {
        return function (s) {
          const r = e.call(this, s);
          this.shadowRoot && Vt(this) && n.addShadowRoot(this.shadowRoot, t);
          return r;
        };
      }),
    );
  }
  reset() {
    this.restoreHandlers.forEach((e) => {
      try {
        e();
      } catch (e) {}
    });
    this.restoreHandlers = [];
    this.shadowDoms = new WeakSet();
    this.bypassOptions.canvasManager.resetShadowRoots();
  }
}
var Un = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var Wn = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (var Hn = 0; Hn < Un.length; Hn++) Wn[Un.charCodeAt(Hn)] = Hn;
class CanvasManagerNoop {
  reset() {}
  freeze() {}
  unfreeze() {}
  lock() {}
  unlock() {}
  snapshot() {}
  addWindow() {}
  addShadowRoot() {}
  resetShadowRoots() {}
}
class StylesheetManager {
  constructor(e) {
    this.trackedLinkElements = new WeakSet();
    this.styleMirror = new StyleSheetMirror();
    this.mutationCb = e.mutationCb;
    this.adoptedStyleSheetCb = e.adoptedStyleSheetCb;
  }
  attachLinkElement(e, t) {
    "_cssText" in t.attributes &&
      this.mutationCb({
        adds: [],
        removes: [],
        texts: [],
        attributes: [{ id: t.id, attributes: t.attributes }],
      });
    this.trackLinkElement(e);
  }
  trackLinkElement(e) {
    if (!this.trackedLinkElements.has(e)) {
      this.trackedLinkElements.add(e);
      this.trackStylesheetInLinkElement(e);
    }
  }
  adoptStyleSheets(e, t) {
    if (e.length === 0) return;
    const n = { id: t, styleIds: [] };
    const s = [];
    for (const t of e) {
      let e;
      if (this.styleMirror.has(t)) e = this.styleMirror.getId(t);
      else {
        e = this.styleMirror.add(t);
        s.push({
          styleId: e,
          rules: Array.from(t.rules || CSSRule, (e, t) => ({
            rule: ve(e),
            index: t,
          })),
        });
      }
      n.styleIds.push(e);
    }
    s.length > 0 && (n.styles = s);
    this.adoptedStyleSheetCb(n);
  }
  reset() {
    this.styleMirror.reset();
    this.trackedLinkElements = new WeakSet();
  }
  trackStylesheetInLinkElement(e) {}
}
class ProcessedNodeManager {
  constructor() {
    this.nodeMap = new WeakMap();
    this.active = false;
  }
  inOtherBuffer(e, t) {
    const n = this.nodeMap.get(e);
    return n && Array.from(n).some((e) => e !== t);
  }
  add(e, t) {
    if (!this.active) {
      this.active = true;
      Yt(() => {
        this.nodeMap = new WeakMap();
        this.active = false;
      });
    }
    this.nodeMap.set(e, (this.nodeMap.get(e) || new Set()).add(t));
  }
  destroy() {}
}
let jn;
let $n;
try {
  if (Array.from([1], (e) => e * 2)[0] !== 2) {
    const e = document.createElement("iframe");
    document.body.appendChild(e);
    Array.from = e.contentWindow?.Array.from || Array.from;
    document.body.removeChild(e);
  }
} catch (e) {
  console.debug("Unable to override Array.from", e);
}
const qn = Ce();
function Kn(e = {}) {
  const {
    emit: t,
    checkoutEveryNms: n,
    checkoutEveryNth: s,
    blockClass: r = "rr-block",
    blockSelector: o = null,
    unblockSelector: i = null,
    ignoreClass: a = "rr-ignore",
    ignoreSelector: c = null,
    maskAllText: l = false,
    maskTextClass: u = "rr-mask",
    unmaskTextClass: d = null,
    maskTextSelector: h = null,
    unmaskTextSelector: p = null,
    inlineStylesheet: m = true,
    maskAllInputs: f,
    maskInputOptions: y,
    slimDOMOptions: g,
    maskAttributeFn: S,
    maskInputFn: k,
    maskTextFn: b,
    maxCanvasSize: v = null,
    packFn: w,
    sampling: _ = {},
    dataURLOptions: I = {},
    mousemoveWait: C,
    recordDOM: E = true,
    recordCanvas: M = false,
    recordCrossOriginIframes: x = false,
    recordAfter: T = e.recordAfter === "DOMContentLoaded"
      ? e.recordAfter
      : "load",
    userTriggeredOnInput: R = false,
    collectFonts: A = false,
    inlineImages: O = false,
    plugins: D,
    keepIframeSrcFn: L = () => false,
    ignoreCSSAttributes: N = new Set([]),
    errorHandler: F,
    onMutation: B,
    getCanvasManager: P,
  } = e;
  fn(F);
  const z = !x || window.parent === window;
  let U = false;
  if (!z)
    try {
      window.parent.document && (U = false);
    } catch (e) {
      U = true;
    }
  if (z && !t) throw new Error("emit function is required");
  if (!z && !U) return () => {};
  C !== void 0 && _.mousemove === void 0 && (_.mousemove = C);
  qn.reset();
  const W =
    f === true
      ? {
          color: true,
          date: true,
          "datetime-local": true,
          email: true,
          month: true,
          number: true,
          range: true,
          search: true,
          tel: true,
          text: true,
          time: true,
          url: true,
          week: true,
          textarea: true,
          select: true,
          radio: true,
          checkbox: true,
        }
      : y !== void 0
        ? y
        : {};
  const H =
    g === true || g === "all"
      ? {
          script: true,
          comment: true,
          headFavicon: true,
          headWhitespace: true,
          headMetaSocial: true,
          headMetaRobots: true,
          headMetaHttpEquiv: true,
          headMetaVerification: true,
          headMetaAuthorship: g === "all",
          headMetaDescKeywords: g === "all",
        }
      : g || {};
  Ut();
  let j;
  let $ = 0;
  const q = (e) => {
    for (const t of D || []) t.eventProcessor && (e = t.eventProcessor(e));
    w && !U && (e = w(e));
    return e;
  };
  jn = (e, r) => {
    const o = e;
    o.timestamp = Rt();
    !Sn[0]?.isFrozen() ||
      o.type === Zt.FullSnapshot ||
      (o.type === Zt.IncrementalSnapshot && o.data.source === en.Mutation) ||
      Sn.forEach((e) => e.unfreeze());
    if (z) t?.(q(o), r);
    else if (U) {
      const e = {
        type: "rrweb",
        event: q(o),
        origin: window.location.origin,
        isCheckout: r,
      };
      window.parent.postMessage(e, "*");
    }
    if (o.type === Zt.FullSnapshot) {
      j = o;
      $ = 0;
    } else if (o.type === Zt.IncrementalSnapshot) {
      if (o.data.source === en.Mutation && o.data.isAttachIframe) return;
      $++;
      const e = s && $ >= s;
      const t = n && j && o.timestamp - j.timestamp > n;
      (e || t) && te(true);
    }
  };
  const K = (e) => {
    jn({ type: Zt.IncrementalSnapshot, data: { source: en.Mutation, ...e } });
  };
  const V = (e) =>
    jn({ type: Zt.IncrementalSnapshot, data: { source: en.Scroll, ...e } });
  const J = (e) =>
    jn({
      type: Zt.IncrementalSnapshot,
      data: { source: en.CanvasMutation, ...e },
    });
  const G = (e) =>
    jn({
      type: Zt.IncrementalSnapshot,
      data: { source: en.AdoptedStyleSheet, ...e },
    });
  const Y = new StylesheetManager({ mutationCb: K, adoptedStyleSheetCb: G });
  const X =
    typeof __RRWEB_EXCLUDE_IFRAME__ === "boolean" && __RRWEB_EXCLUDE_IFRAME__
      ? new IframeManagerNoop()
      : new IframeManager({
          mirror: qn,
          mutationCb: K,
          stylesheetManager: Y,
          recordCrossOriginIframes: x,
          wrappedEmit: jn,
        });
  for (const e of D || [])
    e.getMirror &&
      e.getMirror({
        nodeMirror: qn,
        crossOriginIframeMirror: X.crossOriginIframeMirror,
        crossOriginIframeStyleMirror: X.crossOriginIframeStyleMirror,
      });
  const Q = new ProcessedNodeManager();
  const Z = Jn(P, {
    mirror: qn,
    win: window,
    mutationCb: (e) =>
      jn({
        type: Zt.IncrementalSnapshot,
        data: { source: en.CanvasMutation, ...e },
      }),
    recordCanvas: M,
    blockClass: r,
    blockSelector: o,
    unblockSelector: i,
    maxCanvasSize: v,
    sampling: _.canvas,
    dataURLOptions: I,
    errorHandler: F,
  });
  const ee =
    typeof __RRWEB_EXCLUDE_SHADOW_DOM__ === "boolean" &&
    __RRWEB_EXCLUDE_SHADOW_DOM__
      ? new ShadowDomManagerNoop()
      : new ShadowDomManager({
          mutationCb: K,
          scrollCb: V,
          bypassOptions: {
            onMutation: B,
            blockClass: r,
            blockSelector: o,
            unblockSelector: i,
            maskAllText: l,
            maskTextClass: u,
            unmaskTextClass: d,
            maskTextSelector: h,
            unmaskTextSelector: p,
            inlineStylesheet: m,
            maskInputOptions: W,
            dataURLOptions: I,
            maskAttributeFn: S,
            maskTextFn: b,
            maskInputFn: k,
            recordCanvas: M,
            inlineImages: O,
            sampling: _,
            slimDOMOptions: H,
            iframeManager: X,
            stylesheetManager: Y,
            canvasManager: Z,
            keepIframeSrcFn: L,
            processedNodeManager: Q,
            ignoreCSSAttributes: N,
          },
          mirror: qn,
        });
  const te = (e = false) => {
    if (!E) return;
    jn(
      {
        type: Zt.Meta,
        data: { href: window.location.href, width: Dt(), height: Ot() },
      },
      e,
    );
    Y.reset();
    ee.init();
    Sn.forEach((e) => e.lock());
    const t = _t(document, {
      mirror: qn,
      blockClass: r,
      blockSelector: o,
      unblockSelector: i,
      maskAllText: l,
      maskTextClass: u,
      unmaskTextClass: d,
      maskTextSelector: h,
      unmaskTextSelector: p,
      inlineStylesheet: m,
      maskAllInputs: W,
      maskAttributeFn: S,
      maskInputFn: k,
      maskTextFn: b,
      slimDOM: H,
      dataURLOptions: I,
      recordCanvas: M,
      inlineImages: O,
      onSerialize: (e) => {
        Wt(e, qn) && X.addIframe(e);
        Ht(e, qn) && Y.trackLinkElement(e);
        jt(e) && ee.addShadowRoot(e.shadowRoot, document);
      },
      onIframeLoad: (e, t) => {
        X.attachIframe(e, t);
        e.contentWindow && Z.addWindow(e.contentWindow);
        ee.observeAttachShadow(e);
      },
      onStylesheetLoad: (e, t) => {
        Y.attachLinkElement(e, t);
      },
      onBlockedImageLoad: (e, t, { width: n, height: s }) => {
        K({
          adds: [],
          removes: [],
          texts: [],
          attributes: [
            {
              id: t.id,
              attributes: { style: { width: `${n}px`, height: `${s}px` } },
            },
          ],
        });
      },
      keepIframeSrcFn: L,
      ignoreCSSAttributes: N,
    });
    if (!t) return console.warn("Failed to snapshot the document");
    jn({ type: Zt.FullSnapshot, data: { node: t, initialOffset: At(window) } });
    Sn.forEach((e) => e.unlock());
    document.adoptedStyleSheets &&
      document.adoptedStyleSheets.length > 0 &&
      Y.adoptStyleSheets(document.adoptedStyleSheets, qn.getId(document));
  };
  $n = te;
  try {
    const e = [];
    const t = (e) =>
      gn(Bn)(
        {
          onMutation: B,
          mutationCb: K,
          mousemoveCb: (e, t) =>
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: t, positions: e },
            }),
          mouseInteractionCb: (e) =>
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: en.MouseInteraction, ...e },
            }),
          scrollCb: V,
          viewportResizeCb: (e) =>
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: en.ViewportResize, ...e },
            }),
          inputCb: (e) =>
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: en.Input, ...e },
            }),
          mediaInteractionCb: (e) =>
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: en.MediaInteraction, ...e },
            }),
          styleSheetRuleCb: (e) =>
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: en.StyleSheetRule, ...e },
            }),
          styleDeclarationCb: (e) =>
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: en.StyleDeclaration, ...e },
            }),
          canvasMutationCb: J,
          fontCb: (e) =>
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: en.Font, ...e },
            }),
          selectionCb: (e) => {
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: en.Selection, ...e },
            });
          },
          customElementCb: (e) => {
            jn({
              type: Zt.IncrementalSnapshot,
              data: { source: en.CustomElement, ...e },
            });
          },
          blockClass: r,
          ignoreClass: a,
          ignoreSelector: c,
          maskAllText: l,
          maskTextClass: u,
          unmaskTextClass: d,
          maskTextSelector: h,
          unmaskTextSelector: p,
          maskInputOptions: W,
          inlineStylesheet: m,
          sampling: _,
          recordDOM: E,
          recordCanvas: M,
          inlineImages: O,
          userTriggeredOnInput: R,
          collectFonts: A,
          doc: e,
          maskAttributeFn: S,
          maskInputFn: k,
          maskTextFn: b,
          keepIframeSrcFn: L,
          blockSelector: o,
          unblockSelector: i,
          slimDOMOptions: H,
          dataURLOptions: I,
          mirror: qn,
          iframeManager: X,
          stylesheetManager: Y,
          shadowDomManager: ee,
          processedNodeManager: Q,
          canvasManager: Z,
          ignoreCSSAttributes: N,
          plugins:
            D?.filter((e) => e.observer)?.map((e) => ({
              observer: e.observer,
              options: e.options,
              callback: (t) =>
                jn({ type: Zt.Plugin, data: { plugin: e.name, payload: t } }),
            })) || [],
        },
        {},
      );
    X.addLoadListener((n) => {
      try {
        e.push(t(n.contentDocument));
      } catch (e) {
        console.warn(e);
      }
    });
    const n = () => {
      te();
      e.push(t(document));
    };
    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    )
      n();
    else {
      e.push(
        It("DOMContentLoaded", () => {
          jn({ type: Zt.DomContentLoaded, data: {} });
          T === "DOMContentLoaded" && n();
        }),
      );
      e.push(
        It(
          "load",
          () => {
            jn({ type: Zt.Load, data: {} });
            T === "load" && n();
          },
          window,
        ),
      );
    }
    return () => {
      e.forEach((e) => e());
      Q.destroy();
      $n = void 0;
      yn();
    };
  } catch (e) {
    console.warn(e);
  }
}
function Vn(e) {
  if (!$n) throw new Error("please take full snapshot after start recording");
  $n(e);
}
Kn.mirror = qn;
Kn.takeFullSnapshot = Vn;
function Jn(e, t) {
  try {
    return e ? e(t) : new CanvasManagerNoop();
  } catch {
    console.warn("Unable to initialize CanvasManager");
    return new CanvasManagerNoop();
  }
}
var Gn;
!(function (e) {
  (e[(e.NotStarted = 0)] = "NotStarted"),
    (e[(e.Running = 1)] = "Running"),
    (e[(e.Stopped = 2)] = "Stopped");
})(Gn || (Gn = {}));
const Yn = 3;
const Xn = 5;
function Qn(e) {
  const t = e > 9999999999;
  return t ? e : e * 1e3;
}
function Zn(e) {
  const t = e > 9999999999;
  return t ? e / 1e3 : e;
}
function es(e, n) {
  if (n.category !== "sentry.transaction") {
    ["ui.click", "ui.input"].includes(n.category)
      ? e.triggerUserActivity()
      : e.checkAndHandleExpiredSession();
    e.addUpdate(() => {
      e.throttledAddEvent({
        type: Zt.Custom,
        timestamp: (n.timestamp || 0) * 1e3,
        data: { tag: "breadcrumb", payload: t(n, 10, 1e3) },
      });
      return n.category === "console";
    });
  }
}
const ts = "button,a";
function ns(e) {
  const t = e.closest(ts);
  return t || e;
}
function ss(e) {
  const t = rs(e);
  return t && t instanceof Element ? ns(t) : t;
}
function rs(e) {
  return os(e) ? e.target : e;
}
function os(e) {
  return typeof e === "object" && !!e && "target" in e;
}
let is;
function as(e) {
  if (!is) {
    is = [];
    cs();
  }
  is.push(e);
  return () => {
    const t = is ? is.indexOf(e) : -1;
    t > -1 && is.splice(t, 1);
  };
}
function cs() {
  n(q, "open", function (e) {
    return function (...t) {
      if (is)
        try {
          is.forEach((e) => e());
        } catch {}
      return e.apply(q, t);
    };
  });
}
const ls = new Set([
  en.Mutation,
  en.StyleSheetRule,
  en.StyleDeclaration,
  en.AdoptedStyleSheet,
  en.CanvasMutation,
  en.Selection,
  en.MediaInteraction,
]);
function us(e, t, n) {
  e.handleClick(t, n);
}
class ClickDetector {
  constructor(e, t, n = es) {
    this._lastMutation = 0;
    this._lastScroll = 0;
    this._clicks = [];
    this._timeout = t.timeout / 1e3;
    this._threshold = t.threshold / 1e3;
    this._scrollTimeout = t.scrollTimeout / 1e3;
    this._replay = e;
    this._ignoreSelector = t.ignoreSelector;
    this._addBreadcrumbEvent = n;
  }
  addListeners() {
    const e = as(() => {
      this._lastMutation = ms();
    });
    this._teardown = () => {
      e();
      this._clicks = [];
      this._lastMutation = 0;
      this._lastScroll = 0;
    };
  }
  removeListeners() {
    this._teardown && this._teardown();
    this._checkClickTimeout && clearTimeout(this._checkClickTimeout);
  }
  handleClick(e, t) {
    if (hs(t, this._ignoreSelector) || !ps(e)) return;
    const n = {
      timestamp: Zn(e.timestamp),
      clickBreadcrumb: e,
      clickCount: 0,
      node: t,
    };
    if (
      !this._clicks.some(
        (e) => e.node === n.node && Math.abs(e.timestamp - n.timestamp) < 1,
      )
    ) {
      this._clicks.push(n);
      this._clicks.length === 1 && this._scheduleCheckClicks();
    }
  }
  registerMutation(e = Date.now()) {
    this._lastMutation = Zn(e);
  }
  registerScroll(e = Date.now()) {
    this._lastScroll = Zn(e);
  }
  registerClick(e) {
    const t = ns(e);
    this._handleMultiClick(t);
  }
  _handleMultiClick(e) {
    this._getClicks(e).forEach((e) => {
      e.clickCount++;
    });
  }
  _getClicks(e) {
    return this._clicks.filter((t) => t.node === e);
  }
  _checkClicks() {
    const e = [];
    const t = ms();
    this._clicks.forEach((n) => {
      !n.mutationAfter &&
        this._lastMutation &&
        (n.mutationAfter =
          n.timestamp <= this._lastMutation
            ? this._lastMutation - n.timestamp
            : void 0);
      !n.scrollAfter &&
        this._lastScroll &&
        (n.scrollAfter =
          n.timestamp <= this._lastScroll
            ? this._lastScroll - n.timestamp
            : void 0);
      n.timestamp + this._timeout <= t && e.push(n);
    });
    for (const t of e) {
      const e = this._clicks.indexOf(t);
      if (e > -1) {
        this._generateBreadcrumbs(t);
        this._clicks.splice(e, 1);
      }
    }
    this._clicks.length && this._scheduleCheckClicks();
  }
  _generateBreadcrumbs(e) {
    const t = this._replay;
    const n = e.scrollAfter && e.scrollAfter <= this._scrollTimeout;
    const s = e.mutationAfter && e.mutationAfter <= this._threshold;
    const r = !n && !s;
    const { clickCount: o, clickBreadcrumb: i } = e;
    if (r) {
      const n = Math.min(e.mutationAfter || this._timeout, this._timeout) * 1e3;
      const s = n < this._timeout * 1e3 ? "mutation" : "timeout";
      const r = {
        type: "default",
        message: i.message,
        timestamp: i.timestamp,
        category: "ui.slowClickDetected",
        data: {
          ...i.data,
          url: q.location.href,
          route: t.getCurrentRoute(),
          timeAfterClickMs: n,
          endReason: s,
          clickCount: o || 1,
        },
      };
      this._addBreadcrumbEvent(t, r);
    } else if (o > 1) {
      const e = {
        type: "default",
        message: i.message,
        timestamp: i.timestamp,
        category: "ui.multiClick",
        data: {
          ...i.data,
          url: q.location.href,
          route: t.getCurrentRoute(),
          clickCount: o,
          metric: true,
        },
      };
      this._addBreadcrumbEvent(t, e);
    }
  }
  _scheduleCheckClicks() {
    this._checkClickTimeout && clearTimeout(this._checkClickTimeout);
    this._checkClickTimeout = D(() => this._checkClicks(), 1e3);
  }
}
const ds = ["A", "BUTTON", "INPUT"];
function hs(e, t) {
  return (
    !ds.includes(e.tagName) ||
    (e.tagName === "INPUT" &&
      !["submit", "button"].includes(e.getAttribute("type") || "")) ||
    !(
      e.tagName !== "A" ||
      !(
        e.hasAttribute("download") ||
        (e.hasAttribute("target") && e.getAttribute("target") !== "_self")
      )
    ) ||
    !(!t || !e.matches(t))
  );
}
function ps(e) {
  return !!(e.data && typeof e.data.nodeId === "number" && e.timestamp);
}
function ms() {
  return Date.now() / 1e3;
}
function fs(e, t) {
  try {
    if (!ys(t)) return;
    const { source: n } = t.data;
    ls.has(n) && e.registerMutation(t.timestamp);
    n === en.Scroll && e.registerScroll(t.timestamp);
    if (gs(t)) {
      const { type: n, id: s } = t.data;
      const r = Kn.mirror.getNode(s);
      r instanceof HTMLElement && n === tn.Click && e.registerClick(r);
    }
  } catch {}
}
function ys(e) {
  return e.type === Yn;
}
function gs(e) {
  return e.data.source === en.MouseInteraction;
}
function Ss(e) {
  return { timestamp: Date.now() / 1e3, type: "default", ...e };
}
var ks = ((e) => {
  e[(e.Document = 0)] = "Document";
  e[(e.DocumentType = 1)] = "DocumentType";
  e[(e.Element = 2)] = "Element";
  e[(e.Text = 3)] = "Text";
  e[(e.CDATA = 4)] = "CDATA";
  e[(e.Comment = 5)] = "Comment";
  return e;
})(ks || {});
const bs = new Set([
  "id",
  "class",
  "aria-label",
  "role",
  "name",
  "alt",
  "title",
  "data-test-id",
  "data-testid",
  "disabled",
  "aria-disabled",
  "data-sentry-component",
]);
function vs(e) {
  const t = {};
  !e["data-sentry-component"] &&
    e["data-sentry-element"] &&
    (e["data-sentry-component"] = e["data-sentry-element"]);
  for (const n in e)
    if (bs.has(n)) {
      let s = n;
      (n !== "data-testid" && n !== "data-test-id") || (s = "testId");
      t[s] = e[n];
    }
  return t;
}
const ws = (e) => (t) => {
  if (!e.isEnabled()) return;
  const n = Is(t);
  if (!n) return;
  const s = t.name === "click";
  const r = s ? t.event : void 0;
  !(s && e.clickDetector && r?.target) ||
    r.altKey ||
    r.metaKey ||
    r.ctrlKey ||
    r.shiftKey ||
    us(e.clickDetector, n, ss(t.event));
  es(e, n);
};
function _s(e, t) {
  const n = Kn.mirror.getId(e);
  const s = n && Kn.mirror.getNode(n);
  const r = s && Kn.mirror.getMeta(s);
  const o = r && Es(r) ? r : null;
  return {
    message: t,
    data: o
      ? {
          nodeId: n,
          node: {
            id: n,
            tagName: o.tagName,
            textContent: Array.from(o.childNodes)
              .map((e) => e.type === ks.Text && e.textContent)
              .filter(Boolean)
              .map((e) => e.trim())
              .join(""),
            attributes: vs(o.attributes),
          },
        }
      : {},
  };
}
function Is(e) {
  const { target: t, message: n } = Cs(e);
  return Ss({ category: `ui.${e.name}`, ..._s(t, n) });
}
function Cs(e) {
  const t = e.name === "click";
  let n;
  let r = null;
  try {
    r = t ? ss(e.event) : rs(e.event);
    n = s(r, { maxStringLength: 200 }) || "<unknown>";
  } catch {
    n = "<unknown>";
  }
  return { target: r, message: n };
}
function Es(e) {
  return e.type === ks.Element;
}
function Ms(e, t) {
  if (!e.isEnabled()) return;
  e.updateUserActivity();
  const n = xs(t);
  n && es(e, n);
}
function xs(e) {
  const {
    metaKey: t,
    shiftKey: n,
    ctrlKey: r,
    altKey: o,
    key: i,
    target: a,
  } = e;
  if (!a || Ts(a) || !i) return null;
  const c = t || r || o;
  const l = i.length === 1;
  if (!c && l) return null;
  const u = s(a, { maxStringLength: 200 }) || "<unknown>";
  const d = _s(a, u);
  return Ss({
    category: "ui.keyDown",
    message: u,
    data: { ...d.data, metaKey: t, shiftKey: n, ctrlKey: r, altKey: o, key: i },
  });
}
function Ts(e) {
  return (
    e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.isContentEditable
  );
}
const Rs = { resource: Bs, paint: Ns, navigation: Fs };
function As(e, t) {
  return ({ metric: n }) => {
    t.replayPerformanceEntries.push(e(n));
  };
}
function Os(e) {
  return e.map(Ds).filter(Boolean);
}
function Ds(e) {
  const t = Rs[e.entryType];
  return t ? t(e) : null;
}
function Ls(e) {
  return ((r() || q.performance.timeOrigin) + e) / 1e3;
}
function Ns(e) {
  const { duration: t, entryType: n, name: s, startTime: r } = e;
  const o = Ls(r);
  return { type: n, name: s, start: o, end: o + t, data: void 0 };
}
function Fs(e) {
  const {
    entryType: t,
    name: n,
    decodedBodySize: s,
    duration: r,
    domComplete: o,
    encodedBodySize: i,
    domContentLoadedEventStart: a,
    domContentLoadedEventEnd: c,
    domInteractive: l,
    loadEventStart: u,
    loadEventEnd: d,
    redirectCount: h,
    startTime: p,
    transferSize: m,
    type: f,
  } = e;
  return r === 0
    ? null
    : {
        type: `${t}.${f}`,
        start: Ls(p),
        end: Ls(o),
        name: n,
        data: {
          size: m,
          decodedBodySize: s,
          encodedBodySize: i,
          duration: r,
          domInteractive: l,
          domContentLoadedEventStart: a,
          domContentLoadedEventEnd: c,
          loadEventStart: u,
          loadEventEnd: d,
          domComplete: o,
          redirectCount: h,
        },
      };
}
function Bs(e) {
  const {
    entryType: t,
    initiatorType: n,
    name: s,
    responseEnd: r,
    startTime: o,
    decodedBodySize: i,
    encodedBodySize: a,
    responseStatus: c,
    transferSize: l,
  } = e;
  return ["fetch", "xmlhttprequest"].includes(n)
    ? null
    : {
        type: `${t}.${n}`,
        start: Ls(o),
        end: Ls(r),
        name: s,
        data: {
          size: l,
          statusCode: c,
          decodedBodySize: i,
          encodedBodySize: a,
        },
      };
}
function Ps(e) {
  const t = e.entries[e.entries.length - 1];
  const n = t?.element ? [t.element] : void 0;
  return Hs(e, "largest-contentful-paint", n);
}
function zs(e) {
  return e.sources !== void 0;
}
function Us(e) {
  const t = [];
  const n = [];
  for (const s of e.entries)
    if (zs(s)) {
      const e = [];
      for (const t of s.sources)
        if (t.node) {
          n.push(t.node);
          const s = Kn.mirror.getId(t.node);
          s && e.push(s);
        }
      t.push({ value: s.value, nodeIds: e.length ? e : void 0 });
    }
  return Hs(e, "cumulative-layout-shift", n, t);
}
function Ws(e) {
  const t = e.entries[e.entries.length - 1];
  const n = t?.target ? [t.target] : void 0;
  return Hs(e, "interaction-to-next-paint", n);
}
function Hs(e, t, n, s) {
  const r = e.value;
  const o = e.rating;
  const i = Ls(r);
  return {
    type: "web-vital",
    name: t,
    start: i,
    end: i,
    data: {
      value: r,
      size: r,
      rating: o,
      nodeIds: n ? n.map((e) => Kn.mirror.getId(e)) : void 0,
      attributions: s,
    },
  };
}
function js(e) {
  function t(t) {
    e.performanceEntries.includes(t) || e.performanceEntries.push(t);
  }
  function n({ entries: e }) {
    e.forEach(t);
  }
  const s = [];
  ["navigation", "paint", "resource"].forEach((e) => {
    s.push(L(e, n));
  });
  s.push(N(As(Ps, e)), F(As(Us, e)), B(As(Ws, e)));
  return () => {
    s.forEach((e) => e());
  };
}
const $s = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
const qs =
  'var t=Uint8Array,n=Uint16Array,r=Int32Array,e=new t([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),i=new t([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),s=new t([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(t,e){for(var i=new n(31),s=0;s<31;++s)i[s]=e+=1<<t[s-1];var a=new r(i[30]);for(s=1;s<30;++s)for(var o=i[s];o<i[s+1];++o)a[o]=o-i[s]<<5|s;return{b:i,r:a}},o=a(e,2),h=o.b,f=o.r;h[28]=258,f[258]=28;for(var l=a(i,0).r,u=new n(32768),c=0;c<32768;++c){var v=(43690&c)>>1|(21845&c)<<1;v=(61680&(v=(52428&v)>>2|(13107&v)<<2))>>4|(3855&v)<<4,u[c]=((65280&v)>>8|(255&v)<<8)>>1}var d=function(t,r,e){for(var i=t.length,s=0,a=new n(r);s<i;++s)t[s]&&++a[t[s]-1];var o,h=new n(r);for(s=1;s<r;++s)h[s]=h[s-1]+a[s-1]<<1;if(e){o=new n(1<<r);var f=15-r;for(s=0;s<i;++s)if(t[s])for(var l=s<<4|t[s],c=r-t[s],v=h[t[s]-1]++<<c,d=v|(1<<c)-1;v<=d;++v)o[u[v]>>f]=l}else for(o=new n(i),s=0;s<i;++s)t[s]&&(o[s]=u[h[t[s]-1]++]>>15-t[s]);return o},p=new t(288);for(c=0;c<144;++c)p[c]=8;for(c=144;c<256;++c)p[c]=9;for(c=256;c<280;++c)p[c]=7;for(c=280;c<288;++c)p[c]=8;var g=new t(32);for(c=0;c<32;++c)g[c]=5;var w=d(p,9,0),y=d(g,5,0),m=function(t){return(t+7)/8|0},b=function(n,r,e){return(null==e||e>n.length)&&(e=n.length),new t(n.subarray(r,e))},M=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],E=function(t,n,r){var e=new Error(n||M[t]);if(e.code=t,Error.captureStackTrace&&Error.captureStackTrace(e,E),!r)throw e;return e},z=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8},_=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8,t[e+2]|=r>>16},x=function(r,e){for(var i=[],s=0;s<r.length;++s)r[s]&&i.push({s:s,f:r[s]});var a=i.length,o=i.slice();if(!a)return{t:F,l:0};if(1==a){var h=new t(i[0].s+1);return h[i[0].s]=1,{t:h,l:1}}i.sort(function(t,n){return t.f-n.f}),i.push({s:-1,f:25001});var f=i[0],l=i[1],u=0,c=1,v=2;for(i[0]={s:-1,f:f.f+l.f,l:f,r:l};c!=a-1;)f=i[i[u].f<i[v].f?u++:v++],l=i[u!=c&&i[u].f<i[v].f?u++:v++],i[c++]={s:-1,f:f.f+l.f,l:f,r:l};var d=o[0].s;for(s=1;s<a;++s)o[s].s>d&&(d=o[s].s);var p=new n(d+1),g=A(i[c-1],p,0);if(g>e){s=0;var w=0,y=g-e,m=1<<y;for(o.sort(function(t,n){return p[n.s]-p[t.s]||t.f-n.f});s<a;++s){var b=o[s].s;if(!(p[b]>e))break;w+=m-(1<<g-p[b]),p[b]=e}for(w>>=y;w>0;){var M=o[s].s;p[M]<e?w-=1<<e-p[M]++-1:++s}for(;s>=0&&w;--s){var E=o[s].s;p[E]==e&&(--p[E],++w)}g=e}return{t:new t(p),l:g}},A=function(t,n,r){return-1==t.s?Math.max(A(t.l,n,r+1),A(t.r,n,r+1)):n[t.s]=r},D=function(t){for(var r=t.length;r&&!t[--r];);for(var e=new n(++r),i=0,s=t[0],a=1,o=function(t){e[i++]=t},h=1;h<=r;++h)if(t[h]==s&&h!=r)++a;else{if(!s&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(s),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(s);a=1,s=t[h]}return{c:e.subarray(0,i),n:r}},T=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},k=function(t,n,r){var e=r.length,i=m(n+2);t[i]=255&e,t[i+1]=e>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var s=0;s<e;++s)t[i+s+4]=r[s];return 8*(i+4+e)},U=function(t,r,a,o,h,f,l,u,c,v,m){z(r,m++,a),++h[256];for(var b=x(h,15),M=b.t,E=b.l,A=x(f,15),U=A.t,C=A.l,F=D(M),I=F.c,S=F.n,L=D(U),O=L.c,j=L.n,q=new n(19),B=0;B<I.length;++B)++q[31&I[B]];for(B=0;B<O.length;++B)++q[31&O[B]];for(var G=x(q,7),H=G.t,J=G.l,K=19;K>4&&!H[s[K-1]];--K);var N,P,Q,R,V=v+5<<3,W=T(h,p)+T(f,g)+l,X=T(h,M)+T(f,U)+l+14+3*K+T(q,H)+2*q[16]+3*q[17]+7*q[18];if(c>=0&&V<=W&&V<=X)return k(r,m,t.subarray(c,c+v));if(z(r,m,1+(X<W)),m+=2,X<W){N=d(M,E,0),P=M,Q=d(U,C,0),R=U;var Y=d(H,J,0);z(r,m,S-257),z(r,m+5,j-1),z(r,m+10,K-4),m+=14;for(B=0;B<K;++B)z(r,m+3*B,H[s[B]]);m+=3*K;for(var Z=[I,O],$=0;$<2;++$){var tt=Z[$];for(B=0;B<tt.length;++B){var nt=31&tt[B];z(r,m,Y[nt]),m+=H[nt],nt>15&&(z(r,m,tt[B]>>5&127),m+=tt[B]>>12)}}}else N=w,P=p,Q=y,R=g;for(B=0;B<u;++B){var rt=o[B];if(rt>255){_(r,m,N[(nt=rt>>18&31)+257]),m+=P[nt+257],nt>7&&(z(r,m,rt>>23&31),m+=e[nt]);var et=31&rt;_(r,m,Q[et]),m+=R[et],et>3&&(_(r,m,rt>>5&8191),m+=i[et])}else _(r,m,N[rt]),m+=P[rt]}return _(r,m,N[256]),m+P[256]},C=new r([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),F=new t(0),I=function(){for(var t=new Int32Array(256),n=0;n<256;++n){for(var r=n,e=9;--e;)r=(1&r&&-306674912)^r>>>1;t[n]=r}return t}(),S=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,s=0|r.length,a=0;a!=s;){for(var o=Math.min(a+2655,s);a<o;++a)i+=e+=r[a];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|(65280&t)<<8|(255&(n%=65521))<<8|n>>8}}},L=function(s,a,o,h,u){if(!u&&(u={l:1},a.dictionary)){var c=a.dictionary.subarray(-32768),v=new t(c.length+s.length);v.set(c),v.set(s,c.length),s=v,u.w=c.length}return function(s,a,o,h,u,c){var v=c.z||s.length,d=new t(h+v+5*(1+Math.ceil(v/7e3))+u),p=d.subarray(h,d.length-u),g=c.l,w=7&(c.r||0);if(a){w&&(p[0]=c.r>>3);for(var y=C[a-1],M=y>>13,E=8191&y,z=(1<<o)-1,_=c.p||new n(32768),x=c.h||new n(z+1),A=Math.ceil(o/3),D=2*A,T=function(t){return(s[t]^s[t+1]<<A^s[t+2]<<D)&z},F=new r(25e3),I=new n(288),S=new n(32),L=0,O=0,j=c.i||0,q=0,B=c.w||0,G=0;j+2<v;++j){var H=T(j),J=32767&j,K=x[H];if(_[J]=K,x[H]=J,B<=j){var N=v-j;if((L>7e3||q>24576)&&(N>423||!g)){w=U(s,p,0,F,I,S,O,q,G,j-G,w),q=L=O=0,G=j;for(var P=0;P<286;++P)I[P]=0;for(P=0;P<30;++P)S[P]=0}var Q=2,R=0,V=E,W=J-K&32767;if(N>2&&H==T(j-W))for(var X=Math.min(M,N)-1,Y=Math.min(32767,j),Z=Math.min(258,N);W<=Y&&--V&&J!=K;){if(s[j+Q]==s[j+Q-W]){for(var $=0;$<Z&&s[j+$]==s[j+$-W];++$);if($>Q){if(Q=$,R=W,$>X)break;var tt=Math.min(W,$-2),nt=0;for(P=0;P<tt;++P){var rt=j-W+P&32767,et=rt-_[rt]&32767;et>nt&&(nt=et,K=rt)}}}W+=(J=K)-(K=_[J])&32767}if(R){F[q++]=268435456|f[Q]<<18|l[R];var it=31&f[Q],st=31&l[R];O+=e[it]+i[st],++I[257+it],++S[st],B=j+Q,++L}else F[q++]=s[j],++I[s[j]]}}for(j=Math.max(j,B);j<v;++j)F[q++]=s[j],++I[s[j]];w=U(s,p,g,F,I,S,O,q,G,j-G,w),g||(c.r=7&w|p[w/8|0]<<3,w-=7,c.h=x,c.p=_,c.i=j,c.w=B)}else{for(j=c.w||0;j<v+g;j+=65535){var at=j+65535;at>=v&&(p[w/8|0]=g,at=v),w=k(p,w+1,s.subarray(j,at))}c.i=v}return b(d,0,h+m(w)+u)}(s,null==a.level?6:a.level,null==a.mem?u.l?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(s.length)))):20:12+a.mem,o,h,u)},O=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},j=function(){function n(n,r){if("function"==typeof n&&(r=n,n={}),this.ondata=r,this.o=n||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new t(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return n.prototype.p=function(t,n){this.ondata(L(t,this.o,0,0,this.s),n)},n.prototype.push=function(n,r){this.ondata||E(5),this.s.l&&E(4);var e=n.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new t(-32768&e);i.set(this.b.subarray(0,this.s.z)),this.b=i}var s=this.b.length-this.s.z;this.b.set(n.subarray(0,s),this.s.z),this.s.z=this.b.length,this.p(this.b,!1),this.b.set(this.b.subarray(-32768)),this.b.set(n.subarray(s),32768),this.s.z=n.length-s+32768,this.s.i=32766,this.s.w=32768}else this.b.set(n,this.s.z),this.s.z+=n.length;this.s.l=1&r,(this.s.z>this.s.w+8191||r)&&(this.p(this.b,r||!1),this.s.w=this.s.i,this.s.i-=2)},n.prototype.flush=function(){this.ondata||E(5),this.s.l&&E(4),this.p(this.b,!1),this.s.w=this.s.i,this.s.i-=2},n}();function q(t,n){n||(n={});var r=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=I[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}}(),e=t.length;r.p(t);var i,s=L(t,n,10+((i=n).filename?i.filename.length+1:0),8),a=s.length;return function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&O(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}}(s,n),O(s,a-8,r.d()),O(s,a-4,e),s}var B=function(){function t(t,n){this.c=S(),this.v=1,j.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),j.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=L(t,this.o,this.v&&(this.o.dictionary?6:2),n&&4,this.s);this.v&&(function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;if(t[0]=120,t[1]=e<<6|(n.dictionary&&32),t[1]|=31-(t[0]<<8|t[1])%31,n.dictionary){var i=S();i.p(n.dictionary),O(t,2,i.d())}}(r,this.o),this.v=0),n&&O(r,r.length-4,this.c.d()),this.ondata(r,n)},t.prototype.flush=function(){j.prototype.flush.call(this)},t}(),G="undefined"!=typeof TextEncoder&&new TextEncoder,H="undefined"!=typeof TextDecoder&&new TextDecoder;try{H.decode(F,{stream:!0})}catch(t){}var J=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){this.ondata||E(5),this.d&&E(4),this.ondata(K(t),this.d=n||!1)},t}();function K(n,r){if(G)return G.encode(n);for(var e=n.length,i=new t(n.length+(n.length>>1)),s=0,a=function(t){i[s++]=t},o=0;o<e;++o){if(s+5>i.length){var h=new t(s+8+(e-o<<1));h.set(i),i=h}var f=n.charCodeAt(o);f<128||r?a(f):f<2048?(a(192|f>>6),a(128|63&f)):f>55295&&f<57344?(a(240|(f=65536+(1047552&f)|1023&n.charCodeAt(++o))>>18),a(128|f>>12&63),a(128|f>>6&63),a(128|63&f)):(a(224|f>>12),a(128|f>>6&63),a(128|63&f))}return b(i,0,s)}const N=new class{constructor(){this._init()}clear(){this._init()}addEvent(t){if(!t)throw new Error("Adding invalid event");const n=this._hasEvents?",":"";this.stream.push(n+t),this._hasEvents=!0}finish(){this.stream.push("]",!0);const t=function(t){let n=0;for(const r of t)n+=r.length;const r=new Uint8Array(n);for(let n=0,e=0,i=t.length;n<i;n++){const i=t[n];r.set(i,e),e+=i.length}return r}(this._deflatedData);return this._init(),t}_init(){this._hasEvents=!1,this._deflatedData=[],this.deflate=new B,this.deflate.ondata=(t,n)=>{this._deflatedData.push(t)},this.stream=new J((t,n)=>{this.deflate.push(t,n)}),this.stream.push("[")}},P={clear:()=>{N.clear()},addEvent:t=>N.addEvent(t),finish:()=>N.finish(),compress:t=>function(t){return q(K(t))}(t)};addEventListener("message",function(t){const n=t.data.method,r=t.data.id,e=t.data.arg;if(n in P&&"function"==typeof P[n])try{const t=P[n](e);postMessage({id:r,method:n,success:!0,response:t})}catch(t){postMessage({id:r,method:n,success:!1,response:t.message}),console.error(t)}}),postMessage({id:void 0,method:"init",success:!0,response:void 0});';
function Ks() {
  const e = new Blob([qs]);
  return URL.createObjectURL(e);
}
const Vs = ["log", "warn", "error"];
const Js = "[Replay] ";
function Gs(e, t = "info") {
  o(
    {
      category: "console",
      data: { logger: "replay" },
      level: t,
      message: `${Js}${e}`,
    },
    { level: t },
  );
}
function Ys() {
  let e = false;
  let t = false;
  const n = {
    exception: () => {},
    infoTick: () => {},
    setConfig: (n) => {
      e = !!n.captureExceptions;
      t = !!n.traceInternals;
    },
  };
  if ($s) {
    Vs.forEach((e) => {
      n[e] = (...n) => {
        i[e](Js, ...n);
        t && Gs(n.join(""), a(e));
      };
    });
    n.exception = (s, ...r) => {
      r.length && n.error && n.error(...r);
      i.error(Js, s);
      e
        ? c(s, {
            mechanism: { handled: true, type: "auto.function.replay.debug" },
          })
        : t && Gs(s, "error");
    };
    n.infoTick = (...e) => {
      i.log(Js, ...e);
      t && setTimeout(() => Gs(e[0]), 0);
    };
  } else
    Vs.forEach((e) => {
      n[e] = () => {};
    });
  return n;
}
const Xs = Ys();
class EventBufferSizeExceededError extends Error {
  constructor() {
    super(`Event buffer exceeded maximum size of ${ie}.`);
  }
}
class EventBufferArray {
  constructor() {
    this.events = [];
    this._totalSize = 0;
    this.hasCheckout = false;
    this.waitForCheckout = false;
  }
  get hasEvents() {
    return this.events.length > 0;
  }
  get type() {
    return "sync";
  }
  destroy() {
    this.events = [];
  }
  async addEvent(e) {
    const t = JSON.stringify(e).length;
    this._totalSize += t;
    if (this._totalSize > ie) throw new EventBufferSizeExceededError();
    this.events.push(e);
  }
  finish() {
    return new Promise((e) => {
      const t = this.events;
      this.clear();
      e(JSON.stringify(t));
    });
  }
  clear() {
    this.events = [];
    this._totalSize = 0;
    this.hasCheckout = false;
  }
  getEarliestTimestamp() {
    const e = this.events.map((e) => e.timestamp).sort()[0];
    return e ? Qn(e) : null;
  }
}
class WorkerHandler {
  constructor(e) {
    this._worker = e;
    this._id = 0;
  }
  ensureReady() {
    if (this._ensureReadyPromise) return this._ensureReadyPromise;
    this._ensureReadyPromise = new Promise((e, t) => {
      this._worker.addEventListener(
        "message",
        ({ data: n }) => {
          n.success ? e() : t();
        },
        { once: true },
      );
      this._worker.addEventListener(
        "error",
        (e) => {
          t(e);
        },
        { once: true },
      );
    });
    return this._ensureReadyPromise;
  }
  destroy() {
    $s && Xs.log("Destroying compression worker");
    this._worker.terminate();
  }
  postMessage(e, t) {
    const n = this._getAndIncrementId();
    return new Promise((s, r) => {
      const o = ({ data: t }) => {
        const i = t;
        if (i.method === e && i.id === n) {
          this._worker.removeEventListener("message", o);
          if (i.success) s(i.response);
          else {
            $s && Xs.error("Error in compression worker: ", i.response);
            r(new Error("Error in compression worker"));
          }
        }
      };
      this._worker.addEventListener("message", o);
      this._worker.postMessage({ id: n, method: e, arg: t });
    });
  }
  _getAndIncrementId() {
    return this._id++;
  }
}
class EventBufferCompressionWorker {
  constructor(e) {
    this._worker = new WorkerHandler(e);
    this._earliestTimestamp = null;
    this._totalSize = 0;
    this.hasCheckout = false;
    this.waitForCheckout = false;
  }
  get hasEvents() {
    return !!this._earliestTimestamp;
  }
  get type() {
    return "worker";
  }
  ensureReady() {
    return this._worker.ensureReady();
  }
  destroy() {
    this._worker.destroy();
  }
  addEvent(e) {
    const t = Qn(e.timestamp);
    (!this._earliestTimestamp || t < this._earliestTimestamp) &&
      (this._earliestTimestamp = t);
    const n = JSON.stringify(e);
    this._totalSize += n.length;
    return this._totalSize > ie
      ? Promise.reject(new EventBufferSizeExceededError())
      : this._sendEventToWorker(n);
  }
  finish() {
    return this._finishRequest();
  }
  clear() {
    this._earliestTimestamp = null;
    this._totalSize = 0;
    this.hasCheckout = false;
    this._worker.postMessage("clear").then(null, (e) => {
      $s && Xs.exception(e, 'Sending "clear" message to worker failed', e);
    });
  }
  getEarliestTimestamp() {
    return this._earliestTimestamp;
  }
  _sendEventToWorker(e) {
    return this._worker.postMessage("addEvent", e);
  }
  async _finishRequest() {
    const e = await this._worker.postMessage("finish");
    this._earliestTimestamp = null;
    this._totalSize = 0;
    return e;
  }
}
class EventBufferProxy {
  constructor(e) {
    this._fallback = new EventBufferArray();
    this._compression = new EventBufferCompressionWorker(e);
    this._used = this._fallback;
    this._ensureWorkerIsLoadedPromise = this._ensureWorkerIsLoaded();
  }
  get waitForCheckout() {
    return this._used.waitForCheckout;
  }
  get type() {
    return this._used.type;
  }
  get hasEvents() {
    return this._used.hasEvents;
  }
  get hasCheckout() {
    return this._used.hasCheckout;
  }
  set hasCheckout(e) {
    this._used.hasCheckout = e;
  }
  set waitForCheckout(e) {
    this._used.waitForCheckout = e;
  }
  destroy() {
    this._fallback.destroy();
    this._compression.destroy();
  }
  clear() {
    return this._used.clear();
  }
  getEarliestTimestamp() {
    return this._used.getEarliestTimestamp();
  }
  addEvent(e) {
    return this._used.addEvent(e);
  }
  async finish() {
    await this.ensureWorkerIsLoaded();
    return this._used.finish();
  }
  ensureWorkerIsLoaded() {
    return this._ensureWorkerIsLoadedPromise;
  }
  async _ensureWorkerIsLoaded() {
    try {
      await this._compression.ensureReady();
    } catch (e) {
      $s &&
        Xs.exception(
          e,
          "Failed to load the compression worker, falling back to simple buffer",
        );
      return;
    }
    await this._switchToCompressionWorker();
  }
  async _switchToCompressionWorker() {
    const { events: e, hasCheckout: t, waitForCheckout: n } = this._fallback;
    const s = [];
    for (const t of e) s.push(this._compression.addEvent(t));
    this._compression.hasCheckout = t;
    this._compression.waitForCheckout = n;
    this._used = this._compression;
    try {
      await Promise.all(s);
      this._fallback.clear();
    } catch (e) {
      $s && Xs.exception(e, "Failed to add events when switching buffers.");
    }
  }
}
function Qs({ useCompression: e, workerUrl: t }) {
  if (e && window.Worker) {
    const e = Zs(t);
    if (e) return e;
  }
  $s && Xs.log("Using simple buffer");
  return new EventBufferArray();
}
function Zs(e) {
  try {
    const t = e || er();
    if (!t) return;
    $s && Xs.log("Using compression worker" + (e ? ` from ${e}` : ""));
    const n = new Worker(t);
    return new EventBufferProxy(n);
  } catch (e) {
    $s && Xs.exception(e, "Failed to create compression worker");
  }
}
function er() {
  return typeof __SENTRY_EXCLUDE_REPLAY_WORKER__ !== "undefined" &&
    __SENTRY_EXCLUDE_REPLAY_WORKER__
    ? ""
    : Ks();
}
function tr() {
  try {
    return "sessionStorage" in q && !!q.sessionStorage;
  } catch {
    return false;
  }
}
function nr(e) {
  sr();
  e.session = void 0;
}
function sr() {
  if (tr())
    try {
      q.sessionStorage.removeItem(K);
    } catch {}
}
function rr(e) {
  return e !== void 0 && Math.random() < e;
}
function or(e) {
  if (tr())
    try {
      q.sessionStorage.setItem(K, JSON.stringify(e));
    } catch {}
}
function ir(e) {
  const t = Date.now();
  const n = e.id || l();
  const s = e.started || t;
  const r = e.lastActivity || t;
  const o = e.segmentId || 0;
  const i = e.sampled;
  const a = e.previousSessionId;
  const c = e.dirty || false;
  return {
    id: n,
    started: s,
    lastActivity: r,
    segmentId: o,
    sampled: i,
    previousSessionId: a,
    dirty: c,
  };
}
function ar(e, t) {
  return rr(e) ? "session" : !!t && "buffer";
}
function cr(
  { sessionSampleRate: e, allowBuffering: t, stickySession: n = false },
  { previousSessionId: s } = {},
) {
  const r = ar(e, t);
  const o = ir({ sampled: r, previousSessionId: s });
  n && or(o);
  return o;
}
function lr() {
  if (!tr()) return null;
  try {
    const e = q.sessionStorage.getItem(K);
    if (!e) return null;
    const t = JSON.parse(e);
    $s && Xs.infoTick("Loading existing session");
    return ir(t);
  } catch {
    return null;
  }
}
function ur(e, t, n = +new Date()) {
  return e === null || t === void 0 || t < 0 || (t !== 0 && e + t <= n);
}
function dr(
  e,
  { maxReplayDuration: t, sessionIdleExpire: n, targetTime: s = Date.now() },
) {
  return ur(e.started, t, s) || ur(e.lastActivity, n, s);
}
function hr(e, { sessionIdleExpire: t, maxReplayDuration: n }) {
  return (
    !!dr(e, { sessionIdleExpire: t, maxReplayDuration: n }) &&
    (e.sampled !== "buffer" || e.segmentId !== 0)
  );
}
function pr(
  { sessionIdleExpire: e, maxReplayDuration: t, previousSessionId: n },
  s,
) {
  const r = s.stickySession && lr();
  if (!r) {
    $s && Xs.infoTick("Creating new session");
    return cr(s, { previousSessionId: n });
  }
  if (!hr(r, { sessionIdleExpire: e, maxReplayDuration: t })) return r;
  $s &&
    Xs.infoTick("Session in sessionStorage is expired, creating new one...");
  return cr(s, { previousSessionId: r.id });
}
function mr(e) {
  return e.type === Zt.Custom;
}
function fr(e, t, n) {
  if (!Sr(e, t)) return false;
  gr(e, t, n);
  return true;
}
function yr(e, t, n) {
  return Sr(e, t) ? gr(e, t, n) : Promise.resolve(null);
}
async function gr(e, t, n) {
  const { eventBuffer: s } = e;
  if (!s || (s.waitForCheckout && !n)) return null;
  const r = e.recordingMode === "buffer";
  try {
    n && r && s.clear();
    if (n) {
      s.hasCheckout = true;
      s.waitForCheckout = false;
    }
    const o = e.getOptions();
    const i = kr(t, o.beforeAddRecordingEvent);
    if (!i) return;
    return await s.addEvent(i);
  } catch (t) {
    const n = t && t instanceof EventBufferSizeExceededError;
    const o = n ? "addEventSizeExceeded" : "addEvent";
    const i = u();
    if (i) {
      const e = n ? "buffer_overflow" : "internal_sdk_error";
      i.recordDroppedEvent(e, "replay");
    }
    if (n && r) {
      s.clear();
      s.waitForCheckout = true;
      return null;
    }
    e.handleException(t);
    await e.stop({ reason: o });
  }
}
function Sr(e, t) {
  if (!e.eventBuffer || e.isPaused() || !e.isEnabled()) return false;
  const n = Qn(t.timestamp);
  if (n + e.timeouts.sessionIdlePause < Date.now()) return false;
  if (n > e.getContext().initialTimestamp + e.getOptions().maxReplayDuration) {
    $s &&
      Xs.infoTick(
        `Skipping event with timestamp ${n} because it is after maxReplayDuration`,
      );
    return false;
  }
  return true;
}
function kr(e, t) {
  try {
    if (typeof t === "function" && mr(e)) return t(e);
  } catch (e) {
    $s &&
      Xs.exception(
        e,
        "An error occurred in the `beforeAddRecordingEvent` callback, skipping the event...",
      );
    return null;
  }
  return e;
}
function br(e) {
  return !e.type;
}
function vr(e) {
  return e.type === "transaction";
}
function wr(e) {
  return e.type === "replay_event";
}
function _r(e) {
  return e.type === "feedback";
}
function Ir(e) {
  return (t, n) => {
    if (!e.isEnabled() || (!br(t) && !vr(t))) return;
    const s = n.statusCode;
    !s || s < 200 || s >= 300 || (vr(t) ? Cr(e, t) : Er(e, t));
  };
}
function Cr(e, t) {
  const n = e.getContext();
  t.contexts?.trace?.trace_id &&
    n.traceIds.size < 100 &&
    n.traceIds.add(t.contexts.trace.trace_id);
}
function Er(e, t) {
  const n = e.getContext();
  t.event_id && n.errorIds.size < 100 && n.errorIds.add(t.event_id);
  if (e.recordingMode !== "buffer" || !t.tags || !t.tags.replayId) return;
  const { beforeErrorSampling: s } = e.getOptions();
  (typeof s !== "function" || s(t)) &&
    D(async () => {
      try {
        await e.sendBufferedReplayOrFlush();
      } catch (t) {
        e.handleException(t);
      }
    });
}
function Mr(e) {
  return (t) => {
    e.isEnabled() && br(t) && xr(e, t);
  };
}
function xr(e, t) {
  const n = t.exception?.values?.[0]?.value;
  if (
    typeof n === "string" &&
    (n.match(
      /(reactjs\.org\/docs\/error-decoder\.html\?invariant=|react\.dev\/errors\/)(418|419|422|423|425)/,
    ) ||
      n.match(
        /(does not match server-rendered HTML|Hydration failed because)/i,
      ))
  ) {
    const t = Ss({ category: "replay.hydrate-error", data: { url: d() } });
    es(e, t);
  }
}
function Tr(e) {
  const t = u();
  t && t.on("beforeAddBreadcrumb", (t) => Rr(e, t));
}
function Rr(e, t) {
  if (!e.isEnabled() || !Dr(t)) return;
  const n = Ar(t);
  n && es(e, n);
}
function Ar(e) {
  return !Dr(e) ||
    ["fetch", "xhr", "sentry.event", "sentry.transaction"].includes(
      e.category,
    ) ||
    e.category.startsWith("ui.")
    ? null
    : e.category === "console"
      ? Or(e)
      : Ss(e);
}
function Or(e) {
  const n = e.data?.arguments;
  if (!Array.isArray(n) || n.length === 0) return Ss(e);
  let s = false;
  const r = n.map((e) => {
    if (!e) return e;
    if (typeof e === "string") {
      if (e.length > se) {
        s = true;
        return `${e.slice(0, se)}…`;
      }
      return e;
    }
    if (typeof e === "object")
      try {
        const n = t(e, 7);
        const r = JSON.stringify(n);
        if (r.length > se) {
          s = true;
          return `${JSON.stringify(n, null, 2).slice(0, se)}…`;
        }
        return n;
      } catch {}
    return e;
  });
  return Ss({
    ...e,
    data: {
      ...e.data,
      arguments: r,
      ...(s ? { _meta: { warnings: ["CONSOLE_ARG_TRUNCATED"] } } : {}),
    },
  });
}
function Dr(e) {
  return !!e.category;
}
function Lr(e, t) {
  return (
    !(e.type || !e.exception?.values?.length) &&
    !!t.originalException?.__rrweb__
  );
}
function Nr() {
  const e = h().getPropagationContext().dsc;
  e && delete e.replay_id;
  const t = p();
  if (t) {
    const e = m(t);
    delete e.replay_id;
  }
}
function Fr(e, t) {
  e.triggerUserActivity();
  e.addUpdate(() => {
    if (!t.timestamp) return true;
    e.throttledAddEvent({
      type: Zt.Custom,
      timestamp: t.timestamp * 1e3,
      data: {
        tag: "breadcrumb",
        payload: {
          timestamp: t.timestamp,
          type: "default",
          category: "sentry.feedback",
          data: { feedbackId: t.event_id },
        },
      },
    });
    return false;
  });
}
function Br(e, t) {
  return (
    e.recordingMode === "buffer" &&
    t.message !== J &&
    !(!t.exception || t.type) &&
    rr(e.getOptions().errorSampleRate)
  );
}
function Pr(e) {
  return Object.assign(
    (t, n) => {
      if (!e.isEnabled() || e.isPaused()) return t;
      if (wr(t)) {
        delete t.breadcrumbs;
        return t;
      }
      if (!br(t) && !vr(t) && !_r(t)) return t;
      const s = e.checkAndHandleExpiredSession();
      if (!s) {
        Nr();
        return t;
      }
      if (_r(t)) {
        e.flush();
        t.contexts.feedback.replay_id = e.getSessionId();
        Fr(e, t);
        return t;
      }
      if (Lr(t, n) && !e.getOptions()._experiments.captureExceptions) {
        $s && Xs.log("Ignoring error from rrweb internals", t);
        return null;
      }
      const r = Br(e, t);
      const o = r || e.recordingMode === "session";
      o && (t.tags = { ...t.tags, replayId: e.getSessionId() });
      if (
        r &&
        e.recordingMode === "buffer" &&
        e.session?.sampled === "buffer"
      ) {
        const t = e.session;
        t.dirty = true;
        e.getOptions().stickySession && or(t);
      }
      return t;
    },
    { id: "Replay" },
  );
}
function zr(e, t) {
  return t.map(({ type: t, start: n, end: s, name: r, data: o }) => {
    const i = e.throttledAddEvent({
      type: Zt.Custom,
      timestamp: n,
      data: {
        tag: "performanceSpan",
        payload: {
          op: t,
          description: r,
          startTimestamp: n,
          endTimestamp: s,
          data: o,
        },
      },
    });
    return typeof i === "string" ? Promise.resolve(null) : i;
  });
}
function Ur(e) {
  const { from: t, to: n } = e;
  const s = Date.now() / 1e3;
  return {
    type: "navigation.push",
    start: s,
    end: s,
    name: n,
    data: { previous: t },
  };
}
function Wr(e) {
  return (t) => {
    if (!e.isEnabled()) return;
    const n = Ur(t);
    if (n !== null) {
      e.getContext().urls.push(n.name);
      e.triggerUserActivity();
      e.addUpdate(() => {
        zr(e, [n]);
        return false;
      });
    }
  };
}
function Hr(e, t) {
  return (!$s || !e.getOptions()._experiments.traceInternals) && f(t, u());
}
function jr(e, t) {
  e.isEnabled() &&
    t !== null &&
    (Hr(e, t.name) ||
      e.addUpdate(() => {
        zr(e, [t]);
        return true;
      }));
}
function $r(e) {
  if (!e) return;
  const t = new TextEncoder();
  try {
    if (typeof e === "string") return t.encode(e).length;
    if (e instanceof URLSearchParams) return t.encode(e.toString()).length;
    if (e instanceof FormData) {
      const n = P(e);
      return t.encode(n).length;
    }
    if (e instanceof Blob) return e.size;
    if (e instanceof ArrayBuffer) return e.byteLength;
  } catch {}
}
function qr(e) {
  if (!e) return;
  const t = parseInt(e, 10);
  return isNaN(t) ? void 0 : t;
}
function Kr(e, t) {
  if (!e) return { headers: {}, size: void 0, _meta: { warnings: [t] } };
  const n = { ...e._meta };
  const s = n.warnings || [];
  n.warnings = [...s, t];
  e._meta = n;
  return e;
}
function Vr(e, t) {
  if (!t) return null;
  const {
    startTimestamp: n,
    endTimestamp: s,
    url: r,
    method: o,
    statusCode: i,
    request: a,
    response: c,
  } = t;
  const l = {
    type: e,
    start: n / 1e3,
    end: s / 1e3,
    name: r,
    data: { method: o, statusCode: i, request: a, response: c },
  };
  return l;
}
function Jr(e) {
  return { headers: {}, size: e, _meta: { warnings: ["URL_SKIPPED"] } };
}
function Gr(e, t, n) {
  if (!t && Object.keys(e).length === 0) return;
  if (!t) return { headers: e };
  if (!n) return { headers: e, size: t };
  const s = { headers: e, size: t };
  const { body: r, warnings: o } = Xr(n);
  s.body = r;
  o?.length && (s._meta = { warnings: o });
  return s;
}
function Yr(e, t) {
  return Object.entries(e).reduce((n, [s, r]) => {
    const o = s.toLowerCase();
    t.includes(o) && e[s] && (n[o] = r);
    return n;
  }, {});
}
function Xr(e) {
  if (!e || typeof e !== "string") return { body: e };
  const t = e.length > ne;
  const n = Qr(e);
  if (t) {
    const t = e.slice(0, ne);
    return n
      ? { body: t, warnings: ["MAYBE_JSON_TRUNCATED"] }
      : { body: `${t}…`, warnings: ["TEXT_TRUNCATED"] };
  }
  if (n)
    try {
      const t = JSON.parse(e);
      return { body: t };
    } catch {}
  return { body: e };
}
function Qr(e) {
  const t = e[0];
  const n = e[e.length - 1];
  return (t === "[" && n === "]") || (t === "{" && n === "}");
}
function Zr(e, t) {
  const n = eo(e);
  return y(n, t);
}
function eo(e, t = q.document.baseURI) {
  if (
    e.startsWith("http://") ||
    e.startsWith("https://") ||
    e.startsWith(q.location.origin)
  )
    return e;
  const n = new URL(e, t);
  if (n.origin !== new URL(t).origin) return e;
  const s = n.href;
  return !e.endsWith("/") && s.endsWith("/") ? s.slice(0, -1) : s;
}
async function to(e, t, n) {
  try {
    const s = await so(e, t, n);
    const r = Vr("resource.fetch", s);
    jr(n.replay, r);
  } catch (e) {
    $s && Xs.exception(e, "Failed to capture fetch breadcrumb");
  }
}
function no(e, t) {
  const { input: n, response: s } = t;
  const r = n ? z(n) : void 0;
  const o = $r(r);
  const i = s ? qr(s.headers.get("content-length")) : void 0;
  o !== void 0 && (e.data.request_body_size = o);
  i !== void 0 && (e.data.response_body_size = i);
}
async function so(e, t, n) {
  const s = Date.now();
  const { startTimestamp: r = s, endTimestamp: o = s } = t;
  const {
    url: i,
    method: a,
    status_code: c = 0,
    request_body_size: l,
    response_body_size: u,
  } = e.data;
  const d = Zr(i, n.networkDetailAllowUrls) && !Zr(i, n.networkDetailDenyUrls);
  const h = d ? ro(n, t.input, l) : Jr(l);
  const p = await oo(d, n, t.response, u);
  return {
    startTimestamp: r,
    endTimestamp: o,
    url: i,
    method: a,
    statusCode: c,
    request: h,
    response: p,
  };
}
function ro({ networkCaptureBodies: e, networkRequestHeaders: t }, n, s) {
  const r = n ? lo(n, t) : {};
  if (!e) return Gr(r, s, void 0);
  const o = z(n);
  const [i, a] = U(o, Xs);
  const c = Gr(r, s, i);
  return a ? Kr(c, a) : c;
}
async function oo(
  e,
  { networkCaptureBodies: t, networkResponseHeaders: n },
  s,
  r,
) {
  if (!e && r !== void 0) return Jr(r);
  const o = s ? co(s.headers, n) : {};
  if (!s || (!t && r !== void 0)) return Gr(o, r, void 0);
  const [i, a] = await ao(s);
  const c = io(i, {
    networkCaptureBodies: t,
    responseBodySize: r,
    captureDetails: e,
    headers: o,
  });
  return a ? Kr(c, a) : c;
}
function io(
  e,
  {
    networkCaptureBodies: t,
    responseBodySize: n,
    captureDetails: s,
    headers: r,
  },
) {
  try {
    const o = e?.length && n === void 0 ? $r(e) : n;
    return s ? Gr(r, o, t ? e : void 0) : Jr(o);
  } catch (e) {
    $s && Xs.exception(e, "Failed to serialize response body");
    return Gr(r, n, void 0);
  }
}
async function ao(e) {
  const t = ho(e);
  if (!t) return [void 0, "BODY_PARSE_ERROR"];
  try {
    const e = await po(t);
    return [e];
  } catch (e) {
    if (e instanceof Error && e.message.indexOf("Timeout") > -1) {
      $s && Xs.warn("Parsing text body from response timed out");
      return [void 0, "BODY_PARSE_TIMEOUT"];
    }
    $s && Xs.exception(e, "Failed to get text body from response");
    return [void 0, "BODY_PARSE_ERROR"];
  }
}
function co(e, t) {
  const n = {};
  t.forEach((t) => {
    e.get(t) && (n[t] = e.get(t));
  });
  return n;
}
function lo(e, t) {
  return e.length === 1 && typeof e[0] !== "string"
    ? uo(e[0], t)
    : e.length === 2
      ? uo(e[1], t)
      : {};
}
function uo(e, t) {
  if (!e) return {};
  const n = e.headers;
  return n
    ? n instanceof Headers
      ? co(n, t)
      : Array.isArray(n)
        ? {}
        : Yr(n, t)
    : {};
}
function ho(e) {
  try {
    return e.clone();
  } catch (e) {
    $s && Xs.exception(e, "Failed to clone response body");
  }
}
function po(e) {
  return new Promise((t, n) => {
    const s = D(
      () => n(new Error("Timeout while trying to read response body")),
      500,
    );
    mo(e)
      .then(
        (e) => t(e),
        (e) => n(e),
      )
      .finally(() => clearTimeout(s));
  });
}
async function mo(e) {
  return await e.text();
}
async function fo(e, t, n) {
  try {
    const s = go(e, t, n);
    const r = Vr("resource.xhr", s);
    jr(n.replay, r);
  } catch (e) {
    $s && Xs.exception(e, "Failed to capture xhr breadcrumb");
  }
}
function yo(e, t) {
  const { xhr: n, input: s } = t;
  if (!n) return;
  const r = $r(s);
  const o = n.getResponseHeader("content-length")
    ? qr(n.getResponseHeader("content-length"))
    : bo(n.response, n.responseType);
  r !== void 0 && (e.data.request_body_size = r);
  o !== void 0 && (e.data.response_body_size = o);
}
function go(e, t, n) {
  const s = Date.now();
  const { startTimestamp: r = s, endTimestamp: o = s, input: i, xhr: a } = t;
  const {
    url: c,
    method: l,
    status_code: u = 0,
    request_body_size: d,
    response_body_size: h,
  } = e.data;
  if (!c) return null;
  if (
    !a ||
    !Zr(c, n.networkDetailAllowUrls) ||
    Zr(c, n.networkDetailDenyUrls)
  ) {
    const e = Jr(d);
    const t = Jr(h);
    return {
      startTimestamp: r,
      endTimestamp: o,
      url: c,
      method: l,
      statusCode: u,
      request: e,
      response: t,
    };
  }
  const p = a[W];
  const m = p ? Yr(p.request_headers, n.networkRequestHeaders) : {};
  const f = Yr(H(a), n.networkResponseHeaders);
  const [y, g] = n.networkCaptureBodies ? U(i, Xs) : [void 0];
  const [S, k] = n.networkCaptureBodies ? So(a) : [void 0];
  const b = Gr(m, d, y);
  const v = Gr(f, h, S);
  return {
    startTimestamp: r,
    endTimestamp: o,
    url: c,
    method: l,
    statusCode: u,
    request: g ? Kr(b, g) : b,
    response: k ? Kr(v, k) : v,
  };
}
function So(e) {
  const t = [];
  try {
    return [e.responseText];
  } catch (e) {
    t.push(e);
  }
  try {
    return ko(e.response, e.responseType);
  } catch (e) {
    t.push(e);
  }
  $s && Xs.warn("Failed to get xhr response body", ...t);
  return [void 0];
}
function ko(e, t) {
  try {
    if (typeof e === "string") return [e];
    if (e instanceof Document) return [e.body.outerHTML];
    if (t === "json" && e && typeof e === "object") return [JSON.stringify(e)];
    if (!e) return [void 0];
  } catch (t) {
    $s && Xs.exception(t, "Failed to serialize body", e);
    return [void 0, "BODY_PARSE_ERROR"];
  }
  $s && Xs.log("Skipping network body because of body type", e);
  return [void 0, "UNPARSEABLE_BODY_TYPE"];
}
function bo(e, t) {
  try {
    const n =
      t === "json" && e && typeof e === "object" ? JSON.stringify(e) : e;
    return $r(n);
  } catch {
    return;
  }
}
function vo(e) {
  const t = u();
  try {
    const {
      networkDetailAllowUrls: n,
      networkDetailDenyUrls: s,
      networkCaptureBodies: r,
      networkRequestHeaders: o,
      networkResponseHeaders: i,
    } = e.getOptions();
    const a = {
      replay: e,
      networkDetailAllowUrls: n,
      networkDetailDenyUrls: s,
      networkCaptureBodies: r,
      networkRequestHeaders: o,
      networkResponseHeaders: i,
    };
    t && t.on("beforeAddBreadcrumb", (e, t) => wo(a, e, t));
  } catch {}
}
function wo(e, t, n) {
  if (t.data)
    try {
      if (_o(t) && Co(n)) {
        yo(t, n);
        fo(t, n, e);
      }
      if (Io(t) && Eo(n)) {
        no(t, n);
        to(t, n, e);
      }
    } catch (e) {
      $s && Xs.exception(e, "Error when enriching network breadcrumb");
    }
}
function _o(e) {
  return e.category === "xhr";
}
function Io(e) {
  return e.category === "fetch";
}
function Co(e) {
  return e?.xhr;
}
function Eo(e) {
  return e?.response;
}
function Mo(e) {
  const t = u();
  j(ws(e));
  $(Wr(e));
  Tr(e);
  vo(e);
  const n = Pr(e);
  g(n);
  if (t) {
    t.on("beforeSendEvent", Mr(e));
    t.on("afterSendEvent", Ir(e));
    t.on("createDsc", (t) => {
      const n = e.getSessionId();
      if (n && e.isEnabled() && e.recordingMode === "session") {
        const s = e.checkAndHandleExpiredSession();
        s && (t.replay_id = n);
      }
    });
    t.on("spanStart", (t) => {
      e.lastActiveSpan = t;
    });
    t.on("spanEnd", (t) => {
      e.lastActiveSpan = t;
    });
    t.on("beforeSendFeedback", async (t, n) => {
      const s = e.getSessionId();
      if (n?.includeReplay && e.isEnabled() && s && t.contexts?.feedback) {
        t.contexts.feedback.source === "api" &&
          (await e.sendBufferedReplayOrFlush());
        t.contexts.feedback.replay_id = s;
      }
    });
    t.on("openFeedbackWidget", async () => {
      await e.sendBufferedReplayOrFlush();
    });
  }
}
async function xo(e) {
  try {
    return Promise.all(zr(e, [To(q.performance.memory)]));
  } catch {
    return [];
  }
}
function To(e) {
  const { jsHeapSizeLimit: t, totalJSHeapSize: n, usedJSHeapSize: s } = e;
  const r = Date.now() / 1e3;
  return {
    type: "memory",
    name: "memory",
    start: r,
    end: r,
    data: {
      memory: { jsHeapSizeLimit: t, totalJSHeapSize: n, usedJSHeapSize: s },
    },
  };
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
 */ function Ro(e, t, n) {
  return S(e, t, { ...n, setTimeoutImpl: D });
}
const Ao = e.navigator;
function Oo() {
  return /iPhone|iPad|iPod/i.test(Ao?.userAgent ?? "") ||
    (/Macintosh/i.test(Ao?.userAgent ?? "") &&
      Ao?.maxTouchPoints &&
      Ao?.maxTouchPoints > 1)
    ? { sampling: { mousemove: false } }
    : {};
}
function Do(e) {
  let t = false;
  return (n, s) => {
    if (!e.checkAndHandleExpiredSession()) {
      $s && Xs.warn("Received replay event after session expired.");
      return;
    }
    const r = s || !t;
    t = true;
    e.clickDetector && fs(e.clickDetector, n);
    e.addUpdate(() => {
      e.recordingMode === "buffer" && r && e.setInitialState();
      if (!fr(e, n, r)) return true;
      if (!r) return false;
      const t = e.session;
      No(e, r);
      if (e.recordingMode === "buffer" && t && e.eventBuffer && !t.dirty) {
        const n = e.eventBuffer.getEarliestTimestamp();
        if (n) {
          $s &&
            Xs.log(
              `Updating session start time to earliest event in buffer to ${new Date(n)}`,
            );
          t.started = n;
          e.getOptions().stickySession && or(t);
        }
      }
      if (t?.previousSessionId) return true;
      e.recordingMode === "session" && void e.flush();
      return true;
    });
  };
}
function Lo(e) {
  const t = e.getOptions();
  return {
    type: Zt.Custom,
    timestamp: Date.now(),
    data: {
      tag: "options",
      payload: {
        shouldRecordCanvas: e.isRecordingCanvas(),
        sessionSampleRate: t.sessionSampleRate,
        errorSampleRate: t.errorSampleRate,
        useCompressionOption: t.useCompression,
        blockAllMedia: t.blockAllMedia,
        maskAllText: t.maskAllText,
        maskAllInputs: t.maskAllInputs,
        useCompression: !!e.eventBuffer && e.eventBuffer.type === "worker",
        networkDetailHasUrls: t.networkDetailAllowUrls.length > 0,
        networkCaptureBodies: t.networkCaptureBodies,
        networkRequestHasHeaders: t.networkRequestHeaders.length > 0,
        networkResponseHasHeaders: t.networkResponseHeaders.length > 0,
      },
    },
  };
}
function No(e, t) {
  t && e.session && e.session.segmentId === 0 && fr(e, Lo(e), false);
}
function Fo(e) {
  if (!e) return null;
  try {
    const t = e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
    return t;
  } catch {
    return null;
  }
}
function Bo(e, t, n, s) {
  return k(b(e, v(e), s, n), [
    [{ type: "replay_event" }, e],
    [
      {
        type: "replay_recording",
        length:
          typeof t === "string" ? new TextEncoder().encode(t).length : t.length,
      },
      t,
    ],
  ]);
}
function Po({ recordingData: e, headers: t }) {
  let n;
  const s = `${JSON.stringify(t)}\n`;
  if (typeof e === "string") n = `${s}${e}`;
  else {
    const t = new TextEncoder();
    const r = t.encode(s);
    n = new Uint8Array(r.length + e.length);
    n.set(r);
    n.set(e, r.length);
  }
  return n;
}
async function zo({ client: e, scope: t, replayId: n, event: s }) {
  const r =
    typeof e._integrations !== "object" ||
    e._integrations === null ||
    Array.isArray(e._integrations)
      ? void 0
      : Object.keys(e._integrations);
  const o = { event_id: n, integrations: r };
  e.emit("preprocessEvent", s, o);
  const i = await w(e.getOptions(), s, o, t, e, _());
  if (!i) return null;
  e.emit("postprocessEvent", i, o);
  i.platform = i.platform || "javascript";
  const a = e.getSdkMetadata();
  const { name: c, version: l, settings: u } = a?.sdk || {};
  i.sdk = {
    ...i.sdk,
    name: c || "sentry.javascript.unknown",
    version: l || "0.0.0",
    settings: u,
  };
  return i;
}
async function Uo({
  recordingData: e,
  replayId: t,
  segmentId: n,
  eventContext: s,
  timestamp: r,
  session: o,
}) {
  const i = Po({ recordingData: e, headers: { segment_id: n } });
  const { urls: a, errorIds: c, traceIds: l, initialTimestamp: d } = s;
  const p = u();
  const m = h();
  const f = p?.getTransport();
  const y = p?.getDsn();
  if (!p || !f || !y || !o.sampled) return Promise.resolve({});
  const g = {
    type: V,
    replay_start_timestamp: d / 1e3,
    timestamp: r / 1e3,
    error_ids: c,
    trace_ids: l,
    urls: a,
    replay_id: t,
    segment_id: n,
    replay_type: o.sampled,
  };
  const S = await zo({ scope: m, client: p, replayId: t, event: g });
  if (!S) {
    p.recordDroppedEvent("event_processor", "replay");
    $s && Xs.log("An event processor returned `null`, will not send event.");
    return Promise.resolve({});
  }
  delete S.sdkProcessingMetadata;
  const k = Bo(S, i, y, p.getOptions().tunnel);
  let b;
  try {
    b = await f.send(k);
  } catch (e) {
    const t = new Error(J);
    try {
      t.cause = e;
    } catch {}
    throw t;
  }
  if (
    typeof b.statusCode === "number" &&
    (b.statusCode < 200 || b.statusCode >= 300)
  )
    throw new TransportStatusCodeError(b.statusCode);
  const v = I({}, b);
  if (C(v, "replay")) throw new RateLimitError(v);
  return b;
}
class TransportStatusCodeError extends Error {
  constructor(e) {
    super(`Transport returned status code ${e}`);
  }
}
class RateLimitError extends Error {
  constructor(e) {
    super("Rate limit hit");
    this.rateLimits = e;
  }
}
async function Wo(e, t = { count: 0, interval: ee }) {
  const { recordingData: n, onError: s } = e;
  if (n.length)
    try {
      await Uo(e);
      return true;
    } catch (n) {
      if (n instanceof TransportStatusCodeError || n instanceof RateLimitError)
        throw n;
      E("Replays", { _retryCount: t.count });
      s && s(n);
      if (t.count >= te) {
        const e = new Error(`${J} - max retries exceeded`);
        try {
          e.cause = n;
        } catch {}
        throw e;
      }
      t.interval *= ++t.count;
      return new Promise((n, s) => {
        D(async () => {
          try {
            await Wo(e, t);
            n(true);
          } catch (e) {
            s(e);
          }
        }, t.interval);
      });
    }
}
const Ho = "__THROTTLED";
const jo = "__SKIPPED";
function $o(e, t, n) {
  const s = new Map();
  const r = (e) => {
    const t = e - n;
    s.forEach((e, n) => {
      n < t && s.delete(n);
    });
  };
  const o = () => [...s.values()].reduce((e, t) => e + t, 0);
  let i = false;
  return (...n) => {
    const a = Math.floor(Date.now() / 1e3);
    r(a);
    if (o() >= t) {
      const e = i;
      i = true;
      return e ? jo : Ho;
    }
    i = false;
    const c = s.get(a) || 0;
    s.set(a, c + 1);
    return e(...n);
  };
}
class ReplayContainer {
  constructor({ options: e, recordingOptions: t }) {
    this.eventBuffer = null;
    this.performanceEntries = [];
    this.replayPerformanceEntries = [];
    this.recordingMode = "session";
    this.timeouts = { sessionIdlePause: G, sessionIdleExpire: Y };
    this._lastActivity = Date.now();
    this._isEnabled = false;
    this._isPaused = false;
    this._requiresManualStart = false;
    this._hasInitializedCoreListeners = false;
    this._context = {
      errorIds: new Set(),
      traceIds: new Set(),
      urls: [],
      initialTimestamp: Date.now(),
      initialUrl: "",
    };
    this._recordingOptions = t;
    this._options = e;
    this._debouncedFlush = Ro(
      () => this._flush(),
      this._options.flushMinDelay,
      { maxWait: this._options.flushMaxDelay },
    );
    this._throttledAddEvent = $o((e, t) => yr(this, e, t), 300, 5);
    const { slowClickTimeout: n, slowClickIgnoreSelectors: s } =
      this.getOptions();
    const r = n
      ? {
          threshold: Math.min(re, n),
          timeout: n,
          scrollTimeout: oe,
          ignoreSelector: s ? s.join(",") : "",
        }
      : void 0;
    r && (this.clickDetector = new ClickDetector(this, r));
    if ($s) {
      const t = e._experiments;
      Xs.setConfig({
        captureExceptions: !!t.captureExceptions,
        traceInternals: !!t.traceInternals,
      });
    }
    this._handleVisibilityChange = () => {
      q.document.visibilityState === "visible"
        ? this._doChangeToForegroundTasks()
        : this._doChangeToBackgroundTasks();
    };
    this._handleWindowBlur = () => {
      const e = Ss({ category: "ui.blur" });
      this._doChangeToBackgroundTasks(e);
    };
    this._handleWindowFocus = () => {
      const e = Ss({ category: "ui.focus" });
      this._doChangeToForegroundTasks(e);
    };
    this._handleKeyboardEvent = (e) => {
      Ms(this, e);
    };
  }
  getContext() {
    return this._context;
  }
  isEnabled() {
    return this._isEnabled;
  }
  isPaused() {
    return this._isPaused;
  }
  isRecordingCanvas() {
    return Boolean(this._canvas);
  }
  getOptions() {
    return this._options;
  }
  handleException(e) {
    $s && Xs.exception(e);
    this._options.onError && this._options.onError(e);
  }
  initializeSampling(e) {
    const { errorSampleRate: t, sessionSampleRate: n } = this._options;
    const s = t <= 0 && n <= 0;
    this._requiresManualStart = s;
    if (!s) {
      this._initializeSessionForSampling(e);
      if (this.session) {
        if (this.session.sampled !== false) {
          this.recordingMode =
            this.session.sampled === "buffer" && this.session.segmentId === 0
              ? "buffer"
              : "session";
          $s && Xs.infoTick(`Starting replay in ${this.recordingMode} mode`);
          this._initializeRecording();
        }
      } else
        $s &&
          Xs.exception(new Error("Unable to initialize and create session"));
    }
  }
  start() {
    if (this._isEnabled && this.recordingMode === "session") {
      $s && Xs.log("Recording is already in progress");
      return;
    }
    if (this._isEnabled && this.recordingMode === "buffer") {
      $s &&
        Xs.log("Buffering is in progress, call `flush()` to save the replay");
      return;
    }
    $s && Xs.infoTick("Starting replay in session mode");
    this._updateUserActivity();
    const e = pr(
      {
        maxReplayDuration: this._options.maxReplayDuration,
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
      },
      {
        stickySession: this._options.stickySession,
        sessionSampleRate: 1,
        allowBuffering: false,
      },
    );
    this.session = e;
    this.recordingMode = "session";
    this._initializeRecording();
  }
  startBuffering() {
    if (this._isEnabled) {
      $s &&
        Xs.log("Buffering is in progress, call `flush()` to save the replay");
      return;
    }
    $s && Xs.infoTick("Starting replay in buffer mode");
    const e = pr(
      {
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
        maxReplayDuration: this._options.maxReplayDuration,
      },
      {
        stickySession: this._options.stickySession,
        sessionSampleRate: 0,
        allowBuffering: true,
      },
    );
    this.session = e;
    this.recordingMode = "buffer";
    this._initializeRecording();
  }
  startRecording() {
    try {
      const e = this._canvas;
      this._stopRecording = Kn({
        ...this._recordingOptions,
        ...(this.recordingMode === "buffer"
          ? { checkoutEveryNms: Z }
          : this._options._experiments.continuousCheckout && {
              checkoutEveryNms: Math.max(
                36e4,
                this._options._experiments.continuousCheckout,
              ),
            }),
        emit: Do(this),
        ...Oo(),
        onMutation: this._onMutationHandler.bind(this),
        ...(e
          ? {
              recordCanvas: e.recordCanvas,
              getCanvasManager: e.getCanvasManager,
              sampling: e.sampling,
              dataURLOptions: e.dataURLOptions,
            }
          : {}),
      });
    } catch (e) {
      this.handleException(e);
    }
  }
  stopRecording() {
    try {
      if (this._stopRecording) {
        this._stopRecording();
        this._stopRecording = void 0;
      }
      return true;
    } catch (e) {
      this.handleException(e);
      return false;
    }
  }
  async stop({ forceFlush: e = false, reason: t } = {}) {
    if (this._isEnabled) {
      this._isEnabled = false;
      this.recordingMode = "buffer";
      try {
        $s && Xs.log("Stopping Replay" + (t ? ` triggered by ${t}` : ""));
        Nr();
        this._removeListeners();
        this.stopRecording();
        this._debouncedFlush.cancel();
        e && (await this._flush({ force: true }));
        this.eventBuffer?.destroy();
        this.eventBuffer = null;
        nr(this);
      } catch (e) {
        this.handleException(e);
      }
    }
  }
  pause() {
    if (!this._isPaused) {
      this._isPaused = true;
      this.stopRecording();
      $s && Xs.log("Pausing replay");
    }
  }
  resume() {
    if (this._isPaused && this._checkSession()) {
      this._isPaused = false;
      this.startRecording();
      $s && Xs.log("Resuming replay");
    }
  }
  async sendBufferedReplayOrFlush({ continueRecording: e = true } = {}) {
    if (this.recordingMode === "session") return this.flushImmediate();
    const t = Date.now();
    $s && Xs.log("Converting buffer to session");
    await this.flushImmediate();
    const n = this.stopRecording();
    if (e && n && this.recordingMode !== "session") {
      this.recordingMode = "session";
      if (this.session) {
        this.session.dirty = false;
        this._updateUserActivity(t);
        this._updateSessionActivity(t);
        this._maybeSaveSession();
      }
      this.startRecording();
    }
  }
  addUpdate(e) {
    const t = e();
    this.recordingMode !== "buffer" &&
      this._isEnabled &&
      t !== true &&
      this._debouncedFlush();
  }
  triggerUserActivity() {
    this._updateUserActivity();
    if (this._stopRecording) {
      this.checkAndHandleExpiredSession();
      this._updateSessionActivity();
    } else {
      if (!this._checkSession()) return;
      this.resume();
    }
  }
  updateUserActivity() {
    this._updateUserActivity();
    this._updateSessionActivity();
  }
  conditionalFlush() {
    return this.recordingMode === "buffer"
      ? Promise.resolve()
      : this.flushImmediate();
  }
  flush() {
    return this._debouncedFlush();
  }
  flushImmediate() {
    this._debouncedFlush();
    return this._debouncedFlush.flush();
  }
  cancelFlush() {
    this._debouncedFlush.cancel();
  }
  /** Get the current session (=replay) ID
   *
   * @param onlyIfSampled - If true, will only return the session ID if the session is sampled.
   */ getSessionId(e) {
    if (!e || this.session?.sampled !== false) return this.session?.id;
  }
  checkAndHandleExpiredSession() {
    if (
      !(
        this._lastActivity &&
        ur(this._lastActivity, this.timeouts.sessionIdlePause) &&
        this.session &&
        this.session.sampled === "session"
      )
    )
      return !!this._checkSession();
    this.pause();
  }
  setInitialState() {
    const e = `${q.location.pathname}${q.location.hash}${q.location.search}`;
    const t = `${q.location.origin}${e}`;
    this.performanceEntries = [];
    this.replayPerformanceEntries = [];
    this._clearContext();
    this._context.initialUrl = t;
    this._context.initialTimestamp = Date.now();
    this._context.urls.push(t);
  }
  throttledAddEvent(e, t) {
    const n = this._throttledAddEvent(e, t);
    if (n === Ho) {
      const e = Ss({ category: "replay.throttled" });
      this.addUpdate(
        () =>
          !fr(this, {
            type: Xn,
            timestamp: e.timestamp || 0,
            data: { tag: "breadcrumb", payload: e, metric: true },
          }),
      );
    }
    return n;
  }
  getCurrentRoute() {
    const e = this.lastActiveSpan || p();
    const t = e && M(e);
    const n = (t && x(t).data) || {};
    const s = n[T];
    if (t && s && ["route", "custom"].includes(s)) return x(t).description;
  }
  _initializeRecording() {
    this.setInitialState();
    this._updateSessionActivity();
    this.eventBuffer = Qs({
      useCompression: this._options.useCompression,
      workerUrl: this._options.workerUrl,
    });
    this._removeListeners();
    this._addListeners();
    this._isEnabled = true;
    this._isPaused = false;
    this.startRecording();
  }
  _initializeSessionForSampling(e) {
    const t = this._options.errorSampleRate > 0;
    const n = pr(
      {
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
        maxReplayDuration: this._options.maxReplayDuration,
        previousSessionId: e,
      },
      {
        stickySession: this._options.stickySession,
        sessionSampleRate: this._options.sessionSampleRate,
        allowBuffering: t,
      },
    );
    this.session = n;
  }
  _checkSession() {
    if (!this.session) return false;
    const e = this.session;
    if (
      hr(e, {
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
        maxReplayDuration: this._options.maxReplayDuration,
      })
    ) {
      this._refreshSession(e);
      return false;
    }
    return true;
  }
  async _refreshSession(e) {
    if (this._isEnabled) {
      await this.stop({ reason: "refresh session" });
      this.initializeSampling(e.id);
    }
  }
  _addListeners() {
    try {
      q.document.addEventListener(
        "visibilitychange",
        this._handleVisibilityChange,
      );
      q.addEventListener("blur", this._handleWindowBlur);
      q.addEventListener("focus", this._handleWindowFocus);
      q.addEventListener("keydown", this._handleKeyboardEvent);
      this.clickDetector && this.clickDetector.addListeners();
      if (!this._hasInitializedCoreListeners) {
        Mo(this);
        this._hasInitializedCoreListeners = true;
      }
    } catch (e) {
      this.handleException(e);
    }
    this._performanceCleanupCallback = js(this);
  }
  _removeListeners() {
    try {
      q.document.removeEventListener(
        "visibilitychange",
        this._handleVisibilityChange,
      );
      q.removeEventListener("blur", this._handleWindowBlur);
      q.removeEventListener("focus", this._handleWindowFocus);
      q.removeEventListener("keydown", this._handleKeyboardEvent);
      this.clickDetector && this.clickDetector.removeListeners();
      this._performanceCleanupCallback && this._performanceCleanupCallback();
    } catch (e) {
      this.handleException(e);
    }
  }
  _doChangeToBackgroundTasks(e) {
    if (!this.session) return;
    const t = dr(this.session, {
      maxReplayDuration: this._options.maxReplayDuration,
      sessionIdleExpire: this.timeouts.sessionIdleExpire,
    });
    if (!t) {
      e && this._createCustomBreadcrumb(e);
      void this.conditionalFlush();
    }
  }
  _doChangeToForegroundTasks(e) {
    if (!this.session) return;
    const t = this.checkAndHandleExpiredSession();
    t
      ? e && this._createCustomBreadcrumb(e)
      : $s && Xs.log("Document has become active, but session has expired");
  }
  _updateUserActivity(e = Date.now()) {
    this._lastActivity = e;
  }
  _updateSessionActivity(e = Date.now()) {
    if (this.session) {
      this.session.lastActivity = e;
      this._maybeSaveSession();
    }
  }
  _createCustomBreadcrumb(e) {
    this.addUpdate(() => {
      this.throttledAddEvent({
        type: Zt.Custom,
        timestamp: e.timestamp || 0,
        data: { tag: "breadcrumb", payload: e },
      });
    });
  }
  _addPerformanceEntries() {
    let e = Os(this.performanceEntries).concat(this.replayPerformanceEntries);
    this.performanceEntries = [];
    this.replayPerformanceEntries = [];
    if (this._requiresManualStart) {
      const t = this._context.initialTimestamp / 1e3;
      e = e.filter((e) => e.start >= t);
    }
    return Promise.all(zr(this, e));
  }
  _clearContext() {
    this._context.errorIds.clear();
    this._context.traceIds.clear();
    this._context.urls = [];
  }
  _updateInitialTimestampFromEventBuffer() {
    const { session: e, eventBuffer: t } = this;
    if (!e || !t || this._requiresManualStart) return;
    if (e.segmentId) return;
    const n = t.getEarliestTimestamp();
    n &&
      n < this._context.initialTimestamp &&
      (this._context.initialTimestamp = n);
  }
  _popEventContext() {
    const e = {
      initialTimestamp: this._context.initialTimestamp,
      initialUrl: this._context.initialUrl,
      errorIds: Array.from(this._context.errorIds),
      traceIds: Array.from(this._context.traceIds),
      urls: this._context.urls,
    };
    this._clearContext();
    return e;
  }
  async _runFlush() {
    const e = this.getSessionId();
    if (this.session && this.eventBuffer && e) {
      await this._addPerformanceEntries();
      if (this.eventBuffer?.hasEvents) {
        await xo(this);
        if (this.eventBuffer && e === this.getSessionId())
          try {
            this._updateInitialTimestampFromEventBuffer();
            const t = Date.now();
            if (
              t - this._context.initialTimestamp >
              this._options.maxReplayDuration + 3e4
            )
              throw new Error("Session is too long, not sending replay");
            const n = this._popEventContext();
            const s = this.session.segmentId++;
            this._maybeSaveSession();
            const r = await this.eventBuffer.finish();
            await Wo({
              replayId: e,
              recordingData: r,
              segmentId: s,
              eventContext: n,
              session: this.session,
              timestamp: t,
              onError: (e) => this.handleException(e),
            });
          } catch (e) {
            this.handleException(e);
            this.stop({ reason: "sendReplay" });
            const t = u();
            if (t) {
              const n =
                e instanceof RateLimitError
                  ? "ratelimit_backoff"
                  : "send_error";
              t.recordDroppedEvent(n, "replay");
            }
          }
      }
    } else $s && Xs.error("No session or eventBuffer found to flush.");
  }
  async _flush({ force: e = false } = {}) {
    if (!this._isEnabled && !e) return;
    if (!this.checkAndHandleExpiredSession()) {
      $s &&
        Xs.error("Attempting to finish replay event after session expired.");
      return;
    }
    if (!this.session) return;
    const t = this.session.started;
    const n = Date.now();
    const s = n - t;
    this._debouncedFlush.cancel();
    const r = s < this._options.minReplayDuration;
    const o = s > this._options.maxReplayDuration + 5e3;
    if (r || o) {
      $s &&
        Xs.log(
          `Session duration (${Math.floor(s / 1e3)}s) is too ${r ? "short" : "long"}, not sending replay.`,
        );
      r && this._debouncedFlush();
      return;
    }
    const i = this.eventBuffer;
    i &&
      this.session.segmentId === 0 &&
      !i.hasCheckout &&
      $s &&
      Xs.log("Flushing initial segment without checkout.");
    const a = !!this._flushLock;
    this._flushLock || (this._flushLock = this._runFlush());
    try {
      await this._flushLock;
    } catch (e) {
      this.handleException(e);
    } finally {
      this._flushLock = void 0;
      a && this._debouncedFlush();
    }
  }
  _maybeSaveSession() {
    this.session && this._options.stickySession && or(this.session);
  }
  _onMutationHandler(e) {
    const { ignoreMutations: t } = this._options._experiments;
    if (
      t?.length &&
      e.some((e) => {
        const n = Fo(e.target);
        const s = t.join(",");
        return n?.matches(s);
      })
    )
      return false;
    const n = e.length;
    const s = this._options.mutationLimit;
    const r = this._options.mutationBreadcrumbLimit;
    const o = s && n > s;
    if (n > r || o) {
      const e = Ss({
        category: "replay.mutations",
        data: { count: n, limit: o },
      });
      this._createCustomBreadcrumb(e);
    }
    if (o) {
      this.stop({
        reason: "mutationLimit",
        forceFlush: this.recordingMode === "session",
      });
      return false;
    }
    return true;
  }
}
function qo(e, t) {
  return [...e, ...t].join(",");
}
function Ko({ mask: e, unmask: t, block: n, unblock: s, ignore: r }) {
  const o = ["base", "iframe[srcdoc]:not([src])"];
  const i = qo(e, [".sentry-mask", "[data-sentry-mask]"]);
  const a = qo(t, []);
  const c = {
    maskTextSelector: i,
    unmaskTextSelector: a,
    blockSelector: qo(n, [".sentry-block", "[data-sentry-block]", ...o]),
    unblockSelector: qo(s, []),
    ignoreSelector: qo(r, [
      ".sentry-ignore",
      "[data-sentry-ignore]",
      'input[type="file"]',
    ]),
  };
  return c;
}
function Vo({
  el: e,
  key: t,
  maskAttributes: n,
  maskAllText: s,
  privacyOptions: r,
  value: o,
}) {
  return s
    ? r.unmaskTextSelector && e.matches(r.unmaskTextSelector)
      ? o
      : n.includes(t) ||
          (t === "value" &&
            e.tagName === "INPUT" &&
            ["submit", "button"].includes(e.getAttribute("type") || ""))
        ? o.replace(/[\S]/g, "*")
        : o
    : o;
}
const Jo =
  'img,image,svg,video,object,picture,embed,map,audio,link[rel="icon"],link[rel="apple-touch-icon"]';
const Go = ["content-length", "content-type", "accept"];
let Yo = false;
const Xo = (e) => new Replay(e);
class Replay {
  constructor({
    flushMinDelay: e = X,
    flushMaxDelay: t = Q,
    minReplayDuration: n = ae,
    maxReplayDuration: s = le,
    stickySession: r = true,
    useCompression: o = true,
    workerUrl: i,
    _experiments: a = {},
    maskAllText: c = true,
    maskAllInputs: l = true,
    blockAllMedia: u = true,
    mutationBreadcrumbLimit: d = 750,
    mutationLimit: h = 1e4,
    slowClickTimeout: p = 7e3,
    slowClickIgnoreSelectors: m = [],
    networkDetailAllowUrls: f = [],
    networkDetailDenyUrls: y = [],
    networkCaptureBodies: g = true,
    networkRequestHeaders: S = [],
    networkResponseHeaders: k = [],
    mask: b = [],
    maskAttributes: v = ["title", "placeholder", "aria-label"],
    unmask: w = [],
    block: _ = [],
    unblock: I = [],
    ignore: C = [],
    maskFn: E,
    beforeAddRecordingEvent: M,
    beforeErrorSampling: x,
    onError: T,
  } = {}) {
    this.name = "Replay";
    const A = Ko({ mask: b, unmask: w, block: _, unblock: I, ignore: C });
    this._recordingOptions = {
      maskAllInputs: l,
      maskAllText: c,
      maskInputOptions: { password: true },
      maskTextFn: E,
      maskInputFn: E,
      maskAttributeFn: (e, t, n) =>
        Vo({
          maskAttributes: v,
          maskAllText: c,
          privacyOptions: A,
          key: e,
          value: t,
          el: n,
        }),
      ...A,
      slimDOMOptions: "all",
      inlineStylesheet: true,
      inlineImages: false,
      collectFonts: true,
      errorHandler: (e) => {
        try {
          e.__rrweb__ = true;
        } catch {}
      },
      recordCrossOriginIframes: Boolean(a.recordCrossOriginIframes),
    };
    this._initialOptions = {
      flushMinDelay: e,
      flushMaxDelay: t,
      minReplayDuration: Math.min(n, ce),
      maxReplayDuration: Math.min(s, le),
      stickySession: r,
      useCompression: o,
      workerUrl: i,
      blockAllMedia: u,
      maskAllInputs: l,
      maskAllText: c,
      mutationBreadcrumbLimit: d,
      mutationLimit: h,
      slowClickTimeout: p,
      slowClickIgnoreSelectors: m,
      networkDetailAllowUrls: f,
      networkDetailDenyUrls: y,
      networkCaptureBodies: g,
      networkRequestHeaders: Zo(S),
      networkResponseHeaders: Zo(k),
      beforeAddRecordingEvent: M,
      beforeErrorSampling: x,
      onError: T,
      _experiments: a,
    };
    if (this._initialOptions.blockAllMedia) {
      this._recordingOptions.blockSelector = this._recordingOptions
        .blockSelector
        ? `${this._recordingOptions.blockSelector},${Jo}`
        : Jo;
      this._recordingOptions.ignoreCSSAttributes = new Set([
        "background-image",
      ]);
    }
    if (this._isInitialized && R())
      throw new Error(
        "Multiple Sentry Session Replay instances are not supported",
      );
    this._isInitialized = true;
  }
  get _isInitialized() {
    return Yo;
  }
  set _isInitialized(e) {
    Yo = e;
  }
  afterAllSetup(e) {
    if (R() && !this._replay) {
      this._setup(e);
      this._initialize(e);
    }
  }
  start() {
    this._replay && this._replay.start();
  }
  startBuffering() {
    this._replay && this._replay.startBuffering();
  }
  stop() {
    return this._replay
      ? this._replay.stop({
          forceFlush: this._replay.recordingMode === "session",
        })
      : Promise.resolve();
  }
  flush(e) {
    if (!this._replay) return Promise.resolve();
    if (!this._replay.isEnabled()) {
      this._replay.start();
      return Promise.resolve();
    }
    return this._replay.sendBufferedReplayOrFlush(e);
  }
  /**
   * Get the current session ID.
   *
   * @param onlyIfSampled - If true, will only return the session ID if the session is sampled.
   *
   */ getReplayId(e) {
    if (this._replay?.isEnabled()) return this._replay.getSessionId(e);
  }
  getRecordingMode() {
    if (this._replay?.isEnabled()) return this._replay.recordingMode;
  }
  _initialize(e) {
    if (this._replay) {
      this._maybeLoadFromReplayCanvasIntegration(e);
      this._replay.initializeSampling();
    }
  }
  _setup(e) {
    const t = Qo(this._initialOptions, e);
    this._replay = new ReplayContainer({
      options: t,
      recordingOptions: this._recordingOptions,
    });
  }
  _maybeLoadFromReplayCanvasIntegration(e) {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    try {
      const t = e.getIntegrationByName("ReplayCanvas");
      if (!t) return;
      this._replay._canvas = t.getOptions();
    } catch {}
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  }
}
function Qo(e, t) {
  const n = t.getOptions();
  const s = { sessionSampleRate: 0, errorSampleRate: 0, ...e };
  const r = A(n.replaysSessionSampleRate);
  const o = A(n.replaysOnErrorSampleRate);
  r == null &&
    o == null &&
    O(() => {
      console.warn(
        "Replay is disabled because neither `replaysSessionSampleRate` nor `replaysOnErrorSampleRate` are set.",
      );
    });
  r != null && (s.sessionSampleRate = r);
  o != null && (s.errorSampleRate = o);
  return s;
}
function Zo(e) {
  return [...Go, ...e.map((e) => e.toLowerCase())];
}
function ei() {
  const e = u();
  return e?.getIntegrationByName("Replay");
}
export { ei as getReplay, Xo as replayIntegration };
