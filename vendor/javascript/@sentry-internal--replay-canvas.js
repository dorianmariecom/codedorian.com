// @sentry-internal/replay-canvas@10.30.0 downloaded from https://ga.jspm.io/npm:@sentry-internal/replay-canvas@10.30.0/build/npm/esm/index.js

import { defineIntegration as t } from "@sentry/core";
var e = Object.defineProperty;
var n = (t, n, r) =>
  n in t
    ? e(t, n, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: r,
      })
    : (t[n] = r);
var r = (t, e, r) => n(t, typeof e !== "symbol" ? e + "" : e, r);
class Mirror {
  constructor() {
    r(this, "idNodeMap", new Map());
    r(this, "nodeMetaMap", new WeakMap());
  }
  getId(t) {
    if (!t) return -1;
    const e = this.getMeta(t)?.id;
    return e ?? -1;
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
    const e = this.getId(t);
    this.idNodeMap.delete(e);
    t.childNodes && t.childNodes.forEach((t) => this.removeNodeFromMap(t));
  }
  has(t) {
    return this.idNodeMap.has(t);
  }
  hasNode(t) {
    return this.nodeMetaMap.has(t);
  }
  add(t, e) {
    const n = e.id;
    this.idNodeMap.set(n, t);
    this.nodeMetaMap.set(t, e);
  }
  replace(t, e) {
    const n = this.getNode(t);
    if (n) {
      const t = this.nodeMetaMap.get(n);
      t && this.nodeMetaMap.set(e, t);
    }
    this.idNodeMap.set(t, e);
  }
  reset() {
    this.idNodeMap = new Map();
    this.nodeMetaMap = new WeakMap();
  }
}
function s() {
  return new Mirror();
}
function a(t, e) {
  for (let n = t.classList.length; n--; ) {
    const r = t.classList[n];
    if (e.test(r)) return true;
  }
  return false;
}
function o(t, e, n = Infinity, r = 0) {
  return t
    ? t.nodeType !== t.ELEMENT_NODE || r > n
      ? -1
      : e(t)
        ? r
        : o(t.parentNode, e, n, r + 1)
    : -1;
}
function i(t, e) {
  return (n) => {
    const r = n;
    if (r === null) return false;
    try {
      if (t)
        if (typeof t === "string") {
          if (r.matches(`.${t}`)) return true;
        } else if (a(r, t)) return true;
      return !(!e || !r.matches(e));
    } catch {
      return false;
    }
  };
}
const c =
  "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
let u = {
  map: {},
  getId() {
    console.error(c);
    return -1;
  },
  getNode() {
    console.error(c);
    return null;
  },
  removeNodeFromMap() {
    console.error(c);
  },
  has() {
    console.error(c);
    return false;
  },
  reset() {
    console.error(c);
  },
};
typeof window !== "undefined" &&
  window.Proxy &&
  window.Reflect &&
  (u = new Proxy(u, {
    get(t, e, n) {
      e === "map" && console.error(c);
      return Reflect.get(t, e, n);
    },
  }));
function h(t, e, n, r, s = window) {
  const a = s.Object.getOwnPropertyDescriptor(t, e);
  s.Object.defineProperty(
    t,
    e,
    r
      ? n
      : {
          set(t) {
            y(() => {
              n.set.call(this, t);
            }, 0);
            a && a.set && a.set.call(this, t);
          },
        },
  );
  return () => h(t, e, a || {}, true);
}
function f(t, e, n) {
  try {
    if (!(e in t)) return () => {};
    const r = t[e];
    const s = n(r);
    if (typeof s === "function") {
      s.prototype = s.prototype || {};
      Object.defineProperties(s, {
        __rrweb_original__: { enumerable: false, value: r },
      });
    }
    t[e] = s;
    return () => {
      t[e] = r;
    };
  } catch {
    return () => {};
  }
}
!/[1-9][0-9]{12}/.test(Date.now().toString());
function p(t) {
  if (!t) return null;
  try {
    const e = t.nodeType === t.ELEMENT_NODE ? t : t.parentElement;
    return e;
  } catch (t) {
    return null;
  }
}
function l(t, e, n, r, s) {
  if (!t) return false;
  const a = p(t);
  if (!a) return false;
  const c = i(e, n);
  if (!s) {
    const t = r && a.matches(r);
    return c(a) && !t;
  }
  const u = o(a, c);
  let h = -1;
  if (u < 0) return false;
  r && (h = o(a, i(null, r)));
  return (u > -1 && h < 0) || u < h;
}
const d = {};
function m(t) {
  const e = d[t];
  if (e) return e;
  const n = window.document;
  let r = window[t];
  if (n && typeof n.createElement === "function")
    try {
      const e = n.createElement("iframe");
      e.hidden = true;
      n.head.appendChild(e);
      const s = e.contentWindow;
      s && s[t] && (r = s[t]);
      n.head.removeChild(e);
    } catch (t) {}
  return (d[t] = r.bind(window));
}
function g(...t) {
  return m("requestAnimationFrame")(...t);
}
function y(...t) {
  return m("setTimeout")(...t);
}
var w = ((t) => {
  t[(t["2D"] = 0)] = "2D";
  t[(t.WebGL = 1)] = "WebGL";
  t[(t.WebGL2 = 2)] = "WebGL2";
  return t;
})(w || {});
let b;
function v(t) {
  b = t;
}
const M = (t) => {
  if (!b) return t;
  const e = (...e) => {
    try {
      return t(...e);
    } catch (t) {
      if (b && b(t) === true) return () => {};
      throw t;
    }
  };
  return e;
};
var C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var S = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (var L = 0; L < C.length; L++) S[C.charCodeAt(L)] = L;
var k = function (t) {
  var e,
    n = new Uint8Array(t),
    r = n.length,
    s = "";
  for (e = 0; e < r; e += 3) {
    s += C[n[e] >> 2];
    s += C[((n[e] & 3) << 4) | (n[e + 1] >> 4)];
    s += C[((n[e + 1] & 15) << 2) | (n[e + 2] >> 6)];
    s += C[n[e + 2] & 63];
  }
  r % 3 === 2
    ? (s = s.substring(0, s.length - 1) + "=")
    : r % 3 === 1 && (s = s.substring(0, s.length - 2) + "==");
  return s;
};
const A = new Map();
function I(t, e) {
  let n = A.get(t);
  if (!n) {
    n = new Map();
    A.set(t, n);
  }
  n.has(e) || n.set(e, []);
  return n.get(e);
}
const W = (t, e, n) => {
  if (!t || !(R(t, e) || typeof t === "object")) return;
  const r = t.constructor.name;
  const s = I(n, r);
  let a = s.indexOf(t);
  if (a === -1) {
    a = s.length;
    s.push(t);
  }
  return a;
};
function O(t, e, n) {
  if (t instanceof Array) return t.map((t) => O(t, e, n));
  if (t === null) return t;
  if (
    t instanceof Float32Array ||
    t instanceof Float64Array ||
    t instanceof Int32Array ||
    t instanceof Uint32Array ||
    t instanceof Uint8Array ||
    t instanceof Uint16Array ||
    t instanceof Int16Array ||
    t instanceof Int8Array ||
    t instanceof Uint8ClampedArray
  ) {
    const e = t.constructor.name;
    return { rr_type: e, args: [Object.values(t)] };
  }
  if (t instanceof ArrayBuffer) {
    const e = t.constructor.name;
    const n = k(t);
    return { rr_type: e, base64: n };
  }
  if (t instanceof DataView) {
    const r = t.constructor.name;
    return {
      rr_type: r,
      args: [O(t.buffer, e, n), t.byteOffset, t.byteLength],
    };
  }
  if (t instanceof HTMLImageElement) {
    const e = t.constructor.name;
    const { src: n } = t;
    return { rr_type: e, src: n };
  }
  if (t instanceof HTMLCanvasElement) {
    const e = "HTMLImageElement";
    const n = t.toDataURL();
    return { rr_type: e, src: n };
  }
  if (t instanceof ImageData) {
    const r = t.constructor.name;
    return { rr_type: r, args: [O(t.data, e, n), t.width, t.height] };
  }
  if (R(t, e) || typeof t === "object") {
    const r = t.constructor.name;
    const s = W(t, e, n);
    return { rr_type: r, index: s };
  }
  return t;
}
const x = (t, e, n) => t.map((t) => O(t, e, n));
const R = (t, e) => {
  const n = [
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
  ];
  const r = n.filter((t) => typeof e[t] === "function");
  return Boolean(r.find((n) => t instanceof e[n]));
};
function E(t, e, n, r, s) {
  const a = [];
  const o = Object.getOwnPropertyNames(e.CanvasRenderingContext2D.prototype);
  for (const i of o)
    try {
      if (typeof e.CanvasRenderingContext2D.prototype[i] !== "function")
        continue;
      const o = f(e.CanvasRenderingContext2D.prototype, i, function (a) {
        return function (...o) {
          l(this.canvas, n, r, s, true) ||
            y(() => {
              const n = x(o, e, this);
              t(this.canvas, { type: w["2D"], property: i, args: n });
            }, 0);
          return a.apply(this, o);
        };
      });
      a.push(o);
    } catch {
      const n = h(e.CanvasRenderingContext2D.prototype, i, {
        set(e) {
          t(this.canvas, {
            type: w["2D"],
            property: i,
            args: [e],
            setter: true,
          });
        },
      });
      a.push(n);
    }
  return () => {
    a.forEach((t) => t());
  };
}
function P(t) {
  return t === "experimental-webgl" ? "webgl" : t;
}
function _(t, e, n, r, s) {
  const a = [];
  try {
    const o = f(t.HTMLCanvasElement.prototype, "getContext", function (t) {
      return function (a, ...o) {
        if (!l(this, e, n, r, true)) {
          const t = P(a);
          "__context" in this || (this.__context = t);
          if (s && ["webgl", "webgl2"].includes(t))
            if (o[0] && typeof o[0] === "object") {
              const t = o[0];
              t.preserveDrawingBuffer || (t.preserveDrawingBuffer = true);
            } else o.splice(0, 1, { preserveDrawingBuffer: true });
        }
        return t.apply(this, [a, ...o]);
      };
    });
    a.push(o);
  } catch {
    console.error("failed to patch HTMLCanvasElement.prototype.getContext");
  }
  return () => {
    a.forEach((t) => t());
  };
}
function N(t, e, n, r, s, a, o, i) {
  const c = [];
  const u = Object.getOwnPropertyNames(t);
  for (const o of u)
    if (
      ![
        "isContextLost",
        "canvas",
        "drawingBufferWidth",
        "drawingBufferHeight",
      ].includes(o)
    )
      try {
        if (typeof t[o] !== "function") continue;
        const u = f(t, o, function (t) {
          return function (...c) {
            const u = t.apply(this, c);
            W(u, i, this);
            if ("tagName" in this.canvas && !l(this.canvas, r, s, a, true)) {
              const t = x(c, i, this);
              const r = { type: e, property: o, args: t };
              n(this.canvas, r);
            }
            return u;
          };
        });
        c.push(u);
      } catch {
        const r = h(t, o, {
          set(t) {
            n(this.canvas, { type: e, property: o, args: [t], setter: true });
          },
        });
        c.push(r);
      }
  return c;
}
function D(t, e, n, r, s, a) {
  const o = [];
  o.push(...N(e.WebGLRenderingContext.prototype, w.WebGL, t, n, r, s, a, e));
  typeof e.WebGL2RenderingContext !== "undefined" &&
    o.push(
      ...N(e.WebGL2RenderingContext.prototype, w.WebGL2, t, n, r, s, a, e),
    );
  return () => {
    o.forEach((t) => t());
  };
}
const F =
  'for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="undefined"==typeof Uint8Array?[]:new Uint8Array(256),a=0;a<64;a++)t[e.charCodeAt(a)]=a;var n=function(t){var a,n=new Uint8Array(t),r=n.length,s="";for(a=0;a<r;a+=3)s+=e[n[a]>>2],s+=e[(3&n[a])<<4|n[a+1]>>4],s+=e[(15&n[a+1])<<2|n[a+2]>>6],s+=e[63&n[a+2]];return r%3==2?s=s.substring(0,s.length-1)+"=":r%3==1&&(s=s.substring(0,s.length-2)+"=="),s};const r=new Map,s=new Map;const i=self;i.onmessage=async function(e){if(!("OffscreenCanvas"in globalThis))return i.postMessage({id:e.data.id});{const{id:t,bitmap:a,width:o,height:f,maxCanvasSize:c,dataURLOptions:g}=e.data,u=async function(e,t,a){const r=e+"-"+t;if("OffscreenCanvas"in globalThis){if(s.has(r))return s.get(r);const i=new OffscreenCanvas(e,t);i.getContext("2d");const o=await i.convertToBlob(a),f=await o.arrayBuffer(),c=n(f);return s.set(r,c),c}return""}(o,f,g),[h,d]=function(e,t,a){if(!a)return[e,t];const[n,r]=a;if(e<=n&&t<=r)return[e,t];let s=e,i=t;return s>n&&(i=Math.floor(n*t/e),s=n),i>r&&(s=Math.floor(r*e/t),i=r),[s,i]}(o,f,c),l=new OffscreenCanvas(h,d),w=l.getContext("bitmaprenderer"),p=h===o&&d===f?a:await createImageBitmap(a,{resizeWidth:h,resizeHeight:d,resizeQuality:"low"});w?.transferFromImageBitmap(p),a.close();const y=await l.convertToBlob(g),v=y.type,b=await y.arrayBuffer(),m=n(b);if(p.close(),!r.has(t)&&await u===m)return r.set(t,m),i.postMessage({id:t});if(r.get(t)===m)return i.postMessage({id:t});i.postMessage({id:t,type:v,base64:m,width:o,height:f}),r.set(t,m)}};';
function B() {
  const t = new Blob([F]);
  return URL.createObjectURL(t);
}
class CanvasManager {
  constructor(t) {
    this.pendingCanvasMutations = new Map();
    this.rafStamps = { latestId: 0, invokeId: null };
    this.shadowDoms = new Set();
    this.windowsSet = new WeakSet();
    this.windows = [];
    this.restoreHandlers = [];
    this.frozen = false;
    this.locked = false;
    this.snapshotInProgressMap = new Map();
    this.worker = null;
    this.lastSnapshotTime = 0;
    this.processMutation = (t, e) => {
      const n =
        this.rafStamps.invokeId &&
        this.rafStamps.latestId !== this.rafStamps.invokeId;
      (!n && this.rafStamps.invokeId) ||
        (this.rafStamps.invokeId = this.rafStamps.latestId);
      this.pendingCanvasMutations.has(t) ||
        this.pendingCanvasMutations.set(t, []);
      this.pendingCanvasMutations.get(t).push(e);
    };
    const {
      enableManualSnapshot: e,
      sampling: n = "all",
      win: r,
      recordCanvas: s,
      errorHandler: a,
    } = t;
    t.sampling = n;
    this.mutationCb = t.mutationCb;
    this.mirror = t.mirror;
    this.options = t;
    a && v(a);
    ((s && typeof n === "number") || e) && (this.worker = this.initFPSWorker());
    this.addWindow(r);
    e ||
      M(() => {
        if (s && n === "all") {
          this.startRAFTimestamping();
          this.startPendingCanvasMutationFlusher();
        }
        s && typeof n === "number" && this.initCanvasFPSObserver();
      })();
  }
  reset() {
    this.pendingCanvasMutations.clear();
    this.restoreHandlers.forEach((t) => {
      try {
        t();
      } catch (t) {}
    });
    this.restoreHandlers = [];
    this.windowsSet = new WeakSet();
    this.windows = [];
    this.shadowDoms = new Set();
    this.worker?.terminate();
    this.worker = null;
    this.snapshotInProgressMap = new Map();
  }
  freeze() {
    this.frozen = true;
  }
  unfreeze() {
    this.frozen = false;
  }
  lock() {
    this.locked = true;
  }
  unlock() {
    this.locked = false;
  }
  addWindow(t) {
    const {
      sampling: e = "all",
      blockClass: n,
      blockSelector: r,
      unblockSelector: s,
      recordCanvas: a,
      enableManualSnapshot: o,
    } = this.options;
    if (!this.windowsSet.has(t))
      if (o) {
        this.windowsSet.add(t);
        this.windows.push(new WeakRef(t));
      } else {
        M(() => {
          a && e === "all" && this.initCanvasMutationObserver(t, n, r, s);
          if (a && typeof e === "number") {
            const e = _(t, n, r, s, true);
            this.restoreHandlers.push(() => {
              e();
            });
          }
        })();
        this.windowsSet.add(t);
        this.windows.push(new WeakRef(t));
      }
  }
  addShadowRoot(t) {
    this.shadowDoms.add(new WeakRef(t));
  }
  resetShadowRoots() {
    this.shadowDoms = new Set();
  }
  snapshot(t, e) {
    e?.skipRequestAnimationFrame
      ? this.takeSnapshot(performance.now(), true, t)
      : g((e) => this.takeSnapshot(e, true, t));
  }
  initFPSWorker() {
    const t = new Worker(B());
    t.onmessage = (t) => {
      const e = t.data;
      const { id: n } = e;
      this.snapshotInProgressMap.set(n, false);
      if (!("base64" in e)) return;
      const { base64: r, type: s, width: a, height: o } = e;
      this.mutationCb({
        id: n,
        type: w["2D"],
        commands: [
          { property: "clearRect", args: [0, 0, a, o] },
          {
            property: "drawImage",
            args: [
              {
                rr_type: "ImageBitmap",
                args: [
                  {
                    rr_type: "Blob",
                    data: [{ rr_type: "ArrayBuffer", base64: r }],
                    type: s,
                  },
                ],
              },
              0,
              0,
              a,
              o,
            ],
          },
        ],
      });
    };
    return t;
  }
  initCanvasFPSObserver() {
    let t;
    if (!this.windows.length && !this.shadowDoms.size) return;
    const e = (n) => {
      this.takeSnapshot(n, false);
      t = g(e);
    };
    t = g(e);
    this.restoreHandlers.push(() => {
      t && cancelAnimationFrame(t);
    });
  }
  initCanvasMutationObserver(t, e, n, r) {
    const s = _(t, e, n, r, false);
    const a = E(this.processMutation.bind(this), t, e, n, r);
    const o = D(this.processMutation.bind(this), t, e, n, r, this.mirror);
    this.restoreHandlers.push(() => {
      s();
      a();
      o();
    });
  }
  getCanvasElements(t, e, n) {
    const r = [];
    const s = (s) => {
      s.querySelectorAll("canvas").forEach((s) => {
        l(s, t, e, n, true) || r.push(s);
      });
    };
    for (const t of this.windows) {
      const e = t.deref();
      let n;
      try {
        n = e && e.document;
      } catch {}
      n && s(n);
    }
    for (const t of this.shadowDoms) {
      const e = t.deref();
      e && s(e);
    }
    return r;
  }
  /**
   * Takes a snapshot of the provided canvas element, or will search all windows/shadow roots for canvases. Will self-throttle based on `options.sampling`.
   *
   * @returns `true` if the snapshot was taken, `false` if it was throttled.
   */ takeSnapshot(t, e, n) {
    const {
      sampling: r,
      blockClass: s,
      blockSelector: a,
      unblockSelector: o,
      dataURLOptions: i,
      maxCanvasSize: c,
    } = this.options;
    const u = r === "all" ? 2 : r || 2;
    const h = 1e3 / u;
    const f = this.lastSnapshotTime && t - this.lastSnapshotTime < h;
    if (f) return false;
    this.lastSnapshotTime = t;
    const p = n ? [n] : this.getCanvasElements(s, a, o);
    p.forEach((t) => {
      const n = this.mirror.getId(t);
      if (
        this.mirror.hasNode(t) &&
        t.width &&
        t.height &&
        !this.snapshotInProgressMap.get(n)
      ) {
        this.snapshotInProgressMap.set(n, true);
        if (!e && ["webgl", "webgl2"].includes(t.__context)) {
          const e = t.getContext(t.__context);
          e?.getContextAttributes()?.preserveDrawingBuffer === false &&
            e.clear(e.COLOR_BUFFER_BIT);
        }
        createImageBitmap(t)
          .then((e) => {
            this.worker?.postMessage(
              {
                id: n,
                bitmap: e,
                width: t.width,
                height: t.height,
                dataURLOptions: i,
                maxCanvasSize: c,
              },
              [e],
            );
          })
          .catch((t) => {
            M(() => {
              this.snapshotInProgressMap.delete(n);
              throw t;
            })();
          });
      }
    });
    return true;
  }
  startPendingCanvasMutationFlusher() {
    g(() => this.flushPendingCanvasMutations());
  }
  startRAFTimestamping() {
    const t = (e) => {
      this.rafStamps.latestId = e;
      g(t);
    };
    g(t);
  }
  flushPendingCanvasMutations() {
    this.pendingCanvasMutations.forEach((t, e) => {
      const n = this.mirror.getId(e);
      this.flushPendingCanvasMutationFor(e, n);
    });
    g(() => this.flushPendingCanvasMutations());
  }
  flushPendingCanvasMutationFor(t, e) {
    if (this.frozen || this.locked) return;
    const n = this.pendingCanvasMutations.get(t);
    if (!n || e === -1) return;
    const r = n.map((t) => {
      const { type: e, ...n } = t;
      return n;
    });
    const { type: s } = n[0];
    this.mutationCb({ id: e, type: s, commands: r });
    this.pendingCanvasMutations.delete(t);
  }
}
try {
  if (Array.from([1], (t) => t * 2)[0] !== 2) {
    const t = document.createElement("iframe");
    document.body.appendChild(t);
    Array.from = t.contentWindow?.Array.from || Array.from;
    document.body.removeChild(t);
  }
} catch (t) {
  console.debug("Unable to override Array.from", t);
}
s();
var T;
!(function (t) {
  (t[(t.NotStarted = 0)] = "NotStarted"),
    (t[(t.Running = 1)] = "Running"),
    (t[(t.Stopped = 2)] = "Stopped");
})(T || (T = {}));
const U = {
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
};
const G = "ReplayCanvas";
const z = 1280;
const H = (t = {}) => {
  const [e, n] = t.maxCanvasSize || [];
  const r = {
    quality: t.quality || "medium",
    enableManualSnapshot: t.enableManualSnapshot,
    maxCanvasSize: [e ? Math.min(e, z) : z, n ? Math.min(n, z) : z],
  };
  let s;
  const a = new Promise((t) => (s = t));
  return {
    name: G,
    getOptions() {
      const { quality: t, enableManualSnapshot: e, maxCanvasSize: n } = r;
      return {
        enableManualSnapshot: e,
        recordCanvas: true,
        getCanvasManager: (t) => {
          const r = new CanvasManager({
            ...t,
            enableManualSnapshot: e,
            maxCanvasSize: n,
            errorHandler: (t) => {
              try {
                typeof t === "object" && (t.__rrweb__ = true);
              } catch {}
            },
          });
          s(r);
          return r;
        },
        ...(U[t] || U.medium),
      };
    },
    async snapshot(t, e) {
      const n = await a;
      n.snapshot(t, e);
    },
  };
};
const j = t(H);
export { j as replayCanvasIntegration };
