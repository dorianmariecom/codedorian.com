// @sentry/browser@10.40.0 downloaded from https://ga.jspm.io/npm:@sentry/browser@10.40.0/build/npm/esm/prod/index.js

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
  getLocationHref as d,
  getClient as f,
  SDK_VERSION as p,
  normalizeToSize as g,
  isEvent as m,
  _INTERNAL_enhanceErrorWithSentryInfo as h,
  resolvedSyncPromise as y,
  isErrorEvent as _,
  isDOMError as v,
  isDOMException as b,
  isError as S,
  isPlainObject as w,
  isParameterizedString as k,
  extractExceptionKeysForMessage as P,
  Client as T,
  getSDKSource as E,
  applySdkMetadata as I,
  _INTERNAL_flushLogsBuffer as x,
  _INTERNAL_flushMetricsBuffer as R,
  addAutoIpAddressToSession as C,
  createTransport as L,
  makePromiseBuffer as O,
  debug as A,
  UNKNOWN_FUNCTION as $,
  createStackParser as D,
  dsnToString as q,
  createEnvelope as M,
  addConsoleInstrumentationHandler as N,
  addFetchInstrumentationHandler as F,
  defineIntegration as H,
  addBreadcrumb as j,
  getEventDescription as U,
  htmlTreeAsString as B,
  getComponentName as W,
  safeJoin as z,
  severityLevelFromString as G,
  getBreadcrumbLogLevelFromHttpStatusCode as X,
  parseUrl as K,
  fill as Y,
  getFunctionName as J,
  startSession as V,
  captureSession as Q,
  getIsolationScope as Z,
  addGlobalErrorInstrumentationHandler as ee,
  captureEvent as te,
  addGlobalUnhandledRejectionInstrumentationHandler as ne,
  isPrimitive as re,
  isString as oe,
  stripDataUrlContent as se,
  applyAggregateErrorsToEvent as ie,
  serializeEnvelope as ae,
  consoleSandbox as ce,
  inboundFiltersIntegration as le,
  functionToStringIntegration as ue,
  conversationIdIntegration as de,
  dedupeIntegration as fe,
  getIntegrationsToSetup as pe,
  stackParserFromStackParserOptions as ge,
  initAndBind as me,
  getCurrentScope as he,
  lastEventId as ye,
  getReportDialogEndpoint as _e,
  captureMessage as ve,
  supportsReportingObserver as be,
  supportsNativeFetch as Se,
  isSentryRequestUrl as we,
  stripUrlQueryAndFragment as ke,
  addContextToFrame as Pe,
  spanToJSON as Te,
  SEMANTIC_ATTRIBUTE_SENTRY_OP as Ee,
  SEMANTIC_ATTRIBUTE_URL_FULL as Ie,
  SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD as xe,
  stringMatchesSomePattern as Re,
  addFetchEndInstrumentationHandler as Ce,
  instrumentFetchRequest as Le,
  hasSpansEnabled as Oe,
  setHttpStatus as Ae,
  getActiveSpan as $e,
  startInactiveSpan as De,
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN as qe,
  SentryNonRecordingSpan as Me,
  getTraceData as Ne,
  getRootSpan as Fe,
  SPAN_STATUS_ERROR as He,
  SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE as je,
  SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE as Ue,
  SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE as Be,
  TRACING_DEFAULTS as We,
  SEMANTIC_ATTRIBUTE_SENTRY_SOURCE as ze,
  dateTimestampInSeconds as Ge,
  startIdleSpan as Xe,
  getDynamicSamplingContextFromSpan as Ke,
  spanIsSampled as Ye,
  browserPerformanceTimeOrigin as Je,
  parseStringToURLObject as Ve,
  registerSpanErrorInstrumentation as Qe,
  timestampInSeconds as Ze,
  SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON as et,
  generateSpanId as tt,
  generateTraceId as nt,
  propagationContextFromHeaders as rt,
  _INTERNAL_setSpanForScope as ot,
  parseEnvelope as st,
  makeOfflineTransport as it,
  uuid4 as at,
  DEFAULT_ENVIRONMENT as ct,
  forEachEnvelopeItem as lt,
  getDebugImagesForResources as ut,
  getGlobalScope as dt,
  getSdkMetadataForEnvelopeHeader as ft,
  _INTERNAL_copyFlagsFromScopeToEvent as pt,
  _INTERNAL_insertFlagToScope as gt,
  _INTERNAL_addFeatureFlagToActiveSpan as mt,
  growthbookIntegration as ht,
  suppressTracing as yt,
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
  getNativeImplementation as _t,
  clearCachedImplementation as vt,
  addClickKeypressInstrumentationHandler as bt,
  addXhrInstrumentationHandler as St,
  addHistoryInstrumentationHandler as wt,
  SENTRY_XHR_DATA_KEY as kt,
  getBodyString as Pt,
  getFetchRequestArgBody as Tt,
  addPerformanceInstrumentationHandler as Et,
  resourceTimingToSpanAttributes as It,
  parseXhrResponseHeaders as xt,
  addPerformanceEntries as Rt,
  registerInpInteractionListener as Ct,
  startTrackingWebVitals as Lt,
  startTrackingINP as Ot,
  startTrackingElementTiming as At,
  startTrackingLongAnimationFrames as $t,
  startTrackingLongTasks as Dt,
  startTrackingInteractions as qt,
} from "@sentry-internal/browser-utils";
export { getReplay, replayIntegration } from "@sentry-internal/replay";
export { replayCanvasIntegration } from "@sentry-internal/replay-canvas";
const Mt = r;
let Nt = 0;
function Ft() {
  return Nt > 0;
}
function Ht() {
  Nt++;
  setTimeout(() => {
    Nt--;
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
 */ function jt(e, t = {}) {
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
      const r = n.map((e) => jt(e, t));
      return e.apply(this, r);
    } catch (e) {
      Ht();
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
function Ut() {
  const e = d();
  const { referrer: t } = Mt.document || {};
  const { userAgent: n } = Mt.navigator || {};
  const r = { ...(t && { Referer: t }), ...(n && { "User-Agent": n }) };
  const o = { url: e, headers: r };
  return o;
}
const Bt = {
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
const Wt = Mt;
async function zt(e, t) {
  const n = Bt[e];
  const r = (Wt.Sentry = Wt.Sentry || {});
  if (!n) throw new Error(`Cannot lazy load integration: ${e}`);
  const o = r[e];
  if (typeof o === "function" && !("_isShim" in o)) return o;
  const s = Gt(n);
  const i = Mt.document.createElement("script");
  i.src = s;
  i.crossOrigin = "anonymous";
  i.referrerPolicy = "strict-origin";
  t && i.setAttribute("nonce", t);
  const a = new Promise((e, t) => {
    i.addEventListener("load", () => e());
    i.addEventListener("error", t);
  });
  const c = Mt.document.currentScript;
  const l = Mt.document.body || Mt.document.head || c?.parentElement;
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
function Gt(e) {
  const t = f();
  const n = t?.getOptions()?.cdnBaseUrl || "https://browser.sentry-cdn.com";
  return new URL(`/${p}/${e}.min.js`, n).toString();
}
const Xt = e({ lazyLoadIntegration: zt });
const Kt = e({
  getModalIntegration: () => n,
  getScreenshotIntegration: () => t,
});
function Yt(e, t) {
  const n = Qt(e, t);
  const r = { type: rn(t), value: on(t) };
  n.length && (r.stacktrace = { frames: n });
  r.type === void 0 &&
    r.value === "" &&
    (r.value = "Unrecoverable error caught");
  return r;
}
function Jt(e, t, n, r) {
  const o = f();
  const s = o?.getOptions().normalizeDepth;
  const i = fn(t);
  const a = { __serialized__: g(t, s) };
  if (i) return { exception: { values: [Yt(e, i)] }, extra: a };
  const c = {
    exception: {
      values: [
        {
          type: m(t) ? t.constructor.name : r ? "UnhandledRejection" : "Error",
          value: un(t, { isUnhandledRejection: r }),
        },
      ],
    },
    extra: a,
  };
  if (n) {
    const t = Qt(e, n);
    t.length && (c.exception.values[0].stacktrace = { frames: t });
  }
  return c;
}
function Vt(e, t) {
  return { exception: { values: [Yt(e, t)] } };
}
function Qt(e, t) {
  const n = t.stacktrace || t.stack || "";
  const r = en(t);
  const o = tn(t);
  try {
    return e(n, r, o);
  } catch {}
  return [];
}
const Zt = /Minified React error #\d+;/i;
function en(e) {
  return e && Zt.test(e.message) ? 1 : 0;
}
function tn(e) {
  return typeof e.framesToPop === "number" ? e.framesToPop : 0;
}
function nn(e) {
  return (
    typeof WebAssembly !== "undefined" &&
    typeof WebAssembly.Exception !== "undefined" &&
    e instanceof WebAssembly.Exception
  );
}
function rn(e) {
  const t = e?.name;
  if (!t && nn(e)) {
    const t = e.message && Array.isArray(e.message) && e.message.length == 2;
    return t ? e.message[0] : "WebAssembly.Exception";
  }
  return t;
}
function on(e) {
  const t = e?.message;
  return nn(e)
    ? Array.isArray(e.message) && e.message.length == 2
      ? e.message[1]
      : "wasm exception"
    : t
      ? t.error && typeof t.error.message === "string"
        ? h(t.error)
        : h(e)
      : "No error message";
}
function sn(e, t, n, r) {
  const o = n?.syntheticException || void 0;
  const s = cn(e, t, o, r);
  a(s);
  s.level = "error";
  n?.event_id && (s.event_id = n.event_id);
  return y(s);
}
function an(e, t, n = "info", r, o) {
  const s = r?.syntheticException || void 0;
  const i = ln(e, t, s, o);
  i.level = n;
  r?.event_id && (i.event_id = r.event_id);
  return y(i);
}
function cn(e, t, n, r, o) {
  let s;
  if (_(t) && t.error) {
    const n = t;
    return Vt(e, n.error);
  }
  if (v(t) || b(t)) {
    const o = t;
    if ("stack" in t) s = Vt(e, t);
    else {
      const t = o.name || (v(o) ? "DOMError" : "DOMException");
      const a = o.message ? `${t}: ${o.message}` : t;
      s = ln(e, a, n, r);
      i(s, a);
    }
    "code" in o && (s.tags = { ...s.tags, "DOMException.code": `${o.code}` });
    return s;
  }
  if (S(t)) return Vt(e, t);
  if (w(t) || m(t)) {
    const r = t;
    s = Jt(e, r, n, o);
    a(s, { synthetic: true });
    return s;
  }
  s = ln(e, t, n, r);
  i(s, `${t}`, void 0);
  a(s, { synthetic: true });
  return s;
}
function ln(e, t, n, r) {
  const o = {};
  if (r && n) {
    const r = Qt(e, n);
    r.length &&
      (o.exception = { values: [{ value: t, stacktrace: { frames: r } }] });
    a(o, { synthetic: true });
  }
  if (k(t)) {
    const { __sentry_template_string__: e, __sentry_template_values__: n } = t;
    o.logentry = { message: e, params: n };
    return o;
  }
  o.message = t;
  return o;
}
function un(e, { isUnhandledRejection: t }) {
  const n = P(e);
  const r = t ? "promise rejection" : "exception";
  if (_(e))
    return `Event \`ErrorEvent\` captured as ${r} with message \`${e.message}\``;
  if (m(e)) {
    const t = dn(e);
    return `Event \`${t}\` (type=${e.type}) captured as ${r}`;
  }
  return `Object captured as ${r} with keys: ${n}`;
}
function dn(e) {
  try {
    const t = Object.getPrototypeOf(e);
    return t ? t.constructor.name : void 0;
  } catch {}
}
function fn(e) {
  for (const t in e)
    if (Object.prototype.hasOwnProperty.call(e, t)) {
      const n = e[t];
      if (n instanceof Error) return n;
    }
}
class BrowserClient extends T {
  /**
   * Creates a new Browser SDK instance.
   *
   * @param options Configuration options for this SDK.
   */
  constructor(e) {
    const t = pn(e);
    const n = Mt.SENTRY_SDK_SOURCE || E();
    I(t, "browser", ["browser"], n);
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
    Mt.document &&
      (o || s || c) &&
      Mt.document.addEventListener("visibilitychange", () => {
        if (Mt.document.visibilityState === "hidden") {
          o && this._flushOutcomes();
          s && x(this);
          c && R(this);
        }
      });
    r && this.on("beforeSendSession", C);
  }
  eventFromException(e, t) {
    return sn(this._options.stackParser, e, t, this._options.attachStacktrace);
  }
  eventFromMessage(e, t = "info", n) {
    return an(
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
function pn(e) {
  return {
    release:
      typeof __SENTRY_RELEASE__ === "string"
        ? __SENTRY_RELEASE__
        : Mt.SENTRY_RELEASE?.id,
    sendClientReports: true,
    parentSpanIsAlwaysRootSpan: true,
    ...e,
  };
}
const gn = 40;
function mn(e, t = _t("fetch")) {
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
      vt("fetch");
      throw e;
    } finally {
      n -= s;
      r--;
    }
  }
  return L(e, o, O(e.bufferSize || gn));
}
const hn = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
function yn() {
  const e = f();
  if (!e) {
    hn && A.warn("No Sentry client available, profiling is not started");
    return;
  }
  const t = e.getIntegrationByName("BrowserProfiling");
  t
    ? e.emit("startUIProfiler")
    : hn && A.warn("BrowserProfiling integration is not available");
}
function _n() {
  const e = f();
  if (!e) {
    hn && A.warn("No Sentry client available, profiling is not started");
    return;
  }
  const t = e.getIntegrationByName("BrowserProfiling");
  t
    ? e.emit("stopUIProfiler")
    : hn && A.warn("ProfilingIntegration is not available");
}
const vn = { startProfiler: yn, stopProfiler: _n };
const bn = 10;
const Sn = 20;
const wn = 30;
const kn = 40;
const Pn = 50;
function Tn(e, t, n, r) {
  const o = {
    filename: e,
    function: t === "<anonymous>" ? $ : t,
    in_app: true,
  };
  n !== void 0 && (o.lineno = n);
  r !== void 0 && (o.colno = r);
  return o;
}
const En = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
const In =
  /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
const xn = /\((\S*)(?::(\d+))(?::(\d+))\)/;
const Rn = /at (.+?) ?\(data:(.+?),/;
const Cn = (e) => {
  const t = e.match(Rn);
  if (t) return { filename: `<data:${t[2]}>`, function: t[1] };
  const n = En.exec(e);
  if (n) {
    const [, e, t, r] = n;
    return Tn(e, $, +t, +r);
  }
  const r = In.exec(e);
  if (r) {
    const e = r[2] && r[2].indexOf("eval") === 0;
    if (e) {
      const e = xn.exec(r[2]);
      if (e) {
        r[2] = e[1];
        r[3] = e[2];
        r[4] = e[3];
      }
    }
    const [t, n] = Xn(r[1] || $, r[2]);
    return Tn(n, t, r[3] ? +r[3] : void 0, r[4] ? +r[4] : void 0);
  }
};
const Ln = [wn, Cn];
const On =
  /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
const An = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
const $n = (e) => {
  const t = On.exec(e);
  if (t) {
    const e = t[3] && t[3].indexOf(" > eval") > -1;
    if (e) {
      const e = An.exec(t[3]);
      if (e) {
        t[1] = t[1] || "eval";
        t[3] = e[1];
        t[4] = e[2];
        t[5] = "";
      }
    }
    let n = t[3];
    let r = t[1] || $;
    [r, n] = Xn(r, n);
    return Tn(n, r, t[4] ? +t[4] : void 0, t[5] ? +t[5] : void 0);
  }
};
const Dn = [Pn, $n];
const qn =
  /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
const Mn = (e) => {
  const t = qn.exec(e);
  return t ? Tn(t[2], t[1] || $, +t[3], t[4] ? +t[4] : void 0) : void 0;
};
const Nn = [kn, Mn];
const Fn = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i;
const Hn = (e) => {
  const t = Fn.exec(e);
  return t ? Tn(t[2], t[3] || $, +t[1]) : void 0;
};
const jn = [bn, Hn];
const Un =
  / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i;
const Bn = (e) => {
  const t = Un.exec(e);
  return t ? Tn(t[5], t[3] || t[4] || $, +t[1], +t[2]) : void 0;
};
const Wn = [Sn, Bn];
const zn = [Ln, Dn];
const Gn = D(...zn);
const Xn = (e, t) => {
  const n = e.indexOf("safari-extension") !== -1;
  const r = e.indexOf("safari-web-extension") !== -1;
  return n || r
    ? [
        e.indexOf("@") !== -1 ? e.split("@")[0] : $,
        n ? `safari-extension:${t}` : `safari-web-extension:${t}`,
      ]
    : [e, t];
};
function Kn(e, { metadata: t, tunnel: n, dsn: r }) {
  const o = {
    event_id: e.event_id,
    sent_at: new Date().toISOString(),
    ...(t?.sdk && { sdk: { name: t.sdk.name, version: t.sdk.version } }),
    ...(!!n && !!r && { dsn: q(r) }),
  };
  const s = Yn(e);
  return M(o, [s]);
}
function Yn(e) {
  const t = { type: "user_report" };
  return [t, e];
}
const Jn = 1024;
const Vn = "Breadcrumbs";
const Qn = (e = {}) => {
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
    name: Vn,
    setup(e) {
      t.console && N(nr(e));
      t.dom && bt(tr(e, t.dom));
      t.xhr && St(rr(e));
      t.fetch && F(or(e));
      t.history && wt(sr(e));
      t.sentry && e.on("beforeSendEvent", er(e));
    },
  };
};
const Zn = H(Qn);
function er(e) {
  return function (t) {
    f() === e &&
      j(
        {
          category:
            "sentry." + (t.type === "transaction" ? "transaction" : "event"),
          event_id: t.event_id,
          level: t.level,
          message: U(t),
        },
        { event: t },
      );
  };
}
function tr(e, t) {
  return function (n) {
    if (f() !== e) return;
    let r;
    let o;
    let s = typeof t === "object" ? t.serializeAttribute : void 0;
    let i =
      typeof t === "object" && typeof t.maxStringLength === "number"
        ? t.maxStringLength
        : void 0;
    if (i && i > Jn) {
      hn &&
        A.warn(
          `\`dom.maxStringLength\` cannot exceed ${Jn}, but a value of ${i} was configured. Sentry will use ${Jn} instead.`,
        );
      i = Jn;
    }
    typeof s === "string" && (s = [s]);
    try {
      const e = n.event;
      const t = ir(e) ? e.target : e;
      r = B(t, { keyAttrs: s, maxStringLength: i });
      o = W(t);
    } catch {
      r = "<unknown>";
    }
    if (r.length === 0) return;
    const a = { category: `ui.${n.name}`, message: r };
    o && (a.data = { "ui.component_name": o });
    j(a, { event: n.event, name: n.name, global: n.global });
  };
}
function nr(e) {
  return function (t) {
    if (f() !== e) return;
    const n = {
      category: "console",
      data: { arguments: t.args, logger: "console" },
      level: G(t.level),
      message: z(t.args, " "),
    };
    if (t.level === "assert") {
      if (t.args[0] !== false) return;
      n.message = `Assertion failed: ${z(t.args.slice(1), " ") || "console.assert"}`;
      n.data.arguments = t.args.slice(1);
    }
    j(n, { input: t.args, level: t.level });
  };
}
function rr(e) {
  return function (t) {
    if (f() !== e) return;
    const { startTimestamp: n, endTimestamp: r } = t;
    const o = t.xhr[kt];
    if (!n || !r || !o) return;
    const { method: s, url: i, status_code: a, body: c } = o;
    const l = { method: s, url: i, status_code: a };
    const u = { xhr: t.xhr, input: c, startTimestamp: n, endTimestamp: r };
    const d = { category: "xhr", data: l, type: "http", level: X(a) };
    e.emit("beforeOutgoingRequestBreadcrumb", d, u);
    j(d, u);
  };
}
function or(e) {
  return function (t) {
    if (f() !== e) return;
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
        j(i, s);
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
          level: X(s.status_code),
        };
        e.emit("beforeOutgoingRequestBreadcrumb", a, i);
        j(a, i);
      }
    }
  };
}
function sr(e) {
  return function (t) {
    if (f() !== e) return;
    let n = t.from;
    let r = t.to;
    const o = K(Mt.location.href);
    let s = n ? K(n) : void 0;
    const i = K(r);
    s?.path || (s = o);
    o.protocol === i.protocol && o.host === i.host && (r = i.relative);
    o.protocol === s.protocol && o.host === s.host && (n = s.relative);
    j({ category: "navigation", data: { from: n, to: r } });
  };
}
function ir(e) {
  return !!e && !!e.target;
}
const ar = [
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
const cr = "BrowserApiErrors";
const lr = (e = {}) => {
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
    name: cr,
    setupOnce() {
      t.setTimeout && Y(Mt, "setTimeout", dr);
      t.setInterval && Y(Mt, "setInterval", dr);
      t.requestAnimationFrame && Y(Mt, "requestAnimationFrame", fr);
      t.XMLHttpRequest &&
        "XMLHttpRequest" in Mt &&
        Y(XMLHttpRequest.prototype, "send", pr);
      const e = t.eventTarget;
      if (e) {
        const n = Array.isArray(e) ? e : ar;
        n.forEach((e) => gr(e, t));
      }
    },
  };
};
const ur = H(lr);
function dr(e) {
  return function (...t) {
    const n = t[0];
    t[0] = jt(n, {
      mechanism: {
        handled: false,
        type: `auto.browser.browserapierrors.${J(e)}`,
      },
    });
    return e.apply(this, t);
  };
}
function fr(e) {
  return function (t) {
    return e.apply(this, [
      jt(t, {
        mechanism: {
          data: { handler: J(e) },
          handled: false,
          type: "auto.browser.browserapierrors.requestAnimationFrame",
        },
      }),
    ]);
  };
}
function pr(e) {
  return function (...t) {
    const n = this;
    const r = ["onload", "onerror", "onprogress", "onreadystatechange"];
    r.forEach((e) => {
      e in n &&
        typeof n[e] === "function" &&
        Y(n, e, function (t) {
          const n = {
            mechanism: {
              data: { handler: J(t) },
              handled: false,
              type: `auto.browser.browserapierrors.xhr.${e}`,
            },
          };
          const r = o(t);
          r && (n.mechanism.data.handler = J(r));
          return jt(t, n);
        });
    });
    return e.apply(this, t);
  };
}
function gr(e, t) {
  const n = Mt;
  const r = n[e]?.prototype;
  if (r?.hasOwnProperty?.("addEventListener")) {
    Y(r, "addEventListener", function (n) {
      return function (r, o, s) {
        try {
          mr(o) &&
            (o.handleEvent = jt(o.handleEvent, {
              mechanism: {
                data: { handler: J(o), target: e },
                handled: false,
                type: "auto.browser.browserapierrors.handleEvent",
              },
            }));
        } catch {}
        t.unregisterOriginalCallbacks && hr(this, r, o);
        return n.apply(this, [
          r,
          jt(o, {
            mechanism: {
              data: { handler: J(o), target: e },
              handled: false,
              type: "auto.browser.browserapierrors.addEventListener",
            },
          }),
          s,
        ]);
      };
    });
    Y(r, "removeEventListener", function (e) {
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
function mr(e) {
  return typeof e.handleEvent === "function";
}
function hr(e, t, n) {
  e &&
    typeof e === "object" &&
    "removeEventListener" in e &&
    typeof e.removeEventListener === "function" &&
    e.removeEventListener(t, n);
}
const yr = H((e = {}) => {
  const t = e.lifecycle ?? "route";
  return {
    name: "BrowserSession",
    setupOnce() {
      if (typeof Mt.document === "undefined") {
        hn &&
          A.warn(
            "Using the `browserSessionIntegration` in non-browser environments is not supported.",
          );
        return;
      }
      V({ ignoreDuration: true });
      Q();
      const e = Z();
      let n = e.getUser();
      e.addScopeListener((e) => {
        const t = e.getUser();
        if (n?.id !== t?.id || n?.ip_address !== t?.ip_address) {
          Q();
          n = t;
        }
      });
      t === "route" &&
        wt(({ from: e, to: t }) => {
          if (e !== t) {
            V({ ignoreDuration: true });
            Q();
          }
        });
    },
  };
});
const _r = "CultureContext";
const vr = () => ({
  name: _r,
  preprocessEvent(e) {
    const t = Sr();
    t &&
      (e.contexts = {
        ...e.contexts,
        culture: { ...t, ...e.contexts?.culture },
      });
  },
});
const br = H(vr);
function Sr() {
  try {
    const e = Mt.Intl;
    if (!e) return;
    const t = e.DateTimeFormat().resolvedOptions();
    return { locale: t.locale, timezone: t.timeZone, calendar: t.calendar };
  } catch {
    return;
  }
}
const wr = "GlobalHandlers";
const kr = (e = {}) => {
  const t = { onerror: true, onunhandledrejection: true, ...e };
  return {
    name: wr,
    setupOnce() {
      Error.stackTraceLimit = 50;
    },
    setup(e) {
      if (t.onerror) {
        Tr(e);
        Cr("onerror");
      }
      if (t.onunhandledrejection) {
        Er(e);
        Cr("onunhandledrejection");
      }
    },
  };
};
const Pr = H(kr);
function Tr(e) {
  ee((t) => {
    const { stackParser: n, attachStacktrace: r } = Lr();
    if (f() !== e || Ft()) return;
    const { msg: o, url: s, line: i, column: a, error: c } = t;
    const l = Rr(cn(n, c || o, void 0, r, false), s, i, a);
    l.level = "error";
    te(l, {
      originalException: c,
      mechanism: {
        handled: false,
        type: "auto.browser.global_handlers.onerror",
      },
    });
  });
}
function Er(e) {
  ne((t) => {
    const { stackParser: n, attachStacktrace: r } = Lr();
    if (f() !== e || Ft()) return;
    const o = Ir(t);
    const s = re(o) ? xr(o) : cn(n, o, void 0, r, true);
    s.level = "error";
    te(s, {
      originalException: o,
      mechanism: {
        handled: false,
        type: "auto.browser.global_handlers.onunhandledrejection",
      },
    });
  });
}
function Ir(e) {
  if (re(e)) return e;
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
 */ function xr(e) {
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
function Rr(e, t, n, r) {
  const o = (e.exception = e.exception || {});
  const s = (o.values = o.values || []);
  const i = (s[0] = s[0] || {});
  const a = (i.stacktrace = i.stacktrace || {});
  const c = (a.frames = a.frames || []);
  const l = r;
  const u = n;
  const f = Or(t) ?? d();
  c.length === 0 &&
    c.push({ colno: l, filename: f, function: $, in_app: true, lineno: u });
  return e;
}
function Cr(e) {
  hn && A.log(`Global Handler attached: ${e}`);
}
function Lr() {
  const e = f();
  const t = e?.getOptions() || {
    stackParser: () => [],
    attachStacktrace: false,
  };
  return t;
}
function Or(e) {
  if (oe(e) && e.length !== 0)
    return e.startsWith("data:") ? `<${se(e, false)}>` : e;
}
const Ar = H(() => ({
  name: "HttpContext",
  preprocessEvent(e) {
    if (!Mt.navigator && !Mt.location && !Mt.document) return;
    const t = Ut();
    const n = { ...t.headers, ...e.request?.headers };
    e.request = { ...t, ...e.request, headers: n };
  },
}));
const $r = "cause";
const Dr = 5;
const qr = "LinkedErrors";
const Mr = (e = {}) => {
  const t = e.limit || Dr;
  const n = e.key || $r;
  return {
    name: qr,
    preprocessEvent(e, r, o) {
      const s = o.getOptions();
      ie(Yt, s.stackParser, n, t, e, r);
    },
  };
};
const Nr = H(Mr);
const Fr = "SpotlightBrowser";
const Hr = (e = {}) => {
  const t = e.sidecarUrl || "http://localhost:8969/stream";
  return {
    name: Fr,
    setup: () => {
      hn && A.log("Using Sidecar URL", t);
    },
    processEvent: (e) => (Br(e) ? null : e),
    afterAllSetup: (e) => {
      jr(e, t);
    },
  };
};
function jr(e, t) {
  const n = _t("fetch");
  let r = 0;
  e.on("beforeEnvelope", (e) => {
    r > 3
      ? A.warn(
          "[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests:",
          r,
        )
      : n(t, {
          method: "POST",
          body: ae(e),
          headers: { "Content-Type": "application/x-sentry-envelope" },
          mode: "cors",
        }).then(
          (e) => {
            e.status >= 200 && e.status < 400 && (r = 0);
          },
          (e) => {
            r++;
            A.error(
              "Sentry SDK can't connect to Sidecar is it running? See: https://spotlightjs.com/sidecar/npx/",
              e,
            );
          },
        );
  });
}
const Ur = H(Hr);
function Br(e) {
  return Boolean(
    e.type === "transaction" &&
      e.spans &&
      e.contexts?.trace &&
      e.contexts.trace.op === "ui.action.click" &&
      e.spans.some(({ description: e }) => e?.includes("#sentry-spotlight")),
  );
}
function Wr() {
  if (zr()) {
    hn &&
      ce(() => {
        console.error(
          "[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/",
        );
      });
    return true;
  }
  return false;
}
function zr() {
  if (typeof Mt.window === "undefined") return false;
  const e = Mt;
  if (e.nw) return false;
  const t = e.chrome || e.browser;
  if (!t?.runtime?.id) return false;
  const n = d();
  const r = [
    "chrome-extension",
    "moz-extension",
    "ms-browser-extension",
    "safari-web-extension",
  ];
  const o = Mt === Mt.top && r.some((e) => n.startsWith(`${e}://`));
  return !o;
}
function Gr(e) {
  return [le(), ue(), de(), ur(), Zn(), Pr(), Nr(), fe(), Ar(), br(), yr()];
}
function Xr(e = {}) {
  const t = !e.skipBrowserExtensionCheck && Wr();
  let n = e.defaultIntegrations == null ? Gr() : e.defaultIntegrations;
  const r = {
    ...e,
    enabled: !t && e.enabled,
    stackParser: ge(e.stackParser || Gn),
    integrations: pe({ integrations: e.integrations, defaultIntegrations: n }),
    transport: e.transport || mn,
  };
  return me(BrowserClient, r);
}
function Kr() {}
function Yr(e) {
  e();
}
/**
 * Present the user with a report dialog.
 *
 * @param options Everything is optional, we try to fetch all info need from the current scope.
 */ function Jr(e = {}) {
  const t = Mt.document;
  const n = t?.head || t?.body;
  if (!n) {
    hn && A.error("[showReportDialog] Global document not defined");
    return;
  }
  const r = he();
  const o = f();
  const s = o?.getDsn();
  if (!s) {
    hn && A.error("[showReportDialog] DSN not configured");
    return;
  }
  const i = {
    ...e,
    user: { ...r.getUser(), ...e.user },
    eventId: e.eventId || ye(),
  };
  const a = Mt.document.createElement("script");
  a.async = true;
  a.crossOrigin = "anonymous";
  a.src = _e(s, i);
  const { onLoad: c, onClose: l } = i;
  c && (a.onload = c);
  if (l) {
    const e = (t) => {
      if (t.data === "__sentry_reportdialog_closed__")
        try {
          l();
        } finally {
          Mt.removeEventListener("message", e);
        }
    };
    Mt.addEventListener("message", e);
  }
  n.appendChild(a);
}
const Vr = r;
const Qr = "ReportingObserver";
const Zr = new WeakMap();
const eo = (e = {}) => {
  const t = e.types || ["crash", "deprecation", "intervention"];
  function n(e) {
    if (Zr.has(f()))
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
          ve(`${n}: ${r}`);
        });
  }
  return {
    name: Qr,
    setupOnce() {
      if (!be()) return;
      const e = new Vr.ReportingObserver(n, { buffered: true, types: t });
      e.observe();
    },
    setup(e) {
      Zr.set(e, true);
    },
  };
};
const to = H(eo);
const no = "HttpClient";
const ro = (e = {}) => {
  const t = {
    failedRequestStatusCodes: [[500, 599]],
    failedRequestTargets: [/.*/],
    ...e,
  };
  return {
    name: no,
    setup(e) {
      mo(e, t);
      ho(e, t);
    },
  };
};
const oo = H(ro);
/**
 * Interceptor function for fetch requests
 *
 * @param requestInfo The Fetch API request info
 * @param response The Fetch API response
 * @param requestInit The request init object
 */ function so(e, t, n, r, o) {
  if (yo(e, n.status, n.url)) {
    const e = vo(t, r);
    let s, i, a, c;
    if (bo()) {
      [s, a] = io("Cookie", e);
      [i, c] = io("Set-Cookie", n);
    }
    const l = _o({
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
    te(l);
  }
}
function io(e, t) {
  const n = uo(t.headers);
  let r;
  try {
    const t = n[e] || n[e.toLowerCase()] || void 0;
    t && (r = lo(t));
  } catch {}
  return [n, r];
}
/**
 * Interceptor function for XHR requests
 *
 * @param xhr The XHR request
 * @param method The HTTP method
 * @param headers The HTTP headers
 */ function ao(e, t, n, r, o) {
  if (yo(e, t.status, t.responseURL)) {
    let e, s, i;
    if (bo()) {
      try {
        const e =
          t.getResponseHeader("Set-Cookie") ||
          t.getResponseHeader("set-cookie") ||
          void 0;
        e && (s = lo(e));
      } catch {}
      try {
        i = fo(t);
      } catch {}
      e = r;
    }
    const a = _o({
      url: t.responseURL,
      method: n,
      status: t.status,
      requestHeaders: e,
      responseHeaders: i,
      responseCookies: s,
      error: o,
      type: "xhr",
    });
    te(a);
  }
}
/**
 * Extracts response size from `Content-Length` header when possible
 *
 * @param headers
 * @returns The response size in bytes or undefined
 */ function co(e) {
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
 */ function lo(e) {
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
 */ function uo(e) {
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
 */ function fo(e) {
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
 */ function po(e, t) {
  return e.some((e) => (typeof e === "string" ? t.includes(e) : e.test(t)));
}
/**
 * Checks if the given status code is in the given range
 *
 * @param status The status code to check
 * @returns true if the status code is in the given range, false otherwise
 */ function go(e, t) {
  return e.some((e) =>
    typeof e === "number" ? e === t : t >= e[0] && t <= e[1],
  );
}
function mo(e, t) {
  Se() &&
    F((n) => {
      if (f() !== e) return;
      const { response: r, args: o, error: s, virtualError: i } = n;
      const [a, c] = o;
      r && so(t, a, r, c, s || i);
    }, false);
}
function ho(e, t) {
  "XMLHttpRequest" in r &&
    St((n) => {
      if (f() !== e) return;
      const { error: r, virtualError: o } = n;
      const s = n.xhr;
      const i = s[kt];
      if (!i) return;
      const { method: a, request_headers: c } = i;
      try {
        ao(t, s, a, c, r || o);
      } catch (e) {
        hn &&
          A.warn("Error while extracting response event form XHR response", e);
      }
    });
}
/**
 * Checks whether to capture given response as an event
 *
 * @param status response status code
 * @param url response url
 */ function yo(e, t, n) {
  return (
    go(e.failedRequestStatusCodes, t) &&
    po(e.failedRequestTargets, n) &&
    !we(n, f())
  );
}
/**
 * Creates a synthetic Sentry event from given response data
 *
 * @param data response data
 * @returns event
 */ function _o(e) {
  const t = f();
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
        body_size: co(e.responseHeaders),
      },
    },
  };
  a(s, { type: `auto.http.client.${e.type}`, handled: false });
  return s;
}
function vo(e, t) {
  return (!t && e instanceof Request) || (e instanceof Request && e.bodyUsed)
    ? e
    : new Request(e, t);
}
function bo() {
  const e = f();
  return !!e && Boolean(e.getOptions().sendDefaultPii);
}
const So = r;
const wo = 7;
const ko = "ContextLines";
const Po = (e = {}) => {
  const t = e.frameContextLines != null ? e.frameContextLines : wo;
  return {
    name: ko,
    processEvent(e) {
      return Eo(e, t);
    },
  };
};
const To = H(Po);
function Eo(e, t) {
  const n = So.document;
  const r = So.location && ke(So.location.href);
  if (!n || !r) return e;
  const o = e.exception?.values;
  if (!o?.length) return e;
  const s = n.documentElement.innerHTML;
  if (!s) return e;
  const i = ["<!DOCTYPE html>", "<html>", ...s.split("\n"), "</html>"];
  o.forEach((e) => {
    const n = e.stacktrace;
    n?.frames && (n.frames = n.frames.map((e) => Io(e, i, r, t)));
  });
  return e;
}
function Io(e, t, n, r) {
  if (e.filename !== n || !e.lineno || !t.length) return e;
  Pe(t, e, r);
  return e;
}
const xo = "GraphQLClient";
const Ro = (e) => ({
  name: xo,
  setup(t) {
    Co(t, e);
    Lo(t, e);
  },
});
function Co(e, t) {
  e.on("beforeOutgoingRequestSpan", (e, n) => {
    const r = Te(e);
    const o = r.data || {};
    const s = o[Ee];
    const i = s === "http.client";
    if (!i) return;
    const a = o[Ie] || o["http.url"];
    const c = o[xe] || o["http.method"];
    if (!oe(a) || !oe(c)) return;
    const { endpoints: l } = t;
    const u = Re(a, l);
    const d = Ao(n);
    if (u && d) {
      const t = No(d);
      if (t) {
        const n = Oo(t);
        e.updateName(`${c} ${a} (${n})`);
        qo(t) && e.setAttribute("graphql.document", t.query);
        if (Mo(t)) {
          e.setAttribute(
            "graphql.persisted_query.hash.sha256",
            t.extensions.persistedQuery.sha256Hash,
          );
          e.setAttribute(
            "graphql.persisted_query.version",
            t.extensions.persistedQuery.version,
          );
        }
      }
    }
  });
}
function Lo(e, t) {
  e.on("beforeOutgoingRequestBreadcrumb", (e, n) => {
    const { category: r, type: o, data: s } = e;
    const i = r === "fetch";
    const a = r === "xhr";
    const c = o === "http";
    if (c && (i || a)) {
      const e = s?.url;
      const { endpoints: r } = t;
      const o = Re(e, r);
      const i = Ao(n);
      if (o && s && i) {
        const e = No(i);
        if (!s.graphql && e) {
          const t = Oo(e);
          s["graphql.operation"] = t;
          qo(e) && (s["graphql.document"] = e.query);
          if (Mo(e)) {
            s["graphql.persisted_query.hash.sha256"] =
              e.extensions.persistedQuery.sha256Hash;
            s["graphql.persisted_query.version"] =
              e.extensions.persistedQuery.version;
          }
        }
      }
    }
  });
}
/**
 * @param requestBody - GraphQL request
 * @returns A formatted version of the request: 'TYPE NAME' or 'TYPE' or 'persisted NAME'
 */ function Oo(e) {
  if (Mo(e)) return `persisted ${e.operationName}`;
  if (qo(e)) {
    const { query: t, operationName: n } = e;
    const { operationName: r = n, operationType: o } = $o(t);
    const s = r ? `${o} ${r}` : `${o}`;
    return s;
  }
  return "unknown";
}
function Ao(e) {
  const t = "xhr" in e;
  let n;
  if (t) {
    const t = e.xhr[kt];
    n = t && Pt(t.body)[0];
  } else {
    const t = Tt(e.input);
    n = Pt(t)[0];
  }
  return n;
}
function $o(e) {
  const t = /^(?:\s*)(query|mutation|subscription)(?:\s*)(\w+)(?:\s*)[{(]/;
  const n = /^(?:\s*)(query|mutation|subscription)(?:\s*)[{(]/;
  const r = e.match(t);
  if (r) return { operationType: r[1], operationName: r[2] };
  const o = e.match(n);
  return o
    ? { operationType: o[1], operationName: void 0 }
    : { operationType: void 0, operationName: void 0 };
}
function Do(e) {
  return typeof e === "object" && e !== null;
}
function qo(e) {
  return Do(e) && typeof e.query === "string";
}
function Mo(e) {
  return (
    Do(e) &&
    typeof e.operationName === "string" &&
    Do(e.extensions) &&
    Do(e.extensions.persistedQuery) &&
    typeof e.extensions.persistedQuery.sha256Hash === "string" &&
    typeof e.extensions.persistedQuery.version === "number"
  );
}
/**
 * Extract the payload of a request if it's GraphQL.
 * Exported for tests only.
 * @param payload - A valid JSON string
 * @returns A POJO or undefined
 */ function No(e) {
  try {
    const t = JSON.parse(e);
    return qo(t) || Mo(t) ? t : void 0;
  } catch {
    return;
  }
}
const Fo = H(Ro);
function Ho(e) {
  return e.split(",").some((e) => e.trim().startsWith("sentry-"));
}
function jo(e) {
  try {
    const t = new URL(e, Mt.location.origin);
    return t.href;
  } catch {
    return;
  }
}
function Uo(e) {
  return (
    e.entryType === "resource" &&
    "initiatorType" in e &&
    typeof e.nextHopProtocol === "string" &&
    (e.initiatorType === "fetch" || e.initiatorType === "xmlhttprequest")
  );
}
function Bo(e) {
  try {
    return new Headers(e);
  } catch {
    return;
  }
}
const Wo = new WeakMap();
const zo = new Map();
const Go = {
  traceFetch: true,
  traceXHR: true,
  enableHTTPTimings: true,
  trackFetchStreamPerformance: false,
};
function Xo(e, t) {
  const {
    traceFetch: n,
    traceXHR: r,
    trackFetchStreamPerformance: o,
    shouldCreateSpanForRequest: s,
    enableHTTPTimings: i,
    tracePropagationTargets: a,
    onRequestSpanStart: c,
    onRequestSpanEnd: l,
  } = { ...Go, ...t };
  const u = typeof s === "function" ? s : (e) => true;
  const d = (e) => Yo(e, a);
  const f = {};
  const p = e.getOptions().propagateTraceparent;
  if (n) {
    e.addEventProcessor((e) => {
      e.type === "transaction" &&
        e.spans &&
        e.spans.forEach((e) => {
          if (e.op === "http.client") {
            const t = zo.get(e.span_id);
            if (t) {
              e.timestamp = t / 1e3;
              zo.delete(e.span_id);
            }
          }
        });
      return e;
    });
    o &&
      Ce((e) => {
        if (e.response) {
          const t = Wo.get(e.response);
          t && e.endTimestamp && zo.set(t, e.endTimestamp);
        }
      });
    F((e) => {
      const t = Le(e, u, d, f, {
        propagateTraceparent: p,
        onRequestSpanEnd: l,
      });
      e.response &&
        e.fetchData.__span &&
        Wo.set(e.response, e.fetchData.__span);
      if (t) {
        const n = jo(e.fetchData.url);
        const r = n ? K(n).host : void 0;
        t.setAttributes({
          "http.url": n ? se(n) : void 0,
          "server.address": r,
        });
        i && Ko(t);
        c?.(t, { headers: e.headers });
      }
    });
  }
  r &&
    St((e) => {
      const t = Jo(e, u, d, f, p, l);
      if (t) {
        i && Ko(t);
        c?.(t, { headers: Bo(e.xhr.__sentry_xhr_v3__?.request_headers) });
      }
    });
}
/**
 * Creates a temporary observer to listen to the next fetch/xhr resourcing timings,
 * so that when timings hit their per-browser limit they don't need to be removed.
 *
 * @param span A span that has yet to be finished, must contain `url` on data.
 */ function Ko(e) {
  const { url: t } = Te(e).data;
  if (!t || typeof t !== "string") return;
  const n = Et("resource", ({ entries: r }) => {
    r.forEach((r) => {
      if (Uo(r) && r.name.endsWith(t)) {
        e.setAttributes(It(r));
        setTimeout(n);
      }
    });
  });
}
function Yo(e, t) {
  const n = d();
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
    return t ? Re(r.toString(), t) || (s && Re(r.pathname, t)) : s;
  }
  {
    const n = !!e.match(/^\/(?!\/)/);
    return t ? Re(e, t) : n;
  }
}
/**
 * Create and track xhr request spans
 *
 * @returns Span if a span was created, otherwise void.
 */ function Jo(e, t, n, r, o, s) {
  const i = e.xhr;
  const a = i?.[kt];
  if (!i || i.__sentry_own_request__ || !a) return;
  const { url: c, method: l } = a;
  const u = Oe() && t(c);
  if (e.endTimestamp) {
    const t = i.__sentry_xhr_span_id__;
    if (!t) return;
    const n = r[t];
    if (n) {
      if (u && a.status_code !== void 0) {
        Ae(n, a.status_code);
        n.end();
        s?.(n, { headers: Bo(xt(i)), error: e.error });
      }
      delete r[t];
    }
    return;
  }
  const d = jo(c);
  const p = K(d || c);
  const g = se(ke(c));
  const m = !!$e();
  const h =
    u && m
      ? De({
          name: `${l} ${g}`,
          attributes: {
            url: se(c),
            type: "xhr",
            "http.method": l,
            "http.url": d ? se(d) : void 0,
            "server.address": p?.host,
            [qe]: "auto.http.browser",
            [Ee]: "http.client",
            ...(p?.search && { "http.query": p?.search }),
            ...(p?.hash && { "http.fragment": p?.hash }),
          },
        })
      : new Me();
  i.__sentry_xhr_span_id__ = h.spanContext().spanId;
  r[i.__sentry_xhr_span_id__] = h;
  n(c) && Vo(i, Oe() && m ? h : void 0, o);
  const y = f();
  y && y.emit("beforeOutgoingRequestSpan", h, e);
  return h;
}
function Vo(e, t, n) {
  const {
    "sentry-trace": r,
    baggage: o,
    traceparent: s,
  } = Ne({ span: t, propagateTraceparent: n });
  r && Qo(e, r, o, s);
}
function Qo(e, t, n, r) {
  const o = e.__sentry_xhr_v3__?.request_headers;
  if (!o?.["sentry-trace"] && e.setRequestHeader)
    try {
      e.setRequestHeader("sentry-trace", t);
      r && !o?.traceparent && e.setRequestHeader("traceparent", r);
      if (n) {
        const t = o?.baggage;
        (t && Ho(t)) || e.setRequestHeader("baggage", n);
      }
    } catch {}
}
function Zo() {
  Mt.document
    ? Mt.document.addEventListener("visibilitychange", () => {
        const e = $e();
        if (!e) return;
        const t = Fe(e);
        if (Mt.document.hidden && t) {
          const e = "cancelled";
          const { op: n, status: r } = Te(t);
          hn &&
            A.log(
              `[Tracing] Transaction: ${e} -> since tab moved to the background, op: ${n}`,
            );
          r || t.setStatus({ code: He, message: e });
          t.setAttribute("sentry.cancellation_reason", "document.hidden");
          t.end();
        }
      })
    : hn &&
      A.warn(
        "[Tracing] Could not set up background tab detection due to lack of global document",
      );
}
const es = 3600;
const ts = "sentry_previous_trace";
const ns = "sentry.previous_trace";
/**
 * Takes care of linking traces and applying the (consistent) sampling behavoiour based on the passed options
 * @param options - options for linking traces and consistent trace sampling (@see BrowserTracingOptions)
 * @param client - Sentry client
 */ function rs(e, { linkPreviousTrace: t, consistentTraceSampling: n }) {
  const r = t === "session-storage";
  let o = r ? is() : void 0;
  e.on("spanStart", (e) => {
    if (Fe(e) !== e) return;
    const t = he().getPropagationContext();
    o = os(o, e, t);
    r && ss(o);
  });
  let s = true;
  n &&
    e.on("beforeSampling", (e) => {
      if (!o) return;
      const t = he();
      const n = t.getPropagationContext();
      if (s && n.parentSpanId) s = false;
      else {
        t.setPropagationContext({
          ...n,
          dsc: {
            ...n.dsc,
            sample_rate: String(o.sampleRate),
            sampled: String(as(o.spanContext)),
          },
          sampleRand: o.sampleRand,
        });
        e.parentSampled = as(o.spanContext);
        e.parentSampleRate = o.sampleRate;
        e.spanAttributes = { ...e.spanAttributes, [je]: o.sampleRate };
      }
    });
}
/**
 * Adds a previous_trace span link to the passed span if the passed
 * previousTraceInfo is still valid.
 *
 * @returns the updated previous trace info (based on the current span/trace) to
 * be used on the next call
 */ function os(e, t, n) {
  const r = Te(t);
  function o() {
    try {
      return Number(n.dsc?.sample_rate) ?? Number(r.data?.[Ue]);
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
  if (Date.now() / 1e3 - e.startTimestamp <= es) {
    hn &&
      A.log(
        `Adding previous_trace \`${JSON.stringify(i)}\` link to span \`${JSON.stringify({ op: r.op, ...t.spanContext() })}\``,
      );
    t.addLink({ context: i, attributes: { [Be]: "previous_trace" } });
    t.setAttribute(ns, `${i.traceId}-${i.spanId}-${as(i) ? 1 : 0}`);
  }
  return s;
}
/**
 * Stores @param previousTraceInfo in sessionStorage.
 */ function ss(e) {
  try {
    Mt.sessionStorage.setItem(ts, JSON.stringify(e));
  } catch (e) {
    hn && A.warn("Could not store previous trace in sessionStorage", e);
  }
}
function is() {
  try {
    const e = Mt.sessionStorage?.getItem(ts);
    return JSON.parse(e);
  } catch {
    return;
  }
}
function as(e) {
  return e.traceFlags === 1;
}
const cs = "BrowserTracing";
const ls = {
  ...We,
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
  ...Go,
};
const us = (e = {}) => {
  const t = { name: void 0, source: void 0 };
  const n = Mt.document;
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
    beforeStartSpan: p,
    idleTimeout: g,
    finalTimeout: m,
    childSpanTimeout: h,
    markBackgroundSpan: y,
    traceFetch: _,
    traceXHR: v,
    trackFetchStreamPerformance: b,
    shouldCreateSpanForRequest: S,
    enableHTTPTimings: w,
    ignoreResourceSpans: k,
    ignorePerformanceApiSpans: P,
    instrumentPageLoad: T,
    instrumentNavigation: E,
    detectRedirects: I,
    linkPreviousTrace: x,
    consistentTraceSampling: R,
    enableReportPageLoaded: C,
    onRequestSpanStart: L,
    onRequestSpanEnd: O,
  } = { ...ls, ...e };
  let $;
  let D;
  let q;
  function M(e, r, o = true) {
    const s = r.op === "pageload";
    const i = r.name;
    const a = p ? p(r) : r;
    const c = a.attributes || {};
    if (i !== a.name) {
      c[ze] = "custom";
      a.attributes = c;
    }
    if (!o) {
      const e = Ge();
      De({ ...a, startTime: e }).end(e);
      return;
    }
    t.name = a.name;
    t.source = c[ze];
    const d = Xe(a, {
      idleTimeout: g,
      finalTimeout: m,
      childSpanTimeout: h,
      disableAutoFinish: s,
      beforeSpanEnd: (t) => {
        $?.();
        Rt(t, {
          recordClsOnPageloadSpan: !l,
          recordLcpOnPageloadSpan: !u,
          ignoreResourceSpans: k,
          ignorePerformanceApiSpans: P,
        });
        _s(e, void 0);
        const n = he();
        const r = n.getPropagationContext();
        n.setPropagationContext({
          ...r,
          traceId: d.spanContext().traceId,
          sampled: Ye(d),
          dsc: Ke(t),
        });
        s && (q = void 0);
      },
      trimIdleSpanEndTimestamp: !C,
    });
    s && C && (q = d);
    _s(e, d);
    function f() {
      n &&
        ["interactive", "complete"].includes(n.readyState) &&
        e.emit("idleSpanEnableAutoFinish", d);
    }
    if (s && !C && n) {
      n.addEventListener("readystatechange", () => {
        f();
      });
      f();
    }
  }
  return {
    name: cs,
    setup(e) {
      Qe();
      $ = Lt({
        recordClsStandaloneSpans: l || false,
        recordLcpStandaloneSpans: u || false,
        client: e,
      });
      o && Ot();
      s && At();
      a &&
      r.PerformanceObserver &&
      PerformanceObserver.supportedEntryTypes &&
      PerformanceObserver.supportedEntryTypes.includes("long-animation-frame")
        ? $t()
        : i && Dt();
      c && qt();
      if (I && n) {
        const e = () => {
          D = Ze();
        };
        addEventListener("click", e, { capture: true });
        addEventListener("keydown", e, { capture: true, passive: true });
      }
      function t() {
        const t = ys(e);
        if (t && !Te(t).timestamp) {
          hn &&
            A.log(
              `[Tracing] Finishing current active span with op: ${Te(t).op}`,
            );
          t.setAttribute(et, "cancelled");
          t.end();
        }
      }
      e.on("startNavigationSpan", (n, r) => {
        if (f() !== e) return;
        if (r?.isRedirect) {
          hn &&
            A.warn(
              "[Tracing] Detected redirect, navigation span will not be the root span, but a child span.",
            );
          M(e, { op: "navigation.redirect", ...n }, false);
          return;
        }
        D = void 0;
        t();
        Z().setPropagationContext({
          traceId: nt(),
          sampleRand: Math.random(),
          propagationSpanId: Oe() ? void 0 : tt(),
        });
        const o = he();
        o.setPropagationContext({
          traceId: nt(),
          sampleRand: Math.random(),
          propagationSpanId: Oe() ? void 0 : tt(),
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
        if (f() !== e) return;
        t();
        const o = r.sentryTrace || ps("sentry-trace") || gs("sentry-trace");
        const s = r.baggage || ps("baggage") || gs("baggage");
        const i = rt(o, s);
        const a = he();
        a.setPropagationContext(i);
        Oe() || (a.getPropagationContext().propagationSpanId = tt());
        a.setSDKProcessingMetadata({ normalizedRequest: Ut() });
        M(e, { op: "pageload", ...n });
      });
      e.on("endPageloadSpan", () => {
        if (C && q) {
          q.setAttribute(et, "reportPageLoaded");
          q.end();
        }
      });
    },
    afterAllSetup(e) {
      let n = d();
      x !== "off" &&
        rs(e, { linkPreviousTrace: x, consistentTraceSampling: R });
      if (Mt.location) {
        if (T) {
          const t = Je();
          ds(e, {
            name: Mt.location.pathname,
            startTime: t ? t / 1e3 : void 0,
            attributes: { [ze]: "url", [qe]: "auto.pageload.browser" },
          });
        }
        E &&
          wt(({ to: t, from: r }) => {
            if (r === void 0 && n?.indexOf(t) !== -1) {
              n = void 0;
              return;
            }
            n = void 0;
            const o = Ve(t);
            const s = ys(e);
            const i = s && I && bs(s, D);
            fs(
              e,
              {
                name: o?.pathname || Mt.location.pathname,
                attributes: { [ze]: "url", [qe]: "auto.navigation.browser" },
              },
              { url: t, isRedirect: i },
            );
          });
      }
      y && Zo();
      c && ms(e, g, m, h, t);
      o && Ct();
      Xo(e, {
        traceFetch: _,
        traceXHR: v,
        trackFetchStreamPerformance: b,
        tracePropagationTargets: e.getOptions().tracePropagationTargets,
        shouldCreateSpanForRequest: S,
        enableHTTPTimings: w,
        onRequestSpanStart: L,
        onRequestSpanEnd: O,
      });
    },
  };
};
function ds(e, t, n) {
  e.emit("startPageLoadSpan", t, n);
  he().setTransactionName(t.name);
  const r = ys(e);
  r && e.emit("afterStartPageLoadSpan", r);
  return r;
}
function fs(e, t, n) {
  const { url: r, isRedirect: o } = n || {};
  e.emit("beforeStartNavigationSpan", t, { isRedirect: o });
  e.emit("startNavigationSpan", t, { isRedirect: o });
  const s = he();
  s.setTransactionName(t.name);
  r &&
    !o &&
    s.setSDKProcessingMetadata({ normalizedRequest: { ...Ut(), url: r } });
  return ys(e);
}
function ps(e) {
  const t = Mt.document;
  const n = t?.querySelector(`meta[name=${e}]`);
  return n?.getAttribute("content") || void 0;
}
function gs(e) {
  const t = Mt.performance?.getEntriesByType?.("navigation")[0];
  const n = t?.serverTiming?.find((t) => t.name === e);
  return n?.description;
}
function ms(e, t, n, r, o) {
  const s = Mt.document;
  let i;
  const a = () => {
    const s = "ui.action.click";
    const a = ys(e);
    if (a) {
      const e = Te(a).op;
      if (["navigation", "pageload"].includes(e)) {
        hn &&
          A.warn(
            `[Tracing] Did not create ${s} span because a pageload or navigation span is in progress.`,
          );
        return;
      }
    }
    if (i) {
      i.setAttribute(et, "interactionInterrupted");
      i.end();
      i = void 0;
    }
    o.name
      ? (i = Xe(
          { name: o.name, op: s, attributes: { [ze]: o.source || "url" } },
          { idleTimeout: t, finalTimeout: n, childSpanTimeout: r },
        ))
      : hn &&
        A.warn(
          `[Tracing] Did not create ${s} transaction because _latestRouteName is missing.`,
        );
  };
  s && addEventListener("click", a, { capture: true });
}
const hs = "_sentry_idleSpan";
function ys(e) {
  return e[hs];
}
function _s(e, t) {
  u(e, hs, t);
}
const vs = 1.5;
function bs(e, t) {
  const n = Te(e);
  const r = Ge();
  const o = n.start_timestamp;
  return !(r - o > vs) && !(t && r - t <= vs);
}
/**
 * Manually report the end of the page load, resulting in the SDK ending the pageload span.
 * This only works if {@link BrowserTracingOptions.enableReportPageLoaded} is set to `true`.
 * Otherwise, the pageload span will end itself based on the {@link BrowserTracingOptions.finalTimeout},
 * {@link BrowserTracingOptions.idleTimeout} and {@link BrowserTracingOptions.childSpanTimeout}.
 *
 * @param client - The client to use. If not provided, the global client will be used.
 */ function Ss(e = f()) {
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
 */ function ws(e) {
  const t = $e();
  if (t === e) return;
  const n = he();
  e.end = new Proxy(e.end, {
    apply(e, r, o) {
      ot(n, t);
      return Reflect.apply(e, r, o);
    },
  });
  ot(n, e);
}
function ks(e) {
  return new Promise((t, n) => {
    e.oncomplete = e.onsuccess = () => t(e.result);
    e.onabort = e.onerror = () => n(e.error);
  });
}
function Ps(e, t) {
  const n = indexedDB.open(e);
  n.onupgradeneeded = () => n.result.createObjectStore(t);
  const r = ks(n);
  return (e) => r.then((n) => e(n.transaction(t, "readwrite").objectStore(t)));
}
function Ts(e) {
  return ks(e.getAllKeys());
}
function Es(e, t, n) {
  return e((e) =>
    Ts(e).then((r) => {
      if (!(r.length >= n)) {
        e.put(t, Math.max(...r, 0) + 1);
        return ks(e.transaction);
      }
    }),
  );
}
function Is(e, t, n) {
  return e((e) =>
    Ts(e).then((r) => {
      if (!(r.length >= n)) {
        e.put(t, Math.min(...r, 0) - 1);
        return ks(e.transaction);
      }
    }),
  );
}
function xs(e) {
  return e((e) =>
    Ts(e).then((t) => {
      const n = t[0];
      if (n != null)
        return ks(e.get(n)).then((t) => {
          e.delete(n);
          return ks(e.transaction).then(() => t);
        });
    }),
  );
}
function Rs(e) {
  let t;
  function n() {
    t == void 0 &&
      (t = Ps(e.dbName || "sentry-offline", e.storeName || "queue"));
    return t;
  }
  return {
    push: async (t) => {
      try {
        const r = await ae(t);
        await Es(n(), r, e.maxQueueSize || 30);
      } catch {}
    },
    unshift: async (t) => {
      try {
        const r = await ae(t);
        await Is(n(), r, e.maxQueueSize || 30);
      } catch {}
    },
    shift: async () => {
      try {
        const e = await xs(n());
        if (e) return st(e);
      } catch {}
    },
  };
}
function Cs(e) {
  return (t) => {
    const n = e({ ...t, createStore: Rs });
    Mt.addEventListener("online", async (e) => {
      await n.flush();
    });
    return n;
  };
}
function Ls(e = mn) {
  return Cs(it(e));
}
const Os = 1e6;
const As =
  "window" in r && r.window === r && typeof importScripts === "undefined";
const $s = String(0);
const Ds = As ? "main" : "worker";
const qs = Mt.navigator;
let Ms = "";
let Ns = "";
let Fs = "";
let Hs = qs?.userAgent || "";
let js = "";
const Us = qs?.language || qs?.languages?.[0] || "";
function Bs(e) {
  return typeof e === "object" && e !== null && "getHighEntropyValues" in e;
}
const Ws = qs?.userAgentData;
Bs(Ws) &&
  Ws.getHighEntropyValues([
    "architecture",
    "model",
    "platform",
    "platformVersion",
    "fullVersionList",
  ])
    .then((e) => {
      Ms = e.platform || "";
      Fs = e.architecture || "";
      js = e.model || "";
      Ns = e.platformVersion || "";
      if (e.fullVersionList?.length) {
        const t = e.fullVersionList[e.fullVersionList.length - 1];
        Hs = `${t.brand} ${t.version}`;
      }
    })
    .catch((e) => {});
function zs(e) {
  return !("thread_metadata" in e);
}
function Gs(e) {
  return zs(e) ? Zs(e) : e;
}
function Xs(e) {
  const t = e.contexts?.trace?.trace_id;
  typeof t === "string" &&
    t.length !== 32 &&
    hn &&
    A.log(`[Profiling] Invalid traceId: ${t} on profiled event`);
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
 */ function Ks(e, t, n, r) {
  if (r.type !== "transaction")
    throw new TypeError(
      "Profiling events may only be attached to transactions, this should never occur.",
    );
  if (n === void 0 || n === null)
    throw new TypeError(
      `Cannot construct profiling event envelope without a valid profile. Got ${n} instead.`,
    );
  const o = Xs(r);
  const s = Gs(n);
  const i =
    t ||
    (typeof r.start_timestamp === "number"
      ? r.start_timestamp * 1e3
      : Ze() * 1e3);
  const a = typeof r.timestamp === "number" ? r.timestamp * 1e3 : Ze() * 1e3;
  const c = {
    event_id: e,
    timestamp: new Date(i).toISOString(),
    platform: "javascript",
    version: "1",
    release: r.release || "",
    environment: r.environment || ct,
    runtime: { name: "javascript", version: Mt.navigator.userAgent },
    os: { name: Ms, version: Ns, build_number: Hs },
    device: {
      locale: Us,
      model: js,
      manufacturer: Hs,
      architecture: Fs,
      is_emulator: false,
    },
    debug_meta: { images: ni(n.resources) },
    profile: s,
    transactions: [
      {
        name: r.transaction || "",
        id: r.event_id || at(),
        trace_id: o,
        active_thread_id: $s,
        relative_start_ns: "0",
        relative_end_ns: (1e6 * (a - i)).toFixed(0),
      },
    ],
  };
  return c;
}
function Ys(e, t, n) {
  if (e == null)
    throw new TypeError(
      `Cannot construct profiling event envelope without a valid profile. Got ${e} instead.`,
    );
  const r = Vs(e);
  const o = t.getOptions();
  const s = t.getSdkMetadata?.()?.sdk;
  return {
    chunk_id: at(),
    client_sdk: {
      name: s?.name ?? "sentry.javascript.browser",
      version: s?.version ?? "0.0.0",
    },
    profiler_id: n || at(),
    platform: "javascript",
    version: "2",
    release: o.release ?? "",
    environment: o.environment ?? "production",
    debug_meta: { images: ni(e.resources) },
    profile: r,
  };
}
function Js(e) {
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
function Vs(e) {
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
  const r = Je();
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
    i[t] = { stack_id: n.stackId ?? 0, thread_id: $s, timestamp: r };
  }
  return {
    frames: t,
    stacks: n,
    samples: i,
    thread_metadata: { [$s]: { name: Ds } },
  };
}
function Qs(e) {
  return Te(e).op === "pageload";
}
function Zs(e) {
  let t;
  let n = 0;
  const r = {
    samples: [],
    stacks: [],
    frames: [],
    thread_metadata: { [$s]: { name: Ds } },
  };
  const o = e.samples[0];
  if (!o) return r;
  const s = o.timestamp;
  const i = Je();
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
        elapsed_since_start_ns: ((o.timestamp + c - s) * Os).toFixed(0),
        stack_id: t,
        thread_id: $s,
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
      elapsed_since_start_ns: ((o.timestamp + c - s) * Os).toFixed(0),
      stack_id: n,
      thread_id: $s,
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
 */ function ei(e, t) {
  if (!t.length) return e;
  for (const n of t) e[1].push([{ type: "profile" }, n]);
  return e;
}
/**
 * Finds transactions with profile_id context in the envelope
 * @param envelope
 * @returns
 */ function ti(e) {
  const t = [];
  lt(e, (e, n) => {
    if (n === "transaction")
      for (let n = 1; n < e.length; n++) {
        const r = e[n];
        r?.contexts?.profile?.profile_id && t.push(e[n]);
      }
  });
  return t;
}
function ni(e) {
  const t = f();
  const n = t?.getOptions();
  const r = n?.stackParser;
  return r ? ut(r, e) : [];
}
function ri(e) {
  if (
    (typeof e !== "number" && typeof e !== "boolean") ||
    (typeof e === "number" && isNaN(e))
  ) {
    hn &&
      A.warn(
        `[Profiling] Invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(e)} of type ${JSON.stringify(typeof e)}.`,
      );
    return false;
  }
  if (e === true || e === false) return true;
  if (e < 0 || e > 1) {
    hn &&
      A.warn(
        `[Profiling] Invalid sample rate. Sample rate must be between 0 and 1. Got ${e}.`,
      );
    return false;
  }
  return true;
}
function oi(e) {
  if (e.samples.length < 2) {
    hn &&
      A.log(
        "[Profiling] Discarding profile because it contains less than 2 samples",
      );
    return false;
  }
  if (!e.frames.length) {
    hn && A.log("[Profiling] Discarding profile because it contains no frames");
    return false;
  }
  return true;
}
let si = false;
const ii = 3e4;
/**
 * Check if profiler constructor is available.
 * @param maybeProfiler
 */ function ai(e) {
  return typeof e === "function";
}
function ci() {
  const e = Mt.Profiler;
  if (!ai(e)) {
    hn &&
      A.log(
        "[Profiling] Profiling is not supported by this browser, Profiler interface missing on window object.",
      );
    return;
  }
  const t = 10;
  const n = Math.floor(ii / t);
  try {
    return new e({ sampleInterval: t, maxBufferSize: n });
  } catch (e) {
    if (hn) {
      A.log(
        "[Profiling] Failed to initialize the Profiling constructor, this is likely due to a missing 'Document-Policy': 'js-profiling' header.",
      );
      A.log("[Profiling] Disabling profiling for current user session.");
    }
    si = true;
  }
}
function li(e) {
  if (si) {
    hn &&
      A.log(
        "[Profiling] Profiling has been disabled for the duration of the current user session.",
      );
    return false;
  }
  if (!e.isRecording()) {
    hn &&
      A.log(
        "[Profiling] Discarding profile because root span was not sampled.",
      );
    return false;
  }
  const t = f();
  const n = t?.getOptions();
  if (!n) {
    hn && A.log("[Profiling] Profiling disabled, no options found.");
    return false;
  }
  const r = n.profilesSampleRate;
  if (!ri(r)) {
    hn &&
      A.warn("[Profiling] Discarding profile because of invalid sample rate.");
    return false;
  }
  if (!r) {
    hn &&
      A.log(
        "[Profiling] Discarding profile because a negative sampling decision was inherited or profileSampleRate is set to 0",
      );
    return false;
  }
  const o = r === true || Math.random() < r;
  if (!o) {
    hn &&
      A.log(
        `[Profiling] Discarding profile because it's not included in the random sample (sampling rate = ${Number(r)})`,
      );
    return false;
  }
  return true;
}
function ui(e) {
  if (si) {
    hn &&
      A.log(
        "[Profiling] Profiling has been disabled for the duration of the current user session as the JS Profiler could not be started.",
      );
    return false;
  }
  if (e.profileLifecycle !== "trace" && e.profileLifecycle !== "manual") {
    hn &&
      A.warn(
        "[Profiling] Session not sampled. Invalid `profileLifecycle` option.",
      );
    return false;
  }
  const t = e.profileSessionSampleRate;
  if (!ri(t)) {
    hn &&
      A.warn(
        "[Profiling] Discarding profile because of invalid profileSessionSampleRate.",
      );
    return false;
  }
  if (!t) {
    hn &&
      A.log(
        "[Profiling] Discarding profile because profileSessionSampleRate is not defined or set to 0",
      );
    return false;
  }
  return Math.random() <= t;
}
function di(e) {
  return typeof e.profilesSampleRate !== "undefined";
}
/**
 * Creates a profiling envelope item, if the profile does not pass validation, returns null.
 * @param event
 * @returns {Profile | null}
 */ function fi(e, t, n, r) {
  return oi(n) ? Ks(e, t, n, r) : null;
}
const pi = new Map();
function gi() {
  return pi.size;
}
function mi(e) {
  const t = pi.get(e);
  t && pi.delete(e);
  return t;
}
function hi(e, t) {
  pi.set(e, t);
  if (pi.size > 30) {
    const e = pi.keys().next().value;
    e !== void 0 && pi.delete(e);
  }
}
function yi(e) {
  if (!e?.contexts?.profile) return e;
  if (!e.contexts) return e;
  e.contexts.trace = {
    ...(e.contexts?.trace ?? {}),
    data: {
      ...(e.contexts?.trace?.data ?? {}),
      "thread.id": $s,
      "thread.name": Ds,
    },
  };
  e.spans?.forEach((e) => {
    e.data = { ...(e.data || {}), "thread.id": $s, "thread.name": Ds };
  });
  return e;
}
function _i(e) {
  let t;
  Qs(e) && (t = Ze() * 1e3);
  const n = ci();
  if (!n) return;
  hn && A.log(`[Profiling] started profiling span: ${Te(e).description}`);
  const r = at();
  let o = null;
  he().setContext("profile", { profile_id: r, start_timestamp: t });
  async function s() {
    if (e && n) {
      if (!o)
        return n
          .stop()
          .then((t) => {
            if (i) {
              Mt.clearTimeout(i);
              i = void 0;
            }
            hn &&
              A.log(
                `[Profiling] stopped profiling of span: ${Te(e).description}`,
              );
            if (t) {
              o = t;
              hi(r, t);
            } else
              hn &&
                A.log(
                  `[Profiling] profiler returned null profile for: ${Te(e).description}`,
                  "this may indicate an overlapping span or a call to stopProfiling with a profile title that was never started",
                );
          })
          .catch((e) => {
            hn && A.log("[Profiling] error while stopping profiler:", e);
          });
      hn &&
        A.log(
          "[Profiling] profile for:",
          Te(e).description,
          "already exists, returning early",
        );
    }
  }
  let i = Mt.setTimeout(() => {
    hn &&
      A.log(
        "[Profiling] max profile duration elapsed, stopping profiling for:",
        Te(e).description,
      );
    s();
  }, ii);
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
const vi = 6e4;
const bi = 3e5;
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
    const n = ui(e.getOptions());
    hn && A.log(`[Profiling] Initializing profiler (lifecycle='${t}').`);
    n ||
      (hn &&
        A.log(
          "[Profiling] Session not sampled. Skipping lifecycle profiler initialization.",
        ));
    this._profilerId = at();
    this._client = e;
    this._sessionSampled = n;
    this._lifecycleMode = t;
    t === "trace" && this._setupTraceLifecycleListeners(e);
  }
  start() {
    this._lifecycleMode !== "trace"
      ? this._isRunning
        ? hn &&
          A.warn(
            "[Profiling] Profile session is already running, `uiProfiler.start()` is a no-op.",
          )
        : this._sessionSampled
          ? this._beginProfiling()
          : hn &&
            A.warn(
              "[Profiling] Session is not sampled, `uiProfiler.start()` is a no-op.",
            )
      : hn &&
        A.warn(
          '[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.start()` are ignored in trace mode.',
        );
  }
  stop() {
    this._lifecycleMode !== "trace"
      ? this._isRunning
        ? this._endProfiling()
        : hn &&
          A.warn(
            "[Profiling] Profiler is not running, `uiProfiler.stop()` is a no-op.",
          )
      : hn &&
        A.warn(
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
      hn &&
        A.log(
          "[Profiling] Detected already active root span during setup. Active root spans now:",
          n,
        );
      this._beginProfiling();
    }
  }
  _beginProfiling() {
    if (!this._isRunning) {
      this._isRunning = true;
      hn &&
        A.log(
          "[Profiling] Started profiling with profiler ID:",
          this._profilerId,
        );
      dt().setContext("profile", { profiler_id: this._profilerId });
      this._startProfilerInstance();
      if (this._profiler) this._startPeriodicChunking();
      else {
        hn && A.log("[Profiling] Failed to start JS Profiler; stopping.");
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
        hn &&
          A.error(
            "[Profiling] Failed to collect current profile chunk on `stop()`:",
            e,
          );
      });
      this._lifecycleMode === "manual" && dt().setContext("profile", {});
    }
  }
  _setupTraceLifecycleListeners(e) {
    e.on("spanStart", (e) => {
      if (!this._sessionSampled) {
        hn &&
          A.log(
            "[Profiling] Span not profiled because of negative sampling decision for user session.",
          );
        return;
      }
      if (e !== Fe(e)) return;
      if (!e.isRecording()) {
        hn &&
          A.log(
            "[Profiling] Discarding profile because root span was not sampled.",
          );
        return;
      }
      const t = e.spanContext().spanId;
      if (!t || this._activeRootSpanIds.has(t)) return;
      this._registerTraceRootSpan(t);
      const n = this._activeRootSpanIds.size;
      if (n === 1) {
        hn &&
          A.log(
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
      hn &&
        A.log(
          `[Profiling] Root span with ID ${t} ended. Will continue profiling for as long as there are active root spans (currently: ${n}).`,
        );
      if (n === 0) {
        this._collectCurrentChunk().catch((e) => {
          hn &&
            A.error(
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
    dt().setContext("profile", {});
  }
  _clearAllRootSpanTimeouts() {
    this._rootSpanTimeouts.forEach((e) => clearTimeout(e));
    this._rootSpanTimeouts.clear();
  }
  _registerTraceRootSpan(e) {
    this._activeRootSpanIds.add(e);
    const t = setTimeout(() => this._onRootSpanTimeout(e), bi);
    this._rootSpanTimeouts.set(e, t);
  }
  _startProfilerInstance() {
    if (this._profiler?.stopped === false) return;
    const e = ci();
    e
      ? (this._profiler = e)
      : hn && A.log("[Profiling] Failed to start JS Profiler.");
  }
  _startPeriodicChunking() {
    this._isRunning &&
      (this._chunkTimer = setTimeout(() => {
        this._collectCurrentChunk().catch((e) => {
          hn &&
            A.error(
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
      }, vi));
  }
  _onRootSpanTimeout(e) {
    if (this._rootSpanTimeouts.has(e)) {
      this._rootSpanTimeouts.delete(e);
      if (this._activeRootSpanIds.has(e)) {
        hn &&
          A.log(
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
        const n = Ys(t, this._client, this._profilerId);
        const r = Js(n);
        if ("reason" in r) {
          hn &&
            A.log(
              "[Profiling] Discarding invalid profile chunk (this is probably a bug in the SDK):",
              r.reason,
            );
          return;
        }
        this._sendProfileChunk(n);
        hn && A.log("[Profiling] Collected browser profile chunk.");
      } catch (e) {
        hn &&
          A.log("[Profiling] Error while stopping JS Profiler for chunk:", e);
      }
  }
  _sendProfileChunk(e) {
    const t = this._client;
    const n = ft(t.getSdkMetadata?.());
    const r = t.getDsn();
    const o = t.getOptions().tunnel;
    const s = M(
      {
        event_id: at(),
        sent_at: new Date().toISOString(),
        ...(n && { sdk: n }),
        ...(!!o && r && { dsn: q(r) }),
      },
      [[{ type: "profile_chunk", platform: "javascript" }, e]],
    );
    t.sendEnvelope(s).then(null, (e) => {
      hn && A.error("Error while sending profile chunk envelope:", e);
    });
  }
}
const Si = "BrowserProfiling";
const wi = () => ({
  name: Si,
  setup(e) {
    const t = e.getOptions();
    const n = new UIProfiler();
    di(t) || t.profileLifecycle || (t.profileLifecycle = "manual");
    if (di(t) && !t.profilesSampleRate) {
      hn &&
        A.log("[Profiling] Profiling disabled, no profiling options found.");
      return;
    }
    const r = $e();
    const o = r && Fe(r);
    di(t) &&
      t.profileSessionSampleRate !== void 0 &&
      hn &&
      A.warn(
        "[Profiling] Both legacy profiling (`profilesSampleRate`) and UI profiling settings are defined. `profileSessionSampleRate` has no effect when legacy profiling is enabled.",
      );
    if (di(t)) {
      o && Qs(o) && li(o) && _i(o);
      e.on("spanStart", (e) => {
        e === Fe(e) && li(e) && _i(e);
      });
      e.on("beforeEnvelope", (e) => {
        if (!gi()) return;
        const t = ti(e);
        if (!t.length) return;
        const n = [];
        for (const e of t) {
          const t = e?.contexts;
          const r = t?.profile?.profile_id;
          const o = t?.profile?.start_timestamp;
          if (typeof r !== "string") {
            hn &&
              A.log(
                "[Profiling] cannot find profile for a span without a profile context",
              );
            continue;
          }
          if (!r) {
            hn &&
              A.log(
                "[Profiling] cannot find profile for a span without a profile context",
              );
            continue;
          }
          t?.profile && delete t.profile;
          const s = mi(r);
          if (!s) {
            hn &&
              A.log(`[Profiling] Could not retrieve profile for span: ${r}`);
            continue;
          }
          const i = fi(r, o, s, e);
          i && n.push(i);
        }
        ei(e, n);
      });
    } else {
      const r = t.profileLifecycle;
      e.on("startUIProfiler", () => n.start());
      e.on("stopUIProfiler", () => n.stop());
      if (r === "manual") n.initialize(e);
      else if (r === "trace") {
        if (!Oe(t)) {
          hn &&
            A.warn(
              "[Profiling] `profileLifecycle` is 'trace' but tracing is disabled. Set a `tracesSampleRate` or `tracesSampler` to enable span tracing.",
            );
          return;
        }
        n.initialize(e);
        o && n.notifyRootSpanActive(o);
        Mt.setTimeout(() => {
          const e = $e();
          const t = e && Fe(e);
          t && n.notifyRootSpanActive(t);
        }, 0);
      }
    }
  },
  processEvent(e) {
    return yi(e);
  },
});
const ki = H(wi);
const Pi = H(() => ({
  name: "LaunchDarkly",
  processEvent(e, t, n) {
    return pt(e);
  },
}));
function Ti() {
  return {
    name: "sentry-flag-auditor",
    type: "flag-used",
    synchronous: true,
    method: (e, t, n) => {
      gt(e, t.value);
      mt(e, t.value);
    },
  };
}
const Ei = H(() => ({
  name: "OpenFeature",
  processEvent(e, t, n) {
    return pt(e);
  },
}));
class OpenFeatureIntegrationHook {
  after(e, t) {
    gt(t.flagKey, t.value);
    mt(t.flagKey, t.value);
  }
  error(e, t, n) {
    gt(e.flagKey, e.defaultValue);
    mt(e.flagKey, e.defaultValue);
  }
}
const Ii = H(({ featureFlagClientClass: e }) => ({
  name: "Unleash",
  setupOnce() {
    const t = e.prototype;
    Y(t, "isEnabled", xi);
  },
  processEvent(e, t, n) {
    return pt(e);
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
 */ function xi(e) {
  return function (...t) {
    const n = t[0];
    const r = e.apply(this, t);
    if (typeof n === "string" && typeof r === "boolean") {
      gt(n, r);
      mt(n, r);
    } else
      hn &&
        A.error(
          `[Feature Flags] UnleashClient.isEnabled does not match expected signature. arg0: ${n} (${typeof n}), result: ${r} (${typeof r})`,
        );
    return r;
  };
}
const Ri = ({ growthbookClass: e }) => ht({ growthbookClass: e });
const Ci = H(({ featureFlagClient: e }) => ({
  name: "Statsig",
  setup(t) {
    e.on("gate_evaluation", (e) => {
      gt(e.gate.name, e.gate.value);
      mt(e.gate.name, e.gate.value);
    });
  },
  processEvent(e, t, n) {
    return pt(e);
  },
}));
async function Li() {
  const e = f();
  if (!e) return "no-client-active";
  if (!e.getDsn()) return "no-dsn-configured";
  const t = e.getOptions().tunnel;
  const n =
    "https://o447951.ingest.sentry.io/api/4509632503087104/envelope/?sentry_version=7&sentry_key=c1dfb07d783ad5325c245c1fd3725390&sentry_client=sentry.javascript.browser%2F1.33.7";
  const r = t || n;
  try {
    await yt(() =>
      fetch(r, {
        body: "{}",
        method: "POST",
        mode: "cors",
        credentials: "omit",
      }),
    );
  } catch {
    return "sentry-unreachable";
  }
}
const Oi = "WebWorker";
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
 */ const Ai = H(({ worker: e }) => ({
  name: Oi,
  setupOnce: () => {
    (Array.isArray(e) ? e : [e]).forEach((e) => $i(e));
  },
  addWorker: (e) => $i(e),
}));
function $i(e) {
  e.addEventListener("message", (e) => {
    if (Mi(e.data)) {
      e.stopImmediatePropagation();
      if (e.data._sentryDebugIds) {
        hn && A.log("Sentry debugId web worker message received", e.data);
        Mt._sentryDebugIds = {
          ...e.data._sentryDebugIds,
          ...Mt._sentryDebugIds,
        };
      }
      if (e.data._sentryModuleMetadata) {
        hn &&
          A.log("Sentry module metadata web worker message received", e.data);
        Mt._sentryModuleMetadata = {
          ...e.data._sentryModuleMetadata,
          ...Mt._sentryModuleMetadata,
        };
      }
      if (e.data._sentryWasmImages) {
        hn && A.log("Sentry WASM images web worker message received", e.data);
        const t = Mt._sentryWasmImages || [];
        const n = e.data._sentryWasmImages.filter(
          (e) =>
            w(e) &&
            typeof e.code_file === "string" &&
            !t.some((t) => t.code_file === e.code_file),
        );
        Mt._sentryWasmImages = [...t, ...n];
      }
      if (e.data._sentryWorkerError) {
        hn &&
          A.log(
            "Sentry worker rejection message received",
            e.data._sentryWorkerError,
          );
        Di(e.data._sentryWorkerError);
      }
    }
  });
}
function Di(e) {
  const t = f();
  if (!t) return;
  const n = t.getOptions().stackParser;
  const r = t.getOptions().attachStacktrace;
  const o = e.reason;
  const s = re(o) ? xr(o) : cn(n, o, void 0, r, true);
  s.level = "error";
  e.filename &&
    (s.contexts = { ...s.contexts, worker: { filename: e.filename } });
  te(s, {
    originalException: o,
    mechanism: {
      handled: false,
      type: "auto.browser.web_worker.onunhandledrejection",
    },
  });
  hn && A.log("Captured worker unhandled rejection", o);
}
/**
 * Use this function to register the worker with the Sentry SDK.
 *
 * This function will:
 * - Send debug IDs to the parent thread
 * - Send module metadata to the parent thread (for thirdPartyErrorFilterIntegration)
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
 */ function qi({ self: e }) {
  e.postMessage({
    _sentryMessage: true,
    _sentryDebugIds: e._sentryDebugIds ?? void 0,
    _sentryModuleMetadata: e._sentryModuleMetadata ?? void 0,
  });
  e.addEventListener("unhandledrejection", (t) => {
    const n = Ir(t);
    const r = { reason: n, filename: e.location?.href };
    e.postMessage({ _sentryMessage: true, _sentryWorkerError: r });
    hn && A.log("[Sentry Worker] Forwarding unhandled rejection to parent", r);
  });
  hn &&
    A.log(
      "[Sentry Worker] Registered worker with unhandled rejection handling",
    );
}
function Mi(e) {
  if (!w(e) || e._sentryMessage !== true) return false;
  const t = "_sentryDebugIds" in e;
  const n = "_sentryModuleMetadata" in e;
  const r = "_sentryWorkerError" in e;
  const o = "_sentryWasmImages" in e;
  return (
    !!(t || n || r || o) &&
    !(t && !w(e._sentryDebugIds) && e._sentryDebugIds !== void 0) &&
    !(n && !w(e._sentryModuleMetadata) && e._sentryModuleMetadata !== void 0) &&
    !(r && !w(e._sentryWorkerError)) &&
    !!(
      !o ||
      (Array.isArray(e._sentryWasmImages) &&
        e._sentryWasmImages.every(
          (e) => w(e) && typeof e.code_file === "string",
        ))
    )
  );
}
export {
  BrowserClient,
  OpenFeatureIntegrationHook,
  Mt as WINDOW,
  Zn as breadcrumbsIntegration,
  ur as browserApiErrorsIntegration,
  ki as browserProfilingIntegration,
  yr as browserSessionIntegration,
  us as browserTracingIntegration,
  Ti as buildLaunchDarklyFlagUsedHandler,
  Ln as chromeStackLineParser,
  To as contextLinesIntegration,
  Kn as createUserFeedbackEnvelope,
  br as cultureContextIntegration,
  Go as defaultRequestInstrumentationOptions,
  zn as defaultStackLineParsers,
  Gn as defaultStackParser,
  Li as diagnoseSdkConnectivity,
  sn as eventFromException,
  an as eventFromMessage,
  Yt as exceptionFromError,
  Xt as feedbackAsyncIntegration,
  Kt as feedbackIntegration,
  Kt as feedbackSyncIntegration,
  Kr as forceLoad,
  Dn as geckoStackLineParser,
  Gr as getDefaultIntegrations,
  Pr as globalHandlersIntegration,
  Fo as graphqlClientIntegration,
  Ri as growthbookIntegration,
  oo as httpClientIntegration,
  Ar as httpContextIntegration,
  Xr as init,
  Xo as instrumentOutgoingRequests,
  Pi as launchDarklyIntegration,
  zt as lazyLoadIntegration,
  Nr as linkedErrorsIntegration,
  Ls as makeBrowserOfflineTransport,
  mn as makeFetchTransport,
  Yr as onLoad,
  Ei as openFeatureIntegration,
  jn as opera10StackLineParser,
  Wn as opera11StackLineParser,
  qi as registerWebWorker,
  Ss as reportPageLoaded,
  to as reportingObserverIntegration,
  ws as setActiveSpanInBrowser,
  Jr as showReportDialog,
  Ur as spotlightBrowserIntegration,
  fs as startBrowserTracingNavigationSpan,
  ds as startBrowserTracingPageLoadSpan,
  Ci as statsigIntegration,
  vn as uiProfiler,
  Ii as unleashIntegration,
  Ai as webWorkerIntegration,
  Nn as winjsStackLineParser,
};
