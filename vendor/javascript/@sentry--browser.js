// @sentry/browser@10.60.0 bundled locally from npm:@sentry/browser@10.60.0
var My = Object.defineProperty;
var Jd = (e, t) => {
  for (var n in t) My(e, n, { get: t[n], enumerable: !0 });
};
var y = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
var v = globalThis;
var Ot = "10.60.0";
function ct() {
  return ar(v), v;
}
function ar(e) {
  let t = (e.__SENTRY__ = e.__SENTRY__ || {});
  return (t.version = t.version || Ot), (t[Ot] = t[Ot] || {});
}
function rn(e, t, n = v) {
  let r = (n.__SENTRY__ = n.__SENTRY__ || {}),
    o = (r[Ot] = r[Ot] || {});
  return o[e] || (o[e] = t());
}
var cr = ["debug", "info", "warn", "error", "log", "assert", "trace"],
  Ly = "Sentry Logger ",
  Gr = {};
function We(e) {
  if (!("console" in v)) return e();
  let t = v.console,
    n = {},
    r = Object.keys(Gr);
  r.forEach((o) => {
    let i = Gr[o];
    (n[o] = t[o]), (t[o] = i);
  });
  try {
    return e();
  } finally {
    r.forEach((o) => {
      t[o] = n[o];
    });
  }
}
function Py() {
  ol().enabled = !0;
}
function Uy() {
  ol().enabled = !1;
}
function Xd() {
  return ol().enabled;
}
function Dy(...e) {
  rl("log", ...e);
}
function By(...e) {
  rl("warn", ...e);
}
function Fy(...e) {
  rl("error", ...e);
}
function rl(e, ...t) {
  y &&
    Xd() &&
    We(() => {
      v.console[e](`${Ly}[${e}]:`, ...t);
    });
}
function ol() {
  return y ? rn("loggerSettings", () => ({ enabled: !1 })) : { enabled: !1 };
}
var _ = {
  enable: Py,
  disable: Uy,
  isEnabled: Xd,
  log: Dy,
  warn: By,
  error: Fy,
};
var Qd = /\(error: (.*)\)/,
  Zd = /captureMessage|captureException/;
function $i(...e) {
  let t = e.sort((n, r) => n[0] - r[0]).map((n) => n[1]);
  return (n, r = 0, o = 0) => {
    let i = [],
      s = n.split(`
`);
    for (let a = r; a < s.length; a++) {
      let c = s[a];
      c.length > 1024 && (c = c.slice(0, 1024));
      let u = Qd.test(c) ? c.replace(Qd, "$1") : c;
      if (!u.includes("Error: ")) {
        for (let f of t) {
          let l = f(u);
          if (l) {
            i.push(l);
            break;
          }
        }
        if (i.length >= 50 + o) break;
      }
    }
    return sl(i.slice(o));
  };
}
function Sa(e) {
  return Array.isArray(e) ? $i(...e) : e;
}
function sl(e) {
  if (!e.length) return [];
  let t = Array.from(e);
  return (
    /sentryWrapped/.test(ga(t).function || "") && t.pop(),
    t.reverse(),
    Zd.test(ga(t).function || "") &&
      (t.pop(), Zd.test(ga(t).function || "") && t.pop()),
    t.slice(0, 50).map((n) => ({
      ...n,
      filename: n.filename || ga(t).filename,
      function: n.function || "?",
    }))
  );
}
function ga(e) {
  return e[e.length - 1] || {};
}
var il = "<anonymous>";
function ut(e) {
  try {
    return !e || typeof e != "function" ? il : e.name || il;
  } catch {
    return il;
  }
}
function $r(e) {
  let t = e.exception;
  if (t) {
    let n = [];
    try {
      return (
        t.values.forEach((r) => {
          r.stacktrace.frames && n.push(...r.stacktrace.frames);
        }),
        n
      );
    } catch {
      return;
    }
  }
}
function em(e) {
  let t = e?.startsWith("file://") ? e.slice(7) : e;
  return t?.match(/\/[A-Z]:/) && (t = t.slice(1)), t;
}
var Wi = {},
  tm = {};
function Qe(e, t) {
  return (
    (Wi[e] = Wi[e] || []),
    Wi[e].push(t),
    () => {
      let n = Wi[e];
      if (n) {
        let r = n.indexOf(t);
        r !== -1 && n.splice(r, 1);
      }
    }
  );
}
function Ze(e, t) {
  if (!tm[e]) {
    tm[e] = !0;
    try {
      t();
    } catch (n) {
      y && _.error(`Error while instrumenting ${e}`, n);
    }
  }
}
function Be(e, t) {
  let n = e && Wi[e];
  if (n)
    for (let r of n)
      try {
        r(t);
      } catch (o) {
        y &&
          _.error(
            `Error while triggering instrumentation handler.
Type: ${e}
Name: ${ut(r)}
Error:`,
            o,
          );
      }
}
var al = null;
function ji(e) {
  let t = "error";
  Qe(t, e), Ze(t, Hy);
}
function Hy() {
  (al = v.onerror),
    (v.onerror = function (e, t, n, r, o) {
      return (
        Be("error", { column: r, error: o, line: n, msg: e, url: t }),
        al ? al.apply(this, arguments) : !1
      );
    }),
    (v.onerror.__SENTRY_INSTRUMENTED__ = !0);
}
var cl = null;
function zi(e) {
  let t = "unhandledrejection";
  Qe(t, e), Ze(t, Gy);
}
function Gy() {
  (cl = v.onunhandledrejection),
    (v.onunhandledrejection = function (e) {
      return Be("unhandledrejection", e), cl ? cl.apply(this, arguments) : !0;
    }),
    (v.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0);
}
var nm = Object.prototype.toString;
function Je(e) {
  switch (nm.call(e)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
      return !0;
    default:
      return on(e, Error);
  }
}
function wo(e, t) {
  return nm.call(e) === `[object ${t}]`;
}
function Oo(e) {
  return wo(e, "ErrorEvent");
}
function qi(e) {
  return wo(e, "DOMError");
}
function Ea(e) {
  return wo(e, "DOMException");
}
function je(e) {
  return wo(e, "String");
}
function In(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    "__sentry_template_string__" in e &&
    "__sentry_template_values__" in e
  );
}
function Fe(e) {
  return (
    e === null || In(e) || (typeof e != "object" && typeof e != "function")
  );
}
function ve(e) {
  return wo(e, "Object");
}
function ur(e) {
  return typeof Event < "u" && on(e, Event);
}
function Ta(e) {
  return wo(e, "RegExp");
}
function lt(e) {
  return !!(e?.then && typeof e.then == "function");
}
function on(e, t) {
  try {
    return e instanceof t;
  } catch {
    return !1;
  }
}
function Yi(e) {
  return typeof Request < "u" && on(e, Request);
}
function Ee(e, t, n) {
  if (!(t in e)) return;
  let r = e[t];
  if (typeof r != "function") return;
  let o = n(r);
  typeof o == "function" && Vi(o, r);
  try {
    e[t] = o;
  } catch {
    y && _.log(`Failed to replace method "${t}" in object`, e);
  }
}
function de(e, t, n) {
  try {
    Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 });
  } catch {
    y &&
      _.log(
        `Failed to add non-enumerable property "${String(t)}" to object`,
        e,
      );
  }
}
function Vi(e, t) {
  try {
    let n = t.prototype || {};
    (e.prototype = t.prototype = n), de(e, "__sentry_original__", t);
  } catch {}
}
function lr(e) {
  return e.__sentry_original__;
}
function Ki(e) {
  if (Je(e))
    return { message: e.message, name: e.name, stack: e.stack, ...rm(e) };
  if (ur(e)) {
    let { type: t, target: n, currentTarget: r, detail: o } = e;
    return {
      type: t,
      target: n,
      currentTarget: r,
      ...(o ? { detail: o } : {}),
      ...rm(e),
    };
  }
  return e;
}
function rm(e) {
  return typeof e == "object" && e !== null
    ? Object.fromEntries(Object.entries(e))
    : {};
}
function ya(e) {
  let t = Object.keys(Ki(e));
  return t.sort(), t[0] ? t.join(", ") : "[object has no keys]";
}
var Mo;
function Wr(e) {
  if (Mo !== void 0) return Mo ? Mo(e) : e();
  let t = Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__"),
    n = v;
  return t in n && typeof n[t] == "function"
    ? ((Mo = n[t]), Mo(e))
    : ((Mo = null), e());
}
function Et() {
  return Wr(() => Math.random());
}
function et() {
  return Wr(() => Date.now());
}
var om = Symbol.for("sentry.skipNormalization"),
  $y = Symbol.for("sentry.overrideNormalizationDepth");
function im(e) {
  de(e, om, !0);
}
function sm(e) {
  return !!e[om];
}
function am(e) {
  let t = e[$y];
  return typeof t == "number" ? t : void 0;
}
var ul;
function Ia(e) {
  ul = e;
}
function he(e, t = 100, n = 1 / 0) {
  try {
    return ll("", e, t, n);
  } catch (r) {
    return { ERROR: `**non-serializable** (${r})` };
  }
}
function Ji(e, t = 3, n = 100 * 1024) {
  let r = he(e, t);
  return zy(r) > n ? Ji(e, t - 1, n) : r;
}
function ll(e, t, n = 1 / 0, r = 1 / 0, o = qy()) {
  let [i, s] = o;
  if (
    t == null ||
    ["boolean", "string"].includes(typeof t) ||
    (typeof t == "number" && Number.isFinite(t))
  )
    return t;
  let a = fl(e, t);
  if (!a.startsWith("[object ")) return a;
  if (sm(t)) return t;
  let c = am(t),
    u = c !== void 0 ? c : n;
  if (u === 0) return a.replace("object ", "");
  if (i(t)) return "[Circular ~]";
  let f = t;
  if (f && typeof f.toJSON == "function")
    try {
      let m = f.toJSON();
      return ll("", m, u - 1, r, o);
    } catch {}
  let l = Array.isArray(t) ? [] : {},
    d = 0,
    p = Ki(t);
  for (let m in p) {
    if (!Object.prototype.hasOwnProperty.call(p, m)) continue;
    if (d >= r) {
      l[m] = "[MaxProperties ~]";
      break;
    }
    let h = p[m];
    (l[m] = ll(m, h, u - 1, r, o)), d++;
  }
  return s(t), l;
}
function fl(e, t) {
  try {
    if (ul) {
      let r = ul(t);
      if (r) return r;
    }
    return typeof global < "u" && t === global
      ? "[Global]"
      : typeof t == "number" && !Number.isFinite(t)
        ? `[${t}]`
        : typeof t == "function"
          ? `[Function: ${ut(t)}]`
          : typeof t == "symbol"
            ? `[${String(t)}]`
            : typeof t == "bigint"
              ? `[BigInt: ${String(t)}]`
              : `[object ${Wy(t)}]`;
  } catch (n) {
    return `**non-serializable** (${n})`;
  }
}
function Wy(e) {
  let t = Object.getPrototypeOf(e);
  return t?.constructor ? t.constructor.name : "null prototype";
}
function jy(e) {
  return ~-encodeURI(e).split(/%..|./).length;
}
function zy(e) {
  return jy(JSON.stringify(e));
}
function qy() {
  let e = new WeakSet();
  function t(r) {
    return e.has(r) ? !0 : (e.add(r), !1);
  }
  function n(r) {
    e.delete(r);
  }
  return [t, n];
}
function sn(e, t = 0) {
  return typeof e != "string" || t === 0 || e.length <= t
    ? e
    : `${e.slice(0, t)}...`;
}
function Lo(e, t) {
  let n = e,
    r = n.length;
  if (r <= 150) return n;
  t > r && (t = r);
  let o = Math.max(t - 60, 0);
  o < 5 && (o = 0);
  let i = Math.min(o + 140, r);
  return (
    i > r - 5 && (i = r),
    i === r && (o = Math.max(i - 140, 0)),
    (n = n.slice(o, i)),
    o > 0 && (n = `'{snip} ${n}`),
    i < r && (n += " {snip}"),
    n
  );
}
function fr(e, t) {
  if (!Array.isArray(e)) return "";
  let n = [];
  for (let r = 0; r < e.length; r++) {
    let o = e[r];
    Fe(o)
      ? n.push(String(o))
      : o instanceof Error
        ? n.push(o.message ? `${o.name}: ${o.message}` : o.name)
        : n.push(fl(void 0, o));
  }
  return n.join(t);
}
function pr(e, t, n = !1) {
  return je(e)
    ? Ta(t)
      ? t.test(e)
      : je(t)
        ? n
          ? e === t
          : e.includes(t)
        : typeof t == "function"
          ? t(e)
          : !1
    : !1;
}
function He(e, t = [], n = !1) {
  for (let r of t) if (pr(e, r, n)) return !0;
  return !1;
}
function Yy() {
  let e = v;
  return e.crypto || e.msCrypto;
}
var pl;
function Vy() {
  return Et() * 16;
}
function me(e = Yy()) {
  try {
    if (e?.randomUUID) return Wr(() => e.randomUUID()).replace(/-/g, "");
  } catch {}
  return (
    pl || (pl = "10000000100040008000" + 1e11),
    pl.replace(/[018]/g, (t) => (t ^ ((Vy() & 15) >> (t / 4))).toString(16))
  );
}
function cm(e) {
  return e.exception?.values?.[0];
}
function an(e) {
  let { message: t, event_id: n } = e;
  if (t) return t;
  let r = cm(e);
  return r
    ? r.type && r.value
      ? `${r.type}: ${r.value}`
      : r.type || r.value || n || "<unknown>"
    : n || "<unknown>";
}
function jr(e, t, n) {
  let r = (e.exception = e.exception || {}),
    o = (r.values = r.values || []),
    i = (o[0] = o[0] || {});
  i.value || (i.value = t || ""), i.type || (i.type = n || "Error");
}
function Ye(e, t) {
  let n = cm(e);
  if (!n) return;
  let r = { type: "generic", handled: !0 },
    o = n.mechanism;
  if (((n.mechanism = { ...r, ...o, ...t }), t && "data" in t)) {
    let i = { ...o?.data, ...t.data };
    n.mechanism.data = i;
  }
}
function ba(e, t, n = 5) {
  if (t.lineno === void 0) return;
  let r = e.length,
    o = Math.max(Math.min(r - 1, t.lineno - 1), 0);
  t.pre_context = e.slice(Math.max(0, o - n), o).map((s) => Lo(s, 0));
  let i = Math.min(r - 1, o);
  (t.context_line = Lo(e[i], t.colno || 0)),
    (t.post_context = e
      .slice(Math.min(o + 1, r), o + 1 + n)
      .map((s) => Lo(s, 0)));
}
function Xi(e) {
  if (dl(e)) return !0;
  try {
    de(e, "__sentry_captured__", !0);
  } catch {}
  return !1;
}
function dl(e) {
  try {
    return e.__sentry_captured__;
  } catch {}
}
var lm = 1e3;
function Tt() {
  return et() / lm;
}
function Ky() {
  let { performance: e } = v;
  if (!e?.now || !e.timeOrigin) return Tt;
  let t = e.timeOrigin;
  return () => (t + Wr(() => e.now())) / lm;
}
var um;
function Z() {
  return (um ?? (um = Ky()))();
}
var ml = null;
function Jy() {
  let { performance: e } = v;
  if (!e?.now) return;
  let t = 3e5,
    n = Wr(() => e.now()),
    r = et(),
    o = e.timeOrigin;
  if (typeof o == "number" && Math.abs(o + n - r) < t) return o;
  let i = e.timing?.navigationStart;
  return typeof i == "number" && Math.abs(i + n - r) < t ? i : r - n;
}
function le() {
  return ml === null && (ml = Jy()), ml;
}
function fm(e) {
  let t = Z(),
    n = {
      sid: me(),
      init: !0,
      timestamp: t,
      started: t,
      duration: 0,
      status: "ok",
      errors: 0,
      ignoreDuration: !1,
      toJSON: () => Xy(n),
    };
  return e && Hn(n, e), n;
}
function Hn(e, t = {}) {
  if (
    (t.user &&
      (!e.ipAddress && t.user.ip_address && (e.ipAddress = t.user.ip_address),
      !e.did &&
        !t.did &&
        (e.did = t.user.id || t.user.email || t.user.username)),
    (e.timestamp = t.timestamp || Z()),
    t.abnormal_mechanism && (e.abnormal_mechanism = t.abnormal_mechanism),
    t.ignoreDuration && (e.ignoreDuration = t.ignoreDuration),
    t.sid && (e.sid = t.sid.length === 32 ? t.sid : me()),
    t.init !== void 0 && (e.init = t.init),
    !e.did && t.did && (e.did = `${t.did}`),
    typeof t.started == "number" && (e.started = t.started),
    e.ignoreDuration)
  )
    e.duration = void 0;
  else if (typeof t.duration == "number") e.duration = t.duration;
  else {
    let n = e.timestamp - e.started;
    e.duration = n >= 0 ? n : 0;
  }
  t.release && (e.release = t.release),
    t.environment && (e.environment = t.environment),
    !e.ipAddress && t.ipAddress && (e.ipAddress = t.ipAddress),
    !e.userAgent && t.userAgent && (e.userAgent = t.userAgent),
    typeof t.errors == "number" && (e.errors = t.errors),
    t.status && (e.status = t.status);
}
function pm(e, t) {
  let n = {};
  t ? (n = { status: t }) : e.status === "ok" && (n = { status: "exited" }),
    Hn(e, n);
}
function Xy(e) {
  return {
    sid: `${e.sid}`,
    init: e.init,
    started: new Date(e.started * 1e3).toISOString(),
    timestamp: new Date(e.timestamp * 1e3).toISOString(),
    status: e.status,
    errors: e.errors,
    did:
      typeof e.did == "number" || typeof e.did == "string"
        ? `${e.did}`
        : void 0,
    duration: e.duration,
    abnormal_mechanism: e.abnormal_mechanism,
    attrs: {
      release: e.release,
      environment: e.environment,
      ip_address: e.ipAddress,
      user_agent: e.userAgent,
    },
  };
}
function dr(e, t, n = 2) {
  if (!t || typeof t != "object" || n <= 0) return t;
  if (e && Object.keys(t).length === 0) return e;
  let r = { ...e };
  for (let o in t)
    Object.prototype.hasOwnProperty.call(t, o) &&
      (r[o] = dr(r[o], t[o], n - 1));
  return r;
}
function Xe() {
  return me();
}
function tt() {
  return me().substring(16);
}
function Aa(e) {
  try {
    let t = v.WeakRef;
    if (typeof t == "function") return new t(e);
  } catch {}
  return e;
}
function Ra(e) {
  if (e) {
    if (typeof e == "object" && "deref" in e && typeof e.deref == "function")
      try {
        return e.deref();
      } catch {
        return;
      }
    return e;
  }
}
var _l = "_sentrySpan";
function ft(e, t) {
  t ? de(e, _l, Aa(t)) : delete e[_l];
}
function cn(e) {
  return Ra(e[_l]);
}
var Qy = 100,
  pt = class e {
    constructor() {
      (this._notifyingListeners = !1),
        (this._scopeListeners = []),
        (this._eventProcessors = []),
        (this._breadcrumbs = []),
        (this._attachments = []),
        (this._user = {}),
        (this._tags = {}),
        (this._attributes = {}),
        (this._extra = {}),
        (this._contexts = {}),
        (this._sdkProcessingMetadata = {}),
        (this._propagationContext = { traceId: Xe(), sampleRand: Et() });
    }
    clone() {
      let t = new e();
      return (
        (t._breadcrumbs = [...this._breadcrumbs]),
        (t._tags = { ...this._tags }),
        (t._attributes = { ...this._attributes }),
        (t._extra = { ...this._extra }),
        (t._contexts = { ...this._contexts }),
        this._contexts.flags &&
          (t._contexts.flags = { values: [...this._contexts.flags.values] }),
        (t._user = this._user),
        (t._level = this._level),
        (t._session = this._session),
        (t._transactionName = this._transactionName),
        (t._fingerprint = this._fingerprint),
        (t._eventProcessors = [...this._eventProcessors]),
        (t._attachments = [...this._attachments]),
        (t._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }),
        (t._propagationContext = { ...this._propagationContext }),
        (t._client = this._client),
        (t._lastEventId = this._lastEventId),
        (t._conversationId = this._conversationId),
        ft(t, cn(this)),
        t
      );
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
      return this._eventProcessors.push(t), this;
    }
    setUser(t) {
      return (
        (this._user = t || {
          email: void 0,
          id: void 0,
          ip_address: void 0,
          username: void 0,
        }),
        this._session && Hn(this._session, { user: t }),
        this._notifyScopeListeners(),
        this
      );
    }
    getUser() {
      return this._user;
    }
    setConversationId(t) {
      return (
        (this._conversationId = t || void 0), this._notifyScopeListeners(), this
      );
    }
    setTags(t) {
      return (
        (this._tags = { ...this._tags, ...t }),
        this._notifyScopeListeners(),
        this
      );
    }
    setTag(t, n) {
      return this.setTags({ [t]: n });
    }
    setAttributes(t) {
      return (
        (this._attributes = { ...this._attributes, ...t }),
        this._notifyScopeListeners(),
        this
      );
    }
    setAttribute(t, n) {
      return this.setAttributes({ [t]: n });
    }
    removeAttribute(t) {
      return (
        t in this._attributes &&
          (delete this._attributes[t], this._notifyScopeListeners()),
        this
      );
    }
    setExtras(t) {
      return (
        (this._extra = { ...this._extra, ...t }),
        this._notifyScopeListeners(),
        this
      );
    }
    setExtra(t, n) {
      return (
        (this._extra = { ...this._extra, [t]: n }),
        this._notifyScopeListeners(),
        this
      );
    }
    setFingerprint(t) {
      return (this._fingerprint = t), this._notifyScopeListeners(), this;
    }
    setLevel(t) {
      return (this._level = t), this._notifyScopeListeners(), this;
    }
    setTransactionName(t) {
      return (this._transactionName = t), this._notifyScopeListeners(), this;
    }
    setContext(t, n) {
      return (
        n === null ? delete this._contexts[t] : (this._contexts[t] = n),
        this._notifyScopeListeners(),
        this
      );
    }
    setSession(t) {
      return (
        t ? (this._session = t) : delete this._session,
        this._notifyScopeListeners(),
        this
      );
    }
    getSession() {
      return this._session;
    }
    update(t) {
      if (!t) return this;
      let n = typeof t == "function" ? t(this) : t,
        r = n instanceof e ? n.getScopeData() : ve(n) ? t : void 0,
        {
          tags: o,
          attributes: i,
          extra: s,
          user: a,
          contexts: c,
          level: u,
          fingerprint: f = [],
          propagationContext: l,
          conversationId: d,
        } = r || {};
      return (
        (this._tags = { ...this._tags, ...o }),
        (this._attributes = { ...this._attributes, ...i }),
        (this._extra = { ...this._extra, ...s }),
        (this._contexts = { ...this._contexts, ...c }),
        a && Object.keys(a).length && (this._user = a),
        u && (this._level = u),
        f.length && (this._fingerprint = f),
        l && (this._propagationContext = l),
        d && (this._conversationId = d),
        this
      );
    }
    clear() {
      return (
        (this._breadcrumbs = []),
        (this._tags = {}),
        (this._attributes = {}),
        (this._extra = {}),
        (this._user = {}),
        (this._contexts = {}),
        (this._level = void 0),
        (this._transactionName = void 0),
        (this._fingerprint = void 0),
        (this._session = void 0),
        (this._conversationId = void 0),
        ft(this, void 0),
        (this._attachments = []),
        this.setPropagationContext({ traceId: Xe(), sampleRand: Et() }),
        this._notifyScopeListeners(),
        this
      );
    }
    addBreadcrumb(t, n) {
      let r = typeof n == "number" ? n : Qy;
      if (r <= 0) return this;
      let o = {
        timestamp: Tt(),
        ...t,
        message: t.message ? sn(t.message, 2048) : t.message,
      };
      return (
        this._breadcrumbs.push(o),
        this._breadcrumbs.length > r &&
          ((this._breadcrumbs = this._breadcrumbs.slice(-r)),
          this._client?.recordDroppedEvent("buffer_overflow", "log_item")),
        this._notifyScopeListeners(),
        this
      );
    }
    getLastBreadcrumb() {
      return this._breadcrumbs[this._breadcrumbs.length - 1];
    }
    clearBreadcrumbs() {
      return (this._breadcrumbs = []), this._notifyScopeListeners(), this;
    }
    addAttachment(t) {
      return this._attachments.push(t), this;
    }
    clearAttachments() {
      return (this._attachments = []), this;
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
        span: cn(this),
        conversationId: this._conversationId,
      };
    }
    setSDKProcessingMetadata(t) {
      return (
        (this._sdkProcessingMetadata = dr(this._sdkProcessingMetadata, t, 2)),
        this
      );
    }
    setPropagationContext(t) {
      return (this._propagationContext = t), this;
    }
    getPropagationContext() {
      return this._propagationContext;
    }
    captureException(t, n) {
      let r = n?.event_id || me();
      if (!this._client)
        return (
          y &&
            _.warn(
              "No client configured on scope - will not capture exception!",
            ),
          r
        );
      let o = new Error("Sentry syntheticException");
      return (
        this._client.captureException(
          t,
          { originalException: t, syntheticException: o, ...n, event_id: r },
          this,
        ),
        r
      );
    }
    captureMessage(t, n, r) {
      let o = r?.event_id || me();
      if (!this._client)
        return (
          y &&
            _.warn("No client configured on scope - will not capture message!"),
          o
        );
      let i = r?.syntheticException ?? new Error(t);
      return (
        this._client.captureMessage(
          t,
          n,
          { originalException: t, syntheticException: i, ...r, event_id: o },
          this,
        ),
        o
      );
    }
    captureEvent(t, n) {
      let r = t.event_id || n?.event_id || me();
      return this._client
        ? (this._client.captureEvent(t, { ...n, event_id: r }, this), r)
        : (y &&
            _.warn("No client configured on scope - will not capture event!"),
          r);
    }
    _notifyScopeListeners() {
      this._notifyingListeners ||
        ((this._notifyingListeners = !0),
        this._scopeListeners.forEach((t) => {
          t(this);
        }),
        (this._notifyingListeners = !1));
    }
  };
function dm() {
  return rn("defaultCurrentScope", () => new pt());
}
function mm() {
  return rn("defaultIsolationScope", () => new pt());
}
var _m = (e) => e instanceof Promise && !e[hm],
  hm = Symbol("chained PromiseLike"),
  va = (e, t, n) => {
    let r = e.then(
      (o) => (t(o), o),
      (o) => {
        throw (n(o), o);
      },
    );
    return _m(r) && _m(e) ? r : Zy(e, r);
  },
  Zy = (e, t) => {
    if (!t) return e;
    let n = !1;
    for (let r in e) {
      if (r in t) continue;
      n = !0;
      let o = e[r];
      typeof o == "function"
        ? Object.defineProperty(t, r, {
            value: (...i) => o.apply(e, i),
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[r] = o);
    }
    return n && Object.assign(t, { [hm]: !0 }), t;
  };
var hl = class {
  constructor(t, n) {
    let r;
    t ? (r = t) : (r = new pt());
    let o;
    n ? (o = n) : (o = new pt()),
      (this._stack = [{ scope: r }]),
      (this._isolationScope = o);
  }
  withScope(t) {
    let n = this._pushScope(),
      r;
    try {
      r = t(n);
    } catch (o) {
      throw (this._popScope(), o);
    }
    return lt(r)
      ? va(
          r,
          () => this._popScope(),
          () => this._popScope(),
        )
      : (this._popScope(), r);
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
    let t = this.getScope().clone();
    return this._stack.push({ client: this.getClient(), scope: t }), t;
  }
  _popScope() {
    return this._stack.length <= 1 ? !1 : !!this._stack.pop();
  }
};
function Po() {
  let e = ct(),
    t = ar(e);
  return (t.stack = t.stack || new hl(dm(), mm()));
}
function eI(e) {
  return Po().withScope(e);
}
function tI(e, t) {
  let n = Po();
  return n.withScope(() => ((n.getStackTop().scope = e), t(e)));
}
function gm(e) {
  return Po().withScope(() => e(Po().getIsolationScope()));
}
function Sm() {
  return {
    withIsolationScope: gm,
    withScope: eI,
    withSetScope: tI,
    withSetIsolationScope: (e, t) => gm(t),
    getCurrentScope: () => Po().getScope(),
    getIsolationScope: () => Po().getIsolationScope(),
  };
}
function Wt(e) {
  let t = ar(e);
  return t.acs ? t.acs : Sm();
}
function nI(e) {
  return (
    typeof e == "object" &&
    e != null &&
    !Array.isArray(e) &&
    Object.keys(e).includes("value")
  );
}
function rI(e, t) {
  let { value: n, unit: r } = nI(e) ? e : { value: e, unit: void 0 },
    o = oI(n),
    i = r && typeof r == "string" ? { unit: r } : {};
  if (o) return { ...o, ...i };
  if (!t || (t === "skip-undefined" && n === void 0)) return;
  let s = "";
  try {
    s = JSON.stringify(n) ?? "";
  } catch {}
  return { value: s, type: "string", ...i };
}
function Gn(e, t = !1) {
  let n = {};
  for (let [r, o] of Object.entries(e ?? {})) {
    let i = rI(o, t);
    i && (n[r] = i);
  }
  return n;
}
function gl(e) {
  if (!e) return 0;
  let t = 0;
  for (let [n, r] of Object.entries(e)) {
    (t += n.length * 2),
      (t += r.type.length * 2),
      (t += (r.unit?.length ?? 0) * 2);
    let o = r.value;
    Array.isArray(o)
      ? (t += Em(o[0]) * o.length)
      : Fe(o)
        ? (t += Em(o))
        : (t += 100);
  }
  return t;
}
function Em(e) {
  return typeof e == "string"
    ? e.length * 2
    : typeof e == "boolean"
      ? 4
      : typeof e == "number"
        ? 8
        : 0;
}
function oI(e) {
  if (Array.isArray(e)) return { value: e, type: "array" };
  let t =
    typeof e == "string"
      ? "string"
      : typeof e == "boolean"
        ? "boolean"
        : typeof e == "number" && !Number.isNaN(e)
          ? Number.isInteger(e)
            ? "integer"
            : "double"
          : null;
  if (t) return { value: e, type: t };
}
var Tm;
function Sl() {
  return Tm?.();
}
function Na() {
  return Tm !== void 0;
}
function C() {
  let e = ct();
  return Wt(e).getCurrentScope();
}
function te() {
  let e = ct();
  return Wt(e).getIsolationScope();
}
function un() {
  return rn("globalScope", () => new pt());
}
function De(...e) {
  let t = ct(),
    n = Wt(t);
  if (e.length === 2) {
    let [r, o] = e;
    return r ? n.withSetScope(r, o) : n.withScope(o);
  }
  return n.withScope(e[0]);
}
function Ca(...e) {
  let t = ct(),
    n = Wt(t);
  if (e.length === 2) {
    let [r, o] = e;
    return r ? n.withSetIsolationScope(r, o) : n.withIsolationScope(o);
  }
  return n.withIsolationScope(e[0]);
}
function I() {
  return C().getClient();
}
function Uo(e) {
  let t = Sl();
  if (t) return { trace_id: t.traceId, span_id: t.spanId };
  let n = e.getPropagationContext(),
    { traceId: r, parentSpanId: o, propagationSpanId: i } = n,
    s = { trace_id: r, span_id: i || tt() };
  return o && (s.parent_span_id = o), s;
}
var Me = "sentry.source",
  $n = "sentry.sample_rate",
  Do = "sentry.previous_trace_sample_rate",
  J = "sentry.op",
  $ = "sentry.origin",
  Wn = "sentry.idle_span_finish_reason",
  ln = "sentry.measurement_unit",
  fn = "sentry.measurement_value",
  xa = "sentry.release",
  ka = "sentry.environment",
  wa = "sentry.segment.name",
  Oa = "sentry.segment.id",
  Ma = "sentry.sdk.name",
  La = "sentry.sdk.version",
  Pa = "sentry.sdk.integrations",
  Ua = "user.id",
  Da = "user.email",
  Ba = "user.ip_address",
  Fa = "user.name",
  zr = "sentry.custom_span_name",
  qr = "sentry.profile_id",
  nt = "sentry.exclusive_time";
var Ha = "http.request.method",
  Ga = "url.full",
  $a = "sentry.link.type",
  Wa = "gen_ai.conversation.id";
function El(e) {
  if (e < 400 && e >= 100) return { code: 1 };
  if (e >= 400 && e < 500)
    switch (e) {
      case 401:
        return { code: 2, message: "unauthenticated" };
      case 403:
        return { code: 2, message: "permission_denied" };
      case 404:
        return { code: 2, message: "not_found" };
      case 409:
        return { code: 2, message: "already_exists" };
      case 413:
        return { code: 2, message: "failed_precondition" };
      case 429:
        return { code: 2, message: "resource_exhausted" };
      case 499:
        return { code: 2, message: "cancelled" };
      default:
        return { code: 2, message: "invalid_argument" };
    }
  if (e >= 500 && e < 600)
    switch (e) {
      case 501:
        return { code: 2, message: "unimplemented" };
      case 503:
        return { code: 2, message: "unavailable" };
      case 504:
        return { code: 2, message: "deadline_exceeded" };
      default:
        return { code: 2, message: "internal_error" };
    }
  return { code: 2, message: "internal_error" };
}
function jn(e, t) {
  e.setAttribute("http.response.status_code", t);
  let n = El(t);
  n.message !== "unknown_error" && e.setStatus(n);
}
var ym = "_sentryScope",
  Im = "_sentryIsolationScope",
  iI = Symbol.for("sentry.otelSourceInference");
function mr(e, t, n) {
  e && (de(e, Im, Aa(n)), de(e, ym, t));
}
function bn(e) {
  let t = e;
  return { scope: t[ym], isolationScope: Ra(t[Im]) };
}
function bm(e) {
  return e[iI] === !0;
}
var Qi = "sentry-";
var sI = 8192;
function Bo(e) {
  let t = aI(e);
  if (!t) return;
  let n = Object.entries(t).reduce((r, [o, i]) => {
    if (o.startsWith(Qi)) {
      let s = o.slice(Qi.length);
      r[s] = i;
    }
    return r;
  }, {});
  if (Object.keys(n).length > 0) return n;
}
function ja(e) {
  if (!e) return;
  let t = Object.entries(e).reduce(
    (n, [r, o]) => (o && (n[`${Qi}${r}`] = o), n),
    {},
  );
  return cI(t);
}
function aI(e) {
  if (!(!e || (!je(e) && !Array.isArray(e))))
    return Array.isArray(e)
      ? e.reduce((t, n) => {
          let r = Am(n);
          return (
            Object.entries(r).forEach(([o, i]) => {
              t[o] = i;
            }),
            t
          );
        }, {})
      : Am(e);
}
function Am(e) {
  return e
    .split(",")
    .map((t) => {
      let n = t.indexOf("=");
      if (n === -1) return [];
      let r = t.slice(0, n),
        o = t.slice(n + 1);
      return [r, o].map((i) => {
        try {
          return decodeURIComponent(i.trim());
        } catch {
          return;
        }
      });
    })
    .reduce((t, [n, r]) => (n && r && (t[n] = r), t), {});
}
function cI(e) {
  if (Object.keys(e).length !== 0)
    return Object.entries(e).reduce((t, [n, r], o) => {
      let i = `${encodeURIComponent(n)}=${encodeURIComponent(r)}`,
        s = o === 0 ? i : `${t},${i}`;
      return s.length > sI
        ? (y &&
            _.warn(
              `Not adding key: ${n} with val: ${r} to baggage header due to exceeding baggage size limits.`,
            ),
          t)
        : s;
    }, "");
}
var uI = /^o(\d+)\./,
  lI =
    /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;
function fI(e) {
  return e === "http" || e === "https";
}
function Ge(e, t = !1) {
  let {
    host: n,
    path: r,
    pass: o,
    port: i,
    projectId: s,
    protocol: a,
    publicKey: c,
  } = e;
  return `${a}://${c}${t && o ? `:${o}` : ""}@${n}${i ? `:${i}` : ""}/${r && `${r}/`}${s}`;
}
function za(e) {
  let t = lI.exec(e);
  if (!t) {
    We(() => {
      console.error(`Invalid Sentry Dsn: ${e}`);
    });
    return;
  }
  let [n, r, o = "", i = "", s = "", a = ""] = t.slice(1),
    c = "",
    u = a,
    f = u.split("/");
  if ((f.length > 1 && ((c = f.slice(0, -1).join("/")), (u = f.pop())), u)) {
    let l = u.match(/^\d+/);
    l && (u = l[0]);
  }
  return Rm({
    host: i,
    pass: o,
    path: c,
    projectId: u,
    port: s,
    protocol: n,
    publicKey: r,
  });
}
function Rm(e) {
  return {
    protocol: e.protocol,
    publicKey: e.publicKey || "",
    pass: e.pass || "",
    host: e.host,
    port: e.port || "",
    path: e.path || "",
    projectId: e.projectId,
  };
}
function pI(e) {
  if (!y) return !0;
  let { port: t, projectId: n, protocol: r } = e;
  return ["protocol", "publicKey", "host", "projectId"].find((s) =>
    e[s] ? !1 : (_.error(`Invalid Sentry Dsn: ${s} missing`), !0),
  )
    ? !1
    : n.match(/^\d+$/)
      ? fI(r)
        ? t && isNaN(parseInt(t, 10))
          ? (_.error(`Invalid Sentry Dsn: Invalid port ${t}`), !1)
          : !0
        : (_.error(`Invalid Sentry Dsn: Invalid protocol ${r}`), !1)
      : (_.error(`Invalid Sentry Dsn: Invalid projectId ${n}`), !1);
}
function dI(e) {
  return e.match(uI)?.[1];
}
function qa(e) {
  let t = e.getOptions(),
    { host: n } = e.getDsn() || {},
    r;
  return t.orgId ? (r = String(t.orgId)) : n && (r = dI(n)), r;
}
function Zi(e) {
  let t = typeof e == "string" ? za(e) : Rm(e);
  if (!(!t || !pI(t))) return t;
}
function Mt(e) {
  if (typeof e == "boolean") return Number(e);
  let t = typeof e == "string" ? parseFloat(e) : e;
  if (!(typeof t != "number" || isNaN(t) || t < 0 || t > 1)) return t;
}
var Ya = new RegExp(
  "^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$",
);
function vm(e) {
  if (!e) return;
  let t = e.match(Ya);
  if (!t) return;
  let n;
  return (
    t[3] === "1" ? (n = !0) : t[3] === "0" && (n = !1),
    { traceId: t[1], parentSampled: n, parentSpanId: t[2] }
  );
}
function es(e, t) {
  let n = vm(e),
    r = Bo(t);
  if (!n?.traceId) return { traceId: Xe(), sampleRand: Et() };
  let o = mI(n, r);
  r && (r.sample_rand = o.toString());
  let { traceId: i, parentSpanId: s, parentSampled: a } = n;
  return {
    traceId: i,
    parentSpanId: s,
    sampled: a,
    dsc: r || {},
    sampleRand: o,
  };
}
function ts(e = Xe(), t = tt(), n) {
  let r = "";
  return n !== void 0 && (r = n ? "-1" : "-0"), `${e}-${t}${r}`;
}
function ns(e = Xe(), t = tt(), n) {
  return `00-${e}-${t}-${n ? "01" : "00"}`;
}
function mI(e, t) {
  let n = Mt(t?.sample_rand);
  if (n !== void 0) return n;
  let r = Mt(t?.sample_rate);
  return r && e?.parentSampled !== void 0
    ? e.parentSampled
      ? Et() * r
      : r + Et() * (1 - r)
    : Et();
}
function Tl(e, t) {
  let n = qa(e);
  return t && n && t !== n
    ? (_.log(
        `Won't continue trace because org IDs don't match (incoming baggage: ${t}, SDK options: ${n})`,
      ),
      !1)
    : (e.getOptions().strictTraceContinuation || !1) && ((t && !n) || (!t && n))
      ? (_.log(
          `Starting a new trace because strict trace continuation is enabled but one org ID is missing (incoming baggage: ${t}, Sentry client: ${n})`,
        ),
        !1)
      : !0;
}
var Va = 0,
  os = 1,
  Nm = !1;
function km(e) {
  let { spanId: t, traceId: n } = e.spanContext(),
    {
      data: r,
      op: o,
      parent_span_id: i,
      status: s,
      origin: a,
      links: c,
    } = L(e);
  return {
    parent_span_id: i,
    span_id: t,
    trace_id: n,
    data: r,
    op: o,
    status: s,
    origin: a,
    links: c,
  };
}
function Fo(e) {
  let { spanId: t, traceId: n, isRemote: r } = e.spanContext(),
    o = r ? t : L(e).parent_span_id,
    i = bn(e).scope,
    s = r ? i?.getPropagationContext().propagationSpanId || tt() : t;
  return { parent_span_id: o, span_id: s, trace_id: n };
}
function is(e) {
  let { traceId: t, spanId: n } = e.spanContext(),
    r = rt(e);
  return ts(t, n, r);
}
function wm(e) {
  let { traceId: t, spanId: n } = e.spanContext(),
    r = rt(e);
  return ns(t, n, r);
}
function ss(e) {
  if (e && e.length > 0)
    return e.map(
      ({
        context: { spanId: t, traceId: n, traceFlags: r, ...o },
        attributes: i,
      }) => ({
        span_id: t,
        trace_id: n,
        sampled: r === os,
        attributes: i,
        ...o,
      }),
    );
}
function Il(e) {
  if (e?.length)
    return e.map(
      ({
        context: { spanId: t, traceId: n, traceFlags: r },
        attributes: o,
      }) => ({ span_id: t, trace_id: n, sampled: r === os, attributes: o }),
    );
}
function yt(e) {
  return typeof e == "number"
    ? Cm(e)
    : Array.isArray(e)
      ? e[0] + e[1] / 1e9
      : e instanceof Date
        ? Cm(e.getTime())
        : Z();
}
function Cm(e) {
  return e > 9999999999 ? e / 1e3 : e;
}
function L(e) {
  if (Lm(e)) return e.getSpanJSON();
  let { spanId: t, traceId: n } = e.spanContext();
  if (Mm(e)) {
    let {
      attributes: r,
      startTime: o,
      name: i,
      endTime: s,
      status: a,
      links: c,
    } = e;
    return {
      span_id: t,
      trace_id: n,
      data: r,
      description: i,
      parent_span_id: Om(e),
      start_timestamp: yt(o),
      timestamp: yt(s) || void 0,
      status: as(a),
      op: r[J],
      origin: r[$],
      links: ss(c),
    };
  }
  return { span_id: t, trace_id: n, start_timestamp: 0, data: {} };
}
function _r(e) {
  if (Lm(e)) return e.getStreamedSpanJSON();
  let { spanId: t, traceId: n } = e.spanContext();
  if (Mm(e)) {
    let {
      attributes: r,
      startTime: o,
      name: i,
      endTime: s,
      status: a,
      links: c,
    } = e;
    return {
      name: i,
      span_id: t,
      trace_id: n,
      parent_span_id: Om(e),
      start_timestamp: yt(o),
      end_timestamp: yt(s),
      is_segment: e === Vr(e),
      status: bl(a),
      attributes: r,
      links: Il(c),
    };
  }
  return {
    span_id: t,
    trace_id: n,
    start_timestamp: 0,
    name: "",
    end_timestamp: 0,
    status: "ok",
    is_segment: e === Vr(e),
  };
}
function Om(e) {
  return "parentSpanId" in e
    ? e.parentSpanId
    : "parentSpanContext" in e
      ? e.parentSpanContext?.spanId
      : void 0;
}
function Ka(e) {
  return {
    ...e,
    attributes: Gn(e.attributes),
    links: e.links?.map((t) => ({ ...t, attributes: Gn(t.attributes) })),
  };
}
function Mm(e) {
  let t = e;
  return (
    !!t.attributes && !!t.startTime && !!t.name && !!t.endTime && !!t.status
  );
}
function Lm(e) {
  return typeof e.getSpanJSON == "function";
}
function rt(e) {
  let { traceFlags: t } = e.spanContext();
  return t === os;
}
function as(e) {
  if (!(!e || e.code === 0))
    return e.code === 1 ? "ok" : e.message || "internal_error";
}
function bl(e) {
  return !e || e.code === 1 || e.code === 0 || e.message === "cancelled"
    ? "ok"
    : "error";
}
var Yr = "_sentryChildSpans",
  yl = "_sentryRootSpan";
function Ho(e, t) {
  let n = e[yl] || e;
  de(t, yl, n), e[Yr] ? e[Yr].add(t) : de(e, Yr, new Set([t]));
}
function Pm(e, t) {
  e[Yr] && e[Yr].delete(t);
}
function zn(e) {
  let t = new Set();
  function n(r) {
    if (!t.has(r) && rt(r)) {
      t.add(r);
      let o = r[Yr] ? Array.from(r[Yr]) : [];
      for (let i of o) n(i);
    }
  }
  return n(e), Array.from(t);
}
var ie = Vr;
function Vr(e) {
  return e[yl] || e;
}
function ne() {
  let e = ct(),
    t = Wt(e);
  return t.getActiveSpan ? t.getActiveSpan() : cn(C());
}
function Kr() {
  Nm ||
    (We(() => {
      console.warn(
        "[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.",
      );
    }),
    (Nm = !0));
}
function Al(e, t) {
  e.updateName(t), e.setAttributes({ [Me]: "custom", [zr]: t });
}
var Um = !1;
function Ja() {
  if (Um) return;
  function e() {
    let t = ne(),
      n = t && ie(t);
    if (n) {
      let r = "internal_error";
      y && _.log(`[Tracing] Root span: ${r} -> Global error occurred`),
        n.setStatus({ code: 2, message: r });
    }
  }
  (Um = !0), ji(e), zi(e);
}
function xe(e) {
  if (typeof __SENTRY_TRACING__ == "boolean" && !__SENTRY_TRACING__) return !1;
  let t = e || I()?.getOptions();
  return !!t && (t.tracesSampleRate != null || !!t.tracesSampler);
}
function Dm(e) {
  _.log(
    `Ignoring span ${e.op} - ${e.description} because it matches \`ignoreSpans\`.`,
  );
}
function qn(e, t) {
  if (!t?.length) return !1;
  for (let n of t) {
    if (hI(n)) {
      if (e.description && pr(e.description, n)) return y && Dm(e), !0;
      continue;
    }
    let r = !!n.attributes && Object.keys(n.attributes).length > 0;
    if (!n.name && !n.op && !r) continue;
    let o = n.name ? e.description && pr(e.description, n.name) : !0,
      i = n.op ? e.op && pr(e.op, n.op) : !0,
      s = n.attributes
        ? Object.entries(n.attributes).every(([a, c]) =>
            _I(e.attributes?.[a], c),
          )
        : !0;
    if (o && i && s) return y && Dm(e), !0;
  }
  return !1;
}
function _I(e, t) {
  return typeof e == "string" && (typeof t == "string" || t instanceof RegExp)
    ? pr(e, t)
    : Array.isArray(e) && Array.isArray(t)
      ? e.length === t.length && e.every((n, r) => n === t[r])
      : e === t;
}
function Bm(e, t) {
  let n = t.parent_span_id,
    r = t.span_id;
  if (n) for (let o of e) o.parent_span_id === r && (o.parent_span_id = n);
}
function hI(e) {
  return typeof e == "string" || e instanceof RegExp;
}
var Fm = Symbol.for("sentry.nonRecordingSpan"),
  It = class {
    constructor(t = {}) {
      (this._traceId = t.traceId || Xe()),
        (this._spanId = t.spanId || tt()),
        (this.dropReason = t.dropReason),
        de(this, Fm, !0);
    }
    spanContext() {
      return { spanId: this._spanId, traceId: this._traceId, traceFlags: Va };
    }
    end(t) {}
    setAttribute(t, n) {
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
      return !1;
    }
    addEvent(t, n, r) {
      return this;
    }
    addLink(t) {
      return this;
    }
    addLinks(t) {
      return this;
    }
    recordException(t, n) {}
  };
function An(e) {
  return !!e && e[Fm] === !0;
}
var pn = "production";
var Hm = "_frozenDsc";
function Rl(e, t) {
  de(e, Hm, t);
}
function Xa(e, t) {
  let n = t.getOptions(),
    { publicKey: r } = t.getDsn() || {},
    o = {
      environment: n.environment || pn,
      release: n.release,
      public_key: r,
      trace_id: e,
      org_id: qa(t),
    };
  return t.emit("createDsc", o), o;
}
function Yn(e, t) {
  let n = t.getPropagationContext();
  return n.dsc || Xa(n.traceId, e);
}
function Le(e) {
  let t = I();
  if (!t) return {};
  let n = ie(e),
    r = L(n),
    o = r.data,
    i = n.spanContext().traceState,
    s = i?.get("sentry.sample_rate") ?? o[$n] ?? o[Do];
  function a(m) {
    return (
      (typeof s == "number" || typeof s == "string") &&
        (m.sample_rate = `${s}`),
      m
    );
  }
  let c = n[Hm];
  if (c) return a(c);
  if (An(n) && !xe(t.getOptions())) {
    let m = bn(n).scope;
    if (m) return a({ ...Yn(t, m) });
  }
  let u = i?.get("sentry.dsc"),
    f = u && Bo(u);
  if (f) return a(f);
  let l = Xa(e.spanContext().traceId, t),
    d = o[Me] ?? o["sentry.span.source"],
    p = r.description;
  return (
    d !== "url" && p && (l.transaction = p),
    xe() &&
      ((l.sampled = String(rt(n))),
      (l.sample_rand =
        i?.get("sentry.sample_rand") ??
        bn(n).scope?.getPropagationContext().sampleRand.toString())),
    a(l),
    t.emit("createDsc", l, n),
    l
  );
}
function vl(e) {
  let t = Le(e);
  return ja(t);
}
function Gm(e) {
  return de(e, "_streamed", !0), e;
}
function Vn(e) {
  return !!e && typeof e == "function" && "_streamed" in e && !!e._streamed;
}
function ke(e, t = []) {
  return [e, t];
}
function cs(e, t) {
  let [n, r] = e;
  return [n, [...r, t]];
}
function bt(e, t) {
  let n = e[1];
  for (let r of n) {
    let o = r[0].type;
    if (t(r, o)) return !0;
  }
  return !1;
}
function Jr(e, t) {
  return bt(e, (n, r) => t.includes(r));
}
function Qa(e) {
  let t = ar(v);
  return t.encodePolyfill ? t.encodePolyfill(e) : new TextEncoder().encode(e);
}
function gI(e) {
  let t = ar(v);
  return t.decodePolyfill ? t.decodePolyfill(e) : new TextDecoder().decode(e);
}
function Kn(e) {
  let [t, n] = e,
    r = JSON.stringify(t);
  function o(i) {
    typeof r == "string"
      ? (r = typeof i == "string" ? r + i : [Qa(r), i])
      : r.push(typeof i == "string" ? Qa(i) : i);
  }
  for (let i of n) {
    let [s, a] = i;
    if (
      (o(`
${JSON.stringify(s)}
`),
      typeof a == "string" || a instanceof Uint8Array)
    )
      o(a);
    else {
      let c;
      try {
        c = JSON.stringify(a);
      } catch {
        c = JSON.stringify(he(a));
      }
      o(c);
    }
  }
  return typeof r == "string" ? r : SI(r);
}
function SI(e) {
  let t = e.reduce((o, i) => o + i.length, 0),
    n = new Uint8Array(t),
    r = 0;
  for (let o of e) n.set(o, r), (r += o.length);
  return n;
}
function Za(e) {
  let t = typeof e == "string" ? Qa(e) : e;
  function n(s) {
    let a = t.subarray(0, s);
    return (t = t.subarray(s + 1)), a;
  }
  function r() {
    let s = t.indexOf(10);
    return s < 0 && (s = t.length), JSON.parse(gI(n(s)));
  }
  let o = r(),
    i = [];
  for (; t.length; ) {
    let s = r(),
      a = typeof s.length == "number" ? s.length : void 0;
    i.push([s, a ? n(a) : r()]);
  }
  return [o, i];
}
function ec(e) {
  return [{ type: "span" }, e];
}
function tc(e) {
  let t = typeof e.data == "string" ? Qa(e.data) : e.data;
  return [
    {
      type: "attachment",
      length: t.length,
      filename: e.filename,
      content_type: e.contentType,
      attachment_type: e.attachmentType,
    },
    t,
  ];
}
var $m = {
  sessions: "session",
  event: "error",
  client_report: "internal",
  user_report: "default",
  profile_chunk: "profile",
  replay_event: "replay",
  replay_recording: "replay",
  check_in: "monitor",
  raw_security: "security",
  log: "log_item",
  trace_metric: "metric",
};
function EI(e) {
  return e in $m;
}
function us(e) {
  return EI(e) ? $m[e] : e;
}
function dn(e) {
  if (!e?.sdk) return;
  let { name: t, version: n } = e.sdk;
  return { name: t, version: n };
}
function Go(e, t, n, r) {
  let o = e.sdkProcessingMetadata?.dynamicSamplingContext;
  return {
    event_id: e.event_id,
    sent_at: new Date(et()).toISOString(),
    ...(t && { sdk: t }),
    ...(!!n && r && { dsn: Ge(r) }),
    ...(o && { trace: o }),
  };
}
function TI(e, t) {
  if (!t) return e;
  let n = e.sdk || {};
  return (
    (e.sdk = {
      ...n,
      name: n.name || t.name,
      version: n.version || t.version,
      integrations: [...(e.sdk?.integrations || []), ...(t.integrations || [])],
      packages: [...(e.sdk?.packages || []), ...(t.packages || [])],
      settings:
        e.sdk?.settings || t.settings
          ? { ...e.sdk?.settings, ...t.settings }
          : void 0,
    }),
    e
  );
}
function Wm(e, t, n, r) {
  let o = dn(n),
    i = {
      sent_at: new Date(et()).toISOString(),
      ...(o && { sdk: o }),
      ...(!!r && t && { dsn: Ge(t) }),
    },
    s =
      "aggregates" in e
        ? [{ type: "sessions" }, e]
        : [{ type: "session" }, e.toJSON()];
  return ke(i, [s]);
}
function jm(e, t, n, r) {
  let o = dn(n),
    i = e.type && e.type !== "replay_event" ? e.type : "event";
  TI(e, n?.sdk);
  let s = Go(e, o, r, t);
  return delete e.sdkProcessingMetadata, ke(s, [[{ type: i }, e]]);
}
function zm(e, t) {
  function n(p) {
    return !!p.trace_id && !!p.public_key;
  }
  let r = Le(e[0]),
    o = t?.getDsn(),
    i = t?.getOptions().tunnel,
    s = {
      sent_at: new Date(et()).toISOString(),
      ...(n(r) && { trace: r }),
      ...(!!i && o && { dsn: Ge(o) }),
    },
    { beforeSendSpan: a, ignoreSpans: c } = t?.getOptions() || {},
    u = c?.length
      ? e.filter((p) => {
          let m = L(p);
          return !qn(
            { description: m.description, op: m.op, attributes: m.data },
            c,
          );
        })
      : e,
    f = e.length - u.length;
  f && t?.recordDroppedEvent("before_send", "span", f);
  let l = a
      ? (p) => {
          let m = L(p),
            h = Vn(a) ? m : a(m);
          return h || (Kr(), m);
        }
      : L,
    d = [];
  for (let p of u) {
    let m = l(p);
    m && d.push(ec(m));
  }
  return ke(s, d);
}
function qm(e) {
  if (!y) return;
  let {
      description: t = "< unknown name >",
      op: n = "< unknown op >",
      parent_span_id: r,
    } = L(e),
    { spanId: o } = e.spanContext(),
    i = rt(e),
    s = ie(e),
    a = s === e,
    c = `[Tracing] Starting ${i ? "sampled" : "unsampled"} ${a ? "root " : ""}span`,
    u = [`op: ${n}`, `name: ${t}`, `ID: ${o}`];
  if ((r && u.push(`parent ID: ${r}`), !a)) {
    let { op: f, description: l } = L(s);
    u.push(`root ID: ${s.spanContext().spanId}`),
      f && u.push(`root op: ${f}`),
      l && u.push(`root description: ${l}`);
  }
  _.log(`${c}
  ${u.join(`
  `)}`);
}
function Ym(e) {
  if (!y) return;
  let { description: t = "< unknown name >", op: n = "< unknown op >" } = L(e),
    { spanId: r } = e.spanContext(),
    i = ie(e) === e,
    s = `[Tracing] Finishing "${n}" ${i ? "root " : ""}span "${t}" with ID ${r}`;
  _.log(s);
}
function $o(e, t, n, r = ne()) {
  let o = r && ie(r);
  o &&
    (y &&
      _.log(`[Measurement] Setting measurement on root span: ${e} = ${t} ${n}`),
    o.addEvent(e, { [fn]: t, [ln]: n }));
}
function ls(e) {
  if (!e || e.length === 0) return;
  let t = {};
  return (
    e.forEach((n) => {
      let r = n.attributes || {},
        o = r[ln],
        i = r[fn];
      typeof o == "string" &&
        typeof i == "number" &&
        (t[n.name] = { value: i, unit: o });
    }),
    t
  );
}
function Pe(e) {
  return e.getOptions().traceLifecycle === "stream";
}
var Vm = 1e3,
  hr = class {
    constructor(t = {}) {
      (this._traceId = t.traceId || Xe()),
        (this._spanId = t.spanId || tt()),
        (this._startTime = t.startTimestamp || Z()),
        (this._links = t.links),
        (this._attributes = {}),
        this.setAttributes({ [$]: "manual", [J]: t.op, ...t.attributes }),
        (this._name = t.name),
        t.parentSpanId && (this._parentSpanId = t.parentSpanId),
        "sampled" in t && (this._sampled = t.sampled),
        t.endTimestamp && (this._endTime = t.endTimestamp),
        (this._events = []),
        (this._isStandaloneSpan = t.isStandalone),
        this._endTime && this._onSpanEnded();
    }
    addLink(t) {
      return this._links ? this._links.push(t) : (this._links = [t]), this;
    }
    addLinks(t) {
      return this._links ? this._links.push(...t) : (this._links = t), this;
    }
    recordException(t, n) {}
    spanContext() {
      let { _spanId: t, _traceId: n, _sampled: r } = this;
      return { spanId: t, traceId: n, traceFlags: r ? os : Va };
    }
    setAttribute(t, n) {
      return (
        n === void 0 ? delete this._attributes[t] : (this._attributes[t] = n),
        this
      );
    }
    setAttributes(t) {
      return Object.keys(t).forEach((n) => this.setAttribute(n, t[n])), this;
    }
    updateStartTime(t) {
      this._startTime = yt(t);
    }
    setStatus(t) {
      return (this._status = t), this;
    }
    updateName(t) {
      return (
        (this._name = t), bm(this) || this.setAttribute(Me, "custom"), this
      );
    }
    end(t) {
      this._endTime || ((this._endTime = yt(t)), Ym(this), this._onSpanEnded());
    }
    getSpanJSON() {
      return {
        data: this._attributes,
        description: this._name,
        op: this._attributes[J],
        parent_span_id: this._parentSpanId,
        span_id: this._spanId,
        start_timestamp: this._startTime,
        status: as(this._status),
        timestamp: this._endTime,
        trace_id: this._traceId,
        origin: this._attributes[$],
        profile_id: this._attributes[qr],
        exclusive_time: this._attributes[nt],
        measurements: ls(this._events),
        is_segment: (this._isStandaloneSpan && ie(this) === this) || void 0,
        segment_id: this._isStandaloneSpan
          ? ie(this).spanContext().spanId
          : void 0,
        links: ss(this._links),
      };
    }
    getStreamedSpanJSON() {
      return {
        name: this._name ?? "",
        span_id: this._spanId,
        trace_id: this._traceId,
        parent_span_id: this._parentSpanId,
        start_timestamp: this._startTime,
        end_timestamp: this._endTime ?? this._startTime,
        is_segment: this._isStandaloneSpan || this === ie(this),
        status: bl(this._status),
        attributes: this._attributes,
        links: Il(this._links),
      };
    }
    isRecording() {
      return !this._endTime && !!this._sampled;
    }
    addEvent(t, n, r) {
      y && _.log("[Tracing] Adding an event to span:", t);
      let o = Km(n) ? n : r || Z(),
        i = Km(n) ? {} : n || {},
        s = { name: t, time: yt(o), attributes: i };
      return this._events.push(s), this;
    }
    isStandaloneSpan() {
      return !!this._isStandaloneSpan;
    }
    _onSpanEnded() {
      let t = I();
      if (
        (t &&
          (t.emit("spanEnd", this),
          this._isStandaloneSpan || t.emit("afterSpanEnd", this)),
        !(this._isStandaloneSpan || this === ie(this)))
      )
        return;
      if (this._isStandaloneSpan) {
        this._sampled
          ? II(zm([this], t))
          : (y &&
              _.log(
                "[Tracing] Discarding standalone span because its trace was not chosen to be sampled.",
              ),
            t && t.recordDroppedEvent("sample_rate", "span"));
        return;
      } else if (t && Pe(t)) {
        t.emit("afterSegmentSpanEnd", this);
        return;
      }
      let r = this._convertSpanToTransaction();
      r && (bn(this).scope || C()).captureEvent(r);
    }
    _convertSpanToTransaction() {
      if (!Jm(L(this))) return;
      this._name ||
        (y &&
          _.warn(
            "Transaction has no name, falling back to `<unlabeled transaction>`.",
          ),
        (this._name = "<unlabeled transaction>"));
      let { scope: t, isolationScope: n } = bn(this),
        r = t?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
      if (this._sampled !== !0) return;
      let i = zn(this)
          .filter((l) => l !== this && !yI(l))
          .map((l) => L(l))
          .filter(Jm),
        s = this._attributes[Me];
      delete this._attributes[zr];
      let a = !1;
      i.forEach((l) => {
        delete l.data[zr], l.op?.startsWith("gen_ai.") && (a = !0);
      });
      let c = {
          contexts: { trace: km(this) },
          spans:
            i.length > Vm
              ? i
                  .sort((l, d) => l.start_timestamp - d.start_timestamp)
                  .slice(0, Vm)
              : i,
          start_timestamp: this._startTime,
          timestamp: this._endTime,
          transaction: this._name,
          type: "transaction",
          sdkProcessingMetadata: {
            capturedSpanScope: t,
            capturedSpanIsolationScope: n,
            dynamicSamplingContext: Le(this),
            hasGenAiSpans: a,
          },
          request: r,
          ...(s && { transaction_info: { source: s } }),
        },
        u = ls(this._events);
      return (
        u &&
          Object.keys(u).length &&
          (y &&
            _.log(
              "[Measurements] Adding measurements to transaction event",
              JSON.stringify(u, void 0, 2),
            ),
          (c.measurements = u)),
        c
      );
    }
  };
function Km(e) {
  return (e && typeof e == "number") || e instanceof Date || Array.isArray(e);
}
function Jm(e) {
  return !!e.start_timestamp && !!e.timestamp && !!e.span_id && !!e.trace_id;
}
function yI(e) {
  return e instanceof hr && e.isStandaloneSpan();
}
function II(e) {
  let t = I();
  if (!t) return;
  let n = e[1];
  if (!n || n.length === 0) {
    t.recordDroppedEvent("before_send", "span");
    return;
  }
  t.sendEnvelope(e);
}
function fs(e, t, n = () => {}, r = () => {}) {
  let o;
  try {
    o = e();
  } catch (i) {
    throw (t(i), n(), i);
  }
  return bI(o, t, n, r);
}
function bI(e, t, n, r) {
  return lt(e)
    ? va(
        e,
        (o) => {
          n(), r(o);
        },
        (o) => {
          t(o), n();
        },
      )
    : (n(), r(e), e);
}
function Xm(e, t, n) {
  if (!xe(e)) return [!1];
  let r, o;
  typeof e.tracesSampler == "function"
    ? ((o = e.tracesSampler({
        ...t,
        inheritOrSampleWith: (a) =>
          typeof t.parentSampleRate == "number"
            ? t.parentSampleRate
            : typeof t.parentSampled == "boolean"
              ? Number(t.parentSampled)
              : a,
      })),
      (r = !0))
    : t.parentSampled !== void 0
      ? (o = t.parentSampled)
      : typeof e.tracesSampleRate < "u" && ((o = e.tracesSampleRate), (r = !0));
  let i = Mt(o);
  if (i === void 0)
    return (
      y &&
        _.warn(
          `[Tracing] Discarding root span because of invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(o)} of type ${JSON.stringify(typeof o)}.`,
        ),
      [!1]
    );
  if (!i)
    return (
      y &&
        _.log(
          `[Tracing] Discarding transaction because ${typeof e.tracesSampler == "function" ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`,
        ),
      [!1, i, r]
    );
  let s = n < i;
  return (
    s ||
      (y &&
        _.log(
          `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(o)})`,
        )),
    [s, i, r]
  );
}
var ps = "__SENTRY_SUPPRESS_TRACING__";
function ze(e, t) {
  let n = Wo();
  if (n.startSpan) return n.startSpan(e, t);
  let r = kl(e),
    { forceTransaction: o, parentSpan: i, scope: s } = e,
    a = s?.clone();
  return De(a, () =>
    Zm(i)(() => {
      let u = C(),
        f = wl(u, i),
        l = I(),
        p =
          e.onlyIfParent && !f
            ? Cl(u, l)
            : xl({
                parentSpan: f,
                spanArguments: r,
                forceTransaction: o,
                scope: u,
              });
      return (
        (!e_(p) || !f) && ft(u, p),
        fs(
          () => t(p),
          () => {
            let { status: m } = L(p);
            p.isRecording() &&
              (!m || m === "ok") &&
              p.setStatus({ code: 2, message: "internal_error" });
          },
          () => {
            p.end();
          },
        )
      );
    }),
  );
}
function dt(e, t) {
  let n = Wo();
  if (n.startSpanManual) return n.startSpanManual(e, t);
  let r = kl(e),
    { forceTransaction: o, parentSpan: i, scope: s } = e,
    a = s?.clone();
  return De(a, () =>
    Zm(i)(() => {
      let u = C(),
        f = wl(u, i),
        d =
          e.onlyIfParent && !f
            ? Cl(u, I())
            : xl({
                parentSpan: f,
                spanArguments: r,
                forceTransaction: o,
                scope: u,
              });
      return (
        (!e_(d) || !f) && ft(u, d),
        fs(
          () => t(d, () => d.end()),
          () => {
            let { status: p } = L(d);
            d.isRecording() &&
              (!p || p === "ok") &&
              d.setStatus({ code: 2, message: "internal_error" });
          },
        )
      );
    }),
  );
}
function Ve(e) {
  let t = Wo();
  if (t.startInactiveSpan) return t.startInactiveSpan(e);
  let n = kl(e),
    { forceTransaction: r, parentSpan: o } = e;
  return (
    e.scope
      ? (s) => De(e.scope, s)
      : o !== void 0
        ? (s) => gr(o, s)
        : (s) => s()
  )(() => {
    let s = C(),
      a = wl(s, o),
      c = I();
    return e.onlyIfParent && !a
      ? Cl(s, c)
      : xl({ parentSpan: a, spanArguments: n, forceTransaction: r, scope: s });
  });
}
var Nl = (e, t) => {
  let n = ct(),
    r = Wt(n);
  if (r.continueTrace) return r.continueTrace(e, t);
  let { sentryTrace: o, baggage: i } = e,
    s = I(),
    a = Bo(i);
  return s && !Tl(s, a?.org_id)
    ? nc(t)
    : De((c) => {
        let u = es(o, i);
        return c.setPropagationContext(u), ft(c, void 0), t();
      });
};
function gr(e, t) {
  let n = Wo();
  return n.withActiveSpan
    ? n.withActiveSpan(e, t)
    : De((r) => (ft(r, e || void 0), t(r)));
}
function ds(e) {
  let t = Wo();
  return t.suppressTracing
    ? t.suppressTracing(e)
    : De((n) => {
        n.setSDKProcessingMetadata({ [ps]: !0 });
        let r = e();
        return n.setSDKProcessingMetadata({ [ps]: void 0 }), r;
      });
}
function nc(e) {
  let t = Wo();
  return t.startNewTrace
    ? t.startNewTrace(e)
    : De(
        (n) => (
          n.setPropagationContext({ traceId: Xe(), sampleRand: Et() }),
          y &&
            _.log(
              `Starting a new trace with id ${n.getPropagationContext().traceId}`,
            ),
          gr(null, e)
        ),
      );
}
function Cl(e, t) {
  t?.recordDroppedEvent("no_parent_span", "span");
  let n = new It({ traceId: e.getPropagationContext().traceId });
  return mr(n, e, te()), n;
}
function xl({
  parentSpan: e,
  spanArguments: t,
  forceTransaction: n,
  scope: r,
}) {
  let o = te();
  if (!xe()) {
    let a = { ...o.getPropagationContext(), ...r.getPropagationContext() },
      c = e ? e.spanContext().traceId : a.traceId,
      u = new It({ traceId: c });
    return e && !n && Ho(e, u), mr(u, r, o), u;
  }
  let i = I();
  if (RI(i, t)) {
    Ol(r) || i?.recordDroppedEvent("ignored", "span");
    let a = new It({
      dropReason: "ignored",
      traceId: e?.spanContext().traceId ?? r.getPropagationContext().traceId,
    });
    return mr(a, r, o), a;
  }
  let s;
  if (e && !n) (s = AI(e, r, t, o)), Ho(e, s);
  else if (e) {
    let a = Le(e),
      { traceId: c, spanId: u } = e.spanContext(),
      f = rt(e);
    (s = Qm({ traceId: c, parentSpanId: u, ...t }, r, o, f)), Rl(s, a);
  } else {
    let {
      traceId: a,
      dsc: c,
      parentSpanId: u,
      sampled: f,
    } = { ...o.getPropagationContext(), ...r.getPropagationContext() };
    (s = Qm({ traceId: a, parentSpanId: u, ...t }, r, o, f)), c && Rl(s, c);
  }
  return qm(s), s;
}
function kl(e) {
  let n = { isStandalone: (e.experimental || {}).standalone, ...e };
  if (e.startTime) {
    let r = { ...n };
    return (r.startTimestamp = yt(e.startTime)), delete r.startTime, r;
  }
  return n;
}
function Wo() {
  let e = ct();
  return Wt(e);
}
function Qm(e, t, n, r) {
  let o = I(),
    i = o?.getOptions() || {},
    { name: s = "" } = e,
    a = { spanAttributes: { ...e.attributes }, spanName: s, parentSampled: r };
  o?.emit("beforeSampling", a, { decision: !1 });
  let c = a.parentSampled ?? r,
    u = a.spanAttributes,
    f = t.getPropagationContext(),
    l = Ol(t),
    [d, p, m] = l
      ? [!1]
      : Xm(
          i,
          {
            name: s,
            parentSampled: c,
            attributes: u,
            parentSampleRate: Mt(f.dsc?.sample_rate),
          },
          f.sampleRand,
        ),
    h = new hr({
      ...e,
      attributes: {
        [Me]: "custom",
        [$n]: p !== void 0 && m ? p : void 0,
        ...u,
      },
      sampled: d,
    });
  return (
    !d &&
      o &&
      !l &&
      (y &&
        _.log(
          "[Tracing] Discarding root span because its trace was not chosen to be sampled.",
        ),
      o.recordDroppedEvent("sample_rate", Pe(o) ? "span" : "transaction")),
    mr(h, t, n),
    o && o.emit("spanStart", h),
    h
  );
}
function AI(e, t, n, r) {
  let { spanId: o, traceId: i } = e.spanContext(),
    s = Ol(t),
    a = s ? !1 : rt(e),
    c = a
      ? new hr({ ...n, parentSpanId: o, traceId: i, sampled: a })
      : new It({ traceId: i });
  Ho(e, c), mr(c, t, r);
  let u = I();
  return (
    u &&
      (Pe(u) &&
        An(c) &&
        (An(e) && e.dropReason
          ? ((c.dropReason = e.dropReason),
            u.recordDroppedEvent(e.dropReason, "span"))
          : s ||
            ((c.dropReason = "sample_rate"),
            u.recordDroppedEvent("sample_rate", "span"))),
      u.emit("spanStart", c),
      n.endTimestamp && (u.emit("spanEnd", c), u.emit("afterSpanEnd", c))),
    c
  );
}
function wl(e, t) {
  if (t) return t;
  if (t === null) return;
  let n = cn(e);
  if (!n) return;
  let r = I();
  return (r ? r.getOptions() : {}).parentSpanIsAlwaysRootSpan ? ie(n) : n;
}
function Zm(e) {
  return e !== void 0 ? (t) => gr(e, t) : (t) => t();
}
function RI(e, t) {
  let n = e?.getOptions().ignoreSpans;
  return !e || !Pe(e) || !n?.length
    ? !1
    : qn(
        {
          description: t.name || "",
          op: t.attributes?.[J] || t.op,
          attributes: t.attributes,
        },
        n,
      );
}
function e_(e) {
  return An(e) && e.dropReason === "ignored";
}
function Ol(e) {
  return e.getScopeData().sdkProcessingMetadata[ps] === !0;
}
var jo = { idleTimeout: 1e3, finalTimeout: 3e4, childSpanTimeout: 15e3 },
  vI = "heartbeatFailed",
  NI = "idleTimeout",
  CI = "finalTimeout",
  xI = "externalFinish";
function rc(e, t = {}) {
  let n = new Map(),
    r = !1,
    o,
    i = xI,
    s = !t.disableAutoFinish,
    a = [],
    {
      idleTimeout: c = jo.idleTimeout,
      finalTimeout: u = jo.finalTimeout,
      childSpanTimeout: f = jo.childSpanTimeout,
      beforeSpanEnd: l,
      trimIdleSpanEndTimestamp: d = !0,
    } = t,
    p = I(),
    m = C();
  if (!p || !xe()) {
    let E = new It({ traceId: m.getPropagationContext().traceId });
    return mr(E, m, te()), E;
  }
  let h = ne(),
    g = kI(e);
  g.end = new Proxy(g.end, {
    apply(E, k, z) {
      if ((l && l(g), An(k))) return;
      let [R, ...U] = z,
        w = R || Z(),
        D = yt(w),
        G = zn(g).filter((B) => B !== g),
        oe = L(g);
      if (!G.length || !d) return P(D), Reflect.apply(E, k, [D, ...U]);
      let ae = p.getOptions().ignoreSpans,
        W = G?.reduce(
          (B, se) => {
            let ce = L(se);
            return !ce.timestamp ||
              (ae &&
                qn(
                  {
                    description: ce.description,
                    op: ce.op,
                    attributes: ce.data,
                  },
                  ae,
                ))
              ? B
              : B
                ? Math.max(B, ce.timestamp)
                : ce.timestamp;
          },
          void 0,
        ),
        O = oe.start_timestamp,
        j = Math.min(
          O ? O + u / 1e3 : 1 / 0,
          Math.max(O || -1 / 0, Math.min(D, W || 1 / 0)),
        );
      return P(j), Reflect.apply(E, k, [j, ...U]);
    },
  });
  function S() {
    o && (clearTimeout(o), (o = void 0));
  }
  function T(E) {
    S(),
      (o = setTimeout(() => {
        !r && n.size === 0 && s && ((i = NI), g.end(E));
      }, c));
  }
  function x(E) {
    o = setTimeout(() => {
      !r && s && ((i = vI), g.end(E));
    }, f);
  }
  function A(E) {
    S(), n.set(E, !0);
    let k = Z();
    x(k + f / 1e3);
  }
  function M(E) {
    if ((n.has(E) && n.delete(E), n.size === 0)) {
      let k = Z();
      T(k + c / 1e3);
    }
  }
  function P(E) {
    (r = !0), n.clear(), a.forEach((G) => G()), ft(m, h);
    let k = L(g),
      { start_timestamp: z } = k;
    if (!z) return;
    k.data[Wn] || g.setAttribute(Wn, i);
    let U = k.status;
    (!U || U === "unknown") && g.setStatus({ code: 1 }),
      _.log(`[Tracing] Idle span "${k.op}" finished`);
    let w = zn(g).filter((G) => G !== g),
      D = 0;
    w.forEach((G) => {
      G.isRecording() &&
        (G.setStatus({ code: 2, message: "cancelled" }),
        G.end(E),
        y &&
          _.log(
            "[Tracing] Cancelling span since span ended early",
            JSON.stringify(G, void 0, 2),
          ));
      let oe = L(G),
        { timestamp: ae = 0, start_timestamp: W = 0 } = oe,
        O = W <= E,
        j = (u + c) / 1e3,
        B = ae - W <= j;
      if (y) {
        let se = JSON.stringify(G, void 0, 2);
        O
          ? B ||
            _.log(
              "[Tracing] Discarding span since it finished after idle span final timeout",
              se,
            )
          : _.log(
              "[Tracing] Discarding span since it happened after idle span was finished",
              se,
            );
      }
      (!B || !O) && (Pm(g, G), D++);
    }),
      D > 0 && g.setAttribute("sentry.idle_span_discarded_spans", D);
  }
  return (
    a.push(
      p.on("spanStart", (E) => {
        if (
          r ||
          E === g ||
          L(E).timestamp ||
          (E instanceof hr && E.isStandaloneSpan())
        )
          return;
        zn(g).includes(E) && A(E.spanContext().spanId);
      }),
    ),
    a.push(
      p.on("spanEnd", (E) => {
        r || M(E.spanContext().spanId);
      }),
    ),
    a.push(
      p.on("idleSpanEnableAutoFinish", (E) => {
        E === g && ((s = !0), T(), n.size && x());
      }),
    ),
    t.disableAutoFinish || T(),
    setTimeout(() => {
      r ||
        (g.setStatus({ code: 2, message: "deadline_exceeded" }),
        (i = CI),
        g.end());
    }, u),
    g
  );
}
function kI(e) {
  let t = Ve(e);
  return ft(C(), t), y && _.log("[Tracing] Started span is an idle span"), t;
}
var wI = [
    "addListener",
    "on",
    "once",
    "prependListener",
    "prependOnceListener",
    "addEventListener",
  ],
  OI = ["removeListener", "off", "removeEventListener"],
  t_ = Symbol("SentryScopeBoundListeners"),
  zo;
function MI(e) {
  return zo !== void 0 && (e === zo || e.listener === zo);
}
function n_(e, t = C()) {
  let n = e;
  if (oc(n)) return e;
  Ml(n);
  for (let r of wI) typeof n[r] == "function" && (n[r] = PI(n, n[r], t));
  for (let r of OI) typeof n[r] == "function" && (n[r] = UI(n, n[r]));
  return (
    typeof n.removeAllListeners == "function" &&
      (n.removeAllListeners = DI(n, n.removeAllListeners)),
    e
  );
}
function LI(e, t) {
  return function (...n) {
    return De(t, () => e.apply(this, n));
  };
}
function r_(e) {
  return typeof e == "function";
}
function PI(e, t, n) {
  return function (...r) {
    let o = r[0],
      i = r[1],
      s = r.slice(2);
    if (!r_(i) || MI(i)) return t.apply(this, r);
    let a = oc(e) || Ml(e),
      c = a.get(o);
    c || ((c = new WeakMap()), a.set(o, c));
    let u = c.get(i);
    u || ((u = LI(i, n)), c.set(i, u));
    let f = zo;
    zo = u;
    try {
      return t.call(this, o, u, ...s);
    } finally {
      zo = f;
    }
  };
}
function UI(e, t) {
  return function (...n) {
    let r = n[0],
      o = n[1],
      i = n.slice(2),
      s = r_(o) ? oc(e)?.get(r)?.get(o) : void 0;
    return s ? t.call(this, r, s, ...i) : t.apply(this, n);
  };
}
function DI(e, t) {
  return function (...n) {
    let r = oc(e);
    if (r)
      if (n.length === 0) Ml(e);
      else {
        let o = n[0];
        r.delete(o);
      }
    return t.apply(this, n);
  };
}
function Ml(e) {
  let t = new Map();
  return (e[t_] = t), t;
}
function oc(e) {
  return e[t_];
}
function i_(e, t) {
  let { fingerprint: n, span: r, breadcrumbs: o, sdkProcessingMetadata: i } = t;
  BI(e, t), r && GI(e, r), $I(e, n), FI(e, o), HI(e, i);
}
function o_(e, t) {
  let {
    extra: n,
    tags: r,
    attributes: o,
    user: i,
    contexts: s,
    level: a,
    sdkProcessingMetadata: c,
    breadcrumbs: u,
    fingerprint: f,
    eventProcessors: l,
    attachments: d,
    propagationContext: p,
    transactionName: m,
    span: h,
  } = t;
  ms(e, "extra", n),
    ms(e, "tags", r),
    ms(e, "attributes", o),
    ms(e, "user", i),
    ms(e, "contexts", s),
    (e.sdkProcessingMetadata = dr(e.sdkProcessingMetadata, c, 2)),
    a && (e.level = a),
    m && (e.transactionName = m),
    h && (e.span = h),
    u.length && (e.breadcrumbs = [...e.breadcrumbs, ...u]),
    f.length && (e.fingerprint = [...e.fingerprint, ...f]),
    l.length && (e.eventProcessors = [...e.eventProcessors, ...l]),
    d.length && (e.attachments = [...e.attachments, ...d]),
    (e.propagationContext = { ...e.propagationContext, ...p });
}
function ms(e, t, n) {
  e[t] = dr(e[t], n, 1);
}
function Rn(e, t) {
  let n = un().getScopeData();
  return e && o_(n, e.getScopeData()), t && o_(n, t.getScopeData()), n;
}
function BI(e, t) {
  let {
    extra: n,
    tags: r,
    user: o,
    contexts: i,
    level: s,
    transactionName: a,
  } = t;
  Object.keys(n).length && (e.extra = { ...n, ...e.extra }),
    Object.keys(r).length && (e.tags = { ...r, ...e.tags }),
    Object.keys(o).length && (e.user = { ...o, ...e.user }),
    Object.keys(i).length && (e.contexts = { ...i, ...e.contexts }),
    s && (e.level = s),
    a && e.type !== "transaction" && (e.transaction = a);
}
function FI(e, t) {
  let n = [...(e.breadcrumbs || []), ...t];
  e.breadcrumbs = n.length ? n : void 0;
}
function HI(e, t) {
  e.sdkProcessingMetadata = { ...e.sdkProcessingMetadata, ...t };
}
function GI(e, t) {
  (e.contexts = { trace: Fo(t), ...e.contexts }),
    (e.sdkProcessingMetadata = {
      dynamicSamplingContext: Le(t),
      ...e.sdkProcessingMetadata,
    });
  let n = ie(t),
    r = L(n).description;
  r && !e.transaction && e.type === "transaction" && (e.transaction = r);
}
function $I(e, t) {
  (e.fingerprint = e.fingerprint
    ? Array.isArray(e.fingerprint)
      ? e.fingerprint
      : [e.fingerprint]
    : []),
    t && (e.fingerprint = e.fingerprint.concat(t)),
    e.fingerprint.length || delete e.fingerprint;
}
function s_(e) {
  let t = {},
    { response: n, profile: r, cloud_resource: o, culture: i, state: s } = e;
  if (
    (n &&
      (n.status_code != null &&
        (t["http.response.status_code"] = n.status_code),
      n.body_size != null && (t["http.response.body.size"] = n.body_size)),
    r &&
      (r.profile_id && (t["sentry.profile_id"] = r.profile_id),
      r.profiler_id && (t["sentry.profiler_id"] = r.profiler_id)),
    o)
  )
    for (let [u, f] of Object.entries(o)) f != null && (t[u] = f);
  i &&
    (i.locale && (t["culture.locale"] = i.locale),
    i.timezone && (t["culture.timezone"] = i.timezone)),
    s?.state &&
      typeof s.state.type == "string" &&
      (t["state.type"] = s.state.type);
  let a = e.angular;
  if (a) {
    let u = a.version;
    (typeof u == "string" || typeof u == "number") &&
      (t["angular.version"] = u);
  }
  let c = e.react;
  if (c) {
    let u = c.version;
    (typeof u == "string" || typeof u == "number") && (t["react.version"] = u);
  }
  return t;
}
function ic(e, t) {
  let n = _r(e),
    r = Vr(e),
    o = _r(r),
    { isolationScope: i, scope: s } = bn(e),
    a = Rn(i, s);
  zI(n, o, t, a);
  let c = e.kind;
  t.emit("preprocessSpan", n, { spanKind: c }),
    n.is_segment && (WI(n, a), jI(n, t), t.emit("processSegmentSpan", n)),
    t.emit("processSpan", n);
  let { beforeSendSpan: u } = t.getOptions(),
    f = u && Vn(u) ? qI(n, u) : n,
    l = f.attributes?.[Me];
  return l && Lt(f, { "sentry.span.source": l }), { ...Ka(f), _segmentSpan: r };
}
function WI(e, t) {
  let n = s_(t.contexts);
  Lt(e, n);
}
function Lt(e, t) {
  let n = e.attributes ?? (e.attributes = {});
  Object.entries(t).forEach(([r, o]) => {
    o != null && !(r in n) && (n[r] = o);
  });
}
function jI(e, t) {
  let n = t.getIntegrationNames();
  n.length && Lt(e, { [Pa]: n });
}
function zI(e, t, n, r) {
  let o = n.getSdkMetadata(),
    { release: i, environment: s } = n.getOptions();
  Lt(e, {
    [xa]: i,
    [ka]: s || pn,
    [wa]: t.name,
    [Oa]: t.span_id,
    [Ma]: o?.sdk?.name,
    [La]: o?.sdk?.version,
    [Ua]: r.user?.id,
    [Da]: r.user?.email,
    [Ba]: r.user?.ip_address,
    [Fa]: r.user?.username,
    ...r.attributes,
  });
}
function qI(e, t) {
  let n = t(e);
  return n || (Kr(), e);
}
var Ll = 0,
  a_ = 1,
  c_ = 2;
function vn(e) {
  return new _s((t) => {
    t(e);
  });
}
function Xr(e) {
  return new _s((t, n) => {
    n(e);
  });
}
var _s = class e {
  constructor(t) {
    (this._state = Ll), (this._handlers = []), this._runExecutor(t);
  }
  then(t, n) {
    return new e((r, o) => {
      this._handlers.push([
        !1,
        (i) => {
          if (!t) r(i);
          else
            try {
              r(t(i));
            } catch (s) {
              o(s);
            }
        },
        (i) => {
          if (!n) o(i);
          else
            try {
              r(n(i));
            } catch (s) {
              o(s);
            }
        },
      ]),
        this._executeHandlers();
    });
  }
  catch(t) {
    return this.then((n) => n, t);
  }
  finally(t) {
    return new e((n, r) => {
      let o, i;
      return this.then(
        (s) => {
          (i = !1), (o = s), t && t();
        },
        (s) => {
          (i = !0), (o = s), t && t();
        },
      ).then(() => {
        if (i) {
          r(o);
          return;
        }
        n(o);
      });
    });
  }
  _executeHandlers() {
    if (this._state === Ll) return;
    let t = this._handlers.slice();
    (this._handlers = []),
      t.forEach((n) => {
        n[0] ||
          (this._state === a_ && n[1](this._value),
          this._state === c_ && n[2](this._value),
          (n[0] = !0));
      });
  }
  _runExecutor(t) {
    let n = (i, s) => {
        if (this._state === Ll) {
          if (lt(s)) {
            s.then(r, o);
            return;
          }
          (this._state = i), (this._value = s), this._executeHandlers();
        }
      },
      r = (i) => {
        n(a_, i);
      },
      o = (i) => {
        n(c_, i);
      };
    try {
      t(r, o);
    } catch (i) {
      o(i);
    }
  }
};
function u_(e, t, n, r = 0) {
  try {
    let o = Pl(t, n, e, r);
    return lt(o) ? o : vn(o);
  } catch (o) {
    return Xr(o);
  }
}
function Pl(e, t, n, r) {
  let o = n[r];
  if (!e || !o) return e;
  let i = o({ ...e }, t);
  return (
    y && i === null && _.log(`Event processor "${o.id || "?"}" dropped event`),
    lt(i) ? i.then((s) => Pl(s, t, n, r + 1)) : Pl(i, t, n, r + 1)
  );
}
var Qr, l_, f_, Sr;
function sc(e) {
  let t = v._sentryDebugIds,
    n = v._debugIds;
  if (!t && !n) return {};
  let r = t ? Object.keys(t) : [],
    o = n ? Object.keys(n) : [];
  if (Sr && r.length === l_ && o.length === f_) return Sr;
  (l_ = r.length), (f_ = o.length), (Sr = {}), Qr || (Qr = {});
  let i = (s, a) => {
    for (let c of s) {
      let u = a[c],
        f = Qr?.[c];
      if (f && Sr && u) (Sr[f[0]] = u), Qr && (Qr[c] = [f[0], u]);
      else if (u) {
        let l = e(c);
        for (let d = l.length - 1; d >= 0; d--) {
          let m = l[d]?.filename;
          if (m && Sr && Qr) {
            (Sr[m] = u), (Qr[c] = [m, u]);
            break;
          }
        }
      }
    }
  };
  return t && i(r, t), n && i(o, n), Sr;
}
function Ul(e, t) {
  let n = sc(e);
  if (!n) return [];
  let r = [];
  for (let o of t) {
    let i = em(o);
    i && n[i] && r.push({ type: "sourcemap", code_file: o, debug_id: n[i] });
  }
  return r;
}
function hs(e, t, n, r, o, i) {
  let { normalizeDepth: s = 3, normalizeMaxBreadth: a = 1e3 } = e,
    c = {
      ...t,
      event_id: t.event_id || n.event_id || me(),
      timestamp: t.timestamp || Tt(),
    },
    u = n.integrations || e.integrations.map((S) => S.name);
  YI(c, e),
    JI(c, u),
    o && o.emit("applyFrameMetadata", t),
    t.type === void 0 && VI(c, e.stackParser);
  let f = QI(r, n.captureContext);
  n.mechanism && Ye(c, n.mechanism);
  let l = o ? o.getEventProcessors() : [],
    d = Rn(i, f),
    p = [...(n.attachments || []), ...d.attachments];
  p.length && (n.attachments = p), i_(c, d);
  let m = [...l, ...d.eventProcessors];
  return (n.data && n.data.__sentry__ === !0 ? vn(c) : u_(m, c, n)).then(
    (S) => (S && KI(S), typeof s == "number" && s > 0 ? XI(S, s, a) : S),
  );
}
function YI(e, t) {
  let { environment: n, release: r, dist: o, maxValueLength: i } = t;
  (e.environment = e.environment || n || pn),
    !e.release && r && (e.release = r),
    !e.dist && o && (e.dist = o);
  let s = e.request;
  s?.url && i && (s.url = sn(s.url, i)),
    i &&
      e.exception?.values?.forEach((a) => {
        a.value && (a.value = sn(a.value, i));
      });
}
function VI(e, t) {
  let n = sc(t);
  e.exception?.values?.forEach((r) => {
    r.stacktrace?.frames?.forEach((o) => {
      o.filename && (o.debug_id = n[o.filename]);
    });
  });
}
function KI(e) {
  let t = {};
  if (
    (e.exception?.values?.forEach((r) => {
      r.stacktrace?.frames?.forEach((o) => {
        o.debug_id &&
          (o.abs_path
            ? (t[o.abs_path] = o.debug_id)
            : o.filename && (t[o.filename] = o.debug_id),
          delete o.debug_id);
      });
    }),
    Object.keys(t).length === 0)
  )
    return;
  (e.debug_meta = e.debug_meta || {}),
    (e.debug_meta.images = e.debug_meta.images || []);
  let n = e.debug_meta.images;
  Object.entries(t).forEach(([r, o]) => {
    n.push({ type: "sourcemap", code_file: r, debug_id: o });
  });
}
function JI(e, t) {
  t.length > 0 &&
    ((e.sdk = e.sdk || {}),
    (e.sdk.integrations = [...(e.sdk.integrations || []), ...t]));
}
function XI(e, t, n) {
  if (!e) return null;
  let r = {
    ...e,
    ...(e.breadcrumbs && {
      breadcrumbs: e.breadcrumbs.map((o) => ({
        ...o,
        ...(o.data && { data: he(o.data, t, n) }),
      })),
    }),
    ...(e.user && { user: he(e.user, t, n) }),
    ...(e.contexts && { contexts: he(e.contexts, t, n) }),
    ...(e.extra && { extra: he(e.extra, t, n) }),
  };
  return (
    e.contexts?.trace &&
      r.contexts &&
      ((r.contexts.trace = e.contexts.trace),
      e.contexts.trace.data &&
        (r.contexts.trace.data = he(e.contexts.trace.data, t, n))),
    e.spans &&
      (r.spans = e.spans.map((o) => ({
        ...o,
        ...(o.data && { data: he(o.data, t, n) }),
      }))),
    e.contexts?.flags &&
      r.contexts &&
      (r.contexts.flags = he(e.contexts.flags, 3, n)),
    r
  );
}
function QI(e, t) {
  if (!t) return e;
  let n = e ? e.clone() : new pt();
  return n.update(t), n;
}
function p_(e) {
  if (e)
    return ZI(e) ? { captureContext: e } : tb(e) ? { captureContext: e } : e;
}
function ZI(e) {
  return e instanceof pt || typeof e == "function";
}
var eb = [
  "user",
  "level",
  "extra",
  "contexts",
  "tags",
  "fingerprint",
  "propagationContext",
];
function tb(e) {
  return Object.keys(e).some((t) => eb.includes(t));
}
function X(e, t) {
  return C().captureException(e, p_(t));
}
function gs(e, t) {
  let n = typeof t == "string" ? t : void 0,
    r = typeof t != "string" ? { captureContext: t } : void 0;
  return C().captureMessage(e, n, r);
}
function mn(e, t) {
  return C().captureEvent(e, t);
}
function Ss(e, t) {
  te().setContext(e, t);
}
function Dl(e) {
  te().setExtras(e);
}
function Bl(e, t) {
  te().setExtra(e, t);
}
function Fl(e) {
  te().setTags(e);
}
function Hl(e, t) {
  te().setTag(e, t);
}
function Gl(e) {
  te().setUser(e);
}
function $l(e) {
  te().setConversationId(e);
}
function Es() {
  return te().lastEventId();
}
async function Wl(e) {
  let t = I();
  return t
    ? t.flush(e)
    : (y && _.warn("Cannot flush events. No client defined."),
      Promise.resolve(!1));
}
async function jl(e) {
  let t = I();
  return t
    ? t.close(e)
    : (y && _.warn("Cannot flush events and disable SDK. No client defined."),
      Promise.resolve(!1));
}
function zl() {
  return !!I();
}
function Ts() {
  let e = I();
  return e?.getOptions().enabled !== !1 && !!e?.getTransport();
}
function ys(e) {
  te().addEventProcessor(e);
}
function qo(e) {
  let t = te(),
    { user: n } = Rn(t, C()),
    { userAgent: r } = v.navigator || {},
    o = fm({ user: n, ...(r && { userAgent: r }), ...e }),
    i = t.getSession();
  return (
    i?.status === "ok" && Hn(i, { status: "exited" }), Is(), t.setSession(o), o
  );
}
function Is() {
  let e = te(),
    n = C().getSession() || e.getSession();
  n && pm(n), d_(), e.setSession();
}
function d_() {
  let e = te(),
    t = I(),
    n = e.getSession();
  n && t && t.captureSession(n);
}
function Zr(e = !1) {
  if (e) {
    Is();
    return;
  }
  d_();
}
var m_ = "7";
function __(e) {
  let t = e.protocol ? `${e.protocol}:` : "",
    n = e.port ? `:${e.port}` : "";
  return `${t}//${e.host}${n}${e.path ? `/${e.path}` : ""}/api/`;
}
function nb(e) {
  return `${__(e)}${e.projectId}/envelope/`;
}
function rb(e, t) {
  let n = { sentry_version: m_ };
  return (
    e.publicKey && (n.sentry_key = e.publicKey),
    t && (n.sentry_client = `${t.name}/${t.version}`),
    new URLSearchParams(n).toString()
  );
}
function bs(e, t, n) {
  return t || `${nb(e)}?${rb(e, n)}`;
}
function ql(e, t) {
  let n = Zi(e);
  if (!n) return "";
  let r = `${__(n)}embed/error-page/`,
    o = `dsn=${Ge(n)}`;
  for (let i in t)
    if (i !== "dsn" && i !== "onClose")
      if (i === "user") {
        let s = t.user;
        if (!s) continue;
        s.name && (o += `&name=${encodeURIComponent(s.name)}`),
          s.email && (o += `&email=${encodeURIComponent(s.email)}`);
      } else o += `&${encodeURIComponent(i)}=${encodeURIComponent(t[i])}`;
  return `${r}?${o}`;
}
var ac = [];
function ob(e) {
  let t = {};
  return (
    e.forEach((n) => {
      let { name: r } = n,
        o = t[r];
      (o && !o.isDefaultInstance && n.isDefaultInstance) || (t[r] = n);
    }),
    Object.values(t)
  );
}
function cc(e) {
  let t = e.defaultIntegrations || [],
    n = e.integrations;
  t.forEach((o) => {
    o.isDefaultInstance = !0;
  });
  let r;
  if (Array.isArray(n)) r = [...t, ...n];
  else if (typeof n == "function") {
    let o = n(t);
    r = Array.isArray(o) ? o : [o];
  } else r = t;
  return ob(r);
}
function h_(e, t) {
  let n = {};
  return (
    t.forEach((r) => {
      r?.beforeSetup && r.beforeSetup(e);
    }),
    t.forEach((r) => {
      r && Vl(e, r, n);
    }),
    n
  );
}
function Yl(e, t) {
  for (let n of t) n?.afterAllSetup && n.afterAllSetup(e);
}
function Vl(e, t, n) {
  if (n[t.name]) {
    y &&
      _.log(`Integration skipped because it was already installed: ${t.name}`);
    return;
  }
  if (
    ((n[t.name] = t),
    !ac.includes(t.name) &&
      typeof t.setupOnce == "function" &&
      (t.setupOnce(), ac.push(t.name)),
    t.setup && typeof t.setup == "function" && t.setup(e),
    typeof t.preprocessEvent == "function")
  ) {
    let r = t.preprocessEvent.bind(t);
    e.on("preprocessEvent", (o, i) => r(o, i, e));
  }
  if (typeof t.processEvent == "function") {
    let r = t.processEvent.bind(t),
      o = Object.assign((i, s) => r(i, s, e), { id: t.name });
    e.addEventProcessor(o);
  }
  ["processSpan", "processSegmentSpan"].forEach((r) => {
    let o = t[r];
    typeof o == "function" && e.on(r, (i) => o.call(t, i, e));
  }),
    y && _.log(`Integration installed: ${t.name}`);
}
function Yo(e) {
  let t = I();
  if (!t) {
    y &&
      _.warn(
        `Cannot add integration "${e.name}" because no SDK Client is available.`,
      );
    return;
  }
  t.addIntegration(e);
}
var ib = "sentry.timestamp.sequence",
  Kl = 0,
  Jl;
function uc(e) {
  let t = Math.floor(e * 1e3);
  Jl !== void 0 && t !== Jl && (Kl = 0);
  let n = Kl;
  return Kl++, (Jl = t), { key: ib, value: { value: n, type: "integer" } };
}
function lc(e, t) {
  return t
    ? De(t, () => {
        let n = ne(),
          r = n ? Fo(n) : Uo(t);
        return [n ? Le(n) : Yn(e, t), r];
      })
    : [void 0, void 0];
}
var g_ = { trace: 1, debug: 5, info: 9, warn: 13, error: 17, fatal: 21 };
function Xl() {
  return typeof __SENTRY_BROWSER_BUNDLE__ < "u" && !!__SENTRY_BROWSER_BUNDLE__;
}
function Ql() {
  return "npm";
}
function S_() {
  return (
    !Xl() &&
    Object.prototype.toString.call(typeof process < "u" ? process : 0) ===
      "[object process]"
  );
}
function ot() {
  return typeof window < "u" && (!S_() || sb());
}
function sb() {
  return v.process?.type === "renderer";
}
function ab(e, t) {
  let n = t ? "auto" : "never";
  return [
    {
      type: "log",
      item_count: e.length,
      content_type: "application/vnd.sentry.items.log+json",
    },
    {
      version: 2,
      ...(ot() && { ingest_settings: { infer_ip: n, infer_user_agent: n } }),
      items: e,
    },
  ];
}
function E_(e, t, n, r, o) {
  let i = {};
  return (
    t?.sdk && (i.sdk = { name: t.sdk.name, version: t.sdk.version }),
    n && r && (i.dsn = Ge(r)),
    ke(i, [ab(e, o)])
  );
}
var cb = 100;
function Nn(e, t, n, r = !0) {
  n && (!e[t] || r) && (e[t] = n);
}
function T_(e, t) {
  let n = ef(),
    r = y_(e);
  r === void 0
    ? n.set(e, [t])
    : r.length >= cb
      ? (eo(e, r), n.set(e, [t]))
      : n.set(e, [...r, t]);
}
function Er(e, t = C(), n = T_) {
  let r = t?.getClient() ?? I();
  if (!r) {
    y && _.warn("No client available to capture log.");
    return;
  }
  let {
    release: o,
    environment: i,
    enableLogs: s = !1,
    beforeSendLog: a,
  } = r.getOptions();
  if (!s) {
    y && _.warn("logging option not enabled, log will not be captured.");
    return;
  }
  let [, c] = lc(r, t),
    u = { ...e.attributes },
    {
      user: { id: f, email: l, username: d },
      attributes: p = {},
    } = Rn(te(), t);
  Nn(u, "user.id", f, !1),
    Nn(u, "user.email", l, !1),
    Nn(u, "user.name", d, !1),
    Nn(u, "sentry.release", o),
    Nn(u, "sentry.environment", i);
  let { name: m, version: h } = r.getSdkMetadata()?.sdk ?? {};
  Nn(u, "sentry.sdk.name", m), Nn(u, "sentry.sdk.version", h);
  let g = r.getIntegrationByName("Replay"),
    S = g?.getReplayId(!0);
  Nn(u, "sentry.replay_id", S),
    S &&
      g?.getRecordingMode() === "buffer" &&
      Nn(u, "sentry._internal.replay_is_buffering", !0);
  let T = e.message;
  if (In(T)) {
    let { __sentry_template_string__: D, __sentry_template_values__: G = [] } =
      T;
    G?.length && (u["sentry.message.template"] = D),
      G.forEach((oe, ae) => {
        u[`sentry.message.parameter.${ae}`] = oe;
      });
  }
  let x = cn(t);
  Nn(u, "sentry.trace.parent_span_id", x?.spanContext().spanId);
  let A = { ...e, attributes: u };
  r.emit("beforeCaptureLog", A);
  let M = a ? We(() => a(A)) : A;
  if (!M) {
    r.recordDroppedEvent("before_send", "log_item", 1),
      y && _.warn("beforeSendLog returned null, log will not be captured.");
    return;
  }
  let { level: P, message: E, attributes: k = {}, severityNumber: z } = M,
    R = Z(),
    U = uc(R),
    w = {
      timestamp: R,
      level: P,
      body: Zl(String(E)),
      trace_id: c?.trace_id,
      severity_number: z ?? g_[P],
      attributes: ub({ ...Gn(p), ...Gn(k, !0), [U.key]: U.value }),
    };
  n(r, w), r.emit("afterCaptureLog", M);
}
function eo(e, t) {
  let n = t ?? y_(e) ?? [];
  if (n.length === 0) return;
  let r = e.getOptions(),
    o = E_(
      n,
      r._metadata,
      r.tunnel,
      e.getDsn(),
      e.getDataCollectionOptions().userInfo,
    );
  ef().set(e, []), e.emit("flushLogs"), e.sendEnvelope(o);
}
function y_(e) {
  return ef().get(e);
}
function ef() {
  return rn("clientToLogBufferMap", () => new WeakMap());
}
function ub(e) {
  let t = {};
  for (let [n, r] of Object.entries(e)) {
    let o = Zl(n);
    r.type === "string" ? (t[o] = { ...r, value: Zl(r.value) }) : (t[o] = r);
  }
  return t;
}
function Zl(e) {
  let t = Object(e),
    n = t.isWellFormed,
    r = t.toWellFormed;
  return typeof n == "function" && typeof r == "function"
    ? n.call(e)
      ? e
      : r.call(e)
    : e;
}
function lb(e, t) {
  let n = t ? "auto" : "never";
  return [
    {
      type: "trace_metric",
      item_count: e.length,
      content_type: "application/vnd.sentry.items.trace-metric+json",
    },
    {
      version: 2,
      ...(ot() && { ingest_settings: { infer_ip: n, infer_user_agent: n } }),
      items: e,
    },
  ];
}
function I_(e, t, n, r, o) {
  let i = {};
  return (
    t?.sdk && (i.sdk = { name: t.sdk.name, version: t.sdk.version }),
    n && r && (i.dsn = Ge(r)),
    ke(i, [lb(e, o)])
  );
}
var fb = 1e3;
function Jn(e, t, n, r = !0) {
  n && (r || !(t in e)) && (e[t] = n);
}
function b_(e, t) {
  let n = nf(),
    r = A_(e);
  r === void 0
    ? n.set(e, [t])
    : r.length >= fb
      ? (Vo(e, r), n.set(e, [t]))
      : n.set(e, [...r, t]);
}
function pb(e, t, n) {
  let { release: r, environment: o } = t.getOptions(),
    i = { ...e.attributes };
  Jn(i, "user.id", n.id, !1),
    Jn(i, "user.email", n.email, !1),
    Jn(i, "user.name", n.username, !1),
    Jn(i, "sentry.release", r),
    Jn(i, "sentry.environment", o);
  let { name: s, version: a } = t.getSdkMetadata()?.sdk ?? {};
  Jn(i, "sentry.sdk.name", s), Jn(i, "sentry.sdk.version", a);
  let c = t.getIntegrationByName("Replay"),
    u = c?.getReplayId(!0);
  return (
    Jn(i, "sentry.replay_id", u),
    u &&
      c?.getRecordingMode() === "buffer" &&
      Jn(i, "sentry._internal.replay_is_buffering", !0),
    { ...e, attributes: i }
  );
}
function db(e, t, n, r) {
  let [, o] = lc(t, n),
    i = cn(n),
    s = i ? i.spanContext().traceId : o?.trace_id,
    a = i ? i.spanContext().spanId : void 0,
    c = Z(),
    u = uc(c);
  return {
    timestamp: c,
    trace_id: s ?? "",
    span_id: a,
    name: e.name,
    type: e.type,
    unit: e.unit,
    value: e.value,
    attributes: {
      ...Gn(r),
      ...Gn(e.attributes, "skip-undefined"),
      [u.key]: u.value,
    },
  };
}
function tf(e, t) {
  let n = t?.scope ?? C(),
    r = t?.captureSerializedMetric ?? b_,
    o = n?.getClient() ?? I();
  if (!o) {
    y && _.warn("No client available to capture metric.");
    return;
  }
  let {
    _experiments: i,
    enableMetrics: s,
    beforeSendMetric: a,
  } = o.getOptions();
  if (!(s ?? i?.enableMetrics ?? !0)) {
    y && _.warn("metrics option not enabled, metric will not be captured.");
    return;
  }
  let { user: u, attributes: f } = Rn(te(), n),
    l = pb(e, o, u);
  o.emit("processMetric", l);
  let d = a || i?.beforeSendMetric,
    p = d ? d(l) : l;
  if (!p) {
    y && _.log("`beforeSendMetric` returned `null`, will not send metric.");
    return;
  }
  let m = db(p, o, n, f);
  y && _.log("[Metric]", m), r(o, m), o.emit("afterCaptureMetric", p);
}
function Vo(e, t) {
  let n = t ?? A_(e) ?? [];
  if (n.length === 0) return;
  let r = e.getOptions(),
    o = I_(
      n,
      r._metadata,
      r.tunnel,
      e.getDsn(),
      e.getDataCollectionOptions().userInfo,
    );
  nf().set(e, []), e.emit("flushMetrics"), e.sendEnvelope(o);
}
function A_(e) {
  return nf().get(e);
}
function nf() {
  return rn("clientToMetricBufferMap", () => new WeakMap());
}
function R_(e) {
  let t = {
    trace_id: e.trace_id,
    span_id: e.span_id,
    parent_span_id: e.parent_span_id,
    name: e.description || "",
    start_timestamp: e.start_timestamp,
    end_timestamp: e.timestamp || e.start_timestamp,
    status:
      !e.status || e.status === "ok" || e.status === "cancelled"
        ? "ok"
        : "error",
    is_segment: !1,
    attributes: { ...e.data },
    links: e.links,
  };
  return Ka(t);
}
function v_(e, t) {
  if (
    e.type !== "transaction" ||
    !e.spans?.length ||
    !e.sdkProcessingMetadata?.hasGenAiSpans ||
    !t.getOptions().streamGenAiSpans ||
    Pe(t)
  )
    return;
  let n = [],
    r = [];
  for (let i of e.spans)
    i.op?.startsWith("gen_ai.") ? n.push(R_(i)) : r.push(i);
  if (n.length === 0) return;
  e.spans = r;
  let o = t.getDataCollectionOptions().userInfo ? "auto" : "never";
  return [
    {
      type: "span",
      item_count: n.length,
      content_type: "application/vnd.sentry.items.span.v2+json",
    },
    {
      version: 2,
      ...(ot() && { ingest_settings: { infer_ip: o, infer_user_agent: o } }),
      items: n,
    },
  ];
}
function Tr(e) {
  return typeof e == "object" && typeof e.unref == "function" && e.unref(), e;
}
var Ko = Symbol.for("SentryBufferFullError");
function to(e = 100) {
  let t = new Set();
  function n() {
    return t.size < e;
  }
  function r(s) {
    t.delete(s);
  }
  function o(s) {
    if (!n()) return Xr(Ko);
    let a = s();
    return (
      t.add(a),
      a.then(
        () => r(a),
        () => r(a),
      ),
      a
    );
  }
  function i(s) {
    if (!t.size) return vn(!0);
    let a = Promise.allSettled(Array.from(t)).then(() => !0);
    if (!s) return a;
    let c = [a, new Promise((u) => Tr(setTimeout(() => u(!1), s)))];
    return Promise.race(c);
  }
  return {
    get $() {
      return Array.from(t);
    },
    add: o,
    drain: i,
  };
}
var N_ = 60 * 1e3;
function fc(e, t = et()) {
  let n = parseInt(`${e}`, 10);
  if (!isNaN(n)) return n * 1e3;
  let r = Date.parse(`${e}`);
  return isNaN(r) ? N_ : r - t;
}
function C_(e, t) {
  return e[t] || e.all || 0;
}
function As(e, t, n = et()) {
  return C_(e, t) > n;
}
function Rs(e, { statusCode: t, headers: n }, r = et()) {
  let o = { ...e },
    i = n?.["x-sentry-rate-limits"],
    s = n?.["retry-after"];
  if (i)
    for (let a of i.trim().split(",")) {
      let [c, u, , , f] = a.split(":", 5),
        l = parseInt(c, 10),
        d = (isNaN(l) ? 60 : l) * 1e3;
      if (!u) o.all = r + d;
      else
        for (let p of u.split(";"))
          p === "metric_bucket"
            ? (!f || f.split(";").includes("custom")) && (o[p] = r + d)
            : (o[p] = r + d);
    }
  else s ? (o.all = r + fc(s, r)) : t === 429 && (o.all = r + 60 * 1e3);
  return o;
}
var rf = 64;
function pc(e, t, n = to(e.bufferSize || rf)) {
  let r = {},
    o = (s) => n.drain(s);
  function i(s) {
    let a = [];
    if (
      (bt(s, (l, d) => {
        let p = us(d);
        As(r, p) ? e.recordDroppedEvent("ratelimit_backoff", p) : a.push(l);
      }),
      a.length === 0)
    )
      return Promise.resolve({});
    let c = ke(s[0], a),
      u = (l) => {
        if (Jr(c, ["client_report"])) {
          y &&
            _.warn(
              `Dropping client report. Will not send outcomes (reason: ${l}).`,
            );
          return;
        }
        bt(c, (d, p) => {
          e.recordDroppedEvent(l, us(p));
        });
      },
      f = () =>
        t({ body: Kn(c) }).then(
          (l) =>
            l.statusCode === 413
              ? (y &&
                  _.error(
                    "Sentry responded with status code 413. Envelope was discarded due to exceeding size limits.",
                  ),
                u("send_error"),
                l)
              : (y &&
                  l.statusCode !== void 0 &&
                  (l.statusCode < 200 || l.statusCode >= 300) &&
                  _.warn(
                    `Sentry responded with status code ${l.statusCode} to sent event.`,
                  ),
                (r = Rs(r, l)),
                l),
          (l) => {
            throw (
              (u("network_error"),
              y && _.error("Encountered error running transport request:", l),
              l)
            );
          },
        );
    return n.add(f).then(
      (l) => l,
      (l) => {
        if (l === Ko)
          return (
            y && _.error("Skipped sending event because buffer is full."),
            u("queue_overflow"),
            Promise.resolve({})
          );
        throw l;
      },
    );
  }
  return { send: i, flush: o };
}
function x_(e, t, n) {
  let r = [
    { type: "client_report" },
    { timestamp: n || Tt(), discarded_events: e },
  ];
  return ke(t ? { dsn: t } : {}, [r]);
}
function dc(e) {
  let t = [];
  e.message && t.push(e.message);
  try {
    let n = e.exception.values[e.exception.values.length - 1];
    n?.value && (t.push(n.value), n.type && t.push(`${n.type}: ${n.value}`));
  } catch {}
  return t;
}
function k_(e) {
  let {
    trace_id: t,
    parent_span_id: n,
    span_id: r,
    status: o,
    origin: i,
    data: s,
    op: a,
  } = e.contexts?.trace ?? {};
  return {
    data: s ?? {},
    description: e.transaction,
    op: a,
    parent_span_id: n,
    span_id: r ?? "",
    start_timestamp: e.start_timestamp ?? 0,
    status: o,
    timestamp: e.timestamp,
    trace_id: t ?? "",
    origin: i,
    profile_id: s?.[qr],
    exclusive_time: s?.[nt],
    measurements: e.measurements,
    is_segment: !0,
  };
}
function w_(e) {
  return {
    type: "transaction",
    timestamp: e.timestamp,
    start_timestamp: e.start_timestamp,
    transaction: e.description,
    contexts: {
      trace: {
        trace_id: e.trace_id,
        span_id: e.span_id,
        parent_span_id: e.parent_span_id,
        op: e.op,
        status: e.status,
        origin: e.origin,
        data: {
          ...e.data,
          ...(e.profile_id && { [qr]: e.profile_id }),
          ...(e.exclusive_time && { [nt]: e.exclusive_time }),
        },
      },
    },
    measurements: e.measurements,
  };
}
var no = "[Filtered]",
  vs = ["forwarded", "-ip", "remote-", "via", "-user"],
  of = [
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
    "sid",
    "identity",
    "set-cookie",
    "cookie",
  ],
  O_ = [
    ".sid",
    "sessid",
    "remember",
    "oidc",
    "pkce",
    "nonce",
    "__secure-",
    "__host-",
    "awsalb",
    "awselb",
    "akamai",
    "__stripe",
    "cognito",
    "firebase",
    "supabase",
    "sb-",
    "mfa",
    "2fa",
  ];
function M_(e) {
  return e === !0
    ? {
        userInfo: !0,
        cookies: !0,
        httpHeaders: { request: !0, response: !0 },
        httpBodies: [
          "incomingRequest",
          "outgoingRequest",
          "incomingResponse",
          "outgoingResponse",
        ],
        queryParams: !0,
        genAI: { inputs: !0, outputs: !0 },
        stackFrameVariables: !0,
        frameContextLines: 7,
      }
    : {
        userInfo: !1,
        cookies: { deny: vs },
        httpHeaders: { request: { deny: vs }, response: { deny: vs } },
        httpBodies: [],
        queryParams: { deny: vs },
        genAI: { inputs: !1, outputs: !1 },
        stackFrameVariables: !0,
        frameContextLines: 7,
      };
}
var mb = {
  userInfo: !0,
  cookies: !0,
  httpHeaders: { request: !0, response: !0 },
  httpBodies: [
    "incomingRequest",
    "outgoingRequest",
    "incomingResponse",
    "outgoingResponse",
  ],
  queryParams: !0,
  genAI: { inputs: !0, outputs: !0 },
  stackFrameVariables: !0,
  frameContextLines: 5,
};
function L_(e) {
  let t = e.dataCollection != null ? mb : M_(e.sendDefaultPii),
    n = e.dataCollection ?? {};
  return {
    userInfo: n.userInfo ?? t.userInfo,
    cookies: n.cookies ?? t.cookies,
    httpHeaders: {
      request: n.httpHeaders?.request ?? t.httpHeaders.request,
      response: n.httpHeaders?.response ?? t.httpHeaders.response,
    },
    httpBodies: n.httpBodies ?? t.httpBodies,
    queryParams: n.queryParams ?? t.queryParams,
    genAI: {
      inputs: n.genAI?.inputs ?? t.genAI.inputs,
      outputs: n.genAI?.outputs ?? t.genAI.outputs,
    },
    stackFrameVariables: n.stackFrameVariables ?? t.stackFrameVariables,
    frameContextLines: n.frameContextLines ?? t.frameContextLines,
  };
}
var P_ = "Not capturing exception because it's already been captured.",
  U_ = "Discarded session because of missing or non-string release",
  $_ = Symbol.for("SentryInternalError"),
  W_ = Symbol.for("SentryDoNotSendEventError"),
  _b = 5e3;
function mc(e) {
  return { message: e, [$_]: !0 };
}
function sf(e) {
  return { message: e, [W_]: !0 };
}
function D_(e) {
  return !!e && typeof e == "object" && $_ in e;
}
function B_(e) {
  return !!e && typeof e == "object" && W_ in e;
}
function F_(e, t, n, r, o) {
  let i = 0,
    s,
    a = !1;
  e.on(n, () => {
    (i = 0), clearTimeout(s), (a = !1);
  }),
    e.on(t, (c) => {
      if (((i += r(c)), i >= 8e5)) o(e);
      else if (!a) {
        let u = e.getOptions()._flushInterval ?? _b;
        u > 0 &&
          ((a = !0),
          (s = Tr(
            setTimeout(() => {
              o(e);
            }, u),
          )));
      }
    }),
    e.on("flush", () => {
      o(e);
    });
}
var Ns = class {
  constructor(t) {
    if (
      ((this._options = t),
      (this._integrations = {}),
      (this._numProcessing = 0),
      (this._outcomes = {}),
      (this._hooks = {}),
      (this._eventProcessors = []),
      (this._promiseBuffer = to(t.transportOptions?.bufferSize ?? rf)),
      (this._dataCollection = L_(t)),
      t.dsn
        ? (this._dsn = Zi(t.dsn))
        : y && _.warn("No DSN provided, client will not send events."),
      this._dsn)
    ) {
      let r = bs(this._dsn, t.tunnel, t._metadata ? t._metadata.sdk : void 0);
      this._transport = t.transport({
        tunnel: this._options.tunnel,
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...t.transportOptions,
        url: r,
      });
    }
    (this._options.enableLogs =
      this._options.enableLogs ?? this._options._experiments?.enableLogs),
      this._options.enableLogs &&
        F_(this, "afterCaptureLog", "flushLogs", Eb, eo),
      (this._options.enableMetrics ??
        this._options._experiments?.enableMetrics ??
        !0) &&
        F_(this, "afterCaptureMetric", "flushMetrics", Sb, Vo);
  }
  captureException(t, n, r) {
    let o = me();
    if (Xi(t)) return y && _.log(P_), o;
    let i = { event_id: o, ...n };
    return (
      this._process(
        () =>
          this.eventFromException(t, i)
            .then((s) => this._captureEvent(s, i, r))
            .then((s) => s),
        "error",
      ),
      i.event_id
    );
  }
  captureMessage(t, n, r, o) {
    let i = { event_id: me(), ...r },
      s = In(t) ? t : String(t),
      a = Fe(t),
      c = a ? this.eventFromMessage(s, n, i) : this.eventFromException(t, i);
    return (
      this._process(
        () => c.then((u) => this._captureEvent(u, i, o)),
        a ? "unknown" : "error",
      ),
      i.event_id
    );
  }
  captureEvent(t, n, r) {
    let o = me();
    if (n?.originalException && Xi(n.originalException))
      return y && _.log(P_), o;
    let i = { event_id: o, ...n },
      s = t.sdkProcessingMetadata || {},
      a = s.capturedSpanScope,
      c = s.capturedSpanIsolationScope,
      u = H_(t.type);
    return (
      this._process(() => this._captureEvent(t, i, a || r, c), u), i.event_id
    );
  }
  captureSession(t) {
    this.sendSession(t), Hn(t, { init: !1 });
  }
  getDsn() {
    return this._dsn;
  }
  getOptions() {
    return this._options;
  }
  getDataCollectionOptions() {
    return this._dataCollection;
  }
  getSdkMetadata() {
    return this._options._metadata;
  }
  getTransport() {
    return this._transport;
  }
  async flush(t) {
    let n = this._transport;
    if ((this.emit("flush"), !n)) return !0;
    let r = await this._isClientDoneProcessing(t),
      o = await n.flush(t);
    return r && o;
  }
  async close(t) {
    eo(this);
    let n = await this.flush(t);
    return (this.getOptions().enabled = !1), this.emit("close"), n;
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
  getIntegrationByName(t) {
    return this._integrations[t];
  }
  getIntegrationNames() {
    return Object.keys(this._integrations);
  }
  addIntegration(t) {
    let n = this._integrations[t.name];
    !n && t.beforeSetup && t.beforeSetup(this),
      Vl(this, t, this._integrations),
      n || Yl(this, [t]);
  }
  sendEvent(t, n = {}) {
    this.emit("beforeSendEvent", t, n);
    let r = v_(t, this),
      o = jm(t, this._dsn, this._options._metadata, this._options.tunnel);
    for (let i of n.attachments || []) o = cs(o, tc(i));
    r && (o = cs(o, r)),
      this.sendEnvelope(o).then((i) => this.emit("afterSendEvent", t, i));
  }
  sendSession(t) {
    let { release: n, environment: r = pn } = this._options;
    if ("aggregates" in t) {
      let i = t.attrs || {};
      if (!i.release && !n) {
        y && _.warn(U_);
        return;
      }
      (i.release = i.release || n),
        (i.environment = i.environment || r),
        (t.attrs = i);
    } else {
      if (!t.release && !n) {
        y && _.warn(U_);
        return;
      }
      (t.release = t.release || n), (t.environment = t.environment || r);
    }
    this.emit("beforeSendSession", t);
    let o = Wm(t, this._dsn, this._options._metadata, this._options.tunnel);
    this.sendEnvelope(o);
  }
  recordDroppedEvent(t, n, r = 1) {
    if (this._options.sendClientReports) {
      let o = `${t}:${n}`;
      y && _.log(`Recording outcome: "${o}"${r > 1 ? ` (${r} times)` : ""}`),
        (this._outcomes[o] = (this._outcomes[o] || 0) + r);
    }
  }
  on(t, n) {
    let r = (this._hooks[t] = this._hooks[t] || new Set()),
      o = (...i) => n(...i);
    return (
      r.add(o),
      () => {
        r.delete(o);
      }
    );
  }
  emit(t, ...n) {
    let r = this._hooks[t];
    r && r.forEach((o) => o(...n));
  }
  async sendEnvelope(t) {
    if ((this.emit("beforeEnvelope", t), this._isEnabled() && this._transport))
      try {
        return await this._transport.send(t);
      } catch (n) {
        return y && _.error("Error while sending envelope:", n), {};
      }
    return y && _.error("Transport disabled"), {};
  }
  registerCleanup(t) {}
  dispose() {}
  _setupIntegrations() {
    let { integrations: t } = this._options;
    (this._integrations = h_(this, t)), Yl(this, t);
  }
  _updateSessionFromEvent(t, n) {
    let r = n.level === "fatal",
      o = !1,
      i = n.exception?.values;
    if (i) {
      (o = !0), (r = !1);
      for (let c of i)
        if (c.mechanism?.handled === !1) {
          r = !0;
          break;
        }
    }
    let s = t.status === "ok";
    ((s && t.errors === 0) || (s && r)) &&
      (Hn(t, {
        ...(r && { status: "crashed" }),
        errors: t.errors || Number(o || r),
      }),
      this.captureSession(t));
  }
  async _isClientDoneProcessing(t) {
    let n = 0;
    for (; !t || n < t; ) {
      if ((await new Promise((r) => setTimeout(r, 1)), !this._numProcessing))
        return !0;
      n++;
    }
    return !1;
  }
  _isEnabled() {
    return this.getOptions().enabled !== !1 && this._transport !== void 0;
  }
  _prepareEvent(t, n, r, o) {
    let i = this.getOptions(),
      s = this.getIntegrationNames();
    return (
      !n.integrations && s.length && (n.integrations = s),
      this.emit("preprocessEvent", t, n),
      t.type || o.setLastEventId(t.event_id || n.event_id),
      hs(i, t, n, r, this, o).then((a) => {
        if (a === null) return a;
        this.emit("postprocessEvent", a, n),
          (a.contexts = {
            trace: { ...a.contexts?.trace, ...Uo(r) },
            ...a.contexts,
          });
        let c = Yn(this, r);
        return (
          (a.sdkProcessingMetadata = {
            dynamicSamplingContext: c,
            ...a.sdkProcessingMetadata,
          }),
          a
        );
      })
    );
  }
  _captureEvent(t, n = {}, r = C(), o = te()) {
    return (
      y &&
        af(t) &&
        _.log(`Captured error event \`${dc(t)[0] || "<unknown>"}\``),
      this._processEvent(t, n, r, o).then(
        (i) => i.event_id,
        (i) => {
          y &&
            (B_(i) ? _.log(i.message) : D_(i) ? _.warn(i.message) : _.warn(i));
        },
      )
    );
  }
  _processEvent(t, n, r, o) {
    let i = this.getOptions(),
      { sampleRate: s } = i,
      a = j_(t),
      c = af(t),
      f = `before send for type \`${t.type || "error"}\``,
      l = typeof s > "u" ? void 0 : Mt(s);
    if (c && typeof l == "number" && Et() > l)
      return (
        this.recordDroppedEvent("sample_rate", "error"),
        Xr(
          sf(
            `Discarding event because it's not included in the random sample (sampling rate = ${s})`,
          ),
        )
      );
    let d = H_(t.type);
    return this._prepareEvent(t, n, r, o)
      .then((p) => {
        if (p === null)
          throw (
            (this.recordDroppedEvent("event_processor", d),
            sf("An event processor returned `null`, will not send event."))
          );
        if (n.data?.__sentry__ === !0) return p;
        let h = gb(this, i, p, n);
        return hb(h, f);
      })
      .then((p) => {
        if (p === null) {
          if ((this.recordDroppedEvent("before_send", d), a)) {
            let S = 1 + (t.spans || []).length;
            this.recordDroppedEvent("before_send", "span", S);
          }
          throw sf(`${f} returned \`null\`, will not send event.`);
        }
        let m = r.getSession() || o.getSession();
        if ((c && m && this._updateSessionFromEvent(m, p), a)) {
          let g = p.sdkProcessingMetadata?.spanCountBeforeProcessing || 0,
            S = p.spans ? p.spans.length : 0,
            T = g - S;
          T > 0 && this.recordDroppedEvent("before_send", "span", T);
        }
        let h = p.transaction_info;
        if (a && h && p.transaction !== t.transaction) {
          let g = "custom";
          p.transaction_info = { ...h, source: g };
        }
        return this.sendEvent(p, n), p;
      })
      .then(null, (p) => {
        throw B_(p) || D_(p)
          ? p
          : (this.captureException(p, {
              mechanism: { handled: !1, type: "internal" },
              data: { __sentry__: !0 },
              originalException: p,
            }),
            mc(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${p}`));
      });
  }
  _process(t, n) {
    this._numProcessing++,
      this._promiseBuffer.add(t).then(
        (r) => (this._numProcessing--, r),
        (r) => (
          this._numProcessing--,
          r === Ko && this.recordDroppedEvent("queue_overflow", n),
          r
        ),
      );
  }
  _clearOutcomes() {
    let t = this._outcomes;
    return (
      (this._outcomes = {}),
      Object.entries(t).map(([n, r]) => {
        let [o, i] = n.split(":");
        return { reason: o, category: i, quantity: r };
      })
    );
  }
  _flushOutcomes() {
    y && _.log("Flushing outcomes...");
    let t = this._clearOutcomes();
    if (t.length === 0) {
      y && _.log("No outcomes to send");
      return;
    }
    if (!this._dsn) {
      y && _.log("No dsn provided, will not send outcomes");
      return;
    }
    y && _.log("Sending outcomes:", t);
    let n = x_(t, this._options.tunnel && Ge(this._dsn));
    this.sendEnvelope(n);
  }
};
function H_(e) {
  return e === "replay_event" ? "replay" : e || "error";
}
function hb(e, t) {
  let n = `${t} must return \`null\` or a valid event.`;
  if (lt(e))
    return e.then(
      (r) => {
        if (!ve(r) && r !== null) throw mc(n);
        return r;
      },
      (r) => {
        throw mc(`${t} rejected with ${r}`);
      },
    );
  if (!ve(e) && e !== null) throw mc(n);
  return e;
}
function gb(e, t, n, r) {
  let { beforeSend: o, beforeSendTransaction: i, ignoreSpans: s } = t,
    a = !Vn(t.beforeSendSpan) && t.beforeSendSpan,
    c = n;
  if (af(c) && o) return o(c, r);
  if (j_(c)) {
    if (a || s) {
      let u = k_(c);
      if (
        s?.length &&
        qn({ description: u.description, op: u.op, attributes: u.data }, s)
      )
        return null;
      if (a) {
        let f = a(u);
        f ? (c = dr(n, w_(f))) : Kr();
      }
      if (c.spans) {
        let f = [],
          l = c.spans;
        for (let p of l) {
          if (
            s?.length &&
            qn({ description: p.description, op: p.op, attributes: p.data }, s)
          ) {
            Bm(l, p);
            continue;
          }
          if (a) {
            let m = a(p);
            m ? f.push(m) : (Kr(), f.push(p));
          } else f.push(p);
        }
        let d = c.spans.length - f.length;
        d && e.recordDroppedEvent("before_send", "span", d), (c.spans = f);
      }
    }
    if (i) {
      if (c.spans) {
        let u = c.spans.length;
        c.sdkProcessingMetadata = {
          ...n.sdkProcessingMetadata,
          spanCountBeforeProcessing: u,
        };
      }
      return i(c, r);
    }
  }
  return c;
}
function af(e) {
  return e.type === void 0;
}
function j_(e) {
  return e.type === "transaction";
}
function Sb(e) {
  let t = 0;
  return e.name && (t += e.name.length * 2), (t += 8), t + z_(e.attributes);
}
function Eb(e) {
  let t = 0;
  return e.message && (t += e.message.length * 2), t + z_(e.attributes);
}
function z_(e) {
  if (!e) return 0;
  let t = 0;
  return (
    Object.values(e).forEach((n) => {
      Array.isArray(n)
        ? (t += n.length * G_(n[0]))
        : Fe(n)
          ? (t += G_(n))
          : (t += 100);
    }),
    t
  );
}
function G_(e) {
  return typeof e == "string"
    ? e.length * 2
    : typeof e == "number"
      ? 8
      : typeof e == "boolean"
        ? 4
        : 0;
}
function cf(e, t) {
  t.debug === !0 &&
    (y
      ? _.enable()
      : We(() => {
          console.warn(
            "[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.",
          );
        })),
    C().update(t.initialScope);
  let r = new e(t);
  return uf(r), r.init(), r;
}
function uf(e) {
  C().setClient(e);
}
var lf = 100,
  ff = 5e3,
  Tb = 36e5;
function pf(e) {
  function t(...n) {
    y && _.log("[Offline]:", ...n);
  }
  return (n) => {
    let r = e(n);
    if (!n.createStore)
      throw new Error("No `createStore` function was provided");
    let o = n.createStore(n),
      i = ff,
      s;
    function a(l, d, p) {
      return Jr(l, ["client_report"])
        ? !1
        : n.shouldStore
          ? n.shouldStore(l, d, p)
          : !0;
    }
    function c(l) {
      s && clearTimeout(s),
        (s = Tr(
          setTimeout(async () => {
            s = void 0;
            let d = await o.shift();
            d &&
              (t("Attempting to send previously queued event"),
              (d[0].sent_at = new Date(et()).toISOString()),
              f(d, !0).catch((p) => {
                t("Failed to retry sending", p);
              }));
          }, l),
        ));
    }
    function u() {
      s || (c(i), (i = Math.min(i * 2, Tb)));
    }
    async function f(l, d = !1) {
      if (!d && Jr(l, ["replay_event", "replay_recording"]))
        return await o.push(l), c(lf), {};
      try {
        if (n.shouldSend && (await n.shouldSend(l)) === !1)
          throw new Error(
            "Envelope not sent because `shouldSend` callback returned false",
          );
        let p = await r.send(l),
          m = lf;
        if (p) {
          if (p.headers?.["retry-after"]) m = fc(p.headers["retry-after"]);
          else if (p.headers?.["x-sentry-rate-limits"]) m = 6e4;
          else if ((p.statusCode || 0) >= 400) return p;
        }
        return c(m), (i = ff), p;
      } catch (p) {
        if (await a(l, p, i))
          return (
            d ? await o.unshift(l) : await o.push(l),
            u(),
            t("Error sending. Event queued.", p),
            {}
          );
        throw p;
      }
    }
    return (
      n.flushAtStartup && u(),
      { send: f, flush: (l) => (l === void 0 && ((i = ff), c(lf)), r.flush(l)) }
    );
  };
}
var Cs = "MULTIPLEXED_TRANSPORT_EXTRA_KEY";
function q_(e, t) {
  let n;
  return (
    bt(
      e,
      (r, o) => (t.includes(o) && (n = Array.isArray(r) ? r[1] : void 0), !!n),
    ),
    n
  );
}
function yb(e, t) {
  return (n) => {
    let r = e(n);
    return {
      ...r,
      send: async (o) => {
        let i = q_(o, ["event", "transaction", "profile", "replay_event"]);
        return i && (i.release = t), r.send(o);
      },
    };
  };
}
function Ib(e, t) {
  return ke(t ? { ...e[0], dsn: t } : e[0], e[1]);
}
function Y_(e, t) {
  return (n) => {
    let r = e(n),
      o = new Map(),
      i =
        t ||
        ((u) => {
          let f = u.getEvent();
          return f?.extra?.[Cs] && Array.isArray(f.extra[Cs])
            ? f.extra[Cs]
            : [];
        });
    function s(u, f) {
      let l = f ? `${u}:${f}` : u,
        d = o.get(l);
      if (!d) {
        let p = za(u);
        if (!p) return;
        let m = bs(p, n.tunnel);
        (d = f ? yb(e, f)({ ...n, url: m }) : e({ ...n, url: m })), o.set(l, d);
      }
      return [u, d];
    }
    async function a(u) {
      function f(m) {
        let h = m?.length ? m : ["event"];
        return q_(u, h);
      }
      let l = i({ envelope: u, getEvent: f })
          .map((m) =>
            typeof m == "string" ? s(m, void 0) : s(m.dsn, m.release),
          )
          .filter((m) => !!m),
        d = l.length ? l : [["", r]];
      return (await Promise.all(d.map(([m, h]) => h.send(Ib(u, m)))))[0];
    }
    async function c(u) {
      let f = [...o.values(), r];
      return (await Promise.all(f.map((d) => d.flush(u)))).every((d) => d);
    }
    return { send: a, flush: c };
  };
}
function df(e, t) {
  return t.some((n) => e.includes(n));
}
function yr(e, t, n) {
  if (t === !1) return {};
  let r = n != null ? [...of, ...n] : of,
    o = {};
  if (t === !0) {
    for (let s of Object.keys(e)) o[s] = df(s.toLowerCase(), r) ? no : e[s];
    return o;
  }
  if ("deny" in t) {
    let s = t.deny.map((a) => a.toLowerCase());
    for (let a of Object.keys(e)) {
      let c = a.toLowerCase(),
        u = df(c, r) || s.some((f) => c.includes(f));
      o[a] = u ? no : e[a];
    }
    return o;
  }
  let i = t.allow.map((s) => s.toLowerCase());
  for (let s of Object.keys(e)) {
    let a = s.toLowerCase();
    if (df(a, r)) o[s] = no;
    else {
      let c = i.some((u) => a.includes(u));
      o[s] = c ? e[s] : no;
    }
  }
  return o;
}
function V_(e) {
  let t = {},
    n = 0;
  for (; n < e.length; ) {
    let r = e.indexOf("=", n);
    if (r === -1) break;
    let o = e.indexOf(";", n);
    if (o === -1) o = e.length;
    else if (o < r) {
      n = e.lastIndexOf(";", r - 1) + 1;
      continue;
    }
    let i = e.slice(n, r).trim();
    if (t[i] === void 0) {
      let s = e.slice(r + 1, o).trim();
      s.charCodeAt(0) === 34 && (s = s.slice(1, -1));
      try {
        t[i] = s.indexOf("%") !== -1 ? decodeURIComponent(s) : s;
      } catch {
        t[i] = s;
      }
    }
    n = o + 1;
  }
  return t;
}
function xs(e, t) {
  if (t === !1) return {};
  try {
    let n = V_(e);
    return Object.keys(n).length === 0 ? {} : yr(n, t, O_);
  } catch {
    return no;
  }
}
var bb = "thismessage:/";
function ro(e) {
  return "isRelative" in e;
}
function Cn(e, t) {
  let n = e.indexOf("://") <= 0 && e.indexOf("//") !== 0,
    r = t ?? (n ? bb : void 0);
  try {
    if ("canParse" in URL && !URL.canParse(e, r)) return;
    let o = new URL(e, r);
    return n
      ? { isRelative: n, pathname: o.pathname, search: o.search, hash: o.hash }
      : o;
  } catch {}
}
function Jo(e) {
  if (ro(e)) return e.pathname;
  let t = new URL(e);
  return (
    (t.search = ""),
    (t.hash = ""),
    ["80", "443"].includes(t.port) && (t.port = ""),
    t.password && (t.password = "%filtered%"),
    t.username && (t.username = "%filtered%"),
    t.toString()
  );
}
function jt(e) {
  if (!e) return {};
  let t = e.match(
    /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/,
  );
  if (!t) return {};
  let n = t[6] || "",
    r = t[8] || "";
  return {
    host: t[4],
    path: t[5],
    protocol: t[2],
    search: n,
    hash: r,
    relative: t[5] + n + r,
  };
}
function Xo(e) {
  return e.split(/[?#]/, 1)[0];
}
function it(e, t = !0) {
  if (e.startsWith("data:")) {
    let n = e.match(/^data:([^;,]+)/),
      r = n ? n[1] : "text/plain",
      o = e.includes(";base64,"),
      i = e.indexOf(","),
      s = "";
    if (t && i !== -1) {
      let a = e.slice(i + 1);
      s = a.length > 10 ? `${a.slice(0, 10)}... [truncated]` : a;
    }
    return `data:${r}${o ? ",base64" : ""}${s ? `,${s}` : ""}`;
  }
  return e;
}
function Qo(e, t) {
  let n = t?.getDsn(),
    r = t?.getOptions().tunnel;
  return Rb(e, n) || Ab(e, r);
}
function Ab(e, t) {
  return t ? K_(e) === K_(t) : !1;
}
function Rb(e, t) {
  let n = Cn(e);
  return !n || ro(n) || !t
    ? !1
    : vb(n.hostname, t.host) && /(^|&|\?)sentry_key=/.test(n.search);
}
function vb(e, t) {
  return e === t || (t.length > 0 && e.endsWith(`.${t}`));
}
function K_(e) {
  return e[e.length - 1] === "/" ? e.slice(0, -1) : e;
}
function mf(e, ...t) {
  let n = new String(String.raw(e, ...t));
  return (
    (n.__sentry_template_string__ = e
      .join("\0")
      .replace(/%/g, "%%")
      .replace(/\0/g, "%s")),
    (n.__sentry_template_values__ = t),
    n
  );
}
var _f = mf;
function hf(e) {
  "aggregates" in e
    ? e.attrs?.ip_address === void 0 &&
      (e.attrs = { ...e.attrs, ip_address: "{{auto}}" })
    : e.ipAddress === void 0 && (e.ipAddress = "{{auto}}");
}
function gf(e, t, n = [t], r = "npm") {
  let o = ((e._metadata = e._metadata || {}).sdk = e._metadata.sdk || {});
  o.name ||
    ((o.name = `sentry.javascript.${t}`),
    (o.packages = n.map((i) => ({ name: `${r}:@sentry/${i}`, version: Ot }))),
    (o.version = Ot));
}
function Zo(e = {}) {
  let t = e.client || I();
  if (!Ts() || !t) return {};
  let n = ct(),
    r = Wt(n);
  if (r.getTraceData) return r.getTraceData(e);
  let o = e.scope || C(),
    i = e.span || ne(),
    s = An(i) && !xe(t.getOptions());
  if (!i && Na()) return {};
  let a = i && !s ? is(i) : Nb(o),
    c = i ? Le(i) : Yn(t, o),
    u = ja(c);
  if (!Ya.test(a))
    return _.warn("Invalid sentry-trace data. Cannot generate trace data"), {};
  let l = { "sentry-trace": a, baggage: u };
  return e.propagateTraceparent && (l.traceparent = i && !s ? wm(i) : Cb(o)), l;
}
function Nb(e) {
  let {
    traceId: t,
    sampled: n,
    propagationSpanId: r,
  } = e.getPropagationContext();
  return ts(t, r, n);
}
function Cb(e) {
  let {
    traceId: t,
    sampled: n,
    propagationSpanId: r,
  } = e.getPropagationContext();
  return ns(t, r, n);
}
function Sf(e, t, n) {
  let r,
    o,
    i,
    s = n?.maxWait ? Math.max(n.maxWait, t) : 0,
    a = n?.setTimeoutImpl || setTimeout;
  function c() {
    return u(), (r = e()), r;
  }
  function u() {
    o !== void 0 && clearTimeout(o),
      i !== void 0 && clearTimeout(i),
      (o = i = void 0);
  }
  function f() {
    return o !== void 0 || i !== void 0 ? c() : r;
  }
  function l() {
    return (
      o && clearTimeout(o), (o = a(c, t)), s && i === void 0 && (i = a(c, s)), r
    );
  }
  return (l.cancel = u), (l.flush = f), l;
}
var xb = 100;
function mt(e, t) {
  let n = I(),
    r = te();
  if (!n) return;
  let { beforeBreadcrumb: o = null, maxBreadcrumbs: i = xb } = n.getOptions();
  if (i <= 0) return;
  let a = { timestamp: Tt(), ...e },
    c = o ? We(() => o(a, t)) : a;
  c !== null &&
    (n.emit && n.emit("beforeAddBreadcrumb", c, t), r.addBreadcrumb(c, i));
}
var J_,
  kb = "FunctionToString",
  X_ = new WeakMap(),
  wb = () => ({
    name: kb,
    setupOnce() {
      J_ = Function.prototype.toString;
      try {
        Function.prototype.toString = function (...e) {
          let t = lr(this),
            n = X_.has(I()) && t !== void 0 ? t : this;
          return J_.apply(n, e);
        };
      } catch {}
    },
    setup(e) {
      X_.set(e, !0);
    },
  }),
  _c = wb;
var Ob = [
    /^Script error\.?$/,
    /^Javascript error: Script error\.? on line 0$/,
    /^ResizeObserver loop completed with undelivered notifications.$/,
    /^Cannot redefine property: googletag$/,
    /^Can't find variable: gmo$/,
    /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
    /can't redefine non-configurable property "solana"/,
    /vv\(\)\.getRestrictions is not a function/,
    /Can't find variable: _AutofillCallbackHandler/,
    /Object Not Found Matching Id:\d+, MethodName:simulateEvent/,
    /^Java exception was raised during method invocation$/,
  ],
  Mb = "EventFilters",
  Ef = (e = {}) => {
    let t;
    return {
      name: Mb,
      setup(n) {
        let r = n.getOptions();
        t = Q_(e, r);
      },
      processEvent(n, r, o) {
        if (!t) {
          let i = o.getOptions();
          t = Q_(e, i);
        }
        return Lb(n, t) ? null : n;
      },
    };
  },
  gc = (e = {}) => ({ ...Ef(e), name: "InboundFilters" });
function Q_(e = {}, t = {}) {
  return {
    allowUrls: [...(e.allowUrls || []), ...(t.allowUrls || [])],
    denyUrls: [...(e.denyUrls || []), ...(t.denyUrls || [])],
    ignoreErrors: [
      ...(e.ignoreErrors || []),
      ...(t.ignoreErrors || []),
      ...(e.disableErrorDefaults ? [] : Ob),
    ],
    ignoreTransactions: [
      ...(e.ignoreTransactions || []),
      ...(t.ignoreTransactions || []),
    ],
  };
}
function Lb(e, t) {
  if (e.type) {
    if (e.type === "transaction" && Ub(e, t.ignoreTransactions))
      return (
        y &&
          _.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${an(e)}`),
        !0
      );
  } else {
    if (Pb(e, t.ignoreErrors))
      return (
        y &&
          _.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${an(e)}`),
        !0
      );
    if (Hb(e))
      return (
        y &&
          _.warn(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${an(e)}`),
        !0
      );
    if (Db(e, t.denyUrls))
      return (
        y &&
          _.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${an(e)}.
Url: ${hc(e)}`),
        !0
      );
    if (!Bb(e, t.allowUrls))
      return (
        y &&
          _.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${an(e)}.
Url: ${hc(e)}`),
        !0
      );
  }
  return !1;
}
function Pb(e, t) {
  return t?.length ? dc(e).some((n) => He(n, t)) : !1;
}
function Ub(e, t) {
  if (!t?.length) return !1;
  let n = e.transaction;
  return n ? He(n, t) : !1;
}
function Db(e, t) {
  if (!t?.length) return !1;
  let n = hc(e);
  return n ? He(n, t) : !1;
}
function Bb(e, t) {
  if (!t?.length) return !0;
  let n = hc(e);
  return n ? He(n, t) : !0;
}
function Fb(e = []) {
  for (let t = e.length - 1; t >= 0; t--) {
    let n = e[t];
    if (n && n.filename !== "<anonymous>" && n.filename !== "[native code]")
      return n.filename || null;
  }
  return null;
}
function hc(e) {
  try {
    let n = [...(e.exception?.values ?? [])]
      .reverse()
      .find(
        (r) =>
          r.mechanism?.parent_id === void 0 && r.stacktrace?.frames?.length,
      )?.stacktrace?.frames;
    return n ? Fb(n) : null;
  } catch {
    return y && _.error(`Cannot extract url for event ${an(e)}`), null;
  }
}
function Hb(e) {
  return e.exception?.values?.length
    ? !e.message &&
        !e.exception.values.some(
          (t) => t.stacktrace || (t.type && t.type !== "Error") || t.value,
        )
    : !1;
}
function yf(e, t, n, r, o, i) {
  if (!o.exception?.values || !i || !on(i.originalException, Error)) return;
  let s =
    o.exception.values.length > 0
      ? o.exception.values[o.exception.values.length - 1]
      : void 0;
  s &&
    (o.exception.values = Tf(
      e,
      t,
      r,
      i.originalException,
      n,
      o.exception.values,
      s,
      0,
    ));
}
function Tf(e, t, n, r, o, i, s, a) {
  if (i.length >= n + 1) return i;
  let c = [...i];
  if (on(r[o], Error)) {
    Z_(s, a, r);
    let u = e(t, r[o]),
      f = c.length;
    eh(u, o, f, a), (c = Tf(e, t, n, r[o], o, [u, ...c], u, f));
  }
  return (
    th(r) &&
      r.errors.forEach((u, f) => {
        if (on(u, Error)) {
          Z_(s, a, r);
          let l = e(t, u),
            d = c.length;
          eh(l, `errors[${f}]`, d, a), (c = Tf(e, t, n, u, o, [l, ...c], l, d));
        }
      }),
    c
  );
}
function th(e) {
  return Array.isArray(e.errors);
}
function Z_(e, t, n) {
  e.mechanism = {
    handled: !0,
    type: "auto.core.linked_errors",
    ...(th(n) && { is_exception_group: !0 }),
    ...e.mechanism,
    exception_id: t,
  };
}
function eh(e, t, n, r) {
  e.mechanism = {
    handled: !0,
    ...e.mechanism,
    type: "chained",
    source: t,
    exception_id: n,
    parent_id: r,
  };
}
function Gb(e) {
  return (
    Je(e) &&
    "__sentry_fetch_url_host__" in e &&
    typeof e.__sentry_fetch_url_host__ == "string"
  );
}
function Sc(e) {
  return Gb(e) ? `${e.message} (${e.__sentry_fetch_url_host__})` : e.message;
}
var rh = new Map(),
  nh = new Set();
function $b(e) {
  if (v._sentryModuleMetadata)
    for (let t of Object.keys(v._sentryModuleMetadata)) {
      let n = v._sentryModuleMetadata[t];
      if (nh.has(t)) continue;
      nh.add(t);
      let r = e(t);
      for (let o of r.reverse())
        if (o.filename) {
          rh.set(o.filename, n);
          break;
        }
    }
}
function Wb(e, t) {
  return $b(e), rh.get(t);
}
function Ec(e, t) {
  t.exception?.values?.forEach((n) => {
    n.stacktrace?.frames?.forEach((r) => {
      if (!r.filename || r.module_metadata) return;
      let o = Wb(e, r.filename);
      o && (r.module_metadata = o);
    });
  });
}
function Tc(e) {
  e.exception?.values?.forEach((t) => {
    t.stacktrace?.frames?.forEach((n) => {
      delete n.module_metadata;
    });
  });
}
var oh = () => ({
  name: "ModuleMetadata",
  setup(e) {
    e.on("beforeEnvelope", (t) => {
      bt(t, (n, r) => {
        if (r === "event") {
          let o = Array.isArray(n) ? n[1] : void 0;
          o && (Tc(o), (n[1] = o));
        }
      });
    }),
      e.on("applyFrameMetadata", (t) => {
        if (t.type) return;
        let n = e.getOptions().stackParser;
        Ec(n, t);
      });
  },
});
var ih = new Set([]);
function oo(e) {
  let t = "console",
    n = Qe(t, e);
  return Ze(t, jb), n;
}
function jb() {
  "console" in v &&
    cr.forEach(function (e) {
      e in v.console &&
        Ee(v.console, e, function (t) {
          return (
            (Gr[e] = t),
            function (...n) {
              let r = n[0],
                o = Gr[e],
                i = ih.size && typeof r == "string" && He(r, ih);
              i || Be("console", { args: n, level: e }),
                (!i || (y && _.isEnabled())) && o?.apply(v.console, n);
            }
          );
        });
    });
}
function Xn(e) {
  return e === "warn"
    ? "warning"
    : ["fatal", "error", "warning", "log", "info", "debug"].includes(e)
      ? e
      : "log";
}
var zb = "CaptureConsole",
  qb = (e = {}) => {
    let t = e.levels || cr,
      n = e.handled ?? !0;
    return {
      name: zb,
      setup(r) {
        "console" in v &&
          oo(({ args: o, level: i }) => {
            I() !== r || !t.includes(i) || Yb(o, i, n);
          });
      },
    };
  },
  sh = qb;
function Yb(e, t, n) {
  let r = Xn(t),
    o = new Error(),
    i = { level: Xn(t), extra: { arguments: e } };
  De((s) => {
    if (
      (s.addEventProcessor(
        (u) => (
          (u.logger = "console"),
          Ye(u, { handled: n, type: "auto.core.capture_console" }),
          u
        ),
      ),
      t === "assert")
    ) {
      if (!e[0]) {
        let u = `Assertion failed: ${fr(e.slice(1), " ") || "console.assert"}`;
        s.setExtra("arguments", e.slice(1)),
          s.captureMessage(u, r, { captureContext: i, syntheticException: o });
      }
      return;
    }
    let a = e.find((u) => u instanceof Error);
    if (a) {
      X(a, i);
      return;
    }
    let c = fr(e, " ");
    s.captureMessage(c, r, { captureContext: i, syntheticException: o });
  });
}
var Vb = "Dedupe",
  Kb = () => {
    let e;
    return {
      name: Vb,
      processEvent(t) {
        if (t.type) return t;
        try {
          if (Jb(t, e))
            return (
              y &&
                _.warn(
                  "Event dropped due to being a duplicate of previously captured event.",
                ),
              null
            );
        } catch {}
        return (e = t);
      },
    };
  },
  yc = Kb;
function Jb(e, t) {
  return t ? !!(Xb(e, t) || Qb(e, t)) : !1;
}
function Xb(e, t) {
  let n = e.message,
    r = t.message;
  return !(
    (!n && !r) ||
    (n && !r) ||
    (!n && r) ||
    n !== r ||
    !uh(e, t) ||
    !ch(e, t)
  );
}
function Qb(e, t) {
  let n = ah(t),
    r = ah(e);
  return !(
    !n ||
    !r ||
    n.type !== r.type ||
    n.value !== r.value ||
    !uh(e, t) ||
    !ch(e, t)
  );
}
function ch(e, t) {
  let n = $r(e),
    r = $r(t);
  if (!n && !r) return !0;
  if ((n && !r) || (!n && r) || ((n = n), (r = r), r.length !== n.length))
    return !1;
  for (let o = 0; o < r.length; o++) {
    let i = r[o],
      s = n[o];
    if (
      i.filename !== s.filename ||
      i.lineno !== s.lineno ||
      i.colno !== s.colno ||
      i.function !== s.function
    )
      return !1;
  }
  return !0;
}
function uh(e, t) {
  let n = e.fingerprint,
    r = t.fingerprint;
  if (!n && !r) return !0;
  if ((n && !r) || (!n && r)) return !1;
  (n = n), (r = r);
  try {
    return n.join("") === r.join("");
  } catch {
    return !1;
  }
}
function ah(e) {
  return e.exception?.values?.[0];
}
var Zb = "ExtraErrorData",
  eA = (e = {}) => {
    let { depth: t = 3, captureErrorCause: n = !0 } = e;
    return {
      name: Zb,
      processEvent(r, o, i) {
        let { maxValueLength: s } = i.getOptions();
        return tA(r, o, t, n, s);
      },
    };
  },
  lh = eA;
function tA(e, t = {}, n, r, o) {
  if (!t.originalException || !Je(t.originalException)) return e;
  let i = t.originalException.name || t.originalException.constructor.name,
    s = fh(t.originalException, r, o);
  if (s) {
    let a = { ...e.contexts },
      c = he(s, n);
    return ve(c) && (im(c), (a[i] = c)), { ...e, contexts: a };
  }
  return e;
}
function fh(e, t, n) {
  try {
    let r = [
        "name",
        "message",
        "stack",
        "line",
        "column",
        "fileName",
        "lineNumber",
        "columnNumber",
        "toJSON",
      ],
      o = {};
    for (let i of Object.keys(e)) {
      if (r.indexOf(i) !== -1) continue;
      let s = e[i];
      o[i] = Je(s) || typeof s == "string" ? (n ? sn(`${s}`, n) : `${s}`) : s;
    }
    if (t && e.cause !== void 0)
      if (Je(e.cause)) {
        let i = e.cause.name || e.cause.constructor.name;
        o.cause = { [i]: fh(e.cause, !1, n) };
      } else o.cause = e.cause;
    if (typeof e.toJSON == "function") {
      let i = e.toJSON();
      for (let s of Object.keys(i)) {
        let a = i[s];
        o[s] = Je(a) ? a.toString() : a;
      }
    }
    return o;
  } catch (r) {
    y && _.error("Unable to extract extra data from the Error object:", r);
  }
  return null;
}
function nA(e, t) {
  let n = 0;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    o === "."
      ? e.splice(r, 1)
      : o === ".."
        ? (e.splice(r, 1), n++)
        : n && (e.splice(r, 1), n--);
  }
  if (t) for (; n--; n) e.unshift("..");
  return e;
}
var rA =
  /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
function oA(e) {
  let t = e.length > 1024 ? `<truncated>${e.slice(-1024)}` : e,
    n = rA.exec(t);
  return n ? n.slice(1) : [];
}
function ph(...e) {
  let t = "",
    n = !1;
  for (let r = e.length - 1; r >= -1 && !n; r--) {
    let o = r >= 0 ? e[r] : "/";
    o && ((t = `${o}/${t}`), (n = o.charAt(0) === "/"));
  }
  return (
    (t = nA(
      t.split("/").filter((r) => !!r),
      !n,
    ).join("/")),
    (n ? "/" : "") + t || "."
  );
}
function dh(e) {
  let t = 0;
  for (; t < e.length && e[t] === ""; t++);
  let n = e.length - 1;
  for (; n >= 0 && e[n] === ""; n--);
  return t > n ? [] : e.slice(t, n - t + 1);
}
function mh(e, t) {
  (e = ph(e).slice(1)), (t = ph(t).slice(1));
  let n = dh(e.split("/")),
    r = dh(t.split("/")),
    o = Math.min(n.length, r.length),
    i = o;
  for (let a = 0; a < o; a++)
    if (n[a] !== r[a]) {
      i = a;
      break;
    }
  let s = [];
  for (let a = i; a < n.length; a++) s.push("..");
  return (s = s.concat(r.slice(i))), s.join("/");
}
function _h(e, t) {
  let n = oA(e)[2] || "";
  return (
    t && n.slice(t.length * -1) === t && (n = n.slice(0, n.length - t.length)),
    n
  );
}
var iA = "RewriteFrames",
  hh = (e = {}) => {
    let t = e.root,
      n = e.prefix || "app:///",
      r = "window" in v && !!v.window,
      o = e.iteratee || sA({ isBrowser: r, root: t, prefix: n });
    function i(a) {
      try {
        return {
          ...a,
          exception: {
            ...a.exception,
            values: a.exception.values.map((c) => ({
              ...c,
              ...(c.stacktrace && { stacktrace: s(c.stacktrace) }),
            })),
          },
        };
      } catch {
        return a;
      }
    }
    function s(a) {
      return { ...a, frames: a?.frames?.map((c) => o(c)) };
    }
    return {
      name: iA,
      processEvent(a) {
        let c = a;
        return (
          a.exception && Array.isArray(a.exception.values) && (c = i(c)), c
        );
      },
    };
  };
function sA({ isBrowser: e, root: t, prefix: n }) {
  return (r) => {
    if (!r.filename) return r;
    let o =
        /^[a-zA-Z]:\\/.test(r.filename) ||
        (r.filename.includes("\\") && !r.filename.includes("/")),
      i = /^\//.test(r.filename);
    if (e) {
      if (t) {
        let s = r.filename;
        s.indexOf(t) === 0 && (r.filename = s.replace(t, n));
      }
    } else if (o || i) {
      let s = o
          ? r.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/")
          : r.filename,
        a = t ? mh(t, s) : _h(s);
      r.filename = `${n}${a}`;
    }
    return r;
  };
}
var aA = [
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
  ],
  cA = [
    "createUser",
    "deleteUser",
    "listUsers",
    "getUserById",
    "updateUserById",
    "inviteUserByEmail",
  ],
  uA = {
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
  },
  Sh = ["select", "insert", "upsert", "update", "delete"];
function Ic(e) {
  try {
    e.__SENTRY_INSTRUMENTED__ = !0;
  } catch {}
}
function bc(e) {
  try {
    return e.__SENTRY_INSTRUMENTED__;
  } catch {
    return !1;
  }
}
function Eh(e, t) {
  if (Object.keys(t).length > 0) return t;
  if (Array.isArray(e) && e.length > 0) return e;
}
function lA(e, t) {
  return Eh(e, t) !== void 0;
}
function fA(e, t = {}) {
  switch (e) {
    case "GET":
      return "select";
    case "POST":
      return t.Prefer?.includes("resolution=") ? "upsert" : "insert";
    case "PATCH":
      return "update";
    case "DELETE":
      return "delete";
    default:
      return "<unknown-op>";
  }
}
function pA(e, t) {
  if (t === "" || t === "*") return "select(*)";
  if (e === "select") return `select(${t})`;
  if (e === "or" || e.endsWith(".or")) return `${e}${t}`;
  let [n, ...r] = t.split("."),
    o;
  return (
    n?.startsWith("fts")
      ? (o = "textSearch")
      : n?.startsWith("plfts")
        ? (o = "textSearch[plain]")
        : n?.startsWith("phfts")
          ? (o = "textSearch[phrase]")
          : n?.startsWith("wfts")
            ? (o = "textSearch[websearch]")
            : (o = (n && uA[n]) || "filter"),
    `${o}(${e}, ${r.join(".")})`
  );
}
function gh(e, t = !1) {
  return new Proxy(e, {
    apply(n, r, o) {
      return ze(
        {
          name: `auth ${t ? "(admin) " : ""}${e.name}`,
          attributes: {
            [$]: "auto.db.supabase",
            [J]: "db",
            "db.system": "postgresql",
            "db.operation": `auth.${t ? "admin." : ""}${e.name}`,
          },
        },
        (i) =>
          Reflect.apply(n, r, o)
            .then(
              (s) => (
                s && typeof s == "object" && "error" in s && s.error
                  ? (i.setStatus({ code: 2 }),
                    X(s.error, {
                      mechanism: { handled: !1, type: "auto.db.supabase.auth" },
                    }))
                  : i.setStatus({ code: 1 }),
                i.end(),
                s
              ),
            )
            .catch((s) => {
              throw (
                (i.setStatus({ code: 2 }),
                i.end(),
                X(s, {
                  mechanism: { handled: !1, type: "auto.db.supabase.auth" },
                }),
                s)
              );
            })
            .then(...o),
      );
    },
  });
}
function dA(e) {
  let t = e.auth;
  if (!(!t || bc(e.auth))) {
    for (let n of aA) {
      let r = t[n];
      r && typeof e.auth[n] == "function" && (e.auth[n] = gh(r));
    }
    for (let n of cA) {
      let r = t.admin[n];
      r &&
        typeof e.auth.admin[n] == "function" &&
        (e.auth.admin[n] = gh(r, !0));
    }
    Ic(e.auth);
  }
}
function mA(e, t) {
  bc(e.prototype.from) ||
    ((e.prototype.from = new Proxy(e.prototype.from, {
      apply(n, r, o) {
        let i = Reflect.apply(n, r, o),
          s = i.constructor;
        return hA(s, t), i;
      },
    })),
    Ic(e.prototype.from));
}
function _A(e, t) {
  bc(e.prototype.then) ||
    ((e.prototype.then = new Proxy(e.prototype.then, {
      apply(n, r, o) {
        let i = Sh,
          s = r,
          a = fA(s.method, s.headers);
        if (
          !i.includes(a) ||
          !s?.url?.pathname ||
          typeof s.url.pathname != "string"
        )
          return Reflect.apply(n, r, o);
        let c = s.url.pathname.split("/"),
          u = c.length > 0 ? c[c.length - 1] : "",
          f = [];
        for (let [A, M] of s.url.searchParams.entries()) f.push(pA(A, M));
        let l = Object.create(null);
        if (ve(s.body)) for (let [A, M] of Object.entries(s.body)) l[A] = M;
        let d = I(),
          p =
            t.sendOperationData ??
            d?.getDataCollectionOptions().userInfo === !0,
          m = Eh(s.body, l),
          h = a === "select" ? "" : `${a}${lA(s.body, l) ? "(...) " : ""}`,
          g = p ? f.join(" ") : f.length > 0 ? "[redacted]" : "",
          S = [h.trimEnd(), g].filter(Boolean).join(" "),
          T = S ? `${S} from(${u})` : `from(${u})`,
          x = {
            "db.table": u,
            "db.schema": s.schema,
            "db.url": s.url.origin,
            "db.sdk": s.headers["X-Client-Info"],
            "db.system": "postgresql",
            "db.operation": a,
            [$]: "auto.db.supabase",
            [J]: "db",
          };
        return (
          f.length && p && (x["db.query"] = f),
          m !== void 0 && p && (x["db.body"] = m),
          ze({ name: T, attributes: x }, (A) =>
            Reflect.apply(n, r, [])
              .then(
                (M) => {
                  if (
                    (A &&
                      (M &&
                        typeof M == "object" &&
                        "status" in M &&
                        jn(A, M.status || 500),
                      A.end()),
                    M?.error)
                  ) {
                    let k = new Error(M.error.message);
                    M.error.code && (k.code = M.error.code),
                      M.error.details && (k.details = M.error.details);
                    let z = {};
                    f.length && p && (z.query = f),
                      m !== void 0 && p && (z.body = m),
                      X(
                        k,
                        (R) => (
                          R.addEventProcessor(
                            (U) => (
                              Ye(U, {
                                handled: !1,
                                type: "auto.db.supabase.postgres",
                              }),
                              U
                            ),
                          ),
                          R.setContext("supabase", z),
                          R
                        ),
                      );
                  }
                  let P = { type: "supabase", category: `db.${a}`, message: T },
                    E = {};
                  return (
                    f.length && p && (E.query = f),
                    m !== void 0 && p && (E.body = m),
                    Object.keys(E).length && (P.data = E),
                    mt(P),
                    M
                  );
                },
                (M) => {
                  throw (A && (jn(A, 500), A.end()), M);
                },
              )
              .then(...o),
          )
        );
      },
    })),
    Ic(e.prototype.then));
}
function hA(e, t) {
  for (let n of Sh)
    bc(e.prototype[n]) ||
      ((e.prototype[n] = new Proxy(e.prototype[n], {
        apply(r, o, i) {
          let s = Reflect.apply(r, o, i),
            a = s.constructor;
          return (
            y && _.log(`Instrumenting ${n} operation's PostgRESTFilterBuilder`),
            _A(a, t),
            s
          );
        },
      })),
      Ic(e.prototype[n]));
}
var If = (e, t = {}) => {
    if (!e) {
      y &&
        _.warn(
          "Supabase integration was not installed because no Supabase client was provided.",
        );
      return;
    }
    let n = e.constructor === Function ? e : e.constructor;
    mA(n, t), dA(e);
  },
  gA = "Supabase",
  SA = (e, t) => ({
    setupOnce() {
      If(e, t);
    },
    name: gA,
  }),
  Th = (e) => SA(e.supabaseClient, { sendOperationData: e.sendOperationData });
var EA = 10,
  TA = "ZodErrors";
function yA(e) {
  return Je(e) && e.name === "ZodError" && Array.isArray(e.issues);
}
function IA(e) {
  return {
    ...e,
    path: "path" in e && Array.isArray(e.path) ? e.path.join(".") : void 0,
    keys: "keys" in e ? JSON.stringify(e.keys) : void 0,
    unionErrors: "unionErrors" in e ? JSON.stringify(e.unionErrors) : void 0,
  };
}
function bA(e) {
  return e.map((t) => (typeof t == "number" ? "<array>" : t)).join(".");
}
function AA(e) {
  let t = new Set();
  for (let r of e.issues) {
    let o = bA(r.path);
    o.length > 0 && t.add(o);
  }
  let n = Array.from(t);
  if (n.length === 0) {
    let r = "variable";
    if (e.issues.length > 0) {
      let o = e.issues[0];
      o !== void 0 &&
        "expected" in o &&
        typeof o.expected == "string" &&
        (r = o.expected);
    }
    return `Failed to validate ${r}`;
  }
  return `Failed to validate keys: ${sn(n.join(", "), 100)}`;
}
function RA(e, t = !1, n, r) {
  if (
    !n.exception?.values ||
    !r.originalException ||
    !yA(r.originalException) ||
    r.originalException.issues.length === 0
  )
    return n;
  try {
    let i = (
      t ? r.originalException.issues : r.originalException.issues.slice(0, e)
    ).map(IA);
    return (
      t &&
        (Array.isArray(r.attachments) || (r.attachments = []),
        r.attachments.push({
          filename: "zod_issues.json",
          data: JSON.stringify({ issues: i }),
        })),
      {
        ...n,
        exception: {
          ...n.exception,
          values: [
            { ...n.exception.values[0], value: AA(r.originalException) },
            ...n.exception.values.slice(1),
          ],
        },
        extra: { ...n.extra, "zoderror.issues": i.slice(0, e) },
      }
    );
  } catch (o) {
    return {
      ...n,
      extra: {
        ...n.extra,
        "zoderrors sentry integration parse error": {
          message:
            "an exception was thrown while processing ZodError within applyZodErrorsToEvent()",
          error:
            o instanceof Error
              ? `${o.name}: ${o.message}
${o.stack}`
              : "unknown",
        },
      },
    };
  }
}
var vA = (e = {}) => {
    let t = e.limit ?? EA;
    return {
      name: TA,
      processEvent(n, r) {
        return RA(t, e.saveZodIssuesAsAttachment, n, r);
      },
    };
  },
  yh = vA;
var bh = (e) => ({
  name: "ThirdPartyErrorsFilter",
  setup(t) {
    t.on("beforeEnvelope", (n) => {
      bt(n, (r, o) => {
        if (o === "event") {
          let i = Array.isArray(r) ? r[1] : void 0;
          i && (Tc(i), (r[1] = i));
        }
      });
    }),
      t.on("applyFrameMetadata", (n) => {
        if (n.type) return;
        let r = t.getOptions().stackParser;
        Ec(r, n);
      });
  },
  preprocessEvent(t) {
    e.ignoreSentryInternalFrames &&
      (v._sentryWrappedDepth ?? 0) > 0 &&
      (t.sdkProcessingMetadata = {
        ...t.sdkProcessingMetadata,
        insideSentryWrapped: !0,
      });
  },
  processEvent(t) {
    let n = e.ignoreSentryInternalFrames
        ? t.sdkProcessingMetadata?.insideSentryWrapped === !0 &&
          t.exception?.values?.length === 1
        : !1,
      r = CA(t, e.ignoreSentryInternalFrames, n);
    if (r) {
      let o =
        e.behaviour === "drop-error-if-contains-third-party-frames" ||
        e.behaviour === "apply-tag-if-contains-third-party-frames"
          ? "some"
          : "every";
      if (r[o]((s) => !s.some((a) => e.filterKeys.includes(a)))) {
        if (
          e.behaviour === "drop-error-if-contains-third-party-frames" ||
          e.behaviour ===
            "drop-error-if-exclusively-contains-third-party-frames"
        )
          return null;
        t.tags = { ...t.tags, third_party_code: !0 };
      }
    }
    return t;
  },
});
function NA(e, t, n) {
  if (t !== 0) return !1;
  if ((n && xA(e)) || e.function === "sentryWrapped") return !0;
  if (
    !e.context_line ||
    !e.filename ||
    !e.filename.includes("sentry") ||
    !e.filename.includes("helpers") ||
    !e.context_line.includes(wA)
  )
    return !1;
  if (e.pre_context) {
    let r = e.pre_context.length;
    for (let o = 0; o < r; o++) if (e.pre_context[o]?.includes(kA)) return !0;
  }
  return !1;
}
function CA(e, t, n) {
  let r = $r(e);
  if (r)
    return r
      .filter((o, i) =>
        !o.filename ||
        (o.lineno == null && o.colno == null && o.instruction_addr == null)
          ? !1
          : !t || !NA(o, i, !!n),
      )
      .map((o) =>
        o.module_metadata
          ? Object.keys(o.module_metadata)
              .filter((i) => i.startsWith(Ih))
              .map((i) => i.slice(Ih.length))
          : [],
      );
}
function xA(e) {
  return (
    !e.context_line && !e.pre_context && !!e.function && e.function.length <= 2
  );
}
var Ih = "_sentryBundlerPluginAppKey:",
  kA = "Attempt to invoke user-land function",
  wA = "fn.apply(this, wrappedArguments)";
var Ah = 100,
  Rh = 10,
  Ac = "flag.evaluation.";
function Pt(e) {
  if (e.type) return e;
  let n = C().getScopeData().contexts.flags,
    r = n ? n.values : [];
  return (
    r.length &&
      (e.contexts === void 0 && (e.contexts = {}),
      (e.contexts.flags = { values: [...r] })),
    e
  );
}
function At(e, t, n = Ah) {
  let r = C().getScopeData().contexts;
  r.flags || (r.flags = { values: [] });
  let o = r.flags.values;
  OA(o, e, t, n);
}
function OA(e, t, n, r) {
  if (typeof n != "boolean") return;
  if (e.length > r) {
    y &&
      _.error(
        `[Feature Flags] insertToFlagBuffer called on a buffer larger than maxSize=${r}`,
      );
    return;
  }
  let o = e.findIndex((i) => i.flag === t);
  o !== -1 && e.splice(o, 1),
    e.length === r && e.shift(),
    e.push({ flag: t, result: n });
}
function Rt(e, t, n = Rh) {
  if (typeof t != "boolean") return;
  let r = ne();
  if (!r) return;
  let o = L(r).data;
  if (`${Ac}${e}` in o) {
    r.setAttribute(`${Ac}${e}`, t);
    return;
  }
  Object.keys(o).filter((s) => s.startsWith(Ac)).length < n &&
    r.setAttribute(`${Ac}${e}`, t);
}
var vh = () => ({
  name: "FeatureFlags",
  processEvent(e, t, n) {
    return Pt(e);
  },
  addFeatureFlag(e, t) {
    At(e, t), Rt(e, t);
  },
});
var bf = ({ growthbookClass: e }) => ({
  name: "GrowthBook",
  setupOnce() {
    let t = e.prototype;
    typeof t.isOn == "function" && Ee(t, "isOn", Nh),
      typeof t.getFeatureValue == "function" && Ee(t, "getFeatureValue", Nh);
  },
  processEvent(t, n, r) {
    return Pt(t);
  },
});
function Nh(e) {
  return function (...t) {
    let n = t[0],
      r = e.apply(this, t);
    return (
      typeof n == "string" && typeof r == "boolean" && (At(n, r), Rt(n, r)), r
    );
  };
}
var MA = "ConversationId",
  LA = () => ({
    name: MA,
    setup(e) {
      e.on("spanStart", (t) => {
        let n = C().getScopeData(),
          r = te().getScopeData(),
          o = n.conversationId || r.conversationId;
        if (o) {
          let { op: i, data: s, description: a } = L(t);
          if (
            !i?.startsWith("gen_ai.") &&
            !s["ai.operationId"] &&
            !a?.startsWith("ai.")
          )
            return;
          t.setAttribute(Wa, o);
        }
      });
    },
  }),
  Af = LA;
function Rf(e, t, n, r, o) {
  if (!e.fetchData) return;
  let { method: i, url: s } = e.fetchData,
    a = xe() && t(s);
  if (e.endTimestamp) {
    let m = e.fetchData.__span;
    if (!m) return;
    let h = r[m];
    h && (a && (UA(h, e), PA(h, e, o)), delete r[m]);
    return;
  }
  let { spanOrigin: c = "auto.http.browser", propagateTraceparent: u = !1 } =
      typeof o == "object" ? o : { spanOrigin: o },
    f = I(),
    d = !!ne() || (!!f && Pe(f)),
    p = a && d ? Ve(FA(s, i, c)) : new It();
  if (
    (a && !d && f?.recordDroppedEvent("no_parent_span", "span"),
    (e.fetchData.__span = p.spanContext().spanId),
    (r[p.spanContext().spanId] = p),
    n(e.fetchData.url))
  ) {
    let m = e.args[0],
      h = { ...(e.args[1] || {}) },
      g = xh(m, h, xe() && d ? p : void 0, u);
    g && ((e.args[1] = h), (h.headers = g));
  }
  if (f) {
    let m = {
      input: e.args,
      response: e.response,
      startTimestamp: e.startTimestamp,
      endTimestamp: e.endTimestamp,
    };
    f.emit("beforeOutgoingRequestSpan", p, m);
  }
  return p;
}
function PA(e, t, n) {
  (typeof n == "object" && n !== null ? n.onRequestSpanEnd : void 0)?.(e, {
    headers: t.response?.headers,
    error: t.error,
  });
}
function xh(e, t, n, r) {
  let o = Zo({ span: n, propagateTraceparent: r }),
    i = o["sentry-trace"],
    s = o.baggage,
    a = o.traceparent;
  if (!i) return;
  let c = t.headers || (Yi(e) ? e.headers : void 0);
  if (c)
    if (DA(c)) {
      let u = new Headers(c);
      if (
        (u.get("sentry-trace") || u.set("sentry-trace", i),
        r && a && !u.get("traceparent") && u.set("traceparent", a),
        s)
      ) {
        let f = u.get("baggage");
        f ? Rc(f) || u.set("baggage", `${f},${s}`) : u.set("baggage", s);
      }
      return u;
    } else if (BA(c)) {
      let u = [...c];
      u.find((l) => l[0] === "sentry-trace") || u.push(["sentry-trace", i]),
        r &&
          a &&
          !u.find((l) => l[0] === "traceparent") &&
          u.push(["traceparent", a]);
      let f = c.find(
        (l) => l[0] === "baggage" && typeof l[1] == "string" && Rc(l[1]),
      );
      return s && !f && u.push(["baggage", s]), u;
    } else {
      let u = "sentry-trace" in c ? c["sentry-trace"] : void 0,
        f = "traceparent" in c ? c.traceparent : void 0,
        l = "baggage" in c ? c.baggage : void 0,
        d = l ? (Array.isArray(l) ? [...l] : [l]) : [],
        p = l && (Array.isArray(l) ? l.find((h) => Rc(h)) : Rc(l));
      s && !p && d.push(s);
      let m = Object.assign({}, c, {
        "sentry-trace": u ?? i,
        baggage: d.length > 0 ? d.join(",") : void 0,
      });
      return r && a && !f && (m.traceparent = a), m;
    }
  else return { ...o };
}
function UA(e, t) {
  if (t.response) {
    jn(e, t.response.status);
    let n = t.response?.headers?.get("content-length");
    if (n) {
      let r = parseInt(n);
      r > 0 && e.setAttribute("http.response_content_length", r);
    }
  } else t.error && e.setStatus({ code: 2, message: "internal_error" });
  e.end();
}
function Rc(e) {
  return typeof e != "string"
    ? !1
    : e.split(",").some((t) => t.trim().startsWith(Qi));
}
function DA(e) {
  return typeof Headers < "u" && on(e, Headers);
}
function BA(e) {
  return Array.isArray(e)
    ? e.every(
        (t) => Array.isArray(t) && t.length === 2 && typeof t[0] == "string",
      )
    : !1;
}
function FA(e, t, n) {
  if (e.startsWith("data:")) {
    let i = it(e);
    return { name: `${t} ${i}`, attributes: Ch(e, void 0, t, n) };
  }
  let r = Cn(e),
    o = r ? Jo(r) : e;
  return { name: `${t} ${o}`, attributes: Ch(e, r, t, n) };
}
function Ch(e, t, n, r) {
  let o = {
    url: it(e),
    type: "fetch",
    "http.method": n,
    [$]: r,
    [J]: "http.client",
  };
  return (
    t &&
      (ro(t) || ((o["http.url"] = it(t.href)), (o["server.address"] = t.host)),
      t.search && (o["http.query"] = t.search),
      t.hash && (o["http.fragment"] = t.hash)),
    o
  );
}
function ks(e, t = {}, n = C()) {
  let {
      message: r,
      name: o,
      email: i,
      url: s,
      source: a,
      associatedEventId: c,
      tags: u,
    } = e,
    f = {
      contexts: {
        feedback: {
          contact_email: i,
          name: o,
          message: r,
          url: s,
          source: a,
          associated_event_id: c,
        },
      },
      type: "feedback",
      level: "info",
      tags: u,
    },
    l = n?.getClient() || I();
  return l && l.emit("beforeSendFeedback", f, t), n.captureEvent(f, t);
}
var vf = {};
Jd(vf, {
  debug: () => GA,
  error: () => jA,
  fatal: () => zA,
  fmt: () => _f,
  info: () => $A,
  trace: () => HA,
  warn: () => WA,
});
function ei(e, t, n, r, o) {
  Er({ level: e, message: t, attributes: n, severityNumber: o }, r);
}
function HA(e, t, { scope: n } = {}) {
  ei("trace", e, t, n);
}
function GA(e, t, { scope: n } = {}) {
  ei("debug", e, t, n);
}
function $A(e, t, { scope: n } = {}) {
  ei("info", e, t, n);
}
function WA(e, t, { scope: n } = {}) {
  ei("warn", e, t, n);
}
function jA(e, t, { scope: n } = {}) {
  ei("error", e, t, n);
}
function zA(e, t, { scope: n } = {}) {
  ei("fatal", e, t, n);
}
function ti(e, t, n) {
  return "util" in v && typeof v.util.format == "function"
    ? v.util.format(...e)
    : qA(e, t, n);
}
function qA(e, t, n) {
  return e
    .map((r) => (Fe(r) ? String(r) : JSON.stringify(he(r, t, n))))
    .join(" ");
}
function vc(e) {
  return /%[sdifocO]/.test(e);
}
function Nc(e, t) {
  let n = {},
    r = new Array(t.length).fill("{}").join(" ");
  return (
    (n["sentry.message.template"] = `${e} ${r}`),
    t.forEach((o, i) => {
      n[`sentry.message.parameter.${i}`] = o;
    }),
    n
  );
}
var YA = "ConsoleLogs",
  kh = { [$]: "auto.log.console" },
  VA = (e = {}) => {
    let t = e.levels || cr;
    return {
      name: YA,
      setup(n) {
        let {
          enableLogs: r,
          normalizeDepth: o = 3,
          normalizeMaxBreadth: i = 1e3,
        } = n.getOptions();
        if (!r) {
          y &&
            _.warn(
              "`enableLogs` is not enabled, ConsoleLogs integration disabled",
            );
          return;
        }
        let s = oo(({ args: a, level: c }) => {
          if (I() !== n || !t.includes(c)) return;
          let u = a[0],
            f = a.slice(1);
          if (c === "assert") {
            if (!u) {
              let p =
                f.length > 0
                  ? `Assertion failed: ${ti(f, o, i)}`
                  : "Assertion failed";
              Er({ level: "error", message: p, attributes: kh });
            }
            return;
          }
          let l = c === "log",
            d = { ...kh };
          if (ve(u)) {
            Object.assign(d, he(u, o, i));
            let p = typeof a[1] == "string" ? 2 : 1;
            a.slice(p).forEach((h, g) => {
              d[`sentry.message.parameter.${g}`] = he(h, o, i);
            });
          } else if (f.length > 0 && typeof u == "string" && !vc(u)) {
            let m = Nc(u, f);
            for (let [h, g] of Object.entries(m))
              d[h] = h.startsWith("sentry.message.parameter.")
                ? he(g, o, i)
                : g;
          }
          Er({
            level: l ? "info" : c,
            message: ti(a, o, i),
            severityNumber: l ? 10 : void 0,
            attributes: d,
          });
        });
        n.registerCleanup(s);
      },
    };
  },
  wh = VA;
var io = {};
Jd(io, { count: () => KA, distribution: () => XA, gauge: () => JA });
function Nf(e, t, n, r) {
  tf(
    { type: e, name: t, value: n, unit: r?.unit, attributes: r?.attributes },
    { scope: r?.scope },
  );
}
function KA(e, t = 1, n) {
  Nf("counter", e, t, n);
}
function JA(e, t, n) {
  Nf("gauge", e, t, n);
}
function XA(e, t, n) {
  Nf("distribution", e, t, n);
}
var QA = ["trace", "debug", "info", "warn", "error", "fatal"];
function Oh(e = {}) {
  let t = new Set(e.levels ?? QA),
    n = e.client;
  return {
    log(r) {
      let { type: o, level: i, message: s, args: a, tag: c, date: u, ...f } = r,
        l = n || I();
      if (!l) return;
      let d = tR(o, i);
      if (!t.has(d)) return;
      let { normalizeDepth: p = 3, normalizeMaxBreadth: m = 1e3 } =
          l.getOptions(),
        h = {};
      for (let [S, T] of Object.entries(f)) h[S] = he(T, p, m);
      (h["sentry.origin"] = "auto.log.consola"),
        c && (h["consola.tag"] = c),
        o && (h["consola.type"] = o),
        i != null && typeof i == "number" && (h["consola.level"] = i);
      let g = rR(nR(a, p, m), p, m);
      g?.attributes && Object.assign(h, g.attributes),
        Er({
          level: d,
          message: g?.message || s || (a && ti(a, p, m)) || "",
          attributes: h,
        });
    },
  };
}
var ZA = {
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
  },
  eR = { 0: "fatal", 1: "warn", 2: "info", 3: "info", 4: "debug", 5: "trace" };
function tR(e, t) {
  if (e === "verbose") return "debug";
  if (e === "silent") return "trace";
  if (e) {
    let n = ZA[e];
    if (n) return n;
  }
  if (typeof t == "number") {
    let n = eR[t];
    if (n) return n;
  }
  return "info";
}
function nR(e, t, n) {
  if (!e?.length) return { message: "" };
  let r = ti(e, t, n),
    o = e[0];
  if (ve(o)) {
    let i = typeof e[1] == "string" ? 2 : 1,
      s = e.slice(i);
    return { message: r, attributes: o, messageParameters: s };
  } else {
    let i = e.slice(1),
      s = i.length > 0 && typeof o == "string" && !vc(o);
    return {
      message: r,
      messageTemplate: s ? o : void 0,
      messageParameters: s ? i : void 0,
    };
  }
}
function rR(e, t, n) {
  let {
      message: r,
      attributes: o,
      messageTemplate: i,
      messageParameters: s,
    } = e,
    a = {};
  if (i && s) {
    let c = Nc(i, s);
    for (let [u, f] of Object.entries(c))
      a[u] = u.startsWith("sentry.message.parameter.") ? he(f, t, n) : f;
  } else
    s &&
      s.length > 0 &&
      s.forEach((c, u) => {
        a[`sentry.message.parameter.${u}`] = he(c, t, n);
      });
  return { message: r, attributes: { ...he(o, t, n), ...a } };
}
var Mh = "gen_ai.prompt",
  xn = "gen_ai.system",
  Ne = "gen_ai.request.model",
  ni = "gen_ai.request.stream",
  Ir = "gen_ai.request.temperature",
  ri = "gen_ai.request.max_tokens",
  br = "gen_ai.request.frequency_penalty",
  oi = "gen_ai.request.presence_penalty",
  Ar = "gen_ai.request.top_p",
  Cc = "gen_ai.request.top_k",
  xc = "gen_ai.request.encoding_format",
  kc = "gen_ai.request.dimensions",
  kn = "gen_ai.response.finish_reasons",
  zt = "gen_ai.response.model",
  Rr = "gen_ai.response.id",
  Lh = "gen_ai.response.stop_reason",
  qt = "gen_ai.usage.input_tokens",
  Yt = "gen_ai.usage.output_tokens",
  Ut = "gen_ai.usage.total_tokens",
  qe = "gen_ai.operation.name",
  Vt = "sentry.sdk_meta.gen_ai.input.messages.original_length",
  _n = "gen_ai.input.messages";
var wn = "gen_ai.system_instructions",
  st = "gen_ai.response.text",
  On = "gen_ai.request.available_tools",
  Ph = "gen_ai.response.streaming",
  vt = "gen_ai.response.tool_calls",
  so = "gen_ai.agent.name",
  Uh = "gen_ai.pipeline.name",
  ws = "gen_ai.conversation.id",
  Dh = "gen_ai.usage.cache_creation_input_tokens",
  Bh = "gen_ai.usage.cache_read_input_tokens";
var Fh = "gen_ai.invoke_agent",
  ii = "gen_ai.embeddings.input",
  Cf = "gen_ai.embeddings",
  xf = "gen_ai.execute_tool",
  wc = "gen_ai.tool.name",
  Hh = "gen_ai.tool.call.id",
  Gh = "gen_ai.tool.type",
  Oc = "gen_ai.tool.input",
  Mc = "gen_ai.tool.output",
  $h = "gen_ai.tool.description";
function vr(e) {
  return !e || typeof e != "object"
    ? !1
    : iR(e) ||
        jh(e) ||
        oR(e) ||
        zh(e) ||
        qh(e) ||
        sR(e) ||
        aR(e) ||
        cR(e) ||
        uR(e) ||
        lR(e) ||
        fR(e) ||
        pR(e);
}
function oR(e) {
  return "image_url" in e
    ? typeof e.image_url == "string"
      ? e.image_url.startsWith("data:")
      : Wh(e)
    : !1;
}
function Wh(e) {
  return (
    "image_url" in e &&
    !!e.image_url &&
    typeof e.image_url == "object" &&
    "url" in e.image_url &&
    typeof e.image_url.url == "string" &&
    e.image_url.url.startsWith("data:")
  );
}
function iR(e) {
  return (
    "type" in e && typeof e.type == "string" && "source" in e && vr(e.source)
  );
}
function jh(e) {
  return (
    "inlineData" in e &&
    !!e.inlineData &&
    typeof e.inlineData == "object" &&
    "data" in e.inlineData &&
    typeof e.inlineData.data == "string"
  );
}
function zh(e) {
  return (
    "type" in e &&
    e.type === "input_audio" &&
    "input_audio" in e &&
    !!e.input_audio &&
    typeof e.input_audio == "object" &&
    "data" in e.input_audio &&
    typeof e.input_audio.data == "string"
  );
}
function qh(e) {
  return (
    "type" in e &&
    e.type === "file" &&
    "file" in e &&
    !!e.file &&
    typeof e.file == "object" &&
    "file_data" in e.file &&
    typeof e.file.file_data == "string"
  );
}
function sR(e) {
  return "media_type" in e && typeof e.media_type == "string" && "data" in e;
}
function aR(e) {
  return (
    "type" in e &&
    e.type === "file" &&
    "mediaType" in e &&
    typeof e.mediaType == "string" &&
    "data" in e &&
    typeof e.data == "string" &&
    !e.data.startsWith("http://") &&
    !e.data.startsWith("https://")
  );
}
function cR(e) {
  return (
    "type" in e &&
    e.type === "image" &&
    "image" in e &&
    typeof e.image == "string" &&
    !e.image.startsWith("http://") &&
    !e.image.startsWith("https://")
  );
}
function uR(e) {
  return "type" in e && (e.type === "blob" || e.type === "base64");
}
function lR(e) {
  return "b64_json" in e;
}
function fR(e) {
  return "type" in e && "result" in e && e.type === "image_generation";
}
function pR(e) {
  return "uri" in e && typeof e.uri == "string" && e.uri.startsWith("data:");
}
var Os = "[Blob substitute]",
  dR = ["image_url", "data", "content", "b64_json", "result", "uri", "image"];
function ao(e) {
  let t = { ...e };
  vr(t.source) && (t.source = ao(t.source)),
    jh(e) && (t.inlineData = { ...e.inlineData, data: Os }),
    Wh(e) && (t.image_url = { ...e.image_url, url: Os }),
    zh(e) && (t.input_audio = { ...e.input_audio, data: Os }),
    qh(e) && (t.file = { ...e.file, file_data: Os });
  for (let n of dR) typeof t[n] == "string" && (t[n] = Os);
  return t;
}
var Vh = 2e4,
  Lc = (e) => new TextEncoder().encode(e).length,
  wf = (e) => Lc(JSON.stringify(e));
function Pc(e, t) {
  if (Lc(e) <= t) return e;
  let n = 0,
    r = e.length,
    o = "";
  for (; n <= r; ) {
    let i = Math.floor((n + r) / 2),
      s = e.slice(0, i);
    Lc(s) <= t ? ((o = s), (n = i + 1)) : (r = i - 1);
  }
  return o;
}
function mR(e) {
  return typeof e == "string"
    ? e
    : "text" in e && typeof e.text == "string"
      ? e.text
      : "";
}
function Yh(e, t) {
  return typeof e == "string" ? t : { ...e, text: t };
}
function _R(e) {
  return (
    e !== null &&
    typeof e == "object" &&
    "content" in e &&
    typeof e.content == "string"
  );
}
function Kh(e) {
  return (
    e !== null &&
    typeof e == "object" &&
    "content" in e &&
    Array.isArray(e.content)
  );
}
function Jh(e) {
  return (
    e !== null &&
    typeof e == "object" &&
    "parts" in e &&
    Array.isArray(e.parts) &&
    e.parts.length > 0
  );
}
function hR(e, t) {
  let n = { ...e, content: "" },
    r = wf(n),
    o = t - r;
  if (o <= 0) return [];
  let i = Pc(e.content, o);
  return [{ ...e, content: i }];
}
function gR(e) {
  return "parts" in e && Array.isArray(e.parts)
    ? { key: "parts", items: e.parts }
    : "content" in e && Array.isArray(e.content)
      ? { key: "content", items: e.content }
      : { key: null, items: [] };
}
function SR(e, t) {
  let { key: n, items: r } = gR(e);
  if (n === null || r.length === 0) return [];
  let o = r.map((c) => Yh(c, "")),
    i = wf({ ...e, [n]: o }),
    s = t - i;
  if (s <= 0) return [];
  let a = [];
  for (let c of r) {
    let u = mR(c),
      f = Lc(u);
    if (f <= s) a.push(c), (s -= f);
    else if (a.length === 0) {
      let l = Pc(u, s);
      l && a.push(Yh(c, l));
      break;
    } else break;
  }
  return a.length <= 0 ? [] : [{ ...e, [n]: a }];
}
function ER(e, t) {
  if (!e) return [];
  if (typeof e == "string") {
    let n = Pc(e, t);
    return n ? [n] : [];
  }
  return typeof e != "object"
    ? []
    : _R(e)
      ? hR(e, t)
      : Kh(e) || Jh(e)
        ? SR(e, t)
        : [];
}
function kf(e) {
  return e.map((n) => {
    let r;
    return (
      n &&
        typeof n == "object" &&
        (Kh(n)
          ? (r = { ...n, content: kf(n.content) })
          : "content" in n &&
            vr(n.content) &&
            (r = { ...n, content: ao(n.content) }),
        Jh(n) && (r = { ...(r ?? n), parts: kf(n.parts) }),
        vr(r) ? (r = ao(r)) : vr(n) && (r = ao(n))),
      r ?? n
    );
  });
}
function TR(e, t) {
  if (!Array.isArray(e) || e.length === 0) return e;
  let n = t - 2,
    r = e[e.length - 1],
    o = kf([r]),
    i = o[0];
  return wf(i) <= n ? o : ER(i, n);
}
function Xh(e) {
  return TR(e, Vh);
}
function Qh(e) {
  return Pc(e, Vh);
}
function Dt(e) {
  let t = I()?.getDataCollectionOptions().genAI;
  return {
    ...e,
    recordInputs: e?.recordInputs ?? t?.inputs ?? !1,
    recordOutputs: e?.recordOutputs ?? t?.outputs ?? !1,
  };
}
function Nt(e) {
  if (e !== void 0) return e;
  let t = I();
  return t ? !Pe(t) && !t.getOptions().streamGenAiSpans : !0;
}
function si(e, t) {
  return e ? `${e}.${t}` : t;
}
function Zh(e, t, n, r, o) {
  if (
    (t !== void 0 && e.setAttributes({ [qt]: t }),
    n !== void 0 && e.setAttributes({ [Yt]: n }),
    t !== void 0 || n !== void 0 || r !== void 0 || o !== void 0)
  ) {
    let i = (t ?? 0) + (n ?? 0) + (r ?? 0) + (o ?? 0);
    e.setAttributes({ [Ut]: i });
  }
}
function co(e, t, n) {
  if (!e.isRecording()) return;
  let r = { [Ph]: !0 };
  t.responseId && (r[Rr] = t.responseId),
    t.responseModel && (r[zt] = t.responseModel),
    t.promptTokens !== void 0 && (r[qt] = t.promptTokens),
    t.completionTokens !== void 0 && (r[Yt] = t.completionTokens),
    t.totalTokens !== void 0
      ? (r[Ut] = t.totalTokens)
      : (t.promptTokens !== void 0 ||
          t.completionTokens !== void 0 ||
          t.cacheCreationInputTokens !== void 0 ||
          t.cacheReadInputTokens !== void 0) &&
        (r[Ut] =
          (t.promptTokens ?? 0) +
          (t.completionTokens ?? 0) +
          (t.cacheCreationInputTokens ?? 0) +
          (t.cacheReadInputTokens ?? 0)),
    t.finishReasons.length && (r[kn] = JSON.stringify(t.finishReasons)),
    n && t.responseTexts.length && (r[st] = t.responseTexts.join("")),
    n && t.toolCalls.length && (r[vt] = JSON.stringify(t.toolCalls)),
    e.setAttributes(r),
    e.end();
}
function hn(e) {
  return typeof e == "string" ? e : JSON.stringify(e);
}
function gn(e) {
  if (typeof e == "string") return Qh(e);
  if (Array.isArray(e)) {
    let t = Xh(e);
    return JSON.stringify(t);
  }
  return JSON.stringify(e);
}
function Mn(e) {
  if (!Array.isArray(e))
    return { systemInstructions: void 0, filteredMessages: e };
  let t = e.findIndex(
    (s) => s && typeof s == "object" && "role" in s && s.role === "system",
  );
  if (t === -1) return { systemInstructions: void 0, filteredMessages: e };
  let n = e[t],
    r =
      typeof n.content == "string"
        ? n.content
        : n.content !== void 0
          ? JSON.stringify(n.content)
          : void 0;
  if (!r) return { systemInstructions: void 0, filteredMessages: e };
  let o = JSON.stringify([{ type: "text", content: r }]),
    i = [...e.slice(0, t), ...e.slice(t + 1)];
  return { systemInstructions: o, filteredMessages: i };
}
async function yR(e, t, n) {
  let r = e.catch((s) => {
      throw (X(s, { mechanism: { handled: !1, type: n } }), s);
    }),
    o = await t,
    i = await r;
  return i && typeof i == "object" && "data" in i ? { ...i, data: o } : o;
}
function ai(e, t, n) {
  return lt(e)
    ? new Proxy(e, {
        get(r, o) {
          let s = o in Promise.prototype || o === Symbol.toStringTag ? t : r,
            a = Reflect.get(s, o);
          return o === "withResponse" && typeof a == "function"
            ? function () {
                let u = a.call(r);
                return yR(u, t, n);
              }
            : typeof a == "function"
              ? a.bind(s)
              : a;
        },
      })
    : t;
}
var eg = {
    "responses.create": { operation: "chat" },
    "chat.completions.create": { operation: "chat" },
    "embeddings.create": { operation: "embeddings" },
    "conversations.create": { operation: "chat" },
  },
  IR = [
    "response.output_item.added",
    "response.function_call_arguments.delta",
    "response.function_call_arguments.done",
    "response.output_item.done",
  ],
  tg = [
    "response.created",
    "response.in_progress",
    "response.failed",
    "response.completed",
    "response.incomplete",
    "response.queued",
    "response.output_text.delta",
    ...IR,
  ];
function ng(e) {
  return (
    e !== null &&
    typeof e == "object" &&
    "type" in e &&
    typeof e.type == "string" &&
    e.type.startsWith("response.")
  );
}
function rg(e) {
  return (
    e !== null &&
    typeof e == "object" &&
    "object" in e &&
    e.object === "chat.completion.chunk"
  );
}
function og(e, t, n) {
  if (!t || typeof t != "object") return;
  let r = t,
    o = {};
  if (
    (typeof r.id == "string" && (o[Rr] = r.id),
    typeof r.model == "string" && (o[zt] = r.model),
    r.object === "conversation" && typeof r.id == "string" && (o[ws] = r.id),
    r.usage && typeof r.usage == "object")
  ) {
    let i = r.usage,
      s = i.prompt_tokens ?? i.input_tokens;
    typeof s == "number" && (o[qt] = s);
    let a = i.completion_tokens ?? i.output_tokens;
    typeof a == "number" && (o[Yt] = a),
      typeof i.total_tokens == "number" && (o[Ut] = i.total_tokens);
  }
  if (Array.isArray(r.choices)) {
    let i = r.choices,
      s = i.map((a) => a.finish_reason).filter((a) => typeof a == "string");
    if ((s.length > 0 && (o[kn] = JSON.stringify(s)), n)) {
      let a = i.map((u) => u.message?.content || "");
      o[st] = JSON.stringify(a);
      let c = i
        .map((u) => u.message?.tool_calls)
        .filter((u) => Array.isArray(u) && u.length > 0)
        .flat();
      c.length > 0 && (o[vt] = JSON.stringify(c));
    }
  }
  if (
    (typeof r.status == "string" &&
      (o[kn] || (o[kn] = JSON.stringify([r.status]))),
    n &&
      (typeof r.output_text == "string" && !o[st] && (o[st] = r.output_text),
      Array.isArray(r.output) && r.output.length > 0 && !o[vt]))
  ) {
    let i = r.output.filter((s) => s?.type === "function_call");
    i.length > 0 && (o[vt] = JSON.stringify(i));
  }
  e.setAttributes(o);
}
function bR(e) {
  if ("conversation" in e && typeof e.conversation == "string")
    return e.conversation;
  if ("previous_response_id" in e && typeof e.previous_response_id == "string")
    return e.previous_response_id;
}
function ig(e) {
  let t = { [Ne]: e.model ?? "unknown" };
  "temperature" in e && (t[Ir] = e.temperature),
    "top_p" in e && (t[Ar] = e.top_p),
    "frequency_penalty" in e && (t[br] = e.frequency_penalty),
    "presence_penalty" in e && (t[oi] = e.presence_penalty),
    "stream" in e && (t[ni] = e.stream),
    "encoding_format" in e && (t[xc] = e.encoding_format),
    "dimensions" in e && (t[kc] = e.dimensions);
  let n = bR(e);
  return n && (t[ws] = n), t;
}
function AR(e, t) {
  for (let n of e) {
    let r = n.index;
    if (!(r === void 0 || !n.function))
      if (!(r in t.chatCompletionToolCalls))
        t.chatCompletionToolCalls[r] = {
          ...n,
          function: {
            name: n.function.name,
            arguments: n.function.arguments || "",
          },
        };
      else {
        let o = t.chatCompletionToolCalls[r];
        n.function.arguments &&
          o?.function &&
          (o.function.arguments += n.function.arguments);
      }
  }
}
function RR(e, t, n) {
  (t.responseId = e.id ?? t.responseId),
    (t.responseModel = e.model ?? t.responseModel),
    e.usage &&
      ((t.promptTokens = e.usage.prompt_tokens),
      (t.completionTokens = e.usage.completion_tokens),
      (t.totalTokens = e.usage.total_tokens));
  for (let r of e.choices ?? [])
    n &&
      (r.delta?.content && t.responseTexts.push(r.delta.content),
      r.delta?.tool_calls && AR(r.delta.tool_calls, t)),
      r.finish_reason && t.finishReasons.push(r.finish_reason);
}
function vR(e, t, n, r) {
  if (!(e && typeof e == "object")) {
    t.eventTypes.push("unknown:non-object");
    return;
  }
  if (e instanceof Error) {
    r.setStatus({ code: 2, message: "internal_error" }),
      X(e, {
        mechanism: { handled: !1, type: "auto.ai.openai.stream-response" },
      });
    return;
  }
  if (!("type" in e)) return;
  let o = e;
  if (!tg.includes(o.type)) {
    t.eventTypes.push(o.type);
    return;
  }
  if (
    n &&
    (o.type === "response.output_item.done" &&
      "item" in o &&
      t.responsesApiToolCalls.push(o.item),
    o.type === "response.output_text.delta" && "delta" in o && o.delta)
  ) {
    t.responseTexts.push(o.delta);
    return;
  }
  if ("response" in o) {
    let { response: i } = o;
    (t.responseId = i.id ?? t.responseId),
      (t.responseModel = i.model ?? t.responseModel),
      i.usage &&
        ((t.promptTokens = i.usage.input_tokens),
        (t.completionTokens = i.usage.output_tokens),
        (t.totalTokens = i.usage.total_tokens)),
      i.status && t.finishReasons.push(i.status),
      n && i.output_text && t.responseTexts.push(i.output_text);
  }
}
async function* sg(e, t, n) {
  let r = {
    eventTypes: [],
    responseTexts: [],
    finishReasons: [],
    responseId: "",
    responseModel: "",
    promptTokens: void 0,
    completionTokens: void 0,
    totalTokens: void 0,
    chatCompletionToolCalls: {},
    responsesApiToolCalls: [],
  };
  try {
    for await (let o of e)
      rg(o) ? RR(o, r, n) : ng(o) && vR(o, r, n, t), yield o;
  } finally {
    let o = [
      ...Object.values(r.chatCompletionToolCalls),
      ...r.responsesApiToolCalls,
    ];
    co(t, { ...r, toolCalls: o }, n);
  }
}
function NR(e) {
  let t = Array.isArray(e.tools) ? e.tools : [],
    r =
      e.web_search_options && typeof e.web_search_options == "object"
        ? [{ type: "web_search_options", ...e.web_search_options }]
        : [],
    o = [...t, ...r];
  if (o.length !== 0)
    try {
      return JSON.stringify(o);
    } catch (i) {
      y && _.error("Failed to serialize OpenAI tools:", i);
      return;
    }
}
function CR(e, t) {
  let n = { [xn]: "openai", [qe]: t, [$]: "auto.ai.openai" };
  if (e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    let r = e[0],
      o = NR(r);
    o && (n[On] = o), Object.assign(n, ig(r));
  } else n[Ne] = "unknown";
  return n;
}
function ag(e, t, n, r) {
  if (n === "embeddings" && "input" in t) {
    let a = t.input;
    if (
      a == null ||
      (typeof a == "string" && a.length === 0) ||
      (Array.isArray(a) && a.length === 0)
    )
      return;
    e.setAttribute(ii, typeof a == "string" ? a : JSON.stringify(a));
    return;
  }
  let o = "input" in t ? t.input : "messages" in t ? t.messages : void 0;
  if (!o || (Array.isArray(o) && o.length === 0)) return;
  let { systemInstructions: i, filteredMessages: s } = Mn(o);
  i && e.setAttribute(wn, i),
    e.setAttribute(_n, r ? gn(s) : hn(s)),
    Array.isArray(s) ? e.setAttribute(Vt, s.length) : e.setAttribute(Vt, 1);
}
function xR(e, t, n, r, o) {
  return function (...s) {
    let a = n.operation || "unknown",
      c = CR(s, a),
      u = c[Ne] || "unknown",
      f = s[0],
      l = f && typeof f == "object" && f.stream === !0,
      d = { name: `${a} ${u}`, op: `gen_ai.${a}`, attributes: c };
    if (l) {
      let h,
        g = dt(
          d,
          (S) => (
            (h = e.apply(r, s)),
            o.recordInputs && f && ag(S, f, a, Nt(o.enableTruncation)),
            (async () => {
              try {
                let T = await h;
                return sg(T, S, o.recordOutputs ?? !1);
              } catch (T) {
                throw (
                  (S.setStatus({ code: 2, message: "internal_error" }),
                  X(T, {
                    mechanism: {
                      handled: !1,
                      type: "auto.ai.openai.stream",
                      data: { function: t },
                    },
                  }),
                  S.end(),
                  T)
                );
              }
            })()
          ),
        );
      return ai(h, g, "auto.ai.openai");
    }
    let p,
      m = ze(
        d,
        (h) => (
          (p = e.apply(r, s)),
          o.recordInputs && f && ag(h, f, a, Nt(o.enableTruncation)),
          p.then(
            (g) => (og(h, g, o.recordOutputs), g),
            (g) => {
              throw (
                (X(g, {
                  mechanism: {
                    handled: !1,
                    type: "auto.ai.openai",
                    data: { function: t },
                  },
                }),
                g)
              );
            },
          )
        ),
      );
    return ai(p, m, "auto.ai.openai");
  };
}
function cg(e, t = "", n) {
  return new Proxy(e, {
    get(r, o) {
      let i = r[o],
        s = si(t, String(o)),
        a = eg[s];
      return typeof i == "function" && a
        ? xR(i, s, a, r, n)
        : typeof i == "function"
          ? i.bind(r)
          : i && typeof i == "object"
            ? cg(i, s, n)
            : i;
    },
  });
}
function ug(e, t) {
  return cg(e, "", Dt(t));
}
var lg = {
  "messages.create": { operation: "chat" },
  "messages.stream": { operation: "chat", streaming: !0 },
  "messages.countTokens": { operation: "chat" },
  "models.get": { operation: "models" },
  "completions.create": { operation: "chat" },
  "models.retrieve": { operation: "models" },
  "beta.messages.create": { operation: "chat" },
};
function fg(e, t, n) {
  if (Array.isArray(t) && t.length === 0) return;
  let { systemInstructions: r, filteredMessages: o } = Mn(t);
  r && e.setAttributes({ [wn]: r });
  let i = Array.isArray(o) ? o.length : 1;
  e.setAttributes({ [_n]: n ? gn(o) : hn(o), [Vt]: i });
}
var kR = {
  invalid_request_error: "invalid_argument",
  authentication_error: "unauthenticated",
  permission_error: "permission_denied",
  not_found_error: "not_found",
  request_too_large: "failed_precondition",
  rate_limit_error: "resource_exhausted",
  api_error: "internal_error",
  overloaded_error: "unavailable",
};
function Of(e) {
  return (e && kR[e]) || "internal_error";
}
function pg(e, t) {
  t.error &&
    (e.setStatus({ code: 2, message: Of(t.error.type) }),
    X(t.error, {
      mechanism: { handled: !1, type: "auto.ai.anthropic.anthropic_error" },
    }));
}
function dg(e) {
  let { system: t, messages: n, input: r } = e,
    o = typeof t == "string" ? [{ role: "system", content: e.system }] : [],
    i = Array.isArray(r) ? r : r != null ? [r] : void 0,
    s = Array.isArray(n) ? n : n != null ? [n] : [],
    a = i ?? s;
  return [...o, ...a];
}
function wR(e, t) {
  return "type" in e && typeof e.type == "string" && e.type === "error"
    ? (t.setStatus({ code: 2, message: Of(e.error?.type) }),
      X(e.error, {
        mechanism: { handled: !1, type: "auto.ai.anthropic.anthropic_error" },
      }),
      !0)
    : !1;
}
function OR(e, t) {
  if (
    (e.type === "message_delta" &&
      e.usage &&
      "output_tokens" in e.usage &&
      typeof e.usage.output_tokens == "number" &&
      (t.completionTokens = e.usage.output_tokens),
    e.message)
  ) {
    let n = e.message;
    n.id && (t.responseId = n.id),
      n.model && (t.responseModel = n.model),
      n.stop_reason && t.finishReasons.push(n.stop_reason),
      n.usage &&
        (typeof n.usage.input_tokens == "number" &&
          (t.promptTokens = n.usage.input_tokens),
        typeof n.usage.cache_creation_input_tokens == "number" &&
          (t.cacheCreationInputTokens = n.usage.cache_creation_input_tokens),
        typeof n.usage.cache_read_input_tokens == "number" &&
          (t.cacheReadInputTokens = n.usage.cache_read_input_tokens));
  }
}
function MR(e, t) {
  e.type !== "content_block_start" ||
    typeof e.index != "number" ||
    !e.content_block ||
    ((e.content_block.type === "tool_use" ||
      e.content_block.type === "server_tool_use") &&
      (t.activeToolBlocks[e.index] = {
        id: e.content_block.id,
        name: e.content_block.name,
        inputJsonParts: [],
      }));
}
function LR(e, t, n) {
  if (!(e.type !== "content_block_delta" || !e.delta)) {
    if (
      typeof e.index == "number" &&
      "partial_json" in e.delta &&
      typeof e.delta.partial_json == "string"
    ) {
      let r = t.activeToolBlocks[e.index];
      r && r.inputJsonParts.push(e.delta.partial_json);
    }
    n && typeof e.delta.text == "string" && t.responseTexts.push(e.delta.text);
  }
}
function PR(e, t) {
  if (e.type !== "content_block_stop" || typeof e.index != "number") return;
  let n = t.activeToolBlocks[e.index];
  if (!n) return;
  let r = n.inputJsonParts.join(""),
    o;
  try {
    o = r ? JSON.parse(r) : {};
  } catch {
    o = { __unparsed: r };
  }
  t.toolCalls.push({ type: "tool_use", id: n.id, name: n.name, input: o }),
    delete t.activeToolBlocks[e.index];
}
function mg(e, t, n, r) {
  !(e && typeof e == "object") ||
    wR(e, r) ||
    (OR(e, t), MR(e, t), LR(e, t, n), PR(e, t));
}
async function* _g(e, t, n) {
  let r = {
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
    for await (let o of e) mg(o, r, n, t), yield o;
  } finally {
    co(t, r, n);
  }
}
function hg(e, t, n) {
  let r = {
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
  return (
    e.on("streamEvent", (o) => {
      mg(o, r, n, t);
    }),
    e.on("message", () => {
      co(t, r, n);
    }),
    e.on("error", (o) => {
      X(o, {
        mechanism: { handled: !1, type: "auto.ai.anthropic.stream_error" },
      }),
        t.isRecording() &&
          (t.setStatus({ code: 2, message: "internal_error" }), t.end());
    }),
    e
  );
}
function UR(e, t, n) {
  let r = { [xn]: "anthropic", [qe]: n, [$]: "auto.ai.anthropic" };
  if (e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    let o = e[0];
    o.tools && Array.isArray(o.tools) && (r[On] = JSON.stringify(o.tools)),
      (r[Ne] = o.model ?? "unknown"),
      "temperature" in o && (r[Ir] = o.temperature),
      "top_p" in o && (r[Ar] = o.top_p),
      "stream" in o && (r[ni] = o.stream),
      "top_k" in o && (r[Cc] = o.top_k),
      "frequency_penalty" in o && (r[br] = o.frequency_penalty),
      "max_tokens" in o && (r[ri] = o.max_tokens);
  } else
    t === "models.retrieve" || t === "models.get"
      ? (r[Ne] = e[0])
      : (r[Ne] = "unknown");
  return r;
}
function Mf(e, t, n) {
  let r = dg(t);
  fg(e, r, n),
    "prompt" in t && e.setAttributes({ [Mh]: JSON.stringify(t.prompt) });
}
function DR(e, t) {
  if ("content" in t && Array.isArray(t.content)) {
    e.setAttributes({
      [st]: t.content
        .map((r) => r.text)
        .filter((r) => !!r)
        .join(""),
    });
    let n = [];
    for (let r of t.content)
      (r.type === "tool_use" || r.type === "server_tool_use") && n.push(r);
    n.length > 0 && e.setAttributes({ [vt]: JSON.stringify(n) });
  }
  "completion" in t && e.setAttributes({ [st]: t.completion }),
    "input_tokens" in t &&
      e.setAttributes({ [st]: JSON.stringify(t.input_tokens) });
}
function BR(e, t) {
  "id" in t &&
    "model" in t &&
    (e.setAttributes({ [Rr]: t.id, [zt]: t.model }),
    "usage" in t &&
      t.usage &&
      Zh(
        e,
        t.usage.input_tokens,
        t.usage.output_tokens,
        t.usage.cache_creation_input_tokens,
        t.usage.cache_read_input_tokens,
      ));
}
function FR(e, t, n) {
  if (!(!t || typeof t != "object")) {
    if ("type" in t && t.type === "error") {
      pg(e, t);
      return;
    }
    n && DR(e, t), BR(e, t);
  }
}
function gg(e, t, n) {
  throw (
    (X(e, {
      mechanism: {
        handled: !1,
        type: "auto.ai.anthropic",
        data: { function: n },
      },
    }),
    t.isRecording() &&
      (t.setStatus({ code: 2, message: "internal_error" }), t.end()),
    e)
  );
}
function HR(e, t, n, r, o, i, s, a, c, u, f) {
  let l = o[Ne] ?? "unknown",
    d = { name: `${i} ${l}`, op: `gen_ai.${i}`, attributes: o };
  if (u && !f) {
    let p,
      m = dt(
        d,
        (h) => (
          (p = e.apply(n, r)),
          c.recordInputs && a && Mf(h, a, Nt(c.enableTruncation)),
          (async () => {
            try {
              let g = await p;
              return _g(g, h, c.recordOutputs ?? !1);
            } catch (g) {
              return gg(g, h, s);
            }
          })()
        ),
      );
    return ai(p, m, "auto.ai.anthropic");
  } else
    return dt(d, (p) => {
      try {
        c.recordInputs && a && Mf(p, a, Nt(c.enableTruncation));
        let m = t.apply(n, r);
        return hg(m, p, c.recordOutputs ?? !1);
      } catch (m) {
        return gg(m, p, s);
      }
    });
}
function GR(e, t, n, r, o) {
  return new Proxy(e, {
    apply(i, s, a) {
      let c = n.operation || "unknown",
        u = UR(a, t, c),
        f = u[Ne] ?? "unknown",
        l = typeof a[0] == "object" ? a[0] : void 0,
        d = !!l?.stream,
        p = n.streaming === !0;
      if (d || p) return HR(e, i, r, a, u, c, t, l, o, d, p);
      let m,
        h = ze(
          { name: `${c} ${f}`, op: `gen_ai.${c}`, attributes: u },
          (g) => (
            (m = i.apply(r, a)),
            o.recordInputs && l && Mf(g, l, Nt(o.enableTruncation)),
            m.then(
              (S) => (FR(g, S, o.recordOutputs), S),
              (S) => {
                throw (
                  (X(S, {
                    mechanism: {
                      handled: !1,
                      type: "auto.ai.anthropic",
                      data: { function: t },
                    },
                  }),
                  S)
                );
              },
            )
          ),
        );
      return ai(m, h, "auto.ai.anthropic");
    },
  });
}
function Sg(e, t = "", n) {
  return new Proxy(e, {
    get(r, o) {
      let i = r[o],
        s = si(t, String(o)),
        a = lg[s];
      return typeof i == "function" && a
        ? GR(i, s, a, r, n)
        : typeof i == "function"
          ? i.bind(r)
          : i && typeof i == "object"
            ? Sg(i, s, n)
            : i;
    },
  });
}
function Eg(e, t) {
  return Sg(e, "", Dt(t));
}
var Tg = {
    "models.generateContent": { operation: "generate_content" },
    "models.generateContentStream": {
      operation: "generate_content",
      streaming: !0,
    },
    "models.embedContent": { operation: "embeddings" },
    "chats.create": { proxyResultPath: "chat" },
    "chat.sendMessage": { operation: "chat" },
    "chat.sendMessageStream": { operation: "chat", streaming: !0 },
  },
  yg = "google_genai";
function $R(e, t) {
  let n = e?.promptFeedback;
  if (n?.blockReason) {
    let r = n.blockReasonMessage ?? n.blockReason;
    return (
      t.setStatus({ code: 2, message: "internal_error" }),
      X(`Content blocked: ${r}`, {
        mechanism: { handled: !1, type: "auto.ai.google_genai" },
      }),
      !0
    );
  }
  return !1;
}
function WR(e, t) {
  typeof e.responseId == "string" && (t.responseId = e.responseId),
    typeof e.modelVersion == "string" && (t.responseModel = e.modelVersion);
  let n = e.usageMetadata;
  n &&
    (typeof n.promptTokenCount == "number" &&
      (t.promptTokens = n.promptTokenCount),
    typeof n.candidatesTokenCount == "number" &&
      (t.completionTokens = n.candidatesTokenCount),
    typeof n.totalTokenCount == "number" &&
      (t.totalTokens = n.totalTokenCount));
}
function jR(e, t, n) {
  Array.isArray(e.functionCalls) && t.toolCalls.push(...e.functionCalls);
  for (let r of e.candidates ?? []) {
    r?.finishReason &&
      !t.finishReasons.includes(r.finishReason) &&
      t.finishReasons.push(r.finishReason);
    for (let o of r?.content?.parts ?? [])
      n && o.text && t.responseTexts.push(o.text),
        o.functionCall &&
          t.toolCalls.push({
            type: "function",
            id: o.functionCall.id,
            name: o.functionCall.name,
            arguments: o.functionCall.args,
          });
  }
}
function zR(e, t, n, r) {
  !e || $R(e, r) || (WR(e, t), jR(e, t, n));
}
async function* Ig(e, t, n) {
  let r = { responseTexts: [], finishReasons: [], toolCalls: [] };
  try {
    for await (let o of e) zR(o, r, n, t), yield o;
  } finally {
    co(t, r, n);
  }
}
function ci(e, t = "user") {
  return typeof e == "string"
    ? [{ role: t, content: e }]
    : Array.isArray(e)
      ? e.flatMap((n) => ci(n, t))
      : typeof e != "object" || !e
        ? []
        : "role" in e && typeof e.role == "string"
          ? [e]
          : "parts" in e
            ? [{ ...e, role: t }]
            : [{ role: t, content: e }];
}
function bg(e, t) {
  if ("model" in e && typeof e.model == "string") return e.model;
  if (t && typeof t == "object") {
    let n = t;
    if ("model" in n && typeof n.model == "string") return n.model;
    if ("modelVersion" in n && typeof n.modelVersion == "string")
      return n.modelVersion;
  }
  return "unknown";
}
function qR(e) {
  let t = {};
  return (
    "temperature" in e &&
      typeof e.temperature == "number" &&
      (t[Ir] = e.temperature),
    "topP" in e && typeof e.topP == "number" && (t[Ar] = e.topP),
    "topK" in e && typeof e.topK == "number" && (t[Cc] = e.topK),
    "maxOutputTokens" in e &&
      typeof e.maxOutputTokens == "number" &&
      (t[ri] = e.maxOutputTokens),
    "frequencyPenalty" in e &&
      typeof e.frequencyPenalty == "number" &&
      (t[br] = e.frequencyPenalty),
    "presencePenalty" in e &&
      typeof e.presencePenalty == "number" &&
      (t[oi] = e.presencePenalty),
    t
  );
}
function YR(e, t, n) {
  let r = { [xn]: yg, [qe]: e, [$]: "auto.ai.google_genai" };
  if (t) {
    if (
      ((r[Ne] = bg(t, n)),
      "config" in t && typeof t.config == "object" && t.config)
    ) {
      let o = t.config;
      if ((Object.assign(r, qR(o)), "tools" in o && Array.isArray(o.tools))) {
        let i = o.tools.flatMap((s) => s.functionDeclarations);
        r[On] = JSON.stringify(i);
      }
    }
  } else r[Ne] = bg({}, n);
  return r;
}
function Ag(e, t, n, r) {
  if (n) {
    let i = t.contents;
    i != null &&
      e.setAttribute(ii, typeof i == "string" ? i : JSON.stringify(i));
    return;
  }
  let o = [];
  if (
    ("config" in t &&
      t.config &&
      typeof t.config == "object" &&
      "systemInstruction" in t.config &&
      t.config.systemInstruction &&
      o.push(...ci(t.config.systemInstruction, "system")),
    "history" in t && o.push(...ci(t.history, "user")),
    "contents" in t && o.push(...ci(t.contents, "user")),
    "message" in t && o.push(...ci(t.message, "user")),
    Array.isArray(o) && o.length)
  ) {
    let { systemInstructions: i, filteredMessages: s } = Mn(o);
    i && e.setAttribute(wn, i);
    let a = Array.isArray(s) ? s.length : 0;
    e.setAttributes({ [Vt]: a, [_n]: r ? gn(s) : hn(s) });
  }
}
function VR(e, t, n) {
  if (!(!t || typeof t != "object")) {
    if (
      (t.modelVersion && e.setAttribute(zt, t.modelVersion),
      t.usageMetadata && typeof t.usageMetadata == "object")
    ) {
      let r = t.usageMetadata;
      typeof r.promptTokenCount == "number" &&
        e.setAttributes({ [qt]: r.promptTokenCount }),
        typeof r.candidatesTokenCount == "number" &&
          e.setAttributes({ [Yt]: r.candidatesTokenCount }),
        typeof r.totalTokenCount == "number" &&
          e.setAttributes({ [Ut]: r.totalTokenCount });
    }
    if (n && Array.isArray(t.candidates) && t.candidates.length > 0) {
      let r = t.candidates
        .map((o) =>
          o.content?.parts && Array.isArray(o.content.parts)
            ? o.content.parts
                .map((i) => (typeof i.text == "string" ? i.text : ""))
                .filter((i) => i.length > 0)
                .join("")
            : "",
        )
        .filter((o) => o.length > 0);
      r.length > 0 && e.setAttributes({ [st]: r.join("") });
    }
    if (n && t.functionCalls) {
      let r = t.functionCalls;
      Array.isArray(r) &&
        r.length > 0 &&
        e.setAttributes({ [vt]: JSON.stringify(r) });
    }
  }
}
function KR(e, t, n, r, o) {
  let i = n.operation === "embeddings";
  return new Proxy(e, {
    apply(s, a, c) {
      let u = n.operation || "unknown",
        f = c[0],
        l = YR(u, f, r),
        d = l[Ne] ?? "unknown";
      return n.streaming
        ? dt(
            { name: `${u} ${d}`, op: `gen_ai.${u}`, attributes: l },
            async (p) => {
              try {
                o.recordInputs && f && Ag(p, f, i, Nt(o.enableTruncation));
                let m = await s.apply(r, c);
                return Ig(m, p, !!o.recordOutputs);
              } catch (m) {
                throw (
                  (p.setStatus({ code: 2, message: "internal_error" }),
                  X(m, {
                    mechanism: {
                      handled: !1,
                      type: "auto.ai.google_genai",
                      data: { function: t },
                    },
                  }),
                  p.end(),
                  m)
                );
              }
            },
          )
        : ze(
            { name: `${u} ${d}`, op: `gen_ai.${u}`, attributes: l },
            (p) => (
              o.recordInputs && f && Ag(p, f, i, Nt(o.enableTruncation)),
              fs(
                () => s.apply(r, c),
                (m) => {
                  X(m, {
                    mechanism: {
                      handled: !1,
                      type: "auto.ai.google_genai",
                      data: { function: t },
                    },
                  });
                },
                () => {},
                (m) => {
                  i || VR(p, m, o.recordOutputs);
                },
              )
            ),
          );
    },
  });
}
function Lf(e, t = "", n) {
  return new Proxy(e, {
    get: (r, o, i) => {
      let s = Reflect.get(r, o, i),
        a = si(t, String(o)),
        c = Tg[a];
      if (typeof s == "function" && c) {
        let u = c.operation ? KR(s, a, c, r, n) : s.bind(r);
        return c.proxyResultPath
          ? function (...f) {
              let l = u(...f);
              return l && typeof l == "object"
                ? Lf(l, c.proxyResultPath, n)
                : l;
            }
          : u;
      }
      return typeof s == "function"
        ? s.bind(r)
        : s && typeof s == "object"
          ? Lf(s, a, n)
          : s;
    },
  });
}
function Rg(e, t) {
  return Lf(e, "", Dt(t));
}
var Qn = "auto.ai.langchain",
  vg = {
    human: "user",
    ai: "assistant",
    assistant: "assistant",
    system: "system",
    function: "function",
    tool: "tool",
  };
var Kt = (e, t, n) => {
    n != null && (e[t] = n);
  },
  Bt = (e, t, n) => {
    let r = Number(n);
    Number.isNaN(r) || (e[t] = r);
  };
function uo(e) {
  if (typeof e == "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function ui(e) {
  if (Array.isArray(e))
    try {
      let t = e.map((n) => (n && typeof n == "object" && vr(n) ? ao(n) : n));
      return JSON.stringify(t);
    } catch {
      return String(e);
    }
  return uo(e);
}
function Ms(e) {
  let t = e.toLowerCase();
  return vg[t] ?? t;
}
function Ng(e) {
  return e.includes("System")
    ? "system"
    : e.includes("Human")
      ? "user"
      : e.includes("AI") || e.includes("Assistant")
        ? "assistant"
        : e.includes("Function")
          ? "function"
          : e.includes("Tool")
            ? "tool"
            : "user";
}
function Pf(e) {
  if (!(!e || Array.isArray(e))) return e.invocation_params;
}
function Ls(e) {
  return e.map((t) => {
    let n = t._getType;
    if (typeof n == "function") {
      let o = n.call(t);
      return { role: Ms(o), content: ui(t.content) };
    }
    if (t.lc === 1 && t.kwargs) {
      let o = t.id,
        i = Array.isArray(o) && o.length > 0 ? o[o.length - 1] : "",
        s = typeof i == "string" ? Ng(i) : "user";
      return { role: Ms(s), content: ui(t.kwargs?.content) };
    }
    if (t.type) {
      let o = String(t.type).toLowerCase();
      return { role: Ms(o), content: ui(t.content) };
    }
    if (t.role) return { role: Ms(String(t.role)), content: ui(t.content) };
    let r = t.constructor?.name;
    return r && r !== "Object"
      ? { role: Ms(Ng(r)), content: ui(t.content) }
      : { role: "user", content: ui(t.content) };
  });
}
function JR(e, t, n) {
  let r = {},
    o = "kwargs" in e ? e.kwargs : void 0,
    i = t?.temperature ?? n?.ls_temperature ?? o?.temperature;
  Bt(r, Ir, i);
  let s = t?.max_tokens ?? n?.ls_max_tokens ?? o?.max_tokens;
  Bt(r, ri, s);
  let a = t?.top_p ?? o?.top_p;
  Bt(r, Ar, a);
  let c = t?.frequency_penalty;
  Bt(r, br, c);
  let u = t?.presence_penalty;
  return Bt(r, oi, u), t && "stream" in t && Kt(r, ni, !!t.stream), r;
}
function xg(e, t, n, r, o) {
  return {
    [xn]: uo(e ?? "langchain"),
    [qe]: "chat",
    [Ne]: uo(t),
    [$]: Qn,
    ...JR(n, r, o),
  };
}
function kg(e, t, n, r, o, i) {
  let s = i?.ls_provider,
    a = o?.model ?? i?.ls_model_name ?? "unknown",
    c = xg(s, a, e, o, i);
  if (n && Array.isArray(t) && t.length > 0) {
    Kt(c, Vt, t.length);
    let u = t.map((f) => ({ role: "user", content: f }));
    Kt(c, _n, r ? gn(u) : hn(u));
  }
  return c;
}
function wg(e, t, n, r, o, i) {
  let s = i?.ls_provider ?? e.id?.[2],
    a = o?.model ?? i?.ls_model_name ?? "unknown",
    c = xg(s, a, e, o, i);
  if (n && Array.isArray(t) && t.length > 0) {
    let u = Ls(t.flat()),
      { systemInstructions: f, filteredMessages: l } = Mn(u);
    f && Kt(c, wn, f);
    let d = Array.isArray(l) ? l.length : 0;
    Kt(c, Vt, d), Kt(c, _n, r ? gn(l) : hn(l));
  }
  return c;
}
function XR(e, t) {
  let n = [],
    r = e.flat();
  for (let o of r) {
    let s = o.message?.tool_calls;
    if (Array.isArray(s) && s.length > 0) n.push(...s);
    else {
      let a = o.message?.content;
      if (Array.isArray(a))
        for (let c of a) {
          let u = c;
          u.type === "tool_use" && n.push(u);
        }
    }
  }
  n.length > 0 && Kt(t, vt, uo(n));
}
function QR(e, t) {
  if (!e) return;
  let n = e.tokenUsage,
    r = e.usage;
  if (n)
    Bt(t, qt, n.promptTokens),
      Bt(t, Yt, n.completionTokens),
      Bt(t, Ut, n.totalTokens);
  else if (r) {
    Bt(t, qt, r.input_tokens), Bt(t, Yt, r.output_tokens);
    let o = Number(r.input_tokens),
      i = Number(r.output_tokens),
      s = (Number.isNaN(o) ? 0 : o) + (Number.isNaN(i) ? 0 : i);
    s > 0 && Bt(t, Ut, s),
      r.cache_creation_input_tokens !== void 0 &&
        Bt(t, Dh, r.cache_creation_input_tokens),
      r.cache_read_input_tokens !== void 0 &&
        Bt(t, Bh, r.cache_read_input_tokens);
  }
}
function Og(e, t) {
  if (!e) return;
  let n = {};
  if (Array.isArray(e.generations)) {
    let u = e.generations
      .flat()
      .map((f) =>
        f.generationInfo?.finish_reason
          ? f.generationInfo.finish_reason
          : f.generation_info?.finish_reason
            ? f.generation_info.finish_reason
            : null,
      )
      .filter((f) => typeof f == "string");
    if ((u.length > 0 && Kt(n, kn, uo(u)), XR(e.generations, n), t)) {
      let f = e.generations
        .flat()
        .map((l) => l.text ?? l.message?.content)
        .filter((l) => typeof l == "string");
      f.length > 0 && Kt(n, st, uo(f));
    }
  }
  QR(e.llmOutput, n);
  let r = e.llmOutput,
    i = e.generations?.[0]?.[0]?.message,
    s = r?.model_name ?? r?.model ?? i?.response_metadata?.model_name;
  s && Kt(n, zt, s);
  let a = r?.id ?? i?.id;
  a && Kt(n, Rr, a);
  let c = r?.stop_reason ?? i?.response_metadata?.finish_reason;
  return c && Kt(n, Lh, uo(c)), n;
}
function Uc(e) {
  let t = {},
    n = e?.lc_agent_name;
  return typeof n == "string" && (t[so] = n), t;
}
function Mg(e) {
  let t = e?.invocation_params?.tools ?? e?.options?.tools;
  if (!Array.isArray(t) || t.length === 0) return;
  let n = t.map((r) => {
    let o = r.function;
    return {
      type: "function",
      name: r.name ?? o?.name ?? "",
      description: r.description ?? o?.description,
    };
  });
  return JSON.stringify(n);
}
function ZR(e) {
  if (!e || typeof e != "object") return !1;
  let t = e;
  return typeof t.addHandler == "function" && typeof t.copy == "function";
}
function ev(e) {
  return typeof e == "object" && e?.name === "SentryCallbackHandler";
}
function Cg(e) {
  return e.some(ev);
}
function Lg(e, t) {
  if (!e) return [t];
  if (ZR(e)) {
    if (Cg(e.handlers ?? [])) return e;
    let r = e.copy();
    return r.addHandler(t, !0), r;
  }
  let n = Array.isArray(e) ? e : [e];
  return Cg(n) ? e : [...n, t];
}
function Ps(e = {}) {
  let { recordInputs: t, recordOutputs: n } = Dt(e),
    r = Nt(e.enableTruncation),
    o = new Map(),
    i = (a) => {
      let c = o.get(a);
      c?.isRecording() && (c.end(), o.delete(a));
    },
    s = {
      lc_serializable: !1,
      lc_namespace: ["langchain_core", "callbacks", "sentry"],
      lc_secrets: void 0,
      lc_attributes: void 0,
      lc_aliases: void 0,
      lc_serializable_keys: void 0,
      lc_id: ["langchain_core", "callbacks", "sentry"],
      lc_kwargs: {},
      name: "SentryCallbackHandler",
      ignoreLLM: !1,
      ignoreChain: !1,
      ignoreAgent: !1,
      ignoreRetriever: !1,
      ignoreCustomEvent: !1,
      raiseError: !1,
      awaitHandlers: !0,
      handleLLMStart(a, c, u, f, l, d, p, m) {
        let h = Pf(d),
          g = kg(a, c, t, r, h, p),
          S = g[Ne],
          T = g[qe];
        dt(
          {
            name: `${T} ${S}`,
            op: "gen_ai.chat",
            attributes: { ...Uc(p), ...g, [J]: "gen_ai.chat" },
          },
          (x) => (o.set(u, x), x),
        );
      },
      handleChatModelStart(a, c, u, f, l, d, p, m) {
        let h = Pf(d),
          g = wg(a, c, t, r, h, p),
          S = Mg(l);
        S && (g[On] = S);
        let T = g[Ne],
          x = g[qe];
        dt(
          {
            name: `${x} ${T}`,
            op: "gen_ai.chat",
            attributes: { ...Uc(p), ...g, [J]: "gen_ai.chat" },
          },
          (A) => (o.set(u, A), A),
        );
      },
      handleLLMEnd(a, c, u, f, l) {
        let d = o.get(c);
        if (d?.isRecording()) {
          let p = Og(a, n);
          p && d.setAttributes(p), i(c);
        }
      },
      handleLLMError(a, c) {
        let u = o.get(c);
        u?.isRecording() &&
          (u.setStatus({ code: 2, message: "internal_error" }), i(c)),
          X(a, { mechanism: { handled: !1, type: `${Qn}.llm_error_handler` } });
      },
      handleChainStart(a, c, u, f, l, d, p, m) {
        if (d?.__sentry_langgraph__) return;
        let h = m || a.name || "unknown_chain",
          g = { [$]: "auto.ai.langchain", "langchain.chain.name": h };
        t && (g["langchain.chain.inputs"] = JSON.stringify(c)),
          dt(
            {
              name: `chain ${h}`,
              op: "gen_ai.invoke_agent",
              attributes: { ...g, [J]: "gen_ai.invoke_agent" },
            },
            (S) => (o.set(u, S), S),
          );
      },
      handleChainEnd(a, c) {
        let u = o.get(c);
        u?.isRecording() &&
          (n &&
            u.setAttributes({ "langchain.chain.outputs": JSON.stringify(a) }),
          i(c));
      },
      handleChainError(a, c) {
        let u = o.get(c);
        u?.isRecording() &&
          (u.setStatus({ code: 2, message: "internal_error" }), i(c)),
          X(a, {
            mechanism: { handled: !1, type: `${Qn}.chain_error_handler` },
          });
      },
      handleToolStart(a, c, u, f, l, d, p) {
        if (d?.__sentry_langgraph__) return;
        let m = p || a.name || "unknown_tool",
          h = { ...Uc(d), [$]: Qn, [qe]: "execute_tool", [wc]: m };
        t && (h[Oc] = c),
          dt(
            {
              name: `execute_tool ${m}`,
              op: "gen_ai.execute_tool",
              attributes: { ...h, [J]: "gen_ai.execute_tool" },
            },
            (g) => (o.set(u, g), g),
          );
      },
      handleToolEnd(a, c) {
        let u = o.get(c);
        if (u?.isRecording()) {
          if (n) {
            let f = a,
              l = f && typeof f == "object" && "content" in f ? f.content : a;
            u.setAttributes({
              [Mc]: typeof l == "string" ? l : JSON.stringify(l),
            });
          }
          i(c);
        }
      },
      handleToolError(a, c) {
        let u = o.get(c);
        u?.isRecording() &&
          (u.setStatus({ code: 2, message: "internal_error" }), i(c)),
          X(a, {
            mechanism: { handled: !1, type: `${Qn}.tool_error_handler` },
          });
      },
      copy() {
        return s;
      },
      toJSON() {
        return { lc: 1, type: "not_implemented", id: s.lc_id };
      },
      toJSONNotImplemented() {
        return { lc: 1, type: "not_implemented", id: s.lc_id };
      },
    };
  return s;
}
var Us = "auto.ai.langgraph";
function Pg(e) {
  let t = e[0];
  if (
    typeof t != "object" ||
    !t ||
    !("llm" in t) ||
    !t.llm ||
    typeof t.llm != "object"
  )
    return null;
  let n = t.llm;
  return typeof n.modelName != "string" && typeof n.model != "string"
    ? null
    : n;
}
function Ug(e) {
  let t = e[0];
  return typeof t == "object" && t && "name" in t && typeof t.name == "string"
    ? t.name
    : null;
}
function Dg(e, t, n) {
  let r = "__sentry_tool_wrapped__";
  for (let o of e) {
    if (!o || typeof o != "object") continue;
    let i = o,
      s = i.invoke;
    if (typeof s != "function" || Object.prototype.hasOwnProperty.call(i, r))
      continue;
    let a = typeof i.name == "string" ? i.name : "unknown_tool",
      c = typeof i.description == "string" ? i.description : void 0,
      u = new Proxy(s, {
        apply(f, l, d) {
          let p = {
              [$]: Us,
              [J]: xf,
              [qe]: "execute_tool",
              [wc]: a,
              [Gh]: "function",
            },
            h = d[1]?.metadata?.lc_agent_name ?? n;
          typeof h == "string" && (p[so] = h), c && (p[$h] = c);
          let g = d[0];
          if (
            typeof g == "object" &&
            g &&
            ("id" in g && typeof g.id == "string" && (p[Hh] = g.id),
            t.recordInputs)
          ) {
            let S = "args" in g && typeof g.args == "object" ? g.args : g;
            try {
              p[Oc] = JSON.stringify(S);
            } catch {}
          }
          return ze(
            { op: xf, name: `execute_tool ${a}`, attributes: p },
            async (S) => {
              try {
                let T = await Reflect.apply(f, l, d);
                if (t.recordOutputs)
                  try {
                    let x = T,
                      A =
                        x && typeof x == "object" && "content" in x
                          ? x.content
                          : T;
                    S.setAttribute(
                      Mc,
                      typeof A == "string" ? A : JSON.stringify(A),
                    );
                  } catch {}
                return T;
              } catch (T) {
                throw (
                  (S.setStatus({ code: 2, message: "internal_error" }),
                  X(T, {
                    mechanism: { handled: !1, type: "auto.ai.langgraph.error" },
                  }),
                  T)
                );
              }
            },
          );
        },
      });
    (i.invoke = u), Object.defineProperty(i, r, { value: !0, enumerable: !1 });
  }
  return e;
}
function tv(e) {
  if (!e || e.length === 0) return null;
  let t = [];
  for (let n of e)
    if (n && typeof n == "object") {
      let r = n.tool_calls;
      r && Array.isArray(r) && t.push(...r);
    }
  return t.length > 0 ? t : null;
}
function nv(e) {
  let t = e,
    n = 0,
    r = 0,
    o = 0;
  if (t.usage_metadata && typeof t.usage_metadata == "object") {
    let i = t.usage_metadata;
    return (
      typeof i.input_tokens == "number" && (n = i.input_tokens),
      typeof i.output_tokens == "number" && (r = i.output_tokens),
      typeof i.total_tokens == "number" && (o = i.total_tokens),
      { inputTokens: n, outputTokens: r, totalTokens: o }
    );
  }
  if (t.response_metadata && typeof t.response_metadata == "object") {
    let i = t.response_metadata;
    if (i.tokenUsage && typeof i.tokenUsage == "object") {
      let s = i.tokenUsage;
      typeof s.promptTokens == "number" && (n = s.promptTokens),
        typeof s.completionTokens == "number" && (r = s.completionTokens),
        typeof s.totalTokens == "number" && (o = s.totalTokens);
    }
  }
  return { inputTokens: n, outputTokens: r, totalTokens: o };
}
function rv(e, t) {
  let n = t;
  if (n.response_metadata && typeof n.response_metadata == "object") {
    let r = n.response_metadata;
    r.model_name &&
      typeof r.model_name == "string" &&
      e.setAttribute(zt, r.model_name),
      r.finish_reason &&
        typeof r.finish_reason == "string" &&
        e.setAttribute(kn, [r.finish_reason]);
  }
}
function Bg(e) {
  if (!e.builder?.nodes?.tools?.runnable?.tools) return null;
  let t = e.builder?.nodes?.tools?.runnable?.tools;
  return !t || !Array.isArray(t) || t.length === 0
    ? null
    : t.map((n) => ({
        name: n.lc_kwargs?.name,
        description: n.lc_kwargs?.description,
        schema: n.lc_kwargs?.schema,
      }));
}
function Fg(e, t, n) {
  let o = n?.messages;
  if (!o || !Array.isArray(o)) return;
  let i = t?.length ?? 0,
    s = o.length > i ? o.slice(i) : [];
  if (s.length === 0) return;
  let a = tv(s);
  a && e.setAttribute(vt, JSON.stringify(a));
  let c = Ls(s);
  e.setAttribute(st, JSON.stringify(c));
  let u = 0,
    f = 0,
    l = 0;
  for (let d of s) {
    let p = nv(d);
    (u += p.inputTokens), (f += p.outputTokens), (l += p.totalTokens), rv(e, d);
  }
  u > 0 && e.setAttribute(qt, u),
    f > 0 && e.setAttribute(Yt, f),
    l > 0 && e.setAttribute(Ut, l);
}
var Uf = !1,
  Dc = "__sentry_patched__";
function Hg(e, t) {
  if (Object.prototype.hasOwnProperty.call(e, Dc)) return e;
  let n = Ps(t),
    r = new Proxy(e, {
      apply(o, i, s) {
        return Uf
          ? Reflect.apply(o, i, s)
          : ze(
              {
                op: "gen_ai.create_agent",
                name: "create_agent",
                attributes: {
                  [$]: Us,
                  [J]: "gen_ai.create_agent",
                  [qe]: "create_agent",
                },
              },
              (a) => {
                try {
                  let c = Reflect.apply(o, i, s),
                    u = s.length > 0 ? s[0] : {};
                  u?.name &&
                    typeof u.name == "string" &&
                    (a.setAttribute(so, u.name),
                    a.updateName(`create_agent ${u.name}`));
                  let f = c.invoke;
                  return (
                    f &&
                      typeof f == "function" &&
                      (c.invoke = Gg(f.bind(c), c, u, t, void 0, n)),
                    c
                  );
                } catch (c) {
                  throw (
                    (a.setStatus({ code: 2, message: "internal_error" }),
                    X(c, {
                      mechanism: {
                        handled: !1,
                        type: "auto.ai.langgraph.error",
                      },
                    }),
                    c)
                  );
                }
              },
            );
      },
    });
  return Object.defineProperty(r, Dc, { value: !0, enumerable: !1 }), r;
}
function Gg(e, t, n, r, o, i) {
  return new Proxy(e, {
    apply(s, a, c) {
      let u = o?.modelName ?? o?.model;
      return ze(
        {
          op: "gen_ai.invoke_agent",
          name: "invoke_agent",
          attributes: { [$]: Us, [J]: Fh, [qe]: "invoke_agent" },
        },
        async (f) => {
          try {
            let l = n?.name;
            l &&
              typeof l == "string" &&
              (f.setAttribute(Uh, l),
              f.setAttribute(so, l),
              f.updateName(`invoke_agent ${l}`)),
              u && f.setAttribute(Ne, u);
            let m = (c.length > 1 ? c[1] : void 0)?.configurable?.thread_id;
            if ((m && typeof m == "string" && f.setAttribute(ws, m), i)) {
              let A = c[1] ?? {};
              c[1] = A;
              let M = A.metadata ?? {};
              (A.metadata = {
                ...M,
                __sentry_langgraph__: !0,
                ...(typeof l == "string" ? { lc_agent_name: l } : {}),
              }),
                (A.callbacks = Lg(A.callbacks, i));
            }
            let h = Bg(t);
            h && f.setAttribute(On, JSON.stringify(h));
            let g = r.recordInputs,
              S = r.recordOutputs,
              T = c.length > 0 ? (c[0]?.messages ?? []) : [];
            if (T && g) {
              let A = Ls(T),
                { systemInstructions: M, filteredMessages: P } = Mn(A);
              M && f.setAttribute(wn, M);
              let E = Nt(r.enableTruncation),
                k = Array.isArray(P) ? P.length : 0;
              f.setAttributes({ [_n]: E ? gn(P) : hn(P), [Vt]: k });
            }
            let x = await Reflect.apply(s, a, c);
            return S && Fg(f, T ?? null, x), x;
          } catch (l) {
            throw (
              (f.setStatus({ code: 2, message: "internal_error" }),
              X(l, {
                mechanism: { handled: !1, type: "auto.ai.langgraph.error" },
              }),
              l)
            );
          }
        },
      );
    },
  });
}
function $g(e, t) {
  if (Object.prototype.hasOwnProperty.call(e, Dc)) return e;
  let n = Dt(t),
    r = Ps(n),
    o = new Proxy(e, {
      apply(i, s, a) {
        let c = Pg(a),
          u = Ug(a),
          f = a[0];
        f &&
          Array.isArray(f.tools) &&
          f.tools.length > 0 &&
          Dg(f.tools, n, u ?? void 0),
          (Uf = !0);
        let l;
        try {
          l = Reflect.apply(i, s, a);
        } finally {
          Uf = !1;
        }
        let d = l.invoke;
        if (d && typeof d == "function") {
          let p = {};
          u && (p.name = u), (l.invoke = Gg(d.bind(l), l, p, n, c, r));
        }
        return l;
      },
    });
  return Object.defineProperty(o, Dc, { value: !0, enumerable: !1 }), o;
}
function Wg(e, t) {
  return (e.compile = Hg(e.compile, Dt(t))), e;
}
function jg(e, t, n) {
  let r = n.getOptions(),
    o = n.getDsn(),
    i = r.tunnel,
    s = dn(r._metadata),
    a = {
      sent_at: new Date(et()).toISOString(),
      ...(ov(t) && { trace: t }),
      ...(s && { sdk: s }),
      ...(!!i && o && { dsn: Ge(o) }),
    },
    c = n.getDataCollectionOptions().userInfo ? "auto" : "never",
    u = [
      {
        type: "span",
        item_count: e.length,
        content_type: "application/vnd.sentry.items.span.v2+json",
      },
      {
        version: 2,
        ...(ot() && { ingest_settings: { infer_ip: c, infer_user_agent: c } }),
        items: e,
      },
    ];
  return ke(a, [u]);
}
function ov(e) {
  return !!e.trace_id && !!e.public_key;
}
function zg(e) {
  let t = 156;
  if (
    ((t += e.name.length * 2),
    (t += gl(e.attributes)),
    e.links && e.links.length > 0)
  ) {
    let r = e.links[0]?.attributes,
      o = 100 + (r ? gl(r) : 0);
    t += o * e.links.length;
  }
  return t;
}
var qg = 1e3,
  iv = 5e6,
  Ds = class {
    constructor(t, n) {
      (this._traceBuckets = new Map()), (this._client = t);
      let {
        maxSpanLimit: r,
        flushInterval: o,
        maxTraceWeightInBytes: i,
      } = n ?? {};
      (this._maxSpanLimit = r && r > 0 && r <= qg ? r : qg),
        (this._flushInterval = o && o > 0 ? o : 5e3),
        (this._maxTraceWeight = i && i > 0 ? i : iv),
        this._client.on("flush", () => {
          this.drain();
        }),
        this._client.on("close", () => {
          this._traceBuckets.forEach((s) => {
            clearTimeout(s.timeout);
          }),
            this._traceBuckets.clear();
        });
    }
    add(t) {
      let n = t.trace_id,
        r = this._traceBuckets.get(n);
      r ||
        ((r = {
          spans: new Set(),
          size: 0,
          timeout: Tr(
            setTimeout(() => {
              this.flush(n);
            }, this._flushInterval),
          ),
        }),
        this._traceBuckets.set(n, r)),
        r.spans.add(t),
        (r.size += zg(t)),
        (r.spans.size >= this._maxSpanLimit ||
          r.size >= this._maxTraceWeight) &&
          this.flush(n);
    }
    drain() {
      this._traceBuckets.size &&
        (y &&
          _.log(
            `Flushing span tree map with ${this._traceBuckets.size} traces`,
          ),
        this._traceBuckets.forEach((t, n) => {
          this.flush(n);
        }));
    }
    flush(t) {
      let n = this._traceBuckets.get(t);
      if (!n) return;
      if (!n.spans.size) {
        this._removeTrace(t);
        return;
      }
      let r = Array.from(n.spans),
        o = r[0]?._segmentSpan;
      if (!o) {
        y &&
          _.warn(
            "No segment span reference found on span JSON, cannot compute DSC",
          ),
          this._removeTrace(t);
        return;
      }
      let i = Le(o),
        s = r.map((c) => {
          let { _segmentSpan: u, ...f } = c;
          return f;
        }),
        a = jg(s, i, this._client);
      y && _.log(`Sending span envelope for trace ${t} with ${s.length} spans`),
        this._client.sendEnvelope(a).then(null, (c) => {
          y && _.error("Error while sending streamed span envelope:", c);
        }),
        this._removeTrace(t);
    }
    _removeTrace(t) {
      let n = this._traceBuckets.get(t);
      n && clearTimeout(n.timeout), this._traceBuckets.delete(t);
    }
  };
function Bc(e) {
  if (e !== void 0)
    return e >= 400 && e < 500 ? "warning" : e >= 500 ? "error" : void 0;
}
var li = v;
function Fc() {
  return "history" in li && !!li.history;
}
function sv() {
  if (!("fetch" in li)) return !1;
  try {
    return new Headers(), new Request("data:,"), new Response(), !0;
  } catch {
    return !1;
  }
}
function fi(e) {
  return (
    e && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString())
  );
}
function pi() {
  if (typeof EdgeRuntime == "string") return !0;
  if (!sv()) return !1;
  if (fi(li.fetch)) return !0;
  let e = !1,
    t = li.document;
  if (t && typeof t.createElement == "function")
    try {
      let n = t.createElement("iframe");
      (n.hidden = !0),
        t.head.appendChild(n),
        n.contentWindow?.fetch && (e = fi(n.contentWindow.fetch)),
        t.head.removeChild(n);
    } catch (n) {
      y &&
        _.warn(
          "Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ",
          n,
        );
    }
  return e;
}
function Hc() {
  return "ReportingObserver" in li;
}
function Ln(e, t) {
  let n = "fetch",
    r = Qe(n, e);
  return Ze(n, () => Vg(void 0, t)), r;
}
function $c(e) {
  let t = "fetch-body-resolved",
    n = Qe(t, e);
  return Ze(t, () => Vg(cv)), n;
}
function Vg(e, t = !1) {
  (t && !pi()) ||
    Ee(v, "fetch", function (n) {
      return function (...r) {
        let o = new Error(),
          { method: i, url: s } = uv(r),
          a = {
            args: r,
            fetchData: { method: i, url: s },
            startTimestamp: Z() * 1e3,
            virtualError: o,
            headers: lv(r),
          };
        return (
          e || Be("fetch", { ...a }),
          n.apply(v, r).then(
            async (c) => (
              e
                ? e(c)
                : Be("fetch", { ...a, endTimestamp: Z() * 1e3, response: c }),
              c
            ),
            (c) => {
              Be("fetch", { ...a, endTimestamp: Z() * 1e3, error: c }),
                Je(c) &&
                  c.stack === void 0 &&
                  ((c.stack = o.stack), de(c, "framesToPop", 1));
              let f = I()?.getOptions().enhanceFetchErrorMessages ?? "always";
              if (
                f !== !1 &&
                c instanceof TypeError &&
                (c.message === "Failed to fetch" ||
                  c.message === "Load failed" ||
                  c.message ===
                    "NetworkError when attempting to fetch resource.")
              )
                try {
                  let p = new URL(a.fetchData.url).host;
                  f === "always"
                    ? (c.message = `${c.message} (${p})`)
                    : de(c, "__sentry_fetch_url_host__", p);
                } catch {}
              throw c;
            },
          )
        );
      };
    });
}
async function av(e, t) {
  if (e?.body) {
    let n = e.body,
      r = n.getReader(),
      o = setTimeout(() => {
        n.cancel().then(null, () => {});
      }, 90 * 1e3),
      i = !0;
    for (; i; ) {
      let s;
      try {
        s = setTimeout(() => {
          n.cancel().then(null, () => {});
        }, 5e3);
        let { done: a } = await r.read();
        clearTimeout(s), a && (t(), (i = !1));
      } catch {
        i = !1;
      } finally {
        clearTimeout(s);
      }
    }
    clearTimeout(o), r.releaseLock(), n.cancel().then(null, () => {});
  }
}
function cv(e) {
  let t;
  try {
    t = e.clone();
  } catch {
    return;
  }
  av(t, () => {
    Be("fetch-body-resolved", { endTimestamp: Z() * 1e3, response: e });
  });
}
function Gc(e, t) {
  return !!e && typeof e == "object" && !!e[t];
}
function Yg(e) {
  return typeof e == "string"
    ? e
    : e
      ? Gc(e, "url")
        ? e.url
        : e.toString
          ? e.toString()
          : ""
      : "";
}
function uv(e) {
  if (e.length === 0) return { method: "GET", url: "" };
  if (e.length === 2) {
    let [n, r] = e;
    return {
      url: Yg(n),
      method: Gc(r, "method")
        ? String(r.method).toUpperCase()
        : Yi(n) && Gc(n, "method")
          ? String(n.method).toUpperCase()
          : "GET",
    };
  }
  let t = e[0];
  return {
    url: Yg(t),
    method: Gc(t, "method") ? String(t.method).toUpperCase() : "GET",
  };
}
function lv(e) {
  let [t, n] = e;
  try {
    if (typeof n == "object" && n !== null && "headers" in n && n.headers)
      return new Headers(n.headers);
    if (Yi(t)) return new Headers(t.headers);
  } catch {}
}
var Kg = v;
function at() {
  try {
    return Kg.document.location.href;
  } catch {
    return "";
  }
}
function Nr(e, t = 5) {
  if (!Kg.HTMLElement) return null;
  let n = e;
  for (let r = 0; r < t; r++) {
    if (!n) return null;
    if (n instanceof HTMLElement) {
      if (n.dataset.sentryComponent) return n.dataset.sentryComponent;
      if (n.dataset.sentryElement) return n.dataset.sentryElement;
    }
    n = n.parentNode;
  }
  return null;
}
function fv(e) {
  let t = e.constructor?.name ?? "";
  return t.includes("OpenAI")
    ? "openai"
    : t.includes("Google")
      ? "google_genai"
      : t.includes("Mistral")
        ? "mistralai"
        : t.includes("Vertex")
          ? "google_vertexai"
          : t.includes("Bedrock")
            ? "aws_bedrock"
            : t.includes("Ollama")
              ? "ollama"
              : t.includes("Cloudflare")
                ? "cloudflare"
                : t.includes("Cohere")
                  ? "cohere"
                  : "langchain";
}
function pv(e) {
  let t = e ?? {},
    n = { [$]: Qn, [J]: Cf, [qe]: "embeddings", [Ne]: t.model ?? "unknown" };
  return (
    (n[xn] = fv(t)),
    "dimensions" in t && (n[kc] = t.dimensions),
    "encodingFormat" in t && (n[xc] = t.encodingFormat),
    n
  );
}
function Jg(e, t = {}) {
  let { recordInputs: n } = Dt(t);
  return new Proxy(e, {
    apply(r, o, i) {
      let s = pv(o),
        a = s[Ne] || "unknown";
      if (n) {
        let c = i[0];
        c != null && (s[ii] = typeof c == "string" ? c : JSON.stringify(c));
      }
      return ze({ name: `embeddings ${a}`, op: Cf, attributes: s }, () =>
        Reflect.apply(r, o, i).then(void 0, (c) => {
          throw (
            (X(c, { mechanism: { handled: !1, type: "auto.ai.langchain" } }), c)
          );
        }),
      );
    },
  });
}
function Xg(e, t) {
  let n = e;
  return (
    typeof n.embedQuery == "function" && (n.embedQuery = Jg(n.embedQuery, t)),
    typeof n.embedDocuments == "function" &&
      (n.embedDocuments = Jg(n.embedDocuments, t)),
    e
  );
}
var Sn = v,
  Te = Sn.document,
  Bs = Sn.navigator,
  hS = "Report a Bug",
  Lv = "Cancel",
  Pv = "Send Bug Report",
  Uv = "Confirm",
  Dv = "Report a Bug",
  Bv = "your.email@example.org",
  Fv = "Email",
  Hv = "What's the bug? What did you expect?",
  Gv = "Description",
  $v = "Your Name",
  Wv = "Name",
  jv = "Thank you for your report!",
  zv = "(required)",
  qv = "Add a screenshot",
  Yv = "Remove screenshot",
  Vv = "Highlight",
  Kv = "Hide",
  Jv = "Remove",
  gS = "Unable to submit feedback with empty message",
  SS = "No client setup, cannot send feedback.",
  ES = "Unable to determine if Feedback was correctly sent.",
  TS =
    "Unable to send feedback. This could be because this domain is not in your list of allowed domains.",
  yS =
    "Unable to send feedback. This could be because of network issues, or because you are using an ad-blocker.",
  Xv = "widget",
  Qv = "api",
  Zv = 5e3,
  eN = {
    ERROR_EMPTY_MESSAGE: gS,
    ERROR_NO_CLIENT: SS,
    ERROR_TIMEOUT: ES,
    ERROR_FORBIDDEN: TS,
    ERROR_GENERIC: yS,
  };
function qc(e, t) {
  return t?.[e] ?? eN[e];
}
function Qg(e, t) {
  return new Error(qc(e, t));
}
var IS = (e, t = { includeReplay: !0 }) => {
    let n = t.errorMessages;
    if (!e.message) throw Qg("ERROR_EMPTY_MESSAGE", n);
    let r = I();
    if (!r) throw Qg("ERROR_NO_CLIENT", n);
    e.tags && Object.keys(e.tags).length && C().setTags(e.tags);
    let o = ks({ source: Qv, url: at(), ...e }, t);
    return new Promise((i, s) => {
      let a = setTimeout(() => {
          c(), s(qc("ERROR_TIMEOUT", n));
        }, 3e4),
        c = r.on("afterSendEvent", (u, f) => {
          if (u.event_id === o)
            return (
              clearTimeout(a),
              c(),
              f?.statusCode && f.statusCode >= 200 && f.statusCode < 300
                ? i(o)
                : f?.statusCode === 403
                  ? s(qc("ERROR_FORBIDDEN", n))
                  : s(qc("ERROR_GENERIC", n))
            );
        });
    });
  },
  Yc = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
function tN() {
  return !(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      Bs.userAgent,
    ) ||
    (/Macintosh/i.test(Bs.userAgent) &&
      Bs.maxTouchPoints &&
      Bs.maxTouchPoints > 1) ||
    !isSecureContext
  );
}
function Wc(e, t) {
  return {
    ...e,
    ...t,
    tags: { ...e.tags, ...t.tags },
    onFormOpen: () => {
      t.onFormOpen?.(), e.onFormOpen?.();
    },
    onFormClose: () => {
      t.onFormClose?.(), e.onFormClose?.();
    },
    onSubmitSuccess: (n, r) => {
      t.onSubmitSuccess?.(n, r), e.onSubmitSuccess?.(n, r);
    },
    onSubmitError: (n) => {
      t.onSubmitError?.(n), e.onSubmitError?.(n);
    },
    onFormSubmitted: () => {
      t.onFormSubmitted?.(), e.onFormSubmitted?.();
    },
    themeDark: { ...e.themeDark, ...t.themeDark },
    themeLight: { ...e.themeLight, ...t.themeLight },
  };
}
function nN(e) {
  let t = Te.createElement("style");
  return (
    (t.textContent = `
.widget__actor {
  position: fixed;
  z-index: var(--z-index);
  margin: var(--page-margin);
  inset: var(--actor-inset);

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;

  font-family: inherit;
  font-size: var(--font-size);
  font-weight: 600;
  line-height: 1.14em;
  text-decoration: none;

  background: var(--actor-background, var(--background));
  border-radius: var(--actor-border-radius, 1.7em/50%);
  border: var(--actor-border, var(--border));
  box-shadow: var(--actor-box-shadow, var(--box-shadow));
  color: var(--actor-color, var(--foreground));
  fill: var(--actor-color, var(--foreground));
  cursor: pointer;
  opacity: 1;
  transition: transform 0.2s ease-in-out;
  transform: translate(0, 0) scale(1);
}
.widget__actor[aria-hidden="true"] {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translate(0, 16px) scale(0.98);
}

.widget__actor:hover {
  background: var(--actor-hover-background, var(--background));
  filter: var(--interactive-filter);
}

.widget__actor svg {
  width: 1.14em;
  height: 1.14em;
}

@media (max-width: 600px) {
  .widget__actor span {
    display: none;
  }
}
`),
    e && t.setAttribute("nonce", e),
    t
  );
}
function Ft(e, t) {
  return (
    Object.entries(t).forEach(([n, r]) => {
      e.setAttributeNS(null, n, r);
    }),
    e
  );
}
var di = 20,
  rN = "http://www.w3.org/2000/svg";
function oN() {
  let e = (a) => Sn.document.createElementNS(rN, a),
    t = Ft(e("svg"), {
      width: `${di}`,
      height: `${di}`,
      viewBox: `0 0 ${di} ${di}`,
      fill: "var(--actor-color, var(--foreground))",
    }),
    n = Ft(e("g"), { clipPath: "url(#clip0_57_80)" }),
    r = Ft(e("path"), {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M15.6622 15H12.3997C12.2129 14.9959 12.031 14.9396 11.8747 14.8375L8.04965 12.2H7.49956V19.1C7.4875 19.3348 7.3888 19.5568 7.22256 19.723C7.05632 19.8892 6.83435 19.9879 6.59956 20H2.04956C1.80193 19.9968 1.56535 19.8969 1.39023 19.7218C1.21511 19.5467 1.1153 19.3101 1.11206 19.0625V12.2H0.949652C0.824431 12.2017 0.700142 12.1783 0.584123 12.1311C0.468104 12.084 0.362708 12.014 0.274155 11.9255C0.185602 11.8369 0.115689 11.7315 0.0685419 11.6155C0.0213952 11.4995 -0.00202913 11.3752 -0.00034808 11.25V3.75C-0.00900498 3.62067 0.0092504 3.49095 0.0532651 3.36904C0.0972798 3.24712 0.166097 3.13566 0.255372 3.04168C0.344646 2.94771 0.452437 2.87327 0.571937 2.82307C0.691437 2.77286 0.82005 2.74798 0.949652 2.75H8.04965L11.8747 0.1625C12.031 0.0603649 12.2129 0.00407221 12.3997 0H15.6622C15.9098 0.00323746 16.1464 0.103049 16.3215 0.278167C16.4966 0.453286 16.5964 0.689866 16.5997 0.9375V3.25269C17.3969 3.42959 18.1345 3.83026 18.7211 4.41679C19.5322 5.22788 19.9878 6.32796 19.9878 7.47502C19.9878 8.62209 19.5322 9.72217 18.7211 10.5333C18.1345 11.1198 17.3969 11.5205 16.5997 11.6974V14.0125C16.6047 14.1393 16.5842 14.2659 16.5395 14.3847C16.4948 14.5035 16.4268 14.6121 16.3394 14.7042C16.252 14.7962 16.147 14.8698 16.0307 14.9206C15.9144 14.9714 15.7891 14.9984 15.6622 15ZM1.89695 10.325H1.88715V4.625H8.33715C8.52423 4.62301 8.70666 4.56654 8.86215 4.4625L12.6872 1.875H14.7247V13.125H12.6872L8.86215 10.4875C8.70666 10.3835 8.52423 10.327 8.33715 10.325H2.20217C2.15205 10.3167 2.10102 10.3125 2.04956 10.3125C1.9981 10.3125 1.94708 10.3167 1.89695 10.325ZM2.98706 12.2V18.1625H5.66206V12.2H2.98706ZM16.5997 9.93612V5.01393C16.6536 5.02355 16.7072 5.03495 16.7605 5.04814C17.1202 5.13709 17.4556 5.30487 17.7425 5.53934C18.0293 5.77381 18.2605 6.06912 18.4192 6.40389C18.578 6.73866 18.6603 7.10452 18.6603 7.47502C18.6603 7.84552 18.578 8.21139 18.4192 8.54616C18.2605 8.88093 18.0293 9.17624 17.7425 9.41071C17.4556 9.64518 17.1202 9.81296 16.7605 9.90191C16.7072 9.91509 16.6536 9.9265 16.5997 9.93612Z",
    });
  t.appendChild(n).appendChild(r);
  let o = e("defs"),
    i = Ft(e("clipPath"), { id: "clip0_57_80" }),
    s = Ft(e("rect"), { width: `${di}`, height: `${di}`, fill: "white" });
  return (
    i.appendChild(s),
    o.appendChild(i),
    t.appendChild(o).appendChild(i).appendChild(s),
    t
  );
}
function iN({
  triggerLabel: e,
  triggerAriaLabel: t,
  shadow: n,
  styleNonce: r,
}) {
  let o = Te.createElement("button");
  if (
    ((o.type = "button"),
    (o.className = "widget__actor"),
    (o.ariaHidden = "false"),
    (o.ariaLabel = t || e || hS),
    o.appendChild(oN()),
    e)
  ) {
    let s = Te.createElement("span");
    s.appendChild(Te.createTextNode(e)), o.appendChild(s);
  }
  let i = nN(r);
  return {
    el: o,
    appendToDom() {
      n.appendChild(i), n.appendChild(o);
    },
    removeFromDom() {
      o.remove(), i.remove();
    },
    show() {
      o.ariaHidden = "false";
    },
    hide() {
      o.ariaHidden = "true";
    },
  };
}
var bS = "rgba(88, 74, 192, 1)",
  sN = {
    foreground: "#2b2233",
    background: "#ffffff",
    accentForeground: "white",
    accentBackground: bS,
    successColor: "#268d75",
    errorColor: "#df3338",
    border: "1.5px solid rgba(41, 35, 47, 0.13)",
    boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
    outline: "1px auto var(--accent-background)",
    interactiveFilter: "brightness(95%)",
  },
  Zg = {
    foreground: "#ebe6ef",
    background: "#29232f",
    accentForeground: "white",
    accentBackground: bS,
    successColor: "#2da98c",
    errorColor: "#f55459",
    border: "1.5px solid rgba(235, 230, 239, 0.15)",
    boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
    outline: "1px auto var(--accent-background)",
    interactiveFilter: "brightness(150%)",
  };
function eS(e) {
  return `
  --foreground: ${e.foreground};
  --background: ${e.background};
  --accent-foreground: ${e.accentForeground};
  --accent-background: ${e.accentBackground};
  --success-color: ${e.successColor};
  --error-color: ${e.errorColor};
  --border: ${e.border};
  --box-shadow: ${e.boxShadow};
  --outline: ${e.outline};
  --interactive-filter: ${e.interactiveFilter};
  `;
}
function tS({ colorScheme: e, themeDark: t, themeLight: n, styleNonce: r }) {
  let o = Te.createElement("style");
  return (
    (o.textContent = `
:host {
  --font-family: system-ui, 'Helvetica Neue', Arial, sans-serif;
  --font-size: 14px;
  --z-index: 100000;

  --page-margin: 16px;
  --inset: auto 0 0 auto;
  --actor-inset: var(--inset);

  font-family: var(--font-family);
  font-size: var(--font-size);

  ${e !== "system" ? `color-scheme: only ${e};` : ""}

  ${eS(e === "dark" ? { ...Zg, ...t } : { ...sN, ...n })}
}

${
  e === "system"
    ? `
@media (prefers-color-scheme: dark) {
  :host {
    color-scheme: only dark;

    ${eS({ ...Zg, ...t })}
  }
}`
    : ""
}
`),
    r && o.setAttribute("nonce", r),
    o
  );
}
var Zc =
  ({
    lazyLoadIntegration: e,
    getModalIntegration: t,
    getScreenshotIntegration: n,
  }) =>
  ({
    id: o = "sentry-feedback",
    autoInject: i = !0,
    showBranding: s = !0,
    isEmailRequired: a = !1,
    isNameRequired: c = !1,
    showEmail: u = !0,
    showName: f = !0,
    enableScreenshot: l = !0,
    useSentryUser: d = { email: "email", name: "username" },
    tags: p,
    styleNonce: m,
    scriptNonce: h,
    colorScheme: g = "system",
    themeLight: S = {},
    themeDark: T = {},
    addScreenshotButtonLabel: x = qv,
    cancelButtonLabel: A = Lv,
    confirmButtonLabel: M = Uv,
    emailLabel: P = Fv,
    emailPlaceholder: E = Bv,
    formTitle: k = Dv,
    isRequiredLabel: z = zv,
    messageLabel: R = Gv,
    messagePlaceholder: U = Hv,
    nameLabel: w = Wv,
    namePlaceholder: D = $v,
    removeScreenshotButtonLabel: G = Yv,
    submitButtonLabel: oe = Pv,
    successMessageText: ae = jv,
    triggerLabel: W = hS,
    triggerAriaLabel: O = "",
    highlightToolText: j = Vv,
    hideToolText: B = Kv,
    removeHighlightText: se = Jv,
    errorEmptyMessageText: ce = gS,
    errorNoClientText: ge = SS,
    errorTimeoutText: Ce = ES,
    errorForbiddenText: Gt = TS,
    errorGenericText: nn = yS,
    onFormOpen: sr,
    onFormClose: Pr,
    onSubmitSuccess: _a,
    onSubmitError: Ur,
    onFormSubmitted: ha,
  } = {}) => {
    let Fn = {
        id: o,
        autoInject: i,
        showBranding: s,
        isEmailRequired: a,
        isNameRequired: c,
        showEmail: u,
        showName: f,
        enableScreenshot: l,
        useSentryUser: d,
        tags: p,
        styleNonce: m,
        scriptNonce: h,
        colorScheme: g,
        themeDark: T,
        themeLight: S,
        triggerLabel: W,
        triggerAriaLabel: O,
        cancelButtonLabel: A,
        submitButtonLabel: oe,
        confirmButtonLabel: M,
        formTitle: k,
        emailLabel: P,
        emailPlaceholder: E,
        messageLabel: R,
        messagePlaceholder: U,
        nameLabel: w,
        namePlaceholder: D,
        successMessageText: ae,
        isRequiredLabel: z,
        addScreenshotButtonLabel: x,
        removeScreenshotButtonLabel: G,
        highlightToolText: j,
        hideToolText: B,
        removeHighlightText: se,
        errorEmptyMessageText: ce,
        errorNoClientText: ge,
        errorTimeoutText: Ce,
        errorForbiddenText: Gt,
        errorGenericText: nn,
        onFormClose: Pr,
        onFormOpen: sr,
        onSubmitError: Ur,
        onSubmitSuccess: _a,
        onFormSubmitted: ha,
      },
      $t = null,
      St = null,
      wt = [],
      xo = (H) => {
        if (!$t) {
          let fe = Te.createElement("div");
          (fe.id = String(H.id)),
            Te.body.appendChild(fe),
            ($t = fe.attachShadow({ mode: "open" })),
            (St = tS(H)),
            $t.appendChild(St);
        }
        return $t;
      },
      ko = async (H) => {
        let fe = H.enableScreenshot && tN(),
          Q,
          pe;
        try {
          (Q = (t ? t() : await e("feedbackModalIntegration", h))()), Yo(Q);
        } catch {
          throw (
            (Yc &&
              _.error(
                "[Feedback] Error when trying to load feedback integrations. Try using `feedbackSyncIntegration` in your `Sentry.init`.",
              ),
            new Error("[Feedback] Missing feedback modal integration!"))
          );
        }
        try {
          let Hr = fe
            ? n
              ? n()
              : await e("feedbackScreenshotIntegration", h)
            : void 0;
          Hr && ((pe = Hr()), Yo(pe));
        } catch {
          Yc &&
            _.error(
              "[Feedback] Missing feedback screenshot integration. Proceeding without screenshots.",
            );
        }
        let K = {
            ERROR_EMPTY_MESSAGE: H.errorEmptyMessageText,
            ERROR_NO_CLIENT: H.errorNoClientText,
            ERROR_TIMEOUT: H.errorTimeoutText,
            ERROR_FORBIDDEN: H.errorForbiddenText,
            ERROR_GENERIC: H.errorGenericText,
          },
          yn = (Hr, Oy) =>
            IS(Hr, { includeReplay: !0, ...Oy, errorMessages: K }),
          Fr = Q.createDialog({
            options: {
              ...H,
              onFormClose: () => {
                Fr?.close(), H.onFormClose?.();
              },
              onFormSubmitted: () => {
                Fr?.close(), H.onFormSubmitted?.();
              },
            },
            screenshotIntegration: pe,
            sendFeedback: yn,
            shadow: xo(H),
          });
        return Fr;
      },
      Dr = (H, fe = {}) => {
        let Q = Wc(Fn, fe),
          pe =
            typeof H == "string"
              ? Te.querySelector(H)
              : typeof H.addEventListener == "function"
                ? H
                : null;
        if (!pe)
          throw (
            (Yc && _.error("[Feedback] Unable to attach to target element"),
            new Error("Unable to attach to target element"))
          );
        let K = null,
          yn = async () => {
            K ||
              (K = await ko({
                ...Q,
                onFormSubmitted: () => {
                  K?.removeFromDom(), Q.onFormSubmitted?.();
                },
              })),
              K.appendToDom(),
              K.open();
          };
        pe.addEventListener("click", yn);
        let Fr = () => {
          (wt = wt.filter((Hr) => Hr !== Fr)),
            K?.removeFromDom(),
            (K = null),
            pe.removeEventListener("click", yn);
        };
        return wt.push(Fr), Fr;
      },
      Br = (H = {}) => {
        let fe = Wc(Fn, H),
          Q = xo(fe),
          pe = iN({
            triggerLabel: fe.triggerLabel,
            triggerAriaLabel: fe.triggerAriaLabel,
            shadow: Q,
            styleNonce: m,
          });
        return (
          Dr(pe.el, {
            ...fe,
            onFormOpen() {
              pe.hide();
            },
            onFormClose() {
              pe.show();
            },
            onFormSubmitted() {
              pe.show();
            },
          }),
          pe
        );
      };
    return {
      name: "Feedback",
      setupOnce() {
        !ot() ||
          !Fn.autoInject ||
          (Te.readyState === "loading"
            ? Te.addEventListener("DOMContentLoaded", () => Br().appendToDom())
            : Br().appendToDom());
      },
      attachTo: Dr,
      createWidget(H = {}) {
        let fe = Br(Wc(Fn, H));
        return fe.appendToDom(), fe;
      },
      async createForm(H = {}) {
        return ko(Wc(Fn, H));
      },
      setTheme(H) {
        if (((Fn.colorScheme = H), $t)) {
          let fe = tS(Fn);
          St ? $t.replaceChild(fe, St) : $t.prepend(fe), (St = fe);
        }
      },
      remove() {
        $t && ($t.parentElement?.remove(), ($t = null), (St = null)),
          wt.forEach((H) => H()),
          (wt = []);
      },
    };
  };
function aN() {
  return I()?.getIntegrationByName("Feedback");
}
var eu,
  Ie,
  AS,
  lo,
  nS,
  RS,
  $f,
  Fs = {},
  qf = [],
  cN = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
  Yf = Array.isArray;
function xr(e, t) {
  for (var n in t) e[n] = t[n];
  return e;
}
function vS(e) {
  var t = e.parentNode;
  t && t.removeChild(e);
}
function re(e, t, n) {
  var r,
    o,
    i,
    s = {};
  for (i in t)
    i == "key" ? (r = t[i]) : i == "ref" ? (o = t[i]) : (s[i] = t[i]);
  if (
    (arguments.length > 2 &&
      (s.children = arguments.length > 3 ? eu.call(arguments, 2) : n),
    typeof e == "function" && e.defaultProps != null)
  )
    for (i in e.defaultProps) s[i] === void 0 && (s[i] = e.defaultProps[i]);
  return Vc(e, s, r, o, null);
}
function Vc(e, t, n, r, o) {
  var i = {
    type: e,
    props: t,
    key: n,
    ref: r,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: o ?? ++AS,
    __i: -1,
    __u: 0,
  };
  return o == null && Ie.vnode != null && Ie.vnode(i), i;
}
function Hs(e) {
  return e.children;
}
function Kc(e, t) {
  (this.props = e), (this.context = t);
}
function _i(e, t) {
  if (t == null) return e.__ ? _i(e.__, e.__i + 1) : null;
  for (var n; t < e.__k.length; t++)
    if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
  return typeof e.type == "function" ? _i(e) : null;
}
function uN(e, t, n) {
  var r,
    o = e.__v,
    i = o.__e,
    s = e.__P;
  if (s)
    return (
      ((r = xr({}, o)).__v = o.__v + 1),
      Ie.vnode && Ie.vnode(r),
      Vf(
        s,
        r,
        o,
        e.__n,
        s.ownerSVGElement !== void 0,
        32 & o.__u ? [i] : null,
        t,
        i ?? _i(o),
        !!(32 & o.__u),
        n,
      ),
      (r.__.__k[r.__i] = r),
      (r.__d = void 0),
      r.__e != i && NS(r),
      r
    );
}
function NS(e) {
  var t, n;
  if ((e = e.__) != null && e.__c != null) {
    for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
      if ((n = e.__k[t]) != null && n.__e != null) {
        e.__e = e.__c.base = n.__e;
        break;
      }
    return NS(e);
  }
}
function rS(e) {
  ((!e.__d && (e.__d = !0) && lo.push(e) && !Qc.__r++) ||
    nS !== Ie.debounceRendering) &&
    ((nS = Ie.debounceRendering) || RS)(Qc);
}
function Qc() {
  var e,
    t,
    n,
    r = [],
    o = [];
  for (lo.sort($f); (e = lo.shift()); )
    e.__d &&
      ((n = lo.length),
      (t = uN(e, r, o) || t),
      n === 0 || lo.length > n
        ? (Wf(r, t, o), (o.length = r.length = 0), (t = void 0), lo.sort($f))
        : t && Ie.__c && Ie.__c(t, qf));
  t && Wf(r, t, o), (Qc.__r = 0);
}
function CS(e, t, n, r, o, i, s, a, c, u, f) {
  var l,
    d,
    p,
    m,
    h,
    g = (r && r.__k) || qf,
    S = t.length;
  for (n.__d = c, lN(n, t, g), c = n.__d, l = 0; l < S; l++)
    (p = n.__k[l]) != null &&
      typeof p != "boolean" &&
      typeof p != "function" &&
      ((d = p.__i === -1 ? Fs : g[p.__i] || Fs),
      (p.__i = l),
      Vf(e, p, d, o, i, s, a, c, u, f),
      (m = p.__e),
      p.ref &&
        d.ref != p.ref &&
        (d.ref && Kf(d.ref, null, p), f.push(p.ref, p.__c || m, p)),
      h == null && m != null && (h = m),
      65536 & p.__u || d.__k === p.__k
        ? (c = xS(p, c, e))
        : typeof p.type == "function" && p.__d !== void 0
          ? (c = p.__d)
          : m && (c = m.nextSibling),
      (p.__d = void 0),
      (p.__u &= -196609));
  (n.__d = c), (n.__e = h);
}
function lN(e, t, n) {
  var r,
    o,
    i,
    s,
    a,
    c = t.length,
    u = n.length,
    f = u,
    l = 0;
  for (e.__k = [], r = 0; r < c; r++)
    (o = e.__k[r] =
      (o = t[r]) == null || typeof o == "boolean" || typeof o == "function"
        ? null
        : typeof o == "string" ||
            typeof o == "number" ||
            typeof o == "bigint" ||
            o.constructor == String
          ? Vc(null, o, null, null, o)
          : Yf(o)
            ? Vc(Hs, { children: o }, null, null, null)
            : o.constructor === void 0 && o.__b > 0
              ? Vc(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v)
              : o) != null
      ? ((o.__ = e),
        (o.__b = e.__b + 1),
        (a = fN(o, n, (s = r + l), f)),
        (o.__i = a),
        (i = null),
        a !== -1 && (f--, (i = n[a]) && (i.__u |= 131072)),
        i == null || i.__v === null
          ? (a == -1 && l--, typeof o.type != "function" && (o.__u |= 65536))
          : a !== s &&
            (a === s + 1
              ? l++
              : a > s
                ? f > c - s
                  ? (l += a - s)
                  : l--
                : (l = a < s && a == s - 1 ? a - s : 0),
            a !== r + l && (o.__u |= 65536)))
      : (i = n[r]) &&
        i.key == null &&
        i.__e &&
        (i.__e == e.__d && (e.__d = _i(i)), jf(i, i, !1), (n[r] = null), f--);
  if (f)
    for (r = 0; r < u; r++)
      (i = n[r]) != null &&
        (131072 & i.__u) == 0 &&
        (i.__e == e.__d && (e.__d = _i(i)), jf(i, i));
}
function xS(e, t, n) {
  var r, o;
  if (typeof e.type == "function") {
    for (r = e.__k, o = 0; r && o < r.length; o++)
      r[o] && ((r[o].__ = e), (t = xS(r[o], t, n)));
    return t;
  }
  e.__e != t && (n.insertBefore(e.__e, t || null), (t = e.__e));
  do t = t && t.nextSibling;
  while (t != null && t.nodeType === 8);
  return t;
}
function fN(e, t, n, r) {
  var o = e.key,
    i = e.type,
    s = n - 1,
    a = n + 1,
    c = t[n];
  if (c === null || (c && o == c.key && i === c.type)) return n;
  if (r > (c != null && (131072 & c.__u) == 0 ? 1 : 0))
    for (; s >= 0 || a < t.length; ) {
      if (s >= 0) {
        if ((c = t[s]) && (131072 & c.__u) == 0 && o == c.key && i === c.type)
          return s;
        s--;
      }
      if (a < t.length) {
        if ((c = t[a]) && (131072 & c.__u) == 0 && o == c.key && i === c.type)
          return a;
        a++;
      }
    }
  return -1;
}
function oS(e, t, n) {
  t[0] === "-"
    ? e.setProperty(t, n ?? "")
    : (e[t] =
        n == null ? "" : typeof n != "number" || cN.test(t) ? n : n + "px");
}
function jc(e, t, n, r, o) {
  var i;
  e: if (t === "style")
    if (typeof n == "string") e.style.cssText = n;
    else {
      if ((typeof r == "string" && (e.style.cssText = r = ""), r))
        for (t in r) (n && t in n) || oS(e.style, t, "");
      if (n) for (t in n) (r && n[t] === r[t]) || oS(e.style, t, n[t]);
    }
  else if (t[0] === "o" && t[1] === "n")
    (i = t !== (t = t.replace(/(PointerCapture)$|Capture$/i, "$1"))),
      (t = t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2)),
      e.l || (e.l = {}),
      (e.l[t + i] = n),
      n
        ? r
          ? (n.u = r.u)
          : ((n.u = Date.now()), e.addEventListener(t, i ? sS : iS, i))
        : e.removeEventListener(t, i ? sS : iS, i);
  else {
    if (o) t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (
      t !== "width" &&
      t !== "height" &&
      t !== "href" &&
      t !== "list" &&
      t !== "form" &&
      t !== "tabIndex" &&
      t !== "download" &&
      t !== "rowSpan" &&
      t !== "colSpan" &&
      t !== "role" &&
      t in e
    )
      try {
        e[t] = n ?? "";
        break e;
      } catch {}
    typeof n == "function" ||
      (n == null || (n === !1 && t[4] !== "-")
        ? e.removeAttribute(t)
        : e.setAttribute(t, n));
  }
}
function iS(e) {
  if (this.l) {
    var t = this.l[e.type + !1];
    if (e.t) {
      if (e.t <= t.u) return;
    } else e.t = Date.now();
    return t(Ie.event ? Ie.event(e) : e);
  }
}
function sS(e) {
  if (this.l) return this.l[e.type + !0](Ie.event ? Ie.event(e) : e);
}
function Vf(e, t, n, r, o, i, s, a, c, u) {
  var f,
    l,
    d,
    p,
    m,
    h,
    g,
    S,
    T,
    x,
    A,
    M,
    P,
    E,
    k,
    z = t.type;
  if (t.constructor !== void 0) return null;
  128 & n.__u && ((c = !!(32 & n.__u)), (i = [(a = t.__e = n.__e)])),
    (f = Ie.__b) && f(t);
  e: if (typeof z == "function")
    try {
      if (
        ((S = t.props),
        (T = (f = z.contextType) && r[f.__c]),
        (x = f ? (T ? T.props.value : f.__) : r),
        n.__c
          ? (g = (l = t.__c = n.__c).__ = l.__E)
          : ("prototype" in z && z.prototype.render
              ? (t.__c = l = new z(S, x))
              : ((t.__c = l = new Kc(S, x)),
                (l.constructor = z),
                (l.render = dN)),
            T && T.sub(l),
            (l.props = S),
            l.state || (l.state = {}),
            (l.context = x),
            (l.__n = r),
            (d = l.__d = !0),
            (l.__h = []),
            (l._sb = [])),
        l.__s == null && (l.__s = l.state),
        z.getDerivedStateFromProps != null &&
          (l.__s == l.state && (l.__s = xr({}, l.__s)),
          xr(l.__s, z.getDerivedStateFromProps(S, l.__s))),
        (p = l.props),
        (m = l.state),
        (l.__v = t),
        d)
      )
        z.getDerivedStateFromProps == null &&
          l.componentWillMount != null &&
          l.componentWillMount(),
          l.componentDidMount != null && l.__h.push(l.componentDidMount);
      else {
        if (
          (z.getDerivedStateFromProps == null &&
            S !== p &&
            l.componentWillReceiveProps != null &&
            l.componentWillReceiveProps(S, x),
          !l.__e &&
            ((l.shouldComponentUpdate != null &&
              l.shouldComponentUpdate(S, l.__s, x) === !1) ||
              t.__v === n.__v))
        ) {
          for (
            t.__v !== n.__v && ((l.props = S), (l.state = l.__s), (l.__d = !1)),
              t.__e = n.__e,
              t.__k = n.__k,
              t.__k.forEach(function (R) {
                R && (R.__ = t);
              }),
              A = 0;
            A < l._sb.length;
            A++
          )
            l.__h.push(l._sb[A]);
          (l._sb = []), l.__h.length && s.push(l);
          break e;
        }
        l.componentWillUpdate != null && l.componentWillUpdate(S, l.__s, x),
          l.componentDidUpdate != null &&
            l.__h.push(function () {
              l.componentDidUpdate(p, m, h);
            });
      }
      if (
        ((l.context = x),
        (l.props = S),
        (l.__P = e),
        (l.__e = !1),
        (M = Ie.__r),
        (P = 0),
        "prototype" in z && z.prototype.render)
      ) {
        for (
          l.state = l.__s,
            l.__d = !1,
            M && M(t),
            f = l.render(l.props, l.state, l.context),
            E = 0;
          E < l._sb.length;
          E++
        )
          l.__h.push(l._sb[E]);
        l._sb = [];
      } else
        do
          (l.__d = !1),
            M && M(t),
            (f = l.render(l.props, l.state, l.context)),
            (l.state = l.__s);
        while (l.__d && ++P < 25);
      (l.state = l.__s),
        l.getChildContext != null && (r = xr(xr({}, r), l.getChildContext())),
        d ||
          l.getSnapshotBeforeUpdate == null ||
          (h = l.getSnapshotBeforeUpdate(p, m)),
        CS(
          e,
          Yf(
            (k =
              f != null && f.type === Hs && f.key == null
                ? f.props.children
                : f),
          )
            ? k
            : [k],
          t,
          n,
          r,
          o,
          i,
          s,
          a,
          c,
          u,
        ),
        (l.base = t.__e),
        (t.__u &= -161),
        l.__h.length && s.push(l),
        g && (l.__E = l.__ = null);
    } catch (R) {
      (t.__v = null),
        c || i != null
          ? ((t.__e = a), (t.__u |= c ? 160 : 32), (i[i.indexOf(a)] = null))
          : ((t.__e = n.__e), (t.__k = n.__k)),
        Ie.__e(R, t, n);
    }
  else
    i == null && t.__v === n.__v
      ? ((t.__k = n.__k), (t.__e = n.__e))
      : (t.__e = pN(n.__e, t, n, r, o, i, s, c, u));
  (f = Ie.diffed) && f(t);
}
function Wf(e, t, n) {
  for (var r = 0; r < n.length; r++) Kf(n[r], n[++r], n[++r]);
  Ie.__c && Ie.__c(t, e),
    e.some(function (o) {
      try {
        (e = o.__h),
          (o.__h = []),
          e.some(function (i) {
            i.call(o);
          });
      } catch (i) {
        Ie.__e(i, o.__v);
      }
    });
}
function pN(e, t, n, r, o, i, s, a, c) {
  var u,
    f,
    l,
    d,
    p,
    m,
    h,
    g = n.props,
    S = t.props,
    T = t.type;
  if ((T === "svg" && (o = !0), i != null)) {
    for (u = 0; u < i.length; u++)
      if (
        (p = i[u]) &&
        "setAttribute" in p == !!T &&
        (T ? p.localName === T : p.nodeType === 3)
      ) {
        (e = p), (i[u] = null);
        break;
      }
  }
  if (e == null) {
    if (T === null) return document.createTextNode(S);
    (e = o
      ? document.createElementNS("http://www.w3.org/2000/svg", T)
      : document.createElement(T, S.is && S)),
      (i = null),
      (a = !1);
  }
  if (T === null) g === S || (a && e.data === S) || (e.data = S);
  else {
    if (
      ((i = i && eu.call(e.childNodes)), (g = n.props || Fs), !a && i != null)
    )
      for (g = {}, u = 0; u < e.attributes.length; u++)
        g[(p = e.attributes[u]).name] = p.value;
    for (u in g)
      (p = g[u]),
        u == "children" ||
          (u == "dangerouslySetInnerHTML"
            ? (l = p)
            : u === "key" || u in S || jc(e, u, null, p, o));
    for (u in S)
      (p = S[u]),
        u == "children"
          ? (d = p)
          : u == "dangerouslySetInnerHTML"
            ? (f = p)
            : u == "value"
              ? (m = p)
              : u == "checked"
                ? (h = p)
                : u === "key" ||
                  (a && typeof p != "function") ||
                  g[u] === p ||
                  jc(e, u, p, g[u], o);
    if (f)
      a ||
        (l && (f.__html === l.__html || f.__html === e.innerHTML)) ||
        (e.innerHTML = f.__html),
        (t.__k = []);
    else if (
      (l && (e.innerHTML = ""),
      CS(
        e,
        Yf(d) ? d : [d],
        t,
        n,
        r,
        o && T !== "foreignObject",
        i,
        s,
        i ? i[0] : n.__k && _i(n, 0),
        a,
        c,
      ),
      i != null)
    )
      for (u = i.length; u--; ) i[u] != null && vS(i[u]);
    a ||
      ((u = "value"),
      m !== void 0 &&
        (m !== e[u] ||
          (T === "progress" && !m) ||
          (T === "option" && m !== g[u])) &&
        jc(e, u, m, g[u], !1),
      (u = "checked"),
      h !== void 0 && h !== e[u] && jc(e, u, h, g[u], !1));
  }
  return e;
}
function Kf(e, t, n) {
  try {
    typeof e == "function" ? e(t) : (e.current = t);
  } catch (r) {
    Ie.__e(r, n);
  }
}
function jf(e, t, n) {
  var r, o;
  if (
    (Ie.unmount && Ie.unmount(e),
    (r = e.ref) && ((r.current && r.current !== e.__e) || Kf(r, null, t)),
    (r = e.__c) != null)
  ) {
    if (r.componentWillUnmount)
      try {
        r.componentWillUnmount();
      } catch (i) {
        Ie.__e(i, t);
      }
    (r.base = r.__P = null), (e.__c = void 0);
  }
  if ((r = e.__k))
    for (o = 0; o < r.length; o++)
      r[o] && jf(r[o], t, n || typeof e.type != "function");
  n || e.__e == null || vS(e.__e), (e.__ = e.__e = e.__d = void 0);
}
function dN(e, t, n) {
  return this.constructor(e, n);
}
function mN(e, t, n) {
  var r, o, i, s;
  Ie.__ && Ie.__(e, t),
    (o = (r = !1) ? null : t.__k),
    (i = []),
    (s = []),
    Vf(
      t,
      (e = t.__k = re(Hs, null, [e])),
      o || Fs,
      Fs,
      t.ownerSVGElement !== void 0,
      o ? null : t.firstChild ? eu.call(t.childNodes) : null,
      i,
      o ? o.__e : t.firstChild,
      r,
      s,
    ),
    (e.__d = void 0),
    Wf(i, e, s);
}
(eu = qf.slice),
  (Ie = {
    __e: function (e, t, n, r) {
      for (var o, i, s; (t = t.__); )
        if ((o = t.__c) && !o.__)
          try {
            if (
              ((i = o.constructor) &&
                i.getDerivedStateFromError != null &&
                (o.setState(i.getDerivedStateFromError(e)), (s = o.__d)),
              o.componentDidCatch != null &&
                (o.componentDidCatch(e, r || {}), (s = o.__d)),
              s)
            )
              return (o.__E = o);
          } catch (a) {
            e = a;
          }
      throw e;
    },
  }),
  (AS = 0),
  (Kc.prototype.setState = function (e, t) {
    var n;
    (n =
      this.__s != null && this.__s !== this.state
        ? this.__s
        : (this.__s = xr({}, this.state))),
      typeof e == "function" && (e = e(xr({}, n), this.props)),
      e && xr(n, e),
      e != null && this.__v && (t && this._sb.push(t), rS(this));
  }),
  (Kc.prototype.forceUpdate = function (e) {
    this.__v && ((this.__e = !0), e && this.__h.push(e), rS(this));
  }),
  (Kc.prototype.render = Hs),
  (lo = []),
  (RS =
    typeof Promise == "function"
      ? Promise.prototype.then.bind(Promise.resolve())
      : setTimeout),
  ($f = function (e, t) {
    return e.__v.__b - t.__v.__b;
  }),
  (Qc.__r = 0);
var Zn,
  ye,
  Df,
  aS,
  hi = 0,
  kS = [],
  Jc = [],
  Oe = Ie,
  cS = Oe.__b,
  uS = Oe.__r,
  lS = Oe.diffed,
  fS = Oe.__c,
  pS = Oe.unmount,
  dS = Oe.__;
function po(e, t) {
  Oe.__h && Oe.__h(ye, e, hi || t), (hi = 0);
  var n = ye.__H || (ye.__H = { __: [], __h: [] });
  return e >= n.__.length && n.__.push({ __V: Jc }), n.__[e];
}
function fo(e) {
  return (hi = 1), wS(MS, e);
}
function wS(e, t, n) {
  var r = po(Zn++, 2);
  if (
    ((r.t = e),
    !r.__c &&
      ((r.__ = [
        n ? n(t) : MS(void 0, t),
        function (a) {
          var c = r.__N ? r.__N[0] : r.__[0],
            u = r.t(c, a);
          c !== u && ((r.__N = [u, r.__[1]]), r.__c.setState({}));
        },
      ]),
      (r.__c = ye),
      !ye.u))
  ) {
    var o = function (a, c, u) {
      if (!r.__c.__H) return !0;
      var f = r.__c.__H.__.filter(function (d) {
        return !!d.__c;
      });
      if (
        f.every(function (d) {
          return !d.__N;
        })
      )
        return !i || i.call(this, a, c, u);
      var l = !1;
      return (
        f.forEach(function (d) {
          if (d.__N) {
            var p = d.__[0];
            (d.__ = d.__N), (d.__N = void 0), p !== d.__[0] && (l = !0);
          }
        }),
        !(!l && r.__c.props === a) && (!i || i.call(this, a, c, u))
      );
    };
    ye.u = !0;
    var i = ye.shouldComponentUpdate,
      s = ye.componentWillUpdate;
    (ye.componentWillUpdate = function (a, c, u) {
      if (this.__e) {
        var f = i;
        (i = void 0), o(a, c, u), (i = f);
      }
      s && s.call(this, a, c, u);
    }),
      (ye.shouldComponentUpdate = o);
  }
  return r.__N || r.__;
}
function _N(e, t) {
  var n = po(Zn++, 3);
  !Oe.__s && Jf(n.__H, t) && ((n.__ = e), (n.i = t), ye.__H.__h.push(n));
}
function OS(e, t) {
  var n = po(Zn++, 4);
  !Oe.__s && Jf(n.__H, t) && ((n.__ = e), (n.i = t), ye.__h.push(n));
}
function hN(e) {
  return (
    (hi = 5),
    Gs(function () {
      return { current: e };
    }, [])
  );
}
function gN(e, t, n) {
  (hi = 6),
    OS(
      function () {
        return typeof e == "function"
          ? (e(t()),
            function () {
              return e(null);
            })
          : e
            ? ((e.current = t()),
              function () {
                return (e.current = null);
              })
            : void 0;
      },
      n == null ? n : n.concat(e),
    );
}
function Gs(e, t) {
  var n = po(Zn++, 7);
  return Jf(n.__H, t) ? ((n.__V = e()), (n.i = t), (n.__h = e), n.__V) : n.__;
}
function mi(e, t) {
  return (
    (hi = 8),
    Gs(function () {
      return e;
    }, t)
  );
}
function SN(e) {
  var t = ye.context[e.__c],
    n = po(Zn++, 9);
  return (
    (n.c = e),
    t ? (n.__ == null && ((n.__ = !0), t.sub(ye)), t.props.value) : e.__
  );
}
function EN(e, t) {
  Oe.useDebugValue && Oe.useDebugValue(t ? t(e) : e);
}
function TN(e) {
  var t = po(Zn++, 10),
    n = fo();
  return (
    (t.__ = e),
    ye.componentDidCatch ||
      (ye.componentDidCatch = function (r, o) {
        t.__ && t.__(r, o), n[1](r);
      }),
    [
      n[0],
      function () {
        n[1](void 0);
      },
    ]
  );
}
function yN() {
  var e = po(Zn++, 11);
  if (!e.__) {
    for (var t = ye.__v; t !== null && !t.__m && t.__ !== null; ) t = t.__;
    var n = t.__m || (t.__m = [0, 0]);
    e.__ = "P" + n[0] + "-" + n[1]++;
  }
  return e.__;
}
function IN() {
  for (var e; (e = kS.shift()); )
    if (e.__P && e.__H)
      try {
        e.__H.__h.forEach(Xc), e.__H.__h.forEach(zf), (e.__H.__h = []);
      } catch (t) {
        (e.__H.__h = []), Oe.__e(t, e.__v);
      }
}
(Oe.__b = function (e) {
  (ye = null), cS && cS(e);
}),
  (Oe.__ = function (e, t) {
    t.__k && t.__k.__m && (e.__m = t.__k.__m), dS && dS(e, t);
  }),
  (Oe.__r = function (e) {
    uS && uS(e), (Zn = 0);
    var t = (ye = e.__c).__H;
    t &&
      (Df === ye
        ? ((t.__h = []),
          (ye.__h = []),
          t.__.forEach(function (n) {
            n.__N && (n.__ = n.__N), (n.__V = Jc), (n.__N = n.i = void 0);
          }))
        : (t.__h.forEach(Xc), t.__h.forEach(zf), (t.__h = []), (Zn = 0))),
      (Df = ye);
  }),
  (Oe.diffed = function (e) {
    lS && lS(e);
    var t = e.__c;
    t &&
      t.__H &&
      (t.__H.__h.length &&
        ((kS.push(t) !== 1 && aS === Oe.requestAnimationFrame) ||
          ((aS = Oe.requestAnimationFrame) || bN)(IN)),
      t.__H.__.forEach(function (n) {
        n.i && (n.__H = n.i),
          n.__V !== Jc && (n.__ = n.__V),
          (n.i = void 0),
          (n.__V = Jc);
      })),
      (Df = ye = null);
  }),
  (Oe.__c = function (e, t) {
    t.some(function (n) {
      try {
        n.__h.forEach(Xc),
          (n.__h = n.__h.filter(function (r) {
            return !r.__ || zf(r);
          }));
      } catch (r) {
        t.some(function (o) {
          o.__h && (o.__h = []);
        }),
          (t = []),
          Oe.__e(r, n.__v);
      }
    }),
      fS && fS(e, t);
  }),
  (Oe.unmount = function (e) {
    pS && pS(e);
    var t,
      n = e.__c;
    n &&
      n.__H &&
      (n.__H.__.forEach(function (r) {
        try {
          Xc(r);
        } catch (o) {
          t = o;
        }
      }),
      (n.__H = void 0),
      t && Oe.__e(t, n.__v));
  });
var mS = typeof requestAnimationFrame == "function";
function bN(e) {
  var t,
    n = function () {
      clearTimeout(r), mS && cancelAnimationFrame(t), setTimeout(e);
    },
    r = setTimeout(n, 100);
  mS && (t = requestAnimationFrame(n));
}
function Xc(e) {
  var t = ye,
    n = e.__c;
  typeof n == "function" && ((e.__c = void 0), n()), (ye = t);
}
function zf(e) {
  var t = ye;
  (e.__c = e.__()), (ye = t);
}
function Jf(e, t) {
  return (
    !e ||
    e.length !== t.length ||
    t.some(function (n, r) {
      return n !== e[r];
    })
  );
}
function MS(e, t) {
  return typeof t == "function" ? t(e) : t;
}
var AN = Object.defineProperty(
    {
      __proto__: null,
      useCallback: mi,
      useContext: SN,
      useDebugValue: EN,
      useEffect: _N,
      useErrorBoundary: TN,
      useId: yN,
      useImperativeHandle: gN,
      useLayoutEffect: OS,
      useMemo: Gs,
      useReducer: wS,
      useRef: hN,
      useState: fo,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
  RN = "http://www.w3.org/2000/svg";
function vN() {
  let e = (r) => Te.createElementNS(RN, r),
    t = Ft(e("svg"), {
      width: "32",
      height: "30",
      viewBox: "0 0 72 66",
      fill: "inherit",
    }),
    n = Ft(e("path"), {
      transform: "translate(11, 11)",
      d: "M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z",
    });
  return t.appendChild(n), t;
}
function NN({ options: e }) {
  let t = Gs(() => ({ __html: vN().outerHTML }), []);
  return re(
    "h2",
    { class: "dialog__header" },
    re("span", { class: "dialog__title" }, e.formTitle),
    e.showBranding
      ? re("a", {
          class: "brand-link",
          target: "_blank",
          href: "https://sentry.io/welcome/",
          title: "Powered by Sentry",
          rel: "noopener noreferrer",
          dangerouslySetInnerHTML: t,
        })
      : null,
  );
}
function CN(e, t) {
  let n = [];
  return (
    t.isNameRequired && !e.name && n.push(t.nameLabel),
    t.isEmailRequired && !e.email && n.push(t.emailLabel),
    e.message || n.push(t.messageLabel),
    n
  );
}
function Bf(e, t) {
  let n = e.get(t);
  return typeof n == "string" ? n.trim() : "";
}
function xN({
  options: e,
  defaultEmail: t,
  defaultName: n,
  onFormClose: r,
  onSubmit: o,
  onSubmitSuccess: i,
  onSubmitError: s,
  showEmail: a,
  showName: c,
  screenshotInput: u,
}) {
  let {
      tags: f,
      addScreenshotButtonLabel: l,
      removeScreenshotButtonLabel: d,
      cancelButtonLabel: p,
      emailLabel: m,
      emailPlaceholder: h,
      isEmailRequired: g,
      isNameRequired: S,
      messageLabel: T,
      messagePlaceholder: x,
      nameLabel: A,
      namePlaceholder: M,
      submitButtonLabel: P,
      isRequiredLabel: E,
    } = e,
    [k, z] = fo(!1),
    [R, U] = fo(null),
    [w, D] = fo(!1),
    G = u?.input,
    [oe, ae] = fo(null),
    W = mi((B) => {
      ae(B), D(!1);
    }, []),
    O = mi(
      (B) => {
        let se = CN(B, {
          emailLabel: m,
          isEmailRequired: g,
          isNameRequired: S,
          messageLabel: T,
          nameLabel: A,
        });
        return (
          se.length > 0
            ? U(
                `Please enter in the following required fields: ${se.join(", ")}`,
              )
            : U(null),
          se.length === 0
        );
      },
      [m, g, S, T, A],
    ),
    j = mi(
      async (B) => {
        z(!0);
        try {
          if ((B.preventDefault(), !(B.target instanceof HTMLFormElement)))
            return;
          let se = new FormData(B.target),
            ce = await (u && w ? u.value() : void 0),
            ge = {
              name: Bf(se, "name"),
              email: Bf(se, "email"),
              message: Bf(se, "message"),
              attachments: ce ? [ce] : void 0,
            };
          if (!O(ge)) return;
          try {
            let Ce = await o(
              {
                name: ge.name,
                email: ge.email,
                message: ge.message,
                source: Xv,
                tags: f,
              },
              { attachments: ge.attachments },
            );
            i(ge, Ce);
          } catch (Ce) {
            Yc && _.error(Ce);
            let Gt = Ce instanceof Error ? Ce : new Error(String(Ce));
            U(Gt.message), s(Gt);
          }
        } finally {
          z(!1);
        }
      },
      [u && w, i, s],
    );
  return re(
    "form",
    { class: "form", onSubmit: j },
    G && w ? re(G, { onError: W }) : null,
    re(
      "fieldset",
      { class: "form__right", "data-sentry-feedback": !0, disabled: k },
      re(
        "div",
        { class: "form__top" },
        R ? re("div", { class: "form__error-container" }, R) : null,
        c
          ? re(
              "label",
              { for: "name", class: "form__label" },
              re(Ff, { label: A, isRequiredLabel: E, isRequired: S }),
              re("input", {
                class: "form__input",
                defaultValue: n,
                id: "name",
                name: "name",
                placeholder: M,
                required: S,
                type: "text",
              }),
            )
          : re("input", {
              "aria-hidden": !0,
              value: n,
              name: "name",
              type: "hidden",
            }),
        a
          ? re(
              "label",
              { for: "email", class: "form__label" },
              re(Ff, { label: m, isRequiredLabel: E, isRequired: g }),
              re("input", {
                class: "form__input",
                defaultValue: t,
                id: "email",
                name: "email",
                placeholder: h,
                required: g,
                type: "email",
              }),
            )
          : re("input", {
              "aria-hidden": !0,
              value: t,
              name: "email",
              type: "hidden",
            }),
        re(
          "label",
          { for: "message", class: "form__label" },
          re(Ff, { label: T, isRequiredLabel: E, isRequired: !0 }),
          re("textarea", {
            autoFocus: !0,
            class: "form__input form__input--textarea",
            id: "message",
            name: "message",
            placeholder: x,
            required: !0,
            rows: 5,
          }),
        ),
        G
          ? re(
              "label",
              { for: "screenshot", class: "form__label" },
              re(
                "button",
                {
                  class: "btn btn--default",
                  disabled: k,
                  type: "button",
                  onClick: () => {
                    ae(null), D((B) => !B);
                  },
                },
                w ? d : l,
              ),
              oe
                ? re("div", { class: "form__error-container" }, oe.message)
                : null,
            )
          : null,
      ),
      re(
        "div",
        { class: "btn-group" },
        re(
          "button",
          { class: "btn btn--primary", disabled: k, type: "submit" },
          P,
        ),
        re(
          "button",
          {
            class: "btn btn--default",
            disabled: k,
            type: "button",
            onClick: r,
          },
          p,
        ),
      ),
    ),
  );
}
function Ff({ label: e, isRequired: t, isRequiredLabel: n }) {
  return re(
    "span",
    { class: "form__label__text" },
    e,
    t && re("span", { class: "form__label__text--required" }, n),
  );
}
var zc = 16,
  _S = 17,
  kN = "http://www.w3.org/2000/svg";
function wN() {
  let e = (c) => Sn.document.createElementNS(kN, c),
    t = Ft(e("svg"), {
      width: `${zc}`,
      height: `${_S}`,
      viewBox: `0 0 ${zc} ${_S}`,
      fill: "inherit",
    }),
    n = Ft(e("g"), { clipPath: "url(#clip0_57_156)" }),
    r = Ft(e("path"), {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M3.55544 15.1518C4.87103 16.0308 6.41775 16.5 8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.91775 15.5308 5.37103 14.6518 4.05544C13.7727 2.73985 12.5233 1.71447 11.0615 1.10897C9.59966 0.503466 7.99113 0.34504 6.43928 0.653721C4.88743 0.962403 3.46197 1.72433 2.34315 2.84315C1.22433 3.96197 0.462403 5.38743 0.153721 6.93928C-0.15496 8.49113 0.00346625 10.0997 0.608967 11.5615C1.21447 13.0233 2.23985 14.2727 3.55544 15.1518ZM4.40546 3.1204C5.46945 2.40946 6.72036 2.03 8 2.03C9.71595 2.03 11.3616 2.71166 12.575 3.92502C13.7883 5.13838 14.47 6.78405 14.47 8.5C14.47 9.77965 14.0905 11.0306 13.3796 12.0945C12.6687 13.1585 11.6582 13.9878 10.476 14.4775C9.29373 14.9672 7.99283 15.0953 6.73777 14.8457C5.48271 14.596 4.32987 13.9798 3.42502 13.075C2.52018 12.1701 1.90397 11.0173 1.65432 9.76224C1.40468 8.50718 1.5328 7.20628 2.0225 6.02404C2.5122 4.8418 3.34148 3.83133 4.40546 3.1204Z",
    }),
    o = Ft(e("path"), {
      d: "M6.68775 12.4297C6.78586 12.4745 6.89218 12.4984 7 12.5C7.11275 12.4955 7.22315 12.4664 7.32337 12.4145C7.4236 12.3627 7.51121 12.2894 7.58 12.2L12 5.63999C12.0848 5.47724 12.1071 5.28902 12.0625 5.11098C12.0178 4.93294 11.9095 4.77744 11.7579 4.67392C11.6064 4.57041 11.4221 4.52608 11.24 4.54931C11.0579 4.57254 10.8907 4.66173 10.77 4.79999L6.88 10.57L5.13 8.56999C5.06508 8.49566 4.98613 8.43488 4.89768 8.39111C4.80922 8.34735 4.713 8.32148 4.61453 8.31498C4.51605 8.30847 4.41727 8.32147 4.32382 8.35322C4.23038 8.38497 4.14413 8.43484 4.07 8.49999C3.92511 8.63217 3.83692 8.81523 3.82387 9.01092C3.81083 9.2066 3.87393 9.39976 4 9.54999L6.43 12.24C6.50187 12.3204 6.58964 12.385 6.68775 12.4297Z",
    });
  t.appendChild(n).append(o, r);
  let i = e("defs"),
    s = Ft(e("clipPath"), { id: "clip0_57_156" }),
    a = Ft(e("rect"), {
      width: `${zc}`,
      height: `${zc}`,
      fill: "white",
      transform: "translate(0 0.5)",
    });
  return (
    s.appendChild(a),
    i.appendChild(s),
    t.appendChild(i).appendChild(s).appendChild(a),
    t
  );
}
function ON({ open: e, onFormSubmitted: t, ...n }) {
  let r = n.options,
    o = Gs(() => ({ __html: wN().outerHTML }), []),
    [i, s] = fo(null),
    a = mi(() => {
      i && (clearTimeout(i), s(null)), t();
    }, [i]),
    c = mi(
      (u, f) => {
        n.onSubmitSuccess(u, f),
          s(
            setTimeout(() => {
              t(), s(null);
            }, Zv),
          );
      },
      [t],
    );
  return re(
    Hs,
    null,
    i
      ? re(
          "div",
          { class: "success__position", onClick: a },
          re(
            "div",
            { class: "success__content" },
            r.successMessageText,
            re("span", { class: "success__icon", dangerouslySetInnerHTML: o }),
          ),
        )
      : re(
          "dialog",
          { class: "dialog", onClick: r.onFormClose, open: e },
          re(
            "div",
            { class: "dialog__position" },
            re(
              "div",
              {
                class: "dialog__content",
                onClick: (u) => {
                  u.stopPropagation();
                },
              },
              re(NN, { options: r }),
              re(xN, { ...n, onSubmitSuccess: c }),
            ),
          ),
        ),
  );
}
var MN = `
.dialog {
  position: fixed;
  z-index: var(--z-index);
  margin: 0;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 100vh;
  width: 100vw;

  color: var(--dialog-color, var(--foreground));
  fill: var(--dialog-color, var(--foreground));
  line-height: 1.75em;

  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  inset: 0;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.dialog__position {
  position: fixed;
  z-index: var(--z-index);
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  display: flex;
  max-height: calc(100vh - (2 * var(--page-margin)));
}
@media (max-width: 600px) {
  .dialog__position {
    inset: var(--page-margin);
    padding: 0;
  }
}

.dialog__position:has(.editor) {
  inset: var(--page-margin);
  padding: 0;
}

.dialog:not([open]) {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
.dialog:not([open]) .dialog__content {
  transform: translate(0, -16px) scale(0.98);
}

.dialog__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: var(--dialog-padding, 24px);
  max-width: 100%;
  width: 100%;
  max-height: 100%;
  overflow: auto;

  background: var(--dialog-background, var(--background));
  border-radius: var(--dialog-border-radius, 20px);
  border: var(--dialog-border, var(--border));
  box-shadow: var(--dialog-box-shadow, var(--box-shadow));
  transform: translate(0, 0) scale(1);
  transition: transform 0.2s ease-in-out;
}

`,
  LN = `
.dialog__header {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  font-weight: var(--dialog-header-weight, 600);
  margin: 0;
}
.dialog__title {
  align-self: center;
  width: var(--form-width, 272px);
}

@media (max-width: 600px) {
  .dialog__title {
    width: auto;
  }
}

.dialog__position:has(.editor) .dialog__title {
  width: auto;
}


.brand-link {
  display: inline-flex;
}
.brand-link:focus-visible {
  outline: var(--outline);
}
`,
  PN = `
.form {
  display: flex;
  overflow: auto;
  flex-direction: row;
  gap: 16px;
  flex: 1 0;
}

.form fieldset {
  border: none;
  margin: 0;
  padding: 0;
}

.form__right {
  flex: 0 0 auto;
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  width: var(--form-width, 100%);
}

.dialog__position:has(.editor) .form__right {
  width: var(--form-width, 272px);
}

.form__top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form__error-container {
  color: var(--error-color);
  fill: var(--error-color);
}

.form__label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0px;
}

.form__label__text {
  display: flex;
  gap: 4px;
  align-items: center;
}

.form__label__text--required {
  font-size: 0.85em;
}

.form__input {
  font-family: inherit;
  line-height: inherit;
  background: transparent;
  box-sizing: border-box;
  border: var(--input-border, var(--border));
  border-radius: var(--input-border-radius, 6px);
  color: var(--input-color, inherit);
  fill: var(--input-color, inherit);
  font-size: var(--input-font-size, inherit);
  font-weight: var(--input-font-weight, 500);
  padding: 6px 12px;
}

.form__input::placeholder {
  opacity: 0.65;
  color: var(--input-placeholder-color, inherit);
  filter: var(--interactive-filter);
}

.form__input:focus-visible {
  outline: var(--input-focus-outline, var(--outline));
}

.form__input--textarea {
  font-family: inherit;
  resize: vertical;
}

.error {
  color: var(--error-color);
  fill: var(--error-color);
}
`,
  UN = `
.btn-group {
  display: grid;
  gap: 8px;
}

.btn {
  line-height: inherit;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--button-font-size, inherit);
  font-weight: var(--button-font-weight, 600);
  padding: var(--button-padding, 6px 16px);
}
.btn[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

.btn--primary {
  color: var(--button-primary-color, var(--accent-foreground));
  fill: var(--button-primary-color, var(--accent-foreground));
  background: var(--button-primary-background, var(--accent-background));
  border: var(--button-primary-border, var(--border));
  border-radius: var(--button-primary-border-radius, 6px);
  font-weight: var(--button-primary-font-weight, 500);
}
.btn--primary:hover {
  color: var(--button-primary-hover-color, var(--accent-foreground));
  fill: var(--button-primary-hover-color, var(--accent-foreground));
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
}
.btn--primary:focus-visible {
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
  outline: var(--button-primary-focus-outline, var(--outline));
}

.btn--default {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-background, var(--background));
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  font-weight: var(--button-font-weight, 500);
}
.btn--default:hover {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
}
.btn--default:focus-visible {
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
  outline: var(--button-focus-outline, var(--outline));
}
`,
  DN = `
.success__position {
  position: fixed;
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  z-index: var(--z-index);
}
.success__content {
  background: var(--success-background, var(--background));
  border: var(--success-border, var(--border));
  border-radius: var(--success-border-radius, 1.7em/50%);
  box-shadow: var(--success-box-shadow, var(--box-shadow));
  font-weight: var(--success-font-weight, 600);
  color: var(--success-color);
  fill: var(--success-color);
  padding: 12px 24px;
  line-height: 1.75em;

  display: grid;
  align-items: center;
  grid-auto-flow: column;
  gap: 6px;
  cursor: default;
}

.success__icon {
  display: flex;
}
`;
function BN(e) {
  let t = Te.createElement("style");
  return (
    (t.textContent = `
:host {
  --dialog-inset: var(--inset);
}

${MN}
${LN}
${PN}
${UN}
${DN}
`),
    e && t.setAttribute("nonce", e),
    t
  );
}
function FN() {
  let e = C().getUser(),
    t = te().getUser(),
    n = un().getUser();
  return e && Object.keys(e).length ? e : t && Object.keys(t).length ? t : n;
}
var LS = () => ({
  name: "FeedbackModal",
  setupOnce() {},
  createDialog: ({
    options: e,
    screenshotIntegration: t,
    sendFeedback: n,
    shadow: r,
  }) => {
    let o = r,
      i = e.useSentryUser,
      s = FN(),
      a = Te.createElement("div"),
      c = BN(e.styleNonce),
      u = "",
      f = {
        get el() {
          return a;
        },
        appendToDom() {
          !o.contains(c) &&
            !o.contains(a) &&
            (o.appendChild(c), o.appendChild(a));
        },
        removeFromDom() {
          a.remove(), c.remove(), (Te.body.style.overflow = u);
        },
        open() {
          d(!0),
            e.onFormOpen?.(),
            I()?.emit("openFeedbackWidget"),
            (u = Te.body.style.overflow),
            (Te.body.style.overflow = "hidden");
        },
        close() {
          d(!1), (Te.body.style.overflow = u);
        },
      },
      l = t?.createInput({ h: re, hooks: AN, dialog: f, options: e }),
      d = (p) => {
        mN(
          re(ON, {
            options: e,
            screenshotInput: l,
            showName: e.showName || e.isNameRequired,
            showEmail: e.showEmail || e.isEmailRequired,
            defaultName: String((i && s?.[i.name]) || ""),
            defaultEmail: String((i && s?.[i.email]) || ""),
            onFormClose: () => {
              d(!1), e.onFormClose?.();
            },
            onSubmit: n,
            onSubmitSuccess: (m, h) => {
              d(!1), e.onSubmitSuccess?.(m, h);
            },
            onSubmitError: (m) => {
              e.onSubmitError?.(m);
            },
            onFormSubmitted: () => {
              e.onFormSubmitted?.();
            },
            open: p,
          }),
          a,
        );
      };
    return f;
  },
});
function HN({ h: e }) {
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
function GN(e) {
  let t = Te.createElement("style"),
    n = "#1A141F",
    r = "#302735";
  return (
    (t.textContent = `
.editor {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.editor__image-container {
  justify-items: center;
  padding: 15px;
  position: relative;
  height: 100%;
  border-radius: var(--menu-border-radius, 6px);

  background-color: ${n};
  background-image: repeating-linear-gradient(
      -145deg,
      transparent,
      transparent 8px,
      ${n} 8px,
      ${n} 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 15px,
      ${r} 15px,
      ${r} 16px
    );
}

.editor__canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor__canvas-container > * {
  object-fit: contain;
  position: absolute;
}

.editor__tool-container {
  padding-top: 8px;
  display: flex;
  justify-content: center;
}

.editor__tool-bar {
  display: flex;
  gap: 8px;
}

.editor__tool {
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  background: var(--button-background, var(--background));
  color: var(--button-color, var(--foreground));
}

.editor__tool--active {
  background: var(--button-primary-background, var(--accent-background));
  color: var(--button-primary-color, var(--accent-foreground));
}

.editor__rect {
  position: absolute;
  z-index: 2;
}

.editor__rect button {
  opacity: 0;
  position: absolute;
  top: -12px;
  right: -12px;
  cursor: pointer;
  padding: 0;
  z-index: 3;
  border: none;
  background: none;
}

.editor__rect:hover button {
  opacity: 1;
}
`),
    e && t.setAttribute("nonce", e),
    t
  );
}
function $N({ h: e }) {
  return function ({ action: n, setAction: r, options: o }) {
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
            class: `editor__tool ${n === "highlight" ? "editor__tool--active" : ""}`,
            onClick: () => {
              r(n === "highlight" ? "" : "highlight");
            },
          },
          o.highlightToolText,
        ),
        e(
          "button",
          {
            type: "button",
            class: `editor__tool ${n === "hide" ? "editor__tool--active" : ""}`,
            onClick: () => {
              r(n === "hide" ? "" : "hide");
            },
          },
          o.hideToolText,
        ),
      ),
    );
  };
}
function WN({ hooks: e }) {
  function t() {
    let [n, r] = e.useState(Sn.devicePixelRatio ?? 1);
    return (
      e.useEffect(() => {
        let o = () => {
            r(Sn.devicePixelRatio);
          },
          i = matchMedia(`(resolution: ${Sn.devicePixelRatio}dppx)`);
        return (
          i.addEventListener("change", o),
          () => {
            i.removeEventListener("change", o);
          }
        );
      }, []),
      n
    );
  }
  return function ({
    onBeforeScreenshot: r,
    onScreenshot: o,
    onAfterScreenshot: i,
    onError: s,
  }) {
    let a = t();
    e.useEffect(() => {
      (async () => {
        r();
        let u = await Bs.mediaDevices.getDisplayMedia({
            video: { width: Sn.innerWidth * a, height: Sn.innerHeight * a },
            audio: !1,
            monitorTypeSurfaces: "exclude",
            preferCurrentTab: !0,
            selfBrowserSurface: "include",
            surfaceSwitching: "exclude",
          }),
          f = Te.createElement("video");
        await new Promise((l, d) => {
          (f.srcObject = u),
            (f.onloadedmetadata = () => {
              o(f, a), u.getTracks().forEach((p) => p.stop()), l();
            }),
            f.play().catch(d);
        }),
          i();
      })().catch(s);
    }, []);
  };
}
function jN(e, t, n) {
  switch (e.type) {
    case "highlight": {
      (t.shadowColor = "rgba(0, 0, 0, 0.7)"),
        (t.shadowBlur = 50),
        (t.fillStyle = n),
        t.fillRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2),
        t.clearRect(e.x, e.y, e.w, e.h);
      break;
    }
    case "hide":
      (t.fillStyle = "rgb(0, 0, 0)"), t.fillRect(e.x, e.y, e.w, e.h);
      break;
  }
}
function Cr(e, t, n) {
  if (!e) return;
  let r = e.getContext("2d", t);
  r && n(e, r);
}
function Hf(e, t) {
  Cr(e, { alpha: !0 }, (n, r) => {
    r.drawImage(t, 0, 0, t.width, t.height, 0, 0, n.width, n.height);
  });
}
function Gf(e, t, n) {
  Cr(e, { alpha: !0 }, (r, o) => {
    n.length &&
      ((o.fillStyle = "rgba(0, 0, 0, 0.25)"),
      o.fillRect(0, 0, r.width, r.height)),
      n.forEach((i) => {
        jN(i, o, t);
      });
  });
}
function zN({ h: e, hooks: t, outputBuffer: n, dialog: r, options: o }) {
  let i = WN({ hooks: t }),
    s = $N({ h: e }),
    a = HN({ h: e }),
    c = { __html: GN(o.styleNonce).innerText },
    u = r.el.style,
    f = ({ screenshot: l }) => {
      let [d, p] = t.useState("highlight"),
        [m, h] = t.useState([]),
        g = t.useRef(null),
        S = t.useRef(null),
        T = t.useRef(null),
        x = t.useRef(null),
        [A, M] = t.useState(1),
        P = t.useMemo(() => {
          let w = Te.getElementById(o.id);
          if (!w) return "white";
          let D = getComputedStyle(w);
          return (
            D.getPropertyValue("--button-primary-background") ||
            D.getPropertyValue("--accent-background")
          );
        }, [o.id]);
      t.useLayoutEffect(() => {
        let w = () => {
          let D = g.current;
          D &&
            (Cr(l.canvas, { alpha: !1 }, (G) => {
              let oe = Math.min(
                D.clientWidth / G.width,
                D.clientHeight / G.height,
              );
              M(oe);
            }),
            (D.clientHeight === 0 || D.clientWidth === 0) && setTimeout(w, 0));
        };
        return (
          w(),
          Sn.addEventListener("resize", w),
          () => {
            Sn.removeEventListener("resize", w);
          }
        );
      }, [l]);
      let E = t.useCallback(
        (w, D) => {
          Cr(w, { alpha: !0 }, (G, oe) => {
            oe.scale(D, D),
              (G.width = l.canvas.width),
              (G.height = l.canvas.height);
          });
        },
        [l],
      );
      t.useEffect(() => {
        E(S.current, l.dpi), Hf(S.current, l.canvas);
      }, [l]),
        t.useEffect(() => {
          E(T.current, l.dpi),
            Cr(T.current, { alpha: !0 }, (w, D) => {
              D.clearRect(0, 0, w.width, w.height);
            }),
            Gf(T.current, P, m);
        }, [m, P]),
        t.useEffect(() => {
          E(n, l.dpi),
            Hf(n, l.canvas),
            Cr(Te.createElement("canvas"), { alpha: !0 }, (w, D) => {
              D.scale(l.dpi, l.dpi),
                (w.width = l.canvas.width),
                (w.height = l.canvas.height),
                Gf(w, P, m),
                Hf(n, w);
            });
        }, [m, l, P]);
      let k = (w) => {
          if (!d || !x.current) return;
          let D = x.current.getBoundingClientRect(),
            G = { type: d, x: w.offsetX / A, y: w.offsetY / A },
            oe = (O, j) => {
              let B = (j.clientX - D.x) / A,
                se = (j.clientY - D.y) / A;
              return {
                type: O.type,
                x: Math.min(O.x, B),
                y: Math.min(O.y, se),
                w: Math.abs(B - O.x),
                h: Math.abs(se - O.y),
              };
            },
            ae = (O) => {
              Cr(T.current, { alpha: !0 }, (j, B) => {
                B.clearRect(0, 0, j.width, j.height);
              }),
                Gf(T.current, P, [...m, oe(G, O)]);
            },
            W = (O) => {
              let j = oe(G, O);
              j.w * A >= 1 && j.h * A >= 1 && h((B) => [...B, j]),
                Te.removeEventListener("mousemove", ae),
                Te.removeEventListener("mouseup", W);
            };
          Te.addEventListener("mousemove", ae),
            Te.addEventListener("mouseup", W);
        },
        z = t.useCallback(
          (w) => (D) => {
            D.preventDefault(),
              D.stopPropagation(),
              h((G) => {
                let oe = [...G];
                return oe.splice(w, 1), oe;
              });
          },
          [],
        ),
        R = {
          width: `${l.canvas.width * A}px`,
          height: `${l.canvas.height * A}px`,
        },
        U = (w) => {
          w.stopPropagation();
        };
      return e(
        "div",
        { class: "editor" },
        e("style", { nonce: o.styleNonce, dangerouslySetInnerHTML: c }),
        e(
          "div",
          { class: "editor__image-container" },
          e(
            "div",
            { class: "editor__canvas-container", ref: g },
            e("canvas", { ref: S, id: "background", style: R }),
            e("canvas", { ref: T, id: "foreground", style: R }),
            e(
              "div",
              { ref: x, onMouseDown: k, style: R },
              m.map((w, D) =>
                e(
                  "div",
                  {
                    key: D,
                    class: "editor__rect",
                    style: {
                      top: `${w.y * A}px`,
                      left: `${w.x * A}px`,
                      width: `${w.w * A}px`,
                      height: `${w.h * A}px`,
                    },
                  },
                  e(
                    "button",
                    {
                      "aria-label": o.removeHighlightText,
                      onClick: z(D),
                      onMouseDown: U,
                      onMouseUp: U,
                      type: "button",
                    },
                    e(a, null),
                  ),
                ),
              ),
            ),
          ),
        ),
        e(s, { options: o, action: d, setAction: p }),
      );
    };
  return function ({ onError: d }) {
    let [p, m] = t.useState();
    return (
      i({
        onBeforeScreenshot: t.useCallback(() => {
          u.display = "none";
        }, []),
        onScreenshot: t.useCallback((h, g) => {
          Cr(Te.createElement("canvas"), { alpha: !1 }, (S, T) => {
            T.scale(g, g),
              (S.width = h.videoWidth),
              (S.height = h.videoHeight),
              T.drawImage(h, 0, 0, S.width, S.height),
              m({ canvas: S, dpi: g });
          }),
            (n.width = h.videoWidth),
            (n.height = h.videoHeight);
        }, []),
        onAfterScreenshot: t.useCallback(() => {
          u.display = "block";
        }, []),
        onError: t.useCallback((h) => {
          (u.display = "block"), d(h);
        }, []),
      }),
      p ? e(f, { screenshot: p }) : e("div", null)
    );
  };
}
var PS = () => ({
  name: "FeedbackScreenshot",
  setupOnce() {},
  createInput: ({ h: e, hooks: t, dialog: n, options: r }) => {
    let o = Te.createElement("canvas");
    return {
      input: zN({ h: e, hooks: t, outputBuffer: o, dialog: n, options: r }),
      value: async () => {
        let i = await new Promise((s) => {
          o.toBlob(s, "image/png");
        });
        if (i)
          return {
            data: new Uint8Array(await i.arrayBuffer()),
            filename: "screenshot.png",
            contentType: "application/png",
          };
      },
    };
  },
});
var N = v,
  Xf = 0;
function Qf() {
  return Xf > 0;
}
function qN() {
  Xf++,
    setTimeout(() => {
      Xf--;
    });
}
function mo(e, t = {}) {
  function n(o) {
    return typeof o == "function";
  }
  if (!n(e)) return e;
  try {
    if (Object.prototype.hasOwnProperty.call(e, "__sentry_wrapped__")) {
      let i = e.__sentry_wrapped__;
      return typeof i == "function" ? i : e;
    }
    if (lr(e)) return e;
  } catch {
    return e;
  }
  let r = function (...o) {
    v._sentryWrappedDepth = (v._sentryWrappedDepth || 0) + 1;
    try {
      let i = o.map((s) => mo(s, t));
      return e.apply(this, i);
    } catch (i) {
      throw (
        (qN(),
        De((s) => {
          s.addEventProcessor(
            (a) => (
              t.mechanism && (jr(a, void 0, void 0), Ye(a, t.mechanism)),
              (a.extra = { ...a.extra, arguments: o }),
              a
            ),
          ),
            X(i);
        }),
        i)
      );
    } finally {
      v._sentryWrappedDepth = (v._sentryWrappedDepth || 0) - 1;
    }
  };
  try {
    for (let o in e)
      Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
  } catch {}
  Vi(r, e), de(e, "__sentry_wrapped__", r);
  try {
    Object.getOwnPropertyDescriptor(r, "name").configurable &&
      Object.defineProperty(r, "name", {
        get() {
          return e.name;
        },
      });
  } catch {}
  return r;
}
function gi() {
  let e = at(),
    { referrer: t } = N.document || {},
    { userAgent: n } = N.navigator || {},
    r = { ...(t && { Referer: t }), ...(n && { "User-Agent": n }) };
  return { url: e, headers: r };
}
var YN = [
    "replayIntegration",
    "replayCanvasIntegration",
    "feedbackIntegration",
    "feedbackModalIntegration",
    "feedbackScreenshotIntegration",
    "captureConsoleIntegration",
    "contextLinesIntegration",
    "linkedErrorsIntegration",
    "dedupeIntegration",
    "extraErrorDataIntegration",
    "graphqlClientIntegration",
    "httpClientIntegration",
    "reportingObserverIntegration",
    "rewriteFramesIntegration",
    "browserProfilingIntegration",
    "moduleMetadataIntegration",
    "instrumentAnthropicAiClient",
    "instrumentOpenAiClient",
    "instrumentGoogleGenAIClient",
    "instrumentLangGraph",
    "createLangChainCallbackHandler",
    "instrumentLangChainEmbeddings",
  ],
  VN = {
    replayCanvasIntegration: "replay-canvas",
    feedbackModalIntegration: "feedback-modal",
    feedbackScreenshotIntegration: "feedback-screenshot",
  };
function KN(e) {
  return VN[e] || e.replace("Integration", "").toLowerCase();
}
var US = N;
async function Zf(e, t) {
  let n = YN.includes(e) ? KN(e) : void 0,
    r = (US.Sentry = US.Sentry || {});
  if (!n) throw new Error(`Cannot lazy load integration: ${e}`);
  let o = r[e];
  if (typeof o == "function" && !("_isShim" in o)) return o;
  let i = JN(n),
    s = N.document.createElement("script");
  (s.src = i),
    (s.crossOrigin = "anonymous"),
    (s.referrerPolicy = "strict-origin"),
    t && s.setAttribute("nonce", t);
  let a = new Promise((l, d) => {
      s.addEventListener("load", () => l()), s.addEventListener("error", d);
    }),
    c = N.document.currentScript,
    u = N.document.body || N.document.head || c?.parentElement;
  if (u) u.appendChild(s);
  else
    throw new Error(
      `Could not find parent element to insert lazy-loaded ${e} script`,
    );
  try {
    await a;
  } catch {
    throw new Error(`Error when loading integration: ${e}`);
  }
  let f = r[e];
  if (typeof f != "function")
    throw new Error(`Could not load integration: ${e}`);
  return f;
}
function JN(e) {
  let n = I()?.getOptions()?.cdnBaseUrl || "https://browser.sentry-cdn.com";
  return new URL(`/${Ot}/${e}.min.js`, n).toString();
}
var XN = Zc({ lazyLoadIntegration: Zf });
var DS = Zc({
  getModalIntegration: () => LS,
  getScreenshotIntegration: () => PS,
});
function $s(e, t) {
  let n = tu(e, t),
    r = { type: nC(t), value: rC(t) };
  return (
    n.length && (r.stacktrace = { frames: n }),
    r.type === void 0 &&
      r.value === "" &&
      (r.value = "Unrecoverable error caught"),
    r
  );
}
function QN(e, t, n, r) {
  let i = I()?.getOptions().normalizeDepth,
    s = sC(t),
    a = { __serialized__: Ji(t, i) };
  if (s) return { exception: { values: [$s(e, s)] }, extra: a };
  let c = {
    exception: {
      values: [
        {
          type: ur(t) ? t.constructor.name : r ? "UnhandledRejection" : "Error",
          value: oC(t, { isUnhandledRejection: r }),
        },
      ],
    },
    extra: a,
  };
  if (n) {
    let u = tu(e, n);
    u.length && (c.exception.values[0].stacktrace = { frames: u });
  }
  return c;
}
function ep(e, t) {
  return { exception: { values: [$s(e, t)] } };
}
function tu(e, t) {
  let n = t.stacktrace || t.stack || "",
    r = eC(t),
    o = tC(t);
  try {
    return e(n, r, o);
  } catch {}
  return [];
}
var ZN = /Minified React error #\d+;/i;
function eC(e) {
  return e && ZN.test(e.message) ? 1 : 0;
}
function tC(e) {
  return typeof e.framesToPop == "number" ? e.framesToPop : 0;
}
function BS(e) {
  return typeof WebAssembly < "u" && typeof WebAssembly.Exception < "u"
    ? e instanceof WebAssembly.Exception
    : !1;
}
function nC(e) {
  let t = e?.name;
  return !t && BS(e)
    ? e.message && Array.isArray(e.message) && e.message.length == 2
      ? e.message[0]
      : "WebAssembly.Exception"
    : t;
}
function rC(e) {
  let t = e?.message;
  return BS(e)
    ? Array.isArray(e.message) && e.message.length == 2
      ? e.message[1]
      : "wasm exception"
    : t
      ? t.error && typeof t.error.message == "string"
        ? Sc(t.error)
        : Sc(e)
      : "No error message";
}
function np(e, t, n, r) {
  let o = n?.syntheticException || void 0,
    i = Si(e, t, o, r);
  return (
    Ye(i), (i.level = "error"), n?.event_id && (i.event_id = n.event_id), vn(i)
  );
}
function rp(e, t, n = "info", r, o) {
  let i = r?.syntheticException || void 0,
    s = tp(e, t, i, o);
  return (s.level = n), r?.event_id && (s.event_id = r.event_id), vn(s);
}
function Si(e, t, n, r, o) {
  let i;
  if (Oo(t) && t.error) return ep(e, t.error);
  if (qi(t) || Ea(t)) {
    let s = t;
    if ("stack" in t) {
      i = ep(e, t);
      let a = i.exception?.values?.[0];
      if (r && n && a && !a.stacktrace) {
        let c = tu(e, n);
        c.length && ((a.stacktrace = { frames: c }), Ye(i, { synthetic: !0 }));
      }
    } else {
      let a = s.name || (qi(s) ? "DOMError" : "DOMException"),
        c = s.message ? `${a}: ${s.message}` : a;
      (i = tp(e, c, n, r)), jr(i, c);
    }
    return (
      "code" in s && (i.tags = { ...i.tags, "DOMException.code": `${s.code}` }),
      i
    );
  }
  return Je(t)
    ? ep(e, t)
    : ve(t) || ur(t)
      ? ((i = QN(e, t, n, o)), Ye(i, { synthetic: !0 }), i)
      : ((i = tp(e, t, n, r)),
        jr(i, `${t}`, void 0),
        Ye(i, { synthetic: !0 }),
        i);
}
function tp(e, t, n, r) {
  let o = {};
  if (r && n) {
    let i = tu(e, n);
    i.length &&
      (o.exception = { values: [{ value: t, stacktrace: { frames: i } }] }),
      Ye(o, { synthetic: !0 });
  }
  if (In(t)) {
    let { __sentry_template_string__: i, __sentry_template_values__: s } = t;
    return (o.logentry = { message: i, params: s }), o;
  }
  return (o.message = t), o;
}
function oC(e, { isUnhandledRejection: t }) {
  let n = ya(e),
    r = t ? "promise rejection" : "exception";
  return Oo(e)
    ? `Event \`ErrorEvent\` captured as ${r} with message \`${e.message}\``
    : ur(e)
      ? `Event \`${iC(e)}\` (type=${e.type}) captured as ${r}`
      : `Object captured as ${r} with keys: ${n}`;
}
function iC(e) {
  try {
    let t = Object.getPrototypeOf(e);
    return t ? t.constructor.name : void 0;
  } catch {}
}
function sC(e) {
  return Object.values(e).find((t) => t instanceof Error);
}
var Ws = class extends Ns {
  constructor(t) {
    let n = aC(t),
      r = N.SENTRY_SDK_SOURCE || Ql();
    gf(n, "browser", ["browser"], r), super(n);
    let { userInfo: o } = this.getDataCollectionOptions();
    n._metadata?.sdk &&
      (n._metadata.sdk.settings = {
        infer_ip: o ? "auto" : "never",
        ...n._metadata.sdk.settings,
      });
    let {
        sendClientReports: i,
        enableLogs: s,
        _experiments: a,
        enableMetrics: c,
      } = this._options,
      u = c ?? a?.enableMetrics ?? !0;
    N.document &&
      (i || s || u) &&
      N.document.addEventListener("visibilitychange", () => {
        N.document.visibilityState === "hidden" &&
          (i && this._flushOutcomes(), s && eo(this), u && Vo(this));
      }),
      o && this.on("beforeSendSession", hf);
  }
  eventFromException(t, n) {
    return np(this._options.stackParser, t, n, this._options.attachStacktrace);
  }
  eventFromMessage(t, n = "info", r) {
    return rp(
      this._options.stackParser,
      t,
      n,
      r,
      this._options.attachStacktrace,
    );
  }
  _prepareEvent(t, n, r, o) {
    return (
      (t.platform = t.platform || "javascript"), super._prepareEvent(t, n, r, o)
    );
  }
};
function aC(e) {
  return {
    release:
      typeof __SENTRY_RELEASE__ == "string"
        ? __SENTRY_RELEASE__
        : N.SENTRY_RELEASE?.id,
    sendClientReports: !0,
    parentSpanIsAlwaysRootSpan: !0,
    ...e,
  };
}
var Ke = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
var F = v;
var cC = (e, t) =>
    e > t[1] ? "poor" : e > t[0] ? "needs-improvement" : "good",
  Pn = (e, t, n, r) => {
    let o, i;
    return (s) => {
      t.value >= 0 &&
        (s || r) &&
        ((i = t.value - (o ?? 0)),
        (i || o === void 0) &&
          ((o = t.value), (t.delta = i), (t.rating = cC(t.value, n)), e(t)));
    };
  };
var er = (e = !0) => {
  let t = F.performance?.getEntriesByType?.("navigation")[0];
  if (!e || (t && t.responseStart > 0 && t.responseStart < performance.now()))
    return t;
};
var Xt = () => er()?.activationStart ?? 0;
function Qt(e, t, n) {
  F.document && F.addEventListener(e, t, n);
}
function _o(e, t, n) {
  F.document && F.removeEventListener(e, t, n);
}
var Ei = -1,
  FS = new Set(),
  uC = () =>
    F.document?.visibilityState === "hidden" && !F.document?.prerendering
      ? 0
      : 1 / 0,
  nu = (e) => {
    if (lC(e) && Ei > -1) {
      if (e.type === "visibilitychange" || e.type === "pagehide")
        for (let t of FS) t();
      isFinite(Ei) ||
        ((Ei = e.type === "visibilitychange" ? e.timeStamp : 0),
        _o("prerenderingchange", nu, !0));
    }
  },
  Un = () => {
    if (F.document && Ei < 0) {
      let e = Xt();
      (Ei =
        (F.document.prerendering
          ? void 0
          : globalThis.performance
              .getEntriesByType("visibility-state")
              .filter((n) => n.name === "hidden" && n.startTime > e)[0]
              ?.startTime) ?? uC()),
        Qt("visibilitychange", nu, !0),
        Qt("pagehide", nu, !0),
        Qt("prerenderingchange", nu, !0);
    }
    return {
      get firstHiddenTime() {
        return Ei;
      },
      onHidden(e) {
        FS.add(e);
      },
    };
  };
function lC(e) {
  return e.type === "pagehide" || F.document?.visibilityState === "hidden";
}
var HS = () =>
  `v5-${Date.now()}-${Math.floor(Math.random() * 8999999999999) + 1e12}`;
var Dn = (e, t = -1) => {
  let n = er(),
    r = "navigate";
  return (
    n &&
      (F.document?.prerendering || Xt() > 0
        ? (r = "prerender")
        : F.document?.wasDiscarded
          ? (r = "restore")
          : n.type && (r = n.type.replace(/_/g, "-"))),
    {
      name: e,
      value: t,
      rating: "good",
      delta: 0,
      entries: [],
      id: HS(),
      navigationType: r,
    }
  );
};
var op = new WeakMap();
function Ti(e, t) {
  try {
    return op.get(e) || op.set(e, new t()), op.get(e);
  } catch {
    return new t();
  }
}
var ru = class {
  constructor() {
    (this._sessionValue = 0), (this._sessionEntries = []);
  }
  _processEntry(t) {
    if (t.hadRecentInput) return;
    let n = this._sessionEntries[0],
      r = this._sessionEntries[this._sessionEntries.length - 1];
    this._sessionValue &&
    n &&
    r &&
    t.startTime - r.startTime < 1e3 &&
    t.startTime - n.startTime < 5e3
      ? ((this._sessionValue += t.value), this._sessionEntries.push(t))
      : ((this._sessionValue = t.value), (this._sessionEntries = [t])),
      this._onAfterProcessingUnexpectedShift?.(t);
  }
};
var Zt = (e, t, n = {}) => {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(e)) {
      let r = new PerformanceObserver((o) => {
        Promise.resolve().then(() => {
          t(o.getEntries());
        });
      });
      return r.observe({ type: e, buffered: !0, ...n }), r;
    }
  } catch {}
};
var yi = (e) => {
  let t = !1;
  return () => {
    t || (e(), (t = !0));
  };
};
var kr = (e) => {
  F.document?.prerendering
    ? addEventListener("prerenderingchange", () => e(), !0)
    : e();
};
var fC = [1800, 3e3],
  GS = (e, t = {}) => {
    kr(() => {
      let n = Un(),
        r = Dn("FCP"),
        o,
        s = Zt("paint", (a) => {
          for (let c of a)
            c.name === "first-contentful-paint" &&
              (s.disconnect(),
              c.startTime < n.firstHiddenTime &&
                ((r.value = Math.max(c.startTime - Xt(), 0)),
                r.entries.push(c),
                o(!0)));
        });
      s && (o = Pn(e, r, fC, t.reportAllChanges));
    });
  };
var pC = [0.1, 0.25],
  $S = (e, t = {}) => {
    GS(
      yi(() => {
        let n = Dn("CLS", 0),
          r,
          o = Un(),
          i = Ti(t, ru),
          s = (c) => {
            for (let u of c) i._processEntry(u);
            i._sessionValue > n.value &&
              ((n.value = i._sessionValue),
              (n.entries = i._sessionEntries),
              r());
          },
          a = Zt("layout-shift", s);
        a &&
          ((r = Pn(e, n, pC, t.reportAllChanges)),
          o.onHidden(() => {
            s(a.takeRecords()), r(!0);
          }),
          F?.setTimeout?.(r));
      }),
    );
  };
var WS = 0,
  ip = 1 / 0,
  ou = 0,
  dC = (e) => {
    e.forEach((t) => {
      t.interactionId &&
        ((ip = Math.min(ip, t.interactionId)),
        (ou = Math.max(ou, t.interactionId)),
        (WS = ou ? (ou - ip) / 7 + 1 : 0));
    });
  },
  sp,
  ap = () => (sp ? WS : performance.interactionCount || 0),
  jS = () => {
    "interactionCount" in performance ||
      sp ||
      (sp = Zt("event", dC, {
        type: "event",
        buffered: !0,
        durationThreshold: 0,
      }));
  };
var cp = 10,
  zS = 0,
  mC = () => ap() - zS,
  iu = class {
    constructor() {
      (this._longestInteractionList = []),
        (this._longestInteractionMap = new Map());
    }
    _resetInteractions() {
      (zS = ap()),
        (this._longestInteractionList.length = 0),
        this._longestInteractionMap.clear();
    }
    _estimateP98LongestInteraction() {
      let t = Math.min(
        this._longestInteractionList.length - 1,
        Math.floor(mC() / 50),
      );
      return this._longestInteractionList[t];
    }
    _processEntry(t) {
      if (
        (this._onBeforeProcessingEntry?.(t),
        !(t.interactionId || t.entryType === "first-input"))
      )
        return;
      let n = this._longestInteractionList.at(-1),
        r = this._longestInteractionMap.get(t.interactionId);
      if (
        r ||
        this._longestInteractionList.length < cp ||
        t.duration > n._latency
      ) {
        if (
          (r
            ? t.duration > r._latency
              ? ((r.entries = [t]), (r._latency = t.duration))
              : t.duration === r._latency &&
                t.startTime === r.entries[0].startTime &&
                r.entries.push(t)
            : ((r = {
                id: t.interactionId,
                entries: [t],
                _latency: t.duration,
              }),
              this._longestInteractionMap.set(r.id, r),
              this._longestInteractionList.push(r)),
          this._longestInteractionList.sort((o, i) => i._latency - o._latency),
          this._longestInteractionList.length > cp)
        ) {
          let o = this._longestInteractionList.splice(cp);
          for (let i of o) this._longestInteractionMap.delete(i.id);
        }
        this._onAfterProcessingINPCandidate?.(r);
      }
    }
  };
var su = (e) => {
  let t = F.requestIdleCallback || F.setTimeout;
  F.document?.visibilityState === "hidden"
    ? e()
    : ((e = yi(e)),
      Qt("visibilitychange", e, { once: !0, capture: !0 }),
      Qt("pagehide", e, { once: !0, capture: !0 }),
      t(() => {
        e(),
          _o("visibilitychange", e, { capture: !0 }),
          _o("pagehide", e, { capture: !0 });
      }));
};
var _C = [200, 500],
  hC = 40,
  qS = (e, t = {}) => {
    if (
      !(
        globalThis.PerformanceEventTiming &&
        "interactionId" in PerformanceEventTiming.prototype
      )
    )
      return;
    let n = Un();
    kr(() => {
      jS();
      let r = Dn("INP"),
        o,
        i = Ti(t, iu),
        s = (c) => {
          su(() => {
            for (let f of c) i._processEntry(f);
            let u = i._estimateP98LongestInteraction();
            u &&
              u._latency !== r.value &&
              ((r.value = u._latency), (r.entries = u.entries), o());
          });
        },
        a = Zt("event", s, { durationThreshold: t.durationThreshold ?? hC });
      (o = Pn(e, r, _C, t.reportAllChanges)),
        a &&
          (a.observe({ type: "first-input", buffered: !0 }),
          n.onHidden(() => {
            s(a.takeRecords()), o(!0);
          }));
    });
  };
var au = class {
  _processEntry(t) {
    this._onBeforeProcessingEntry?.(t);
  }
};
var gC = [2500, 4e3],
  YS = (e, t = {}) => {
    kr(() => {
      let n = Un(),
        r = Dn("LCP"),
        o,
        i = Ti(t, au),
        s = (c) => {
          t.reportAllChanges || (c = c.slice(-1));
          for (let u of c)
            i._processEntry(u),
              u.startTime < n.firstHiddenTime &&
                ((r.value = Math.max(u.startTime - Xt(), 0)),
                (r.entries = [u]),
                o());
        },
        a = Zt("largest-contentful-paint", s);
      if (a) {
        o = Pn(e, r, gC, t.reportAllChanges);
        let c = yi(() => {
            s(a.takeRecords()), a.disconnect(), o(!0);
          }),
          u = (f) => {
            f.isTrusted && (su(c), _o(f.type, u, { capture: !0 }));
          };
        for (let f of ["keydown", "click", "visibilitychange"])
          Qt(f, u, { capture: !0 });
      }
    });
  };
var SC = [800, 1800],
  up = (e) => {
    F.document?.prerendering
      ? kr(() => up(e))
      : F.document?.readyState !== "complete"
        ? addEventListener("load", () => up(e), !0)
        : setTimeout(e);
  },
  VS = (e, t = {}) => {
    let n = Dn("TTFB"),
      r = Pn(e, n, SC, t.reportAllChanges);
    up(() => {
      let o = er();
      o &&
        ((n.value = Math.max(o.responseStart - Xt(), 0)),
        (n.entries = [o]),
        r(!0));
    });
  };
var js = {},
  cu = {},
  KS,
  JS,
  XS,
  QS;
function tr(e, t = !1) {
  return uu("cls", e, EC, KS, t);
}
function nr(e, t = !1) {
  return uu("lcp", e, TC, JS, t);
}
function lp(e) {
  return uu("ttfb", e, yC, XS);
}
function ho(e) {
  return uu("inp", e, IC, QS);
}
function Ct(e, t) {
  return ZS(e, t), cu[e] || (bC(e), (cu[e] = !0)), eE(e, t);
}
function zs(e, t) {
  let n = js[e];
  if (n?.length)
    for (let r of n)
      try {
        r(t);
      } catch (o) {
        Ke &&
          _.error(
            `Error while triggering instrumentation handler.
Type: ${e}
Name: ${ut(r)}
Error:`,
            o,
          );
      }
}
function EC() {
  return $S(
    (e) => {
      zs("cls", { metric: e }), (KS = e);
    },
    { reportAllChanges: !0 },
  );
}
function TC() {
  return YS(
    (e) => {
      zs("lcp", { metric: e }), (JS = e);
    },
    { reportAllChanges: !0 },
  );
}
function yC() {
  return VS((e) => {
    zs("ttfb", { metric: e }), (XS = e);
  });
}
function IC() {
  return qS((e) => {
    zs("inp", { metric: e }), (QS = e);
  });
}
function uu(e, t, n, r, o = !1) {
  ZS(e, t);
  let i;
  return (
    cu[e] || ((i = n()), (cu[e] = !0)),
    r && t({ metric: r }),
    eE(e, t, o ? i : void 0)
  );
}
function bC(e) {
  let t = {};
  e === "event" && (t.durationThreshold = 0),
    Zt(
      e,
      (n) => {
        zs(e, { entries: n });
      },
      t,
    );
}
function ZS(e, t) {
  (js[e] = js[e] || []), js[e].push(t);
}
function eE(e, t, n) {
  return () => {
    n && n();
    let r = js[e];
    if (!r) return;
    let o = r.indexOf(t);
    o !== -1 && r.splice(o, 1);
  };
}
function tE(e) {
  return "duration" in e;
}
var AC = 80,
  go = {};
try {
  typeof Node < "u" &&
    (go.parentNode = Object.getOwnPropertyDescriptor(
      Node.prototype,
      "parentNode",
    ).get),
    typeof Element < "u" &&
      ((go.tagName = Object.getOwnPropertyDescriptor(
        Element.prototype,
        "tagName",
      ).get),
      (go.id = Object.getOwnPropertyDescriptor(Element.prototype, "id").get),
      (go.className = Object.getOwnPropertyDescriptor(
        Element.prototype,
        "className",
      ).get),
      (go.getAttribute = Element.prototype.getAttribute)),
    typeof HTMLElement < "u" &&
      (go.dataset = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "dataset",
      ).get);
} catch {}
function wr(e, t, n) {
  let r = go[t];
  if (r)
    try {
      return r.call(e, n);
    } catch {}
  let o = e[t];
  return typeof o == "function" ? o.call(e, n) : o;
}
function Se(e, t = {}) {
  if (!e) return "<unknown>";
  try {
    let n = e,
      r = 5,
      o = [],
      i = 0,
      s = 0,
      a = " > ",
      c = a.length,
      u,
      f = Array.isArray(t) ? t : t.keyAttrs,
      l = (!Array.isArray(t) && t.maxStringLength) || AC;
    for (
      ;
      n &&
      i++ < r &&
      ((u = RC(n, f)),
      !(u === "html" || (i > 1 && s + o.length * c + u.length >= l)));

    )
      o.push(u), (s += u.length), (n = wr(n, "parentNode"));
    return o.reverse().join(a);
  } catch {
    return "<unknown>";
  }
}
function RC(e, t) {
  let n = [],
    r = wr(e, "tagName");
  if (!r) return "";
  if (typeof HTMLElement < "u" && e instanceof HTMLElement) {
    let i = wr(e, "dataset");
    if (i) {
      if (i.sentryComponent) return i.sentryComponent;
      if (i.sentryElement) return i.sentryElement;
    }
  }
  n.push(r.toLowerCase());
  let o = t?.length
    ? t
        .filter((i) => wr(e, "getAttribute", i))
        .map((i) => [i, wr(e, "getAttribute", i)])
    : null;
  if (o?.length)
    o.forEach((i) => {
      n.push(`[${i[0]}="${i[1]}"]`);
    });
  else {
    let i = wr(e, "id");
    i && n.push(`#${i}`);
    let s = wr(e, "className");
    if (s && je(s)) {
      let a = s.split(/\s+/);
      for (let c of a) n.push(`.${c}`);
    }
  }
  for (let i of ["aria-label", "type", "name", "title", "alt"]) {
    let s = wr(e, "getAttribute", i);
    s && n.push(`[${i}="${s}"]`);
  }
  return n.join("");
}
var nE = (e) => {
  let t = (n) => {
    (n.type === "pagehide" || F.document?.visibilityState === "hidden") && e(n);
  };
  Qt("visibilitychange", t, { capture: !0, once: !0 }),
    Qt("pagehide", t, { capture: !0, once: !0 });
};
function lu(e) {
  return typeof e == "number" && isFinite(e);
}
function rr(e, t, n, { ...r }) {
  let o = L(e).start_timestamp;
  return (
    o &&
      o > t &&
      typeof e.updateStartTime == "function" &&
      e.updateStartTime(t),
    gr(e, () => {
      let i = Ve({ startTime: t, ...r });
      return i && i.end(n), i;
    })
  );
}
function Ii(e) {
  let t = I();
  if (!t) return;
  let { name: n, transaction: r, attributes: o, startTime: i } = e,
    { release: s, environment: a } = t.getOptions(),
    { userInfo: c } = t.getDataCollectionOptions(),
    f = t.getIntegrationByName("Replay")?.getReplayId(),
    l = C(),
    d = l.getUser(),
    p = d !== void 0 ? d.email || d.id || d.ip_address : void 0,
    m;
  try {
    m = l.getScopeData().contexts.profile.profile_id;
  } catch {}
  let h = {
    release: s,
    environment: a,
    user: p || void 0,
    profile_id: m || void 0,
    replay_id: f || void 0,
    transaction: r,
    "user_agent.original": F.navigator?.userAgent,
    "client.address": c ? "{{auto}}" : void 0,
    ...o,
  };
  return Ve({
    name: n,
    attributes: h,
    startTime: i,
    experimental: { standalone: !0 },
  });
}
function en() {
  return F.addEventListener && F.performance;
}
function _e(e) {
  return e / 1e3;
}
function rE(e) {
  let t = "unknown",
    n = "unknown",
    r = "";
  for (let o of e) {
    if (o === "/") {
      [t, n] = e.split("/");
      break;
    }
    if (!isNaN(Number(o))) {
      (t = r === "h" ? "http" : r), (n = e.split(r)[1]);
      break;
    }
    r += o;
  }
  return r === e && (t = r), { name: t, version: n };
}
function So(e) {
  try {
    return PerformanceObserver.supportedEntryTypes.includes(e);
  } catch {
    return !1;
  }
}
function Eo(e, t) {
  let n,
    r = !1;
  function o(a) {
    !r && n && t(a, n.spanContext().spanId, n), (r = !0);
  }
  nE(() => {
    o("pagehide");
  });
  let i = e.on("beforeStartNavigationSpan", (a, c) => {
      c?.isRedirect || (o("navigation"), i(), s());
    }),
    s = e.on("afterStartPageLoadSpan", (a) => {
      (n = a), s();
    });
}
function oE(e) {
  let t = 0,
    n;
  if (!So("layout-shift")) return;
  let r = tr(({ metric: o }) => {
    let i = o.entries[o.entries.length - 1];
    i && ((t = o.value), (n = i));
  }, !0);
  Eo(e, (o, i) => {
    vC(t, n, i, o), r();
  });
}
function vC(e, t, n, r) {
  Ke && _.log(`Sending CLS span (${e})`);
  let o = t ? _e((le() || 0) + t.startTime) : Z(),
    i = C().getScopeData().transactionName,
    s = t ? Se(t.sources[0]?.node) : "Layout shift",
    a = {
      [$]: "auto.http.browser.cls",
      [J]: "ui.webvital.cls",
      [nt]: 0,
      "sentry.pageload.span_id": n,
      "sentry.report_event": r,
    };
  t?.sources &&
    t.sources.forEach((u, f) => {
      a[`cls.source.${f + 1}`] = Se(u.node);
    });
  let c = Ii({ name: s, transaction: i, attributes: a, startTime: o });
  c && (c.addEvent("cls", { [ln]: "", [fn]: e }), c.end(o));
}
var NC = 6e4;
function To(e) {
  return e != null && e > 0 && e <= NC;
}
function iE(e) {
  let t = 0,
    n;
  if (!So("largest-contentful-paint")) return;
  let r = nr(({ metric: o }) => {
    let i = o.entries[o.entries.length - 1];
    !i || !To(o.value) || ((t = o.value), (n = i));
  }, !0);
  Eo(e, (o, i) => {
    CC(t, n, i, o), r();
  });
}
function CC(e, t, n, r) {
  if (!To(e)) return;
  Ke && _.log(`Sending LCP span (${e})`);
  let o = _e((le() || 0) + (t?.startTime || 0)),
    i = C().getScopeData().transactionName,
    s = t ? Se(t.element) : "Largest contentful paint",
    a = {
      [$]: "auto.http.browser.lcp",
      [J]: "ui.webvital.lcp",
      [nt]: 0,
      "sentry.pageload.span_id": n,
      "sentry.report_event": r,
    };
  t &&
    (t.element && (a["lcp.element"] = Se(t.element)),
    t.id && (a["lcp.id"] = t.id),
    t.url && (a["lcp.url"] = t.url),
    t.loadTime != null && (a["lcp.loadTime"] = t.loadTime),
    t.renderTime != null && (a["lcp.renderTime"] = t.renderTime),
    t.size != null && (a["lcp.size"] = t.size));
  let c = Ii({ name: s, transaction: i, attributes: a, startTime: o });
  c && (c.addEvent("lcp", { [ln]: "millisecond", [fn]: e }), c.end(o));
}
function tn(e) {
  return e && ((le() || performance.timeOrigin) + e) / 1e3;
}
function qs(e) {
  let t = {};
  if (e.nextHopProtocol != null) {
    let { name: n, version: r } = rE(e.nextHopProtocol);
    (t["network.protocol.version"] = r), (t["network.protocol.name"] = n);
  }
  return le() || en()?.timeOrigin
    ? xC({
        ...t,
        "http.request.redirect_start": tn(e.redirectStart),
        "http.request.redirect_end": tn(e.redirectEnd),
        "http.request.worker_start": tn(e.workerStart),
        "http.request.fetch_start": tn(e.fetchStart),
        "http.request.domain_lookup_start": tn(e.domainLookupStart),
        "http.request.domain_lookup_end": tn(e.domainLookupEnd),
        "http.request.connect_start": tn(e.connectStart),
        "http.request.secure_connection_start": tn(e.secureConnectionStart),
        "http.request.connection_end": tn(e.connectEnd),
        "http.request.request_start": tn(e.requestStart),
        "http.request.response_start": tn(e.responseStart),
        "http.request.response_end": tn(e.responseEnd),
        "http.request.time_to_first_byte":
          e.responseStart != null ? e.responseStart / 1e3 : void 0,
      })
    : t;
}
function xC(e) {
  return Object.fromEntries(Object.entries(e).filter(([, t]) => t != null));
}
var kC = 2147483647,
  sE = 0,
  kt = {},
  xt,
  pu;
function fp({
  recordClsStandaloneSpans: e,
  recordLcpStandaloneSpans: t,
  client: n,
}) {
  let r = en();
  if (r && le()) {
    r.mark && F.performance.mark("sentry-tracing-init");
    let o = t ? iE(n) : t === !1 ? OC() : void 0,
      i = e ? oE(n) : e === !1 ? wC() : void 0,
      s = MC(),
      a = LC();
    return () => {
      s(), a(), o?.(), i?.();
    };
  }
  return () => {};
}
function pp() {
  Ct("longtask", ({ entries: e }) => {
    let t = ne();
    if (!t) return;
    let { op: n, start_timestamp: r } = L(t);
    for (let o of e) {
      let i = _e(le() + o.startTime),
        s = _e(o.duration);
      (n === "navigation" && r && i < r) ||
        rr(t, i, i + s, {
          name: "Main UI thread blocked",
          op: "ui.long-task",
          attributes: { [$]: "auto.ui.browser.metrics" },
        });
    }
  });
}
function dp() {
  new PerformanceObserver((t) => {
    let n = ne();
    if (n)
      for (let r of t.getEntries()) {
        if (!r.scripts[0]) continue;
        let o = _e(le() + r.startTime),
          { start_timestamp: i, op: s } = L(n);
        if (s === "navigation" && i && o < i) continue;
        let a = _e(r.duration),
          c = { [$]: "auto.ui.browser.metrics" },
          u = r.scripts[0],
          {
            invoker: f,
            invokerType: l,
            sourceURL: d,
            sourceFunctionName: p,
            sourceCharPosition: m,
          } = u;
        (c["browser.script.invoker"] = f),
          (c["browser.script.invoker_type"] = l),
          d && (c["code.filepath"] = d),
          p && (c["code.function"] = p),
          m !== -1 && (c["browser.script.source_char_position"] = m),
          rr(n, o, o + a, {
            name: "Main UI thread blocked",
            op: "ui.long-animation-frame",
            attributes: c,
          });
      }
  }).observe({ type: "long-animation-frame", buffered: !0 });
}
function mp() {
  Ct("event", ({ entries: e }) => {
    let t = ne();
    if (t) {
      for (let n of e)
        if (n.name === "click") {
          let r = _e(le() + n.startTime),
            o = _e(n.duration),
            i = {
              name: Se(n.target),
              op: `ui.interaction.${n.name}`,
              startTime: r,
              attributes: { [$]: "auto.ui.browser.metrics" },
            },
            s = Nr(n.target);
          s && (i.attributes["ui.component_name"] = s), rr(t, r, r + o, i);
        }
    }
  });
}
function wC() {
  return tr(({ metric: e }) => {
    let t = e.entries[e.entries.length - 1];
    t && ((kt.cls = { value: e.value, unit: "" }), (pu = t));
  }, !0);
}
function OC() {
  return nr(({ metric: e }) => {
    let t = e.entries[e.entries.length - 1];
    !t ||
      !To(e.value) ||
      ((kt.lcp = { value: e.value, unit: "millisecond" }), (xt = t));
  }, !0);
}
function MC() {
  return lp(({ metric: e }) => {
    e.entries[e.entries.length - 1] &&
      (kt.ttfb = { value: e.value, unit: "millisecond" });
  });
}
function LC() {
  return Ct("paint", ({ entries: e }) => {
    let t = Un();
    for (let n of e) {
      let r = n.startTime < t.firstHiddenTime;
      n.name === "first-paint" &&
        r &&
        (kt.fp = { value: n.startTime, unit: "millisecond" }),
        n.name === "first-contentful-paint" &&
          r &&
          (kt.fcp = { value: n.startTime, unit: "millisecond" });
    }
  });
}
function _p(e, t) {
  let n = en(),
    r = le();
  if (!n?.getEntries || !r) return;
  let {
      spanStreamingEnabled: o,
      ignorePerformanceApiSpans: i,
      ignoreResourceSpans: s,
    } = t,
    a = _e(r),
    c = n.getEntries(),
    { op: u, start_timestamp: f } = L(e);
  c.slice(sE).forEach((l) => {
    let d = _e(l.startTime),
      p = _e(Math.max(0, l.duration));
    if (!(u === "navigation" && f && a + d < f))
      switch (l.entryType) {
        case "navigation": {
          BC(e, l, a);
          break;
        }
        case "mark":
        case "paint":
        case "measure": {
          UC(e, l, d, p, a, i);
          break;
        }
        case "resource": {
          GC(e, l, l.name, d, p, a, s);
          break;
        }
      }
  }),
    (sE = Math.max(c.length - 1, 0)),
    $C(e, o);
}
function hp(e, t) {
  let n = le();
  if (!en()?.getEntries || !n) {
    aE();
    return;
  }
  let {
      spanStreamingEnabled: r,
      recordClsOnPageloadSpan: o,
      recordLcpOnPageloadSpan: i,
    } = t,
    s = _e(n);
  if (L(e).op === "pageload") {
    if ((zC(kt), r)) {
      let a = (c, u, f) => {
        let l = f ?? `browser.web_vital.${c}.value`;
        e.setAttribute(l, u),
          Ke &&
            _.log(
              "Setting web vital attribute",
              { [l]: u },
              "on pageload span",
            );
      };
      ["ttfb", "fp", "fcp"].forEach((c) => {
        kt[c] && a(c, kt[c].value);
      }),
        kt["ttfb.requestTime"] &&
          a(
            "ttfb.requestTime",
            kt["ttfb.requestTime"].value,
            "browser.web_vital.ttfb.request_time",
          );
    } else
      o || delete kt.cls,
        i || delete kt.lcp,
        Object.entries(kt).forEach(([a, c]) => {
          $o(a, c.value, c.unit, e);
        }),
        WC(e, t);
    e.setAttribute(
      r ? "browser.performance.time_origin" : "performance.timeOrigin",
      s,
    ),
      e.setAttribute(
        r
          ? "browser.performance.navigation.activation_start"
          : "performance.activationStart",
        Xt(),
      );
  }
  aE();
}
function aE() {
  (xt = void 0), (pu = void 0), (kt = {});
}
function PC(e) {
  if (e?.entryType === "measure")
    try {
      return e.detail.devtools.track === "Components \u269B";
    } catch {
      return;
    }
}
function UC(e, t, n, r, o, i) {
  if (PC(t) || (["mark", "measure"].includes(t.entryType) && He(t.name, i)))
    return;
  let s = er(!1),
    a = _e(s ? s.requestStart : 0),
    c = o + Math.max(n, a),
    u = o + n,
    f = u + r,
    l = { [$]: "auto.resource.browser.metrics" };
  c !== u &&
    ((l["sentry.browser.measure_happened_before_request"] = !0),
    (l["sentry.browser.measure_start_time"] = c)),
    DC(l, t),
    c <= f && rr(e, c, f, { name: t.name, op: t.entryType, attributes: l });
}
function DC(e, t) {
  try {
    let n = t.detail;
    if (!n) return;
    if (typeof n == "object") {
      for (let [r, o] of Object.entries(n))
        if (o && Fe(o)) e[`sentry.browser.measure.detail.${r}`] = o;
        else if (o !== void 0)
          try {
            e[`sentry.browser.measure.detail.${r}`] = JSON.stringify(o);
          } catch {}
      return;
    }
    if (Fe(n)) {
      e["sentry.browser.measure.detail"] = n;
      return;
    }
    try {
      e["sentry.browser.measure.detail"] = JSON.stringify(n);
    } catch {}
  } catch {}
}
function BC(e, t, n) {
  [
    "unloadEvent",
    "redirect",
    "domContentLoadedEvent",
    "loadEvent",
    "connect",
  ].forEach((r) => {
    fu(e, t, r, n);
  }),
    fu(e, t, "secureConnection", n, "TLS/SSL"),
    fu(e, t, "fetch", n, "cache"),
    fu(e, t, "domainLookup", n, "DNS"),
    HC(e, t, n);
}
function fu(e, t, n, r, o = n) {
  let i = FC(n),
    s = t[i],
    a = t[`${n}Start`];
  !a ||
    !s ||
    rr(e, r + _e(a), r + _e(s), {
      op: `browser.${o}`,
      name: t.name,
      attributes: {
        [$]: "auto.ui.browser.metrics",
        ...(n === "redirect" && t.redirectCount != null
          ? { "http.redirect_count": t.redirectCount }
          : {}),
      },
    });
}
function FC(e) {
  return e === "secureConnection"
    ? "connectEnd"
    : e === "fetch"
      ? "domainLookupStart"
      : `${e}End`;
}
function HC(e, t, n) {
  let r = n + _e(t.requestStart),
    o = n + _e(t.responseEnd),
    i = n + _e(t.responseStart);
  t.responseEnd &&
    (rr(e, r, o, {
      op: "browser.request",
      name: t.name,
      attributes: { [$]: "auto.ui.browser.metrics" },
    }),
    rr(e, i, o, {
      op: "browser.response",
      name: t.name,
      attributes: { [$]: "auto.ui.browser.metrics" },
    }));
}
function GC(e, t, n, r, o, i, s) {
  if (t.initiatorType === "xmlhttprequest" || t.initiatorType === "fetch")
    return;
  let a = t.initiatorType ? `resource.${t.initiatorType}` : "resource.other";
  if (s?.includes(a)) return;
  let c = { [$]: "auto.resource.browser.metrics" },
    u = jt(n);
  u.protocol && (c["url.scheme"] = u.protocol.split(":").pop()),
    u.host && (c["server.address"] = u.host),
    (c["url.same_origin"] = n.includes(F.location.origin)),
    jC(t, c, [
      ["responseStatus", "http.response.status_code"],
      ["transferSize", "http.response_transfer_size"],
      ["encodedBodySize", "http.response_content_length"],
      ["decodedBodySize", "http.decoded_response_content_length"],
      ["renderBlockingStatus", "resource.render_blocking_status"],
      ["deliveryType", "http.response_delivery_type"],
    ]);
  let f = { ...c, ...qs(t) },
    l = i + r,
    d = l + o;
  rr(e, l, d, { name: n.replace(F.location.origin, ""), op: a, attributes: f });
}
function $C(e, t) {
  let n = F.navigator;
  if (!n) return;
  let r = n.connection;
  r &&
    (r.effectiveType &&
      e.setAttribute(
        t ? "network.connection.effective_type" : "effectiveConnectionType",
        r.effectiveType,
      ),
    r.type &&
      e.setAttribute(t ? "network.connection.type" : "connectionType", r.type),
    lu(r.rtt) &&
      (t
        ? e.setAttribute("network.connection.rtt", r.rtt)
        : L(e).op === "pageload" &&
          $o("connection.rtt", r.rtt, "millisecond"))),
    lu(n.deviceMemory) &&
      (t
        ? e.setAttribute("device.memory.estimated_capacity", n.deviceMemory)
        : e.setAttribute("deviceMemory", `${n.deviceMemory} GB`)),
    lu(n.hardwareConcurrency) &&
      (t
        ? e.setAttribute("device.processor_count", n.hardwareConcurrency)
        : e.setAttribute("hardwareConcurrency", String(n.hardwareConcurrency)));
}
function WC(e, t) {
  xt &&
    t.recordLcpOnPageloadSpan &&
    (xt.element && e.setAttribute("lcp.element", Se(xt.element)),
    xt.id && e.setAttribute("lcp.id", xt.id),
    xt.url && e.setAttribute("lcp.url", xt.url.trim().slice(0, 200)),
    xt.loadTime != null && e.setAttribute("lcp.loadTime", xt.loadTime),
    xt.renderTime != null && e.setAttribute("lcp.renderTime", xt.renderTime),
    e.setAttribute("lcp.size", xt.size)),
    pu?.sources &&
      t.recordClsOnPageloadSpan &&
      pu.sources.forEach((n, r) =>
        e.setAttribute(`cls.source.${r + 1}`, Se(n.node)),
      );
}
function jC(e, t, n) {
  n.forEach(([r, o]) => {
    let i = e[r];
    i != null &&
      ((typeof i == "number" && i < kC) || typeof i == "string") &&
      (t[o] = i);
  });
}
function zC(e) {
  let t = er(!1);
  if (!t) return;
  let { responseStart: n, requestStart: r } = t;
  r <= n && (e["ttfb.requestTime"] = { value: n - r, unit: "millisecond" });
}
var qC = "ElementTiming",
  YC = () => ({
    name: qC,
    setup() {
      !en() ||
        !le() ||
        Ct("element", ({ entries: t }) => {
          for (let n of t) {
            let r = n;
            if (!r.identifier) continue;
            let o = r.identifier,
              i = r.name,
              s = r.renderTime,
              a = r.loadTime,
              c = {
                "sentry.origin": "auto.ui.browser.element_timing",
                "ui.element.identifier": o,
              };
            i && (c["ui.element.paint_type"] = i),
              r.id && (c["ui.element.id"] = r.id),
              r.element &&
                (c["ui.element.type"] = r.element.tagName.toLowerCase()),
              r.url && (c["ui.element.url"] = r.url),
              r.naturalWidth && (c["ui.element.width"] = r.naturalWidth),
              r.naturalHeight && (c["ui.element.height"] = r.naturalHeight),
              s > 0 &&
                io.distribution("ui.element.render_time", s, {
                  unit: "millisecond",
                  attributes: c,
                }),
              a > 0 &&
                io.distribution("ui.element.load_time", a, {
                  unit: "millisecond",
                  attributes: c,
                });
          }
        });
    },
  }),
  cE = YC;
var gp = [],
  Ys = new Map(),
  bi = new Map(),
  Sp = 60;
function Ep() {
  if (en() && le()) {
    let t = VC();
    return () => {
      t();
    };
  }
  return () => {};
}
var Ai = {
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
function VC() {
  return ho(KC);
}
var KC = ({ metric: e }) => {
  if (e.value == null) return;
  let t = _e(e.value);
  if (t > Sp) return;
  let n = e.entries.find((m) => m.duration === e.value && Ai[m.name]);
  if (!n) return;
  let { interactionId: r } = n,
    o = Ai[n.name],
    i = _e(le() + n.startTime),
    s = ne(),
    a = s ? ie(s) : void 0,
    c = r != null ? Ys.get(r) : void 0,
    u = c?.span || a,
    f = u ? L(u).description : C().getScopeData().transactionName,
    l = c?.elementName || Se(n.target),
    d = {
      [$]: "auto.http.browser.inp",
      [J]: `ui.interaction.${o}`,
      [nt]: n.duration,
    },
    p = Ii({ name: l, transaction: f, attributes: d, startTime: i });
  p &&
    (p.addEvent("inp", { [ln]: "millisecond", [fn]: e.value }), p.end(i + t));
};
function uE(e) {
  return e != null ? Ys.get(e) : void 0;
}
function Tp() {
  let e = Object.keys(Ai);
  ot() &&
    e.forEach((o) => {
      F.addEventListener(o, t, { capture: !0, passive: !0 });
    });
  function t(o) {
    let i = o.target;
    if (!i) return;
    let s = Se(i),
      a = Math.round(o.timeStamp);
    if ((bi.set(a, s), bi.size > 50)) {
      let c = bi.keys().next().value;
      c !== void 0 && bi.delete(c);
    }
  }
  function n(o) {
    let i = Math.round(o.startTime),
      s = bi.get(i);
    if (!s)
      for (let a = -5; a <= 5; a++) {
        let c = bi.get(i + a);
        if (c) {
          s = c;
          break;
        }
      }
    return s || "<unknown>";
  }
  let r = ({ entries: o }) => {
    let i = ne(),
      s = i && ie(i);
    o.forEach((a) => {
      if (!tE(a)) return;
      let c = a.interactionId;
      if (c == null || Ys.has(c)) return;
      let u = a.target ? Se(a.target) : n(a);
      if (gp.length > 10) {
        let f = gp.shift();
        Ys.delete(f);
      }
      gp.push(c), Ys.set(c, { span: s, elementName: u });
    });
  };
  Ct("event", r), Ct("first-input", r);
}
function yp(e) {
  let {
      name: t,
      op: n,
      origin: r,
      metricName: o,
      value: i,
      attributes: s,
      parentSpan: a,
      reportEvent: c,
      startTime: u,
      endTime: f,
    } = e,
    l = C().getScopeData().transactionName,
    d = {
      [$]: r,
      [J]: n,
      [nt]: 0,
      [`browser.web_vital.${o}.value`]: i,
      "sentry.transaction": l,
      "user_agent.original": F.navigator?.userAgent,
      ...s,
    };
  a &&
    _r(a).attributes?.[J] === "pageload" &&
    (d["sentry.pageload.span_id"] = a.spanContext().spanId),
    c && (d[`browser.web_vital.${o}.report_event`] = c);
  let p = Ve({ name: t, attributes: d, startTime: u, parentSpan: a });
  p && p.end(f ?? u);
}
function Ip(e) {
  let t = 0,
    n;
  if (!So("largest-contentful-paint")) return;
  let r = nr(({ metric: o }) => {
    let i = o.entries[o.entries.length - 1];
    !i || !To(o.value) || ((t = o.value), (n = i));
  }, !0);
  Eo(e, (o, i, s) => {
    JC(t, n, s, o), r();
  });
}
function JC(e, t, n, r) {
  if (!To(e)) return;
  Ke && _.log(`Sending LCP span (${e})`);
  let o = le() || 0,
    i = _e(o),
    s = _e(o + (t?.startTime || 0)),
    a = t ? Se(t.element) : "Largest contentful paint",
    c = {};
  t?.element && (c["browser.web_vital.lcp.element"] = Se(t.element)),
    t?.id && (c["browser.web_vital.lcp.id"] = t.id),
    t?.url && (c["browser.web_vital.lcp.url"] = t.url),
    t?.loadTime != null && (c["browser.web_vital.lcp.load_time"] = t.loadTime),
    t?.renderTime != null &&
      (c["browser.web_vital.lcp.render_time"] = t.renderTime),
    t?.size != null && (c["browser.web_vital.lcp.size"] = t.size),
    yp({
      name: a,
      op: "ui.webvital.lcp",
      origin: "auto.http.browser.lcp",
      metricName: "lcp",
      value: e,
      attributes: c,
      parentSpan: n,
      reportEvent: r,
      startTime: i,
      endTime: s,
    });
}
function bp(e) {
  let t = 0,
    n;
  if (!So("layout-shift")) return;
  let r = tr(({ metric: o }) => {
    let i = o.entries[o.entries.length - 1];
    i && ((t = o.value), (n = i));
  }, !0);
  Eo(e, (o, i, s) => {
    XC(t, n, s, o), r();
  });
}
function XC(e, t, n, r) {
  Ke && _.log(`Sending CLS span (${e})`);
  let o = t ? _e((le() || 0) + t.startTime) : Z(),
    i = t ? Se(t.sources[0]?.node) : "Layout shift",
    s = {};
  t?.sources &&
    t.sources.forEach((a, c) => {
      s[`browser.web_vital.cls.source.${c + 1}`] = Se(a.node);
    }),
    yp({
      name: i,
      op: "ui.webvital.cls",
      origin: "auto.http.browser.cls",
      metricName: "cls",
      value: e,
      attributes: s,
      parentSpan: n,
      reportEvent: r,
      startTime: o,
    });
}
function Ap() {
  if (!en() || !le()) return;
  ho(({ metric: n }) => {
    if (n.value == null || _e(n.value) > Sp) return;
    let o = n.entries.find((i) => i.duration === n.value && Ai[i.name]);
    o && QC(n.value, o);
  });
}
function QC(e, t) {
  Ke && _.log(`Sending INP span (${e})`);
  let n = _e(le() + t.startTime),
    r = _e(e),
    o = Ai[t.name],
    i = uE(t.interactionId),
    s = ne(),
    a = s ? ie(s) : void 0,
    c = i?.span || a,
    u = c ? _r(c).name : C().getScopeData().transactionName,
    f = i?.elementName || Se(t.target);
  yp({
    name: f,
    op: `ui.interaction.${o}`,
    origin: "auto.http.browser.inp",
    metricName: "inp",
    value: e,
    attributes: { [nt]: t.duration, "sentry.transaction": u },
    startTime: n,
    endTime: n + r,
    parentSpan: c,
  });
}
var ZC = 1e3,
  lE,
  Rp,
  vp;
function Vs(e) {
  Qe("dom", e), Ze("dom", ex);
}
function ex() {
  if (!F.document) return;
  let e = Be.bind(null, "dom"),
    t = fE(e, !0);
  F.document.addEventListener("click", t, !1),
    F.document.addEventListener("keypress", t, !1),
    ["EventTarget", "Node"].forEach((n) => {
      let o = F[n]?.prototype;
      o?.hasOwnProperty?.("addEventListener") &&
        (Ee(o, "addEventListener", function (i) {
          return function (s, a, c) {
            if (s === "click" || s == "keypress")
              try {
                let u = (this.__sentry_instrumentation_handlers__ =
                    this.__sentry_instrumentation_handlers__ || {}),
                  f = (u[s] = u[s] || { refCount: 0 });
                if (!f.handler) {
                  let l = fE(e);
                  (f.handler = l), i.call(this, s, l, c);
                }
                f.refCount++;
              } catch {}
            return i.call(this, s, a, c);
          };
        }),
        Ee(o, "removeEventListener", function (i) {
          return function (s, a, c) {
            if (s === "click" || s == "keypress")
              try {
                let u = this.__sentry_instrumentation_handlers__ || {},
                  f = u[s];
                f &&
                  (f.refCount--,
                  f.refCount <= 0 &&
                    (i.call(this, s, f.handler, c),
                    (f.handler = void 0),
                    delete u[s]),
                  Object.keys(u).length === 0 &&
                    delete this.__sentry_instrumentation_handlers__);
              } catch {}
            return i.call(this, s, a, c);
          };
        }));
    });
}
function tx(e) {
  if (e.type !== Rp) return !1;
  try {
    if (!e.target || e.target._sentryId !== vp) return !1;
  } catch {}
  return !0;
}
function nx(e, t) {
  return e !== "keypress"
    ? !1
    : t?.tagName
      ? !(
          t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable
        )
      : !0;
}
function fE(e, t = !1) {
  return (n) => {
    if (!n || n._sentryCaptured) return;
    let r = rx(n);
    if (nx(n.type, r)) return;
    de(n, "_sentryCaptured", !0), r && !r._sentryId && de(r, "_sentryId", me());
    let o = n.type === "keypress" ? "input" : n.type;
    tx(n) ||
      (e({ event: n, name: o, global: t }),
      (Rp = n.type),
      (vp = r ? r._sentryId : void 0)),
      clearTimeout(lE),
      (lE = F.setTimeout(() => {
        (vp = void 0), (Rp = void 0);
      }, ZC));
  };
}
function rx(e) {
  try {
    return e.target;
  } catch {
    return null;
  }
}
var du;
function or(e) {
  let t = "history";
  Qe(t, e), Ze(t, ox);
}
function ox() {
  if (
    (F.addEventListener("popstate", () => {
      let t = F.location.href,
        n = du;
      if (((du = t), n === t)) return;
      Be("history", { from: n, to: t });
    }),
    !Fc())
  )
    return;
  function e(t) {
    return function (...n) {
      let r = n.length > 2 ? n[2] : void 0;
      if (r) {
        let o = du,
          i = ix(String(r));
        if (((du = i), o === i)) return t.apply(this, n);
        Be("history", { from: o, to: i });
      }
      return t.apply(this, n);
    };
  }
  Ee(F.history, "pushState", e), Ee(F.history, "replaceState", e);
}
function ix(e) {
  try {
    return new URL(e, F.location.origin).toString();
  } catch {
    return e;
  }
}
var mu = {};
function Ri(e) {
  let t = mu[e];
  if (t) return t;
  let n = F[e];
  if (fi(n)) return (mu[e] = n.bind(F));
  let r = F.document;
  if (r && typeof r.createElement == "function")
    try {
      let o = r.createElement("iframe");
      (o.hidden = !0), r.head.appendChild(o);
      let i = o.contentWindow;
      i?.[e] && (n = i[e]), r.head.removeChild(o);
    } catch (o) {
      Ke &&
        _.warn(
          `Could not create sandbox iframe for ${e} check, bailing to window.${e}: `,
          o,
        );
    }
  return n && (mu[e] = n.bind(F));
}
function Np(e) {
  mu[e] = void 0;
}
function yo(...e) {
  return Ri("setTimeout")(...e);
}
var _t = "__sentry_xhr_v3__";
function Io(e) {
  Qe("xhr", e), Ze("xhr", sx);
}
function sx() {
  if (!F.XMLHttpRequest) return;
  let e = XMLHttpRequest.prototype;
  (e.open = new Proxy(e.open, {
    apply(t, n, r) {
      let o = new Error(),
        i = Z() * 1e3,
        s = je(r[0]) ? r[0].toUpperCase() : void 0,
        a = ax(r[1]);
      if (!s || !a) return t.apply(n, r);
      (n[_t] = { method: s, url: a, request_headers: {} }),
        s === "POST" &&
          a.match(/sentry_key/) &&
          (n.__sentry_own_request__ = !0);
      let c = () => {
        let u = n[_t];
        if (u && n.readyState === 4) {
          try {
            u.status_code = n.status;
          } catch {}
          let f = {
            endTimestamp: Z() * 1e3,
            startTimestamp: i,
            xhr: n,
            virtualError: o,
          };
          Be("xhr", f);
        }
      };
      return (
        "onreadystatechange" in n && typeof n.onreadystatechange == "function"
          ? (n.onreadystatechange = new Proxy(n.onreadystatechange, {
              apply(u, f, l) {
                return c(), u.apply(f, l);
              },
            }))
          : n.addEventListener("readystatechange", c),
        (n.setRequestHeader = new Proxy(n.setRequestHeader, {
          apply(u, f, l) {
            let [d, p] = l,
              m = f[_t];
            return (
              m && je(d) && je(p) && (m.request_headers[d.toLowerCase()] = p),
              u.apply(f, l)
            );
          },
        })),
        t.apply(n, r)
      );
    },
  })),
    (e.send = new Proxy(e.send, {
      apply(t, n, r) {
        let o = n[_t];
        if (!o) return t.apply(n, r);
        r[0] !== void 0 && (o.body = r[0]);
        let i = { startTimestamp: Z() * 1e3, xhr: n };
        return Be("xhr", i), t.apply(n, r);
      },
    }));
}
function ax(e) {
  if (je(e)) return e;
  try {
    return e.toString();
  } catch {}
}
var cx = Symbol.for("sentry__originalRequestBody");
function _u(e) {
  return new URLSearchParams(e).toString();
}
function bo(e, t = _) {
  try {
    if (typeof e == "string") return [e];
    if (e instanceof URLSearchParams) return [e.toString()];
    if (e instanceof FormData) return [_u(e)];
    if (!e) return [void 0];
  } catch (n) {
    return (
      Ke && t.error(n, "Failed to serialize body", e),
      [void 0, "BODY_PARSE_ERROR"]
    );
  }
  return (
    Ke && t.log("Skipping network body because of body type", e),
    [void 0, "UNPARSEABLE_BODY_TYPE"]
  );
}
function vi(e = []) {
  if (e.length >= 2 && e[1] && typeof e[1] == "object" && "body" in e[1])
    return e[1].body;
  if (e.length >= 1 && e[0] instanceof Request) {
    let n = e[0][cx];
    return n !== void 0 ? n : void 0;
  }
}
function Ks(e) {
  let t;
  try {
    t = e.getAllResponseHeaders();
  } catch (n) {
    return Ke && _.error(n, "Failed to get xhr response headers", e), {};
  }
  return t
    ? t
        .split(
          `\r
`,
        )
        .reduce((n, r) => {
          let [o, i] = r.split(": ");
          return i && (n[o.toLowerCase()] = i), n;
        }, {})
    : {};
}
function Cp(e) {
  if (typeof Element > "u") return !1;
  try {
    return e instanceof Element;
  } catch {
    return !1;
  }
}
var ux = 40;
function Js(e, t = Ri("fetch")) {
  let n = 0,
    r = 0;
  async function o(i) {
    let s = i.body.length;
    (n += s), r++;
    let a = {
      body: i.body,
      method: "POST",
      referrerPolicy: "strict-origin",
      headers: e.headers,
      keepalive: n <= 6e4 && r < 15,
      ...e.fetchOptions,
    };
    try {
      let c = await t(e.url, a);
      return {
        statusCode: c.status,
        headers: {
          "x-sentry-rate-limits": c.headers.get("X-Sentry-Rate-Limits"),
          "retry-after": c.headers.get("Retry-After"),
        },
      };
    } catch (c) {
      throw (Np("fetch"), c);
    } finally {
      (n -= s), r--;
    }
  }
  return pc(e, o, to(e.bufferSize || ux));
}
var b = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
function lx() {
  let e = I();
  if (!e) {
    b && _.warn("No Sentry client available, profiling is not started");
    return;
  }
  if (!e.getIntegrationByName("BrowserProfiling")) {
    b && _.warn("BrowserProfiling integration is not available");
    return;
  }
  e.emit("startUIProfiler");
}
function fx() {
  let e = I();
  if (!e) {
    b && _.warn("No Sentry client available, profiling is not started");
    return;
  }
  if (!e.getIntegrationByName("BrowserProfiling")) {
    b && _.warn("ProfilingIntegration is not available");
    return;
  }
  e.emit("stopUIProfiler");
}
var px = { startProfiler: lx, stopProfiler: fx };
var dx = 10,
  mx = 20,
  _x = 30,
  hx = 40,
  gx = 50;
function Ni(e, t, n, r) {
  let o = { filename: e, function: t === "<anonymous>" ? "?" : t, in_app: !0 };
  return n !== void 0 && (o.lineno = n), r !== void 0 && (o.colno = r), o;
}
var Sx = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
  Ex =
    /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
  Tx = /\((\S*)(?::(\d+))(?::(\d+))\)/,
  yx = /at (.+?) ?\(data:(.+?),/,
  Ix = (e) => {
    let t = e.match(yx);
    if (t) return { filename: `<data:${t[2]}>`, function: t[1] };
    let n = Sx.exec(e);
    if (n) {
      let [, o, i, s] = n;
      return Ni(o, "?", +i, +s);
    }
    let r = Ex.exec(e);
    if (r) {
      if (r[2]?.indexOf("eval") === 0) {
        let a = Tx.exec(r[2]);
        a && ((r[2] = a[1]), (r[3] = a[2]), (r[4] = a[3]));
      }
      let [i, s] = _E(r[1] || "?", r[2]);
      return Ni(s, i, r[3] ? +r[3] : void 0, r[4] ? +r[4] : void 0);
    }
  },
  pE = [_x, Ix],
  bx =
    /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
  Ax = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
  Rx = (e) => {
    let t = bx.exec(e);
    if (t) {
      if (t[3] && t[3].indexOf(" > eval") > -1) {
        let i = Ax.exec(t[3]);
        i &&
          ((t[1] = t[1] || "eval"), (t[3] = i[1]), (t[4] = i[2]), (t[5] = ""));
      }
      let r = t[3],
        o = t[1] || "?";
      return (
        ([o, r] = _E(o, r)),
        Ni(r, o, t[4] ? +t[4] : void 0, t[5] ? +t[5] : void 0)
      );
    }
  },
  dE = [gx, Rx],
  vx =
    /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
  Nx = (e) => {
    let t = vx.exec(e);
    return t ? Ni(t[2], t[1] || "?", +t[3], t[4] ? +t[4] : void 0) : void 0;
  },
  Cx = [hx, Nx],
  xx = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i,
  kx = (e) => {
    let t = xx.exec(e);
    return t ? Ni(t[2], t[3] || "?", +t[1]) : void 0;
  },
  wx = [dx, kx],
  Ox =
    / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i,
  Mx = (e) => {
    let t = Ox.exec(e);
    return t ? Ni(t[5], t[3] || t[4] || "?", +t[1], +t[2]) : void 0;
  },
  Lx = [mx, Mx],
  mE = [pE, dE],
  xp = $i(...mE),
  _E = (e, t) => {
    let n = e.indexOf("safari-extension") !== -1,
      r = e.indexOf("safari-web-extension") !== -1;
    return n || r
      ? [
          e.indexOf("@") !== -1 ? e.split("@")[0] : "?",
          n ? `safari-extension:${t}` : `safari-web-extension:${t}`,
        ]
      : [e, t];
  };
function Px(e, { metadata: t, tunnel: n, dsn: r }) {
  let o = {
      event_id: e.event_id,
      sent_at: new Date().toISOString(),
      ...(t?.sdk && { sdk: { name: t.sdk.name, version: t.sdk.version } }),
      ...(!!n && !!r && { dsn: Ge(r) }),
    },
    i = Ux(e);
  return ke(o, [i]);
}
function Ux(e) {
  return [{ type: "user_report" }, e];
}
var hu = 1024,
  Dx = "Breadcrumbs",
  Bx = (e = {}) => {
    let t = {
      console: !0,
      dom: !0,
      fetch: !0,
      history: !0,
      sentry: !0,
      xhr: !0,
      ...e,
    };
    return {
      name: Dx,
      setup(n) {
        t.console && oo(Gx(n)),
          t.dom && Vs(Hx(n, t.dom)),
          t.xhr && Io($x(n)),
          t.fetch && Ln(Wx(n)),
          t.history && or(jx(n)),
          t.sentry && n.on("beforeSendEvent", Fx(n));
      },
    };
  },
  kp = Bx;
function Fx(e) {
  return function (n) {
    I() === e &&
      mt(
        {
          category: `sentry.${n.type === "transaction" ? "transaction" : "event"}`,
          event_id: n.event_id,
          level: n.level,
          message: an(n),
        },
        { event: n },
      );
  };
}
function Hx(e, t) {
  return function (r) {
    if (I() !== e) return;
    let o,
      i,
      s = typeof t == "object" ? t.serializeAttribute : void 0,
      a =
        typeof t == "object" && typeof t.maxStringLength == "number"
          ? t.maxStringLength
          : void 0;
    a &&
      a > hu &&
      (b &&
        _.warn(
          `\`dom.maxStringLength\` cannot exceed ${hu}, but a value of ${a} was configured. Sentry will use ${hu} instead.`,
        ),
      (a = hu)),
      typeof s == "string" && (s = [s]);
    try {
      let u = r.event,
        f = zx(u) ? u.target : u;
      (o = Se(f, { keyAttrs: s, maxStringLength: a })), (i = Nr(f));
    } catch {
      o = "<unknown>";
    }
    if (o.length === 0) return;
    let c = { category: `ui.${r.name}`, message: o };
    i && (c.data = { "ui.component_name": i }),
      mt(c, { event: r.event, name: r.name, global: r.global });
  };
}
function Gx(e) {
  return function (n) {
    if (I() !== e) return;
    let r = {
      category: "console",
      data: { arguments: n.args, logger: "console" },
      level: Xn(n.level),
      message: fr(n.args, " "),
    };
    if (n.level === "assert")
      if (n.args[0] === !1)
        (r.message = `Assertion failed: ${fr(n.args.slice(1), " ") || "console.assert"}`),
          (r.data.arguments = n.args.slice(1));
      else return;
    mt(r, { input: n.args, level: n.level });
  };
}
function $x(e) {
  return function (n) {
    if (I() !== e) return;
    let { startTimestamp: r, endTimestamp: o } = n,
      i = n.xhr[_t];
    if (!r || !o || !i) return;
    let { method: s, url: a, status_code: c, body: u } = i,
      f = { method: s, url: a, status_code: c },
      l = { xhr: n.xhr, input: u, startTimestamp: r, endTimestamp: o },
      d = { category: "xhr", data: f, type: "http", level: Bc(c) };
    e.emit("beforeOutgoingRequestBreadcrumb", d, l), mt(d, l);
  };
}
function Wx(e) {
  return function (n) {
    if (I() !== e) return;
    let { startTimestamp: r, endTimestamp: o } = n;
    if (
      o &&
      !(n.fetchData.url.match(/sentry_key/) && n.fetchData.method === "POST")
    )
      if (n.error) {
        let i = {
            data: n.error,
            input: n.args,
            startTimestamp: r,
            endTimestamp: o,
          },
          s = {
            category: "fetch",
            data: n.fetchData,
            level: "error",
            type: "http",
          };
        e.emit("beforeOutgoingRequestBreadcrumb", s, i), mt(s, i);
      } else {
        let i = n.response,
          s = { ...n.fetchData, status_code: i?.status },
          a = {
            input: n.args,
            response: i,
            startTimestamp: r,
            endTimestamp: o,
          },
          c = {
            category: "fetch",
            data: s,
            type: "http",
            level: Bc(s.status_code),
          };
        e.emit("beforeOutgoingRequestBreadcrumb", c, a), mt(c, a);
      }
  };
}
function jx(e) {
  return function (n) {
    if (I() !== e) return;
    let r = n.from,
      o = n.to,
      i = jt(N.location.href),
      s = r ? jt(r) : void 0,
      a = jt(o);
    s?.path || (s = i),
      i.protocol === a.protocol && i.host === a.host && (o = a.relative),
      i.protocol === s.protocol && i.host === s.host && (r = s.relative),
      mt({ category: "navigation", data: { from: r, to: o } });
  };
}
function zx(e) {
  return !!e && !!e.target;
}
var qx =
    "EventTarget,Window,Node,ApplicationCache,AudioTrackList,BroadcastChannel,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(
      ",",
    ),
  Yx = "BrowserApiErrors",
  Vx = (e = {}) => {
    let t = {
      XMLHttpRequest: !0,
      eventTarget: !0,
      requestAnimationFrame: !0,
      setInterval: !0,
      setTimeout: !0,
      unregisterOriginalCallbacks: !1,
      ...e,
    };
    return {
      name: Yx,
      setupOnce() {
        t.setTimeout && Ee(N, "setTimeout", hE),
          t.setInterval && Ee(N, "setInterval", hE),
          t.requestAnimationFrame && Ee(N, "requestAnimationFrame", Kx),
          t.XMLHttpRequest &&
            "XMLHttpRequest" in N &&
            Ee(XMLHttpRequest.prototype, "send", Jx);
        let n = t.eventTarget;
        n && (Array.isArray(n) ? n : qx).forEach((o) => Xx(o, t));
      },
    };
  },
  wp = Vx;
function hE(e) {
  return function (...t) {
    let n = t[0];
    return (
      (t[0] = mo(n, {
        mechanism: {
          handled: !1,
          type: `auto.browser.browserapierrors.${ut(e)}`,
        },
      })),
      e.apply(this, t)
    );
  };
}
function Kx(e) {
  return function (t) {
    return e.apply(this, [
      mo(t, {
        mechanism: {
          data: { handler: ut(e) },
          handled: !1,
          type: "auto.browser.browserapierrors.requestAnimationFrame",
        },
      }),
    ]);
  };
}
function Jx(e) {
  return function (...t) {
    let n = this;
    return (
      ["onload", "onerror", "onprogress", "onreadystatechange"].forEach((o) => {
        o in n &&
          typeof n[o] == "function" &&
          Ee(n, o, function (i) {
            let s = {
                mechanism: {
                  data: { handler: ut(i) },
                  handled: !1,
                  type: `auto.browser.browserapierrors.xhr.${o}`,
                },
              },
              a = lr(i);
            return a && (s.mechanism.data.handler = ut(a)), mo(i, s);
          });
      }),
      e.apply(this, t)
    );
  };
}
function Xx(e, t) {
  let r = N[e]?.prototype;
  r?.hasOwnProperty?.("addEventListener") &&
    (Ee(r, "addEventListener", function (o) {
      return function (i, s, a) {
        try {
          Qx(s) &&
            (s.handleEvent = mo(s.handleEvent, {
              mechanism: {
                data: { handler: ut(s), target: e },
                handled: !1,
                type: "auto.browser.browserapierrors.handleEvent",
              },
            }));
        } catch {}
        return (
          t.unregisterOriginalCallbacks && Zx(this, i, s),
          o.apply(this, [
            i,
            mo(s, {
              mechanism: {
                data: { handler: ut(s), target: e },
                handled: !1,
                type: "auto.browser.browserapierrors.addEventListener",
              },
            }),
            a,
          ])
        );
      };
    }),
    Ee(r, "removeEventListener", function (o) {
      return function (i, s, a) {
        try {
          if (Object.prototype.hasOwnProperty.call(s, "__sentry_wrapped__")) {
            let c = s.__sentry_wrapped__;
            c && o.call(this, i, c, a);
          }
        } catch {}
        return o.call(this, i, s, a);
      };
    }));
}
function Qx(e) {
  return typeof e.handleEvent == "function";
}
function Zx(e, t, n) {
  e &&
    typeof e == "object" &&
    "removeEventListener" in e &&
    typeof e.removeEventListener == "function" &&
    e.removeEventListener(t, n);
}
var Op = (e = {}) => {
  let t = e.lifecycle ?? "route";
  return {
    name: "BrowserSession",
    setupOnce() {
      if (typeof N.document > "u") {
        b &&
          _.warn(
            "Using the `browserSessionIntegration` in non-browser environments is not supported.",
          );
        return;
      }
      qo({ ignoreDuration: !0 }), Zr();
      let n = te(),
        r = n.getUser();
      n.addScopeListener((o) => {
        let i = o.getUser();
        (r?.id !== i?.id || r?.ip_address !== i?.ip_address) && (Zr(), (r = i));
      }),
        t === "route" &&
          or(({ from: o, to: i }) => {
            o !== i && (qo({ ignoreDuration: !0 }), Zr());
          });
    },
  };
};
var e0 = "CultureContext",
  t0 = () => ({
    name: e0,
    preprocessEvent(e) {
      let t = gE();
      t &&
        (e.contexts = {
          ...e.contexts,
          culture: { ...t, ...e.contexts?.culture },
        });
    },
    processSegmentSpan(e) {
      let t = gE();
      t &&
        Lt(e, {
          "culture.locale": t.locale,
          "culture.timezone": t.timezone,
          "culture.calendar": t.calendar,
        });
    },
  }),
  Mp = t0;
function gE() {
  try {
    let e = N.Intl;
    if (!e) return;
    let t = e.DateTimeFormat().resolvedOptions();
    return { locale: t.locale, timezone: t.timeZone, calendar: t.calendar };
  } catch {
    return;
  }
}
var n0 = "GlobalHandlers",
  r0 = (e = {}) => {
    let t = { onerror: !0, onunhandledrejection: !0, ...e };
    return {
      name: n0,
      setupOnce() {
        Error.stackTraceLimit = 50;
      },
      setup(n) {
        t.onerror && (o0(n), SE("onerror")),
          t.onunhandledrejection && (i0(n), SE("onunhandledrejection"));
      },
    };
  },
  Lp = r0;
function o0(e) {
  ji((t) => {
    let { stackParser: n, attachStacktrace: r } = EE();
    if (I() !== e || Qf()) return;
    let { msg: o, url: i, line: s, column: a, error: c } = t,
      u = s0(Si(n, c || o, void 0, r, !1), i, s, a);
    (u.level = "error"),
      mn(u, {
        originalException: c,
        mechanism: {
          handled: !1,
          type: "auto.browser.global_handlers.onerror",
        },
      });
  });
}
function i0(e) {
  zi((t) => {
    let { stackParser: n, attachStacktrace: r } = EE();
    if (I() !== e || Qf()) return;
    let o = Pp(t),
      i = Fe(o) ? Up(o) : Si(n, o, void 0, r, !0);
    (i.level = "error"),
      mn(i, {
        originalException: o,
        mechanism: {
          handled: !1,
          type: "auto.browser.global_handlers.onunhandledrejection",
        },
      });
  });
}
function Pp(e) {
  if (Fe(e)) return e;
  try {
    if ("reason" in e) return e.reason;
    if ("detail" in e && "reason" in e.detail) return e.detail.reason;
  } catch {}
  return e;
}
function Up(e) {
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
function s0(e, t, n, r) {
  let o = (e.exception = e.exception || {}),
    i = (o.values = o.values || []),
    s = (i[0] = i[0] || {}),
    a = (s.stacktrace = s.stacktrace || {}),
    c = (a.frames = a.frames || []);
  return (
    c.length === 0 &&
      c.push({
        colno: r,
        lineno: n,
        filename: a0(t) ?? at(),
        function: "?",
        in_app: !0,
      }),
    e
  );
}
function SE(e) {
  b && _.log(`Global Handler attached: ${e}`);
}
function EE() {
  return I()?.getOptions() || { stackParser: () => [], attachStacktrace: !1 };
}
function a0(e) {
  if (!(!je(e) || e.length === 0))
    return e.startsWith("data:") ? `<${it(e, !1)}>` : e;
}
var Dp = () => ({
  name: "HttpContext",
  preprocessEvent(e) {
    if (!N.navigator && !N.location && !N.document) return;
    let t = gi(),
      n = { ...t.headers, ...e.request?.headers };
    e.request = { ...t, ...e.request, headers: n };
  },
  processSegmentSpan(e) {
    let t = e.attributes?.[J];
    if (!N.navigator && !N.location && !N.document) return;
    let n = gi();
    Lt(e, {
      "url.full": t !== "http.client" ? n.url : void 0,
      "http.request.header.user_agent": n.headers["User-Agent"],
      "http.request.header.referer": n.headers.Referer,
    });
  },
});
var c0 = "cause",
  u0 = 5,
  l0 = "LinkedErrors",
  f0 = (e = {}) => {
    let t = e.limit || u0,
      n = e.key || c0;
    return {
      name: l0,
      preprocessEvent(r, o, i) {
        let s = i.getOptions();
        yf($s, s.stackParser, n, t, r, o);
      },
    };
  },
  Bp = f0;
var p0 = /^HTML(\w*)Element$/;
function Fp(e) {
  if (typeof window < "u" && e === window) return "[Window]";
  if (typeof document < "u" && e === document) return "[Document]";
  if (Cp(e)) {
    let t = d0(e);
    if (p0.test(t)) return `[HTMLElement: ${Se(e)}]`;
  }
}
function d0(e) {
  let t = Object.getPrototypeOf(e);
  return t?.constructor ? t.constructor.name : "null prototype";
}
function TE() {
  return m0()
    ? (b &&
        We(() => {
          console.error(
            "[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/",
          );
        }),
      !0)
    : !1;
}
function m0() {
  if (typeof N.window > "u") return !1;
  let e = N;
  if (e.nw || !(e.chrome || e.browser)?.runtime?.id) return !1;
  let n = at();
  return !(
    N === N.top &&
    /^(?:chrome-extension|moz-extension|ms-browser-extension|safari-web-extension):\/\//.test(
      n,
    )
  );
}
function yE(e) {
  return [gc(), _c(), Af(), wp(), kp(), Lp(), Bp(), yc(), Dp(), Mp(), Op()];
}
function _0(e = {}) {
  let t = !e.skipBrowserExtensionCheck && TE(),
    n = e.defaultIntegrations == null ? yE() : e.defaultIntegrations,
    r = {
      ...e,
      enabled: t ? !1 : e.enabled,
      stackParser: Sa(e.stackParser || xp),
      integrations: cc({
        integrations: e.integrations,
        defaultIntegrations: n,
      }),
      transport: e.transport || Js,
    };
  return Ia(Fp), cf(Ws, r);
}
function h0() {}
function g0(e) {
  e();
}
function S0(e = {}) {
  let t = N.document,
    n = t?.head || t?.body;
  if (!n) {
    b && _.error("[showReportDialog] Global document not defined");
    return;
  }
  let r = C(),
    i = I()?.getDsn();
  if (!i) {
    b && _.error("[showReportDialog] DSN not configured");
    return;
  }
  let s = {
      ...e,
      user: { ...r.getUser(), ...e.user },
      eventId: e.eventId || Es(),
    },
    a = N.document.createElement("script");
  (a.async = !0), (a.crossOrigin = "anonymous"), (a.src = ql(i, s));
  let { onLoad: c, onClose: u } = s;
  if ((c && (a.onload = c), u)) {
    let f = (l) => {
      if (l.data === "__sentry_reportdialog_closed__")
        try {
          u();
        } finally {
          N.removeEventListener("message", f);
        }
    };
    N.addEventListener("message", f);
  }
  n.appendChild(a);
}
var E0 = v,
  T0 = "ReportingObserver",
  IE = new WeakMap(),
  y0 = (e = {}) => {
    let t = e.types || ["crash", "deprecation", "intervention"];
    function n(r) {
      if (IE.has(I()))
        for (let o of r)
          De((i) => {
            i.setExtra("url", o.url);
            let s = `ReportingObserver [${o.type}]`,
              a = "No details available";
            if (o.body) {
              let c = {};
              for (let u in o.body) c[u] = o.body[u];
              if ((i.setExtra("body", c), o.type === "crash")) {
                let u = o.body;
                a = [u.crashId || "", u.reason || ""].join(" ").trim() || a;
              } else a = o.body.message || a;
            }
            gs(`${s}: ${a}`);
          });
    }
    return {
      name: T0,
      setupOnce() {
        if (!Hc()) return;
        new E0.ReportingObserver(n, { buffered: !0, types: t }).observe();
      },
      setup(r) {
        IE.set(r, !0);
      },
    };
  },
  I0 = y0;
var b0 = "HttpClient",
  A0 = (e = {}) => {
    let t = {
      failedRequestStatusCodes: [[500, 599]],
      failedRequestTargets: [/.*/],
      ...e,
    };
    return {
      name: b0,
      setup(n) {
        O0(n, t), M0(n, t);
      },
    };
  },
  R0 = A0;
function v0(e, t, n, r, o) {
  if (AE(e, n.status, n.url)) {
    let i = L0(t, r),
      s,
      a,
      c,
      u,
      f = vE();
    if (
      (f.requestHeaders !== !1 && (s = yr(bE(i.headers), f.requestHeaders)),
      f.responseHeaders !== !1 && (a = yr(bE(n.headers), f.responseHeaders)),
      f.cookies !== !1)
    ) {
      let d = i.headers.get("Cookie") || void 0;
      if (d) {
        let m = xs(d, f.cookies);
        typeof m == "object" && (c = m);
      }
      let p = n.headers.get("Set-Cookie") || void 0;
      if (p) {
        let m = xs(p, f.cookies);
        typeof m == "object" && (u = m);
      }
    }
    let l = RE({
      url: i.url,
      method: i.method,
      status: n.status,
      requestHeaders: s,
      responseHeaders: a,
      requestCookies: c,
      responseCookies: u,
      error: o,
      type: "fetch",
    });
    mn(l);
  }
}
function N0(e, t, n, r, o) {
  if (AE(e, t.status, t.responseURL)) {
    let i,
      s,
      a,
      c = vE();
    if (c.cookies !== !1)
      try {
        let f =
          t.getResponseHeader("Set-Cookie") ||
          t.getResponseHeader("set-cookie") ||
          void 0;
        if (f) {
          let l = xs(f, c.cookies);
          typeof l == "object" && (s = l);
        }
      } catch {}
    if (c.responseHeaders !== !1)
      try {
        a = yr(x0(t), c.responseHeaders);
      } catch {}
    c.requestHeaders !== !1 && (i = yr(r, c.requestHeaders));
    let u = RE({
      url: t.responseURL,
      method: n,
      status: t.status,
      requestHeaders: i,
      responseHeaders: a,
      responseCookies: s,
      error: o,
      type: "xhr",
    });
    mn(u);
  }
}
function C0(e) {
  if (e) {
    let t = e["Content-Length"] || e["content-length"];
    if (t) return parseInt(t, 10);
  }
}
function bE(e) {
  let t = {};
  return (
    e.forEach((n, r) => {
      t[r] = n;
    }),
    t
  );
}
function x0(e) {
  let t = e.getAllResponseHeaders();
  return t
    ? t
        .split(
          `\r
`,
        )
        .reduce((n, r) => {
          let [o, i] = r.split(": ");
          return o && i && (n[o] = i), n;
        }, {})
    : {};
}
function k0(e, t) {
  return e.some((n) => (typeof n == "string" ? t.includes(n) : n.test(t)));
}
function w0(e, t) {
  return e.some((n) =>
    typeof n == "number" ? n === t : t >= n[0] && t <= n[1],
  );
}
function O0(e, t) {
  pi() &&
    Ln((n) => {
      if (I() !== e) return;
      let { response: r, args: o, error: i, virtualError: s } = n,
        [a, c] = o;
      r && v0(t, a, r, c, i || s);
    }, !1);
}
function M0(e, t) {
  "XMLHttpRequest" in v &&
    Io((n) => {
      if (I() !== e) return;
      let { error: r, virtualError: o } = n,
        i = n.xhr,
        s = i[_t];
      if (!s) return;
      let { method: a, request_headers: c } = s;
      try {
        N0(t, i, a, c, r || o);
      } catch (u) {
        b &&
          _.warn("Error while extracting response event form XHR response", u);
      }
    });
}
function AE(e, t, n) {
  return (
    w0(e.failedRequestStatusCodes, t) &&
    k0(e.failedRequestTargets, n) &&
    !Qo(n, I())
  );
}
function RE(e) {
  let t = I(),
    n = t && e.error && e.error instanceof Error ? e.error.stack : void 0,
    r = n && t ? t.getOptions().stackParser(n, 0, 1) : void 0,
    o = `HTTP Client Error with status code: ${e.status}`,
    i = {
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
          body_size: C0(e.responseHeaders),
        },
      },
    };
  return Ye(i, { type: `auto.http.client.${e.type}`, handled: !1 }), i;
}
function L0(e, t) {
  return (!t && e instanceof Request) || (e instanceof Request && e.bodyUsed)
    ? e
    : new Request(e, t);
}
function vE() {
  let e = I();
  if (!e) return { cookies: !1, requestHeaders: !1, responseHeaders: !1 };
  let t = e.getOptions();
  if (t.dataCollection == null) {
    let o = !!t.sendDefaultPii;
    return { cookies: o, requestHeaders: o, responseHeaders: o };
  }
  let { cookies: n, httpHeaders: r } = e.getDataCollectionOptions();
  return { cookies: n, requestHeaders: r.request, responseHeaders: r.response };
}
var Hp = v,
  P0 = 7,
  U0 = "ContextLines",
  D0 = (e = {}) => ({
    name: U0,
    processEvent(t, n, r) {
      let o =
        e.frameContextLines ??
        r?.getDataCollectionOptions().frameContextLines ??
        P0;
      return F0(t, o);
    },
  }),
  B0 = D0;
function F0(e, t) {
  let n = Hp.document,
    r = Hp.location && Xo(Hp.location.href);
  if (!n || !r) return e;
  let o = e.exception?.values;
  if (!o?.length) return e;
  let i = n.documentElement.innerHTML;
  if (!i) return e;
  let s = [
    "<!DOCTYPE html>",
    "<html>",
    ...i.split(`
`),
    "</html>",
  ];
  return (
    o.forEach((a) => {
      let c = a.stacktrace;
      c?.frames && (c.frames = c.frames.map((u) => H0(u, s, r, t)));
    }),
    e
  );
}
function H0(e, t, n, r) {
  return e.filename !== n || !e.lineno || !t.length || ba(t, e, r), e;
}
var G0 = "GraphQLClient",
  $0 = (e) => ({
    name: G0,
    setup(t) {
      W0(t, e), j0(t, e);
    },
  });
function W0(e, t) {
  e.on("beforeOutgoingRequestSpan", (n, r) => {
    let i = L(n).data || {};
    if (!(i[J] === "http.client")) return;
    let c = i[Ga] || i["http.url"] || i.url,
      u = i[Ha] || i["http.method"];
    if (!je(c) || !je(u)) return;
    let { endpoints: f } = t,
      l = He(c, f),
      d = CE(r);
    if (l && d) {
      let p = xE(d);
      if (p) {
        let m = NE(p);
        n.updateName(`${u} ${c} (${m})`),
          Su(p) && n.setAttribute("graphql.document", p.query),
          Eu(p) &&
            (n.setAttribute(
              "graphql.persisted_query.hash.sha256",
              p.extensions.persistedQuery.sha256Hash,
            ),
            n.setAttribute(
              "graphql.persisted_query.version",
              p.extensions.persistedQuery.version,
            ));
      }
    }
  });
}
function j0(e, t) {
  e.on("beforeOutgoingRequestBreadcrumb", (n, r) => {
    let { category: o, type: i, data: s } = n;
    if (i === "http" && (o === "fetch" || o === "xhr")) {
      let f = s?.url,
        { endpoints: l } = t,
        d = He(f, l),
        p = CE(r);
      if (d && s && p) {
        let m = xE(p);
        if (!s.graphql && m) {
          let h = NE(m);
          (s["graphql.operation"] = h),
            Su(m) && (s["graphql.document"] = m.query),
            Eu(m) &&
              ((s["graphql.persisted_query.hash.sha256"] =
                m.extensions.persistedQuery.sha256Hash),
              (s["graphql.persisted_query.version"] =
                m.extensions.persistedQuery.version));
        }
      }
    }
  });
}
function NE(e) {
  if (Eu(e)) return `persisted ${e.operationName}`;
  if (Su(e)) {
    let { query: t, operationName: n } = e,
      { operationName: r = n, operationType: o } = z0(t);
    return r ? `${o} ${r}` : `${o}`;
  }
  return "unknown";
}
function CE(e) {
  let t = "xhr" in e,
    n;
  if (t) {
    let r = e.xhr[_t];
    n = r && bo(r.body)[0];
  } else {
    let r = vi(e.input);
    n = bo(r)[0];
  }
  return n;
}
function z0(e) {
  let t = /^(?:\s*)(query|mutation|subscription)(?:\s*)(\w+)(?:\s*)[{(]/,
    n = /^(?:\s*)(query|mutation|subscription)(?:\s*)[{(]/,
    r = e.match(t);
  if (r) return { operationType: r[1], operationName: r[2] };
  let o = e.match(n);
  return o
    ? { operationType: o[1], operationName: void 0 }
    : { operationType: void 0, operationName: void 0 };
}
function gu(e) {
  return typeof e == "object" && e !== null;
}
function Su(e) {
  return gu(e) && typeof e.query == "string";
}
function Eu(e) {
  return (
    gu(e) &&
    typeof e.operationName == "string" &&
    gu(e.extensions) &&
    gu(e.extensions.persistedQuery) &&
    typeof e.extensions.persistedQuery.sha256Hash == "string" &&
    typeof e.extensions.persistedQuery.version == "number"
  );
}
function xE(e) {
  try {
    let t = JSON.parse(e);
    return Su(t) || Eu(t) ? t : void 0;
  } catch {
    return;
  }
}
var q0 = $0;
var Y0 = (e = {}) => {
  let t = ["script"];
  function n(r, o, i = 0) {
    if (!r) return;
    let s =
      "shadowRoot" in r && r.shadowRoot ? r.shadowRoot.children : r.children;
    for (let a of s) {
      if (!(a instanceof HTMLElement)) continue;
      let c = Nr(a, 1) || void 0,
        u = a.tagName.toLowerCase();
      if (t.includes(u)) continue;
      let f =
        e.onElement?.({ element: a, componentName: c, tagName: u, depth: i }) ||
        {};
      if (f === "skip") continue;
      if (f === "children") {
        n(a, o, i + 1);
        continue;
      }
      let { x: l, y: d, width: p, height: m } = a.getBoundingClientRect(),
        h = {
          identifier: a.id || void 0,
          type: c || u,
          visible: !0,
          alpha: 1,
          height: m,
          width: p,
          x: l,
          y: d,
          ...f,
        },
        g = [];
      (h.children = g), n(a, h.children, i + 1), o.push(h);
    }
  }
  return {
    name: "ViewHierarchy",
    processEvent: (r, o) => {
      if (r.type !== void 0 || e.shouldAttach?.(r, o) === !1) return r;
      let i = { rendering_system: "DOM", positioning: "absolute", windows: [] };
      n(e.rootElement?.() || N.document.body, i.windows);
      let s = {
        filename: "view-hierarchy.json",
        attachmentType: "event.view_hierarchy",
        contentType: "application/json",
        data: JSON.stringify(i),
      };
      return (o.attachments = o.attachments || []), o.attachments.push(s), r;
    },
  };
};
var Re = v,
  hd = "sentryReplaySession",
  V0 = "replay_event",
  gd = "Unable to send Replay",
  K0 = 3e5,
  J0 = 9e5,
  X0 = 5e3,
  Q0 = 5500,
  Z0 = 6e4,
  ek = 5e3,
  tk = 3,
  kE = 15e4,
  Tu = 5e3,
  nk = 3e3,
  rk = 300,
  Sd = 2e7,
  ok = 4999,
  ik = 5e4,
  wE = 36e5,
  sk = Object.defineProperty,
  ak = (e, t, n) =>
    t in e
      ? sk(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  OE = (e, t, n) => ak(e, typeof t != "symbol" ? t + "" : t, n),
  $e = ((e) => (
    (e[(e.Document = 0)] = "Document"),
    (e[(e.DocumentType = 1)] = "DocumentType"),
    (e[(e.Element = 2)] = "Element"),
    (e[(e.Text = 3)] = "Text"),
    (e[(e.CDATA = 4)] = "CDATA"),
    (e[(e.Comment = 5)] = "Comment"),
    e
  ))($e || {});
function ck(e) {
  return e.nodeType === e.ELEMENT_NODE;
}
function Zs(e) {
  return e?.host?.shadowRoot === e;
}
function ea(e) {
  return Object.prototype.toString.call(e) === "[object ShadowRoot]";
}
function uk(e) {
  return (
    e.includes(" background-clip: text;") &&
      !e.includes(" -webkit-background-clip: text;") &&
      (e = e.replace(
        /\sbackground-clip:\s*text;/g,
        " -webkit-background-clip: text; background-clip: text;",
      )),
    e
  );
}
function lk(e) {
  let { cssText: t } = e;
  if (t.split('"').length < 3) return t;
  let n = ["@import", `url(${JSON.stringify(e.href)})`];
  return (
    e.layerName === ""
      ? n.push("layer")
      : e.layerName && n.push(`layer(${e.layerName})`),
    e.supportsText && n.push(`supports(${e.supportsText})`),
    e.media.length && n.push(e.media.mediaText),
    n.join(" ") + ";"
  );
}
function Ru(e) {
  try {
    let t = e.rules || e.cssRules;
    return t ? uk(Array.from(t, nT).join("")) : null;
  } catch {
    return null;
  }
}
function fk(e) {
  let t = "";
  for (let n = 0; n < e.style.length; n++) {
    let r = e.style,
      o = r[n],
      i = r.getPropertyPriority(o);
    t += `${o}:${r.getPropertyValue(o)}${i ? " !important" : ""};`;
  }
  return `${e.selectorText} { ${t} }`;
}
function nT(e) {
  let t;
  if (dk(e))
    try {
      t = Ru(e.styleSheet) || lk(e);
    } catch {}
  else if (mk(e)) {
    let n = e.cssText,
      r = e.selectorText.includes(":"),
      o = typeof e.style.all == "string" && e.style.all;
    if ((o && (n = fk(e)), r && (n = pk(n)), r || o)) return n;
  }
  return t || e.cssText;
}
function pk(e) {
  let t = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
  return e.replace(t, "$1\\$2");
}
function dk(e) {
  return "styleSheet" in e;
}
function mk(e) {
  return "selectorText" in e;
}
var vu = class {
  constructor() {
    OE(this, "idNodeMap", new Map()), OE(this, "nodeMetaMap", new WeakMap());
  }
  getId(t) {
    return t ? (this.getMeta(t)?.id ?? -1) : -1;
  }
  getNode(t) {
    return this.idNodeMap.get(t) || null;
  }
  getIds() {
    return Array.from(this.idNodeMap.keys());
  }
  getMeta(t) {
    return this.nodeMetaMap.get(t) || null;
  }
  removeNodeFromMap(t) {
    let n = this.getId(t);
    this.idNodeMap.delete(n),
      t.childNodes && t.childNodes.forEach((r) => this.removeNodeFromMap(r));
  }
  has(t) {
    return this.idNodeMap.has(t);
  }
  hasNode(t) {
    return this.nodeMetaMap.has(t);
  }
  add(t, n) {
    let r = n.id;
    this.idNodeMap.set(r, t), this.nodeMetaMap.set(t, n);
  }
  replace(t, n) {
    let r = this.getNode(t);
    if (r) {
      let o = this.nodeMetaMap.get(r);
      o && this.nodeMetaMap.set(n, o);
    }
    this.idNodeMap.set(t, n);
  }
  reset() {
    (this.idNodeMap = new Map()), (this.nodeMetaMap = new WeakMap());
  }
};
function _k() {
  return new vu();
}
function Hu({ maskInputOptions: e, tagName: t, type: n }) {
  return (
    t === "OPTION" && (t = "SELECT"),
    !!(
      e[t.toLowerCase()] ||
      (n && e[n]) ||
      n === "password" ||
      (t === "INPUT" && !n && e.text)
    )
  );
}
function na({ isMasked: e, element: t, value: n, maskInputFn: r }) {
  let o = n || "";
  return e ? (r && (o = r(o, t)), "*".repeat(o.length)) : o;
}
function Pi(e) {
  return e.toLowerCase();
}
function qp(e) {
  return e.toUpperCase();
}
var ME = "__rrweb_original__";
function hk(e) {
  let t = e.getContext("2d");
  if (!t) return !0;
  let n = 50;
  for (let r = 0; r < e.width; r += n)
    for (let o = 0; o < e.height; o += n) {
      let i = t.getImageData,
        s = ME in i ? i[ME] : i;
      if (
        new Uint32Array(
          s.call(
            t,
            r,
            o,
            Math.min(n, e.width - r),
            Math.min(n, e.height - o),
          ).data.buffer,
        ).some((c) => c !== 0)
      )
        return !1;
    }
  return !0;
}
function Ed(e) {
  let t = e.type;
  return e.hasAttribute("data-rr-is-password") ? "password" : t ? Pi(t) : null;
}
function Nu(e, t, n) {
  return t === "INPUT" && (n === "radio" || n === "checkbox")
    ? e.getAttribute("value") || ""
    : e.value;
}
function rT(e, t) {
  let n;
  try {
    n = new URL(e, t ?? window.location.href);
  } catch {
    return null;
  }
  let r = /\.([0-9a-z]+)(?:$)/i;
  return n.pathname.match(r)?.[1] ?? null;
}
var LE = {};
function oT(e) {
  let t = LE[e];
  if (t) return t;
  let n = window.document,
    r = window[e];
  if (n && typeof n.createElement == "function")
    try {
      let o = n.createElement("iframe");
      (o.hidden = !0), n.head.appendChild(o);
      let i = o.contentWindow;
      i && i[e] && (r = i[e]), n.head.removeChild(o);
    } catch {}
  return (LE[e] = r.bind(window));
}
function Yp(...e) {
  return oT("setTimeout")(...e);
}
function iT(...e) {
  return oT("clearTimeout")(...e);
}
function sT(e) {
  try {
    return e.contentDocument;
  } catch {}
}
function gk(e) {
  try {
    return e.contentWindow;
  } catch {}
}
var Sk = 1,
  Ek = new RegExp("[^a-z0-9-_:]"),
  ra = -2;
function Td() {
  return Sk++;
}
function Tk(e) {
  if (e instanceof HTMLFormElement) return "form";
  let t = Pi(e.tagName);
  return Ek.test(t) ? "div" : t;
}
function yk(e) {
  let t = "";
  return (
    e.indexOf("//") > -1
      ? (t = e.split("/").slice(0, 3).join("/"))
      : (t = e.split("/")[0]),
    (t = t.split("?")[0]),
    t
  );
}
var Ci,
  PE,
  Ik = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm,
  bk = /^(?:[a-z+]+:)?\/\//i,
  Ak = /^www\..*/i,
  Rk = /^(data:)([^,]*),(.*)/i;
function vk(e, t) {
  if (!e || t.size === 0) return e;
  try {
    let n = e.split(";"),
      r = [];
    for (let o of n) {
      if (((o = o.trim()), !o)) continue;
      let i = o.indexOf(":");
      if (i === -1) {
        r.push(o);
        continue;
      }
      let s = o.slice(0, i).trim();
      t.has(s) || r.push(o);
    }
    return r.join("; ") + (r.length > 0 && e.endsWith(";") ? ";" : "");
  } catch (n) {
    return console.warn("Error filtering CSS properties:", n), e;
  }
}
function Cu(e, t) {
  return (e || "").replace(Ik, (n, r, o, i, s, a) => {
    let c = o || s || a,
      u = r || i || "";
    if (!c) return n;
    if (bk.test(c) || Ak.test(c)) return `url(${u}${c}${u})`;
    if (Rk.test(c)) return `url(${u}${c}${u})`;
    if (c[0] === "/") return `url(${u}${yk(t) + c}${u})`;
    let f = t.split("/"),
      l = c.split("/");
    f.pop();
    for (let d of l) d !== "." && (d === ".." ? f.pop() : f.push(d));
    return `url(${u}${f.join("/")}${u})`;
  });
}
var Nk = /^[^ \t\n\r\u000c]+/,
  Ck = /^[, \t\n\r\u000c]+/;
function xk(e, t) {
  if (t.trim() === "") return t;
  let n = 0;
  function r(i) {
    let s,
      a = i.exec(t.substring(n));
    return a ? ((s = a[0]), (n += s.length), s) : "";
  }
  let o = [];
  for (; r(Ck), !(n >= t.length); ) {
    let i = r(Nk);
    if (i.slice(-1) === ",")
      (i = wi(e, i.substring(0, i.length - 1))), o.push(i);
    else {
      let s = "";
      i = wi(e, i);
      let a = !1;
      for (;;) {
        let c = t.charAt(n);
        if (c === "") {
          o.push((i + s).trim());
          break;
        } else if (a) c === ")" && (a = !1);
        else if (c === ",") {
          (n += 1), o.push((i + s).trim());
          break;
        } else c === "(" && (a = !0);
        (s += c), (n += 1);
      }
    }
  }
  return o.join(", ");
}
var UE = new WeakMap();
function wi(e, t) {
  return !t || t.trim() === "" ? t : Gu(e, t);
}
function kk(e) {
  return !!(e.tagName === "svg" || e.ownerSVGElement);
}
function Gu(e, t) {
  let n = UE.get(e);
  if ((n || ((n = e.createElement("a")), UE.set(e, n)), !t)) t = "";
  else if (t.startsWith("blob:") || t.startsWith("data:")) return t;
  return n.setAttribute("href", t), n.href;
}
function aT(e, t, n, r, o, i, s) {
  if (!r) return r;
  if (n === "src" || (n === "href" && !(t === "use" && r[0] === "#")))
    return wi(e, r);
  if (n === "xlink:href" && r[0] !== "#") return wi(e, r);
  if (n === "background" && (t === "table" || t === "td" || t === "th"))
    return wi(e, r);
  if (n === "srcset") return xk(e, r);
  if (n === "style") {
    let a = Cu(r, Gu(e));
    return s && s.size > 0 && (a = vk(a, s)), a;
  } else if (t === "object" && n === "data") return wi(e, r);
  return typeof i == "function" ? i(n, r, o) : r;
}
function cT(e, t, n) {
  return (e === "video" || e === "audio") && t === "autoplay";
}
function wk(e, t, n, r) {
  try {
    if (r && e.matches(r)) return !1;
    if (typeof t == "string") {
      if (e.classList.contains(t)) return !0;
    } else
      for (let o = e.classList.length; o--; ) {
        let i = e.classList[o];
        if (t.test(i)) return !0;
      }
    if (n) return e.matches(n);
  } catch {}
  return !1;
}
function Ok(e, t) {
  for (let n = e.classList.length; n--; ) {
    let r = e.classList[n];
    if (t.test(r)) return !0;
  }
  return !1;
}
function Ao(e, t, n = 1 / 0, r = 0) {
  return !e || e.nodeType !== e.ELEMENT_NODE || r > n
    ? -1
    : t(e)
      ? r
      : Ao(e.parentNode, t, n, r + 1);
}
function Oi(e, t) {
  return (n) => {
    let r = n;
    if (r === null) return !1;
    try {
      if (e) {
        if (typeof e == "string") {
          if (r.matches(`.${e}`)) return !0;
        } else if (Ok(r, e)) return !0;
      }
      return !!(t && r.matches(t));
    } catch {
      return !1;
    }
  };
}
function Ui(e, t, n, r, o, i) {
  try {
    let s = e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
    if (s === null) return !1;
    if (s.tagName === "INPUT") {
      let u = s.getAttribute("autocomplete");
      if (
        [
          "current-password",
          "new-password",
          "cc-number",
          "cc-exp",
          "cc-exp-month",
          "cc-exp-year",
          "cc-csc",
        ].includes(u)
      )
        return !0;
    }
    let a = -1,
      c = -1;
    if (i) {
      if (((c = Ao(s, Oi(r, o))), c < 0)) return !0;
      a = Ao(s, Oi(t, n), c >= 0 ? c : 1 / 0);
    } else {
      if (((a = Ao(s, Oi(t, n))), a < 0)) return !1;
      c = Ao(s, Oi(r, o), a >= 0 ? a : 1 / 0);
    }
    return a >= 0 ? (c >= 0 ? a <= c : !0) : c >= 0 ? !1 : !!i;
  } catch {}
  return !!i;
}
function Mk(e, t, n) {
  let r = gk(e);
  if (!r) return;
  let o = !1,
    i;
  try {
    i = r.document.readyState;
  } catch {
    return;
  }
  if (i !== "complete") {
    let a = Yp(() => {
      o || (t(), (o = !0));
    }, n);
    e.addEventListener("load", () => {
      iT(a), (o = !0), t();
    });
    return;
  }
  let s = "about:blank";
  if (r.location.href !== s || e.src === s || e.src === "")
    return Yp(t, 0), e.addEventListener("load", t);
  e.addEventListener("load", t);
}
function Lk(e, t, n) {
  let r = !1,
    o;
  try {
    o = e.sheet;
  } catch {
    o = null;
  }
  if (o) return;
  let i = Yp(() => {
    r || (t(), (r = !0));
  }, n);
  e.addEventListener("load", () => {
    iT(i), (r = !0), t();
  });
}
function Pk(e, t) {
  let {
      doc: n,
      mirror: r,
      blockClass: o,
      blockSelector: i,
      unblockSelector: s,
      maskAllText: a,
      maskAttributeFn: c,
      maskTextClass: u,
      unmaskTextClass: f,
      maskTextSelector: l,
      unmaskTextSelector: d,
      inlineStylesheet: p,
      maskInputOptions: m = {},
      maskTextFn: h,
      maskInputFn: g,
      dataURLOptions: S = {},
      inlineImages: T,
      recordCanvas: x,
      keepIframeSrcFn: A,
      newlyAddedElement: M = !1,
      ignoreCSSAttributes: P,
    } = t,
    E = Uk(n, r);
  switch (e.nodeType) {
    case e.DOCUMENT_NODE:
      return e.compatMode !== "CSS1Compat"
        ? { type: $e.Document, childNodes: [], compatMode: e.compatMode }
        : { type: $e.Document, childNodes: [] };
    case e.DOCUMENT_TYPE_NODE:
      return {
        type: $e.DocumentType,
        name: e.name,
        publicId: e.publicId,
        systemId: e.systemId,
        rootId: E,
      };
    case e.ELEMENT_NODE:
      return Bk(e, {
        doc: n,
        blockClass: o,
        blockSelector: i,
        unblockSelector: s,
        inlineStylesheet: p,
        maskAttributeFn: c,
        maskInputOptions: m,
        maskInputFn: g,
        dataURLOptions: S,
        inlineImages: T,
        recordCanvas: x,
        keepIframeSrcFn: A,
        newlyAddedElement: M,
        rootId: E,
        maskTextClass: u,
        unmaskTextClass: f,
        maskTextSelector: l,
        unmaskTextSelector: d,
        ignoreCSSAttributes: P,
      });
    case e.TEXT_NODE:
      return Dk(e, {
        doc: n,
        maskAllText: a,
        maskTextClass: u,
        unmaskTextClass: f,
        maskTextSelector: l,
        unmaskTextSelector: d,
        maskTextFn: h,
        maskInputOptions: m,
        maskInputFn: g,
        rootId: E,
      });
    case e.CDATA_SECTION_NODE:
      return { type: $e.CDATA, textContent: "", rootId: E };
    case e.COMMENT_NODE:
      return { type: $e.Comment, textContent: e.textContent || "", rootId: E };
    default:
      return !1;
  }
}
function Uk(e, t) {
  if (!t.hasNode(e)) return;
  let n = t.getId(e);
  return n === 1 ? void 0 : n;
}
function Dk(e, t) {
  let {
      maskAllText: n,
      maskTextClass: r,
      unmaskTextClass: o,
      maskTextSelector: i,
      unmaskTextSelector: s,
      maskTextFn: a,
      maskInputOptions: c,
      maskInputFn: u,
      rootId: f,
    } = t,
    l = e.parentNode && e.parentNode.tagName,
    d = e.textContent,
    p = l === "STYLE" ? !0 : void 0,
    m = l === "SCRIPT" ? !0 : void 0,
    h = l === "TEXTAREA" ? !0 : void 0;
  if (p && d) {
    try {
      e.nextSibling ||
        e.previousSibling ||
        (e.parentNode.sheet?.cssRules && (d = Ru(e.parentNode.sheet)));
    } catch (S) {
      console.warn(
        `Cannot get CSS styles from text's parentNode. Error: ${S}`,
        e,
      );
    }
    d = Cu(d, Gu(t.doc));
  }
  m && (d = "SCRIPT_PLACEHOLDER");
  let g = Ui(e, r, i, o, s, n);
  if (
    (!p &&
      !m &&
      !h &&
      d &&
      g &&
      (d = a ? a(d, e.parentElement) : d.replace(/[\S]/g, "*")),
    h &&
      d &&
      (c.textarea || g) &&
      (d = u ? u(d, e.parentNode) : d.replace(/[\S]/g, "*")),
    l === "OPTION" && d)
  ) {
    let S = Hu({ type: null, tagName: l, maskInputOptions: c });
    d = na({
      isMasked: Ui(e, r, i, o, s, S),
      element: e,
      value: d,
      maskInputFn: u,
    });
  }
  return { type: $e.Text, textContent: d || "", isStyle: p, rootId: f };
}
function Bk(e, t) {
  let {
      doc: n,
      blockClass: r,
      blockSelector: o,
      unblockSelector: i,
      inlineStylesheet: s,
      maskInputOptions: a = {},
      maskAttributeFn: c,
      maskInputFn: u,
      dataURLOptions: f = {},
      inlineImages: l,
      recordCanvas: d,
      keepIframeSrcFn: p,
      newlyAddedElement: m = !1,
      rootId: h,
      maskTextClass: g,
      unmaskTextClass: S,
      maskTextSelector: T,
      unmaskTextSelector: x,
      ignoreCSSAttributes: A,
    } = t,
    M = wk(e, r, o, i),
    P = Tk(e),
    E = {},
    k = e.attributes.length;
  for (let R = 0; R < k; R++) {
    let U = e.attributes[R];
    U.name &&
      !cT(P, U.name, U.value) &&
      (E[U.name] = aT(n, P, Pi(U.name), U.value, e, c, A));
  }
  if (P === "link" && s) {
    let R = Array.from(n.styleSheets).find((w) => w.href === e.href),
      U = null;
    R && (U = Ru(R)),
      U &&
        ((E.rel = null),
        (E.href = null),
        (E.crossorigin = null),
        (E._cssText = Cu(U, R.href)));
  }
  if (
    P === "style" &&
    e.sheet &&
    !(e.innerText || e.textContent || "").trim().length
  ) {
    let R = Ru(e.sheet);
    R && (E._cssText = Cu(R, Gu(n)));
  }
  if (P === "input" || P === "textarea" || P === "select" || P === "option") {
    let R = e,
      U = Ed(R),
      w = Nu(R, qp(P), U),
      D = R.checked;
    if (U !== "submit" && U !== "button" && w) {
      let G = Ui(
        R,
        g,
        T,
        S,
        x,
        Hu({ type: U, tagName: qp(P), maskInputOptions: a }),
      );
      E.value = na({ isMasked: G, element: R, value: w, maskInputFn: u });
    }
    D && (E.checked = D);
  }
  if (
    (P === "option" &&
      (e.selected && !a.select ? (E.selected = !0) : delete E.selected),
    P === "canvas" && d)
  ) {
    if (e.__context === "2d")
      hk(e) || (E.rr_dataURL = e.toDataURL(f.type, f.quality));
    else if (!("__context" in e)) {
      let R = e.toDataURL(f.type, f.quality),
        U = n.createElement("canvas");
      (U.width = e.width), (U.height = e.height);
      let w = U.toDataURL(f.type, f.quality);
      R !== w && (E.rr_dataURL = R);
    }
  }
  if (P === "img" && l) {
    Ci || ((Ci = n.createElement("canvas")), (PE = Ci.getContext("2d")));
    let R = e,
      U = R.currentSrc || R.getAttribute("src") || "<unknown-src>",
      w = R.crossOrigin,
      D = () => {
        R.removeEventListener("load", D);
        try {
          (Ci.width = R.naturalWidth),
            (Ci.height = R.naturalHeight),
            PE.drawImage(R, 0, 0),
            (E.rr_dataURL = Ci.toDataURL(f.type, f.quality));
        } catch (G) {
          if (R.crossOrigin !== "anonymous") {
            (R.crossOrigin = "anonymous"),
              R.complete && R.naturalWidth !== 0
                ? D()
                : R.addEventListener("load", D);
            return;
          } else console.warn(`Cannot inline img src=${U}! Error: ${G}`);
        }
        R.crossOrigin === "anonymous" &&
          (w ? (E.crossOrigin = w) : R.removeAttribute("crossorigin"));
      };
    R.complete && R.naturalWidth !== 0 ? D() : R.addEventListener("load", D);
  }
  if (
    ((P === "audio" || P === "video") &&
      ((E.rr_mediaState = e.paused ? "paused" : "played"),
      (E.rr_mediaCurrentTime = e.currentTime)),
    m ||
      (e.scrollLeft && (E.rr_scrollLeft = e.scrollLeft),
      e.scrollTop && (E.rr_scrollTop = e.scrollTop)),
    M)
  ) {
    let { width: R, height: U } = e.getBoundingClientRect();
    E = { class: E.class, rr_width: `${R}px`, rr_height: `${U}px` };
  }
  P === "iframe" &&
    !p(E.src) &&
    (!M && !sT(e) && (E.rr_src = E.src), delete E.src);
  let z;
  try {
    customElements.get(P) && (z = !0);
  } catch {}
  return {
    type: $e.Element,
    tagName: P,
    attributes: E,
    childNodes: [],
    isSVG: kk(e) || void 0,
    needBlock: M,
    rootId: h,
    isCustom: z,
  };
}
function Ae(e) {
  return e == null ? "" : e.toLowerCase();
}
function Fk(e, t) {
  if (t.comment && e.type === $e.Comment) return !0;
  if (e.type === $e.Element) {
    if (
      t.script &&
      (e.tagName === "script" ||
        (e.tagName === "link" &&
          (e.attributes.rel === "preload" ||
            e.attributes.rel === "modulepreload")) ||
        (e.tagName === "link" &&
          e.attributes.rel === "prefetch" &&
          typeof e.attributes.href == "string" &&
          rT(e.attributes.href) === "js"))
    )
      return !0;
    if (
      t.headFavicon &&
      ((e.tagName === "link" && e.attributes.rel === "shortcut icon") ||
        (e.tagName === "meta" &&
          (Ae(e.attributes.name).match(/^msapplication-tile(image|color)$/) ||
            Ae(e.attributes.name) === "application-name" ||
            Ae(e.attributes.rel) === "icon" ||
            Ae(e.attributes.rel) === "apple-touch-icon" ||
            Ae(e.attributes.rel) === "shortcut icon")))
    )
      return !0;
    if (e.tagName === "meta") {
      if (
        t.headMetaDescKeywords &&
        Ae(e.attributes.name).match(/^description|keywords$/)
      )
        return !0;
      if (
        t.headMetaSocial &&
        (Ae(e.attributes.property).match(/^(og|twitter|fb):/) ||
          Ae(e.attributes.name).match(/^(og|twitter):/) ||
          Ae(e.attributes.name) === "pinterest")
      )
        return !0;
      if (
        t.headMetaRobots &&
        (Ae(e.attributes.name) === "robots" ||
          Ae(e.attributes.name) === "googlebot" ||
          Ae(e.attributes.name) === "bingbot")
      )
        return !0;
      if (t.headMetaHttpEquiv && e.attributes["http-equiv"] !== void 0)
        return !0;
      if (
        t.headMetaAuthorship &&
        (Ae(e.attributes.name) === "author" ||
          Ae(e.attributes.name) === "generator" ||
          Ae(e.attributes.name) === "framework" ||
          Ae(e.attributes.name) === "publisher" ||
          Ae(e.attributes.name) === "progid" ||
          Ae(e.attributes.property).match(/^article:/) ||
          Ae(e.attributes.property).match(/^product:/))
      )
        return !0;
      if (
        t.headMetaVerification &&
        (Ae(e.attributes.name) === "google-site-verification" ||
          Ae(e.attributes.name) === "yandex-verification" ||
          Ae(e.attributes.name) === "csrf-token" ||
          Ae(e.attributes.name) === "p:domain_verify" ||
          Ae(e.attributes.name) === "verify-v1" ||
          Ae(e.attributes.name) === "verification" ||
          Ae(e.attributes.name) === "shopify-checkout-api-token")
      )
        return !0;
    }
  }
  return !1;
}
function Mi(e, t) {
  let {
      doc: n,
      mirror: r,
      blockClass: o,
      blockSelector: i,
      unblockSelector: s,
      maskAllText: a,
      maskTextClass: c,
      unmaskTextClass: u,
      maskTextSelector: f,
      unmaskTextSelector: l,
      skipChild: d = !1,
      inlineStylesheet: p = !0,
      maskInputOptions: m = {},
      maskAttributeFn: h,
      maskTextFn: g,
      maskInputFn: S,
      slimDOMOptions: T,
      dataURLOptions: x = {},
      inlineImages: A = !1,
      recordCanvas: M = !1,
      onSerialize: P,
      onIframeLoad: E,
      iframeLoadTimeout: k = 5e3,
      onBlockedImageLoad: z,
      onStylesheetLoad: R,
      stylesheetLoadTimeout: U = 5e3,
      keepIframeSrcFn: w = () => !1,
      newlyAddedElement: D = !1,
      ignoreCSSAttributes: G,
    } = t,
    { preserveWhiteSpace: oe = !0 } = t,
    ae = Pk(e, {
      doc: n,
      mirror: r,
      blockClass: o,
      blockSelector: i,
      maskAllText: a,
      unblockSelector: s,
      maskTextClass: c,
      unmaskTextClass: u,
      maskTextSelector: f,
      unmaskTextSelector: l,
      inlineStylesheet: p,
      maskInputOptions: m,
      maskAttributeFn: h,
      maskTextFn: g,
      maskInputFn: S,
      dataURLOptions: x,
      inlineImages: A,
      recordCanvas: M,
      keepIframeSrcFn: w,
      newlyAddedElement: D,
      ignoreCSSAttributes: G,
    });
  if (!ae) return console.warn(e, "not serialized"), null;
  let W;
  r.hasNode(e)
    ? (W = r.getId(e))
    : Fk(ae, T) ||
        (!oe &&
          ae.type === $e.Text &&
          !ae.isStyle &&
          !ae.textContent.trim().length)
      ? (W = ra)
      : (W = Td());
  let O = Object.assign(ae, { id: W });
  if ((r.add(e, O), W === ra)) return null;
  P && P(e);
  let j = !d;
  if (O.type === $e.Element) {
    j = j && !O.needBlock;
    let B = e.shadowRoot;
    B && ea(B) && (O.isShadowHost = !0);
  }
  if ((O.type === $e.Document || O.type === $e.Element) && j) {
    T.headWhitespace &&
      O.type === $e.Element &&
      O.tagName === "head" &&
      (oe = !1);
    let B = {
        doc: n,
        mirror: r,
        blockClass: o,
        blockSelector: i,
        maskAllText: a,
        unblockSelector: s,
        maskTextClass: c,
        unmaskTextClass: u,
        maskTextSelector: f,
        unmaskTextSelector: l,
        skipChild: d,
        inlineStylesheet: p,
        maskInputOptions: m,
        maskAttributeFn: h,
        maskTextFn: g,
        maskInputFn: S,
        slimDOMOptions: T,
        dataURLOptions: x,
        inlineImages: A,
        recordCanvas: M,
        preserveWhiteSpace: oe,
        onSerialize: P,
        onIframeLoad: E,
        iframeLoadTimeout: k,
        onBlockedImageLoad: z,
        onStylesheetLoad: R,
        stylesheetLoadTimeout: U,
        keepIframeSrcFn: w,
        ignoreCSSAttributes: G,
      },
      se = e.childNodes ? Array.from(e.childNodes) : [];
    for (let ce of se) {
      let ge = Mi(ce, B);
      ge && O.childNodes.push(ge);
    }
    if (ck(e) && e.shadowRoot)
      for (let ce of Array.from(e.shadowRoot.childNodes)) {
        let ge = Mi(ce, B);
        ge && (ea(e.shadowRoot) && (ge.isShadow = !0), O.childNodes.push(ge));
      }
  }
  if (
    (e.parentNode && Zs(e.parentNode) && ea(e.parentNode) && (O.isShadow = !0),
    O.type === $e.Element &&
      O.tagName === "iframe" &&
      !O.needBlock &&
      Mk(
        e,
        () => {
          let B = sT(e);
          if (B && E) {
            let se = Mi(B, {
              doc: B,
              mirror: r,
              blockClass: o,
              blockSelector: i,
              unblockSelector: s,
              maskAllText: a,
              maskTextClass: c,
              unmaskTextClass: u,
              maskTextSelector: f,
              unmaskTextSelector: l,
              skipChild: !1,
              inlineStylesheet: p,
              maskInputOptions: m,
              maskAttributeFn: h,
              maskTextFn: g,
              maskInputFn: S,
              slimDOMOptions: T,
              dataURLOptions: x,
              inlineImages: A,
              recordCanvas: M,
              preserveWhiteSpace: oe,
              onSerialize: P,
              onIframeLoad: E,
              iframeLoadTimeout: k,
              onStylesheetLoad: R,
              stylesheetLoadTimeout: U,
              keepIframeSrcFn: w,
              ignoreCSSAttributes: G,
            });
            se && E(e, se);
          }
        },
        k,
      ),
    O.type === $e.Element && O.tagName === "img" && !e.complete && O.needBlock)
  ) {
    let B = e,
      se = () => {
        if (B.isConnected && !B.complete && z)
          try {
            let ce = B.getBoundingClientRect();
            ce.width > 0 && ce.height > 0 && z(B, O, ce);
          } catch {}
        B.removeEventListener("load", se);
      };
    B.isConnected && B.addEventListener("load", se);
  }
  return (
    O.type === $e.Element &&
      O.tagName === "link" &&
      typeof O.attributes.rel == "string" &&
      (O.attributes.rel === "stylesheet" ||
        (O.attributes.rel === "preload" &&
          typeof O.attributes.href == "string" &&
          rT(O.attributes.href) === "css")) &&
      Lk(
        e,
        () => {
          if (R) {
            let B = Mi(e, {
              doc: n,
              mirror: r,
              blockClass: o,
              blockSelector: i,
              unblockSelector: s,
              maskAllText: a,
              maskTextClass: c,
              unmaskTextClass: u,
              maskTextSelector: f,
              unmaskTextSelector: l,
              skipChild: !1,
              inlineStylesheet: p,
              maskInputOptions: m,
              maskAttributeFn: h,
              maskTextFn: g,
              maskInputFn: S,
              slimDOMOptions: T,
              dataURLOptions: x,
              inlineImages: A,
              recordCanvas: M,
              preserveWhiteSpace: oe,
              onSerialize: P,
              onIframeLoad: E,
              iframeLoadTimeout: k,
              onStylesheetLoad: R,
              stylesheetLoadTimeout: U,
              keepIframeSrcFn: w,
              ignoreCSSAttributes: G,
            });
            B && R(e, B);
          }
        },
        U,
      ),
    O.type === $e.Element && delete O.needBlock,
    O
  );
}
function Hk(e, t) {
  let {
    mirror: n = new vu(),
    blockClass: r = "rr-block",
    blockSelector: o = null,
    unblockSelector: i = null,
    maskAllText: s = !1,
    maskTextClass: a = "rr-mask",
    unmaskTextClass: c = null,
    maskTextSelector: u = null,
    unmaskTextSelector: f = null,
    inlineStylesheet: l = !0,
    inlineImages: d = !1,
    recordCanvas: p = !1,
    maskAllInputs: m = !1,
    maskAttributeFn: h,
    maskTextFn: g,
    maskInputFn: S,
    slimDOM: T = !1,
    dataURLOptions: x,
    preserveWhiteSpace: A,
    onSerialize: M,
    onIframeLoad: P,
    iframeLoadTimeout: E,
    onBlockedImageLoad: k,
    onStylesheetLoad: z,
    stylesheetLoadTimeout: R,
    keepIframeSrcFn: U = () => !1,
    ignoreCSSAttributes: w = new Set([]),
  } = t || {};
  return Mi(e, {
    doc: e,
    mirror: n,
    blockClass: r,
    blockSelector: o,
    unblockSelector: i,
    maskAllText: s,
    maskTextClass: a,
    unmaskTextClass: c,
    maskTextSelector: u,
    unmaskTextSelector: f,
    skipChild: !1,
    inlineStylesheet: l,
    maskInputOptions:
      m === !0
        ? {
            color: !0,
            date: !0,
            "datetime-local": !0,
            email: !0,
            month: !0,
            number: !0,
            range: !0,
            search: !0,
            tel: !0,
            text: !0,
            time: !0,
            url: !0,
            week: !0,
            textarea: !0,
            select: !0,
          }
        : m === !1
          ? {}
          : m,
    maskAttributeFn: h,
    maskTextFn: g,
    maskInputFn: S,
    slimDOMOptions:
      T === !0 || T === "all"
        ? {
            script: !0,
            comment: !0,
            headFavicon: !0,
            headWhitespace: !0,
            headMetaDescKeywords: T === "all",
            headMetaSocial: !0,
            headMetaRobots: !0,
            headMetaHttpEquiv: !0,
            headMetaAuthorship: !0,
            headMetaVerification: !0,
          }
        : T === !1
          ? {}
          : T,
    dataURLOptions: x,
    inlineImages: d,
    recordCanvas: p,
    preserveWhiteSpace: A,
    onSerialize: M,
    onIframeLoad: P,
    iframeLoadTimeout: E,
    onBlockedImageLoad: k,
    onStylesheetLoad: z,
    stylesheetLoadTimeout: R,
    keepIframeSrcFn: U,
    newlyAddedElement: !1,
    ignoreCSSAttributes: w,
  });
}
function gt(e, t, n = document) {
  let r = { capture: !0, passive: !0 };
  return n.addEventListener(e, t, r), () => n.removeEventListener(e, t, r);
}
var xi = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`,
  DE = {
    map: {},
    getId() {
      return console.error(xi), -1;
    },
    getNode() {
      return console.error(xi), null;
    },
    removeNodeFromMap() {
      console.error(xi);
    },
    has() {
      return console.error(xi), !1;
    },
    reset() {
      console.error(xi);
    },
  };
typeof window < "u" &&
  window.Proxy &&
  window.Reflect &&
  (DE = new Proxy(DE, {
    get(e, t, n) {
      return t === "map" && console.error(xi), Reflect.get(e, t, n);
    },
  }));
function oa(e, t, n = {}) {
  let r = null,
    o = 0;
  return function (...i) {
    let s = Date.now();
    !o && n.leading === !1 && (o = s);
    let a = t - (s - o),
      c = this;
    a <= 0 || a > t
      ? (r && (qk(r), (r = null)), (o = s), e.apply(c, i))
      : !r &&
        n.trailing !== !1 &&
        (r = $u(() => {
          (o = n.leading === !1 ? 0 : Date.now()), (r = null), e.apply(c, i);
        }, a));
  };
}
function uT(e, t, n, r, o = window) {
  let i = o.Object.getOwnPropertyDescriptor(e, t);
  return (
    o.Object.defineProperty(
      e,
      t,
      r
        ? n
        : {
            set(s) {
              $u(() => {
                n.set.call(this, s);
              }, 0),
                i && i.set && i.set.call(this, s);
            },
          },
    ),
    () => uT(e, t, i || {}, !0)
  );
}
function yd(e, t, n) {
  try {
    if (!(t in e)) return () => {};
    let r = e[t],
      o = n(r);
    return (
      typeof o == "function" &&
        ((o.prototype = o.prototype || {}),
        Object.defineProperties(o, {
          __rrweb_original__: { enumerable: !1, value: r },
        })),
      (e[t] = o),
      () => {
        e[t] = r;
      }
    );
  } catch {
    return () => {};
  }
}
var xu = Date.now;
/[1-9][0-9]{12}/.test(Date.now().toString()) ||
  (xu = () => new Date().getTime());
function lT(e) {
  let t = e.document;
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
function fT() {
  return (
    window.innerHeight ||
    (document.documentElement && document.documentElement.clientHeight) ||
    (document.body && document.body.clientHeight)
  );
}
function pT() {
  return (
    window.innerWidth ||
    (document.documentElement && document.documentElement.clientWidth) ||
    (document.body && document.body.clientWidth)
  );
}
function dT(e) {
  if (!e) return null;
  try {
    return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
  } catch {
    return null;
  }
}
function Ht(e, t, n, r, o) {
  if (!e) return !1;
  let i = dT(e);
  if (!i) return !1;
  let s = Oi(t, n);
  if (!o) {
    let u = r && i.matches(r);
    return s(i) && !u;
  }
  let a = Ao(i, s),
    c = -1;
  return a < 0
    ? !1
    : (r && (c = Ao(i, Oi(null, r))), a > -1 && c < 0 ? !0 : a < c);
}
function Gk(e, t) {
  return t.getId(e) !== -1;
}
function Gp(e, t) {
  return t.getId(e) === ra;
}
function mT(e, t) {
  if (Zs(e)) return !1;
  let n = t.getId(e);
  return t.has(n)
    ? e.parentNode && e.parentNode.nodeType === e.DOCUMENT_NODE
      ? !1
      : e.parentNode
        ? mT(e.parentNode, t)
        : !0
    : !0;
}
function Vp(e) {
  return !!e.changedTouches;
}
function $k(e = window) {
  "NodeList" in e &&
    !e.NodeList.prototype.forEach &&
    (e.NodeList.prototype.forEach = Array.prototype.forEach),
    "DOMTokenList" in e &&
      !e.DOMTokenList.prototype.forEach &&
      (e.DOMTokenList.prototype.forEach = Array.prototype.forEach),
    Node.prototype.contains ||
      (Node.prototype.contains = (...t) => {
        let n = t[0];
        if (!(0 in t)) throw new TypeError("1 argument is required");
        do if (this === n) return !0;
        while ((n = n && n.parentNode));
        return !1;
      });
}
function _T(e, t) {
  return !!(e.nodeName === "IFRAME" && t.getMeta(e));
}
function hT(e, t) {
  return !!(
    e.nodeName === "LINK" &&
    e.nodeType === e.ELEMENT_NODE &&
    e.getAttribute &&
    e.getAttribute("rel") === "stylesheet" &&
    t.getMeta(e)
  );
}
function Kp(e) {
  return !!e?.shadowRoot;
}
var Jp = class {
  constructor() {
    (this.id = 1),
      (this.styleIDMap = new WeakMap()),
      (this.idStyleMap = new Map());
  }
  getId(t) {
    return this.styleIDMap.get(t) ?? -1;
  }
  has(t) {
    return this.styleIDMap.has(t);
  }
  add(t, n) {
    if (this.has(t)) return this.getId(t);
    let r;
    return (
      n === void 0 ? (r = this.id++) : (r = n),
      this.styleIDMap.set(t, r),
      this.idStyleMap.set(r, t),
      r
    );
  }
  getStyle(t) {
    return this.idStyleMap.get(t) || null;
  }
  reset() {
    (this.styleIDMap = new WeakMap()),
      (this.idStyleMap = new Map()),
      (this.id = 1);
  }
  generateId() {
    return this.id++;
  }
};
function gT(e) {
  let t = null;
  return (
    e.getRootNode?.()?.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
      e.getRootNode().host &&
      (t = e.getRootNode().host),
    t
  );
}
function Wk(e) {
  let t = e,
    n;
  for (; (n = gT(t)); ) t = n;
  return t;
}
function jk(e) {
  let t = e.ownerDocument;
  if (!t) return !1;
  let n = Wk(e);
  return t.contains(n);
}
function ST(e) {
  let t = e.ownerDocument;
  return t ? t.contains(e) || jk(e) : !1;
}
var BE = {};
function Id(e) {
  let t = BE[e];
  if (t) return t;
  let n = window.document,
    r = window[e];
  if (n && typeof n.createElement == "function")
    try {
      let o = n.createElement("iframe");
      (o.hidden = !0), n.head.appendChild(o);
      let i = o.contentWindow;
      i && i[e] && (r = i[e]), n.head.removeChild(o);
    } catch {}
  return (BE[e] = r.bind(window));
}
function zk(...e) {
  return Id("requestAnimationFrame")(...e);
}
function $u(...e) {
  return Id("setTimeout")(...e);
}
function qk(...e) {
  return Id("clearTimeout")(...e);
}
var ee = ((e) => (
    (e[(e.DomContentLoaded = 0)] = "DomContentLoaded"),
    (e[(e.Load = 1)] = "Load"),
    (e[(e.FullSnapshot = 2)] = "FullSnapshot"),
    (e[(e.IncrementalSnapshot = 3)] = "IncrementalSnapshot"),
    (e[(e.Meta = 4)] = "Meta"),
    (e[(e.Custom = 5)] = "Custom"),
    (e[(e.Plugin = 6)] = "Plugin"),
    e
  ))(ee || {}),
  V = ((e) => (
    (e[(e.Mutation = 0)] = "Mutation"),
    (e[(e.MouseMove = 1)] = "MouseMove"),
    (e[(e.MouseInteraction = 2)] = "MouseInteraction"),
    (e[(e.Scroll = 3)] = "Scroll"),
    (e[(e.ViewportResize = 4)] = "ViewportResize"),
    (e[(e.Input = 5)] = "Input"),
    (e[(e.TouchMove = 6)] = "TouchMove"),
    (e[(e.MediaInteraction = 7)] = "MediaInteraction"),
    (e[(e.StyleSheetRule = 8)] = "StyleSheetRule"),
    (e[(e.CanvasMutation = 9)] = "CanvasMutation"),
    (e[(e.Font = 10)] = "Font"),
    (e[(e.Log = 11)] = "Log"),
    (e[(e.Drag = 12)] = "Drag"),
    (e[(e.StyleDeclaration = 13)] = "StyleDeclaration"),
    (e[(e.Selection = 14)] = "Selection"),
    (e[(e.AdoptedStyleSheet = 15)] = "AdoptedStyleSheet"),
    (e[(e.CustomElement = 16)] = "CustomElement"),
    e
  ))(V || {}),
  ht = ((e) => (
    (e[(e.MouseUp = 0)] = "MouseUp"),
    (e[(e.MouseDown = 1)] = "MouseDown"),
    (e[(e.Click = 2)] = "Click"),
    (e[(e.ContextMenu = 3)] = "ContextMenu"),
    (e[(e.DblClick = 4)] = "DblClick"),
    (e[(e.Focus = 5)] = "Focus"),
    (e[(e.Blur = 6)] = "Blur"),
    (e[(e.TouchStart = 7)] = "TouchStart"),
    (e[(e.TouchMove_Departed = 8)] = "TouchMove_Departed"),
    (e[(e.TouchEnd = 9)] = "TouchEnd"),
    (e[(e.TouchCancel = 10)] = "TouchCancel"),
    e
  ))(ht || {}),
  ir = ((e) => (
    (e[(e.Mouse = 0)] = "Mouse"),
    (e[(e.Pen = 1)] = "Pen"),
    (e[(e.Touch = 2)] = "Touch"),
    e
  ))(ir || {}),
  ki = ((e) => (
    (e[(e.Play = 0)] = "Play"),
    (e[(e.Pause = 1)] = "Pause"),
    (e[(e.Seeked = 2)] = "Seeked"),
    (e[(e.VolumeChange = 3)] = "VolumeChange"),
    (e[(e.RateChange = 4)] = "RateChange"),
    e
  ))(ki || {}),
  ta;
function Yk(e) {
  ta = e;
}
function Vk() {
  ta = void 0;
}
var ue = (e) =>
    ta
      ? (...n) => {
          try {
            return e(...n);
          } catch (r) {
            if (ta && ta(r) === !0) return () => {};
            throw r;
          }
        }
      : e,
  FE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  Kk = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (Xs = 0; Xs < FE.length; Xs++) Kk[FE.charCodeAt(Xs)] = Xs;
var Xs,
  ku = class {
    reset() {}
    freeze() {}
    unfreeze() {}
    lock() {}
    unlock() {}
    snapshot() {}
    addWindow() {}
    addShadowRoot() {}
    resetShadowRoots() {}
  };
function bd(e) {
  try {
    return e.contentDocument;
  } catch {}
}
function ia(e) {
  try {
    return e.contentWindow;
  } catch {}
}
var Xp = class {
  constructor(t) {
    (this.doc = t), (this.unattachedDoc = null);
  }
  parse(t) {
    return (
      this.parseWithConstructableStylesheet(t) ||
      this.parseWithDetachedElement(t)
    );
  }
  parseWithConstructableStylesheet(t) {
    if (
      typeof CSSStyleSheet > "u" ||
      typeof CSSStyleSheet.prototype.replaceSync != "function"
    )
      return null;
    try {
      let n = new CSSStyleSheet();
      n.replaceSync(`x { ${t} }`);
      let r = n.cssRules[0];
      return !r || r.type !== CSSRule.STYLE_RULE ? null : r.style;
    } catch {
      return null;
    }
  }
  parseWithDetachedElement(t) {
    let n = this.getUnattachedDoc().createElement("span");
    return n.setAttribute("style", t), n.style;
  }
  getUnattachedDoc() {
    if (!this.unattachedDoc)
      try {
        this.unattachedDoc = document.implementation.createHTMLDocument();
      } catch {
        this.unattachedDoc = this.doc;
      }
    return this.unattachedDoc;
  }
};
function HE(e) {
  return "__ln" in e;
}
var Qp = class {
    constructor() {
      (this.length = 0), (this.head = null), (this.tail = null);
    }
    get(t) {
      if (t >= this.length) throw new Error("Position outside of list range");
      let n = this.head;
      for (let r = 0; r < t; r++) n = n?.next || null;
      return n;
    }
    addNode(t) {
      let n = { value: t, previous: null, next: null };
      if (((t.__ln = n), t.previousSibling && HE(t.previousSibling))) {
        let r = t.previousSibling.__ln.next;
        (n.next = r),
          (n.previous = t.previousSibling.__ln),
          (t.previousSibling.__ln.next = n),
          r && (r.previous = n);
      } else if (
        t.nextSibling &&
        HE(t.nextSibling) &&
        t.nextSibling.__ln.previous
      ) {
        let r = t.nextSibling.__ln.previous;
        (n.previous = r),
          (n.next = t.nextSibling.__ln),
          (t.nextSibling.__ln.previous = n),
          r && (r.next = n);
      } else
        this.head && (this.head.previous = n),
          (n.next = this.head),
          (this.head = n);
      n.next === null && (this.tail = n), this.length++;
    }
    removeNode(t) {
      let n = t.__ln;
      this.head &&
        (n.previous
          ? ((n.previous.next = n.next),
            n.next ? (n.next.previous = n.previous) : (this.tail = n.previous))
          : ((this.head = n.next),
            this.head ? (this.head.previous = null) : (this.tail = null)),
        t.__ln && delete t.__ln,
        this.length--);
    }
  },
  GE = (e, t) => `${e}@${t}`,
  Zp = class {
    constructor() {
      (this.frozen = !1),
        (this.locked = !1),
        (this.texts = []),
        (this.attributes = []),
        (this.attributeMap = new WeakMap()),
        (this.removes = []),
        (this.mapRemoves = []),
        (this.movedMap = {}),
        (this.addedSet = new Set()),
        (this.movedSet = new Set()),
        (this.droppedSet = new Set()),
        (this.processMutations = (t) => {
          t.forEach(this.processMutation), this.emit();
        }),
        (this.emit = () => {
          if (this.frozen || this.locked) return;
          let t = [],
            n = new Set(),
            r = new Qp(),
            o = (c) => {
              let u = c,
                f = ra;
              for (; f === ra; )
                (u = u && u.nextSibling), (f = u && this.mirror.getId(u));
              return f;
            },
            i = (c) => {
              if (!c.parentNode || !ST(c)) return;
              let u = Zs(c.parentNode)
                  ? this.mirror.getId(gT(c))
                  : this.mirror.getId(c.parentNode),
                f = o(c);
              if (u === -1 || f === -1) return r.addNode(c);
              let l = Mi(c, {
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
                skipChild: !0,
                newlyAddedElement: !0,
                inlineStylesheet: this.inlineStylesheet,
                maskInputOptions: this.maskInputOptions,
                maskAttributeFn: this.maskAttributeFn,
                maskTextFn: this.maskTextFn,
                maskInputFn: this.maskInputFn,
                slimDOMOptions: this.slimDOMOptions,
                dataURLOptions: this.dataURLOptions,
                recordCanvas: this.recordCanvas,
                inlineImages: this.inlineImages,
                onSerialize: (d) => {
                  _T(d, this.mirror) &&
                    !Ht(
                      d,
                      this.blockClass,
                      this.blockSelector,
                      this.unblockSelector,
                      !1,
                    ) &&
                    this.iframeManager.addIframe(d),
                    hT(d, this.mirror) &&
                      this.stylesheetManager.trackLinkElement(d),
                    Kp(c) &&
                      this.shadowDomManager.addShadowRoot(
                        c.shadowRoot,
                        this.doc,
                      );
                },
                onIframeLoad: (d, p) => {
                  if (
                    Ht(
                      d,
                      this.blockClass,
                      this.blockSelector,
                      this.unblockSelector,
                      !1,
                    )
                  )
                    return;
                  this.iframeManager.attachIframe(d, p);
                  let m = ia(d);
                  m && this.canvasManager.addWindow(m),
                    this.shadowDomManager.observeAttachShadow(d);
                },
                onStylesheetLoad: (d, p) => {
                  this.stylesheetManager.attachLinkElement(d, p);
                },
                onBlockedImageLoad: (d, p, { width: m, height: h }) => {
                  this.mutationCb({
                    adds: [],
                    removes: [],
                    texts: [],
                    attributes: [
                      {
                        id: p.id,
                        attributes: {
                          style: { width: `${m}px`, height: `${h}px` },
                        },
                      },
                    ],
                  });
                },
                ignoreCSSAttributes: this.ignoreCSSAttributes,
              });
              l && (t.push({ parentId: u, nextId: f, node: l }), n.add(l.id));
            };
          for (; this.mapRemoves.length; )
            this.mirror.removeNodeFromMap(this.mapRemoves.shift());
          for (let c of this.movedSet)
            ($E(this.removes, c, this.mirror) &&
              !this.movedSet.has(c.parentNode)) ||
              i(c);
          for (let c of this.addedSet)
            (!WE(this.droppedSet, c) && !$E(this.removes, c, this.mirror)) ||
            WE(this.movedSet, c)
              ? i(c)
              : this.droppedSet.add(c);
          let s = null;
          for (; r.length; ) {
            let c = null;
            if (s) {
              let u = this.mirror.getId(s.value.parentNode),
                f = o(s.value);
              u !== -1 && f !== -1 && (c = s);
            }
            if (!c) {
              let u = r.tail;
              for (; u; ) {
                let f = u;
                if (((u = u.previous), f)) {
                  let l = this.mirror.getId(f.value.parentNode);
                  if (o(f.value) === -1) continue;
                  if (l !== -1) {
                    c = f;
                    break;
                  } else {
                    let p = f.value;
                    if (
                      p.parentNode &&
                      p.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
                    ) {
                      let m = p.parentNode.host;
                      if (this.mirror.getId(m) !== -1) {
                        c = f;
                        break;
                      }
                    }
                  }
                }
              }
            }
            if (!c) {
              for (; r.head; ) r.removeNode(r.head.value);
              break;
            }
            (s = c.previous), r.removeNode(c.value), i(c.value);
          }
          let a = {
            texts: this.texts
              .map((c) => ({ id: this.mirror.getId(c.node), value: c.value }))
              .filter((c) => !n.has(c.id))
              .filter((c) => this.mirror.has(c.id)),
            attributes: this.attributes
              .map((c) => {
                let { attributes: u } = c;
                if (typeof u.style == "string") {
                  let f = JSON.stringify(c.styleDiff),
                    l = JSON.stringify(c._unchangedStyles);
                  f.length < u.style.length &&
                    (f + l).split("var(").length ===
                      u.style.split("var(").length &&
                    (u.style = c.styleDiff);
                }
                return { id: this.mirror.getId(c.node), attributes: u };
              })
              .filter((c) => !n.has(c.id))
              .filter((c) => this.mirror.has(c.id)),
            removes: this.removes,
            adds: t,
          };
          (!a.texts.length &&
            !a.attributes.length &&
            !a.removes.length &&
            !a.adds.length) ||
            ((this.texts = []),
            (this.attributes = []),
            (this.attributeMap = new WeakMap()),
            (this.removes = []),
            (this.addedSet = new Set()),
            (this.movedSet = new Set()),
            (this.droppedSet = new Set()),
            (this.movedMap = {}),
            this.mutationCb(a));
        }),
        (this.processMutation = (t) => {
          if (!Gp(t.target, this.mirror))
            switch (t.type) {
              case "characterData": {
                let n = t.target.textContent;
                !Ht(
                  t.target,
                  this.blockClass,
                  this.blockSelector,
                  this.unblockSelector,
                  !1,
                ) &&
                  n !== t.oldValue &&
                  this.texts.push({
                    value:
                      Ui(
                        t.target,
                        this.maskTextClass,
                        this.maskTextSelector,
                        this.unmaskTextClass,
                        this.unmaskTextSelector,
                        this.maskAllText,
                      ) && n
                        ? this.maskTextFn
                          ? this.maskTextFn(n, dT(t.target))
                          : n.replace(/[\S]/g, "*")
                        : n,
                    node: t.target,
                  });
                break;
              }
              case "attributes": {
                let n = t.target,
                  r = t.attributeName,
                  o = t.target.getAttribute(r);
                if (r === "value") {
                  let s = Ed(n),
                    a = n.tagName;
                  o = Nu(n, a, s);
                  let c = Hu({
                      maskInputOptions: this.maskInputOptions,
                      tagName: a,
                      type: s,
                    }),
                    u = Ui(
                      t.target,
                      this.maskTextClass,
                      this.maskTextSelector,
                      this.unmaskTextClass,
                      this.unmaskTextSelector,
                      c,
                    );
                  o = na({
                    isMasked: u,
                    element: n,
                    value: o,
                    maskInputFn: this.maskInputFn,
                  });
                }
                if (
                  Ht(
                    t.target,
                    this.blockClass,
                    this.blockSelector,
                    this.unblockSelector,
                    !1,
                  ) ||
                  o === t.oldValue
                )
                  return;
                let i = this.attributeMap.get(t.target);
                if (
                  n.tagName === "IFRAME" &&
                  r === "src" &&
                  !this.keepIframeSrcFn(o)
                )
                  if (!bd(n)) r = "rr_src";
                  else return;
                if (
                  (i ||
                    ((i = {
                      node: t.target,
                      attributes: {},
                      styleDiff: {},
                      _unchangedStyles: {},
                    }),
                    this.attributes.push(i),
                    this.attributeMap.set(t.target, i)),
                  r === "type" &&
                    n.tagName === "INPUT" &&
                    (t.oldValue || "").toLowerCase() === "password" &&
                    n.setAttribute("data-rr-is-password", "true"),
                  !cT(n.tagName, r) &&
                    ((i.attributes[r] = aT(
                      this.doc,
                      Pi(n.tagName),
                      Pi(r),
                      o,
                      n,
                      this.maskAttributeFn,
                    )),
                    r === "style"))
                ) {
                  let s = t.oldValue
                    ? this.styleDeclarationParser.parse(t.oldValue)
                    : null;
                  for (let a of Array.from(n.style)) {
                    let c = n.style.getPropertyValue(a),
                      u = n.style.getPropertyPriority(a);
                    c !== (s?.getPropertyValue(a) || "") ||
                    u !== (s?.getPropertyPriority(a) || "")
                      ? u === ""
                        ? (i.styleDiff[a] = c)
                        : (i.styleDiff[a] = [c, u])
                      : (i._unchangedStyles[a] = [c, u]);
                  }
                  if (s)
                    for (let a of Array.from(s))
                      n.style.getPropertyValue(a) === "" &&
                        (i.styleDiff[a] = !1);
                }
                break;
              }
              case "childList": {
                if (
                  Ht(
                    t.target,
                    this.blockClass,
                    this.blockSelector,
                    this.unblockSelector,
                    !0,
                  )
                )
                  return;
                t.addedNodes.forEach((n) => this.genAdds(n, t.target)),
                  t.removedNodes.forEach((n) => {
                    let r = this.mirror.getId(n),
                      o = Zs(t.target)
                        ? this.mirror.getId(t.target.host)
                        : this.mirror.getId(t.target);
                    Ht(
                      t.target,
                      this.blockClass,
                      this.blockSelector,
                      this.unblockSelector,
                      !1,
                    ) ||
                      Gp(n, this.mirror) ||
                      !Gk(n, this.mirror) ||
                      (this.addedSet.has(n)
                        ? (ed(this.addedSet, n), this.droppedSet.add(n))
                        : (this.addedSet.has(t.target) && r === -1) ||
                          mT(t.target, this.mirror) ||
                          (this.movedSet.has(n) && this.movedMap[GE(r, o)]
                            ? ed(this.movedSet, n)
                            : this.removes.push({
                                parentId: o,
                                id: r,
                                isShadow:
                                  Zs(t.target) && ea(t.target) ? !0 : void 0,
                              })),
                      this.mapRemoves.push(n));
                  });
                break;
              }
            }
        }),
        (this.genAdds = (t, n) => {
          if (
            !this.processedNodeManager.inOtherBuffer(t, this) &&
            !(this.addedSet.has(t) || this.movedSet.has(t))
          ) {
            if (this.mirror.hasNode(t)) {
              if (Gp(t, this.mirror)) return;
              this.movedSet.add(t);
              let r = null;
              n && this.mirror.hasNode(n) && (r = this.mirror.getId(n)),
                r &&
                  r !== -1 &&
                  (this.movedMap[GE(this.mirror.getId(t), r)] = !0);
            } else this.addedSet.add(t), this.droppedSet.delete(t);
            Ht(
              t,
              this.blockClass,
              this.blockSelector,
              this.unblockSelector,
              !1,
            ) ||
              (t.childNodes && t.childNodes.forEach((r) => this.genAdds(r)),
              Kp(t) &&
                t.shadowRoot.childNodes.forEach((r) => {
                  this.processedNodeManager.add(r, this), this.genAdds(r, t);
                }));
          }
        });
    }
    init(t) {
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
      ].forEach((n) => {
        this[n] = t[n];
      }),
        (this.styleDeclarationParser = new Xp(this.doc));
    }
    freeze() {
      (this.frozen = !0), this.canvasManager.freeze();
    }
    unfreeze() {
      (this.frozen = !1), this.canvasManager.unfreeze(), this.emit();
    }
    isFrozen() {
      return this.frozen;
    }
    lock() {
      (this.locked = !0), this.canvasManager.lock();
    }
    unlock() {
      (this.locked = !1), this.canvasManager.unlock(), this.emit();
    }
    reset() {
      this.shadowDomManager.reset(), this.canvasManager.reset();
    }
  };
function ed(e, t) {
  e.delete(t), t.childNodes?.forEach((n) => ed(e, n));
}
function $E(e, t, n) {
  return e.length === 0 ? !1 : Jk(e, t, n);
}
function Jk(e, t, n) {
  let r = t.parentNode;
  for (; r; ) {
    let o = n.getId(r);
    if (e.some((i) => i.id === o)) return !0;
    r = r.parentNode;
  }
  return !1;
}
function WE(e, t) {
  return e.size === 0 ? !1 : ET(e, t);
}
function ET(e, t) {
  let { parentNode: n } = t;
  return n ? (e.has(n) ? !0 : ET(e, n)) : !1;
}
var Li = [];
function la(e) {
  try {
    if ("composedPath" in e) {
      let t = e.composedPath();
      if (t.length) return t[0];
    } else if ("path" in e && e.path.length) return e.path[0];
  } catch {}
  return e && e.target;
}
function TT(e, t) {
  let n = new Zp();
  Li.push(n), n.init(e);
  let r = window.MutationObserver || window.__rrMutationObserver,
    o = window?.Zone?.__symbol__?.("MutationObserver");
  o && window[o] && (r = window[o]);
  let i = new r(
    ue((s) => {
      (e.onMutation && e.onMutation(s) === !1) || n.processMutations.bind(n)(s);
    }),
  );
  return (
    i.observe(t, {
      attributes: !0,
      attributeOldValue: !0,
      characterData: !0,
      characterDataOldValue: !0,
      childList: !0,
      subtree: !0,
    }),
    i
  );
}
function Xk({ mousemoveCb: e, sampling: t, doc: n, mirror: r }) {
  if (t.mousemove === !1) return () => {};
  let o = typeof t.mousemove == "number" ? t.mousemove : 50,
    i = typeof t.mousemoveCallback == "number" ? t.mousemoveCallback : 500,
    s = [],
    a,
    c = oa(
      ue((l) => {
        let d = Date.now() - a;
        e(
          s.map((p) => ((p.timeOffset -= d), p)),
          l,
        ),
          (s = []),
          (a = null);
      }),
      i,
    ),
    u = ue(
      oa(
        ue((l) => {
          let d = la(l),
            { clientX: p, clientY: m } = Vp(l) ? l.changedTouches[0] : l;
          a || (a = xu()),
            s.push({ x: p, y: m, id: r.getId(d), timeOffset: xu() - a }),
            c(
              typeof DragEvent < "u" && l instanceof DragEvent
                ? V.Drag
                : l instanceof MouseEvent
                  ? V.MouseMove
                  : V.TouchMove,
            );
        }),
        o,
        { trailing: !1 },
      ),
    ),
    f = [gt("mousemove", u, n), gt("touchmove", u, n), gt("drag", u, n)];
  return ue(() => {
    f.forEach((l) => l());
  });
}
function Qk({
  mouseInteractionCb: e,
  doc: t,
  mirror: n,
  blockClass: r,
  blockSelector: o,
  unblockSelector: i,
  sampling: s,
}) {
  if (s.mouseInteraction === !1) return () => {};
  let a =
      s.mouseInteraction === !0 || s.mouseInteraction === void 0
        ? {}
        : s.mouseInteraction,
    c = [],
    u = null,
    f = (l) => (d) => {
      let p = la(d);
      if (Ht(p, r, o, i, !0)) return;
      let m = null,
        h = l;
      if ("pointerType" in d) {
        switch (d.pointerType) {
          case "mouse":
            m = ir.Mouse;
            break;
          case "touch":
            m = ir.Touch;
            break;
          case "pen":
            m = ir.Pen;
            break;
        }
        m === ir.Touch
          ? ht[l] === ht.MouseDown
            ? (h = "TouchStart")
            : ht[l] === ht.MouseUp && (h = "TouchEnd")
          : ir.Pen;
      } else Vp(d) && (m = ir.Touch);
      m !== null
        ? ((u = m),
          ((h.startsWith("Touch") && m === ir.Touch) ||
            (h.startsWith("Mouse") && m === ir.Mouse)) &&
            (m = null))
        : ht[l] === ht.Click && ((m = u), (u = null));
      let g = Vp(d) ? d.changedTouches[0] : d;
      if (!g) return;
      let S = n.getId(p),
        { clientX: T, clientY: x } = g;
      ue(e)({
        type: ht[h],
        id: S,
        x: T,
        y: x,
        ...(m !== null && { pointerType: m }),
      });
    };
  return (
    Object.keys(ht)
      .filter(
        (l) =>
          Number.isNaN(Number(l)) && !l.endsWith("_Departed") && a[l] !== !1,
      )
      .forEach((l) => {
        let d = Pi(l),
          p = f(l);
        if (window.PointerEvent)
          switch (ht[l]) {
            case ht.MouseDown:
            case ht.MouseUp:
              d = d.replace("mouse", "pointer");
              break;
            case ht.TouchStart:
            case ht.TouchEnd:
              return;
          }
        c.push(gt(d, p, t));
      }),
    ue(() => {
      c.forEach((l) => l());
    })
  );
}
function yT({
  scrollCb: e,
  doc: t,
  mirror: n,
  blockClass: r,
  blockSelector: o,
  unblockSelector: i,
  sampling: s,
}) {
  let a = ue(
    oa(
      ue((c) => {
        let u = la(c);
        if (!u || Ht(u, r, o, i, !0)) return;
        let f = n.getId(u);
        if (u === t && t.defaultView) {
          let l = lT(t.defaultView);
          e({ id: f, x: l.left, y: l.top });
        } else e({ id: f, x: u.scrollLeft, y: u.scrollTop });
      }),
      s.scroll || 100,
    ),
  );
  return gt("scroll", a, t);
}
function Zk({ viewportResizeCb: e }, { win: t }) {
  let n = -1,
    r = -1,
    o = ue(
      oa(
        ue(() => {
          let i = fT(),
            s = pT();
          (n !== i || r !== s) &&
            (e({ width: Number(s), height: Number(i) }), (n = i), (r = s));
        }),
        200,
      ),
    );
  return gt("resize", o, t);
}
var ew = ["INPUT", "TEXTAREA", "SELECT"],
  jE = new WeakMap();
function tw({
  inputCb: e,
  doc: t,
  mirror: n,
  blockClass: r,
  blockSelector: o,
  unblockSelector: i,
  ignoreClass: s,
  ignoreSelector: a,
  maskInputOptions: c,
  maskInputFn: u,
  sampling: f,
  userTriggeredOnInput: l,
  maskTextClass: d,
  unmaskTextClass: p,
  maskTextSelector: m,
  unmaskTextSelector: h,
}) {
  function g(E) {
    let k = la(E),
      z = E.isTrusted,
      R = k && qp(k.tagName);
    if (
      (R === "OPTION" && (k = k.parentElement),
      !k || !R || ew.indexOf(R) < 0 || Ht(k, r, o, i, !0))
    )
      return;
    let U = k;
    if (U.classList.contains(s) || (a && U.matches(a))) return;
    let w = Ed(k),
      D = Nu(U, R, w),
      G = !1,
      oe = Hu({ maskInputOptions: c, tagName: R, type: w }),
      ae = Ui(k, d, m, p, h, oe);
    (w === "radio" || w === "checkbox") && (G = k.checked),
      (D = na({ isMasked: ae, element: k, value: D, maskInputFn: u })),
      S(
        k,
        l
          ? { text: D, isChecked: G, userTriggered: z }
          : { text: D, isChecked: G },
      );
    let W = k.name;
    w === "radio" &&
      W &&
      G &&
      t.querySelectorAll(`input[type="radio"][name="${W}"]`).forEach((O) => {
        if (O !== k) {
          let j = na({
            isMasked: ae,
            element: O,
            value: Nu(O, R, w),
            maskInputFn: u,
          });
          S(
            O,
            l
              ? { text: j, isChecked: !G, userTriggered: !1 }
              : { text: j, isChecked: !G },
          );
        }
      });
  }
  function S(E, k) {
    let z = jE.get(E);
    if (!z || z.text !== k.text || z.isChecked !== k.isChecked) {
      jE.set(E, k);
      let R = n.getId(E);
      ue(e)({ ...k, id: R });
    }
  }
  let x = (f.input === "last" ? ["change"] : ["input", "change"]).map((E) =>
      gt(E, ue(g), t),
    ),
    A = t.defaultView;
  if (!A)
    return () => {
      x.forEach((E) => E());
    };
  let M = A.Object.getOwnPropertyDescriptor(
      A.HTMLInputElement.prototype,
      "value",
    ),
    P = [
      [A.HTMLInputElement.prototype, "value"],
      [A.HTMLInputElement.prototype, "checked"],
      [A.HTMLSelectElement.prototype, "value"],
      [A.HTMLTextAreaElement.prototype, "value"],
      [A.HTMLSelectElement.prototype, "selectedIndex"],
      [A.HTMLOptionElement.prototype, "selected"],
    ];
  return (
    M &&
      M.set &&
      x.push(
        ...P.map((E) =>
          uT(
            E[0],
            E[1],
            {
              set() {
                ue(g)({ target: this, isTrusted: !1 });
              },
            },
            !1,
            A,
          ),
        ),
      ),
    ue(() => {
      x.forEach((E) => E());
    })
  );
}
function wu(e) {
  let t = [];
  function n(r, o) {
    if (
      (yu("CSSGroupingRule") && r.parentRule instanceof CSSGroupingRule) ||
      (yu("CSSMediaRule") && r.parentRule instanceof CSSMediaRule) ||
      (yu("CSSSupportsRule") && r.parentRule instanceof CSSSupportsRule) ||
      (yu("CSSConditionRule") && r.parentRule instanceof CSSConditionRule)
    ) {
      let s = Array.from(r.parentRule.cssRules).indexOf(r);
      o.unshift(s);
    } else if (r.parentStyleSheet) {
      let s = Array.from(r.parentStyleSheet.cssRules).indexOf(r);
      o.unshift(s);
    }
    return o;
  }
  return n(e, t);
}
function Or(e, t, n) {
  let r, o;
  return e
    ? (e.ownerNode ? (r = t.getId(e.ownerNode)) : (o = n.getId(e)),
      { styleId: o, id: r })
    : {};
}
function nw(
  { styleSheetRuleCb: e, mirror: t, stylesheetManager: n },
  { win: r },
) {
  if (!r.CSSStyleSheet || !r.CSSStyleSheet.prototype) return () => {};
  let o = r.CSSStyleSheet.prototype.insertRule;
  r.CSSStyleSheet.prototype.insertRule = new Proxy(o, {
    apply: ue((f, l, d) => {
      let [p, m] = d,
        { id: h, styleId: g } = Or(l, t, n.styleMirror);
      return (
        ((h && h !== -1) || (g && g !== -1)) &&
          e({ id: h, styleId: g, adds: [{ rule: p, index: m }] }),
        f.apply(l, d)
      );
    }),
  });
  let i = r.CSSStyleSheet.prototype.deleteRule;
  r.CSSStyleSheet.prototype.deleteRule = new Proxy(i, {
    apply: ue((f, l, d) => {
      let [p] = d,
        { id: m, styleId: h } = Or(l, t, n.styleMirror);
      return (
        ((m && m !== -1) || (h && h !== -1)) &&
          e({ id: m, styleId: h, removes: [{ index: p }] }),
        f.apply(l, d)
      );
    }),
  });
  let s;
  r.CSSStyleSheet.prototype.replace &&
    ((s = r.CSSStyleSheet.prototype.replace),
    (r.CSSStyleSheet.prototype.replace = new Proxy(s, {
      apply: ue((f, l, d) => {
        let [p] = d,
          { id: m, styleId: h } = Or(l, t, n.styleMirror);
        return (
          ((m && m !== -1) || (h && h !== -1)) &&
            e({ id: m, styleId: h, replace: p }),
          f.apply(l, d)
        );
      }),
    })));
  let a;
  r.CSSStyleSheet.prototype.replaceSync &&
    ((a = r.CSSStyleSheet.prototype.replaceSync),
    (r.CSSStyleSheet.prototype.replaceSync = new Proxy(a, {
      apply: ue((f, l, d) => {
        let [p] = d,
          { id: m, styleId: h } = Or(l, t, n.styleMirror);
        return (
          ((m && m !== -1) || (h && h !== -1)) &&
            e({ id: m, styleId: h, replaceSync: p }),
          f.apply(l, d)
        );
      }),
    })));
  let c = {};
  Iu("CSSGroupingRule")
    ? (c.CSSGroupingRule = r.CSSGroupingRule)
    : (Iu("CSSMediaRule") && (c.CSSMediaRule = r.CSSMediaRule),
      Iu("CSSConditionRule") && (c.CSSConditionRule = r.CSSConditionRule),
      Iu("CSSSupportsRule") && (c.CSSSupportsRule = r.CSSSupportsRule));
  let u = {};
  return (
    Object.entries(c).forEach(([f, l]) => {
      (u[f] = {
        insertRule: l.prototype.insertRule,
        deleteRule: l.prototype.deleteRule,
      }),
        (l.prototype.insertRule = new Proxy(u[f].insertRule, {
          apply: ue((d, p, m) => {
            let [h, g] = m,
              { id: S, styleId: T } = Or(p.parentStyleSheet, t, n.styleMirror);
            return (
              ((S && S !== -1) || (T && T !== -1)) &&
                e({
                  id: S,
                  styleId: T,
                  adds: [{ rule: h, index: [...wu(p), g || 0] }],
                }),
              d.apply(p, m)
            );
          }),
        })),
        (l.prototype.deleteRule = new Proxy(u[f].deleteRule, {
          apply: ue((d, p, m) => {
            let [h] = m,
              { id: g, styleId: S } = Or(p.parentStyleSheet, t, n.styleMirror);
            return (
              ((g && g !== -1) || (S && S !== -1)) &&
                e({ id: g, styleId: S, removes: [{ index: [...wu(p), h] }] }),
              d.apply(p, m)
            );
          }),
        }));
    }),
    ue(() => {
      (r.CSSStyleSheet.prototype.insertRule = o),
        (r.CSSStyleSheet.prototype.deleteRule = i),
        s && (r.CSSStyleSheet.prototype.replace = s),
        a && (r.CSSStyleSheet.prototype.replaceSync = a),
        Object.entries(c).forEach(([f, l]) => {
          (l.prototype.insertRule = u[f].insertRule),
            (l.prototype.deleteRule = u[f].deleteRule);
        });
    })
  );
}
function IT({ mirror: e, stylesheetManager: t }, n) {
  let r = null;
  n.nodeName === "#document" ? (r = e.getId(n)) : (r = e.getId(n.host));
  let o =
      n.nodeName === "#document"
        ? n.defaultView?.Document
        : n.ownerDocument?.defaultView?.ShadowRoot,
    i = o?.prototype
      ? Object.getOwnPropertyDescriptor(o?.prototype, "adoptedStyleSheets")
      : void 0;
  return r === null || r === -1 || !o || !i
    ? () => {}
    : (Object.defineProperty(n, "adoptedStyleSheets", {
        configurable: i.configurable,
        enumerable: i.enumerable,
        get() {
          return i.get?.call(this);
        },
        set(s) {
          let a = i.set?.call(this, s);
          if (r !== null && r !== -1)
            try {
              t.adoptStyleSheets(s, r);
            } catch {}
          return a;
        },
      }),
      ue(() => {
        Object.defineProperty(n, "adoptedStyleSheets", {
          configurable: i.configurable,
          enumerable: i.enumerable,
          get: i.get,
          set: i.set,
        });
      }));
}
function rw(
  {
    styleDeclarationCb: e,
    mirror: t,
    ignoreCSSAttributes: n,
    stylesheetManager: r,
  },
  { win: o },
) {
  let i = o.CSSStyleDeclaration.prototype.setProperty;
  o.CSSStyleDeclaration.prototype.setProperty = new Proxy(i, {
    apply: ue((a, c, u) => {
      let [f, l, d] = u;
      if (n.has(f)) return i.apply(c, [f, l, d]);
      let { id: p, styleId: m } = Or(
        c.parentRule?.parentStyleSheet,
        t,
        r.styleMirror,
      );
      return (
        ((p && p !== -1) || (m && m !== -1)) &&
          e({
            id: p,
            styleId: m,
            set: { property: f, value: l, priority: d },
            index: wu(c.parentRule),
          }),
        a.apply(c, u)
      );
    }),
  });
  let s = o.CSSStyleDeclaration.prototype.removeProperty;
  return (
    (o.CSSStyleDeclaration.prototype.removeProperty = new Proxy(s, {
      apply: ue((a, c, u) => {
        let [f] = u;
        if (n.has(f)) return s.apply(c, [f]);
        let { id: l, styleId: d } = Or(
          c.parentRule?.parentStyleSheet,
          t,
          r.styleMirror,
        );
        return (
          ((l && l !== -1) || (d && d !== -1)) &&
            e({
              id: l,
              styleId: d,
              remove: { property: f },
              index: wu(c.parentRule),
            }),
          a.apply(c, u)
        );
      }),
    })),
    ue(() => {
      (o.CSSStyleDeclaration.prototype.setProperty = i),
        (o.CSSStyleDeclaration.prototype.removeProperty = s);
    })
  );
}
function ow({
  mediaInteractionCb: e,
  blockClass: t,
  blockSelector: n,
  unblockSelector: r,
  mirror: o,
  sampling: i,
  doc: s,
}) {
  let a = ue((u) =>
      oa(
        ue((f) => {
          let l = la(f);
          if (!l || Ht(l, t, n, r, !0)) return;
          let { currentTime: d, volume: p, muted: m, playbackRate: h } = l;
          e({
            type: u,
            id: o.getId(l),
            currentTime: d,
            volume: p,
            muted: m,
            playbackRate: h,
          });
        }),
        i.media || 500,
      ),
    ),
    c = [
      gt("play", a(ki.Play), s),
      gt("pause", a(ki.Pause), s),
      gt("seeked", a(ki.Seeked), s),
      gt("volumechange", a(ki.VolumeChange), s),
      gt("ratechange", a(ki.RateChange), s),
    ];
  return ue(() => {
    c.forEach((u) => u());
  });
}
function iw({ fontCb: e, doc: t }) {
  let n = t.defaultView;
  if (!n) return () => {};
  let r = [],
    o = new WeakMap(),
    i = n.FontFace;
  n.FontFace = function (c, u, f) {
    let l = new i(c, u, f);
    return (
      o.set(l, {
        family: c,
        buffer: typeof u != "string",
        descriptors: f,
        fontSource:
          typeof u == "string"
            ? u
            : JSON.stringify(Array.from(new Uint8Array(u))),
      }),
      l
    );
  };
  let s = yd(t.fonts, "add", function (a) {
    return function (c) {
      return (
        $u(
          ue(() => {
            let u = o.get(c);
            u && (e(u), o.delete(c));
          }),
          0,
        ),
        a.apply(this, [c])
      );
    };
  });
  return (
    r.push(() => {
      n.FontFace = i;
    }),
    r.push(s),
    ue(() => {
      r.forEach((a) => a());
    })
  );
}
function sw(e) {
  let {
      doc: t,
      mirror: n,
      blockClass: r,
      blockSelector: o,
      unblockSelector: i,
      selectionCb: s,
    } = e,
    a = !0,
    c = ue(() => {
      let u = t.getSelection();
      if (!u || (a && u?.isCollapsed)) return;
      a = u.isCollapsed || !1;
      let f = [],
        l = u.rangeCount || 0;
      for (let d = 0; d < l; d++) {
        let p = u.getRangeAt(d),
          {
            startContainer: m,
            startOffset: h,
            endContainer: g,
            endOffset: S,
          } = p;
        Ht(m, r, o, i, !0) ||
          Ht(g, r, o, i, !0) ||
          f.push({
            start: n.getId(m),
            startOffset: h,
            end: n.getId(g),
            endOffset: S,
          });
      }
      s({ ranges: f });
    });
  return c(), gt("selectionchange", c);
}
function aw({ doc: e, customElementCb: t }) {
  let n = e.defaultView;
  return !n || !n.customElements
    ? () => {}
    : yd(n.customElements, "define", function (o) {
        return function (i, s, a) {
          try {
            t({ define: { name: i } });
          } catch {}
          return o.apply(this, [i, s, a]);
        };
      });
}
function cw(e, t = {}) {
  let n = e.doc.defaultView;
  if (!n) return () => {};
  let r;
  e.recordDOM && (r = TT(e, e.doc));
  let o = Xk(e),
    i = Qk(e),
    s = yT(e),
    a = Zk(e, { win: n }),
    c = tw(e),
    u = ow(e),
    f = () => {},
    l = () => {},
    d = () => {},
    p = () => {};
  e.recordDOM &&
    ((f = nw(e, { win: n })),
    (l = IT(e, e.doc)),
    (d = rw(e, { win: n })),
    e.collectFonts && (p = iw(e)));
  let m = sw(e),
    h = aw(e),
    g = [];
  for (let S of e.plugins) g.push(S.observer(S.callback, n, S.options));
  return ue(() => {
    Li.forEach((S) => S.reset()),
      r?.disconnect(),
      o(),
      i(),
      s(),
      a(),
      c(),
      u(),
      f(),
      l(),
      d(),
      p(),
      m(),
      h(),
      g.forEach((S) => S());
  });
}
function yu(e) {
  return typeof window[e] < "u";
}
function Iu(e) {
  return !!(
    typeof window[e] < "u" &&
    window[e].prototype &&
    "insertRule" in window[e].prototype &&
    "deleteRule" in window[e].prototype
  );
}
var sa = class {
    constructor(t) {
      (this.generateIdFn = t),
        (this.iframeIdToRemoteIdMap = new WeakMap()),
        (this.iframeRemoteIdToIdMap = new WeakMap());
    }
    getId(t, n, r, o) {
      let i = r || this.getIdToRemoteIdMap(t),
        s = o || this.getRemoteIdToIdMap(t),
        a = i.get(n);
      return a || ((a = this.generateIdFn()), i.set(n, a), s.set(a, n)), a;
    }
    getIds(t, n) {
      let r = this.getIdToRemoteIdMap(t),
        o = this.getRemoteIdToIdMap(t);
      return n.map((i) => this.getId(t, i, r, o));
    }
    getRemoteId(t, n, r) {
      let o = r || this.getRemoteIdToIdMap(t);
      if (typeof n != "number") return n;
      let i = o.get(n);
      return i || -1;
    }
    getRemoteIds(t, n) {
      let r = this.getRemoteIdToIdMap(t);
      return n.map((o) => this.getRemoteId(t, o, r));
    }
    reset(t) {
      if (!t) {
        (this.iframeIdToRemoteIdMap = new WeakMap()),
          (this.iframeRemoteIdToIdMap = new WeakMap());
        return;
      }
      this.iframeIdToRemoteIdMap.delete(t),
        this.iframeRemoteIdToIdMap.delete(t);
    }
    getIdToRemoteIdMap(t) {
      let n = this.iframeIdToRemoteIdMap.get(t);
      return n || ((n = new Map()), this.iframeIdToRemoteIdMap.set(t, n)), n;
    }
    getRemoteIdToIdMap(t) {
      let n = this.iframeRemoteIdToIdMap.get(t);
      return n || ((n = new Map()), this.iframeRemoteIdToIdMap.set(t, n)), n;
    }
  },
  td = class {
    constructor() {
      (this.crossOriginIframeMirror = new sa(Td)),
        (this.crossOriginIframeRootIdMap = new WeakMap());
    }
    addIframe() {}
    addLoadListener() {}
    attachIframe() {}
  },
  nd = class {
    constructor(t) {
      (this.iframes = new WeakMap()),
        (this.crossOriginIframeMap = new WeakMap()),
        (this.crossOriginIframeMirror = new sa(Td)),
        (this.crossOriginIframeRootIdMap = new WeakMap()),
        (this.mutationCb = t.mutationCb),
        (this.wrappedEmit = t.wrappedEmit),
        (this.stylesheetManager = t.stylesheetManager),
        (this.recordCrossOriginIframes = t.recordCrossOriginIframes),
        (this.crossOriginIframeStyleMirror = new sa(
          this.stylesheetManager.styleMirror.generateId.bind(
            this.stylesheetManager.styleMirror,
          ),
        )),
        (this.mirror = t.mirror),
        this.recordCrossOriginIframes &&
          window.addEventListener("message", this.handleMessage.bind(this));
    }
    addIframe(t) {
      this.iframes.set(t, !0);
      let n = ia(t);
      n && this.crossOriginIframeMap.set(n, t);
    }
    addLoadListener(t) {
      this.loadListener = t;
    }
    attachIframe(t, n) {
      this.mutationCb({
        adds: [{ parentId: this.mirror.getId(t), nextId: null, node: n }],
        removes: [],
        texts: [],
        attributes: [],
        isAttachIframe: !0,
      }),
        this.recordCrossOriginIframes &&
          ia(t)?.addEventListener("message", this.handleMessage.bind(this)),
        this.loadListener?.(t);
      let r = bd(t);
      r &&
        r.adoptedStyleSheets &&
        r.adoptedStyleSheets.length > 0 &&
        this.stylesheetManager.adoptStyleSheets(
          r.adoptedStyleSheets,
          this.mirror.getId(r),
        );
    }
    handleMessage(t) {
      let n = t;
      if (n.data.type !== "rrweb" || n.origin !== n.data.origin || !t.source)
        return;
      let o = this.crossOriginIframeMap.get(t.source);
      if (!o) return;
      let i = this.transformCrossOriginEvent(o, n.data.event);
      i && this.wrappedEmit(i, n.data.isCheckout);
    }
    transformCrossOriginEvent(t, n) {
      switch (n.type) {
        case ee.FullSnapshot: {
          this.crossOriginIframeMirror.reset(t),
            this.crossOriginIframeStyleMirror.reset(t),
            this.replaceIdOnNode(n.data.node, t);
          let r = n.data.node.id;
          return (
            this.crossOriginIframeRootIdMap.set(t, r),
            this.patchRootIdOnNode(n.data.node, r),
            {
              timestamp: n.timestamp,
              type: ee.IncrementalSnapshot,
              data: {
                source: V.Mutation,
                adds: [
                  {
                    parentId: this.mirror.getId(t),
                    nextId: null,
                    node: n.data.node,
                  },
                ],
                removes: [],
                texts: [],
                attributes: [],
                isAttachIframe: !0,
              },
            }
          );
        }
        case ee.Meta:
        case ee.Load:
        case ee.DomContentLoaded:
          return !1;
        case ee.Plugin:
          return n;
        case ee.Custom:
          return (
            this.replaceIds(n.data.payload, t, [
              "id",
              "parentId",
              "previousId",
              "nextId",
            ]),
            n
          );
        case ee.IncrementalSnapshot:
          switch (n.data.source) {
            case V.Mutation:
              return (
                n.data.adds.forEach((r) => {
                  this.replaceIds(r, t, ["parentId", "nextId", "previousId"]),
                    this.replaceIdOnNode(r.node, t);
                  let o = this.crossOriginIframeRootIdMap.get(t);
                  o && this.patchRootIdOnNode(r.node, o);
                }),
                n.data.removes.forEach((r) => {
                  this.replaceIds(r, t, ["parentId", "id"]);
                }),
                n.data.attributes.forEach((r) => {
                  this.replaceIds(r, t, ["id"]);
                }),
                n.data.texts.forEach((r) => {
                  this.replaceIds(r, t, ["id"]);
                }),
                n
              );
            case V.Drag:
            case V.TouchMove:
            case V.MouseMove:
              return (
                n.data.positions.forEach((r) => {
                  this.replaceIds(r, t, ["id"]);
                }),
                n
              );
            case V.ViewportResize:
              return !1;
            case V.MediaInteraction:
            case V.MouseInteraction:
            case V.Scroll:
            case V.CanvasMutation:
            case V.Input:
              return this.replaceIds(n.data, t, ["id"]), n;
            case V.StyleSheetRule:
            case V.StyleDeclaration:
              return (
                this.replaceIds(n.data, t, ["id"]),
                this.replaceStyleIds(n.data, t, ["styleId"]),
                n
              );
            case V.Font:
              return n;
            case V.Selection:
              return (
                n.data.ranges.forEach((r) => {
                  this.replaceIds(r, t, ["start", "end"]);
                }),
                n
              );
            case V.AdoptedStyleSheet:
              return (
                this.replaceIds(n.data, t, ["id"]),
                this.replaceStyleIds(n.data, t, ["styleIds"]),
                n.data.styles?.forEach((r) => {
                  this.replaceStyleIds(r, t, ["styleId"]);
                }),
                n
              );
          }
      }
      return !1;
    }
    replace(t, n, r, o) {
      for (let i of o)
        (!Array.isArray(n[i]) && typeof n[i] != "number") ||
          (Array.isArray(n[i])
            ? (n[i] = t.getIds(r, n[i]))
            : (n[i] = t.getId(r, n[i])));
      return n;
    }
    replaceIds(t, n, r) {
      return this.replace(this.crossOriginIframeMirror, t, n, r);
    }
    replaceStyleIds(t, n, r) {
      return this.replace(this.crossOriginIframeStyleMirror, t, n, r);
    }
    replaceIdOnNode(t, n) {
      this.replaceIds(t, n, ["id", "rootId"]),
        "childNodes" in t &&
          t.childNodes.forEach((r) => {
            this.replaceIdOnNode(r, n);
          });
    }
    patchRootIdOnNode(t, n) {
      t.type !== $e.Document && !t.rootId && (t.rootId = n),
        "childNodes" in t &&
          t.childNodes.forEach((r) => {
            this.patchRootIdOnNode(r, n);
          });
    }
  },
  rd = class {
    init() {}
    addShadowRoot() {}
    observeAttachShadow() {}
    reset() {}
  },
  od = class {
    constructor(t) {
      (this.shadowDoms = new WeakSet()),
        (this.restoreHandlers = []),
        (this.mutationCb = t.mutationCb),
        (this.scrollCb = t.scrollCb),
        (this.bypassOptions = t.bypassOptions),
        (this.mirror = t.mirror),
        this.init();
    }
    init() {
      this.reset(), this.patchAttachShadow(Element, document);
    }
    addShadowRoot(t, n) {
      if (!ea(t) || this.shadowDoms.has(t)) return;
      this.shadowDoms.add(t), this.bypassOptions.canvasManager.addShadowRoot(t);
      let r = TT(
        {
          ...this.bypassOptions,
          doc: n,
          mutationCb: this.mutationCb,
          mirror: this.mirror,
          shadowDomManager: this,
        },
        t,
      );
      this.restoreHandlers.push(() => r.disconnect()),
        this.restoreHandlers.push(
          yT({
            ...this.bypassOptions,
            scrollCb: this.scrollCb,
            doc: t,
            mirror: this.mirror,
          }),
        ),
        $u(() => {
          t.adoptedStyleSheets &&
            t.adoptedStyleSheets.length > 0 &&
            this.bypassOptions.stylesheetManager.adoptStyleSheets(
              t.adoptedStyleSheets,
              this.mirror.getId(t.host),
            ),
            this.restoreHandlers.push(
              IT(
                {
                  mirror: this.mirror,
                  stylesheetManager: this.bypassOptions.stylesheetManager,
                },
                t,
              ),
            );
        }, 0);
    }
    observeAttachShadow(t) {
      let n = bd(t),
        r = ia(t);
      !n || !r || this.patchAttachShadow(r.Element, n);
    }
    patchAttachShadow(t, n) {
      let r = this;
      this.restoreHandlers.push(
        yd(t.prototype, "attachShadow", function (o) {
          return function (i) {
            let s = o.call(this, i);
            return (
              this.shadowRoot &&
                ST(this) &&
                r.addShadowRoot(this.shadowRoot, n),
              s
            );
          };
        }),
      );
    }
    reset() {
      this.restoreHandlers.forEach((t) => {
        try {
          t();
        } catch {}
      }),
        (this.restoreHandlers = []),
        (this.shadowDoms = new WeakSet()),
        this.bypassOptions.canvasManager.resetShadowRoots();
    }
  },
  id = class {
    constructor(t) {
      (this.trackedLinkElements = new WeakSet()),
        (this.styleMirror = new Jp()),
        (this.mutationCb = t.mutationCb),
        (this.adoptedStyleSheetCb = t.adoptedStyleSheetCb);
    }
    attachLinkElement(t, n) {
      "_cssText" in n.attributes &&
        this.mutationCb({
          adds: [],
          removes: [],
          texts: [],
          attributes: [{ id: n.id, attributes: n.attributes }],
        }),
        this.trackLinkElement(t);
    }
    trackLinkElement(t) {
      this.trackedLinkElements.has(t) ||
        (this.trackedLinkElements.add(t), this.trackStylesheetInLinkElement(t));
    }
    adoptStyleSheets(t, n) {
      if (t.length === 0) return;
      let r = { id: n, styleIds: [] },
        o = [];
      for (let i of t) {
        let s;
        this.styleMirror.has(i)
          ? (s = this.styleMirror.getId(i))
          : ((s = this.styleMirror.add(i)),
            o.push({
              styleId: s,
              rules: Array.from(i.rules || CSSRule, (a, c) => ({
                rule: nT(a),
                index: c,
              })),
            })),
          r.styleIds.push(s);
      }
      o.length > 0 && (r.styles = o), this.adoptedStyleSheetCb(r);
    }
    reset() {
      this.styleMirror.reset(), (this.trackedLinkElements = new WeakSet());
    }
    trackStylesheetInLinkElement(t) {}
  },
  sd = class {
    constructor() {
      (this.nodeMap = new WeakMap()), (this.active = !1);
    }
    inOtherBuffer(t, n) {
      let r = this.nodeMap.get(t);
      return r && Array.from(r).some((o) => o !== n);
    }
    add(t, n) {
      this.active ||
        ((this.active = !0),
        zk(() => {
          (this.nodeMap = new WeakMap()), (this.active = !1);
        })),
        this.nodeMap.set(t, (this.nodeMap.get(t) || new Set()).add(n));
    }
    destroy() {}
  },
  Ue,
  Ou;
try {
  if (Array.from([1], (e) => e * 2)[0] !== 2) {
    let e = document.createElement("iframe");
    document.body.appendChild(e),
      (Array.from = e.contentWindow?.Array.from || Array.from),
      document.body.removeChild(e);
  }
} catch (e) {
  console.debug("Unable to override Array.from", e);
}
var En = _k();
function Tn(e = {}) {
  let {
    emit: t,
    checkoutEveryNms: n,
    checkoutEveryNth: r,
    blockClass: o = "rr-block",
    blockSelector: i = null,
    unblockSelector: s = null,
    ignoreClass: a = "rr-ignore",
    ignoreSelector: c = null,
    maskAllText: u = !1,
    maskTextClass: f = "rr-mask",
    unmaskTextClass: l = null,
    maskTextSelector: d = null,
    unmaskTextSelector: p = null,
    inlineStylesheet: m = !0,
    maskAllInputs: h,
    maskInputOptions: g,
    slimDOMOptions: S,
    maskAttributeFn: T,
    maskInputFn: x,
    maskTextFn: A,
    maxCanvasSize: M = null,
    packFn: P,
    sampling: E = {},
    dataURLOptions: k = {},
    mousemoveWait: z,
    recordDOM: R = !0,
    recordCanvas: U = !1,
    recordCrossOriginIframes: w = !1,
    recordAfter: D = e.recordAfter === "DOMContentLoaded"
      ? e.recordAfter
      : "load",
    userTriggeredOnInput: G = !1,
    collectFonts: oe = !1,
    inlineImages: ae = !1,
    plugins: W,
    keepIframeSrcFn: O = () => !1,
    ignoreCSSAttributes: j = new Set([]),
    errorHandler: B,
    onMutation: se,
    getCanvasManager: ce,
  } = e;
  Yk(B);
  let ge = w ? window.parent === window : !0,
    Ce = !1;
  if (!ge)
    try {
      window.parent.document && (Ce = !1);
    } catch {
      Ce = !0;
    }
  if (ge && !t) throw new Error("emit function is required");
  if (!ge && !Ce) return () => {};
  z !== void 0 && E.mousemove === void 0 && (E.mousemove = z), En.reset();
  let Gt =
      h === !0
        ? {
            color: !0,
            date: !0,
            "datetime-local": !0,
            email: !0,
            month: !0,
            number: !0,
            range: !0,
            search: !0,
            tel: !0,
            text: !0,
            time: !0,
            url: !0,
            week: !0,
            textarea: !0,
            select: !0,
            radio: !0,
            checkbox: !0,
          }
        : g !== void 0
          ? g
          : {},
    nn =
      S === !0 || S === "all"
        ? {
            script: !0,
            comment: !0,
            headFavicon: !0,
            headWhitespace: !0,
            headMetaSocial: !0,
            headMetaRobots: !0,
            headMetaHttpEquiv: !0,
            headMetaVerification: !0,
            headMetaAuthorship: S === "all",
            headMetaDescKeywords: S === "all",
          }
        : S || {};
  $k();
  let sr,
    Pr = 0,
    _a = (H) => {
      for (let fe of W || []) fe.eventProcessor && (H = fe.eventProcessor(H));
      return P && !Ce && (H = P(H)), H;
    };
  Ue = (H, fe) => {
    let Q = H;
    if (
      ((Q.timestamp = xu()),
      Li[0]?.isFrozen() &&
        Q.type !== ee.FullSnapshot &&
        !(Q.type === ee.IncrementalSnapshot && Q.data.source === V.Mutation) &&
        Li.forEach((pe) => pe.unfreeze()),
      ge)
    )
      t?.(_a(Q), fe);
    else if (Ce) {
      let pe = {
        type: "rrweb",
        event: _a(Q),
        origin: window.location.origin,
        isCheckout: fe,
      };
      window.parent.postMessage(pe, "*");
    }
    if (Q.type === ee.FullSnapshot) (sr = Q), (Pr = 0);
    else if (Q.type === ee.IncrementalSnapshot) {
      if (Q.data.source === V.Mutation && Q.data.isAttachIframe) return;
      Pr++;
      let pe = r && Pr >= r,
        K = n && sr && Q.timestamp - sr.timestamp > n;
      (pe || K) && Br(!0);
    }
  };
  let Ur = (H) => {
      Ue({ type: ee.IncrementalSnapshot, data: { source: V.Mutation, ...H } });
    },
    ha = (H) =>
      Ue({ type: ee.IncrementalSnapshot, data: { source: V.Scroll, ...H } }),
    Fn = (H) =>
      Ue({
        type: ee.IncrementalSnapshot,
        data: { source: V.CanvasMutation, ...H },
      }),
    $t = (H) =>
      Ue({
        type: ee.IncrementalSnapshot,
        data: { source: V.AdoptedStyleSheet, ...H },
      }),
    St = new id({ mutationCb: Ur, adoptedStyleSheetCb: $t }),
    wt =
      typeof __RRWEB_EXCLUDE_IFRAME__ == "boolean" && __RRWEB_EXCLUDE_IFRAME__
        ? new td()
        : new nd({
            mirror: En,
            mutationCb: Ur,
            stylesheetManager: St,
            recordCrossOriginIframes: w,
            wrappedEmit: Ue,
          });
  for (let H of W || [])
    H.getMirror &&
      H.getMirror({
        nodeMirror: En,
        crossOriginIframeMirror: wt.crossOriginIframeMirror,
        crossOriginIframeStyleMirror: wt.crossOriginIframeStyleMirror,
      });
  let xo = new sd(),
    ko = lw(ce, {
      mirror: En,
      win: window,
      mutationCb: (H) =>
        Ue({
          type: ee.IncrementalSnapshot,
          data: { source: V.CanvasMutation, ...H },
        }),
      recordCanvas: U,
      blockClass: o,
      blockSelector: i,
      unblockSelector: s,
      maxCanvasSize: M,
      sampling: E.canvas,
      dataURLOptions: k,
      errorHandler: B,
    }),
    Dr =
      typeof __RRWEB_EXCLUDE_SHADOW_DOM__ == "boolean" &&
      __RRWEB_EXCLUDE_SHADOW_DOM__
        ? new rd()
        : new od({
            mutationCb: Ur,
            scrollCb: ha,
            bypassOptions: {
              onMutation: se,
              blockClass: o,
              blockSelector: i,
              unblockSelector: s,
              maskAllText: u,
              maskTextClass: f,
              unmaskTextClass: l,
              maskTextSelector: d,
              unmaskTextSelector: p,
              inlineStylesheet: m,
              maskInputOptions: Gt,
              dataURLOptions: k,
              maskAttributeFn: T,
              maskTextFn: A,
              maskInputFn: x,
              recordCanvas: U,
              inlineImages: ae,
              sampling: E,
              slimDOMOptions: nn,
              iframeManager: wt,
              stylesheetManager: St,
              canvasManager: ko,
              keepIframeSrcFn: O,
              processedNodeManager: xo,
              ignoreCSSAttributes: j,
            },
            mirror: En,
          }),
    Br = (H = !1) => {
      if (!R) return;
      Ue(
        {
          type: ee.Meta,
          data: { href: window.location.href, width: pT(), height: fT() },
        },
        H,
      ),
        St.reset(),
        Dr.init(),
        Li.forEach((Q) => Q.lock());
      let fe = Hk(document, {
        mirror: En,
        blockClass: o,
        blockSelector: i,
        unblockSelector: s,
        maskAllText: u,
        maskTextClass: f,
        unmaskTextClass: l,
        maskTextSelector: d,
        unmaskTextSelector: p,
        inlineStylesheet: m,
        maskAllInputs: Gt,
        maskAttributeFn: T,
        maskInputFn: x,
        maskTextFn: A,
        slimDOM: nn,
        dataURLOptions: k,
        recordCanvas: U,
        inlineImages: ae,
        onSerialize: (Q) => {
          _T(Q, En) && wt.addIframe(Q),
            hT(Q, En) && St.trackLinkElement(Q),
            Kp(Q) && Dr.addShadowRoot(Q.shadowRoot, document);
        },
        onIframeLoad: (Q, pe) => {
          wt.attachIframe(Q, pe);
          let K = ia(Q);
          K && ko.addWindow(K), Dr.observeAttachShadow(Q);
        },
        onStylesheetLoad: (Q, pe) => {
          St.attachLinkElement(Q, pe);
        },
        onBlockedImageLoad: (Q, pe, { width: K, height: yn }) => {
          Ur({
            adds: [],
            removes: [],
            texts: [],
            attributes: [
              {
                id: pe.id,
                attributes: { style: { width: `${K}px`, height: `${yn}px` } },
              },
            ],
          });
        },
        keepIframeSrcFn: O,
        ignoreCSSAttributes: j,
      });
      if (!fe) return console.warn("Failed to snapshot the document");
      Ue({
        type: ee.FullSnapshot,
        data: { node: fe, initialOffset: lT(window) },
      }),
        Li.forEach((Q) => Q.unlock()),
        document.adoptedStyleSheets &&
          document.adoptedStyleSheets.length > 0 &&
          St.adoptStyleSheets(document.adoptedStyleSheets, En.getId(document));
    };
  Ou = Br;
  try {
    let H = [],
      fe = (pe) =>
        ue(cw)(
          {
            onMutation: se,
            mutationCb: Ur,
            mousemoveCb: (K, yn) =>
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: yn, positions: K },
              }),
            mouseInteractionCb: (K) =>
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: V.MouseInteraction, ...K },
              }),
            scrollCb: ha,
            viewportResizeCb: (K) =>
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: V.ViewportResize, ...K },
              }),
            inputCb: (K) =>
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: V.Input, ...K },
              }),
            mediaInteractionCb: (K) =>
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: V.MediaInteraction, ...K },
              }),
            styleSheetRuleCb: (K) =>
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: V.StyleSheetRule, ...K },
              }),
            styleDeclarationCb: (K) =>
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: V.StyleDeclaration, ...K },
              }),
            canvasMutationCb: Fn,
            fontCb: (K) =>
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: V.Font, ...K },
              }),
            selectionCb: (K) => {
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: V.Selection, ...K },
              });
            },
            customElementCb: (K) => {
              Ue({
                type: ee.IncrementalSnapshot,
                data: { source: V.CustomElement, ...K },
              });
            },
            blockClass: o,
            ignoreClass: a,
            ignoreSelector: c,
            maskAllText: u,
            maskTextClass: f,
            unmaskTextClass: l,
            maskTextSelector: d,
            unmaskTextSelector: p,
            maskInputOptions: Gt,
            inlineStylesheet: m,
            sampling: E,
            recordDOM: R,
            recordCanvas: U,
            inlineImages: ae,
            userTriggeredOnInput: G,
            collectFonts: oe,
            doc: pe,
            maskAttributeFn: T,
            maskInputFn: x,
            maskTextFn: A,
            keepIframeSrcFn: O,
            blockSelector: i,
            unblockSelector: s,
            slimDOMOptions: nn,
            dataURLOptions: k,
            mirror: En,
            iframeManager: wt,
            stylesheetManager: St,
            shadowDomManager: Dr,
            processedNodeManager: xo,
            canvasManager: ko,
            ignoreCSSAttributes: j,
            plugins:
              W?.filter((K) => K.observer)?.map((K) => ({
                observer: K.observer,
                options: K.options,
                callback: (yn) =>
                  Ue({
                    type: ee.Plugin,
                    data: { plugin: K.name, payload: yn },
                  }),
              })) || [],
          },
          {},
        );
    wt.addLoadListener((pe) => {
      try {
        H.push(fe(pe.contentDocument));
      } catch (K) {
        console.warn(K);
      }
    });
    let Q = () => {
      Br(), H.push(fe(document));
    };
    return (
      document.readyState === "interactive" ||
      document.readyState === "complete"
        ? Q()
        : (H.push(
            gt("DOMContentLoaded", () => {
              Ue({ type: ee.DomContentLoaded, data: {} }),
                D === "DOMContentLoaded" && Q();
            }),
          ),
          H.push(
            gt(
              "load",
              () => {
                Ue({ type: ee.Load, data: {} }), D === "load" && Q();
              },
              window,
            ),
          )),
      () => {
        H.forEach((pe) => pe()), xo.destroy(), (Ou = void 0), Vk();
      }
    );
  } catch (H) {
    console.warn(H);
  }
}
function uw(e) {
  if (!Ou) throw new Error("please take full snapshot after start recording");
  Ou(e);
}
Tn.mirror = En;
Tn.takeFullSnapshot = uw;
function lw(e, t) {
  try {
    return e ? e(t) : new ku();
  } catch {
    return console.warn("Unable to initialize CanvasManager"), new ku();
  }
}
var zE;
(function (e) {
  (e[(e.NotStarted = 0)] = "NotStarted"),
    (e[(e.Running = 1)] = "Running"),
    (e[(e.Stopped = 2)] = "Stopped");
})(zE || (zE = {}));
var fw = 3,
  pw = 5;
function Ad(e) {
  return e > 9999999999 ? e : e * 1e3;
}
function $p(e) {
  return e > 9999999999 ? e / 1e3 : e;
}
function fa(e, t) {
  t.category !== "sentry.transaction" &&
    (["ui.click", "ui.input"].includes(t.category)
      ? e.triggerUserActivity()
      : e.checkAndHandleExpiredSession(),
    e.addUpdate(
      () => (
        e.throttledAddEvent({
          type: ee.Custom,
          timestamp: (t.timestamp || 0) * 1e3,
          data: { tag: "breadcrumb", payload: he(t, 10, 1e3) },
        }),
        t.category === "console"
      ),
    ));
}
var dw = "button,a";
function bT(e) {
  return e.closest(dw) || e;
}
function AT(e) {
  let t = RT(e);
  return !t || !(t instanceof Element) ? t : bT(t);
}
function RT(e) {
  return mw(e) ? e.target : e;
}
function mw(e) {
  return typeof e == "object" && !!e && "target" in e;
}
var Mr;
function _w(e) {
  return (
    Mr || ((Mr = []), hw()),
    Mr.push(e),
    () => {
      let t = Mr ? Mr.indexOf(e) : -1;
      t > -1 && Mr.splice(t, 1);
    }
  );
}
function hw() {
  Ee(Re, "open", function (e) {
    return function (...t) {
      if (Mr)
        try {
          Mr.forEach((n) => n());
        } catch {}
      return e.apply(Re, t);
    };
  });
}
var gw = new Set([
  V.Mutation,
  V.StyleSheetRule,
  V.StyleDeclaration,
  V.AdoptedStyleSheet,
  V.CanvasMutation,
  V.Selection,
  V.MediaInteraction,
]);
function Sw(e, t, n) {
  e.handleClick(t, n);
}
var ad = class {
    constructor(t, n, r = fa) {
      (this._lastMutation = 0),
        (this._lastScroll = 0),
        (this._clicks = []),
        (this._timeout = n.timeout / 1e3),
        (this._threshold = n.threshold / 1e3),
        (this._scrollTimeout = n.scrollTimeout / 1e3),
        (this._replay = t),
        (this._ignoreSelector = n.ignoreSelector),
        (this._addBreadcrumbEvent = r);
    }
    addListeners() {
      let t = _w(() => {
        this._lastMutation = qE();
      });
      this._teardown = () => {
        t(),
          (this._clicks = []),
          (this._lastMutation = 0),
          (this._lastScroll = 0);
      };
    }
    removeListeners() {
      this._teardown && this._teardown(),
        this._checkClickTimeout && clearTimeout(this._checkClickTimeout);
    }
    handleClick(t, n) {
      if (Tw(n, this._ignoreSelector) || !yw(t)) return;
      let r = {
        timestamp: $p(t.timestamp),
        clickBreadcrumb: t,
        clickCount: 0,
        node: n,
      };
      this._clicks.some(
        (o) => o.node === r.node && Math.abs(o.timestamp - r.timestamp) < 1,
      ) ||
        (this._clicks.push(r),
        this._clicks.length === 1 && this._scheduleCheckClicks());
    }
    registerMutation(t = Date.now()) {
      this._lastMutation = $p(t);
    }
    registerScroll(t = Date.now()) {
      this._lastScroll = $p(t);
    }
    registerClick(t) {
      let n = bT(t);
      this._handleMultiClick(n);
    }
    _handleMultiClick(t) {
      this._getClicks(t).forEach((n) => {
        n.clickCount++;
      });
    }
    _getClicks(t) {
      return this._clicks.filter((n) => n.node === t);
    }
    _checkClicks() {
      let t = [],
        n = qE();
      this._clicks.forEach((r) => {
        !r.mutationAfter &&
          this._lastMutation &&
          (r.mutationAfter =
            r.timestamp <= this._lastMutation
              ? this._lastMutation - r.timestamp
              : void 0),
          !r.scrollAfter &&
            this._lastScroll &&
            (r.scrollAfter =
              r.timestamp <= this._lastScroll
                ? this._lastScroll - r.timestamp
                : void 0),
          r.timestamp + this._timeout <= n && t.push(r);
      });
      for (let r of t) {
        let o = this._clicks.indexOf(r);
        o > -1 && (this._generateBreadcrumbs(r), this._clicks.splice(o, 1));
      }
      this._clicks.length && this._scheduleCheckClicks();
    }
    _generateBreadcrumbs(t) {
      let n = this._replay,
        r = t.scrollAfter && t.scrollAfter <= this._scrollTimeout,
        o = t.mutationAfter && t.mutationAfter <= this._threshold,
        i = !r && !o,
        { clickCount: s, clickBreadcrumb: a } = t;
      if (i) {
        let c = Math.min(t.mutationAfter || this._timeout, this._timeout) * 1e3,
          u = c < this._timeout * 1e3 ? "mutation" : "timeout",
          f = {
            type: "default",
            message: a.message,
            timestamp: a.timestamp,
            category: "ui.slowClickDetected",
            data: {
              ...a.data,
              url: Re.location.href,
              route: n.getCurrentRoute(),
              timeAfterClickMs: c,
              endReason: u,
              clickCount: s || 1,
            },
          };
        this._addBreadcrumbEvent(n, f);
        return;
      }
      if (s > 1) {
        let c = {
          type: "default",
          message: a.message,
          timestamp: a.timestamp,
          category: "ui.multiClick",
          data: {
            ...a.data,
            url: Re.location.href,
            route: n.getCurrentRoute(),
            clickCount: s,
            metric: !0,
          },
        };
        this._addBreadcrumbEvent(n, c);
      }
    }
    _scheduleCheckClicks() {
      this._checkClickTimeout && clearTimeout(this._checkClickTimeout),
        (this._checkClickTimeout = yo(() => this._checkClicks(), 1e3));
    }
  },
  Ew = ["A", "BUTTON", "INPUT"];
function Tw(e, t) {
  return !!(
    !Ew.includes(e.tagName) ||
    (e.tagName === "INPUT" &&
      !["submit", "button"].includes(e.getAttribute("type") || "")) ||
    (e.tagName === "A" &&
      (e.hasAttribute("download") ||
        (e.hasAttribute("target") && e.getAttribute("target") !== "_self"))) ||
    (t && e.matches(t))
  );
}
function yw(e) {
  return !!(e.data && typeof e.data.nodeId == "number" && e.timestamp);
}
function qE() {
  return Date.now() / 1e3;
}
function Iw(e, t) {
  try {
    if (!bw(t)) return;
    let { source: n } = t.data;
    if (
      (gw.has(n) && e.registerMutation(t.timestamp),
      n === V.Scroll && e.registerScroll(t.timestamp),
      Aw(t))
    ) {
      let { type: r, id: o } = t.data,
        i = Tn.mirror.getNode(o);
      i instanceof HTMLElement && r === ht.Click && e.registerClick(i);
    }
  } catch {}
}
function bw(e) {
  return e.type === fw;
}
function Aw(e) {
  return e.data.source === V.MouseInteraction;
}
function Bn(e) {
  return { timestamp: Date.now() / 1e3, type: "default", ...e };
}
var Wu = ((e) => (
    (e[(e.Document = 0)] = "Document"),
    (e[(e.DocumentType = 1)] = "DocumentType"),
    (e[(e.Element = 2)] = "Element"),
    (e[(e.Text = 3)] = "Text"),
    (e[(e.CDATA = 4)] = "CDATA"),
    (e[(e.Comment = 5)] = "Comment"),
    e
  ))(Wu || {}),
  Rw = new Set([
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
function vw(e) {
  let t = {};
  !e["data-sentry-component"] &&
    e["data-sentry-element"] &&
    (e["data-sentry-component"] = e["data-sentry-element"]);
  for (let n in e)
    if (Rw.has(n)) {
      let r = n;
      (n === "data-testid" || n === "data-test-id") && (r = "testId"),
        (t[r] = e[n]);
    }
  return t;
}
var Nw = (e) => (t) => {
  if (!e.isEnabled()) return;
  let n = Cw(t);
  if (!n) return;
  let r = t.name === "click",
    o = r ? t.event : void 0;
  r &&
    e.clickDetector &&
    o?.target &&
    !o.altKey &&
    !o.metaKey &&
    !o.ctrlKey &&
    !o.shiftKey &&
    Sw(e.clickDetector, n, AT(t.event)),
    fa(e, n);
};
function vT(e, t) {
  let n = Tn.mirror.getId(e),
    r = n && Tn.mirror.getNode(n),
    o = r && Tn.mirror.getMeta(r),
    i = o && kw(o) ? o : null;
  return {
    message: t,
    data: i
      ? {
          nodeId: n,
          node: {
            id: n,
            tagName: i.tagName,
            textContent: Array.from(i.childNodes)
              .map((s) => s.type === Wu.Text && s.textContent)
              .filter(Boolean)
              .map((s) => s.trim())
              .join(""),
            attributes: vw(i.attributes),
          },
        }
      : {},
  };
}
function Cw(e) {
  let { target: t, message: n } = xw(e);
  return Bn({ category: `ui.${e.name}`, ...vT(t, n) });
}
function xw(e) {
  let t = e.name === "click",
    n,
    r = null;
  try {
    (r = t ? AT(e.event) : RT(e.event)),
      (n = Se(r, { maxStringLength: 200 }) || "<unknown>");
  } catch {
    n = "<unknown>";
  }
  return { target: r, message: n };
}
function kw(e) {
  return e.type === Wu.Element;
}
function ww(e, t) {
  if (!e.isEnabled()) return;
  e.updateUserActivity();
  let n = Ow(t);
  n && fa(e, n);
}
function Ow(e) {
  let { metaKey: t, shiftKey: n, ctrlKey: r, altKey: o, key: i, target: s } = e;
  if (!s || Mw(s) || !i) return null;
  let a = t || r || o,
    c = i.length === 1;
  if (!a && c) return null;
  let u = Se(s, { maxStringLength: 200 }) || "<unknown>",
    f = vT(s, u);
  return Bn({
    category: "ui.keyDown",
    message: u,
    data: { ...f.data, metaKey: t, shiftKey: n, ctrlKey: r, altKey: o, key: i },
  });
}
function Mw(e) {
  return (
    e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.isContentEditable
  );
}
var Lw = { resource: Fw, paint: Dw, navigation: Bw };
function Wp(e, t) {
  return ({ metric: n }) => {
    t.replayPerformanceEntries.push(e(n));
  };
}
function Pw(e) {
  return e.map(Uw).filter(Boolean);
}
function Uw(e) {
  let t = Lw[e.entryType];
  return t ? t(e) : null;
}
function Di(e) {
  return ((le() || Re.performance.timeOrigin) + e) / 1e3;
}
function Dw(e) {
  let { duration: t, entryType: n, name: r, startTime: o } = e,
    i = Di(o);
  return { type: n, name: r, start: i, end: i + t, data: void 0 };
}
function Bw(e) {
  let {
    entryType: t,
    name: n,
    decodedBodySize: r,
    duration: o,
    domComplete: i,
    encodedBodySize: s,
    domContentLoadedEventStart: a,
    domContentLoadedEventEnd: c,
    domInteractive: u,
    loadEventStart: f,
    loadEventEnd: l,
    redirectCount: d,
    startTime: p,
    transferSize: m,
    type: h,
  } = e;
  return o === 0
    ? null
    : {
        type: `${t}.${h}`,
        start: Di(p),
        end: Di(i),
        name: n,
        data: {
          size: m,
          decodedBodySize: r,
          encodedBodySize: s,
          duration: o,
          domInteractive: u,
          domContentLoadedEventStart: a,
          domContentLoadedEventEnd: c,
          loadEventStart: f,
          loadEventEnd: l,
          domComplete: i,
          redirectCount: d,
        },
      };
}
function Fw(e) {
  let {
    entryType: t,
    initiatorType: n,
    name: r,
    responseEnd: o,
    startTime: i,
    decodedBodySize: s,
    encodedBodySize: a,
    responseStatus: c,
    transferSize: u,
  } = e;
  return ["fetch", "xmlhttprequest"].includes(n)
    ? null
    : {
        type: `${t}.${n}`,
        start: Di(i),
        end: Di(o),
        name: r,
        data: {
          size: u,
          statusCode: c,
          decodedBodySize: s,
          encodedBodySize: a,
        },
      };
}
function Hw(e) {
  let t = e.entries[e.entries.length - 1],
    n = t?.element ? [t.element] : void 0;
  return Rd(e, "largest-contentful-paint", n);
}
function Gw(e) {
  return e.sources !== void 0;
}
function $w(e) {
  let t = [],
    n = [];
  for (let r of e.entries)
    if (Gw(r)) {
      let o = [];
      for (let i of r.sources)
        if (i.node) {
          n.push(i.node);
          let s = Tn.mirror.getId(i.node);
          s && o.push(s);
        }
      t.push({ value: r.value, nodeIds: o.length ? o : void 0 });
    }
  return Rd(e, "cumulative-layout-shift", n, t);
}
function Ww(e) {
  let t = e.entries[e.entries.length - 1],
    n = t?.target ? [t.target] : void 0;
  return Rd(e, "interaction-to-next-paint", n);
}
function Rd(e, t, n, r) {
  let o = e.value,
    i = e.rating,
    s = Di(o);
  return {
    type: "web-vital",
    name: t,
    start: s,
    end: s,
    data: {
      value: o,
      size: o,
      rating: i,
      nodeIds: n ? n.map((a) => Tn.mirror.getId(a)) : void 0,
      attributions: r,
    },
  };
}
function jw(e) {
  function t(o) {
    e.performanceEntries.includes(o) || e.performanceEntries.push(o);
  }
  function n({ entries: o }) {
    o.forEach(t);
  }
  let r = [];
  return (
    ["navigation", "paint", "resource"].forEach((o) => {
      r.push(Ct(o, n));
    }),
    r.push(nr(Wp(Hw, e)), tr(Wp($w, e)), ho(Wp(Ww, e))),
    () => {
      r.forEach((o) => o());
    }
  );
}
var q = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
  zw =
    'var t=Uint8Array,n=Uint16Array,r=Int32Array,e=new t([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),i=new t([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),s=new t([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(t,e){for(var i=new n(31),s=0;s<31;++s)i[s]=e+=1<<t[s-1];var a=new r(i[30]);for(s=1;s<30;++s)for(var o=i[s];o<i[s+1];++o)a[o]=o-i[s]<<5|s;return{b:i,r:a}},o=a(e,2),h=o.b,f=o.r;h[28]=258,f[258]=28;for(var l=a(i,0).r,u=new n(32768),c=0;c<32768;++c){var v=(43690&c)>>1|(21845&c)<<1;v=(61680&(v=(52428&v)>>2|(13107&v)<<2))>>4|(3855&v)<<4,u[c]=((65280&v)>>8|(255&v)<<8)>>1}var d=function(t,r,e){for(var i=t.length,s=0,a=new n(r);s<i;++s)t[s]&&++a[t[s]-1];var o,h=new n(r);for(s=1;s<r;++s)h[s]=h[s-1]+a[s-1]<<1;if(e){o=new n(1<<r);var f=15-r;for(s=0;s<i;++s)if(t[s])for(var l=s<<4|t[s],c=r-t[s],v=h[t[s]-1]++<<c,d=v|(1<<c)-1;v<=d;++v)o[u[v]>>f]=l}else for(o=new n(i),s=0;s<i;++s)t[s]&&(o[s]=u[h[t[s]-1]++]>>15-t[s]);return o},p=new t(288);for(c=0;c<144;++c)p[c]=8;for(c=144;c<256;++c)p[c]=9;for(c=256;c<280;++c)p[c]=7;for(c=280;c<288;++c)p[c]=8;var g=new t(32);for(c=0;c<32;++c)g[c]=5;var w=d(p,9,0),y=d(g,5,0),m=function(t){return(t+7)/8|0},b=function(n,r,e){return(null==e||e>n.length)&&(e=n.length),new t(n.subarray(r,e))},M=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],E=function(t,n,r){var e=new Error(n||M[t]);if(e.code=t,Error.captureStackTrace&&Error.captureStackTrace(e,E),!r)throw e;return e},z=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8},_=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8,t[e+2]|=r>>16},x=function(r,e){for(var i=[],s=0;s<r.length;++s)r[s]&&i.push({s:s,f:r[s]});var a=i.length,o=i.slice();if(!a)return{t:F,l:0};if(1==a){var h=new t(i[0].s+1);return h[i[0].s]=1,{t:h,l:1}}i.sort(function(t,n){return t.f-n.f}),i.push({s:-1,f:25001});var f=i[0],l=i[1],u=0,c=1,v=2;for(i[0]={s:-1,f:f.f+l.f,l:f,r:l};c!=a-1;)f=i[i[u].f<i[v].f?u++:v++],l=i[u!=c&&i[u].f<i[v].f?u++:v++],i[c++]={s:-1,f:f.f+l.f,l:f,r:l};var d=o[0].s;for(s=1;s<a;++s)o[s].s>d&&(d=o[s].s);var p=new n(d+1),g=A(i[c-1],p,0);if(g>e){s=0;var w=0,y=g-e,m=1<<y;for(o.sort(function(t,n){return p[n.s]-p[t.s]||t.f-n.f});s<a;++s){var b=o[s].s;if(!(p[b]>e))break;w+=m-(1<<g-p[b]),p[b]=e}for(w>>=y;w>0;){var M=o[s].s;p[M]<e?w-=1<<e-p[M]++-1:++s}for(;s>=0&&w;--s){var E=o[s].s;p[E]==e&&(--p[E],++w)}g=e}return{t:new t(p),l:g}},A=function(t,n,r){return-1==t.s?Math.max(A(t.l,n,r+1),A(t.r,n,r+1)):n[t.s]=r},D=function(t){for(var r=t.length;r&&!t[--r];);for(var e=new n(++r),i=0,s=t[0],a=1,o=function(t){e[i++]=t},h=1;h<=r;++h)if(t[h]==s&&h!=r)++a;else{if(!s&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(s),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(s);a=1,s=t[h]}return{c:e.subarray(0,i),n:r}},T=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},k=function(t,n,r){var e=r.length,i=m(n+2);t[i]=255&e,t[i+1]=e>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var s=0;s<e;++s)t[i+s+4]=r[s];return 8*(i+4+e)},U=function(t,r,a,o,h,f,l,u,c,v,m){z(r,m++,a),++h[256];for(var b=x(h,15),M=b.t,E=b.l,A=x(f,15),U=A.t,C=A.l,F=D(M),I=F.c,S=F.n,L=D(U),O=L.c,j=L.n,q=new n(19),B=0;B<I.length;++B)++q[31&I[B]];for(B=0;B<O.length;++B)++q[31&O[B]];for(var G=x(q,7),H=G.t,J=G.l,K=19;K>4&&!H[s[K-1]];--K);var N,P,Q,R,V=v+5<<3,W=T(h,p)+T(f,g)+l,X=T(h,M)+T(f,U)+l+14+3*K+T(q,H)+2*q[16]+3*q[17]+7*q[18];if(c>=0&&V<=W&&V<=X)return k(r,m,t.subarray(c,c+v));if(z(r,m,1+(X<W)),m+=2,X<W){N=d(M,E,0),P=M,Q=d(U,C,0),R=U;var Y=d(H,J,0);z(r,m,S-257),z(r,m+5,j-1),z(r,m+10,K-4),m+=14;for(B=0;B<K;++B)z(r,m+3*B,H[s[B]]);m+=3*K;for(var Z=[I,O],$=0;$<2;++$){var tt=Z[$];for(B=0;B<tt.length;++B){var nt=31&tt[B];z(r,m,Y[nt]),m+=H[nt],nt>15&&(z(r,m,tt[B]>>5&127),m+=tt[B]>>12)}}}else N=w,P=p,Q=y,R=g;for(B=0;B<u;++B){var rt=o[B];if(rt>255){_(r,m,N[(nt=rt>>18&31)+257]),m+=P[nt+257],nt>7&&(z(r,m,rt>>23&31),m+=e[nt]);var et=31&rt;_(r,m,Q[et]),m+=R[et],et>3&&(_(r,m,rt>>5&8191),m+=i[et])}else _(r,m,N[rt]),m+=P[rt]}return _(r,m,N[256]),m+P[256]},C=new r([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),F=new t(0),I=function(){for(var t=new Int32Array(256),n=0;n<256;++n){for(var r=n,e=9;--e;)r=(1&r&&-306674912)^r>>>1;t[n]=r}return t}(),S=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,s=0|r.length,a=0;a!=s;){for(var o=Math.min(a+2655,s);a<o;++a)i+=e+=r[a];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|(65280&t)<<8|(255&(n%=65521))<<8|n>>8}}},L=function(s,a,o,h,u){if(!u&&(u={l:1},a.dictionary)){var c=a.dictionary.subarray(-32768),v=new t(c.length+s.length);v.set(c),v.set(s,c.length),s=v,u.w=c.length}return function(s,a,o,h,u,c){var v=c.z||s.length,d=new t(h+v+5*(1+Math.ceil(v/7e3))+u),p=d.subarray(h,d.length-u),g=c.l,w=7&(c.r||0);if(a){w&&(p[0]=c.r>>3);for(var y=C[a-1],M=y>>13,E=8191&y,z=(1<<o)-1,_=c.p||new n(32768),x=c.h||new n(z+1),A=Math.ceil(o/3),D=2*A,T=function(t){return(s[t]^s[t+1]<<A^s[t+2]<<D)&z},F=new r(25e3),I=new n(288),S=new n(32),L=0,O=0,j=c.i||0,q=0,B=c.w||0,G=0;j+2<v;++j){var H=T(j),J=32767&j,K=x[H];if(_[J]=K,x[H]=J,B<=j){var N=v-j;if((L>7e3||q>24576)&&(N>423||!g)){w=U(s,p,0,F,I,S,O,q,G,j-G,w),q=L=O=0,G=j;for(var P=0;P<286;++P)I[P]=0;for(P=0;P<30;++P)S[P]=0}var Q=2,R=0,V=E,W=J-K&32767;if(N>2&&H==T(j-W))for(var X=Math.min(M,N)-1,Y=Math.min(32767,j),Z=Math.min(258,N);W<=Y&&--V&&J!=K;){if(s[j+Q]==s[j+Q-W]){for(var $=0;$<Z&&s[j+$]==s[j+$-W];++$);if($>Q){if(Q=$,R=W,$>X)break;var tt=Math.min(W,$-2),nt=0;for(P=0;P<tt;++P){var rt=j-W+P&32767,et=rt-_[rt]&32767;et>nt&&(nt=et,K=rt)}}}W+=(J=K)-(K=_[J])&32767}if(R){F[q++]=268435456|f[Q]<<18|l[R];var it=31&f[Q],st=31&l[R];O+=e[it]+i[st],++I[257+it],++S[st],B=j+Q,++L}else F[q++]=s[j],++I[s[j]]}}for(j=Math.max(j,B);j<v;++j)F[q++]=s[j],++I[s[j]];w=U(s,p,g,F,I,S,O,q,G,j-G,w),g||(c.r=7&w|p[w/8|0]<<3,w-=7,c.h=x,c.p=_,c.i=j,c.w=B)}else{for(j=c.w||0;j<v+g;j+=65535){var at=j+65535;at>=v&&(p[w/8|0]=g,at=v),w=k(p,w+1,s.subarray(j,at))}c.i=v}return b(d,0,h+m(w)+u)}(s,null==a.level?6:a.level,null==a.mem?u.l?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(s.length)))):20:12+a.mem,o,h,u)},O=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},j=function(){function n(n,r){if("function"==typeof n&&(r=n,n={}),this.ondata=r,this.o=n||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new t(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return n.prototype.p=function(t,n){this.ondata(L(t,this.o,0,0,this.s),n)},n.prototype.push=function(n,r){this.ondata||E(5),this.s.l&&E(4);var e=n.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new t(-32768&e);i.set(this.b.subarray(0,this.s.z)),this.b=i}var s=this.b.length-this.s.z;this.b.set(n.subarray(0,s),this.s.z),this.s.z=this.b.length,this.p(this.b,!1),this.b.set(this.b.subarray(-32768)),this.b.set(n.subarray(s),32768),this.s.z=n.length-s+32768,this.s.i=32766,this.s.w=32768}else this.b.set(n,this.s.z),this.s.z+=n.length;this.s.l=1&r,(this.s.z>this.s.w+8191||r)&&(this.p(this.b,r||!1),this.s.w=this.s.i,this.s.i-=2)},n.prototype.flush=function(){this.ondata||E(5),this.s.l&&E(4),this.p(this.b,!1),this.s.w=this.s.i,this.s.i-=2},n}();function q(t,n){n||(n={});var r=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=I[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}}(),e=t.length;r.p(t);var i,s=L(t,n,10+((i=n).filename?i.filename.length+1:0),8),a=s.length;return function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&O(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}}(s,n),O(s,a-8,r.d()),O(s,a-4,e),s}var B=function(){function t(t,n){this.c=S(),this.v=1,j.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),j.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=L(t,this.o,this.v&&(this.o.dictionary?6:2),n&&4,this.s);this.v&&(function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;if(t[0]=120,t[1]=e<<6|(n.dictionary&&32),t[1]|=31-(t[0]<<8|t[1])%31,n.dictionary){var i=S();i.p(n.dictionary),O(t,2,i.d())}}(r,this.o),this.v=0),n&&O(r,r.length-4,this.c.d()),this.ondata(r,n)},t.prototype.flush=function(){j.prototype.flush.call(this)},t}(),G="undefined"!=typeof TextEncoder&&new TextEncoder,H="undefined"!=typeof TextDecoder&&new TextDecoder;try{H.decode(F,{stream:!0})}catch(t){}var J=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){this.ondata||E(5),this.d&&E(4),this.ondata(K(t),this.d=n||!1)},t}();function K(n,r){if(G)return G.encode(n);for(var e=n.length,i=new t(n.length+(n.length>>1)),s=0,a=function(t){i[s++]=t},o=0;o<e;++o){if(s+5>i.length){var h=new t(s+8+(e-o<<1));h.set(i),i=h}var f=n.charCodeAt(o);f<128||r?a(f):f<2048?(a(192|f>>6),a(128|63&f)):f>55295&&f<57344?(a(240|(f=65536+(1047552&f)|1023&n.charCodeAt(++o))>>18),a(128|f>>12&63),a(128|f>>6&63),a(128|63&f)):(a(224|f>>12),a(128|f>>6&63),a(128|63&f))}return b(i,0,s)}const N=new class{constructor(){this._init()}clear(){this._init()}addEvent(t){if(!t)throw new Error("Adding invalid event");const n=this._hasEvents?",":"";this.stream.push(n+t),this._hasEvents=!0}finish(){this.stream.push("]",!0);const t=function(t){let n=0;for(const r of t)n+=r.length;const r=new Uint8Array(n);for(let n=0,e=0,i=t.length;n<i;n++){const i=t[n];r.set(i,e),e+=i.length}return r}(this._deflatedData);return this._init(),t}_init(){this._hasEvents=!1,this._deflatedData=[],this.deflate=new B,this.deflate.ondata=(t,n)=>{this._deflatedData.push(t)},this.stream=new J((t,n)=>{this.deflate.push(t,n)}),this.stream.push("[")}},P={clear:()=>{N.clear()},addEvent:t=>N.addEvent(t),finish:()=>N.finish(),compress:t=>function(t){return q(K(t))}(t)};addEventListener("message",function(t){const n=t.data.method,r=t.data.id,e=t.data.arg;if(n in P&&"function"==typeof P[n])try{const t=P[n](e);postMessage({id:r,method:n,success:!0,response:t})}catch(t){postMessage({id:r,method:n,success:!1,response:t.message}),console.error(t)}}),postMessage({id:void 0,method:"init",success:!0,response:void 0});';
function qw() {
  let e = new Blob([zw]);
  return URL.createObjectURL(e);
}
var YE = ["log", "warn", "error"],
  Au = "[Replay] ";
function jp(e, t = "info") {
  mt(
    {
      category: "console",
      data: { logger: "replay" },
      level: t,
      message: `${Au}${e}`,
    },
    { level: t },
  );
}
function Yw() {
  let e = !1,
    t = !1,
    n = {
      exception: () => {},
      infoTick: () => {},
      setConfig: (r) => {
        (e = !!r.captureExceptions), (t = !!r.traceInternals);
      },
    };
  return (
    q
      ? (YE.forEach((r) => {
          n[r] = (...o) => {
            _[r](Au, ...o), t && jp(o.join(""), Xn(r));
          };
        }),
        (n.exception = (r, ...o) => {
          o.length && n.error && n.error(...o),
            _.error(Au, r),
            e
              ? X(r, {
                  mechanism: {
                    handled: !0,
                    type: "auto.function.replay.debug",
                  },
                })
              : t && jp(r, "error");
        }),
        (n.infoTick = (...r) => {
          _.log(Au, ...r), t && setTimeout(() => jp(r[0]), 0);
        }))
      : YE.forEach((r) => {
          n[r] = () => {};
        }),
    n
  );
}
var Y = Yw(),
  aa = class extends Error {
    constructor() {
      super(`Event buffer exceeded maximum size of ${Sd}.`);
    }
  },
  Mu = class {
    constructor() {
      (this.events = []),
        (this._totalSize = 0),
        (this.hasCheckout = !1),
        (this.waitForCheckout = !1);
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
    async addEvent(t) {
      let n = JSON.stringify(t).length;
      if (((this._totalSize += n), this._totalSize > Sd)) throw new aa();
      this.events.push(t);
    }
    finish() {
      return new Promise((t) => {
        let n = this.events;
        this.clear(), t(JSON.stringify(n));
      });
    }
    clear() {
      (this.events = []), (this._totalSize = 0), (this.hasCheckout = !1);
    }
    getEarliestTimestamp() {
      let t = null;
      for (let { timestamp: n } of this.events)
        (t === null || n < t) && (t = n);
      return t === null ? t : Ad(t);
    }
  },
  cd = class {
    constructor(t) {
      (this._onMessage = ({ data: n }) => {
        let r = n;
        if (typeof r.id != "number") return;
        let o = this._pending.get(r.id);
        if (!(!o || o.method !== r.method)) {
          if ((this._pending.delete(r.id), !r.success)) {
            q && Y.error("Error in compression worker: ", r.response),
              o.reject(new Error("Error in compression worker"));
            return;
          }
          o.resolve(r.response);
        }
      }),
        (this._worker = t),
        (this._id = 0),
        (this._pending = new Map()),
        this._worker.addEventListener("message", this._onMessage);
    }
    ensureReady() {
      return this._ensureReadyPromise
        ? this._ensureReadyPromise
        : ((this._ensureReadyPromise = new Promise((t, n) => {
            this._worker.addEventListener(
              "message",
              ({ data: r }) => {
                r.success
                  ? t()
                  : (q &&
                      Y.warn(
                        "Received worker message with unsuccessful status",
                        r,
                      ),
                    n(
                      new Error(
                        "Received worker message with unsuccessful status",
                      ),
                    ));
              },
              { once: !0 },
            ),
              this._worker.addEventListener(
                "error",
                (r) => {
                  q && Y.warn("Failed to load Replay compression worker", r),
                    n(
                      new Error(
                        `Failed to load Replay compression worker: ${r instanceof ErrorEvent && r.message ? r.message : "Unknown error. This can happen due to CSP policy restrictions, network issues, or the worker script failing to load."}`,
                      ),
                    );
                },
                { once: !0 },
              );
          })),
          this._ensureReadyPromise);
    }
    destroy() {
      q && Y.log("Destroying compression worker"),
        this._worker.removeEventListener("message", this._onMessage),
        this._pending.forEach((t) => t.reject(new Error("Worker destroyed"))),
        this._pending.clear(),
        this._worker.terminate();
    }
    postMessage(t, n) {
      let r = this._getAndIncrementId();
      return new Promise((o, i) => {
        this._pending.set(r, { method: t, resolve: o, reject: i });
        try {
          this._worker.postMessage({ id: r, method: t, arg: n });
        } catch (s) {
          this._pending.delete(r), i(s);
        }
      });
    }
    _getAndIncrementId() {
      return this._id++;
    }
  },
  ud = class {
    constructor(t) {
      (this._worker = new cd(t)),
        (this._earliestTimestamp = null),
        (this._totalSize = 0),
        (this.hasCheckout = !1),
        (this.waitForCheckout = !1);
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
    addEvent(t) {
      let n = Ad(t.timestamp);
      (!this._earliestTimestamp || n < this._earliestTimestamp) &&
        (this._earliestTimestamp = n);
      let r = JSON.stringify(t);
      return (
        (this._totalSize += r.length),
        this._totalSize > Sd
          ? Promise.reject(new aa())
          : this._sendEventToWorker(r)
      );
    }
    finish() {
      return this._finishRequest();
    }
    clear() {
      (this._earliestTimestamp = null),
        (this._totalSize = 0),
        (this.hasCheckout = !1),
        this._worker.postMessage("clear").then(null, (t) => {
          q && Y.exception(t, 'Sending "clear" message to worker failed', t);
        });
    }
    getEarliestTimestamp() {
      return this._earliestTimestamp;
    }
    _sendEventToWorker(t) {
      return this._worker.postMessage("addEvent", t);
    }
    async _finishRequest() {
      let t = await this._worker.postMessage("finish");
      return (this._earliestTimestamp = null), (this._totalSize = 0), t;
    }
  },
  ld = class {
    constructor(t) {
      (this._fallback = new Mu()),
        (this._compression = new ud(t)),
        (this._used = this._fallback),
        (this._ensureWorkerIsLoadedPromise = this._ensureWorkerIsLoaded());
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
    set hasCheckout(t) {
      this._used.hasCheckout = t;
    }
    set waitForCheckout(t) {
      this._used.waitForCheckout = t;
    }
    destroy() {
      this._fallback.destroy(), this._compression.destroy();
    }
    clear() {
      return this._used.clear();
    }
    getEarliestTimestamp() {
      return this._used.getEarliestTimestamp();
    }
    addEvent(t) {
      return this._used.addEvent(t);
    }
    async finish() {
      return await this.ensureWorkerIsLoaded(), this._used.finish();
    }
    ensureWorkerIsLoaded() {
      return this._ensureWorkerIsLoadedPromise;
    }
    async _ensureWorkerIsLoaded() {
      try {
        await this._compression.ensureReady();
      } catch (t) {
        q &&
          Y.exception(
            t,
            "Failed to load the compression worker, falling back to simple buffer",
          );
        return;
      }
      await this._switchToCompressionWorker();
    }
    async _switchToCompressionWorker() {
      let { events: t, hasCheckout: n, waitForCheckout: r } = this._fallback,
        o = [];
      for (let i of t) o.push(this._compression.addEvent(i));
      (this._compression.hasCheckout = n),
        (this._compression.waitForCheckout = r),
        (this._used = this._compression);
      try {
        await Promise.all(o), this._fallback.clear();
      } catch (i) {
        q && Y.exception(i, "Failed to add events when switching buffers.");
      }
    }
  };
function Vw({ useCompression: e, workerUrl: t }) {
  if (e && window.Worker) {
    let n = Kw(t);
    if (n) return n;
  }
  return q && Y.log("Using simple buffer"), new Mu();
}
function Kw(e) {
  try {
    let t = e || Jw();
    if (!t) return;
    q && Y.log(`Using compression worker${e ? ` from ${e}` : ""}`);
    let n = new Worker(t);
    return new ld(n);
  } catch (t) {
    q && Y.exception(t, "Failed to create compression worker");
  }
}
function Jw() {
  return typeof __SENTRY_EXCLUDE_REPLAY_WORKER__ > "u" ||
    !__SENTRY_EXCLUDE_REPLAY_WORKER__
    ? qw()
    : "";
}
function vd() {
  try {
    return "sessionStorage" in Re && !!Re.sessionStorage;
  } catch {
    return !1;
  }
}
function Xw(e) {
  Qw(), (e.session = void 0);
}
function Qw() {
  if (vd())
    try {
      Re.sessionStorage.removeItem(hd);
    } catch {}
}
function NT(e) {
  return e === void 0 ? !1 : Math.random() < e;
}
function ju(e) {
  if (vd())
    try {
      Re.sessionStorage.setItem(hd, JSON.stringify(e));
    } catch {}
}
function CT(e) {
  let t = Date.now(),
    n = e.id || me(),
    r = e.started || t,
    o = e.lastActivity || t,
    i = e.segmentId || 0,
    s = e.sampled,
    a = e.previousSessionId,
    c = e.dirty || !1;
  return {
    id: n,
    started: r,
    lastActivity: o,
    segmentId: i,
    sampled: s,
    previousSessionId: a,
    dirty: c,
  };
}
function Zw(e, t) {
  return NT(e) ? "session" : t ? "buffer" : !1;
}
function VE(
  { sessionSampleRate: e, allowBuffering: t, stickySession: n = !1 },
  { previousSessionId: r } = {},
) {
  let o = Zw(e, t),
    i = CT({ sampled: o, previousSessionId: r });
  return n && ju(i), i;
}
function eO() {
  if (!vd()) return null;
  try {
    let e = Re.sessionStorage.getItem(hd);
    if (!e) return null;
    let t = JSON.parse(e);
    return q && Y.infoTick("Loading existing session"), CT(t);
  } catch {
    return null;
  }
}
function fd(e, t, n = +new Date()) {
  return e === null || t === void 0 || t < 0 ? !0 : t === 0 ? !1 : e + t <= n;
}
function tO(
  e,
  { maxReplayDuration: t, sessionIdleExpire: n, targetTime: r = Date.now() },
) {
  return fd(e.started, t, r) || fd(e.lastActivity, n, r);
}
function Lu(e, { sessionIdleExpire: t, maxReplayDuration: n }) {
  return !(
    !tO(e, { sessionIdleExpire: t, maxReplayDuration: n }) ||
    (e.sampled === "buffer" && e.segmentId === 0)
  );
}
function zp(
  { sessionIdleExpire: e, maxReplayDuration: t, previousSessionId: n },
  r,
) {
  let o = r.stickySession && eO();
  return o
    ? Lu(o, { sessionIdleExpire: e, maxReplayDuration: t })
      ? (q &&
          Y.infoTick(
            "Session in sessionStorage is expired, creating new one...",
          ),
        VE(r, { previousSessionId: o.id }))
      : o
    : (q && Y.infoTick("Creating new session"),
      VE(r, { previousSessionId: n }));
}
function nO(e) {
  return e.type === ee.Custom;
}
function Nd(e, t, n) {
  return kT(e, t) ? (xT(e, t, n), !0) : !1;
}
function rO(e, t, n) {
  return kT(e, t) ? xT(e, t, n) : Promise.resolve(null);
}
async function xT(e, t, n) {
  let { eventBuffer: r } = e;
  if (!r || (r.waitForCheckout && !n)) return null;
  let o = e.recordingMode === "buffer";
  try {
    n && o && r.clear(), n && ((r.hasCheckout = !0), (r.waitForCheckout = !1));
    let i = e.getOptions(),
      s = oO(t, i.beforeAddRecordingEvent);
    return s ? await r.addEvent(s) : void 0;
  } catch (i) {
    let s = i && i instanceof aa,
      a = s ? "eventBufferOverflow" : "eventBufferError",
      c = I();
    if (c) {
      let u = s ? "buffer_overflow" : "internal_sdk_error";
      c.recordDroppedEvent(u, "replay");
    }
    if (s && o) return r.clear(), (r.waitForCheckout = !0), null;
    e.handleException(i), await e.stop({ reason: a });
  }
}
function kT(e, t) {
  if (!e.eventBuffer || e.isPaused() || !e.isEnabled()) return !1;
  let n = Ad(t.timestamp);
  return n + e.timeouts.sessionIdlePause < Date.now()
    ? !1
    : n > e.getContext().initialTimestamp + e.getOptions().maxReplayDuration
      ? (q &&
          Y.infoTick(
            `Skipping event with timestamp ${n} because it is after maxReplayDuration`,
          ),
        !1)
      : !0;
}
function oO(e, t) {
  try {
    if (typeof t == "function" && nO(e)) return t(e);
  } catch (n) {
    return (
      q &&
        Y.exception(
          n,
          "An error occurred in the `beforeAddRecordingEvent` callback, skipping the event...",
        ),
      null
    );
  }
  return e;
}
function Cd(e) {
  return !e.type;
}
function pd(e) {
  return e.type === "transaction";
}
function iO(e) {
  return e.type === "replay_event";
}
function KE(e) {
  return e.type === "feedback";
}
function sO(e) {
  return (t, n) => {
    if (!e.isEnabled() || (!Cd(t) && !pd(t))) return;
    let r = n.statusCode;
    if (!(!r || r < 200 || r >= 300)) {
      if (pd(t)) {
        aO(e, t);
        return;
      }
      cO(e, t);
    }
  };
}
function aO(e, t) {
  let n = e.getContext();
  t.contexts?.trace?.trace_id &&
    n.traceIds.size < 100 &&
    n.traceIds.add(t.contexts.trace.trace_id);
}
function cO(e, t) {
  let n = e.getContext();
  if (
    (t.event_id && n.errorIds.size < 100 && n.errorIds.add(t.event_id),
    e.recordingMode !== "buffer" || !t.tags?.replayId)
  )
    return;
  let { beforeErrorSampling: r } = e.getOptions();
  (typeof r == "function" && !r(t)) ||
    yo(async () => {
      try {
        await e.sendBufferedReplayOrFlush();
      } catch (o) {
        e.handleException(o);
      }
    });
}
function uO(e) {
  return (t) => {
    !e.isEnabled() || !Cd(t) || lO(e, t);
  };
}
function lO(e, t) {
  let n = t.exception?.values?.[0]?.value;
  if (
    typeof n == "string" &&
    (n.match(
      /(reactjs\.org\/docs\/error-decoder\.html\?invariant=|react\.dev\/errors\/)(418|419|422|423|425)/,
    ) ||
      n.match(
        /(does not match server-rendered HTML|Hydration failed because)/i,
      ))
  ) {
    let r = Bn({ category: "replay.hydrate-error", data: { url: at() } });
    fa(e, r);
  }
}
function fO(e) {
  let t = I();
  t && t.on("beforeAddBreadcrumb", (n) => pO(e, n));
}
function pO(e, t) {
  if (!e.isEnabled() || !wT(t)) return;
  let n = dO(t);
  n && fa(e, n);
}
function dO(e) {
  return !wT(e) ||
    ["fetch", "xhr", "sentry.event", "sentry.transaction"].includes(
      e.category,
    ) ||
    e.category.startsWith("ui.")
    ? null
    : e.category === "console"
      ? mO(e)
      : Bn(e);
}
function mO(e) {
  let t = e.data?.arguments;
  if (!Array.isArray(t) || t.length === 0) return Bn(e);
  let n = !1,
    r = t.map((o) => {
      if (!o) return o;
      if (typeof o == "string")
        return o.length > Tu ? ((n = !0), `${o.slice(0, Tu)}\u2026`) : o;
      if (typeof o == "object")
        try {
          let i = he(o, 7);
          return JSON.stringify(i).length > Tu
            ? ((n = !0), `${JSON.stringify(i, null, 2).slice(0, Tu)}\u2026`)
            : i;
        } catch {}
      return o;
    });
  return Bn({
    ...e,
    data: {
      ...e.data,
      arguments: r,
      ...(n ? { _meta: { warnings: ["CONSOLE_ARG_TRUNCATED"] } } : {}),
    },
  });
}
function wT(e) {
  return !!e.category;
}
function _O(e, t) {
  return e.type || !e.exception?.values?.length
    ? !1
    : !!t.originalException?.__rrweb__;
}
function Pu() {
  let e = C().getPropagationContext().dsc;
  e && delete e.replay_id;
  let t = ne();
  if (t) {
    let n = Le(t);
    delete n.replay_id;
  }
}
function JE(e) {
  let t = C().getPropagationContext().dsc;
  t && (t.replay_id = e);
  let n = ne();
  if (n) {
    let r = Le(n);
    r.replay_id = e;
  }
}
function hO(e, t) {
  e.triggerUserActivity(),
    e.addUpdate(() =>
      t.timestamp
        ? (e.throttledAddEvent({
            type: ee.Custom,
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
          }),
          !1)
        : !0,
    );
}
function gO(e, t) {
  return e.recordingMode !== "buffer" ||
    t.message === gd ||
    !t.exception ||
    t.type
    ? !1
    : NT(e.getOptions().errorSampleRate);
}
function SO(e) {
  return Object.assign(
    (t, n) => {
      if (
        (e.session &&
          Lu(e.session, {
            maxReplayDuration: e.getOptions().maxReplayDuration,
            sessionIdleExpire: e.timeouts.sessionIdleExpire,
          }) &&
          Pu(),
        !e.isEnabled() || e.isPaused())
      )
        return t;
      if (iO(t)) return delete t.breadcrumbs, t;
      if (!Cd(t) && !pd(t) && !KE(t)) return t;
      if (!e.checkAndHandleExpiredSession()) return Pu(), t;
      if (KE(t))
        return (
          e.flush(),
          (t.contexts.feedback.replay_id = e.getSessionId()),
          hO(e, t),
          t
        );
      if (_O(t, n) && !e.getOptions()._experiments.captureExceptions)
        return q && Y.log("Ignoring error from rrweb internals", t), null;
      let o = gO(e, t);
      if (
        ((o || e.recordingMode === "session") &&
          (t.tags = { ...t.tags, replayId: e.getSessionId() }),
        o && e.recordingMode === "buffer" && e.session?.sampled === "buffer")
      ) {
        let s = e.session;
        (s.dirty = !0), e.getOptions().stickySession && ju(s);
      }
      return t;
    },
    { id: "Replay" },
  );
}
function zu(e, t) {
  return t.map(({ type: n, start: r, end: o, name: i, data: s }) => {
    let a = e.throttledAddEvent({
      type: ee.Custom,
      timestamp: r,
      data: {
        tag: "performanceSpan",
        payload: {
          op: n,
          description: i,
          startTimestamp: r,
          endTimestamp: o,
          data: s,
        },
      },
    });
    return typeof a == "string" ? Promise.resolve(null) : a;
  });
}
function EO(e) {
  let { from: t, to: n } = e,
    r = Date.now() / 1e3;
  return {
    type: "navigation.push",
    start: r,
    end: r,
    name: n,
    data: { previous: t },
  };
}
function TO(e) {
  return (t) => {
    if (!e.isEnabled()) return;
    let n = EO(t);
    n !== null &&
      (e.getContext().urls.push(n.name),
      e.triggerUserActivity(),
      e.addUpdate(() => (zu(e, [n]), !1)));
  };
}
function yO(e, t) {
  return q && e.getOptions()._experiments.traceInternals ? !1 : Qo(t, I());
}
function OT(e, t) {
  e.isEnabled() &&
    t !== null &&
    (yO(e, t.name) || e.addUpdate(() => (zu(e, [t]), !0)));
}
function qu(e) {
  if (!e) return;
  let t = new TextEncoder();
  try {
    if (typeof e == "string") return t.encode(e).length;
    if (e instanceof URLSearchParams) return t.encode(e.toString()).length;
    if (e instanceof FormData) {
      let n = _u(e);
      return t.encode(n).length;
    }
    if (e instanceof Blob) return e.size;
    if (e instanceof ArrayBuffer) return e.byteLength;
  } catch {}
}
function MT(e) {
  if (!e) return;
  let t = parseInt(e, 10);
  return isNaN(t) ? void 0 : t;
}
function Uu(e, t) {
  if (!e) return { headers: {}, size: void 0, _meta: { warnings: [t] } };
  let n = { ...e._meta },
    r = n.warnings || [];
  return (n.warnings = [...r, t]), (e._meta = n), e;
}
function LT(e, t) {
  if (!t) return null;
  let {
    startTimestamp: n,
    endTimestamp: r,
    url: o,
    method: i,
    statusCode: s,
    request: a,
    response: c,
  } = t;
  return {
    type: e,
    start: n / 1e3,
    end: r / 1e3,
    name: o,
    data: { method: i, statusCode: s, request: a, response: c },
  };
}
function ca(e) {
  return { headers: {}, size: e, _meta: { warnings: ["URL_SKIPPED"] } };
}
function Lr(e, t, n) {
  if (!t && Object.keys(e).length === 0) return;
  if (!t) return { headers: e };
  if (!n) return { headers: e, size: t };
  let r = { headers: e, size: t },
    { body: o, warnings: i } = IO(n);
  return (r.body = o), i?.length && (r._meta = { warnings: i }), r;
}
function dd(e, t) {
  return Object.entries(e).reduce((n, [r, o]) => {
    let i = r.toLowerCase();
    return t.includes(i) && e[r] && (n[i] = o), n;
  }, {});
}
function IO(e) {
  if (!e || typeof e != "string") return { body: e };
  let t = e.length > kE,
    n = bO(e);
  if (t) {
    let r = e.slice(0, kE);
    return n
      ? { body: r, warnings: ["MAYBE_JSON_TRUNCATED"] }
      : { body: `${r}\u2026`, warnings: ["TEXT_TRUNCATED"] };
  }
  if (n)
    try {
      return { body: JSON.parse(e) };
    } catch {}
  return { body: e };
}
function bO(e) {
  let t = e[0],
    n = e[e.length - 1];
  return (t === "[" && n === "]") || (t === "{" && n === "}");
}
function Du(e, t) {
  let n = AO(e);
  return He(n, t);
}
function AO(e, t = Re.document.baseURI) {
  if (
    e.startsWith("http://") ||
    e.startsWith("https://") ||
    e.startsWith(Re.location.origin)
  )
    return e;
  let n = new URL(e, t);
  if (n.origin !== new URL(t).origin) return e;
  let r = n.href;
  return !e.endsWith("/") && r.endsWith("/") ? r.slice(0, -1) : r;
}
async function RO(e, t, n) {
  try {
    let r = await NO(e, t, n),
      o = LT("resource.fetch", r);
    OT(n.replay, o);
  } catch (r) {
    q && Y.exception(r, "Failed to capture fetch breadcrumb");
  }
}
function vO(e, t) {
  let { input: n, response: r } = t,
    o = n ? vi(n) : void 0,
    i = qu(o),
    s = r ? MT(r.headers.get("content-length")) : void 0;
  i !== void 0 && (e.data.request_body_size = i),
    s !== void 0 && (e.data.response_body_size = s);
}
async function NO(e, t, n) {
  let r = Date.now(),
    { startTimestamp: o = r, endTimestamp: i = r } = t,
    {
      url: s,
      method: a,
      status_code: c = 0,
      request_body_size: u,
      response_body_size: f,
    } = e.data,
    l = Du(s, n.networkDetailAllowUrls) && !Du(s, n.networkDetailDenyUrls),
    d = l ? CO(n, t.input, u) : ca(u),
    p = await xO(l, n, t.response, f);
  return {
    startTimestamp: o,
    endTimestamp: i,
    url: s,
    method: a,
    statusCode: c,
    request: d,
    response: p,
  };
}
function CO({ networkCaptureBodies: e, networkRequestHeaders: t }, n, r) {
  let o = n ? OO(n, t) : {};
  if (!e) return Lr(o, r, void 0);
  let i = vi(n),
    [s, a] = bo(i, Y),
    c = Lr(o, r, s);
  return a ? Uu(c, a) : c;
}
async function xO(
  e,
  { networkCaptureBodies: t, networkResponseHeaders: n },
  r,
  o,
) {
  if (!e && o !== void 0) return ca(o);
  let i = r ? PT(r.headers, n) : {};
  if (!r || (!t && o !== void 0)) return Lr(i, o, void 0);
  let [s, a] = await wO(r),
    c = kO(s, {
      networkCaptureBodies: t,
      responseBodySize: o,
      captureDetails: e,
      headers: i,
    });
  return a ? Uu(c, a) : c;
}
function kO(
  e,
  {
    networkCaptureBodies: t,
    responseBodySize: n,
    captureDetails: r,
    headers: o,
  },
) {
  try {
    let i = e?.length && n === void 0 ? qu(e) : n;
    return r ? (t ? Lr(o, i, e) : Lr(o, i, void 0)) : ca(i);
  } catch (i) {
    return (
      q && Y.exception(i, "Failed to serialize response body"), Lr(o, n, void 0)
    );
  }
}
async function wO(e) {
  let t = MO(e);
  if (!t) return [void 0, "BODY_PARSE_ERROR"];
  try {
    return [await LO(t)];
  } catch (n) {
    return n instanceof Error && n.message.indexOf("Timeout") > -1
      ? (q && Y.warn("Parsing text body from response timed out"),
        [void 0, "BODY_PARSE_TIMEOUT"])
      : (q && Y.exception(n, "Failed to get text body from response"),
        [void 0, "BODY_PARSE_ERROR"]);
  }
}
function PT(e, t) {
  let n = {};
  return (
    t.forEach((r) => {
      e.get(r) && (n[r] = e.get(r));
    }),
    n
  );
}
function OO(e, t) {
  return e.length === 1 && typeof e[0] != "string"
    ? XE(e[0], t)
    : e.length === 2
      ? XE(e[1], t)
      : {};
}
function XE(e, t) {
  if (!e) return {};
  let n = e.headers;
  return n
    ? n instanceof Headers
      ? PT(n, t)
      : Array.isArray(n)
        ? {}
        : dd(n, t)
    : {};
}
function MO(e) {
  try {
    return e.clone();
  } catch (t) {
    q && Y.exception(t, "Failed to clone response body");
  }
}
function LO(e) {
  return new Promise((t, n) => {
    let r = yo(
      () => n(new Error("Timeout while trying to read response body")),
      500,
    );
    PO(e)
      .then(
        (o) => t(o),
        (o) => n(o),
      )
      .finally(() => clearTimeout(r));
  });
}
async function PO(e) {
  return await e.text();
}
async function UO(e, t, n) {
  try {
    let r = BO(e, t, n),
      o = LT("resource.xhr", r);
    OT(n.replay, o);
  } catch (r) {
    q && Y.exception(r, "Failed to capture xhr breadcrumb");
  }
}
function DO(e, t) {
  let { xhr: n, input: r } = t;
  if (!n) return;
  let o = qu(r),
    i = n.getResponseHeader("content-length")
      ? MT(n.getResponseHeader("content-length"))
      : GO(n.response, n.responseType);
  o !== void 0 && (e.data.request_body_size = o),
    i !== void 0 && (e.data.response_body_size = i);
}
function BO(e, t, n) {
  let r = Date.now(),
    { startTimestamp: o = r, endTimestamp: i = r, input: s, xhr: a } = t,
    {
      url: c,
      method: u,
      status_code: f = 0,
      request_body_size: l,
      response_body_size: d,
    } = e.data;
  if (!c) return null;
  if (
    !a ||
    !Du(c, n.networkDetailAllowUrls) ||
    Du(c, n.networkDetailDenyUrls)
  ) {
    let P = ca(l),
      E = ca(d);
    return {
      startTimestamp: o,
      endTimestamp: i,
      url: c,
      method: u,
      statusCode: f,
      request: P,
      response: E,
    };
  }
  let p = a[_t],
    m = p ? dd(p.request_headers, n.networkRequestHeaders) : {},
    h = dd(Ks(a), n.networkResponseHeaders),
    [g, S] = n.networkCaptureBodies ? bo(s, Y) : [void 0],
    [T, x] = n.networkCaptureBodies ? FO(a) : [void 0],
    A = Lr(m, l, g),
    M = Lr(h, d, T);
  return {
    startTimestamp: o,
    endTimestamp: i,
    url: c,
    method: u,
    statusCode: f,
    request: S ? Uu(A, S) : A,
    response: x ? Uu(M, x) : M,
  };
}
function FO(e) {
  let t = [];
  try {
    return [e.responseText];
  } catch (n) {
    t.push(n);
  }
  try {
    return HO(e.response, e.responseType);
  } catch (n) {
    t.push(n);
  }
  return q && Y.warn("Failed to get xhr response body", ...t), [void 0];
}
function HO(e, t) {
  try {
    if (typeof e == "string") return [e];
    if (e instanceof Document) return [e.body.outerHTML];
    if (t === "json" && e && typeof e == "object") return [JSON.stringify(e)];
    if (!e) return [void 0];
  } catch (n) {
    return (
      q && Y.exception(n, "Failed to serialize body", e),
      [void 0, "BODY_PARSE_ERROR"]
    );
  }
  return (
    q && Y.log("Skipping network body because of body type", e),
    [void 0, "UNPARSEABLE_BODY_TYPE"]
  );
}
function GO(e, t) {
  try {
    let n = t === "json" && e && typeof e == "object" ? JSON.stringify(e) : e;
    return qu(n);
  } catch {
    return;
  }
}
function $O(e) {
  let t = I();
  try {
    let {
        networkDetailAllowUrls: n,
        networkDetailDenyUrls: r,
        networkCaptureBodies: o,
        networkRequestHeaders: i,
        networkResponseHeaders: s,
      } = e.getOptions(),
      a = {
        replay: e,
        networkDetailAllowUrls: n,
        networkDetailDenyUrls: r,
        networkCaptureBodies: o,
        networkRequestHeaders: i,
        networkResponseHeaders: s,
      };
    t && t.on("beforeAddBreadcrumb", (c, u) => WO(a, c, u));
  } catch {}
}
function WO(e, t, n) {
  if (t.data)
    try {
      jO(t) && qO(n) && (DO(t, n), UO(t, n, e)),
        zO(t) && YO(n) && (vO(t, n), RO(t, n, e));
    } catch (r) {
      q && Y.exception(r, "Error when enriching network breadcrumb");
    }
}
function jO(e) {
  return e.category === "xhr";
}
function zO(e) {
  return e.category === "fetch";
}
function qO(e) {
  return e?.xhr;
}
function YO(e) {
  return e?.input !== void 0;
}
function VO(e) {
  let t = I();
  Vs(Nw(e)), or(TO(e)), fO(e), $O(e);
  let n = SO(e);
  ys(n),
    t &&
      (t.on("beforeSendEvent", uO(e)),
      t.on("afterSendEvent", sO(e)),
      t.on("createDsc", (r) => {
        let o = e.getSessionId();
        o &&
          e.isEnabled() &&
          e.recordingMode === "session" &&
          e.checkAndHandleExpiredSession() &&
          (r.replay_id = o);
      }),
      t.on("spanStart", (r) => {
        e.lastActiveSpan = r;
      }),
      t.on("spanEnd", (r) => {
        e.lastActiveSpan = r;
      }),
      t.on("beforeSendFeedback", async (r, o) => {
        let i = e.getSessionId();
        o?.includeReplay &&
          e.isEnabled() &&
          i &&
          r.contexts?.feedback &&
          (r.contexts.feedback.source === "api" &&
            (await e.sendBufferedReplayOrFlush()),
          (r.contexts.feedback.replay_id = i));
      }),
      t.on("openFeedbackWidget", async () => {
        await e.sendBufferedReplayOrFlush();
      }));
}
async function KO(e) {
  try {
    return Promise.all(zu(e, [JO(Re.performance.memory)]));
  } catch {
    return [];
  }
}
function JO(e) {
  let { jsHeapSizeLimit: t, totalJSHeapSize: n, usedJSHeapSize: r } = e,
    o = Date.now() / 1e3;
  return {
    type: "memory",
    name: "memory",
    start: o,
    end: o,
    data: {
      memory: { jsHeapSizeLimit: t, totalJSHeapSize: n, usedJSHeapSize: r },
    },
  };
}
function XO(e, t, n) {
  return Sf(e, t, { ...n, setTimeoutImpl: yo });
}
var bu = v.navigator;
function QO() {
  return /iPhone|iPad|iPod/i.test(bu?.userAgent ?? "") ||
    (/Macintosh/i.test(bu?.userAgent ?? "") &&
      bu?.maxTouchPoints &&
      bu?.maxTouchPoints > 1)
    ? { sampling: { mousemove: !1 } }
    : {};
}
function ZO(e) {
  let t = !1;
  return (n, r) => {
    if (!e.checkAndHandleExpiredSession()) {
      q && Y.warn("Received replay event after session expired.");
      return;
    }
    let o = r || !t;
    (t = !0),
      eM(n),
      e.clickDetector && Iw(e.clickDetector, n),
      e.addUpdate(() => {
        if (
          (e.recordingMode === "buffer" && o && e.setInitialState(),
          !Nd(e, n, o))
        )
          return !0;
        if (!o) return !1;
        let i = e.session;
        if (
          (nM(e, o),
          e.recordingMode === "buffer" && i && e.eventBuffer && !i.dirty)
        ) {
          let s = e.eventBuffer.getEarliestTimestamp();
          s &&
            (q &&
              Y.log(
                `Updating session start time to earliest event in buffer to ${new Date(s)}`,
              ),
            (i.started = s),
            e.getOptions().stickySession && ju(i));
        }
        return (
          i?.previousSessionId || (e.recordingMode === "session" && e.flush()),
          !0
        );
      });
  };
}
function eM(e) {
  let t = e.data;
  if (
    !(
      e.type !== ee.IncrementalSnapshot ||
      !t ||
      typeof t != "object" ||
      !("source" in t) ||
      t.source !== V.Mutation ||
      !("attributes" in t) ||
      !Array.isArray(t.attributes)
    )
  )
    for (let n of t.attributes) {
      let r = Tn.mirror.getNode(n.id),
        o = r && Tn.mirror.getMeta(r);
      if (o?.type === Wu.Element)
        for (let [i, s] of Object.entries(n.attributes))
          s === null ? delete o.attributes[i] : (o.attributes[i] = s);
    }
}
function tM(e) {
  let t = e.getOptions();
  return {
    type: ee.Custom,
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
        useCompression: e.eventBuffer ? e.eventBuffer.type === "worker" : !1,
        networkDetailHasUrls: t.networkDetailAllowUrls.length > 0,
        networkCaptureBodies: t.networkCaptureBodies,
        networkRequestHasHeaders: t.networkRequestHeaders.length > 0,
        networkResponseHasHeaders: t.networkResponseHeaders.length > 0,
      },
    },
  };
}
function nM(e, t) {
  !t || e.session?.segmentId !== 0 || Nd(e, tM(e), !1);
}
function rM(e) {
  if (!e) return null;
  try {
    return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
  } catch {
    return null;
  }
}
function oM(e, t, n, r) {
  return ke(Go(e, dn(e), r, n), [
    [{ type: "replay_event" }, e],
    [
      {
        type: "replay_recording",
        length:
          typeof t == "string" ? new TextEncoder().encode(t).length : t.length,
      },
      t,
    ],
  ]);
}
function iM({ recordingData: e, headers: t }) {
  let n,
    r = `${JSON.stringify(t)}
`;
  if (typeof e == "string") n = `${r}${e}`;
  else {
    let i = new TextEncoder().encode(r);
    (n = new Uint8Array(i.length + e.length)), n.set(i), n.set(e, i.length);
  }
  return n;
}
async function sM({ client: e, scope: t, replayId: n, event: r }) {
  let o =
      typeof e._integrations == "object" &&
      e._integrations !== null &&
      !Array.isArray(e._integrations)
        ? Object.keys(e._integrations)
        : void 0,
    i = { event_id: n, integrations: o };
  e.emit("preprocessEvent", r, i);
  let s = await hs(e.getOptions(), r, i, t, e, te());
  if (!s) return null;
  e.emit("postprocessEvent", s, i), (s.platform = s.platform || "javascript");
  let a = e.getSdkMetadata(),
    { name: c, version: u, settings: f } = a?.sdk || {};
  return (
    (s.sdk = {
      ...s.sdk,
      name: c || "sentry.javascript.unknown",
      version: u || "0.0.0",
      settings: f,
    }),
    s
  );
}
async function aM({
  recordingData: e,
  replayId: t,
  segmentId: n,
  eventContext: r,
  timestamp: o,
  session: i,
}) {
  let s = iM({ recordingData: e, headers: { segment_id: n } }),
    { urls: a, errorIds: c, traceIds: u, initialTimestamp: f } = r,
    l = I(),
    d = C(),
    p = l?.getTransport(),
    m = l?.getDsn();
  if (!l || !p || !m || !i.sampled) return Promise.resolve({});
  let h = {
      type: V0,
      replay_start_timestamp: f / 1e3,
      timestamp: o / 1e3,
      error_ids: c,
      trace_ids: u,
      urls: a,
      replay_id: t,
      segment_id: n,
      replay_type: i.sampled,
    },
    g = await sM({ scope: d, client: l, replayId: t, event: h });
  if (!g)
    return (
      l.recordDroppedEvent("event_processor", "replay"),
      q && Y.log("An event processor returned `null`, will not send event."),
      Promise.resolve({})
    );
  delete g.sdkProcessingMetadata;
  let S = oM(g, s, m, l.getOptions().tunnel),
    T;
  try {
    T = await p.send(S);
  } catch (A) {
    let M = new Error(gd);
    try {
      M.cause = A;
    } catch {}
    throw M;
  }
  let x = Rs({}, T);
  if (As(x, "replay")) throw new ua(x);
  if (
    typeof T.statusCode == "number" &&
    (T.statusCode < 200 || T.statusCode >= 300)
  )
    throw new Bu(T.statusCode);
  return T;
}
var Bu = class extends Error {
    constructor(t) {
      super(`Transport returned status code ${t}`);
    }
  },
  ua = class extends Error {
    constructor(t) {
      super("Rate limit hit"), (this.rateLimits = t);
    }
  },
  Fu = class extends Error {
    constructor() {
      super("Session is too long, not sending replay");
    }
  };
async function UT(e, t = { count: 0, interval: ek }) {
  let { recordingData: n, onError: r } = e;
  if (n.length)
    try {
      return await aM(e), !0;
    } catch (o) {
      if (o instanceof Bu || o instanceof ua) throw o;
      if ((Ss("Replays", { _retryCount: t.count }), r && r(o), t.count >= tk)) {
        let i = new Error(`${gd} - max retries exceeded`);
        try {
          i.cause = o;
        } catch {}
        throw i;
      }
      return (
        (t.interval *= ++t.count),
        new Promise((i, s) => {
          yo(async () => {
            try {
              await UT(e, t), i(!0);
            } catch (a) {
              s(a);
            }
          }, t.interval);
        })
      );
    }
}
var DT = "__THROTTLED",
  cM = "__SKIPPED";
function uM(e, t, n) {
  let r = new Map(),
    o = (a) => {
      let c = a - n;
      r.forEach((u, f) => {
        f < c && r.delete(f);
      });
    },
    i = () => [...r.values()].reduce((a, c) => a + c, 0),
    s = !1;
  return (...a) => {
    let c = Math.floor(Date.now() / 1e3);
    if ((o(c), i() >= t)) {
      let f = s;
      return (s = !0), f ? cM : DT;
    }
    s = !1;
    let u = r.get(c) || 0;
    return r.set(c, u + 1), e(...a);
  };
}
var md = class {
  constructor({ options: t, recordingOptions: n }) {
    (this.eventBuffer = null),
      (this.performanceEntries = []),
      (this.replayPerformanceEntries = []),
      (this.recordingMode = "session"),
      (this.timeouts = { sessionIdlePause: K0, sessionIdleExpire: J0 }),
      (this._lastActivity = Date.now()),
      (this._isEnabled = !1),
      (this._isPaused = !1),
      (this._requiresManualStart = !1),
      (this._hasInitializedCoreListeners = !1),
      (this._context = {
        errorIds: new Set(),
        traceIds: new Set(),
        urls: [],
        initialTimestamp: Date.now(),
        initialUrl: "",
      }),
      (this._recordingOptions = n),
      (this._options = t),
      (this._debouncedFlush = XO(
        () => this._flush(),
        this._options.flushMinDelay,
        { maxWait: this._options.flushMaxDelay },
      )),
      (this._throttledAddEvent = uM((s, a) => rO(this, s, a), 300, 5));
    let { slowClickTimeout: r, slowClickIgnoreSelectors: o } =
        this.getOptions(),
      i = r
        ? {
            threshold: Math.min(nk, r),
            timeout: r,
            scrollTimeout: rk,
            ignoreSelector: o ? o.join(",") : "",
          }
        : void 0;
    if ((i && (this.clickDetector = new ad(this, i)), q)) {
      let s = t._experiments;
      Y.setConfig({
        captureExceptions: !!s.captureExceptions,
        traceInternals: !!s.traceInternals,
      });
    }
    (this._handleVisibilityChange = () => {
      Re.document.visibilityState === "visible"
        ? this._doChangeToForegroundTasks()
        : this._doChangeToBackgroundTasks();
    }),
      (this._handleWindowBlur = () => {
        let s = Bn({ category: "ui.blur" });
        this._doChangeToBackgroundTasks(s);
      }),
      (this._handleWindowFocus = () => {
        let s = Bn({ category: "ui.focus" });
        this._doChangeToForegroundTasks(s);
      }),
      (this._handleKeyboardEvent = (s) => {
        ww(this, s);
      });
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
    return !!this._canvas;
  }
  getOptions() {
    return this._options;
  }
  handleException(t) {
    q && Y.exception(t), this._options.onError && this._options.onError(t);
  }
  initializeSampling(t) {
    let { errorSampleRate: n, sessionSampleRate: r } = this._options,
      o = n <= 0 && r <= 0;
    if (((this._requiresManualStart = o), !o)) {
      if ((this._initializeSessionForSampling(t), !this.session)) {
        q && Y.exception(new Error("Unable to initialize and create session"));
        return;
      }
      this.session.sampled !== !1 &&
        ((this.recordingMode =
          this.session.sampled === "buffer" && this.session.segmentId === 0
            ? "buffer"
            : "session"),
        q && Y.infoTick(`Starting replay in ${this.recordingMode} mode`),
        this._initializeRecording());
    }
  }
  start() {
    if (this._isEnabled && this.recordingMode === "session") {
      q && Y.log("Recording is already in progress");
      return;
    }
    if (this._isEnabled && this.recordingMode === "buffer") {
      q && Y.log("Buffering is in progress, call `flush()` to save the replay");
      return;
    }
    q && Y.infoTick("Starting replay in session mode"),
      this._updateUserActivity();
    let t = zp(
      {
        maxReplayDuration: this._options.maxReplayDuration,
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
      },
      {
        stickySession: this._options.stickySession,
        sessionSampleRate: 1,
        allowBuffering: !1,
      },
    );
    (this.session = t),
      (this.recordingMode = "session"),
      this._initializeRecording();
  }
  startBuffering() {
    if (this._isEnabled) {
      q && Y.log("Buffering is in progress, call `flush()` to save the replay");
      return;
    }
    q && Y.infoTick("Starting replay in buffer mode");
    let t = zp(
      {
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
        maxReplayDuration: this._options.maxReplayDuration,
      },
      {
        stickySession: this._options.stickySession,
        sessionSampleRate: 0,
        allowBuffering: !0,
      },
    );
    (this.session = t),
      (this.recordingMode = "buffer"),
      this._initializeRecording();
  }
  startRecording() {
    try {
      let t = this._canvas;
      this._stopRecording = Tn({
        ...this._recordingOptions,
        ...(this.recordingMode === "buffer"
          ? { checkoutEveryNms: Z0 }
          : this._options._experiments.continuousCheckout && {
              checkoutEveryNms: Math.max(
                36e4,
                this._options._experiments.continuousCheckout,
              ),
            }),
        emit: ZO(this),
        ...QO(),
        onMutation: this._onMutationHandler.bind(this),
        ...(t
          ? {
              recordCanvas: t.recordCanvas,
              getCanvasManager: t.getCanvasManager,
              sampling: t.sampling,
              dataURLOptions: t.dataURLOptions,
            }
          : {}),
      });
    } catch (t) {
      this.handleException(t);
    }
  }
  stopRecording() {
    try {
      return (
        this._stopRecording &&
          (this._stopRecording(), (this._stopRecording = void 0)),
        !0
      );
    } catch (t) {
      return this.handleException(t), !1;
    }
  }
  async stop({ forceFlush: t = !1, reason: n } = {}) {
    if (!this._isEnabled) return;
    (this._isEnabled = !1), (this.recordingMode = "buffer");
    let r = n ?? "manual";
    I()?.emit("replayEnd", { sessionId: this.session?.id, reason: r });
    try {
      q && Y.log(`Stopping Replay triggered by ${r}`),
        Pu(),
        this._removeListeners(),
        this.stopRecording(),
        this._debouncedFlush.cancel(),
        t && (await this._flush({ force: !0 })),
        this.eventBuffer?.destroy(),
        (this.eventBuffer = null),
        Xw(this);
    } catch (o) {
      this.handleException(o);
    }
  }
  pause() {
    this._isPaused ||
      ((this._isPaused = !0),
      this.stopRecording(),
      q && Y.log("Pausing replay"));
  }
  resume() {
    !this._isPaused ||
      !this._checkSession() ||
      ((this._isPaused = !1),
      this.startRecording(),
      q && Y.log("Resuming replay"));
  }
  async sendBufferedReplayOrFlush({ continueRecording: t = !0 } = {}) {
    if (this.recordingMode === "session") return this.flushImmediate();
    let n = Date.now();
    q && Y.log("Converting buffer to session"), await this.flushImmediate();
    let r = this.stopRecording();
    !t ||
      !r ||
      (this.recordingMode !== "session" &&
        ((this.recordingMode = "session"),
        this.session &&
          ((this.session.dirty = !1),
          this._updateUserActivity(n),
          this._updateSessionActivity(n),
          this._maybeSaveSession(),
          JE(this.session.id)),
        this.startRecording()));
  }
  addUpdate(t) {
    let n = t();
    this.recordingMode === "buffer" ||
      !this._isEnabled ||
      (n !== !0 && this._debouncedFlush());
  }
  triggerUserActivity() {
    if ((this._updateUserActivity(), !this._stopRecording)) {
      if (!this._checkSession()) return;
      this.resume();
      return;
    }
    this.checkAndHandleExpiredSession(), this._updateSessionActivity();
  }
  updateUserActivity() {
    this._updateUserActivity(), this._updateSessionActivity();
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
    return this._debouncedFlush(), this._debouncedFlush.flush();
  }
  cancelFlush() {
    this._debouncedFlush.cancel();
  }
  getSessionId(t) {
    if (!(t && this.session?.sampled === !1)) return this.session?.id;
  }
  checkAndHandleExpiredSession() {
    if (
      this._lastActivity &&
      fd(this._lastActivity, this.timeouts.sessionIdlePause) &&
      this.session?.sampled === "session"
    ) {
      this.pause();
      return;
    }
    return !!this._checkSession();
  }
  setInitialState() {
    let t = `${Re.location.pathname}${Re.location.hash}${Re.location.search}`,
      n = `${Re.location.origin}${t}`;
    (this.performanceEntries = []),
      (this.replayPerformanceEntries = []),
      this._clearContext(),
      (this._context.initialUrl = n),
      (this._context.initialTimestamp = Date.now()),
      this._context.urls.push(n);
  }
  throttledAddEvent(t, n) {
    let r = this._throttledAddEvent(t, n);
    if (r === DT) {
      let o = Bn({ category: "replay.throttled" });
      this.addUpdate(
        () =>
          !Nd(this, {
            type: pw,
            timestamp: o.timestamp || 0,
            data: { tag: "breadcrumb", payload: o, metric: !0 },
          }),
      );
    }
    return r;
  }
  getCurrentRoute() {
    let t = this.lastActiveSpan || ne(),
      n = t && ie(t),
      o = ((n && L(n).data) || {})[Me];
    if (!(!n || !o || !["route", "custom"].includes(o)))
      return L(n).description;
  }
  _initializeRecording() {
    this.setInitialState(),
      this._updateSessionActivity(),
      (this.eventBuffer = Vw({
        useCompression: this._options.useCompression,
        workerUrl: this._options.workerUrl,
      })),
      this._removeListeners(),
      this._addListeners(),
      (this._isEnabled = !0),
      (this._isPaused = !1),
      this.session &&
        I()?.emit("replayStart", {
          sessionId: this.session.id,
          recordingMode: this.recordingMode,
        }),
      this.startRecording(),
      this.recordingMode === "session" && this.session && JE(this.session.id);
  }
  _initializeSessionForSampling(t) {
    let n = this._options.errorSampleRate > 0,
      r = zp(
        {
          sessionIdleExpire: this.timeouts.sessionIdleExpire,
          maxReplayDuration: this._options.maxReplayDuration,
          previousSessionId: t,
        },
        {
          stickySession: this._options.stickySession,
          sessionSampleRate: this._options.sessionSampleRate,
          allowBuffering: n,
        },
      );
    this.session = r;
  }
  _checkSession() {
    if (!this.session) return !1;
    let t = this.session;
    return Lu(t, {
      sessionIdleExpire: this.timeouts.sessionIdleExpire,
      maxReplayDuration: this._options.maxReplayDuration,
    })
      ? (this._refreshSession(t), !1)
      : !0;
  }
  async _refreshSession(t) {
    this._isEnabled &&
      (await this.stop({ reason: "sessionExpired" }),
      this.initializeSampling(t.id));
  }
  _addListeners() {
    try {
      Re.document.addEventListener(
        "visibilitychange",
        this._handleVisibilityChange,
      ),
        Re.addEventListener("blur", this._handleWindowBlur),
        Re.addEventListener("focus", this._handleWindowFocus),
        Re.addEventListener("keydown", this._handleKeyboardEvent),
        this.clickDetector && this.clickDetector.addListeners(),
        this._hasInitializedCoreListeners ||
          (VO(this), (this._hasInitializedCoreListeners = !0));
    } catch (t) {
      this.handleException(t);
    }
    this._performanceCleanupCallback = jw(this);
  }
  _removeListeners() {
    try {
      Re.document.removeEventListener(
        "visibilitychange",
        this._handleVisibilityChange,
      ),
        Re.removeEventListener("blur", this._handleWindowBlur),
        Re.removeEventListener("focus", this._handleWindowFocus),
        Re.removeEventListener("keydown", this._handleKeyboardEvent),
        this.clickDetector && this.clickDetector.removeListeners(),
        this._performanceCleanupCallback && this._performanceCleanupCallback();
    } catch (t) {
      this.handleException(t);
    }
  }
  _doChangeToBackgroundTasks(t) {
    if (!this.session) return;
    if (
      Lu(this.session, {
        maxReplayDuration: this._options.maxReplayDuration,
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
      })
    ) {
      Pu();
      return;
    }
    t && this._createCustomBreadcrumb(t), this.conditionalFlush();
  }
  _doChangeToForegroundTasks(t) {
    if (!this.session) return;
    if (!this.checkAndHandleExpiredSession()) {
      q && Y.log("Document has become active, but session has expired");
      return;
    }
    t && this._createCustomBreadcrumb(t);
  }
  _updateUserActivity(t = Date.now()) {
    this._lastActivity = t;
  }
  _updateSessionActivity(t = Date.now()) {
    this.session && ((this.session.lastActivity = t), this._maybeSaveSession());
  }
  _createCustomBreadcrumb(t) {
    this.addUpdate(() => {
      this.throttledAddEvent({
        type: ee.Custom,
        timestamp: t.timestamp || 0,
        data: { tag: "breadcrumb", payload: t },
      });
    });
  }
  _addPerformanceEntries() {
    let t = Pw(this.performanceEntries).concat(this.replayPerformanceEntries);
    if (
      ((this.performanceEntries = []),
      (this.replayPerformanceEntries = []),
      this._requiresManualStart)
    ) {
      let n = this._context.initialTimestamp / 1e3;
      t = t.filter((r) => r.start >= n);
    }
    return Promise.all(zu(this, t));
  }
  _clearContext() {
    this._context.errorIds.clear(),
      this._context.traceIds.clear(),
      (this._context.urls = []);
  }
  _updateInitialTimestampFromEventBuffer() {
    let { session: t, eventBuffer: n } = this;
    if (!t || !n || this._requiresManualStart || t.segmentId) return;
    let r = n.getEarliestTimestamp();
    r &&
      r < this._context.initialTimestamp &&
      (this._context.initialTimestamp = r);
  }
  _popEventContext() {
    let t = {
      initialTimestamp: this._context.initialTimestamp,
      initialUrl: this._context.initialUrl,
      errorIds: Array.from(this._context.errorIds),
      traceIds: Array.from(this._context.traceIds),
      urls: this._context.urls,
    };
    return this._clearContext(), t;
  }
  async _runFlush() {
    let t = this.getSessionId();
    if (!this.session || !this.eventBuffer || !t) {
      q && Y.error("No session or eventBuffer found to flush.");
      return;
    }
    if (
      (await this._addPerformanceEntries(),
      !!this.eventBuffer?.hasEvents &&
        (await KO(this), !!this.eventBuffer && t === this.getSessionId()))
    )
      try {
        this._updateInitialTimestampFromEventBuffer();
        let n = Date.now();
        if (
          n - this._context.initialTimestamp >
          this._options.maxReplayDuration + 3e4
        )
          throw new Fu();
        let r = this._popEventContext(),
          o = this.session.segmentId++;
        this._maybeSaveSession();
        let i = await this.eventBuffer.finish();
        await UT({
          replayId: t,
          recordingData: i,
          segmentId: o,
          eventContext: r,
          session: this.session,
          timestamp: n,
          onError: (s) => this.handleException(s),
        });
      } catch (n) {
        this.handleException(n), this.stop({ reason: "sendError" });
        let r = I();
        if (r) {
          let o;
          n instanceof ua
            ? (o = "ratelimit_backoff")
            : n instanceof Fu
              ? (o = "invalid")
              : (o = "send_error"),
            r.recordDroppedEvent(o, "replay");
        }
      }
  }
  async _flush({ force: t = !1 } = {}) {
    if (!this._isEnabled && !t) return;
    if (!this.checkAndHandleExpiredSession()) {
      q && Y.error("Attempting to finish replay event after session expired.");
      return;
    }
    if (!this.session) return;
    let n = this.session.started,
      o = Date.now() - n;
    this._debouncedFlush.cancel();
    let i = o < this._options.minReplayDuration,
      s = o > this._options.maxReplayDuration + 5e3;
    if (i || s) {
      q &&
        Y.log(
          `Session duration (${Math.floor(o / 1e3)}s) is too ${i ? "short" : "long"}, not sending replay.`,
        ),
        i && this._debouncedFlush();
      return;
    }
    let a = this.eventBuffer;
    a &&
      this.session.segmentId === 0 &&
      !a.hasCheckout &&
      q &&
      Y.log("Flushing initial segment without checkout.");
    let c = !!this._flushLock;
    this._flushLock || (this._flushLock = this._runFlush());
    try {
      await this._flushLock;
    } catch (u) {
      this.handleException(u);
    } finally {
      (this._flushLock = void 0), c && this._debouncedFlush();
    }
  }
  _maybeSaveSession() {
    this.session && this._options.stickySession && ju(this.session);
  }
  _onMutationHandler(t) {
    let { ignoreMutations: n } = this._options._experiments;
    if (
      n?.length &&
      t.some((a) => {
        let c = rM(a.target),
          u = n.join(",");
        return c?.matches(u);
      })
    )
      return !1;
    let r = t.length,
      o = this._options.mutationLimit,
      i = this._options.mutationBreadcrumbLimit,
      s = o && r > o;
    if (r > i || s) {
      let a = Bn({
        category: "replay.mutations",
        data: { count: r, limit: s },
      });
      this._createCustomBreadcrumb(a);
    }
    return s
      ? (this.stop({
          reason: "mutationLimit",
          forceFlush: this.recordingMode === "session",
        }),
        !1)
      : !0;
  }
};
function Qs(e, t) {
  return [...e, ...t].join(",");
}
function lM({ mask: e, unmask: t, block: n, unblock: r, ignore: o }) {
  let i = ["base", "iframe[srcdoc]:not([src])"],
    s = Qs(e, [".sentry-mask", "[data-sentry-mask]"]),
    a = Qs(t, []);
  return {
    maskTextSelector: s,
    unmaskTextSelector: a,
    blockSelector: Qs(n, [".sentry-block", "[data-sentry-block]", ...i]),
    unblockSelector: Qs(r, []),
    ignoreSelector: Qs(o, [
      ".sentry-ignore",
      "[data-sentry-ignore]",
      'input[type="file"]',
    ]),
  };
}
function fM({
  el: e,
  key: t,
  maskAttributes: n,
  maskAllText: r,
  privacyOptions: o,
  value: i,
}) {
  if (o.unmaskTextSelector && e.matches(o.unmaskTextSelector)) return i;
  let s = n.includes(t),
    a =
      r &&
      t === "value" &&
      e.tagName === "INPUT" &&
      ["submit", "button"].includes(e.getAttribute("type") || "");
  return s || a ? i.replace(/[\S]/g, "*") : i;
}
var QE =
    'img,image,svg,video,object,picture,embed,map,audio,link[rel="icon"],link[rel="apple-touch-icon"]',
  pM = ["content-length", "content-type", "accept"],
  dM = Symbol.for("sentry__originalRequestBody"),
  ZE = !1,
  eT = !1;
function mM() {
  if (typeof Request > "u" || eT) return;
  let e = Request;
  try {
    let t = function (n, r) {
      let o = new e(n, r);
      return r?.body != null && (o[dM] = r.body), o;
    };
    (t.prototype = e.prototype), (v.Request = t), (eT = !0);
  } catch {}
}
var _M = (e) => new _d(e),
  _d = class {
    constructor({
      flushMinDelay: t = X0,
      flushMaxDelay: n = Q0,
      minReplayDuration: r = ok,
      maxReplayDuration: o = wE,
      stickySession: i = !0,
      useCompression: s = !0,
      workerUrl: a,
      _experiments: c = {},
      maskAllText: u = !0,
      maskAllInputs: f = !0,
      blockAllMedia: l = !0,
      mutationBreadcrumbLimit: d = 750,
      mutationLimit: p = 1e4,
      slowClickTimeout: m = 7e3,
      slowClickIgnoreSelectors: h = [],
      networkDetailAllowUrls: g = [],
      networkDetailDenyUrls: S = [],
      networkCaptureBodies: T = !0,
      networkRequestHeaders: x = [],
      networkResponseHeaders: A = [],
      mask: M = [],
      maskAttributes: P = ["title", "placeholder", "aria-label"],
      unmask: E = [],
      block: k = [],
      unblock: z = [],
      ignore: R = [],
      maskFn: U,
      beforeAddRecordingEvent: w,
      beforeErrorSampling: D,
      onError: G,
      attachRawBodyFromRequest: oe = !1,
    } = {}) {
      this.name = "Replay";
      let ae = lM({ mask: M, unmask: E, block: k, unblock: z, ignore: R });
      if (
        ((this._recordingOptions = {
          maskAllInputs: f,
          maskAllText: u,
          maskInputOptions: { password: !0 },
          maskTextFn: U,
          maskInputFn: U,
          maskAttributeFn: (W, O, j) =>
            fM({
              maskAttributes: P,
              maskAllText: u,
              privacyOptions: ae,
              key: W,
              value: O,
              el: j,
            }),
          ...ae,
          slimDOMOptions: "all",
          inlineStylesheet: !0,
          inlineImages: !1,
          collectFonts: !0,
          errorHandler: (W) => {
            try {
              W.__rrweb__ = !0;
            } catch {}
          },
          recordCrossOriginIframes: !!c.recordCrossOriginIframes,
        }),
        (this._initialOptions = {
          flushMinDelay: t,
          flushMaxDelay: n,
          minReplayDuration: Math.min(r, ik),
          maxReplayDuration: Math.min(o, wE),
          stickySession: i,
          useCompression: s,
          workerUrl: a,
          blockAllMedia: l,
          maskAllInputs: f,
          maskAllText: u,
          mutationBreadcrumbLimit: d,
          mutationLimit: p,
          slowClickTimeout: m,
          slowClickIgnoreSelectors: h,
          networkDetailAllowUrls: g,
          networkDetailDenyUrls: S,
          networkCaptureBodies: T,
          networkRequestHeaders: tT(x),
          networkResponseHeaders: tT(A),
          beforeAddRecordingEvent: w,
          beforeErrorSampling: D,
          onError: G,
          attachRawBodyFromRequest: oe,
          _experiments: c,
        }),
        this._initialOptions.blockAllMedia &&
          ((this._recordingOptions.blockSelector = this._recordingOptions
            .blockSelector
            ? `${this._recordingOptions.blockSelector},${QE}`
            : QE),
          (this._recordingOptions.ignoreCSSAttributes = new Set([
            "background-image",
          ]))),
        this._isInitialized && ot())
      )
        throw new Error(
          "Multiple Sentry Session Replay instances are not supported",
        );
      this._isInitialized = !0;
    }
    get _isInitialized() {
      return ZE;
    }
    set _isInitialized(t) {
      ZE = t;
    }
    afterAllSetup(t) {
      !ot() ||
        this._replay ||
        (this._initialOptions.attachRawBodyFromRequest && mM(),
        this._setup(t),
        this._initialize(t));
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
            reason: "manual",
          })
        : Promise.resolve();
    }
    flush(t) {
      return this._replay
        ? this._replay.isEnabled()
          ? this._replay.sendBufferedReplayOrFlush(t)
          : (this._replay.start(), Promise.resolve())
        : Promise.resolve();
    }
    getReplayId(t) {
      if (this._replay?.isEnabled()) return this._replay.getSessionId(t);
    }
    getRecordingMode() {
      if (this._replay?.isEnabled()) return this._replay.recordingMode;
    }
    processSpan(t) {
      let n = this.getReplayId(!0);
      n &&
        (Lt(t, { "sentry.replay_id": n }),
        this.getRecordingMode() === "buffer" &&
          Lt(t, { "sentry._internal.replay_is_buffering": !0 }));
    }
    _initialize(t) {
      this._replay &&
        (this._maybeLoadFromReplayCanvasIntegration(t),
        this._replay.initializeSampling());
    }
    _setup(t) {
      let n = hM(this._initialOptions, t);
      this._replay = new md({
        options: n,
        recordingOptions: this._recordingOptions,
      });
    }
    _maybeLoadFromReplayCanvasIntegration(t) {
      try {
        let n = t.getIntegrationByName("ReplayCanvas");
        if (!n) return;
        this._replay._canvas = n.getOptions();
      } catch {}
    }
  };
function hM(e, t) {
  let n = t.getOptions(),
    r = { sessionSampleRate: 0, errorSampleRate: 0, ...e },
    o = Mt(n.replaysSessionSampleRate),
    i = Mt(n.replaysOnErrorSampleRate);
  return (
    o == null &&
      i == null &&
      We(() => {
        console.warn(
          "Replay is disabled because neither `replaysSessionSampleRate` nor `replaysOnErrorSampleRate` are set.",
        );
      }),
    o != null && (r.sessionSampleRate = o),
    i != null && (r.errorSampleRate = i),
    r
  );
}
function tT(e) {
  return [...pM, ...e.map((t) => t.toLowerCase())];
}
function gM() {
  return I()?.getIntegrationByName("Replay");
}
var SM = Object.defineProperty,
  EM = (e, t, n) =>
    t in e
      ? SM(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  BT = (e, t, n) => EM(e, typeof t != "symbol" ? t + "" : t, n),
  kd = class {
    constructor() {
      BT(this, "idNodeMap", new Map()), BT(this, "nodeMetaMap", new WeakMap());
    }
    getId(t) {
      return t ? (this.getMeta(t)?.id ?? -1) : -1;
    }
    getNode(t) {
      return this.idNodeMap.get(t) || null;
    }
    getIds() {
      return Array.from(this.idNodeMap.keys());
    }
    getMeta(t) {
      return this.nodeMetaMap.get(t) || null;
    }
    removeNodeFromMap(t) {
      let n = this.getId(t);
      this.idNodeMap.delete(n),
        t.childNodes && t.childNodes.forEach((r) => this.removeNodeFromMap(r));
    }
    has(t) {
      return this.idNodeMap.has(t);
    }
    hasNode(t) {
      return this.nodeMetaMap.has(t);
    }
    add(t, n) {
      let r = n.id;
      this.idNodeMap.set(r, t), this.nodeMetaMap.set(t, n);
    }
    replace(t, n) {
      let r = this.getNode(t);
      if (r) {
        let o = this.nodeMetaMap.get(r);
        o && this.nodeMetaMap.set(n, o);
      }
      this.idNodeMap.set(t, n);
    }
    reset() {
      (this.idNodeMap = new Map()), (this.nodeMetaMap = new WeakMap());
    }
  };
function TM() {
  return new kd();
}
function yM(e, t) {
  for (let n = e.classList.length; n--; ) {
    let r = e.classList[n];
    if (t.test(r)) return !0;
  }
  return !1;
}
function wd(e, t, n = 1 / 0, r = 0) {
  return !e || e.nodeType !== e.ELEMENT_NODE || r > n
    ? -1
    : t(e)
      ? r
      : wd(e.parentNode, t, n, r + 1);
}
function FT(e, t) {
  return (n) => {
    let r = n;
    if (r === null) return !1;
    try {
      if (e) {
        if (typeof e == "string") {
          if (r.matches(`.${e}`)) return !0;
        } else if (yM(r, e)) return !0;
      }
      return !!(t && r.matches(t));
    } catch {
      return !1;
    }
  };
}
var Bi = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`,
  HT = {
    map: {},
    getId() {
      return console.error(Bi), -1;
    },
    getNode() {
      return console.error(Bi), null;
    },
    removeNodeFromMap() {
      console.error(Bi);
    },
    has() {
      return console.error(Bi), !1;
    },
    reset() {
      console.error(Bi);
    },
  };
typeof window < "u" &&
  window.Proxy &&
  window.Reflect &&
  (HT = new Proxy(HT, {
    get(e, t, n) {
      return t === "map" && console.error(Bi), Reflect.get(e, t, n);
    },
  }));
function Md(e, t, n, r, o = window) {
  let i = o.Object.getOwnPropertyDescriptor(e, t);
  return (
    o.Object.defineProperty(
      e,
      t,
      r
        ? n
        : {
            set(s) {
              VT(() => {
                n.set.call(this, s);
              }, 0),
                i && i.set && i.set.call(this, s);
            },
          },
    ),
    () => Md(e, t, i || {}, !0)
  );
}
function Ld(e, t, n) {
  try {
    if (!(t in e)) return () => {};
    let r = e[t],
      o = n(r);
    return (
      typeof o == "function" &&
        ((o.prototype = o.prototype || {}),
        Object.defineProperties(o, {
          __rrweb_original__: { enumerable: !1, value: r },
        })),
      (e[t] = o),
      () => {
        e[t] = r;
      }
    );
  } catch {
    return () => {};
  }
}
Date.now().toString();
function IM(e) {
  if (!e) return null;
  try {
    return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
  } catch {
    return null;
  }
}
function Ju(e, t, n, r, o) {
  if (!e) return !1;
  let i = IM(e);
  if (!i) return !1;
  let s = FT(t, n);
  if (!o) {
    let u = r && i.matches(r);
    return s(i) && !u;
  }
  let a = wd(i, s),
    c = -1;
  return a < 0
    ? !1
    : (r && (c = wd(i, FT(null, r))), a > -1 && c < 0 ? !0 : a < c);
}
var GT = {};
function YT(e) {
  let t = GT[e];
  if (t) return t;
  let n = window.document,
    r = window[e];
  if (n && typeof n.createElement == "function")
    try {
      let o = n.createElement("iframe");
      (o.hidden = !0), n.head.appendChild(o);
      let i = o.contentWindow;
      i && i[e] && (r = i[e]), n.head.removeChild(o);
    } catch {}
  return (GT[e] = r.bind(window));
}
function Ro(...e) {
  return YT("requestAnimationFrame")(...e);
}
function VT(...e) {
  return YT("setTimeout")(...e);
}
var Hi = ((e) => (
    (e[(e["2D"] = 0)] = "2D"),
    (e[(e.WebGL = 1)] = "WebGL"),
    (e[(e.WebGL2 = 2)] = "WebGL2"),
    e
  ))(Hi || {}),
  Vu;
function bM(e) {
  Vu = e;
}
var xd = (e) =>
    Vu
      ? (...n) => {
          try {
            return e(...n);
          } catch (r) {
            if (Vu && Vu(r) === !0) return () => {};
            throw r;
          }
        }
      : e,
  Fi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  AM = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (pa = 0; pa < Fi.length; pa++) AM[Fi.charCodeAt(pa)] = pa;
var pa,
  RM = function (e) {
    var t = new Uint8Array(e),
      n,
      r = t.length,
      o = "";
    for (n = 0; n < r; n += 3)
      (o += Fi[t[n] >> 2]),
        (o += Fi[((t[n] & 3) << 4) | (t[n + 1] >> 4)]),
        (o += Fi[((t[n + 1] & 15) << 2) | (t[n + 2] >> 6)]),
        (o += Fi[t[n + 2] & 63]);
    return (
      r % 3 === 2
        ? (o = o.substring(0, o.length - 1) + "=")
        : r % 3 === 1 && (o = o.substring(0, o.length - 2) + "=="),
      o
    );
  },
  $T = new Map();
function vM(e, t) {
  let n = $T.get(e);
  return (
    n || ((n = new Map()), $T.set(e, n)), n.has(t) || n.set(t, []), n.get(t)
  );
}
var KT = (e, t, n) => {
  if (!e || !(XT(e, t) || typeof e == "object")) return;
  let r = e.constructor.name,
    o = vM(n, r),
    i = o.indexOf(e);
  return i === -1 && ((i = o.length), o.push(e)), i;
};
function Ku(e, t, n) {
  if (e instanceof Array) return e.map((r) => Ku(r, t, n));
  if (e === null) return e;
  if (
    e instanceof Float32Array ||
    e instanceof Float64Array ||
    e instanceof Int32Array ||
    e instanceof Uint32Array ||
    e instanceof Uint8Array ||
    e instanceof Uint16Array ||
    e instanceof Int16Array ||
    e instanceof Int8Array ||
    e instanceof Uint8ClampedArray
  )
    return { rr_type: e.constructor.name, args: [Object.values(e)] };
  if (e instanceof ArrayBuffer) {
    let r = e.constructor.name,
      o = RM(e);
    return { rr_type: r, base64: o };
  } else {
    if (e instanceof DataView)
      return {
        rr_type: e.constructor.name,
        args: [Ku(e.buffer, t, n), e.byteOffset, e.byteLength],
      };
    if (e instanceof HTMLImageElement) {
      let r = e.constructor.name,
        { src: o } = e;
      return { rr_type: r, src: o };
    } else if (e instanceof HTMLCanvasElement) {
      let r = "HTMLImageElement",
        o = e.toDataURL();
      return { rr_type: r, src: o };
    } else {
      if (e instanceof ImageData)
        return {
          rr_type: e.constructor.name,
          args: [Ku(e.data, t, n), e.width, e.height],
        };
      if (XT(e, t) || typeof e == "object") {
        let r = e.constructor.name,
          o = KT(e, t, n);
        return { rr_type: r, index: o };
      }
    }
  }
  return e;
}
var JT = (e, t, n) => e.map((r) => Ku(r, t, n)),
  XT = (e, t) =>
    !![
      "WebGLActiveInfo",
      "WebGLBuffer",
      "WebGLFramebuffer",
      "WebGLProgram",
      "WebGLRenderbuffer",
      "WebGLShader",
      "WebGLShaderPrecisionFormat",
      "WebGLTexture",
      "WebGLUniformLocation",
      "WebGLVertexArrayObject",
      "WebGLVertexArrayObjectOES",
    ]
      .filter((o) => typeof t[o] == "function")
      .find((o) => e instanceof t[o]);
function NM(e, t, n, r, o) {
  let i = [],
    s = Object.getOwnPropertyNames(t.CanvasRenderingContext2D.prototype);
  for (let a of s)
    try {
      if (typeof t.CanvasRenderingContext2D.prototype[a] != "function")
        continue;
      let c = Ld(t.CanvasRenderingContext2D.prototype, a, function (u) {
        return function (...f) {
          return (
            Ju(this.canvas, n, r, o, !0) ||
              VT(() => {
                let l = JT(f, t, this);
                e(this.canvas, { type: Hi["2D"], property: a, args: l });
              }, 0),
            u.apply(this, f)
          );
        };
      });
      i.push(c);
    } catch {
      let c = Md(t.CanvasRenderingContext2D.prototype, a, {
        set(u) {
          e(this.canvas, {
            type: Hi["2D"],
            property: a,
            args: [u],
            setter: !0,
          });
        },
      });
      i.push(c);
    }
  return () => {
    i.forEach((a) => a());
  };
}
function CM(e) {
  return e === "experimental-webgl" ? "webgl" : e;
}
function WT(e, t, n, r, o) {
  let i = [];
  try {
    let s = Ld(e.HTMLCanvasElement.prototype, "getContext", function (a) {
      return function (c, ...u) {
        if (!Ju(this, t, n, r, !0)) {
          let f = CM(c);
          if (
            ("__context" in this || (this.__context = f),
            o && ["webgl", "webgl2"].includes(f))
          )
            if (u[0] && typeof u[0] == "object") {
              let l = u[0];
              l.preserveDrawingBuffer || (l.preserveDrawingBuffer = !0);
            } else u.splice(0, 1, { preserveDrawingBuffer: !0 });
        }
        return a.apply(this, [c, ...u]);
      };
    });
    i.push(s);
  } catch {
    console.error("failed to patch HTMLCanvasElement.prototype.getContext");
  }
  return () => {
    i.forEach((s) => s());
  };
}
function jT(e, t, n, r, o, i, s, a) {
  let c = [],
    u = Object.getOwnPropertyNames(e);
  for (let f of u)
    if (
      ![
        "isContextLost",
        "canvas",
        "drawingBufferWidth",
        "drawingBufferHeight",
      ].includes(f)
    )
      try {
        if (typeof e[f] != "function") continue;
        let l = Ld(e, f, function (d) {
          return function (...p) {
            let m = d.apply(this, p);
            if (
              (KT(m, a, this),
              "tagName" in this.canvas && !Ju(this.canvas, r, o, i, !0))
            ) {
              let h = JT(p, a, this),
                g = { type: t, property: f, args: h };
              n(this.canvas, g);
            }
            return m;
          };
        });
        c.push(l);
      } catch {
        let l = Md(e, f, {
          set(d) {
            n(this.canvas, { type: t, property: f, args: [d], setter: !0 });
          },
        });
        c.push(l);
      }
  return c;
}
function xM(e, t, n, r, o, i) {
  let s = [];
  return (
    s.push(
      ...jT(t.WebGLRenderingContext.prototype, Hi.WebGL, e, n, r, o, i, t),
    ),
    typeof t.WebGL2RenderingContext < "u" &&
      s.push(
        ...jT(t.WebGL2RenderingContext.prototype, Hi.WebGL2, e, n, r, o, i, t),
      ),
    () => {
      s.forEach((a) => a());
    }
  );
}
var kM =
  'for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="undefined"==typeof Uint8Array?[]:new Uint8Array(256),a=0;a<64;a++)t[e.charCodeAt(a)]=a;var n=function(t){var a,n=new Uint8Array(t),r=n.length,s="";for(a=0;a<r;a+=3)s+=e[n[a]>>2],s+=e[(3&n[a])<<4|n[a+1]>>4],s+=e[(15&n[a+1])<<2|n[a+2]>>6],s+=e[63&n[a+2]];return r%3==2?s=s.substring(0,s.length-1)+"=":r%3==1&&(s=s.substring(0,s.length-2)+"=="),s};const r=new Map,s=new Map;const i=self;i.onmessage=async function(e){if(!("OffscreenCanvas"in globalThis))return i.postMessage({id:e.data.id});{const{id:t,bitmap:a,width:o,height:f,maxCanvasSize:c,dataURLOptions:g}=e.data,u=async function(e,t,a){const r=e+"-"+t;if("OffscreenCanvas"in globalThis){if(s.has(r))return s.get(r);const i=new OffscreenCanvas(e,t);i.getContext("2d");const o=await i.convertToBlob(a),f=await o.arrayBuffer(),c=n(f);return s.set(r,c),c}return""}(o,f,g),[h,d]=function(e,t,a){if(!a)return[e,t];const[n,r]=a;if(e<=n&&t<=r)return[e,t];let s=e,i=t;return s>n&&(i=Math.floor(n*t/e),s=n),i>r&&(s=Math.floor(r*e/t),i=r),[s,i]}(o,f,c),l=new OffscreenCanvas(h,d),w=l.getContext("bitmaprenderer"),p=h===o&&d===f?a:await createImageBitmap(a,{resizeWidth:h,resizeHeight:d,resizeQuality:"low"});w?.transferFromImageBitmap(p),a.close();const y=await l.convertToBlob(g),v=y.type,b=await y.arrayBuffer(),m=n(b);if(p.close(),!r.has(t)&&await u===m)return r.set(t,m),i.postMessage({id:t});if(r.get(t)===m)return i.postMessage({id:t});i.postMessage({id:t,type:v,base64:m,width:o,height:f}),r.set(t,m)}};';
function wM() {
  let e = new Blob([kM]);
  return URL.createObjectURL(e);
}
var Od = class {
  constructor(t) {
    (this.pendingCanvasMutations = new Map()),
      (this.rafStamps = { latestId: 0, invokeId: null }),
      (this.shadowDoms = new Set()),
      (this.windowsSet = new WeakSet()),
      (this.windows = []),
      (this.restoreHandlers = []),
      (this.frozen = !1),
      (this.locked = !1),
      (this.snapshotInProgressMap = new Map()),
      (this.worker = null),
      (this.lastSnapshotTime = 0),
      (this.processMutation = (a, c) => {
        ((this.rafStamps.invokeId &&
          this.rafStamps.latestId !== this.rafStamps.invokeId) ||
          !this.rafStamps.invokeId) &&
          (this.rafStamps.invokeId = this.rafStamps.latestId),
          this.pendingCanvasMutations.has(a) ||
            this.pendingCanvasMutations.set(a, []),
          this.pendingCanvasMutations.get(a).push(c);
      });
    let {
      enableManualSnapshot: n,
      sampling: r = "all",
      win: o,
      recordCanvas: i,
      errorHandler: s,
    } = t;
    (t.sampling = r),
      (this.mutationCb = t.mutationCb),
      (this.mirror = t.mirror),
      (this.options = t),
      s && bM(s),
      ((i && typeof r == "number") || n) &&
        (this.worker = this.initFPSWorker()),
      this.addWindow(o),
      !n &&
        xd(() => {
          i &&
            r === "all" &&
            (this.startRAFTimestamping(),
            this.startPendingCanvasMutationFlusher()),
            i && typeof r == "number" && this.initCanvasFPSObserver();
        })();
  }
  reset() {
    this.pendingCanvasMutations.clear(),
      this.restoreHandlers.forEach((t) => {
        try {
          t();
        } catch {}
      }),
      (this.restoreHandlers = []),
      (this.windowsSet = new WeakSet()),
      (this.windows = []),
      (this.shadowDoms = new Set()),
      this.worker?.terminate(),
      (this.worker = null),
      (this.snapshotInProgressMap = new Map());
  }
  freeze() {
    this.frozen = !0;
  }
  unfreeze() {
    this.frozen = !1;
  }
  lock() {
    this.locked = !0;
  }
  unlock() {
    this.locked = !1;
  }
  addWindow(t) {
    let {
      sampling: n = "all",
      blockClass: r,
      blockSelector: o,
      unblockSelector: i,
      recordCanvas: s,
      enableManualSnapshot: a,
    } = this.options;
    if (!this.windowsSet.has(t)) {
      if (a) {
        this.windowsSet.add(t), this.windows.push(new WeakRef(t));
        return;
      }
      xd(() => {
        if (
          (s && n === "all" && this.initCanvasMutationObserver(t, r, o, i),
          s && typeof n == "number")
        ) {
          let c = WT(t, r, o, i, !0);
          this.restoreHandlers.push(() => {
            c();
          });
        }
      })(),
        this.windowsSet.add(t),
        this.windows.push(new WeakRef(t));
    }
  }
  addShadowRoot(t) {
    this.shadowDoms.add(new WeakRef(t));
  }
  resetShadowRoots() {
    this.shadowDoms = new Set();
  }
  snapshot(t, n) {
    if (n?.skipRequestAnimationFrame) {
      this.takeSnapshot(performance.now(), !0, t);
      return;
    }
    Ro((r) => this.takeSnapshot(r, !0, t));
  }
  initFPSWorker() {
    let t = new Worker(wM());
    return (
      (t.onmessage = (n) => {
        let r = n.data,
          { id: o } = r;
        if ((this.snapshotInProgressMap.set(o, !1), !("base64" in r))) return;
        let { base64: i, type: s, width: a, height: c } = r;
        this.mutationCb({
          id: o,
          type: Hi["2D"],
          commands: [
            { property: "clearRect", args: [0, 0, a, c] },
            {
              property: "drawImage",
              args: [
                {
                  rr_type: "ImageBitmap",
                  args: [
                    {
                      rr_type: "Blob",
                      data: [{ rr_type: "ArrayBuffer", base64: i }],
                      type: s,
                    },
                  ],
                },
                0,
                0,
                a,
                c,
              ],
            },
          ],
        });
      }),
      t
    );
  }
  initCanvasFPSObserver() {
    let t;
    if (!this.windows.length && !this.shadowDoms.size) return;
    let n = (r) => {
      this.takeSnapshot(r, !1), (t = Ro(n));
    };
    (t = Ro(n)),
      this.restoreHandlers.push(() => {
        t && cancelAnimationFrame(t);
      });
  }
  initCanvasMutationObserver(t, n, r, o) {
    let i = WT(t, n, r, o, !1),
      s = NM(this.processMutation.bind(this), t, n, r, o),
      a = xM(this.processMutation.bind(this), t, n, r, o, this.mirror);
    this.restoreHandlers.push(() => {
      i(), s(), a();
    });
  }
  getCanvasElements(t, n, r) {
    let o = [],
      i = (s) => {
        s.querySelectorAll("canvas").forEach((a) => {
          Ju(a, t, n, r, !0) || o.push(a);
        });
      };
    for (let s of this.windows) {
      let a = s.deref(),
        c;
      try {
        c = a && a.document;
      } catch {}
      c && i(c);
    }
    for (let s of this.shadowDoms) {
      let a = s.deref();
      a && i(a);
    }
    return o;
  }
  takeSnapshot(t, n, r) {
    let {
        sampling: o,
        blockClass: i,
        blockSelector: s,
        unblockSelector: a,
        dataURLOptions: c,
        maxCanvasSize: u,
      } = this.options,
      l = 1e3 / (o === "all" ? 2 : o || 2);
    return this.lastSnapshotTime && t - this.lastSnapshotTime < l
      ? !1
      : ((this.lastSnapshotTime = t),
        (r ? [r] : this.getCanvasElements(i, s, a)).forEach((m) => {
          let h = this.mirror.getId(m);
          if (
            !(
              !this.mirror.hasNode(m) ||
              !m.width ||
              !m.height ||
              this.snapshotInProgressMap.get(h)
            )
          ) {
            if (
              (this.snapshotInProgressMap.set(h, !0),
              !n && ["webgl", "webgl2"].includes(m.__context))
            ) {
              let g = m.getContext(m.__context);
              g?.getContextAttributes()?.preserveDrawingBuffer === !1 &&
                g.clear(g.COLOR_BUFFER_BIT);
            }
            createImageBitmap(m)
              .then((g) => {
                this.worker?.postMessage(
                  {
                    id: h,
                    bitmap: g,
                    width: m.width,
                    height: m.height,
                    dataURLOptions: c,
                    maxCanvasSize: u,
                  },
                  [g],
                );
              })
              .catch((g) => {
                xd(() => {
                  throw (this.snapshotInProgressMap.delete(h), g);
                })();
              });
          }
        }),
        !0);
  }
  startPendingCanvasMutationFlusher() {
    Ro(() => this.flushPendingCanvasMutations());
  }
  startRAFTimestamping() {
    let t = (n) => {
      (this.rafStamps.latestId = n), Ro(t);
    };
    Ro(t);
  }
  flushPendingCanvasMutations() {
    this.pendingCanvasMutations.forEach((t, n) => {
      let r = this.mirror.getId(n);
      this.flushPendingCanvasMutationFor(n, r);
    }),
      Ro(() => this.flushPendingCanvasMutations());
  }
  flushPendingCanvasMutationFor(t, n) {
    if (this.frozen || this.locked) return;
    let r = this.pendingCanvasMutations.get(t);
    if (!r || n === -1) return;
    let o = r.map((s) => {
        let { type: a, ...c } = s;
        return c;
      }),
      { type: i } = r[0];
    this.mutationCb({ id: n, type: i, commands: o }),
      this.pendingCanvasMutations.delete(t);
  }
};
try {
  if (Array.from([1], (e) => e * 2)[0] !== 2) {
    let e = document.createElement("iframe");
    document.body.appendChild(e),
      (Array.from = e.contentWindow?.Array.from || Array.from),
      document.body.removeChild(e);
  }
} catch (e) {
  console.debug("Unable to override Array.from", e);
}
TM();
var zT;
(function (e) {
  (e[(e.NotStarted = 0)] = "NotStarted"),
    (e[(e.Running = 1)] = "Running"),
    (e[(e.Stopped = 2)] = "Stopped");
})(zT || (zT = {}));
var qT = {
    low: {
      sampling: { canvas: 1 },
      dataURLOptions: { type: "image/webp", quality: 0.25 },
    },
    medium: {
      sampling: { canvas: 2 },
      dataURLOptions: { type: "image/webp", quality: 0.4 },
    },
    high: {
      sampling: { canvas: 4 },
      dataURLOptions: { type: "image/webp", quality: 0.5 },
    },
  },
  OM = "ReplayCanvas",
  Yu = 1280,
  MM = (e = {}) => {
    let [t, n] = e.maxCanvasSize || [],
      r = {
        quality: e.quality || "medium",
        enableManualSnapshot: e.enableManualSnapshot,
        maxCanvasSize: [t ? Math.min(t, Yu) : Yu, n ? Math.min(n, Yu) : Yu],
      },
      o,
      i,
      s = new Promise((a) => (i = a));
    return {
      name: OM,
      getOptions() {
        let { quality: a, enableManualSnapshot: c, maxCanvasSize: u } = r;
        return {
          enableManualSnapshot: c,
          recordCanvas: !0,
          getCanvasManager: (f) => {
            let l = new Od({
              ...f,
              enableManualSnapshot: c,
              maxCanvasSize: u,
              errorHandler: (d) => {
                try {
                  typeof d == "object" && (d.__rrweb__ = !0);
                } catch {}
              },
            });
            return (o = l), i(l), l;
          },
          ...(qT[a] || qT.medium),
        };
      },
      async snapshot(a, c) {
        (o || (await s)).snapshot(a, c);
      },
    };
  },
  LM = MM;
function QT(e) {
  return e.split(",").some((t) => t.trim().startsWith("sentry-"));
}
function Pd(e) {
  try {
    return new URL(e, N.location.origin).href;
  } catch {
    return;
  }
}
function ZT(e) {
  return (
    e.entryType === "resource" &&
    "initiatorType" in e &&
    typeof e.nextHopProtocol == "string" &&
    (e.initiatorType === "fetch" || e.initiatorType === "xmlhttprequest")
  );
}
function Ud(e) {
  try {
    return new Headers(e);
  } catch {
    return;
  }
}
var Xu = {
  traceFetch: !0,
  traceXHR: !0,
  enableHTTPTimings: !0,
  trackFetchStreamPerformance: !1,
};
function Dd(e, t) {
  let {
      traceFetch: n,
      traceXHR: r,
      shouldCreateSpanForRequest: o,
      enableHTTPTimings: i,
      tracePropagationTargets: s,
      onRequestSpanStart: a,
      onRequestSpanEnd: c,
    } = { ...Xu, ...t },
    u = typeof o == "function" ? o : (p) => !0,
    f = (p) => UM(p, s),
    l = {},
    d = e.getOptions().propagateTraceparent;
  n &&
    Ln((p) => {
      let m = Rf(p, u, f, l, { propagateTraceparent: d, onRequestSpanEnd: c });
      if (m) {
        let h = Pd(p.fetchData.url),
          g = h ? jt(h).host : void 0,
          S = h ? it(h) : void 0;
        m.setAttributes({ "http.url": S, "url.full": S, "server.address": g }),
          i && ey(m, e),
          a?.(m, { headers: p.headers });
      }
    }),
    r &&
      Io((p) => {
        let m = DM(p, u, f, l, d, c);
        m &&
          (i && ey(m, e),
          a?.(m, { headers: Ud(p.xhr.__sentry_xhr_v3__?.request_headers) }));
      });
}
var PM = 300;
function ey(e, t) {
  let { url: n } = L(e).data;
  if (!n || typeof n != "string") return;
  let r = () => {
    setTimeout(o);
  };
  if (Pe(t)) {
    let i = e.end.bind(e);
    e.end = (s) => {
      let a = s ?? Z(),
        c = !1,
        u = () => {
          c || ((c = !0), setTimeout(o), i(a), clearTimeout(f));
        };
      r = u;
      let f = setTimeout(u, PM);
    };
  }
  let o = Ct("resource", ({ entries: i }) => {
    i.forEach((s) => {
      ZT(s) && s.name.endsWith(n) && (e.setAttributes(qs(s)), r());
    });
  });
}
function UM(e, t) {
  let n = at();
  if (n) {
    let r, o;
    try {
      (r = new URL(e, n)), (o = new URL(n).origin);
    } catch {
      return !1;
    }
    let i = r.origin === o;
    return t ? He(r.toString(), t) || (i && He(r.pathname, t)) : i;
  } else {
    let r = !!e.match(/^\/(?!\/)/);
    return t ? He(e, t) : r;
  }
}
function DM(e, t, n, r, o, i) {
  let s = e.xhr,
    a = s?.[_t];
  if (!s || s.__sentry_own_request__ || !a) return;
  let { url: c, method: u } = a,
    f = xe() && t(c);
  if (e.endTimestamp) {
    let x = s.__sentry_xhr_span_id__;
    if (!x) return;
    let A = r[x];
    A &&
      (f &&
        a.status_code !== void 0 &&
        (jn(A, a.status_code),
        A.end(),
        i?.(A, { headers: Ud(Ks(s)), error: e.error })),
      delete r[x]);
    return;
  }
  let l = Pd(c),
    d = l ? jt(l) : jt(c),
    p = l ? it(l) : void 0,
    m = it(Xo(c)),
    h = I(),
    S = !!ne() || (!!h && Pe(h)),
    T =
      f && S
        ? Ve({
            name: `${u} ${m}`,
            attributes: {
              url: it(c),
              type: "xhr",
              "http.method": u,
              "http.url": p,
              "url.full": p,
              "server.address": d?.host,
              [$]: "auto.http.browser",
              [J]: "http.client",
              ...(d?.search && { "http.query": d?.search }),
              ...(d?.hash && { "http.fragment": d?.hash }),
            },
          })
        : new It();
  return (
    f && !S && h?.recordDroppedEvent("no_parent_span", "span"),
    (s.__sentry_xhr_span_id__ = T.spanContext().spanId),
    (r[s.__sentry_xhr_span_id__] = T),
    n(c) && BM(s, xe() && S ? T : void 0, o),
    h && h.emit("beforeOutgoingRequestSpan", T, e),
    T
  );
}
function BM(e, t, n) {
  let {
    "sentry-trace": r,
    baggage: o,
    traceparent: i,
  } = Zo({ span: t, propagateTraceparent: n });
  r && FM(e, r, o, i);
}
function FM(e, t, n, r) {
  let o = e.__sentry_xhr_v3__?.request_headers;
  if (!(o?.["sentry-trace"] || !e.setRequestHeader))
    try {
      if (
        (e.setRequestHeader("sentry-trace", t),
        r && !o?.traceparent && e.setRequestHeader("traceparent", r),
        n)
      ) {
        let i = o?.baggage;
        (!i || !QT(i)) && e.setRequestHeader("baggage", n);
      }
    } catch {}
}
var ty = new WeakMap(),
  ny = new WeakMap(),
  HM = 9e4,
  GM = ["text/event-stream", "application/x-ndjson", "application/stream+json"],
  Bd = () => ({
    name: "FetchStreamPerformance",
    setup() {
      $c((e) => {
        if (e.response) {
          let t = ty.get(e.response);
          if (t && e.endTimestamp) {
            t.end(e.endTimestamp);
            let n = ny.get(e.response);
            n && clearTimeout(n);
          }
        }
      }),
        Ln((e) => {
          if (e.endTimestamp && e.response) {
            let t = e.response.headers?.get("content-type") || "";
            if (
              e.response.headers?.get("content-length") ||
              !GM.some((c) => t.startsWith(c))
            )
              return;
            let n = e.fetchData?.url || "",
              r = e.fetchData?.method || "GET",
              o = Cn(n),
              i = n.startsWith("data:") ? it(n) : o ? Jo(o) : n,
              s = Ve({
                name: `${r} ${i}`,
                startTime: e.endTimestamp,
                attributes: {
                  url: it(n),
                  "http.method": r,
                  type: "fetch",
                  [J]: "http.client.stream",
                  [$]: "auto.http.browser.stream",
                },
              });
            ty.set(e.response, s);
            let a = setTimeout(() => {
              s.isRecording() && s.end();
            }, HM);
            ny.set(e.response, a);
          }
        });
    },
  });
var Fd = "WebVitals",
  Hd = (e = {}) => {
    let t = new Set(e.ignore ?? []);
    return {
      name: Fd,
      setup(n) {
        let r = Pe(n),
          { enableStandaloneClsSpans: o, enableStandaloneLcpSpans: i } =
            e._experiments ?? {},
          s = r || t.has("cls") ? void 0 : o || !1,
          a = r || t.has("lcp") ? void 0 : i || !1,
          c = fp({
            recordClsStandaloneSpans: s,
            recordLcpStandaloneSpans: a,
            client: n,
          }),
          u = new WeakSet();
        n.on("afterStartPageLoadSpan", (f) => {
          u.add(f);
        }),
          n.on("spanEnd", (f) => {
            u.delete(f) &&
              (c(),
              hp(f, {
                recordClsOnPageloadSpan: s === !1,
                recordLcpOnPageloadSpan: a === !1,
                spanStreamingEnabled: r,
              }));
          }),
          r
            ? (t.has("lcp") || Ip(n),
              t.has("cls") || bp(n),
              t.has("inp") || Ap())
            : t.has("inp") || Ep();
      },
      afterAllSetup() {
        t.has("inp") || Tp();
      },
    };
  };
function ry() {
  N.document
    ? N.document.addEventListener("visibilitychange", () => {
        let e = ne();
        if (!e) return;
        let t = ie(e);
        if (N.document.hidden && t) {
          let n = "cancelled",
            { op: r, status: o } = L(t);
          b &&
            _.log(
              `[Tracing] Transaction: ${n} -> since tab moved to the background, op: ${r}`,
            ),
            o || t.setStatus({ code: 2, message: n }),
            t.setAttribute("sentry.cancellation_reason", "document.hidden"),
            t.end();
        }
      })
    : b &&
      _.warn(
        "[Tracing] Could not set up background tab detection due to lack of global document",
      );
}
var $M = 3600,
  oy = "sentry_previous_trace",
  WM = "sentry.previous_trace";
function iy(e, { linkPreviousTrace: t, consistentTraceSampling: n }) {
  let r = t === "session-storage",
    o = r ? qM() : void 0;
  e.on("spanStart", (s) => {
    if (ie(s) !== s) return;
    let a = C().getPropagationContext();
    (o = jM(o, s, a)), r && zM(o);
  });
  let i = !0;
  n &&
    e.on("beforeSampling", (s) => {
      if (!o) return;
      let a = C(),
        c = a.getPropagationContext();
      if (i && c.parentSpanId) {
        i = !1;
        return;
      }
      a.setPropagationContext({
        ...c,
        dsc: {
          ...c.dsc,
          sample_rate: String(o.sampleRate),
          sampled: String(Gd(o.spanContext)),
        },
        sampleRand: o.sampleRand,
      }),
        (s.parentSampled = Gd(o.spanContext)),
        (s.parentSampleRate = o.sampleRate),
        (s.spanAttributes = { ...s.spanAttributes, [Do]: o.sampleRate });
    });
}
function jM(e, t, n) {
  let r = L(t);
  function o() {
    try {
      let a = Number(r.data?.[$n] ?? n.dsc?.sample_rate);
      return Number.isNaN(a) ? 0 : a;
    } catch {
      return 0;
    }
  }
  let i = {
    spanContext: t.spanContext(),
    startTimestamp: r.start_timestamp,
    sampleRate: o(),
    sampleRand: n.sampleRand,
  };
  if (!e) return i;
  let s = e.spanContext;
  return s.traceId === r.trace_id
    ? e
    : (Date.now() / 1e3 - e.startTimestamp <= $M &&
        (b &&
          _.log(
            `Adding previous_trace \`${JSON.stringify(s)}\` link to span \`${JSON.stringify({ op: r.op, ...t.spanContext() })}\``,
          ),
        t.addLink({ context: s, attributes: { [$a]: "previous_trace" } }),
        t.setAttribute(WM, `${s.traceId}-${s.spanId}-${Gd(s) ? 1 : 0}`)),
      i);
}
function zM(e) {
  try {
    N.sessionStorage.setItem(oy, JSON.stringify(e));
  } catch (t) {
    b && _.warn("Could not store previous trace in sessionStorage", t);
  }
}
function qM() {
  try {
    let e = N.sessionStorage?.getItem(oy);
    return JSON.parse(e);
  } catch {
    return;
  }
}
function Gd(e) {
  return e.traceFlags === 1;
}
var YM = "BrowserTracing",
  VM =
    /Googlebot|Google-InspectionTool|Storebot-Google|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Facebot|facebookexternalhit|LinkedInBot|Twitterbot|Applebot/i;
function ly() {
  let e = N.navigator;
  return e?.userAgent ? VM.test(e.userAgent) : !1;
}
var KM = {
    ...jo,
    instrumentNavigation: !0,
    instrumentPageLoad: !0,
    markBackgroundSpan: !0,
    enableLongTask: !0,
    enableLongAnimationFrame: !0,
    enableInp: !0,
    ignoreResourceSpans: [],
    ignorePerformanceApiSpans: [],
    detectRedirects: !0,
    linkPreviousTrace: "in-memory",
    consistentTraceSampling: !1,
    enableReportPageLoaded: !1,
    _experiments: {},
    ...Xu,
  },
  JM = (e = {}) => {
    "enableElementTiming" in e &&
      We(() => {
        console.warn(
          "[Sentry] `enableElementTiming` is deprecated and no longer has any effect. Use the standalone `elementTimingIntegration` instead.",
        );
      });
    let t = { name: void 0, source: void 0 },
      n = N.document,
      {
        enableInp: r,
        enableLongTask: o,
        enableLongAnimationFrame: i,
        _experiments: {
          enableInteractions: s,
          enableStandaloneClsSpans: a,
          enableStandaloneLcpSpans: c,
        },
        beforeStartSpan: u,
        idleTimeout: f,
        finalTimeout: l,
        childSpanTimeout: d,
        markBackgroundSpan: p,
        traceFetch: m,
        traceXHR: h,
        trackFetchStreamPerformance: g,
        shouldCreateSpanForRequest: S,
        enableHTTPTimings: T,
        ignoreResourceSpans: x,
        ignorePerformanceApiSpans: A,
        instrumentPageLoad: M,
        instrumentNavigation: P,
        detectRedirects: E,
        linkPreviousTrace: k,
        consistentTraceSampling: z,
        enableReportPageLoaded: R,
        onRequestSpanStart: U,
        onRequestSpanEnd: w,
      } = { ...KM, ...e },
      D = ly(),
      G,
      oe;
    function ae(W, O, j = !0) {
      let B = O.op === "pageload",
        se = O.name,
        ce = u ? u(O) : O,
        ge = ce.attributes || {};
      if ((se !== ce.name && ((ge[Me] = "custom"), (ce.attributes = ge)), !j)) {
        let nn = Tt();
        Ve({ ...ce, startTime: nn }).end(nn);
        return;
      }
      (t.name = ce.name), (t.source = ge[Me]);
      let Ce = rc(ce, {
        idleTimeout: f,
        finalTimeout: l,
        childSpanTimeout: d,
        disableAutoFinish: B,
        beforeSpanEnd: (nn) => {
          _p(nn, {
            ignoreResourceSpans: x,
            ignorePerformanceApiSpans: A,
            spanStreamingEnabled: Pe(W),
          }),
            cy(W, void 0);
          let sr = C(),
            Pr = sr.getPropagationContext();
          sr.setPropagationContext({
            ...Pr,
            traceId: Ce.spanContext().traceId,
            sampled: rt(Ce),
            dsc: Le(nn),
          }),
            B && (oe = void 0);
        },
        trimIdleSpanEndTimestamp: !R,
      });
      B && R && (oe = Ce), cy(W, Ce);
      function Gt() {
        n &&
          ["interactive", "complete"].includes(n.readyState) &&
          (W.emit("idleSpanEnableAutoFinish", Ce),
          n.removeEventListener("readystatechange", Gt));
      }
      B && !R && n && (n.addEventListener("readystatechange", Gt), Gt());
    }
    return {
      name: YM,
      setup(W) {
        if (D) {
          b &&
            _.log(
              "[Tracing] Skipping browserTracingIntegration setup for bot user agent.",
            );
          return;
        }
        if (
          (Ja(),
          i &&
          v.PerformanceObserver &&
          PerformanceObserver.supportedEntryTypes?.includes(
            "long-animation-frame",
          )
            ? dp()
            : o && pp(),
          s && mp(),
          E && n)
        ) {
          let j = () => {
            G = Z();
          };
          addEventListener("click", j, { capture: !0 }),
            addEventListener("keydown", j, { capture: !0, passive: !0 });
        }
        function O() {
          let j = da(W);
          j &&
            !L(j).timestamp &&
            (b &&
              _.log(
                `[Tracing] Finishing current active span with op: ${L(j).op}`,
              ),
            j.setAttribute(Wn, "cancelled"),
            j.end());
        }
        W.on("startNavigationSpan", (j, B) => {
          if (I() !== W) return;
          if (B?.isRedirect) {
            b &&
              _.warn(
                "[Tracing] Detected redirect, navigation span will not be the root span, but a child span.",
              ),
              ae(W, { op: "navigation.redirect", ...j }, !1);
            return;
          }
          (G = void 0),
            O(),
            te().setPropagationContext({
              traceId: Xe(),
              sampleRand: Math.random(),
              propagationSpanId: xe() ? void 0 : tt(),
            });
          let se = C();
          se.setPropagationContext({
            traceId: Xe(),
            sampleRand: Math.random(),
            propagationSpanId: xe() ? void 0 : tt(),
          }),
            se.setSDKProcessingMetadata({ normalizedRequest: void 0 }),
            ae(W, {
              op: "navigation",
              ...j,
              parentSpan: null,
              forceTransaction: !0,
            });
        }),
          W.on("startPageLoadSpan", (j, B = {}) => {
            if (I() !== W) return;
            O();
            let se = B.sentryTrace || sy("sentry-trace") || ay("sentry-trace"),
              ce = B.baggage || sy("baggage") || ay("baggage"),
              ge = es(se, ce),
              Ce = C();
            Ce.setPropagationContext(ge),
              xe() || (Ce.getPropagationContext().propagationSpanId = tt()),
              Ce.setSDKProcessingMetadata({ normalizedRequest: gi() }),
              ae(W, { op: "pageload", ...j });
          }),
          W.on("endPageloadSpan", () => {
            R && oe && (oe.setAttribute(Wn, "reportPageLoaded"), oe.end());
          });
      },
      afterAllSetup(W) {
        if (D) return;
        W.addIntegration &&
          !W.getIntegrationByName?.(Fd) &&
          W.addIntegration(
            Hd({
              ignore: r ? [] : ["inp"],
              _experiments: {
                enableStandaloneClsSpans: a,
                enableStandaloneLcpSpans: c,
              },
            }),
          );
        let O = at();
        if (
          (k !== "off" &&
            iy(W, { linkPreviousTrace: k, consistentTraceSampling: z }),
          N.location)
        ) {
          if (M) {
            let j = le();
            fy(W, {
              name: N.location.pathname,
              startTime: j ? j / 1e3 : void 0,
              attributes: { [Me]: "url", [$]: "auto.pageload.browser" },
            });
          }
          P &&
            or(({ to: j, from: B }) => {
              if (B === void 0 && O?.indexOf(j) !== -1) {
                O = void 0;
                return;
              }
              O = void 0;
              let se = Cn(j),
                ce = da(W),
                ge = ce && E && QM(ce, G);
              py(
                W,
                {
                  name: se?.pathname || N.location.pathname,
                  attributes: { [Me]: "url", [$]: "auto.navigation.browser" },
                },
                { url: j, isRedirect: ge },
              );
            });
        }
        p && ry(),
          s && XM(W, f, l, d, t),
          Dd(W, {
            traceFetch: m,
            traceXHR: h,
            tracePropagationTargets: W.getOptions().tracePropagationTargets,
            shouldCreateSpanForRequest: S,
            enableHTTPTimings: T,
            onRequestSpanStart: U,
            onRequestSpanEnd: w,
          }),
          g && W.addIntegration(Bd());
      },
    };
  };
function fy(e, t, n) {
  e.emit("startPageLoadSpan", t, n), C().setTransactionName(t.name);
  let r = da(e);
  return r && e.emit("afterStartPageLoadSpan", r), r;
}
function py(e, t, n) {
  let { url: r, isRedirect: o } = n || {};
  e.emit("beforeStartNavigationSpan", t, { isRedirect: o }),
    e.emit("startNavigationSpan", t, { isRedirect: o });
  let i = C();
  return (
    i.setTransactionName(t.name),
    r &&
      !o &&
      i.setSDKProcessingMetadata({ normalizedRequest: { ...gi(), url: r } }),
    da(e)
  );
}
function sy(e) {
  return (
    N.document?.querySelector(`meta[name=${e}]`)?.getAttribute("content") ||
    void 0
  );
}
function ay(e) {
  return N.performance
    ?.getEntriesByType?.("navigation")[0]
    ?.serverTiming?.find((r) => r.name === e)?.description;
}
function XM(e, t, n, r, o) {
  let i = N.document,
    s,
    a = () => {
      let c = "ui.action.click",
        u = da(e);
      if (u) {
        let f = L(u).op;
        if (["navigation", "pageload"].includes(f)) {
          b &&
            _.warn(
              `[Tracing] Did not create ${c} span because a pageload or navigation span is in progress.`,
            );
          return;
        }
      }
      if (
        (s &&
          (s.setAttribute(Wn, "interactionInterrupted"), s.end(), (s = void 0)),
        !o.name)
      ) {
        b &&
          _.warn(
            `[Tracing] Did not create ${c} transaction because _latestRouteName is missing.`,
          );
        return;
      }
      s = rc(
        { name: o.name, op: c, attributes: { [Me]: o.source || "url" } },
        { idleTimeout: t, finalTimeout: n, childSpanTimeout: r },
      );
    };
  i && addEventListener("click", a, { capture: !0 });
}
var dy = "_sentry_idleSpan";
function da(e) {
  return e[dy];
}
function cy(e, t) {
  de(e, dy, t);
}
var uy = 1.5;
function QM(e, t) {
  let n = L(e),
    r = Tt(),
    o = n.start_timestamp;
  return !(r - o > uy || (t && r - t <= uy));
}
function ZM(e = I()) {
  e?.emit("endPageloadSpan");
}
function eL(e) {
  let t = ne();
  if (t === e) return;
  let n = C();
  (e.end = new Proxy(e.end, {
    apply(r, o, i) {
      return ft(n, t), Reflect.apply(r, o, i);
    },
  })),
    ft(n, e);
}
var tL = () => ({
  name: "SpanStreaming",
  beforeSetup(e) {
    let t = e.getOptions();
    t.traceLifecycle ||
      (b && _.log('[SpanStreaming] setting `traceLifecycle` to "stream"'),
      (t.traceLifecycle = "stream"));
  },
  setup(e) {
    let t = "SpanStreaming integration requires",
      n = "Falling back to static trace lifecycle.",
      r = e.getOptions();
    if (!Pe(e)) {
      (r.traceLifecycle = "static"),
        b && _.warn(`${t} \`traceLifecycle\` to be set to "stream"! ${n}`);
      return;
    }
    let o = r.beforeSendSpan;
    if (o && !Vn(o)) {
      (r.traceLifecycle = "static"),
        b &&
          _.warn(
            `${t} a beforeSendSpan callback using \`withStreamedSpan\`! ${n}`,
          );
      return;
    }
    let i = new Ds(e);
    e.on("afterSpanEnd", (s) => {
      rt(s) && i.add(ic(s, e));
    }),
      e.on("afterSegmentSpanEnd", (s) => {
        let a = s.spanContext().traceId;
        setTimeout(() => {
          i.flush(a);
        }, 500);
      });
  },
});
function Gi(e) {
  return new Promise((t, n) => {
    (e.oncomplete = e.onsuccess = () => t(e.result)),
      (e.onabort = e.onerror = () => n(e.error));
  });
}
function nL(e, t) {
  let n = indexedDB.open(e);
  n.onupgradeneeded = () => n.result.createObjectStore(t);
  let r = Gi(n);
  return (o) => r.then((i) => o(i.transaction(t, "readwrite").objectStore(t)));
}
function $d(e) {
  return Gi(e.getAllKeys());
}
function rL(e, t, n) {
  return e((r) =>
    $d(r).then((o) => {
      if (!(o.length >= n))
        return r.put(t, Math.max(...o, 0) + 1), Gi(r.transaction);
    }),
  );
}
function oL(e, t, n) {
  return e((r) =>
    $d(r).then((o) => {
      if (!(o.length >= n))
        return r.put(t, Math.min(...o, 0) - 1), Gi(r.transaction);
    }),
  );
}
function iL(e) {
  return e((t) =>
    $d(t).then((n) => {
      let r = n[0];
      if (r != null)
        return Gi(t.get(r)).then(
          (o) => (t.delete(r), Gi(t.transaction).then(() => o)),
        );
    }),
  );
}
function sL(e) {
  let t;
  function n() {
    return (
      t == null &&
        (t = nL(e.dbName || "sentry-offline", e.storeName || "queue")),
      t
    );
  }
  return {
    push: async (r) => {
      try {
        let o = Kn(r);
        await rL(n(), o, e.maxQueueSize || 30);
      } catch {}
    },
    unshift: async (r) => {
      try {
        let o = Kn(r);
        await oL(n(), o, e.maxQueueSize || 30);
      } catch {}
    },
    shift: async () => {
      try {
        let r = await iL(n());
        if (r) return Za(r);
      } catch {}
    },
  };
}
function aL(e) {
  return (t) => {
    let n = e({ ...t, createStore: sL });
    return (
      N.addEventListener("online", async (r) => {
        await n.flush();
      }),
      n
    );
  };
}
function cL(e = Js) {
  return aL(pf(e));
}
var my = 1e6,
  uL = "window" in v && v.window === v && typeof importScripts > "u",
  No = String(0),
  jd = uL ? "main" : "worker",
  Qu = N.navigator,
  hy = "",
  gy = "",
  Sy = "",
  Wd = Qu?.userAgent || "",
  Ey = "",
  lL = Qu?.language || Qu?.languages?.[0] || "";
function fL(e) {
  return typeof e == "object" && e !== null && "getHighEntropyValues" in e;
}
var _y = Qu?.userAgentData;
fL(_y) &&
  _y
    .getHighEntropyValues([
      "architecture",
      "model",
      "platform",
      "platformVersion",
      "fullVersionList",
    ])
    .then((e) => {
      if (
        ((hy = e.platform || ""),
        (Sy = e.architecture || ""),
        (Ey = e.model || ""),
        (gy = e.platformVersion || ""),
        e.fullVersionList?.length)
      ) {
        let t = e.fullVersionList[e.fullVersionList.length - 1];
        Wd = `${t.brand} ${t.version}`;
      }
    })
    .catch((e) => {});
function pL(e) {
  return !("thread_metadata" in e);
}
function dL(e) {
  return pL(e) ? gL(e) : e;
}
function mL(e) {
  let t = e.contexts?.trace?.trace_id;
  return (
    typeof t == "string" &&
      t.length !== 32 &&
      b &&
      _.log(`[Profiling] Invalid traceId: ${t} on profiled event`),
    typeof t != "string" ? "" : t
  );
}
function _L(e, t, n, r) {
  if (r.type !== "transaction")
    throw new TypeError(
      "Profiling events may only be attached to transactions, this should never occur.",
    );
  if (n == null)
    throw new TypeError(
      `Cannot construct profiling event envelope without a valid profile. Got ${n} instead.`,
    );
  let o = mL(r),
    i = dL(n),
    s =
      t ||
      (typeof r.start_timestamp == "number"
        ? r.start_timestamp * 1e3
        : Z() * 1e3),
    a = typeof r.timestamp == "number" ? r.timestamp * 1e3 : Z() * 1e3;
  return {
    event_id: e,
    timestamp: new Date(s).toISOString(),
    platform: "javascript",
    version: "1",
    release: r.release || "",
    environment: r.environment || pn,
    runtime: { name: "javascript", version: N.navigator.userAgent },
    os: { name: hy, version: gy, build_number: Wd },
    device: {
      locale: lL,
      model: Ey,
      manufacturer: Wd,
      architecture: Sy,
      is_emulator: !1,
    },
    debug_meta: { images: Ay(n.resources) },
    profile: i,
    transactions: [
      {
        name: r.transaction || "",
        id: r.event_id || me(),
        trace_id: o,
        active_thread_id: No,
        relative_start_ns: "0",
        relative_end_ns: ((a - s) * 1e6).toFixed(0),
      },
    ],
  };
}
function Ty(e, t, n) {
  if (e == null)
    throw new TypeError(
      `Cannot construct profiling event envelope without a valid profile. Got ${e} instead.`,
    );
  let r = hL(e),
    o = t.getOptions(),
    i = t.getSdkMetadata?.()?.sdk;
  return {
    chunk_id: me(),
    client_sdk: {
      name: i?.name ?? "sentry.javascript.browser",
      version: i?.version ?? "0.0.0",
    },
    profiler_id: n || me(),
    platform: "javascript",
    version: "2",
    release: o.release ?? "",
    environment: o.environment ?? "production",
    debug_meta: { images: Ay(e.resources) },
    profile: r,
  };
}
function yy(e) {
  try {
    if (!e || typeof e != "object") return { reason: "chunk is not an object" };
    let t = (r) => typeof r == "string" && /^[a-f0-9]{32}$/.test(r);
    if (!t(e.profiler_id)) return { reason: "missing or invalid profiler_id" };
    if (!t(e.chunk_id)) return { reason: "missing or invalid chunk_id" };
    if (!e.client_sdk) return { reason: "missing client_sdk metadata" };
    let n = e.profile;
    return n
      ? !Array.isArray(n.frames) || !n.frames.length
        ? { reason: "profile has no frames" }
        : !Array.isArray(n.stacks) || !n.stacks.length
          ? { reason: "profile has no stacks" }
          : !Array.isArray(n.samples) || !n.samples.length
            ? { reason: "profile has no samples" }
            : { valid: !0 }
      : { reason: "missing profile data" };
  } catch (t) {
    return { reason: `unknown validation error: ${t}` };
  }
}
function hL(e) {
  let t = [];
  for (let a = 0; a < e.frames.length; a++) {
    let c = e.frames[a];
    c &&
      (t[a] = {
        function: c.name,
        abs_path:
          typeof c.resourceId == "number" ? e.resources[c.resourceId] : void 0,
        lineno: c.line,
        colno: c.column,
      });
  }
  let n = [];
  for (let a = 0; a < e.stacks.length; a++) {
    let c = e.stacks[a];
    if (!c) continue;
    let u = [],
      f = c;
    for (; f; )
      u.push(f.frameId),
        (f = f.parentId === void 0 ? void 0 : e.stacks[f.parentId]);
    n[a] = u;
  }
  let r = le(),
    o =
      typeof performance.timeOrigin == "number"
        ? performance.timeOrigin
        : r || 0,
    i = o - (r || o),
    s = [];
  for (let a = 0; a < e.samples.length; a++) {
    let c = e.samples[a];
    if (!c) continue;
    let u = (o + (c.timestamp - i)) / 1e3;
    s[a] = { stack_id: c.stackId ?? 0, thread_id: No, timestamp: u };
  }
  return {
    frames: t,
    stacks: n,
    samples: s,
    thread_metadata: { [No]: { name: jd } },
  };
}
function Zu(e) {
  return L(e).op === "pageload";
}
function gL(e) {
  let t,
    n = 0,
    r = {
      samples: [],
      stacks: [],
      frames: [],
      thread_metadata: { [No]: { name: jd } },
    },
    o = e.samples[0];
  if (!o) return r;
  let i = o.timestamp,
    s = le(),
    a =
      typeof performance.timeOrigin == "number"
        ? performance.timeOrigin
        : s || 0,
    c = a - (s || a);
  return (
    e.samples.forEach((u, f) => {
      if (u.stackId === void 0) {
        t === void 0 && ((t = n), (r.stacks[t] = []), n++),
          (r.samples[f] = {
            elapsed_since_start_ns: ((u.timestamp + c - i) * my).toFixed(0),
            stack_id: t,
            thread_id: No,
          });
        return;
      }
      let l = e.stacks[u.stackId],
        d = [];
      for (; l; ) {
        d.push(l.frameId);
        let m = e.frames[l.frameId];
        m &&
          r.frames[l.frameId] === void 0 &&
          (r.frames[l.frameId] = {
            function: m.name,
            abs_path:
              typeof m.resourceId == "number"
                ? e.resources[m.resourceId]
                : void 0,
            lineno: m.line,
            colno: m.column,
          }),
          (l = l.parentId === void 0 ? void 0 : e.stacks[l.parentId]);
      }
      let p = {
        elapsed_since_start_ns: ((u.timestamp + c - i) * my).toFixed(0),
        stack_id: n,
        thread_id: No,
      };
      (r.stacks[n] = d), (r.samples[f] = p), n++;
    }),
    r
  );
}
function Iy(e, t) {
  if (!t.length) return e;
  for (let n of t) e[1].push([{ type: "profile" }, n]);
  return e;
}
function by(e) {
  let t = [];
  return (
    bt(e, (n, r) => {
      if (r === "transaction")
        for (let o = 1; o < n.length; o++)
          n[o]?.contexts?.profile?.profile_id && t.push(n[o]);
    }),
    t
  );
}
function Ay(e) {
  let r = I()?.getOptions()?.stackParser;
  return r ? Ul(r, e) : [];
}
function Ry(e) {
  return (typeof e != "number" && typeof e != "boolean") ||
    (typeof e == "number" && isNaN(e))
    ? (b &&
        _.warn(
          `[Profiling] Invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(e)} of type ${JSON.stringify(typeof e)}.`,
        ),
      !1)
    : e === !0 || e === !1
      ? !0
      : e < 0 || e > 1
        ? (b &&
            _.warn(
              `[Profiling] Invalid sample rate. Sample rate must be between 0 and 1. Got ${e}.`,
            ),
          !1)
        : !0;
}
function SL(e) {
  return e.samples.length < 2
    ? (b &&
        _.log(
          "[Profiling] Discarding profile because it contains less than 2 samples",
        ),
      !1)
    : e.frames.length
      ? !0
      : (b &&
          _.log("[Profiling] Discarding profile because it contains no frames"),
        !1);
}
var zd = !1,
  qd = 3e4;
function EL(e) {
  return typeof e == "function";
}
function el() {
  let e = N.Profiler;
  if (!EL(e)) {
    b &&
      _.log(
        "[Profiling] Profiling is not supported by this browser, Profiler interface missing on window object.",
      );
    return;
  }
  let t = 10,
    n = Math.floor(qd / t);
  try {
    return new e({ sampleInterval: t, maxBufferSize: n });
  } catch {
    b &&
      (_.log(
        "[Profiling] Failed to initialize the Profiling constructor, this is likely due to a missing 'Document-Policy': 'js-profiling' header.",
      ),
      _.log("[Profiling] Disabling profiling for current user session.")),
      (zd = !0);
  }
}
function Yd(e) {
  if (zd)
    return (
      b &&
        _.log(
          "[Profiling] Profiling has been disabled for the duration of the current user session.",
        ),
      !1
    );
  if (!e.isRecording())
    return (
      b &&
        _.log(
          "[Profiling] Discarding profile because root span was not sampled.",
        ),
      !1
    );
  let n = I()?.getOptions();
  if (!n)
    return b && _.log("[Profiling] Profiling disabled, no options found."), !1;
  let r = n.profilesSampleRate;
  return Ry(r)
    ? r
      ? (r === !0 ? !0 : Math.random() < r)
        ? !0
        : (b &&
            _.log(
              `[Profiling] Discarding profile because it's not included in the random sample (sampling rate = ${Number(r)})`,
            ),
          !1)
      : (b &&
          _.log(
            "[Profiling] Discarding profile because a negative sampling decision was inherited or profileSampleRate is set to 0",
          ),
        !1)
    : (b &&
        _.warn(
          "[Profiling] Discarding profile because of invalid sample rate.",
        ),
      !1);
}
function vy(e) {
  if (zd)
    return (
      b &&
        _.log(
          "[Profiling] Profiling has been disabled for the duration of the current user session as the JS Profiler could not be started.",
        ),
      !1
    );
  if (e.profileLifecycle !== "trace" && e.profileLifecycle !== "manual")
    return (
      b &&
        _.warn(
          "[Profiling] Session not sampled. Invalid `profileLifecycle` option.",
        ),
      !1
    );
  let t = e.profileSessionSampleRate;
  return Ry(t)
    ? t
      ? Math.random() <= t
      : (b &&
          _.log(
            "[Profiling] Discarding profile because profileSessionSampleRate is not defined or set to 0",
          ),
        !1)
    : (b &&
        _.warn(
          "[Profiling] Discarding profile because of invalid profileSessionSampleRate.",
        ),
      !1);
}
function ma(e) {
  return typeof e.profilesSampleRate < "u";
}
function Ny(e, t, n, r) {
  return SL(n) ? _L(e, t, n, r) : null;
}
var vo = new Map();
function Cy() {
  return vo.size;
}
function xy(e) {
  let t = vo.get(e);
  return t && vo.delete(e), t;
}
function ky(e, t) {
  if ((vo.set(e, t), vo.size > 30)) {
    let n = vo.keys().next().value;
    n !== void 0 && vo.delete(n);
  }
}
var tl = new WeakSet();
function Co(e) {
  e.setAttribute("thread.id", No), e.setAttribute("thread.name", jd);
}
function Vd(e) {
  let t;
  Zu(e) && (t = Z() * 1e3);
  let n = el();
  if (!n) return;
  b && _.log(`[Profiling] started profiling span: ${L(e).description}`);
  let r = me(),
    o = null;
  C().setContext("profile", { profile_id: r, start_timestamp: t }),
    tl.add(e),
    Co(e);
  async function i() {
    if (e && n) {
      if (o) {
        b &&
          _.log(
            "[Profiling] profile for:",
            L(e).description,
            "already exists, returning early",
          );
        return;
      }
      return n
        .stop()
        .then((u) => {
          if (
            (s && (N.clearTimeout(s), (s = void 0)),
            b &&
              _.log(
                `[Profiling] stopped profiling of span: ${L(e).description}`,
              ),
            !u)
          ) {
            b &&
              _.log(
                `[Profiling] profiler returned null profile for: ${L(e).description}`,
                "this may indicate an overlapping span or a call to stopProfiling with a profile title that was never started",
              );
            return;
          }
          (o = u), ky(r, u);
        })
        .catch((u) => {
          b && _.log("[Profiling] error while stopping profiler:", u);
        });
    }
  }
  let s = N.setTimeout(() => {
      b &&
        _.log(
          "[Profiling] max profile duration elapsed, stopping profiling for:",
          L(e).description,
        ),
        i();
    }, qd),
    a = e.end.bind(e);
  function c() {
    return e
      ? (i().then(
          () => {
            a();
          },
          () => {
            a();
          },
        ),
        e)
      : a();
  }
  e.end = c;
}
var TL = 6e4,
  yL = 3e5,
  nl = class {
    constructor() {
      (this._client = void 0),
        (this._profiler = void 0),
        (this._chunkTimer = void 0),
        (this._profilerId = void 0),
        (this._isRunning = !1),
        (this._sessionSampled = !1),
        (this._lifecycleMode = void 0),
        (this._activeRootSpanIds = new Set()),
        (this._rootSpanTimeouts = new Map());
    }
    initialize(t) {
      let n = t.getOptions().profileLifecycle,
        r = vy(t.getOptions());
      b && _.log(`[Profiling] Initializing profiler (lifecycle='${n}').`),
        r ||
          (b &&
            _.log(
              "[Profiling] Session not sampled. Skipping lifecycle profiler initialization.",
            )),
        (this._profilerId = me()),
        (this._client = t),
        (this._sessionSampled = r),
        (this._lifecycleMode = n),
        n === "trace" && this._setupTraceLifecycleListeners(t),
        t.on("spanStart", (o) => {
          this._isRunning && Co(o);
        });
    }
    start() {
      if (this._lifecycleMode === "trace") {
        b &&
          _.warn(
            '[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.start()` are ignored in trace mode.',
          );
        return;
      }
      if (this._isRunning) {
        b &&
          _.warn(
            "[Profiling] Profile session is already running, `uiProfiler.start()` is a no-op.",
          );
        return;
      }
      if (!this._sessionSampled) {
        b &&
          _.warn(
            "[Profiling] Session is not sampled, `uiProfiler.start()` is a no-op.",
          );
        return;
      }
      this._beginProfiling();
    }
    stop() {
      if (this._lifecycleMode === "trace") {
        b &&
          _.warn(
            '[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.stop()` are ignored in trace mode.',
          );
        return;
      }
      if (!this._isRunning) {
        b &&
          _.warn(
            "[Profiling] Profiler is not running, `uiProfiler.stop()` is a no-op.",
          );
        return;
      }
      this._endProfiling();
    }
    notifyRootSpanActive(t) {
      if (this._lifecycleMode !== "trace" || !this._sessionSampled) return;
      let n = t.spanContext().spanId;
      if (!n || this._activeRootSpanIds.has(n)) return;
      this._registerTraceRootSpan(n);
      let r = this._activeRootSpanIds.size;
      r === 1 &&
        (b &&
          _.log(
            "[Profiling] Detected already active root span during setup. Active root spans now:",
            r,
          ),
        this._beginProfiling()),
        this._isRunning && Co(t);
    }
    _beginProfiling() {
      if (!this._isRunning) {
        if (
          ((this._isRunning = !0),
          b &&
            _.log(
              "[Profiling] Started profiling with profiler ID:",
              this._profilerId,
            ),
          un().setContext("profile", { profiler_id: this._profilerId }),
          this._startProfilerInstance(),
          !this._profiler)
        ) {
          b && _.log("[Profiling] Failed to start JS Profiler; stopping."),
            this._resetProfilerInfo();
          return;
        }
        this._startPeriodicChunking();
      }
    }
    _endProfiling() {
      this._isRunning &&
        ((this._isRunning = !1),
        this._chunkTimer &&
          (clearTimeout(this._chunkTimer), (this._chunkTimer = void 0)),
        this._clearAllRootSpanTimeouts(),
        this._collectCurrentChunk().catch((t) => {
          b &&
            _.error(
              "[Profiling] Failed to collect current profile chunk on `stop()`:",
              t,
            );
        }),
        this._lifecycleMode === "manual" && un().setContext("profile", {}));
    }
    _setupTraceLifecycleListeners(t) {
      t.on("spanStart", (n) => {
        if (!this._sessionSampled) {
          b &&
            _.log(
              "[Profiling] Span not profiled because of negative sampling decision for user session.",
            );
          return;
        }
        if (n !== ie(n)) return;
        if (!n.isRecording()) {
          b &&
            _.log(
              "[Profiling] Discarding profile because root span was not sampled.",
            );
          return;
        }
        let r = n.spanContext().spanId;
        if (!r || this._activeRootSpanIds.has(r)) return;
        this._registerTraceRootSpan(r);
        let o = this._activeRootSpanIds.size;
        o === 1 &&
          (b &&
            _.log(
              `[Profiling] Root span ${r} started. Profiling active while there are active root spans (count=${o}).`,
            ),
          this._beginProfiling());
      }),
        t.on("spanEnd", (n) => {
          if (!this._sessionSampled) return;
          let r = n.spanContext().spanId;
          if (!r || !this._activeRootSpanIds.has(r)) return;
          this._activeRootSpanIds.delete(r);
          let o = this._activeRootSpanIds.size;
          b &&
            _.log(
              `[Profiling] Root span with ID ${r} ended. Will continue profiling for as long as there are active root spans (currently: ${o}).`,
            ),
            o === 0 &&
              (this._collectCurrentChunk().catch((i) => {
                b &&
                  _.error(
                    "[Profiling] Failed to collect current profile chunk on last `spanEnd`:",
                    i,
                  );
              }),
              this._endProfiling());
        });
    }
    _resetProfilerInfo() {
      (this._isRunning = !1), un().setContext("profile", {});
    }
    _clearAllRootSpanTimeouts() {
      this._rootSpanTimeouts.forEach((t) => clearTimeout(t)),
        this._rootSpanTimeouts.clear();
    }
    _registerTraceRootSpan(t) {
      this._activeRootSpanIds.add(t);
      let n = setTimeout(() => this._onRootSpanTimeout(t), yL);
      this._rootSpanTimeouts.set(t, n);
    }
    _startProfilerInstance() {
      if (this._profiler?.stopped === !1) return;
      let t = el();
      if (!t) {
        b && _.log("[Profiling] Failed to start JS Profiler.");
        return;
      }
      this._profiler = t;
    }
    _startPeriodicChunking() {
      this._isRunning &&
        (this._chunkTimer = setTimeout(() => {
          if (
            (this._collectCurrentChunk().catch((t) => {
              b &&
                _.error(
                  "[Profiling] Failed to collect current profile chunk during periodic chunking:",
                  t,
                );
            }),
            this._isRunning)
          ) {
            if ((this._startProfilerInstance(), !this._profiler)) {
              this._resetProfilerInfo();
              return;
            }
            this._startPeriodicChunking();
          }
        }, TL));
    }
    _onRootSpanTimeout(t) {
      this._rootSpanTimeouts.has(t) &&
        (this._rootSpanTimeouts.delete(t),
        this._activeRootSpanIds.has(t) &&
          (b &&
            _.log(
              `[Profiling] Reached 5-minute timeout for root span ${t}. You likely started a manual root span that never called \`.end()\`.`,
            ),
          this._activeRootSpanIds.delete(t),
          this._activeRootSpanIds.size === 0 && this._endProfiling()));
    }
    async _collectCurrentChunk() {
      let t = this._profiler;
      if (((this._profiler = void 0), !!t))
        try {
          let n = await t.stop(),
            r = Ty(n, this._client, this._profilerId),
            o = yy(r);
          if ("reason" in o) {
            b &&
              _.log(
                "[Profiling] Discarding invalid profile chunk (this is probably a bug in the SDK):",
                o.reason,
              );
            return;
          }
          this._sendProfileChunk(r),
            b && _.log("[Profiling] Collected browser profile chunk.");
        } catch (n) {
          b &&
            _.log("[Profiling] Error while stopping JS Profiler for chunk:", n);
        }
    }
    _sendProfileChunk(t) {
      let n = this._client,
        r = dn(n.getSdkMetadata?.()),
        o = n.getDsn(),
        i = n.getOptions().tunnel,
        s = ke(
          {
            event_id: me(),
            sent_at: new Date().toISOString(),
            ...(r && { sdk: r }),
            ...(!!i && o && { dsn: Ge(o) }),
          },
          [[{ type: "profile_chunk", platform: "javascript" }, t]],
        );
      n.sendEnvelope(s).then(null, (a) => {
        b && _.error("Error while sending profile chunk envelope:", a);
      });
    }
  };
var IL = "BrowserProfiling",
  bL = () => ({
    name: IL,
    setup(e) {
      let t = e.getOptions(),
        n = new nl();
      if (
        (!ma(t) && !t.profileLifecycle && (t.profileLifecycle = "manual"),
        ma(t) && !t.profilesSampleRate)
      ) {
        b &&
          _.log("[Profiling] Profiling disabled, no profiling options found.");
        return;
      }
      let r = ne(),
        o = r && ie(r);
      if (
        (ma(t) &&
          t.profileSessionSampleRate !== void 0 &&
          b &&
          _.warn(
            "[Profiling] Both legacy profiling (`profilesSampleRate`) and UI profiling settings are defined. `profileSessionSampleRate` has no effect when legacy profiling is enabled.",
          ),
        ma(t))
      )
        o && Zu(o) && Yd(o) && Vd(o),
          e.on("spanStart", (i) => {
            let s = ie(i);
            i === s ? Yd(i) && Vd(i) : tl.has(s) && Co(i);
          }),
          e.on("beforeEnvelope", (i) => {
            if (!Cy()) return;
            let s = by(i);
            if (!s.length) return;
            let a = [];
            for (let c of s) {
              let u = c?.contexts,
                f = u?.profile?.profile_id,
                l = u?.profile?.start_timestamp;
              if (typeof f != "string") {
                b &&
                  _.log(
                    "[Profiling] cannot find profile for a span without a profile context",
                  );
                continue;
              }
              if (!f) {
                b &&
                  _.log(
                    "[Profiling] cannot find profile for a span without a profile context",
                  );
                continue;
              }
              u?.profile && delete u.profile;
              let d = xy(f);
              if (!d) {
                b &&
                  _.log(
                    `[Profiling] Could not retrieve profile for span: ${f}`,
                  );
                continue;
              }
              let p = Ny(f, l, d, c);
              p && a.push(p);
            }
            Iy(i, a);
          });
      else {
        let i = t.profileLifecycle;
        if (
          (e.on("startUIProfiler", () => n.start()),
          e.on("stopUIProfiler", () => n.stop()),
          i === "manual")
        )
          n.initialize(e);
        else if (i === "trace") {
          if (!xe(t)) {
            b &&
              _.warn(
                "[Profiling] `profileLifecycle` is 'trace' but tracing is disabled. Set a `tracesSampleRate` or `tracesSampler` to enable span tracing.",
              );
            return;
          }
          n.initialize(e),
            o && n.notifyRootSpanActive(o),
            N.setTimeout(() => {
              let s = ne(),
                a = s && ie(s);
              a && n.notifyRootSpanActive(a);
            }, 0);
        }
      }
    },
  }),
  AL = bL;
var RL = "SpotlightBrowser",
  vL = [{ op: "ui.interaction.click", name: "#sentry-spotlight" }],
  NL = (e = {}) => {
    let t = e.sidecarUrl || "http://localhost:8969/stream";
    return {
      name: RL,
      setup: () => {
        b && _.log("Using Sidecar URL", t);
      },
      beforeSetup(n) {
        let r = n.getOptions();
        r.ignoreSpans = [...(r.ignoreSpans || []), ...vL];
      },
      afterAllSetup: (n) => {
        CL(n, t);
      },
    };
  };
function CL(e, t) {
  let n = Ri("fetch"),
    r = 0;
  e.on("beforeEnvelope", (o) => {
    if (r > 3) {
      _.warn(
        "[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests:",
        r,
      );
      return;
    }
    n(t, {
      method: "POST",
      body: Kn(o),
      headers: { "Content-Type": "application/x-sentry-envelope" },
      mode: "cors",
    }).then(
      (i) => {
        i.status >= 200 && i.status < 400 && (r = 0);
      },
      (i) => {
        r++,
          _.error(
            "Sentry SDK can't connect to Sidecar is it running? See: https://spotlightjs.com/sidecar/npx/",
            i,
          );
      },
    );
  });
}
var xL = NL;
var kL = () => ({
  name: "LaunchDarkly",
  processEvent(e, t, n) {
    return Pt(e);
  },
});
function wL() {
  return {
    name: "sentry-flag-auditor",
    type: "flag-used",
    synchronous: !0,
    method: (e, t, n) => {
      At(e, t.value), Rt(e, t.value);
    },
  };
}
var OL = () => ({
    name: "OpenFeature",
    processEvent(e, t, n) {
      return Pt(e);
    },
  }),
  Kd = class {
    after(t, n) {
      At(n.flagKey, n.value), Rt(n.flagKey, n.value);
    }
    error(t, n, r) {
      At(t.flagKey, t.defaultValue), Rt(t.flagKey, t.defaultValue);
    }
  };
var ML = ({ featureFlagClientClass: e }) => ({
  name: "Unleash",
  setupOnce() {
    let t = e.prototype;
    Ee(t, "isEnabled", LL);
  },
  processEvent(t, n, r) {
    return Pt(t);
  },
});
function LL(e) {
  return function (...t) {
    let n = t[0],
      r = e.apply(this, t);
    return (
      typeof n == "string" && typeof r == "boolean"
        ? (At(n, r), Rt(n, r))
        : b &&
          _.error(
            `[Feature Flags] UnleashClient.isEnabled does not match expected signature. arg0: ${n} (${typeof n}), result: ${r} (${typeof r})`,
          ),
      r
    );
  };
}
var PL = ({ growthbookClass: e }) => bf({ growthbookClass: e });
var UL = ({ featureFlagClient: e }) => ({
  name: "Statsig",
  setup(t) {
    e.on("gate_evaluation", (n) => {
      At(n.gate.name, n.gate.value), Rt(n.gate.name, n.gate.value);
    });
  },
  processEvent(t, n, r) {
    return Pt(t);
  },
});
async function DL() {
  let e = I();
  if (!e) return "no-client-active";
  if (!e.getDsn()) return "no-dsn-configured";
  let r =
    e.getOptions().tunnel ||
    "https://o447951.ingest.sentry.io/api/4509632503087104/envelope/?sentry_version=7&sentry_key=c1dfb07d783ad5325c245c1fd3725390&sentry_client=sentry.javascript.browser%2F1.33.7";
  try {
    await ds(() =>
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
var BL = "WebWorker",
  FL = ({ worker: e }) => ({
    name: BL,
    setupOnce: () => {
      (Array.isArray(e) ? e : [e]).forEach((t) => wy(t));
    },
    addWorker: (t) => wy(t),
  });
function wy(e) {
  e.addEventListener("message", (t) => {
    if ($L(t.data)) {
      if (
        (t.stopImmediatePropagation(),
        t.data._sentryDebugIds &&
          (b && _.log("Sentry debugId web worker message received", t.data),
          (N._sentryDebugIds = {
            ...t.data._sentryDebugIds,
            ...N._sentryDebugIds,
          })),
        t.data._sentryModuleMetadata &&
          (b &&
            _.log("Sentry module metadata web worker message received", t.data),
          (N._sentryModuleMetadata = {
            ...t.data._sentryModuleMetadata,
            ...N._sentryModuleMetadata,
          })),
        t.data._sentryWasmImages)
      ) {
        b && _.log("Sentry WASM images web worker message received", t.data);
        let n = N._sentryWasmImages || [],
          r = t.data._sentryWasmImages.filter(
            (o) =>
              ve(o) &&
              typeof o.code_file == "string" &&
              !n.some((i) => i.code_file === o.code_file),
          );
        N._sentryWasmImages = [...n, ...r];
      }
      t.data._sentryWorkerError &&
        (b &&
          _.log(
            "Sentry worker rejection message received",
            t.data._sentryWorkerError,
          ),
        HL(t.data._sentryWorkerError));
    }
  });
}
function HL(e) {
  let t = I();
  if (!t) return;
  let n = t.getOptions().stackParser,
    r = t.getOptions().attachStacktrace,
    o = e.reason,
    i = Fe(o) ? Up(o) : Si(n, o, void 0, r, !0);
  (i.level = "error"),
    e.filename &&
      (i.contexts = { ...i.contexts, worker: { filename: e.filename } }),
    mn(i, {
      originalException: o,
      mechanism: {
        handled: !1,
        type: "auto.browser.web_worker.onunhandledrejection",
      },
    }),
    b && _.log("Captured worker unhandled rejection", o);
}
function GL({ self: e }) {
  e.postMessage({
    _sentryMessage: !0,
    _sentryDebugIds: e._sentryDebugIds ?? void 0,
    _sentryModuleMetadata: e._sentryModuleMetadata ?? void 0,
  }),
    e.addEventListener("unhandledrejection", (t) => {
      let r = { reason: Pp(t), filename: e.location?.href };
      e.postMessage({ _sentryMessage: !0, _sentryWorkerError: r }),
        b &&
          _.log("[Sentry Worker] Forwarding unhandled rejection to parent", r);
    }),
    b &&
      _.log(
        "[Sentry Worker] Registered worker with unhandled rejection handling",
      );
}
function $L(e) {
  if (!ve(e) || e._sentryMessage !== !0) return !1;
  let t = "_sentryDebugIds" in e,
    n = "_sentryModuleMetadata" in e,
    r = "_sentryWorkerError" in e,
    o = "_sentryWasmImages" in e;
  return !(
    (!t && !n && !r && !o) ||
    (t && !(ve(e._sentryDebugIds) || e._sentryDebugIds === void 0)) ||
    (n &&
      !(ve(e._sentryModuleMetadata) || e._sentryModuleMetadata === void 0)) ||
    (r && !ve(e._sentryWorkerError)) ||
    (o &&
      (!Array.isArray(e._sentryWasmImages) ||
        !e._sentryWasmImages.every(
          (i) => ve(i) && typeof i.code_file == "string",
        )))
  );
}
export {
  Ws as BrowserClient,
  Cs as MULTIPLEXED_TRANSPORT_EXTRA_KEY,
  Kd as OpenFeatureIntegrationHook,
  Ot as SDK_VERSION,
  J as SEMANTIC_ATTRIBUTE_SENTRY_OP,
  $ as SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  $n as SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE,
  Me as SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  pt as Scope,
  N as WINDOW,
  mt as addBreadcrumb,
  ys as addEventProcessor,
  Yo as addIntegration,
  n_ as bindScopeToEmitter,
  kp as breadcrumbsIntegration,
  wp as browserApiErrorsIntegration,
  AL as browserProfilingIntegration,
  Op as browserSessionIntegration,
  JM as browserTracingIntegration,
  wL as buildLaunchDarklyFlagUsedHandler,
  sh as captureConsoleIntegration,
  mn as captureEvent,
  X as captureException,
  ks as captureFeedback,
  gs as captureMessage,
  Zr as captureSession,
  pE as chromeStackLineParser,
  jl as close,
  wh as consoleLoggingIntegration,
  B0 as contextLinesIntegration,
  Nl as continueTrace,
  Oh as createConsolaReporter,
  Ps as createLangChainCallbackHandler,
  pc as createTransport,
  Px as createUserFeedbackEnvelope,
  Mp as cultureContextIntegration,
  yc as dedupeIntegration,
  Xu as defaultRequestInstrumentationOptions,
  mE as defaultStackLineParsers,
  xp as defaultStackParser,
  DL as diagnoseSdkConnectivity,
  cE as elementTimingIntegration,
  Is as endSession,
  Ef as eventFiltersIntegration,
  np as eventFromException,
  rp as eventFromMessage,
  $s as exceptionFromError,
  lh as extraErrorDataIntegration,
  vh as featureFlagsIntegration,
  XN as feedbackAsyncIntegration,
  DS as feedbackIntegration,
  DS as feedbackSyncIntegration,
  Bd as fetchStreamPerformanceIntegration,
  Wl as flush,
  h0 as forceLoad,
  _c as functionToStringIntegration,
  dE as geckoStackLineParser,
  ne as getActiveSpan,
  I as getClient,
  C as getCurrentScope,
  yE as getDefaultIntegrations,
  aN as getFeedback,
  un as getGlobalScope,
  te as getIsolationScope,
  gM as getReplay,
  ie as getRootSpan,
  zn as getSpanDescendants,
  El as getSpanStatusFromHttpCode,
  Zo as getTraceData,
  Lp as globalHandlersIntegration,
  q0 as graphqlClientIntegration,
  PL as growthbookIntegration,
  R0 as httpClientIntegration,
  Dp as httpContextIntegration,
  gc as inboundFiltersIntegration,
  _0 as init,
  Eg as instrumentAnthropicAiClient,
  $g as instrumentCreateReactAgent,
  Rg as instrumentGoogleGenAIClient,
  Xg as instrumentLangChainEmbeddings,
  Wg as instrumentLangGraph,
  ug as instrumentOpenAiClient,
  Dd as instrumentOutgoingRequests,
  If as instrumentSupabaseClient,
  ly as isBotUserAgent,
  Ts as isEnabled,
  zl as isInitialized,
  Es as lastEventId,
  kL as launchDarklyIntegration,
  Zf as lazyLoadIntegration,
  Bp as linkedErrorsIntegration,
  vf as logger,
  cL as makeBrowserOfflineTransport,
  Js as makeFetchTransport,
  Y_ as makeMultiplexedTransport,
  io as metrics,
  oh as moduleMetadataIntegration,
  Fp as normalizeStringifyValue,
  g0 as onLoad,
  OL as openFeatureIntegration,
  wx as opera10StackLineParser,
  Lx as opera11StackLineParser,
  mf as parameterize,
  Ja as registerSpanErrorInstrumentation,
  GL as registerWebWorker,
  LM as replayCanvasIntegration,
  _M as replayIntegration,
  ZM as reportPageLoaded,
  I0 as reportingObserverIntegration,
  hh as rewriteFramesIntegration,
  IS as sendFeedback,
  eL as setActiveSpanInBrowser,
  Ss as setContext,
  $l as setConversationId,
  uf as setCurrentClient,
  Bl as setExtra,
  Dl as setExtras,
  jn as setHttpStatus,
  $o as setMeasurement,
  Hl as setTag,
  Fl as setTags,
  Gl as setUser,
  S0 as showReportDialog,
  tL as spanStreamingIntegration,
  vl as spanToBaggageHeader,
  L as spanToJSON,
  is as spanToTraceHeader,
  xL as spotlightBrowserIntegration,
  py as startBrowserTracingNavigationSpan,
  fy as startBrowserTracingPageLoadSpan,
  Ve as startInactiveSpan,
  nc as startNewTrace,
  qo as startSession,
  ze as startSpan,
  dt as startSpanManual,
  UL as statsigIntegration,
  Th as supabaseIntegration,
  ds as suppressTracing,
  bh as thirdPartyErrorFilterIntegration,
  px as uiProfiler,
  ML as unleashIntegration,
  Al as updateSpanName,
  Y0 as viewHierarchyIntegration,
  Hd as webVitalsIntegration,
  FL as webWorkerIntegration,
  Cx as winjsStackLineParser,
  gr as withActiveSpan,
  Ca as withIsolationScope,
  De as withScope,
  Gm as withStreamedSpan,
  yh as zodErrorsIntegration,
};
