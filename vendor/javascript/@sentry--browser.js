// @sentry/browser@10.30.0 downloaded from https://ga.jspm.io/npm:@sentry/browser@10.30.0/build/npm/esm/prod/index.js

import {
  buildFeedbackIntegration as e,
  feedbackScreenshotIntegration as t,
  feedbackModalIntegration as n,
} from "@sentry-internal/feedback";
export { getFeedback, sendFeedback } from "@sentry-internal/feedback";
import {
  GLOBAL_OBJ as r,
  getOriginalFunction as o,
  withScope as s,
  addExceptionTypeValue as i,
  addExceptionMechanism as a,
  captureException as c,
  markFunctionWrapped as l,
  addNonEnumerableProperty as u,
  getLocationHref as f,
  getClient as p,
  SDK_VERSION as d,
  normalizeToSize as g,
  isEvent as m,
  resolvedSyncPromise as h,
  isErrorEvent as y,
  isDOMError as v,
  isDOMException as _,
  isError as b,
  isPlainObject as S,
  isParameterizedString as w,
  extractExceptionKeysForMessage as P,
  Client as k,
  getSDKSource as T,
  applySdkMetadata as E,
  _INTERNAL_flushLogsBuffer as R,
  _INTERNAL_flushMetricsBuffer as I,
  addAutoIpAddressToSession as x,
  createTransport as C,
  makePromiseBuffer as L,
  debug as O,
  UNKNOWN_FUNCTION as A,
  createStackParser as $,
  dsnToString as D,
  createEnvelope as q,
  addConsoleInstrumentationHandler as M,
  addFetchInstrumentationHandler as N,
  defineIntegration as F,
  addBreadcrumb as H,
  getEventDescription as j,
  htmlTreeAsString as U,
  getComponentName as B,
  safeJoin as z,
  severityLevelFromString as W,
  getBreadcrumbLogLevelFromHttpStatusCode as G,
  parseUrl as X,
  fill as K,
  getFunctionName as Y,
  startSession as V,
  captureSession as J,
  addGlobalErrorInstrumentationHandler as Q,
  captureEvent as Z,
  addGlobalUnhandledRejectionInstrumentationHandler as ee,
  isPrimitive as te,
  isString as ne,
  applyAggregateErrorsToEvent as re,
  serializeEnvelope as oe,
  consoleSandbox as se,
  inboundFiltersIntegration as ie,
  functionToStringIntegration as ae,
  dedupeIntegration as ce,
  getIntegrationsToSetup as le,
  stackParserFromStackParserOptions as ue,
  initAndBind as fe,
  getCurrentScope as pe,
  lastEventId as de,
  getReportDialogEndpoint as ge,
  captureMessage as me,
  supportsReportingObserver as he,
  supportsNativeFetch as ye,
  isSentryRequestUrl as ve,
  stripUrlQueryAndFragment as _e,
  addContextToFrame as be,
  spanToJSON as Se,
  SEMANTIC_ATTRIBUTE_SENTRY_OP as we,
  SEMANTIC_ATTRIBUTE_URL_FULL as Pe,
  SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD as ke,
  stringMatchesSomePattern as Te,
  addFetchEndInstrumentationHandler as Ee,
  instrumentFetchRequest as Re,
  hasSpansEnabled as Ie,
  setHttpStatus as xe,
  getActiveSpan as Ce,
  startInactiveSpan as Le,
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN as Oe,
  SentryNonRecordingSpan as Ae,
  getTraceData as $e,
  getRootSpan as De,
  SPAN_STATUS_ERROR as qe,
  SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE as Me,
  SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE as Ne,
  SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE as Fe,
  TRACING_DEFAULTS as He,
  SEMANTIC_ATTRIBUTE_SENTRY_SOURCE as je,
  dateTimestampInSeconds as Ue,
  startIdleSpan as Be,
  getDynamicSamplingContextFromSpan as ze,
  spanIsSampled as We,
  browserPerformanceTimeOrigin as Ge,
  parseStringToURLObject as Xe,
  registerSpanErrorInstrumentation as Ke,
  timestampInSeconds as Ye,
  SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON as Ve,
  getIsolationScope as Je,
  generateSpanId as Qe,
  generateTraceId as Ze,
  propagationContextFromHeaders as et,
  _INTERNAL_setSpanForScope as tt,
  parseEnvelope as nt,
  makeOfflineTransport as rt,
  uuid4 as ot,
  DEFAULT_ENVIRONMENT as st,
  forEachEnvelopeItem as it,
  getDebugImagesForResources as at,
  getGlobalScope as ct,
  getSdkMetadataForEnvelopeHeader as lt,
  _INTERNAL_copyFlagsFromScopeToEvent as ut,
  _INTERNAL_insertFlagToScope as ft,
  _INTERNAL_addFeatureFlagToActiveSpan as pt,
  growthbookIntegration as dt,
  suppressTracing as gt,
} from "@sentry/core";
export {
  MULTIPLEXED_TRANSPORT_EXTRA_KEY,
  SDK_VERSION,
  SEMANTIC_ATTRIBUTE_SENTRY_OP,
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE,
  SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  Scope,
  addBreadcrumb,
  addEventProcessor,
  addIntegration,
  captureConsoleIntegration,
  captureEvent,
  captureException,
  captureFeedback,
  captureMessage,
  captureSession,
  close,
  consoleLoggingIntegration,
  continueTrace,
  createConsolaReporter,
  createLangChainCallbackHandler,
  createTransport,
  dedupeIntegration,
  endSession,
  eventFiltersIntegration,
  extraErrorDataIntegration,
  featureFlagsIntegration,
  flush,
  functionToStringIntegration,
  getActiveSpan,
  getClient,
  getCurrentScope,
  getGlobalScope,
  getIsolationScope,
  getRootSpan,
  getSpanDescendants,
  getSpanStatusFromHttpCode,
  getTraceData,
  inboundFiltersIntegration,
  instrumentAnthropicAiClient,
  instrumentGoogleGenAIClient,
  instrumentLangGraph,
  instrumentOpenAiClient,
  instrumentSupabaseClient,
  isEnabled,
  isInitialized,
  lastEventId,
  logger,
  makeMultiplexedTransport,
  metrics,
  moduleMetadataIntegration,
  parameterize,
  registerSpanErrorInstrumentation,
  rewriteFramesIntegration,
  setContext,
  setCurrentClient,
  setExtra,
  setExtras,
  setHttpStatus,
  setMeasurement,
  setTag,
  setTags,
  setUser,
  spanToBaggageHeader,
  spanToJSON,
  spanToTraceHeader,
  startInactiveSpan,
  startNewTrace,
  startSession,
  startSpan,
  startSpanManual,
  supabaseIntegration,
  suppressTracing,
  thirdPartyErrorFilterIntegration,
  updateSpanName,
  withActiveSpan,
  withIsolationScope,
  withScope,
  zodErrorsIntegration,
} from "@sentry/core";
import {
  getNativeImplementation as mt,
  clearCachedImplementation as ht,
  addClickKeypressInstrumentationHandler as yt,
  addXhrInstrumentationHandler as vt,
  addHistoryInstrumentationHandler as _t,
  SENTRY_XHR_DATA_KEY as bt,
  getBodyString as St,
  getFetchRequestArgBody as wt,
  addPerformanceInstrumentationHandler as Pt,
  resourceTimingToSpanAttributes as kt,
  parseXhrResponseHeaders as Tt,
  addPerformanceEntries as Et,
  registerInpInteractionListener as Rt,
  startTrackingWebVitals as It,
  startTrackingINP as xt,
  startTrackingElementTiming as Ct,
  startTrackingLongAnimationFrames as Lt,
  startTrackingLongTasks as Ot,
  startTrackingInteractions as At,
} from "@sentry-internal/browser-utils";
export { getReplay, replayIntegration } from "@sentry-internal/replay";
export { replayCanvasIntegration } from "@sentry-internal/replay-canvas";
const $t = r;
let Dt = 0;
function qt() {
  return Dt > 0;
}
function Mt() {
  Dt++;
  setTimeout(() => {
    Dt--;
  });
}
/**
 * Instruments the given function and sends an event to Sentry every time the
 * function throws an exception.
 *
 * @param fn A function to wrap. It is generally safe to pass an unbound function, because the returned wrapper always
 * has a correct `this` context.
 * @returns The wrapped function.
 * @hidden
 */ function Nt(e, t = {}) {
  function n(e) {
    return typeof e === "function";
  }
  if (!n(e)) return e;
  try {
    const t = e.__sentry_wrapped__;
    if (t) return typeof t === "function" ? t : e;
    if (o(e)) return e;
  } catch {
    return e;
  }
  const r = function (...n) {
    try {
      const r = n.map((e) => Nt(e, t));
      return e.apply(this, r);
    } catch (e) {
      Mt();
      s((r) => {
        r.addEventProcessor((e) => {
          if (t.mechanism) {
            i(e, void 0, void 0);
            a(e, t.mechanism);
          }
          e.extra = { ...e.extra, arguments: n };
          return e;
        });
        c(e);
      });
      throw e;
    }
  };
  try {
    for (const t in e)
      Object.prototype.hasOwnProperty.call(e, t) && (r[t] = e[t]);
  } catch {}
  l(r, e);
  u(e, "__sentry_wrapped__", r);
  try {
    const t = Object.getOwnPropertyDescriptor(r, "name");
    t.configurable &&
      Object.defineProperty(r, "name", {
        get() {
          return e.name;
        },
      });
  } catch {}
  return r;
}
function Ft() {
  const e = f();
  const { referrer: t } = $t.document || {};
  const { userAgent: n } = $t.navigator || {};
  const r = { ...(t && { Referer: t }), ...(n && { "User-Agent": n }) };
  const o = { url: e, headers: r };
  return o;
}
const Ht = {
  replayIntegration: "replay",
  replayCanvasIntegration: "replay-canvas",
  feedbackIntegration: "feedback",
  feedbackModalIntegration: "feedback-modal",
  feedbackScreenshotIntegration: "feedback-screenshot",
  captureConsoleIntegration: "captureconsole",
  contextLinesIntegration: "contextlines",
  linkedErrorsIntegration: "linkederrors",
  dedupeIntegration: "dedupe",
  extraErrorDataIntegration: "extraerrordata",
  graphqlClientIntegration: "graphqlclient",
  httpClientIntegration: "httpclient",
  reportingObserverIntegration: "reportingobserver",
  rewriteFramesIntegration: "rewriteframes",
  browserProfilingIntegration: "browserprofiling",
  moduleMetadataIntegration: "modulemetadata",
  instrumentAnthropicAiClient: "instrumentanthropicaiclient",
  instrumentOpenAiClient: "instrumentopenaiclient",
  instrumentGoogleGenAIClient: "instrumentgooglegenaiclient",
  instrumentLangGraph: "instrumentlanggraph",
  createLangChainCallbackHandler: "createlangchaincallbackhandler",
};
const jt = $t;
async function Ut(e, t) {
  const n = Ht[e];
  const r = (jt.Sentry = jt.Sentry || {});
  if (!n) throw new Error(`Cannot lazy load integration: ${e}`);
  const o = r[e];
  if (typeof o === "function" && !("_isShim" in o)) return o;
  const s = Bt(n);
  const i = $t.document.createElement("script");
  i.src = s;
  i.crossOrigin = "anonymous";
  i.referrerPolicy = "strict-origin";
  t && i.setAttribute("nonce", t);
  const a = new Promise((e, t) => {
    i.addEventListener("load", () => e());
    i.addEventListener("error", t);
  });
  const c = $t.document.currentScript;
  const l = $t.document.body || $t.document.head || c?.parentElement;
  if (!l)
    throw new Error(
      `Could not find parent element to insert lazy-loaded ${e} script`,
    );
  l.appendChild(i);
  try {
    await a;
  } catch {
    throw new Error(`Error when loading integration: ${e}`);
  }
  const u = r[e];
  if (typeof u !== "function")
    throw new Error(`Could not load integration: ${e}`);
  return u;
}
function Bt(e) {
  const t = p();
  const n = t?.getOptions()?.cdnBaseUrl || "https://browser.sentry-cdn.com";
  return new URL(`/${d}/${e}.min.js`, n).toString();
}
const zt = e({ lazyLoadIntegration: Ut });
const Wt = e({
  getModalIntegration: () => n,
  getScreenshotIntegration: () => t,
});
function Gt(e, t) {
  const n = Yt(e, t);
  const r = { type: en(t), value: tn(t) };
  n.length && (r.stacktrace = { frames: n });
  r.type === void 0 &&
    r.value === "" &&
    (r.value = "Unrecoverable error caught");
  return r;
}
function Xt(e, t, n, r) {
  const o = p();
  const s = o?.getOptions().normalizeDepth;
  const i = ln(t);
  const a = { __serialized__: g(t, s) };
  if (i) return { exception: { values: [Gt(e, i)] }, extra: a };
  const c = {
    exception: {
      values: [
        {
          type: m(t) ? t.constructor.name : r ? "UnhandledRejection" : "Error",
          value: an(t, { isUnhandledRejection: r }),
        },
      ],
    },
    extra: a,
  };
  if (n) {
    const t = Yt(e, n);
    t.length && (c.exception.values[0].stacktrace = { frames: t });
  }
  return c;
}
function Kt(e, t) {
  return { exception: { values: [Gt(e, t)] } };
}
function Yt(e, t) {
  const n = t.stacktrace || t.stack || "";
  const r = Jt(t);
  const o = Qt(t);
  try {
    return e(n, r, o);
  } catch {}
  return [];
}
const Vt = /Minified React error #\d+;/i;
function Jt(e) {
  return e && Vt.test(e.message) ? 1 : 0;
}
function Qt(e) {
  return typeof e.framesToPop === "number" ? e.framesToPop : 0;
}
function Zt(e) {
  return (
    typeof WebAssembly !== "undefined" &&
    typeof WebAssembly.Exception !== "undefined" &&
    e instanceof WebAssembly.Exception
  );
}
function en(e) {
  const t = e?.name;
  if (!t && Zt(e)) {
    const t = e.message && Array.isArray(e.message) && e.message.length == 2;
    return t ? e.message[0] : "WebAssembly.Exception";
  }
  return t;
}
function tn(e) {
  const t = e?.message;
  return Zt(e)
    ? Array.isArray(e.message) && e.message.length == 2
      ? e.message[1]
      : "wasm exception"
    : t
      ? t.error && typeof t.error.message === "string"
        ? t.error.message
        : t
      : "No error message";
}
function nn(e, t, n, r) {
  const o = n?.syntheticException || void 0;
  const s = on(e, t, o, r);
  a(s);
  s.level = "error";
  n?.event_id && (s.event_id = n.event_id);
  return h(s);
}
function rn(e, t, n = "info", r, o) {
  const s = r?.syntheticException || void 0;
  const i = sn(e, t, s, o);
  i.level = n;
  r?.event_id && (i.event_id = r.event_id);
  return h(i);
}
function on(e, t, n, r, o) {
  let s;
  if (y(t) && t.error) {
    const n = t;
    return Kt(e, n.error);
  }
  if (v(t) || _(t)) {
    const o = t;
    if ("stack" in t) s = Kt(e, t);
    else {
      const t = o.name || (v(o) ? "DOMError" : "DOMException");
      const a = o.message ? `${t}: ${o.message}` : t;
      s = sn(e, a, n, r);
      i(s, a);
    }
    "code" in o && (s.tags = { ...s.tags, "DOMException.code": `${o.code}` });
    return s;
  }
  if (b(t)) return Kt(e, t);
  if (S(t) || m(t)) {
    const r = t;
    s = Xt(e, r, n, o);
    a(s, { synthetic: true });
    return s;
  }
  s = sn(e, t, n, r);
  i(s, `${t}`, void 0);
  a(s, { synthetic: true });
  return s;
}
function sn(e, t, n, r) {
  const o = {};
  if (r && n) {
    const r = Yt(e, n);
    r.length &&
      (o.exception = { values: [{ value: t, stacktrace: { frames: r } }] });
    a(o, { synthetic: true });
  }
  if (w(t)) {
    const { __sentry_template_string__: e, __sentry_template_values__: n } = t;
    o.logentry = { message: e, params: n };
    return o;
  }
  o.message = t;
  return o;
}
function an(e, { isUnhandledRejection: t }) {
  const n = P(e);
  const r = t ? "promise rejection" : "exception";
  if (y(e))
    return `Event \`ErrorEvent\` captured as ${r} with message \`${e.message}\``;
  if (m(e)) {
    const t = cn(e);
    return `Event \`${t}\` (type=${e.type}) captured as ${r}`;
  }
  return `Object captured as ${r} with keys: ${n}`;
}
function cn(e) {
  try {
    const t = Object.getPrototypeOf(e);
    return t ? t.constructor.name : void 0;
  } catch {}
}
function ln(e) {
  for (const t in e)
    if (Object.prototype.hasOwnProperty.call(e, t)) {
      const n = e[t];
      if (n instanceof Error) return n;
    }
}
class BrowserClient extends k {
  /**
   * Creates a new Browser SDK instance.
   *
   * @param options Configuration options for this SDK.
   */
  constructor(e) {
    const t = un(e);
    const n = $t.SENTRY_SDK_SOURCE || T();
    E(t, "browser", ["browser"], n);
    t._metadata?.sdk &&
      (t._metadata.sdk.settings = {
        infer_ip: t.sendDefaultPii ? "auto" : "never",
        ...t._metadata.sdk.settings,
      });
    super(t);
    const {
      sendDefaultPii: r,
      sendClientReports: o,
      enableLogs: s,
      _experiments: i,
      enableMetrics: a,
    } = this._options;
    const c = a ?? i?.enableMetrics ?? true;
    $t.document &&
      (o || s || c) &&
      $t.document.addEventListener("visibilitychange", () => {
        if ($t.document.visibilityState === "hidden") {
          o && this._flushOutcomes();
          s && R(this);
          c && I(this);
        }
      });
    r && this.on("beforeSendSession", x);
  }
  eventFromException(e, t) {
    return nn(this._options.stackParser, e, t, this._options.attachStacktrace);
  }
  eventFromMessage(e, t = "info", n) {
    return rn(
      this._options.stackParser,
      e,
      t,
      n,
      this._options.attachStacktrace,
    );
  }
  _prepareEvent(e, t, n, r) {
    e.platform = e.platform || "javascript";
    return super._prepareEvent(e, t, n, r);
  }
}
function un(e) {
  return {
    release:
      typeof __SENTRY_RELEASE__ === "string"
        ? __SENTRY_RELEASE__
        : $t.SENTRY_RELEASE?.id,
    sendClientReports: true,
    parentSpanIsAlwaysRootSpan: true,
    ...e,
  };
}
const fn = 40;
function pn(e, t = mt("fetch")) {
  let n = 0;
  let r = 0;
  async function o(o) {
    const s = o.body.length;
    n += s;
    r++;
    const i = {
      body: o.body,
      method: "POST",
      referrerPolicy: "strict-origin",
      headers: e.headers,
      keepalive: n <= 6e4 && r < 15,
      ...e.fetchOptions,
    };
    try {
      const n = await t(e.url, i);
      return {
        statusCode: n.status,
        headers: {
          "x-sentry-rate-limits": n.headers.get("X-Sentry-Rate-Limits"),
          "retry-after": n.headers.get("Retry-After"),
        },
      };
    } catch (e) {
      ht("fetch");
      throw e;
    } finally {
      n -= s;
      r--;
    }
  }
  return C(e, o, L(e.bufferSize || fn));
}
const dn = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
function gn() {
  const e = p();
  if (!e) {
    dn && O.warn("No Sentry client available, profiling is not started");
    return;
  }
  const t = e.getIntegrationByName("BrowserProfiling");
  t
    ? e.emit("startUIProfiler")
    : dn && O.warn("BrowserProfiling integration is not available");
}
function mn() {
  const e = p();
  if (!e) {
    dn && O.warn("No Sentry client available, profiling is not started");
    return;
  }
  const t = e.getIntegrationByName("BrowserProfiling");
  t
    ? e.emit("stopUIProfiler")
    : dn && O.warn("ProfilingIntegration is not available");
}
const hn = { startProfiler: gn, stopProfiler: mn };
const yn = 10;
const vn = 20;
const _n = 30;
const bn = 40;
const Sn = 50;
function wn(e, t, n, r) {
  const o = {
    filename: e,
    function: t === "<anonymous>" ? A : t,
    in_app: true,
  };
  n !== void 0 && (o.lineno = n);
  r !== void 0 && (o.colno = r);
  return o;
}
const Pn = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
const kn =
  /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
const Tn = /\((\S*)(?::(\d+))(?::(\d+))\)/;
const En = /at (.+?) ?\(data:(.+?),/;
const Rn = (e) => {
  const t = e.match(En);
  if (t) return { filename: `<data:${t[2]}>`, function: t[1] };
  const n = Pn.exec(e);
  if (n) {
    const [, e, t, r] = n;
    return wn(e, A, +t, +r);
  }
  const r = kn.exec(e);
  if (r) {
    const e = r[2] && r[2].indexOf("eval") === 0;
    if (e) {
      const e = Tn.exec(r[2]);
      if (e) {
        r[2] = e[1];
        r[3] = e[2];
        r[4] = e[3];
      }
    }
    const [t, n] = zn(r[1] || A, r[2]);
    return wn(n, t, r[3] ? +r[3] : void 0, r[4] ? +r[4] : void 0);
  }
};
const In = [_n, Rn];
const xn =
  /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
const Cn = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
const Ln = (e) => {
  const t = xn.exec(e);
  if (t) {
    const e = t[3] && t[3].indexOf(" > eval") > -1;
    if (e) {
      const e = Cn.exec(t[3]);
      if (e) {
        t[1] = t[1] || "eval";
        t[3] = e[1];
        t[4] = e[2];
        t[5] = "";
      }
    }
    let n = t[3];
    let r = t[1] || A;
    [r, n] = zn(r, n);
    return wn(n, r, t[4] ? +t[4] : void 0, t[5] ? +t[5] : void 0);
  }
};
const On = [Sn, Ln];
const An =
  /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
const $n = (e) => {
  const t = An.exec(e);
  return t ? wn(t[2], t[1] || A, +t[3], t[4] ? +t[4] : void 0) : void 0;
};
const Dn = [bn, $n];
const qn = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i;
const Mn = (e) => {
  const t = qn.exec(e);
  return t ? wn(t[2], t[3] || A, +t[1]) : void 0;
};
const Nn = [yn, Mn];
const Fn =
  / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i;
const Hn = (e) => {
  const t = Fn.exec(e);
  return t ? wn(t[5], t[3] || t[4] || A, +t[1], +t[2]) : void 0;
};
const jn = [vn, Hn];
const Un = [In, On];
const Bn = $(...Un);
const zn = (e, t) => {
  const n = e.indexOf("safari-extension") !== -1;
  const r = e.indexOf("safari-web-extension") !== -1;
  return n || r
    ? [
        e.indexOf("@") !== -1 ? e.split("@")[0] : A,
        n ? `safari-extension:${t}` : `safari-web-extension:${t}`,
      ]
    : [e, t];
};
function Wn(e, { metadata: t, tunnel: n, dsn: r }) {
  const o = {
    event_id: e.event_id,
    sent_at: new Date().toISOString(),
    ...(t?.sdk && { sdk: { name: t.sdk.name, version: t.sdk.version } }),
    ...(!!n && !!r && { dsn: D(r) }),
  };
  const s = Gn(e);
  return q(o, [s]);
}
function Gn(e) {
  const t = { type: "user_report" };
  return [t, e];
}
const Xn = 1024;
const Kn = "Breadcrumbs";
const Yn = (e = {}) => {
  const t = {
    console: true,
    dom: true,
    fetch: true,
    history: true,
    sentry: true,
    xhr: true,
    ...e,
  };
  return {
    name: Kn,
    setup(e) {
      t.console && M(Zn(e));
      t.dom && yt(Qn(e, t.dom));
      t.xhr && vt(er(e));
      t.fetch && N(tr(e));
      t.history && _t(nr(e));
      t.sentry && e.on("beforeSendEvent", Jn(e));
    },
  };
};
const Vn = F(Yn);
function Jn(e) {
  return function (t) {
    p() === e &&
      H(
        {
          category:
            "sentry." + (t.type === "transaction" ? "transaction" : "event"),
          event_id: t.event_id,
          level: t.level,
          message: j(t),
        },
        { event: t },
      );
  };
}
function Qn(e, t) {
  return function (n) {
    if (p() !== e) return;
    let r;
    let o;
    let s = typeof t === "object" ? t.serializeAttribute : void 0;
    let i =
      typeof t === "object" && typeof t.maxStringLength === "number"
        ? t.maxStringLength
        : void 0;
    if (i && i > Xn) {
      dn &&
        O.warn(
          `\`dom.maxStringLength\` cannot exceed ${Xn}, but a value of ${i} was configured. Sentry will use ${Xn} instead.`,
        );
      i = Xn;
    }
    typeof s === "string" && (s = [s]);
    try {
      const e = n.event;
      const t = rr(e) ? e.target : e;
      r = U(t, { keyAttrs: s, maxStringLength: i });
      o = B(t);
    } catch {
      r = "<unknown>";
    }
    if (r.length === 0) return;
    const a = { category: `ui.${n.name}`, message: r };
    o && (a.data = { "ui.component_name": o });
    H(a, { event: n.event, name: n.name, global: n.global });
  };
}
function Zn(e) {
  return function (t) {
    if (p() !== e) return;
    const n = {
      category: "console",
      data: { arguments: t.args, logger: "console" },
      level: W(t.level),
      message: z(t.args, " "),
    };
    if (t.level === "assert") {
      if (t.args[0] !== false) return;
      n.message = `Assertion failed: ${z(t.args.slice(1), " ") || "console.assert"}`;
      n.data.arguments = t.args.slice(1);
    }
    H(n, { input: t.args, level: t.level });
  };
}
function er(e) {
  return function (t) {
    if (p() !== e) return;
    const { startTimestamp: n, endTimestamp: r } = t;
    const o = t.xhr[bt];
    if (!n || !r || !o) return;
    const { method: s, url: i, status_code: a, body: c } = o;
    const l = { method: s, url: i, status_code: a };
    const u = { xhr: t.xhr, input: c, startTimestamp: n, endTimestamp: r };
    const f = { category: "xhr", data: l, type: "http", level: G(a) };
    e.emit("beforeOutgoingRequestBreadcrumb", f, u);
    H(f, u);
  };
}
function tr(e) {
  return function (t) {
    if (p() !== e) return;
    const { startTimestamp: n, endTimestamp: r } = t;
    if (
      r &&
      (!t.fetchData.url.match(/sentry_key/) || t.fetchData.method !== "POST")
    ) {
      ({ method: t.fetchData.method, url: t.fetchData.url });
      if (t.error) {
        const o = t.fetchData;
        const s = {
          data: t.error,
          input: t.args,
          startTimestamp: n,
          endTimestamp: r,
        };
        const i = { category: "fetch", data: o, level: "error", type: "http" };
        e.emit("beforeOutgoingRequestBreadcrumb", i, s);
        H(i, s);
      } else {
        const o = t.response;
        const s = { ...t.fetchData, status_code: o?.status };
        t.fetchData.request_body_size;
        t.fetchData.response_body_size;
        o?.status;
        const i = {
          input: t.args,
          response: o,
          startTimestamp: n,
          endTimestamp: r,
        };
        const a = {
          category: "fetch",
          data: s,
          type: "http",
          level: G(s.status_code),
        };
        e.emit("beforeOutgoingRequestBreadcrumb", a, i);
        H(a, i);
      }
    }
  };
}
function nr(e) {
  return function (t) {
    if (p() !== e) return;
    let n = t.from;
    let r = t.to;
    const o = X($t.location.href);
    let s = n ? X(n) : void 0;
    const i = X(r);
    s?.path || (s = o);
    o.protocol === i.protocol && o.host === i.host && (r = i.relative);
    o.protocol === s.protocol && o.host === s.host && (n = s.relative);
    H({ category: "navigation", data: { from: n, to: r } });
  };
}
function rr(e) {
  return !!e && !!e.target;
}
const or = [
  "EventTarget",
  "Window",
  "Node",
  "ApplicationCache",
  "AudioTrackList",
  "BroadcastChannel",
  "ChannelMergerNode",
  "CryptoOperation",
  "EventSource",
  "FileReader",
  "HTMLUnknownElement",
  "IDBDatabase",
  "IDBRequest",
  "IDBTransaction",
  "KeyOperation",
  "MediaController",
  "MessagePort",
  "ModalWindow",
  "Notification",
  "SVGElementInstance",
  "Screen",
  "SharedWorker",
  "TextTrack",
  "TextTrackCue",
  "TextTrackList",
  "WebSocket",
  "WebSocketWorker",
  "Worker",
  "XMLHttpRequest",
  "XMLHttpRequestEventTarget",
  "XMLHttpRequestUpload",
];
const sr = "BrowserApiErrors";
const ir = (e = {}) => {
  const t = {
    XMLHttpRequest: true,
    eventTarget: true,
    requestAnimationFrame: true,
    setInterval: true,
    setTimeout: true,
    unregisterOriginalCallbacks: false,
    ...e,
  };
  return {
    name: sr,
    setupOnce() {
      t.setTimeout && K($t, "setTimeout", cr);
      t.setInterval && K($t, "setInterval", cr);
      t.requestAnimationFrame && K($t, "requestAnimationFrame", lr);
      t.XMLHttpRequest &&
        "XMLHttpRequest" in $t &&
        K(XMLHttpRequest.prototype, "send", ur);
      const e = t.eventTarget;
      if (e) {
        const n = Array.isArray(e) ? e : or;
        n.forEach((e) => fr(e, t));
      }
    },
  };
};
const ar = F(ir);
function cr(e) {
  return function (...t) {
    const n = t[0];
    t[0] = Nt(n, {
      mechanism: {
        handled: false,
        type: `auto.browser.browserapierrors.${Y(e)}`,
      },
    });
    return e.apply(this, t);
  };
}
function lr(e) {
  return function (t) {
    return e.apply(this, [
      Nt(t, {
        mechanism: {
          data: { handler: Y(e) },
          handled: false,
          type: "auto.browser.browserapierrors.requestAnimationFrame",
        },
      }),
    ]);
  };
}
function ur(e) {
  return function (...t) {
    const n = this;
    const r = ["onload", "onerror", "onprogress", "onreadystatechange"];
    r.forEach((e) => {
      e in n &&
        typeof n[e] === "function" &&
        K(n, e, function (t) {
          const n = {
            mechanism: {
              data: { handler: Y(t) },
              handled: false,
              type: `auto.browser.browserapierrors.xhr.${e}`,
            },
          };
          const r = o(t);
          r && (n.mechanism.data.handler = Y(r));
          return Nt(t, n);
        });
    });
    return e.apply(this, t);
  };
}
function fr(e, t) {
  const n = $t;
  const r = n[e]?.prototype;
  if (r?.hasOwnProperty?.("addEventListener")) {
    K(r, "addEventListener", function (n) {
      return function (r, o, s) {
        try {
          pr(o) &&
            (o.handleEvent = Nt(o.handleEvent, {
              mechanism: {
                data: { handler: Y(o), target: e },
                handled: false,
                type: "auto.browser.browserapierrors.handleEvent",
              },
            }));
        } catch {}
        t.unregisterOriginalCallbacks && dr(this, r, o);
        return n.apply(this, [
          r,
          Nt(o, {
            mechanism: {
              data: { handler: Y(o), target: e },
              handled: false,
              type: "auto.browser.browserapierrors.addEventListener",
            },
          }),
          s,
        ]);
      };
    });
    K(r, "removeEventListener", function (e) {
      return function (t, n, r) {
        try {
          const o = n.__sentry_wrapped__;
          o && e.call(this, t, o, r);
        } catch {}
        return e.call(this, t, n, r);
      };
    });
  }
}
function pr(e) {
  return typeof e.handleEvent === "function";
}
function dr(e, t, n) {
  e &&
    typeof e === "object" &&
    "removeEventListener" in e &&
    typeof e.removeEventListener === "function" &&
    e.removeEventListener(t, n);
}
const gr = F(() => ({
  name: "BrowserSession",
  setupOnce() {
    if (typeof $t.document !== "undefined") {
      V({ ignoreDuration: true });
      J();
      _t(({ from: e, to: t }) => {
        if (e !== void 0 && e !== t) {
          V({ ignoreDuration: true });
          J();
        }
      });
    } else
      dn &&
        O.warn(
          "Using the `browserSessionIntegration` in non-browser environments is not supported.",
        );
  },
}));
const mr = "GlobalHandlers";
const hr = (e = {}) => {
  const t = { onerror: true, onunhandledrejection: true, ...e };
  return {
    name: mr,
    setupOnce() {
      Error.stackTraceLimit = 50;
    },
    setup(e) {
      if (t.onerror) {
        vr(e);
        Pr("onerror");
      }
      if (t.onunhandledrejection) {
        _r(e);
        Pr("onunhandledrejection");
      }
    },
  };
};
const yr = F(hr);
function vr(e) {
  Q((t) => {
    const { stackParser: n, attachStacktrace: r } = kr();
    if (p() !== e || qt()) return;
    const { msg: o, url: s, line: i, column: a, error: c } = t;
    const l = wr(on(n, c || o, void 0, r, false), s, i, a);
    l.level = "error";
    Z(l, {
      originalException: c,
      mechanism: {
        handled: false,
        type: "auto.browser.global_handlers.onerror",
      },
    });
  });
}
function _r(e) {
  ee((t) => {
    const { stackParser: n, attachStacktrace: r } = kr();
    if (p() !== e || qt()) return;
    const o = br(t);
    const s = te(o) ? Sr(o) : on(n, o, void 0, r, true);
    s.level = "error";
    Z(s, {
      originalException: o,
      mechanism: {
        handled: false,
        type: "auto.browser.global_handlers.onunhandledrejection",
      },
    });
  });
}
function br(e) {
  if (te(e)) return e;
  try {
    if ("reason" in e) return e.reason;
    if ("detail" in e && "reason" in e.detail) return e.detail.reason;
  } catch {}
  return e;
}
/**
 * Create an event from a promise rejection where the `reason` is a primitive.
 *
 * @param reason: The `reason` property of the promise rejection
 * @returns An Event object with an appropriate `exception` value
 */ function Sr(e) {
  return {
    exception: {
      values: [
        {
          type: "UnhandledRejection",
          value: `Non-Error promise rejection captured with value: ${String(e)}`,
        },
      ],
    },
  };
}
function wr(e, t, n, r) {
  const o = (e.exception = e.exception || {});
  const s = (o.values = o.values || []);
  const i = (s[0] = s[0] || {});
  const a = (i.stacktrace = i.stacktrace || {});
  const c = (a.frames = a.frames || []);
  const l = r;
  const u = n;
  const p = Tr(t) ?? f();
  c.length === 0 &&
    c.push({ colno: l, filename: p, function: A, in_app: true, lineno: u });
  return e;
}
function Pr(e) {
  dn && O.log(`Global Handler attached: ${e}`);
}
function kr() {
  const e = p();
  const t = e?.getOptions() || {
    stackParser: () => [],
    attachStacktrace: false,
  };
  return t;
}
function Tr(e) {
  if (ne(e) && e.length !== 0) {
    if (e.startsWith("data:")) {
      const t = e.match(/^data:([^;]+)/);
      const n = t ? t[1] : "text/javascript";
      const r = e.includes("base64,");
      return `<data:${n}${r ? ",base64" : ""}>`;
    }
    return e;
  }
}
const Er = F(() => ({
  name: "HttpContext",
  preprocessEvent(e) {
    if (!$t.navigator && !$t.location && !$t.document) return;
    const t = Ft();
    const n = { ...t.headers, ...e.request?.headers };
    e.request = { ...t, ...e.request, headers: n };
  },
}));
const Rr = "cause";
const Ir = 5;
const xr = "LinkedErrors";
const Cr = (e = {}) => {
  const t = e.limit || Ir;
  const n = e.key || Rr;
  return {
    name: xr,
    preprocessEvent(e, r, o) {
      const s = o.getOptions();
      re(Gt, s.stackParser, n, t, e, r);
    },
  };
};
const Lr = F(Cr);
const Or = "SpotlightBrowser";
const Ar = (e = {}) => {
  const t = e.sidecarUrl || "http://localhost:8969/stream";
  return {
    name: Or,
    setup: () => {
      dn && O.log("Using Sidecar URL", t);
    },
    processEvent: (e) => (qr(e) ? null : e),
    afterAllSetup: (e) => {
      $r(e, t);
    },
  };
};
function $r(e, t) {
  const n = mt("fetch");
  let r = 0;
  e.on("beforeEnvelope", (e) => {
    r > 3
      ? O.warn(
          "[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests:",
          r,
        )
      : n(t, {
          method: "POST",
          body: oe(e),
          headers: { "Content-Type": "application/x-sentry-envelope" },
          mode: "cors",
        }).then(
          (e) => {
            e.status >= 200 && e.status < 400 && (r = 0);
          },
          (e) => {
            r++;
            O.error(
              "Sentry SDK can't connect to Sidecar is it running? See: https://spotlightjs.com/sidecar/npx/",
              e,
            );
          },
        );
  });
}
const Dr = F(Ar);
function qr(e) {
  return Boolean(
    e.type === "transaction" &&
      e.spans &&
      e.contexts?.trace &&
      e.contexts.trace.op === "ui.action.click" &&
      e.spans.some(({ description: e }) => e?.includes("#sentry-spotlight")),
  );
}
function Mr() {
  if (Nr()) {
    dn &&
      se(() => {
        console.error(
          "[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/",
        );
      });
    return true;
  }
  return false;
}
function Nr() {
  if (typeof $t.window === "undefined") return false;
  const e = $t;
  if (e.nw) return false;
  const t = e.chrome || e.browser;
  if (!t?.runtime?.id) return false;
  const n = f();
  const r = [
    "chrome-extension",
    "moz-extension",
    "ms-browser-extension",
    "safari-web-extension",
  ];
  const o = $t === $t.top && r.some((e) => n.startsWith(`${e}://`));
  return !o;
}
function Fr(e) {
  return [ie(), ae(), ar(), Vn(), yr(), Lr(), ce(), Er(), gr()];
}
function Hr(e = {}) {
  const t = !e.skipBrowserExtensionCheck && Mr();
  let n = e.defaultIntegrations == null ? Fr() : e.defaultIntegrations;
  const r = {
    ...e,
    enabled: !t && e.enabled,
    stackParser: ue(e.stackParser || Bn),
    integrations: le({ integrations: e.integrations, defaultIntegrations: n }),
    transport: e.transport || pn,
  };
  return fe(BrowserClient, r);
}
function jr() {}
function Ur(e) {
  e();
}
/**
 * Present the user with a report dialog.
 *
 * @param options Everything is optional, we try to fetch all info need from the current scope.
 */ function Br(e = {}) {
  const t = $t.document;
  const n = t?.head || t?.body;
  if (!n) {
    dn && O.error("[showReportDialog] Global document not defined");
    return;
  }
  const r = pe();
  const o = p();
  const s = o?.getDsn();
  if (!s) {
    dn && O.error("[showReportDialog] DSN not configured");
    return;
  }
  const i = {
    ...e,
    user: { ...r.getUser(), ...e.user },
    eventId: e.eventId || de(),
  };
  const a = $t.document.createElement("script");
  a.async = true;
  a.crossOrigin = "anonymous";
  a.src = ge(s, i);
  const { onLoad: c, onClose: l } = i;
  c && (a.onload = c);
  if (l) {
    const e = (t) => {
      if (t.data === "__sentry_reportdialog_closed__")
        try {
          l();
        } finally {
          $t.removeEventListener("message", e);
        }
    };
    $t.addEventListener("message", e);
  }
  n.appendChild(a);
}
const zr = r;
const Wr = "ReportingObserver";
const Gr = new WeakMap();
const Xr = (e = {}) => {
  const t = e.types || ["crash", "deprecation", "intervention"];
  function n(e) {
    if (Gr.has(p()))
      for (const t of e)
        s((e) => {
          e.setExtra("url", t.url);
          const n = `ReportingObserver [${t.type}]`;
          let r = "No details available";
          if (t.body) {
            const n = {};
            for (const e in t.body) n[e] = t.body[e];
            e.setExtra("body", n);
            if (t.type === "crash") {
              const e = t.body;
              r = [e.crashId || "", e.reason || ""].join(" ").trim() || r;
            } else {
              const e = t.body;
              r = e.message || r;
            }
          }
          me(`${n}: ${r}`);
        });
  }
  return {
    name: Wr,
    setupOnce() {
      if (!he()) return;
      const e = new zr.ReportingObserver(n, { buffered: true, types: t });
      e.observe();
    },
    setup(e) {
      Gr.set(e, true);
    },
  };
};
const Kr = F(Xr);
const Yr = "HttpClient";
const Vr = (e = {}) => {
  const t = {
    failedRequestStatusCodes: [[500, 599]],
    failedRequestTargets: [/.*/],
    ...e,
  };
  return {
    name: Yr,
    setup(e) {
      ao(e, t);
      co(e, t);
    },
  };
};
const Jr = F(Vr);
/**
 * Interceptor function for fetch requests
 *
 * @param requestInfo The Fetch API request info
 * @param response The Fetch API response
 * @param requestInit The request init object
 */ function Qr(e, t, n, r, o) {
  if (lo(e, n.status, n.url)) {
    const e = fo(t, r);
    let s, i, a, c;
    if (po()) {
      [s, a] = Zr("Cookie", e);
      [i, c] = Zr("Set-Cookie", n);
    }
    const l = uo({
      url: e.url,
      method: e.method,
      status: n.status,
      requestHeaders: s,
      responseHeaders: i,
      requestCookies: a,
      responseCookies: c,
      error: o,
      type: "fetch",
    });
    Z(l);
  }
}
function Zr(e, t) {
  const n = ro(t.headers);
  let r;
  try {
    const t = n[e] || n[e.toLowerCase()] || void 0;
    t && (r = no(t));
  } catch {}
  return [n, r];
}
/**
 * Interceptor function for XHR requests
 *
 * @param xhr The XHR request
 * @param method The HTTP method
 * @param headers The HTTP headers
 */ function eo(e, t, n, r, o) {
  if (lo(e, t.status, t.responseURL)) {
    let e, s, i;
    if (po()) {
      try {
        const e =
          t.getResponseHeader("Set-Cookie") ||
          t.getResponseHeader("set-cookie") ||
          void 0;
        e && (s = no(e));
      } catch {}
      try {
        i = oo(t);
      } catch {}
      e = r;
    }
    const a = uo({
      url: t.responseURL,
      method: n,
      status: t.status,
      requestHeaders: e,
      responseHeaders: i,
      responseCookies: s,
      error: o,
      type: "xhr",
    });
    Z(a);
  }
}
/**
 * Extracts response size from `Content-Length` header when possible
 *
 * @param headers
 * @returns The response size in bytes or undefined
 */ function to(e) {
  if (e) {
    const t = e["Content-Length"] || e["content-length"];
    if (t) return parseInt(t, 10);
  }
}
/**
 * Creates an object containing cookies from the given cookie string
 *
 * @param cookieString The cookie string to parse
 * @returns The parsed cookies
 */ function no(e) {
  return e.split("; ").reduce((e, t) => {
    const [n, r] = t.split("=");
    n && r && (e[n] = r);
    return e;
  }, {});
}
/**
 * Extracts the headers as an object from the given Fetch API request or response object
 *
 * @param headers The headers to extract
 * @returns The extracted headers as an object
 */ function ro(e) {
  const t = {};
  e.forEach((e, n) => {
    t[n] = e;
  });
  return t;
}
/**
 * Extracts the response headers as an object from the given XHR object
 *
 * @param xhr The XHR object to extract the response headers from
 * @returns The response headers as an object
 */ function oo(e) {
  const t = e.getAllResponseHeaders();
  return t
    ? t.split("\r\n").reduce((e, t) => {
        const [n, r] = t.split(": ");
        n && r && (e[n] = r);
        return e;
      }, {})
    : {};
}
/**
 * Checks if the given target url is in the given list of targets
 *
 * @param target The target url to check
 * @returns true if the target url is in the given list of targets, false otherwise
 */ function so(e, t) {
  return e.some((e) => (typeof e === "string" ? t.includes(e) : e.test(t)));
}
/**
 * Checks if the given status code is in the given range
 *
 * @param status The status code to check
 * @returns true if the status code is in the given range, false otherwise
 */ function io(e, t) {
  return e.some((e) =>
    typeof e === "number" ? e === t : t >= e[0] && t <= e[1],
  );
}
function ao(e, t) {
  ye() &&
    N((n) => {
      if (p() !== e) return;
      const { response: r, args: o, error: s, virtualError: i } = n;
      const [a, c] = o;
      r && Qr(t, a, r, c, s || i);
    }, false);
}
function co(e, t) {
  "XMLHttpRequest" in r &&
    vt((n) => {
      if (p() !== e) return;
      const { error: r, virtualError: o } = n;
      const s = n.xhr;
      const i = s[bt];
      if (!i) return;
      const { method: a, request_headers: c } = i;
      try {
        eo(t, s, a, c, r || o);
      } catch (e) {
        dn &&
          O.warn("Error while extracting response event form XHR response", e);
      }
    });
}
/**
 * Checks whether to capture given response as an event
 *
 * @param status response status code
 * @param url response url
 */ function lo(e, t, n) {
  return (
    io(e.failedRequestStatusCodes, t) &&
    so(e.failedRequestTargets, n) &&
    !ve(n, p())
  );
}
/**
 * Creates a synthetic Sentry event from given response data
 *
 * @param data response data
 * @returns event
 */ function uo(e) {
  const t = p();
  const n = t && e.error && e.error instanceof Error ? e.error.stack : void 0;
  const r = n && t ? t.getOptions().stackParser(n, 0, 1) : void 0;
  const o = `HTTP Client Error with status code: ${e.status}`;
  const s = {
    message: o,
    exception: {
      values: [
        { type: "Error", value: o, stacktrace: r ? { frames: r } : void 0 },
      ],
    },
    request: {
      url: e.url,
      method: e.method,
      headers: e.requestHeaders,
      cookies: e.requestCookies,
    },
    contexts: {
      response: {
        status_code: e.status,
        headers: e.responseHeaders,
        cookies: e.responseCookies,
        body_size: to(e.responseHeaders),
      },
    },
  };
  a(s, { type: `auto.http.client.${e.type}`, handled: false });
  return s;
}
function fo(e, t) {
  return (!t && e instanceof Request) || (e instanceof Request && e.bodyUsed)
    ? e
    : new Request(e, t);
}
function po() {
  const e = p();
  return !!e && Boolean(e.getOptions().sendDefaultPii);
}
const go = r;
const mo = 7;
const ho = "ContextLines";
const yo = (e = {}) => {
  const t = e.frameContextLines != null ? e.frameContextLines : mo;
  return {
    name: ho,
    processEvent(e) {
      return _o(e, t);
    },
  };
};
const vo = F(yo);
function _o(e, t) {
  const n = go.document;
  const r = go.location && _e(go.location.href);
  if (!n || !r) return e;
  const o = e.exception?.values;
  if (!o?.length) return e;
  const s = n.documentElement.innerHTML;
  if (!s) return e;
  const i = ["<!DOCTYPE html>", "<html>", ...s.split("\n"), "</html>"];
  o.forEach((e) => {
    const n = e.stacktrace;
    n?.frames && (n.frames = n.frames.map((e) => bo(e, i, r, t)));
  });
  return e;
}
function bo(e, t, n, r) {
  if (e.filename !== n || !e.lineno || !t.length) return e;
  be(t, e, r);
  return e;
}
const So = "GraphQLClient";
const wo = (e) => ({
  name: So,
  setup(t) {
    Po(t, e);
    ko(t, e);
  },
});
function Po(e, t) {
  e.on("beforeOutgoingRequestSpan", (e, n) => {
    const r = Se(e);
    const o = r.data || {};
    const s = o[we];
    const i = s === "http.client";
    if (!i) return;
    const a = o[Pe] || o["http.url"];
    const c = o[ke] || o["http.method"];
    if (!ne(a) || !ne(c)) return;
    const { endpoints: l } = t;
    const u = Te(a, l);
    const f = Eo(n);
    if (u && f) {
      const t = Io(f);
      if (t) {
        const n = To(t);
        e.updateName(`${c} ${a} (${n})`);
        e.setAttribute("graphql.document", f);
      }
    }
  });
}
function ko(e, t) {
  e.on("beforeOutgoingRequestBreadcrumb", (e, n) => {
    const { category: r, type: o, data: s } = e;
    const i = r === "fetch";
    const a = r === "xhr";
    const c = o === "http";
    if (c && (i || a)) {
      const e = s?.url;
      const { endpoints: r } = t;
      const o = Te(e, r);
      const i = Eo(n);
      if (o && s && i) {
        const e = Io(i);
        if (!s.graphql && e) {
          const t = To(e);
          s["graphql.document"] = e.query;
          s["graphql.operation"] = t;
        }
      }
    }
  });
}
/**
 * @param requestBody - GraphQL request
 * @returns A formatted version of the request: 'TYPE NAME' or 'TYPE'
 */ function To(e) {
  const { query: t, operationName: n } = e;
  const { operationName: r = n, operationType: o } = Ro(t);
  const s = r ? `${o} ${r}` : `${o}`;
  return s;
}
function Eo(e) {
  const t = "xhr" in e;
  let n;
  if (t) {
    const t = e.xhr[bt];
    n = t && St(t.body)[0];
  } else {
    const t = wt(e.input);
    n = St(t)[0];
  }
  return n;
}
function Ro(e) {
  const t = /^(?:\s*)(query|mutation|subscription)(?:\s*)(\w+)(?:\s*)[{(]/;
  const n = /^(?:\s*)(query|mutation|subscription)(?:\s*)[{(]/;
  const r = e.match(t);
  if (r) return { operationType: r[1], operationName: r[2] };
  const o = e.match(n);
  return o
    ? { operationType: o[1], operationName: void 0 }
    : { operationType: void 0, operationName: void 0 };
}
/**
 * Extract the payload of a request if it's GraphQL.
 * Exported for tests only.
 * @param payload - A valid JSON string
 * @returns A POJO or undefined
 */ function Io(e) {
  let t;
  try {
    const n = JSON.parse(e);
    const r = !!n.query;
    r && (t = n);
  } finally {
    return t;
  }
}
const xo = F(wo);
function Co(e) {
  return e.split(",").some((e) => e.trim().startsWith("sentry-"));
}
function Lo(e) {
  try {
    const t = new URL(e, $t.location.origin);
    return t.href;
  } catch {
    return;
  }
}
function Oo(e) {
  return (
    e.entryType === "resource" &&
    "initiatorType" in e &&
    typeof e.nextHopProtocol === "string" &&
    (e.initiatorType === "fetch" || e.initiatorType === "xmlhttprequest")
  );
}
function Ao(e) {
  try {
    return new Headers(e);
  } catch {
    return;
  }
}
const $o = new WeakMap();
const Do = new Map();
const qo = {
  traceFetch: true,
  traceXHR: true,
  enableHTTPTimings: true,
  trackFetchStreamPerformance: false,
};
function Mo(e, t) {
  const {
    traceFetch: n,
    traceXHR: r,
    trackFetchStreamPerformance: o,
    shouldCreateSpanForRequest: s,
    enableHTTPTimings: i,
    tracePropagationTargets: a,
    onRequestSpanStart: c,
    onRequestSpanEnd: l,
  } = { ...qo, ...t };
  const u = typeof s === "function" ? s : (e) => true;
  const f = (e) => Fo(e, a);
  const p = {};
  const d = e.getOptions().propagateTraceparent;
  if (n) {
    e.addEventProcessor((e) => {
      e.type === "transaction" &&
        e.spans &&
        e.spans.forEach((e) => {
          if (e.op === "http.client") {
            const t = Do.get(e.span_id);
            if (t) {
              e.timestamp = t / 1e3;
              Do.delete(e.span_id);
            }
          }
        });
      return e;
    });
    o &&
      Ee((e) => {
        if (e.response) {
          const t = $o.get(e.response);
          t && e.endTimestamp && Do.set(t, e.endTimestamp);
        }
      });
    N((e) => {
      const t = Re(e, u, f, p, {
        propagateTraceparent: d,
        onRequestSpanEnd: l,
      });
      e.response &&
        e.fetchData.__span &&
        $o.set(e.response, e.fetchData.__span);
      if (t) {
        const n = Lo(e.fetchData.url);
        const r = n ? X(n).host : void 0;
        t.setAttributes({ "http.url": n, "server.address": r });
        i && No(t);
        c?.(t, { headers: e.headers });
      }
    });
  }
  r &&
    vt((e) => {
      const t = Ho(e, u, f, p, d, l);
      if (t) {
        i && No(t);
        c?.(t, { headers: Ao(e.xhr.__sentry_xhr_v3__?.request_headers) });
      }
    });
}
/**
 * Creates a temporary observer to listen to the next fetch/xhr resourcing timings,
 * so that when timings hit their per-browser limit they don't need to be removed.
 *
 * @param span A span that has yet to be finished, must contain `url` on data.
 */ function No(e) {
  const { url: t } = Se(e).data;
  if (!t || typeof t !== "string") return;
  const n = Pt("resource", ({ entries: r }) => {
    r.forEach((r) => {
      if (Oo(r) && r.name.endsWith(t)) {
        e.setAttributes(kt(r));
        setTimeout(n);
      }
    });
  });
}
function Fo(e, t) {
  const n = f();
  if (n) {
    let r;
    let o;
    try {
      r = new URL(e, n);
      o = new URL(n).origin;
    } catch {
      return false;
    }
    const s = r.origin === o;
    return t ? Te(r.toString(), t) || (s && Te(r.pathname, t)) : s;
  }
  {
    const n = !!e.match(/^\/(?!\/)/);
    return t ? Te(e, t) : n;
  }
}
/**
 * Create and track xhr request spans
 *
 * @returns Span if a span was created, otherwise void.
 */ function Ho(e, t, n, r, o, s) {
  const i = e.xhr;
  const a = i?.[bt];
  if (!i || i.__sentry_own_request__ || !a) return;
  const { url: c, method: l } = a;
  const u = Ie() && t(c);
  if (e.endTimestamp && u) {
    const t = i.__sentry_xhr_span_id__;
    if (!t) return;
    const n = r[t];
    if (n && a.status_code !== void 0) {
      xe(n, a.status_code);
      n.end();
      s?.(n, { headers: Ao(Tt(i)), error: e.error });
      delete r[t];
    }
    return;
  }
  const f = Lo(c);
  const d = X(f || c);
  const g = _e(c);
  const m = !!Ce();
  const h =
    u && m
      ? Le({
          name: `${l} ${g}`,
          attributes: {
            url: c,
            type: "xhr",
            "http.method": l,
            "http.url": f,
            "server.address": d?.host,
            [Oe]: "auto.http.browser",
            [we]: "http.client",
            ...(d?.search && { "http.query": d?.search }),
            ...(d?.hash && { "http.fragment": d?.hash }),
          },
        })
      : new Ae();
  i.__sentry_xhr_span_id__ = h.spanContext().spanId;
  r[i.__sentry_xhr_span_id__] = h;
  n(c) && jo(i, Ie() && m ? h : void 0, o);
  const y = p();
  y && y.emit("beforeOutgoingRequestSpan", h, e);
  return h;
}
function jo(e, t, n) {
  const {
    "sentry-trace": r,
    baggage: o,
    traceparent: s,
  } = $e({ span: t, propagateTraceparent: n });
  r && Uo(e, r, o, s);
}
function Uo(e, t, n, r) {
  const o = e.__sentry_xhr_v3__?.request_headers;
  if (!o?.["sentry-trace"] && e.setRequestHeader)
    try {
      e.setRequestHeader("sentry-trace", t);
      r && !o?.traceparent && e.setRequestHeader("traceparent", r);
      if (n) {
        const t = o?.baggage;
        (t && Co(t)) || e.setRequestHeader("baggage", n);
      }
    } catch {}
}
function Bo() {
  $t.document
    ? $t.document.addEventListener("visibilitychange", () => {
        const e = Ce();
        if (!e) return;
        const t = De(e);
        if ($t.document.hidden && t) {
          const e = "cancelled";
          const { op: n, status: r } = Se(t);
          dn &&
            O.log(
              `[Tracing] Transaction: ${e} -> since tab moved to the background, op: ${n}`,
            );
          r || t.setStatus({ code: qe, message: e });
          t.setAttribute("sentry.cancellation_reason", "document.hidden");
          t.end();
        }
      })
    : dn &&
      O.warn(
        "[Tracing] Could not set up background tab detection due to lack of global document",
      );
}
const zo = 3600;
const Wo = "sentry_previous_trace";
const Go = "sentry.previous_trace";
/**
 * Takes care of linking traces and applying the (consistent) sampling behavoiour based on the passed options
 * @param options - options for linking traces and consistent trace sampling (@see BrowserTracingOptions)
 * @param client - Sentry client
 */ function Xo(e, { linkPreviousTrace: t, consistentTraceSampling: n }) {
  const r = t === "session-storage";
  let o = r ? Vo() : void 0;
  e.on("spanStart", (e) => {
    if (De(e) !== e) return;
    const t = pe().getPropagationContext();
    o = Ko(o, e, t);
    r && Yo(o);
  });
  let s = true;
  n &&
    e.on("beforeSampling", (e) => {
      if (!o) return;
      const t = pe();
      const n = t.getPropagationContext();
      if (s && n.parentSpanId) s = false;
      else {
        t.setPropagationContext({
          ...n,
          dsc: {
            ...n.dsc,
            sample_rate: String(o.sampleRate),
            sampled: String(Jo(o.spanContext)),
          },
          sampleRand: o.sampleRand,
        });
        e.parentSampled = Jo(o.spanContext);
        e.parentSampleRate = o.sampleRate;
        e.spanAttributes = { ...e.spanAttributes, [Me]: o.sampleRate };
      }
    });
}
/**
 * Adds a previous_trace span link to the passed span if the passed
 * previousTraceInfo is still valid.
 *
 * @returns the updated previous trace info (based on the current span/trace) to
 * be used on the next call
 */ function Ko(e, t, n) {
  const r = Se(t);
  function o() {
    try {
      return Number(n.dsc?.sample_rate) ?? Number(r.data?.[Ne]);
    } catch {
      return 0;
    }
  }
  const s = {
    spanContext: t.spanContext(),
    startTimestamp: r.start_timestamp,
    sampleRate: o(),
    sampleRand: n.sampleRand,
  };
  if (!e) return s;
  const i = e.spanContext;
  if (i.traceId === r.trace_id) return e;
  if (Date.now() / 1e3 - e.startTimestamp <= zo) {
    dn &&
      O.log(
        `Adding previous_trace ${i} link to span ${{ op: r.op, ...t.spanContext() }}`,
      );
    t.addLink({ context: i, attributes: { [Fe]: "previous_trace" } });
    t.setAttribute(Go, `${i.traceId}-${i.spanId}-${Jo(i) ? 1 : 0}`);
  }
  return s;
}
/**
 * Stores @param previousTraceInfo in sessionStorage.
 */ function Yo(e) {
  try {
    $t.sessionStorage.setItem(Wo, JSON.stringify(e));
  } catch (e) {
    dn && O.warn("Could not store previous trace in sessionStorage", e);
  }
}
function Vo() {
  try {
    const e = $t.sessionStorage?.getItem(Wo);
    return JSON.parse(e);
  } catch {
    return;
  }
}
function Jo(e) {
  return e.traceFlags === 1;
}
const Qo = "BrowserTracing";
const Zo = {
  ...He,
  instrumentNavigation: true,
  instrumentPageLoad: true,
  markBackgroundSpan: true,
  enableLongTask: true,
  enableLongAnimationFrame: true,
  enableInp: true,
  enableElementTiming: true,
  ignoreResourceSpans: [],
  ignorePerformanceApiSpans: [],
  detectRedirects: true,
  linkPreviousTrace: "in-memory",
  consistentTraceSampling: false,
  enableReportPageLoaded: false,
  _experiments: {},
  ...qo,
};
const es = (e = {}) => {
  const t = { name: void 0, source: void 0 };
  const n = $t.document;
  const {
    enableInp: o,
    enableElementTiming: s,
    enableLongTask: i,
    enableLongAnimationFrame: a,
    _experiments: {
      enableInteractions: c,
      enableStandaloneClsSpans: l,
      enableStandaloneLcpSpans: u,
    },
    beforeStartSpan: d,
    idleTimeout: g,
    finalTimeout: m,
    childSpanTimeout: h,
    markBackgroundSpan: y,
    traceFetch: v,
    traceXHR: _,
    trackFetchStreamPerformance: b,
    shouldCreateSpanForRequest: S,
    enableHTTPTimings: w,
    ignoreResourceSpans: P,
    ignorePerformanceApiSpans: k,
    instrumentPageLoad: T,
    instrumentNavigation: E,
    detectRedirects: R,
    linkPreviousTrace: I,
    consistentTraceSampling: x,
    enableReportPageLoaded: C,
    onRequestSpanStart: L,
    onRequestSpanEnd: A,
  } = { ...Zo, ...e };
  let $;
  let D;
  let q;
  function M(e, r, o = true) {
    const s = r.op === "pageload";
    const i = r.name;
    const a = d ? d(r) : r;
    const c = a.attributes || {};
    if (i !== a.name) {
      c[je] = "custom";
      a.attributes = c;
    }
    if (!o) {
      const e = Ue();
      Le({ ...a, startTime: e }).end(e);
      return;
    }
    t.name = a.name;
    t.source = c[je];
    const f = Be(a, {
      idleTimeout: g,
      finalTimeout: m,
      childSpanTimeout: h,
      disableAutoFinish: s,
      beforeSpanEnd: (t) => {
        $?.();
        Et(t, {
          recordClsOnPageloadSpan: !l,
          recordLcpOnPageloadSpan: !u,
          ignoreResourceSpans: P,
          ignorePerformanceApiSpans: k,
        });
        as(e, void 0);
        const n = pe();
        const r = n.getPropagationContext();
        n.setPropagationContext({
          ...r,
          traceId: f.spanContext().traceId,
          sampled: We(f),
          dsc: ze(t),
        });
        s && (q = void 0);
      },
      trimIdleSpanEndTimestamp: !C,
    });
    s && C && (q = f);
    as(e, f);
    function p() {
      n &&
        ["interactive", "complete"].includes(n.readyState) &&
        e.emit("idleSpanEnableAutoFinish", f);
    }
    if (s && !C && n) {
      n.addEventListener("readystatechange", () => {
        p();
      });
      p();
    }
  }
  return {
    name: Qo,
    setup(e) {
      Ke();
      $ = It({
        recordClsStandaloneSpans: l || false,
        recordLcpStandaloneSpans: u || false,
        client: e,
      });
      o && xt();
      s && Ct();
      a &&
      r.PerformanceObserver &&
      PerformanceObserver.supportedEntryTypes &&
      PerformanceObserver.supportedEntryTypes.includes("long-animation-frame")
        ? Lt()
        : i && Ot();
      c && At();
      if (R && n) {
        const e = () => {
          D = Ye();
        };
        addEventListener("click", e, { capture: true });
        addEventListener("keydown", e, { capture: true, passive: true });
      }
      function t() {
        const t = is(e);
        if (t && !Se(t).timestamp) {
          dn &&
            O.log(
              `[Tracing] Finishing current active span with op: ${Se(t).op}`,
            );
          t.setAttribute(Ve, "cancelled");
          t.end();
        }
      }
      e.on("startNavigationSpan", (n, r) => {
        if (p() !== e) return;
        if (r?.isRedirect) {
          dn &&
            O.warn(
              "[Tracing] Detected redirect, navigation span will not be the root span, but a child span.",
            );
          M(e, { op: "navigation.redirect", ...n }, false);
          return;
        }
        D = void 0;
        t();
        Je().setPropagationContext({
          traceId: Ze(),
          sampleRand: Math.random(),
          propagationSpanId: Ie() ? void 0 : Qe(),
        });
        const o = pe();
        o.setPropagationContext({
          traceId: Ze(),
          sampleRand: Math.random(),
          propagationSpanId: Ie() ? void 0 : Qe(),
        });
        o.setSDKProcessingMetadata({ normalizedRequest: void 0 });
        M(e, {
          op: "navigation",
          ...n,
          parentSpan: null,
          forceTransaction: true,
        });
      });
      e.on("startPageLoadSpan", (n, r = {}) => {
        if (p() !== e) return;
        t();
        const o = r.sentryTrace || rs("sentry-trace");
        const s = r.baggage || rs("baggage");
        const i = et(o, s);
        const a = pe();
        a.setPropagationContext(i);
        Ie() || (a.getPropagationContext().propagationSpanId = Qe());
        a.setSDKProcessingMetadata({ normalizedRequest: Ft() });
        M(e, { op: "pageload", ...n });
      });
      e.on("endPageloadSpan", () => {
        if (C && q) {
          q.setAttribute(Ve, "reportPageLoaded");
          q.end();
        }
      });
    },
    afterAllSetup(e) {
      let n = f();
      I !== "off" &&
        Xo(e, { linkPreviousTrace: I, consistentTraceSampling: x });
      if ($t.location) {
        if (T) {
          const t = Ge();
          ts(e, {
            name: $t.location.pathname,
            startTime: t ? t / 1e3 : void 0,
            attributes: { [je]: "url", [Oe]: "auto.pageload.browser" },
          });
        }
        E &&
          _t(({ to: t, from: r }) => {
            if (r === void 0 && n?.indexOf(t) !== -1) {
              n = void 0;
              return;
            }
            n = void 0;
            const o = Xe(t);
            const s = is(e);
            const i = s && R && ls(s, D);
            ns(
              e,
              {
                name: o?.pathname || $t.location.pathname,
                attributes: { [je]: "url", [Oe]: "auto.navigation.browser" },
              },
              { url: t, isRedirect: i },
            );
          });
      }
      y && Bo();
      c && os(e, g, m, h, t);
      o && Rt();
      Mo(e, {
        traceFetch: v,
        traceXHR: _,
        trackFetchStreamPerformance: b,
        tracePropagationTargets: e.getOptions().tracePropagationTargets,
        shouldCreateSpanForRequest: S,
        enableHTTPTimings: w,
        onRequestSpanStart: L,
        onRequestSpanEnd: A,
      });
    },
  };
};
function ts(e, t, n) {
  e.emit("startPageLoadSpan", t, n);
  pe().setTransactionName(t.name);
  const r = is(e);
  r && e.emit("afterStartPageLoadSpan", r);
  return r;
}
function ns(e, t, n) {
  const { url: r, isRedirect: o } = n || {};
  e.emit("beforeStartNavigationSpan", t, { isRedirect: o });
  e.emit("startNavigationSpan", t, { isRedirect: o });
  const s = pe();
  s.setTransactionName(t.name);
  r &&
    !o &&
    s.setSDKProcessingMetadata({ normalizedRequest: { ...Ft(), url: r } });
  return is(e);
}
function rs(e) {
  const t = $t.document;
  const n = t?.querySelector(`meta[name=${e}]`);
  return n?.getAttribute("content") || void 0;
}
function os(e, t, n, r, o) {
  const s = $t.document;
  let i;
  const a = () => {
    const s = "ui.action.click";
    const a = is(e);
    if (a) {
      const e = Se(a).op;
      if (["navigation", "pageload"].includes(e)) {
        dn &&
          O.warn(
            `[Tracing] Did not create ${s} span because a pageload or navigation span is in progress.`,
          );
        return;
      }
    }
    if (i) {
      i.setAttribute(Ve, "interactionInterrupted");
      i.end();
      i = void 0;
    }
    o.name
      ? (i = Be(
          { name: o.name, op: s, attributes: { [je]: o.source || "url" } },
          { idleTimeout: t, finalTimeout: n, childSpanTimeout: r },
        ))
      : dn &&
        O.warn(
          `[Tracing] Did not create ${s} transaction because _latestRouteName is missing.`,
        );
  };
  s && addEventListener("click", a, { capture: true });
}
const ss = "_sentry_idleSpan";
function is(e) {
  return e[ss];
}
function as(e, t) {
  u(e, ss, t);
}
const cs = 1.5;
function ls(e, t) {
  const n = Se(e);
  const r = Ue();
  const o = n.start_timestamp;
  return !(r - o > cs) && !(t && r - t <= cs);
}
/**
 * Manually report the end of the page load, resulting in the SDK ending the pageload span.
 * This only works if {@link BrowserTracingOptions.enableReportPageLoaded} is set to `true`.
 * Otherwise, the pageload span will end itself based on the {@link BrowserTracingOptions.finalTimeout},
 * {@link BrowserTracingOptions.idleTimeout} and {@link BrowserTracingOptions.childSpanTimeout}.
 *
 * @param client - The client to use. If not provided, the global client will be used.
 */ function us(e = p()) {
  e?.emit("endPageloadSpan");
}
/**
 * Sets an inactive span active on the current scope.
 *
 * This is useful in browser applications, if you want to create a span that cannot be finished
 * within its callback. Any spans started while the given span is active, will be children of the span.
 *
 * If there already was an active span on the scope prior to calling this function, it is replaced
 * with the given span and restored after the span ended. Otherwise, the span will simply be
 * removed, resulting in no active span on the scope.
 *
 * IMPORTANT: This function can ONLY be used in the browser! Calling this function in a server
 * environment (for example in a server-side rendered component) will result in undefined behaviour
 * and is not supported.
 * You MUST call `span.end()` manually, otherwise the span will never be finished.
 *
 * @example
 * ```js
 * let checkoutSpan;
 *
 * on('checkoutStarted', () => {
 *  checkoutSpan = Sentry.startInactiveSpan({ name: 'checkout-flow' });
 *  Sentry.setActiveSpanInBrowser(checkoutSpan);
 * })
 *
 * // during this time, any spans started will be children of `checkoutSpan`:
 * Sentry.startSpan({ name: 'checkout-step-1' }, () => {
 *  // ... `
 * })
 *
 * on('checkoutCompleted', () => {
 *  checkoutSpan?.end();
 * })
 * ```
 *
 * @param span - the span to set active
 */ function fs(e) {
  const t = Ce();
  if (t === e) return;
  const n = pe();
  e.end = new Proxy(e.end, {
    apply(e, r, o) {
      tt(n, t);
      return Reflect.apply(e, r, o);
    },
  });
  tt(n, e);
}
function ps(e) {
  return new Promise((t, n) => {
    e.oncomplete = e.onsuccess = () => t(e.result);
    e.onabort = e.onerror = () => n(e.error);
  });
}
function ds(e, t) {
  const n = indexedDB.open(e);
  n.onupgradeneeded = () => n.result.createObjectStore(t);
  const r = ps(n);
  return (e) => r.then((n) => e(n.transaction(t, "readwrite").objectStore(t)));
}
function gs(e) {
  return ps(e.getAllKeys());
}
function ms(e, t, n) {
  return e((e) =>
    gs(e).then((r) => {
      if (!(r.length >= n)) {
        e.put(t, Math.max(...r, 0) + 1);
        return ps(e.transaction);
      }
    }),
  );
}
function hs(e, t, n) {
  return e((e) =>
    gs(e).then((r) => {
      if (!(r.length >= n)) {
        e.put(t, Math.min(...r, 0) - 1);
        return ps(e.transaction);
      }
    }),
  );
}
function ys(e) {
  return e((e) =>
    gs(e).then((t) => {
      const n = t[0];
      if (n != null)
        return ps(e.get(n)).then((t) => {
          e.delete(n);
          return ps(e.transaction).then(() => t);
        });
    }),
  );
}
function vs(e) {
  let t;
  function n() {
    t == void 0 &&
      (t = ds(e.dbName || "sentry-offline", e.storeName || "queue"));
    return t;
  }
  return {
    push: async (t) => {
      try {
        const r = await oe(t);
        await ms(n(), r, e.maxQueueSize || 30);
      } catch {}
    },
    unshift: async (t) => {
      try {
        const r = await oe(t);
        await hs(n(), r, e.maxQueueSize || 30);
      } catch {}
    },
    shift: async () => {
      try {
        const e = await ys(n());
        if (e) return nt(e);
      } catch {}
    },
  };
}
function _s(e) {
  return (t) => {
    const n = e({ ...t, createStore: vs });
    $t.addEventListener("online", async (e) => {
      await n.flush();
    });
    return n;
  };
}
function bs(e = pn) {
  return _s(rt(e));
}
const Ss = 1e6;
const ws =
  "window" in r && r.window === r && typeof importScripts === "undefined";
const Ps = String(0);
const ks = ws ? "main" : "worker";
const Ts = $t.navigator;
let Es = "";
let Rs = "";
let Is = "";
let xs = Ts?.userAgent || "";
let Cs = "";
const Ls = Ts?.language || Ts?.languages?.[0] || "";
function Os(e) {
  return typeof e === "object" && e !== null && "getHighEntropyValues" in e;
}
const As = Ts?.userAgentData;
Os(As) &&
  As.getHighEntropyValues([
    "architecture",
    "model",
    "platform",
    "platformVersion",
    "fullVersionList",
  ])
    .then((e) => {
      Es = e.platform || "";
      Is = e.architecture || "";
      Cs = e.model || "";
      Rs = e.platformVersion || "";
      if (e.fullVersionList?.length) {
        const t = e.fullVersionList[e.fullVersionList.length - 1];
        xs = `${t.brand} ${t.version}`;
      }
    })
    .catch((e) => {});
function $s(e) {
  return !("thread_metadata" in e);
}
function Ds(e) {
  return $s(e) ? Us(e) : e;
}
function qs(e) {
  const t = e.contexts?.trace?.trace_id;
  typeof t === "string" &&
    t.length !== 32 &&
    dn &&
    O.log(`[Profiling] Invalid traceId: ${t} on profiled event`);
  return typeof t !== "string" ? "" : t;
}
/**
 * Creates a profiling event envelope from a Sentry event. If profile does not pass
 * validation, returns null.
 * @param event
 * @param dsn
 * @param metadata
 * @param tunnel
 * @returns {EventEnvelope | null}
 */ function Ms(e, t, n, r) {
  if (r.type !== "transaction")
    throw new TypeError(
      "Profiling events may only be attached to transactions, this should never occur.",
    );
  if (n === void 0 || n === null)
    throw new TypeError(
      `Cannot construct profiling event envelope without a valid profile. Got ${n} instead.`,
    );
  const o = qs(r);
  const s = Ds(n);
  const i =
    t ||
    (typeof r.start_timestamp === "number"
      ? r.start_timestamp * 1e3
      : Ye() * 1e3);
  const a = typeof r.timestamp === "number" ? r.timestamp * 1e3 : Ye() * 1e3;
  const c = {
    event_id: e,
    timestamp: new Date(i).toISOString(),
    platform: "javascript",
    version: "1",
    release: r.release || "",
    environment: r.environment || st,
    runtime: { name: "javascript", version: $t.navigator.userAgent },
    os: { name: Es, version: Rs, build_number: xs },
    device: {
      locale: Ls,
      model: Cs,
      manufacturer: xs,
      architecture: Is,
      is_emulator: false,
    },
    debug_meta: { images: Ws(n.resources) },
    profile: s,
    transactions: [
      {
        name: r.transaction || "",
        id: r.event_id || ot(),
        trace_id: o,
        active_thread_id: Ps,
        relative_start_ns: "0",
        relative_end_ns: (1e6 * (a - i)).toFixed(0),
      },
    ],
  };
  return c;
}
function Ns(e, t, n) {
  if (e == null)
    throw new TypeError(
      `Cannot construct profiling event envelope without a valid profile. Got ${e} instead.`,
    );
  const r = Hs(e);
  const o = t.getOptions();
  const s = t.getSdkMetadata?.()?.sdk;
  return {
    chunk_id: ot(),
    client_sdk: {
      name: s?.name ?? "sentry.javascript.browser",
      version: s?.version ?? "0.0.0",
    },
    profiler_id: n || ot(),
    platform: "javascript",
    version: "2",
    release: o.release ?? "",
    environment: o.environment ?? "production",
    debug_meta: { images: Ws(e.resources) },
    profile: r,
  };
}
function Fs(e) {
  try {
    if (!e || typeof e !== "object")
      return { reason: "chunk is not an object" };
    const t = (e) => typeof e === "string" && /^[a-f0-9]{32}$/.test(e);
    if (!t(e.profiler_id)) return { reason: "missing or invalid profiler_id" };
    if (!t(e.chunk_id)) return { reason: "missing or invalid chunk_id" };
    if (!e.client_sdk) return { reason: "missing client_sdk metadata" };
    const n = e.profile;
    return n
      ? Array.isArray(n.frames) && n.frames.length
        ? Array.isArray(n.stacks) && n.stacks.length
          ? Array.isArray(n.samples) && n.samples.length
            ? { valid: true }
            : { reason: "profile has no samples" }
          : { reason: "profile has no stacks" }
        : { reason: "profile has no frames" }
      : { reason: "missing profile data" };
  } catch (e) {
    return { reason: `unknown validation error: ${e}` };
  }
}
function Hs(e) {
  const t = [];
  for (let n = 0; n < e.frames.length; n++) {
    const r = e.frames[n];
    r &&
      (t[n] = {
        function: r.name,
        abs_path:
          typeof r.resourceId === "number" ? e.resources[r.resourceId] : void 0,
        lineno: r.line,
        colno: r.column,
      });
  }
  const n = [];
  for (let t = 0; t < e.stacks.length; t++) {
    const r = e.stacks[t];
    if (!r) continue;
    const o = [];
    let s = r;
    while (s) {
      o.push(s.frameId);
      s = s.parentId === void 0 ? void 0 : e.stacks[s.parentId];
    }
    n[t] = o;
  }
  const r = Ge();
  const o =
    typeof performance.timeOrigin === "number"
      ? performance.timeOrigin
      : r || 0;
  const s = o - (r || o);
  const i = [];
  for (let t = 0; t < e.samples.length; t++) {
    const n = e.samples[t];
    if (!n) continue;
    const r = (o + (n.timestamp - s)) / 1e3;
    i[t] = { stack_id: n.stackId ?? 0, thread_id: Ps, timestamp: r };
  }
  return {
    frames: t,
    stacks: n,
    samples: i,
    thread_metadata: { [Ps]: { name: ks } },
  };
}
function js(e) {
  return Se(e).op === "pageload";
}
function Us(e) {
  let t;
  let n = 0;
  const r = {
    samples: [],
    stacks: [],
    frames: [],
    thread_metadata: { [Ps]: { name: ks } },
  };
  const o = e.samples[0];
  if (!o) return r;
  const s = o.timestamp;
  const i = Ge();
  const a =
    typeof performance.timeOrigin === "number"
      ? performance.timeOrigin
      : i || 0;
  const c = a - (i || a);
  e.samples.forEach((o, i) => {
    if (o.stackId === void 0) {
      if (t === void 0) {
        t = n;
        r.stacks[t] = [];
        n++;
      }
      r.samples[i] = {
        elapsed_since_start_ns: ((o.timestamp + c - s) * Ss).toFixed(0),
        stack_id: t,
        thread_id: Ps,
      };
      return;
    }
    let a = e.stacks[o.stackId];
    const l = [];
    while (a) {
      l.push(a.frameId);
      const t = e.frames[a.frameId];
      t &&
        r.frames[a.frameId] === void 0 &&
        (r.frames[a.frameId] = {
          function: t.name,
          abs_path:
            typeof t.resourceId === "number"
              ? e.resources[t.resourceId]
              : void 0,
          lineno: t.line,
          colno: t.column,
        });
      a = a.parentId === void 0 ? void 0 : e.stacks[a.parentId];
    }
    const u = {
      elapsed_since_start_ns: ((o.timestamp + c - s) * Ss).toFixed(0),
      stack_id: n,
      thread_id: Ps,
    };
    r.stacks[n] = l;
    r.samples[i] = u;
    n++;
  });
  return r;
}
/**
 * Adds items to envelope if they are not already present - mutates the envelope.
 * @param envelope
 */ function Bs(e, t) {
  if (!t.length) return e;
  for (const n of t) e[1].push([{ type: "profile" }, n]);
  return e;
}
/**
 * Finds transactions with profile_id context in the envelope
 * @param envelope
 * @returns
 */ function zs(e) {
  const t = [];
  it(e, (e, n) => {
    if (n === "transaction")
      for (let n = 1; n < e.length; n++) {
        const r = e[n];
        r?.contexts?.profile?.profile_id && t.push(e[n]);
      }
  });
  return t;
}
function Ws(e) {
  const t = p();
  const n = t?.getOptions();
  const r = n?.stackParser;
  return r ? at(r, e) : [];
}
function Gs(e) {
  if (
    (typeof e !== "number" && typeof e !== "boolean") ||
    (typeof e === "number" && isNaN(e))
  ) {
    dn &&
      O.warn(
        `[Profiling] Invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(e)} of type ${JSON.stringify(typeof e)}.`,
      );
    return false;
  }
  if (e === true || e === false) return true;
  if (e < 0 || e > 1) {
    dn &&
      O.warn(
        `[Profiling] Invalid sample rate. Sample rate must be between 0 and 1. Got ${e}.`,
      );
    return false;
  }
  return true;
}
function Xs(e) {
  if (e.samples.length < 2) {
    dn &&
      O.log(
        "[Profiling] Discarding profile because it contains less than 2 samples",
      );
    return false;
  }
  if (!e.frames.length) {
    dn && O.log("[Profiling] Discarding profile because it contains no frames");
    return false;
  }
  return true;
}
let Ks = false;
const Ys = 3e4;
/**
 * Check if profiler constructor is available.
 * @param maybeProfiler
 */ function Vs(e) {
  return typeof e === "function";
}
function Js() {
  const e = $t.Profiler;
  if (!Vs(e)) {
    dn &&
      O.log(
        "[Profiling] Profiling is not supported by this browser, Profiler interface missing on window object.",
      );
    return;
  }
  const t = 10;
  const n = Math.floor(Ys / t);
  try {
    return new e({ sampleInterval: t, maxBufferSize: n });
  } catch (e) {
    if (dn) {
      O.log(
        "[Profiling] Failed to initialize the Profiling constructor, this is likely due to a missing 'Document-Policy': 'js-profiling' header.",
      );
      O.log("[Profiling] Disabling profiling for current user session.");
    }
    Ks = true;
  }
}
function Qs(e) {
  if (Ks) {
    dn &&
      O.log(
        "[Profiling] Profiling has been disabled for the duration of the current user session.",
      );
    return false;
  }
  if (!e.isRecording()) {
    dn &&
      O.log(
        "[Profiling] Discarding profile because root span was not sampled.",
      );
    return false;
  }
  const t = p();
  const n = t?.getOptions();
  if (!n) {
    dn && O.log("[Profiling] Profiling disabled, no options found.");
    return false;
  }
  const r = n.profilesSampleRate;
  if (!Gs(r)) {
    dn &&
      O.warn("[Profiling] Discarding profile because of invalid sample rate.");
    return false;
  }
  if (!r) {
    dn &&
      O.log(
        "[Profiling] Discarding profile because a negative sampling decision was inherited or profileSampleRate is set to 0",
      );
    return false;
  }
  const o = r === true || Math.random() < r;
  if (!o) {
    dn &&
      O.log(
        `[Profiling] Discarding profile because it's not included in the random sample (sampling rate = ${Number(r)})`,
      );
    return false;
  }
  return true;
}
function Zs(e) {
  if (Ks) {
    dn &&
      O.log(
        "[Profiling] Profiling has been disabled for the duration of the current user session as the JS Profiler could not be started.",
      );
    return false;
  }
  if (e.profileLifecycle !== "trace" && e.profileLifecycle !== "manual") {
    dn &&
      O.warn(
        "[Profiling] Session not sampled. Invalid `profileLifecycle` option.",
      );
    return false;
  }
  const t = e.profileSessionSampleRate;
  if (!Gs(t)) {
    dn &&
      O.warn(
        "[Profiling] Discarding profile because of invalid profileSessionSampleRate.",
      );
    return false;
  }
  if (!t) {
    dn &&
      O.log(
        "[Profiling] Discarding profile because profileSessionSampleRate is not defined or set to 0",
      );
    return false;
  }
  return Math.random() <= t;
}
function ei(e) {
  return typeof e.profilesSampleRate !== "undefined";
}
/**
 * Creates a profiling envelope item, if the profile does not pass validation, returns null.
 * @param event
 * @returns {Profile | null}
 */ function ti(e, t, n, r) {
  return Xs(n) ? Ms(e, t, n, r) : null;
}
const ni = new Map();
function ri() {
  return ni.size;
}
function oi(e) {
  const t = ni.get(e);
  t && ni.delete(e);
  return t;
}
function si(e, t) {
  ni.set(e, t);
  if (ni.size > 30) {
    const e = ni.keys().next().value;
    e !== void 0 && ni.delete(e);
  }
}
function ii(e) {
  if (!e?.contexts?.profile) return e;
  if (!e.contexts) return e;
  e.contexts.trace = {
    ...(e.contexts?.trace ?? {}),
    data: {
      ...(e.contexts?.trace?.data ?? {}),
      "thread.id": Ps,
      "thread.name": ks,
    },
  };
  e.spans?.forEach((e) => {
    e.data = { ...(e.data || {}), "thread.id": Ps, "thread.name": ks };
  });
  return e;
}
function ai(e) {
  let t;
  js(e) && (t = Ye() * 1e3);
  const n = Js();
  if (!n) return;
  dn && O.log(`[Profiling] started profiling span: ${Se(e).description}`);
  const r = ot();
  let o = null;
  pe().setContext("profile", { profile_id: r, start_timestamp: t });
  async function s() {
    if (e && n) {
      if (!o)
        return n
          .stop()
          .then((t) => {
            if (i) {
              $t.clearTimeout(i);
              i = void 0;
            }
            dn &&
              O.log(
                `[Profiling] stopped profiling of span: ${Se(e).description}`,
              );
            if (t) {
              o = t;
              si(r, t);
            } else
              dn &&
                O.log(
                  `[Profiling] profiler returned null profile for: ${Se(e).description}`,
                  "this may indicate an overlapping span or a call to stopProfiling with a profile title that was never started",
                );
          })
          .catch((e) => {
            dn && O.log("[Profiling] error while stopping profiler:", e);
          });
      dn &&
        O.log(
          "[Profiling] profile for:",
          Se(e).description,
          "already exists, returning early",
        );
    }
  }
  let i = $t.setTimeout(() => {
    dn &&
      O.log(
        "[Profiling] max profile duration elapsed, stopping profiling for:",
        Se(e).description,
      );
    s();
  }, Ys);
  const a = e.end.bind(e);
  function c() {
    if (!e) return a();
    void s().then(
      () => {
        a();
      },
      () => {
        a();
      },
    );
    return e;
  }
  e.end = c;
}
const ci = 6e4;
const li = 3e5;
class UIProfiler {
  constructor() {
    this._client = void 0;
    this._profiler = void 0;
    this._chunkTimer = void 0;
    this._profilerId = void 0;
    this._isRunning = false;
    this._sessionSampled = false;
    this._lifecycleMode = void 0;
    this._activeRootSpanIds = new Set();
    this._rootSpanTimeouts = new Map();
  }
  initialize(e) {
    const t = e.getOptions().profileLifecycle;
    const n = Zs(e.getOptions());
    dn && O.log(`[Profiling] Initializing profiler (lifecycle='${t}').`);
    n ||
      (dn &&
        O.log(
          "[Profiling] Session not sampled. Skipping lifecycle profiler initialization.",
        ));
    this._profilerId = ot();
    this._client = e;
    this._sessionSampled = n;
    this._lifecycleMode = t;
    t === "trace" && this._setupTraceLifecycleListeners(e);
  }
  start() {
    this._lifecycleMode !== "trace"
      ? this._isRunning
        ? dn &&
          O.warn(
            "[Profiling] Profile session is already running, `uiProfiler.start()` is a no-op.",
          )
        : this._sessionSampled
          ? this._beginProfiling()
          : dn &&
            O.warn(
              "[Profiling] Session is not sampled, `uiProfiler.start()` is a no-op.",
            )
      : dn &&
        O.warn(
          '[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.start()` are ignored in trace mode.',
        );
  }
  stop() {
    this._lifecycleMode !== "trace"
      ? this._isRunning
        ? this._endProfiling()
        : dn &&
          O.warn(
            "[Profiling] Profiler is not running, `uiProfiler.stop()` is a no-op.",
          )
      : dn &&
        O.warn(
          '[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.stop()` are ignored in trace mode.',
        );
  }
  notifyRootSpanActive(e) {
    if (this._lifecycleMode !== "trace" || !this._sessionSampled) return;
    const t = e.spanContext().spanId;
    if (!t || this._activeRootSpanIds.has(t)) return;
    this._registerTraceRootSpan(t);
    const n = this._activeRootSpanIds.size;
    if (n === 1) {
      dn &&
        O.log(
          "[Profiling] Detected already active root span during setup. Active root spans now:",
          n,
        );
      this._beginProfiling();
    }
  }
  _beginProfiling() {
    if (!this._isRunning) {
      this._isRunning = true;
      dn &&
        O.log(
          "[Profiling] Started profiling with profiler ID:",
          this._profilerId,
        );
      ct().setContext("profile", { profiler_id: this._profilerId });
      this._startProfilerInstance();
      if (this._profiler) this._startPeriodicChunking();
      else {
        dn && O.log("[Profiling] Failed to start JS Profiler; stopping.");
        this._resetProfilerInfo();
      }
    }
  }
  _endProfiling() {
    if (this._isRunning) {
      this._isRunning = false;
      if (this._chunkTimer) {
        clearTimeout(this._chunkTimer);
        this._chunkTimer = void 0;
      }
      this._clearAllRootSpanTimeouts();
      this._collectCurrentChunk().catch((e) => {
        dn &&
          O.error(
            "[Profiling] Failed to collect current profile chunk on `stop()`:",
            e,
          );
      });
      this._lifecycleMode === "manual" && ct().setContext("profile", {});
    }
  }
  _setupTraceLifecycleListeners(e) {
    e.on("spanStart", (e) => {
      if (!this._sessionSampled) {
        dn &&
          O.log(
            "[Profiling] Session not sampled because of negative sampling decision.",
          );
        return;
      }
      if (e !== De(e)) return;
      if (!e.isRecording()) {
        dn &&
          O.log(
            "[Profiling] Discarding profile because root span was not sampled.",
          );
        return;
      }
      const t = e.spanContext().spanId;
      if (!t || this._activeRootSpanIds.has(t)) return;
      this._registerTraceRootSpan(t);
      const n = this._activeRootSpanIds.size;
      if (n === 1) {
        dn &&
          O.log(
            `[Profiling] Root span ${t} started. Profiling active while there are active root spans (count=${n}).`,
          );
        this._beginProfiling();
      }
    });
    e.on("spanEnd", (e) => {
      if (!this._sessionSampled) return;
      const t = e.spanContext().spanId;
      if (!t || !this._activeRootSpanIds.has(t)) return;
      this._activeRootSpanIds.delete(t);
      const n = this._activeRootSpanIds.size;
      dn &&
        O.log(
          `[Profiling] Root span with ID ${t} ended. Will continue profiling for as long as there are active root spans (currently: ${n}).`,
        );
      if (n === 0) {
        this._collectCurrentChunk().catch((e) => {
          dn &&
            O.error(
              "[Profiling] Failed to collect current profile chunk on last `spanEnd`:",
              e,
            );
        });
        this._endProfiling();
      }
    });
  }
  _resetProfilerInfo() {
    this._isRunning = false;
    ct().setContext("profile", {});
  }
  _clearAllRootSpanTimeouts() {
    this._rootSpanTimeouts.forEach((e) => clearTimeout(e));
    this._rootSpanTimeouts.clear();
  }
  _registerTraceRootSpan(e) {
    this._activeRootSpanIds.add(e);
    const t = setTimeout(() => this._onRootSpanTimeout(e), li);
    this._rootSpanTimeouts.set(e, t);
  }
  _startProfilerInstance() {
    if (this._profiler?.stopped === false) return;
    const e = Js();
    e
      ? (this._profiler = e)
      : dn && O.log("[Profiling] Failed to start JS Profiler.");
  }
  _startPeriodicChunking() {
    this._isRunning &&
      (this._chunkTimer = setTimeout(() => {
        this._collectCurrentChunk().catch((e) => {
          dn &&
            O.error(
              "[Profiling] Failed to collect current profile chunk during periodic chunking:",
              e,
            );
        });
        if (this._isRunning) {
          this._startProfilerInstance();
          if (!this._profiler) {
            this._resetProfilerInfo();
            return;
          }
          this._startPeriodicChunking();
        }
      }, ci));
  }
  _onRootSpanTimeout(e) {
    if (this._rootSpanTimeouts.has(e)) {
      this._rootSpanTimeouts.delete(e);
      if (this._activeRootSpanIds.has(e)) {
        dn &&
          O.log(
            `[Profiling] Reached 5-minute timeout for root span ${e}. You likely started a manual root span that never called \`.end()\`.`,
          );
        this._activeRootSpanIds.delete(e);
        this._activeRootSpanIds.size === 0 && this._endProfiling();
      }
    }
  }
  async _collectCurrentChunk() {
    const e = this._profiler;
    this._profiler = void 0;
    if (e)
      try {
        const t = await e.stop();
        const n = Ns(t, this._client, this._profilerId);
        const r = Fs(n);
        if ("reason" in r) {
          dn &&
            O.log(
              "[Profiling] Discarding invalid profile chunk (this is probably a bug in the SDK):",
              r.reason,
            );
          return;
        }
        this._sendProfileChunk(n);
        dn && O.log("[Profiling] Collected browser profile chunk.");
      } catch (e) {
        dn &&
          O.log("[Profiling] Error while stopping JS Profiler for chunk:", e);
      }
  }
  _sendProfileChunk(e) {
    const t = this._client;
    const n = lt(t.getSdkMetadata?.());
    const r = t.getDsn();
    const o = t.getOptions().tunnel;
    const s = q(
      {
        event_id: ot(),
        sent_at: new Date().toISOString(),
        ...(n && { sdk: n }),
        ...(!!o && r && { dsn: D(r) }),
      },
      [[{ type: "profile_chunk" }, e]],
    );
    t.sendEnvelope(s).then(null, (e) => {
      dn && O.error("Error while sending profile chunk envelope:", e);
    });
  }
}
const ui = "BrowserProfiling";
const fi = () => ({
  name: ui,
  setup(e) {
    const t = e.getOptions();
    const n = new UIProfiler();
    ei(t) || t.profileLifecycle || (t.profileLifecycle = "manual");
    if (ei(t) && !t.profilesSampleRate) {
      dn &&
        O.log("[Profiling] Profiling disabled, no profiling options found.");
      return;
    }
    const r = Ce();
    const o = r && De(r);
    ei(t) &&
      t.profileSessionSampleRate !== void 0 &&
      dn &&
      O.warn(
        "[Profiling] Both legacy profiling (`profilesSampleRate`) and UI profiling settings are defined. `profileSessionSampleRate` has no effect when legacy profiling is enabled.",
      );
    if (ei(t)) {
      o && js(o) && Qs(o) && ai(o);
      e.on("spanStart", (e) => {
        e === De(e) && Qs(e) && ai(e);
      });
      e.on("beforeEnvelope", (e) => {
        if (!ri()) return;
        const t = zs(e);
        if (!t.length) return;
        const n = [];
        for (const e of t) {
          const t = e?.contexts;
          const r = t?.profile?.profile_id;
          const o = t?.profile?.start_timestamp;
          if (typeof r !== "string") {
            dn &&
              O.log(
                "[Profiling] cannot find profile for a span without a profile context",
              );
            continue;
          }
          if (!r) {
            dn &&
              O.log(
                "[Profiling] cannot find profile for a span without a profile context",
              );
            continue;
          }
          t?.profile && delete t.profile;
          const s = oi(r);
          if (!s) {
            dn &&
              O.log(`[Profiling] Could not retrieve profile for span: ${r}`);
            continue;
          }
          const i = ti(r, o, s, e);
          i && n.push(i);
        }
        Bs(e, n);
      });
    } else {
      const r = t.profileLifecycle;
      e.on("startUIProfiler", () => n.start());
      e.on("stopUIProfiler", () => n.stop());
      if (r === "manual") n.initialize(e);
      else if (r === "trace") {
        if (!Ie(t)) {
          dn &&
            O.warn(
              "[Profiling] `profileLifecycle` is 'trace' but tracing is disabled. Set a `tracesSampleRate` or `tracesSampler` to enable span tracing.",
            );
          return;
        }
        n.initialize(e);
        o && n.notifyRootSpanActive(o);
        $t.setTimeout(() => {
          const e = Ce();
          const t = e && De(e);
          t && n.notifyRootSpanActive(t);
        }, 0);
      }
    }
  },
  processEvent(e) {
    return ii(e);
  },
});
const pi = F(fi);
const di = F(() => ({
  name: "LaunchDarkly",
  processEvent(e, t, n) {
    return ut(e);
  },
}));
function gi() {
  return {
    name: "sentry-flag-auditor",
    type: "flag-used",
    synchronous: true,
    method: (e, t, n) => {
      ft(e, t.value);
      pt(e, t.value);
    },
  };
}
const mi = F(() => ({
  name: "OpenFeature",
  processEvent(e, t, n) {
    return ut(e);
  },
}));
class OpenFeatureIntegrationHook {
  after(e, t) {
    ft(t.flagKey, t.value);
    pt(t.flagKey, t.value);
  }
  error(e, t, n) {
    ft(e.flagKey, e.defaultValue);
    pt(e.flagKey, e.defaultValue);
  }
}
const hi = F(({ featureFlagClientClass: e }) => ({
  name: "Unleash",
  setupOnce() {
    const t = e.prototype;
    K(t, "isEnabled", yi);
  },
  processEvent(e, t, n) {
    return ut(e);
  },
}));
/**
 * Wraps the UnleashClient.isEnabled method to capture feature flag evaluations. Its only side effect is writing to Sentry scope.
 *
 * This wrapper is safe for all isEnabled signatures. If the signature does not match (this: UnleashClient, toggleName: string, ...args: unknown[]) => boolean,
 * we log an error and return the original result.
 *
 * @param original - The original method.
 * @returns Wrapped method. Results should match the original.
 */ function yi(e) {
  return function (...t) {
    const n = t[0];
    const r = e.apply(this, t);
    if (typeof n === "string" && typeof r === "boolean") {
      ft(n, r);
      pt(n, r);
    } else
      dn &&
        O.error(
          `[Feature Flags] UnleashClient.isEnabled does not match expected signature. arg0: ${n} (${typeof n}), result: ${r} (${typeof r})`,
        );
    return r;
  };
}
const vi = ({ growthbookClass: e }) => dt({ growthbookClass: e });
const _i = F(({ featureFlagClient: e }) => ({
  name: "Statsig",
  setup(t) {
    e.on("gate_evaluation", (e) => {
      ft(e.gate.name, e.gate.value);
      pt(e.gate.name, e.gate.value);
    });
  },
  processEvent(e, t, n) {
    return ut(e);
  },
}));
async function bi() {
  const e = p();
  if (!e) return "no-client-active";
  if (!e.getDsn()) return "no-dsn-configured";
  try {
    await gt(() =>
      fetch(
        "https://o447951.ingest.sentry.io/api/4509632503087104/envelope/?sentry_version=7&sentry_key=c1dfb07d783ad5325c245c1fd3725390&sentry_client=sentry.javascript.browser%2F1.33.7",
        { body: "{}", method: "POST", mode: "cors", credentials: "omit" },
      ),
    );
  } catch {
    return "sentry-unreachable";
  }
}
const Si = "WebWorker";
/**
 * Use this integration to set up Sentry with web workers.
 *
 * IMPORTANT: This integration must be added **before** you start listening to
 * any messages from the worker. Otherwise, your message handlers will receive
 * messages from the Sentry SDK which you need to ignore.
 *
 * This integration only has an effect, if you call `Sentry.registerWebWorker(self)`
 * from within the worker(s) you're adding to the integration.
 *
 * Given that you want to initialize the SDK as early as possible, you most likely
 * want to add this integration **after** initializing the SDK:
 *
 * @example:
 * ```ts filename={main.js}
 * import * as Sentry from '@sentry/<your-sdk>';
 *
 * // some time earlier:
 * Sentry.init(...)
 *
 * // 1. Initialize the worker
 * const worker = new Worker(new URL('./worker.ts', import.meta.url));
 *
 * // 2. Add the integration
 * const webWorkerIntegration = Sentry.webWorkerIntegration({ worker });
 * Sentry.addIntegration(webWorkerIntegration);
 *
 * // 3. Register message listeners on the worker
 * worker.addEventListener('message', event => {
 *  // ...
 * });
 * ```
 *
 * If you initialize multiple workers at the same time, you can also pass an array of workers
 * to the integration:
 *
 * ```ts filename={main.js}
 * const webWorkerIntegration = Sentry.webWorkerIntegration({ worker: [worker1, worker2] });
 * Sentry.addIntegration(webWorkerIntegration);
 * ```
 *
 * If you have any additional workers that you initialize at a later point,
 * you can add them to the integration as follows:
 *
 * ```ts filename={main.js}
 * const webWorkerIntegration = Sentry.webWorkerIntegration({ worker: worker1 });
 * Sentry.addIntegration(webWorkerIntegration);
 *
 * // sometime later:
 * webWorkerIntegration.addWorker(worker2);
 * ```
 *
 * Of course, you can also directly add the integration in Sentry.init:
 * ```ts filename={main.js}
 * import * as Sentry from '@sentry/<your-sdk>';
 *
 * // 1. Initialize the worker
 * const worker = new Worker(new URL('./worker.ts', import.meta.url));
 *
 * // 2. Initialize the SDK
 * Sentry.init({
 *  integrations: [Sentry.webWorkerIntegration({ worker })]
 * });
 *
 * // 3. Register message listeners on the worker
 * worker.addEventListener('message', event => {
 *  // ...
 * });
 * ```
 *
 * @param options {WebWorkerIntegrationOptions} Integration options:
 *   - `worker`: The worker instance.
 */ const wi = F(({ worker: e }) => ({
  name: Si,
  setupOnce: () => {
    (Array.isArray(e) ? e : [e]).forEach((e) => Pi(e));
  },
  addWorker: (e) => Pi(e),
}));
function Pi(e) {
  e.addEventListener("message", (e) => {
    if (Ei(e.data)) {
      e.stopImmediatePropagation();
      if (e.data._sentryDebugIds) {
        dn && O.log("Sentry debugId web worker message received", e.data);
        $t._sentryDebugIds = {
          ...e.data._sentryDebugIds,
          ...$t._sentryDebugIds,
        };
      }
      if (e.data._sentryWorkerError) {
        dn &&
          O.log(
            "Sentry worker rejection message received",
            e.data._sentryWorkerError,
          );
        ki(e.data._sentryWorkerError);
      }
    }
  });
}
function ki(e) {
  const t = p();
  if (!t) return;
  const n = t.getOptions().stackParser;
  const r = t.getOptions().attachStacktrace;
  const o = e.reason;
  const s = te(o) ? Sr(o) : on(n, o, void 0, r, true);
  s.level = "error";
  e.filename &&
    (s.contexts = { ...s.contexts, worker: { filename: e.filename } });
  Z(s, {
    originalException: o,
    mechanism: {
      handled: false,
      type: "auto.browser.web_worker.onunhandledrejection",
    },
  });
  dn && O.log("Captured worker unhandled rejection", o);
}
/**
 * Use this function to register the worker with the Sentry SDK.
 *
 * This function will:
 * - Send debug IDs to the parent thread
 * - Set up a handler for unhandled rejections in the worker
 * - Forward unhandled rejections to the parent thread for capture
 *
 * Note: Synchronous errors in workers are already captured by globalHandlers.
 * This only handles unhandled promise rejections which don't bubble to the parent.
 *
 * @example
 * ```ts filename={worker.js}
 * import * as Sentry from '@sentry/<your-sdk>';
 *
 * // Do this as early as possible in your worker.
 * Sentry.registerWebWorker({ self });
 *
 * // continue setting up your worker
 * self.postMessage(...)
 * ```
 * @param options {RegisterWebWorkerOptions} Integration options:
 *   - `self`: The worker instance you're calling this function from (self).
 */ function Ti({ self: e }) {
  e.postMessage({
    _sentryMessage: true,
    _sentryDebugIds: e._sentryDebugIds ?? void 0,
  });
  e.addEventListener("unhandledrejection", (t) => {
    const n = br(t);
    const r = { reason: n, filename: e.location?.href };
    e.postMessage({ _sentryMessage: true, _sentryWorkerError: r });
    dn && O.log("[Sentry Worker] Forwarding unhandled rejection to parent", r);
  });
  dn &&
    O.log(
      "[Sentry Worker] Registered worker with unhandled rejection handling",
    );
}
function Ei(e) {
  if (!S(e) || e._sentryMessage !== true) return false;
  const t = "_sentryDebugIds" in e;
  const n = "_sentryWorkerError" in e;
  return (
    !(!t && !n) &&
    !(t && !S(e._sentryDebugIds) && e._sentryDebugIds !== void 0) &&
    !(n && !S(e._sentryWorkerError))
  );
}
export {
  BrowserClient,
  OpenFeatureIntegrationHook,
  $t as WINDOW,
  Vn as breadcrumbsIntegration,
  ar as browserApiErrorsIntegration,
  pi as browserProfilingIntegration,
  gr as browserSessionIntegration,
  es as browserTracingIntegration,
  gi as buildLaunchDarklyFlagUsedHandler,
  In as chromeStackLineParser,
  vo as contextLinesIntegration,
  Wn as createUserFeedbackEnvelope,
  qo as defaultRequestInstrumentationOptions,
  Un as defaultStackLineParsers,
  Bn as defaultStackParser,
  bi as diagnoseSdkConnectivity,
  nn as eventFromException,
  rn as eventFromMessage,
  Gt as exceptionFromError,
  zt as feedbackAsyncIntegration,
  Wt as feedbackIntegration,
  Wt as feedbackSyncIntegration,
  jr as forceLoad,
  On as geckoStackLineParser,
  Fr as getDefaultIntegrations,
  yr as globalHandlersIntegration,
  xo as graphqlClientIntegration,
  vi as growthbookIntegration,
  Jr as httpClientIntegration,
  Er as httpContextIntegration,
  Hr as init,
  Mo as instrumentOutgoingRequests,
  di as launchDarklyIntegration,
  Ut as lazyLoadIntegration,
  Lr as linkedErrorsIntegration,
  bs as makeBrowserOfflineTransport,
  pn as makeFetchTransport,
  Ur as onLoad,
  mi as openFeatureIntegration,
  Nn as opera10StackLineParser,
  jn as opera11StackLineParser,
  Ti as registerWebWorker,
  us as reportPageLoaded,
  Kr as reportingObserverIntegration,
  fs as setActiveSpanInBrowser,
  Br as showReportDialog,
  Dr as spotlightBrowserIntegration,
  ns as startBrowserTracingNavigationSpan,
  ts as startBrowserTracingPageLoadSpan,
  _i as statsigIntegration,
  hn as uiProfiler,
  hi as unleashIntegration,
  wi as webWorkerIntegration,
  Dn as winjsStackLineParser,
};
