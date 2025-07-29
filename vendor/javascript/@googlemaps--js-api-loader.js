// @googlemaps/js-api-loader@1.16.10 downloaded from https://ga.jspm.io/npm:@googlemaps/js-api-loader@1.16.10/dist/index.mjs

function e(e, r, t, i) {
  function s(e) {
    return e instanceof t
      ? e
      : new t(function (r) {
          r(e);
        });
  }
  return new (t || (t = Promise))(function (t, o) {
    function n(e) {
      try {
        l(i.next(e));
      } catch (e) {
        o(e);
      }
    }
    function a(e) {
      try {
        l(i.throw(e));
      } catch (e) {
        o(e);
      }
    }
    function l(e) {
      e.done ? t(e.value) : s(e.value).then(n, a);
    }
    l((i = i.apply(e, r || [])).next());
  });
}
typeof SuppressedError === "function"
  ? SuppressedError
  : function (e, r, t) {
      var i = new Error(t);
      return (i.name = "SuppressedError"), (i.error = e), (i.suppressed = r), i;
    };
function r(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var t;
var i;
function s() {
  if (i) return t;
  i = 1;
  t = function e(r, t) {
    if (r === t) return true;
    if (r && t && typeof r == "object" && typeof t == "object") {
      if (r.constructor !== t.constructor) return false;
      var i, s, o;
      if (Array.isArray(r)) {
        i = r.length;
        if (i != t.length) return false;
        for (s = i; s-- !== 0; ) if (!e(r[s], t[s])) return false;
        return true;
      }
      if (r.constructor === RegExp)
        return r.source === t.source && r.flags === t.flags;
      if (r.valueOf !== Object.prototype.valueOf)
        return r.valueOf() === t.valueOf();
      if (r.toString !== Object.prototype.toString)
        return r.toString() === t.toString();
      o = Object.keys(r);
      i = o.length;
      if (i !== Object.keys(t).length) return false;
      for (s = i; s-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(t, o[s])) return false;
      for (s = i; s-- !== 0; ) {
        var n = o[s];
        if (!e(r[n], t[n])) return false;
      }
      return true;
    }
    return r !== r && t !== t;
  };
  return t;
}
var o = s();
var n = r(o);
const a = "__googleMapsScriptId";
var l;
(function (e) {
  e[(e.INITIALIZED = 0)] = "INITIALIZED";
  e[(e.LOADING = 1)] = "LOADING";
  e[(e.SUCCESS = 2)] = "SUCCESS";
  e[(e.FAILURE = 3)] = "FAILURE";
})(l || (l = {}));
class Loader {
  constructor({
    apiKey: e,
    authReferrerPolicy: r,
    channel: t,
    client: i,
    id: s = a,
    language: o,
    libraries: l = [],
    mapIds: h,
    nonce: c,
    region: u,
    retries: d = 3,
    url: p = "https://maps.googleapis.com/maps/api/js",
    version: g,
  }) {
    this.callbacks = [];
    this.done = false;
    this.loading = false;
    this.errors = [];
    this.apiKey = e;
    this.authReferrerPolicy = r;
    this.channel = t;
    this.client = i;
    this.id = s || a;
    this.language = o;
    this.libraries = l;
    this.mapIds = h;
    this.nonce = c;
    this.region = u;
    this.retries = d;
    this.url = p;
    this.version = g;
    if (Loader.instance) {
      if (!n(this.options, Loader.instance.options))
        throw new Error(
          `Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(Loader.instance.options)}`,
        );
      return Loader.instance;
    }
    Loader.instance = this;
  }
  get options() {
    return {
      version: this.version,
      apiKey: this.apiKey,
      channel: this.channel,
      client: this.client,
      id: this.id,
      libraries: this.libraries,
      language: this.language,
      region: this.region,
      mapIds: this.mapIds,
      nonce: this.nonce,
      url: this.url,
      authReferrerPolicy: this.authReferrerPolicy,
    };
  }
  get status() {
    return this.errors.length
      ? l.FAILURE
      : this.done
        ? l.SUCCESS
        : this.loading
          ? l.LOADING
          : l.INITIALIZED;
  }
  get failed() {
    return this.done && !this.loading && this.errors.length >= this.retries + 1;
  }
  /**
   * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
   *
   * @ignore
   * @deprecated
   */ createUrl() {
    let e = this.url;
    e += "?callback=__googleMapsCallback&loading=async";
    this.apiKey && (e += `&key=${this.apiKey}`);
    this.channel && (e += `&channel=${this.channel}`);
    this.client && (e += `&client=${this.client}`);
    this.libraries.length > 0 &&
      (e += `&libraries=${this.libraries.join(",")}`);
    this.language && (e += `&language=${this.language}`);
    this.region && (e += `&region=${this.region}`);
    this.version && (e += `&v=${this.version}`);
    this.mapIds && (e += `&map_ids=${this.mapIds.join(",")}`);
    this.authReferrerPolicy &&
      (e += `&auth_referrer_policy=${this.authReferrerPolicy}`);
    return e;
  }
  deleteScript() {
    const e = document.getElementById(this.id);
    e && e.remove();
  }
  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   * @deprecated, use importLibrary() instead.
   */ load() {
    return this.loadPromise();
  }
  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   *
   * @ignore
   * @deprecated, use importLibrary() instead.
   */ loadPromise() {
    return new Promise((e, r) => {
      this.loadCallback((t) => {
        t ? r(t.error) : e(window.google);
      });
    });
  }
  importLibrary(e) {
    this.execute();
    return google.maps.importLibrary(e);
  }
  /**
   * Load the Google Maps JavaScript API script with a callback.
   * @deprecated, use importLibrary() instead.
   */ loadCallback(e) {
    this.callbacks.push(e);
    this.execute();
  }
  setScript() {
    var r, t;
    if (document.getElementById(this.id)) {
      this.callback();
      return;
    }
    const i = {
      key: this.apiKey,
      channel: this.channel,
      client: this.client,
      libraries: this.libraries.length && this.libraries,
      v: this.version,
      mapIds: this.mapIds,
      language: this.language,
      region: this.region,
      authReferrerPolicy: this.authReferrerPolicy,
    };
    Object.keys(i).forEach((e) => !i[e] && delete i[e]);
    ((t =
      (r = window === null || window === void 0 ? void 0 : window.google) ===
        null || r === void 0
        ? void 0
        : r.maps) === null || t === void 0
      ? void 0
      : t.importLibrary) ||
      ((r) => {
        let t,
          i,
          s,
          o = "The Google Maps JavaScript API",
          n = "google",
          a = "importLibrary",
          l = "__ib__",
          h = document,
          c = window;
        c = c[n] || (c[n] = {});
        const u = c.maps || (c.maps = {}),
          d = new Set(),
          p = new URLSearchParams(),
          g = () =>
            t ||
            (t = new Promise((a, c) =>
              e(this, void 0, void 0, function* () {
                var e;
                yield (i = h.createElement("script"));
                i.id = this.id;
                p.set("libraries", [...d] + "");
                for (s in r)
                  p.set(
                    s.replace(/[A-Z]/g, (e) => "_" + e[0].toLowerCase()),
                    r[s],
                  );
                p.set("callback", n + ".maps." + l);
                i.src = this.url + "?" + p;
                u[l] = a;
                i.onerror = () => (t = c(Error(o + " could not load.")));
                i.nonce =
                  this.nonce ||
                  ((e = h.querySelector("script[nonce]")) === null ||
                  e === void 0
                    ? void 0
                    : e.nonce) ||
                  "";
                h.head.append(i);
              }),
            ));
        u[a]
          ? console.warn(o + " only loads once. Ignoring:", r)
          : (u[a] = (e, ...r) => d.add(e) && g().then(() => u[a](e, ...r)));
      })(i);
    const s = this.libraries.map((e) => this.importLibrary(e));
    s.length || s.push(this.importLibrary("core"));
    Promise.all(s).then(
      () => this.callback(),
      (e) => {
        const r = new ErrorEvent("error", { error: e });
        this.loadErrorCallback(r);
      },
    );
  }
  reset() {
    this.deleteScript();
    this.done = false;
    this.loading = false;
    this.errors = [];
    this.onerrorEvent = null;
  }
  resetIfRetryingFailed() {
    this.failed && this.reset();
  }
  loadErrorCallback(e) {
    this.errors.push(e);
    if (this.errors.length <= this.retries) {
      const e = this.errors.length * Math.pow(2, this.errors.length);
      console.error(`Failed to load Google Maps script, retrying in ${e} ms.`);
      setTimeout(() => {
        this.deleteScript();
        this.setScript();
      }, e);
    } else {
      this.onerrorEvent = e;
      this.callback();
    }
  }
  callback() {
    this.done = true;
    this.loading = false;
    this.callbacks.forEach((e) => {
      e(this.onerrorEvent);
    });
    this.callbacks = [];
  }
  execute() {
    this.resetIfRetryingFailed();
    if (!this.loading)
      if (this.done) this.callback();
      else {
        if (window.google && window.google.maps && window.google.maps.version) {
          console.warn(
            "Google Maps already loaded outside @googlemaps/js-api-loader. This may result in undesirable behavior as options and script parameters may not match.",
          );
          this.callback();
          return;
        }
        this.loading = true;
        this.setScript();
      }
  }
}
export { a as DEFAULT_ID, Loader, l as LoaderStatus };
