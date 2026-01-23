// @sentry-internal/browser-utils@10.34.0 downloaded from https://ga.jspm.io/npm:@sentry-internal/browser-utils@10.34.0/build/esm/index.js

import {
  GLOBAL_OBJ as t,
  debug as e,
  getFunctionName as n,
  spanToJSON as r,
  withActiveSpan as o,
  startInactiveSpan as i,
  getClient as s,
  getCurrentScope as c,
  browserPerformanceTimeOrigin as a,
  timestampInSeconds as u,
  htmlTreeAsString as l,
  SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME as d,
  SEMANTIC_ATTRIBUTE_SENTRY_OP as p,
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN as f,
  SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE as m,
  SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT as h,
  getActiveSpan as y,
  getComponentName as g,
  setMeasurement as _,
  stringMatchesSomePattern as v,
  isPrimitive as b,
  parseUrl as T,
  getRootSpan as S,
  SEMANTIC_ATTRIBUTE_SENTRY_SOURCE as E,
  startSpan as w,
  addHandler as k,
  maybeInstrument as L,
  triggerHandlers as C,
  fill as I,
  addNonEnumerableProperty as P,
  uuid4 as M,
  supportsHistory as q,
  isNativeFunction as x,
  isString as A,
  isBrowser as N,
} from "@sentry/core";
const R = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
const O = t;
const $ = (t, e) =>
  t > e[1] ? "poor" : t > e[0] ? "needs-improvement" : "good";
const H = (t, e, n, r) => {
  let o;
  let i;
  return (s) => {
    if (e.value >= 0 && (s || r)) {
      i = e.value - (o ?? 0);
      if (i || o === void 0) {
        o = e.value;
        e.delta = i;
        e.rating = $(e.value, n);
        t(e);
      }
    }
  };
};
const B = (t = true) => {
  const e = O.performance?.getEntriesByType?.("navigation")[0];
  if (!t || (e && e.responseStart > 0 && e.responseStart < performance.now()))
    return e;
};
const D = () => {
  const t = B();
  return t?.activationStart ?? 0;
};
function U(t, e, n) {
  O.document && O.addEventListener(t, e, n);
}
function z(t, e, n) {
  O.document && O.removeEventListener(t, e, n);
}
let j = -1;
const F = new Set();
const V = () =>
  O.document?.visibilityState !== "hidden" || O.document?.prerendering
    ? Infinity
    : 0;
const Y = (t) => {
  if (G(t) && j > -1) {
    if (t.type === "visibilitychange" || t.type === "pagehide")
      for (const t of F) t();
    if (!isFinite(j)) {
      j = t.type === "visibilitychange" ? t.timeStamp : 0;
      z("prerenderingchange", Y, true);
    }
  }
};
const W = () => {
  if (O.document && j < 0) {
    const t = D();
    const e = O.document.prerendering
      ? void 0
      : globalThis.performance
          .getEntriesByType("visibility-state")
          .filter((e) => e.name === "hidden" && e.startTime > t)[0]?.startTime;
    j = e ?? V();
    U("visibilitychange", Y, true);
    U("pagehide", Y, true);
    U("prerenderingchange", Y, true);
  }
  return {
    get firstHiddenTime() {
      return j;
    },
    onHidden(t) {
      F.add(t);
    },
  };
};
function G(t) {
  return t.type === "pagehide" || O.document?.visibilityState === "hidden";
}
const X = () =>
  `v5-${Date.now()}-${Math.floor(Math.random() * 8999999999999) + 1e12}`;
const J = (t, e = -1) => {
  const n = B();
  let r = "navigate";
  n &&
    (O.document?.prerendering || D() > 0
      ? (r = "prerender")
      : O.document?.wasDiscarded
        ? (r = "restore")
        : n.type && (r = n.type.replace(/_/g, "-")));
  const o = [];
  return {
    name: t,
    value: e,
    rating: "good",
    delta: 0,
    entries: o,
    id: X(),
    navigationType: r,
  };
};
const K = new WeakMap();
function Q(t, e) {
  try {
    K.get(t) || K.set(t, new e());
    return K.get(t);
  } catch (t) {
    return new e();
  }
}
class LayoutShiftManager {
  constructor() {
    LayoutShiftManager.prototype.__init.call(this);
    LayoutShiftManager.prototype.__init2.call(this);
  }
  __init() {
    this._sessionValue = 0;
  }
  __init2() {
    this._sessionEntries = [];
  }
  _processEntry(t) {
    if (t.hadRecentInput) return;
    const e = this._sessionEntries[0];
    const n = this._sessionEntries[this._sessionEntries.length - 1];
    if (
      this._sessionValue &&
      e &&
      n &&
      t.startTime - n.startTime < 1e3 &&
      t.startTime - e.startTime < 5e3
    ) {
      this._sessionValue += t.value;
      this._sessionEntries.push(t);
    } else {
      this._sessionValue = t.value;
      this._sessionEntries = [t];
    }
    this._onAfterProcessingUnexpectedShift?.(t);
  }
}
const Z = (t, e, n = {}) => {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(t)) {
      const r = new PerformanceObserver((t) => {
        Promise.resolve().then(() => {
          e(t.getEntries());
        });
      });
      r.observe({ type: t, buffered: true, ...n });
      return r;
    }
  } catch {}
};
const tt = (t) => {
  let e = false;
  return () => {
    if (!e) {
      t();
      e = true;
    }
  };
};
const et = (t) => {
  O.document?.prerendering
    ? addEventListener("prerenderingchange", () => t(), true)
    : t();
};
const nt = [1800, 3e3];
const rt = (t, e = {}) => {
  et(() => {
    const n = W();
    const r = J("FCP");
    let o;
    const i = (t) => {
      for (const e of t)
        if (e.name === "first-contentful-paint") {
          s.disconnect();
          if (e.startTime < n.firstHiddenTime) {
            r.value = Math.max(e.startTime - D(), 0);
            r.entries.push(e);
            o(true);
          }
        }
    };
    const s = Z("paint", i);
    s && (o = H(t, r, nt, e.reportAllChanges));
  });
};
const ot = [0.1, 0.25];
const it = (t, e = {}) => {
  rt(
    tt(() => {
      const n = J("CLS", 0);
      let r;
      const o = W();
      const i = Q(e, LayoutShiftManager);
      const s = (t) => {
        for (const e of t) i._processEntry(e);
        if (i._sessionValue > n.value) {
          n.value = i._sessionValue;
          n.entries = i._sessionEntries;
          r();
        }
      };
      const c = Z("layout-shift", s);
      if (c) {
        r = H(t, n, ot, e.reportAllChanges);
        o.onHidden(() => {
          s(c.takeRecords());
          r(true);
        });
        O?.setTimeout?.(r);
      }
    }),
  );
};
let st = 0;
let ct = Infinity;
let at = 0;
const ut = (t) => {
  t.forEach((t) => {
    if (t.interactionId) {
      ct = Math.min(ct, t.interactionId);
      at = Math.max(at, t.interactionId);
      st = at ? (at - ct) / 7 + 1 : 0;
    }
  });
};
let lt;
const dt = () => (lt ? st : performance.interactionCount || 0);
const pt = () => {
  "interactionCount" in performance ||
    lt ||
    (lt = Z("event", ut, {
      type: "event",
      buffered: true,
      durationThreshold: 0,
    }));
};
const ft = 10;
let mt = 0;
const ht = () => dt() - mt;
class InteractionManager {
  constructor() {
    InteractionManager.prototype.__init.call(this);
    InteractionManager.prototype.__init2.call(this);
  }
  __init() {
    this._longestInteractionList = [];
  }
  __init2() {
    this._longestInteractionMap = new Map();
  }
  _resetInteractions() {
    mt = dt();
    this._longestInteractionList.length = 0;
    this._longestInteractionMap.clear();
  }
  _estimateP98LongestInteraction() {
    const t = Math.min(
      this._longestInteractionList.length - 1,
      Math.floor(ht() / 50),
    );
    return this._longestInteractionList[t];
  }
  _processEntry(t) {
    this._onBeforeProcessingEntry?.(t);
    if (!(t.interactionId || t.entryType === "first-input")) return;
    const e = this._longestInteractionList.at(-1);
    let n = this._longestInteractionMap.get(t.interactionId);
    if (
      n ||
      this._longestInteractionList.length < ft ||
      t.duration > e._latency
    ) {
      if (n)
        if (t.duration > n._latency) {
          n.entries = [t];
          n._latency = t.duration;
        } else
          t.duration === n._latency &&
            t.startTime === n.entries[0].startTime &&
            n.entries.push(t);
      else {
        n = { id: t.interactionId, entries: [t], _latency: t.duration };
        this._longestInteractionMap.set(n.id, n);
        this._longestInteractionList.push(n);
      }
      this._longestInteractionList.sort((t, e) => e._latency - t._latency);
      if (this._longestInteractionList.length > ft) {
        const t = this._longestInteractionList.splice(ft);
        for (const e of t) this._longestInteractionMap.delete(e.id);
      }
      this._onAfterProcessingINPCandidate?.(n);
    }
  }
}
const yt = (t) => {
  const e = O.requestIdleCallback || O.setTimeout;
  if (O.document?.visibilityState === "hidden") t();
  else {
    t = tt(t);
    U("visibilitychange", t, { once: true, capture: true });
    U("pagehide", t, { once: true, capture: true });
    e(() => {
      t();
      z("visibilitychange", t, { capture: true });
      z("pagehide", t, { capture: true });
    });
  }
};
const gt = [200, 500];
const _t = 40;
const vt = (t, e = {}) => {
  if (
    !(
      globalThis.PerformanceEventTiming &&
      "interactionId" in PerformanceEventTiming.prototype
    )
  )
    return;
  const n = W();
  et(() => {
    pt();
    const r = J("INP");
    let o;
    const i = Q(e, InteractionManager);
    const s = (t) => {
      yt(() => {
        for (const e of t) i._processEntry(e);
        const e = i._estimateP98LongestInteraction();
        if (e && e._latency !== r.value) {
          r.value = e._latency;
          r.entries = e.entries;
          o();
        }
      });
    };
    const c = Z("event", s, { durationThreshold: e.durationThreshold ?? _t });
    o = H(t, r, gt, e.reportAllChanges);
    if (c) {
      c.observe({ type: "first-input", buffered: true });
      n.onHidden(() => {
        s(c.takeRecords());
        o(true);
      });
    }
  });
};
class LCPEntryManager {
  _processEntry(t) {
    this._onBeforeProcessingEntry?.(t);
  }
}
const bt = [2500, 4e3];
const Tt = (t, e = {}) => {
  et(() => {
    const n = W();
    const r = J("LCP");
    let o;
    const i = Q(e, LCPEntryManager);
    const s = (t) => {
      e.reportAllChanges || (t = t.slice(-1));
      for (const e of t) {
        i._processEntry(e);
        if (e.startTime < n.firstHiddenTime) {
          r.value = Math.max(e.startTime - D(), 0);
          r.entries = [e];
          o();
        }
      }
    };
    const c = Z("largest-contentful-paint", s);
    if (c) {
      o = H(t, r, bt, e.reportAllChanges);
      const n = tt(() => {
        s(c.takeRecords());
        c.disconnect();
        o(true);
      });
      const i = (t) => {
        if (t.isTrusted) {
          yt(n);
          z(t.type, i, { capture: true });
        }
      };
      for (const t of ["keydown", "click", "visibilitychange"])
        U(t, i, { capture: true });
    }
  });
};
const St = [800, 1800];
/**
 * Runs in the next task after the page is done loading and/or prerendering.
 * @param callback
 */ const Et = (t) => {
  O.document?.prerendering
    ? et(() => Et(t))
    : O.document?.readyState !== "complete"
      ? addEventListener("load", () => Et(t), true)
      : setTimeout(t);
};
const wt = (t, e = {}) => {
  const n = J("TTFB");
  const r = H(t, n, St, e.reportAllChanges);
  Et(() => {
    const t = B();
    if (t) {
      n.value = Math.max(t.responseStart - D(), 0);
      n.entries = [t];
      r(true);
    }
  });
};
const kt = {};
const Lt = {};
let Ct;
let It;
let Pt;
let Mt;
function qt(t, e = false) {
  return Ut("cls", t, $t, Ct, e);
}
function xt(t, e = false) {
  return Ut("lcp", t, Ht, It, e);
}
function At(t) {
  return Ut("ttfb", t, Bt, Pt);
}
function Nt(t) {
  return Ut("inp", t, Dt, Mt);
}
function Rt(t, e) {
  jt(t, e);
  if (!Lt[t]) {
    zt(t);
    Lt[t] = true;
  }
  return Ft(t, e);
}
function Ot(t, r) {
  const o = kt[t];
  if (o?.length)
    for (const i of o)
      try {
        i(r);
      } catch (r) {
        R &&
          e.error(
            `Error while triggering instrumentation handler.\nType: ${t}\nName: ${n(i)}\nError:`,
            r,
          );
      }
}
function $t() {
  return it(
    (t) => {
      Ot("cls", { metric: t });
      Ct = t;
    },
    { reportAllChanges: true },
  );
}
function Ht() {
  return Tt(
    (t) => {
      Ot("lcp", { metric: t });
      It = t;
    },
    { reportAllChanges: true },
  );
}
function Bt() {
  return wt((t) => {
    Ot("ttfb", { metric: t });
    Pt = t;
  });
}
function Dt() {
  return vt((t) => {
    Ot("inp", { metric: t });
    Mt = t;
  });
}
function Ut(t, e, n, r, o = false) {
  jt(t, e);
  let i;
  if (!Lt[t]) {
    i = n();
    Lt[t] = true;
  }
  r && e({ metric: r });
  return Ft(t, e, o ? i : void 0);
}
function zt(t) {
  const e = {};
  t === "event" && (e.durationThreshold = 0);
  Z(
    t,
    (e) => {
      Ot(t, { entries: e });
    },
    e,
  );
}
function jt(t, e) {
  kt[t] = kt[t] || [];
  kt[t].push(e);
}
function Ft(t, e, n) {
  return () => {
    n && n();
    const r = kt[t];
    if (!r) return;
    const o = r.indexOf(e);
    o !== -1 && r.splice(o, 1);
  };
}
function Vt(t) {
  return "duration" in t;
}
/**
 * Sentry-specific change:
 *
 * This function's logic was NOT updated to web-vitals 4.2.4 or 5.x but we continue
 * to use the web-vitals 3.5.2 version due to having stricter browser support.
 *
 * PR with context that made the changes:
 * https://github.com/GoogleChrome/web-vitals/pull/442/files#r1530492402
 *
 * The PR removed listening to the `pagehide` event, in favour of only listening to
 * the `visibilitychange` event. This is "more correct" but some browsers we still
 * support (Safari <14.4) don't fully support `visibilitychange` or have known bugs
 * with respect to the `visibilitychange` event.
 *
 * TODO (v11): If we decide to drop support for Safari 14.4, we can use the logic
 * from web-vitals 4.2.4. In this case, we also need to update the integration tests
 * that currently trigger the `pagehide` event to simulate the page being hidden.
 *
 * @param {OnHiddenCallback} cb - Callback to be executed when the page is hidden or unloaded.
 *
 * @deprecated use `whenIdleOrHidden` or `addPageListener('visibilitychange')` instead
 */ const Yt = (t) => {
  const e = (e) => {
    (e.type !== "pagehide" && O.document?.visibilityState !== "hidden") || t(e);
  };
  U("visibilitychange", e, { capture: true, once: true });
  U("pagehide", e, { capture: true, once: true });
};
function Wt(t) {
  return typeof t === "number" && isFinite(t);
}
function Gt(t, e, n, { ...s }) {
  const c = r(t).start_timestamp;
  c && c > e && typeof t.updateStartTime === "function" && t.updateStartTime(e);
  return o(t, () => {
    const t = i({ startTime: e, ...s });
    t && t.end(n);
    return t;
  });
}
/**
 * Starts an inactive, standalone span used to send web vital values to Sentry.
 * DO NOT use this for arbitrary spans, as these spans require special handling
 * during ingestion to extract metrics.
 *
 * This function adds a bunch of attributes and data to the span that's shared
 * by all web vital standalone spans. However, you need to take care of adding
 * the actual web vital value as an event to the span. Also, you need to assign
 * a transaction name and some other values that are specific to the web vital.
 *
 * Ultimately, you also need to take care of ending the span to send it off.
 *
 * @param options
 *
 * @returns an inactive, standalone and NOT YET ended span
 */ function Xt(t) {
  const e = s();
  if (!e) return;
  const { name: n, transaction: r, attributes: o, startTime: a } = t;
  const { release: u, environment: l, sendDefaultPii: d } = e.getOptions();
  const p = e.getIntegrationByName("Replay");
  const f = p?.getReplayId();
  const m = c();
  const h = m.getUser();
  const y = h !== void 0 ? h.email || h.id || h.ip_address : void 0;
  let g;
  try {
    g = m.getScopeData().contexts.profile.profile_id;
  } catch {}
  const _ = {
    release: u,
    environment: l,
    user: y || void 0,
    profile_id: g || void 0,
    replay_id: f || void 0,
    transaction: r,
    "user_agent.original": O.navigator?.userAgent,
    "client.address": d ? "{{auto}}" : void 0,
    ...o,
  };
  return i({
    name: n,
    attributes: _,
    startTime: a,
    experimental: { standalone: true },
  });
}
function Jt() {
  return O.addEventListener && O.performance;
}
/**
 * Converts from milliseconds to seconds
 * @param time time in ms
 */ function Kt(t) {
  return t / 1e3;
}
/**
 * Converts ALPN protocol ids to name and version.
 *
 * (https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids)
 * @param nextHopProtocol PerformanceResourceTiming.nextHopProtocol
 */ function Qt(t) {
  let e = "unknown";
  let n = "unknown";
  let r = "";
  for (const o of t) {
    if (o === "/") {
      [e, n] = t.split("/");
      break;
    }
    if (!isNaN(Number(o))) {
      e = r === "h" ? "http" : r;
      n = t.split(r)[1];
      break;
    }
    r += o;
  }
  r === t && (e = r);
  return { name: e, version: n };
}
function Zt(t) {
  try {
    return PerformanceObserver.supportedEntryTypes.includes(t);
  } catch {
    return false;
  }
}
/**
 * Listens for events on which we want to collect a previously accumulated web vital value.
 * Currently, this includes:
 *
 * - pagehide (i.e. user minimizes browser window, hides tab, etc)
 * - soft navigation (we only care about the vital of the initially loaded route)
 *
 * As a "side-effect", this function will also collect the span id of the pageload span.
 *
 * @param collectorCallback the callback to be called when the first of these events is triggered. Parameters:
 * - event: the event that triggered the reporting of the web vital value.
 * - pageloadSpanId: the span id of the pageload span. This is used to link the web vital span to the pageload span.
 */ function te(t, e) {
  let n;
  let r = false;
  function o(t) {
    !r && n && e(t, n);
    r = true;
  }
  Yt(() => {
    o("pagehide");
  });
  const i = t.on("beforeStartNavigationSpan", (t, e) => {
    if (!e?.isRedirect) {
      o("navigation");
      i();
      s();
    }
  });
  const s = t.on("afterStartPageLoadSpan", (t) => {
    n = t.spanContext().spanId;
    s();
  });
}
function ee(t) {
  let e = 0;
  let n;
  if (!Zt("layout-shift")) return;
  const r = qt(({ metric: t }) => {
    const r = t.entries[t.entries.length - 1];
    if (r) {
      e = t.value;
      n = r;
    }
  }, true);
  te(t, (t, o) => {
    ne(e, n, o, t);
    r();
  });
}
function ne(t, n, r, o) {
  R && e.log(`Sending CLS span (${t})`);
  const i = n ? Kt((a() || 0) + n.startTime) : u();
  const s = c().getScopeData().transactionName;
  const y = n ? l(n.sources[0]?.node) : "Layout shift";
  const g = {
    [f]: "auto.http.browser.cls",
    [p]: "ui.webvital.cls",
    [d]: 0,
    "sentry.pageload.span_id": r,
    "sentry.report_event": o,
  };
  n?.sources &&
    n.sources.forEach((t, e) => {
      g[`cls.source.${e + 1}`] = l(t.node);
    });
  const _ = Xt({ name: y, transaction: s, attributes: g, startTime: i });
  if (_) {
    _.addEvent("cls", { [h]: "", [m]: t });
    _.end(i);
  }
}
function re(t) {
  let e = 0;
  let n;
  if (!Zt("largest-contentful-paint")) return;
  const r = xt(({ metric: t }) => {
    const r = t.entries[t.entries.length - 1];
    if (r) {
      e = t.value;
      n = r;
    }
  }, true);
  te(t, (t, o) => {
    oe(e, n, o, t);
    r();
  });
}
function oe(t, n, r, o) {
  R && e.log(`Sending LCP span (${t})`);
  const i = Kt((a() || 0) + (n?.startTime || 0));
  const s = c().getScopeData().transactionName;
  const u = n ? l(n.element) : "Largest contentful paint";
  const y = {
    [f]: "auto.http.browser.lcp",
    [p]: "ui.webvital.lcp",
    [d]: 0,
    "sentry.pageload.span_id": r,
    "sentry.report_event": o,
  };
  if (n) {
    n.element && (y["lcp.element"] = l(n.element));
    n.id && (y["lcp.id"] = n.id);
    n.url && (y["lcp.url"] = n.url);
    n.loadTime != null && (y["lcp.loadTime"] = n.loadTime);
    n.renderTime != null && (y["lcp.renderTime"] = n.renderTime);
    n.size != null && (y["lcp.size"] = n.size);
  }
  const g = Xt({ name: u, transaction: s, attributes: y, startTime: i });
  if (g) {
    g.addEvent("lcp", { [h]: "millisecond", [m]: t });
    g.end(i);
  }
}
function ie(t) {
  return t ? ((a() || performance.timeOrigin) + t) / 1e3 : t;
}
/**
 * Converts a PerformanceResourceTiming entry to span data for the resource span. Most importantly,
 * it converts the timing values from timestamps relative to the `performance.timeOrigin` to absolute timestamps
 * in seconds.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming#timestamps
 *
 * @param resourceTiming
 * @returns An array where the first element is the attribute name and the second element is the attribute value.
 */ function se(t) {
  const e = {};
  if (t.nextHopProtocol != void 0) {
    const { name: n, version: r } = Qt(t.nextHopProtocol);
    e["network.protocol.version"] = r;
    e["network.protocol.name"] = n;
  }
  return a() || Jt()?.timeOrigin
    ? ce({
        ...e,
        "http.request.redirect_start": ie(t.redirectStart),
        "http.request.redirect_end": ie(t.redirectEnd),
        "http.request.worker_start": ie(t.workerStart),
        "http.request.fetch_start": ie(t.fetchStart),
        "http.request.domain_lookup_start": ie(t.domainLookupStart),
        "http.request.domain_lookup_end": ie(t.domainLookupEnd),
        "http.request.connect_start": ie(t.connectStart),
        "http.request.secure_connection_start": ie(t.secureConnectionStart),
        "http.request.connection_end": ie(t.connectEnd),
        "http.request.request_start": ie(t.requestStart),
        "http.request.response_start": ie(t.responseStart),
        "http.request.response_end": ie(t.responseEnd),
        "http.request.time_to_first_byte":
          t.responseStart != null ? t.responseStart / 1e3 : void 0,
      })
    : e;
}
function ce(t) {
  return Object.fromEntries(Object.entries(t).filter(([, t]) => t != null));
}
const ae = 2147483647;
let ue = 0;
let le = {};
let de;
let pe;
/**
 * Start tracking web vitals.
 * The callback returned by this function can be used to stop tracking & ensure all measurements are final & captured.
 *
 * @returns A function that forces web vitals collection
 */ function fe({
  recordClsStandaloneSpans: t,
  recordLcpStandaloneSpans: e,
  client: n,
}) {
  const r = Jt();
  if (r && a()) {
    r.mark && O.performance.mark("sentry-tracing-init");
    const o = e ? re(n) : _e();
    const i = ve();
    const s = t ? ee(n) : ge();
    return () => {
      o?.();
      i();
      s?.();
    };
  }
  return () => {};
}
function me() {
  Rt("longtask", ({ entries: t }) => {
    const e = y();
    if (!e) return;
    const { op: n, start_timestamp: o } = r(e);
    for (const r of t) {
      const t = Kt(a() + r.startTime);
      const i = Kt(r.duration);
      (n === "navigation" && o && t < o) ||
        Gt(e, t, t + i, {
          name: "Main UI thread blocked",
          op: "ui.long-task",
          attributes: { [f]: "auto.ui.browser.metrics" },
        });
    }
  });
}
function he() {
  const t = new PerformanceObserver((t) => {
    const e = y();
    if (e)
      for (const n of t.getEntries()) {
        if (!n.scripts[0]) continue;
        const t = Kt(a() + n.startTime);
        const { start_timestamp: o, op: i } = r(e);
        if (i === "navigation" && o && t < o) continue;
        const s = Kt(n.duration);
        const c = { [f]: "auto.ui.browser.metrics" };
        const u = n.scripts[0];
        const {
          invoker: l,
          invokerType: d,
          sourceURL: p,
          sourceFunctionName: m,
          sourceCharPosition: h,
        } = u;
        c["browser.script.invoker"] = l;
        c["browser.script.invoker_type"] = d;
        p && (c["code.filepath"] = p);
        m && (c["code.function"] = m);
        h !== -1 && (c["browser.script.source_char_position"] = h);
        Gt(e, t, t + s, {
          name: "Main UI thread blocked",
          op: "ui.long-animation-frame",
          attributes: c,
        });
      }
  });
  t.observe({ type: "long-animation-frame", buffered: true });
}
function ye() {
  Rt("event", ({ entries: t }) => {
    const e = y();
    if (e)
      for (const n of t)
        if (n.name === "click") {
          const t = Kt(a() + n.startTime);
          const r = Kt(n.duration);
          const o = {
            name: l(n.target),
            op: `ui.interaction.${n.name}`,
            startTime: t,
            attributes: { [f]: "auto.ui.browser.metrics" },
          };
          const i = g(n.target);
          i && (o.attributes["ui.component_name"] = i);
          Gt(e, t, t + r, o);
        }
  });
}
function ge() {
  return qt(({ metric: t }) => {
    const e = t.entries[t.entries.length - 1];
    if (e) {
      le.cls = { value: t.value, unit: "" };
      pe = e;
    }
  }, true);
}
function _e() {
  return xt(({ metric: t }) => {
    const e = t.entries[t.entries.length - 1];
    if (e) {
      le.lcp = { value: t.value, unit: "millisecond" };
      de = e;
    }
  }, true);
}
function ve() {
  return At(({ metric: t }) => {
    const e = t.entries[t.entries.length - 1];
    e && (le.ttfb = { value: t.value, unit: "millisecond" });
  });
}
function be(t, e) {
  const n = Jt();
  const o = a();
  if (!n?.getEntries || !o) return;
  const i = Kt(o);
  const s = n.getEntries();
  const { op: c, start_timestamp: u } = r(t);
  s.slice(ue).forEach((n) => {
    const r = Kt(n.startTime);
    const o = Kt(Math.max(0, n.duration));
    if (!(c === "navigation" && u && i + r < u))
      switch (n.entryType) {
        case "navigation":
          we(t, n, i);
          break;
        case "mark":
        case "paint":
        case "measure": {
          Se(t, n, r, o, i, e.ignorePerformanceApiSpans);
          const s = W();
          const c = n.startTime < s.firstHiddenTime;
          n.name === "first-paint" &&
            c &&
            (le.fp = { value: n.startTime, unit: "millisecond" });
          n.name === "first-contentful-paint" &&
            c &&
            (le.fcp = { value: n.startTime, unit: "millisecond" });
          break;
        }
        case "resource":
          Ie(t, n, n.name, r, o, i, e.ignoreResourceSpans);
          break;
      }
  });
  ue = Math.max(s.length - 1, 0);
  Pe(t);
  if (c === "pageload") {
    xe(le);
    e.recordClsOnPageloadSpan || delete le.cls;
    e.recordLcpOnPageloadSpan || delete le.lcp;
    Object.entries(le).forEach(([t, e]) => {
      _(t, e.value, e.unit);
    });
    t.setAttribute("performance.timeOrigin", i);
    t.setAttribute("performance.activationStart", D());
    Me(t, e);
  }
  de = void 0;
  pe = void 0;
  le = {};
}
function Te(t) {
  if (t?.entryType === "measure")
    try {
      return t.detail.devtools.track === "Components ⚛";
    } catch {
      return;
    }
}
function Se(t, e, n, r, o, i) {
  if (Te(e)) return;
  if (["mark", "measure"].includes(e.entryType) && v(e.name, i)) return;
  const s = B(false);
  const c = Kt(s ? s.requestStart : 0);
  const a = o + Math.max(n, c);
  const u = o + n;
  const l = u + r;
  const d = { [f]: "auto.resource.browser.metrics" };
  if (a !== u) {
    d["sentry.browser.measure_happened_before_request"] = true;
    d["sentry.browser.measure_start_time"] = a;
  }
  Ee(d, e);
  a <= l && Gt(t, a, l, { name: e.name, op: e.entryType, attributes: d });
}
function Ee(t, e) {
  try {
    const n = e.detail;
    if (!n) return;
    if (typeof n === "object") {
      for (const [e, r] of Object.entries(n))
        if (r && b(r)) t[`sentry.browser.measure.detail.${e}`] = r;
        else if (r !== void 0)
          try {
            t[`sentry.browser.measure.detail.${e}`] = JSON.stringify(r);
          } catch {}
      return;
    }
    if (b(n)) {
      t["sentry.browser.measure.detail"] = n;
      return;
    }
    try {
      t["sentry.browser.measure.detail"] = JSON.stringify(n);
    } catch {}
  } catch {}
}
function we(t, e, n) {
  [
    "unloadEvent",
    "redirect",
    "domContentLoadedEvent",
    "loadEvent",
    "connect",
  ].forEach((r) => {
    ke(t, e, r, n);
  });
  ke(t, e, "secureConnection", n, "TLS/SSL");
  ke(t, e, "fetch", n, "cache");
  ke(t, e, "domainLookup", n, "DNS");
  Ce(t, e, n);
}
function ke(t, e, n, r, o = n) {
  const i = Le(n);
  const s = e[i];
  const c = e[`${n}Start`];
  c &&
    s &&
    Gt(t, r + Kt(c), r + Kt(s), {
      op: `browser.${o}`,
      name: e.name,
      attributes: {
        [f]: "auto.ui.browser.metrics",
        ...(n === "redirect" && e.redirectCount != null
          ? { "http.redirect_count": e.redirectCount }
          : {}),
      },
    });
}
function Le(t) {
  return t === "secureConnection"
    ? "connectEnd"
    : t === "fetch"
      ? "domainLookupStart"
      : `${t}End`;
}
function Ce(t, e, n) {
  const r = n + Kt(e.requestStart);
  const o = n + Kt(e.responseEnd);
  const i = n + Kt(e.responseStart);
  if (e.responseEnd) {
    Gt(t, r, o, {
      op: "browser.request",
      name: e.name,
      attributes: { [f]: "auto.ui.browser.metrics" },
    });
    Gt(t, i, o, {
      op: "browser.response",
      name: e.name,
      attributes: { [f]: "auto.ui.browser.metrics" },
    });
  }
}
function Ie(t, e, n, r, o, i, s) {
  if (e.initiatorType === "xmlhttprequest" || e.initiatorType === "fetch")
    return;
  const c = e.initiatorType ? `resource.${e.initiatorType}` : "resource.other";
  if (s?.includes(c)) return;
  const a = { [f]: "auto.resource.browser.metrics" };
  const u = T(n);
  u.protocol && (a["url.scheme"] = u.protocol.split(":").pop());
  u.host && (a["server.address"] = u.host);
  a["url.same_origin"] = n.includes(O.location.origin);
  qe(e, a, [
    ["responseStatus", "http.response.status_code"],
    ["transferSize", "http.response_transfer_size"],
    ["encodedBodySize", "http.response_content_length"],
    ["decodedBodySize", "http.decoded_response_content_length"],
    ["renderBlockingStatus", "resource.render_blocking_status"],
    ["deliveryType", "http.response_delivery_type"],
  ]);
  const l = { ...a, ...se(e) };
  const d = i + r;
  const p = d + o;
  Gt(t, d, p, { name: n.replace(O.location.origin, ""), op: c, attributes: l });
}
function Pe(t) {
  const e = O.navigator;
  if (!e) return;
  const n = e.connection;
  if (n) {
    n.effectiveType &&
      t.setAttribute("effectiveConnectionType", n.effectiveType);
    n.type && t.setAttribute("connectionType", n.type);
    Wt(n.rtt) && (le["connection.rtt"] = { value: n.rtt, unit: "millisecond" });
  }
  Wt(e.deviceMemory) && t.setAttribute("deviceMemory", `${e.deviceMemory} GB`);
  Wt(e.hardwareConcurrency) &&
    t.setAttribute("hardwareConcurrency", String(e.hardwareConcurrency));
}
function Me(t, e) {
  if (de && e.recordLcpOnPageloadSpan) {
    de.element && t.setAttribute("lcp.element", l(de.element));
    de.id && t.setAttribute("lcp.id", de.id);
    de.url && t.setAttribute("lcp.url", de.url.trim().slice(0, 200));
    de.loadTime != null && t.setAttribute("lcp.loadTime", de.loadTime);
    de.renderTime != null && t.setAttribute("lcp.renderTime", de.renderTime);
    t.setAttribute("lcp.size", de.size);
  }
  pe?.sources &&
    e.recordClsOnPageloadSpan &&
    pe.sources.forEach((e, n) =>
      t.setAttribute(`cls.source.${n + 1}`, l(e.node)),
    );
}
function qe(t, e, n) {
  n.forEach(([n, r]) => {
    const o = t[n];
    o != null &&
      ((typeof o === "number" && o < ae) || typeof o === "string") &&
      (e[r] = o);
  });
}
function xe(t) {
  const e = B(false);
  if (!e) return;
  const { responseStart: n, requestStart: r } = e;
  r <= n && (t["ttfb.requestTime"] = { value: n - r, unit: "millisecond" });
}
function Ae() {
  const t = Jt();
  return t && a() ? Rt("element", Ne) : () => {};
}
const Ne = ({ entries: t }) => {
  const e = y();
  const n = e ? S(e) : void 0;
  const o = n ? r(n).description : c().getScopeData().transactionName;
  t.forEach((t) => {
    const e = t;
    if (!e.identifier) return;
    const n = e.name;
    const r = e.renderTime;
    const i = e.loadTime;
    const [s, c] = i
      ? [Kt(i), "load-time"]
      : r
        ? [Kt(r), "render-time"]
        : [u(), "entry-emission"];
    const a = n === "image-paint" ? Kt(Math.max(0, (r ?? 0) - (i ?? 0))) : 0;
    const l = {
      [f]: "auto.ui.browser.elementtiming",
      [p]: "ui.elementtiming",
      [E]: "component",
      "sentry.span_start_time_source": c,
      "sentry.transaction_name": o,
      "element.id": e.id,
      "element.type": e.element?.tagName?.toLowerCase() || "unknown",
      "element.size":
        e.naturalWidth && e.naturalHeight
          ? `${e.naturalWidth}x${e.naturalHeight}`
          : void 0,
      "element.render_time": r,
      "element.load_time": i,
      "element.url": e.url || void 0,
      "element.identifier": e.identifier,
      "element.paint_type": n,
    };
    w(
      {
        name: `element[${e.identifier}]`,
        attributes: l,
        startTime: s,
        onlyIfParent: true,
      },
      (t) => {
        t.end(s + a);
      },
    );
  });
};
const Re = 1e3;
let Oe;
let $e;
let He;
function Be(t) {
  const e = "dom";
  k(e, t);
  L(e, De);
}
function De() {
  if (!O.document) return;
  const t = C.bind(null, "dom");
  const e = je(t, true);
  O.document.addEventListener("click", e, false);
  O.document.addEventListener("keypress", e, false);
  ["EventTarget", "Node"].forEach((e) => {
    const n = O;
    const r = n[e]?.prototype;
    if (r?.hasOwnProperty?.("addEventListener")) {
      I(r, "addEventListener", function (e) {
        return function (n, r, o) {
          if (n === "click" || n == "keypress")
            try {
              const r = (this.__sentry_instrumentation_handlers__ =
                this.__sentry_instrumentation_handlers__ || {});
              const i = (r[n] = r[n] || { refCount: 0 });
              if (!i.handler) {
                const r = je(t);
                i.handler = r;
                e.call(this, n, r, o);
              }
              i.refCount++;
            } catch {}
          return e.call(this, n, r, o);
        };
      });
      I(r, "removeEventListener", function (t) {
        return function (e, n, r) {
          if (e === "click" || e == "keypress")
            try {
              const n = this.__sentry_instrumentation_handlers__ || {};
              const o = n[e];
              if (o) {
                o.refCount--;
                if (o.refCount <= 0) {
                  t.call(this, e, o.handler, r);
                  o.handler = void 0;
                  delete n[e];
                }
                Object.keys(n).length === 0 &&
                  delete this.__sentry_instrumentation_handlers__;
              }
            } catch {}
          return t.call(this, e, n, r);
        };
      });
    }
  });
}
function Ue(t) {
  if (t.type !== $e) return false;
  try {
    if (!t.target || t.target._sentryId !== He) return false;
  } catch {}
  return true;
}
/**
 * Decide whether an event should be captured.
 * @param event event to be captured
 */ function ze(t, e) {
  return (
    t === "keypress" &&
    (!e?.tagName ||
      (e.tagName !== "INPUT" &&
        e.tagName !== "TEXTAREA" &&
        !e.isContentEditable))
  );
}
function je(t, e = false) {
  return (n) => {
    if (!n || n._sentryCaptured) return;
    const r = Fe(n);
    if (ze(n.type, r)) return;
    P(n, "_sentryCaptured", true);
    r && !r._sentryId && P(r, "_sentryId", M());
    const o = n.type === "keypress" ? "input" : n.type;
    if (!Ue(n)) {
      const i = { event: n, name: o, global: e };
      t(i);
      $e = n.type;
      He = r ? r._sentryId : void 0;
    }
    clearTimeout(Oe);
    Oe = O.setTimeout(() => {
      He = void 0;
      $e = void 0;
    }, Re);
  };
}
function Fe(t) {
  try {
    return t.target;
  } catch {
    return null;
  }
}
let Ve;
function Ye(t) {
  const e = "history";
  k(e, t);
  L(e, We);
}
function We() {
  O.addEventListener("popstate", () => {
    const t = O.location.href;
    const e = Ve;
    Ve = t;
    if (e === t) return;
    const n = { from: e, to: t };
    C("history", n);
  });
  if (q()) {
    I(O.history, "pushState", t);
    I(O.history, "replaceState", t);
  }
  function t(t) {
    return function (...e) {
      const n = e.length > 2 ? e[2] : void 0;
      if (n) {
        const r = Ve;
        const o = Ge(String(n));
        Ve = o;
        if (r === o) return t.apply(this, e);
        const i = { from: r, to: o };
        C("history", i);
      }
      return t.apply(this, e);
    };
  }
}
function Ge(t) {
  try {
    const e = new URL(t, O.location.origin);
    return e.toString();
  } catch {
    return t;
  }
}
const Xe = {};
function Je(t) {
  const n = Xe[t];
  if (n) return n;
  let r = O[t];
  if (x(r)) return (Xe[t] = r.bind(O));
  const o = O.document;
  if (o && typeof o.createElement === "function")
    try {
      const e = o.createElement("iframe");
      e.hidden = true;
      o.head.appendChild(e);
      const n = e.contentWindow;
      n?.[t] && (r = n[t]);
      o.head.removeChild(e);
    } catch (n) {
      R &&
        e.warn(
          `Could not create sandbox iframe for ${t} check, bailing to window.${t}: `,
          n,
        );
    }
  return r ? (Xe[t] = r.bind(O)) : r;
}
function Ke(t) {
  Xe[t] = void 0;
}
function Qe(...t) {
  return Je("fetch")(...t);
}
function Ze(...t) {
  return Je("setTimeout")(...t);
}
const tn = "__sentry_xhr_v3__";
function en(t) {
  const e = "xhr";
  k(e, t);
  L(e, nn);
}
function nn() {
  if (!O.XMLHttpRequest) return;
  const t = XMLHttpRequest.prototype;
  t.open = new Proxy(t.open, {
    apply(t, e, n) {
      const r = new Error();
      const o = u() * 1e3;
      const i = A(n[0]) ? n[0].toUpperCase() : void 0;
      const s = rn(n[1]);
      if (!i || !s) return t.apply(e, n);
      e[tn] = { method: i, url: s, request_headers: {} };
      i === "POST" &&
        s.match(/sentry_key/) &&
        (e.__sentry_own_request__ = true);
      const c = () => {
        const t = e[tn];
        if (t && e.readyState === 4) {
          try {
            t.status_code = e.status;
          } catch {}
          const n = {
            endTimestamp: u() * 1e3,
            startTimestamp: o,
            xhr: e,
            virtualError: r,
          };
          C("xhr", n);
        }
      };
      "onreadystatechange" in e && typeof e.onreadystatechange === "function"
        ? (e.onreadystatechange = new Proxy(e.onreadystatechange, {
            apply(t, e, n) {
              c();
              return t.apply(e, n);
            },
          }))
        : e.addEventListener("readystatechange", c);
      e.setRequestHeader = new Proxy(e.setRequestHeader, {
        apply(t, e, n) {
          const [r, o] = n;
          const i = e[tn];
          i && A(r) && A(o) && (i.request_headers[r.toLowerCase()] = o);
          return t.apply(e, n);
        },
      });
      return t.apply(e, n);
    },
  });
  t.send = new Proxy(t.send, {
    apply(t, e, n) {
      const r = e[tn];
      if (!r) return t.apply(e, n);
      n[0] !== void 0 && (r.body = n[0]);
      const o = { startTimestamp: u() * 1e3, xhr: e };
      C("xhr", o);
      return t.apply(e, n);
    },
  });
}
/**
 * Parses the URL argument of a XHR method to a string.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open#url
 * url: A string or any other object with a stringifier — including a URL object — that provides the URL of the resource to send the request to.
 *
 * @param url - The URL argument of an XHR method
 * @returns The parsed URL string or undefined if the URL is invalid
 */ function rn(t) {
  if (A(t)) return t;
  try {
    return t.toString();
  } catch {}
}
const on = Symbol.for("sentry__originalRequestBody");
function sn(t) {
  return new URLSearchParams(t).toString();
}
function cn(t, n = e) {
  try {
    if (typeof t === "string") return [t];
    if (t instanceof URLSearchParams) return [t.toString()];
    if (t instanceof FormData) return [sn(t)];
    if (!t) return [void 0];
  } catch (e) {
    R && n.error(e, "Failed to serialize body", t);
    return [void 0, "BODY_PARSE_ERROR"];
  }
  R && n.log("Skipping network body because of body type", t);
  return [void 0, "UNPARSEABLE_BODY_TYPE"];
}
function an(t = []) {
  if (t.length >= 2 && t[1] && typeof t[1] === "object" && "body" in t[1])
    return t[1].body;
  if (t.length >= 1 && t[0] instanceof Request) {
    const e = t[0];
    const n = e[on];
    return n !== void 0 ? n : void 0;
  }
}
function un(t) {
  let n;
  try {
    n = t.getAllResponseHeaders();
  } catch (n) {
    R && e.error(n, "Failed to get xhr response headers", t);
    return {};
  }
  return n
    ? n.split("\r\n").reduce((t, e) => {
        const [n, r] = e.split(": ");
        r && (t[n.toLowerCase()] = r);
        return t;
      }, {})
    : {};
}
const ln = [];
const dn = new Map();
const pn = new Map();
const fn = 60;
function mn() {
  const t = Jt();
  if (t && a()) {
    const t = yn();
    return () => {
      t();
    };
  }
  return () => {};
}
const hn = {
  click: "click",
  pointerdown: "click",
  pointerup: "click",
  mousedown: "click",
  mouseup: "click",
  touchstart: "click",
  touchend: "click",
  mouseover: "hover",
  mouseout: "hover",
  mouseenter: "hover",
  mouseleave: "hover",
  pointerover: "hover",
  pointerout: "hover",
  pointerenter: "hover",
  pointerleave: "hover",
  dragstart: "drag",
  dragend: "drag",
  drag: "drag",
  dragenter: "drag",
  dragleave: "drag",
  dragover: "drag",
  drop: "drag",
  keydown: "press",
  keyup: "press",
  keypress: "press",
  input: "press",
};
function yn() {
  return Nt(gn);
}
const gn = ({ metric: t }) => {
  if (t.value == void 0) return;
  const e = Kt(t.value);
  if (e > fn) return;
  const n = t.entries.find((e) => e.duration === t.value && hn[e.name]);
  if (!n) return;
  const { interactionId: o } = n;
  const i = hn[n.name];
  const s = Kt(a() + n.startTime);
  const u = y();
  const g = u ? S(u) : void 0;
  const _ = o != null ? dn.get(o) : void 0;
  const v = _?.span || g;
  const b = v ? r(v).description : c().getScopeData().transactionName;
  const T = _?.elementName || l(n.target);
  const E = {
    [f]: "auto.http.browser.inp",
    [p]: `ui.interaction.${i}`,
    [d]: n.duration,
  };
  const w = Xt({ name: T, transaction: b, attributes: E, startTime: s });
  if (w) {
    w.addEvent("inp", { [h]: "millisecond", [m]: t.value });
    w.end(s + e);
  }
};
function _n() {
  const t = Object.keys(hn);
  N() &&
    t.forEach((t) => {
      O.addEventListener(t, e, { capture: true, passive: true });
    });
  function e(t) {
    const e = t.target;
    if (!e) return;
    const n = l(e);
    const r = Math.round(t.timeStamp);
    pn.set(r, n);
    if (pn.size > 50) {
      const t = pn.keys().next().value;
      t !== void 0 && pn.delete(t);
    }
  }
  function n(t) {
    const e = Math.round(t.startTime);
    let n = pn.get(e);
    if (!n)
      for (let t = -5; t <= 5; t++) {
        const r = pn.get(e + t);
        if (r) {
          n = r;
          break;
        }
      }
    return n || "<unknown>";
  }
  const r = ({ entries: t }) => {
    const e = y();
    const r = e && S(e);
    t.forEach((t) => {
      if (!Vt(t)) return;
      const e = t.interactionId;
      if (e == null) return;
      if (dn.has(e)) return;
      const o = t.target ? l(t.target) : n(t);
      if (ln.length > 10) {
        const t = ln.shift();
        dn.delete(t);
      }
      ln.push(e);
      dn.set(e, { span: r, elementName: o });
    });
  };
  Rt("event", r);
  Rt("first-input", r);
}
export {
  tn as SENTRY_XHR_DATA_KEY,
  Be as addClickKeypressInstrumentationHandler,
  qt as addClsInstrumentationHandler,
  Ye as addHistoryInstrumentationHandler,
  Nt as addInpInstrumentationHandler,
  xt as addLcpInstrumentationHandler,
  be as addPerformanceEntries,
  Rt as addPerformanceInstrumentationHandler,
  At as addTtfbInstrumentationHandler,
  en as addXhrInstrumentationHandler,
  Ke as clearCachedImplementation,
  Qt as extractNetworkProtocol,
  Qe as fetch,
  cn as getBodyString,
  an as getFetchRequestArgBody,
  Je as getNativeImplementation,
  un as parseXhrResponseHeaders,
  _n as registerInpInteractionListener,
  se as resourceTimingToSpanAttributes,
  sn as serializeFormData,
  Ze as setTimeout,
  Ae as startTrackingElementTiming,
  mn as startTrackingINP,
  ye as startTrackingInteractions,
  he as startTrackingLongAnimationFrames,
  me as startTrackingLongTasks,
  fe as startTrackingWebVitals,
};
